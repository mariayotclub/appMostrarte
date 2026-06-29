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
  Image,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from '../App';
import { useLoginLogic } from '../hooks/useLoginLogic';

import { Colors, Radius, Spacing } from '../styles/theme';

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
    logar((admin: boolean) => {
      // 🔥 navegação baseada no tipo de usuário
      if (admin) {
        navigation.replace('Main'); // ou 'Admin' se tiver tela separada
      } else {
        navigation.replace('Main');
      }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <Image
          source={require('../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <View style={styles.wrapper}>
          <View style={styles.card}>
            <View style={styles.header}>
              <Text style={styles.title}>Login</Text>
            </View>

            <TextInput
              placeholder="E-mail"
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              placeholderTextColor={Colors.muted}
              style={styles.input}
            />

            <TextInput
              placeholder="Senha"
              secureTextEntry
              value={senha}
              onChangeText={setSenha}
              placeholderTextColor={Colors.muted}
              style={styles.input}
            />

            <TouchableOpacity
              style={[styles.button, carregando && styles.buttonDisabled]}
              onPress={handleLogin}
              disabled={carregando}
            >
              {carregando ? (
                <ActivityIndicator color={Colors.white} />
              ) : (
                <Text style={styles.buttonText}>Entrar</Text>
              )}
            </TouchableOpacity>

            <View style={styles.linksContainer}>
              <TouchableOpacity
                style={styles.outlineButton}
                onPress={() => navigation.navigate('Register')}
              >
                <Text style={[styles.outlineText, { color: Colors.muted }]}>
                  Criar conta
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.outlineButton}
                onPress={() => navigation.navigate('RecuperaSenha')}
              >
                <Text style={[styles.outlineText, { color: Colors.muted }]}>
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
    backgroundColor: Colors.background,
  },

  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom:80,
    padding: 20,
  },

  card: {
    width: '100%',
    maxWidth: 300,
    backgroundColor: Colors.white,
    padding: Spacing.lg,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },

  logo: {
    width: 300,
    height: 150,
    alignSelf: 'center',
    marginTop: 110,
    
  },

  header: {
    padding: Spacing.md,
    borderRadius: Radius.md,
    marginBottom: Spacing.md,
  },

  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    color: Colors.primary,
  },

  input: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    borderRadius: Radius.sm,
    marginBottom: Spacing.sm,
    color: Colors.text,
  },

  button: {
    backgroundColor: Colors.primary,
    padding: Spacing.md,
    borderRadius: Radius.md,
    alignItems: 'center',
    marginTop: Spacing.sm,
  },

  buttonDisabled: {
    opacity: 0.6,
  },

  buttonText: {
    color: Colors.white,
    fontWeight: 'bold',
  },

  linksContainer: {
    marginTop: Spacing.md,
    gap: Spacing.sm,
  },

  outlineButton: {
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    borderRadius: Radius.md,
    alignItems: 'center',
    backgroundColor: Colors.background,
  },

  outlineText: {
    fontWeight: '600',
  },
});