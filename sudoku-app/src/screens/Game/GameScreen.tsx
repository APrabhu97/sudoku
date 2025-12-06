import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Alert, SafeAreaView } from 'react-native';
import { useGameStore } from '../../store/gameStore';
import { Colors } from '../../styles/theme';
import Grid from '../../components/GameBoard/Grid';
import NumberPad from '../../components/GameBoard/NumberPad';
import GameControls from '../../components/GameBoard/GameControls';

export default function GameScreen() {
  const { 
    currentGame, 
    setCurrentGame,
    updateBoard,
    updateTime,
    useHint,
  } = useGameStore();

  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [isNotesMode, setIsNotesMode] = useState(false);
  const [notes, setNotes] = useState<number[][][]>(() => 
    Array(9).fill(null).map(() => Array(9).fill(null).map(() => []))
  );

  useEffect(() => {
    if (!currentGame) {
      // TODO: Create new game - for now using placeholder
      const mockGame: any = {
        id: '1',
        userId: 'test',
        mode: 'classic',
        difficulty: 'medium',
        board: {
          initialBoard: Array(9).fill(null).map(() => Array(9).fill(0)),
          currentBoard: Array(9).fill(null).map(() => Array(9).fill(0)),
          solvedBoard: Array(9).fill(null).map(() => Array(9).fill(0)),
        },
        startTime: Date.now(),
        completionTime: null,
        status: 'playing',
        hintsUsed: 0,
        totalHints: 3,
        hasTimer: true,
        hasMistakeHighlight: true,
        hasHints: true,
        elapsedTime: 0,
      };
      setCurrentGame(mockGame);
    }
  }, [currentGame, setCurrentGame]);

  // Format time display
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle cell selection
  const handleCellPress = useCallback((row: number, col: number) => {
    setSelectedCell({ row, col });
  }, []);

  // Handle number input
  const handleNumberPress = useCallback((number: number) => {
    if (!selectedCell || !currentGame) return;

    const { row, col } = selectedCell;
    
    if (isNotesMode) {
      // Toggle note
      const cellNotes = [...notes[row][col]];
      const noteIndex = cellNotes.indexOf(number);
      
      if (noteIndex >= 0) {
        cellNotes.splice(noteIndex, 1);
      } else {
        cellNotes.push(number);
        cellNotes.sort();
      }
      
      const newNotes = [...notes];
      newNotes[row][col] = cellNotes;
      setNotes(newNotes);
    } else {
      // Make move - update the current board
      const newBoard = currentGame.board.currentBoard.map(row => [...row]);
      newBoard[row][col] = number;
      updateBoard(newBoard);
      
      // Clear notes for this cell
      const newNotes = [...notes];
      newNotes[row][col] = [];
      setNotes(newNotes);
    }
  }, [selectedCell, currentGame, isNotesMode, notes, updateBoard]);

  // Handle erase
  const handleErasePress = useCallback(() => {
    if (!selectedCell || !currentGame) return;

    const { row, col } = selectedCell;
    
    if (isNotesMode) {
      // Clear all notes for this cell
      const newNotes = [...notes];
      newNotes[row][col] = [];
      setNotes(newNotes);
    } else {
      // Clear cell value
      const newBoard = currentGame.board.currentBoard.map(row => [...row]);
      newBoard[row][col] = 0;
      updateBoard(newBoard);
    }
  }, [selectedCell, currentGame, isNotesMode, notes, updateBoard]);

  // Handle hint
  const handleHint = useCallback(() => {
    if (!currentGame) return;
    
    try {
      useHint(); // Use the store's hint function
      Alert.alert('Hint', 'Hint functionality coming soon!');
    } catch (error) {
      Alert.alert('Hint Error', 'Unable to generate hint at this time.');
    }
  }, [currentGame, useHint]);

  // Handle pause
  const handlePause = useCallback(() => {
    // TODO: Implement pause functionality
    Alert.alert('Pause', 'Pause functionality coming soon!');
  }, []);

  // Handle settings
  const handleSettings = useCallback(() => {
    // TODO: Navigate to settings
    Alert.alert('Settings', 'Settings screen coming soon!');
  }, []);

  // Handle undo
  const handleUndo = useCallback(() => {
    Alert.alert('Undo', 'Undo functionality coming soon!');
  }, []);

  // Handle redo
  const handleRedo = useCallback(() => {
    Alert.alert('Redo', 'Redo functionality coming soon!');
  }, []);

  // Handle notes toggle
  const handleNotesToggle = useCallback(() => {
    setIsNotesMode(prev => !prev);
  }, []);

  if (!currentGame) {
    return (
      <View style={styles.loadingContainer}>
        {/* TODO: Add loading spinner */}
      </View>
    );
  }

  // Calculate remaining numbers for each digit
  const getRemainingNumbers = (): number[] => {
    const counts = new Array(9).fill(0);
    
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        const value = currentGame.board.currentBoard[row][col];
        if (value > 0) {
          counts[value - 1]++;
        }
      }
    }
    
    return counts.map(count => 9 - count);
  };

  return (
    <SafeAreaView style={styles.container}>
      <GameControls
        onHint={handleHint}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onPause={handlePause}
        onSettings={handleSettings}
        canUndo={false} // TODO: Implement move history
        canRedo={false} // TODO: Implement redo history
        hintsRemaining={currentGame.totalHints - currentGame.hintsUsed}
        isPaused={currentGame.status === 'paused'}
        gameTime={formatTime(currentGame.elapsedTime)}
      />

      <View style={styles.gameArea}>
        <Grid
          puzzle={currentGame.board.currentBoard}
          solution={currentGame.board.solvedBoard}
          selectedCell={selectedCell}
          notes={notes}
          isNotesMode={isNotesMode}
          onCellPress={handleCellPress}
        />
      </View>

      <NumberPad
        onNumberPress={handleNumberPress}
        onErasePress={handleErasePress}
        onNotesToggle={handleNotesToggle}
        isNotesMode={isNotesMode}
        remainingNumbers={getRemainingNumbers()}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.light.background,
  },
  gameArea: {
    flex: 1,
    justifyContent: 'center',
  },
});
