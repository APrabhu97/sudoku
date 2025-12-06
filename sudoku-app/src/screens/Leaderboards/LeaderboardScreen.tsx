import React from 'react';
import { View, Text } from 'react-native';
import { Colors } from '../../styles/theme';

export default function LeaderboardScreen() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.light.background,
      }}
    >
      <Text style={{ fontSize: 20 }}>Leaderboard Screen</Text>
    </View>
  );
}
