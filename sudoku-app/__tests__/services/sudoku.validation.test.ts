import { isValidMove, isBoardComplete } from '@services/gameEngine/sudokuGenerator';

describe('Sudoku Move Validation', () => {
  describe('isValidMove', () => {
    it('should allow valid moves on empty board', () => {
      const board = Array(9)
        .fill(null)
        .map(() => Array(9).fill(0));

      expect(isValidMove(board, 0, 0, 5)).toBe(true);
      expect(isValidMove(board, 4, 4, 1)).toBe(true);
      expect(isValidMove(board, 8, 8, 9)).toBe(true);
    });

    it('should reject duplicate in row', () => {
      const board = Array(9)
        .fill(null)
        .map(() => Array(9).fill(0));
      board[0][0] = 5;

      expect(isValidMove(board, 0, 1, 5)).toBe(false);
      expect(isValidMove(board, 0, 8, 5)).toBe(false);
    });

    it('should reject duplicate in column', () => {
      const board = Array(9)
        .fill(null)
        .map(() => Array(9).fill(0));
      board[0][0] = 5;

      expect(isValidMove(board, 1, 0, 5)).toBe(false);
      expect(isValidMove(board, 8, 0, 5)).toBe(false);
    });

    it('should reject duplicate in 3x3 box', () => {
      const board = Array(9)
        .fill(null)
        .map(() => Array(9).fill(0));
      board[0][0] = 5;

      expect(isValidMove(board, 1, 1, 5)).toBe(false);
      expect(isValidMove(board, 2, 2, 5)).toBe(false);
    });

    it('should allow moves in different boxes', () => {
      const board = Array(9)
        .fill(null)
        .map(() => Array(9).fill(0));
      board[0][0] = 5;

      expect(isValidMove(board, 3, 3, 5)).toBe(true);
      expect(isValidMove(board, 6, 6, 5)).toBe(true);
    });
  });

  describe('isBoardComplete', () => {
    it('should return false for empty board', () => {
      const board = Array(9)
        .fill(null)
        .map(() => Array(9).fill(0));

      expect(isBoardComplete(board)).toBe(false);
    });

    it('should return true for fully filled board', () => {
      const board = Array(9)
        .fill(null)
        .map(() => Array(9).fill(5));

      expect(isBoardComplete(board)).toBe(true);
    });

    it('should return false for partially filled board', () => {
      const board = Array(9)
        .fill(null)
        .map(() => Array(9).fill(0));
      board[0][0] = 5;

      expect(isBoardComplete(board)).toBe(false);
    });

    it('should detect single empty cell', () => {
      const board = Array(9)
        .fill(null)
        .map(() => Array(9).fill(1));
      board[5][5] = 0;

      expect(isBoardComplete(board)).toBe(false);
    });
  });
});
