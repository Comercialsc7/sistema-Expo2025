import { useMemo } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, StyleSheet } from 'react-native';
import { ArrowLeft, Plus, Minus, Trash2 } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useOrderStore } from '../../../store/useOrderStore';

const Diamond = require('../../../assets/images/diamond.png');

export default function OrderSummary() {
  const { items: orderItems, removeItem, updateItemQuantity, client, paymentTerm } = useOrderStore();
  const params = useLocalSearchParams();
  const prazoDescricaoParam = params.prazoDescricao as string | undefined;

  // Cálculos dinâmicos
  const subtotal = useMemo(() => orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0), [orderItems]);
  const aceleradores = useMemo(() => orderItems.filter(item => item.isAccelerator).length, [orderItems]);
  const desconto = useMemo(() => orderItems.reduce((sum, item) => sum + ((item.price * item.quantity) * (item.discount / 100)), 0), [orderItems]);
  const total = subtotal - desconto;
  const prazo = paymentTerm?.days || 0;

  const handleQtyChange = (idx: number, delta: number) => {
    const item = orderItems[idx];
    const newQty = Math.max(1, item.quantity + delta);
    updateItemQuantity(idx, newQty);
  };

  const handleRemoveItem = (idx: number) => {
    removeItem(idx);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#003B71" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pedido</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => {
            if (client && paymentTerm) {
              router.push({
                pathname: '/(tabs)/create-order/product-search',
                params: {
                  clientId: client.id,
                  clientName: client.name,
                  paymentTermId: paymentTerm.id
                }
              });
            } else {
              router.push('/(tabs)/create-order/select-client');
            }
          }}
        >
          <Plus size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      <View style={styles.contentArea}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.itemsList}>
            {orderItems.map((item, idx) => (
              <View key={idx} style={styles.itemCard}>
                <View style={styles.itemInfo}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={styles.itemCode}>{item.id}</Text>
                    {item.isAccelerator && <Image source={Diamond} style={{ width: 30, height: 30, marginLeft: 4 }} />}
                  </View>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemBox}>{item.box}</Text>
                  <Text style={styles.itemPrice}>R$ {item.price.toFixed(2)} <Text style={styles.itemDiscount}>-5%</Text></Text>
                </View>
                <View style={styles.qtyControl}>
                  <TouchableOpacity onPress={() => handleQtyChange(idx, -1)}>
                    <Minus size={18} color="#003B71" />
                  </TouchableOpacity>
                  <Text style={styles.qtyText}>{item.quantity}</Text>
                  <TouchableOpacity onPress={() => handleQtyChange(idx, 1)}>
                    <Plus size={18} color="#003B71" />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={() => handleRemoveItem(idx)} style={{ marginLeft: 8 }}>
                  <Trash2 size={20} color="#FF3B30" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
          <View style={styles.summaryBox}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>R$ {subtotal.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Itens Aceleradores</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={[styles.summaryValue, { marginRight: 4 }]}>{aceleradores}</Text>
                <Image source={Diamond} style={{ width: 30, height: 30 }} />
              </View>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Desconto</Text>
              <Text style={[styles.summaryValue, { color: '#FF3B30' }]}>R$ {desconto.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={[styles.summaryRow, { marginBottom: 0 }]}> 
              <Text style={styles.summaryTotalLabel}>Total</Text>
              <Text style={styles.summaryTotalValue}>R$ {total.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryPrazoRow}>
              <Text style={styles.summaryPrazo}>Prazo de pagamento</Text>
              <Text style={styles.summaryPrazoValor}>
                {prazoDescricaoParam || paymentTerm?.description || 'Não definido'}
              </Text>
            </View>
            
            <TouchableOpacity
              style={[styles.finishButton, !prazo && styles.finishButtonDisabled]} 
              onPress={() => {
                if (prazo) {
                  router.push({
                    pathname: '/(tabs)/create-order/complete',
                    params: {
                      subtotal: subtotal.toFixed(2),
                      itens: orderItems.length,
                      desconto: desconto.toFixed(2),
                      total: total.toFixed(2),
                      prazo: prazo,
                    }
                  });
                }
              }}
              disabled={!prazo}
            >
              <Text style={styles.finishButtonText}>Finalizar Pedido</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 12,
    backgroundColor: 'transparent',
  },
  backButton: {
    backgroundColor: '#F0F2F5',
    borderRadius: 20,
    padding: 4,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#003B71',
  },
  addButton: {
    backgroundColor: '#0094FF',
    borderRadius: 20,
    padding: 6,
  },
  contentArea: {
    flex: 1,
    paddingHorizontal: 8,
    marginBottom: 8,
    justifyContent: 'space-between',
  },
  itemsList: {
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  itemInfo: {
    flex: 1,
  },
  itemCode: {
    fontWeight: 'bold',
    color: '#003B71',
    fontSize: 14,
  },
  itemName: {
    fontSize: 14,
    color: '#003B71',
    fontWeight: '600',
  },
  itemBox: {
    fontSize: 12,
    color: '#888',
  },
  itemPrice: {
    fontSize: 15,
    color: '#222',
    fontWeight: 'bold',
  },
  itemDiscount: {
    color: '#FF3B30',
    fontSize: 13,
    fontWeight: 'bold',
  },
  qtyControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F2F5',
    borderRadius: 16,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  qtyText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 8,
    color: '#003B71',
  },
  summaryBox: {
    backgroundColor: '#003B71',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 18,
    marginTop: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    color: '#fff',
    fontSize: 15,
  },
  summaryValue: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  summaryDivider: {
    borderBottomColor: '#fff',
    borderBottomWidth: 1,
    opacity: 0.3,
    marginVertical: 8,
  },
  summaryTotalLabel: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  summaryTotalValue: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  summaryPrazoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryPrazo: {
    color: '#fff',
    fontSize: 13,
    opacity: 0.8,
  },
  summaryPrazoValor: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  finishButton: {
    backgroundColor: '#FCB32B',
    borderRadius: 12,
    marginTop: 12,
    paddingVertical: 12,
    alignItems: 'center',
    width: '100%',
  },
  finishButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 17,
    textTransform: 'uppercase',
  },
  finishButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
}); 