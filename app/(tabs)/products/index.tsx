import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, Platform } from 'react-native';
import { router } from 'expo-router';
import { Plus, Search } from 'lucide-react-native';
import { mockProducts, Product } from '../../../data/mocks';

const Diamond = require('../../../assets/images/diamond.png');

export default function ProductsScreen() {
  const handleAddProduct = () => {
    router.push('/products/product-management');
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <TouchableOpacity 
      style={styles.productCard}
      onPress={() => router.push({
        pathname: '/products/product-management',
        params: { id: item.id }
      })}
    >
      {item.isAccelerator ? (
        <>
          <Image source={{ uri: item.image }} style={styles.productImage} />
          <View style={styles.productInfo}>
            <Text style={styles.productName}>{item.name}</Text>
            <Text style={styles.productCode}>Código: {item.code}</Text>
            <View style={styles.productDetails}>
              <Text style={styles.productPrice}>R$ {item.price.toFixed(2)}</Text>
            </View>
          </View>
        </>
      ) : (
        <View style={styles.productInfoNoImage}>
          <Text style={styles.productName}>{item.name}</Text>
          <Text style={styles.productCode}>Código: {item.code}</Text>
          <View style={styles.productDetails}>
            <Text style={styles.productPrice}>R$ {item.price.toFixed(2)}</Text>
          </View>
        </View>
      )}
    </TouchableOpacity>
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
    flexDirection: 'row',
    alignItems: 'center',
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
    width: 120,
    height: 120,
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
  productInfoNoImage: {
    padding: 16,
    flex: 1,
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
  productDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});