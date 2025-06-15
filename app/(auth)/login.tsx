import { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform, Image, Alert } from 'react-native';
import { router } from 'expo-router';
import RNPickerSelect from 'react-native-picker-select';
import { supabase } from '../../lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';

const logoDmuller = require('../../assets/images/logoDmuller.png');

interface Team {
  id: string;
  code: number;
  name: string;
}

export default function Login() {
  const [code, setCode] = useState('');
  const [selectedTeam, setSelectedTeam] = useState<number | undefined>(undefined);
  const [teams, setTeams] = useState<Team[]>([]);

  const codeInputRef = useRef<TextInput>(null);

  useEffect(() => {
    fetchTeams();
    if (Platform.OS === 'web' && codeInputRef.current) {
      codeInputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (teams.length > 0 && selectedTeam === undefined) {
      console.log('Definindo equipe padrão:', teams[0].code);
      setSelectedTeam(teams[0].code);
    }
  }, [teams, selectedTeam]);

  const fetchTeams = async () => {
    try {
      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .order('code');

      if (error) {
        console.error('Erro ao buscar equipes:', error);
        return;
      }
      console.log('Equipes carregadas:', data);
      setTeams(data || []);
    } catch (error) {
      console.error('Erro:', error);
    }
  };

  const handleLogin = async () => {
    console.log('Selected Team:', selectedTeam);
    console.log('Code:', code);

    if (!selectedTeam) {
      Alert.alert('Erro', 'Por favor, selecione uma equipe.');
      return;
    }

    if (!code) {
      Alert.alert('Erro', 'Por favor, insira o código do representante.');
      return;
    }

    try {
      // 1. Obter o ID real da equipe na tabela 'teams' usando o código da equipe selecionado
      const { data: teamData, error: teamError } = await supabase
        .from('teams')
        .select('id')
        .eq('code', selectedTeam)
        .single(); // Assumindo que os códigos de equipe são únicos

      if (teamError) {
        console.error('Erro ao buscar ID da equipe:', teamError);
        Alert.alert('Erro', 'Ocorreu um erro ao buscar informações da equipe. Tente novamente.');
        return;
      }

      if (!teamData) {
        Alert.alert('Erro', 'Equipe selecionada inválida.');
        return;
      }

      const actualTeamId = teamData.id;

      // 2. Verificar o código do representante e o ID da equipe real na tabela 'users'
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id, user_id, team_id, name')
        .eq('user_id', code)
        .eq('team_id', selectedTeam);

      if (userError) {
        console.error('Erro ao buscar usuário:', userError);
        Alert.alert('Erro', 'Ocorreu um erro ao verificar suas credenciais. Tente novamente.');
        return;
      }

      if (!userData || userData.length === 0) {
        Alert.alert('Erro', 'Código de representante ou equipe inválidos.');
        return;
      }

      const foundUser = userData[0];
      const representativeCodeToStore = foundUser.user_id;
      const representativeNameToStore = foundUser.name;

      // 3. Lógica para salvar o código e o nome do representante no AsyncStorage
      // Salvar o código da equipe
      await AsyncStorage.setItem('selectedTeamCode', String(selectedTeam)); // Salvar o código numérico como string

      const codigosSalvosStr = await AsyncStorage.getItem('codigosRepresentante');
      let codigosArray = codigosSalvosStr ? JSON.parse(codigosSalvosStr) : [];

      if (!codigosArray.includes(representativeCodeToStore)) {
        codigosArray.push(representativeCodeToStore);
        await AsyncStorage.setItem('codigosRepresentante', JSON.stringify(codigosArray));
      }
      // Salvar o código do representante separadamente
      await AsyncStorage.setItem('representativeCodeToStore', representativeCodeToStore);

      // Salvar o nome do representante separadamente ou em um objeto mais complexo
      await AsyncStorage.setItem('representanteNome', representativeNameToStore);

      console.log('Código do representante salvo no AsyncStorage:', representativeCodeToStore);
      console.log('Nome do representante salvo no AsyncStorage:', representativeNameToStore);

      router.push('/(app)/orders');
    } catch (error) {
      console.error('Erro ao tentar login ou salvar código:', error);
      Alert.alert('Erro', 'Ocorreu um erro inesperado ao fazer login. Tente novamente.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Image source={logoDmuller} style={styles.logo} resizeMode="contain" />
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputsContainer}>
            <Text style={styles.label}>Equipe:</Text>
            <View style={styles.pickerContainer}>
              <RNPickerSelect
                onValueChange={(value) => {
                  console.log('RNPickerSelect value changed:', value);
                  setSelectedTeam(value || undefined);
                }}
                value={selectedTeam}
                items={teams.map(team => ({
                  label: team.name,
                  value: team.code
                }))}
                style={{
                  inputIOS: styles.picker,
                  inputAndroid: styles.picker,
                  inputWeb: styles.picker,
                }}
                placeholder={{
                  label: 'Selecione uma equipe',
                  value: undefined,
                }}
              />
            </View>

            <Text style={styles.label}>Representante:</Text>
            <TextInput
              ref={codeInputRef}
              style={styles.input}
              placeholder="Código do Vendedor"
              placeholderTextColor="#8A8A8A"
              keyboardType="numeric"
              value={code}
              onChangeText={setCode}
            />
          </View>

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Entrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#003B71',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 320,
    height: 110,
  },
  formContainer: {
    flex: 1,
    maxHeight: 300,
    justifyContent: 'space-between',
  },
  inputsContainer: {
    width: '100%',
  },
  label: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 8,
  },
  pickerContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginBottom: 20,
  },
  picker: {
    fontSize: 16,
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderWidth: 0,
    borderRadius: 8,
    color: '#000000',
    backgroundColor: '#FFFFFF',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    fontSize: 16,
  },
  loginButton: {
    alignSelf: 'stretch',
    backgroundColor: '#FCB32B',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#FCB32B',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
      },
      android: {
        elevation: 12,
      },
      web: {
        boxShadow: '0 6px 20px rgba(252, 179, 43, 0.3)',
      }
    }),
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Montserrat-Bold',
    textTransform: 'uppercase',
  },
});