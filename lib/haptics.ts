import * as Haptics from 'expo-haptics';

const ENABLED = process.env.EXPO_OS === 'ios';

export function tapSelection() {
  if (!ENABLED) return;
  Haptics.selectionAsync().catch(() => {});
}

export function tapLight() {
  if (!ENABLED) return;
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
}

export function tapMedium() {
  if (!ENABLED) return;
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
}

export function notifySuccess() {
  if (!ENABLED) return;
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
}

export function notifyWarning() {
  if (!ENABLED) return;
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {});
}
