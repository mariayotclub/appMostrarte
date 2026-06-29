import React from 'react';

import {
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  Modal,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';

import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useEventosLogic } from '../hooks/useEventoLogic';
import HeaderImage from '../components/HeaderImage';

import { Colors, Radius, Spacing } from '../styles/theme';
import { auth } from '../firebase';

export default function Eventos() {
  const {
    eventos,
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
    adicionarEvento,
    deletarEvento,
    iniciarEdicao,
    processarImagem,
    imageUri,
    uploading,
    isEditModalVisible,
    fecharEdicao,
    isAdmin,
  } = useEventosLogic();

  const meusEventos = eventos.filter(
    (item) => item.userId === auth.currentUser?.uid
  );

  const eventosVisiveis = isAdmin ? eventos : meusEventos;

  function confirmarExclusao(id: string) {
    Alert.alert(
      'Confirmação',
      'tem certeza que deseja apagar este evento?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => deletarEvento(id),
        },
      ]
    );
  }

  return (
    <>
      <FlatList style={[styles.container,isAdmin && styles.adminContainer]}
        contentContainerStyle={styles.contentContainer}
        data={eventosVisiveis}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <>
            <HeaderImage />

            <View style={[styles.header,isAdmin && styles.adminHeader]}>
              <Text style={styles.title}>Criar Evento</Text>
            </View>

            <TextInput 
              style={[styles.input,isAdmin && styles.adminInput]}
              placeholder="Título"
              placeholderTextColor={Colors.muted}
              value={title}
              onChangeText={setTitle}
            />

            <TextInput
              style={[styles.input,isAdmin && styles.adminInput]}
              placeholder="Descrição"
              placeholderTextColor={Colors.muted}
              value={descricao}
              onChangeText={setDescricao}
            />

            <TextInput
              style={[styles.input,isAdmin && styles.adminInput]}
              placeholder="Local"
              placeholderTextColor={Colors.muted}
              value={local}
              onChangeText={setLocal}
            />

            <TextInput
              style={[styles.input,isAdmin && styles.adminInput]}
              placeholder="Organizador"
              placeholderTextColor={Colors.muted}
              value={organizador}
              onChangeText={setOrganizador}
            />

            <TouchableOpacity style={[styles.button, isAdmin && styles.adminButton]} onPress={abrirDatePicker}>
              <Text style={styles.buttonText}>Selecionar data</Text>
            </TouchableOpacity>

            <Text style={styles.status}>
              {data
                ? `Data: ${data.toLocaleDateString('pt-BR')}`
                : 'Nenhuma data selecionada'}
            </Text>

            <TouchableOpacity
              style={[styles.buttonSecondary, isAdmin && styles.adminButton]}
              onPress={() => processarImagem('galeria')}
            >
              <Text style={styles.buttonTextSecondary}>
                Selecionar imagem
              </Text>
            </TouchableOpacity>

            <Text style={styles.status}>
              {imageUri ? 'Imagem selecionada' : 'Nenhuma imagem selecionada'}
            </Text>

            <TouchableOpacity
              style={[styles.buttonPrimary, isAdmin && styles.adminButton]}
              onPress={adicionarEvento}
            >
              <Text style={styles.buttonText}>
                {uploading ? 'Salvando...' : 'Criar evento'}
              </Text>
            </TouchableOpacity>

            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              onConfirm={confirmarData}
              onCancel={fecharDatePicker}
            />

            <Text style={styles.subTitle}>
              {isAdmin ? 'Todos os eventos' : 'Meus eventos'}
            </Text>
          </>
        }
        renderItem={({ item }) => {
          const isOwner =
            item.userId === auth.currentUser?.uid || isAdmin;

          return (
            <View style={[styles.card, isAdmin && styles.adminCard]}>
              <Text style={[ styles.name, isAdmin && styles.adminText]}>{item.title}</Text>

              <Text style={[styles.text, isAdmin && styles.adminText]}>{item.descricao}</Text>

              <Text style={[styles.text, isAdmin && styles.adminText]}>Local: {item.local}</Text>

              <Text style={styles.date}>
                {item.data
                  ? new Date(item.data).toLocaleDateString('pt-BR')
                  : ''}
              </Text>

              {isOwner && (
                <View style={styles.actions}>
                  <TouchableOpacity
                    style={styles.smallButton}
                    onPress={() => iniciarEdicao(item)}
                  >
                    <Text style={styles.smallButtonText}>Editar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.smallButtonDanger}
                    onPress={() => confirmarExclusao(item.id)}
                  >
                    <Text style={styles.smallButtonText}>Excluir</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          );
        }}
      />

      {/* MODAL */}
<Modal visible={isEditModalVisible} animationType="slide" transparent>
  <View style={styles.modalOverlay}>
    <View style={[styles.modalContent,isAdmin && styles.adminModalContent]}>

      <Text style={[styles.modalTitle,isAdmin && styles.adminText]}>
        Editar Evento
      </Text>

      <TextInput
        style={[styles.input,isAdmin && styles.adminInput]}
        placeholder="Título"
        placeholderTextColor={Colors.muted}
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        style={[styles.input,isAdmin && styles.adminInput]}
        placeholder="Descrição"
        placeholderTextColor={Colors.muted}
        value={descricao}
        onChangeText={setDescricao}
      />

      <TextInput
        style={[styles.input,isAdmin && styles.adminInput]}
        placeholder="Local"
        placeholderTextColor={Colors.muted}
        value={local}
        onChangeText={setLocal}
      />

      <TextInput
        style={[styles.input,isAdmin && styles.adminInput]}
        placeholder="Organizador"
        placeholderTextColor={Colors.muted}
        value={organizador}
        onChangeText={setOrganizador}
      />

      <TouchableOpacity
        style={[styles.button,isAdmin && styles.adminButton]}
        onPress={abrirDatePicker}
      >
        <Text style={styles.buttonText}>
          Alterar data
        </Text>
      </TouchableOpacity>

      <Text style={styles.status}>
        {data
          ? `Data: ${data.toLocaleDateString('pt-BR')}`
          : 'Nenhuma data selecionada'}
      </Text>

      <TouchableOpacity
        style={[styles.buttonSecondary,isAdmin && styles.adminButton]}
        onPress={() => processarImagem('galeria')}
      >
        <Text style={styles.buttonTextSecondary}>
          Alterar imagem
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.buttonPrimary,isAdmin && styles.adminButton]}
        onPress={adicionarEvento}
      >
        <Text style={styles.buttonText}>
          Salvar alterações
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.buttonDanger}
        onPress={fecharEdicao}
      >
        <Text style={styles.buttonText}>
          Cancelar
        </Text>
      </TouchableOpacity>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={confirmarData}
        onCancel={fecharDatePicker}
      />

    </View>
  </View>
</Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    height: 30,
    width: 150,
    borderRadius: Radius.sm,
    marginTop: Spacing.xs,
    alignItems: 'center',
  },
  buttonPrimary: {
    backgroundColor: '#7597f4',
    padding: Spacing.md,
    borderRadius: Radius.md,
    marginTop: Spacing.sm,
    alignItems: 'center',
  },
  buttonSecondary: {
    backgroundColor: Colors.primary,
    height: 30,
    width: 150,
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
    marginTop: 5,
    color: Colors.white,
    fontWeight: 'bold',
  },
  buttonTextSecondary: {
    marginTop: 5,
    color: '#ffffff',
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
  contentContainer: {
    padding: Spacing.lg,
    paddingBottom: 40,
  },
  subTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
    marginTop: 20,
    marginBottom: 10,
  },
  adminContainer: {
 backgroundColor: '#1C2C4A',
},

adminHeader: {
 backgroundColor: '#223559',
 borderWidth: 1,
 borderColor: '#667EA8',
},

adminInput: {
 backgroundColor: '#223559',
 color: '#FFFFFF',
 borderColor: '#667EA8',
},

adminCard: {
 backgroundColor: '#223559',
 borderColor: '#667EA8',
},

adminText: {
 color: '#FFFFFF',
},

adminButton: {
 backgroundColor: '#16243D',
 borderWidth: 1,
 borderColor: '#667EA8',
},
adminModalContent: {
  backgroundColor:'#223559',
  borderWidth:1,
  borderColor:'#667EA8',
},
});