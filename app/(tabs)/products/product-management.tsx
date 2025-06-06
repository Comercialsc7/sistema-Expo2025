import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, Platform, ViewStyle, TextStyle } from 'react-native';
import { Upload, ArrowLeft } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import InputGroup from '../../../components/shared/InputGroup';
import { optimizeImage } from '../../../lib/imageUtils';

const Diamond = require('../../../assets/images/diamond.png');

export default function ProductManagement() {
  const [productData, setProductData] = useState({
    name: '',
    code: '',
    price: '',
    quantity: '',
    isAccelerator: false,
    image: null as string | null,
  });

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const optimizedUri = await optimizeImage(result.assets[0].uri, {
        maxWidth: 800,
        maxHeight: 800,
        quality: 0.8
      });
      setProductData(prev => ({ ...prev, image: optimizedUri }));
    }
  };

  const handleSave = () => {
    console.log('Product data:', productData);
    router.back();
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#003B71" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cadastro de Produto</Text>
      </View>

      <View style={styles.content}>
        <TouchableOpacity style={styles.imageUpload} onPress={pickImage}>
          {productData.image ? (
            <Image source={{ uri: productData.image }} style={styles.previewImage} />
          ) : (
            <View style={styles.uploadPlaceholder}>
              <Upload size={32} color="#003B71" />
              <Text style={styles.uploadText}>Upload da Imagem</Text>
            </View>
          )}
        </TouchableOpacity>

        <View style={styles.form}>
          <View style={styles.row}>
            <InputGroup
              label="Nome do Produto"
              value={productData.name}
              onChangeText={(text: string) => setProductData(prev => ({ ...prev, name: text }))}
              placeholder="Ex: Slice Original"
              style={{ flex: 1, marginRight: 8 }}
            />

            <InputGroup
              label="Código"
              value={productData.code}
              onChangeText={(text: string) => setProductData(prev => ({ ...prev, code: text }))}
              placeholder="SLI001"
              style={{ flex: 0.4 }}
            />
          </View>

          <View style={styles.row}>
            <InputGroup
              label="Preço"
              value={productData.price}
              onChangeText={(text: string) => setProductData(prev => ({ ...prev, price: text }))}
              placeholder="R$ 0,00"
              keyboardType="decimal-pad"
              style={{ flex: 1, marginRight: 8 }}
            />

            <InputGroup
              label="Quantidade por Caixa"
              value={productData.quantity}
              onChangeText={(text: string) => setProductData(prev => ({ ...prev, quantity: text }))}
              placeholder="28"
              keyboardType="number-pad"
              style={{ flex: 1 }}
            />
          </View>

          <TouchableOpacity
            style={[styles.acceleratorButton, productData.isAccelerator && styles.acceleratorButtonActive]}
            onPress={() => setProductData(prev => ({ ...prev, isAccelerator: !prev.isAccelerator }))}
          >
            <Image source={Diamond} style={{ width: 30, height: 30 }} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Salvar Produto</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
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
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 24,
    color: '#003B71',
    fontFamily: 'Montserrat-Bold',
  },
  content: {
    padding: 16,
  },
  imageUpload: {
    width: '100%',
    height: 240,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 24,
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
  uploadPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  uploadText: {
    marginTop: 12,
    color: '#003B71',
    fontSize: 16,
    fontFamily: 'Montserrat-Medium',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  form: {
    gap: 16,
  } as ViewStyle,
  row: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  acceleratorButton: {
    alignSelf: 'center',
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 16,
    borderWidth: 1.5,
    borderColor: '#003B71',
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
  acceleratorButtonActive: {
    backgroundColor: '#003B71',
    borderColor: '#003B71',
  },
  saveButton: {
    backgroundColor: '#0088CC',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Montserrat-Bold',
  } as TextStyle,
});