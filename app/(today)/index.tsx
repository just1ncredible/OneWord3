import { Redirect, router } from 'expo-router';
import { useState } from 'react';
import { Keyboard, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useGame } from '@/components/game-provider';
import { useTheme } from '@/components/theme-provider';
import { WordInput } from '@/components/word-input';
import { Wordmark } from '@/components/wordmark';
import { space, type } from '@/constants/theme';
import { notifySuccess, notifyWarning, tapMedium, tapSelection } from '@/lib/haptics';
import { validateWord } from '@/lib/validation';

const NUMBER_WORDS: Record<number, string> = {
  1: 'one', 2: 'two', 3: 'three', 4: 'four', 5: 'five',
  6: 'six', 7: 'seven', 8: 'eight', 9: 'nine', 10: 'ten',
};

export default function TodayScreen() {
  const { requiredLength, submission, submitWord } = useGame();
  const { colors } = useTheme();
  const [word, setWord] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const insets = useSafeAreaInsets();

  if (submission) {
    return <Redirect href="/result" />;
  }

  const isValid = validateWord(word, requiredLength).valid;

  async function handleSubmit() {
    setSubmitting(true);
    notifySuccess();
    const res = await submitWord(word);
    if (!res.ok) {
      notifyWarning();
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
        paddingBottom: space.xxl,
        justifyContent: 'center',
      }}
    >
      <View style={{ position: 'absolute', top: insets.top + space.lg, left: 0, right: 0, alignItems: 'center' }}>
        <Wordmark size={22} />
      </View>

      <View style={{ gap: space.xl, paddingVertical: space.xxl }}>
        <View style={{ alignItems: 'center' }}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: '500',
              color: colors.muted,
              textAlign: 'center',
              letterSpacing: 0,
              lineHeight: 28,
            }}
          >
            {'Today, a word of '}
            <Text style={{ color: colors.accent, fontWeight: '600' }}>
              {NUMBER_WORDS[requiredLength] ?? String(requiredLength)}
            </Text>
            {' letters.'}
          </Text>
        </View>

        <WordInput
          autoFocus={false}
          value={word}
          onChangeText={(next) => {
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
            fontSize: type.body,
            color: colors.muted,
            fontWeight: '500',
            textAlign: 'center',
          }}
        >
          {submitting ? 'Finding your place…' : 'Pick the word that feels right.'}
        </Text>
      </View>
    </Pressable>
  );
}
