import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { setAudioModeAsync } from 'expo-audio';
import { SettingsProvider } from '../lib/settings';
import { colors } from '../lib/theme';

export default function RootLayout() {
  useEffect(() => {
    // Timer alerts should be heard even with the iPhone's silent switch on.
    setAudioModeAsync({ playsInSilentMode: true, interruptionMode: 'mixWithOthers' }).catch(() => {});
  }, []);

  return (
    <SettingsProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.primary },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: '700' },
          contentStyle: { backgroundColor: colors.background },
          headerBackTitle: 'Voltar',
        }}
      >
        <Stack.Screen name="index" options={{ title: 'Café Guia', headerShown: false }} />
        <Stack.Screen name="metodo/[id]" options={{ title: 'Método' }} />
        <Stack.Screen name="guia/[id]" options={{ title: 'Passo a passo' }} />
        <Stack.Screen name="calculadora" options={{ title: 'Calculadora' }} />
        <Stack.Screen name="timer" options={{ title: 'Cronômetro' }} />
        <Stack.Screen name="moagem" options={{ title: 'Guia de moagem' }} />
        <Stack.Screen name="cafes" options={{ title: 'Tipos de café' }} />
      </Stack>
    </SettingsProvider>
  );
}
