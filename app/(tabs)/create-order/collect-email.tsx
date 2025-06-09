import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Platform } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

export default function CollectEmailScreen() {
  const [email, setEmail] = useState('');
  const params = useLocalSearchParams();

  const handleSubmit = () => {
    if (!email) {
      alert('Por favor, insira um email válido');
      return;
    }

    // Validação básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Por favor, insira um email válido');
      return;
    }

    router.push({
      pathname: '/(tabs)/create-order/confirmation',
      params: {
        ...params,
        email: email
      }
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerIcon} />
        <Text style={styles.headerTitle}>Email para Confirmação</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.instruction}>Por favor, insira seu email para receber a confirmação do pedido.</Text>
        <TextInput
          style={styles.input}
          placeholder="Seu email"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TouchableOpacity 
          style={styles.submitButton}
          onPress={handleSubmit}
        >
          <Text style={styles.submitButtonText}>Enviar Email</Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 16,
    backgroundColor: '#FFFFFF',
  },
  headerIcon: {
    width: 24,
    height: 24,
    backgroundColor: '#003B71',
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 22,
    color: '#003B71',
    fontFamily: 'Montserrat-Bold',
  },
  content: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
  },
  instruction: {
    color: '#666666',
    fontSize: 16,
    fontFamily: 'Montserrat-Regular',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: 'Montserrat-Regular',
    marginBottom: 24,
  },
  submitButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#0088CC',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Montserrat-Bold',
  },
});