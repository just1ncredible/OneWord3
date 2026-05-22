import { router, Stack } from 'expo-router';
import { useCallback } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  type SharedValue,
} from 'react-native-reanimated';
import { useGame } from '@/components/game-provider';
import { useTheme, type ThemeMode } from '@/components/theme-provider';
import { radius, space, type } from '@/constants/theme';

const THEME_OPTIONS: { mode: ThemeMode; label: string; hint: string }[] = [
  { mode: 'system', label: 'System', hint: 'Follow device appearance' },
  { mode: 'light', label: 'Light', hint: 'Warm off-white' },
  { mode: 'dark', label: 'Dark', hint: 'Quiet ink' },
];

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
        Settings
      </Animated.Text>
    </View>
  );
}

export default function SettingsScreen() {
  const { submission, resetToday } = useGame();
  const { colors, mode, setMode } = useTheme();
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const headerTitle = useCallback(
    () => <AnimatedHeaderTitle scrollY={scrollY} />,
    [scrollY],
  );

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
            paddingBottom: space.xs,
          }}
        >
          Settings
        </Text>

        <Section title="Appearance">
          <View
            style={{
              backgroundColor: colors.surface,
              borderWidth: 1,
              borderColor: colors.line,
              borderRadius: radius.slot,
              borderCurve: 'continuous',
              overflow: 'hidden',
            }}
          >
            {THEME_OPTIONS.map((opt, i) => {
              const selected = mode === opt.mode;
              return (
                <Pressable
                  key={opt.mode}
                  onPress={() => setMode(opt.mode)}
                  style={({ pressed }) => ({
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: space.lg,
                    paddingVertical: 14,
                    borderBottomWidth: i === THEME_OPTIONS.length - 1 ? 0 : 1,
                    borderBottomColor: colors.line,
                    opacity: pressed ? 0.88 : 1,
                  })}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: type.body, color: colors.text, fontWeight: '500' }}>
                      {opt.label}
                    </Text>
                    <Text style={{ fontSize: type.small, color: colors.muted, marginTop: 2 }}>
                      {opt.hint}
                    </Text>
                  </View>
                  <Text
                    style={{
                      fontSize: 20,
                      color: selected ? colors.accent : 'transparent',
                      fontWeight: '600',
                    }}
                  >
                    ✓
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </Section>

        <Section title="Account">
          <Row label="Anonymous player" />
        </Section>

        <Section title="About">
          <Text style={{ fontSize: type.body, color: colors.text, lineHeight: 24 }}>
            One word. One day. One shared length.
          </Text>
        </Section>

        <Section title="Prototype">
          <Pressable
            onPress={() => {
              resetToday();
              router.replace('/');
            }}
            disabled={!submission}
            style={({ pressed }) => ({
              backgroundColor: colors.surface,
              borderWidth: 1,
              borderColor: colors.line,
              borderRadius: radius.button,
              borderCurve: 'continuous',
              paddingVertical: 14,
              paddingHorizontal: space.lg,
              opacity: pressed ? 0.88 : 1,
            })}
          >
            <Text
              style={{
                fontSize: type.body,
                fontWeight: '600',
                color: submission ? colors.accent2 : colors.muted,
              }}
            >
              Reset today's word
            </Text>
            <Text style={{ fontSize: type.small, color: colors.muted, marginTop: 2 }}>
              Dev only — clears your mock submission so you can re-try the loop.
            </Text>
          </Pressable>
        </Section>
      </Animated.ScrollView>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const { colors } = useTheme();
  return (
    <View style={{ gap: space.sm }}>
      <Text
        style={{
          fontSize: type.small,
          color: colors.muted,
          fontWeight: '600',
          letterSpacing: 1.2,
          textTransform: 'uppercase',
        }}
      >
        {title}
      </Text>
      {children}
    </View>
  );
}

function Row({ label }: { label: string }) {
  const { colors } = useTheme();
  return (
    <View
      style={{
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.line,
        borderRadius: radius.slot,
        borderCurve: 'continuous',
        paddingVertical: 14,
        paddingHorizontal: space.lg,
      }}
    >
      <Text style={{ fontSize: type.body, color: colors.text }}>{label}</Text>
    </View>
  );
}
