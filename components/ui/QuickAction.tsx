// Powered by OnSpace.AI
import React from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, BorderRadius, FontSizes, Shadows } from '@/constants/theme';

interface QuickActionProps {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  onPress: () => void;
  color?: string;
}

export default function QuickAction({ icon, label, onPress, color = Colors.accentBright }: QuickActionProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        pressed && { opacity: 0.72, transform: [{ scale: 0.93 }] },
      ]}
      onPress={onPress}
    >
      <View style={styles.circle}>
        <MaterialIcons name={icon} size={23} color={color} />
      </View>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 7,
  },
  circle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.11)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  label: {
    fontSize: FontSizes.xs,
    color: 'rgba(255,255,255,0.82)',
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.2,
  },
});
