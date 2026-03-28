// Powered by OnSpace.AI
import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable, Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useApp } from '@/hooks/useApp';
import { Colors, Spacing, FontSizes, BorderRadius, Shadows } from '@/constants/theme';
import { formatUSD, balanceToUSD, formatAmount, Currency } from '@/services/dataService';

const { width } = Dimensions.get('window');
const BAR_MAX_WIDTH = width - Spacing.md * 4 - 100;

const CURRENCIES: Currency[] = ['USD', 'EUR', 'SYP', 'TRY'];
const CURR_ICONS: Record<Currency, string> = { USD: '🇺🇸', EUR: '🇪🇺', SYP: '🇸🇾', TRY: '🇹🇷' };

export default function ReportsScreen() {
  const { transactions, clients, totalGiven, totalTaken, totalBalance, getClientBalance } = useApp();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Currency movement bars
  const maxCurrencyMovement = Math.max(
    ...CURRENCIES.map(c => Math.abs(totalBalance[c]))
  ) || 1;

  // Rank clients by net USD balance
  const clientRanking = clients.map(client => ({
    client,
    balance: getClientBalance(client.id),
    usd: balanceToUSD(getClientBalance(client.id)),
  }))
    .sort((a, b) => Math.abs(b.usd) - Math.abs(a.usd))
    .slice(0, 5);

  const txCount = transactions.length;
  const giveCount = transactions.filter(t => t.type === 'give').length;
  const takeCount = transactions.filter(t => t.type === 'take').length;

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <MaterialIcons name="arrow-forward" size={22} color="#fff" />
        </Pressable>
        <Text style={styles.headerTitle}>التقارير والإحصائيات</Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Total Cards */}
        <View style={styles.totalRow}>
          <View style={[styles.totalCard, styles.giveCard]}>
            <View style={styles.totalIconWrapper}>
              <MaterialIcons name="arrow-upward" size={22} color={Colors.error} />
            </View>
            <Text style={styles.totalLabel}>إجمالي المدفوع</Text>
            <Text style={[styles.totalAmount, { color: Colors.error }]}>
              {formatUSD(totalGiven)}
            </Text>
            <Text style={styles.totalCount}>{giveCount} معاملة</Text>
          </View>
          <View style={[styles.totalCard, styles.takeCard]}>
            <View style={[styles.totalIconWrapper, { backgroundColor: Colors.successLight }]}>
              <MaterialIcons name="arrow-downward" size={22} color={Colors.success} />
            </View>
            <Text style={styles.totalLabel}>إجمالي المقبوض</Text>
            <Text style={[styles.totalAmount, { color: Colors.success }]}>
              {formatUSD(totalTaken)}
            </Text>
            <Text style={styles.totalCount}>{takeCount} معاملة</Text>
          </View>
        </View>

        {/* Summary Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statVal}>{txCount}</Text>
            <Text style={styles.statKey}>إجمالي المعاملات</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statVal}>{clients.length}</Text>
            <Text style={styles.statKey}>عدد العملاء</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statVal, { color: (totalTaken - totalGiven) >= 0 ? Colors.success : Colors.error }]}>
              {formatUSD(Math.abs(totalTaken - totalGiven))}
            </Text>
            <Text style={styles.statKey}>صافي الربح</Text>
          </View>
        </View>

        {/* Currency Bar Chart */}
        <Text style={styles.sectionTitle}>حركة العملات (الرصيد الصافي)</Text>
        <View style={styles.chartCard}>
          {CURRENCIES.map(curr => {
            const val = totalBalance[curr];
            const pct = Math.abs(val) / maxCurrencyMovement;
            const barW = Math.max(4, pct * BAR_MAX_WIDTH);
            return (
              <View key={curr} style={styles.barRow}>
                <Text style={[
                  styles.barAmount,
                  { color: val >= 0 ? Colors.success : Colors.error }
                ]}>
                  {val >= 0 ? '+' : ''}{formatAmount(val, curr).replace('$', '').replace('€', '').trim()}
                </Text>
                <View style={styles.barTrack}>
                  <View style={[
                    styles.barFill,
                    {
                      width: barW,
                      backgroundColor: val >= 0 ? Colors.success : Colors.error,
                    }
                  ]} />
                </View>
                <Text style={styles.barLabel}>{CURR_ICONS[curr]} {curr}</Text>
              </View>
            );
          })}
        </View>

        {/* Top Clients */}
        <Text style={styles.sectionTitle}>أعلى الحسابات</Text>
        {clientRanking.map(({ client, usd }, index) => (
          <Pressable
            key={client.id}
            style={styles.rankRow}
            onPress={() => router.push({ pathname: '/account-statement', params: { clientId: client.id } })}
          >
            <View style={styles.rankRight}>
              <View style={[styles.rankBadge, index < 3 && styles.rankBadgeTop]}>
                <Text style={[styles.rankNum, index < 3 && { color: Colors.accent }]}>#{index + 1}</Text>
              </View>
              <View>
                <Text style={styles.rankName}>{client.name}</Text>
                <Text style={styles.rankSub}>اضغط لعرض الكشف</Text>
              </View>
            </View>
            <Text style={[styles.rankAmount, { color: usd >= 0 ? Colors.success : Colors.error }]}>
              {usd >= 0 ? '+' : '-'}{formatUSD(Math.abs(usd))}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  header: {
    backgroundColor: Colors.primary,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
  },
  headerTitle: { fontSize: FontSizes.xl, fontWeight: '700', color: '#fff' },
  backBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  content: { padding: Spacing.md, paddingBottom: 100 },
  totalRow: { flexDirection: 'row-reverse', gap: Spacing.sm, marginBottom: Spacing.md },
  totalCard: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    alignItems: 'flex-end',
    borderTopWidth: 4,
    ...Shadows.sm,
  },
  giveCard: { borderTopColor: Colors.error },
  takeCard: { borderTopColor: Colors.success },
  totalIconWrapper: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.errorLight,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  totalLabel: { fontSize: FontSizes.xs, color: Colors.text.muted, fontWeight: '600', marginBottom: 4 },
  totalAmount: { fontSize: FontSizes.xl, fontWeight: '800', marginBottom: 2 },
  totalCount: { fontSize: FontSizes.xs, color: Colors.text.muted },
  statsRow: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    flexDirection: 'row-reverse',
    justifyContent: 'space-around',
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  statItem: { alignItems: 'center', flex: 1 },
  statVal: { fontSize: FontSizes.xl, fontWeight: '800', color: Colors.primary },
  statKey: { fontSize: FontSizes.xs, color: Colors.text.muted, marginTop: 2, textAlign: 'center' },
  statDivider: { width: 1, backgroundColor: Colors.divider, marginVertical: 4 },
  sectionTitle: {
    fontSize: FontSizes.md,
    fontWeight: '700',
    color: Colors.text.primary,
    textAlign: 'right',
    marginBottom: Spacing.sm,
    marginTop: Spacing.sm,
  },
  chartCard: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.sm,
    gap: Spacing.md,
  },
  barRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  barLabel: { fontSize: FontSizes.sm, color: Colors.text.secondary, fontWeight: '600', minWidth: 60, textAlign: 'right' },
  barTrack: {
    flex: 1,
    height: 12,
    backgroundColor: Colors.background,
    borderRadius: 6,
    overflow: 'hidden',
  },
  barFill: { height: 12, borderRadius: 6 },
  barAmount: { fontSize: FontSizes.xs, fontWeight: '700', minWidth: 70, textAlign: 'left' },
  rankRow: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    ...Shadows.sm,
  },
  rankRight: { flexDirection: 'row-reverse', alignItems: 'center', gap: Spacing.sm },
  rankBadge: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: Colors.background,
    alignItems: 'center', justifyContent: 'center',
  },
  rankBadgeTop: { backgroundColor: Colors.primary + '18' },
  rankNum: { fontSize: FontSizes.sm, fontWeight: '800', color: Colors.text.muted },
  rankName: { fontSize: FontSizes.md, fontWeight: '700', color: Colors.text.primary, textAlign: 'right' },
  rankSub: { fontSize: FontSizes.xs, color: Colors.text.muted, textAlign: 'right' },
  rankAmount: { fontSize: FontSizes.md, fontWeight: '700' },
});
