import { Stack } from 'expo-router';
import { useTheme } from '@/components/theme-provider';

export default function HistoryLayout() {
  const { colors } = useTheme();
  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,
        headerStyle: { backgroundColor: colors.background },
        headerTitleStyle: { color: colors.text },
        headerTintColor: colors.accent,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="index" options={{ title: '' }} />
      <Stack.Screen name="word" options={{ title: '' }} />
    </Stack>
  );
}
