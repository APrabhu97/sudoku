import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Colors, Spacing } from '../../styles/theme';
import Cell, { CellState } from './Cell';

interface GridProps {
  puzzle: number[][]; // 9x9 array of numbers (0 for empty)
  solution: number[][]; // 9x9 array of solution
  selectedCell: { row: number; col: number } | null;
  notes: number[][][]; // 9x9x9 array for notes
  isNotesMode: boolean;
  onCellPress: (row: number, col: number) => void;
}

const { width: screenWidth } = Dimensions.get('window');
const gridPadding = Spacing.md * 2;
const gridSize = screenWidth - gridPadding;
// Calculate cell size: subtract the 4px for outer border (2px each side)
// and 4px for the two 3x3 box dividers (2px each)
const cellSize = (gridSize - 4 - 4) / 9;

export default function Grid({
  puzzle,
  solution,
  selectedCell,
  notes,
  isNotesMode,
  onCellPress,
}: GridProps) {
  
  // Check if a number placement would be valid
  const isValidPlacement = (row: number, col: number, num: number): boolean => {
    if (num === 0) return true; // Empty cell is always valid
    
    // Check row
    for (let c = 0; c < 9; c++) {
      if (c !== col && puzzle[row][c] === num) return false;
    }
    
    // Check column
    for (let r = 0; r < 9; r++) {
      if (r !== row && puzzle[r][col] === num) return false;
    }
    
    // Check 3x3 box
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    for (let r = boxRow; r < boxRow + 3; r++) {
      for (let c = boxCol; c < boxCol + 3; c++) {
        if ((r !== row || c !== col) && puzzle[r][c] === num) return false;
      }
    }
    
    return true;
  };

  // Get cell state for rendering
  const getCellState = (row: number, col: number): CellState => {
    const isSelected = selectedCell?.row === row && selectedCell?.col === col;
    const value = puzzle[row][col];
    
    // Check if cell is in same row, column, or box as selected cell
    let isHighlighted = false;
    if (selectedCell && !isSelected) {
      const sameRow = selectedCell.row === row;
      const sameCol = selectedCell.col === col;
      const sameBox = 
        Math.floor(selectedCell.row / 3) === Math.floor(row / 3) &&
        Math.floor(selectedCell.col / 3) === Math.floor(col / 3);
      isHighlighted = sameRow || sameCol || sameBox;
    }

    // Check if cell has same number as selected cell
    const isSameNumber = !!(selectedCell && value !== 0 && 
      value === puzzle[selectedCell.row][selectedCell.col]);

    // Check for conflicts (invalid placement)
    const hasConflict = value !== 0 && !isValidPlacement(row, col, value);

    return {
      value,
      isGiven: value !== 0 && solution[row][col] === value, // Assuming given cells match solution
      isSelected,
      isHighlighted,
      isSameNumber,
      hasConflict,
      notes: notes[row][col] || [],
      isNotesMode,
    };
  };

  // Render thick borders for 3x3 boxes and hide cell borders on edges
  const getBoxBorderStyle = (row: number, col: number) => {
    const borderStyle: any = {};
    
    // Top border for first row of each 3x3 box
    if (row % 3 === 0 && row !== 0) {
      borderStyle.borderTopWidth = 2;
      borderStyle.borderTopColor = '#333333';
    }
    
    // Left border for first column of each 3x3 box
    if (col % 3 === 0 && col !== 0) {
      borderStyle.borderLeftWidth = 2;
      borderStyle.borderLeftColor = '#333333';
    }
    
    return borderStyle;
  };

  // Check if cell is on the edge of the grid
  const isOnRightEdge = (col: number) => col === 8;
  const isOnBottomEdge = (row: number) => row === 8;

  return (
    <View style={styles.container}>
      <View style={[styles.grid, { width: gridSize, height: gridSize }]}>
        {puzzle.map((row, rowIndex) =>
          row.map((_, colIndex) => (
            <View
              key={`${rowIndex}-${colIndex}`}
              style={[
                styles.cellContainer,
                getBoxBorderStyle(rowIndex, colIndex),
              ]}
            >
              <Cell
                state={getCellState(rowIndex, colIndex)}
                onPress={() => onCellPress(rowIndex, colIndex)}
                size={cellSize}
                hideRightBorder={isOnRightEdge(colIndex)}
                hideBottomBorder={isOnBottomEdge(rowIndex)}
              />
            </View>
          ))
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#333333',
  },
  cellContainer: {
    width: cellSize,
    height: cellSize,
  },
});