import { router, Stack } from 'expo-router';
import { Platform, Pressable, Share, Text, View, useWindowDimensions } from 'react-native';
import { SymbolView } from 'expo-symbols';
import ReorderableList, {
  useReorderableDrag,
  type ReorderableListReorderEvent,
  type ReorderableListRenderItemInfo,
} from 'react-native-reorderable-list';
import { useFriends } from '@/components/friends-provider';
import { useTheme } from '@/components/theme-provider';
import { radius, space, type } from '@/constants/theme';
import { tapLight, tapSelection } from '@/lib/haptics';
import type { Friend } from '@/lib/mock-friends';

export default function ManageFriendsScreen() {
  const { colors } = useTheme();
  const { friends, removeFriend, reorderFriend } = useFriends();
  const { width } = useWindowDimensions();
  const isWideWeb = Platform.OS === 'web' && width > 700;
  const contentMaxWidth = isWideWeb ? 520 : undefined;

  function handleReorder({ from, to }: ReorderableListReorderEvent) {
    if (from !== to) tapSelection();
    reorderFriend(from, to);
  }

  const renderItem = ({ item }: ReorderableListRenderItemInfo<Friend>) => (
    <ManageRow friend={item} onRemove={() => removeFriend(item.id)} />
  );

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ReorderableList
        data={friends}
        onReorder={handleReorder}
        renderItem={renderItem}
        keyExtractor={(f) => f.id}
        ListHeaderComponent={ManageHeader}
        ListEmptyComponent={
          <Text style={{ fontSize: type.body, color: colors.muted }}>
            No friends yet. Invite someone above.
          </Text>
        }
        style={{ flex: 1, width: '100%', maxWidth: contentMaxWidth, alignSelf: 'center', backgroundColor: colors.background }}
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: space.lg,
          paddingTop: space.lg,
          paddingBottom: space.xl,
        }}
      />
    </>
  );
}

function ManageHeader() {
  const { colors } = useTheme();
  const { friends } = useFriends();

  function handleInvite() {
    tapLight();
    Share.share({
      message: 'Play OneWord with me — one word, one day, one shared length.',
    }).catch(() => {});
  }

  return (
    <View style={{ gap: space.xl, paddingBottom: space.lg }}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: space.md }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 28, fontWeight: '700', color: colors.text, letterSpacing: 0.2 }}>
            Manage friends
          </Text>
          <Text style={{ fontSize: type.body, color: colors.muted, marginTop: 2 }}>
            Invite people, reorder, or remove them.
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
        <Text
          style={{
            fontSize: type.small,
            color: colors.muted,
            fontWeight: '600',
            letterSpacing: 1.2,
            textTransform: 'uppercase',
          }}
        >
          {`${friends.length} ${friends.length === 1 ? 'friend' : 'friends'} · hold to reorder`}
        </Text>
      ) : null}
    </View>
  );
}

function ManageRow({ friend, onRemove }: { friend: Friend; onRemove: () => void }) {
  const { colors } = useTheme();
  const drag = useReorderableDrag();

  return (
    <Pressable
      onLongPress={drag}
      delayLongPress={180}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: space.md,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.line,
        borderRadius: radius.slot,
        borderCurve: 'continuous',
        paddingHorizontal: space.lg,
        paddingVertical: 12,
        marginBottom: space.sm,
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
          {friend.name.charAt(0).toUpperCase()}
        </Text>
      </View>

      <Text style={{ flex: 1, fontSize: type.body, fontWeight: '600', color: colors.text }}>
        {friend.name}
      </Text>

      <SymbolView name="line.3.horizontal" size={20} tintColor={colors.muted} />

      <Pressable
        onPress={onRemove}
        hitSlop={8}
        style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
      >
        <SymbolView name="minus.circle.fill" size={22} tintColor={colors.accent2} />
      </Pressable>
    </Pressable>
  );
}
