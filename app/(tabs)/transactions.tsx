// Powered by OnSpace.AI
import React, { useState } from 'react';
import {
  View, Text, FlatList, StyleSheet, TextInput, Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useApp } from '@/hooks/useApp';
import { Colors, Spacing, FontSizes, BorderRadius, Shadows } from '@/constants/theme';
import { Currency } from '@/services/dataService';
import TransactionRow from '@/components/ui/TransactionRow';

type FilterType = 'all' | 'give' | 'take';
type CurrencyFilter = 'all' | Currency;

export default function TransactionsScreen() {
  const { transactions, deleteTransaction } = useApp();
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<FilterType>('all');
  const [currencyFilter, setCurrencyFilter] = useState<CurrencyFilter>('all');

  const filtered = transactions.filter(tx => {
    const matchSearch = !search || tx.clientName.includes(search) || (tx.notes || '').includes(search);
    const matchType = typeFilter === 'all' || tx.type === typeFilter;
    const matchCurrency = currencyFilter === 'all' || tx.currency === currencyFilter;
    return matchSearch && matchType && matchCurrency;
  });

  const TypePill = ({ type, label, activeColor }: { type: FilterType; label: string; activeColor: string }) => (
    <Pressable
      style={[styles.pill, typeFilter === type && { backgroundColor: activeColor, borderColor: activeColor }]}
      onPress={() => setTypeFilter(type)}
    >
      <Text style={[styles.pillText, typeFilter === type && styles.pillTextActive]}>{label}</Text>
    </Pressable>
  );

  const CurrPill = ({ curr }: { curr: CurrencyFilter }) => (
    <Pressable
      style={[styles.pill, currencyFilter === curr && styles.pillPrimaryActive]}
      onPress={() => setCurrencyFilter(curr)}
    >
      <Text style={[styles.pillText, currencyFilter === curr && styles.pillTextActive]}>
        {curr === 'all' ? 'الكل' : curr}
      </Text>
    </Pressable>
  );

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{filtered.length}</Text>
        </View>
        <Text style={styles.headerTitle}>جميع المعاملات</Text>
      </View>

      {/* Search */}
      <View style={styles.searchWrap}>
        <MaterialIcons name="search" size={19} color={Colors.text.muted} style={{ marginLeft: 6 }} />
        <TextInput
          style={styles.searchInput}
          placeholder="البحث عن عميل أو ملاحظة..."
          placeholderTextColor={Colors.text.placeholder}
          value={search}
          onChangeText={setSearch}
          textAlign="right"
        />
        {search.length > 0 && (
          <Pressable onPress={() => setSearch('')} hitSlop={8}>
            <MaterialIcons name="close" size={16} color={Colors.text.muted} />
          </Pressable>
        )}
      </View>

      {/* Type Filter */}
      <View style={styles.filterRow}>
        <TypePill type="all"  label="الكل"    activeColor={Colors.primaryLight} />
        <TypePill type="give" label="له (مدفوع)" activeColor={Colors.error} />
        <TypePill type="take" label="لنا (مقبوض)" activeColor={Colors.success} />
      </View>

      {/* Currency Filter */}
      <View style={styles.filterRow}>
        <CurrPill curr="all" />
        <CurrPill curr="USD" />
        <CurrPill curr="EUR" />
        <CurrPill curr="SYP" />
        <CurrPill curr="TRY" />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TransactionRow
            transaction={item}
            onDelete={() => deleteTransaction(item.id)}
          />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <View style={styles.emptyIcon}>
              <MaterialIcons name="search-off" size={36} color={Colors.text.muted} />
            </View>
            <Text style={styles.emptyText}>لا توجد نتائج</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },

  header: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: { fontSize: FontSizes.xl, fontWeight: '800', color: '#fff', letterSpacing: 0.2 },
  countBadge: {
    backgroundColor: Colors.accentBright + '28',
    borderWidth: 1,
    borderColor: Colors.accentBright + '55',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  countText: { fontSize: FontSizes.sm, fontWeight: '800', color: Colors.accentBright },

  searchWrap: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: Colors.card,
    margin: Spacing.md,
    marginBottom: Spacing.sm,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.sm,
  },
  searchInput: { flex: 1, height: 46, color: Colors.text.primary, fontSize: FontSizes.md },

  filterRow: {
    flexDirection: 'row-reverse',
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
    flexWrap: 'wrap',
  },
  pill: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 7,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.card,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  pillPrimaryActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  pillText: { fontSize: FontSizes.sm, color: Colors.text.secondary, fontWeight: '600' },
  pillTextActive: { color: '#fff' },

  list: { padding: Spacing.md, paddingBottom: 110 },

  empty: { alignItems: 'center', paddingVertical: 52, gap: Spacing.md },
  emptyIcon: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: Colors.backgroundAlt,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderColor: Colors.border,
  },
  emptyText: { color: Colors.text.muted, fontSize: FontSizes.md },
});
