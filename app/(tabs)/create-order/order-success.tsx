import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';

export default function OrderSuccess() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pedido Criado com Sucesso!</Text>
      <Text style={styles.subtitle}>Seu pedido foi registrado e está sendo processado.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#003B71',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
}); 