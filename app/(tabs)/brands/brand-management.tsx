import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Platform, Image, ViewStyle, TextStyle, ImageStyle } from 'react-native';
import { ArrowLeft, Upload } from 'lucide-react-native';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import InputGroup from '../../../components/shared/InputGroup';
import { optimizeImage } from '../../../lib/imageUtils';

export default function BrandManagement() {
  const [brandData, setBrandData] = useState({
    name: '',
    code: '',
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
      setBrandData(prev => ({ ...prev, image: optimizedUri }));
    }
  };

  const handleSave = () => {
    console.log('Brand data:', brandData);
    router.back();
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#003B71" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cadastro de Marca</Text>
      </View>

      <View style={styles.content}>
        <TouchableOpacity style={styles.imageUpload} onPress={pickImage}>
          {brandData.image ? (
            <Image source={{ uri: brandData.image }} style={styles.previewImage} resizeMode="contain" />
          ) : (
            <View style={styles.uploadPlaceholder}>
              <Upload size={32} color="#003B71" />
              <Text style={styles.uploadText}>Upload do Logo</Text>
            </View>
          )}
        </TouchableOpacity>

        <View style={styles.form}>
          <InputGroup
            label="Nome da Marca"
            value={brandData.name}
            onChangeText={(text: string) => setBrandData(prev => ({ ...prev, name: text }))}
            placeholder="Ex: Slice"
          />

          <InputGroup
            label="Código"
            value={brandData.code}
            onChangeText={(text: string) => setBrandData(prev => ({ ...prev, code: text }))}
            placeholder="Ex: SLI"
            maxLength={3}
            autoCapitalize="characters"
          />

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Salvar Marca</Text>
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
  } as ViewStyle,
  header: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    paddingTop: Platform.OS === 'web' ? 16 : 48,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    flexDirection: 'row',
    alignItems: 'center',
  } as ViewStyle,
  backButton: {
    marginRight: 16,
  } as ViewStyle,
  headerTitle: {
    fontSize: 24,
    color: '#003B71',
    fontFamily: 'Montserrat-Bold',
  } as TextStyle,
  content: {
    padding: 16,
  } as ViewStyle,
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
  } as ViewStyle,
  uploadPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  } as ViewStyle,
  uploadText: {
    marginTop: 12,
    color: '#003B71',
    fontSize: 16,
    fontFamily: 'Montserrat-Medium',
  } as TextStyle,
  previewImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F8F9FA',
  } as ImageStyle,
  form: {
    gap: 16,
  } as ViewStyle,
  saveButton: {
    backgroundColor: '#0088CC',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  } as ViewStyle,
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Montserrat-Bold',
  } as TextStyle,
});