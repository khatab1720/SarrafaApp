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
  bg: string;
  iconColor: string;
}[] = [
  {
    icon: 'bar-chart', label: 'التقارير والإحصائيات',
    sub: 'ملخص حركة العملات والأرصدة',
    route: '/reports', bg: Colors.primarySurface, iconColor: Colors.primaryLight,
  },
  {
    icon: 'description', label: 'كشف الحساب',
    sub: 'تفاصيل حسابات العملاء',
    route: '/account-statement', bg: Colors.successLight, iconColor: Colors.success,
  },
  {
    icon: 'balance', label: 'المراجعة والمصالحة',
    sub: 'تدقيق الأرصدة والفروقات',
    route: '/reconciliation', bg: Colors.errorLight, iconColor: Colors.error,
  },
  {
    icon: 'people', label: 'إدارة الحسابات',
    sub: 'إضافة وتعديل الحسابات',
    route: '/(tabs)/accounts', bg: Colors.accentSurface, iconColor: Colors.accent,
  },
];

export default function MoreScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>القائمة</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* App Identity Card */}
        <View style={styles.identityCard}>
          <View style={styles.logoRing}>
            <View style={styles.logoCircle}>
              <MaterialIcons name="account-balance" size={28} color={Colors.accent} />
            </View>
          </View>
          <Text style={styles.appName}>مكتب الصرافة</Text>
          <Text style={styles.appSub}>نظام إدارة العملات والحسابات</Text>
          <View style={styles.versionPill}>
            <Text style={styles.versionText}>الإصدار 1.0.0</Text>
          </View>
        </View>

        <Text style={styles.sectionLabel}>الخدمات والأدوات</Text>

        {MENU_ITEMS.map(item => (
          <Pressable
            key={item.route}
            style={({ pressed }) => [styles.menuCard, pressed && { opacity: 0.80, transform: [{ scale: 0.99 }] }]}
            onPress={() => router.push(item.route as any)}
          >
            <MaterialIcons name="chevron-left" size={20} color={Colors.border} />
            <View style={styles.menuText}>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Text style={styles.menuSub}>{item.sub}</Text>
            </View>
            <View style={[styles.menuIconBox, { backgroundColor: item.bg }]}>
              <MaterialIcons name={item.icon} size={22} color={item.iconColor} />
            </View>
          </Pressable>
        ))}

        <View style={styles.footer}>
          <MaterialIcons name="shield" size={14} color={Colors.text.muted} />
          <Text style={styles.footerText}>بيانات آمنة ومحمية محلياً</Text>
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
  headerTitle: {
    fontSize: FontSizes.xl, fontWeight: '800', color: '#fff', textAlign: 'right', letterSpacing: 0.2,
  },

  content: { padding: Spacing.md, paddingBottom: 110 },

  identityCard: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    ...Shadows.md,
  },
  logoRing: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.10)',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: Spacing.md,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  logoCircle: {
    width: 60, height: 60, borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center', justifyContent: 'center',
  },
  appName: {
    fontSize: FontSizes.xxl, fontWeight: '800', color: '#fff',
    marginBottom: 4, letterSpacing: 0.3,
  },
  appSub: {
    fontSize: FontSizes.sm, color: 'rgba(255,255,255,0.5)',
    marginBottom: Spacing.md, textAlign: 'center',
  },
  versionPill: {
    backgroundColor: Colors.glassLight,
    paddingHorizontal: 14, paddingVertical: 5,
    borderRadius: BorderRadius.full,
    borderWidth: 1, borderColor: Colors.glassBorder,
  },
  versionText: { fontSize: FontSizes.xs, color: 'rgba(255,255,255,0.7)', fontWeight: '600' },

  sectionLabel: {
    fontSize: FontSizes.sm, color: Colors.text.muted, fontWeight: '700',
    marginBottom: Spacing.sm, textAlign: 'right', letterSpacing: 0.3,
  },

  menuCard: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: Spacing.md,
    ...Shadows.sm,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  menuIconBox: {
    width: 50, height: 50,
    borderRadius: BorderRadius.lg,
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  menuText: { flex: 1, alignItems: 'flex-end' },
  menuLabel: { fontSize: FontSizes.md, fontWeight: '700', color: Colors.text.primary },
  menuSub: { fontSize: FontSizes.xs, color: Colors.text.muted, marginTop: 2 },

  footer: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 5, paddingTop: Spacing.lg,
  },
  footerText: { color: Colors.text.muted, fontSize: FontSizes.xs },
});
