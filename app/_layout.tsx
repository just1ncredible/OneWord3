import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GameProvider } from '@/components/game-provider';
import { ThemeProvider, useTheme } from '@/components/theme-provider';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <GameProvider>
          <ThemedShell />
        </GameProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

function ThemedShell() {
  const { colors, scheme } = useTheme();
  return (
    <>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShadowVisible: false,
          headerLargeTitleShadowVisible: false,
          headerLargeStyle: { backgroundColor: colors.background },
          headerStyle: { backgroundColor: colors.background },
          headerTitleStyle: { color: colors.text },
          headerLargeTitleStyle: { color: colors.text },
          headerTintColor: colors.accent,
          headerBackButtonDisplayMode: 'minimal',
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="result" options={{ headerShown: false }} />
        <Stack.Screen name="top-words" options={{ title: 'Top Words', headerLargeTitle: true }} />
        <Stack.Screen name="history" options={{ title: 'History', headerLargeTitle: true }} />
        <Stack.Screen name="settings" options={{ title: 'Settings', headerLargeTitle: true }} />
      </Stack>
    </>
  );
}
