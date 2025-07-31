import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { AuthContext } from '../context/AuthContext';

export default function LoginScreen({ navigation }) {
  const { signIn } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    const result = await signIn(email, password);
    setLoading(false);
    if (!result.success) {
      Alert.alert('Erro', result.message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.inner}>
        <Image
          source={require('../../assets/images/react-logo.png')} // substitua pela sua imagem
          style={styles.image}
          resizeMode="contain"
        />

        <Text style={styles.title}>Bem-vindo de volta!</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#999"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor="#999"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Entrando...' : 'Entrar'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.signupText}>
          Não tem uma conta?{' '}
          <Text style={styles.signupLink} onPress={() => navigation.navigate('Signup')}>
            Cadastre-se
          </Text>
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6fc',
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    width: '100%',
    marginTop: -100,
  },
  image: {
    width: 180,
    height: 180,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 24,
    color: '#333',
  },
  input: {
    width: '100%',
    height: 48,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  signupText: {
    marginTop: 24,
    color: '#444',
  },
  signupLink: {
    color: '#007bff',
    fontWeight: 'bold',
  },
});
