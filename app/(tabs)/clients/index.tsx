import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform, ScrollView } from 'react-native';
import { Search, Plus } from 'lucide-react-native';
import { router } from 'expo-router';
import { mockClients } from '../../../data/mocks';

export default function ClientManagement() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredClients = mockClients.filter(client =>
    Object.values(client).some(value =>
      String(value).toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const handleAddClient = () => {
    router.push('/clients/client-management');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Clientes</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddClient}>
          <Plus size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Search size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar clientes..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#999"
        />
      </View>

      <ScrollView style={styles.listContainer}>
        {filteredClients.map((client) => (
          <TouchableOpacity 
            key={client.id}
            style={styles.clientCard}
            onPress={() => console.log('Client selected:', client.id)}
          >
            <View style={styles.clientInfo}>
              <View style={styles.topLine}>
                <Text style={styles.code}>{client.code}</Text>
                <Text style={styles.name} numberOfLines={1}>{client.fantasyName}</Text>
              </View>
              <View style={styles.bottomLine}>
                <Text style={styles.cnpj}>{client.cnpj}</Text>
                <Text style={styles.legalName} numberOfLines={1}>{client.name}</Text>
              </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    marginLeft: Platform.OS === 'web' ? 56 : 0,
  },
  headerTitle: {
    fontSize: 24,
    color: '#003B71',
    fontFamily: 'Montserrat-Bold',
  },
  addButton: {
    backgroundColor: '#0088CC',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#0088CC',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
      web: {
        boxShadow: '0 4px 14px rgba(0, 136, 204, 0.3)',
      }
    }),
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
    fontFamily: 'Montserrat-Regular',
    color: '#333333',
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  clientCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginBottom: 8,
    padding: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
      web: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      }
    }),
  },
  clientInfo: {
    gap: 4,
  },
  topLine: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bottomLine: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  code: {
    width: 50,
    fontSize: 14,
    color: '#003B71',
    fontFamily: 'Montserrat-Bold',
  },
  name: {
    flex: 1,
    fontSize: 16,
    color: '#333333',
    fontFamily: 'Montserrat-Bold',
  },
  cnpj: {
    width: 150,
    fontSize: 14,
    color: '#666666',
    fontFamily: 'Montserrat-Regular',
  },
  legalName: {
    flex: 1,
    fontSize: 14,
    color: '#666666',
    fontFamily: 'Montserrat-Regular',
  },
});