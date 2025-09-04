import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { auth, firestore } from '../config/firebase.js';
import { updateEmail, updateProfile } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export default function EditProfileScreen() {
  const user = auth.currentUser;

  const [form, setForm] = useState({
    name: '',
    email: '',
    title: '',
    gradYear: '',
  });

  const [loading, setLoading] = useState(true); // Cambio a true porque cargamos datos

  useEffect(() => {
    async function fetchUserData() {
      try {
        if (!user) return;

        // Obtener datos adicionales desde Firestore
        const docRef = doc(firestore, 'users', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();

          setForm({
            name: user.displayName || '',
            email: user.email || '',
            title: data.title || '',
            gradYear: data.gradYear || '',
          });
        } else {
          // Si no hay datos en Firestore, rellena con datos básicos
          setForm({
            name: user.displayName || '',
            email: user.email || '',
            title: '',
            gradYear: '',
          });
        }
      } catch (error) {
        console.error('Error al obtener datos del usuario:', error);
        Alert.alert('Error', 'No se pudieron cargar los datos del perfil.');
      } finally {
        setLoading(false);
      }
    }

    fetchUserData();
  }, [user]);

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleUpdate = async () => {
    setLoading(true);

    try {
      if (form.name && form.name !== user.displayName) {
        await updateProfile(user, { displayName: form.name });
      }

      if (form.email && form.email !== user.email) {
        await updateEmail(user, form.email);
      }

      // No actualizamos contraseña

      // Guardar datos adicionales en Firestore
      await setDoc(
        doc(firestore, 'users', user.uid),
        {
          name: form.name,
          email: form.email,
          title: form.title,
          gradYear: form.gradYear,
        },
        { merge: true }
      );

      Alert.alert('Éxito', 'Tu perfil fue actualizado correctamente.');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', error.message || 'Ocurrió un error.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#4a148c" />
        <Text style={{ color: '#fff', marginTop: 10 }}>Cargando datos...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#000' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Editar Perfil</Text>

        <TextInput
          style={styles.input}
          placeholder="Nombre"
          value={form.name}
          onChangeText={(val) => handleChange('name', val)}
          placeholderTextColor="#999"
        />

        <TextInput
          style={styles.input}
          placeholder="Correo electrónico"
          value={form.email}
          onChangeText={(val) => handleChange('email', val)}
          placeholderTextColor="#999"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Título (Ej. Estudiante, Ingeniero)"
          value={form.title}
          onChangeText={(val) => handleChange('title', val)}
          placeholderTextColor="#999"
        />

        <TextInput
          style={styles.input}
          placeholder="Año de graduación"
          value={form.gradYear}
          onChangeText={(val) => handleChange('gradYear', val)}
          placeholderTextColor="#999"
          keyboardType="numeric"
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleUpdate}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Guardar cambios</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#000',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#1e1e1e',
    color: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#4a148c',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
