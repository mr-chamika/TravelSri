import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="Guide/dashboard2"
        options={{ headerShown: false }}
      />
    </Stack>
  );
}
