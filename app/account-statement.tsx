// Powered by OnSpace.AI
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput, Pressable, Alert, ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { useApp } from '@/hooks/useApp';
import { Colors, Spacing, FontSizes, BorderRadius, Shadows } from '@/constants/theme';
import { formatAmount, formatUSD, balanceToUSD, Currency } from '@/services/dataService';
import TransactionRow from '@/components/ui/TransactionRow';

const CURRENCIES: Currency[] = ['USD', 'EUR', 'SYP', 'TRY'];
const CURR_ICONS: Record<Currency, string> = { USD: '🇺🇸', EUR: '🇪🇺', SYP: '🟩⬜⬛', TRY: '🇹🇷' };
const CURR_SYMBOLS: Record<Currency, string> = { USD: '$', EUR: '€', SYP: 'ل.س', TRY: '₺' };

function buildPdfHtml(
  clientName: string,
  totalUSD: number,
  balance: Record<Currency, number>,
  transactions: any[],
  exportDate: string
): string {
  const isPositive = totalUSD >= 0;

  const txRows = transactions.map(tx => {
    const isGive = tx.type === 'give';
    const amtStr = `${isGive ? '-' : '+'}${formatAmount(tx.amount, tx.currency)}`;
    return `
      <tr>
        <td style="color:${isGive ? '#DC2626' : '#16A34A'};font-weight:600">${amtStr}</td>
        <td>${tx.notes || '—'}</td>
        <td>${tx.time}</td>
        <td>${tx.date}</td>
        <td style="color:${isGive ? '#DC2626' : '#16A34A'};font-weight:700">${isGive ? 'له' : 'لنا'}</td>
        <td>${tx.currency}</td>
      </tr>
    `;
  }).join('');

  const balanceRows = CURRENCIES
    .filter(c => balance[c] !== 0)
    .map(c => `
      <tr>
        <td style="color:${balance[c] >= 0 ? '#16A34A' : '#DC2626'};font-weight:700">
          ${balance[c] >= 0 ? '+' : ''}${formatAmount(balance[c], c)}
        </td>
        <td>${c}</td>
      </tr>
    `).join('');

  return `<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Cairo', 'Arial', sans-serif;
      background: #F8FAFC;
      color: #0D2137;
      direction: rtl;
      padding: 0;
    }
    .page { max-width: 800px; margin: 0 auto; background: #fff; min-height: 100vh; }

    /* Header */
    .header {
      background: linear-gradient(135deg, #0C1E3E 0%, #1A4299 100%);
      color: #fff;
      padding: 32px 36px 24px;
      border-radius: 0 0 24px 24px;
    }
    .header-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; }
    .brand { display: flex; align-items: center; gap: 12px; }
    .brand-icon {
      width: 48px; height: 48px; border-radius: 12px;
      background: rgba(232,160,32,0.2);
      border: 2px solid rgba(232,160,32,0.5);
      display: flex; align-items: center; justify-content: center;
      font-size: 22px;
    }
    .brand-name { font-size: 22px; font-weight: 900; color: #F0B429; }
    .brand-sub { font-size: 12px; color: rgba(255,255,255,0.6); margin-top: 2px; }
    .header-date { font-size: 12px; color: rgba(255,255,255,0.5); text-align: left; }

    .client-section { text-align: center; }
    .client-label { font-size: 13px; color: rgba(255,255,255,0.55); margin-bottom: 4px; }
    .client-name { font-size: 26px; font-weight: 900; color: #fff; }
    .balance-pill {
      display: inline-block;
      margin-top: 12px;
      padding: 6px 20px;
      border-radius: 999px;
      font-size: 18px;
      font-weight: 800;
      background: ${isPositive ? 'rgba(22,163,74,0.2)' : 'rgba(220,38,38,0.2)'};
      color: ${isPositive ? '#A8F0B4' : '#F9A8A8'};
      border: 1px solid ${isPositive ? 'rgba(22,163,74,0.4)' : 'rgba(220,38,38,0.4)'};
    }

    /* Body */
    .body { padding: 28px 36px; }

    .section-title {
      font-size: 15px; font-weight: 700; color: #4B6278;
      border-right: 4px solid #F0B429;
      padding-right: 10px;
      margin-bottom: 14px;
      margin-top: 24px;
    }

    /* Balance grid */
    .balance-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 8px; }
    .balance-card {
      border-radius: 14px;
      padding: 14px 16px;
      background: #F8FAFC;
      border: 1px solid #E2EAF0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .balance-curr { font-size: 13px; font-weight: 700; color: #8FA3B1; }
    .balance-amount { font-size: 16px; font-weight: 800; }

    /* Transactions table */
    table { width: 100%; border-collapse: collapse; font-size: 13px; }
    thead tr { background: #0D2137; color: #fff; }
    thead th { padding: 10px 12px; text-align: right; font-weight: 700; font-size: 12px; }
    tbody tr { border-bottom: 1px solid #EDF2F7; }
    tbody tr:nth-child(even) { background: #F8FAFC; }
    tbody td { padding: 10px 12px; text-align: right; vertical-align: middle; }

    /* Footer */
    .footer {
      margin-top: 32px;
      padding: 20px 36px;
      background: #F8FAFC;
      border-top: 2px solid #E2EAF0;
      text-align: center;
      font-size: 11px;
      color: #8FA3B1;
    }
    .footer strong { color: #F0B429; }
  </style>
</head>
<body>
<div class="page">
  <!-- Header -->
  <div class="header">
    <div class="header-top">
      <div class="brand">
        <div class="brand-icon">💱</div>
        <div>
          <div class="brand-name">مكتب الصرافة</div>
          <div class="brand-sub">نظام إدارة العملات والحسابات</div>
        </div>
      </div>
      <div class="header-date">
        <div>تاريخ الإصدار</div>
        <div style="font-weight:700;color:rgba(255,255,255,0.8)">${exportDate}</div>
      </div>
    </div>
    <div class="client-section">
      <div class="client-label">كشف حساب</div>
      <div class="client-name">${clientName}</div>
      <div class="balance-pill">
        ${isPositive ? '+' : '-'}${formatUSD(Math.abs(totalUSD))} إجمالي بالدولار
      </div>
    </div>
  </div>

  <!-- Body -->
  <div class="body">
    <!-- Balance by currency -->
    <div class="section-title">الأرصدة حسب العملة</div>
    <div class="balance-grid">
      ${CURRENCIES.map(c => `
        <div class="balance-card">
          <div class="balance-curr">${c}</div>
          <div class="balance-amount" style="color:${balance[c] >= 0 ? '#16A34A' : '#DC2626'}">
            ${balance[c] >= 0 ? '+' : ''}${formatAmount(balance[c], c)}
          </div>
        </div>
      `).join('')}
    </div>

    <!-- Transactions -->
    <div class="section-title">تفاصيل المعاملات (${transactions.length})</div>
    ${transactions.length === 0
      ? '<p style="text-align:center;color:#8FA3B1;padding:24px">لا توجد معاملات مسجلة</p>'
      : `<table>
          <thead>
            <tr>
              <th>العملة</th>
              <th>النوع</th>
              <th>المبلغ</th>
              <th>ملاحظات</th>
              <th>الوقت</th>
              <th>التاريخ</th>
            </tr>
          </thead>
          <tbody>${txRows}</tbody>
        </table>`
    }
  </div>

  <!-- Footer -->
  <div class="footer">
    تم إنشاء هذا الكشف بواسطة <strong>نظام مكتب الصرافة</strong> — ${exportDate}
    <br/>جميع المبالغ بالعملات الأصلية · هذا المستند للاطلاع الشخصي فقط
  </div>
</div>
</body>
</html>`;
}

