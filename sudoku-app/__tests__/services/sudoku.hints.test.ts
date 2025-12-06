import { generateHint } from '@services/gameEngine/sudokuGenerator';

describe('generateHint', () => {
  let currentBoard: number[][];
  let solvedBoard: number[][];

  beforeEach(() => {
    solvedBoard = [
      [5, 3, 4, 6, 7, 8, 9, 1, 2],
      [6, 7, 2, 1, 9, 5, 3, 4, 8],
      [1, 9, 8, 3, 4, 2, 5, 6, 7],
      [8, 5, 9, 7, 6, 1, 4, 2, 3],
      [4, 2, 6, 8, 5, 3, 7, 9, 1],
      [7, 1, 3, 9, 2, 4, 8, 5, 6],
      [9, 6, 1, 5, 3, 7, 2, 8, 4],
      [2, 8, 7, 4, 1, 9, 6, 3, 5],
      [3, 4, 5, 2, 8, 6, 1, 7, 9],
    ];

    currentBoard = solvedBoard.map((row) => [...row]);
    currentBoard[0][0] = 0;
    currentBoard[0][1] = 0;
    currentBoard[1][0] = 0;
  });

  it('should return a hint for empty cells', () => {
    const hint = generateHint(currentBoard, solvedBoard);
    expect(hint).not.toBeNull();
    expect(hint?.row).toBeGreaterThanOrEqual(0);
    expect(hint?.row).toBeLessThan(9);
    expect(hint?.col).toBeGreaterThanOrEqual(0);
    expect(hint?.col).toBeLessThan(9);
    expect(hint?.value).toBeGreaterThanOrEqual(1);
    expect(hint?.value).toBeLessThanOrEqual(9);
  });

  it('should return null when board is complete', () => {
    const fullBoard = solvedBoard.map((row) => [...row]);
    const hint = generateHint(fullBoard, solvedBoard);
    expect(hint).toBeNull();
  });

  it('should return correct value for hint', () => {
    const hint = generateHint(currentBoard, solvedBoard);
    if (hint) {
      expect(hint.value).toBe(solvedBoard[hint.row][hint.col]);
    }
  });
});
