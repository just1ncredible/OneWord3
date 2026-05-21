import { Pressable, Text } from 'react-native';
import { useTheme } from '@/components/theme-provider';
import { radius, type } from '@/constants/theme';

type Props = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
};

export function PrimaryButton({ label, onPress, disabled, loading }: Props) {
  const { colors } = useTheme();
  const isInactive = disabled || loading;
  return (
    <Pressable
      onPress={onPress}
      disabled={isInactive}
      style={({ pressed }) => ({
        backgroundColor: isInactive ? colors.disabled : colors.accent,
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: radius.button,
        borderCurve: 'continuous',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: pressed ? 0.88 : 1,
      })}
    >
      <Text
        style={{
          color: colors.onAccent,
          fontSize: type.body,
          fontWeight: '600',
          letterSpacing: 0.2,
        }}
      >
        {loading ? 'Finding your place…' : label}
      </Text>
    </Pressable>
  );
}
