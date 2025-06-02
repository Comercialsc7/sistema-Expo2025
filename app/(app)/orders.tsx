import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, Platform, Dimensions } from 'react-native';
import { Share2, Menu, Chrome as Home, Users, Package, Settings, LogOut } from 'lucide-react-native';
import { router } from 'expo-router';
import { MovingBorderButton } from '../../components/ui/moving-border';
import Animated, { 
  useAnimatedStyle, 
  withTiming, 
  useSharedValue,
  withSequence,
  withDelay
} from 'react-native-reanimated';
import { useBannerStore } from '../../store/useBannerStore';
import { Sidebar, MenuItem } from '../../components/shared/Sidebar';
import { useNavigation } from '../../hooks/useNavigation';

const mockBrands = [
  { 
    id: '1', 
    name: 'Slice', 
    image: 'https://slicebrasil.com.br/wp-content/uploads/2024/12/logo.svg' 
  },
  { 
    id: '2', 
    name: 'Nestlé', 
    image: 'https://assets.ype.ind.br/assets/logo_ype_3d.png' 
  },
  { 
    id: '3', 
    name: 'Bauducco', 
    image: 'https://www.lojabauducco.com.br/arquivos/logo-bauducco.png?v=638322222120300000' 
  },
  { 
    id: '4', 
    name: 'Heinz', 
    image: 'https://kreafolk.com/cdn/shop/articles/heinz-logo-design-history-and-evolution-kreafolk_51be050e-1ba4-4aad-a0d4-9f7c30b6787b.jpg?v=1717725012&width=2048' 
  },
];

const mockProducts = [
  {
    id: '1',
    name: 'Slice Original',
    price: 89.90,
    discount: 5,
    quantity: 28,
    image: 'https://images.unsplash.com/photo-1627843563095-f6e94676cfe0?w=200&h=200&fit=crop'
  },
  {
    id: '2',
    name: 'Slice Maçã Verde',
    price: 89.90,
    discount: 5,
    quantity: 28,
    image: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=200&h=200&fit=crop'
  },
  {
    id: '3',
    name: 'Slice Laranja',
    price: 89.90,
    discount: 10,
    quantity: 28,
    image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=200&h=200&fit=crop'
  },
  {
    id: '4',
    name: 'Slice Limão',
    price: 89.90,
    discount: 5,
    quantity: 28,
    image: 'https://images.unsplash.com/photo-1596392301391-e8622b210bd4?w=200&h=200&fit=crop'
  },
  {
    id: '5',
    name: 'Slice Uva',
    price: 89.90,
    discount: 15,
    quantity: 28,
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=200&h=200&fit=crop'
  },
  {
    id: '6',
    name: 'Slice Morango',
    price: 89.90,
    discount: 5,
    quantity: 28,
    image: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=200&h=200&fit=crop'
  },
  {
    id: '7',
    name: 'Slice Maracujá',
    price: 89.90,
    discount: 20,
    quantity: 28,
    image: 'https://images.unsplash.com/photo-1546548970-71785318a17b?w=200&h=200&fit=crop'
  },
  {
    id: '8',
    name: 'Slice Pêssego',
    price: 89.90,
    discount: 5,
    quantity: 28,
    image: 'https://images.unsplash.com/photo-1595124245030-41448b199d6d?w=200&h=200&fit=crop'
  },
  {
    id: '9',
    name: 'Slice Manga',
    price: 89.90,
    discount: 10,
    quantity: 28,
    image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=200&h=200&fit=crop'
  },
  {
    id: '10',
    name: 'Slice Abacaxi',
    price: 89.90,
    discount: 5,
    quantity: 28,
    image: 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=200&h=200&fit=crop'
  },
  {
    id: '11',
    name: 'Slice Melancia',
    price: 89.90,
    discount: 15,
    quantity: 28,
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=200&h=200&fit=crop'
  },
  {
    id: '12',
    name: 'Slice Coco',
    price: 89.90,
    discount: 5,
    quantity: 28,
    image: 'https://images.unsplash.com/photo-1581375321224-79da6fd32f6e?w=200&h=200&fit=crop'
  }
];

