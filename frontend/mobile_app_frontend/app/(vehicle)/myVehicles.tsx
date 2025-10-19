import { Alert, Pressable, ScrollView, Text, View, ImageSourcePropType, Modal, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { cssInterop } from 'nativewind'
import { Image } from 'expo-image'
import { router } from 'expo-router'
import { useEffect, useState } from 'react';
import { Calendar } from 'react-native-calendars';

cssInterop(Image, { className: "style" });

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
      setLoading(true);
      const response = await fetch(`http://localhost:8080/vehicle/all`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Transform the data to match our interface
      const transformedData = data.map((vehicle: any) => ({
        ...vehicle,
        // Ensure boolean fields are properly converted
        ac: typeof vehicle.ac === 'string' 
          ? vehicle.ac.toLowerCase() === 'ac' || vehicle.ac.toLowerCase() === 'true'
          : Boolean(vehicle.ac),
        gearType: typeof vehicle.gearType === 'string'
          ? vehicle.gearType.toLowerCase() === 'automatic' || vehicle.gearType.toLowerCase() === 'true'
          : Boolean(vehicle.gearType),
        perKm: Boolean(vehicle.perKm),
        dailyRate: Boolean(vehicle.dailyRate),
        
        // Ensure arrays are properly handled
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
        
        // Ensure numbers are properly converted
        experience: parseInt(vehicle.experience) || 0,
        seats: parseInt(vehicle.seats) || 0,
        doors: parseInt(vehicle.doors) || 0,
        perKmPrice: parseFloat(vehicle.perKmPrice) || 0,
        dailyRatePrice: parseFloat(vehicle.dailyRatePrice) || 0,
      }));
      
      setVehicleData(transformedData);
    } catch (err) {
      console.log('Error fetching vehicle data:', err);
      Alert.alert('Error', 'Failed to load vehicle data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
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