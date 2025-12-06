import React from 'react';
import { View, StyleSheet } from 'react-native';
import Grid from '@/src/components/GameBoard/Grid';
import NumberPad from '@/src/components/GameBoard/NumberPad';

type GameBoardProps = {
  puzzle: number[][];
  selectedCell: { row: number; col: number } | null;
  onCellPress: (row: number, col: number) => void;
  onNumberPress: (number: number) => void;
};

export default function GameBoard({ 
  puzzle, 
  selectedCell, 
  onCellPress, 
  onNumberPress 
}: GameBoardProps) {
  // Empty solution for now
  const solution = puzzle;
  const notes: number[][][] = Array(9).fill(null).map(() => 
    Array(9).fill(null).map(() => [])
  );
  const isNotesMode = false;

  return (
    <View style={styles.container}>
      <View style={styles.gridWrapper}>
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
  gridWrapper: {
    backgroundColor: '#ffffff',
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