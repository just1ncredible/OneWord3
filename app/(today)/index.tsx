import { Redirect, router } from 'expo-router';
import { useState } from 'react';
import { Keyboard, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useGame } from '@/components/game-provider';
import { PrimaryButton } from '@/components/primary-button';
import { useTheme } from '@/components/theme-provider';
import { WordInput } from '@/components/word-input';
import { Wordmark } from '@/components/wordmark';
import { space, type } from '@/constants/theme';
import { notifySuccess, notifyWarning, tapMedium, tapSelection } from '@/lib/haptics';
import { validateWord } from '@/lib/validation';

export default function TodayScreen() {
  const { requiredLength, submission, submitWord } = useGame();
  const { colors } = useTheme();
  const [word, setWord] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const insets = useSafeAreaInsets();

  if (submission) {
    return <Redirect href="/result" />;
  }

  const validation = validateWord(word, requiredLength);
  const isValid = validation.valid;
  const helperText = error
    ? error
    : word.length === 0
      ? 'One word. Lock it in.'
      : isValid
        ? 'Ready.'
        : `${word.length} of ${requiredLength}`;

  async function handleSubmit() {
    setError(null);
    setSubmitting(true);
    notifySuccess();
    const res = await submitWord(word);
    if (!res.ok) {
      notifyWarning();
      setError(res.reason);
      setSubmitting(false);
      return;
    }
    router.replace('/result');
  }

  return (
    <Pressable
      onPress={Keyboard.dismiss}
      style={{
        flex: 1,
        backgroundColor: colors.background,
        paddingHorizontal: space.lg,
        justifyContent: 'center',
      }}
    >
      <View style={{ position: 'absolute', top: insets.top + space.lg, left: 0, right: 0, alignItems: 'center' }}>
        <Wordmark size={22} />
      </View>

      <View style={{ gap: space.xl, paddingVertical: space.xxl }}>
        <View style={{ alignItems: 'center', gap: space.sm }}>
          <Text
            style={{
              fontSize: type.label,
              color: colors.muted,
              letterSpacing: 1.6,
              textTransform: 'uppercase',
              fontWeight: '600',
            }}
          >
            Today
          </Text>
          <Text
            style={{
              fontSize: type.dailyLength,
              fontWeight: '700',
              color: colors.text,
              letterSpacing: -2,
            }}
          >
            {requiredLength} letters
          </Text>
        </View>

        <WordInput
          autoFocus={false}
          value={word}
          onChangeText={(next) => {
            setError(null);
            if (next.length > word.length) tapSelection();
            const wasValid = isValid;
            setWord(next);
            const nextValid = validateWord(next, requiredLength).valid;
            if (!wasValid && nextValid) tapMedium();
          }}
          length={requiredLength}
          disabled={submitting}
          onSubmitEditing={() => {
            if (isValid && !submitting) handleSubmit();
          }}
        />

        <Text
          style={{
            fontSize: type.label,
            color: error ? colors.error : colors.muted,
            textAlign: 'center',
            minHeight: 20,
          }}
        >
          {helperText}
        </Text>

        <PrimaryButton
          label="Lock In"
          onPress={handleSubmit}
          disabled={!isValid}
          loading={submitting}
        />
      </View>
    </Pressable>
  );
}
