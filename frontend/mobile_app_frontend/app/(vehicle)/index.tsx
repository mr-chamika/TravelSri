import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import { useEffect, useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from 'jwt-decode';

interface MyToken {
  sub: string;
  roles: string[];
  username: string;
  email: string;
  id: string
}

interface Vehicle {
  _id: string;
  vehicleModel: string;
  vehicleNumber: string;
  seats: number;
  ac: boolean;
  fuelType: string;
  gearType: boolean;
  perKmPrice?: number;
  dailyRatePrice?: number;
  year?: string;
  vehicleYearOfManufacture?: string;
  images?: string[];
}

export default function Index() {
  const router = useRouter();
  const [userName, setUserName] = useState('Vehicle Owner');
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [vehicleCount, setVehicleCount] = useState(0);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loadingVehicles, setLoadingVehicles] = useState(false);

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

  // Fetch vehicle count and details
  const fetchVehicleCount = useCallback(async () => {
    try {
      console.log('🚗 Fetching vehicle count and details...');
      setLoadingVehicles(true);
      const token = await AsyncStorage.getItem('access_token') || await AsyncStorage.getItem('token');
      
      if (!token || !userId) {
        console.warn('⚠️ No token or userId found');
        return;
      }

      const apiUrl = `http://192.168.1.150:8080/vehicle/owner?vehicleOwnerId=${userId}`;
      console.log('📍 Vehicle API URL:', apiUrl);

      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        console.error('❌ Failed to fetch vehicles:', response.status);
        setLoadingVehicles(false);
        return;
      }

      const data = await response.json();
      const count = Array.isArray(data) ? data.length : 0;
      console.log(`✅ Vehicle count fetched: ${count} vehicles`);
      setVehicleCount(count);
      
      // Store vehicles for summary display
      if (Array.isArray(data)) {
        setVehicles(data.slice(0, 3)); // Show up to 3 vehicles in summary
        console.log(`📊 Vehicles for summary: ${data.slice(0, 3).length} vehicles loaded`);
      }
      
      setLoadingVehicles(false);
    } catch (error) {
      console.error('❌ Error fetching vehicle count:', error);
      setLoadingVehicles(false);
    }
  }, [userId]);

  // Fetch vehicle count when userId changes
  useEffect(() => {
    if (userId) {
      fetchVehicleCount();
    }
  }, [userId, fetchVehicleCount]);

  // Refresh vehicle count when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      console.log('👁️ Vehicle index screen focused - refreshing vehicle count');
      if (userId) {
        fetchVehicleCount();
      }
    }, [userId, fetchVehicleCount])
  );

  return (
    <ScrollView className="flex-1 bg-[#F2F0EF]" showsVerticalScrollIndicator={false}>    
      {/* Header Banner */}
      <View className="bg-gradient-to-br from-[#FEFA17] to-[#FEF08A] px-4 pt-6 pb-4">
        <View className="flex-row justify-between items-start mb-4">
          <View className="flex-1">
            <Text className="text-gray-900 text-2xl font-black">Welcome!</Text>
            <Text className="text-gray-900 text-2xl font-black mt-1">{userName}</Text>
          </View>
        </View>

        {/* Stats Banner */}
        <View className="bg-[#FEFA17] rounded-2xl p-4 shadow-lg">
          <View className="flex-row justify-between">
            <View className="items-center flex-1">
              <Text className="text-gray-900 text-3xl font-black">4</Text>
              <Text className="text-gray-700 text-xs font-medium mt-1">Bookings</Text>
            </View>
            <View className="w-px h-14 bg-gray-400 bg-opacity-30"></View>
            <View className="items-center flex-1">
              <Text className="text-gray-900 text-3xl font-black">LKR17.3K</Text>
              <Text className="text-gray-700 text-xs font-medium mt-1">Earnings</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View className="mx-4 mt-5 mb-5">
        <Text className="text-gray-900 text-lg font-bold mb-3">Quick Actions</Text>
        <View className="flex-row justify-between gap-2">
          <TouchableOpacity 
            onPress={() => router.push('/(vehicle)/vehicleBookings')} 
            className="bg-white rounded-2xl p-4 flex-1 shadow-md border-b-4 border-[#FEFA17] active:bg-gray-50"
          >
            <View className="bg-gradient-to-br from-[#FEF3C7] to-[#FEFA17] p-3 rounded-xl mb-2 self-center w-12 h-12 items-center justify-center">
              <Ionicons name="calendar" size={24} color="#B8860B" />
            </View>
            <Text className="text-gray-900 text-sm font-semibold text-center">Bookings</Text>
            <Text className="text-[#FEFA17] text-xs font-medium text-center mt-1">3 pending</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => router.push('/(vehicle)/myVehicles')} 
            className="bg-white rounded-2xl p-4 flex-1 shadow-md border-b-4 border-[#FEFA17] active:bg-gray-50"
          >
            <View className="bg-gradient-to-br from-[#FEF3C7] to-[#FEFA17] p-3 rounded-xl mb-2 self-center w-12 h-12 items-center justify-center">
              <Ionicons name="car" size={24} color="#B8860B" />
            </View>
            <Text className="text-gray-900 text-sm font-semibold text-center">My Vehicles</Text>
            <Text className="text-[#FEFA17] text-xs font-medium text-center mt-1">{vehicleCount} vehicles</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Your Fleet Section */}
      <View className="mx-4 mb-6">
        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-gray-900 text-lg font-bold">Your Fleet</Text>
          <TouchableOpacity onPress={() => router.push('/(vehicle)/myVehicles')}>
            <Text className="text-[#FEFA17] text-xs font-semibold">View All →</Text>
          </TouchableOpacity>
        </View>

        {loadingVehicles ? (
          <View className="bg-white rounded-2xl p-6 shadow-md">
            <Text className="text-gray-500 text-center text-sm font-semibold">Loading vehicles...</Text>
          </View>
        ) : vehicles.length > 0 ? (
          vehicles.map((vehicle, index) => {
            return (
              <View key={vehicle._id || index} className="bg-white rounded-2xl mb-3 shadow-md overflow-hidden border border-gray-100">
                {/* Vehicle Header */}
                <View className="bg-gradient-to-r from-[#FEF3C7] to-[#FEF08A] px-4 py-3 flex-row items-center">
                  <View className="flex-1">
                    <Text className="text-gray-900 font-bold text-base">{vehicle.vehicleModel}</Text>
                    <Text className="text-gray-600 text-xs font-medium mt-0.5">{vehicle.vehicleNumber}</Text>
                  </View>
                </View>

                {/* Vehicle Info */}
                <View className="p-4">
                  {/* Specs Grid */}
                  <View className="bg-gradient-to-br from-[#FAFAFA] to-[#F5F5F5] rounded-xl p-3 mb-3 border border-gray-100">
                    <View className="flex-row justify-between">
                      <View className="items-center flex-1">
                        <Ionicons name="people" size={24} color="#6B7280" />
                        <Text className="text-gray-600 text-xs font-medium mt-1">Seats</Text>
                        <Text className="text-gray-900 font-bold text-sm mt-0.5">{vehicle.seats}</Text>
                      </View>
                      <View className="items-center flex-1">
                        <Ionicons name="water" size={24} color="#6B7280" />
                        <Text className="text-gray-600 text-xs font-medium mt-1">Fuel</Text>
                        <Text className="text-gray-900 font-bold text-sm mt-0.5">{vehicle.fuelType}</Text>
                      </View>
                      <View className="items-center flex-1">
                        <Ionicons name="settings" size={24} color="#6B7280" />
                        <Text className="text-gray-600 text-xs font-medium mt-1">Gear</Text>
                        <Text className="text-gray-900 font-bold text-sm mt-0.5">{vehicle.gearType ? 'Auto' : 'Manual'}</Text>
                      </View>
                      <View className="items-center flex-1">
                        <Ionicons name="snow" size={24} color="#6B7280" />
                        <Text className="text-gray-600 text-xs font-medium mt-1">AC</Text>
                        <Text className="text-gray-900 font-bold text-sm mt-0.5">{vehicle.ac ? 'Yes' : 'No'}</Text>
                      </View>
                    </View>
                  </View>

                  {/* Pricing & Action */}
                  <View className="flex-row items-center justify-between">
                    {(vehicle.perKmPrice || vehicle.dailyRatePrice) && (
                      <View>
                        <Text className="text-[#FEFA17] text-xs font-semibold mb-0.5">
                          <Ionicons name="pricetag" size={11} color="#6B7280" /> Pricing
                        </Text>
                        <Text className="text-gray-900 font-semibold text-sm">
                          {vehicle.perKmPrice ? `LKR${vehicle.perKmPrice}/km` : ''}
                          {vehicle.perKmPrice && vehicle.dailyRatePrice ? ' • ' : ''}
                          {vehicle.dailyRatePrice ? `LKR${vehicle.dailyRatePrice}/day` : ''}
                        </Text>
                      </View>
                    )}
                    <TouchableOpacity 
                      onPress={() => router.push('/(vehicle)/myVehicles')}
                      className="bg-[#FEFA17] px-4 py-2 rounded-lg active:bg-yellow-300 flex-row items-center"
                    >
                      <Ionicons name="open" size={14} color="#B8860B" />
                      <Text className="text-gray-900 font-semibold text-xs ml-1.5">Manage</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            );
          })
        ) : (
          <View className="bg-gradient-to-br from-[#FEF3C7] to-[#FEF08A] rounded-2xl p-6 shadow-md border-2 border-[#FEFA17]">
            <View className="items-center">
              <Ionicons name="car" size={48} color="#B8860B" />
              <Text className="text-gray-900 text-center font-bold text-base mt-3">No Vehicles Yet</Text>
              <Text className="text-gray-600 text-xs text-center mt-1">Add your first vehicle to start earning</Text>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
