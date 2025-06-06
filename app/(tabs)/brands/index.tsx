import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform, ScrollView, Image, ViewStyle, TextStyle, ImageStyle, FlatList } from 'react-native';
import { router } from 'expo-router';
import { supabase } from '../../../lib/supabase';

interface Brand {
  id: string;
  name: string;
  image_url: string | null;
}

export default function BrandsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [brands, setBrands] = useState<Brand[]>([]);

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    const { data, error } = await supabase
      .from('brands')
      .select('id, name, image_url');

    if (error) {
      console.error('Erro ao buscar marcas:', error);
    } else {
      setBrands((data as Brand[]) || []);
    }
  };

  const filteredBrands = brands.filter(brand =>
    Object.values(brand).some(value =>
      String(value).toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const handleAddBrand = () => {
    router.push('/brands/brand-management');
  };

  const renderBrandItem = ({ item }: { item: Brand }) => (
    <TouchableOpacity 
      key={item.id}
      style={[styles.brandCard, Platform.OS === 'web' && styles.brandCardWeb]}
      onPress={() => router.push({
        pathname: '/brands/brand-management',
        params: { id: item.id }
      })}
    >
      <View style={[styles.logoContainer, Platform.OS === 'web' && styles.logoContainerWeb]}>
        <Image 
          source={item.image_url ? { uri: item.image_url } : undefined}
          style={styles.brandLogo}
          resizeMode="contain"
        />
      </View>
      <View style={[styles.brandInfo, Platform.OS === 'web' && styles.brandInfoWeb]}>
        <Text style={[styles.brandName, Platform.OS === 'web' && styles.brandNameWeb]}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, Platform.OS === 'web' && styles.containerWeb]}>
      <View style={[styles.header, Platform.OS === 'web' && styles.headerWeb]}>
        <Text style={[styles.headerTitle, Platform.OS === 'web' && styles.headerTitleWeb]}>Marcas</Text>
        <TouchableOpacity style={[styles.addButton, Platform.OS === 'web' && styles.addButtonWeb]} onPress={handleAddBrand}>
          {/* Ícone Plus removido */}
        </TouchableOpacity>
      </View>

      <View style={[styles.searchContainer, Platform.OS === 'web' && styles.searchContainerWeb]}>
        {/* Ícone Search removido */}
        <TextInput
          style={[styles.searchInput, Platform.OS === 'web' && styles.searchInputWeb]}
          placeholder="Buscar marcas..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#999"
        />
      </View>

      <FlatList
        data={filteredBrands}
        renderItem={renderBrandItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.brandsGrid, Platform.OS === 'web' && styles.brandsGridWeb]}
        columnWrapperStyle={Platform.OS === 'web' ? styles.brandsGridColumnWrapper : null}
        numColumns={Platform.OS === 'web' ? 3 : 1}
        style={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  } as ViewStyle,
  containerWeb: {
    cursor: 'default',
  } as ViewStyle,
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
  } as ViewStyle,
  headerWeb: {
    cursor: 'default',
  } as ViewStyle,
  headerTitle: {
    fontSize: 24,
    color: '#003B71',
    fontFamily: 'Montserrat-Bold',
  } as TextStyle,
  headerTitleWeb: {
    userSelect: 'none',
  } as TextStyle,
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
  } as ViewStyle,
  addButtonWeb: {
    cursor: 'pointer',
  } as ViewStyle,
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    margin: 16,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  } as ViewStyle,
  searchContainerWeb: {
    cursor: 'default',
  } as ViewStyle,
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Montserrat-Regular',
    color: '#333333',
  } as TextStyle,
  searchInputWeb: {
    userSelect: 'auto',
    outlineStyle: 'none',
  } as TextStyle,
  listContainer: {
    flex: 1,
    paddingHorizontal: 16,
  } as ViewStyle,
  listContainerWeb: {
    cursor: 'default',
  } as ViewStyle,
  brandsGrid: {
    justifyContent: 'space-between',
    gap: 16,
  } as ViewStyle,
  brandsGridWeb: {
    cursor: 'default',
  } as ViewStyle,
  brandsGridColumnWrapper: {
    gap: 16,
  } as ViewStyle,
  brandCard: {
    width: Platform.OS === 'web' ? '32%' : '100%',
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
  } as ViewStyle,
  brandCardWeb: {
    cursor: 'pointer',
  } as ViewStyle,
  logoContainer: {
    height: 165,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  } as ViewStyle,
  logoContainerWeb: {
    cursor: 'default',
  } as ViewStyle,
  brandLogo: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  } as ImageStyle,
  brandInfo: {
    padding: 16,
  } as ViewStyle,
  brandInfoWeb: {
    cursor: 'default',
  } as ViewStyle,
  brandName: {
    fontSize: 18,
    color: '#003B71',
    fontFamily: 'Montserrat-Bold',
    marginBottom: 4,
  } as TextStyle,
  brandNameWeb: {
    userSelect: 'none',
  } as TextStyle,
});