import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { auth, firestore } from '../config/firebase.js';
import { doc, getDoc } from 'firebase/firestore';

export default function HomeScreen() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) {
        setUserData(null);
        setLoading(false);
        return;
      }

      const docRef = doc(firestore, 'users', user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setUserData({
          name: user.displayName || data.name || 'Usuario',
          email: user.email || data.email,
          title: data.title || '',
          gradYear: data.gradYear || '',
        });
      } else {
        setUserData({
          name: user.displayName || 'Usuario',
          email: user.email || '',
          title: '',
          gradYear: '',
        });
      }
    } catch (error) {
      console.error('Error al cargar datos:', error);
      setUserData(null);
    } finally {
      setLoading(false);
    }
  };

  // Refrescar datos cada vez que la pantalla recibe foco
  useFocusEffect(
    useCallback(() => {
      fetchUserData();
    }, [])
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#4a148c" />
        <Text style={styles.loadingText}>Cargando datos del usuario...</Text>
      </View>
    );
  }

  if (!userData) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>No hay sesión activa</Text>
        <Text style={styles.subtitle}>Por favor, inicia sesión</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>¡Bienvenido, {userData.name}!</Text>
      <Text style={styles.subtitle}>Correo: {userData.email}</Text>
      <Text style={styles.subtitle}>Carrera: {userData.title}</Text>
      <Text style={styles.subtitle}>Año: {userData.gradYear}</Text>
      <Text style={styles.message}>Esta es la pantalla principal.</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('EditProfile')}
      >
        <Text style={styles.buttonText}>Editar perfil</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // Fondo negro
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    color: '#ccc',
    marginBottom: 20,
  },
  message: {
    fontSize: 16,
    color: '#aaa',
  },
  loadingText: {
    marginTop: 10,
    color: '#aaa',
  },
  button: {
    marginTop: 30,
    backgroundColor: '#4a148c',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
