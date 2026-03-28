// Powered by OnSpace.AI
import React from 'react';
import {
  View, Text, ScrollView, StyleSheet, Pressable,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useApp } from '@/hooks/useApp';
import { Colors, Spacing, FontSizes, BorderRadius, Shadows } from '@/constants/theme';
import { formatAmount, formatUSD, Currency } from '@/services/dataService';
import CurrencyCard from '@/components/ui/CurrencyCard';
import QuickAction from '@/components/ui/QuickAction';
import TransactionRow from '@/components/ui/TransactionRow';
import SectionHeader from '@/components/ui/SectionHeader';

const CURRENCY_INFO: { currency: Currency; label: string; icon: string }[] = [
  { currency: 'USD', label: 'دولار أمريكي', icon: '🇺🇸' },
  { currency: 'EUR', label: 'يورو أوروبي', icon: '🇪🇺' },
  { currency: 'SYP', label: 'ليرة سورية', icon: '🇸🇾' },
  { currency: 'TRY', label: 'ليرة تركية', icon: '🇹🇷' },
];

export default function DashboardScreen() {
  const { totalBalance, totalUSD, transactions } = useApp();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const recentTx = transactions.slice(0, 5);
  const isPositive = totalUSD >= 0;

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />

      {/* ── Glassmorphism Header ── */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        {/* Top row */}
        <View style={styles.headerTop}>
          <Pressable style={styles.notifBtn}>
            <MaterialIcons name="notifications-none" size={22} color="rgba(255,255,255,0.75)" />
          </Pressable>
          <View style={styles.headerTitleGroup}>
            <Text style={styles.headerSub}>لوحة التحكم</Text>
            <Text style={styles.headerTitle}>مكتب الصرافة</Text>
          </View>
        </View>

        {/* Balance Hero */}
        <View style={styles.balanceHero}>
          <View style={styles.balanceGlassCard}>
            <Text style={styles.balanceCurrencyLabel}>إجمالي الرصيد (USD)</Text>
            <Text style={[styles.balanceAmount, { color: isPositive ? '#A8F0B4' : '#F9A8A8' }]}>
              {isPositive ? '+' : '-'}{formatUSD(Math.abs(totalUSD))}
            </Text>
            <View style={styles.balanceBadge}>
              <MaterialIcons
                name={isPositive ? 'trending-up' : 'trending-down'}
                size={14}
                color={isPositive ? '#A8F0B4' : '#F9A8A8'}
              />
              <Text style={[styles.balanceBadgeText, { color: isPositive ? '#A8F0B4' : '#F9A8A8' }]}>
                {isPositive ? 'رصيد دائن' : 'رصيد مدين'}
              </Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <QuickAction
            icon="add-circle-outline"
            label="معاملة"
            onPress={() => router.push('/add-transaction')}
            color={Colors.accent}
          />
          <QuickAction
            icon="description"
            label="الكشف"
            onPress={() => router.push('/account-statement')}
            color="#90CAF9"
          />
          <QuickAction
            icon="bar-chart"
            label="التقارير"
            onPress={() => router.push('/reports')}
            color="#A5D6A7"
          />
          <QuickAction
            icon="balance"
            label="المراجعة"
            onPress={() => router.push('/reconciliation')}
            color="#CE93D8"
          />
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Currency Cards */}
        <SectionHeader title="أرصدة العملات" />
        <View style={styles.currencyGrid}>
          {CURRENCY_INFO.map(({ currency, label, icon }) => (
            <CurrencyCard
              key={currency}
              currency={currency}
              amount={totalBalance[currency]}
              label={label}
              icon={icon}
            />
          ))}
        </View>

        {/* Recent Transactions */}
        <SectionHeader
          title="أحدث المعاملات"
          actionLabel="عرض الكل"
          onAction={() => router.push('/(tabs)/transactions')}
        />
        {recentTx.length === 0 ? (
          <View style={styles.empty}>
            <MaterialIcons name="receipt-long" size={48} color={Colors.border} />
            <Text style={styles.emptyText}>لا توجد معاملات بعد</Text>
          </View>
        ) : (
          recentTx.map(tx => (
            <TransactionRow key={tx.id} transaction={tx} />
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },

  // ── Glassmorphism Header ──
  header: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.lg,
    // Subtle inner glow
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  headerTop: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  notifBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.glassLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  headerTitleGroup: { alignItems: 'flex-end' },
  headerTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'right',
    letterSpacing: 0.3,
  },
  headerSub: {
    fontSize: FontSizes.xs,
    color: 'rgba(255,255,255,0.5)',
    textAlign: 'right',
    marginBottom: 2,
  },

  // Balance glass card
  balanceHero: { alignItems: 'center', marginBottom: Spacing.lg },
  balanceGlassCard: {
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: BorderRadius.xl,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    alignItems: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
  },
  balanceCurrencyLabel: {
    fontSize: FontSizes.xs,
    color: 'rgba(255,255,255,0.5)',
    fontWeight: '600',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  balanceAmount: {
    fontSize: 44,
    fontWeight: '800',
    letterSpacing: -1,
    marginBottom: 8,
  },
  balanceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  balanceBadgeText: {
    fontSize: FontSizes.xs,
    fontWeight: '600',
    letterSpacing: 0.5,
  },

  quickActions: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-around',
  },

  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: 120,
  },
  currencyGrid: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
    gap: 0,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    gap: Spacing.sm,
  },
  emptyText: {
    color: Colors.text.muted,
    fontSize: FontSizes.md,
  },
});
