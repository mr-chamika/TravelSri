import { Alert, Pressable, ScrollView, Text, View,  ImageSourcePropType } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { cssInterop } from 'nativewind'
import { Image } from 'expo-image'
import { router } from 'expo-router'

cssInterop(Image, { className: "style" });

// 1. Define the interface for a single vehicle object
interface Vehicle {
  id: number;
  make: string;
  model: string;
  year: number;
  vehicleCategory: string;
  type: string;
  seats: number;
  plateNumber: string;
  rating: number;
  trips: number | null;
  owner: {
    name: string;
    experience: string;
    avatar: ImageSourcePropType;
  };
  image: ImageSourcePropType;
  available: boolean;
}

// 3. Apply the type to the mock data array
const vehicleData: Vehicle[] = [
  {
    id: 1,
    make: 'Toyota',
    model: 'Prius',
    year: 2020,
    vehicleCategory: 'Car',
    type: 'Hybrid',
    seats: 4,
    plateNumber: 'BRC 2214',
    rating: 4.8,
    trips: 36,
    owner: {
      name: 'Kasun Perera',
      experience: '3.5 years',
      avatar: require('../../assets/images/profile-avatar.png'),
    },
    image: require('../../assets/images/toyota-prius.png'),
    available: true,
  },
  {
    id: 2,
    make: 'Toyota',
    model: 'Hiace',
    year: 2019,
    vehicleCategory: 'Van',
    type: 'Diesel',
    seats: 8,
    plateNumber: 'ABC 6789',
    rating: 4.5,
    trips: null,
    owner: {
      name: 'Nisal Guruge',
      experience: '5 years',
      avatar: require('../../assets/images/profile-avatar2.png'),
    },
    image: require('../../assets/images/toyota-hiace.png'),
    available: false,
  },
];

// 2. Apply the Vehicle type to the component's prop
const VehicleCard = ({ vehicle }: { vehicle: Vehicle }) => {
  return (
    <View className="bg-white rounded-2xl p-4 mb-4 mx-4 shadow-sm">
      <View className="flex-row justify-between items-start mb-4">
        <View>
          <Text className="text-lg font-bold text-gray-900">
            {vehicle.make} {vehicle.model}
          </Text>
          <Text className="text-sm text-gray-500 mt-1">
            {vehicle.vehicleCategory} • {vehicle.year}
          </Text>
        </View>
      </View>

      <View className="flex-row mb-4">
        <View className="w-32 h-20 bg-gray-100 rounded-lg justify-center items-center mr-4">
          <Image
            source={vehicle.image}
            className="w-32 h-20 rounded-lg"
            resizeMode="contain"
          />
        </View>

        <View className="flex-1">
          <Text className="text-sm font-medium text-gray-900 mb-1">{vehicle.type}</Text>
          <Text className="text-sm text-gray-600 mb-1">{vehicle.seats} seats</Text>
          <Text className="text-xs text-gray-500 mb-2">License plate no {vehicle.plateNumber}</Text>
          
          <View className="flex-row items-center mb-2">
            <FontAwesome name="star" size={14} color="#FFD700" />
            <Text className="text-sm font-medium text-gray-900 ml-1">{vehicle.rating}</Text>
          </View>

          {vehicle.trips ? (
             <View className="mb-2">
               <View className="bg-blue-500 px-2 py-1 rounded self-start">
                 <Text className="text-white text-xs font-medium">On Trip</Text>
               </View>
             </View>
           ) : !vehicle.available ? (
             <View className="mb-2">
               <View className="bg-red-500 px-2 py-1 rounded self-start">
                 <Text className="text-white text-xs font-medium">Not Available</Text>
               </View>
             </View>
           ) : null}
        </View>
      </View>

      <View className="flex-row justify-between items-center">
        <View className="flex-row items-center">
          <Image
            source={vehicle.owner.avatar}
            className="w-8 h-8 rounded-full mr-3"
            resizeMode="cover"
          />
          <View>
            <Text className="text-sm font-medium text-gray-900">{vehicle.owner.name}</Text>
            <Text className="text-xs text-gray-500">{vehicle.owner.experience}</Text>
          </View>
        </View>
        <Pressable
          className="bg-[#FEFA17] px-6 py-2 rounded-lg"
          onPress={() => router.push(`/views/vehicle/edit/${vehicle.id}`)}
        >
          <Text className="text-black font-medium text-sm">Edit Details</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default function App() {
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
        {vehicleData.map((vehicle) => (
          <VehicleCard key={vehicle.id} vehicle={vehicle} />
        ))}
      </ScrollView>
    </View>
  );
}
