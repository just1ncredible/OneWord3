import { Stack } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, {
  FadeIn,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  type SharedValue,
} from 'react-native-reanimated';
import { useGame, type HistoryEntry } from '@/components/game-provider';
import { useTheme } from '@/components/theme-provider';
import { radius, space, type } from '@/constants/theme';
import { tapSelection } from '@/lib/haptics';

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
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: colors.line,
        borderRadius: radius.button,
        borderCurve: 'continuous',
        padding: 3,
        gap: 3,
      }}
    >
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
            style={{
              flex: 1,
              paddingVertical: 9,
              borderRadius: radius.button - 3,
              borderCurve: 'continuous',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: active ? colors.accentSoft : 'transparent',
              boxShadow: active ? '0 1px 3px rgba(0,0,0,0.10)' : undefined,
            }}
          >
            <Text
              style={{
                fontSize: type.label,
                fontWeight: '600',
                letterSpacing: 0.2,
                color: active ? colors.accentInk : colors.muted,
              }}
            >
              {o.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export default function HistoryScreen() {
  const { history, submission } = useGame();
  const { colors } = useTheme();
  const scrollY = useSharedValue(0);
  const [view, setView] = useState<ViewMode>('list');

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
          gap: space.lg,
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
          }}
        >
          History
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
      </Animated.ScrollView>
    </>
  );
}

function ListView({ entries }: { entries: HistoryEntry[] }) {
  const { colors } = useTheme();
  return (
    <Animated.View entering={FadeIn.duration(220)} style={{ paddingTop: space.xs }}>
      {entries.map((entry, i) => {
        const { m, d } = parseISO(entry.date);
        return (
          <View
            key={entry.date}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: space.lg,
              paddingVertical: space.md,
              borderTopWidth: i === 0 ? 0 : 1,
              borderTopColor: colors.line,
            }}
          >
            <View style={{ width: 44, alignItems: 'center' }}>
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: '700',
                  color: colors.text,
                  fontVariant: ['tabular-nums'],
                  letterSpacing: -0.5,
                }}
              >
                {d}
              </Text>
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: '600',
                  color: colors.muted,
                  letterSpacing: 1,
                  textTransform: 'uppercase',
                }}
              >
                {MONTHS_SHORT[m]}
              </Text>
            </View>

            <View style={{ flex: 1 }}>
              <Text
                selectable
                style={{
                  fontSize: 24,
                  fontWeight: '700',
                  color: colors.text,
                  letterSpacing: -0.4,
                }}
              >
                {entry.word}
              </Text>
            </View>
          </View>
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

  const selectedEntry = byDate.get(selected)!;

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
                      tapSelection();
                      setSelected(iso);
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

      <DayDetail entry={selectedEntry} />
    </Animated.View>
  );
}

function DayDetail({ entry }: { entry: HistoryEntry }) {
  const { colors } = useTheme();
  const { m, d } = parseISO(entry.date);
  return (
    <View
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
          fontWeight: '600',
          letterSpacing: 1,
          textTransform: 'uppercase',
        }}
      >
        {`${MONTHS_SHORT[m]} ${d}`}
      </Text>
      <Text
        selectable
        style={{ fontSize: 28, fontWeight: '700', color: colors.text, letterSpacing: -0.5 }}
      >
        {entry.word}
      </Text>
      <Text style={{ fontSize: type.label, color: colors.muted, fontWeight: '500' }}>
        {placementShort(entry)}
      </Text>
    </View>
  );
}
