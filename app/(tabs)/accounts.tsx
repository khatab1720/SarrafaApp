// Powered by OnSpace.AI
import React, { useState } from 'react';
import {
  View, Text, FlatList, StyleSheet, TextInput, Pressable, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useApp } from '@/hooks/useApp';
import { Colors, Spacing, FontSizes, BorderRadius, Shadows } from '@/constants/theme';
import { balanceToUSD, formatUSD } from '@/services/dataService';

export default function AccountsScreen() {
  const { clients, deleteClient, getClientBalance } = useApp();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState('');

  const filtered = clients.filter(c =>
    c.name.includes(search) || c.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id: string, name: string, isPermanent?: boolean) => {
    if (isPermanent) {
      Alert.alert('حساب أساسي', `"${name}" هو حساب دائم ولا يمكن حذفه.`);
      return;
    }
    Alert.alert(
      'حذف الحساب',
      `هل أنت متأكد من حذف "${name}" وجميع معاملاته؟`,
      [
        { text: 'إلغاء', style: 'cancel' },
        { text: 'حذف', style: 'destructive', onPress: () => deleteClient(id) },
      ]
    );
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.addBtn} onPress={() => router.push('/add-client')}>
          <MaterialIcons name="person-add" size={17} color={Colors.primary} />
          <Text style={styles.addText}>إضافة</Text>
        </Pressable>
        <Text style={styles.headerTitle}>الحسابات</Text>
      </View>

      {/* Search */}
      <View style={styles.searchWrap}>
        <View style={styles.searchInner}>
          <MaterialIcons name="search" size={19} color={Colors.text.muted} />
          <TextInput
            style={styles.searchInput}
            placeholder="البحث عن حساب..."
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
      </View>

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const balance = getClientBalance(item.id);
          const usd = balanceToUSD(balance);
          const isPositive = usd >= 0;
          const isPermanent = item.isPermanent === true;

          return (
            <Pressable
              style={({ pressed }) => [
                styles.card,
                isPermanent && styles.cardPermanent,
                pressed && { opacity: 0.86 },
              ]}
              onPress={() => router.push({ pathname: '/account-statement', params: { clientId: item.id } })}
            >
              {/* Icon */}
              <View style={[styles.accountIcon, isPermanent && styles.iconPermanent]}>
                <MaterialIcons
                  name={isPermanent ? 'lock' : 'person-outline'}
                  size={20}
                  color={isPermanent ? Colors.accent : Colors.primaryLight}
                />
              </View>

              {/* Info */}
              <View style={styles.info}>
                <View style={styles.nameRow}>
                  <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
                  {isPermanent && (
                    <View style={styles.permanentBadge}>
                      <Text style={styles.permanentText}>أساسي</Text>
                    </View>
                  )}
                </View>
                {item.phone ? <Text style={styles.phone}>{item.phone}</Text> : null}
              </View>

              {/* Balance */}
              <View style={styles.right}>
                <View style={[styles.balancePill, { backgroundColor: isPositive ? Colors.successLight : Colors.errorLight }]}>
                  <Text style={[styles.balanceVal, { color: isPositive ? Colors.success : Colors.error }]}>
                    {isPositive ? '+' : '-'}{formatUSD(Math.abs(usd))}
                  </Text>
                </View>
                <View style={styles.actions}>
                  <Pressable
                    onPress={() => handleDelete(item.id, item.name, isPermanent)}
                    hitSlop={8}
                  >
                    <MaterialIcons
                      name="delete-outline"
                      size={18}
                      color={isPermanent ? Colors.border : Colors.text.muted}
                    />
                  </Pressable>
                  <MaterialIcons name="chevron-left" size={20} color={Colors.border} />
                </View>
              </View>
            </Pressable>
          );
        }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <View style={styles.emptyIcon}>
              <MaterialIcons name="account-balance-wallet" size={36} color={Colors.text.muted} />
            </View>
            <Text style={styles.emptyText}>لا توجد حسابات</Text>
            <Pressable style={styles.emptyBtn} onPress={() => router.push('/add-client')}>
              <Text style={styles.emptyBtnText}>إضافة حساب جديد</Text>
            </Pressable>
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
  addBtn: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: Colors.accent,
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
    gap: 5,
    ...Shadows.accent,
  },
  addText: { fontSize: FontSizes.sm, fontWeight: '800', color: Colors.primary },

  searchWrap: { paddingHorizontal: Spacing.md, paddingTop: Spacing.md, paddingBottom: Spacing.sm },
  searchInner: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
    ...Shadows.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchInput: { flex: 1, height: 46, color: Colors.text.primary, fontSize: FontSizes.md },

  list: { paddingHorizontal: Spacing.md, paddingBottom: 120 },

  card: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.xl,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: Spacing.sm,
    ...Shadows.sm,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  cardPermanent: {
    borderColor: Colors.accent + '50',
    borderWidth: 1.5,
    backgroundColor: Colors.accentSurface,
  },

  accountIcon: {
    width: 42, height: 42,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.primarySurface,
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  iconPermanent: { backgroundColor: Colors.accentSurface, borderWidth: 1, borderColor: Colors.accent + '40' },

  info: { flex: 1 },
  nameRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
  name: {
    fontSize: FontSizes.md, fontWeight: '700',
    color: Colors.text.primary, textAlign: 'right', flexShrink: 1,
  },
  permanentBadge: {
    backgroundColor: Colors.accent + '25',
    paddingHorizontal: 7, paddingVertical: 2,
    borderRadius: BorderRadius.full,
    borderWidth: 1, borderColor: Colors.accent + '40',
  },
  permanentText: { fontSize: 10, fontWeight: '700', color: Colors.accentDark },
  phone: { fontSize: FontSizes.xs, color: Colors.text.muted, marginTop: 2, textAlign: 'right' },

  right: { alignItems: 'flex-end', gap: 6, flexShrink: 0 },
  balancePill: {
    paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  balanceVal: { fontSize: FontSizes.sm, fontWeight: '800' },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 4 },

  empty: { alignItems: 'center', paddingVertical: 64, gap: Spacing.md },
  emptyIcon: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: Colors.backgroundAlt,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderColor: Colors.border,
  },
  emptyText: { color: Colors.text.muted, fontSize: FontSizes.md },
  emptyBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl, paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    ...Shadows.sm,
  },
  emptyBtnText: { color: '#fff', fontWeight: '700', fontSize: FontSizes.md },
});
