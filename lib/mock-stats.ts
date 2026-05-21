export type WordStats = {
  word: string;
  wordRank: number;
  totalForWord: number;
  overallRank: number | null;
  totalSubmissionsToday: number;
  percentOfPlayers: number;
  isFirst: boolean;
  followedYou: number;
};

export const MOCK_TOTAL_SUBMISSIONS_TODAY = 4286;

export const MOCK_TOP_WORDS_TODAY: { word: string; count: number }[] = [
  { word: 'tired', count: 842 },
  { word: 'steady', count: 618 },
  { word: 'bright', count: 402 },
  { word: 'quiet', count: 391 },
  { word: 'almost', count: 355 },
  { word: 'winter', count: 312 },
  { word: 'silent', count: 287 },
  { word: 'simple', count: 245 },
  { word: 'closer', count: 198 },
  { word: 'spring', count: 176 },
];

function djb2(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

export function statsForWord(word: string): WordStats {
  const inTop = MOCK_TOP_WORDS_TODAY.find((w) => w.word === word);
  const total = MOCK_TOTAL_SUBMISSIONS_TODAY;

  if (inTop) {
    const totalForWord = inTop.count + 1;
    const wordRank = totalForWord;
    const overallRank = MOCK_TOP_WORDS_TODAY.indexOf(inTop) + 1;
    return {
      word,
      wordRank,
      totalForWord,
      overallRank,
      totalSubmissionsToday: total,
      percentOfPlayers: (totalForWord / total) * 100,
      isFirst: false,
      followedYou: 0,
    };
  }

  const hash = djb2(word);
  const isFirst = hash % 5 === 0;

  if (isFirst) {
    return {
      word,
      wordRank: 1,
      totalForWord: 1,
      overallRank: null,
      totalSubmissionsToday: total,
      percentOfPlayers: (1 / total) * 100,
      isFirst: true,
      followedYou: 0,
    };
  }

  const totalForWord = (hash % 60) + 2;
  const wordRank = (hash % totalForWord) + 1;
  const overallRank = (hash % 80) + 11;

  return {
    word,
    wordRank,
    totalForWord,
    overallRank,
    totalSubmissionsToday: total,
    percentOfPlayers: (totalForWord / total) * 100,
    isFirst: false,
    followedYou: 0,
  };
}
