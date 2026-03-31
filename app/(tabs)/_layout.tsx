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
    ios: insets.bottom + 66,
    android: insets.bottom + 66,
    default: 70,
  });

  const tabBarStyle = {
    height: tabBarHeight,
    paddingTop: 10,
    paddingBottom: Platform.select({
      ios: insets.bottom + 8,
      android: insets.bottom + 8,
      default: 10,
    }),
    paddingHorizontal: 6,
    backgroundColor: Colors.primary,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
    ...Shadows.lg,
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle,
        tabBarActiveTintColor: Colors.accentBright,
        tabBarInactiveTintColor: 'rgba(255,255,255,0.40)',
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '700',
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
            <View style={styles.fabWrapper}>
              <Pressable
                style={({ pressed }) => [
                  styles.fab,
                  pressed && { opacity: 0.82, transform: [{ scale: 0.92 }] },
                ]}
                onPress={() => router.push('/add-transaction')}
              >
                <MaterialIcons name="add" size={30} color={Colors.primary} />
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
  fabWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  fab: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    borderColor: 'rgba(255,255,255,0.22)',
    ...Shadows.accent,
  },
});
