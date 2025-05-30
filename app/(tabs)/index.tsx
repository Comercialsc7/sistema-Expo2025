import { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Search } from 'lucide-react-native';

const mockClients = [
  {
    id: '1',
    fantasyName: 'Supermercado Silva',
    legalName: 'Silva & Cia Ltda',
    cnpj: '12.345.678/0001-90',
    code: '001',
  },
  // Add more mock clients here
];

export default function ClientList() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredClients = mockClients.filter(client => 
    Object.values(client).some(value => 
      value.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const handleClientSelect = (client) => {
    router.push({
      pathname: '/orders',
      params: { clientId: client.id }
    });
  };

  const renderClient = ({ item }) => (
    <TouchableOpacity 
      style={styles.clientCard}
      onPress={() => handleClientSelect(item)}
    >
      <Text style={styles.fantasyName}>{item.fantasyName}</Text>
      <Text style={styles.details}>Razão Social: {item.legalName}</Text>
      <Text style={styles.details}>CNPJ: {item.cnpj}</Text>
      <Text style={styles.details}>Código: {item.code}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Search size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Pesquisar clientes..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#999"
        />
      </View>
      <FlatList
        data={filteredClients}
        renderItem={renderClient}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    margin: 16,
    padding: 10,
    borderRadius: 8,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Montserrat-Regular',
  },
  listContainer: {
    padding: 16,
  },
  clientCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
  },
  fantasyName: {
    fontSize: 18,
    color: '#003B71',
    marginBottom: 8,
    fontFamily: 'Montserrat-Bold',
  },
  details: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
    fontFamily: 'Montserrat-Regular',
  },
});