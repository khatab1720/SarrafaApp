// Powered by OnSpace.AI
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, BorderRadius, Spacing, FontSizes, Shadows } from '@/constants/theme';
import { Transaction, formatAmount } from '@/services/dataService';

interface TransactionRowProps {
  transaction: Transaction;
  onDelete?: () => void;
  showClient?: boolean;
}

export default function TransactionRow({ transaction, onDelete, showClient = true }: TransactionRowProps) {
  const isGive = transaction.type === 'give';

  return (
    <View style={styles.row}>
      {/* Icon */}
      <View style={[
        styles.iconWrap,
        { backgroundColor: isGive ? Colors.errorLight : Colors.successLight }
      ]}>
        <MaterialIcons
          name={isGive ? 'arrow-upward' : 'arrow-downward'}
          size={16}
          color={isGive ? Colors.error : Colors.success}
        />
      </View>

      {/* Info */}
      <View style={styles.info}>
        {showClient && (
          <Text style={styles.client} numberOfLines={1}>{transaction.clientName}</Text>
        )}
        <Text style={styles.date}>{transaction.date} · {transaction.time}</Text>
        {transaction.notes ? (
          <Text style={styles.notes} numberOfLines={1}>{transaction.notes}</Text>
        ) : null}
        {transaction.isDoubleEntry && transaction.counterClientName ? (
          <View style={styles.counterBadge}>
            <MaterialIcons name="compare-arrows" size={11} color={Colors.primaryLight} />
            <Text style={styles.counterText}>{transaction.counterClientName}</Text>
          </View>
        ) : null}
      </View>

      {/* Amount + type */}
      <View style={styles.right}>
        <Text style={[styles.amount, { color: isGive ? Colors.error : Colors.success }]}>
          {isGive ? '-' : '+'}{formatAmount(transaction.amount, transaction.currency)}
        </Text>
        <View style={[
          styles.typePill,
          { backgroundColor: isGive ? Colors.errorLight : Colors.successLight,
            borderColor: isGive ? Colors.error + '33' : Colors.success + '33' }
        ]}>
          <Text style={[styles.typeText, { color: isGive ? Colors.error : Colors.success }]}>
            {isGive ? 'له' : 'لنا'}
          </Text>
        </View>
        {onDelete && (
          <Pressable onPress={onDelete} hitSlop={10} style={styles.deleteBtn}>
            <MaterialIcons name="delete-outline" size={16} color={Colors.text.muted} />
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    gap: Spacing.sm,
    ...Shadows.sm,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  info: {
    flex: 1,
    alignItems: 'flex-end',
  },
  client: {
    fontSize: FontSizes.md,
    fontWeight: '700',
    color: Colors.text.primary,
    textAlign: 'right',
  },
  date: {
    fontSize: FontSizes.xs,
    color: Colors.text.muted,
    marginTop: 2,
    textAlign: 'right',
  },
  notes: {
    fontSize: FontSizes.xs,
    color: Colors.text.secondary,
    marginTop: 2,
    textAlign: 'right',
    fontStyle: 'italic',
  },
  counterBadge: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 3,
    marginTop: 3,
    backgroundColor: Colors.primarySurface,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
    alignSelf: 'flex-end',
  },
  counterText: {
    fontSize: 10,
    color: Colors.primaryLight,
    fontWeight: '600',
  },
  right: {
    alignItems: 'flex-end',
    gap: 4,
    minWidth: 88,
    flexShrink: 0,
  },
  amount: {
    fontSize: FontSizes.md,
    fontWeight: '800',
  },
  typePill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  typeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  deleteBtn: {
    marginTop: 2,
    padding: 2,
  },
});
