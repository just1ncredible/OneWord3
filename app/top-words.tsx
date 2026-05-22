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
import { MOCK_TOP_WORDS_TODAY } from '@/lib/mock-stats';

function AnimatedHeaderTitle({ scrollY }: { scrollY: SharedValue<number> }) {
  const { colors } = useTheme();
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [20, 52], [0, 1], 'clamp'),
  }));
  return (
    <View pointerEvents="none">
      <Animated.Text
        style={[{ fontSize: type.body, fontWeight: '600', color: colors.text }, animatedStyle]}
      >
        Top Words
      </Animated.Text>
    </View>
  );
}

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
  const userInList = userWord ? MOCK_TOP_WORDS_TODAY.some((w) => w.word === userWord) : false;

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
          gap: space.md,
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
            paddingBottom: space.xs,
          }}
        >
          Top Words
        </Text>

        {!submission ? (
          <View style={{ gap: space.lg, alignItems: 'flex-start' }}>
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
          </>
        )}
      </Animated.ScrollView>
    </>
  );
}
