import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { Colors } from '../../styles/theme';
import { initializePuzzleCache } from '../../services/gameEngine/puzzleCache';

export default function SplashScreen() {
  useEffect(() => {
    // Initialize puzzle cache on app startup for instant puzzle delivery
    initializePuzzleCache().catch((error) => {
      console.error('Failed to initialize puzzle cache:', error);
    });
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.light.background,
      }}
    >
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
        Sudoku
      </Text>
      <ActivityIndicator size="large" color={Colors.light.primary} />
      <Text style={{ fontSize: 12, marginTop: 10, color: Colors.light.textSecondary }}>
        Preparing puzzles...
      </Text>
    </View>
  );
}
