import { View, Text, TouchableOpacity, StyleSheet, Platform, ScrollView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, CreditCard, Calendar } from 'lucide-react-native';
import { usePaymentTermsStore } from '../../../store/usePaymentTermsStore';
import { useOrderStore } from '../../../store/useOrderStore';

export default function PaymentMethodScreen() {
  const { paymentTerms } = usePaymentTermsStore();
  const params = useLocalSearchParams();
  const clientId = params.clientId as string;
  const clientName = params.clientName as string;

  const handleSelectPaymentTerm = (termId: string) => {
    const term = paymentTerms.find(t => t.id === termId);
    if (term) {
      useOrderStore.getState().setPaymentTerm(term);
      router.push({
        pathname: '/(tabs)/create-order',
        params: {
          clientId,
          clientName,
        }
      });
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#003B71" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Forma de Pagamento</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.clientInfo}>
          <Text style={styles.clientLabel}>Cliente</Text>
          <Text style={styles.clientName}>{clientName}</Text>
        </View>

        <View style={styles.paymentSection}>
          <Text style={styles.sectionTitle}>Selecione o Prazo de Pagamento</Text>
          
          {paymentTerms.map((term) => (
            <TouchableOpacity
              key={term.id}
              style={styles.paymentOption}
              onPress={() => handleSelectPaymentTerm(term.id)}
            >
              <View style={styles.paymentIcon}>
                <Calendar size={24} color="#003B71" />
              </View>
              <View style={styles.paymentInfo}>
                <Text style={styles.paymentTitle}>{term.description}</Text>
                <Text style={styles.paymentDescription}>
                  Pagamento em {term.days} dias
                </Text>
              </View>
            </TouchableOpacity>
          ))}

          <TouchableOpacity style={styles.creditCardOption}>
            <View style={styles.paymentIcon}>
              <CreditCard size={24} color="#003B71" />
            </View>
            <View style={styles.paymentInfo}>
              <Text style={styles.paymentTitle}>Cartão de Crédito</Text>
              <Text style={styles.paymentDescription}>
                Pagamento à vista
              </Text>
            </View>
          </TouchableOpacity>
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
  clientInfo: {
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
  clientLabel: {
    fontSize: 14,
    color: '#666666',
    fontFamily: 'Montserrat-Regular',
    marginBottom: 4,
  },
  clientName: {
    fontSize: 18,
    color: '#003B71',
    fontFamily: 'Montserrat-Bold',
  },
  paymentSection: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    gap: 16,
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
    marginBottom: 8,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 16,
    borderRadius: 8,
  },
  paymentIcon: {
    width: 48,
    height: 48,
    backgroundColor: '#E5F0FF',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentTitle: {
    fontSize: 16,
    color: '#003B71',
    fontFamily: 'Montserrat-Bold',
    marginBottom: 4,
  },
  paymentDescription: {
    fontSize: 14,
    color: '#666666',
    fontFamily: 'Montserrat-Regular',
  },
  creditCardOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 16,
    borderRadius: 8,
    opacity: 0.5, // Indicando que está desabilitado
  },
}); 