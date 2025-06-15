import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList, ActivityIndicator, Alert, Modal, Image, ViewStyle, TextStyle, ImageStyle } from 'react-native';
import { useNavigation } from '../hooks/useNavigation';
import { useCachedOrdersStore, CachedOrder } from '../store/useCachedOrdersStore';
import { supabase } from '../lib/supabase';
import { decode } from 'base64-arraybuffer';
import { OrderItem } from './components/OrderItem';
import { OrderDetailsModal } from './components/OrderDetailsModal';
import { styles } from './styles/sync-orders.styles';

const closeIcon = require('../assets/images/x.png');
const backIcon = require('../assets/images/voltar.png');
const lixeiraIcon = require('../assets/images/lixeira.png');

export default function SyncOrdersScreen() {
  const { goBack } = useNavigation();
  const { cachedOrders, clearCachedOrders, getOrderById, _hasHydrated, removeCachedOrder } = useCachedOrdersStore();
  const [isSending, setIsSending] = useState(false);
  const [isReceiving, setIsReceiving] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [selectedOrder, _setSelectedOrder] = useState<CachedOrder | null>(null);
  const [isDeleteConfirmModalVisible, setIsDeleteConfirmModalVisible] = useState(false);
  const [orderIdToDelete, setOrderIdToDelete] = useState<string | null>(null);
  const [sentOrders, setSentOrders] = useState<string[]>([]);

  const setSelectedOrder = useCallback((order: CachedOrder | null) => {
    console.log('setSelectedOrder chamado com:', order?.id);
    _setSelectedOrder(order);
  }, []);

  const handleSendData = useCallback(async () => {
    try {
      setIsSending(true);
      setSyncStatus('idle');

      if (cachedOrders.length === 0) {
        Alert.alert('Nenhum pedido', 'Não há pedidos em cache para enviar.');
        setIsSending(false);
        return;
      }

      const sentIds: string[] = [];
      for (const order of cachedOrders) {
        if (sentOrders.includes(order.id)) {
          // Ignora pedidos já enviados
          continue;
        }

        let prizePhotoUrl: string | null = null;

        // 1. Upload da imagem do prêmio, se existir
        if (order.spinPrize?.photo) {
          // Se for uma URI local (file://), converte para Blob
          let blob = null;
          try {
            const response = await fetch(order.spinPrize.photo);
            blob = await response.blob();
          } catch (e) {
            console.error('Erro ao converter foto em Blob:', e);
            Alert.alert('Erro', `Falha ao processar a imagem do prêmio para o pedido ${order.id}.`);
            throw e;
          }
          const fileName = `spin_prize_${order.id}_${Date.now()}.png`;
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('spinprizeimages')
            .upload(fileName, blob, { contentType: 'image/png' });

          if (uploadError) {
            console.error('Erro ao fazer upload da imagem do prêmio:', uploadError);
            Alert.alert('Erro', `Falha ao fazer upload da imagem do prêmio para o pedido ${order.id}.`);
            throw uploadError;
          }
          // Ajuste a URL conforme seu projeto Supabase
          prizePhotoUrl = `https://your_supabase_project_id.supabase.co/storage/v1/object/public/spinprizeimages/${fileName}`;
        }

        // 2. Montar array de produtos
        const produtos = order.items.map(item => ({
          produto_id: item.code,
          produto_nome: item.name,
          quantidade: item.quantity,
          preco_unitario: item.price,
          desconto: item.discount,
          embalagem: item.box,
          acelerador: item.isAccelerator
        }));

        // 3. Inserir o pedido na tabela 'pedidos'
        const { error: insertError } = await supabase
          .from('pedidos')
          .insert({
            pedido_id: order.id,
            vendedor_codigo: order.sellerCode,
            cliente_code: order.client.code,
            cliente_nome: order.client.name,
            email: order.email ? order.email : '',
            produtos: produtos,
            subtotal: order.subtotal,
            desconto: order.discount,
            total: order.total,
            prazo_pagamento: order.paymentTerm?.description || '',
            premio_imagem_url: prizePhotoUrl,
            status_envio: 'pendente',
          });

        if (insertError) {
          console.error('Erro ao inserir pedido:', insertError);
          Alert.alert('Erro', `Falha ao salvar o pedido ${order.id} na tabela de pedidos.`);
          throw insertError;
        }
        sentIds.push(order.id);
      }
      setSentOrders((prev) => [...prev, ...sentIds]);
      setSyncStatus('success');
      Alert.alert('Sucesso', 'Dados enviados com sucesso!');
    } catch (error) {
      setSyncStatus('error');
      console.error('Erro geral ao enviar dados:', error);
      Alert.alert('Erro', 'Falha ao enviar dados. Tente novamente.');
    } finally {
      setIsSending(false);
    }
  }, [cachedOrders, clearCachedOrders, sentOrders]);

  const handleDeleteOrder = useCallback((orderId: string) => {
    console.log('handleDeleteOrder chamado para o pedido:', orderId);
    setOrderIdToDelete(orderId);
    setIsDeleteConfirmModalVisible(true);
  }, []);

  const confirmDeleteOrder = useCallback(() => {
    if (orderIdToDelete) {
      console.log('Confirmando exclusão do pedido:', orderIdToDelete);
      removeCachedOrder(orderIdToDelete);
      setSelectedOrder(null); // Fecha o modal de detalhes após a exclusão
      setIsDeleteConfirmModalVisible(false); // Fecha o modal de confirmação
      Alert.alert('Sucesso', 'Pedido removido do cache.');
    }
  }, [orderIdToDelete, removeCachedOrder, setSelectedOrder]);

  const cancelDeleteOrder = useCallback(() => {
    console.log('Exclusão cancelada.');
    setOrderIdToDelete(null);
    setIsDeleteConfirmModalVisible(false);
  }, []);

  const handleReceiveData = useCallback(async () => {
    try {
      setIsReceiving(true);
      setSyncStatus('idle');
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSyncStatus('success');
      Alert.alert('Sucesso', 'Dados recebidos com sucesso!');
    } catch (error) {
      setSyncStatus('error');
      Alert.alert('Erro', 'Falha ao receber dados. Tente novamente.');
    } finally {
      setIsReceiving(false);
    }
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const renderSyncStatus = () => {
    if (syncStatus === 'idle') return null;
    
    return (
      <View style={styles.syncStatus}>
        <Text style={[
          styles.syncStatusText,
          syncStatus === 'success' ? styles.successText : styles.errorText
        ]}>
          {syncStatus === 'success' ? 'Sincronização concluída!' : 'Erro na sincronização'}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} style={styles.backButton}>
          <Image source={backIcon} style={{ width: 24, height: 24 }} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sincronização</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.content}> 
          <Text style={styles.descriptionText}>Gerencie o envio e recebimento de dados de pedidos.</Text>
          
          {renderSyncStatus()}

          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[
                styles.button, 
                styles.sendButton,
                (isSending || isReceiving) && styles.buttonDisabled
              ]} 
              onPress={handleSendData}
              disabled={isSending || isReceiving}
            >
              {isSending ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Text style={styles.buttonText}>Enviar Dados</Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity 
              style={[
                styles.button, 
                styles.receiveButton,
                (isSending || isReceiving) && styles.buttonDisabled
              ]} 
              onPress={handleReceiveData}
              disabled={isSending || isReceiving}
            >
              {isReceiving ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Text style={styles.buttonText}>Receber Dados</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.cachedOrdersSection}>
            <Text style={styles.cachedOrdersTitle}>Pedidos em Cache:</Text>
            {!_hasHydrated ? (
              <ActivityIndicator size="large" color="#003B71" />
            ) : cachedOrders.length === 0 ? (
              <Text style={styles.noOrdersText}>Nenhum pedido em cache no momento.</Text>
            ) : (
              <FlatList
                data={cachedOrders}
                renderItem={({ item }) => (
                  <OrderItem
                    item={item}
                    enviado={sentOrders.includes(item.id)}
                    onPress={setSelectedOrder}
                  />
                )}
                keyExtractor={(item) => item.id}
                nestedScrollEnabled={true}
              />
            )}
          </View>
        </View>
      </ScrollView>

      <OrderDetailsModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onDelete={handleDeleteOrder}
        visible={!!selectedOrder && !isDeleteConfirmModalVisible}
      />

      {/* Custom Delete Confirmation Modal */}
      <Modal
        visible={isDeleteConfirmModalVisible}
        transparent
        animationType="fade"
        onRequestClose={cancelDeleteOrder}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Confirmar Exclusão</Text>
              <TouchableOpacity onPress={cancelDeleteOrder} style={styles.closeButton}>
                <Image source={closeIcon} style={{ width: 24, height: 24 }} />
              </TouchableOpacity>
            </View>
            <View style={styles.modalBody}>
              <Text style={styles.detailText}>
                Tem certeza que deseja excluir este pedido do cache? Esta ação não pode ser desfeita.
              </Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity 
                  style={[styles.button, styles.receiveButton]} 
                  onPress={cancelDeleteOrder}
                >
                  <Text style={styles.buttonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.button, styles.sendButton]} 
                  onPress={confirmDeleteOrder}
                >
                  <Text style={styles.buttonText}>Excluir</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}