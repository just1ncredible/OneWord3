export type Palette = {
  background: string;
  surface: string;
  text: string;
  muted: string;
  line: string;
  accent: string;
  accentSoft: string;
  accentInk: string;
  accent2: string;
  accent3: string;
  success: string;
  error: string;
  disabled: string;
  onAccent: string;
};

export const lightColors: Palette = {
  background: '#F7F4EF',
  surface: '#FFFFFF',
  text: '#171717',
  muted: '#78716C',
  line: '#DDD6CE',
  accent: '#C8912C',
  accentSoft: '#F4E8CC',
  accentInk: '#8A6310',
  accent2: '#D35F3F',
  accent3: '#D9A441',
  success: '#4F7D5A',
  error: '#B9473D',
  disabled: '#C7C1B8',
  onAccent: '#1C0F00',
};

export const darkColors: Palette = {
  background: '#11100E',
  surface: '#1B1A17',
  text: '#F4F0EA',
  muted: '#A8A095',
  line: '#34312C',
  accent: '#D4A03A',
  accentSoft: '#2C2413',
  accentInk: '#E0AE48',
  accent2: '#E07A5F',
  accent3: '#E7B84B',
  success: '#8DBA7D',
  error: '#E06B5F',
  disabled: '#3A3833',
  onAccent: '#1C0F00',
};

export const type = {
  dailyLength: 64,
  submittedWord: 52,
  resultLine: 24,
  body: 17,
  label: 14,
  small: 13,
};

export const radius = {
  button: 16,
  slot: 14,
};

export const space = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 20,
  xl: 32,
  xxl: 48,
};
