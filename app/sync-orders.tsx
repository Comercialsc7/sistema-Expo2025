import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList, ActivityIndicator, Alert, Modal, Image, ViewStyle, TextStyle, ImageStyle } from 'react-native';
import { useNavigation } from '../hooks/useNavigation';
import { useCachedOrdersStore, CachedOrder } from '../store/useCachedOrdersStore';
import { supabase } from '../lib/supabase';
import { decode } from 'base64-arraybuffer';

const closeIcon = require('../assets/images/x.png');
const backIcon = require('../assets/images/voltar.png');
const lixeiraIcon = require('../assets/images/lixeira.png');

export default function SyncOrdersScreen() {
  const { goBack } = useNavigation();
  const { cachedOrders, clearCachedOrders, getOrderById, _hasHydrated, removeCachedOrder } = useCachedOrdersStore();
  const [isSending, setIsSending] = useState(false);
  const [isReceiving, setIsReceiving] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [selectedOrder, setSelectedOrder] = useState<CachedOrder | null>(null);

  const handleSendData = async () => {
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
  };

  const handleDeleteOrder = (orderId: string) => {
    Alert.alert(
      'Confirmar Exclusão',
      'Tem certeza que deseja excluir este pedido do cache? Esta ação não pode ser desfeita.',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Excluir',
          onPress: () => {
            removeCachedOrder(orderId);
            setSelectedOrder(null); // Fecha o modal após a exclusão
            Alert.alert('Sucesso', 'Pedido removido do cache.');
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleReceiveData = async () => {
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
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const renderCachedOrderItem = ({ item }: { item: CachedOrder }) => (
    <TouchableOpacity 
      style={styles.cachedOrderItem}
      onPress={() => setSelectedOrder(item)}
    >
      <View style={styles.orderHeader}>
        <Text style={styles.cachedOrderId}>Pedido #{item.id}</Text>
        <Text style={styles.cachedOrderDate}>
          {new Date(item.timestamp).toLocaleDateString('pt-BR')}
        </Text>
      </View>
      <Text style={styles.cachedOrderClient}>
        Cliente: {item.client.name} ({item.client.code})
      </Text>
      <View style={styles.orderValues}>
        <Text style={styles.orderValue}>
          Total: {formatCurrency(item.total)}
        </Text>
        {item.discount > 0 && (
          <Text style={styles.orderDiscount}>
            Desconto: {formatCurrency(item.discount)}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderOrderDetails = () => {
    if (!selectedOrder) return null;

    return (
      <Modal
        visible={!!selectedOrder}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedOrder(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Detalhes do Pedido</Text>
              <View style={styles.modalHeaderButtons}>
                <TouchableOpacity 
                  style={styles.deleteButton}
                  onPress={() => selectedOrder && handleDeleteOrder(selectedOrder.id)}
                >
                  <Image source={lixeiraIcon} style={{ width: 24, height: 24 }} />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.closeButton}
                  onPress={() => setSelectedOrder(null)}
                >
                  <Image source={closeIcon} style={{ width: 24, height: 24 }} />
                </TouchableOpacity>
              </View>
            </View>

            <ScrollView style={styles.modalBody}>
              <View style={styles.detailSection}>
                <Text style={styles.sectionTitle}>Informações do Cliente</Text>
                {selectedOrder.sellerCode && (
                  <Text style={styles.detailText}>Vendedor: {selectedOrder.sellerCode}</Text>
                )}
                <Text style={styles.detailText}>Código: {selectedOrder.client.code}</Text>
                <Text style={styles.detailText}>Nome: {selectedOrder.client.name}</Text>
                <Text style={styles.detailText}>CNPJ: {selectedOrder.client.cnpj}</Text>
              </View>

              <View style={styles.detailSection}>
                <Text style={styles.sectionTitle}>Condição de Pagamento</Text>
                <Text style={styles.detailText}>
                  {selectedOrder.paymentTerm.description} ({selectedOrder.paymentTerm.prazo_dias} dias)
                </Text>
              </View>

              <View style={styles.detailSection}>
                <Text style={styles.sectionTitle}>Produtos</Text>
                {selectedOrder.items.map((item, index) => (
                  <View key={index} style={styles.productItem}>
                    <Text style={styles.productName}>{item.name}</Text>
                    <Text style={styles.productDetails}>
                      {item.quantity}x {formatCurrency(item.price)}
                    </Text>
                    <Text style={styles.productTotal}>
                      {formatCurrency(item.price * item.quantity)}
                    </Text>
                  </View>
                ))}
              </View>

              <View style={styles.detailSection}>
                <Text style={styles.sectionTitle}>Valores</Text>
                <View style={styles.valueRow}>
                  <Text style={styles.valueLabel}>Subtotal:</Text>
                  <Text style={styles.valueAmount}>{formatCurrency(selectedOrder.subtotal)}</Text>
                </View>
                {selectedOrder.discount > 0 && (
                  <View style={styles.valueRow}>
                    <Text style={styles.valueLabel}>Desconto:</Text>
                    <Text style={styles.valueAmount}>{formatCurrency(selectedOrder.discount)}</Text>
                  </View>
                )}
                <View style={styles.valueRow}>
                  <Text style={styles.valueLabel}>Total:</Text>
                  <Text style={styles.valueAmount}>{formatCurrency(selectedOrder.total)}</Text>
                </View>
              </View>

              {selectedOrder.spinPrize && (
                <View style={styles.detailSection}>
                  <Text style={styles.sectionTitle}>Prêmio do Giro</Text>
                  <View style={styles.prizeContainer}>
                    <Text style={styles.prizeText}>{selectedOrder.spinPrize.description}</Text>
                  </View>
                  {selectedOrder.spinPrize.photo && (
                    <Image 
                      source={{ uri: selectedOrder.spinPrize.photo }} 
                      style={styles.prizePhoto}
                    />
                  )}
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  const renderSyncStatus = () => {
    if (syncStatus === 'idle') return null;
    
    return (
      <View style={styles.syncStatus}>
        <Text style={[
          styles.syncStatusText,
          { color: syncStatus === 'success' ? '#4CAF50' : '#FF3B30' }
        ]}>
          {syncStatus === 'success' ? 'Sincronização concluída' : 'Falha na sincronização'}
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
        <Text style={styles.headerTitle}>Sincronização de Pedidos</Text>
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
                renderItem={renderCachedOrderItem}
                keyExtractor={(item) => item.id}
                nestedScrollEnabled={true}
              />
            )}
          </View>
        </View>
      </ScrollView>

      {renderOrderDetails()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  } as ViewStyle,
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#003B71',
  } as ViewStyle,
  backButton: {
    paddingRight: 10,
  } as ViewStyle,
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
  } as TextStyle,
  scrollViewContent: {
    padding: 16,
    paddingBottom: 80,
  } as ViewStyle,
  content: {
    flex: 1,
  } as ViewStyle,
  descriptionText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  } as TextStyle,
  syncStatus: {
    alignItems: 'center',
    marginBottom: 20,
  } as ViewStyle,
  syncStatusText: {
    fontSize: 16,
    fontWeight: 'bold',
  } as TextStyle,
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  } as ViewStyle,
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  } as ViewStyle,
  sendButton: {
    backgroundColor: '#4CAF50',
  } as ViewStyle,
  receiveButton: {
    backgroundColor: '#2196F3',
  } as ViewStyle,
  buttonDisabled: {
    opacity: 0.6,
  } as ViewStyle,
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  } as TextStyle,
  cachedOrdersSection: {
    marginTop: 20,
  } as ViewStyle,
  cachedOrdersTitle: {
    fontSize: 18,
    color: '#003B71',
    fontWeight: 'bold',
    marginBottom: 12,
  } as TextStyle,
  noOrdersText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  } as TextStyle,
  cachedOrderItem: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  } as ViewStyle,
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  } as ViewStyle,
  cachedOrderId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#003B71',
  } as TextStyle,
  cachedOrderDate: {
    fontSize: 14,
    color: '#666',
  } as TextStyle,
  cachedOrderClient: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  } as TextStyle,
  orderValues: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    paddingTop: 10,
  } as ViewStyle,
  orderValue: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#4CAF50',
  } as TextStyle,
  orderDiscount: {
    fontSize: 14,
    color: '#FF3B30',
    textDecorationLine: 'line-through',
  } as TextStyle,
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle,
  modalContent: {
    width: '90%',
    maxHeight: '90%',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    overflow: 'hidden',
  } as ViewStyle,
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
    backgroundColor: '#F8F8F8',
  } as ViewStyle,
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#003B71',
  } as TextStyle,
  modalHeaderButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  } as ViewStyle,
  deleteButton: {
    padding: 4,
  } as ViewStyle,
  closeButton: {
    padding: 4,
  } as ViewStyle,
  modalBody: {
    padding: 15,
  } as ViewStyle,
  detailSection: {
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  } as ViewStyle,
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#003B71',
  } as TextStyle,
  detailText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  } as TextStyle,
  productItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  } as ViewStyle,
  productName: {
    fontSize: 14,
    color: '#333',
    flex: 2,
  } as TextStyle,
  productDetails: {
    fontSize: 14,
    color: '#666',
    flex: 1,
    textAlign: 'right',
  } as TextStyle,
  productTotal: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    textAlign: 'right',
  } as TextStyle,
  valueRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  } as ViewStyle,
  valueLabel: {
    fontSize: 15,
    color: '#333',
  } as TextStyle,
  valueAmount: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#003B71',
  } as TextStyle,
  prizeContainer: {
    backgroundColor: '#E0F2F7',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  } as ViewStyle,
  prizeText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#003B71',
  } as TextStyle,
  prizePhoto: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginTop: 10,
    alignSelf: 'center',
  } as ImageStyle,
});