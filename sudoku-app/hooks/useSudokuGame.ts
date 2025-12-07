import { useState, useCallback } from 'react';
import type { Difficulty } from '../src/types/game';
import { generateNewPuzzle, resetPuzzle, isPuzzleSolved } from '../src/services/gameEngine/gamePuzzleService';

type SelectedCell = { row: number; col: number } | null;

interface GameState {
  puzzle: number[][];
  solution: number[][];
  initialPuzzle: number[][];
  difficulty: Difficulty;
}

export function useSudokuGame(initialDifficulty: Difficulty = 'easy') {
  const [gameState, setGameState] = useState<GameState>(() => {
    const puzzle = generateNewPuzzle(initialDifficulty);
    return {
      puzzle: puzzle.puzzle,
      solution: puzzle.solution,
      initialPuzzle: puzzle.initialPuzzle,
      difficulty: puzzle.difficulty,
    };
  });

  const [selectedCell, setSelectedCell] = useState<SelectedCell>(null);

  const handleCellPress = (row: number, col: number) => {
    setSelectedCell({ row, col });
  };

  const handleNumberPress = (number: number) => {
    if (selectedCell) {
      const newPuzzle = gameState.puzzle.map(row => [...row]);
      newPuzzle[selectedCell.row][selectedCell.col] = number;
      setGameState(prev => ({
        ...prev,
        puzzle: newPuzzle,
      }));
    }
  };

  const handleNewGame = useCallback((difficulty: Difficulty = gameState.difficulty) => {
    const puzzle = generateNewPuzzle(difficulty);
    setGameState({
      puzzle: puzzle.puzzle,
      solution: puzzle.solution,
      initialPuzzle: puzzle.initialPuzzle,
      difficulty: puzzle.difficulty,
    });
    setSelectedCell(null);
  }, [gameState.difficulty]);

  const handleReset = useCallback(() => {
    const puzzle = generateNewPuzzle(gameState.difficulty);
    setGameState({
      puzzle: puzzle.puzzle,
      solution: puzzle.solution,
      initialPuzzle: puzzle.initialPuzzle,
      difficulty: puzzle.difficulty,
    });
    setSelectedCell(null);
  }, [gameState.difficulty]);

  const handleClearCell = useCallback(() => {
    if (selectedCell) {
      const newPuzzle = gameState.puzzle.map(row => [...row]);
      const initialValue = gameState.initialPuzzle[selectedCell.row][selectedCell.col];
      // Only clear if it was empty initially (user-entered)
      if (initialValue === 0) {
        newPuzzle[selectedCell.row][selectedCell.col] = 0;
        setGameState(prev => ({
          ...prev,
          puzzle: newPuzzle,
        }));
      }
    }
  }, [selectedCell, gameState.puzzle, gameState.initialPuzzle]);

  const isGameComplete = isPuzzleSolved(gameState.puzzle, gameState.solution);

  return {
    puzzle: gameState.puzzle,
    solution: gameState.solution,
    initialPuzzle: gameState.initialPuzzle,
    difficulty: gameState.difficulty,
    selectedCell,
    isGameComplete,
    handleCellPress,
    handleNumberPress,
    handleNewGame,
    handleReset,
    handleClearCell,
  };
}