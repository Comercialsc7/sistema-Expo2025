import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Stack, router } from 'expo-router';
import { Menu, X } from 'lucide-react-native';
import Animated, { 
  useAnimatedStyle, 
  withTiming,
  useSharedValue,
  withSpring
} from 'react-native-reanimated';

const SIDEBAR_WIDTH = 280;

export default function ProductsLayout() {
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
    { title: 'Todos os Produtos', route: '/(tabs)/products' },
    { title: 'Itens Aceleradores', route: '/(tabs)/products/accelerators' },
    { title: 'Mais Vendidos', route: '/(tabs)/products/best-sellers' },
    { title: 'Promoções', route: '/(tabs)/products/promotions' },
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
              <Text style={styles.menuItemText}>{item.title}</Text>
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
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
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