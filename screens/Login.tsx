import React from 'react';
import {
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from '../App';
import { useLoginLogic } from '../hooks/useLoginLogic';

type LoginScreenProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

export default function Login() {
  const navigation = useNavigation<LoginScreenProp>();

  const {
    email,
    setEmail,
    senha,
    setSenha,
    logar,
    carregando,
  } = useLoginLogic();

  const handleLogin = () => {
    logar(() => {
      navigation.replace('Main');
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <View style={styles.wrapper}>
          <View style={styles.card}>
            <Text style={styles.title}>Login</Text>

            <TextInput
              placeholder="E-mail"
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              placeholderTextColor="#999"
              style={styles.input}
            />

            <TextInput
              placeholder="Senha"
              secureTextEntry
              value={senha}
              onChangeText={setSenha}
              placeholderTextColor="#999"
              style={styles.input}
            />

            <TouchableOpacity
              style={[
                styles.button,
                carregando && { opacity: 0.6 },
              ]}
              onPress={handleLogin}
              disabled={carregando}
            >
              {carregando ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Entrar</Text>
              )}
            </TouchableOpacity>

            <View style={styles.linksContainer}>
              <TouchableOpacity
                style={[styles.outlineButton, { borderColor: '#007BFF' }]}
                onPress={() => navigation.navigate('Register')}
              >
                <Text style={[styles.outlineText, { color: '#007BFF' }]}>
                  Criar conta
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.outlineButton, { borderColor: '#FF9500' }]}
                onPress={() => navigation.navigate('RecuperaSenha')}
              >
                <Text style={[styles.outlineText, { color: '#FF9500' }]}>
                  Esqueceu a senha?
                </Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 12,

    // sombra iOS
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },

    // sombra Android
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    color: '#333',
  },
  button: {
    backgroundColor: '#28A745',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  linksContainer: {
    marginTop: 12,
    gap: 10,
  },
  outlineButton: {
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  outlineText: {
    fontWeight: '600',
  },
});