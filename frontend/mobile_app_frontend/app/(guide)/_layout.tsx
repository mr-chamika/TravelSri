import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#FEFA17",
          height: 65,
          paddingTop: 13,
          borderColor: "#FEFA17",
        },
        tabBarItemStyle: {
          flex: 1,
          alignItems: "center",
          justifyContent: "space-between",
          gap: 10,
          height: 40,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              className={`p-2 rounded-full ${focused ? "bg-white" : "bg-transparent"
                }`}
            >
              <Ionicons name="home" size={30} color="#000000" />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="bookings"
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              className={`p-2 rounded-full ${focused ? "bg-white" : "bg-transparent"
                }`}
            >
              <Ionicons name="calendar" size={30} color="#000000" />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="availability"
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              className={`p-2 rounded-full ${focused ? "bg-white" : "bg-transparent"
                }`}
            >
              <Ionicons name="time" size={30} color="#000000" />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              className={`p-2 rounded-full ${focused ? "bg-white" : "bg-transparent"
                }`}
            >
              <Ionicons name="person" size={30} color="#000000" />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}