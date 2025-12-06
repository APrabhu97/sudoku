import { useState, useCallback } from 'react';
import type { Difficulty } from '../types/game';
import { getCachedPuzzle } from '../services/gameEngine/puzzleCache';

/**
 * Hook to fetch puzzles from cache with loading state
 */
export function usePuzzleCache() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const getPuzzle = useCallback(async (difficulty: Difficulty): Promise<number[][] | null> => {
    setLoading(true);
    setError(null);

    try {
      const puzzle = await getCachedPuzzle(difficulty);
      setLoading(false);
      return puzzle;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      setLoading(false);
      return null;
    }
  }, []);

  return { getPuzzle, loading, error };
}