export default function OrdersScreen() {
  const { banners } = useBannerStore();
  const [currentBanner, setCurrentBanner] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const fadeAnim = useSharedValue(1);
  const screenWidth = Dimensions.get('window').width;
  const { navigateTo } = useNavigation();

  const menuItems: MenuItem[] = [
    { 
      title: 'Página Inicial',
      route: '/(tabs)/orders',
      icon: Home
    },
    { 
      title: 'Clientes',
      route: '/(tabs)/clients',
      icon: Users
    },
    { 
      title: 'Produtos',
      route: '/(tabs)/products',
      icon: Package
    },
    { 
      title: 'Configurações',
      route: '/(tabs)/settings',
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
    navigateTo(route);
    setIsOpen(false);
  };

  useEffect(() => {
    if (!banners || banners.length === 0) return;

    const interval = setInterval(() => {
      fadeAnim.value = withSequence(
        withTiming(0, { duration: 300 }),
        withDelay(100, withTiming(1, { duration: 300 }))
      );
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [banners]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: fadeAnim.value,
  }));

  const handleViewAllBrands = () => {
    navigateTo('/brands' as any);
  };

  const handleOrder = () => {
    navigateTo('/(tabs)/create-order/select-client');
  };

  const handleSyncPress = () => {
    navigateTo('/sync-orders');
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

      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity style={styles.shareButton} onPress={handleSyncPress}>
            <Share2 size={24} color="#003B71" />
          </TouchableOpacity>
        </View>
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeText}>Bem-vindo</Text>
          <Text style={styles.userName}>Vendedor</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {banners && banners.length > 0 && banners[currentBanner] && (
          <Animated.View style={[styles.bannerContainer, animatedStyle]}>
            <Image
              source={{ uri: banners[currentBanner].image }}
              style={styles.bannerImage}
            />
            <View style={[
              styles.bannerContent,
              { backgroundColor: banners[currentBanner].backgroundColor + '99' }
            ]}>
              <Text style={styles.bannerTitle}>{banners[currentBanner].title}</Text>
              <Text style={styles.bannerSubtitle}>{banners[currentBanner].subtitle}</Text>
            </View>
            <View style={styles.bannerIndicators}>
              {banners.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.indicator,
                    { backgroundColor: index === currentBanner ? '#FFFFFF' : 'rgba(255, 255, 255, 0.5)' }
                  ]}
                />
              ))}
            </View>
          </Animated.View>
        )}

        <View style={styles.brandsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Marcas</Text>
            <TouchableOpacity 
              style={styles.viewAllButton} 
              onPress={handleViewAllBrands}
            >
              <Text style={styles.viewAllText}>Ver todas</Text>
            </TouchableOpacity>
          </View>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            style={styles.brandsScroll}
          >
            {mockBrands.map((brand) => (
              <TouchableOpacity 
                key={brand.id} 
                style={styles.brandItem}
                onPress={() => navigateTo('/brands' as any)}
              >
                <Image 
                  source={{ uri: brand.image }} 
                  style={styles.brandImage}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.productsSection}>
          <View style={styles.sectionHeader}>
            <View style={styles.titleContainer}>
              <Image 
                source={{ uri: 'https://img.icons8.com/?size=100&id=G6Rd2soHM2Xn&format=png&color=000000' }}
                style={styles.titleIcon}
              />
              <Text style={styles.sectionTitle}>Itens Aceleradores</Text>
            </View>
            <TouchableOpacity 
              style={styles.viewAllButton} 
              onPress={() => navigateTo('/(tabs)/products' as any)}
            >
              <Text style={styles.viewAllText}>Ver todos</Text>
            </TouchableOpacity>
          </View>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            style={styles.productsScroll}
          >
            {mockProducts.slice(0, 6).map((product) => (
              <TouchableOpacity 
                key={product.id} 
                style={styles.productItem}
                onPress={() => navigateTo('/(tabs)/products' as any)}
              >
                <Image 
                  source={{ uri: product.image }} 
                  style={styles.productImage}
                />
                <View style={styles.productInfo}>
                  <Text style={styles.productName}>{product.name}</Text>
                  <View style={styles.priceContainer}>
                    <Text style={styles.productPrice}>
                      R$ {product.price.toFixed(2)}
                    </Text>
                    {product.discount > 0 && (
                      <View style={styles.discountBadge}>
                        <Text style={styles.discountText}>
                          -{product.discount}%
                        </Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.productQuantity}>
                    {product.quantity} unidades
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.orderButtonContainer}>
          <MovingBorderButton
            onPress={handleOrder}
            style={styles.orderButton}
          >
            <Text style={styles.orderButtonText}>Fazer Pedido</Text>
          </MovingBorderButton>
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
  header: {
    paddingTop: Platform.OS === 'web' ? 16 : 48,
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 16,
  },
  shareButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeContainer: {
    marginBottom: 8,
  },
  welcomeText: {
    fontSize: 16,
    color: '#666666',
    fontFamily: 'Montserrat-Regular',
  },
  userName: {
    fontSize: 24,
    color: '#003B71',
    fontFamily: 'Montserrat-Bold',
  },
  bannerContainer: {
    margin: 16,
    borderRadius: 16,
    overflow: 'hidden',
    height: 200,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  bannerContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  bannerTitle: {
    fontSize: 24,
    color: '#FFFFFF',
    fontFamily: 'Montserrat-Bold',
    marginBottom: 4,
  },
  bannerSubtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    fontFamily: 'Montserrat-Regular',
  },
  bannerIndicators: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    flexDirection: 'row',
    gap: 8,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  brandsSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    color: '#003B71',
    fontFamily: 'Montserrat-Bold',
  },
  viewAllButton: {
    padding: 8,
  },
  viewAllText: {
    fontSize: 14,
    color: '#003B71',
    fontFamily: 'Montserrat-Medium',
  },
  brandsScroll: {
    paddingLeft: 16,
  },
  brandItem: {
    width: 120,
    height: 80,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginRight: 16,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      }
    }),
  },
  brandImage: {
    width: '100%',
    height: '100%',
  },
  productsSection: {
    marginBottom: 24,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  titleIcon: {
    width: 24,
    height: 24,
  },
  productsScroll: {
    paddingLeft: 16,
  },
  productItem: {
    width: 160,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginRight: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      }
    }),
  },
  productImage: {
    width: '100%',
    height: 160,
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 14,
    color: '#003B71',
    fontFamily: 'Montserrat-Medium',
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    color: '#003B71',
    fontFamily: 'Montserrat-Bold',
  },
  discountBadge: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  discountText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontFamily: 'Montserrat-Bold',
  },
  productQuantity: {
    fontSize: 12,
    color: '#666666',
    fontFamily: 'Montserrat-Regular',
  },
  orderButtonContainer: {
    padding: 16,
    marginBottom: 24,
  },
  orderButton: {
    backgroundColor: '#003B71',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  orderButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontFamily: 'Montserrat-Bold',
  },
}); 