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
import { createUserWithEmailAndPassword } from 'firebase/auth';

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from '../App';
import { Colors, Radius, Spacing } from '../styles/theme';

type RegisterScreenProp = NativeStackNavigationProp<RootStackParamList, 'Register'>;

export default function Register() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const navigation = useNavigation<RegisterScreenProp>();

  const cadastrar = () => {
    createUserWithEmailAndPassword(auth, email, senha)
      .then(() => {
        Alert.alert('Sucesso', 'Conta criada!');
        navigation.replace('Main');
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
          <Text style={styles.title}>Cadastro</Text>
        </View>

        {/* INPUTS */}
        <TextInput
          style={styles.input}
          placeholder="E-mail"
          placeholderTextColor={Colors.muted}
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor={Colors.muted}
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
        />

        {/* BUTTON */}
        <TouchableOpacity style={styles.button} onPress={cadastrar}>
          <Text style={styles.buttonText}>Cadastrar</Text>
        </TouchableOpacity>

        {/* BACK */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backText}>Voltar ao login</Text>
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
    marginBottom: Spacing.sm,
    color: Colors.text,
    backgroundColor: Colors.white,
  },

  button: {
    backgroundColor: Colors.primary,
    padding: Spacing.md,
    borderRadius: Radius.md,
    alignItems: 'center',
    marginTop: Spacing.sm,
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