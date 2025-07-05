import { Alert, Pressable, ScrollView, Text, View, ImageSourcePropType, Modal, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { cssInterop } from 'nativewind'
import { Image } from 'expo-image'
import { router } from 'expo-router'
import { useState } from 'react';
import { Calendar } from 'react-native-calendars';

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
const VehicleCard = ({ vehicle, onSchedule }: { vehicle: Vehicle; onSchedule: (vehicle: Vehicle) => void }) => {
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
        <View className='gap-2'>
        <Pressable
          className="bg-[#FEF2F2] px-6 py-2 rounded-lg border-2 border-[#EF4444]"
          onPress={() => onSchedule(vehicle)}
          >
          <Text className="text-black font-medium text-sm">Schedule</Text>
        </Pressable>
        <Pressable
          className="bg-[#FEFA17] px-6 py-2 rounded-lg"
          onPress={() => router.push(`/views/vehicle/edit/${vehicle.id}`)}
          >
          <Text className="text-black font-medium text-sm">Edit Details</Text>
        </Pressable>
          </View>
      </View>
    </View>
  );
};

export default function App() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [selectedDates, setSelectedDates] = useState<string[]>([]);

  const handleSchedule = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsModalVisible(true);
  };

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
        `Vehicle: ${selectedVehicle.make} ${selectedVehicle.model}\nDates:\n${datesList}`,
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
          <VehicleCard key={vehicle.id} vehicle={vehicle} onSchedule={handleSchedule} />
        ))}
      </ScrollView>

      {/* Schedule Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={handleCloseModal}
      >
        <View className="flex-1 justify-center items-center bg-gray-100">
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
                  {selectedVehicle.make} {selectedVehicle.model}
                </Text>
                <Text className="text-sm text-gray-600">
                  {selectedVehicle.vehicleCategory} • {selectedVehicle.year}
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