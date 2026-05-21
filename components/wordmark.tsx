import { Text, View } from 'react-native';
import { useTheme } from '@/components/theme-provider';

export function Wordmark({ size = 20 }: { size?: number }) {
  const { colors } = useTheme();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
      <Text style={{ fontSize: size, fontWeight: '300', color: colors.text, letterSpacing: -0.3 }}>
        One
      </Text>
      <Text style={{ fontSize: size, fontWeight: '700', color: colors.text, letterSpacing: -0.3 }}>
        Word
      </Text>
      <Text style={{ fontSize: size, fontWeight: '700', color: colors.text }}>.</Text>
    </View>
  );
}
