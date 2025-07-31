import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { theme } from '../styles/theme'; // ⬅️ estilo global
import { Image } from 'react-native';

export default function SignupScreen({ navigation }) {
  const { signUp } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!name || !email || !password) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }
    setLoading(true);
    const result = await signUp(name, email, password);
    setLoading(false);
    if (!result.success) {
      Alert.alert('Erro', result.message);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={theme.container}
    >
      <View style={theme.inner}>
        
        <Text style={theme.title}>Cadastro</Text>

        <TextInput
          style={theme.input}
          placeholder="Nome"
          value={name}
          onChangeText={setName}
          placeholderTextColor="#999"
        />
        <TextInput
          style={theme.input}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
          placeholderTextColor="#999"
        />
        <TextInput
          style={theme.input}
          placeholder="Senha"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          placeholderTextColor="#999"
        />

        <TouchableOpacity
          style={theme.button}
          onPress={handleSignup}
          disabled={loading}
        >
          <Text style={theme.buttonText}>
            {loading ? 'Registrando...' : 'Registrar'}
          </Text>
        </TouchableOpacity>

        <Text style={theme.textLink}>
          Já tem uma conta?{' '}
          <Text style={theme.link} onPress={() => navigation.navigate('Login')}>
            Entrar
          </Text>
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}
