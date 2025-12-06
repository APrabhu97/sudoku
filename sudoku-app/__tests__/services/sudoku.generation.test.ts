import { generateSudokuPuzzle } from '@services/gameEngine/sudokuGenerator';

describe('generateSudokuPuzzle', () => {
  it('should generate a valid puzzle for easy difficulty', () => {
    const puzzle = generateSudokuPuzzle('easy');
    expect(puzzle).toHaveLength(9);
    expect(puzzle[0]).toHaveLength(9);
  });

  it('should generate a puzzle with correct clues for easy', () => {
    const puzzle = generateSudokuPuzzle('easy');
    const clues = puzzle.flat().filter((cell) => cell !== 0).length;
    expect(clues).toBe(40);
  });

  it('should generate different puzzles on multiple calls', () => {
    const puzzle1 = generateSudokuPuzzle('easy');
    const puzzle2 = generateSudokuPuzzle('easy');
    expect(JSON.stringify(puzzle1)).not.toBe(JSON.stringify(puzzle2));
  });
});
