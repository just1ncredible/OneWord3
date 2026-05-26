import { router } from 'expo-router';
import { useMemo, useRef, useState } from 'react';
import {
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useGame } from '@/components/game-provider';
import { Icon } from '@/components/icon';
import { PrimaryButton } from '@/components/primary-button';
import { useTheme } from '@/components/theme-provider';
import { bondColors, radius, space, type, type Bond } from '@/constants/theme';
import { tapSelection } from '@/lib/haptics';
import { MOCK_NICHE_WORDS_TODAY, MOCK_TOP_WORDS_TODAY } from '@/lib/mock-stats';

type WordRow = { word: string; count: number };
type Category = { key: string; label: string; rows: WordRow[] };

const BAR_WIDTH = 88;

function bondForCount(count: number): Bond {
  if (count >= 250) return 'common';
  if (count >= 50) return 'echo';
  return 'whisper';
}

function BackButton() {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={() => router.back()}
      hitSlop={10}
      style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1, alignSelf: 'flex-start', marginLeft: -6 })}
    >
      <Icon name="chevron.left" size={26} tintColor={colors.accent} />
    </Pressable>
  );
}

export default function TopWordsScreen() {
  const { submission } = useGame();
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const isWideWeb = Platform.OS === 'web' && width > 700;
  const contentMaxWidth = isWideWeb ? 520 : undefined;
  const pageWidth = width;

  const scrollRef = useRef<ScrollView>(null);
  const [active, setActive] = useState(0);

  const userWord = submission?.word;

  const categories = useMemo<Category[]>(() => {
    const map = new Map<string, number>();
    for (const w of MOCK_TOP_WORDS_TODAY) map.set(w.word, w.count);
    for (const w of MOCK_NICHE_WORDS_TODAY) if (!map.has(w.word)) map.set(w.word, w.count);
    if (userWord && !map.has(userWord)) map.set(userWord, submission?.stats.totalForWord ?? 1);
    const base: WordRow[] = Array.from(map, ([word, count]) => ({ word, count }));

    return [
      { key: 'popular', label: 'Popular', rows: [...base].sort((a, b) => b.count - a.count) },
      { key: 'rare', label: 'Rare', rows: [...base].sort((a, b) => a.count - b.count) },
    ];
  }, [userWord, submission]);

  function goTo(i: number) {
    if (i === active) return;
    tapSelection();
    setActive(i);
    scrollRef.current?.scrollTo({ x: i * pageWidth, animated: true });
  }

  function onMomentumEnd(e: NativeSyntheticEvent<NativeScrollEvent>) {
    const i = Math.round(e.nativeEvent.contentOffset.x / pageWidth);
    if (i !== active) {
      tapSelection();
      setActive(i);
    }
  }

  if (!submission) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, paddingHorizontal: space.lg, paddingTop: insets.top + space.xs, gap: space.lg }}>
        <BackButton />
        <Text style={{ fontSize: 34, fontWeight: '700', color: colors.text, letterSpacing: 0.3 }}>
          Today’s Words
        </Text>
        <Text style={{ fontSize: type.body, color: colors.muted, fontWeight: '500' }}>
          Choose today’s word first.
        </Text>
        <PrimaryButton label="Go to Today" onPress={() => router.replace('/')} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ paddingHorizontal: space.lg, paddingTop: insets.top + space.xs, gap: space.md }}>
        <View style={{ width: '100%', alignSelf: 'center', maxWidth: contentMaxWidth, gap: space.md }}>
          <BackButton />
          <Text style={{ fontSize: 34, fontWeight: '700', color: colors.text, letterSpacing: 0.3 }}>
            Today’s Words
          </Text>
          <CategoryTabs categories={categories} active={active} onChange={goTo} />
        </View>
      </View>

        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={onMomentumEnd}
          style={{ flex: 1 }}
        >
          {categories.map((cat) => {
            const max = Math.max(...cat.rows.map((r) => r.count), 1);
            return (
              <ScrollView
                key={cat.key}
                style={{ width: pageWidth }}
                contentContainerStyle={{ paddingHorizontal: space.lg, paddingTop: space.md, paddingBottom: space.xl }}
                showsVerticalScrollIndicator={false}
              >
                <View style={{ width: '100%', alignSelf: 'center', maxWidth: contentMaxWidth }}>
                  {cat.rows.map((row, i) => (
                    <Row
                      key={row.word}
                      rank={i + 1}
                      row={row}
                      max={max}
                      isUser={row.word === userWord}
                      isLast={i === cat.rows.length - 1}
                    />
                  ))}
                </View>
              </ScrollView>
            );
          })}
        </ScrollView>
    </View>
  );
}

