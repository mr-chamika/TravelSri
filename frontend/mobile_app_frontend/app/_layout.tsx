import { Stack } from "expo-router";
import './global.css';
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";


export default function RootLayout() {

  useEffect(() => {
    const clearAsyncStorage = async () => {
      try {
        // Clear specific items related to the current plan/total
        await AsyncStorage.multiRemove([
          'selectedLocation',
          'hasMadeInitialSelection',
          'hotel',
          'guide',
          'car',
          'hbookings',
          'hbookingComplete',
          'hbookingSession',
          'gbookings',
          'gbookingComplete',
          'gbookingSession',
          'cbookings',
          'cbookingComplete',
          'bookingSession',
          'total', // Ensure total is cleared
          'route' // Assuming 'route' might also need to be reset
        ]);
      } catch (e) {
        console.error('Error clearing AsyncStorage:', e);
      }
    };
    clearAsyncStorage();
  }, []); // Empty dependency array means this runs once on mount


  return (
    <>
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
    </>
  );
}
