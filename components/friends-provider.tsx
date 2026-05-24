import { createContext, use, useCallback, useMemo, useState, type ReactNode } from 'react';
import { SEED_FRIENDS, type Friend } from '@/lib/mock-friends';

type FriendsContextValue = {
  friends: Friend[];
  removeFriend: (id: string) => void;
  reorderFriend: (from: number, to: number) => void;
};

const FriendsContext = createContext<FriendsContextValue | null>(null);

export function FriendsProvider({ children }: { children: ReactNode }) {
  const [friends, setFriends] = useState<Friend[]>(SEED_FRIENDS);

  const removeFriend = useCallback((id: string) => {
    setFriends((cur) => cur.filter((f) => f.id !== id));
  }, []);

  const reorderFriend = useCallback((from: number, to: number) => {
    setFriends((cur) => {
      const next = cur.slice();
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
  }, []);

  const value = useMemo<FriendsContextValue>(
    () => ({ friends, removeFriend, reorderFriend }),
    [friends, removeFriend, reorderFriend],
  );

  return <FriendsContext value={value}>{children}</FriendsContext>;
}

export function useFriends() {
  const ctx = use(FriendsContext);
  if (!ctx) throw new Error('useFriends must be used inside <FriendsProvider>');
  return ctx;
}
