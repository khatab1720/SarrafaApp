// Powered by OnSpace.AI
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, Pressable, TextInput, ScrollView,
  KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useApp } from '@/hooks/useApp';
import { Colors, Spacing, FontSizes, BorderRadius, Shadows } from '@/constants/theme';
import { Currency, TransactionType } from '@/services/dataService';

const CURRENCIES: Currency[] = ['USD', 'EUR', 'SYP', 'TRY'];
const CURRENCY_SYMBOLS: Record<Currency, string> = { USD: '$', EUR: '€', SYP: 'ل.س', TRY: '₺' };
const CURRENCY_FLAGS: Record<Currency, string> = { USD: '🇺🇸', EUR: '🇪🇺', SYP: '🟩', TRY: '🇹🇷' };

export default function AddTransactionScreen() {
  const { clients, addTransaction, addClient } = useApp();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [selectedClientId, setSelectedClientId] = useState('');
  const [showClientList, setShowClientList] = useState(false);
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState<Currency>('USD');
  const [txType, setTxType] = useState<TransactionType>('take');
  const [notes, setNotes] = useState('');
  const [isDoubleEntry, setIsDoubleEntry] = useState(false);
  const [counterAmount, setCounterAmount] = useState('');
  const [counterCurrency, setCounterCurrency] = useState<Currency>('SYP');
  const [counterClientName, setCounterClientName] = useState('');
  const [newClientName, setNewClientName] = useState('');
  const [showNewClient, setShowNewClient] = useState(false);
  const [clientSearch, setClientSearch] = useState('');

  const selectedClient = clients.find(c => c.id === selectedClientId);
  const filteredClients = clients.filter(c =>
    c.name.includes(clientSearch) || c.name.toLowerCase().includes(clientSearch.toLowerCase())
  );

  const handleSave = () => {
    if (!selectedClientId) { Alert.alert('تنبيه', 'يرجى اختيار الحساب'); return; }
    if (!amount || parseFloat(amount) <= 0) { Alert.alert('تنبيه', 'يرجى إدخال مبلغ صحيح'); return; }
    addTransaction({
      clientId: selectedClientId,
      amount: parseFloat(amount),
      currency,
      type: txType,
      notes,
      isDoubleEntry,
      counterAmount: isDoubleEntry && counterAmount ? parseFloat(counterAmount) : undefined,
      counterCurrency: isDoubleEntry ? counterCurrency : undefined,
      counterClientName: isDoubleEntry && counterClientName ? counterClientName : undefined,
    });
    router.back();
  };

  const handleAddClient = () => {
    if (!newClientName.trim()) return;
    const c = addClient(newClientName.trim());
    setSelectedClientId(c.id);
    setShowNewClient(false);
    setShowClientList(false);
    setNewClientName('');
    setClientSearch('');
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={[styles.root, { paddingTop: insets.top }]}>

        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.closeBtn}>
            <MaterialIcons name="close" size={20} color="#fff" />
          </Pressable>
          <Text style={styles.headerTitle}>معاملة جديدة</Text>
          <View style={{ width: 38 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >

          {/* ── نوع المعاملة ── */}
          <View style={styles.typeRow}>
            <Pressable
              style={[styles.typeBtn, txType === 'take' && styles.typeBtnActive,
                txType === 'take' && { backgroundColor: Colors.success, borderColor: Colors.success }]}
              onPress={() => setTxType('take')}
            >
              <MaterialIcons name="arrow-circle-down" size={24} color={txType === 'take' ? '#fff' : Colors.success} />
              <View>
                <Text style={[styles.typeBtnMain, txType === 'take' && { color: '#fff' }]}>لنا</Text>
                <Text style={[styles.typeBtnSub, txType === 'take' && { color: 'rgba(255,255,255,0.72)' }]}>
                  العميل مدين
                </Text>
              </View>
            </Pressable>
            <Pressable
              style={[styles.typeBtn, txType === 'give' && styles.typeBtnActive,
                txType === 'give' && { backgroundColor: Colors.error, borderColor: Colors.error }]}
              onPress={() => setTxType('give')}
            >
              <MaterialIcons name="arrow-circle-up" size={24} color={txType === 'give' ? '#fff' : Colors.error} />
              <View>
                <Text style={[styles.typeBtnMain, txType === 'give' && { color: '#fff' }]}>له</Text>
                <Text style={[styles.typeBtnSub, txType === 'give' && { color: 'rgba(255,255,255,0.72)' }]}>
                  نحن مدينون
                </Text>
              </View>
            </Pressable>
          </View>

          {/* ── المبلغ والعملة ── */}
          <View style={styles.amountCard}>
            <Text style={styles.fieldLabel}>المبلغ</Text>
            <View style={styles.amountRow}>
              <View style={styles.symbolBox}>
                <Text style={styles.symbolText}>{CURRENCY_SYMBOLS[currency]}</Text>
              </View>
              <TextInput
                style={styles.amountInput}
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
                placeholder="0.00"
                placeholderTextColor={Colors.text.placeholder}
                textAlign="right"
              />
            </View>
            {/* Currency Pills */}
            <View style={styles.currRow}>
              {CURRENCIES.map(c => (
                <Pressable
                  key={c}
                  style={[styles.currPill, currency === c && { backgroundColor: Colors.primary, borderColor: Colors.primary }]}
                  onPress={() => setCurrency(c)}
                >
                  <Text style={styles.currFlag}>{CURRENCY_FLAGS[c]}</Text>
                  <Text style={[styles.currCode, currency === c && { color: '#fff' }]}>{c}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* ── العميل / الحساب ── */}
          <View style={styles.section}>
            <Text style={styles.fieldLabel}>الحساب</Text>
            <Pressable
              style={[styles.dropdown, showClientList && { borderColor: Colors.primary, borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }]}
              onPress={() => { setShowClientList(!showClientList); setShowNewClient(false); }}
            >
              <MaterialIcons name={showClientList ? 'expand-less' : 'expand-more'} size={22} color={Colors.text.muted} />
              <Text style={[styles.dropdownText, !selectedClient && { color: Colors.text.placeholder }]}>
                {selectedClient ? selectedClient.name : 'اختر الحساب...'}
              </Text>
              <View style={styles.dropdownIcon}>
                <MaterialIcons name="account-balance-wallet" size={17} color={Colors.primaryLight} />
              </View>
            </Pressable>

            {showClientList && (
              <View style={styles.clientDropdown}>
                <View style={styles.clientSearchRow}>
                  <MaterialIcons name="search" size={17} color={Colors.text.muted} />
                  <TextInput
                    style={styles.clientSearchInput}
                    placeholder="ابحث..."
                    value={clientSearch}
                    onChangeText={setClientSearch}
                    textAlign="right"
                    placeholderTextColor={Colors.text.placeholder}
                  />
                </View>
                <ScrollView style={{ maxHeight: 200 }} nestedScrollEnabled>
                  {filteredClients.map(c => (
                    <Pressable
                      key={c.id}
                      style={[styles.clientItem, selectedClientId === c.id && styles.clientItemActive]}
                      onPress={() => { setSelectedClientId(c.id); setShowClientList(false); setClientSearch(''); }}
                    >
                      <View style={styles.clientItemLeft}>
                        {c.isPermanent && <MaterialIcons name="lock" size={12} color={Colors.accent} />}
                      </View>
                      <Text style={[styles.clientItemText, selectedClientId === c.id && { color: Colors.primary, fontWeight: '700' }]}>
                        {c.name}
                      </Text>
                    </Pressable>
                  ))}
                  {filteredClients.length === 0 && (
                    <View style={styles.noResults}>
                      <Text style={styles.noResultsText}>لا توجد نتائج</Text>
                    </View>
                  )}
                </ScrollView>
                <Pressable
                  style={styles.addClientRow}
                  onPress={() => { setShowNewClient(true); setShowClientList(false); }}
                >
                  <MaterialIcons name="person-add" size={16} color={Colors.primary} />
                  <Text style={styles.addClientText}>إضافة عميل جديد</Text>
                </Pressable>
              </View>
            )}

            {showNewClient && (
              <View style={styles.newClientBox}>
                <Text style={styles.newClientLabel}>اسم العميل الجديد</Text>
                <View style={styles.newClientRow}>
                  <TextInput
                    style={styles.newClientInput}
                    value={newClientName}
                    onChangeText={setNewClientName}
                    placeholder="أدخل الاسم..."
                    textAlign="right"
                    placeholderTextColor={Colors.text.placeholder}
                    autoFocus
                  />
                  <Pressable style={styles.addBtn} onPress={handleAddClient}>
                    <Text style={styles.addBtnText}>إضافة</Text>
                  </Pressable>
                  <Pressable style={styles.cancelBtn} onPress={() => setShowNewClient(false)}>
                    <MaterialIcons name="close" size={17} color={Colors.text.muted} />
                  </Pressable>
                </View>
              </View>
            )}
          </View>

          {/* ── ملاحظات ── */}
          <View style={styles.section}>
            <Text style={styles.fieldLabel}>ملاحظات (اختياري)</Text>
            <TextInput
              style={styles.notesInput}
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={3}
              placeholder="أضف ملاحظة..."
              textAlign="right"
              textAlignVertical="top"
              placeholderTextColor={Colors.text.placeholder}
            />
          </View>

          {/* ── قيد مزدوج ── */}
          <View style={styles.section}>
            <Pressable style={styles.toggleRow} onPress={() => setIsDoubleEntry(!isDoubleEntry)}>
              <View style={[styles.toggle, isDoubleEntry && { backgroundColor: Colors.primary }]}>
                <View style={[styles.knob, isDoubleEntry && styles.knobOn]} />
              </View>
              <View style={styles.toggleInfo}>
                <Text style={styles.toggleLabel}>قيد مزدوج</Text>
                <Text style={styles.toggleSub}>ربط معاملة بعملة أو طرف آخر</Text>
              </View>
              <MaterialIcons name="compare-arrows" size={20} color={isDoubleEntry ? Colors.primary : Colors.text.muted} />
            </Pressable>

            {isDoubleEntry && (
              <View style={styles.doubleBox}>
                <Text style={styles.fieldLabel}>اسم الطرف الآخر (اختياري)</Text>
                <TextInput
                  style={styles.fieldInput}
                  value={counterClientName}
                  onChangeText={setCounterClientName}
                  placeholder="اسم الطرف المقابل..."
                  textAlign="right"
                  placeholderTextColor={Colors.text.placeholder}
                />
                <Text style={[styles.fieldLabel, { marginTop: Spacing.sm }]}>المبلغ المقابل</Text>
                <TextInput
                  style={styles.fieldInput}
                  value={counterAmount}
                  onChangeText={setCounterAmount}
                  keyboardType="numeric"
                  placeholder="0.00"
                  placeholderTextColor={Colors.text.placeholder}
                  textAlign="right"
                />
                <View style={styles.currRow}>
                  {CURRENCIES.filter(c => c !== currency).map(c => (
                    <Pressable
                      key={c}
                      style={[styles.currPill, counterCurrency === c && { backgroundColor: Colors.primary, borderColor: Colors.primary }]}
                      onPress={() => setCounterCurrency(c)}
                    >
                      <Text style={styles.currFlag}>{CURRENCY_FLAGS[c]}</Text>
                      <Text style={[styles.currCode, counterCurrency === c && { color: '#fff' }]}>{c}</Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            )}
          </View>

          {/* ── ملخص سريع ── */}
          {selectedClient && amount && parseFloat(amount) > 0 && (
            <View style={[styles.summary, { borderColor: txType === 'take' ? Colors.success : Colors.error }]}>
              <View style={[styles.summaryBadge,
                { backgroundColor: txType === 'take' ? Colors.successLight : Colors.errorLight }
              ]}>
                <Text style={[styles.summaryBadgeText, { color: txType === 'take' ? Colors.success : Colors.error }]}>
                  {txType === 'take' ? 'لنا' : 'له'}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryVal, { color: txType === 'take' ? Colors.success : Colors.error }]}>
                  {amount} {CURRENCY_SYMBOLS[currency]}
                </Text>
                <Text style={styles.summaryKey}>المبلغ</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryVal}>{selectedClient.name}</Text>
                <Text style={styles.summaryKey}>الحساب</Text>
              </View>
              {isDoubleEntry && counterClientName ? (
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryVal}>{counterClientName}</Text>
                  <Text style={styles.summaryKey}>الطرف الآخر</Text>
                </View>
              ) : null}
            </View>
          )}
        </ScrollView>

        {/* Save Button */}
        <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
          <Pressable
            style={({ pressed }) => [styles.saveBtn, { opacity: pressed ? 0.86 : 1 }]}
            onPress={handleSave}
          >
            <MaterialIcons name="check-circle" size={22} color={Colors.primary} />
            <Text style={styles.saveBtnText}>
              حفظ — {txType === 'take' ? 'لنا ✓' : 'له ✓'}
            </Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
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
  headerTitle: { fontSize: FontSizes.lg, fontWeight: '800', color: '#fff', letterSpacing: 0.2 },
  closeBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },

  content: { padding: Spacing.md, paddingBottom: 120 },

  // Type toggle
  typeRow: { flexDirection: 'row-reverse', gap: Spacing.sm, marginBottom: Spacing.md },
  typeBtn: {
    flex: 1, flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 16, borderRadius: BorderRadius.xl,
    borderWidth: 2, borderColor: Colors.border,
    backgroundColor: Colors.card, gap: 10, ...Shadows.sm,
  },
  typeBtnActive: {},
  typeBtnMain: { fontSize: FontSizes.xl, fontWeight: '800', color: Colors.text.primary, textAlign: 'right' },
  typeBtnSub: { fontSize: FontSizes.xs, color: Colors.text.muted, textAlign: 'right' },

  // Amount Card
  amountCard: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.sm,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  fieldLabel: {
    fontSize: FontSizes.sm, fontWeight: '700', color: Colors.text.secondary,
    textAlign: 'right', marginBottom: 8,
  },
  amountRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.sm },
  symbolBox: {
    backgroundColor: Colors.primary, borderRadius: BorderRadius.md,
    paddingHorizontal: 14, paddingVertical: 10, minWidth: 46, alignItems: 'center',
  },
  symbolText: { color: '#fff', fontWeight: '900', fontSize: FontSizes.lg },
  amountInput: {
    flex: 1, height: 64,
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    borderWidth: 2, borderColor: Colors.primary,
    fontSize: 30, fontWeight: '800', color: Colors.text.primary,
  },
  currRow: { flexDirection: 'row-reverse', gap: Spacing.sm, flexWrap: 'wrap' },
  currPill: {
    flex: 1, flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 8, gap: 4,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5, borderColor: Colors.border,
    backgroundColor: Colors.background,
  },
  currFlag: { fontSize: 14 },
  currCode: { fontSize: FontSizes.sm, fontWeight: '700', color: Colors.text.secondary },

  // Sections
  section: { marginBottom: Spacing.md },
  dropdown: {
    backgroundColor: Colors.card, borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md, height: 54,
    flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between',
    borderWidth: 1.5, borderColor: Colors.border, ...Shadows.sm,
  },
  dropdownText: { flex: 1, fontSize: FontSizes.md, color: Colors.text.primary, textAlign: 'right', marginHorizontal: 8 },
  dropdownIcon: {
    width: 34, height: 34, borderRadius: BorderRadius.sm,
    backgroundColor: Colors.primarySurface,
    alignItems: 'center', justifyContent: 'center',
  },
  clientDropdown: {
    backgroundColor: Colors.card,
    borderWidth: 1.5, borderColor: Colors.primary,
    borderTopWidth: 0,
    borderBottomLeftRadius: BorderRadius.lg, borderBottomRightRadius: BorderRadius.lg,
    overflow: 'hidden', ...Shadows.sm,
  },
  clientSearchRow: {
    flexDirection: 'row-reverse', alignItems: 'center',
    padding: Spacing.sm, borderBottomWidth: 1, borderBottomColor: Colors.divider, gap: 6,
  },
  clientSearchInput: { flex: 1, height: 36, color: Colors.text.primary, fontSize: FontSizes.md },
  clientItem: {
    flexDirection: 'row-reverse', alignItems: 'center',
    paddingHorizontal: Spacing.md, paddingVertical: 13,
    borderBottomWidth: 1, borderBottomColor: Colors.divider, gap: Spacing.sm,
  },
  clientItemActive: { backgroundColor: Colors.primarySurface },
  clientItemLeft: { width: 16, alignItems: 'center' },
  clientItemText: { fontSize: FontSizes.md, color: Colors.text.primary, flex: 1, textAlign: 'right' },
  noResults: { padding: Spacing.md, alignItems: 'center' },
  noResultsText: { color: Colors.text.muted, fontSize: FontSizes.sm },
  addClientRow: {
    flexDirection: 'row-reverse', alignItems: 'center',
    paddingHorizontal: Spacing.md, paddingVertical: 14,
    gap: Spacing.sm, borderTopWidth: 1, borderTopColor: Colors.divider,
  },
  addClientText: { fontSize: FontSizes.md, color: Colors.primary, fontWeight: '700' },

  newClientBox: {
    backgroundColor: Colors.primarySurface,
    borderRadius: BorderRadius.lg, padding: Spacing.md,
    marginTop: Spacing.sm,
    borderWidth: 1, borderColor: Colors.primaryLight + '30',
  },
  newClientLabel: { fontSize: FontSizes.sm, fontWeight: '700', color: Colors.primary, textAlign: 'right', marginBottom: 8 },
  newClientRow: { flexDirection: 'row-reverse', gap: Spacing.sm, alignItems: 'center' },
  newClientInput: {
    flex: 1, height: 44, backgroundColor: Colors.card,
    borderRadius: BorderRadius.md, paddingHorizontal: Spacing.md,
    borderWidth: 1, borderColor: Colors.border,
    fontSize: FontSizes.md, color: Colors.text.primary,
  },
  addBtn: {
    backgroundColor: Colors.primary, paddingHorizontal: Spacing.md,
    paddingVertical: 10, borderRadius: BorderRadius.md,
  },
  addBtnText: { color: '#fff', fontWeight: '700', fontSize: FontSizes.sm },
  cancelBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: Colors.border, alignItems: 'center', justifyContent: 'center',
  },

  notesInput: {
    backgroundColor: Colors.card, borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md, paddingTop: 12,
    height: 90, borderWidth: 1.5, borderColor: Colors.border,
    fontSize: FontSizes.md, color: Colors.text.primary, ...Shadows.sm,
  },

  // Double Entry
  toggleRow: {
    flexDirection: 'row-reverse', alignItems: 'center',
    backgroundColor: Colors.card, borderRadius: BorderRadius.xl,
    padding: Spacing.md, gap: Spacing.sm, ...Shadows.sm,
    borderWidth: 1, borderColor: Colors.borderLight,
  },
  toggle: { width: 50, height: 28, borderRadius: 14, backgroundColor: Colors.border, justifyContent: 'center', paddingHorizontal: 3 },
  knob: { width: 22, height: 22, borderRadius: 11, backgroundColor: '#fff', alignSelf: 'flex-end', ...Shadows.sm },
  knobOn: { alignSelf: 'flex-start' },
  toggleInfo: { flex: 1, alignItems: 'flex-end' },
  toggleLabel: { fontSize: FontSizes.md, color: Colors.text.primary, fontWeight: '700' },
  toggleSub: { fontSize: FontSizes.xs, color: Colors.text.muted },

  doubleBox: {
    backgroundColor: Colors.card, borderRadius: BorderRadius.xl,
    padding: Spacing.md, marginTop: Spacing.sm,
    borderWidth: 1, borderColor: Colors.borderLight,
  },
  fieldInput: {
    backgroundColor: Colors.background, borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md, height: 48,
    borderWidth: 1, borderColor: Colors.border,
    fontSize: FontSizes.md, color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },

  // Summary
  summary: {
    borderRadius: BorderRadius.xl, padding: Spacing.md,
    borderWidth: 2, backgroundColor: Colors.card, gap: 8, ...Shadows.sm,
  },
  summaryBadge: {
    alignSelf: 'flex-end', paddingHorizontal: 12, paddingVertical: 4,
    borderRadius: BorderRadius.full, marginBottom: 4,
  },
  summaryBadgeText: { fontSize: FontSizes.sm, fontWeight: '800' },
  summaryRow: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center' },
  summaryKey: { fontSize: FontSizes.sm, color: Colors.text.muted },
  summaryVal: { fontSize: FontSizes.md, fontWeight: '700', color: Colors.text.primary },

  // Footer
  footer: {
    paddingHorizontal: Spacing.md, paddingTop: Spacing.sm,
    backgroundColor: Colors.card,
    borderTopWidth: 1, borderTopColor: Colors.borderLight,
  },
  saveBtn: {
    flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center',
    backgroundColor: Colors.accent, borderRadius: BorderRadius.xl,
    paddingVertical: 17, gap: 10, ...Shadows.accent,
  },
  saveBtnText: { fontSize: FontSizes.lg, fontWeight: '800', color: Colors.primary },
});
