import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getCachedPuzzle,
  initializePuzzleCache,
  clearPuzzleCache,
  getCacheStats,
} from '../../src/services/gameEngine/puzzleCache';
import * as sudokuGenerator from '../../src/services/gameEngine/sudokuGenerator';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
}));

// Mock the generator
jest.mock('../../src/services/gameEngine/sudokuGenerator', () => ({
  generateSudokuPuzzle: jest.fn(),
}));

describe('Puzzle Cache Service', () => {
  const mockPuzzle = Array(9)
    .fill(null)
    .map((_, i) => Array(9).fill(i + 1));

  beforeEach(() => {
    jest.clearAllMocks();
    (sudokuGenerator.generateSudokuPuzzle as jest.Mock).mockReturnValue(mockPuzzle);
  });

  describe('getCachedPuzzle', () => {
    it('should return puzzle from cache if available', async () => {
      const cachedPuzzles = [
        { puzzle: mockPuzzle, timestamp: Date.now() },
        { puzzle: mockPuzzle, timestamp: Date.now() },
      ];
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify(cachedPuzzles)
      );
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);

      const result = await getCachedPuzzle('easy');

      expect(result).toEqual(mockPuzzle);
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('sudoku_puzzle_cache_easy');
      // Should update cache with remaining puzzles
      expect(AsyncStorage.setItem).toHaveBeenCalled();
    });

    it('should generate puzzle if cache is empty', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);

      const result = await getCachedPuzzle('medium');

      expect(result).toEqual(mockPuzzle);
      expect(sudokuGenerator.generateSudokuPuzzle).toHaveBeenCalledWith('medium');
    });

    it('should refill cache in background after retrieval', async () => {
      const cachedPuzzles = [{ puzzle: mockPuzzle, timestamp: Date.now() }];
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify(cachedPuzzles)
      );
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);

      await getCachedPuzzle('hard');

      // Wait for background refill
      await new Promise((resolve) => setTimeout(resolve, 50));

      // Should have been called to refill
      expect(sudokuGenerator.generateSudokuPuzzle).toHaveBeenCalled();
    });

    it('should handle cache read errors gracefully', async () => {
      (AsyncStorage.getItem as jest.Mock).mockRejectedValue(new Error('Storage error'));
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);

      const result = await getCachedPuzzle('expert');

      // Should fall back to generating
      expect(result).toEqual(mockPuzzle);
      expect(sudokuGenerator.generateSudokuPuzzle).toHaveBeenCalledWith('expert');
    });
  });

  describe('initializePuzzleCache', () => {
    it('should initialize cache for all difficulties', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);

      await initializePuzzleCache();

      // Should generate 3 puzzles for each of 4 difficulties = 12 total
      expect(sudokuGenerator.generateSudokuPuzzle).toHaveBeenCalledTimes(12);
      expect(AsyncStorage.setItem).toHaveBeenCalledTimes(4);
    });

    it('should only fill missing puzzles if cache partially full', async () => {
      const partialCache = [{ puzzle: mockPuzzle, timestamp: Date.now() }];
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify(partialCache)
      );
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);

      await initializePuzzleCache();

      // Should generate 2 more per difficulty (3 - 1 = 2) × 4 difficulties = 8
      expect(sudokuGenerator.generateSudokuPuzzle).toHaveBeenCalledTimes(8);
    });
  });

  describe('clearPuzzleCache', () => {
    it('should remove all cached puzzles', async () => {
      (AsyncStorage.removeItem as jest.Mock).mockResolvedValue(undefined);

      await clearPuzzleCache();

      expect(AsyncStorage.removeItem).toHaveBeenCalledTimes(4);
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('sudoku_puzzle_cache_easy');
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('sudoku_puzzle_cache_medium');
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('sudoku_puzzle_cache_hard');
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('sudoku_puzzle_cache_expert');
    });
  });

  describe('getCacheStats', () => {
    it('should return correct cache sizes for all difficulties', async () => {
      (AsyncStorage.getItem as jest.Mock).mockImplementation((key: string) => {
        if (key.includes('easy')) {
          return Promise.resolve(
            JSON.stringify([
              { puzzle: mockPuzzle, timestamp: Date.now() },
              { puzzle: mockPuzzle, timestamp: Date.now() },
              { puzzle: mockPuzzle, timestamp: Date.now() },
            ])
          );
        }
        if (key.includes('medium')) {
          return Promise.resolve(
            JSON.stringify([{ puzzle: mockPuzzle, timestamp: Date.now() }])
          );
        }
        return Promise.resolve(null);
      });

      const stats = await getCacheStats();

      expect(stats).toEqual({
        easy: 3,
        medium: 1,
        hard: 0,
        expert: 0,
      });
    });
  });
});
