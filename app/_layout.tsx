import { NativeTabs, Icon, Label, VectorIcon } from 'expo-router/unstable-native-tabs';
import {
  ThemeProvider as NavThemeProvider,
  DefaultTheme,
  DarkTheme,
  type Theme,
} from '@react-navigation/native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { FriendsProvider } from '@/components/friends-provider';
import { GameProvider } from '@/components/game-provider';
import { ThemeProvider, useTheme } from '@/components/theme-provider';

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AppShell />
    </ThemeProvider>
  );
}

function AppShell() {
  const { colors, scheme } = useTheme();
  const base = scheme === 'dark' ? DarkTheme : DefaultTheme;
  const navTheme: Theme = {
    ...base,
    colors: {
      ...base.colors,
      background: colors.background,
      card: colors.background,
      border: colors.line,
      text: colors.text,
      primary: colors.accent,
      notification: colors.accent,
    },
  };

  // Theming every backdrop layer (root view, safe-area provider, nav theme)
  // prevents a white flash at the top during screen transitions when the app
  // theme differs from the OS appearance.
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.background }}>
      <SafeAreaProvider style={{ flex: 1, backgroundColor: colors.background }}>
        <NavThemeProvider value={navTheme}>
          <GameProvider>
            <FriendsProvider>
              <View style={{ flex: 1, backgroundColor: colors.background }}>
                <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
                <NativeTabs tintColor={colors.accent} labelStyle={{ fontSize: 11, fontWeight: '600' }}>
                  <NativeTabs.Trigger name="(today)">
                    <Icon
                      sf={{ default: 'square.and.pencil', selected: 'square.and.pencil' }}
                      androidSrc={<VectorIcon family={MaterialCommunityIcons} name="square-edit-outline" />}
                    />
                    <Label>Today</Label>
                  </NativeTabs.Trigger>
                  <NativeTabs.Trigger name="history">
                    <Icon
                      sf={{ default: 'clock', selected: 'clock.fill' }}
                      androidSrc={<VectorIcon family={MaterialCommunityIcons} name="clock-outline" />}
                    />
                    <Label>Memories</Label>
                  </NativeTabs.Trigger>
                  <NativeTabs.Trigger name="friends">
                    <Icon
                      sf={{ default: 'person.2', selected: 'person.2.fill' }}
                      androidSrc={<VectorIcon family={MaterialCommunityIcons} name="account-multiple" />}
                    />
                    <Label>Friends</Label>
                  </NativeTabs.Trigger>
                  <NativeTabs.Trigger name="settings">
                    <Icon
                      sf={{ default: 'gearshape', selected: 'gearshape.fill' }}
                      androidSrc={<VectorIcon family={MaterialCommunityIcons} name="cog-outline" />}
                    />
                    <Label>Settings</Label>
                  </NativeTabs.Trigger>
                </NativeTabs>
              </View>
            </FriendsProvider>
          </GameProvider>
        </NavThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
