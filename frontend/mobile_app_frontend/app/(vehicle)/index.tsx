import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from 'jwt-decode';

interface MyToken {
  sub: string;
  roles: string[];
  username: string;
  email: string;
  id: string
}

export default function Index() {
  const router = useRouter();
  const [userName, setUserName] = useState('Vehicle Owner');
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userRoles, setUserRoles] = useState<string[]>([]);

  // Fetch and decode JWT token to get user information
  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        console.log('🔍 JWT Token from AsyncStorage:', token ? token.substring(0, 50) + '...' : 'NO TOKEN');
        
        if (token) {
          const decoded = jwtDecode<MyToken>(token);
          console.log('🔓 Decoded JWT Token:', JSON.stringify(decoded, null, 2));
          console.log('📋 All token fields:', Object.keys(decoded));
          
          // Extract user information from token
          const username = decoded.username || decoded.sub || 'Vehicle Owner';
          const id = decoded.id || decoded.sub || '';
          const email = decoded.email || '';
          const roles = decoded.roles || [];
          
          setUserName(username);
          setUserId(id);
          setUserEmail(email);
          setUserRoles(roles);
          
          console.log('✅ Vehicle Owner Info extracted from JWT:');
          console.log('   👤 Username:', username);
          console.log('   🆔 User ID:', id);
          console.log('   📧 Email:', email);
          console.log('   🔑 Roles:', roles);
        } else {
          console.warn('⚠️ No token found in AsyncStorage');
        }
      } catch (error) {
        console.error('❌ Error decoding token:', error);
        console.error('Error details:', JSON.stringify(error, null, 2));
      }
    };
    
    fetchUserName();
  }, []);

  return (
    <ScrollView className="flex-1 bg-[#F2F0EF]">    
      {/* Good Morning Section */}
      <View className="bg-[#FEFA17] mx-4 mt-4 p-4 rounded-2xl">
        <Text className="text-black text-lg font-semibold mb-2">Good Morning, {userName}!</Text>
        <Text className="text-black text-sm mb-4">You have 3 new booking requests</Text>

        <View className="flex-row justify-between items-center">
          <View className="items-center">
            <Text className="text-black text-2xl font-bold">8</Text>
            <Text className="text-black text-xs">Confirmed Bookings</Text>
          </View>

          <View className="items-center">
            <Text className="text-black text-xl font-bold">Rs.185 000</Text>
            <Text className="text-black text-xs">This Month</Text>
          </View>

          <View className="items-center">
            <Text className="text-black text-2xl font-bold">4.8</Text>
            <Text className="text-black text-xs">Rating</Text>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View className="flex-row justify-between mx-4 mt-6 mb-6">
        <TouchableOpacity onPress={() => router.push('/(vehicle)/vehicleBookings')} className="bg-white p-4 rounded-2xl flex-1 mr-2 items-center shadow-sm">
          <View className="bg-green-100 p-3 rounded-full mb-2">
            <Ionicons name="calendar" size={24} color="#22c55e" />
          </View>
          <Text className="text-gray-800 text-sm font-medium">Manage Bookings</Text>
          <Text className="text-gray-500 text-xs">3 bookings</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/(vehicle)/myVehicles')} className="bg-white p-4 rounded-2xl flex-1 ml-2 items-center shadow-sm">
          <View className="bg-blue-100 p-3 rounded-full mb-2">
            <Ionicons name="car" size={24} color="#3b82f6" />
          </View>
          <Text className="text-gray-800 text-sm font-medium">My Vehicles</Text>
          <Text className="text-gray-500 text-xs">2 vehicles</Text>
        </TouchableOpacity>
      </View>

      {/* Recent Activity */}
      <View className="mx-4 mb-4">
        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-gray-800 text-lg font-semibold">Recent Activity</Text>
          <TouchableOpacity>
            <Text className="text-orange-500 text-sm">View All</Text>
          </TouchableOpacity>
        </View>

        <View className="bg-white rounded-2xl p-4 mb-3 shadow-sm">
          <View className="flex-row items-center">
            <View className="flex-1">
              <Text className="text-gray-800 font-medium">Nimal Gamage</Text>
              <Text className="text-gray-500 text-sm">Toyota Prius</Text>
            </View>
            <View className="bg-yellow-100 px-3 py-1 rounded-full">
              <Text className="text-yellow-800 text-xs font-medium">pending</Text>
            </View>
          </View>
        </View>

        <View className="bg-white rounded-2xl p-4 mb-3 shadow-sm">
          <View className="flex-row items-center">
            <View className="flex-1">
              <Text className="text-gray-800 font-medium">Group Tour - 12 People</Text>
              <Text className="text-gray-500 text-sm">Toyota Hiace</Text>
            </View>
            <View className="bg-yellow-100 px-3 py-1 rounded-full">
              <Text className="text-yellow-800 text-xs font-medium">pending</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Confirmed Bookings */}
      <View className="mx-4 mb-6">
        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-gray-800 text-lg font-semibold">Confirmed Bookings</Text>
          <TouchableOpacity>
            <Text className="text-orange-500 text-sm">View All</Text>
          </TouchableOpacity>
        </View>

        <View className="bg-white rounded-2xl p-4 mb-3 shadow-sm">
          <View className="flex-row items-center">
            <View className="flex-1">
              <Text className="text-gray-800 font-medium">Group Tour - 7 People</Text>
              <Text className="text-gray-500 text-sm">Toyota Hiace</Text>
            </View>
            <View className="bg-green-100 px-3 py-1 rounded-full">
              <Text className="text-green-700 text-xs font-medium">confirmed</Text>
            </View>
          </View>
        </View>

        <View className="bg-white rounded-2xl p-4 mb-3 shadow-sm">
          <View className="flex-row items-center">
            <View className="flex-1">
              <Text className="text-gray-800 font-medium">Kasun Gonigoda</Text>
              <Text className="text-gray-500 text-sm">Toyota Prius</Text>
            </View>
            <View className="bg-green-100 px-3 py-1 rounded-full">
              <Text className="text-green-700 text-xs font-medium">confirmed</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
