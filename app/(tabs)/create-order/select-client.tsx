import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Image } from 'react-native';
import { router } from 'expo-router';
import { supabase } from '../../../lib/supabase';
import { useOrderStore, Client, ClientPaymentTerm, PaymentTerm } from '../../../store/useOrderStore';

export default function SelectClient() {
  const [searchQuery, setSearchQuery] = useState('');
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  const { setClient } = useOrderStore();

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select(`
          id, 
          name, 
          code, 
          fantasy_name, 
          cnpj, 
          created_at, 
          address,
          payment_terms:client_payment_terms(
            id,
            prazo_id,
            is_default,
            prazo:prazos(
              id,
              prazo
            )
          )
        `)

      if (error) throw error;

      const formattedClients = data.map((client: any) => ({
        ...client,
        payment_terms: client.payment_terms?.map((term: any) => ({
          ...term,
          prazo: {
            id: term.prazo.id,
            description: term.prazo.prazo
          }
        }))
      }));

      setClients(formattedClients as Client[] || []);
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.fantasy_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.cnpj.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectClient = (client: Client) => {
    // A estrutura de client já está formatada com o prazo correto neste ponto
    setClient(client);
    router.push('/create-order/payment-method');
  };

  const renderClientItem = ({ item }: { item: Client }) => (
    <TouchableOpacity
      style={styles.clientItem}
      onPress={() => handleSelectClient(item)}
    >
      <View style={styles.clientInfo}>
        <View style={styles.firstLine}>
          <Text style={styles.clientCode}>{item.code}</Text>
          <Text style={styles.clientFantasy}>{item.fantasy_name}</Text>
        </View>
        <Text style={styles.clientCnpj}>CNPJ: {item.cnpj}</Text>
        {item.address && <Text style={styles.clientCnpj}>Endereço: {item.address}</Text>}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Image source={require('../../../assets/images/voltar.png')} style={{ width: 40, height: 40 }} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Selecionar Cliente</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Image source={require('../../../assets/images/buscar.png')} style={{ width: 30, height: 30 }} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar clientes..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        </View>
      </View>

      <FlatList
        data={filteredClients}
        renderItem={renderClientItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
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
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 24,
    color: '#003B71',
    fontFamily: 'Montserrat-Bold',
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
    fontFamily: 'Montserrat-Regular',
  },
  list: {
    padding: 16,
  },
  clientItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
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
    fontFamily: 'Montserrat-Bold',
  },
  clientFantasy: {
    fontSize: 16,
    color: '#003B71',
    fontFamily: 'Montserrat-Bold',
  },
  clientCnpj: {
    fontSize: 14,
    color: '#666666',
    fontFamily: 'Montserrat-Regular',
  },
  clientDocument: {
    fontSize: 14,
    color: '#666666',
    fontFamily: 'Montserrat-Regular',
  },
  clientEmail: {
    fontSize: 14,
    color: '#666666',
    fontFamily: 'Montserrat-Regular',
  },
});