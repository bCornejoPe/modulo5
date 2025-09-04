import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing, Dimensions } from 'react-native';

export default function SplashScreen() {
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const colorAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animación de rebote del logo
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: -10,
          duration: 500,
          useNativeDriver: true,
          easing: Easing.linear,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
          easing: Easing.linear,
        }),
      ])
    ).start();

    // Animación de cambio de color cíclica
    Animated.loop(
      Animated.sequence([
        Animated.timing(colorAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: false,
        }),
        Animated.timing(colorAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, []);

  const backgroundColor = colorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#1e1e1e', '#4a148c'], // Cambia los colores aquí (oscuro a púrpura)
  });

  return (
    <Animated.View style={[styles.container, { backgroundColor }]}>
      <Animated.Text style={[styles.logo, { transform: [{ translateY: bounceAnim }] }]}>
        Mi App
      </Animated.Text>
      <Text style={styles.loadingText}>Cargando...</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  logo: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff'
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: '#ccc'
  }
});
