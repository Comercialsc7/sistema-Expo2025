import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, ScrollView, Image, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useProducts } from '../../../hooks/useProducts';

const Diamond = require('../../../assets/images/diamond.png');

export default function AcceleratorManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const { products, loading, error, toggleAccelerator } = useProducts();

  const filteredProducts = products.filter(product =>
    Object.values(product).some(value =>
      String(value).toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const handleToggleAccelerator = async (productId: string, currentValue: boolean) => {
    await toggleAccelerator(productId, !currentValue);
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#003B71" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <View style={{ width: 24, height: 24, backgroundColor: '#003B71' }} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Produtos Aceleradores</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={{ width: 20, height: 20, backgroundColor: '#666' }} />
        <Text style={styles.searchPlaceholder}>Buscar produtos...</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {filteredProducts.map((product) => (
          <TouchableOpacity
            key={product.id}
            style={styles.productCard}
            onPress={() => handleToggleAccelerator(product.id, product.is_accelerator)}
          >
            <Image source={{ uri: product.image_url }} style={styles.productImage} />
            <View style={styles.productInfo}>
              <Text style={styles.productName}>{product.name}</Text>
              <Text style={styles.productCode}>Código: {product.code}</Text>
              <Text style={styles.productPrice}>R$ {product.price.toFixed(2)}</Text>
            </View>
            <View style={[
              styles.acceleratorIndicator,
              product.is_accelerator && styles.acceleratorActive
            ]}>
              <Image source={Diamond} style={{ width: 30, height: 30 }} />
            </View>
          </TouchableOpacity>
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
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 16,
    fontFamily: 'Montserrat-Regular',
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
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    color: '#003B71',
    fontFamily: 'Montserrat-Bold',
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
  content: {
    padding: 16,
  },
  productCard: {
    flexDirection: 'row',
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
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      }
    }),
  },
  productImage: {
    width: 80,
    height: 80,
  },
  productInfo: {
    flex: 1,
    padding: 12,
  },
  productName: {
    fontSize: 16,
    color: '#003B71',
    fontFamily: 'Montserrat-Bold',
    marginBottom: 4,
  },
  productCode: {
    fontSize: 14,
    color: '#666666',
    fontFamily: 'Montserrat-Regular',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 14,
    color: '#333333',
    fontFamily: 'Montserrat-SemiBold',
  },
  acceleratorIndicator: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 16,
    borderWidth: 2,
    borderColor: '#003B71',
  },
  acceleratorActive: {
    backgroundColor: '#003B71',
    borderColor: '#003B71',
  },
});