import { Stack } from 'expo-router';
import { useTheme } from '@/components/theme-provider';

export default function FriendsLayout() {
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
      <Stack.Screen
        name="manage"
        options={{
          presentation: 'formSheet',
          sheetGrabberVisible: false,
          sheetAllowedDetents: [1.0],
          headerShown: false,
        }}
      />
    </Stack>
  );
}
