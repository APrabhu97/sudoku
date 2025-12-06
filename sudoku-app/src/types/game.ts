// Game types
export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';
export type GameMode = 'classic' | 'speed' | 'daily';
export type GameStatus = 'playing' | 'completed' | 'forfeit' | 'paused' | 'abandoned';
export type PlayerStatus = 'playing' | 'completed' | 'disconnected' | 'paused' | 'forfeited';

export interface GameBoard {
  initialBoard: number[][];
  currentBoard: number[][];
  solvedBoard: number[][];
}

export interface SinglePlayerGame {
  id: string;
  userId: string;
  mode: GameMode;
  difficulty: Difficulty;
  board: GameBoard;
  startTime: number; // timestamp
  completionTime: number | null;
  status: GameStatus;
  hintsUsed: number;
  totalHints: number;
  hasTimer: boolean;
  hasMistakeHighlight: boolean;
  hasHints: boolean;
  elapsedTime: number; // seconds
}

export interface MultiplayerGame {
  id: string;
  gameType: 'random' | 'friend' | 'invite_code';
  mode: GameMode;
  difficulty: Difficulty;
  board: GameBoard;
  players: {
    [playerId: string]: {
      displayName: string;
      avatar?: string;
      currentBoard: number[][];
      status: PlayerStatus;
      startTime: number;
      completionTime: number | null;
      localStartTime: number;
      localCompletionTime: number | null;
      hintsUsed: number;
      lastHeartbeat: number;
    };
  };
  createdAt: number;
  status: GameStatus;
  winner: string | null;
  inviteCode?: string;
}

export type Game = SinglePlayerGame | MultiplayerGame;

export interface GameResult {
  id: string;
  gameId: string;
  gameType: 'single' | 'multiplayer';
  mode: GameMode;
  difficulty: Difficulty;
  players: string[]; // userIds
  winner: string | null;
  completionTimes: {
    [playerId: string]: number;
  };
  createdAt: number;
}
