import { router } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import { useGame } from '@/components/game-provider';
import { PrimaryButton } from '@/components/primary-button';
import { useTheme } from '@/components/theme-provider';
import { radius, space, type } from '@/constants/theme';
import { MOCK_TOP_WORDS_TODAY } from '@/lib/mock-stats';

export default function TopWordsScreen() {
  const { submission, requiredLength } = useGame();
  const { colors } = useTheme();

  if (!submission) {
    return (
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: space.lg,
          gap: space.lg,
        }}
        style={{ backgroundColor: colors.background }}
      >
        <Text
          style={{
            fontSize: type.resultLine,
            color: colors.text,
            textAlign: 'center',
            fontWeight: '500',
          }}
        >
          Choose today's word first.
        </Text>
        <PrimaryButton label="Go to Today" onPress={() => router.replace('/')} />
      </ScrollView>
    );
  }

  const userWord = submission.word;
  const userInList = MOCK_TOP_WORDS_TODAY.some((w) => w.word === userWord);

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{ paddingHorizontal: space.lg, paddingBottom: space.xl, gap: space.md }}
      style={{ backgroundColor: colors.background }}
    >
      <Text style={{ fontSize: type.label, color: colors.muted, fontWeight: '500' }}>
        {requiredLength} letters today
      </Text>

      <View
        style={{
          backgroundColor: colors.surface,
          borderRadius: radius.slot,
          borderCurve: 'continuous',
          borderWidth: 1,
          borderColor: colors.line,
        }}
      >
        {MOCK_TOP_WORDS_TODAY.map((row, i) => {
          const isUser = row.word === userWord;
          return (
            <View
              key={row.word}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: space.lg,
                paddingVertical: 14,
                borderBottomWidth: i === MOCK_TOP_WORDS_TODAY.length - 1 ? 0 : 1,
                borderBottomColor: colors.line,
              }}
            >
              <Text
                style={{
                  width: 28,
                  fontSize: type.body,
                  color: colors.muted,
                  fontVariant: ['tabular-nums'],
                }}
              >
                {i + 1}
              </Text>
              <Text
                selectable
                style={{
                  flex: 1,
                  fontSize: type.body,
                  fontWeight: isUser ? '700' : '500',
                  color: isUser ? colors.accent : colors.text,
                }}
              >
                {row.word}
              </Text>
              <Text
                selectable
                style={{
                  fontSize: type.body,
                  color: colors.muted,
                  fontVariant: ['tabular-nums'],
                }}
              >
                {row.count.toLocaleString()}
              </Text>
            </View>
          );
        })}
      </View>

      {!userInList ? (
        <View style={{ gap: space.sm, marginTop: space.md }}>
          <Text style={{ fontSize: type.label, color: colors.muted, fontWeight: '500' }}>
            Your word
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: space.lg,
              paddingVertical: 14,
              backgroundColor: colors.surface,
              borderRadius: radius.slot,
              borderCurve: 'continuous',
              borderWidth: 1,
              borderColor: colors.line,
            }}
          >
            <Text
              selectable
              style={{ flex: 1, fontSize: type.body, fontWeight: '700', color: colors.accent }}
            >
              {userWord}
            </Text>
            <Text
              style={{
                fontSize: type.body,
                color: colors.muted,
                fontVariant: ['tabular-nums'],
              }}
            >
              {submission.stats.overallRank ? `#${submission.stats.overallRank}` : 'new'}
            </Text>
          </View>
        </View>
      ) : null}
    </ScrollView>
  );
}
