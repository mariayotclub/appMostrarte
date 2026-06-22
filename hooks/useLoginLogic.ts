import { useState, useEffect } from 'react';
import { Alert } from 'react-native';

import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

import AsyncStorage from '@react-native-async-storage/async-storage';

export function useLoginLogic() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    const loadEmail = async () => {
      const saved = await AsyncStorage.getItem('@ultimo_email');
      if (saved) setEmail(saved);
    };

    loadEmail();
  }, []);

  const logar = async (onSuccess: () => void) => {
    if (!email || !senha) {
      Alert.alert('Erro', 'Preencha e-mail e senha');
      return;
    }

    if (carregando) return;

    setCarregando(true);

    try {
      await signInWithEmailAndPassword(auth, email, senha);

      await AsyncStorage.setItem('@ultimo_email', email);

      onSuccess();
    } catch (error: any) {
      Alert.alert('Erro ao logar', error.message);
    } finally {
      setCarregando(false);
    }
  };

  return {
    email,
    setEmail,
    senha,
    setSenha,
    logar,
    carregando,
  };
}