import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import GameBoard from './GameBoard';
import { useSudokuGame } from '../hooks/useSudokuGame';

export default function SudokuGame() {
  const {
    puzzle,
    selectedCell,
    handleCellPress,
    handleNumberPress,
    handleNewGame,
    handleHint,
    handlePause
  } = useSudokuGame();

  const [time, setTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        setTime(t => t + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isPaused]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
    handlePause();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Game Board with Header */}
        <View style={styles.gridWrapper}>
          {/* Grid Header */}
          <View style={styles.gridHeader}>
            <Text style={styles.difficulty}>Easy</Text>
            <View style={styles.timerContainer}>
              <Text style={styles.timer}>{formatTime(time)}</Text>
              <Pressable onPress={togglePause} style={styles.pauseButton}>
                <Ionicons 
                  name={isPaused ? "play" : "pause"} 
                  size={20} 
                  color="#666666" 
                />
              </Pressable>
            </View>
          </View>

          <GameBoard 
            puzzle={puzzle}
            selectedCell={selectedCell}
            onCellPress={handleCellPress}
            onNumberPress={handleNumberPress}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    justifyContent: 'center',
    paddingVertical: 20,
  },
  gridWrapper: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
  },
  gridHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  difficulty: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
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
});