import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Device from 'expo-device';
import { GAME_CONSTANTS } from '../../constants/gameConstants';
import type { UserProfile } from '../../types/user';

/**
 * Initialize authentication using device ID (App Store ID equivalent)
 * In production, this would validate against actual App Store receipts
 */
export async function initializeAuth(): Promise<UserProfile | null> {
  try {
    // Check if user already authenticated
    const cachedProfile = await AsyncStorage.getItem(
      GAME_CONSTANTS.STORAGE_KEYS.USER_PROFILE
    );

    if (cachedProfile) {
      return JSON.parse(cachedProfile);
    }

    // Generate device-based user ID
    const deviceId = await getOrCreateDeviceId();

    // Create new user profile
    const newProfile = createNewUserProfile(deviceId);

    // Save to AsyncStorage and Firebase (Firebase sync in separate service)
    await AsyncStorage.setItem(
      GAME_CONSTANTS.STORAGE_KEYS.USER_PROFILE,
      JSON.stringify(newProfile)
    );

    return newProfile;
  } catch (error) {
    console.error('Auth initialization error:', error);
    return null;
  }
}

/**
 * Get or create a device ID (simulates App Store authentication)
 */
async function getOrCreateDeviceId(): Promise<string> {
  try {
    let deviceId = await AsyncStorage.getItem(
      GAME_CONSTANTS.STORAGE_KEYS.DEVICE_ID
    );

    if (!deviceId) {
      // Generate device ID using device info + timestamp
      const deviceName = Device.deviceName || 'sudoku-player';
      const timestamp = Date.now();
      deviceId = `${deviceName}-${timestamp}-${Math.random().toString(36).substring(7)}`;

      await AsyncStorage.setItem(
        GAME_CONSTANTS.STORAGE_KEYS.DEVICE_ID,
        deviceId
      );
    }

    return deviceId;
  } catch (error) {
    console.error('Device ID error:', error);
    // Fallback to timestamp-based ID
    return `sudoku-${Date.now()}`;
  }
}

/**
 * Create a new user profile
 */
function createNewUserProfile(appStoreId: string): UserProfile {
  return {
    id: generateUserId(),
    appStoreId,
    displayName: `Player ${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
    createdAt: Date.now(),
    lastActiveAt: Date.now(),
    stats: {
      totalWins: 0,
      totalLosses: 0,
      gameModesStats: {
        classic: { wins: 0, losses: 0, bestTime: null },
        speed: { wins: 0, losses: 0, bestTime: null },
        daily: { wins: 0, losses: 0, bestTime: null },
      },
      difficultyStats: {
        easy: { wins: 0, losses: 0, bestTime: null },
        medium: { wins: 0, losses: 0, bestTime: null },
        hard: { wins: 0, losses: 0, bestTime: null },
        expert: { wins: 0, losses: 0, bestTime: null },
      },
    },
    settings: {
      darkMode: false,
      notificationsEnabled: true,
      analyticsOptIn: true,
    },
    friends: [],
    blockedUsers: [],
  };
}

/**
 * Generate a unique user ID
 */
function generateUserId(): string {
  return `user-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Update user profile in local storage
 */
export async function updateUserProfile(profile: UserProfile): Promise<void> {
  await AsyncStorage.setItem(
    GAME_CONSTANTS.STORAGE_KEYS.USER_PROFILE,
    JSON.stringify(profile)
  );
}

/**
 * Logout user
 */
export async function logout(): Promise<void> {
  try {
    await AsyncStorage.removeItem(GAME_CONSTANTS.STORAGE_KEYS.USER_PROFILE);
  } catch (error) {
    console.error('Logout error:', error);
  }
}
