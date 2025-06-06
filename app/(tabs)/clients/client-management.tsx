import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Platform } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { useNavigation } from '../../../hooks/useNavigation';
import InputGroup from '../../../components/shared/InputGroup';

export default function ClientManagement() {
  const [clientData, setClientData] = useState({
    code: '',
    name: '',
    fantasyName: '',
    cnpj: '',
  });

  const { goBack } = useNavigation();

  const handleSave = () => {
    console.log('Client data:', clientData);
    goBack();
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} style={styles.backButton}>
          <ArrowLeft size={24} color="#003B71" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cadastro de Cliente</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.form}>
          <View style={styles.row}>
            <InputGroup label="Código" style={{ flex: 0.4 }}>
              <TextInput
                style={styles.input}
                value={clientData.code}
                onChangeText={(text) => setClientData(prev => ({ ...prev, code: text }))}
                placeholder="001"
                placeholderTextColor="#999"
              />
            </InputGroup>
          </View>

          <InputGroup label="Razão Social">
            <TextInput
              style={styles.input}
              value={clientData.name}
              onChangeText={(text) => setClientData(prev => ({ ...prev, name: text }))}
              placeholder="Ex: Silva & Cia Ltda"
              placeholderTextColor="#999"
            />
          </InputGroup>

          <InputGroup label="Nome Fantasia">
            <TextInput
              style={styles.input}
              value={clientData.fantasyName}
              onChangeText={(text) => setClientData(prev => ({ ...prev, fantasyName: text }))}
              placeholder="Ex: Supermercado Silva"
              placeholderTextColor="#999"
            />
          </InputGroup>

          <InputGroup label="CNPJ">
            <TextInput
              style={styles.input}
              value={clientData.cnpj}
              onChangeText={(text) => setClientData(prev => ({ ...prev, cnpj: text }))}
              placeholder="00.000.000/0000-00"
              placeholderTextColor="#999"
              keyboardType="numeric"
            />
          </InputGroup>

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Salvar Cliente</Text>
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
  form: {
    gap: 16,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 16,
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