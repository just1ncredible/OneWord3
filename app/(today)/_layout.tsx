import { Stack } from 'expo-router';
import { useTheme } from '@/components/theme-provider';

export default function TodayLayout() {
  const { colors } = useTheme();
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    />
  );
}
