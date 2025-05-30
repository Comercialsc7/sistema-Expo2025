import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Stack, router } from 'expo-router';
import { Menu } from 'lucide-react-native';
import { Sidebar, MenuItem } from '../../../components/shared/Sidebar';

export default function ProductsLayout() {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems: MenuItem[] = [
    { title: 'Todos os Produtos', route: '/(tabs)/products' },
    { title: 'Itens Aceleradores', route: '/(tabs)/products/accelerators' },
    { title: 'Mais Vendidos', route: '/(tabs)/products/best-sellers' },
    { title: 'Promoções', route: '/(tabs)/products/promotions' },
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
          <Stack.Screen name="index" />
          <Stack.Screen name="accelerators" />
          <Stack.Screen name="best-sellers" />
          <Stack.Screen name="promotions" />
          <Stack.Screen name="product-management" />
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
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
      web: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      }
    }),
  },
});