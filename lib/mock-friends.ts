import type { Bond } from '@/constants/theme';

export type Friend = {
  id: string;
  name: string;
  word: string | null; // null = hasn't played today
  bond: Bond | null; // null when they haven't played
};

// Bond tiers mirror the rarity vocabulary of the result screen:
//   common  — a widely-shared word today
//   echo    — a modest group landed on it
//   whisper — a rare, near-solitary choice
export const SEED_FRIENDS: Friend[] = [
  { id: 'mia', name: 'Mia', word: 'gentle', bond: 'common' },
  { id: 'jules', name: 'Jules', word: 'silent', bond: 'common' },
  { id: 'theo', name: 'Theo', word: 'pollen', bond: 'echo' },
  { id: 'ren', name: 'Ren', word: 'gentle', bond: 'common' },
  { id: 'asha', name: 'Asha', word: 'static', bond: 'whisper' },
  { id: 'niko', name: 'Niko', word: null, bond: null },
];

export const BOND_LABEL: Record<Bond, string> = {
  common: 'Common',
  echo: 'Echo',
  whisper: 'Whisper',
};
