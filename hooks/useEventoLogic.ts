import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { auth, db } from '../firebase';
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  where,
  doc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import { evento } from '../types/evento';

export function useEventosLogic() {
  const [eventos, setEventos] = useState<evento[]>([]);

  // FORM
  const [title, setTitle] = useState('');
  const [descricao, setDescricao] = useState('');
  const [local, setLocal] = useState('');

  // DATE
  const [data, setData] = useState<Date | null>(null);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);

  // IMAGE
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // EDIT
  const [editingId, setEditingId] = useState<string | null>(null);

  const eventosCollectionRef = collection(db, 'eventos');

  // IMG BB KEY
  const IMGBB_API_KEY = process.env.EXPO_PUBLIC_IMGBB_API_KEY!;

  // LISTENER
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(eventosCollectionRef, where('userId', '==', user.uid));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const lista = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<evento, 'id'>),
      })) as evento[];

      setEventos(lista);
    });

    return () => unsubscribe();
  }, []);

  // RESET FORM
  const resetForm = () => {
    setTitle('');
    setDescricao('');
    setLocal('');
    setData(null);
    setImageBase64(null);
    setEditingId(null);
  };

  // DATEPICKER
  const abrirDatePicker = () => setDatePickerVisible(true);
  const fecharDatePicker = () => setDatePickerVisible(false);

  const confirmarData = (selectedDate: Date) => {
    setData(selectedDate);
    fecharDatePicker();
  };

  // CREATE / UPDATE
  const adicionarEvento = async () => {
    const user = auth.currentUser;
    if (!user) return;

    if (!title.trim()) return Alert.alert('Informe o título');
    if (!data) return Alert.alert('Informe a data');

    try {
      // UPDATE
      if (editingId) {
        await updateDoc(doc(db, 'eventos', editingId), {
          title,
          descricao,
          local,
          data: data.toISOString(),
        });

        resetForm();
        return;
      }

      // CREATE
      await addDoc(eventosCollectionRef, {
        title,
        descricao,
        local,
        data: data.toISOString(),
        imageUrl: '',
        userId: user.uid,
        createdAt: new Date().toISOString(),
      });

      resetForm();
    } catch (error) {
      console.error(error);
      Alert.alert('Erro ao salvar evento');
    }
  };

  // DELETE
  const deletarEvento = async (id: string) => {
    await deleteDoc(doc(db, 'eventos', id));
  };

  // EDIT
  const iniciarEdicao = (evento: evento) => {
    setEditingId(evento.id);
    setTitle(evento.title);
    setDescricao(evento.descricao);
    setLocal(evento.local);
    setData(new Date(evento.data));
  };

  // IMAGE PICKER
  const processarImagem = async (origem: 'camera' | 'galeria') => {
    const options: ImagePicker.ImagePickerOptions = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
      base64: true,
    };

    let result;

    if (origem === 'camera') {
      const perm = await ImagePicker.requestCameraPermissionsAsync();
      if (!perm.granted) return Alert.alert('Permissão negada');

      result = await ImagePicker.launchCameraAsync(options);
    } else {
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) return Alert.alert('Permissão negada');

      result = await ImagePicker.launchImageLibraryAsync(options);
    }

    if (!result.canceled && result.assets?.[0]?.base64) {
      setImageBase64(result.assets[0].base64);
    }
  };

  // UPLOAD IMGBB
  const uploadImagemEvento = async (eventoId: string) => {
    if (!imageBase64) {
      return Alert.alert('Selecione uma imagem primeiro');
    }

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append('image', imageBase64);

      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const json = await response.json();

      if (json.success) {
        await updateDoc(doc(db, 'eventos', eventoId), {
          imageUrl: json.data.url,
        });

        Alert.alert('Imagem enviada com sucesso');
        setImageBase64(null);
      } else {
        console.error("Erro da API ImgBB:", json);
        Alert.alert('Erro no upload da imagem', json.error?.message || 'Erro desconhecido');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Erro ao enviar imagem');
    } finally {
      setUploading(false);
    }
  };

  return {
    eventos,
    title,
    setTitle,
    descricao,
    setDescricao,
    local,
    setLocal,
    data,
    setData,
    isDatePickerVisible,
    abrirDatePicker,
    fecharDatePicker,
    confirmarData,
    editingId,
    adicionarEvento,
    deletarEvento,
    iniciarEdicao,
    processarImagem,
    uploadImagemEvento,
    uploading,
  };
}