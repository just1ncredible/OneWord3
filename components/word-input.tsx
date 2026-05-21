import { useEffect, useRef } from 'react';
import { Pressable, TextInput, View, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '@/components/theme-provider';
import { radius } from '@/constants/theme';

type Props = {
  value: string;
  onChangeText: (next: string) => void;
  length: number;
  disabled?: boolean;
  autoFocus?: boolean;
  onSubmitEditing?: () => void;
};

export function WordInput({
  value,
  onChangeText,
  length,
  disabled,
  autoFocus = true,
  onSubmitEditing,
}: Props) {
  const { colors } = useTheme();
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (autoFocus && !disabled) {
      const t = setTimeout(() => inputRef.current?.focus(), 250);
      return () => clearTimeout(t);
    }
  }, [autoFocus, disabled]);

  const slots = Array.from({ length });
  const chars = value.split('');

  return (
    <Pressable
      onPress={() => inputRef.current?.focus()}
      disabled={disabled}
      style={{ alignItems: 'center' }}
    >
      <View style={{ flexDirection: 'row', gap: 10 }}>
        {slots.map((_, i) => (
          <Slot
            key={i}
            char={chars[i]}
            isCursor={!disabled && i === chars.length}
            colors={colors}
          />
        ))}
      </View>

      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={(next) => onChangeText(next.replace(/[^a-zA-Z]/g, '').slice(0, length))}
        maxLength={length}
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="off"
        spellCheck={false}
        keyboardType="default"
        editable={!disabled}
        onSubmitEditing={onSubmitEditing}
        returnKeyType="go"
        style={{ position: 'absolute', opacity: 0, width: 1, height: 1 }}
        caretHidden
      />
    </Pressable>
  );
}

function Slot({
  char,
  isCursor,
  colors,
}: {
  char: string | undefined;
  isCursor: boolean;
  colors: ReturnType<typeof useTheme>['colors'];
}) {
  const scale = useSharedValue(1);
  const borderProgress = useSharedValue(0);
  const isFilled = !!char;

  useEffect(() => {
    if (isFilled) {
      scale.value = withSequence(
        withTiming(1.08, { duration: 90 }),
        withSpring(1, { damping: 12, stiffness: 220 }),
      );
    }
  }, [isFilled, scale]);

  useEffect(() => {
    borderProgress.value = withTiming(isCursor ? 1 : 0, { duration: 160 });
  }, [isCursor, borderProgress]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      style={[
        {
          width: 48,
          height: 64,
          borderRadius: radius.slot,
          borderCurve: 'continuous',
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: isCursor ? colors.accent : colors.line,
          alignItems: 'center',
          justifyContent: 'center',
        },
        animatedStyle,
      ]}
    >
      <Text
        style={{
          fontSize: 32,
          fontWeight: '600',
          color: isFilled ? colors.text : colors.muted,
          letterSpacing: -0.5,
        }}
      >
        {char ? char.toLowerCase() : ''}
      </Text>
    </Animated.View>
  );
}
