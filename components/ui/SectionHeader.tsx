// Powered by OnSpace.AI
import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Colors, FontSizes, Spacing, BorderRadius } from '@/constants/theme';

interface SectionHeaderProps {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function SectionHeader({ title, actionLabel, onAction }: SectionHeaderProps) {
  return (
    <View style={styles.container}>
      {actionLabel && onAction ? (
        <Pressable
          onPress={onAction}
          style={({ pressed }) => [styles.actionBtn, pressed && { opacity: 0.70 }]}
        >
          <Text style={styles.action}>{actionLabel}</Text>
        </Pressable>
      ) : <View />}
      <View style={styles.titleRow}>
        <View style={styles.titleAccent} />
        <Text style={styles.title}>{title}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
    marginTop: Spacing.sm,
    paddingHorizontal: 2,
  },
  titleRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
  },
  titleAccent: {
    width: 4,
    height: 18,
    borderRadius: 2,
    backgroundColor: Colors.accent,
  },
  title: {
    fontSize: FontSizes.lg,
    fontWeight: '800',
    color: Colors.text.primary,
    textAlign: 'right',
    letterSpacing: 0.2,
  },
  actionBtn: {
    backgroundColor: Colors.primarySurface,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  action: {
    fontSize: FontSizes.xs,
    color: Colors.primaryLight,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
