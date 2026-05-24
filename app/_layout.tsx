import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { FriendsProvider } from '@/components/friends-provider';
import { GameProvider } from '@/components/game-provider';
import { ThemeProvider, useTheme } from '@/components/theme-provider';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <GameProvider>
          <FriendsProvider>
            <ThemedTabs />
          </FriendsProvider>
        </GameProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

function ThemedTabs() {
  const { colors, scheme } = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <NativeTabs tintColor={colors.accent} labelStyle={{ fontSize: 11, fontWeight: '600' }}>
        <NativeTabs.Trigger name="(today)">
          <Icon sf={{ default: 'square.and.pencil', selected: 'square.and.pencil' }} />
          <Label>Today</Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="history">
          <Icon sf={{ default: 'clock', selected: 'clock.fill' }} />
          <Label>Memories</Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="friends">
          <Icon sf={{ default: 'person.2', selected: 'person.2.fill' }} />
          <Label>Friends</Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="settings">
          <Icon sf={{ default: 'gearshape', selected: 'gearshape.fill' }} />
          <Label>Settings</Label>
        </NativeTabs.Trigger>
      </NativeTabs>
    </View>
  );
}
