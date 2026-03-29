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

// New Syrian independence flag (green-white-black tricolor with stars)
const SyrianFlag = () => (
  <View style={{ width: 28, height: 20, borderRadius: 3, overflow: 'hidden', flexDirection: 'column' }}>
    <View style={{ flex: 1, backgroundColor: '#009000' }} />
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }} />
    <View style={{ flex: 1, backgroundColor: '#000000' }} />
  </View>
);

const CURRENCY_INFO: { currency: Currency; label: string; icon: string; isSyrian?: boolean }[] = [
  { currency: 'USD', label: 'دولار أمريكي', icon: '🇺🇸' },
  { currency: 'EUR', label: 'يورو أوروبي', icon: '🇪🇺' },
  { currency: 'SYP', label: 'ليرة سورية', icon: 'SYR' },
  { currency: 'TRY', label: 'ليرة تركية', icon: '🇹🇷' },
];

const HEADER_MAX_HEIGHT = 300;
const HEADER_MIN_HEIGHT = 0;
const COLLAPSE_THRESHOLD = 140;

export default function DashboardScreen() {
  const { totalBalance, totalUSD, transactions } = useApp();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const recentTx = transactions.slice(0, 5);
  const isPositive = totalUSD >= 0;

  const [balanceHidden, setBalanceHidden] = useState(false);
  const [headerCollapsed, setHeaderCollapsed] = useState(false);

  const scrollY = useRef(new Animated.Value(0)).current;
  const lastScrollY = useRef(0);

  const heroOpacity = scrollY.interpolate({
    inputRange: [0, COLLAPSE_THRESHOLD],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const heroHeight = scrollY.interpolate({
    inputRange: [0, COLLAPSE_THRESHOLD],
    outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />

      {/* ── Fixed Top Bar (always visible) ── */}
      <View style={[styles.topBar, { paddingTop: insets.top + 10 }]}>
        <Pressable style={styles.notifBtn}>
          <MaterialIcons name="notifications-none" size={22} color="rgba(255,255,255,0.75)" />
        </Pressable>
        <View style={styles.headerTitleGroup}>
          <Text style={styles.headerSub}>لوحة التحكم</Text>
          <Text style={styles.headerTitle}>مكتب الصرافة</Text>
        </View>
      </View>

      {/* ── Animated Hero Section ── */}
      <Animated.View style={[styles.heroSection, { height: heroHeight, opacity: heroOpacity }]}>
        {/* Balance Hero */}
        <View style={styles.balanceHero}>
          <View style={styles.balanceGlassCard}>
            <View style={styles.balanceTopRow}>
              <Pressable
                onPress={() => setBalanceHidden(h => !h)}
                style={styles.eyeBtn}
                hitSlop={10}
              >
                <MaterialIcons
                  name={balanceHidden ? 'visibility-off' : 'visibility'}
                  size={19}
                  color="rgba(255,255,255,0.6)"
                />
              </Pressable>
              <Text style={styles.balanceCurrencyLabel}>إجمالي الرصيد (USD)</Text>
            </View>

            {balanceHidden ? (
              <View style={styles.hiddenBalance}>
                {[1, 2, 3, 4, 5].map(i => (
                  <View key={i} style={styles.hiddenDot} />
                ))}
              </View>
            ) : (
              <Text style={[styles.balanceAmount, { color: isPositive ? '#A8F0B4' : '#F9A8A8' }]}>
                {isPositive ? '+' : '-'}{formatUSD(Math.abs(totalUSD))}
              </Text>
            )}

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
      </Animated.View>

      <Animated.ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent]}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          {
            useNativeDriver: false,
            listener: (event: any) => {
              const y = event.nativeEvent.contentOffset.y;
              lastScrollY.current = y;
              setHeaderCollapsed(y > COLLAPSE_THRESHOLD - 20);
            },
          }
        )}
        scrollEventThrottle={16}
      >
        {/* Collapsed Mini Balance Bar */}
        {headerCollapsed && (
          <View style={styles.miniBalanceBar}>
            <Pressable onPress={() => setBalanceHidden(h => !h)} hitSlop={10}>
              <MaterialIcons
                name={balanceHidden ? 'visibility-off' : 'visibility'}
                size={15}
                color={Colors.text.muted}
              />
            </Pressable>
            <Text style={[styles.miniBalance, { color: isPositive ? Colors.success : Colors.error }]}>
              {balanceHidden
                ? '••••••'
                : `${isPositive ? '+' : '-'}${formatUSD(Math.abs(totalUSD))}`}
            </Text>
            <Text style={styles.miniBalanceLabel}>الرصيد الإجمالي</Text>
          </View>
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
            <MaterialIcons name="receipt-long" size={48} color={Colors.border} />
            <Text style={styles.emptyText}>لا توجد معاملات بعد</Text>
          </View>
        ) : (
          recentTx.map(tx => (
            <TransactionRow key={tx.id} transaction={tx} />
          ))
        )}
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },

  // Fixed top bar
  topBar: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingBottom: 12,
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
    borderBottomWidth: 0,
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

  // Animated hero
  heroSection: {
    backgroundColor: Colors.primary,
    overflow: 'hidden',
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.lg,
  },

  // Balance glass card
  balanceHero: { alignItems: 'center', marginBottom: Spacing.lg, marginTop: 6 },
  balanceGlassCard: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: BorderRadius.xl,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    alignItems: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
  },
  balanceTopRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 6,
  },
  balanceCurrencyLabel: {
    fontSize: FontSizes.xs,
    color: 'rgba(255,255,255,0.5)',
    fontWeight: '600',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    flex: 1,
    textAlign: 'right',
  },
  eyeBtn: {
    padding: 4,
  },
  balanceAmount: {
    fontSize: 44,
    fontWeight: '800',
    letterSpacing: -1,
    marginBottom: 8,
  },
  hiddenBalance: {
    flexDirection: 'row',
    gap: 10,
    marginVertical: 16,
    alignItems: 'center',
  },
  hiddenDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: 'rgba(255,255,255,0.45)',
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

  // Mini balance bar when collapsed
  miniBalanceBar: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    marginBottom: Spacing.md,
    gap: Spacing.sm,
    ...Shadows.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  miniBalanceLabel: {
    fontSize: FontSizes.sm,
    color: Colors.text.muted,
    flex: 1,
    textAlign: 'right',
  },
  miniBalance: {
    fontSize: FontSizes.lg,
    fontWeight: '800',
    letterSpacing: -0.5,
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
