import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList, ActivityIndicator, Alert, Modal, Image } from 'react-native';
import { useNavigation } from '../hooks/useNavigation';
import { ArrowLeft, ArrowUp, ArrowDown, CheckCircle, XCircle, Package, Calendar, Gift } from 'lucide-react-native';
import { useCachedOrdersStore, CachedOrder } from '../store/useCachedOrdersStore';

export default function SyncOrdersScreen() {
  const { goBack } = useNavigation();
  const { cachedOrders, clearCachedOrders, getOrderById, _hasHydrated } = useCachedOrdersStore();
  const [isSending, setIsSending] = useState(false);
  const [isReceiving, setIsReceiving] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [selectedOrder, setSelectedOrder] = useState<CachedOrder | null>(null);

  const handleSendData = async () => {
    try {
      setIsSending(true);
      setSyncStatus('idle');
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      clearCachedOrders();
      setSyncStatus('success');
      Alert.alert('Sucesso', 'Dados enviados com sucesso!');
    } catch (error) {
      setSyncStatus('error');
      Alert.alert('Erro', 'Falha ao enviar dados. Tente novamente.');
    } finally {
      setIsSending(false);
    }
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
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setSelectedOrder(null)}
              >
                <XCircle size={24} color="#003B71" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <View style={styles.detailSection}>
                <Text style={styles.sectionTitle}>Informações do Cliente</Text>
                <Text style={styles.detailText}>Código: {selectedOrder.client.code}</Text>
                <Text style={styles.detailText}>Nome: {selectedOrder.client.name}</Text>
                <Text style={styles.detailText}>CNPJ: {selectedOrder.client.cnpj}</Text>
              </View>

              <View style={styles.detailSection}>
                <Text style={styles.sectionTitle}>Condição de Pagamento</Text>
                <Text style={styles.detailText}>
                  {selectedOrder.paymentTerm.description} ({selectedOrder.paymentTerm.days} dias)
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
                    <Gift size={24} color="#003B71" />
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
        {syncStatus === 'success' ? (
          <CheckCircle size={24} color="#4CAF50" />
        ) : (
          <XCircle size={24} color="#FF3B30" />
        )}
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
          <ArrowLeft size={24} color="#003B71" />
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
                  <ArrowUp size={24} color="#FFFFFF" style={styles.buttonIcon} />
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
                  <ArrowDown size={24} color="#FFFFFF" style={styles.buttonIcon} />
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
  },
  header: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    paddingTop: 48,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    color: '#003B71',
    fontWeight: 'bold',
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
  },
  descriptionText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
  },
  syncStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  syncStatusText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '500',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 16,
  },
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  sendButton: {
    backgroundColor: '#4CAF50',
  },
  receiveButton: {
    backgroundColor: '#03A9F4',
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cachedOrdersSection: {
    marginTop: 24,
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
  },
  cachedOrdersTitle: {
    fontSize: 18,
    color: '#003B71',
    fontWeight: 'bold',
    marginBottom: 12,
  },
  noOrdersText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
  cachedOrderItem: {
    backgroundColor: '#F8F9FB',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  cachedOrderId: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#003B71',
  },
  cachedOrderDate: {
    fontSize: 12,
    color: '#666',
  },
  cachedOrderClient: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  orderValues: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  orderDiscount: {
    fontSize: 12,
    color: '#FF3B30',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    width: '90%',
    maxHeight: '80%',
    padding: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#003B71',
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    flex: 1,
  },
  detailSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#003B71',
    marginBottom: 12,
  },
  detailText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  productItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  productName: {
    flex: 2,
    fontSize: 14,
    color: '#333',
  },
  productDetails: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  productTotal: {
    flex: 1,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#003B71',
    textAlign: 'right',
  },
  valueRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  valueLabel: {
    fontSize: 14,
    color: '#666',
  },
  valueAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#003B71',
  },
  prizeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FB',
    padding: 12,
    borderRadius: 8,
  },
  prizeText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#333',
  },
  prizePhoto: {
    width: '100%',
    height: 200,
    marginTop: 12,
    borderRadius: 8,
  },
});