import { Text, View } from 'react-native';
import { useTheme } from '@/components/theme-provider';
import { type } from '@/constants/theme';

export type Stat = {
  value: string;
  label: string;
};

export function StatRow({ stats }: { stats: Stat[] }) {
  const { colors } = useTheme();
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 28 }}>
      {stats.map((s, i) => (
        <View key={i} style={{ alignItems: 'center', gap: 4 }}>
          <Text
            selectable
            style={{
              fontSize: type.resultLine,
              fontWeight: '600',
              color: colors.text,
              fontVariant: ['tabular-nums'],
            }}
          >
            {s.value}
          </Text>
          <Text style={{ fontSize: type.small, color: colors.muted, fontWeight: '500' }}>
            {s.label}
          </Text>
        </View>
      ))}
    </View>
  );
}