export default function AccountStatementScreen() {
  const { clients, getClientBalance, getClientTransactions, deleteTransaction } = useApp();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ clientId?: string }>();
  const [selectedClientId, setSelectedClientId] = useState(params.clientId || '');
  const [search, setSearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(!params.clientId);
  const [exporting, setExporting] = useState(false);

  const filteredClients = clients.filter(c =>
    c.name.includes(search) || c.name.toLowerCase().includes(search.toLowerCase())
  );
  const selectedClient = clients.find(c => c.id === selectedClientId);
  const balance = selectedClient ? getClientBalance(selectedClientId) : null;
  const txList = selectedClient ? getClientTransactions(selectedClientId) : [];
  const totalUSD = balance ? balanceToUSD(balance) : 0;

  const handleExportPDF = async () => {
    if (!selectedClient || !balance) return;
    setExporting(true);
    try {
      const now = new Date();
      const exportDate = now.toLocaleDateString('ar-EG', {
        year: 'numeric', month: 'long', day: 'numeric',
      });
      const html = buildPdfHtml(
        selectedClient.name,
        totalUSD,
        balance,
        txList,
        exportDate
      );
      const { uri } = await Print.printToFileAsync({ html, base64: false });
      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(uri, {
          mimeType: 'application/pdf',
          dialogTitle: `كشف حساب — ${selectedClient.name}`,
          UTI: 'com.adobe.pdf',
        });
      } else {
        Alert.alert('تم الإنشاء', 'تم إنشاء ملف PDF بنجاح.');
      }
    } catch (e) {
      Alert.alert('خطأ', 'تعذّر إنشاء ملف PDF. يرجى المحاولة مرة أخرى.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <MaterialIcons name="arrow-forward" size={22} color="#fff" />
        </Pressable>
        <Text style={styles.headerTitle}>كشف الحساب</Text>
        {selectedClient ? (
          <Pressable
            style={[styles.exportBtn, exporting && { opacity: 0.7 }]}
            onPress={handleExportPDF}
            disabled={exporting}
          >
            {exporting ? (
              <ActivityIndicator size="small" color={Colors.primary} />
            ) : (
              <MaterialIcons name="picture-as-pdf" size={17} color={Colors.primary} />
            )}
            <Text style={styles.exportBtnText}>{exporting ? 'جارٍ...' : 'PDF'}</Text>
          </Pressable>
        ) : (
          <View style={{ width: 70 }} />
        )}
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Client Selector */}
        <Pressable style={styles.dropdown} onPress={() => setShowDropdown(!showDropdown)}>
          <MaterialIcons name={showDropdown ? 'expand-less' : 'expand-more'} size={22} color={Colors.text.muted} />
          <Text style={[styles.dropdownText, !selectedClient && { color: Colors.text.placeholder }]}>
            {selectedClient ? selectedClient.name : 'اختر الحساب للبحث...'}
          </Text>
          <MaterialIcons name="account-balance-wallet" size={18} color={Colors.text.muted} />
        </Pressable>

        {showDropdown && (
          <View style={styles.dropdownList}>
            <View style={styles.searchBox}>
              <MaterialIcons name="search" size={17} color={Colors.text.muted} />
              <TextInput
                style={styles.searchInput}
                placeholder="ابحث عن حساب..."
                value={search}
                onChangeText={setSearch}
                textAlign="right"
                placeholderTextColor={Colors.text.placeholder}
              />
            </View>
            {filteredClients.map(c => (
              <Pressable
                key={c.id}
                style={[styles.clientItem, selectedClientId === c.id && styles.clientItemActive]}
                onPress={() => { setSelectedClientId(c.id); setShowDropdown(false); setSearch(''); }}
              >
                {c.isPermanent && (
                  <MaterialIcons name="lock" size={13} color={Colors.accent} style={{ marginLeft: 4 }} />
                )}
                <Text style={[styles.clientItemText, selectedClientId === c.id && { color: Colors.primary, fontWeight: '700' }]}>
                  {c.name}
                </Text>
              </Pressable>
            ))}
          </View>
        )}

        {selectedClient && balance && (
          <>
            {/* Balance Summary */}
            <View style={styles.balanceSummary}>
              <View style={styles.balanceHeader}>
                <Text style={styles.balanceTitle}>{selectedClient.name}</Text>
                <Text style={[styles.balanceTotalUSD, { color: totalUSD >= 0 ? '#A8F0B4' : '#F9A8A8' }]}>
                  {totalUSD >= 0 ? '+' : '-'}{formatUSD(Math.abs(totalUSD))}
                </Text>
                <Text style={styles.balanceSubLabel}>إجمالي الرصيد بالدولار الأمريكي</Text>
              </View>
              <View style={styles.currencyGrid}>
                {CURRENCIES.map(curr => (
                  <View key={curr} style={styles.currCell}>
                    <Text style={styles.currIcon}>{CURR_ICONS[curr]}</Text>
                    <Text style={styles.currCode}>{curr}</Text>
                    <Text style={[styles.currAmount, { color: balance[curr] >= 0 ? '#A8F0B4' : '#F9A8A8' }]}>
                      {balance[curr] >= 0 ? '+' : ''}{formatAmount(balance[curr], curr)}
                    </Text>
                  </View>
                ))}
              </View>
              {/* Export CTA inside summary */}
              <Pressable
                style={[styles.exportCta, exporting && { opacity: 0.7 }]}
                onPress={handleExportPDF}
                disabled={exporting}
              >
                {exporting ? (
                  <ActivityIndicator size="small" color={Colors.primary} />
                ) : (
                  <MaterialIcons name="picture-as-pdf" size={18} color={Colors.primary} />
                )}
                <Text style={styles.exportCtaText}>
                  {exporting ? 'جارٍ إنشاء PDF...' : 'تصدير كشف الحساب PDF'}
                </Text>
              </Pressable>
            </View>

            {/* Transaction List */}
            <Text style={styles.sectionLabel}>سجل المعاملات ({txList.length})</Text>
            {txList.length === 0 ? (
              <View style={styles.empty}>
                <MaterialIcons name="receipt-long" size={48} color={Colors.border} />
                <Text style={styles.emptyText}>لا توجد معاملات لهذا الحساب</Text>
              </View>
            ) : (
              txList.map(tx => (
                <TransactionRow
                  key={tx.id}
                  transaction={tx}
                  showClient={false}
                  onDelete={() => deleteTransaction(tx.id)}
                />
              ))
            )}
          </>
        )}
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
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  headerTitle: { fontSize: FontSizes.xl, fontWeight: '700', color: '#fff', letterSpacing: 0.3 },
  backBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },
  exportBtn: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: Colors.accent,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: BorderRadius.full,
    gap: 4,
  },
  exportBtnText: { fontSize: FontSizes.sm, fontWeight: '700', color: Colors.primary },

  content: { padding: Spacing.md, paddingBottom: 100 },
  dropdown: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.xl,
    paddingHorizontal: Spacing.md,
    height: 52,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.sm,
    ...Shadows.sm,
  },
  dropdownText: { flex: 1, fontSize: FontSizes.md, color: Colors.text.primary, textAlign: 'right', marginHorizontal: 8 },
  dropdownList: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
    ...Shadows.sm,
    overflow: 'hidden',
  },
  searchBox: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    padding: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
    gap: 6,
  },
  searchInput: { flex: 1, height: 36, color: Colors.text.primary, fontSize: FontSizes.md },
  clientItem: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
    gap: 6,
  },
  clientItemActive: { backgroundColor: Colors.primary + '10' },
  clientItemText: { fontSize: FontSizes.md, color: Colors.text.primary, textAlign: 'right', flex: 1 },

  balanceSummary: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.md,
  },
  balanceHeader: { alignItems: 'center', marginBottom: Spacing.md },
  balanceTitle: {
    fontSize: FontSizes.sm, color: 'rgba(255,255,255,0.6)',
    fontWeight: '700', marginBottom: 6, letterSpacing: 0.5,
  },
  balanceTotalUSD: { fontSize: 32, fontWeight: '800', letterSpacing: -0.5 },
  balanceSubLabel: { fontSize: FontSizes.xs, color: 'rgba(255,255,255,0.4)', marginTop: 4 },

  currencyGrid: { flexDirection: 'row-reverse', justifyContent: 'space-around', marginBottom: Spacing.md },
  currCell: { alignItems: 'center', gap: 4 },
  currIcon: { fontSize: 20 },
  currCode: { fontSize: FontSizes.xs, color: 'rgba(255,255,255,0.5)', fontWeight: '600' },
  currAmount: { fontSize: FontSizes.sm, fontWeight: '700' },

  exportCta: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.accent,
    borderRadius: BorderRadius.lg,
    paddingVertical: 12,
    gap: 8,
    ...Shadows.sm,
    shadowColor: Colors.accent,
  },
  exportCtaText: { fontSize: FontSizes.md, fontWeight: '700', color: Colors.primary },

  sectionLabel: { fontSize: FontSizes.md, fontWeight: '700', color: Colors.text.primary, textAlign: 'right', marginBottom: Spacing.sm },
  empty: { alignItems: 'center', paddingVertical: 48, gap: Spacing.sm },
  emptyText: { color: Colors.text.muted, fontSize: FontSizes.md },
});