function CategoryTabs({
  categories,
  active,
  onChange,
}: {
  categories: Category[];
  active: number;
  onChange: (i: number) => void;
}) {
  const { colors } = useTheme();
  return (
    <View style={{ flexDirection: 'row', gap: space.lg }}>
      {categories.map((cat, i) => {
        const isActive = i === active;
        return (
          <Pressable
            key={cat.key}
            onPress={() => onChange(i)}
            style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1, gap: 5 })}
          >
            <Text
              style={{
                fontSize: type.body,
                fontWeight: isActive ? '700' : '500',
                color: isActive ? colors.text : colors.muted,
                letterSpacing: 0.2,
              }}
            >
              {cat.label}
            </Text>
            <View
              style={{
                height: 2,
                borderRadius: 1,
                backgroundColor: isActive ? colors.accent : 'transparent',
              }}
            />
          </Pressable>
        );
      })}
    </View>
  );
}

function Row({
  rank,
  row,
  max,
  isUser,
  isLast,
}: {
  rank: number;
  row: WordRow;
  max: number;
  isUser: boolean;
  isLast: boolean;
}) {
  const { colors, scheme } = useTheme();
  const bond = bondForCount(row.count);
  const bc = bondColors[scheme][bond];
  const fill = Math.max(4, Math.round((row.count / max) * BAR_WIDTH));

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: space.md,
        paddingVertical: 14,
        paddingHorizontal: isUser ? space.sm : 0,
        marginHorizontal: isUser ? -space.sm : 0,
        borderRadius: isUser ? radius.slot : 0,
        borderCurve: 'continuous',
        backgroundColor: isUser ? colors.surface : 'transparent',
        borderBottomWidth: isUser || isLast ? 0 : 1,
        borderBottomColor: colors.line,
      }}
    >
      <Text style={{ width: 24, fontSize: type.label, color: colors.muted, fontVariant: ['tabular-nums'] }}>
        {String(rank).padStart(2, '0')}
      </Text>

      <View style={{ width: 9, height: 9, borderRadius: 5, backgroundColor: bc.dot }} />

      <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: space.sm }}>
        <Text
          selectable
          numberOfLines={1}
          style={{
            fontSize: 22,
            fontWeight: '600',
            letterSpacing: -0.3,
            color: isUser ? colors.accent : colors.text,
          }}
        >
          {row.word}
        </Text>
        {isUser ? (
          <Text style={{ fontSize: 11, fontWeight: '700', color: colors.accent, letterSpacing: 1.5 }}>YOU</Text>
        ) : null}
      </View>

      <View style={{ width: BAR_WIDTH, height: 4, borderRadius: 2, backgroundColor: colors.line, overflow: 'hidden' }}>
        <View style={{ width: fill, height: 4, borderRadius: 2, backgroundColor: bc.dot }} />
      </View>

      <Text
        style={{
          width: 48,
          textAlign: 'right',
          fontSize: type.body,
          color: colors.muted,
          fontVariant: ['tabular-nums'],
        }}
      >
        {row.count.toLocaleString()}
      </Text>
    </View>
  );
}
