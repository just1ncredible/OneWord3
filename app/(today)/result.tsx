import { Redirect, router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, Share, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useGame } from '@/components/game-provider';
import { useTheme } from '@/components/theme-provider';
import { Wordmark } from '@/components/wordmark';
import { radius, space, type } from '@/constants/theme';
import { tapLight } from '@/lib/haptics';
import { MOCK_DISTINCT_WORDS_TODAY, type WordStats } from '@/lib/mock-stats';

type Tier = { headline: string };

function tierFor(stats: WordStats): Tier {
  if (stats.totalForWord === 1) return { headline: 'Yours alone.' };
  if (stats.totalForWord <= 5) return { headline: 'A rare hand.' };
  if (stats.wordRank <= 10) return { headline: 'Ahead of it.' };
  return { headline: 'A chorus chose it.' };
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

function timeToMidnight() {
  const now = new Date();
  const next = new Date(now);
  next.setHours(24, 0, 0, 0);
  const diff = next.getTime() - now.getTime();
  const h = Math.floor(diff / 3_600_000);
  const m = Math.floor((diff % 3_600_000) / 60_000);
  return `${h}h ${m}m`;
}

function useCountdown() {
  const [label, setLabel] = useState(timeToMidnight);
  useEffect(() => {
    const id = setInterval(() => setLabel(timeToMidnight()), 30_000);
    return () => clearInterval(id);
  }, []);
  return label;
}

export default function ResultScreen() {
  const { submission } = useGame();
  const { colors } = useTheme();
  const countdown = useCountdown();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const t = setTimeout(() => tapLight(), 120);
    return () => clearTimeout(t);
  }, []);

  if (!submission) return <Redirect href="/" />;

  const { stats } = submission;
  const tier = tierFor(stats);

  function handleShare() {
    tapLight();
    Share.share({
      message: `${stats.word} — my word for OneWord today.`,
    }).catch(() => {});
  }

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

      <Animated.View entering={FadeIn.duration(800)} style={{ gap: space.xl, maxWidth: 420, width: '100%', alignSelf: 'center' }}>
        <View style={{ alignItems: 'center', gap: space.lg }}>
          <Text
            style={{
              fontSize: type.small,
              color: colors.muted,
              fontWeight: '600',
              letterSpacing: 3,
            }}
          >
            {formatLongDate(submission.date).toUpperCase()}
          </Text>

          <Text
            selectable
            style={{
              fontSize: type.submittedWord,
              fontWeight: '600',
              color: colors.text,
              letterSpacing: -1.5,
              textAlign: 'center',
            }}
          >
            {stats.word}
          </Text>

        </View>

        <View style={{ gap: space.md, paddingHorizontal: space.sm }}>
          <Text
            style={{
              fontSize: type.resultLine,
              fontStyle: 'italic',
              fontWeight: '600',
              color: colors.text,
              textAlign: 'center',
              letterSpacing: -0.3,
            }}
          >
            {tier.headline}
          </Text>
          <PlacementProse stats={stats} colors={colors} />
        </View>

        <CountdownLine label={countdown} colors={colors} />

        <View style={{ flexDirection: 'row', gap: space.sm }}>
          <Pressable
            onPress={() => {
              tapLight();
              router.push('/top-words');
            }}
            style={({ pressed }) => ({
              flex: 1,
              backgroundColor: colors.accent,
              borderRadius: radius.button,
              borderCurve: 'continuous',
              paddingVertical: 16,
              paddingHorizontal: space.lg,
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
              {`View all ${MOCK_DISTINCT_WORDS_TODAY} words`}
            </Text>
          </Pressable>

          <Pressable
            onPress={handleShare}
            style={({ pressed }) => ({
              backgroundColor: colors.accent,
              borderRadius: radius.button,
              borderCurve: 'continuous',
              paddingVertical: 16,
              paddingHorizontal: space.xl,
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
              Share
            </Text>
          </Pressable>
        </View>
      </Animated.View>
    </View>
  );
}

function PlacementProse({
  stats,
  colors,
}: {
  stats: WordStats;
  colors: ReturnType<typeof useTheme>['colors'];
}) {
  const base = {
    fontSize: type.body,
    color: colors.muted,
    fontWeight: '500' as const,
    textAlign: 'center' as const,
    lineHeight: 26,
  };
  const strong = { ...base, color: colors.text, fontWeight: '700' as const };
  const word = `“${stats.word}”`;

  if (stats.totalForWord === 1) {
    return (
      <Text style={base}>
        No one else wrote <Text style={strong}>{word}</Text> today — a word entirely your own.
      </Text>
    );
  }
  if (stats.totalForWord <= 5) {
    return (
      <Text style={base}>
        Only <Text style={strong}>{stats.totalForWord}</Text> of you wrote{' '}
        <Text style={strong}>{word}</Text> today.
      </Text>
    );
  }
  if (stats.wordRank <= 10) {
    return (
      <Text style={base}>
        You were <Text style={strong}>#{stats.wordRank}</Text> to write{' '}
        <Text style={strong}>{word}</Text> today.
      </Text>
    );
  }
  const others = (stats.totalForWord - 1).toLocaleString();
  return (
    <Text style={base}>
      You and <Text style={strong}>{others} others</Text> wrote{' '}
      <Text style={strong}>{word}</Text> today
      {stats.overallRank === 1 ? ' — the day’s most-shared word.' : '.'}
    </Text>
  );
}

function CountdownLine({
  label,
  colors,
}: {
  label: string;
  colors: ReturnType<typeof useTheme>['colors'];
}) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
      <View style={{ flex: 1, height: 1, backgroundColor: colors.line }} />
      <Text
        style={{
          fontSize: type.small,
          color: colors.muted,
          fontWeight: '600',
          letterSpacing: 1.4,
          textTransform: 'uppercase',
          fontVariant: ['tabular-nums'],
        }}
      >
        {`Next word in ${label}`}
      </Text>
      <View style={{ flex: 1, height: 1, backgroundColor: colors.line }} />
    </View>
  );
}
