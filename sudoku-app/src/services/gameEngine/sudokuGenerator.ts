import type { Difficulty } from '../../types/game';

// Clue counts by difficulty
const CLUES_BY_DIFFICULTY: Record<Difficulty, number> = {
  easy: 40,
  medium: 32,
  hard: 24,
  expert: 17,
};

/**
 * Generates a valid Sudoku puzzle with given difficulty
 */
export function generateSudokuPuzzle(difficulty: Difficulty): number[][] {
  // Generate a solved board first
  const solved = generateSolvedBoard();

  // Clone to create puzzle
  const puzzle = solved.map((row) => [...row]);

  // Remove numbers based on difficulty
  const cluestoRemove = 81 - CLUES_BY_DIFFICULTY[difficulty];
  removeNumbers(puzzle, cluestoRemove);

  return puzzle;
// removed extra closing brace

/**
 * Generates a completed, valid Sudoku board
 */
function generateSolvedBoard(): number[][] {
  const board: number[][] = Array(9)
    .fill(null)
    .map(() => Array(9).fill(0));

  fillBoard(board);
  return board;
}

/**
 * Recursively fills the board with valid numbers
 * OPTIMIZED: Uses Fisher-Yates shuffle for better performance
 */
function fillBoard(board: number[][]): boolean {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === 0) {
        // Fisher-Yates shuffle for better randomness
        const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        for (let i = numbers.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
        }

        for (const num of numbers) {
          if (isValidMove(board, row, col, num)) {
            board[row][col] = num;

            if (fillBoard(board)) {
              return true;
            }

            board[row][col] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
}

/**
 * Removes numbers from the solved board to create puzzle
 * OPTIMIZED: Uses random removal without validation for speed
 * This trades perfect uniqueness for fast generation (acceptable for casual play)
 */
function removeNumbers(board: number[][], count: number): void {
  let removed = 0;
  const cellIndices = Array.from({ length: 81 }, (_, i) => i).sort(() => Math.random() - 0.5);
  let tried = 0;

  for (const idx of cellIndices) {
    if (removed >= count) break;
    if (tried >= 81) break;

    const row = Math.floor(idx / 9);
    const col = idx % 9;

    if (board[row][col] !== 0) {
      const backup = board[row][col];
      board[row][col] = 0;
      // Check uniqueness after removal
      const solutionCount = countSolutions(board, 2);
      if (solutionCount === 1) {
        removed++;
      } else {
        board[row][col] = backup; // revert removal
      }
      tried++;
    }
  }

  // If not enough numbers could be removed, fill remaining cells to match clue count
  const cluesNeeded = 81 - count;
  let clues = board.flat().filter((cell) => cell !== 0).length;
  if (clues > cluesNeeded) {
    // Remove random clues (without uniqueness check) to match target
    const filledCells = [];
    for (let i = 0; i < 81; i++) {
      const row = Math.floor(i / 9);
      const col = i % 9;
      if (board[row][col] !== 0) filledCells.push({ row, col });
    }
    while (clues > cluesNeeded && filledCells.length > 0) {
      const idx = Math.floor(Math.random() * filledCells.length);
      const { row, col } = filledCells.splice(idx, 1)[0];
      board[row][col] = 0;
      clues--;
    }
  }
}

/**
 * Counts the number of solutions for a given board, up to maxSolutions
 */
function countSolutions(board: number[][], maxSolutions: number = 2): number {
  let count = 0;
  const temp = board.map((row) => [...row]);

  function solve(): boolean {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (temp[row][col] === 0) {
          for (let num = 1; num <= 9; num++) {
            if (isValidMove(temp, row, col, num)) {
              temp[row][col] = num;
              if (solve()) {
                temp[row][col] = 0;
                if (++count >= maxSolutions) return false;
              } else {
                temp[row][col] = 0;
              }
            }
          }
          return false;
        }
      }
    }
    // Found a solution
    count++;
    return count < maxSolutions;
  }

  solve();
  return count;
}
}

/**
 * Checks if placing a number at position is valid
 */
export function isValidMove(
  board: number[][],
  row: number,
  col: number,
  num: number
): boolean {
  // Check row
  if (board[row].includes(num)) {
    return false;
  }

  // Check column
  if (board.some((r) => r[col] === num)) {
    return false;
  }

  // Check 3x3 box
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;

  for (let i = boxRow; i < boxRow + 3; i++) {
    for (let j = boxCol; j < boxCol + 3; j++) {
      if (board[i][j] === num) {
        return false;
      }
    }
  }

  return true;
}

/**
 * Generates hint for current board state
 */
export function generateHint(
  currentBoard: number[][],
  solvedBoard: number[][]
): { row: number; col: number; value: number } | null {
  // Find empty cells
  const emptyCells: { row: number; col: number }[] = [];

  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (currentBoard[row][col] === 0) {
        emptyCells.push({ row, col });
      }
    }
  }

  if (emptyCells.length === 0) return null;

  // Return random empty cell with correct value
  const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];

  return {
    row: randomCell.row,
    col: randomCell.col,
    value: solvedBoard[randomCell.row][randomCell.col],
  };
}

/**
 * Checks if the board is completely solved
 */
export function isBoardComplete(board: number[][]): boolean {
  return board.every((row) => row.every((cell) => cell !== 0));
}

/**
 * Checks if the entire board is valid
 */
export function isBoardValid(board: number[][]): boolean {
  // Check all rows have 1-9
  for (let row = 0; row < 9; row++) {
    const values = new Set(board[row].filter((v) => v !== 0));
    if (values.size !== board[row].filter((v) => v !== 0).length) {
      return false; // Duplicate in row
    }
  }

  // Check all columns have 1-9
  for (let col = 0; col < 9; col++) {
    const values = new Set();
    for (let row = 0; row < 9; row++) {
      if (board[row][col] !== 0) {
        if (values.has(board[row][col])) {
          return false; // Duplicate in column
        }
        values.add(board[row][col]);
      }
    }
  }

  // Check all 3x3 boxes have 1-9
  for (let boxRow = 0; boxRow < 3; boxRow++) {
    for (let boxCol = 0; boxCol < 3; boxCol++) {
      const values = new Set();
      for (let i = boxRow * 3; i < boxRow * 3 + 3; i++) {
        for (let j = boxCol * 3; j < boxCol * 3 + 3; j++) {
          if (board[i][j] !== 0) {
            if (values.has(board[i][j])) {
              return false; // Duplicate in box
            }
            values.add(board[i][j]);
          }
        }
      }
    }
  }

  return true;
}

/**
 * Solves a Sudoku puzzle (returns solved board or null if no solution)
 */
export function solveSudoku(board: number[][]): number[][] | null {
  const solution = board.map((row) => [...row]);

  const solve = (): boolean => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (solution[row][col] === 0) {
          for (let num = 1; num <= 9; num++) {
            if (isValidMove(solution, row, col, num)) {
              solution[row][col] = num;

              if (solve()) {
                return true;
              }

              solution[row][col] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  };

  return solve() ? solution : null;
}
