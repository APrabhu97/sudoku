import React from 'react';
import { View, StyleSheet, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Grid from '../src/components/GameBoard/Grid';
import NumberPad from '../src/components/GameBoard/NumberPad';

type GameBoardProps = {
  puzzle: number[][];
  selectedCell: { row: number; col: number } | null;
  onCellPress: (row: number, col: number) => void;
  onNumberPress: (number: number) => void;
  difficulty?: string;
  time?: number;
  isPaused?: boolean;
  onPauseToggle?: () => void;
};

export default function GameBoard({ 
  puzzle, 
  selectedCell, 
  onCellPress, 
  onNumberPress,
  difficulty = 'easy',
  time = 0,
  isPaused = false,
  onPauseToggle = () => {},
}: GameBoardProps) {
  // Empty solution for now
  const solution = puzzle;
  const notes: number[][][] = Array(9).fill(null).map(() => 
    Array(9).fill(null).map(() => [])
  );
  const isNotesMode = false;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const capitalizedDifficulty = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);

  return (
    <View style={styles.container}>
      <View style={styles.gridWrapper}>
        <View style={styles.gridHeader}>
          <Text style={styles.difficultyText}>{capitalizedDifficulty}</Text>
          <View style={styles.spacer} />
          <View style={styles.timerContainer}>
            <Text style={styles.timer}>{formatTime(time)}</Text>
            <Pressable onPress={onPauseToggle} style={styles.pauseButton}>
              <Ionicons 
                name={isPaused ? "play" : "pause"} 
                size={20} 
                color="#666666" 
              />
            </Pressable>
          </View>
        </View>
        
        <Grid 
          puzzle={puzzle}
          solution={solution}
          selectedCell={selectedCell}
          notes={notes}
          isNotesMode={isNotesMode}
          onCellPress={onCellPress}
        />
      </View>
      
      <View style={styles.numberPadContainer}>
        <NumberPad 
          onNumberPress={onNumberPress}
          onErasePress={() => onNumberPress(0)}
          onNotesToggle={() => {}}
          isNotesMode={false}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
  },
  gridHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  difficultyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  spacer: {
    flex: 1,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  timer: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666666',
  },
  pauseButton: {
    padding: 4,
  },
  gridWrapper: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
  },
  numberPadContainer: {
    marginTop: 20,
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
  },
});

