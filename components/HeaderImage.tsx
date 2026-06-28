import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

export default function HeaderImage() {
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/logo.png')}
        style={styles.image}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
  },

  image: {
    width: 180,
    height: 80,
  },
});