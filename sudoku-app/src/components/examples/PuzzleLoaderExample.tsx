import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { usePuzzleCache } from '../../hooks/usePuzzleCache';
import type { Difficulty } from '../../types/game';
import { Colors } from '../../styles/theme';

/**
 * Example component demonstrating puzzle cache integration
 * This shows how to use cached puzzles in a real game scenario
 */
export default function PuzzleLoaderExample() {
  const { getPuzzle, loading, error } = usePuzzleCache();
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null);
  const [currentPuzzle, setCurrentPuzzle] = useState<number[][] | null>(null);

  const handleStartGame = async (difficulty: Difficulty) => {
    setSelectedDifficulty(difficulty);
    
    // Get puzzle from cache - this will be instant!
    const puzzle = await getPuzzle(difficulty);
    
    if (puzzle) {
      setCurrentPuzzle(puzzle);
      // Here you would typically:
      // 1. Navigate to game screen
      // 2. Update game store with the puzzle
      // 3. Start timer, etc.
      console.log('Puzzle loaded instantly from cache!');
    }
  };

  const difficulties: Difficulty[] = ['easy', 'medium', 'hard', 'expert'];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Difficulty</Text>
      <Text style={styles.subtitle}>Puzzles load instantly from cache</Text>

      <View style={styles.buttonContainer}>
        {difficulties.map((difficulty) => (
          <TouchableOpacity
            key={difficulty}
            style={[
              styles.button,
              selectedDifficulty === difficulty && styles.buttonSelected,
            ]}
            onPress={() => handleStartGame(difficulty)}
            disabled={loading}
          >
            <Text
              style={[
                styles.buttonText,
                selectedDifficulty === difficulty && styles.buttonTextSelected,
              ]}
            >
              {difficulty.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={Colors.light.primary} />
          <Text style={styles.loadingText}>Loading puzzle...</Text>
        </View>
      )}

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error: {error.message}</Text>
        </View>
      )}

      {currentPuzzle && !loading && (
        <View style={styles.successContainer}>
          <Text style={styles.successText}>✓ Puzzle loaded!</Text>
          <Text style={styles.successSubtext}>
            Clues: {currentPuzzle.flat().filter((c) => c !== 0).length}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: Colors.light.background,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: Colors.light.text,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 32,
    color: Colors.light.textSecondary,
  },
  buttonContainer: {
    gap: 12,
  },
  button: {
    backgroundColor: Colors.light.surface,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  buttonSelected: {
    borderColor: Colors.light.primary,
    backgroundColor: Colors.light.primary + '10',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
  },
  buttonTextSelected: {
    color: Colors.light.primary,
  },
  loadingContainer: {
    marginTop: 24,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  loadingText: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  errorContainer: {
    marginTop: 24,
    padding: 12,
    backgroundColor: '#fee',
    borderRadius: 8,
  },
  errorText: {
    color: '#c00',
    textAlign: 'center',
  },
  successContainer: {
    marginTop: 24,
    padding: 16,
    backgroundColor: Colors.light.primary + '10',
    borderRadius: 8,
    alignItems: 'center',
  },
  successText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.primary,
    marginBottom: 4,
  },
  successSubtext: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
});
