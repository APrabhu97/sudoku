import React from 'react';
import { View, Text } from 'react-native';
import { Colors } from '../../styles/theme';

export default function GameScreen() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.light.background,
      }}
    >
      <Text style={{ fontSize: 20 }}>Game Screen</Text>
    </View>
  );
}
