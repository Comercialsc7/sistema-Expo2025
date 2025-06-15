import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Platform } from 'react-native';
import { router } from 'expo-router';
import { supabase } from '../../../lib/supabase';
import { Search, ArrowLeft, Plus } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Client {
  id: string;
  name: string;
  code: string;
  cnpj: string;
  address?: string;
  equipe?: number;
  repre?: string;
}

export default function ClientsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [codigoEquipeFiltro, setCodigoEquipeFiltro] = useState<number | null>(null);
  const [codigoRepresentanteFiltro, setCodigoRepresentanteFiltro] = useState<string | null>(null);

  useEffect(() => {
    const loadFilters = async () => {
      try {
        const equipe = await AsyncStorage.getItem('selectedTeamCode');
        const representante = await AsyncStorage.getItem('representativeCodeToStore');
        
        if (equipe) {
          setCodigoEquipeFiltro(Number(equipe));
        }
        if (representante) {
          setCodigoRepresentanteFiltro(representante);
        }
      } catch (e) {
        console.error('Failed to load filters from AsyncStorage', e);
      }
    };

    loadFilters();
  }, []);

  useEffect(() => {
    if (codigoEquipeFiltro !== null && codigoRepresentanteFiltro !== null) {
      fetchClients();
    }
  }, [codigoEquipeFiltro, codigoRepresentanteFiltro]);

  const fetchClients = async () => {
    if (codigoEquipeFiltro === null || codigoRepresentanteFiltro === null) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('clients')
        .select(`
          id, 
          name, 
          code, 
          cnpj, 
          address,
          equipe,
          repre
        `)
        .eq('equipe', codigoEquipeFiltro)
        .eq('repre', codigoRepresentanteFiltro);

      if (error) throw error;

      setClients(data as Client[] || []);
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.cnpj.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderClientItem = ({ item }: { item: Client }) => (
    <TouchableOpacity
      style={styles.clientItem}
      onPress={() => console.log('Cliente selecionado:', item.name)}
    >
      <View style={styles.clientInfo}>
        <View style={styles.firstLine}>
          <Text style={styles.clientCode}>{item.code}</Text>
        </View>
        <Text style={styles.clientName}>{item.name}</Text>
        <Text style={styles.clientCnpj}>CNPJ: {item.cnpj}</Text>
        {item.address && <Text style={styles.clientAddress}>Endereço: {item.address}</Text>}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#003B71" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Clientes</Text>
        <TouchableOpacity style={styles.addButton}>
          <Plus size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color="#666666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar clientes..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Carregando clientes...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredClients}
          renderItem={renderClientItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {searchQuery ? 'Nenhum cliente encontrado.' : 'Nenhum cliente disponível.'}
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: Platform.OS === 'web' ? 16 : 48,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 24,
    color: '#003B71',
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0088CC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#003B71',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666666',
  },
  list: {
    padding: 16,
  },
  clientItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      }
    }),
  },
  clientInfo: {
    gap: 4,
  },
  firstLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  clientCode: {
    fontSize: 14,
    color: '#003B71',
    fontWeight: 'bold',
  },
  clientName: {
    fontSize: 16,
    color: '#003B71',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  clientCnpj: {
    fontSize: 14,
    color: '#666666',
  },
  clientAddress: {
    fontSize: 14,
    color: '#666666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
  },
});