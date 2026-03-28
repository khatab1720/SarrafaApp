// Powered by OnSpace.AI
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, Pressable, KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useApp } from '@/hooks/useApp';
import { Colors, Spacing, FontSizes, BorderRadius, Shadows } from '@/constants/theme';

export default function AddClientScreen() {
  const { addClient } = useApp();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const handleSave = () => {
    if (!name.trim()) { Alert.alert('تنبيه', 'يرجى إدخال اسم العميل'); return; }
    addClient(name.trim(), phone.trim() || undefined);
    router.back();
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={[styles.root, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.closeBtn}>
            <MaterialIcons name="close" size={22} color="#fff" />
          </Pressable>
          <Text style={styles.headerTitle}>إضافة عميل جديد</Text>
          <View style={{ width: 38 }} />
        </View>

        <View style={styles.content}>
          <View style={styles.iconWrapper}>
            <MaterialIcons name="person-add" size={40} color={Colors.accent} />
          </View>
          <Text style={styles.subtitle}>أدخل بيانات العميل الجديد</Text>

          <Text style={styles.label}>اسم العميل *</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="مثال: أحمد محمد"
            placeholderTextColor={Colors.text.placeholder}
            textAlign="right"
            autoFocus
          />

          <Text style={styles.label}>رقم الهاتف (اختياري)</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            placeholder="09XXXXXXXX"
            placeholderTextColor={Colors.text.placeholder}
            keyboardType="phone-pad"
            textAlign="right"
          />
        </View>

        <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
          <Pressable style={styles.cancelBtn} onPress={() => router.back()}>
            <Text style={styles.cancelText}>إلغاء</Text>
          </Pressable>
          <Pressable style={styles.saveBtn} onPress={handleSave}>
            <MaterialIcons name="check" size={20} color={Colors.primary} />
            <Text style={styles.saveText}>حفظ العميل</Text>
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
  },
  headerTitle: { fontSize: FontSizes.lg, fontWeight: '700', color: '#fff' },
  closeBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  content: { flex: 1, padding: Spacing.lg },
  iconWrapper: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: Colors.primary,
    alignItems: 'center', justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: Spacing.md,
    ...Shadows.md,
  },
  subtitle: { fontSize: FontSizes.md, color: Colors.text.secondary, textAlign: 'center', marginBottom: Spacing.xl },
  label: { fontSize: FontSizes.sm, fontWeight: '600', color: Colors.text.secondary, marginBottom: 6, textAlign: 'right' },
  input: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    height: 52,
    borderWidth: 1.5,
    borderColor: Colors.border,
    fontSize: FontSizes.md,
    color: Colors.text.primary,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  footer: {
    flexDirection: 'row-reverse',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    gap: Spacing.sm,
    backgroundColor: Colors.card,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  cancelBtn: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: 14,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  cancelText: { fontSize: FontSizes.md, fontWeight: '700', color: Colors.text.secondary },
  saveBtn: {
    flex: 1,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.accent,
    borderRadius: BorderRadius.md,
    paddingVertical: 14,
    gap: 8,
    ...Shadows.md,
    shadowColor: Colors.accent,
  },
  saveText: { fontSize: FontSizes.lg, fontWeight: '800', color: Colors.primary },
});
