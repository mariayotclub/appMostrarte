import React from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  Modal,
  TouchableOpacity,
} from 'react-native';

import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useEventosLogic } from '../hooks/useEventoLogic';

import { Colors, Radius, Spacing } from '../styles/theme';

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
    adicionarEvento,
    deletarEvento,
    iniciarEdicao,
    processarImagem,
    imageUri,
    uploading,
    isEditModalVisible,
    fecharEdicao,
  } = useEventosLogic();

  return (
    <View style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>Eventos</Text>
      </View>

      {/* CREATE FORM */}
      <TextInput
        style={styles.input}
        placeholder="Título"
        placeholderTextColor={Colors.muted}
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        style={styles.input}
        placeholder="Descrição"
        placeholderTextColor={Colors.muted}
        value={descricao}
        onChangeText={setDescricao}
      />

      <TextInput
        style={styles.input}
        placeholder="Local"
        placeholderTextColor={Colors.muted}
        value={local}
        onChangeText={setLocal}
      />

      <TouchableOpacity style={styles.button} onPress={abrirDatePicker}>
        <Text style={styles.buttonText}>Selecionar data</Text>
      </TouchableOpacity>

      <Text style={styles.status}>
        {data ? `Data: ${data.toLocaleDateString('pt-BR')}` : 'Nenhuma data selecionada'}
      </Text>

      <TouchableOpacity
        style={styles.buttonSecondary}
        onPress={() => processarImagem('galeria')}
      >
        <Text style={styles.buttonTextSecondary}>Selecionar imagem</Text>
      </TouchableOpacity>

      <Text style={styles.status}>
        {imageUri ? 'Imagem selecionada' : 'Nenhuma imagem selecionada'}
      </Text>

      <TouchableOpacity style={styles.buttonPrimary} onPress={adicionarEvento}>
        <Text style={styles.buttonText}> {uploading ? 'Salvando...' : 'Criar evento'} </Text>
      </TouchableOpacity>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={confirmarData}
        onCancel={fecharDatePicker}
      />

      {/* LISTA */}
      <FlatList
        data={eventos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.title}</Text>
            <Text style={styles.text}>{item.descricao}</Text>
            <Text style={styles.text}>Local: {item.local}</Text>
            <Text style={styles.date}>
              {new Date(item.data).toLocaleDateString('pt-BR')}
            </Text>

            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.smallButton}
                onPress={() => iniciarEdicao(item)}
              >
                <Text style={styles.smallButtonText}>Editar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.smallButtonDanger}
                onPress={() => deletarEvento(item.id)}
              >
                <Text style={styles.smallButtonText}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* MODAL */}
      <Modal visible={isEditModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>

            <Text style={styles.modalTitle}>Editar Evento</Text>

            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="Título"
              placeholderTextColor={Colors.muted}
            />

            <TextInput
              style={styles.input}
              value={descricao}
              onChangeText={setDescricao}
              placeholder="Descrição"
              placeholderTextColor={Colors.muted}
            />

            <TextInput
              style={styles.input}
              value={local}
              onChangeText={setLocal}
              placeholder="Local"
              placeholderTextColor={Colors.muted}
            />

            <TouchableOpacity style={styles.button} onPress={abrirDatePicker}>
              <Text style={styles.buttonText}>Selecionar data</Text>
            </TouchableOpacity>

            <Text style={styles.status}>
              {data ? data.toLocaleDateString('pt-BR') : 'Nenhuma data'}
            </Text>

            <TouchableOpacity
              style={styles.buttonSecondary}
              onPress={() => processarImagem('galeria')}
            >
              <Text style={styles.buttonTextSecondary}>Selecionar imagem</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.buttonPrimary} onPress={adicionarEvento}>
              <Text style={styles.buttonText}>
                {uploading ? 'Salvando...' : 'Salvar'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.buttonDanger} onPress={fecharEdicao}>
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.lg,
    backgroundColor: Colors.background,
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
    color: Colors.white,
    textAlign: 'center',
  },

  input: {
    backgroundColor: Colors.white,
    padding: Spacing.md,
    borderRadius: Radius.sm,
    marginVertical: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.border,
    color: Colors.text,
  },

  status: {
    marginVertical: 6,
    color: Colors.muted,
  },

  button: {
    backgroundColor: Colors.primary,
    padding: Spacing.md,
    borderRadius: Radius.sm,
    marginTop: Spacing.xs,
    alignItems: 'center',
  },

  buttonPrimary: {
    backgroundColor: Colors.primary,
    padding: Spacing.md,
    borderRadius: Radius.md,
    marginTop: Spacing.sm,
    alignItems: 'center',
  },

  buttonSecondary: {
    backgroundColor: Colors.accent,
    padding: Spacing.md,
    borderRadius: Radius.sm,
    marginTop: Spacing.xs,
    alignItems: 'center',
  },

  buttonDanger: {
    backgroundColor: '#c94c4c',
    padding: Spacing.md,
    borderRadius: Radius.sm,
    marginTop: Spacing.sm,
    alignItems: 'center',
  },

  buttonText: {
    color: Colors.white,
    fontWeight: 'bold',
  },

  buttonTextSecondary: {
    color: Colors.text,
    fontWeight: 'bold',
  },

  card: {
    backgroundColor: Colors.white,
    padding: Spacing.md,
    borderRadius: Radius.md,
    marginTop: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },

  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
  },

  text: {
    color: Colors.text,
  },

  date: {
    marginTop: 6,
    color: Colors.muted,
  },

  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },

  smallButton: {
    backgroundColor: Colors.primary,
    padding: Spacing.sm,
    borderRadius: Radius.sm,
  },

  smallButtonDanger: {
    backgroundColor: '#c94c4c',
    padding: Spacing.sm,
    borderRadius: Radius.sm,
  },

  smallButtonText: {
    color: Colors.white,
    fontWeight: 'bold',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: Spacing.lg,
  },

  modalContent: {
    backgroundColor: Colors.background,
    padding: Spacing.lg,
    borderRadius: Radius.lg,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
});