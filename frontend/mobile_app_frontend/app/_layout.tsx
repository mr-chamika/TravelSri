import { AuthProvider } from '../contexts/AuthContext';
import { Stack } from "expo-router";
import './global.css';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Authentication Screens */}


      {/* Role-Based Tabs */}
      <Stack.Screen name="(merchant-tabs)" />
      <Stack.Screen name="(customer-tabs)" />
      <Stack.Screen name="(admin-tabs)" />

      {/* Optional / Legacy */}
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="sideTabs" />
    </Stack>
  );
}
