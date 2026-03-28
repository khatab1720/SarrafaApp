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

export default function QuickAction({ icon, label, onPress, color = Colors.accent }: QuickActionProps) {
  return (
    <Pressable
      style={({ pressed }) => [styles.container, pressed && { opacity: 0.75, transform: [{ scale: 0.95 }] }]}
      onPress={onPress}
    >
      <View style={[styles.circle, { backgroundColor: 'rgba(255,255,255,0.10)', borderColor: 'rgba(255,255,255,0.15)' }]}>
        <MaterialIcons name={icon} size={22} color={color} />
      </View>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 6,
  },
  circle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  label: {
    fontSize: FontSizes.xs,
    color: 'rgba(255,255,255,0.75)',
    fontWeight: '600',
    textAlign: 'center',
  },
});
