// Powered by OnSpace.AI
import React, { useState, useRef } from 'react';
import {
  View, Text, ScrollView, StyleSheet, Pressable,
  StatusBar, Animated,
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
  { currency: 'SYP', label: 'ليرة سورية', icon: 'SYR' },
  { currency: 'TRY', label: 'ليرة تركية', icon: '🇹🇷' },
];

const HEADER_MAX_HEIGHT = 290;
const COLLAPSE_THRESHOLD = 130;

export default function DashboardScreen() {
  const { totalBalance, totalUSD, transactions } = useApp();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const recentTx = transactions.slice(0, 5);
  const isPositive = totalUSD >= 0;

  const [balanceHidden, setBalanceHidden] = useState(false);
  const [headerCollapsed, setHeaderCollapsed] = useState(false);

  const scrollY = useRef(new Animated.Value(0)).current;

  const heroHeight = scrollY.interpolate({
    inputRange: [0, COLLAPSE_THRESHOLD],
    outputRange: [HEADER_MAX_HEIGHT, 0],
    extrapolate: 'clamp',
  });
  const heroOpacity = scrollY.interpolate({
    inputRange: [0, COLLAPSE_THRESHOLD * 0.7],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      {/* ── Fixed Top Bar ── */}
      <View style={[styles.topBar, { paddingTop: insets.top + 10 }]}>
        <Pressable style={styles.notifBtn}>
          <MaterialIcons name="notifications-none" size={22} color="rgba(255,255,255,0.80)" />
        </Pressable>
        <View style={styles.headerTitleGroup}>
          <Text style={styles.headerSub}>لوحة التحكم</Text>
          <Text style={styles.headerTitle}>مكتب الصرافة</Text>
        </View>
      </View>

      {/* ── Animated Hero ── */}
      <Animated.View style={[styles.heroSection, { height: heroHeight, opacity: heroOpacity }]}>
        {/* Balance Card */}
        <View style={styles.balanceCard}>
          {/* Row: eye + label */}
          <View style={styles.balanceTopRow}>
            <Pressable onPress={() => setBalanceHidden(h => !h)} style={styles.eyeBtn} hitSlop={10}>
              <MaterialIcons
                name={balanceHidden ? 'visibility-off' : 'visibility'}
                size={18}
                color="rgba(255,255,255,0.55)"
              />
            </Pressable>
            <Text style={styles.balanceCurrLabel}>إجمالي الرصيد · USD</Text>
          </View>

          {/* Amount */}
          {balanceHidden ? (
            <View style={styles.dotsRow}>
              {[1,2,3,4,5].map(i => <View key={i} style={styles.dot} />)}
            </View>
          ) : (
            <Text style={[styles.balanceAmt, { color: isPositive ? '#7EFBB7' : '#FFAAB5' }]}>
              {isPositive ? '+' : '-'}{formatUSD(Math.abs(totalUSD))}
            </Text>
          )}

          {/* Status pill */}
          <View style={[
            styles.statusPill,
            { backgroundColor: isPositive ? 'rgba(0,150,109,0.22)' : 'rgba(214,51,71,0.22)' }
          ]}>
            <MaterialIcons
              name={isPositive ? 'trending-up' : 'trending-down'}
              size={13}
              color={isPositive ? '#7EFBB7' : '#FFAAB5'}
            />
            <Text style={[styles.statusText, { color: isPositive ? '#7EFBB7' : '#FFAAB5' }]}>
              {isPositive ? 'رصيد دائن' : 'رصيد مدين'}
            </Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <QuickAction icon="add-circle-outline" label="معاملة" onPress={() => router.push('/add-transaction')} color={Colors.accentBright} />
          <QuickAction icon="description"          label="الكشف"  onPress={() => router.push('/account-statement')} color="#90CAF9" />
          <QuickAction icon="bar-chart"            label="التقارير" onPress={() => router.push('/reports')}           color="#80DEEA" />
          <QuickAction icon="balance"              label="المراجعة" onPress={() => router.push('/reconciliation')}    color="#CE93D8" />
        </View>
      </Animated.View>

      {/* ── Scroll Content ── */}
      <Animated.ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          {
            useNativeDriver: false,
            listener: (event: any) => {
              const y = event.nativeEvent.contentOffset.y;
              setHeaderCollapsed(y > COLLAPSE_THRESHOLD - 20);
            },
          }
        )}
        scrollEventThrottle={16}
      >
        {/* Mini balance bar on collapse */}
        {headerCollapsed && (
          <Pressable style={styles.miniBar} onPress={() => setBalanceHidden(h => !h)}>
            <MaterialIcons
              name={balanceHidden ? 'visibility-off' : 'visibility'}
              size={14}
              color={Colors.text.muted}
            />
            <Text style={[styles.miniAmt, { color: isPositive ? Colors.success : Colors.error }]}>
              {balanceHidden ? '••••••' : `${isPositive ? '+' : '-'}${formatUSD(Math.abs(totalUSD))}`}
            </Text>
            <Text style={styles.miniLabel}>الرصيد الإجمالي</Text>
          </Pressable>
        )}

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
              isSyrianFlag={currency === 'SYP'}
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
            <View style={styles.emptyIcon}>
              <MaterialIcons name="receipt-long" size={36} color={Colors.text.muted} />
            </View>
            <Text style={styles.emptyText}>لا توجد معاملات بعد</Text>
            <Pressable style={styles.emptyBtn} onPress={() => router.push('/add-transaction')}>
              <Text style={styles.emptyBtnText}>إضافة أول معاملة</Text>
            </Pressable>
          </View>
        ) : (
          recentTx.map(tx => <TransactionRow key={tx.id} transaction={tx} />)
        )}
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },

  // Top Bar
  topBar: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingBottom: 14,
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  notifBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: Colors.glassLight,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: Colors.glassBorder,
  },
  headerTitleGroup: { alignItems: 'flex-end' },
  headerTitle: {
    fontSize: FontSizes.lg, fontWeight: '800', color: '#fff',
    textAlign: 'right', letterSpacing: 0.2,
  },
  headerSub: {
    fontSize: FontSizes.xs, color: 'rgba(255,255,255,0.45)',
    textAlign: 'right', marginBottom: 1, letterSpacing: 0.3,
  },

  // Hero Section
  heroSection: {
    backgroundColor: Colors.primary,
    overflow: 'hidden',
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.lg,
  },

  // Balance Card
  balanceCard: {
    backgroundColor: 'rgba(255,255,255,0.09)',
    borderRadius: BorderRadius.xl,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
    marginBottom: Spacing.lg,
    marginTop: 4,
  },
  balanceTopRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 6,
  },
  balanceCurrLabel: {
    fontSize: FontSizes.xs, color: 'rgba(255,255,255,0.45)',
    fontWeight: '700', letterSpacing: 1.5, flex: 1, textAlign: 'right',
  },
  eyeBtn: { padding: 4 },
  balanceAmt: {
    fontSize: 44, fontWeight: '800', letterSpacing: -1.5, marginBottom: 10,
  },
  dotsRow: { flexDirection: 'row', gap: 10, marginVertical: 18, alignItems: 'center' },
  dot: { width: 12, height: 12, borderRadius: 6, backgroundColor: 'rgba(255,255,255,0.4)' },
  statusPill: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 12, paddingVertical: 5, borderRadius: BorderRadius.full,
  },
  statusText: { fontSize: FontSizes.xs, fontWeight: '700', letterSpacing: 0.3 },

  quickActions: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-around',
  },

  // Mini balance bar
  miniBar: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: 11,
    marginBottom: Spacing.md,
    gap: Spacing.sm,
    ...Shadows.sm,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  miniLabel: { fontSize: FontSizes.sm, color: Colors.text.muted, flex: 1, textAlign: 'right' },
  miniAmt: { fontSize: FontSizes.lg, fontWeight: '800', letterSpacing: -0.5 },

  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: 130,
  },

  currencyGrid: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
    gap: 0,
  },

  empty: { alignItems: 'center', paddingVertical: Spacing.xl, gap: Spacing.md },
  emptyIcon: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: Colors.backgroundAlt,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderColor: Colors.border,
  },
  emptyText: { color: Colors.text.muted, fontSize: FontSizes.md },
  emptyBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  emptyBtnText: { color: '#fff', fontWeight: '700', fontSize: FontSizes.md },
});
