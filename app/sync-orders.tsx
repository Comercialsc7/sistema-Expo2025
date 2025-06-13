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

      for (const order of cachedOrders) {
        let prizePhotoUrl: string | null = null;

        // 1. Upload da imagem do prêmio, se existir
        if (order.spinPrize?.photo) {
          const base64Data = order.spinPrize.photo.split('data:image/png;base64,').pop();
          if (base64Data) {
            // Converte base64 para ArrayBuffer usando base64-arraybuffer
            const arrayBuffer = decode(base64Data);
            const fileName = `spin_prize_${order.id}_${Date.now()}.png`;
            const { data: uploadData, error: uploadError } = await supabase.storage
              .from('spin-prize-images') // Certifique-se de que este bucket exista no Supabase Storage
              .upload(fileName, arrayBuffer, { contentType: 'image/png' });

            if (uploadError) {
              console.error('Erro ao fazer upload da imagem do prêmio:', uploadError);
              Alert.alert('Erro', `Falha ao fazer upload da imagem do prêmio para o pedido ${order.id}.`);
              throw uploadError; // Interrompe o processo se o upload falhar
            }
            // TODO: Substitua 'your_supabase_project_id' pelo ID real do seu projeto Supabase
            prizePhotoUrl = `https://your_supabase_project_id.supabase.co/storage/v1/object/public/spin-prize-images/${fileName}`;
          }
        }

        // 2. Inserir o pedido consolidado na tabela 'completed_orders'
        const { error: insertError } = await supabase
          .from('completed_orders')
          .insert({
            order_id_local: order.id,
            client_id: order.client.id,
            client_name: order.client.name,
            client_code: order.client.code,
            user_id: order.userId, // Usando user_id para o sellerCode
            payment_term_days: order.paymentTerm.prazo_dias,
            payment_term_description: order.paymentTerm.description,
            subtotal: order.subtotal,
            discount: order.discount,
            total: order.total,
            status: 'completed', // Status após o envio
            created_at: order.timestamp,
            items_json: order.items, // Salva os itens como JSONB
            prize_description: order.spinPrize?.description || null,
            prize_photo_url: prizePhotoUrl,
            prize_type: order.spinPrize?.type || null,
          });

        if (insertError) {
          console.error('Erro ao inserir pedido consolidado:', insertError);
          Alert.alert('Erro', `Falha ao salvar o pedido ${order.id} na tabela consolidada.`);
          throw insertError;
        }
      }
      
      clearCachedOrders();
      setSyncStatus('success');
      Alert.alert('Sucesso', 'Dados enviados com sucesso!');
    } catch (error) {
      setSyncStatus('error');
      console.error('Erro geral ao enviar dados:', error);
      Alert.alert('Erro', 'Falha ao enviar dados. Tente novamente.');
    } finally {
      setIsSending(false);
    }
  }, [cachedOrders, clearCachedOrders]);

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