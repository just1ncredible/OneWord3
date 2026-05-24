import { router, Stack } from 'expo-router';
import { Platform, Pressable, ScrollView, Share, Text, View, useWindowDimensions } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { useFriends } from '@/components/friends-provider';
import { useTheme } from '@/components/theme-provider';
import { radius, space, type } from '@/constants/theme';
import { tapLight } from '@/lib/haptics';

export default function ManageFriendsScreen() {
  const { colors } = useTheme();
  const { friends, removeFriend } = useFriends();
  const { width } = useWindowDimensions();
  const isWideWeb = Platform.OS === 'web' && width > 700;
  const contentMaxWidth = isWideWeb ? 520 : undefined;

  function handleInvite() {
    tapLight();
    Share.share({
      message: 'Play OneWord with me — one word, one day, one shared length.',
    }).catch(() => {});
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        style={{ flex: 1, backgroundColor: colors.background }}
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: space.lg,
          paddingTop: space.lg,
          paddingBottom: space.xl,
          gap: space.xl,
        }}
      >
        <View style={{ width: '100%', alignSelf: 'center', maxWidth: contentMaxWidth, gap: space.xl }}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: space.md }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 28, fontWeight: '700', color: colors.text, letterSpacing: 0.2 }}>
                Manage friends
              </Text>
              <Text style={{ fontSize: type.body, color: colors.muted, marginTop: 2 }}>
                Invite people or remove them.
              </Text>
            </View>
            <Pressable
              onPress={() => router.back()}
              hitSlop={10}
              style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1, paddingTop: 4 })}
            >
              <SymbolView name="xmark" size={20} tintColor={colors.muted} weight="semibold" />
            </Pressable>
          </View>

          <View style={{ alignItems: 'center', gap: space.lg, paddingVertical: space.lg }}>
            <View
              style={{
                width: 96,
                height: 96,
                borderRadius: 48,
                backgroundColor: colors.accentSoft,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <SymbolView name="person.line.dotted.person.fill" size={46} tintColor={colors.accent} />
            </View>

            <Text
              style={{
                fontSize: 26,
                fontWeight: '700',
                color: colors.text,
                textAlign: 'center',
                letterSpacing: -0.4,
                lineHeight: 32,
              }}
            >
              Who do you want to write with?
            </Text>
            <Text
              style={{
                fontSize: type.body,
                color: colors.muted,
                textAlign: 'center',
                lineHeight: 24,
                paddingHorizontal: space.sm,
              }}
            >
              You’ll see each other’s word each day after they accept your invite.
            </Text>

            <Pressable
              onPress={handleInvite}
              style={({ pressed }) => ({
                flexDirection: 'row',
                alignItems: 'center',
                gap: space.sm,
                backgroundColor: colors.accent,
                borderRadius: 999,
                paddingVertical: 14,
                paddingHorizontal: space.xl,
                marginTop: space.xs,
                opacity: pressed ? 0.88 : 1,
              })}
            >
              <SymbolView name="person.badge.plus" size={20} tintColor={colors.onAccent} />
              <Text style={{ fontSize: type.body, fontWeight: '700', color: colors.onAccent, letterSpacing: 0.2 }}>
                Invite a friend
              </Text>
            </Pressable>
          </View>

          {friends.length > 0 ? (
            <View style={{ gap: space.sm }}>
              <Text
                style={{
                  fontSize: type.small,
                  color: colors.muted,
                  fontWeight: '600',
                  letterSpacing: 1.2,
                  textTransform: 'uppercase',
                }}
              >
                {`${friends.length} ${friends.length === 1 ? 'friend' : 'friends'}`}
              </Text>

              <View
                style={{
                  backgroundColor: colors.surface,
                  borderWidth: 1,
                  borderColor: colors.line,
                  borderRadius: radius.slot,
                  borderCurve: 'continuous',
                  overflow: 'hidden',
                }}
              >
                {friends.map((f, i) => (
                  <View
                    key={f.id}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: space.md,
                      paddingHorizontal: space.lg,
                      paddingVertical: 12,
                      borderBottomWidth: i === friends.length - 1 ? 0 : 1,
                      borderBottomColor: colors.line,
                    }}
                  >
                    <View
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 18,
                        backgroundColor: colors.accentSoft,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Text style={{ fontSize: type.label, fontWeight: '700', color: colors.accentInk }}>
                        {f.name.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                    <Text style={{ flex: 1, fontSize: type.body, fontWeight: '600', color: colors.text }}>
                      {f.name}
                    </Text>
                    <Pressable
                      onPress={() => {
                        tapLight();
                        removeFriend(f.id);
                      }}
                      hitSlop={8}
                      style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
                    >
                      <SymbolView name="minus.circle.fill" size={22} tintColor={colors.accent2} />
                    </Pressable>
                  </View>
                ))}
              </View>
            </View>
          ) : null}
        </View>
      </ScrollView>
    </>
  );
}
