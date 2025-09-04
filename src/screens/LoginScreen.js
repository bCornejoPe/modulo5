import React, { useState } from 'react';
import { ScrollView, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Title } from 'react-native-paper';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';
import InputField from '../components/InputField';
import PrimaryButton from '../components/Button';

export default function LoginScreen({ navigation }) {
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  const onLogin = async () => {
    const { email, password } = form;

    if (!email.trim() || !password.trim()) {
      return Alert.alert('Error', 'Por favor, completa todos los campos');
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Si login exitoso, navega a Home u otra pantalla principal
      navigation.replace('Home');
    } catch (error) {
      console.error(error);
      // Manejo de errores comunes
      if (error.code === 'auth/invalid-email') {
        Alert.alert('Error', 'Usuario no encontrado. Verifica el correo.');
      } else if (error.code === 'auth/wrong-password') {
        Alert.alert('Error', 'Contraseña incorrecta.');
      } else {
        Alert.alert('Error', error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Title style={styles.title}>Iniciar Sesión</Title>

        <InputField
          label="Correo"
          value={form.email}
          onChangeText={val => handleChange('email', val)}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <InputField
          label="Contraseña"
          value={form.password}
          onChangeText={val => handleChange('password', val)}
          secureTextEntry
        />

        <PrimaryButton
          title={loading ? 'Ingresando...' : 'Iniciar Sesión'}
          onPress={onLogin}
          disabled={loading}
          loading={loading}
        />

        <PrimaryButton
          title="¿No tienes cuenta? Regístrate"
          mode="text"
          onPress={() => navigation.navigate('Register')}
          style={{ marginTop: 16 }}
          labelStyle={{ color: '#fff', fontFamily: 'Poppins_400Regular' }}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: {
    padding: 20,
    paddingTop: 50,
    flexGrow: 1,
    backgroundColor: '#000000',
  },
  title: {
    color: '#ffffff',
    fontSize: 26,
    fontFamily: 'Poppins_600SemiBold',
    marginBottom: 20,
    textAlign: 'center',
  },
});
