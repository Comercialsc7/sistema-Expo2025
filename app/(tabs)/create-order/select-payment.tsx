import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Calendar, CreditCard, Wallet } from 'lucide-react-native';

const paymentOptions = [
  { id: 'cash', label: 'À Vista', icon: Wallet },
  { id: 'invoice', label: 'Boleto', icon: CreditCard },
];

const invoiceDueDates = [7, 14, 21, 28, 35];

export default function SelectPayment() {
  const { clientId } = useLocalSearchParams();
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [selectedDueDate, setSelectedDueDate] = useState(null);

  const handleConfirm = () => {
    // Here we would save the payment information
    router.push('/(tabs)/create-order');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#003B71" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Forma de Pagamento</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Selecione a forma de pagamento:</Text>
        <View style={styles.paymentOptions}>
          {paymentOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.paymentOption,
                selectedPayment === option.id && styles.paymentOptionSelected
              ]}
              onPress={() => setSelectedPayment(option.id)}
            >
              <option.icon
                size={24}
                color={selectedPayment === option.id ? '#FFFFFF' : '#003B71'}
              />
              <Text
                style={[
                  styles.paymentOptionText,
                  selectedPayment === option.id && styles.paymentOptionTextSelected
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {selectedPayment === 'invoice' && (
          <>
            <Text style={[styles.sectionTitle, { marginTop: 24 }]}>
              Selecione o prazo:
            </Text>
            <View style={styles.dueDates}>
              {invoiceDueDates.map((days) => (
                <TouchableOpacity
                  key={days}
                  style={[
                    styles.dueDateOption,
                    selectedDueDate === days && styles.dueDateOptionSelected
                  ]}
                  onPress={() => setSelectedDueDate(days)}
                >
                  <Calendar
                    size={20}
                    color={selectedDueDate === days ? '#FFFFFF' : '#003B71'}
                  />
                  <Text
                    style={[
                      styles.dueDateText,
                      selectedDueDate === days && styles.dueDateTextSelected
                    ]}
                  >
                    {days} dias
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}
      </View>

      <TouchableOpacity
        style={[
          styles.confirmButton,
          (!selectedPayment || (selectedPayment === 'invoice' && !selectedDueDate)) &&
            styles.confirmButtonDisabled
        ]}
        onPress={handleConfirm}
        disabled={!selectedPayment || (selectedPayment === 'invoice' && !selectedDueDate)}
      >
        <Text style={styles.confirmButtonText}>Confirmar</Text>
      </TouchableOpacity>
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
  content: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    color: '#666666',
    fontFamily: 'Montserrat-Medium',
    marginBottom: 16,
  },
  paymentOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  paymentOption: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    gap: 8,
    borderWidth: 2,
    borderColor: '#E5E5E5',
  },
  paymentOptionSelected: {
    backgroundColor: '#003B71',
    borderColor: '#003B71',
  },
  paymentOptionText: {
    fontSize: 14,
    color: '#003B71',
    fontFamily: 'Montserrat-Bold',
  },
  paymentOptionTextSelected: {
    color: '#FFFFFF',
  },
  dueDates: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  dueDateOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    gap: 8,
    borderWidth: 2,
    borderColor: '#E5E5E5',
  },
  dueDateOptionSelected: {
    backgroundColor: '#003B71',
    borderColor: '#003B71',
  },
  dueDateText: {
    fontSize: 14,
    color: '#003B71',
    fontFamily: 'Montserrat-Medium',
  },
  dueDateTextSelected: {
    color: '#FFFFFF',
  },
  confirmButton: {
    backgroundColor: '#0088CC',
    padding: 16,
    margin: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  confirmButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontFamily: 'Montserrat-Bold',
  },
});