import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Slot, router } from 'expo-router';
import { Sidebar } from '../../../components/shared/Sidebar';

interface TabBarIconProps {
  color: string;
  size?: number;
}

export default function ProductsLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  const menuItems = [
    { title: 'Produtos', route: '/products' },
    { title: 'Itens Aceleradores', route: '/products/accelerators' },
    { title: 'Mais Vendidos', route: '/products/best-sellers' },
    { title: 'Promoções', route: '/products/promotions' },
  ];

  const handleNavigation = (route: string) => {
    router.push(route);
    setIsSidebarOpen(false);
  };

  return (
    <View style={styles.container}>
      <Sidebar 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onNavigate={handleNavigation}
        menuItems={menuItems}
      />

      <View style={styles.main}>
        <Slot />
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
});