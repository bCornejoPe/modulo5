import React, { useEffect, useState } from 'react';
import { View, StatusBar, Text } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import {
  useFonts,
  Poppins_400Regular,
  Poppins_600SemiBold,
} from '@expo-google-fonts/poppins';

import SplashScreen from './src/screens/SplashScreen'; // animación con colores
import AppNavigator from './src/navigation/Navigation'; // navegación principal
import { DarkTheme } from './src/theme/theme'; // tema personalizado

export default function App() {
  const [isSplashVisible, setIsSplashVisible] = useState(true);

  // Cargar fuentes
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
  });

  // Simular carga inicial (como la splash screen)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSplashVisible(false);
    }, 4000); // 4 segundos

    return () => clearTimeout(timer);
  }, []);

  // Mostrar pantalla negra o texto mientras cargan fuentes
  if (!fontsLoaded) return <Text style={{ marginTop: 40, textAlign: 'center' }}>Cargando fuentes...</Text>;

  return (
    <PaperProvider theme={DarkTheme}>
      <StatusBar barStyle="light-content" backgroundColor="#1e1e1e" />
      {isSplashVisible ? <SplashScreen /> : <AppNavigator />}
    </PaperProvider>
  );
}
