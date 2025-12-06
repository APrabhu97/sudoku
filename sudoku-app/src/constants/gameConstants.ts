import type { GameMode } from '../types/game';

export const GAME_CONSTANTS = {
  // Board
  BOARD_SIZE: 9,
  BOX_SIZE: 3,

  // Hints
  HINTS_PER_GAME: {
    easy: 5,
    medium: 4,
    hard: 3,
    expert: 2,
  },

  // Timer
  DEFAULT_TIMEOUT: 30000, // 30 seconds
  HEARTBEAT_INTERVAL: 5000, // 5 seconds
  DISCONNECT_TIMEOUT: 30000, // 30 seconds before forfeit

  // Game modes
  SUPPORTED_GAME_MODES: {
    classic: { name: 'Classic', description: 'Traditional 9x9 Sudoku' },
    speed: { name: 'Speed Mode', description: 'Race against the clock' },
    daily: { name: 'Daily Challenge', description: 'New puzzle every day' },
  } as Record<GameMode, { name: string; description: string }>,

  // Matchmaking
  MATCHMAKING_TIMEOUT: 300000, // 5 minutes before queue timeout

  // Sync
  MAX_TIME_DRIFT: 30000, // 30 seconds max drift before using server time
  SYNC_DEBOUNCE: 1000, // Debounce game state sync
  OFFLINE_QUEUE_SIZE: 100, // Max queued operations when offline

  // Storage keys
  STORAGE_KEYS: {
    USER_PROFILE: '@sudoku/userProfile',
    CURRENT_GAME: '@sudoku/currentGame',
    GAME_HISTORY: '@sudoku/gameHistory',
    FRIENDS: '@sudoku/friends',
    SETTINGS: '@sudoku/settings',
    SYNC_QUEUE: '@sudoku/syncQueue',
    DEVICE_ID: '@sudoku/deviceId',
  },
};
