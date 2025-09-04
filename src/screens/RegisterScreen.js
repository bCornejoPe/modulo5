// src/screens/RegisterScreen.js
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Title } from 'react-native-paper';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, firestore } from '../config/firebase'; // asegúrate que exportas 'database'
import InputField from '../components/InputField';
import PrimaryButton from '../components/Button';

export default function RegisterScreen({ navigation }) {
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        title: '',
        gradYear: '',
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

    const onRegister = async () => {
        const { name, email, password, title, gradYear } = form;
        if (!name.trim() || !email.trim() || !password.trim()) {
            return Alert.alert('Error', 'Completa los campos requeridos');
        }
        setLoading(true);
        try {
            const userCred = await createUserWithEmailAndPassword(auth, email, password);
            const u = userCred.user;
            await updateProfile(u, { displayName: name });
            await setDoc(doc(firestore, 'users', u.uid), {
                name,
                email,
                title,
                gradYear,
                createdAt: new Date().toISOString(),
            });

            Alert.alert('Éxito', 'Cuenta creada');
            navigation.replace('Home');
        } catch (error) {
            console.error(error);
            Alert.alert('Error', error.message);
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
                <Title style={styles.title}>Registro</Title>

                <InputField
                    label="Nombre"
                    value={form.name}
                    onChangeText={val => handleChange('name', val)}
                />
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
                <InputField
                    label="Título universitario"
                    value={form.title}
                    onChangeText={val => handleChange('title', val)}
                />
                <InputField
                    label="Año de graduación"
                    value={form.gradYear}
                    onChangeText={val => handleChange('gradYear', val)}
                    keyboardType="numeric"
                />

                <PrimaryButton
                    title={loading ? 'Creando...' : 'Registrar'}
                    onPress={onRegister}
                    disabled={loading}
                    loading={loading}
                />

                <PrimaryButton
                    title="¿Ya tienes cuenta? Iniciar sesión"
                    mode="text"
                    onPress={() => navigation.navigate('Login')}
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
