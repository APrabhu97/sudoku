import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Difficulty } from '@/types/game';
import GameBoard from '@/components/GameBoard';
import { useSudokuGame } from '@/hooks/useSudokuGame';

const DIFFICULTIES: Difficulty[] = ['easy', 'medium', 'hard', 'expert'];

export default function SudokuGame() {
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('easy');
  const {
    puzzle,
    selectedCell,
    difficulty,
    isGameComplete,
    handleCellPress,
    handleNumberPress,
    handleNewGame,
  } = useSudokuGame(selectedDifficulty);

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
  };

  const handleDifficultyChange = (newDifficulty: Difficulty) => {
    setSelectedDifficulty(newDifficulty);
    setTime(0);
    setIsPaused(false);
    handleNewGame(newDifficulty);
  };

  const capitalizedDifficulty = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {/* Difficulty Selector */}
        <View style={styles.difficultySelector}>
          {DIFFICULTIES.map((diff) => (
            <Pressable
              key={diff}
              onPress={() => handleDifficultyChange(diff)}
              style={[
                styles.difficultyButton,
                selectedDifficulty === diff && styles.difficultyButtonActive,
              ]}
            >
              <Text
                style={[
                  styles.difficultyButtonText,
                  selectedDifficulty === diff && styles.difficultyButtonTextActive,
                ]}
              >
                {diff.charAt(0).toUpperCase() + diff.slice(1)}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Game Board with Header */}
        <View style={styles.gridWrapper}>
          {/* Grid Header */}
          <View style={styles.gridHeader}>
            <Text style={styles.difficultyText}>{capitalizedDifficulty}</Text>
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

        {/* Game Complete Message */}
        {isGameComplete && (
          <View style={styles.completionBanner}>
            <Ionicons name="checkmark-circle" size={24} color="#34C759" />
            <Text style={styles.completionText}>Puzzle Solved!</Text>
            <Text style={styles.completionTime}>Time: {formatTime(time)}</Text>
          </View>
        )}
      </ScrollView>
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
  },
  contentContainer: {
    paddingVertical: 20,
    gap: 16,
  },
  difficultySelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  difficultyButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  difficultyButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  difficultyButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666666',
  },
  difficultyButtonTextActive: {
    color: '#FFFFFF',
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
  difficultyText: {
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
  completionBanner: {
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  completionText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1B5E20',
    flex: 1,
  },
  completionTime: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2E7D32',
  },
});