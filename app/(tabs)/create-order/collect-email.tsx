import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { useOrderStore } from '../../../store/useOrderStore';

export default function CollectEmailScreen() {
  const [email, setEmail] = useState('');
  const params = useLocalSearchParams();
  // Precisamos recuperar os dados do pedido aqui, como total, itens, prazo, etc.
  // Eles virão como parâmetros da tela anterior

  const handleFinalizeOrder = () => {
    // Aqui você pode adicionar a lógica para processar o pedido com o e-mail
    // E então navegar para a tela de Pedido Finalizado (complete.tsx)
    console.log('Email coletado:', email);
    console.log('Dados do pedido:', params); // Estes virão da tela anterior

    router.push({
      pathname: '/(tabs)/create-order/complete',
      params: { ...params, clientEmail: email } // Passa todos os params existentes + o email
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#003B71" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Confirmar Pedido</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.label}>E-mail do Cliente:</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite o e-mail do cliente"
          placeholderTextColor="#8A8A8A"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <TouchableOpacity 
          style={[styles.finalizeButton, !email && styles.finalizeButtonDisabled]}
          onPress={handleFinalizeOrder}
          disabled={!email}
        >
          <Text style={styles.finalizeButtonText}>Finalizar Pedido</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FB',
    paddingTop: Platform.OS === 'web' ? 0 : 48,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#003B71',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 16,
    color: '#003B71',
    marginBottom: 8,
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    color: '#333333',
  },
  finalizeButton: {
    backgroundColor: '#FCB32B',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#FCB32B',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
      },
      android: {
        elevation: 12,
      },
      web: {
        boxShadow: '0 6px 20px rgba(252, 179, 43, 0.3)',
      }
    }),
  },
  finalizeButtonDisabled: {
    opacity: 0.5,
  },
  finalizeButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Montserrat-Bold',
    textTransform: 'uppercase',
  },
}); 