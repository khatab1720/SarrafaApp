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
      <View style={[styles.icon, { backgroundColor: isGive ? Colors.errorLight : Colors.successLight }]}>
        <MaterialIcons
          name={isGive ? 'arrow-upward' : 'arrow-downward'}
          size={17}
          color={isGive ? Colors.error : Colors.success}
        />
      </View>
      <View style={styles.info}>
        {showClient && (
          <Text style={styles.client} numberOfLines={1}>{transaction.clientName}</Text>
        )}
        <Text style={styles.date}>{transaction.date} · {transaction.time}</Text>
        {transaction.notes ? (
          <Text style={styles.notes} numberOfLines={1}>{transaction.notes}</Text>
        ) : null}
        {transaction.isDoubleEntry && transaction.counterClientName ? (
          <Text style={styles.counterParty} numberOfLines={1}>
            الطرف الآخر: {transaction.counterClientName}
          </Text>
        ) : null}
      </View>
      <View style={styles.right}>
        <Text style={[styles.amount, { color: isGive ? Colors.error : Colors.success }]}>
          {isGive ? '-' : '+'}{formatAmount(transaction.amount, transaction.currency)}
        </Text>
        <View style={[styles.typeBadge, { backgroundColor: isGive ? Colors.errorLight : Colors.successLight }]}>
          <Text style={[styles.type, { color: isGive ? Colors.error : Colors.success }]}>
            {isGive ? 'له' : 'لنا'}
          </Text>
        </View>
        {onDelete && (
          <Pressable onPress={onDelete} hitSlop={10} style={styles.deleteBtn}>
            <MaterialIcons name="delete-outline" size={17} color={Colors.text.muted} />
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
  },
  icon: {
    width: 38,
    height: 38,
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
  counterParty: {
    fontSize: FontSizes.xs,
    color: Colors.primary,
    marginTop: 2,
    textAlign: 'right',
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
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
  type: {
    fontSize: 11,
    fontWeight: '700',
  },
  deleteBtn: {
    marginTop: 2,
    padding: 2,
  },
});
