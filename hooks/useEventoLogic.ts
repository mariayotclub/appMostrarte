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

  const [title, setTitle] = useState('');
  const [descricao, setDescricao] = useState('');
  const [local, setLocal] = useState('');

  const [data, setData] = useState<Date | null>(null);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);

  const [imageUri, setImageUri] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);

  const [isEditModalVisible, setEditModalVisible] = useState(false);

  const eventosCollectionRef = collection(db, 'eventos');

  const IMGBB_API_KEY = process.env.EXPO_PUBLIC_IMGBB_API_KEY!;

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

  const resetForm = () => {
    setTitle('');
    setDescricao('');
    setLocal('');
    setData(null);
    setImageUri(null);
    setEditingId(null);
  };

  const abrirDatePicker = () => setDatePickerVisible(true);
  const fecharDatePicker = () => setDatePickerVisible(false);

  const confirmarData = (selectedDate: Date) => {
    setData(selectedDate);
    fecharDatePicker();
  };

  const processarImagem = async (origem: 'camera' | 'galeria') => {
    const options: ImagePicker.ImagePickerOptions = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    };

    let result;

    if (origem === 'camera') {
      const perm = await ImagePicker.requestCameraPermissionsAsync();
      if (!perm.granted) return;

      result = await ImagePicker.launchCameraAsync(options);
    } else {
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) return;

      result = await ImagePicker.launchImageLibraryAsync(options);
    }

    if (!result.canceled && result.assets?.[0]?.uri) {
      setImageUri(result.assets[0].uri);
    }
  };

  const uploadImagem = async (): Promise<string> => {
    if (!imageUri) return '';

    const formData = new FormData();

    formData.append('image', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'upload.jpg',
    } as any);

    const response = await fetch(
      `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
      {
        method: 'POST',
        body: formData,
      }
    );

    const json = await response.json();

    if (!json.success) {
      throw new Error('Erro no upload ImgBB');
    }

    return json.data.url;
  };

  const adicionarEvento = async () => {
    const user = auth.currentUser;
    if (!user) return;

    if (!title.trim() || !data) {
      Alert.alert('Preencha título e data');
      return;
    }

    try {
      setUploading(true);

      let imageUrl: string | undefined;

      if (imageUri) {
        imageUrl = await uploadImagem();
      }

      // ================= EDIT =================
      if (editingId) {
        const updateData: any = {
          title,
          descricao,
          local,
          data: data.toISOString(),
        };

        if (imageUrl) {
          updateData.imageUrl = imageUrl;
        }

        await updateDoc(doc(db, 'eventos', editingId), updateData);

        setEditModalVisible(false);
        resetForm();
        return;
      }

      // ================= CREATE =================
      await addDoc(eventosCollectionRef, {
        title,
        descricao,
        local,
        data: data.toISOString(),
        imageUrl: imageUrl || '',
        userId: user.uid,
        createdAt: new Date().toISOString(),
      });

      resetForm();
    } catch (err) {
      console.error(err);
      Alert.alert('Erro ao salvar evento');
    } finally {
      setUploading(false);
    }
  };

  const deletarEvento = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'eventos', id));
    } catch {
      Alert.alert('Erro ao deletar');
    }
  };

  const iniciarEdicao = (evento: evento) => {
    setEditingId(evento.id);
    setTitle(evento.title);
    setDescricao(evento.descricao);
    setLocal(evento.local);
    setData(new Date(evento.data));
    setImageUri(evento.imageUrl || null);

    setEditModalVisible(true);
  };

  const fecharEdicao = () => {
    setEditModalVisible(false);
    resetForm();
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
    isDatePickerVisible,
    abrirDatePicker,
    fecharDatePicker,
    confirmarData,
    editingId,
    adicionarEvento,
    deletarEvento,
    iniciarEdicao,
    processarImagem,
    uploading,
    imageUri,
    isEditModalVisible,
    fecharEdicao,
  };
}