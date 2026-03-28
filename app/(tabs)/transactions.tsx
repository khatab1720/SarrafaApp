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

  const TypeBtn = ({ type, label }: { type: FilterType; label: string }) => (
    <Pressable
      style={[styles.pill, typeFilter === type && styles.pillActive]}
      onPress={() => setTypeFilter(type)}
    >
      <Text style={[styles.pillText, typeFilter === type && styles.pillTextActive]}>{label}</Text>
    </Pressable>
  );

  const CurrBtn = ({ curr }: { curr: CurrencyFilter }) => (
    <Pressable
      style={[styles.pill, currencyFilter === curr && styles.pillActive]}
      onPress={() => setCurrencyFilter(curr)}
    >
      <Text style={[styles.pillText, currencyFilter === curr && styles.pillTextActive]}>{curr === 'all' ? 'الكل' : curr}</Text>
    </Pressable>
  );

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>جميع المعاملات</Text>
        <Text style={styles.count}>{filtered.length} معاملة</Text>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <MaterialIcons name="search" size={20} color={Colors.text.muted} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="البحث عن عميل أو ملاحظة..."
          placeholderTextColor={Colors.text.placeholder}
          value={search}
          onChangeText={setSearch}
          textAlign="right"
        />
      </View>

      {/* Type Filter */}
      <View style={styles.filterRow}>
        <TypeBtn type="all" label="الكل" />
        <TypeBtn type="give" label="مدفوع" />
        <TypeBtn type="take" label="مقبوض" />
      </View>

      {/* Currency Filter */}
      <View style={styles.filterRow}>
        <CurrBtn curr="all" />
        <CurrBtn curr="USD" />
        <CurrBtn curr="EUR" />
        <CurrBtn curr="SYP" />
        <CurrBtn curr="TRY" />
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
            <MaterialIcons name="search-off" size={48} color={Colors.text.muted} />
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
  headerTitle: { fontSize: FontSizes.xl, fontWeight: '700', color: '#fff' },
  count: { fontSize: FontSizes.sm, color: 'rgba(255,255,255,0.6)' },
  searchContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: Colors.card,
    margin: Spacing.md,
    marginBottom: Spacing.sm,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    ...Shadows.sm,
  },
  searchIcon: { marginLeft: Spacing.sm },
  searchInput: { flex: 1, height: 44, color: Colors.text.primary, fontSize: FontSizes.md },
  filterRow: {
    flexDirection: 'row-reverse',
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  pill: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  pillActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  pillText: { fontSize: FontSizes.sm, color: Colors.text.secondary, fontWeight: '600' },
  pillTextActive: { color: '#fff' },
  list: { padding: Spacing.md, paddingBottom: 100 },
  empty: { alignItems: 'center', paddingVertical: 48, gap: Spacing.sm },
  emptyText: { color: Colors.text.muted, fontSize: FontSizes.md },
});
