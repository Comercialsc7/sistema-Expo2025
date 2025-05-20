import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Stack, usePathname, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useFonts, Montserrat_400Regular, Montserrat_500Medium, Montserrat_600SemiBold, Montserrat_700Bold } from '@expo-google-fonts/montserrat';
import { SplashScreen } from 'expo-router';
import { Menu, Home, Package, Users, Settings, LogOut } from 'lucide-react-native';
import { Sidebar, MenuItem } from '../components/shared/Sidebar';

export default function RootLayout() {
  useFrameworkReady();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const menuItems: MenuItem[] = [
    { title: 'Início', route: '/(tabs)', icon: Home },
    { title: 'Produtos', route: '/(tabs)/products', icon: Package },
    { title: 'Clientes', route: '/(tabs)/clients', icon: Users },
    { title: 'Configurações', route: '/(tabs)/settings', icon: Settings },
    { title: 'Sair', route: '/login', icon: LogOut, color: '#FF3B30' },
  ];

  const handleNavigation = (route: string) => {
    router.push(route as any);
  };

  const [fontsLoaded, fontError] = useFonts({
    'Montserrat-Regular': Montserrat_400Regular,
    'Montserrat-Medium': Montserrat_500Medium,
    'Montserrat-SemiBold': Montserrat_600SemiBold,
    'Montserrat-Bold': Montserrat_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  const showNavigation = pathname !== '/login' && !pathname.includes('spin-wheel');

  return (
    <View style={styles.container}>
      {showNavigation && (
        <>
          <TouchableOpacity 
            style={styles.menuButton} 
            onPress={() => setIsSidebarOpen(true)}
          >
            <Menu size={24} color="#003B71" />
          </TouchableOpacity>

          <Sidebar 
            isOpen={isSidebarOpen} 
            onClose={() => setIsSidebarOpen(false)}
            onNavigate={handleNavigation}
            menuItems={menuItems}
          />
        </>
      )}

      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="login" />
        <Stack.Screen name="(tabs)" />
      </Stack>
      
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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