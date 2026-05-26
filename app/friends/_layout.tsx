import { Stack } from 'expo-router';
import { useTheme } from '@/components/theme-provider';

export default function FriendsLayout() {
  const { colors } = useTheme();
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen
        name="manage"
        options={{
          presentation: 'formSheet',
          sheetGrabberVisible: false,
          sheetAllowedDetents: [1.0],
        }}
      />
    </Stack>
  );
}
