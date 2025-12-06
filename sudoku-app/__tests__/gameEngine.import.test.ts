import { generateSudokuPuzzle } from '@services/gameEngine/sudokuGenerator';

describe('Game Engine Import', () => {
  it('should import generateSudokuPuzzle', () => {
    expect(generateSudokuPuzzle).toBeDefined();
  });

  it('should generate a puzzle', () => {
    const puzzle = generateSudokuPuzzle('easy');
    expect(puzzle).toHaveLength(9);
    expect(puzzle[0]).toHaveLength(9);
  });
});
