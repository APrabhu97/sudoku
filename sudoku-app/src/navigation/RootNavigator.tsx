import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useUserStore } from '../store/userStore';

// Screens
import SplashScreen from '../screens/Auth/SplashScreen';
import HomeScreen from '../screens/Home/HomeScreen';
import GameScreen from '../screens/Game/GameScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import LeaderboardScreen from '../screens/Leaderboards/LeaderboardScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerTitleAlign: 'center',
      }}
    >
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{ title: 'Sudoku' }}
      />
      <Stack.Screen
        name="GameScreen"
        component={GameScreen}
        options={{ title: 'Game' }}
      />
    </Stack.Navigator>
  );
}

function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      <Stack.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
    </Stack.Navigator>
  );
}

function LeaderboardStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      <Stack.Screen
        name="LeaderboardScreen"
        component={LeaderboardScreen}
        options={{ title: 'Leaderboards' }}
      />
    </Stack.Navigator>
  );
}

export function RootNavigator() {
  const { user, isLoading } = useUserStore();

  if (isLoading) {
    return <SplashScreen />;
  }

  if (!user) {
    return <SplashScreen />;
  }

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{ title: 'Home' }}
      />
      <Tab.Screen
        name="Leaderboard"
        component={LeaderboardStack}
        options={{ title: 'Leaderboard' }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
}
