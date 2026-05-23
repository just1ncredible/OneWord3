import { router, useLocalSearchParams } from 'expo-router';
import { Platform, Pressable, ScrollView, Share, Text, View, useWindowDimensions } from 'react-native';
import { useGame, type HistoryEntry } from '@/components/game-provider';
import { useTheme } from '@/components/theme-provider';
import { radius, space, type } from '@/constants/theme';
import { tapLight } from '@/lib/haptics';
import type { WordStats } from '@/lib/mock-stats';

const MONTHS_LONG = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function formatCount(n: number) {
  if (n >= 10_000) return `${(n / 1000).toFixed(0)}k`;
  if (n >= 1_000) return `${(n / 1000).toFixed(1)}k`;
  return n.toLocaleString();
}

function formatLongDate(iso: string) {
  const [, m, d] = iso.split('-').map(Number);
  return `${MONTHS_LONG[m - 1]} ${d}`;
}

function headlineFor(stats: WordStats): string {
  if (stats.totalForWord === 1) return 'Yours alone.';
  if (stats.totalForWord <= 5) return 'A rare hand.';
  if (stats.wordRank <= 10) return 'Ahead of it.';
  return 'A chorus chose it.';
}

export default function WordDetailScreen() {
  const { date } = useLocalSearchParams<{ date: string }>();
  const { history, submission } = useGame();
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const isWideWeb = Platform.OS === 'web' && width > 700;
  const contentMaxWidth = isWideWeb ? 520 : undefined;

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

  const entry = entries.find((e) => e.date === date);
  if (!entry) {
    router.back();
    return null;
  }

  const { stats } = entry;

  function handleShare() {
    tapLight();
    Share.share({
      message: `${entry!.word} — my word for OneWord on ${formatLongDate(entry!.date)}.`,
    }).catch(() => {});
  }

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{
        flexGrow: 1,
        paddingHorizontal: space.lg,
        paddingBottom: space.xl,
      }}
    >
      <View
        style={{
          width: '100%',
          alignSelf: 'center',
          maxWidth: contentMaxWidth,
          paddingTop: space.xxl,
          gap: space.xl,
        }}
      >
        <View style={{ alignItems: 'center', gap: space.sm }}>
          <Text
            style={{
              fontSize: type.small,
              color: colors.muted,
              fontWeight: '600',
              letterSpacing: 3,
              textTransform: 'uppercase',
            }}
          >
            {formatLongDate(entry.date)}
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
            {entry.word}
          </Text>
          <Text
            style={{
              fontSize: type.resultLine,
              fontStyle: 'italic',
              fontWeight: '600',
              color: colors.text,
              letterSpacing: -0.3,
            }}
          >
            {headlineFor(stats)}
          </Text>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
          <StatBlock value={formatCount(stats.totalForWord)} label="Wrote it" colors={colors} />
          <StatDivider colors={colors} />
          <StatBlock value={`#${stats.wordRank}`} label="To choose it" colors={colors} />
          <StatDivider colors={colors} />
          <StatBlock
            value={stats.overallRank ? `#${stats.overallRank}` : '—'}
            label="Day rank"
            colors={colors}
          />
        </View>

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
              View all words
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
      </View>
    </ScrollView>
  );
}

function StatBlock({
  value,
  label,
  colors,
}: {
  value: string;
  label: string;
  colors: ReturnType<typeof useTheme>['colors'];
}) {
  return (
    <View style={{ alignItems: 'center', gap: 4, flex: 1 }}>
      <Text
        style={{
          fontSize: 22,
          fontWeight: '600',
          color: colors.muted,
          letterSpacing: -0.3,
          fontVariant: ['tabular-nums'],
        }}
      >
        {value}
      </Text>
      <Text
        style={{
          fontSize: type.small,
          color: colors.muted,
          fontWeight: '600',
          letterSpacing: 0.4,
          textTransform: 'uppercase',
        }}
      >
        {label}
      </Text>
    </View>
  );
}

function StatDivider({ colors }: { colors: ReturnType<typeof useTheme>['colors'] }) {
  return <View style={{ width: 1, height: 32, backgroundColor: colors.line }} />;
}
