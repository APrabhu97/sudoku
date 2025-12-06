import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

type GameControlsProps = {
  onNewGame: () => void;
  onHint: () => void;
  onPause: () => void;
};

export default function GameControls({ onNewGame, onHint, onPause }: GameControlsProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.secondaryButton} onPress={onNewGame}>
        <Text style={styles.secondaryButtonText}>New</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.primaryButton} onPress={onHint}>
        <Text style={styles.primaryButtonText}>Hint</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.secondaryButton} onPress={onPause}>
        <Text style={styles.secondaryButtonText}>Pause</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  primaryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
  secondaryButton: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#333333',
    fontSize: 16,
    fontWeight: '500',
  },
});