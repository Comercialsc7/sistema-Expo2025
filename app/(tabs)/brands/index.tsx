import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform, ScrollView, Image } from 'react-native';
import { Search, Plus } from 'lucide-react-native';
import { router } from 'expo-router';
import { mockBrands } from '../../../data/mocks';

export default function BrandsScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBrands = mockBrands.filter(brand =>
    Object.values(brand).some(value =>
      String(value).toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const handleAddBrand = () => {
    router.push('/brands/brand-management');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Marcas</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddBrand}>
          <Plus size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Search size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar marcas..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#999"
        />
      </View>

      <ScrollView style={styles.listContainer}>
        <View style={styles.brandsGrid}>
          {filteredBrands.map((brand) => (
            <TouchableOpacity 
              key={brand.id}
              style={styles.brandCard}
              onPress={() => router.push({
                pathname: '/brands/brand-management',
                params: { id: brand.id }
              })}
            >
              <View style={styles.logoContainer}>
                <Image 
                  source={{ uri: brand.image }} 
                  style={styles.brandLogo}
                  resizeMode="contain"
                />
              </View>
              <View style={styles.brandInfo}>
                <Text style={styles.brandName}>{brand.name}</Text>
                <Text style={styles.brandCode}>Código: {brand.code}</Text>
              </View>
            </TouchableOpacity>
          ))}
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
        shadowColor: '#0088CC',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
      web: {
        boxShadow: '0 4px 14px rgba(0, 136, 204, 0.3)',
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
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Montserrat-Regular',
    color: '#333333',
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  brandsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  brandCard: {
    width: Platform.OS === 'web' ? 'calc(33.33% - 11px)' : '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
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
  logoContainer: {
    height: 160,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  brandLogo: {
    width: '100%',
    height: '100%',
  },
  brandInfo: {
    padding: 16,
  },
  brandName: {
    fontSize: 18,
    color: '#003B71',
    fontFamily: 'Montserrat-Bold',
    marginBottom: 4,
  },
  brandCode: {
    fontSize: 14,
    color: '#666666',
    fontFamily: 'Montserrat-Regular',
  },
});