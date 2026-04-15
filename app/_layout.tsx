import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider, useTheme } from '../constants/ThemeContext';
import { View } from 'react-native';
import React from 'react';

function AppContent() {
  const { darkMode } = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: darkMode ? '#0a1628' : '#fff' }}>
      <StatusBar style={darkMode ? 'light' : 'light'} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </View>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}