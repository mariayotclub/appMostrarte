import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';

import { auth } from '../firebase';
import { sendPasswordResetEmail } from 'firebase/auth';

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from '../App';
import { Colors, Radius, Spacing } from '../styles/theme';

type RecoverScreenProp = NativeStackNavigationProp<RootStackParamList, 'RecuperaSenha'>;

export default function RecoverPassword() {
  const [email, setEmail] = useState('');
  const navigation = useNavigation<RecoverScreenProp>();

  const recuperarSenha = () => {
    if (!email) {
      Alert.alert('Atenção', 'Por favor, digite seu e-mail.');
      return;
    }

    sendPasswordResetEmail(auth, email)
      .then(() => {
        Alert.alert(
          'Sucesso',
          'Link enviado! Verifique sua caixa de entrada e spam.'
        );
        navigation.goBack();
      })
      .catch((erro) => {
        Alert.alert('Erro', erro.message);
      });
  };

  return (
    <View style={styles.container}>

      <View style={styles.card}>

        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.title}>Recuperar Senha</Text>
        </View>

        {/* INPUT */}
        <TextInput
          style={styles.input}
          placeholder="E-mail cadastrado"
          placeholderTextColor={Colors.muted}
          autoCapitalize="none"
          keyboardType="email-address"
          onChangeText={setEmail}
          value={email}
        />

        {/* BUTTON */}
        <TouchableOpacity style={styles.button} onPress={recuperarSenha}>
          <Text style={styles.buttonText}>Enviar link</Text>
        </TouchableOpacity>

        {/* BACK */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backText}>Voltar</Text>
        </TouchableOpacity>

      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: Spacing.lg,
    backgroundColor: Colors.background,
  },

  card: {
    backgroundColor: Colors.white,
    padding: Spacing.lg,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },

  header: {
    backgroundColor: Colors.primary,
    padding: Spacing.md,
    borderRadius: Radius.md,
    marginBottom: Spacing.md,
  },

  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    color: Colors.white,
  },

  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    borderRadius: Radius.sm,
    marginBottom: Spacing.md,
    color: Colors.text,
    backgroundColor: Colors.white,
  },

  button: {
    backgroundColor: Colors.primary,
    padding: Spacing.md,
    borderRadius: Radius.md,
    alignItems: 'center',
  },

  buttonText: {
    color: Colors.white,
    fontWeight: 'bold',
  },

  backButton: {
    marginTop: Spacing.md,
    alignItems: 'center',
    padding: Spacing.sm,
  },

  backText: {
    color: Colors.primary,
    fontWeight: '600',
  },
});