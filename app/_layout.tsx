// Powered by OnSpace.AI
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { I18nManager, Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider } from '@/contexts/AppContext';

export default function RootLayout() {
  useEffect(() => {
    if (Platform.OS !== 'web') {
      I18nManager.allowRTL(true);
      I18nManager.forceRTL(true);
    }
  }, []);

  return (
    <SafeAreaProvider>
      <AppProvider>
        <StatusBar style="light" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="add-transaction"
            options={{
              headerShown: false,
              presentation: 'modal',
            }}
          />
          <Stack.Screen
            name="account-statement"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="reports"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="reconciliation"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="add-client"
            options={{
              headerShown: false,
              presentation: 'modal',
            }}
          />
        </Stack>
      </AppProvider>
    </SafeAreaProvider>
  );
}
