import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing } from '../../styles/theme';
import { Ionicons } from '@expo/vector-icons';

interface GameControlsProps {
  onHint: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onPause: () => void;
  onSettings: () => void;
  canUndo: boolean;
  canRedo: boolean;
  hintsRemaining: number;
  isPaused: boolean;
  gameTime: string; // Formatted time string like "05:23"
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface ControlButtonProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  disabled?: boolean;
  badge?: string | number;
  primary?: boolean;
}

function ControlButton({ 
  icon, 
  label, 
  onPress, 
  disabled = false, 
  badge,
  primary = false 
}: ControlButtonProps) {
  const scaleValue = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scaleValue.value }],
    };
  });

  const handlePress = () => {
    if (disabled) return;
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    scaleValue.value = withSpring(0.95, { duration: 100 }, () => {
      scaleValue.value = withSpring(1, { duration: 100 });
    });

    onPress();
  };

  return (
    <AnimatedPressable
      style={[
        styles.controlButton,
        {
          opacity: disabled ? 0.3 : 1,
          backgroundColor: primary ? Colors.light.primary : Colors.light.background,
        },
        animatedStyle,
      ]}
      onPress={handlePress}
      disabled={disabled}
      android_ripple={{
        color: primary ? Colors.light.background + '20' : Colors.light.primary + '20',
        radius: 25,
      }}
    >
      <View style={styles.buttonContent}>
        <Ionicons
          name={icon}
          size={20}
          color={primary ? Colors.light.background : (disabled ? Colors.light.textTertiary : Colors.light.text)}
        />
        <Text
          style={[
            styles.buttonLabel,
            {
              color: primary ? Colors.light.background : (disabled ? Colors.light.textTertiary : Colors.light.textSecondary),
            },
          ]}
        >
          {label}
        </Text>
        
        {badge !== undefined && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        )}
      </View>
    </AnimatedPressable>
  );
}

export default function GameControls({
  onHint,
  onUndo,
  onRedo,
  onPause,
  onSettings,
  canUndo,
  canRedo,
  hintsRemaining,
  isPaused,
  gameTime,
}: GameControlsProps) {
  return (
    <View style={styles.container}>
      {/* Timer and Pause */}
      <View style={styles.topRow}>
        <View style={styles.timerContainer}>
          <Ionicons name="time-outline" size={18} color={Colors.light.textSecondary} />
          <Text style={styles.timerText}>{gameTime}</Text>
        </View>
        
        <ControlButton
          icon={isPaused ? "play" : "pause"}
          label={isPaused ? "Resume" : "Pause"}
          onPress={onPause}
          primary={isPaused}
        />
        
        <ControlButton
          icon="settings-outline"
          label="Settings"
          onPress={onSettings}
        />
      </View>

      {/* Action buttons */}
      <View style={styles.bottomRow}>
        <ControlButton
          icon="arrow-back-outline"
          label="Undo"
          onPress={onUndo}
          disabled={!canUndo}
        />
        
        <ControlButton
          icon="arrow-forward-outline"
          label="Redo"
          onPress={onRedo}
          disabled={!canRedo}
        />
        
        <ControlButton
          icon="bulb-outline"
          label="Hint"
          onPress={onHint}
          disabled={hintsRemaining === 0}
          badge={hintsRemaining > 0 ? hintsRemaining : undefined}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.light.surface,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.background,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  timerText: {
    marginLeft: Spacing.xs,
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
    fontVariant: ['tabular-nums'],
  },
  controlButton: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.light.border,
    minWidth: 60,
    position: 'relative',
    shadowColor: Colors.light.text,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  buttonContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
    includeFontPadding: false,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: Colors.light.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.light.background,
  },
  badgeText: {
    color: Colors.light.background,
    fontSize: 12,
    fontWeight: '600',
    includeFontPadding: false,
  },
});