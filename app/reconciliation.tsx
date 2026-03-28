// Powered by OnSpace.AI
import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useApp } from '@/hooks/useApp';
import { Colors, Spacing, FontSizes, BorderRadius, Shadows } from '@/constants/theme';
import { formatAmount, formatUSD, balanceToUSD, Currency } from '@/services/dataService';

const CURRENCIES: Currency[] = ['USD', 'EUR', 'SYP', 'TRY'];

export default function ReconciliationScreen() {
  const { clients, transactions, totalBalance, totalGiven, totalTaken, getClientBalance } = useApp();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const netUSD = totalTaken - totalGiven;
  const isBalanced = Math.abs(netUSD) < 1;
  const totalNetUSD = balanceToUSD(totalBalance);

  const clientBalances = clients.map(c => ({
    client: c,
    balance: getClientBalance(c.id),
    usd: balanceToUSD(getClientBalance(c.id)),
  }));

  const unbalancedClients = clientBalances.filter(cb => Math.abs(cb.usd) > 0.5);

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <MaterialIcons name="arrow-forward" size={22} color="#fff" />
        </Pressable>
        <Text style={styles.headerTitle}>المراجعة والمصالحة</Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Alert Banner */}
        <View style={[styles.alertBanner, { backgroundColor: isBalanced ? Colors.successLight : Colors.errorLight }]}>
          <MaterialIcons
            name={isBalanced ? 'check-circle' : 'warning'}
            size={24}
            color={isBalanced ? Colors.success : Colors.error}
          />
          <View style={styles.alertText}>
            <Text style={[styles.alertTitle, { color: isBalanced ? Colors.success : Colors.error }]}>
              {isBalanced ? 'الحسابات متوازنة' : 'تحذير: الحسابات غير متوازنة'}
            </Text>
            <Text style={[styles.alertSub, { color: isBalanced ? '#1B5E20' : '#7F1D1D' }]}>
              {isBalanced
                ? 'جميع الأرصدة مطابقة — لا توجد فروقات'
                : `الفارق: ${Math.abs(netUSD) < 1 ? 'لا يوجد' : formatUSD(Math.abs(netUSD))}`}
            </Text>
          </View>
        </View>

        {/* Expected vs Actual */}
        <Text style={styles.sectionTitle}>ملخص المقارنة</Text>
        <View style={styles.compareCard}>
          <View style={styles.compareRow}>
            <Text style={[styles.compareVal, { color: Colors.success }]}>{formatUSD(totalTaken)}</Text>
            <Text style={styles.compareKey}>إجمالي المقبوض</Text>
          </View>
          <View style={styles.compareDivider} />
          <View style={styles.compareRow}>
            <Text style={[styles.compareVal, { color: Colors.error }]}>{formatUSD(totalGiven)}</Text>
            <Text style={styles.compareKey}>إجمالي المدفوع</Text>
          </View>
          <View style={styles.compareDivider} />
          <View style={styles.compareRow}>
            <Text style={[styles.compareVal, { color: netUSD >= 0 ? Colors.success : Colors.error }]}>
              {netUSD >= 0 ? '+' : '-'}{formatUSD(Math.abs(netUSD))}
            </Text>
            <Text style={styles.compareKey}>الصافي</Text>
          </View>
        </View>

        {/* Currency Totals */}
        <Text style={styles.sectionTitle}>أرصدة العملات</Text>
        <View style={styles.currencyTable}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, { flex: 1.5 }]}>الرصيد</Text>
            <Text style={styles.tableHeaderCell}>العملة</Text>
          </View>
          {CURRENCIES.map(curr => (
            <View key={curr} style={styles.tableRow}>
              <Text style={[
                styles.tableCell,
                { flex: 1.5, color: totalBalance[curr] >= 0 ? Colors.success : Colors.error, fontWeight: '700' }
              ]}>
                {formatAmount(totalBalance[curr], curr)}
              </Text>
              <Text style={[styles.tableCell, { fontWeight: '600' }]}>{curr}</Text>
            </View>
          ))}
        </View>

        {/* Client Balances */}
        <View style={styles.clientHeader}>
          <Text style={styles.sectionTitle}>أرصدة العملاء الفردية</Text>
          {unbalancedClients.length > 0 && (
            <View style={styles.warningBadge}>
              <Text style={styles.warningBadgeText}>{unbalancedClients.length} حساب غير صفري</Text>
            </View>
          )}
        </View>

        {clientBalances.map(({ client, balance, usd }) => (
          <Pressable
            key={client.id}
            style={styles.clientCard}
            onPress={() => router.push({ pathname: '/account-statement', params: { clientId: client.id } })}
          >
            <View style={styles.clientRight}>
              <View style={[styles.statusDot, { backgroundColor: Math.abs(usd) < 0.5 ? Colors.success : Colors.error }]} />
              <View>
                <Text style={styles.clientName}>{client.name}</Text>
                <Text style={styles.clientUSD}>
                  {usd >= 0 ? '+' : ''}{formatUSD(usd)} (ما يعادل بالدولار)
                </Text>
              </View>
            </View>
            <View style={styles.clientCurrencies}>
              {CURRENCIES.filter(c => balance[c] !== 0).map(c => (
                <Text key={c} style={[styles.currTag, { color: balance[c] >= 0 ? Colors.success : Colors.error }]}>
                  {c}: {formatAmount(balance[c], c)}
                </Text>
              ))}
              {CURRENCIES.every(c => balance[c] === 0) && (
                <Text style={styles.zeroTag}>رصيد صفري ✓</Text>
              )}
            </View>
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
  alertBanner: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    gap: Spacing.sm,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  alertText: { flex: 1, alignItems: 'flex-end' },
  alertTitle: { fontSize: FontSizes.md, fontWeight: '700' },
  alertSub: { fontSize: FontSizes.xs, marginTop: 2 },
  sectionTitle: {
    fontSize: FontSizes.md,
    fontWeight: '700',
    color: Colors.text.primary,
    textAlign: 'right',
    marginBottom: Spacing.sm,
    marginTop: Spacing.sm,
  },
  compareCard: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.sm,
    gap: 12,
  },
  compareRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  compareKey: { fontSize: FontSizes.md, color: Colors.text.secondary, fontWeight: '600' },
  compareVal: { fontSize: FontSizes.lg, fontWeight: '800' },
  compareDivider: { height: 1, backgroundColor: Colors.divider },
  currencyTable: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
    overflow: 'hidden',
    ...Shadows.sm,
  },
  tableHeader: {
    flexDirection: 'row-reverse',
    backgroundColor: Colors.primary + '12',
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
  },
  tableHeaderCell: {
    fontSize: FontSizes.xs,
    fontWeight: '700',
    color: Colors.text.secondary,
    textAlign: 'right',
    flex: 1,
  },
  tableRow: {
    flexDirection: 'row-reverse',
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  tableCell: { flex: 1, fontSize: FontSizes.md, color: Colors.text.primary, textAlign: 'right' },
  clientHeader: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  warningBadge: {
    backgroundColor: Colors.errorLight,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  warningBadgeText: { fontSize: FontSizes.xs, color: Colors.error, fontWeight: '700' },
  clientCard: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    ...Shadows.sm,
    gap: 8,
  },
  clientRight: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  statusDot: { width: 10, height: 10, borderRadius: 5 },
  clientName: { fontSize: FontSizes.md, fontWeight: '700', color: Colors.text.primary, textAlign: 'right' },
  clientUSD: { fontSize: FontSizes.xs, color: Colors.text.muted, textAlign: 'right' },
  clientCurrencies: { alignItems: 'flex-end', gap: 2 },
  currTag: { fontSize: FontSizes.xs, fontWeight: '600' },
  zeroTag: { fontSize: FontSizes.xs, color: Colors.success, fontWeight: '600' },
});
