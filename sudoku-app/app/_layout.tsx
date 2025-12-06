import React, { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Stack } from 'expo-router';
import { useUserStore } from '../src/store/userStore';
import { initializeAuth } from '../src/services/auth/appStoreAuth';
import type { UserProfile } from '../src/types/user';

export default function RootLayout() {
  const { setUser, clearUser } = useUserStore();

  useEffect(() => {
    initializeAuth()
      .then((user: UserProfile | null) => {
        if (user) {
          setUser(user);
        } else {
          clearUser();
        }
      })
      .catch((error: unknown) => {
        console.error('Auth initialization failed:', error);
        clearUser();
      });
  }, [setUser, clearUser]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: true }} />
    </GestureHandlerRootView>
  );
}
