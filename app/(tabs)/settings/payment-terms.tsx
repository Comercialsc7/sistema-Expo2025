import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, ScrollView, TextInput } from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react-native';
import InputGroup from '../../../components/shared/InputGroup';
import { usePaymentTermsStore } from '../../../store/usePaymentTermsStore';

export default function PaymentTermsScreen() {
  const { paymentTerms, addPaymentTerm, removePaymentTerm } = usePaymentTermsStore();
  const [newTerm, setNewTerm] = useState({ days: '', description: '' });

  const handleAddTerm = () => {
    if (!newTerm.days || !newTerm.description) return;

    addPaymentTerm({
      days: parseInt(newTerm.days),
      description: newTerm.description,
    });

    setNewTerm({ days: '', description: '' });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#003B71" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Prazos de Pagamento</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.addSection}>
          <Text style={styles.sectionTitle}>Adicionar Novo Prazo</Text>
          <InputGroup
            label="Dias"
            value={newTerm.days}
            onChangeText={(text: string) => setNewTerm(prev => ({ ...prev, days: text }))}
            placeholder="Ex: 30"
            keyboardType="numeric"
          />
          <InputGroup
            label="Descrição"
            value={newTerm.description}
            onChangeText={(text: string) => setNewTerm(prev => ({ ...prev, description: text }))}
            placeholder="Ex: 30 dias"
          />
          <TouchableOpacity style={styles.addButton} onPress={handleAddTerm}>
            <Plus size={20} color="#FFFFFF" />
            <Text style={styles.addButtonText}>Adicionar Prazo</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.listSection}>
          <Text style={styles.sectionTitle}>Prazos Configurados</Text>
          {paymentTerms.map((term) => (
            <View key={term.id} style={styles.termCard}>
              <View style={styles.termInfo}>
                <Text style={styles.termDays}>{term.days} dias</Text>
                <Text style={styles.termDescription}>{term.description}</Text>
              </View>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => removePaymentTerm(term.id)}
              >
                <Trash2 size={20} color="#FF3B30" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
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
    backgroundColor: '#FFFFFF',
    padding: 16,
    paddingTop: Platform.OS === 'web' ? 16 : 48,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 24,
    color: '#003B71',
    fontFamily: 'Montserrat-Bold',
  },
  content: {
    padding: 16,
    gap: 24,
  },
  addSection: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      }
    }),
  },
  sectionTitle: {
    fontSize: 18,
    color: '#003B71',
    fontFamily: 'Montserrat-Bold',
    marginBottom: 16,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#003B71',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Montserrat-Bold',
  },
  listSection: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      }
    }),
  },
  termCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    marginBottom: 8,
  },
  termInfo: {
    flex: 1,
  },
  termDays: {
    fontSize: 16,
    color: '#003B71',
    fontFamily: 'Montserrat-Bold',
    marginBottom: 4,
  },
  termDescription: {
    fontSize: 14,
    color: '#666666',
    fontFamily: 'Montserrat-Regular',
  },
  deleteButton: {
    padding: 8,
  },
}); 