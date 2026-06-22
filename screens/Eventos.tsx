import React from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  Image,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useEventosLogic } from '../hooks/useEventoLogic';

export default function Eventos() {
  const {
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
    uploadImagemEvento,
  } = useEventosLogic();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {editingId ? 'Editar Evento' : 'Criar Evento'}
      </Text>

      <TextInput
        placeholder="Título"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />

      <TextInput
        placeholder="Descrição"
        value={descricao}
        onChangeText={setDescricao}
        style={styles.input}
      />

      <TextInput
        placeholder="Local"
        value={local}
        onChangeText={setLocal}
        style={styles.input}
      />

      <Button title="Selecionar data" onPress={abrirDatePicker} />

      <Text>
        {data ? data.toLocaleDateString() : 'Nenhuma data'}
      </Text>

      <Button
        title="Selecionar imagem"
        onPress={() => processarImagem('galeria')}
      />

      <Button
        title={editingId ? 'Salvar edição' : 'Criar evento'}
        onPress={adicionarEvento}
      />

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={confirmarData}
        onCancel={fecharDatePicker}
      />

      <FlatList
        data={eventos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {item.imageUrl ? (
              <Image source={{ uri: item.imageUrl }} style={styles.image} />
            ) : (
              <View style={styles.placeholder}>
                <Text style={{ textAlign: 'center', color: '#666' }}>Sem imagem</Text>
              </View>
            )}

            <Text style={styles.name}>{item.title}</Text>
            <Text>{item.local}</Text>
            <Text>{item.descricao}</Text>

            <View style={styles.actions}>
              <Button
                title="Editar"
                onPress={() => iniciarEdicao(item)}
              />
              <Button
                title="Excluir"
                color="red"
                onPress={() => deletarEvento(item.id)}
              />
              <Button
                title="Upload imagem"
                onPress={() => uploadImagemEvento(item.id)}
              />
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#fff',
    padding: 10,
    marginVertical: 5,
    borderRadius: 8,
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    marginTop: 10,
    borderRadius: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 10,
  },
  placeholder: {
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eee',
    borderRadius: 8,
    marginBottom: 10,
  },
});