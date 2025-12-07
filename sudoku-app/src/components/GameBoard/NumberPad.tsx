import React from 'react';
import { View, Text, Pressable, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, Typography } from '../../styles/theme';
import { Ionicons } from '@expo/vector-icons';

interface NumberPadProps {
  onNumberPress: (number: number) => void;
  onErasePress: () => void;
  onNotesToggle: () => void;
  isNotesMode: boolean;
  remainingNumbers?: number[]; // Numbers left to place (for hints)
}

const { width: screenWidth } = Dimensions.get('window');
const padPadding = Spacing.md * 2; // Container padding
// Calculate button size based on available space (minus gaps between 9 buttons)
const numberButtonSize = (screenWidth - padPadding * 2) / 8; // Much larger buttons
const actionButtonSize = numberButtonSize * 0.9; // Action buttons similar size

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface NumberButtonProps {
  number: number;
  onPress: () => void;
  remaining?: number;
  size: number;
}

function NumberButton({ number, onPress, remaining, size }: NumberButtonProps) {
  const scaleValue = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scaleValue.value }],
    };
  });

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    scaleValue.value = withSpring(0.9, { duration: 100 }, () => {
      scaleValue.value = withSpring(1, { duration: 100 });
    });

    onPress();
  };

  const isDisabled = remaining !== undefined && remaining === 0;

  return (
    <AnimatedPressable
      style={[
        styles.numberButton,
        {
          width: size,
          height: size, // Full square buttons
          backgroundColor: '#FFFFFF',
          opacity: isDisabled ? 0.3 : 1,
        },
        animatedStyle,
      ]}
      onPress={handlePress}
      disabled={isDisabled}
      android_ripple={{
        color: '#E0E0E0',
        radius: size / 2,
      }}
    >
      <Text
        style={[
          styles.numberText,
          {
            color: isDisabled ? Colors.light.textTertiary : '#007AFF',
            fontSize: size * 0.95, // Larger font size
            fontWeight: '300', // Lighter weight for cleaner look
          },
        ]}
      >
        {number}
      </Text>
      
      {remaining !== undefined && remaining > 0 && (
        <View style={styles.remainingBadge}>
          <Text style={styles.remainingText}>{remaining}</Text>
        </View>
      )}
    </AnimatedPressable>
  );
}

interface ActionButtonProps {
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  size: number;
  active?: boolean;
  label?: string;
}

function ActionButton({ icon, onPress, size, active, label }: ActionButtonProps) {
  const scaleValue = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scaleValue.value }],
    };
  });

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    scaleValue.value = withSpring(0.9, { duration: 100 }, () => {
      scaleValue.value = withSpring(1, { duration: 100 });
    });

    onPress();
  };

  return (
    <AnimatedPressable
      style={[
        styles.actionButton,
        {
          width: size,
          height: size, // Full square buttons
          backgroundColor: active ? '#007AFF' : 'transparent',
        },
        animatedStyle,
      ]}
      onPress={handlePress}
      android_ripple={{
        color: '#E0E0E0',
        radius: size / 2,
      }}
    >
      <Ionicons
        name={icon}
        size={size * 0.35} // Slightly larger icons
        color={active ? '#FFFFFF' : '#666666'}
      />
      {label && (
        <Text
          style={[
            styles.actionLabel,
            {
              color: active ? '#FFFFFF' : '#666666',
              fontSize: size * 0.18,
            },
          ]}
        >
          {label}
        </Text>
      )}
    </AnimatedPressable>
  );
}

export default function NumberPad({
  onNumberPress,
  onErasePress,
  onNotesToggle,
  isNotesMode,
  remainingNumbers,
}: NumberPadProps) {
  return (
    <View style={styles.container}>
      {/* Action buttons row */}
      <View style={styles.actionRow}>
        <ActionButton
          icon="arrow-undo-outline"
          onPress={() => {}}
          size={actionButtonSize}
          label="Undo"
        />
        <ActionButton
          icon="backspace-outline"
          onPress={onErasePress}
          size={actionButtonSize}
          label="Erase"
        />
        <ActionButton
          icon={isNotesMode ? "pencil" : "pencil-outline"}
          onPress={onNotesToggle}
          size={actionButtonSize}
          active={isNotesMode}
          label="Notes"
        />
      </View>

      {/* Single row: Numbers 1-9 */}
      <View style={styles.numberRow}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <NumberButton
            key={num}
            number={num}
            onPress={() => onNumberPress(num)}
            remaining={remainingNumbers?.[num - 1]}
            size={numberButtonSize}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    backgroundColor: 'transparent',
    width: '100%',
    alignItems: 'center',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    width: '100%',
    gap: 4,
  },
  numberRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    gap: 0,
  },
  numberButton: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    position: 'relative',
  },
  numberText: {
    includeFontPadding: false,
    textAlign: 'center',
  },
  remainingBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: Colors.light.error,
    borderRadius: 6,
    minWidth: 12,
    height: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  remainingText: {
    color: Colors.light.background,
    fontSize: 8,
    fontWeight: '600',
    includeFontPadding: false,
  },
  actionButton: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  actionLabel: {
    marginTop: 4,
    fontWeight: '500',
    includeFontPadding: false,
  },
});