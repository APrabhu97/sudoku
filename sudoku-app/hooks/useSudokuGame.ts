import { useState } from 'react';

const INITIAL_PUZZLE = [
  [5, 3, 0, 0, 7, 0, 0, 0, 0],
  [6, 0, 0, 1, 9, 5, 0, 0, 0],
  [0, 9, 8, 0, 0, 0, 0, 6, 0],
  [8, 0, 0, 0, 6, 0, 0, 0, 3],
  [4, 0, 0, 8, 0, 3, 0, 0, 1],
  [7, 0, 0, 0, 2, 0, 0, 0, 6],
  [0, 6, 0, 0, 0, 0, 2, 8, 0],
  [0, 0, 0, 4, 1, 9, 0, 0, 5],
  [0, 0, 0, 0, 8, 0, 0, 7, 9]
];

type SelectedCell = { row: number; col: number } | null;

export function useSudokuGame() {
  const [puzzle, setPuzzle] = useState(() => 
    INITIAL_PUZZLE.map(row => [...row])
  );
  const [selectedCell, setSelectedCell] = useState<SelectedCell>(null);

  const handleCellPress = (row: number, col: number) => {
    setSelectedCell({ row, col });
  };

  const handleNumberPress = (number: number) => {
    if (selectedCell) {
      const newPuzzle = [...puzzle];
      newPuzzle[selectedCell.row][selectedCell.col] = number;
      setPuzzle(newPuzzle);
    }
  };

  const handleNewGame = () => {
    setPuzzle(INITIAL_PUZZLE.map(row => [...row]));
    setSelectedCell(null);
  };

  const handleHint = () => {
    // TODO: Implement hint logic
    console.log('Hint requested');
  };

  const handlePause = () => {
    // TODO: Implement pause logic
    console.log('Game paused');
  };

  return {
    puzzle,
    selectedCell,
    handleCellPress,
    handleNumberPress,
    handleNewGame,
    handleHint,
    handlePause
  };
}