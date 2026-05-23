import { Stack } from 'expo-router';
import { useCallback } from 'react';
import { Text, View } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  type SharedValue,
} from 'react-native-reanimated';
import { useGame, type HistoryEntry } from '@/components/game-provider';
import { useTheme } from '@/components/theme-provider';
import { radius, space, type } from '@/constants/theme';

function formatDate(iso: string) {
  const [, m, d] = iso.split('-').map(Number);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[m - 1]} ${d}`;
}

function placementShort(entry: HistoryEntry): string {
  const s = entry.stats;
  if (s.totalForWord === 1) return 'Original — yours alone';
  if (s.totalForWord <= 5) return `Rare — ${s.totalForWord} chose it`;
  if (s.wordRank <= 10) return `Early — #${s.wordRank} for this word`;
  return `Wave — ${s.totalForWord.toLocaleString()} chose it`;
}

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
        History
      </Animated.Text>
    </View>
  );
}

export default function HistoryScreen() {
  const { history, submission } = useGame();
  const { colors } = useTheme();
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const headerTitle = useCallback(
    () => <AnimatedHeaderTitle scrollY={scrollY} />,
    [scrollY],
  );

  const entries: HistoryEntry[] = submission
    ? [
        {
          date: submission.date,
          word: submission.word,
          requiredLength: submission.requiredLength,
          stats: submission.stats,
        },
        ...history,
      ]
    : history;

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
          History
        </Text>

        {entries.length === 0 ? (
          <Text style={{ fontSize: type.body, color: colors.muted }}>
            Your words will collect here.
          </Text>
        ) : (
          <View style={{ gap: space.md }}>
            {entries.map((entry) => (
              <View
                key={entry.date}
                style={{
                  backgroundColor: colors.surface,
                  borderRadius: radius.slot,
                  borderCurve: 'continuous',
                  borderWidth: 1,
                  borderColor: colors.line,
                  paddingHorizontal: space.lg,
                  paddingVertical: space.lg,
                  gap: 6,
                }}
              >
                <Text
                  style={{
                    fontSize: type.small,
                    color: colors.muted,
                    fontWeight: '500',
                    letterSpacing: 0.4,
                  }}
                >
                  {formatDate(entry.date)}
                </Text>
                <Text
                  selectable
                  style={{
                    fontSize: 28,
                    color: colors.text,
                    fontWeight: '700',
                    letterSpacing: -0.5,
                  }}
                >
                  {entry.word}
                </Text>
                <Text style={{ fontSize: type.label, color: colors.muted }}>
                  {placementShort(entry)}
                </Text>
              </View>
            ))}
          </View>
        )}
      </Animated.ScrollView>
    </>
  );
}
