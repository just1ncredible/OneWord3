import { router } from 'expo-router';
import { Platform, Pressable, Text, View, useWindowDimensions } from 'react-native';
import { Icon } from '@/components/icon';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useFriends } from '@/components/friends-provider';
import { useGame } from '@/components/game-provider';
import { useTheme } from '@/components/theme-provider';
import { space, type } from '@/constants/theme';
import { tapLight } from '@/lib/haptics';
import { type Friend } from '@/lib/mock-friends';

export default function FriendsScreen() {
  const { submission } = useGame();
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const isWideWeb = Platform.OS === 'web' && width > 700;
  const contentMaxWidth = isWideWeb ? 520 : undefined;

  const { friends } = useFriends();
  const myWord = submission?.word.toLowerCase() ?? null;
  const isMatch = (f: Friend) => !!myWord && f.word?.toLowerCase() === myWord;

  function openManage() {
    tapLight();
    router.push('/friends/manage');
  }

  return (
      <Animated.ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: space.lg,
          paddingBottom: space.xl,
        }}
        style={{ flex: 1, backgroundColor: colors.background }}
      >
        <View style={{ width: '100%', alignSelf: 'center', maxWidth: contentMaxWidth, gap: space.lg }}>
          <View style={{ gap: space.sm, paddingTop: space.xs }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 34, lineHeight: 34, fontWeight: '700', color: colors.text, letterSpacing: 0.3 }}>
                Friends
              </Text>
              <Pressable
                onPress={openManage}
                hitSlop={10}
                style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1, width: 34, alignItems: 'center' })}
              >
                <Icon name="person.badge.plus" size={30} tintColor={colors.accent} />
              </Pressable>
            </View>

            <Pressable
              onPress={openManage}
              hitSlop={8}
              style={({ pressed }) => ({
                flexDirection: 'row',
                alignItems: 'center',
                alignSelf: 'flex-start',
                gap: 6,
                opacity: pressed ? 0.6 : 1,
              })}
            >
              <Icon name="person.2" size={15} tintColor={colors.muted} />
              <Text style={{ fontSize: type.label, color: colors.muted, fontWeight: '600' }}>
                Manage friends
              </Text>
            </Pressable>
          </View>

          <Animated.View entering={FadeIn.duration(220)}>
            {friends.map((f, i) => (
              <FriendRow
                key={f.id}
                friend={f}
                matched={isMatch(f)}
                revealed={!!submission}
                isLast={i === friends.length - 1}
              />
            ))}
          </Animated.View>
        </View>
      </Animated.ScrollView>
  );
}

function FriendRow({
  friend,
  matched,
  revealed,
  isLast,
}: {
  friend: Friend;
  matched: boolean;
  revealed: boolean;
  isLast: boolean;
}) {
  const { colors } = useTheme();
  const played = !!friend.word;
  const initial = friend.name.charAt(0).toUpperCase();

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: space.md,
        paddingVertical: 14,
        borderBottomWidth: isLast ? 0 : 1,
        borderBottomColor: colors.line,
        opacity: played ? 1 : 0.55,
      }}
    >
      <View
        style={{
          width: 44,
          height: 44,
          borderRadius: 22,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: matched ? colors.accentSoft : colors.surface,
          borderWidth: 1,
          borderColor: matched ? 'transparent' : colors.line,
        }}
      >
        <Text
          style={{
            fontSize: type.body,
            fontWeight: '700',
            color: matched ? colors.accentInk : played ? colors.text : colors.muted,
          }}
        >
          {initial}
        </Text>
      </View>

      <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: space.sm }}>
        <Text
          style={{
            fontSize: type.body,
            fontWeight: '700',
            color: played ? colors.text : colors.muted,
            letterSpacing: -0.2,
          }}
        >
          {friend.name}
        </Text>
        {matched ? (
          <Text style={{ fontSize: 11, fontWeight: '700', color: colors.accent, letterSpacing: 1.2 }}>
            MATCH
          </Text>
        ) : null}
      </View>

      {friend.word ? (
        revealed ? (
          <Text
            style={{
              fontSize: type.body,
              fontWeight: '600',
              color: matched ? colors.accent : colors.text,
              letterSpacing: -0.2,
            }}
          >
            {friend.word}
          </Text>
        ) : (
          <View style={{ width: 34, alignItems: 'center' }}>
            <Icon name="lock.fill" size={18} tintColor={colors.muted} />
          </View>
        )
      ) : (
        <View style={{ width: 34, alignItems: 'center' }}>
          <Icon name="clock" size={18} tintColor={colors.muted} />
        </View>
      )}
    </View>
  );
}
