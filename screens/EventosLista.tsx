import React from 'react';

import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
} from 'react-native';

import { useEventosLogic } from '../hooks/useEventoLogic';

export default function EventosLista() {
  const { eventos } = useEventosLogic();

  return (
    <View style={styles.container}>

      <Text style={styles.title}>
        Eventos Marcados
      </Text>

      <FlatList
        data={eventos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>

            {item.imageUrl ? (
              <Image
                source={{ uri: item.imageUrl }}
                style={styles.image}
              />
            ) : (
              <View style={styles.placeholder}>
                <Text>Sem imagem</Text>
              </View>
            )}

            <Text style={styles.name}>
              {item.title}
            </Text>

            <Text>{item.descricao}</Text>

            <Text>{item.local}</Text>

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
    marginBottom: 10,
  },

  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },

  image: {
    width: '100%',
    height: 200,
    marginBottom: 10,
  },

  placeholder: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eee',
    marginBottom: 10,
  },

  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },

});