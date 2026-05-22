import { Stack } from 'expo-router';
import { useTheme } from '@/components/theme-provider';

export default function TodayLayout() {
  const { colors } = useTheme();
  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,
        headerStyle: { backgroundColor: colors.background },
        headerTitleStyle: { color: colors.text },
        headerTintColor: colors.accent,
        headerBackButtonDisplayMode: 'minimal',
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="result" options={{ headerShown: false }} />
      <Stack.Screen name="top-words" options={{ title: '' }} />
    </Stack>
  );
}
