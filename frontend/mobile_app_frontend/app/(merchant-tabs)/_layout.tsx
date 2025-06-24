import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function MerchantTabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#FFD700',
        tabBarInactiveTintColor: '#666',
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#FFD700',
          borderTopLeftRadius: 25,
          borderTopRightRadius: 25,
          height: 70,
          paddingBottom: 10,
          paddingTop: 10,
        },
      }}
    >
      {/* Only show this page in the tab bar */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="feedback"
        options={{
          title: 'Listings',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="payment"
        options={{
          title: 'Orders',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="receipt" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />

      {/* Hide extra pages from tab bar */}
      <Tabs.Screen name="AddItem" options={{ href: null }} />
      <Tabs.Screen name="ChangeItem" options={{ href: null }} />

    </Tabs>
  );
}
