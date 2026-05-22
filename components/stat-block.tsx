import { useEffect, useRef, useState } from 'react';
import { Text, View } from 'react-native';
import { useTheme } from '@/components/theme-provider';
import { type } from '@/constants/theme';

export type Stat = {
  value: string;
  label: string;
};

function useCountUp(target: number, delay: number, duration: number): number {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null!);

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      const start = performance.now();
      function tick(now: number) {
        const t = Math.min((now - start) / duration, 1);
        const eased = 1 - (1 - t) * (1 - t);
        setValue(target * eased);
        if (t < 1) rafRef.current = requestAnimationFrame(tick);
      }
      rafRef.current = requestAnimationFrame(tick);
    }, delay);
    return () => {
      clearTimeout(timerRef.current);
      cancelAnimationFrame(rafRef.current);
    };
  }, [target, delay, duration]);

  return value;
}

export type AnimatedStat = {
  numericValue: number | null;
  format: (n: number) => string;
  label: string;
};

export function AnimatedStatRow({ stats }: { stats: AnimatedStat[] }) {
  const { colors } = useTheme();
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 28 }}>
      {stats.map((s, i) => (
        <AnimatedStatCell key={i} stat={s} colors={colors} />
      ))}
    </View>
  );
}

function AnimatedStatCell({
  stat,
  colors,
}: {
  stat: AnimatedStat;
  colors: ReturnType<typeof useTheme>['colors'];
}) {
  const raw = useCountUp(stat.numericValue ?? 0, 150, 2500);
  const display = stat.numericValue === null ? '—' : stat.format(raw);
  return (
    <View style={{ alignItems: 'center', gap: 4 }}>
      <Text
        style={{
          fontSize: type.resultLine,
          fontWeight: '600',
          color: colors.text,
          fontVariant: ['tabular-nums'],
        }}
      >
        {display}
      </Text>
      <Text style={{ fontSize: type.small, color: colors.muted, fontWeight: '500' }}>
        {stat.label}
      </Text>
    </View>
  );
}

export function StatRow({ stats }: { stats: Stat[] }) {
  const { colors } = useTheme();
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 28 }}>
      {stats.map((s, i) => (
        <View key={i} style={{ alignItems: 'center', gap: 4 }}>
          <Text
            selectable
            style={{
              fontSize: type.resultLine,
              fontWeight: '600',
              color: colors.text,
              fontVariant: ['tabular-nums'],
            }}
          >
            {s.value}
          </Text>
          <Text style={{ fontSize: type.small, color: colors.muted, fontWeight: '500' }}>
            {s.label}
          </Text>
        </View>
      ))}
    </View>
  );
}
