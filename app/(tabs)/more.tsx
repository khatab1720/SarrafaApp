// Powered by OnSpace.AI
import React from 'react';
import {
  View, Text, StyleSheet, Pressable, ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Spacing, FontSizes, BorderRadius, Shadows } from '@/constants/theme';

const MENU_ITEMS: {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  sub: string;
  route: string;
  color: string;
}[] = [
  { icon: 'bar-chart', label: 'التقارير والإحصائيات', sub: 'ملخص حركة العملات', route: '/reports', color: '#1E88E5' },
  { icon: 'description', label: 'كشف الحساب', sub: 'تفاصيل حسابات العملاء', route: '/account-statement', color: '#43A047' },
  { icon: 'balance', label: 'المراجعة والمصالحة', sub: 'تدقيق الأرصدة والفروقات', route: '/reconciliation', color: '#E53935' },
  { icon: 'people', label: 'إدارة العملاء', sub: 'إضافة وتعديل الحسابات', route: '/(tabs)/accounts', color: '#8E24AA' },
];

export default function MoreScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>القائمة الرئيسية</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.appInfo}>
          <View style={styles.logoCircle}>
            <MaterialIcons name="account-balance" size={32} color={Colors.accent} />
          </View>
          <Text style={styles.appName}>مكتب الصرافة</Text>
          <Text style={styles.appSub}>نظام إدارة العملات والحسابات</Text>
        </View>

        <Text style={styles.sectionLabel}>الخدمات والأدوات</Text>

        {MENU_ITEMS.map(item => (
          <Pressable
            key={item.route}
            style={({ pressed }) => [styles.menuItem, pressed && { opacity: 0.8 }]}
            onPress={() => router.push(item.route as any)}
          >
            <MaterialIcons name="chevron-left" size={22} color={Colors.text.muted} />
            <View style={styles.menuText}>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Text style={styles.menuSub}>{item.sub}</Text>
            </View>
            <View style={[styles.menuIcon, { backgroundColor: `${item.color}18` }]}>
              <MaterialIcons name={item.icon} size={22} color={item.color} />
            </View>
          </Pressable>
        ))}

        <View style={styles.versionContainer}>
          <Text style={styles.version}>الإصدار 1.0.0 — مكتب الصرافة</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  header: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
  },
  headerTitle: { fontSize: FontSizes.xl, fontWeight: '700', color: '#fff', textAlign: 'right' },
  content: { padding: Spacing.md, paddingBottom: 100 },
  appInfo: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
    ...Shadows.md,
  },
  appName: { fontSize: FontSizes.xxl, fontWeight: '800', color: Colors.text.primary },
  appSub: { fontSize: FontSizes.sm, color: Colors.text.muted, marginTop: 4 },
  sectionLabel: {
    fontSize: FontSizes.sm,
    color: Colors.text.muted,
    fontWeight: '600',
    marginBottom: Spacing.sm,
    textAlign: 'right',
  },
  menuItem: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: Spacing.md,
    ...Shadows.sm,
  },
  menuIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuText: { flex: 1, alignItems: 'flex-end' },
  menuLabel: { fontSize: FontSizes.md, fontWeight: '700', color: Colors.text.primary },
  menuSub: { fontSize: FontSizes.xs, color: Colors.text.muted, marginTop: 2 },
  versionContainer: { alignItems: 'center', paddingTop: Spacing.xl },
  version: { color: Colors.text.muted, fontSize: FontSizes.xs },
});
