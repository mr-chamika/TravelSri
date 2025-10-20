import { Alert, Pressable, ScrollView, Text, View, ImageSourcePropType, Modal, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { cssInterop } from 'nativewind'
import { Image } from 'expo-image'
import { router } from 'expo-router'
import { useEffect, useState } from 'react';
import { Calendar } from 'react-native-calendars';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';

cssInterop(Image, { className: "style" });

// JWT Token Interface
interface MyToken {
  sub: string;
  id: string;
}

// Updated interface to match the form's FormData structure
interface Vehicle {
  _id: string;
  // Driver details
  firstName: string;
  lastName: string;
  nicNumber: string;
  driverDateOfBirth: string;
  location: string;
  gender: string;
  phone: string;
  additionalComments: string;
  drivingLicenseNumber: string;
  licenseExpiryDate: string;
  experience: number; // Changed from licenseYearsOfExperience
  languages: string[]; // Changed from languagesSpoken
  image: string; // driver photo
  insuranceDocument: string;
  insuranceDocument2?: string;
  licensePhoto: string;
  licensePhoto2?: string;
  driverNicpic1: string;
  driverNicpic2: string;
  
  // Vehicle details
  vehicleNumber: string;
  vehicleModel: string;
  ac: boolean;
  fuelType: string;
  seats: number; // Changed from vehicleSeatingCapacity
  catId: string;
  vehicleYearOfManufacture: string;
  gearType: boolean;
  perKm: boolean;
  perKmPrice: number;
  dailyRate: boolean;
  dailyRatePrice: number;
  vehicleLicenseCopy: string;
  images: string[]; // vehicle images array
  doors: number;
  mileage: string;
  whatsIncluded: string[];
}

// Vehicle Card Component - showing only major details
const VehicleCard = ({ vehicle, onSchedule }: { vehicle: Vehicle; onSchedule: (vehicle: Vehicle) => void }) => {
  // Helper to get vehicle image URI from images array
  const getVehicleImageUri = () => {
    if (vehicle.images && vehicle.images.length > 0) {
      const img = vehicle.images[0];
      if (img.startsWith('data:image')) return img;
      if (/^[A-Za-z0-9+/=]+$/.test(img)) return `data:image/jpeg;base64,${img}`;
      return img;
    }
    return undefined;
  };

  // Helper to get driver photo URI from image field
  const getDriverPhotoUri = () => {
    if (vehicle.image) {
      if (vehicle.image.startsWith('data:image')) return vehicle.image;
      if (/^[A-Za-z0-9+/=]+$/.test(vehicle.image)) return `data:image/jpeg;base64,${vehicle.image}`;
      return vehicle.image;
    }
    return undefined;
  };

  // Helper to format pricing information
  const getPricingInfo = () => {
    const pricing = [];
    if (vehicle.perKm && vehicle.perKmPrice > 0) {
      pricing.push(`LKR ${vehicle.perKmPrice}/km`);
    }
    if (vehicle.dailyRate && vehicle.dailyRatePrice > 0) {
      pricing.push(`LKR ${vehicle.dailyRatePrice}/day`);
    }
    return pricing.length > 0 ? pricing.join(' • ') : 'Price on request';
  };

  return (
    <View className="bg-white rounded-2xl p-5 mb-4 mx-4 shadow-sm border border-gray-100">
      {/* Header with Vehicle Info */}
      <View className="flex-row justify-between items-start mb-4">
        <View className="flex-1">
          <Text className="text-xl font-bold text-gray-900 mb-1">
            {vehicle.vehicleModel}
          </Text>
          <Text className="text-sm text-gray-500">
            {vehicle.vehicleYearOfManufacture} • {vehicle.catId}
          </Text>
        </View>
      </View>

      {/* Vehicle Image and Details */}
      <View className="flex-row mb-5">
        <View className="w-36 h-24 rounded-xl justify-center items-center mr-6 p-2">
          {getVehicleImageUri() ? (
            <Image
              source={{ uri: getVehicleImageUri() }}
              className="w-full h-full rounded-lg"
              contentFit="cover"
            />
          ) : (
            <View className="w-full h-full rounded-lg bg-gray-200 justify-center items-center">
              <FontAwesome name="car" size={32} color="#999" />
            </View>
          )}
        </View>

        <View className="flex-1 justify-center">
          <View className="mb-3">
            <Text className="text-sm text-gray-600 mb-1">Seats: {vehicle.seats}</Text>
            <Text className="text-sm text-gray-600 mb-1">Plate: {vehicle.vehicleNumber}</Text>
            <Text className="text-sm text-gray-600 mb-1">Fuel: {vehicle.fuelType}</Text>
            <Text className="text-sm text-gray-600 mb-1">{vehicle.ac ? 'AC' : 'Non-AC'}</Text>
            <Text className="text-sm text-gray-600 mb-1">Gear: {vehicle.gearType ? 'Auto' : 'Manual'}</Text>
          </View>
        </View>
      </View>

      {/* Pricing Info */}
      <View className="mb-4 bg-green-50 p-3 rounded-xl">
        <Text className="text-sm font-medium text-green-800">
          {getPricingInfo()}
        </Text>
        {vehicle.mileage && (
          <Text className="text-xs text-green-600 mt-1">
            Mileage: {vehicle.mileage}
          </Text>
        )}
      </View>

      {/* Driver Info Section */}
      <View className="flex-row items-center mb-4 bg-gray-50 p-3 rounded-xl">
        {/* Driver photo from 'image' field */}
        <View className="w-12 h-12 rounded-full mr-3 bg-gray-300 justify-center items-center overflow-hidden">
          {getDriverPhotoUri() ? (
            <Image
              source={{ uri: getDriverPhotoUri() }}
              className="w-full h-full rounded-full"
              contentFit="cover"
            />
          ) : (
            <FontAwesome name="user" size={24} color="#666" />
          )}
        </View>
        <View className="flex-1">
          <Text className="text-base font-semibold text-gray-900">{vehicle.firstName} {vehicle.lastName}</Text>
          <Text className="text-sm text-gray-600">{vehicle.experience} years experience</Text>
          <Text className="text-sm text-gray-600">Phone: {vehicle.phone}</Text>
          {vehicle.languages && vehicle.languages.length > 0 && (
            <Text className="text-xs text-gray-500">
              Languages: {vehicle.languages.slice(0, 2).join(', ')}{vehicle.languages.length > 2 ? '...' : ''}
            </Text>
          )}
        </View>
      </View>

      {/* What's Included - showing first few items */}
      {vehicle.whatsIncluded && vehicle.whatsIncluded.length > 0 && (
        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-700 mb-2">What's Included:</Text>
          <View className="flex-row flex-wrap">
            {vehicle.whatsIncluded.slice(0, 3).map((item, index) => (
              <View key={index} className="bg-blue-100 px-2 py-1 rounded-full mr-2 mb-1">
                <Text className="text-xs text-blue-700">{item}</Text>
              </View>
            ))}
            {vehicle.whatsIncluded.length > 3 && (
              <View className="bg-gray-100 px-2 py-1 rounded-full">
                <Text className="text-xs text-gray-600">+{vehicle.whatsIncluded.length - 3} more</Text>
              </View>
            )}
          </View>
        </View>
      )}

      {/* Action Buttons */}
      <View className="flex-row gap-3">
        <Pressable
          className="bg-[#FEF2F2] px-6 py-3 rounded-xl border border-[#EF4444] flex-1"
          onPress={() => onSchedule(vehicle)}
        >
          <Text className="text-[#EF4444] font-semibold text-sm text-center">Schedule</Text>
        </Pressable>
        <Pressable
          className="bg-[#FEFA17] px-6 py-3 rounded-xl flex-1"
          onPress={() => router.push(`/views/vehicle/edit/${vehicle._id}`)}
        >
          <Text className="text-black font-semibold text-sm text-center">Edit Details</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default function App() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [vehicleData, setVehicleData] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  const handleSchedule = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsModalVisible(true);
  };

  const getData = async () => {
    try {
      console.log('\n\n');
      console.log('═══════════════════════════════════════════════════════════');
      console.log('🚀 getData() FUNCTION CALLED AT:', new Date().toLocaleTimeString());
      console.log('═══════════════════════════════════════════════════════════');
      
      setLoading(true);
      console.log('✅ setLoading(true) - Loading state set');
      console.log('⏱️ Timestamp:', new Date().toISOString());
      
      // Extract JWT and userId
      console.log('\n\n🔑 ===== TOKEN EXTRACTION STARTED =====');
      console.log('⏳ Retrieving access_token from AsyncStorage...');
      let token = await AsyncStorage.getItem('access_token');
      console.log('✔️ access_token retrieval completed');
      console.log('1️⃣ Checking access_token:', token ? `✅ Found (${token.length} chars)` : '❌ Not found');
      
      if (!token) {
        console.log('⚠️  access_token not found, trying fallback "token" key...');
        token = await AsyncStorage.getItem('token');
        console.log('2️⃣ Checking token (fallback):', token ? `✅ Found (${token.length} chars)` : '❌ Not found');
      } else {
        console.log('✅ Using access_token from first attempt');
      }
      
      if (!token) {
        console.error('\n❌ ===== CRITICAL ERROR: NO TOKEN FOUND =====');
        console.error('❌ Token not found in either access_token or token keys');
        console.error('📍 This means user is NOT authenticated!');
        console.error('📍 Cannot proceed with API call without authentication');
        Alert.alert('Authentication Error', 'No token found. Please login again.');
        throw new Error('NO_TOKEN_IN_ASYNCSTORAGE');
      } else {
        console.log('\n✅ ===== TOKEN FOUND =====');
        console.log('📊 Token length:', token.length, 'characters');
        console.log('📄 Token first 50 chars:', token.substring(0, 50));
        console.log('� Token format check:', token.startsWith('eyJ') ? '✅ Valid JWT (starts with eyJ)' : '⚠️  Might not be JWT');
      }
      
      let userId = '';
      console.log('\n\n👤 ===== JWT DECODING STARTED =====');
      console.log('⏳ Decoding JWT token to extract userId...');
      if (token) {
        try {
          console.log('🔓 Calling jwtDecode()...');
          const decoded = jwtDecode<MyToken>(token);
          console.log('✅ JWT decoded successfully!');
          console.log('🔍 Decoded payload:', JSON.stringify(decoded, null, 2));
          
          userId = decoded.id || decoded.sub;
          console.log('\n✅ ===== USER ID EXTRACTED =====');
          console.log('👤 Extracted userId:', userId);
          console.log('📍 Source field:', decoded.id ? 'decoded.id' : 'decoded.sub');
          
          if (!userId) {
            console.error('❌ CRITICAL: userId is empty after extraction!');
            console.error('❌ decoded.id:', decoded.id);
            console.error('❌ decoded.sub:', decoded.sub);
            throw new Error('USERID_EXTRACTION_FAILED');
          }
        } catch (decodeError) {
          console.error('\n❌ ===== JWT DECODE ERROR =====');
          console.error('❌ Failed to decode JWT token');
          console.error('❌ Error:', decodeError instanceof Error ? decodeError.message : String(decodeError));
          console.error('❌ Error type:', decodeError instanceof Error ? decodeError.constructor.name : typeof decodeError);
          throw decodeError;
        }
      } else {
        console.error('⏭️  Skipping JWT decoding - token is null/undefined');
        throw new Error('TOKEN_IS_NULL');
      }
      
      // Construct API URL with vehicleOwnerId
      console.log('\n\n🌐 ===== API URL CONSTRUCTION =====');
      console.log('📍 userId value:', userId || '❌ EMPTY');
      
      const apiUrl = userId 
        ? `http://localhost:8080/vehicle/owner?vehicleOwnerId=${userId}`
        : `http://localhost:8080/vehicle/owner`;
      
      console.log('� Final API URL:', apiUrl);
      console.log('✅ URL construction complete');
      
      console.log('\n\n📤 ===== SENDING API REQUEST =====');
      console.log('⏳ About to call fetch()...');
      console.log('📊 Request method: GET');
      console.log('🌐 Request URL:', apiUrl);
      console.log('🔐 Authorization header:', token ? `✅ Bearer token (${token.length} chars)` : '❌ No token');
      console.log('⏱️ Request sent at:', new Date().toLocaleTimeString());
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: token ? {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        } : {
          'Content-Type': 'application/json',
        }
      });
      
      console.log('\n✅ ===== API RESPONSE RECEIVED =====');
      console.log('⏱️ Response received at:', new Date().toLocaleTimeString());
      console.log('📊 Status Code:', response.status);
      console.log('📊 Status Text:', response.statusText);
      console.log('✅ Response OK:', response.ok ? '✅ YES (200-299)' : '❌ NO (400+)');
      console.log('📋 Response type:', response.type);
      console.log('📍 Response URL:', response.url);
      
      console.log('\n\n🔍 ===== RESPONSE STATUS CHECK =====');
      console.log('⏳ Checking if response.ok is true...');
      
      if (!response.ok) {
        console.error('❌ ===== RESPONSE ERROR: NOT OK =====');
        console.error('❌ Response status:', response.status);
        console.error('❌ Response OK flag:', response.ok, '(expected: true)');
        console.error('⏳ Parsing error response body...');
        
        try {
          const errorText = await response.text();
          console.error('❌ Error response body:', errorText);
        } catch (textErr) {
          console.error('❌ Failed to parse error response:', textErr);
        }
        
        console.error('❌ Possible causes:');
        console.error('   1️⃣ Token expired or invalid');
        console.error('   2️⃣ Token not recognized by backend');
        console.error('   3️⃣ User ID mismatch (vehicleOwnerId != userId in token)');
        console.error('   4️⃣ CORS issue');
        console.error('   5️⃣ Backend server not responding properly');
        
        throw new Error(`HTTP error! status: ${response.status}`);
      } else {
        console.log('✅ ===== RESPONSE OK =====');
        console.log('✅ Status code is in 200-299 range');
      }
      
      console.log('\n\n📥 ===== PARSING RESPONSE JSON =====');
      console.log('⏳ Calling response.json()...');
      
      let data;
      try {
        data = await response.json();
        console.log('✅ JSON parsing successful');
        console.log('📊 Data type:', typeof data);
        console.log('📊 Is Array:', Array.isArray(data));
        console.log('📊 Data preview:', JSON.stringify(data).substring(0, 200));
      } catch (parseErr) {
        console.error('❌ ===== JSON PARSING ERROR =====');
        console.error('❌ Failed to parse response as JSON');
        console.error('❌ Error:', parseErr instanceof Error ? parseErr.message : String(parseErr));
        throw parseErr;
      }
      
      console.log('\n📦 ===== RESPONSE DATA ANALYSIS =====');
      console.log('✅ Data received and parsed');
      console.log('📊 Data type:', typeof data);
      console.log('📊 Is Array:', Array.isArray(data));
      if (Array.isArray(data)) {
        console.log('📊 Array length:', data.length);
      } else if (data && typeof data === 'object') {
        console.log('📊 Object keys:', Object.keys(data));
      }
      console.log('\n\n🚗 ===== VEHICLE DATA VALIDATION =====');
      
      if (!Array.isArray(data)) {
        console.error('❌ ERROR: Response data is NOT an array!');
        console.error('❌ Received type:', typeof data);
        console.error('❌ This may cause rendering issues');
        console.error('⚠️  Converting data to empty array for safety');
        data = [];
      } else if (data.length === 0) {
        console.warn('⚠️  No vehicles found (empty array)');
      } else {
        console.log('✅ Data is an array');
        console.log('🚗 Total vehicles received:', data.length);
        
        // Show first 3 vehicles
        console.log('\n🔍 ===== VEHICLE PREVIEW =====');
        data.slice(0, 3).forEach((vehicle: any, index: number) => {
          console.log(`\n📍 Vehicle ${index + 1}:`);
          console.log('  _id:', vehicle._id || '❌ MISSING');
          console.log('  Model:', vehicle.vehicleModel || '❌ MISSING');
          console.log('  Owner ID:', vehicle.vehicleOwnerId || '❌ MISSING');
          console.log('  Driver:', (vehicle.firstName || '?') + ' ' + (vehicle.lastName || '?'));
          console.log('  Seats:', vehicle.seats || '❌ MISSING');
          console.log('  AC:', vehicle.ac || '❌ MISSING');
          console.log('  Pricing:', vehicle.perKm ? 'Per km' : '', vehicle.dailyRate ? 'Daily' : '');
        });
      }
      
      
      console.log('\n🔄 ===== DATA TRANSFORMATION STARTED =====');
      console.log('⏳ Transforming', data.length, 'vehicles...');
      
      // Transform the data to match our interface
      let transformedData = [];
      let transformErrors = 0;
      
      try {
        transformedData = data.map((vehicle: any, index: number) => {
          try {
            console.log(`\n  [${index + 1}/${data.length}] Transforming vehicle:`, vehicle.vehicleModel || vehicle._id);
            
            const transformed = {
              ...vehicle,
              ac: typeof vehicle.ac === 'string' 
                ? vehicle.ac.toLowerCase() === 'ac' || vehicle.ac.toLowerCase() === 'true'
                : Boolean(vehicle.ac),
              gearType: typeof vehicle.gearType === 'string'
                ? vehicle.gearType.toLowerCase() === 'automatic' || vehicle.gearType.toLowerCase() === 'true'
                : Boolean(vehicle.gearType),
              perKm: Boolean(vehicle.perKm),
              dailyRate: Boolean(vehicle.dailyRate),
              
              languages: Array.isArray(vehicle.languages) ? vehicle.languages : 
                        (typeof vehicle.languages === 'string' && vehicle.languages.length > 0) 
                          ? vehicle.languages.split(',').map((lang: string) => lang.trim()) 
                          : [],
              whatsIncluded: Array.isArray(vehicle.whatsIncluded) ? vehicle.whatsIncluded : 
                            (vehicle.whatsIncluded && typeof vehicle.whatsIncluded === 'object') 
                              ? Object.values(vehicle.whatsIncluded) 
                              : [],
              images: Array.isArray(vehicle.images) ? vehicle.images : 
                     (vehicle.images && typeof vehicle.images === 'object') 
                       ? Object.values(vehicle.images) 
                       : [],
              
              experience: parseInt(vehicle.experience) || 0,
              seats: parseInt(vehicle.seats) || 0,
              doors: parseInt(vehicle.doors) || 0,
              perKmPrice: parseFloat(vehicle.perKmPrice) || 0,
              dailyRatePrice: parseFloat(vehicle.dailyRatePrice) || 0,
            };
            
            if (index === 0) {
              console.log('    ✅ Sample transformation:');
              console.log('      ac:', vehicle.ac, '→', transformed.ac);
              console.log('      languages count:', transformed.languages.length);
              console.log('      images count:', transformed.images.length);
              console.log('      experience:', transformed.experience);
              console.log('      seats:', transformed.seats);
            }
            
            return transformed;
          } catch (itemErr) {
            transformErrors++;
            console.error(`    ❌ Error transforming vehicle ${index + 1}:`, itemErr);
            return vehicle; // Return original if transformation fails
          }
        });
      } catch (mapErr) {
        console.error('❌ Error in map function:', mapErr);
        throw mapErr;
      }
      
      console.log('\n✅ ===== TRANSFORMATION COMPLETE =====');
      console.log('✅ Successfully transformed:', transformedData.length, 'vehicles');
      if (transformErrors > 0) {
        console.warn('⚠️  Transformation errors:', transformErrors);
      }
      console.log('\n🔄 ===== STATE UPDATE =====');
      console.log('⏳ Calling setVehicleData()...');
      console.log('📊 Setting state with', transformedData.length, 'vehicles');
      
      try {
        setVehicleData(transformedData);
        console.log('✅ setVehicleData() call successful');
      } catch (stateErr) {
        console.error('❌ Error in setVehicleData():', stateErr);
        throw stateErr;
      }
      
      console.log('\n✅ ==================== getData() COMPLETED SUCCESSFULLY ====================');
      console.log('✅ All steps executed without errors');
      console.log('✅ Vehicles loaded:', transformedData.length);
      console.log('✅ ===========================================================================\n');
    } catch (err) {
      console.log('\n\n❌ ==================== ERROR IN getData() ====================');
      console.error('❌ An error occurred during execution');
      console.error('❌ Error type:', err instanceof Error ? err.constructor.name : typeof err);
      console.error('❌ Error message:', err instanceof Error ? err.message : String(err));
      
      if (err instanceof Error && err.stack) {
        console.error('❌ Stack trace:');
        err.stack.split('\n').forEach((line: string) => {
          console.error('   ' + line);
        });
      }
      
      // Detailed error diagnostics
      if (err instanceof Error) {
        if (err.message.includes('NO_TOKEN')) {
          console.error('\n🔑 Diagnosis: Token not found in AsyncStorage');
          console.error('   Action: User needs to login');
        } else if (err.message.includes('USERID_EXTRACTION')) {
          console.error('\n👤 Diagnosis: Failed to extract userId from JWT');
          console.error('   Action: Check JWT structure (should have "id" or "sub" field)');
        } else if (err.message.includes('HTTP error')) {
          console.error('\n🌐 Diagnosis: HTTP error from backend');
          console.error('   Action: Check backend server, token validation, CORS settings');
        } else if (err.message.includes('JSON parsing')) {
          console.error('\n📦 Diagnosis: Response is not valid JSON');
          console.error('   Action: Check if response is actually JSON, not HTML error page');
        }
      }
      
      console.log('❌ ================================================================\n');
      Alert.alert('Error', 'Failed to load vehicle data. Please try again.');
    } finally {
      setLoading(false);
      console.log('✅ Loading state set to false');
    }
  };

  useEffect(() => {
    console.log('\n\n═══════════════════════════════════════════════════════════════');
    console.log('🎯 ===== myVehicles COMPONENT MOUNTED =====');
    console.log('⏰ Component mounted at:', new Date().toLocaleTimeString());
    console.log('🎯 Calling getData() from useEffect...');
    
    getData();
    
    return () => {
      console.log('🎯 ===== myVehicles COMPONENT UNMOUNTING =====');
      console.log('⏰ Component will unmount at:', new Date().toLocaleTimeString());
    };
  }, []);

  const handleDateSelect = (day: any) => {
    const dateString = day.dateString;
    
    setSelectedDates(prevDates => {
      if (prevDates.includes(dateString)) {
        // Remove date if already selected
        return prevDates.filter(date => date !== dateString);
      } else {
        // Add date if not selected
        return [...prevDates, dateString];
      }
    });
  };

  const handleConfirmSchedule = () => {
    if (selectedDates.length > 0 && selectedVehicle) {
      const datesList = selectedDates.sort().join('\n');
      Alert.alert(
        'Schedule Confirmed',
        `Vehicle: ${selectedVehicle.vehicleModel}\nDriver: ${selectedVehicle.firstName} ${selectedVehicle.lastName}\nDates:\n${datesList}`,
        [
          {
            text: 'OK',
            onPress: () => {
              setIsModalVisible(false);
              setSelectedDates([]);
              setSelectedVehicle(null);
            },
          },
        ]
      );
    } else {
      Alert.alert('Error', 'Please select at least one date');
    }
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedDates([]);
    setSelectedVehicle(null);
  };

  if (loading) {
    return (
      <View className="flex-1 bg-[#F2F0EF] justify-center items-center">
        <Text className="text-lg text-gray-600">Loading vehicles...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#F2F0EF]">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Title & Add Button Row */}
        <View className="flex-row justify-between items-center px-4 py-4">
          <Text className="text-2xl font-bold text-gray-900">My Vehicles</Text>
          <Pressable
            className="bg-[#FEFA17] px-4 py-2 rounded-lg"
            onPress={() => router.push(`/views/vehicle/add/[id]`)}
          >
            <Text className="text-black font-semibold text-sm">+ Add Vehicle</Text>
          </Pressable>
        </View>

        {/* Vehicle Cards */}
        {vehicleData.length > 0 ? (
          vehicleData.map((vehicle) => (
            <VehicleCard key={vehicle._id} vehicle={vehicle} onSchedule={handleSchedule} />
          ))
        ) : (
          <View className="flex-1 justify-center items-center py-20">
            <FontAwesome name="car" size={64} color="#ccc" />
            <Text className="text-gray-500 text-lg mt-4">No vehicles found</Text>
            <Text className="text-gray-400 text-sm mt-2">Add your first vehicle to get started</Text>
          </View>
        )}
      </ScrollView>

      {/* Schedule Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={handleCloseModal}
      >
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
          <View className="bg-white rounded-2xl p-6 mx-4 w-full max-w-sm">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-bold text-gray-900">Schedule Vehicle</Text>
              <TouchableOpacity onPress={handleCloseModal}>
                <FontAwesome name="times" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            {selectedVehicle && (
              <View className="mb-4">
                <Text className="text-lg font-semibold text-gray-800">
                  {selectedVehicle.vehicleModel}
                </Text>
                <Text className="text-sm text-gray-600">
                  Driver: {selectedVehicle.firstName} {selectedVehicle.lastName}
                </Text>
                <Text className="text-sm text-gray-600">
                  Phone: {selectedVehicle.phone}
                </Text>
              </View>
            )}

            <Text className="text-base font-medium text-gray-900 mb-3">Select Dates:</Text>
            
            <Calendar
              onDayPress={handleDateSelect}
              markedDates={selectedDates.reduce((acc, date) => {
                acc[date] = {
                  selected: true,
                  selectedColor: '#FEFA17',
                  selectedTextColor: '#000',
                };
                return acc;
              }, {} as any)}
              minDate={new Date().toISOString().split('T')[0]}
              theme={{
                backgroundColor: '#ffffff',
                calendarBackground: '#ffffff',
                textSectionTitleColor: '#b6c1cd',
                selectedDayBackgroundColor: '#FEFA17',
                selectedDayTextColor: '#000000',
                todayTextColor: '#00adf5',
                dayTextColor: '#2d4150',
                textDisabledColor: '#d9e1e8',
                dotColor: '#00adf5',
                selectedDotColor: '#ffffff',
                arrowColor: '#FEFA17',
                monthTextColor: '#2d4150',
                indicatorColor: '#FEFA17',
                textDayFontWeight: '300',
                textMonthFontWeight: 'bold',
                textDayHeaderFontWeight: '300',
                textDayFontSize: 16,
                textMonthFontSize: 16,
                textDayHeaderFontSize: 13,
              }}
            />

            {selectedDates.length > 0 && (
              <View className="mt-4 p-3 bg-gray-50 rounded-lg">
                <Text className="text-sm font-medium text-gray-900 mb-2">
                  Selected Dates ({selectedDates.length}):
                </Text>
                <Text className="text-xs text-gray-600">
                  {selectedDates.sort().join(', ')}
                </Text>
              </View>
            )}

            <View className="flex-row justify-between mt-6">
              <Pressable
                className="bg-gray-300 px-6 py-3 rounded-lg flex-1 mr-2"
                onPress={handleCloseModal}
              >
                <Text className="text-gray-700 font-medium text-center">Cancel</Text>
              </Pressable>
              <Pressable
                className="bg-[#FEFA17] px-6 py-3 rounded-lg flex-1 ml-2"
                onPress={handleConfirmSchedule}
              >
                <Text className="text-black font-medium text-center">Confirm</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}