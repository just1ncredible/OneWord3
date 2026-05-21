import { Link, Redirect, router } from 'expo-router';
import { useEffect } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useGame } from '@/components/game-provider';
import { PrimaryButton } from '@/components/primary-button';
import { StatRow } from '@/components/stat-block';
import { useTheme } from '@/components/theme-provider';
import { Wordmark } from '@/components/wordmark';
import { space, type } from '@/constants/theme';
import { tapLight } from '@/lib/haptics';
import type { WordStats } from '@/lib/mock-stats';

type Placement =
  | { kind: 'started'; word: string }
  | { kind: 'rank'; rank: number; word: string }
  | { kind: 'joined'; otherCount: number; word: string };

function describePlacement(stats: WordStats): Placement {
  if (stats.isFirst || stats.wordRank === 1) {
    return { kind: 'started', word: stats.word };
  }
  if (stats.wordRank > 10) {
    return { kind: 'joined', otherCount: stats.totalForWord - 1, word: stats.word };
  }
  return { kind: 'rank', rank: stats.wordRank, word: stats.word };
}

function formatPercent(p: number) {
  if (p < 0.1) return '<0.1%';
  return `${p.toFixed(1)}%`;
}

function formatLongDate(iso: string) {
  const [, m, d] = iso.split('-').map(Number);
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  return `${months[m - 1]} ${d}`;
}

export default function ResultScreen() {
  const { submission } = useGame();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const t = setTimeout(() => tapLight(), 120);
    return () => clearTimeout(t);
  }, []);

  if (!submission) return <Redirect href="/" />;

  const { stats } = submission;
  const placement = describePlacement(stats);

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{
        flexGrow: 1,
        paddingTop: insets.top + space.lg,
        paddingBottom: insets.bottom + space.lg,
        paddingHorizontal: space.lg,
      }}
      style={{ backgroundColor: colors.background }}
    >
      <View style={{ alignItems: 'center' }}>
        <Wordmark size={22} />
      </View>

      <View style={{ flex: 1, justifyContent: 'center', gap: space.xl, paddingVertical: space.xxl }}>
        <Animated.View
          entering={FadeInDown.duration(450).springify().damping(16)}
          style={{ alignItems: 'center', gap: space.lg }}
        >
          <Text
            style={{
              fontSize: type.small,
              color: colors.muted,
              fontWeight: '600',
              letterSpacing: 1.4,
              textTransform: 'uppercase',
            }}
          >
            {formatLongDate(submission.date)}
          </Text>
          <Text
            selectable
            style={{
              fontSize: type.submittedWord,
              fontWeight: '600',
              color: colors.text,
              letterSpacing: -1.5,
            }}
          >
            {stats.word}
          </Text>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(220).duration(420).springify().damping(18)}
          style={{ alignItems: 'center', paddingHorizontal: space.lg }}
        >
          <PlacementLine placement={placement} colors={colors} />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(420).duration(420).springify().damping(18)}>
          <StatRow
            stats={[
              { value: stats.totalForWord.toLocaleString(), label: 'chose it' },
              { value: stats.overallRank ? `#${stats.overallRank}` : '—', label: 'today' },
              { value: formatPercent(stats.percentOfPlayers), label: 'of players' },
            ]}
          />
        </Animated.View>

        {stats.isFirst ? (
          <Animated.Text
            entering={FadeInDown.delay(640).duration(420)}
            style={{
              fontSize: type.label,
              color: colors.muted,
              textAlign: 'center',
              fontStyle: 'italic',
            }}
          >
            Still only yours.
          </Animated.Text>
        ) : null}
      </View>

      <Animated.View
        entering={FadeInDown.delay(640).duration(420)}
        style={{ gap: space.md }}
      >
        <PrimaryButton
          label="See Top Words"
          onPress={() => {
            tapLight();
            router.push('/top-words');
          }}
        />

        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Link href="/history" asChild>
            <Pressable hitSlop={10}>
              <Text style={{ fontSize: type.label, color: colors.muted, fontWeight: '500' }}>
                History
              </Text>
            </Pressable>
          </Link>
          <Link href="/settings" asChild>
            <Pressable hitSlop={10}>
              <Text style={{ fontSize: type.label, color: colors.muted, fontWeight: '500' }}>
                Settings
              </Text>
            </Pressable>
          </Link>
        </View>
      </Animated.View>
    </ScrollView>
  );
}

function PlacementLine({
  placement,
  colors,
}: {
  placement: Placement;
  colors: ReturnType<typeof useTheme>['colors'];
}) {
  const baseStyle = {
    fontSize: type.resultLine,
    color: colors.text,
    fontWeight: '500' as const,
    textAlign: 'center' as const,
  };
  const boldStyle = { ...baseStyle, fontWeight: '700' as const };
  const emphasisStyle = {
    ...baseStyle,
    color: colors.accent,
    fontWeight: '700' as const,
    fontVariant: ['tabular-nums' as const],
  };

  if (placement.kind === 'started') {
    return (
      <Text style={baseStyle}>
        You <Text style={emphasisStyle}>started</Text>{' '}
        <Text style={boldStyle}>"{placement.word}"</Text> today.
      </Text>
    );
  }
  if (placement.kind === 'rank') {
    return (
      <Text style={baseStyle}>
        You were <Text style={emphasisStyle}>#{placement.rank}</Text> for{' '}
        <Text style={boldStyle}>"{placement.word}"</Text> today.
      </Text>
    );
  }
  return (
    <Text style={baseStyle}>
      You joined <Text style={emphasisStyle}>{placement.otherCount}</Text> people on{' '}
      <Text style={boldStyle}>"{placement.word}"</Text> today.
    </Text>
  );
}
