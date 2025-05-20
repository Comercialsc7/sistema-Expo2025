import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, Platform } from 'react-native';
import { Diamond, Upload, ArrowLeft } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';

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
      setProductData(prev => ({ ...prev, image: result.assets[0].uri }));
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
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>Nome do Produto</Text>
              <TextInput
                style={styles.input}
                value={productData.name}
                onChangeText={(text) => setProductData(prev => ({ ...prev, name: text }))}
                placeholder="Ex: Slice Original"
                placeholderTextColor="#999"
              />
            </View>

            <View style={[styles.inputGroup, { flex: 0.4 }]}>
              <Text style={styles.label}>Código</Text>
              <TextInput
                style={styles.input}
                value={productData.code}
                onChangeText={(text) => setProductData(prev => ({ ...prev, code: text }))}
                placeholder="SLI001"
                placeholderTextColor="#999"
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>Preço</Text>
              <TextInput
                style={styles.input}
                value={productData.price}
                onChangeText={(text) => setProductData(prev => ({ ...prev, price: text }))}
                placeholder="R$ 0,00"
                placeholderTextColor="#999"
                keyboardType="decimal-pad"
              />
            </View>

            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>Quantidade por Caixa</Text>
              <TextInput
                style={styles.input}
                value={productData.quantity}
                onChangeText={(text) => setProductData(prev => ({ ...prev, quantity: text }))}
                placeholder="28"
                placeholderTextColor="#999"
                keyboardType="number-pad"
              />
            </View>
          </View>

          <TouchableOpacity
            style={[styles.acceleratorButton, productData.isAccelerator && styles.acceleratorButtonActive]}
            onPress={() => setProductData(prev => ({ ...prev, isAccelerator: !prev.isAccelerator }))}
          >
            <Diamond 
              size={32} 
              color={productData.isAccelerator ? '#FFFFFF' : '#003B71'} 
              strokeWidth={1.5}
            />
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
  },
  row: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  inputGroup: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
    fontFamily: 'Montserrat-Medium',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#333333',
    fontFamily: 'Montserrat-Regular',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
      web: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      }
    }),
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
  },
});