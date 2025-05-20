import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Image, Alert } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useSpinResultsStore } from '../../../store/useSpinResultsStore';

const premios = [
  'Alexa Echo Pop',
  'Smartwatch',
  'Caixinha de Som',
  'AirFryer',
  'Cafeteira Dolce Gusto',
];

export default function SpinWheelScreen() {
  const [selected, setSelected] = useState(-1);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const params = useLocalSearchParams();
  const girosDisponiveis = Number(params.girosDisponiveis) || 0;

  const { addResult } = useSpinResultsStore();

  const isLastGiro = girosDisponiveis === 1;

  useEffect(() => {
    if (selected !== -1 && capturedImage) {
      handleConfirmGiro();
    }
  }, [selected, capturedImage]);

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão Negada', 'Precisamos da permissão da câmera para tirar fotos.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setCapturedImage(result.assets[0].uri);
    }
  };

  const handleConfirmGiro = () => {
    const premioSelecionado = premios[selected];
    
    addResult({ prize: premioSelecionado, photoUri: capturedImage! });

    if (!isLastGiro) {
      setCapturedImage(null);
      setSelected(-1);
      router.push({
        pathname: '/(tabs)/create-order/spin-wheel',
        params: { girosDisponiveis: girosDisponiveis - 1 }
      });
    } else {
      router.push({
        pathname: '/(tabs)/create-order/complete',
        params: { 
          // Exemplo: você precisaria adicionar aqui todos os parâmetros originais do pedido
          // subtotal: params.subtotal, // Isso pode ser necessário
          // itens: params.itens,
          // ... outros parâmetros do pedido ...
        }
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Giro da Sorte</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.instruction}>Marque o Prêmio e tire uma{"\n"}foto de comprovação.</Text>
        <View style={styles.optionsList}>
          {premios.map((premio, idx) => (
            <TouchableOpacity
              key={premio}
              style={[styles.optionRow, selected === idx && styles.optionRowSelected]}
              onPress={() => setSelected(idx)}
              activeOpacity={0.8}
            >
              <View style={[styles.checkbox, selected === idx && styles.checkboxChecked]}>
                {selected === idx && <View style={styles.checkboxInner} />}
              </View>
              <Text style={[styles.optionText, selected === idx && styles.optionTextSelected]}>{premio}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity style={styles.photoButton} onPress={takePhoto}>
          <Image
            source={capturedImage ? { uri: capturedImage } : require('../../../assets/images/EnviarFoto.png')}
            style={styles.photoIcon}
          />
        </TouchableOpacity>
        <Text style={styles.photoLabel}>{capturedImage ? 'Foto Capturada' : 'Enviar Foto'}</Text>

        {/* Botão de confirmação para Proximo Giro ou Finalizar Giros */}
        {selected !== -1 && capturedImage && (
          <TouchableOpacity
            style={[styles.confirmButton, isLastGiro ? styles.confirmButtonWhite : styles.confirmButtonPurple]}
            onPress={handleConfirmGiro}
          >
            {isLastGiro ? (
              <Text style={[styles.confirmButtonText, styles.confirmButtonTextPurple]}>Finalizar Giros</Text> // Texto para o último giro
            ) : (
              <Text style={[styles.confirmButtonText, styles.confirmButtonTextPurple]}>Próximo Giro</Text> // Texto para outros giros
            )}
          </TouchableOpacity>
        )}

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1560A8',
    borderRadius: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: Platform.OS === 'web' ? 16 : 48,
  },
  headerTitle: {
    fontSize: 22,
    color: '#fff',
    fontFamily: 'Montserrat-Bold',
  },
  content: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
  },
  instruction: {
    color: '#fff',
    fontSize: 15,
    fontFamily: 'Montserrat-Bold',
    marginBottom: 18,
    textAlign: 'left',
    alignSelf: 'flex-start',
  },
  optionsList: {
    width: '100%',
    marginBottom: 18,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  optionRowSelected: {
    borderColor: '#FFB300',
    backgroundColor: '#FFB300',
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#fff',
    backgroundColor: '#1560A8',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    borderColor: '#FFB300',
    backgroundColor: '#FFB300',
  },
  checkboxInner: {
    width: 16,
    height: 16,
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  optionText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Montserrat-Bold',
  },
  optionTextSelected: {
    color: '#fff',
  },
  photoButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFB300',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 4,
  },
  photoIcon: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
  },
  photoLabel: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Montserrat-Medium',
    marginBottom: 18,
  },
  confirmButton: { // Estilos do botão de confirmação
    borderRadius: 12,
    marginTop: 12,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 50,
  },
  confirmButtonPurple: { // Fundo roxo para 'Próximo Giro'
    backgroundColor: '#941b80',
  },
  confirmButtonWhite: { // Fundo branco para 'Finalizar Giros'
     backgroundColor: '#fff',
  },
  confirmButtonText: { // Estilo base do texto
    fontWeight: 'bold',
    fontSize: 17,
  },
  confirmButtonTextPurple: { // Texto branco para fundo roxo
    color: '#fff',
  },
}); 