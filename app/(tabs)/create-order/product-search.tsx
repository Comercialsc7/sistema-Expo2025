import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform, Image, ScrollView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Search, Calendar, Heart } from 'lucide-react-native';
import Animated, { 
  SlideInUp,
  Layout,
  FadeIn
} from 'react-native-reanimated';
import { usePaymentTermsStore } from '../../../store/usePaymentTermsStore';
import { useOrderStore } from '../../../store/useOrderStore';
import { mockProducts, Product } from '../../../data/mocks';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const Diamond = require('../../../assets/images/diamond.png');

export default function ProductSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const { clientId, clientName, paymentTermId } = useLocalSearchParams();
  const paymentTerms = usePaymentTermsStore(state => state.paymentTerms);
  const selectedPaymentTerm = paymentTerms.find(term => term.id === paymentTermId);
  const { addItem } = useOrderStore();

  const filteredProducts = mockProducts.filter(product =>
    Object.values(product).some(value =>
      String(value).toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const handleSelectProduct = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      box: `CX ${product.boxSize} unids.`,
      price: product.price,
      discount: product.discount,
      image: product.image,
      quantity: 1,
      isAccelerator: product.isAccelerator,
      paymentTerm: selectedPaymentTerm
    });
    
    router.push('/(tabs)/create-order');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#003B71" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Adicionar Produto</Text>
      </View>

      {selectedPaymentTerm && (
        <View style={styles.paymentTermContainer}>
          <Calendar size={20} color="#003B71" />
          <Text style={styles.paymentTermText}>
            Prazo de Pagamento: {selectedPaymentTerm.days} dias
          </Text>
        </View>
      )}

      <View style={styles.searchContainer}>
        <Search size={20} color="#666666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar produtos..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#999999"
        />
      </View>

      <ScrollView style={styles.content}>
        {filteredProducts.map((product, index) => (
          <AnimatedTouchableOpacity
            key={product.id}
            style={styles.productCard}
            onPress={() => handleSelectProduct(product)}
            entering={SlideInUp.delay(index * 100).springify()}
            layout={Layout.springify()}
          >
            <View style={styles.productInfo}>
              <View style={styles.productHeader}>
                <Text style={styles.productCode}>{product.code}</Text>
                {product.isAccelerator && (
                  <Image source={Diamond} style={{ width: 30, height: 30 }} />
                )}
              </View>
              <Text style={styles.productName}>{product.name}</Text>
              <Text style={styles.boxSize}>Cx {product.boxSize} unds.</Text>
              <View style={styles.priceRow}>
                <Text style={styles.price}>R$ {product.price.toFixed(2)}</Text>
                {product.discount > 0 && (
                  <View style={styles.discountBadge}>
                    <Text style={styles.discountText}>{product.discount}%</Text>
                  </View>
                )}
              </View>
            </View>
          </AnimatedTouchableOpacity>
        ))}
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
    backgroundColor: '#FFFFFF',
    padding: 16,
    paddingTop: Platform.OS === 'web' ? 16 : 48,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    color: '#003B71',
    fontFamily: 'Montserrat-Bold',
    marginLeft: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    margin: 16,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333333',
    fontFamily: 'Montserrat-Regular',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      }
    }),
  },
  productInfo: {
    flex: 1,
  },
  productHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  productCode: {
    fontSize: 12,
    color: '#666666',
    fontFamily: 'Montserrat-Medium',
  },
  productName: {
    fontSize: 14,
    color: '#333333',
    fontFamily: 'Montserrat-Bold',
    marginBottom: 4,
  },
  boxSize: {
    fontSize: 12,
    color: '#666666',
    fontFamily: 'Montserrat-Regular',
    marginBottom: 4,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  price: {
    fontSize: 16,
    color: '#003B71',
    fontFamily: 'Montserrat-Bold',
    marginRight: 8,
  },
  discountBadge: {
    backgroundColor: '#FFE5E5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  discountText: {
    fontSize: 12,
    color: '#FF3B30',
    fontFamily: 'Montserrat-Bold',
  },
  paymentTermContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F0FE',
    padding: 12,
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 8,
  },
  paymentTermText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#003B71',
    fontFamily: 'Montserrat-Medium',
  },
});