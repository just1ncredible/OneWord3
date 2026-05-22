import { router, Stack } from 'expo-router';
import { useCallback } from 'react';
import { Text, View } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  type SharedValue,
} from 'react-native-reanimated';
import { useGame } from '@/components/game-provider';
import { PrimaryButton } from '@/components/primary-button';
import { useTheme } from '@/components/theme-provider';
import { radius, space, type } from '@/constants/theme';
import { MOCK_NICHE_WORDS_TODAY, MOCK_TOP_WORDS_TODAY } from '@/lib/mock-stats';

function AnimatedHeaderTitle({ scrollY }: { scrollY: SharedValue<number> }) {
  const { colors } = useTheme();
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [44, 68], [0, 1], 'clamp'),
  }));
  return (
    <View pointerEvents="none">
      <Animated.Text
        style={[{ fontSize: type.body, fontWeight: '600', color: colors.text }, animatedStyle]}
      >
        Today's Words
      </Animated.Text>
    </View>
  );
}

const sectionLabelStyle = {
  fontSize: type.small,
  fontWeight: '600' as const,
  letterSpacing: 1.2,
  textTransform: 'uppercase' as const,
};

export default function TopWordsScreen() {
  const { submission, requiredLength } = useGame();
  const { colors } = useTheme();
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const headerTitle = useCallback(
    () => <AnimatedHeaderTitle scrollY={scrollY} />,
    [scrollY],
  );

  const userWord = submission?.word;
  const userInTopList = userWord ? MOCK_TOP_WORDS_TODAY.some((w) => w.word === userWord) : false;
  const userInNicheList = userWord ? MOCK_NICHE_WORDS_TODAY.some((w) => w.word === userWord) : false;

  return (
    <>
      <Stack.Screen options={{ headerTitle, title: '' }} />
      <Animated.ScrollView
        contentInsetAdjustmentBehavior="automatic"
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={{
          paddingHorizontal: space.lg,
          paddingBottom: space.xl,
          gap: space.xl,
        }}
        style={{ flex: 1, backgroundColor: colors.background }}
      >
        <Text
          style={{
            fontSize: 34,
            fontWeight: '700',
            color: colors.text,
            letterSpacing: 0.3,
            paddingTop: space.xs,
            paddingBottom: 0,
          }}
        >
          Today's Words
        </Text>

        {!submission ? (
          <View style={{ gap: space.lg }}>
            <Text style={{ fontSize: type.body, color: colors.muted, fontWeight: '500' }}>
              Choose today's word first.
            </Text>
            <PrimaryButton label="Go to Today" onPress={() => router.replace('/')} />
          </View>
        ) : (
          <>
            <Text style={{ fontSize: type.label, color: colors.muted, fontWeight: '500' }}>
              {requiredLength} letters today
            </Text>

            <View style={{ gap: space.sm, marginTop: space.sm }}>
              <Text style={[sectionLabelStyle, { color: colors.muted }]}>Top Words</Text>
              <WordListCard
                words={MOCK_TOP_WORDS_TODAY}
                userWord={userWord}
                colors={colors}
              />
            </View>

            <View style={{ gap: space.sm, marginTop: space.sm }}>
              <Text style={[sectionLabelStyle, { color: colors.muted }]}>Most Niche Words</Text>
              <WordListCard
                words={MOCK_NICHE_WORDS_TODAY}
                userWord={userWord}
                colors={colors}
              />
            </View>

            {!userInTopList && !userInNicheList ? (
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
          </>
        )}
      </Animated.ScrollView>
    </>
  );
}

function WordListCard({
  words,
  userWord,
  colors,
}: {
  words: { word: string; count: number }[];
  userWord: string | undefined;
  colors: ReturnType<typeof useTheme>['colors'];
}) {
  return (
    <View
      style={{
        backgroundColor: colors.surface,
        borderRadius: radius.slot,
        borderCurve: 'continuous',
        borderWidth: 1,
        borderColor: colors.line,
      }}
    >
      {words.map((row, i) => {
        const isUser = row.word === userWord;
        return (
          <View
            key={row.word}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: space.lg,
              paddingVertical: 14,
              borderBottomWidth: i === words.length - 1 ? 0 : 1,
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
  );
}
