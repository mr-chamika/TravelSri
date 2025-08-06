import { Alert, Pressable, ScrollView, Text, View, ImageSourcePropType, Modal, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { cssInterop } from 'nativewind'
import { Image } from 'expo-image'
import { router } from 'expo-router'
import { useEffect, useState } from 'react';
import { Calendar } from 'react-native-calendars';

cssInterop(Image, { className: "style" });

// 1. Define the interface for a single vehicle object
interface Vehicle {
  _id: string;
  additionalComments?: string;
  driverDateOfBirth?: string;
  phone: string;
  drivingLicenseNumber?: string;
  firstName: string;
  gender?: string;
  driverAge?: string;
  location?: string;
  image?: string; // driver photo
  insuranceDocument?: string;
  insuranceDocument2?: string;
  languagesSpoken?: string;
  lastName: string;
  licenseExpiryDate?: string;
  licensePhoto?: string;
  licensePhoto2?: string;
  licenseYearsOfExperience: string;
  nicNumber?: string;
  vehicleNumber: string;
  images?: string[]; // vehicle images array
  vehicleLicenseCopy?: string;
  vehicleModel: string;
  ac: string;
  fuelType: string;
  vehicleOwnerId?: string;
  vehicleSeatingCapacity: string;
  catId?: string;
  vehicleYearOfManufacture?: string;
  gearType?: boolean;
  perKm?: boolean;
  perKmPrice?: number;
  dailyRate?: boolean;
  dailyRatePrice?: number;
  verified?: string;
  driverNicpic1?: string;
  driverNicpic2?: string;
}

// 2. Apply the Vehicle type to the component's prop
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

  return (
    <View className="bg-white rounded-2xl p-5 mb-4 mx-4 shadow-sm border border-gray-100">
      {/* Header with Vehicle Info */}
      <View className="flex-row justify-between items-start mb-4">
        <View className="flex-1">
          <Text className="text-xl font-bold text-gray-900 mb-1">
            {vehicle.vehicleModel}
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
            {/* vehicleType not present in Vehicle.java, so skip or use catId if needed */}
            <Text className="text-sm text-gray-600 mb-1">No Of Seats: {vehicle.vehicleSeatingCapacity}</Text>
            <Text className="text-sm text-gray-600 mb-1">Number Plate: {vehicle.vehicleNumber}</Text>
            <Text className="text-sm text-gray-600 mb-1">Fuel Type: {vehicle.fuelType}</Text>
            <Text className="text-sm text-gray-600 mb-1">{vehicle.ac?.toLowerCase() === 'ac' ? 'AC' : 'Non-AC'}</Text>
          </View>
        </View>
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
          <Text className="text-sm text-gray-600">{vehicle.licenseYearsOfExperience} years experience</Text>
          <Text className="text-sm text-gray-600">Phone No: {vehicle.phone}</Text>
        </View>
      </View>

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

  const handleSchedule = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsModalVisible(true);
  };

  const getData = async () => {

    try {

      const response = await fetch(`http://localhost:8080/vehicle/all`)

      const data = await response.json()

      //console.log(data)
      setVehicleData(data)

    } catch (err) {
      console.log(err)

    }
  }

  useEffect(() => {

    getData()

  }, [])

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
        `Vehicle: ${selectedVehicle.vehicleModel}\nDates:\n${datesList}`,
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
          <VehicleCard key={vehicle._id} vehicle={vehicle} onSchedule={handleSchedule} />
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
                  {selectedVehicle.vehicleModel}
                </Text>
                <Text className="text-sm text-gray-600">
                  {selectedVehicle.vehicleModel}
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