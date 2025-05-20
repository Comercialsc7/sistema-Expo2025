import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { router } from 'expo-router';
import { Menu, X, Chrome as Home, Users, Package, Settings, LogOut } from 'lucide-react-native';
import Animated, { 
  useAnimatedStyle, 
  withSpring,
  useSharedValue,
} from 'react-native-reanimated';

const SIDEBAR_WIDTH = 280;

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const translateX = useSharedValue(isOpen ? 0 : -SIDEBAR_WIDTH);

  const menuItems = [
    { 
      title: 'Pedidos',
      route: '/orders',
      icon: Home
    },
    { 
      title: 'Clientes',
      route: '/clients',
      icon: Users
    },
    { 
      title: 'Produtos',
      route: '/products',
      icon: Package
    },
    { 
      title: 'Configurações',
      route: '/settings',
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
    router.push(route);
    onClose();
  };

  const sidebarStyle = useAnimatedStyle(() => {
    translateX.value = withSpring(isOpen ? 0 : -SIDEBAR_WIDTH, {
      damping: 20,
      stiffness: 90,
    });

    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: withSpring(isOpen ? 0.5 : 0),
    zIndex: isOpen ? 1 : -1,
  }));

  return (
    <>
      <Animated.View 
        style={[styles.overlay, overlayStyle]} 
        pointerEvents={isOpen ? 'auto' : 'none'}
        onTouchStart={onClose}
      />

      <Animated.View style={[styles.sidebar, sidebarStyle]}>
        <View style={styles.sidebarHeader}>
          <Text style={styles.sidebarTitle}>Menu</Text>
          <TouchableOpacity onPress={onClose}>
            <X size={24} color="#003B71" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.sidebarContent}>
          {menuItems.map((item, index) => (
            <TouchableOpacity 
              key={index}
              style={styles.menuItem}
              onPress={() => handleNavigation(item.route)}
            >
              <item.icon 
                size={20} 
                color={item.color || '#003B71'} 
                style={styles.menuItemIcon} 
              />
              <Text style={[
                styles.menuItemText,
                item.color && { color: item.color }
              ]}>
                {item.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
  },
  sidebar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: SIDEBAR_WIDTH,
    backgroundColor: '#FFFFFF',
    zIndex: 2,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 0 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
      web: {
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 0 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      }
    }),
  },
  sidebarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: Platform.OS === 'web' ? 16 : 48,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  sidebarTitle: {
    fontSize: 20,
    color: '#003B71',
    fontFamily: 'Montserrat-Bold',
  },
  sidebarContent: {
    flex: 1,
    padding: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  menuItemIcon: {
    marginRight: 12,
  },
  menuItemText: {
    fontSize: 16,
    color: '#333333',
    fontFamily: 'Montserrat-Medium',
  },
});