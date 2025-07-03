import { Stack } from "expo-router";
import './global.css';
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from 'react-native';


export default function RootLayout() {
  return (

    <SafeAreaView className="flex-1 bg-gray-100" edges={["bottom", "top"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#F2F0EF" />

      <Stack screenOptions={{ headerShown: false }}>

        <Stack.Screen

          name="(auth)"
          options={{ headerShown: false }}

        />
        <Stack.Screen

          name="(tabs)"
          options={{ headerShown: false }}

        />
        <Stack.Screen

          name="sideTabs"
          options={{ headerShown: false }}

        />
        <Stack.Screen name="(merchant-tabs)" />
        <Stack.Screen


          name="views"
          options={{ headerShown: false }}

        />

      </Stack>

    </SafeAreaView>
  );
}
