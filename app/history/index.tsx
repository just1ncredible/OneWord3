import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Platform, Pressable, Text, View, useWindowDimensions } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useGame, type HistoryEntry } from '@/components/game-provider';
import { useTheme } from '@/components/theme-provider';
import { radius, space, type } from '@/constants/theme';
import { tapLight, tapSelection } from '@/lib/haptics';

function openWord(date: string) {
  tapLight();
  router.push({ pathname: '/history/word', params: { date } });
}

const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTHS_LONG = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

function pad(n: number) {
  return n < 10 ? `0${n}` : String(n);
}

function parseISO(iso: string) {
  const [y, m, d] = iso.split('-').map(Number);
  return { y, m: m - 1, d };
}

type ViewMode = 'list' | 'calendar';

function SegmentedToggle({
  value,
  onChange,
}: {
  value: ViewMode;
  onChange: (next: ViewMode) => void;
}) {
  const { colors } = useTheme();
  const options: { key: ViewMode; label: string }[] = [
    { key: 'list', label: 'List' },
    { key: 'calendar', label: 'Calendar' },
  ];
  return (
    <View style={{ flexDirection: 'row', gap: space.lg }}>
      {options.map((o) => {
        const active = value === o.key;
        return (
          <Pressable
            key={o.key}
            onPress={() => {
              if (active) return;
              tapSelection();
              onChange(o.key);
            }}
            style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1, gap: 5 })}
          >
            <Text
              style={{
                fontSize: type.body,
                fontWeight: active ? '700' : '500',
                color: active ? colors.text : colors.muted,
                letterSpacing: 0.2,
              }}
            >
              {o.label}
            </Text>
            <View
              style={{
                height: 2,
                borderRadius: 1,
                backgroundColor: active ? colors.accent : 'transparent',
              }}
            />
          </Pressable>
        );
      })}
    </View>
  );
}

export default function HistoryScreen() {
  const { history, submission } = useGame();
  const { colors } = useTheme();
  const [view, setView] = useState<ViewMode>('list');
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

  return (
      <Animated.ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: space.lg,
          paddingBottom: space.xl,
        }}
        style={{ flex: 1, backgroundColor: colors.background }}
      >
        <View style={{ width: '100%', alignSelf: 'center', maxWidth: contentMaxWidth, gap: space.lg }}>
        <Text
          style={{
            fontSize: 34,
            fontWeight: '700',
            color: colors.text,
            letterSpacing: 0.3,
            paddingTop: space.xs,
          }}
        >
          Memories
        </Text>

        <SegmentedToggle value={view} onChange={setView} />

        {entries.length === 0 ? (
          <Text style={{ fontSize: type.body, color: colors.muted, paddingTop: space.sm }}>
            Your words will collect here.
          </Text>
        ) : view === 'list' ? (
          <ListView entries={entries} />
        ) : (
          <CalendarView entries={entries} />
        )}
        </View>
      </Animated.ScrollView>
  );
}

function ListView({ entries }: { entries: HistoryEntry[] }) {
  const { colors } = useTheme();
  return (
    <Animated.View entering={FadeIn.duration(220)} style={{ gap: space.md, marginTop: space.xs }}>
      {entries.map((entry) => {
        const { m, d } = parseISO(entry.date);
        return (
          <Pressable
            key={entry.date}
            onPress={() => openWord(entry.date)}
            style={({ pressed }) => ({
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: space.md,
              backgroundColor: colors.surface,
              borderRadius: radius.slot,
              borderCurve: 'continuous',
              borderWidth: 1,
              borderColor: colors.line,
              paddingHorizontal: space.lg,
              paddingVertical: space.lg,
              opacity: pressed ? 0.6 : 1,
            })}
          >
            <Text
              style={{
                fontSize: 22,
                fontWeight: '700',
                color: colors.text,
                letterSpacing: -0.4,
              }}
            >
              {entry.word}
            </Text>
            <Text
              style={{
                fontSize: type.body,
                fontWeight: '500',
                color: colors.muted,
                fontVariant: ['tabular-nums'],
              }}
            >
              {`${MONTHS_SHORT[m]} ${d}`}
            </Text>
          </Pressable>
        );
      })}
    </Animated.View>
  );
}

