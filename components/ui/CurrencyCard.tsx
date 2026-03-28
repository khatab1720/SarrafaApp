// Powered by OnSpace.AI
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, BorderRadius, Shadows, Spacing, FontSizes } from '@/constants/theme';
import { Currency, formatAmount } from '@/services/dataService';

interface CurrencyCardProps {
  currency: Currency;
  amount: number;
  label: string;
  icon: string;
}

const CURRENCY_COLORS: Record<Currency, { bg: string; text: string; border: string; accent: string }> = {
  USD: { bg: '#F0FDF4', text: '#166534', border: '#BBF7D0', accent: '#16A34A' },
  EUR: { bg: '#EFF6FF', text: '#1E40AF', border: '#BFDBFE', accent: '#2563EB' },
  SYP: { bg: '#FFFBEB', text: '#92400E', border: '#FDE68A', accent: '#D97706' },
  TRY: { bg: '#FDF4FF', text: '#6B21A8', border: '#E9D5FF', accent: '#9333EA' },
};

export default function CurrencyCard({ currency, amount, label, icon }: CurrencyCardProps) {
  const colors = CURRENCY_COLORS[currency];
  const isPositive = amount >= 0;

  return (
    <View style={[styles.card, { backgroundColor: colors.bg, borderColor: colors.border }]}>
      {/* Top row: flag + currency code */}
      <View style={styles.topRow}>
        <View style={[styles.currencyBadge, { backgroundColor: colors.accent + '18' }]}>
          <Text style={[styles.currency, { color: colors.accent }]}>{currency}</Text>
        </View>
        <Text style={styles.icon}>{icon}</Text>
      </View>

      {/* Label */}
      <Text style={[styles.label, { color: colors.text }]} numberOfLines={1}>{label}</Text>

      {/* Amount */}
      <Text style={[
        styles.amount,
        { color: isPositive ? colors.accent : Colors.error }
      ]}>
        {isPositive ? '+' : '-'}{formatAmount(Math.abs(amount), currency)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '48%',
    borderRadius: BorderRadius.xl,
    borderWidth: 1.5,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    ...Shadows.sm,
    alignItems: 'flex-end',
  },
  topRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: Spacing.sm,
  },
  icon: {
    fontSize: 26,
  },
  currencyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
  },
  currency: {
    fontSize: FontSizes.xs,
    fontWeight: '800',
    letterSpacing: 1,
  },
  label: {
    fontSize: FontSizes.xs,
    marginBottom: Spacing.sm,
    opacity: 0.75,
    textAlign: 'right',
    fontWeight: '500',
  },
  amount: {
    fontSize: FontSizes.md,
    fontWeight: '800',
    textAlign: 'right',
  },
});
