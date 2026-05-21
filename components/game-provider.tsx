import { createContext, use, useCallback, useMemo, useState, type ReactNode } from 'react';
import { statsForWord, type WordStats } from '@/lib/mock-stats';
import { validateWord } from '@/lib/validation';

export type HistoryEntry = {
  date: string;
  word: string;
  stats: WordStats;
  requiredLength: number;
};

export type TodaySubmission = {
  date: string;
  word: string;
  stats: WordStats;
  requiredLength: number;
};

type GameContextValue = {
  todayDate: string;
  requiredLength: number;
  submission: TodaySubmission | null;
  history: HistoryEntry[];
  submitWord: (input: string) => Promise<{ ok: true } | { ok: false; reason: string }>;
  resetToday: () => void;
};

const GameContext = createContext<GameContextValue | null>(null);

const TODAY_DATE = '2026-05-21';
const TODAY_REQUIRED_LENGTH = 6;

const SEED_HISTORY: HistoryEntry[] = [
  {
    date: '2026-05-20',
    requiredLength: 5,
    word: 'quiet',
    stats: statsForWord('quiet'),
  },
  {
    date: '2026-05-19',
    requiredLength: 6,
    word: 'bright',
    stats: statsForWord('bright'),
  },
  {
    date: '2026-05-18',
    requiredLength: 6,
    word: 'steady',
    stats: statsForWord('steady'),
  },
  {
    date: '2026-05-17',
    requiredLength: 6,
    word: 'always',
    stats: statsForWord('always'),
  },
];

export function GameProvider({ children }: { children: ReactNode }) {
  const [submission, setSubmission] = useState<TodaySubmission | null>(null);
  const [history] = useState<HistoryEntry[]>(SEED_HISTORY);

  const submitWord = useCallback(
    async (input: string) => {
      const result = validateWord(input, TODAY_REQUIRED_LENGTH);
      if (!result.valid) {
        return { ok: false as const, reason: result.reason };
      }
      await new Promise((r) => setTimeout(r, 700));
      const stats = statsForWord(result.word);
      setSubmission({
        date: TODAY_DATE,
        word: result.word,
        stats,
        requiredLength: TODAY_REQUIRED_LENGTH,
      });
      return { ok: true as const };
    },
    [],
  );

  const resetToday = useCallback(() => setSubmission(null), []);

  const value = useMemo<GameContextValue>(
    () => ({
      todayDate: TODAY_DATE,
      requiredLength: TODAY_REQUIRED_LENGTH,
      submission,
      history,
      submitWord,
      resetToday,
    }),
    [submission, history, submitWord, resetToday],
  );

  return <GameContext value={value}>{children}</GameContext>;
}

export function useGame() {
  const ctx = use(GameContext);
  if (!ctx) throw new Error('useGame must be used inside <GameProvider>');
  return ctx;
}
