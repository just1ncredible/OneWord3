import { ScrollView, Text, View } from 'react-native';
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

export default function HistoryScreen() {
  const { history, submission } = useGame();
  const { colors } = useTheme();

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

  if (entries.length === 0) {
    return (
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: space.lg,
        }}
        style={{ flex: 1, backgroundColor: colors.background }}
      >
        <Text style={{ fontSize: type.body, color: colors.muted, textAlign: 'center' }}>
          Your words will collect here.
        </Text>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{
        paddingHorizontal: space.lg,
        paddingBottom: space.xl,
        gap: space.sm,
      }}
      style={{ flex: 1, backgroundColor: colors.background }}
    >
      <View
        style={{
          backgroundColor: colors.surface,
          borderRadius: radius.slot,
          borderCurve: 'continuous',
          borderWidth: 1,
          borderColor: colors.line,
        }}
      >
        {entries.map((entry, i) => (
          <View
            key={entry.date}
            style={{
              paddingHorizontal: space.lg,
              paddingVertical: 16,
              gap: 4,
              borderBottomWidth: i === entries.length - 1 ? 0 : 1,
              borderBottomColor: colors.line,
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
                fontSize: type.resultLine,
                color: colors.text,
                fontWeight: '600',
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
    </ScrollView>
  );
}
