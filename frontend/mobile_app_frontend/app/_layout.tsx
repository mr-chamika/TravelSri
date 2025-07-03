import { AuthProvider } from '../contexts/AuthContext';
import { Stack } from "expo-router";
import './global.css';
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "react-native";
export default function RootLayout() {
  return (
      <SafeAreaView className="flex-1 bg-[#F2F0EF] edges={['top','left','right']}" >
      <StatusBar barStyle="dark-content" backgroundColor="#F2F0EF" />
    <Stack screenOptions={{ headerShown: false }}>
      {/* Authentication Screens */}


      {/* Role-Based Tabs */}
      <Stack.Screen name="(merchant-tabs)" />


      {/* Optional / Legacy */}
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="sideTabs" />
    </Stack>
    </SafeAreaView>
  );
}
