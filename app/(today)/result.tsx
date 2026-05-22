import { Redirect, router } from 'expo-router';
import { useEffect } from 'react';
import { Text, View } from 'react-native';
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
  | { kind: 'original'; word: string }
  | { kind: 'rare'; total: number; word: string }
  | { kind: 'early'; rank: number; word: string }
  | { kind: 'wave'; otherCount: number; word: string };

function describePlacement(stats: WordStats): Placement {
  if (stats.totalForWord === 1) {
    return { kind: 'original', word: stats.word };
  }
  if (stats.totalForWord <= 5) {
    return { kind: 'rare', total: stats.totalForWord, word: stats.word };
  }
  if (stats.wordRank <= 10) {
    return { kind: 'early', rank: stats.wordRank, word: stats.word };
  }
  return { kind: 'wave', otherCount: stats.totalForWord - 1, word: stats.word };
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
    <View
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

        <Animated.View entering={FadeInDown.delay(640).duration(420)}>
          <PrimaryButton
            label="See Top Words"
            onPress={() => {
              tapLight();
              router.push('/top-words');
            }}
          />
        </Animated.View>
      </View>
    </View>
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

  if (placement.kind === 'original') {
    return (
      <Text style={baseStyle}>
        <Text style={boldStyle}>Original.</Text> Yours alone today.
      </Text>
    );
  }
  if (placement.kind === 'rare') {
    return (
      <Text style={baseStyle}>
        <Text style={boldStyle}>Rare.</Text> Only{' '}
        <Text style={emphasisStyle}>{placement.total}</Text> of you wrote{' '}
        <Text style={boldStyle}>"{placement.word}"</Text> today.
      </Text>
    );
  }
  if (placement.kind === 'early') {
    return (
      <Text style={baseStyle}>
        <Text style={boldStyle}>Early.</Text> You were{' '}
        <Text style={emphasisStyle}>#{placement.rank}</Text> for{' '}
        <Text style={boldStyle}>"{placement.word}"</Text> today.
      </Text>
    );
  }
  return (
    <Text style={baseStyle}>
      <Text style={boldStyle}>Wave.</Text> You and{' '}
      <Text style={emphasisStyle}>{placement.otherCount}</Text> others on{' '}
      <Text style={boldStyle}>"{placement.word}"</Text> today.
    </Text>
  );
}
