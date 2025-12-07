import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Colors } from '../../styles/theme';

export interface CellState {
  value: number; // 0 for empty, 1-9 for numbers
  isGiven: boolean; // Pre-filled numbers from puzzle
  isSelected: boolean; // Currently selected cell
  isHighlighted: boolean; // Same row/column/box as selected
  isSameNumber: boolean; // Same number as selected cell
  hasConflict: boolean; // Invalid placement
  notes: number[]; // Pencil marks (1-9)
  isNotesMode: boolean; // Whether we're in notes input mode
}

interface CellProps {
  state: CellState;
  onPress: () => void;
  size?: number;
  hideRightBorder?: boolean;
  hideBottomBorder?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function Cell({ 
  state, 
  onPress, 
  size = 44,
  hideRightBorder = false,
  hideBottomBorder = false,
}: CellProps) {
  const scaleValue = useSharedValue(1);
  const opacityValue = useSharedValue(1);

  // Animation for press feedback
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scaleValue.value }],
      opacity: opacityValue.value,
    };
  });

  // Handle press with haptic feedback
  const handlePress = () => {
    // Haptic feedback for better UX
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    // Scale animation
    scaleValue.value = withSpring(0.95, { duration: 100 }, () => {
      scaleValue.value = withSpring(1, { duration: 100 });
    });

    onPress();
  };

  // Get background color based on state
  const getBackgroundColor = () => {
    if (state.hasConflict) return Colors.light.cellError;
    if (state.isSelected) return Colors.light.cellSelected;
    if (state.isSameNumber) return Colors.light.cellHighlight;
    if (state.isHighlighted) return Colors.light.cellHighlight;
    return Colors.light.cellDefault;
  };

  // Get text color based on state
  const getTextColor = () => {
    if (state.hasConflict) return Colors.light.error;
    if (state.isGiven) return Colors.light.text;
    return Colors.light.primary;
  };

  // Render main number
  const renderNumber = () => {
    if (state.value === 0) return null;

    return (
      <Text
        style={[
          styles.number,
          {
            color: getTextColor(),
            fontWeight: '300', // Same light weight as NumberPad for all numbers
            fontSize: size * 0.95, // Match NumberPad font size
          },
        ]}
      >
        {state.value}
      </Text>
    );
  };

  // Render notes (pencil marks)
  const renderNotes = () => {
    if (state.value !== 0 || state.notes.length === 0) return null;

    return (
      <View style={styles.notesContainer}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <Text
            key={num}
            style={[
              styles.note,
              {
                fontSize: size * 0.15, // Small font for notes
                opacity: state.notes.includes(num) ? 1 : 0,
                color: Colors.light.textSecondary,
              },
            ]}
          >
            {num}
          </Text>
        ))}
      </View>
    );
  };

  return (
    <AnimatedPressable
      style={[
        styles.cell,
        {
          width: size,
          height: size,
          backgroundColor: getBackgroundColor(),
          borderRightWidth: hideRightBorder ? 0 : 1,
          borderBottomWidth: hideBottomBorder ? 0 : 1,
        },
        animatedStyle,
      ]}
      onPress={handlePress}
      android_ripple={{
        color: Colors.light.primary + '20',
        radius: size / 2,
      }}
    >
      {renderNumber()}
      {renderNotes()}
      
      {/* Selection indicator */}
      {state.isSelected && (
        <View
          style={[
            styles.selectionBorder,
            {
              borderColor: Colors.light.primary,
            },
          ]}
        />
      )}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  cell: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#D0D0D0',
    position: 'relative',
  },
  number: {
    textAlign: 'center',
    includeFontPadding: false,
    lineHeight: undefined, // Reset line height for proper centering
  },
  notesContainer: {
    position: 'absolute',
    top: 2,
    left: 2,
    right: 2,
    bottom: 2,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignContent: 'space-between',
  },
  note: {
    width: '33.33%',
    textAlign: 'center',
    includeFontPadding: false,
    lineHeight: 12,
  },
  selectionBorder: {
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderWidth: 2,
    borderRadius: 2,
  },
});