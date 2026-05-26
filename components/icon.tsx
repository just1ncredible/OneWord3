import { type ComponentProps } from 'react';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { SymbolView, type SymbolViewProps } from 'expo-symbols';

export type IconName = SymbolViewProps['name'];

type MciName = ComponentProps<typeof MaterialCommunityIcons>['name'];

// SF Symbols are iOS-only; SymbolView renders `fallback` on Android/web.
// Map each SF name we use to a MaterialCommunityIcons equivalent.
const SF_TO_MCI: Partial<Record<IconName, MciName>> = {
  'circle.lefthalf.filled': 'circle-half-full',
  'sun.max.fill': 'weather-sunny',
  'moon.fill': 'weather-night',
  'person.fill': 'account',
  'checkmark': 'check',
  'chevron.right': 'chevron-right',
  'chevron.left': 'chevron-left',
  'arrow.counterclockwise': 'refresh',
  'info.circle': 'information-outline',
  'person.badge.plus': 'account-plus',
  'person.2': 'account-multiple',
  'lock.fill': 'lock',
  'clock': 'clock-outline',
  'xmark': 'close',
  'person.line.dotted.person.fill': 'account-group',
  'line.3.horizontal': 'drag-horizontal-variant',
  'minus.circle.fill': 'minus-circle',
};

export function Icon({ name, size = 24, tintColor, weight, ...rest }: SymbolViewProps) {
  const mci = SF_TO_MCI[name];
  return (
    <SymbolView
      name={name}
      size={size}
      tintColor={tintColor}
      weight={weight}
      fallback={
        mci ? (
          <MaterialCommunityIcons name={mci} size={size} color={(tintColor as string) ?? '#000'} />
        ) : null
      }
      {...rest}
    />
  );
}
