import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Stack, router } from 'expo-router';
import { Menu, X, Chrome as Home, Users, Package, Settings, LogOut } from 'lucide-react-native';
import Animated, { 
  useAnimatedStyle, 
  withTiming,
  useSharedValue,
  withSpring
} from 'react-native-reanimated';

const SIDEBAR_WIDTH = 280;

export default function AppLayout() {
  const [isOpen, setIsOpen] = useState(false);
  const translateX = useSharedValue(-SIDEBAR_WIDTH);

  const toggleSidebar = () => {
    translateX.value = withSpring(isOpen ? -SIDEBAR_WIDTH : 0, {
      damping: 20,
      stiffness: 90,
    });
    setIsOpen(!isOpen);
  };

  const sidebarStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: withTiming(isOpen ? 0.5 : 0),
    zIndex: isOpen ? 1 : -1,
  }));

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
    toggleSidebar();
  };

  return (
    <View style={styles.container}>
      {/* Overlay */}
      <Animated.View 
        style={[styles.overlay, overlayStyle]} 
        pointerEvents={isOpen ? 'auto' : 'none'}
        onTouchStart={toggleSidebar}
      />

      {/* Sidebar */}
      <Animated.View style={[styles.sidebar, sidebarStyle]}>
        <View style={styles.sidebarHeader}>
          <Text style={styles.sidebarTitle}>Menu</Text>
          <TouchableOpacity onPress={toggleSidebar}>
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

      {/* Main Content */}
      <View style={styles.main}>
        <TouchableOpacity 
          style={styles.menuButton} 
          onPress={toggleSidebar}
        >
          <Menu size={24} color="#003B71" />
        </TouchableOpacity>

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