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

  const filtered = clients.filter(c => c.name.includes(search) || c.name.toLowerCase().includes(search.toLowerCase()));

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
        <Pressable
          style={styles.addBtn}
          onPress={() => router.push('/add-client')}
        >
          <MaterialIcons name="person-add" size={18} color={Colors.primary} />
          <Text style={styles.addText}>إضافة</Text>
        </Pressable>
        <Text style={styles.headerTitle}>الحسابات</Text>
      </View>

      {/* Search */}
      <View style={styles.searchWrapper}>
        <View style={styles.searchContainer}>
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
                pressed && { opacity: 0.88 },
              ]}
              onPress={() => router.push({ pathname: '/account-statement', params: { clientId: item.id } })}
            >
              {/* Leading icon for type */}
              <View style={[styles.accountIcon, isPermanent && styles.accountIconPermanent]}>
                <MaterialIcons
                  name={isPermanent ? 'lock' : 'person-outline'}
                  size={19}
                  color={isPermanent ? Colors.accent : Colors.primaryLight}
                />
              </View>

              {/* Info */}
              <View style={styles.cardInfo}>
                <View style={styles.nameRow}>
                  <Text style={styles.clientName} numberOfLines={1}>{item.name}</Text>
                  {isPermanent && (
                    <View style={styles.permanentBadge}>
                      <Text style={styles.permanentBadgeText}>أساسي</Text>
                    </View>
                  )}
                </View>
                {item.phone ? (
                  <Text style={styles.phone}>{item.phone}</Text>
                ) : null}
              </View>

              {/* Balance + Arrow */}
              <View style={styles.cardRight}>
                <Text style={[styles.balanceText, { color: isPositive ? Colors.success : Colors.error }]}>
                  {isPositive ? '+' : '-'}{formatUSD(Math.abs(usd))}
                </Text>
                <View style={styles.actionRow}>
                  <Pressable
                    onPress={() => handleDelete(item.id, item.name, isPermanent)}
                    hitSlop={8}
                    style={styles.deleteBtn}
                  >
                    <MaterialIcons
                      name="delete-outline"
                      size={18}
                      color={isPermanent ? Colors.text.muted + '44' : Colors.text.muted}
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
            <MaterialIcons name="account-balance-wallet" size={60} color={Colors.border} />
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
  headerTitle: { fontSize: FontSizes.xl, fontWeight: '700', color: '#fff', letterSpacing: 0.3 },
  addBtn: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: Colors.accent,
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
    gap: 5,
  },
  addText: { fontSize: FontSizes.sm, fontWeight: '700', color: Colors.primary },

  searchWrapper: { paddingHorizontal: Spacing.md, paddingTop: Spacing.md, paddingBottom: Spacing.sm },
  searchContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
    ...Shadows.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchInput: { flex: 1, height: 46, color: Colors.text.primary, fontSize: FontSizes.md },

  list: { paddingHorizontal: Spacing.md, paddingBottom: 110 },

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
  },
  cardPermanent: {
    borderWidth: 1.5,
    borderColor: Colors.accent + '40',
    backgroundColor: '#FFFBF0',
  },

  accountIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  accountIconPermanent: {
    backgroundColor: Colors.accent + '18',
  },

  cardInfo: { flex: 1 },
  nameRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
  clientName: {
    fontSize: FontSizes.md,
    fontWeight: '700',
    color: Colors.text.primary,
    textAlign: 'right',
    flexShrink: 1,
  },
  permanentBadge: {
    backgroundColor: Colors.accent + '28',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
  permanentBadgeText: { fontSize: 10, fontWeight: '700', color: Colors.accentDark },
  phone: { fontSize: FontSizes.xs, color: Colors.text.muted, marginTop: 2, textAlign: 'right' },

  cardRight: { alignItems: 'flex-end', gap: 4, flexShrink: 0 },
  balanceText: { fontSize: FontSizes.sm, fontWeight: '700' },
  actionRow: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  deleteBtn: { padding: 2 },

  empty: { alignItems: 'center', paddingVertical: 64, gap: Spacing.md },
  emptyText: { color: Colors.text.muted, fontSize: FontSizes.md },
  emptyBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  emptyBtnText: { color: '#fff', fontWeight: '700', fontSize: FontSizes.md },
});
