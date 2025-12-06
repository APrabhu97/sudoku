import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Difficulty } from '../../types/game';
import { generateSudokuPuzzle } from './sudokuGenerator';

const CACHE_KEY_PREFIX = 'sudoku_puzzle_cache_';
const CACHE_SIZE = 3; // Store 3 puzzles per difficulty

interface CachedPuzzle {
  puzzle: number[][];
  timestamp: number;
}

/**
 * Gets a puzzle from cache or generates a new one
 * Automatically refills cache in background
 */
export async function getCachedPuzzle(difficulty: Difficulty): Promise<number[][]> {
  const cacheKey = `${CACHE_KEY_PREFIX}${difficulty}`;
  
  try {
    // Try to get from cache
    const cachedData = await AsyncStorage.getItem(cacheKey);
    
    if (cachedData) {
      const puzzles: CachedPuzzle[] = JSON.parse(cachedData);
      
      if (puzzles.length > 0) {
        // Pop the first puzzle
        const [firstPuzzle, ...remaining] = puzzles;
        
        // Update cache with remaining puzzles
        await AsyncStorage.setItem(cacheKey, JSON.stringify(remaining));
        
        // Refill cache in background (don't await)
        refillCache(difficulty).catch(console.error);
        
        return firstPuzzle.puzzle;
      }
    }
  } catch (error) {
    console.error('Error reading puzzle cache:', error);
  }
  
  // Cache miss - generate directly and refill cache
  const puzzle = generateSudokuPuzzle(difficulty);
  refillCache(difficulty).catch(console.error);
  
  return puzzle;
}

/**
 * Refills the cache to maintain CACHE_SIZE puzzles
 */
async function refillCache(difficulty: Difficulty): Promise<void> {
  const cacheKey = `${CACHE_KEY_PREFIX}${difficulty}`;
  
  try {
    const cachedData = await AsyncStorage.getItem(cacheKey);
    const existingPuzzles: CachedPuzzle[] = cachedData ? JSON.parse(cachedData) : [];
    
    const needed = CACHE_SIZE - existingPuzzles.length;
    
    if (needed > 0) {
      // Generate needed puzzles
      const newPuzzles: CachedPuzzle[] = [];
      for (let i = 0; i < needed; i++) {
        newPuzzles.push({
          puzzle: generateSudokuPuzzle(difficulty),
          timestamp: Date.now(),
        });
      }
      
      const updatedCache = [...existingPuzzles, ...newPuzzles];
      await AsyncStorage.setItem(cacheKey, JSON.stringify(updatedCache));
    }
  } catch (error) {
    console.error('Error refilling puzzle cache:', error);
  }
}

/**
 * Initializes cache for all difficulties
 * Call this on app startup for best UX
 */
export async function initializePuzzleCache(): Promise<void> {
  const difficulties: Difficulty[] = ['easy', 'medium', 'hard', 'expert'];
  
  await Promise.all(difficulties.map((difficulty) => refillCache(difficulty)));
}

/**
 * Clears all cached puzzles (useful for testing or troubleshooting)
 */
export async function clearPuzzleCache(): Promise<void> {
  const difficulties: Difficulty[] = ['easy', 'medium', 'hard', 'expert'];
  
  await Promise.all(
    difficulties.map((difficulty) =>
      AsyncStorage.removeItem(`${CACHE_KEY_PREFIX}${difficulty}`)
    )
  );
}

/**
 * Gets cache statistics for debugging/monitoring
 */
export async function getCacheStats(): Promise<Record<Difficulty, number>> {
  const difficulties: Difficulty[] = ['easy', 'medium', 'hard', 'expert'];
  const stats: Record<string, number> = {};
  
  await Promise.all(
    difficulties.map(async (difficulty) => {
      try {
        const cacheKey = `${CACHE_KEY_PREFIX}${difficulty}`;
        const cachedData = await AsyncStorage.getItem(cacheKey);
        const puzzles: CachedPuzzle[] = cachedData ? JSON.parse(cachedData) : [];
        stats[difficulty] = puzzles.length;
      } catch {
        stats[difficulty] = 0;
      }
    })
  );
  
  return stats as Record<Difficulty, number>;
}
