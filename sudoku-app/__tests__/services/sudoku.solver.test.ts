import { solveSudoku, isBoardComplete } from '@services/gameEngine/sudokuGenerator';

describe('solveSudoku', () => {
  let puzzle: number[][];

  beforeEach(() => {
    puzzle = [
      [5, 3, 0, 0, 7, 0, 0, 0, 0],
      [6, 0, 0, 1, 9, 5, 0, 0, 0],
      [0, 9, 8, 0, 0, 0, 0, 6, 0],
      [8, 0, 0, 0, 6, 0, 0, 0, 3],
      [4, 0, 0, 8, 0, 3, 0, 0, 1],
      [7, 0, 0, 0, 2, 0, 0, 0, 6],
      [0, 6, 0, 0, 0, 0, 2, 8, 0],
      [0, 0, 0, 4, 1, 9, 0, 0, 5],
      [0, 0, 0, 0, 8, 0, 0, 7, 9],
    ];
  });

  it('should solve a valid puzzle', () => {
    const solution = solveSudoku(puzzle);
    expect(solution).not.toBeNull();
  });

  it('should return complete board', () => {
    const solution = solveSudoku(puzzle);
    if (solution) {
      expect(isBoardComplete(solution)).toBe(true);
    }
  });

  it('should not modify original puzzle', () => {
    const originalPuzzle = puzzle.map((row) => [...row]);
    solveSudoku(puzzle);
    expect(puzzle).toEqual(originalPuzzle);
  });

  it('should maintain original clues in solution', () => {
    const solution = solveSudoku(puzzle);
    if (solution) {
      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
          if (puzzle[i][j] !== 0) {
            expect(solution[i][j]).toBe(puzzle[i][j]);
          }
        }
      }
    }
  });
});
