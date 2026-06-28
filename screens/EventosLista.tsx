import React from 'react';

import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
} from 'react-native';

import { useEventosLogic } from '../hooks/useEventoLogic';
import HeaderImage from '../components/HeaderImage';

import { Colors, Radius, Spacing } from '../styles/theme';


export default function EventosLista() {
  const { eventos } = useEventosLogic();

  return (
    <View style={styles.container}>

      <HeaderImage />

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>Eventos Marcados</Text>
      </View>

      {/* LISTA */}
      <FlatList
        data={eventos}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.card}>

            {item.imageUrl ? (
              <Image
                source={{ uri: item.imageUrl }}
                style={styles.image}
              />
            ) : (
              <View style={styles.placeholder}>
                <Text style={styles.placeholderText}>
                  Sem imagem
                </Text>
              </View>
            )}

            <Text style={styles.name}>
              {item.title}
            </Text>

            <Text style={styles.text}>
              {item.descricao}
            </Text>

            <Text style={styles.text}>
              Local: {item.local}
            </Text>

            <Text style={styles.date}>
              {new Date(item.data).toLocaleDateString('pt-BR')}
            </Text>

          </View>
        )}
      />

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
});