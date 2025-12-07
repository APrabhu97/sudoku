import type { Difficulty } from '../../types/game';
import { generateSudokuPuzzle, solveSudoku } from './sudokuGenerator';

export interface PuzzleGame {
  puzzle: number[][];
  solution: number[][];
  initialPuzzle: number[][];
  difficulty: Difficulty;
}

/**
 * Generates a new puzzle game with puzzle, solution, and metadata
 * @param difficulty - The difficulty level for the puzzle
 * @returns PuzzleGame object with puzzle, solution, and initial state
 */
export function generateNewPuzzle(difficulty: Difficulty): PuzzleGame {
  // Generate a puzzle using the sudokuGenerator
  const puzzle = generateSudokuPuzzle(difficulty);
  
  // Keep a copy of the initial puzzle state
  const initialPuzzle = puzzle.map(row => [...row]);
  
  // Solve the puzzle to get the solution
  const solution = solveSudoku(puzzle);
  
  if (!solution) {
    throw new Error('Failed to solve generated puzzle');
  }

  return {
    puzzle,
    solution,
    initialPuzzle,
    difficulty,
  };
}

/**
 * Resets a puzzle to its initial state
 * @param game - The puzzle game object
 * @returns A new puzzle object with reset state
 */
export function resetPuzzle(game: PuzzleGame): PuzzleGame {
  return {
    ...game,
    puzzle: game.initialPuzzle.map(row => [...row]),
  };
}

/**
 * Checks if a move is valid (doesn't conflict with solution or constraints)
 * @param puzzle - Current puzzle state
 * @param row - Row of the move
 * @param col - Column of the move
 * @param value - Value to place
 * @param solution - The solution board
 * @returns Object with isValid and hasConflict info
 */
export function validateMove(
  puzzle: number[][],
  row: number,
  col: number,
  value: number,
  solution: number[][]
): { isValid: boolean; hasConflict: boolean } {
  // Check if this cell has a given value (should not be editable)
  if (puzzle[row][col] !== 0 && value === 0) {
    return { isValid: false, hasConflict: false };
  }

  // If clearing a cell, always valid
  if (value === 0) {
    return { isValid: true, hasConflict: false };
  }

  // Check if value matches the solution
  const hasConflict = value !== 0 && value !== solution[row][col];

  return { isValid: true, hasConflict };
}

/**
 * Gets all conflicts in the current puzzle state
 * @param puzzle - Current puzzle state
 * @param solution - The solution board
 * @returns Set of cell keys (row,col) that have conflicts
 */
export function getConflicts(
  puzzle: number[][],
  solution: number[][]
): Set<string> {
  const conflicts = new Set<string>();

  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const value = puzzle[row][col];
      if (value !== 0 && value !== solution[row][col]) {
        conflicts.add(`${row},${col}`);
      }
    }
  }

  return conflicts;
}

/**
 * Checks if the puzzle is completely solved
 * @param puzzle - Current puzzle state
 * @param solution - The solution board
 * @returns true if puzzle matches solution exactly
 */
export function isPuzzleSolved(puzzle: number[][], solution: number[][]): boolean {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (puzzle[row][col] !== solution[row][col]) {
        return false;
      }
    }
  }
  return true;
}
