import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, Platform } from 'react-native';
import { router } from 'expo-router';
import { Plus, Search, Diamond } from 'lucide-react-native';

const mockProducts = [
  {
    id: '1',
    name: 'Slice Original',
    code: 'SLI001',
    price: 89.90,
    quantity: 28,
    isAccelerator: true,
    image: 'https://images.unsplash.com/photo-1627843563095-f6e94676cfe0?w=200&h=200&fit=crop'
  },
  {
    id: '2',
    name: 'Coca-Cola 2L',
    code: 'COC002',
    price: 8.99,
    quantity: 6,
    isAccelerator: false,
    image: 'https://images.unsplash.com/photo-1570831739435-6601aa3fa4fb?w=200&h=200&fit=crop'
  },
];

export default function ProductsScreen() {
  const handleAddProduct = () => {
    router.push('/products/product-management');
  };

  const renderProduct = ({ item }) => (
    <View style={styles.productCard}>
      <Image source={{ uri: item.image }} style={styles.productImage} />
      {item.isAccelerator && (
        <View style={styles.acceleratorBadge}>
          <Diamond size={16} color="#FFFFFF" />
        </View>
      )}
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productCode}>Código: {item.code}</Text>
        <Text style={styles.productPrice}>R$ {item.price.toFixed(2)}</Text>
        <Text style={styles.productQuantity}>Cx {item.quantity} unds.</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Produtos</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddProduct}>
          <Plus size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Search size={20} color="#666" style={styles.searchIcon} />
        <Text style={styles.searchPlaceholder}>Buscar produtos...</Text>
      </View>

      <FlatList
        data={mockProducts}
        renderItem={renderProduct}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.productList}
        showsVerticalScrollIndicator={false}
        numColumns={Platform.OS === 'web' ? 2 : 1}
        columnWrapperStyle={Platform.OS === 'web' ? { gap: 16 } : undefined}
      />
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
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    marginLeft: Platform.OS === 'web' ? 56 : 0,
  },
  headerTitle: {
    fontSize: 24,
    color: '#003B71',
    fontFamily: 'Montserrat-Bold',
  },
  addButton: {
    backgroundColor: '#0088CC',
    width: 40,
    height: 40,
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
  searchPlaceholder: {
    color: '#999999',
    fontSize: 16,
    fontFamily: 'Montserrat-Regular',
  },
  productList: {
    padding: 16,
  },
  productCard: {
    flex: Platform.OS === 'web' ? 1 : undefined,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
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
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      }
    }),
  },
  productImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  acceleratorBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#003B71',
    padding: 8,
    borderRadius: 20,
  },
  productInfo: {
    padding: 16,
  },
  productName: {
    fontSize: 18,
    color: '#003B71',
    fontFamily: 'Montserrat-Bold',
    marginBottom: 4,
  },
  productCode: {
    fontSize: 14,
    color: '#666666',
    fontFamily: 'Montserrat-Regular',
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 16,
    color: '#333333',
    fontFamily: 'Montserrat-SemiBold',
    marginBottom: 4,
  },
  productQuantity: {
    fontSize: 14,
    color: '#666666',
    fontFamily: 'Montserrat-Regular',
  },
});