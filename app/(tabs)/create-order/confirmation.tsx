import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';

export default function ConfirmationScreen() {
  const params = useLocalSearchParams();

  const handleFinish = () => {
    router.replace('/(tabs)');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Pedido Confirmado!</Text>
          </View>
          
      <View style={styles.content}>
        <View style={styles.successIcon}>
          <View style={{ width: 48, height: 48, backgroundColor: '#0088CC', borderRadius: 24 }} />
          </View>
          
        <Text style={styles.message}>
          Seu pedido foi confirmado com sucesso!
            </Text>

        <Text style={styles.emailText}>
          Um email de confirmação foi enviado para:
          {'\n'}
          <Text style={styles.email}>{params.email}</Text>
              </Text>

        {params.prize && (
          <View style={styles.prizeSection}>
            <Text style={styles.prizeTitle}>Prêmio Ganho:</Text>
            <Text style={styles.prizeName}>{params.prize}</Text>
          </View>
        )}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.finishButton} onPress={handleFinish}>
          <Text style={styles.finishButtonText}>Finalizar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    color: '#003B71',
    fontFamily: 'Montserrat-Bold',
  },
  content: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  message: {
    fontSize: 20,
    color: '#003B71',
    fontFamily: 'Montserrat-Bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  emailText: {
    fontSize: 16,
    color: '#666666',
    fontFamily: 'Montserrat-Regular',
    textAlign: 'center',
    marginBottom: 24,
  },
  email: {
    color: '#003B71',
    fontFamily: 'Montserrat-Bold',
  },
  prizeSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    alignItems: 'center',
  },
  prizeTitle: {
    fontSize: 16,
    color: '#666666',
    fontFamily: 'Montserrat-Regular',
    marginBottom: 8,
  },
  prizeName: {
    fontSize: 18,
    color: '#003B71',
    fontFamily: 'Montserrat-Bold',
  },
  footer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  finishButton: {
    backgroundColor: '#0088CC',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  finishButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Montserrat-Bold',
  },
});