function CalendarView({ entries }: { entries: HistoryEntry[] }) {
  const { colors } = useTheme();

  const byDate = useMemo(() => {
    const map = new Map<string, HistoryEntry>();
    for (const e of entries) map.set(e.date, e);
    return map;
  }, [entries]);

  const latest = parseISO(entries[0].date);
  const [cursor, setCursor] = useState({ y: latest.y, m: latest.m });
  const [selected, setSelected] = useState<string>(entries[0].date);

  const firstWeekday = new Date(cursor.y, cursor.m, 1).getDay();
  const daysInMonth = new Date(cursor.y, cursor.m + 1, 0).getDate();

  const cells: (number | null)[] = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const weeks: (number | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));

  function shiftMonth(dir: -1 | 1) {
    tapSelection();
    setCursor((c) => {
      const next = new Date(c.y, c.m + dir, 1);
      return { y: next.getFullYear(), m: next.getMonth() };
    });
  }

  return (
    <Animated.View entering={FadeIn.duration(220)} style={{ gap: space.lg, paddingTop: space.xs }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Pressable
          onPress={() => shiftMonth(-1)}
          hitSlop={12}
          style={({ pressed }) => ({ padding: space.xs, opacity: pressed ? 0.5 : 1 })}
        >
          <Text style={{ fontSize: 24, color: colors.accent, fontWeight: '600' }}>‹</Text>
        </Pressable>
        <Text style={{ fontSize: type.body, fontWeight: '700', color: colors.text, letterSpacing: 0.2 }}>
          {`${MONTHS_LONG[cursor.m]} ${cursor.y}`}
        </Text>
        <Pressable
          onPress={() => shiftMonth(1)}
          hitSlop={12}
          style={({ pressed }) => ({ padding: space.xs, opacity: pressed ? 0.5 : 1 })}
        >
          <Text style={{ fontSize: 24, color: colors.accent, fontWeight: '600' }}>›</Text>
        </Pressable>
      </View>

      <View style={{ gap: 6 }}>
        <View style={{ flexDirection: 'row' }}>
          {WEEKDAYS.map((w, i) => (
            <View key={i} style={{ flex: 1, alignItems: 'center' }}>
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: '600',
                  color: colors.muted,
                  letterSpacing: 0.5,
                }}
              >
                {w}
              </Text>
            </View>
          ))}
        </View>

        {weeks.map((week, wi) => (
          <View key={wi} style={{ flexDirection: 'row' }}>
            {week.map((day, di) => {
              if (day === null) {
                return <View key={di} style={{ flex: 1, aspectRatio: 1 }} />;
              }
              const iso = `${cursor.y}-${pad(cursor.m + 1)}-${pad(day)}`;
              const hasEntry = byDate.has(iso);
              const isSelected = iso === selected;
              return (
                <View key={di} style={{ flex: 1, aspectRatio: 1, alignItems: 'center', justifyContent: 'center' }}>
                  <Pressable
                    disabled={!hasEntry}
                    onPress={() => {
                      setSelected(iso);
                      openWord(iso);
                    }}
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: radius.slot,
                      borderCurve: 'continuous',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: isSelected
                        ? colors.accent
                        : hasEntry
                          ? colors.accentSoft
                          : 'transparent',
                    }}
                  >
                    <Text
                      style={{
                        fontSize: type.label,
                        fontVariant: ['tabular-nums'],
                        fontWeight: hasEntry ? '700' : '500',
                        color: isSelected
                          ? colors.onAccent
                          : hasEntry
                            ? colors.accentInk
                            : colors.muted,
                      }}
                    >
                      {day}
                    </Text>
                  </Pressable>
                </View>
              );
            })}
          </View>
        ))}
      </View>
    </Animated.View>
  );
}
