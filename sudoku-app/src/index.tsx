import React, { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { RootNavigator } from './navigation/RootNavigator';
import { useUserStore } from './store/userStore';
import { initializeAuth } from './services/auth/appStoreAuth';
import type { UserProfile } from './types/user';

export default function App() {
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
      <RootNavigator />
    </GestureHandlerRootView>
  );
}
