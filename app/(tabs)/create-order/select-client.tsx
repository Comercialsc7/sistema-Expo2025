import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, Search, Building2 } from 'lucide-react-native';
import { useOrderStore } from '../../../store/useOrderStore';

interface Client {
  id: string;
  name: string;
  code: string;
  cnpj: string;
  address: string;
}

const mockClients: Client[] = [
  {
    id: '1',
    name: 'Supermercado Silva',
    code: '001',
    cnpj: '12.345.678/0001-90',
    address: 'Rua das Flores, 123',
  },
  {
    id: '2',
    name: 'Mercado Santos',
    code: '002',
    cnpj: '98.765.432/0001-21',
    address: 'Av. Principal, 456',
  },
];

export default function SelectClient() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredClients = mockClients.filter(client =>
    Object.values(client).some(value =>
      String(value).toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const handleSelectClient = (client: Client) => {
    useOrderStore.getState().setClient(client);
    router.push({
      pathname: '/(tabs)/create-order/payment-method',
      params: { 
        clientId: client.id,
        clientName: client.name
      }
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#003B71" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Selecionar Cliente</Text>
      </View>

      <View style={styles.searchContainer}>
        <Search size={20} color="#666666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar clientes..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#999999"
        />
      </View>

      <ScrollView style={styles.content}>
        {filteredClients.map((client) => (
          <TouchableOpacity
            key={client.id}
            style={styles.clientCard}
            onPress={() => handleSelectClient(client)}
          >
            <View style={styles.clientIcon}>
              <Building2 size={24} color="#003B71" />
            </View>
            <View style={styles.clientInfo}>
              <View style={styles.clientHeader}>
                <Text style={styles.clientCode}>{client.code}</Text>
                <Text style={styles.clientName}>{client.name}</Text>
              </View>
              <Text style={styles.clientCnpj}>{client.cnpj}</Text>
              <Text style={styles.clientAddress}>{client.address}</Text>
            </View>
          </TouchableOpacity>
        ))}
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
    paddingTop: Platform.OS === 'web' ? 16 : 48,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    color: '#003B71',
    fontFamily: 'Montserrat-Bold',
    marginLeft: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    margin: 16,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333333',
    fontFamily: 'Montserrat-Regular',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  clientCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      }
    }),
  },
  clientIcon: {
    width: 48,
    height: 48,
    backgroundColor: '#F0F7FF',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  clientInfo: {
    flex: 1,
  },
  clientHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  clientCode: {
    fontSize: 12,
    color: '#666666',
    fontFamily: 'Montserrat-Medium',
    backgroundColor: '#F0F7FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 8,
  },
  clientName: {
    fontSize: 16,
    color: '#003B71',
    fontFamily: 'Montserrat-Bold',
  },
  clientCnpj: {
    fontSize: 14,
    color: '#666666',
    fontFamily: 'Montserrat-Regular',
    marginBottom: 4,
  },
  clientAddress: {
    fontSize: 12,
    color: '#999999',
    fontFamily: 'Montserrat-Regular',
  },
});