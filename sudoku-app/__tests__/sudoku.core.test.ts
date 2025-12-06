import {
  generateSudokuPuzzle,
  isValidMove,
  isBoardComplete,
} from '@services/gameEngine/sudokuGenerator';

describe('Sudoku Game Engine - Core Tests', () => {
  describe('generateSudokuPuzzle', () => {
    it('should generate an easy puzzle with 9x9 grid', () => {
      const puzzle = generateSudokuPuzzle('easy');
      expect(puzzle).toHaveLength(9);
      expect(puzzle[0]).toHaveLength(9);
    });

    it('should generate a puzzle with valid cell values (0-9)', () => {
      const puzzle = generateSudokuPuzzle('easy');
      puzzle.forEach((row) => {
        row.forEach((cell) => {
          expect(cell).toBeGreaterThanOrEqual(0);
          expect(cell).toBeLessThanOrEqual(9);
        });
      });
    });

    it('should generate puzzles with correct clue counts', () => {
      // Only generate each puzzle once to avoid hanging
      const easyPuzzle = generateSudokuPuzzle('easy');
      const easyClues = easyPuzzle.flat().filter((c) => c !== 0).length;
      expect(easyClues).toBe(40);
    });
  });

  describe('isValidMove', () => {
    it('should allow valid moves on empty board', () => {
      const emptyBoard = Array(9)
        .fill(null)
        .map(() => Array(9).fill(0));

      expect(isValidMove(emptyBoard, 0, 0, 5)).toBe(true);
      expect(isValidMove(emptyBoard, 4, 4, 5)).toBe(true);
      expect(isValidMove(emptyBoard, 8, 8, 9)).toBe(true);
    });

    it('should reject duplicate in row', () => {
      const board = Array(9)
        .fill(null)
        .map(() => Array(9).fill(0));
      board[0][0] = 5;

      expect(isValidMove(board, 0, 1, 5)).toBe(false);
    });

    it('should reject duplicate in column', () => {
      const board = Array(9)
        .fill(null)
        .map(() => Array(9).fill(0));
      board[0][0] = 5;

      expect(isValidMove(board, 1, 0, 5)).toBe(false);
    });

    it('should reject duplicate in 3x3 box', () => {
      const board = Array(9)
        .fill(null)
        .map(() => Array(9).fill(0));
      board[0][0] = 5;

      expect(isValidMove(board, 1, 1, 5)).toBe(false);
      expect(isValidMove(board, 2, 2, 5)).toBe(false);
    });
  });

  describe('isBoardComplete', () => {
    it('should return false for empty board', () => {
      const emptyBoard = Array(9)
        .fill(null)
        .map(() => Array(9).fill(0));

      expect(isBoardComplete(emptyBoard)).toBe(false);
    });

    it('should return true for filled board with no zeros', () => {
      const filledBoard = Array(9)
        .fill(null)
        .map(() => Array(9).fill(1));

      expect(isBoardComplete(filledBoard)).toBe(true);
    });

    it('should return false for partially filled board', () => {
      const partialBoard = Array(9)
        .fill(null)
        .map(() => Array(9).fill(0));
      partialBoard[0][0] = 5;

      expect(isBoardComplete(partialBoard)).toBe(false);
    });
  });
});
