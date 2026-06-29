import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Alert,
  TextInput
} from 'react-native';

import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useEventosLogic } from '../hooks/useEventoLogic';
import HeaderImage from '../components/HeaderImage';
import { Colors, Radius, Spacing } from '../styles/theme';

export default function EventosLista() {
  const {
    eventos,
    isAdmin,
    deletarEvento,
    iniciarEdicao,
    isEditModalVisible,
    fecharEdicao,
    adicionarEvento,
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
    imageUri
  } = useEventosLogic();

  const [modalVisible, setModalVisible] = useState(false);
  const [eventoSelecionado, setEventoSelecionado] = useState<any>(null);

  function abrirDescricao(evento: any) {
    setEventoSelecionado(evento);
    setModalVisible(true);
  }

  function excluir(id: string, ownerId?: string) {
    Alert.alert('Excluir evento', 'Tem certeza?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: () => deletarEvento(id, ownerId) }
    ]);
  }

  return (
    <View style={[styles.container, isAdmin && styles.adminContainer]}>
      <HeaderImage />

      <View style={[styles.header, isAdmin && styles.adminHeader]}>
        <Text style={styles.title}>Eventos Marcados</Text>
      </View>

      <FlatList
        data={eventos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.card, isAdmin && styles.adminCard]}>
            {item.imageUrl ? (
              <Image source={{ uri: item.imageUrl }} style={styles.image} />
            ) : (
              <View style={styles.placeholder}>
                <Text>Sem imagem</Text>
              </View>
            )}

            <Text style={styles.name}>{item.title}</Text>
            <Text style={styles.text}>Local: {item.local}</Text>
            <Text style={styles.text}>Por: {item.organizador}</Text>

            <Text style={styles.date}>
              {item.data ? new Date(item.data).toLocaleDateString('pt-BR') : ''}
            </Text>

            <View style={styles.actionsRow}>
              <TouchableOpacity style={styles.button} onPress={() => abrirDescricao(item)}>
                <Text style={styles.buttonText}>Descrição</Text>
              </TouchableOpacity>

              {isAdmin && (
                <>
                  <TouchableOpacity style={styles.editButton} onPress={() => iniciarEdicao(item)}>
                    <Text style={styles.buttonText}>Editar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.deleteButton} onPress={() => excluir(item.id, item.userId)}>
                    <Text style={styles.buttonText}>Excluir</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        )}
      />

      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Descrição</Text>
            <Text style={styles.text}>{eventoSelecionado?.descricao}</Text>

            <TouchableOpacity style={styles.button} onPress={() => setModalVisible(false)}>
              <Text style={styles.buttonText} >Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

<Modal visible={isEditModalVisible} transparent animationType="slide">
  <View style={styles.modalBackground}>
    <View style={styles.modalContainer}>
      <Text style={styles.modalTitle}>Editar Evento</Text>

      <TextInput style={styles.input} value={title} onChangeText={setTitle} />
      <TextInput style={styles.input} value={descricao} onChangeText={setDescricao} />
      <TextInput style={styles.input} value={local} onChangeText={setLocal} />
      <TextInput style={styles.input} value={organizador} onChangeText={setOrganizador} />

      <TouchableOpacity style={styles.blueButton} onPress={abrirDatePicker}>
        <Text style={styles.blueButtonText}>Alterar data</Text>
      </TouchableOpacity>

      <Text>
        {data ? `Nova data: ${data.toLocaleDateString('pt-BR')}` : 'Data não alterada'}
      </Text>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={confirmarData}
        onCancel={fecharDatePicker}
      />

      <TouchableOpacity style={styles.blueButton} onPress={() => processarImagem('galeria')}>
        <Text style={styles.blueButtonText}>Alterar imagem</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.blueButtonPrimary} onPress={adicionarEvento}>
        <Text style={styles.blueButtonText}>Salvar alterações</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.cancelButton} onPress={fecharEdicao}>
        <Text style={styles.cancelButtonText}>Cancelar</Text>
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

  listContent: {
    paddingBottom: Spacing.lg,
  },

  card: {
    backgroundColor: Colors.white,
    padding: Spacing.md,
    borderRadius: Radius.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },

  image: {
    width: '100%',
    height: 200,
    borderRadius: Radius.sm,
    marginBottom: Spacing.sm,
  },

  placeholder: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.accent,
    borderRadius: Radius.sm,
    marginBottom: Spacing.sm,
  },

  placeholderText: {
    color: Colors.muted,
    fontWeight: '600',
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
    marginTop: Spacing.xs,
    color: Colors.muted,
  },

  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: Radius.sm,
    alignSelf: 'flex-end',
    marginTop: Spacing.sm,
  },

  buttonText: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: 12,
  },

  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },

  modalContainer: {
    width: '100%',
    backgroundColor: '#ffffff',
    padding: Spacing.lg,
    borderRadius: Radius.md,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },

  modalDescription: {
    color: Colors.text,
    fontSize: 16,
    marginBottom: Spacing.lg,
  },

  closeButton: {
    backgroundColor: Colors.primary,
    padding: Spacing.sm,
    borderRadius: Radius.sm,
    alignItems: 'center',
  },
  actionsRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginTop: 10,
  gap: 8,
},

editButton: {
  backgroundColor: '#4b7bec',
   paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: Radius.sm,
    alignSelf: 'flex-end',
    marginTop: Spacing.sm,
},

deleteButton: {
  backgroundColor: '#c94c4c',
   paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: Radius.sm,
    alignSelf: 'flex-end',
    marginTop: Spacing.sm,
},
adminContainer: {
  backgroundColor: '#1C2C4A',
},

adminHeader: {
  backgroundColor: '#223559',
  borderColor: '#667EA8',
  borderWidth: 1,
},

adminCard: {
  backgroundColor: '#223559',
  borderColor: '#667EA8',
},

adminText: {
  color: '#FFFFFF',
},

adminDate: {
  color: '#B8C6E0',
},
adminButton: {
 backgroundColor: '#16243D',
 borderWidth: 1,
 borderColor: '#667EA8',
},
input: {
  backgroundColor: '#ffffff',
  padding: 10,
  borderRadius: 8,
  marginBottom: 10,
  borderWidth: 1,
  borderColor: '#ccc',
  color: '#000',
},
blueButton: {
  backgroundColor: '#1f3b73',
  padding: 10,
  borderRadius: 8,
  marginTop: 10,
  alignItems: 'center'
},

blueButtonPrimary: {
  backgroundColor: '#162c55',
  padding: 12,
  borderRadius: 10,
  marginTop: 15,
  alignItems: 'center'
},

blueButtonText: {
  color: '#fff',
  fontWeight: 'bold'
},

cancelButton: {
  backgroundColor: '#2a2f3a',
  padding: 10,
  borderRadius: 8,
  marginTop: 10,
  alignItems: 'center'
},

cancelButtonText: {
  color: '#fff',
  fontWeight: '600'
}

});