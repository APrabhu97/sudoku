export interface UserProfile {
  id: string;
  appStoreId: string; // iOS App Store ID or Android Google Play ID
  displayName: string;
  avatar?: string;
  createdAt: number;
  lastActiveAt: number;
  stats: {
    totalWins: number;
    totalLosses: number;
    gameModesStats: {
      [modeId: string]: {
        wins: number;
        losses: number;
        bestTime: number | null;
      };
    };
    difficultyStats: {
      easy: { wins: number; losses: number; bestTime: number | null };
      medium: { wins: number; losses: number; bestTime: number | null };
      hard: { wins: number; losses: number; bestTime: number | null };
      expert: { wins: number; losses: number; bestTime: number | null };
    };
  };
  settings: {
    darkMode: boolean;
    notificationsEnabled: boolean;
    analyticsOptIn: boolean;
  };
  friends: string[]; // array of user IDs
  blockedUsers: string[];
}

export interface FriendRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: number;
}

export interface Friend {
  id: string;
  displayName: string;
  avatar?: string;
  stats: {
    totalWins: number;
    totalLosses: number;
  };
  headToHead: {
    wins: number;
    losses: number;
    lastPlayedAt: number | null;
  };
  isOnline: boolean;
  lastActiveAt: number;
}
