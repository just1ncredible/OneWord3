import { router, Stack } from 'expo-router';
import { useCallback } from 'react';
import { Platform, Pressable, Text, View, useWindowDimensions } from 'react-native';
import { SymbolView, type SymbolViewProps } from 'expo-symbols';
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

const THEME_OPTIONS: { mode: ThemeMode; label: string; icon: SymbolViewProps['name'] }[] = [
  { mode: 'system', label: 'System', icon: 'circle.lefthalf.filled' },
  { mode: 'light', label: 'Light', icon: 'sun.max.fill' },
  { mode: 'dark', label: 'Dark', icon: 'moon.fill' },
];

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
        Settings
      </Animated.Text>
    </View>
  );
}

export default function SettingsScreen() {
  const { submission, resetToday } = useGame();
  const { colors, mode, setMode } = useTheme();
  const scrollY = useSharedValue(0);
  const { width } = useWindowDimensions();
  const isWideWeb = Platform.OS === 'web' && width > 700;
  const contentMaxWidth = isWideWeb ? 520 : undefined;

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
          flexGrow: 1,
          paddingHorizontal: space.lg,
          paddingBottom: space.xl,
        }}
        style={{ flex: 1, backgroundColor: colors.background }}
      >
        <View style={{ width: '100%', alignSelf: 'center', maxWidth: contentMaxWidth, gap: space.xl }}>
          <Text
            style={{
              fontSize: 34,
              fontWeight: '700',
              color: colors.text,
              letterSpacing: 0.3,
              paddingTop: space.xs,
            }}
          >
            Settings
          </Text>

          <ProfileCard />

          <Section title="Appearance">
            <Card>
              {THEME_OPTIONS.map((opt, i) => (
                <Row
                  key={opt.mode}
                  icon={opt.icon}
                  label={opt.label}
                  onPress={() => setMode(opt.mode)}
                  isLast={i === THEME_OPTIONS.length - 1}
                  trailing={
                    mode === opt.mode ? (
                      <SymbolView
                        name="checkmark"
                        size={16}
                        tintColor={colors.accent}
                        weight="semibold"
                      />
                    ) : null
                  }
                />
              ))}
            </Card>
          </Section>

          <Section title="About">
            <Card>
              <Row icon="info.circle" label="One word. One day. One shared length." />
            </Card>
          </Section>

          <Section title="Developer">
            <Card>
              <Row
                icon="arrow.counterclockwise"
                label="Reset today's word"
                onPress={() => {
                  resetToday();
                  router.replace('/');
                }}
                disabled={!submission}
                destructive
              />
            </Card>
          </Section>
        </View>
      </Animated.ScrollView>
    </>
  );
}

function ProfileCard() {
  const { colors } = useTheme();
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: space.md,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.line,
        borderRadius: radius.slot,
        borderCurve: 'continuous',
        padding: space.md,
      }}
    >
      <View
        style={{
          width: 52,
          height: 52,
          borderRadius: 26,
          backgroundColor: colors.accentSoft,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <SymbolView name="person.fill" size={26} tintColor={colors.accentInk} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: type.body, fontWeight: '700', color: colors.text, letterSpacing: -0.2 }}>
          Anonymous player
        </Text>
        <Text style={{ fontSize: type.small, color: colors.muted, marginTop: 2 }}>
          One word a day.
        </Text>
      </View>
    </View>
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

function Card({ children }: { children: React.ReactNode }) {
  const { colors } = useTheme();
  return (
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
      {children}
    </View>
  );
}

function Row({
  icon,
  label,
  onPress,
  trailing,
  isLast = true,
  disabled = false,
  destructive = false,
}: {
  icon: SymbolViewProps['name'];
  label: string;
  onPress?: () => void;
  trailing?: React.ReactNode;
  isLast?: boolean;
  disabled?: boolean;
  destructive?: boolean;
}) {
  const { colors } = useTheme();
  const tint = disabled ? colors.muted : destructive ? colors.accent2 : colors.text;
  const interactive = !!onPress && !disabled;
  return (
    <Pressable
      onPress={interactive ? onPress : undefined}
      disabled={!interactive}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        gap: space.md,
        paddingHorizontal: space.lg,
        paddingVertical: 14,
        borderBottomWidth: isLast ? 0 : 1,
        borderBottomColor: colors.line,
        opacity: pressed && interactive ? 0.6 : 1,
      })}
    >
      <SymbolView name={icon} size={20} tintColor={tint} />
      <Text style={{ flex: 1, fontSize: type.body, fontWeight: '500', color: tint }}>
        {label}
      </Text>
      {trailing ??
        (interactive ? (
          <SymbolView name="chevron.right" size={13} tintColor={colors.muted} weight="semibold" />
        ) : null)}
    </Pressable>
  );
}
