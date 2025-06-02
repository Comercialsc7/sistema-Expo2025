import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { useNavigation } from '../hooks/useNavigation'; // Ajustar o caminho
import { ArrowLeft, ArrowUp, ArrowDown } from 'lucide-react-native';
import { useCachedOrdersStore, CachedOrder } from '../store/useCachedOrdersStore'; // Ajustar o caminho

export default function SyncOrdersScreen() {
  const { goBack } = useNavigation();
  const { cachedOrders } = useCachedOrdersStore();

  // TODO: Implement logic for sending and receiving data
  const handleSendData = () => {
    console.log('Enviar Carga');
    // Implementar lógica de envio
  };

  const handleReceiveData = () => {
    console.log('Receber Carga');
    // Implementar lógica de recebimento
  };

  // Função para renderizar um item da lista de pedidos em cache
  const renderCachedOrderItem = ({ item }: { item: CachedOrder }) => (
    <View style={styles.cachedOrderItem}>
      <Text style={styles.cachedOrderId}>ID Pedido: {item.id}</Text>
      <Text style={styles.cachedOrderClient}>Cliente: {item.client.name}</Text>
    </View>
  );

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
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button, styles.sendButton]} onPress={handleSendData}>
              <ArrowUp size={24} color="#FFFFFF" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Enviar Dados</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, styles.receiveButton]} onPress={handleReceiveData}>
              <ArrowDown size={24} color="#FFFFFF" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Receber Dados</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.cachedOrdersSection}>
            <Text style={styles.cachedOrdersTitle}>Pedidos em Cache:</Text>
            {cachedOrders.length === 0 ? (
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
  cachedOrderId: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#003B71',
    marginBottom: 4,
  },
  cachedOrderClient: {
    fontSize: 14,
    color: '#333',
  },
}); 