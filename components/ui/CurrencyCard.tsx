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
  isSyrianFlag?: boolean;
}

function SyrianFlagIcon() {
  return (
    <View style={{ width: 28, height: 20, borderRadius: 4, overflow: 'hidden' }}>
      <View style={{ flex: 1, backgroundColor: '#009000' }} />
      <View style={{ flex: 1, backgroundColor: '#FFFFFF' }} />
      <View style={{ flex: 1, backgroundColor: '#000000' }} />
    </View>
  );
}

type CurrencyColorKey = 'currencyUSD' | 'currencyEUR' | 'currencySYP' | 'currencyTRY';

const CURRENCY_THEME: Record<Currency, CurrencyColorKey> = {
  USD: 'currencyUSD',
  EUR: 'currencyEUR',
  SYP: 'currencySYP',
  TRY: 'currencyTRY',
};

const CURRENCY_LABELS: Record<Currency, { symbol: string; name: string }> = {
  USD: { symbol: '$', name: 'دولار' },
  EUR: { symbol: '€', name: 'يورو' },
  SYP: { symbol: 'ل.س', name: 'ليرة' },
  TRY: { symbol: '₺', name: 'تركية' },
};

export default function CurrencyCard({ currency, amount, label, icon, isSyrianFlag }: CurrencyCardProps) {
  const themeKey = CURRENCY_THEME[currency];
  const palette = Colors[themeKey];
  const isPositive = amount >= 0;
  const amountColor = isPositive ? palette.accent : Colors.error;

  return (
    <View style={[styles.card, { backgroundColor: palette.bg, borderColor: palette.border }]}>
      {/* Top Row */}
      <View style={styles.topRow}>
        {/* Flag / icon */}
        <View style={styles.flagBox}>
          {isSyrianFlag ? <SyrianFlagIcon /> : <Text style={styles.flagEmoji}>{icon}</Text>}
        </View>
        {/* Currency chip */}
        <View style={[styles.chip, { backgroundColor: palette.icon + '22' }]}>
          <Text style={[styles.chipText, { color: palette.icon }]}>{currency}</Text>
        </View>
      </View>

      {/* Currency name */}
      <Text style={[styles.currName, { color: palette.text + 'AA' }]} numberOfLines={1}>
        {label}
      </Text>

      {/* Amount */}
      <Text style={[styles.amount, { color: amountColor }]} numberOfLines={1} adjustsFontSizeToFit>
        {isPositive ? '+' : '-'}{formatAmount(Math.abs(amount), currency)}
      </Text>

      {/* Bottom bar accent */}
      <View style={[styles.accentBar, { backgroundColor: palette.icon }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '48.5%',
    borderRadius: BorderRadius.xl,
    borderWidth: 1.5,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    ...Shadows.sm,
    alignItems: 'flex-end',
    overflow: 'hidden',
    position: 'relative',
  },
  topRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: Spacing.sm,
  },
  flagBox: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  flagEmoji: {
    fontSize: 24,
  },
  chip: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  chipText: {
    fontSize: FontSizes.xs,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  currName: {
    fontSize: FontSizes.xs,
    marginBottom: 6,
    textAlign: 'right',
    fontWeight: '500',
  },
  amount: {
    fontSize: FontSizes.md,
    fontWeight: '800',
    textAlign: 'right',
    marginBottom: Spacing.sm,
  },
  accentBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    borderBottomLeftRadius: BorderRadius.xl,
    borderBottomRightRadius: BorderRadius.xl,
    opacity: 0.6,
  },
});
