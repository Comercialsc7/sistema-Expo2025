import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { CachedOrder } from '../../store/useCachedOrdersStore';
import { styles } from '../styles/sync-orders.styles';

interface OrderItemProps {
  item: CachedOrder;
  onPress: (order: CachedOrder) => void;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

export const OrderItem: React.FC<OrderItemProps> = React.memo(({ item, onPress }) => (
  <TouchableOpacity 
    style={styles.cachedOrderItem}
    onPress={() => onPress(item)}
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
)); 