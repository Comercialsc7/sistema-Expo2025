import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { router } from 'expo-router';
import { Package, Users, Database, LogOut, ArrowLeft } from 'lucide-react-native';
import SettingsOptionCard from '../../../components/shared/SettingsOptionCard';
import { useCachedOrdersStore } from '../../../store/useCachedOrdersStore';

export default function SettingsScreen() {
  const { cachedOrders } = useCachedOrdersStore();

  const handleLogout = () => {
    router.replace('/(auth)/login');
  };

  const handleSyncOrders = () => {
    router.push('/sync-orders');
  };

  const handleManageProducts = () => {
    router.push('/(tabs)/products');
  };

  const handleManageClients = () => {
    router.push('/(tabs)/clients');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#003B71" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Configurações</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Gerenciamento</Text>
          <View style={styles.optionsContainer}>
            <SettingsOptionCard
              title="Produtos"
              description="Visualizar e gerenciar produtos"
              icon={Package}
              onPress={handleManageProducts}
            />
            <SettingsOptionCard
              title="Clientes"
              description="Visualizar e gerenciar clientes"
              icon={Users}
              onPress={handleManageClients}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sincronização</Text>
          <View style={styles.optionsContainer}>
            <SettingsOptionCard
              title="Sincronizar Pedidos"
              description="Enviar e receber dados de pedidos"
              icon={Database}
              count={cachedOrders.length}
              onPress={handleSyncOrders}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Conta</Text>
          <View style={styles.optionsContainer}>
            <TouchableOpacity style={styles.logoutCard} onPress={handleLogout}>
              <View style={styles.logoutIcon}>
                <LogOut size={24} color="#FF3B30" />
              </View>
              <View style={styles.logoutInfo}>
                <Text style={styles.logoutTitle}>Sair</Text>
                <Text style={styles.logoutDescription}>Fazer logout da conta</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
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
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    color: '#003B71',
    fontWeight: 'bold',
    marginBottom: 16,
  },
  optionsContainer: {
    gap: 12,
  },
  logoutCard: {
    flexDirection: 'row',
    alignItems: 'center',
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
  logoutIcon: {
    width: 48,
    height: 48,
    backgroundColor: '#FFF5F5',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  logoutInfo: {
    flex: 1,
  },
  logoutTitle: {
    fontSize: 16,
    color: '#FF3B30',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  logoutDescription: {
    fontSize: 14,
    color: '#666666',
  },
});