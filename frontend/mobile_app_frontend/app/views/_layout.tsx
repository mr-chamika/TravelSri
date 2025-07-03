import { Stack } from 'expo-router';

export default function GuideLayout() {
  return (
    <Stack screenOptions={{ 
      headerShown: true,
      headerStyle: { backgroundColor: '#10b981' },
      headerTintColor: '#fff',
      headerTitleStyle: { fontWeight: 'bold' },
    }}>
      <Stack.Screen 
        name="index" 
        options={{ title: 'Guide & Tutorials' }} 
      />
      <Stack.Screen 
        name="registration" 
        options={{ title: 'Registration Guide' }} 
      />
      <Stack.Screen 
        name="review" 
        options={{ title: 'Reviews' }} 
      />
      <Stack.Screen 
        name="travelFeed" 
        options={{ title: 'Travel Feed' }} 
      />
      <Stack.Screen 
        name="notifications" 
        options={{ title: 'Notifications' }} 
      />
    </Stack>
  );
}