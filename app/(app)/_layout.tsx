import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Stack, router } from 'expo-router';
import { Menu, Chrome as Home, Users, Package, Settings, LogOut } from 'lucide-react-native';
import { Sidebar, MenuItem } from '../../components/shared/Sidebar';

export default function AppLayout() {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems: MenuItem[] = [
    { 
      title: 'Pedidos',
      route: '/(app)/orders',
      icon: Home
    },
    { 
      title: 'Clientes',
      route: '/(app)/clients',
      icon: Users
    },
    { 
      title: 'Produtos',
      route: '/(app)/products',
      icon: Package
    },
    { 
      title: 'Configurações',
      route: '/(app)/settings',
      icon: Settings
    },
    { 
      title: 'Sair',
      route: '/login',
      icon: LogOut,
      color: '#FF3B30'
    },
  ];

  const handleNavigation = (route: string) => {
    router.push(route as any);
    setIsOpen(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.menuButton} 
        onPress={() => setIsOpen(true)}
      >
        <Menu size={24} color="#003B71" />
      </TouchableOpacity>

      <Sidebar 
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onNavigate={handleNavigation}
        menuItems={menuItems}
      />

      <View style={styles.main}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="orders" />
          <Stack.Screen name="clients" />
          <Stack.Screen name="products" />
          <Stack.Screen name="settings" />
        </Stack>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  main: {
    flex: 1,
  },
  menuButton: {
    position: 'absolute',
    top: Platform.OS === 'web' ? 16 : 48,
    left: 16,
    zIndex: 1,
    width: 40,
    height: 40,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#003B71',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
      web: {
        boxShadow: '0 4px 14px rgba(0, 59, 113, 0.2)',
      }
    }),
  },
});