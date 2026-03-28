// Powered by OnSpace.AI
import { MaterialIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Platform, View, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, BorderRadius, Shadows } from '@/constants/theme';

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const tabBarHeight = Platform.select({
    ios: insets.bottom + 68,
    android: insets.bottom + 68,
    default: 72,
  });

  const tabBarStyle = {
    height: tabBarHeight,
    paddingTop: 10,
    paddingBottom: Platform.select({
      ios: insets.bottom + 10,
      android: insets.bottom + 10,
      default: 12,
    }),
    paddingHorizontal: 8,
    // Glassmorphism bottom nav
    backgroundColor: 'rgba(13, 33, 55, 0.94)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.10)',
    ...Shadows.lg,
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle,
        tabBarActiveTintColor: Colors.accent,
        tabBarInactiveTintColor: 'rgba(255,255,255,0.45)',
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          marginTop: 2,
          letterSpacing: 0.2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'الرئيسية',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="transactions"
        options={{
          title: 'المعاملات',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="receipt-long" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="add-tab"
        options={{
          title: '',
          tabBarIcon: () => (
            <View style={styles.fabContainer}>
              <Pressable
                style={({ pressed }) => [
                  styles.fab,
                  pressed && { opacity: 0.85, transform: [{ scale: 0.94 }] },
                ]}
                onPress={() => router.push('/add-transaction')}
              >
                <MaterialIcons name="add" size={32} color={Colors.primary} />
              </Pressable>
            </View>
          ),
          tabBarLabel: () => null,
        }}
      />
      <Tabs.Screen
        name="accounts"
        options={{
          title: 'الحسابات',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="account-balance-wallet" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: 'المزيد',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="menu" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  fabContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  fab: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.20)',
    ...Shadows.lg,
    shadowColor: Colors.accent,
  },
});
