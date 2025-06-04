import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform, Image } from 'react-native';
import { router } from 'expo-router';
import RNPickerSelect from 'react-native-picker-select';

const logoDmuller = require('../assets/images/logoDmuller.png');

const teams = [
  { label: 'Litoral M', value: 49 },
  { label: 'Litoral D', value: 35 },
  { label: 'Floripa M', value: 14 },
  { label: 'Floripa D', value: 18 },
];

export default function Login() {
  const [code, setCode] = useState('');
  const [selectedTeam, setSelectedTeam] = useState<number | undefined>(undefined);

  const handleLogin = () => {
    // Adicione aqui a lógica de autenticação, se houver
    router.replace('/(app)/orders'); // Navega para a tela de Pedidos após o login
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Image source={logoDmuller} style={styles.logo} resizeMode="contain" />
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputsContainer}>
            <Text style={styles.label}>Equipe:</Text>
            <View style={styles.pickerContainer}>
              <RNPickerSelect
                onValueChange={(value) => setSelectedTeam(value || undefined)}
                value={selectedTeam}
                items={teams}
                style={{
                  inputIOS: styles.picker,
                  inputAndroid: styles.picker,
                  inputWeb: styles.picker,
                }}
                placeholder={{
                  label: 'Selecione uma equipe',
                  value: undefined,
                }}
              />
            </View>

            <Text style={styles.label}>Representante:</Text>
            <TextInput
              style={styles.input}
              placeholder="Código do Vendedor"
              placeholderTextColor="#8A8A8A"
              keyboardType="numeric"
              value={code}
              onChangeText={setCode}
            />
          </View>

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Entrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#003B71',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 320,
    height: 110,
  },
  formContainer: {
    flex: 1,
    maxHeight: 300,
    justifyContent: 'space-between',
  },
  inputsContainer: {
    width: '100%',
  },
  label: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 8,
  },
  pickerContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginBottom: 20,
  },
  picker: {
    fontSize: 16,
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderWidth: 0,
    borderRadius: 8,
    color: '#000000',
    backgroundColor: '#FFFFFF',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    fontSize: 16,
  },
  loginButton: {
    alignSelf: 'stretch',
    backgroundColor: '#FCB32B',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
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
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Montserrat-Bold',
    textTransform: 'uppercase',
  },
});