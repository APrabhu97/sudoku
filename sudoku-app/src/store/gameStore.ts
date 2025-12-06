import { create } from 'zustand';
import type { SinglePlayerGame } from '../types/game';

interface GameState {
  currentGame: SinglePlayerGame | null;
  setCurrentGame: (game: SinglePlayerGame | null) => void;
  updateBoard: (board: number[][]) => void;
  updateTime: (elapsed: number) => void;
  useHint: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  reset: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  currentGame: null,

  setCurrentGame: (game) => set({ currentGame: game }),

  updateBoard: (board) =>
    set((state) => ({
      currentGame: state.currentGame
        ? {
            ...state.currentGame,
            currentBoard: board,
          }
        : null,
    })),

  updateTime: (elapsed) =>
    set((state) => ({
      currentGame: state.currentGame
        ? {
            ...state.currentGame,
            elapsedTime: elapsed,
          }
        : null,
    })),

  useHint: () =>
    set((state) => ({
      currentGame: state.currentGame
        ? {
            ...state.currentGame,
            hintsUsed: Math.min(
              state.currentGame.hintsUsed + 1,
              state.currentGame.totalHints
            ),
          }
        : null,
    })),

  pauseGame: () =>
    set((state) => ({
      currentGame: state.currentGame
        ? {
            ...state.currentGame,
            status: 'paused' as const,
          }
        : null,
    })),

  resumeGame: () =>
    set((state) => ({
      currentGame: state.currentGame
        ? {
            ...state.currentGame,
            status: 'playing' as const,
          }
        : null,
    })),

  reset: () => set({ currentGame: null }),
}));
