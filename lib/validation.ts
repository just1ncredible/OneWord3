export type ValidationResult =
  | { valid: true; word: string }
  | { valid: false; reason: string };

export function validateWord(input: string, requiredLength: number): ValidationResult {
  const normalized = input.trim().toLowerCase();

  if (normalized.length === 0) {
    return { valid: false, reason: `Use exactly ${requiredLength} letters.` };
  }

  if (!/^[a-z]+$/.test(normalized)) {
    return { valid: false, reason: 'Letters only.' };
  }

  if (normalized.length !== requiredLength) {
    return { valid: false, reason: `Use exactly ${requiredLength} letters.` };
  }

  return { valid: true, word: normalized };
}
