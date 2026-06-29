import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { auth, db } from '../firebase';
import { collection, addDoc, onSnapshot, query, doc, updateDoc, deleteDoc, orderBy } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import { evento } from '../types/evento';
import { getIdTokenResult } from 'firebase/auth';

export function useEventosLogic() {
  const [eventos, setEventos] = useState<evento[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);

  const [title, setTitle] = useState('');
  const [descricao, setDescricao] = useState('');
  const [local, setLocal] = useState('');
  const [organizador, setOrganizador] = useState('');

  const [data, setData] = useState<Date | null>(null);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);

  const [imageUri, setImageUri] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [isEditModalVisible, setEditModalVisible] = useState(false);

  const ref = collection(db, 'eventos');
  const API = process.env.EXPO_PUBLIC_IMGBB_API_KEY!;

  useEffect(() => {
    const check = async () => {
      const u = auth.currentUser;
      if (!u) return;
      const token = await getIdTokenResult(u);
      setIsAdmin(token.claims.admin === true);
    };
    check();
  }, []);

  useEffect(() => {
    const q = query(ref, orderBy('createdAt', 'desc'));
    return onSnapshot(q, snap => {
      setEventos(snap.docs.map(d => ({ id: d.id, ...(d.data() as any) })));
    });
  }, []);

  const reset = () => {
    setTitle('');
    setDescricao('');
    setLocal('');
    setOrganizador('');
    setData(null);
    setImageUri(null);
    setEditingId(null);
  };

  const abrirDatePicker = () => setDatePickerVisible(true);
  const fecharDatePicker = () => setDatePickerVisible(false);

  const confirmarData = (d: Date) => {
    setData(d);
    fecharDatePicker();
  };

const processarImagem = async (tipo: 'camera' | 'galeria') => {
  const opt: ImagePicker.ImagePickerOptions = {
    allowsEditing: true,
    aspect: [4, 3],
    quality: 0.5,
  };

  let res;

  if (tipo === 'camera') {
    const p = await ImagePicker.requestCameraPermissionsAsync();
    if (!p.granted) return;

    res = await ImagePicker.launchCameraAsync(opt);
  } else {
    const p = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!p.granted) return;

    res = await ImagePicker.launchImageLibraryAsync(opt);
  }

  if (!res.canceled && res.assets?.[0]) {
    setImageUri(res.assets[0].uri);
  }
};

  const upload = async () => {
    if (!imageUri) return '';
    const fd = new FormData();
    fd.append('image', { uri: imageUri, type: 'image/jpeg', name: 'img.jpg' } as any);

    const r = await fetch(`https://api.imgbb.com/1/upload?key=${API}`, { method: 'POST', body: fd });
    const j = await r.json();

    if (!j.success) throw new Error('upload error');
    return j.data.url;
  };

  const adicionarEvento = async () => {
    const u = auth.currentUser;
    if (!u) return;
    if (!title.trim() || !data) return Alert.alert('Preencha tudo');

    try {
      setUploading(true);
      let img = '';
      if (imageUri) img = await upload();

      if (editingId) {
        await updateDoc(doc(db, 'eventos', editingId), {
          title,
          descricao,
          local,
          organizador,
          data: data.toISOString(),
          imageUrl: img || ''
        });
        setEditModalVisible(false);
        reset();
        return;
      }

      await addDoc(ref, {
        title,
        descricao,
        local,
        organizador,
        data: data.toISOString(),
        imageUrl: img || '',
        userId: u.uid,
        createdAt: new Date().toISOString()
      });

      reset();
    } finally {
      setUploading(false);
    }
  };

  const deletarEvento = async (id: string, ownerId?: string) => {
    const u = auth.currentUser;
    if (!u) return;

    const ok = isAdmin || u.uid === ownerId;
    if (!ok) return Alert.alert('Sem permissão');

    await deleteDoc(doc(db, 'eventos', id));
  };

  const iniciarEdicao = (e: evento) => {
    const u = auth.currentUser;
    if (!u) return;

    const ok = isAdmin || u.uid === e.userId;
    if (!ok) return Alert.alert('Sem permissão');

    setEditingId(e.id);
    setTitle(e.title);
    setDescricao(e.descricao);
    setLocal(e.local);
    setOrganizador(e.organizador || '');
    setData(new Date(e.data));
    setImageUri(e.imageUrl || null);
    setEditModalVisible(true);
  };

  const fecharEdicao = () => {
    setEditModalVisible(false);
    reset();
  };

  return {
    eventos,
    isAdmin,
    title,
    setTitle,
    descricao,
    setDescricao,
    local,
    setLocal,
    organizador,
    setOrganizador,
    data,
    isDatePickerVisible,
    abrirDatePicker,
    fecharDatePicker,
    confirmarData,
    processarImagem,
    imageUri,
    uploading,
    adicionarEvento,
    deletarEvento,
    iniciarEdicao,
    isEditModalVisible,
    fecharEdicao
  };
}