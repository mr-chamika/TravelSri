import { Alert, Pressable, ScrollView, Text, View, ImageSourcePropType, Modal, TouchableOpacity, Platform } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { cssInterop } from 'nativewind'
import { Image } from 'expo-image'
import { router } from 'expo-router'
import { useEffect, useState, useCallback } from 'react';
import { Calendar } from 'react-native-calendars';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useFocusEffect } from '@react-navigation/native';

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
const VehicleCard = ({ vehicle, onSchedule, onViewSchedule, onDelete, unavailableDates = [] }: { 
  vehicle: Vehicle; 
  onSchedule: (vehicle: Vehicle) => void;
  onViewSchedule: (vehicle: Vehicle) => void;
  onDelete: (vehicle: Vehicle) => void;
  unavailableDates?: string[];
}) => {
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
      {/* Header with Vehicle Info - Make it clickable */}
      <TouchableOpacity 
        onPress={() => onViewSchedule(vehicle)}
        className="flex-row justify-between items-start mb-4"
        activeOpacity={0.7}
      >
        <View className="flex-1">
          <Text className="text-xl font-bold text-gray-900 mb-1">
            {vehicle.vehicleModel}
          </Text>
          <Text className="text-sm text-gray-500">
            {vehicle.vehicleYearOfManufacture} • {vehicle.catId}
          </Text>
        </View>
        <View className="bg-blue-50 px-3 py-1 rounded-full">
          <Text className="text-xs text-blue-600 font-medium">View Schedule</Text>
        </View>
      </TouchableOpacity>

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

      {/* Unavailability Status */}
      {unavailableDates.length > 0 && (
        <View className="mb-4 bg-red-50 p-3 rounded-xl border border-red-200">
          <Text className="text-sm font-medium text-red-800 mb-1">
            Upcoming Unavailable Dates:
          </Text>
          <Text className="text-xs text-red-600">
            {unavailableDates
              .filter(date => new Date(date) >= new Date())
              .sort()
              .slice(0, 3)
              .join(', ')}
            {unavailableDates.filter(date => new Date(date) >= new Date()).length > 3 && 
              ` +${unavailableDates.filter(date => new Date(date) >= new Date()).length - 3} more`
            }
          </Text>
        </View>
      )}

      {/* Action Buttons */}
      <View className="flex-row space-x-3">
        <Pressable
          className="bg-[#FEF2F2] border border-[#EF4444] rounded-xl flex-1 h-12 items-center justify-center"
          onPress={() => onSchedule(vehicle)}
        >
          <Text className="text-[#EF4444] font-semibold text-sm">Set Unavailable</Text>
        </Pressable>
        <Pressable
          className="bg-[#FEFA17] rounded-xl flex-1 h-12 items-center justify-center"
          onPress={() => router.push(`/views/vehicle/edit/${vehicle._id}`)}
        >
          <Text className="text-black font-semibold text-sm">Edit Details</Text>
        </Pressable>
      </View>
      
      {/* Delete Button - Subtle placement */}
      <View className="mt-3 items-center">
        <TouchableOpacity
          className="px-4 py-2 rounded-lg"
          onPress={() => {
            console.log('Delete button pressed for vehicle:', vehicle.vehicleModel);
            onDelete(vehicle);
          }}
          activeOpacity={0.7}
        >
          <Text className="text-gray-400 text-xs">Delete Vehicle</Text>
        </TouchableOpacity>
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
  
  // Enhanced scheduling states from availability screen
  const [currentDate, setCurrentDate] = useState(new Date());
  const [markedDates, setMarkedDates] = useState<{[key: string]: any}>({});
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [datePickerMode, setDatePickerMode] = useState<'from' | 'to'>('from');
  const [scheduleMode, setScheduleMode] = useState<'individual' | 'range'>('individual');
  
  // Overview calendar states
  const [showOverviewCalendar, setShowOverviewCalendar] = useState(true);
  const [allUnavailableDates, setAllUnavailableDates] = useState<{[key: string]: any}>({});
  const [vehicleUnavailability, setVehicleUnavailability] = useState<{[vehicleId: string]: string[]}>({});
  
  // Vehicle schedule view states
  const [isScheduleViewVisible, setIsScheduleViewVisible] = useState(false);
  const [viewingVehicle, setViewingVehicle] = useState<Vehicle | null>(null);
  const [vehicleScheduleMarkedDates, setVehicleScheduleMarkedDates] = useState<{[key: string]: any}>({});
  const [deleteMode, setDeleteMode] = useState(false);
  const [datesToDelete, setDatesToDelete] = useState<string[]>([]);

  const handleSchedule = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    // Load existing unavailable dates for this vehicle
    const existingDates = vehicleUnavailability[vehicle._id] || [];
    setSelectedDates([...existingDates]);
    
        // Set up marked dates for the modal calendar
        const modalMarkedDates: {[key: string]: any} = {};
        existingDates.forEach(date => {
          modalMarkedDates[date] = {
            selected: true,
            selectedColor: '#EF4444',
            selectedTextColor: '#FFFFFF'
          };
        });
        setMarkedDates(modalMarkedDates);    setFromDate(new Date());
    setToDate(new Date());
    setScheduleMode('individual');
    setIsModalVisible(true);
  };

  // Update overview calendar with all vehicle unavailability
  const updateOverviewCalendar = () => {
    const overviewMarkedDates: {[key: string]: any} = {};
    
    Object.entries(vehicleUnavailability).forEach(([vehicleId, dates]) => {
      const vehicle = vehicleData.find(v => v._id === vehicleId);
      if (vehicle && dates.length > 0) {
        dates.forEach(date => {
          if (!overviewMarkedDates[date]) {
            overviewMarkedDates[date] = {
              selected: true,
              selectedColor: '#EF4444',
              selectedTextColor: '#FFFFFF',
              customStyles: {
                container: {
                  backgroundColor: '#EF4444',
                  borderRadius: 16,
                },
                text: {
                  color: '#FFFFFF',
                  fontWeight: 'bold'
                }
              }
            };
          }
          
          // Add vehicle info to the date
          if (!overviewMarkedDates[date].vehicles) {
            overviewMarkedDates[date].vehicles = [];
          }
          overviewMarkedDates[date].vehicles.push({
            id: vehicleId,
            model: vehicle.vehicleModel,
            driver: `${vehicle.firstName} ${vehicle.lastName}`
          });
        });
      }
    });
    
    setAllUnavailableDates(overviewMarkedDates);
  };

  // Load vehicle unavailability data (this would typically come from your backend)
  const loadVehicleUnavailability = async () => {
    try {
      // Replace with actual API call
      // const response = await fetch(`http://localhost:8080/vehicle/unavailability`);
      // const data = await response.json();
      
      // Simulated data - replace with actual API call
      const mockUnavailability: {[vehicleId: string]: string[]} = {};
      
      // Add some sample unavailable dates for demonstration
      vehicleData.forEach(vehicle => {
        mockUnavailability[vehicle._id] = [
          // Add some random unavailable dates for demo
          '2025-10-25',
          '2025-10-26',
          '2025-11-01',
          '2025-11-15'
        ];
      });
      
      setVehicleUnavailability(mockUnavailability);
    } catch (error) {
      console.error('Error loading vehicle unavailability:', error);
    }
  };

  // View vehicle schedule
  const handleViewSchedule = (vehicle: Vehicle) => {
    setViewingVehicle(vehicle);
    
    // Get unavailable dates for this vehicle
    const unavailableDates = vehicleUnavailability[vehicle._id] || [];
    
    // Create marked dates for schedule view
    const scheduleMarkedDates: {[key: string]: any} = {};
    
    // Mark unavailable dates
    unavailableDates.forEach(date => {
      scheduleMarkedDates[date] = {
        selected: true,
        selectedColor: '#EF4444',
        selectedTextColor: '#FFFFFF',
        customStyles: {
          container: {
            backgroundColor: '#EF4444',
            borderRadius: 16,
          },
          text: {
            color: '#FFFFFF',
            fontWeight: 'bold'
          }
        }
      };
    });
    
    // Add some example booking dates (available but booked)
    const exampleBookings = ['2025-10-22', '2025-10-30', '2025-11-05'];
    exampleBookings.forEach(date => {
      if (!scheduleMarkedDates[date]) {
        scheduleMarkedDates[date] = {
          selected: true,
          selectedColor: '#FBBF24',
          selectedTextColor: '#000000',
          customStyles: {
            container: {
              backgroundColor: '#FBBF24',
              borderRadius: 16,
            },
            text: {
              color: '#000000',
              fontWeight: 'bold'
            }
          }
        };
      }
    });
    
    setVehicleScheduleMarkedDates(scheduleMarkedDates);
    setIsScheduleViewVisible(true);
  };

  // Close schedule view
  const handleCloseScheduleView = () => {
    setIsScheduleViewVisible(false);
    setViewingVehicle(null);
    setVehicleScheduleMarkedDates({});
    setDeleteMode(false);
    setDatesToDelete([]);
  };

  // Delete vehicle from system
  const handleDeleteVehicle = (vehicle: Vehicle) => {
    console.log('Delete button clicked for vehicle:', vehicle.vehicleModel);
    Alert.alert(
      'Delete Vehicle',
      `Are you sure you want to delete the vehicle "${vehicle.vehicleModel}" (${vehicle.vehicleNumber})?\n\nVehicle Details:\n• Driver: ${vehicle.firstName} ${vehicle.lastName}\n• Phone: ${vehicle.phone}\n• Plate: ${vehicle.vehicleNumber}\n\nThis action cannot be undone and will permanently remove the vehicle from your fleet.`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => console.log('Delete cancelled')
        },
        {
          text: 'Yes, Delete',
          style: 'destructive',
          onPress: () => {
            console.log('Delete confirmed, executing...');
            executeDeleteVehicle(vehicle);
          }
        }
      ]
    );
  };

  const executeDeleteVehicle = async (vehicle: Vehicle) => {
    console.log('Executing delete for vehicle ID:', vehicle._id);
    try {
      setLoading(true);
      
      // Make API call to delete vehicle
      console.log('Making DELETE request to:', `http://localhost:8080/vehicle/delete/${vehicle._id}`);
      const response = await fetch(`http://localhost:8080/vehicle/delete/${vehicle._id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('Delete response status:', response.status);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Remove vehicle from local state
      setVehicleData(prevData => prevData.filter(v => v._id !== vehicle._id));
      
      // Remove vehicle from unavailability data
      const updatedUnavailability = { ...vehicleUnavailability };
      delete updatedUnavailability[vehicle._id];
      setVehicleUnavailability(updatedUnavailability);

      Alert.alert(
        'Vehicle Deleted',
        `The vehicle "${vehicle.vehicleModel}" has been successfully deleted from your fleet.`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      Alert.alert(
        'Delete Failed',
        'Failed to delete the vehicle. Please check your connection and try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  // Delete individual unavailable dates
  const handleDeleteSelectedDates = async () => {
    if (!viewingVehicle || datesToDelete.length === 0) {
      Alert.alert('Error', 'Please select dates to delete');
      return;
    }

    Alert.alert(
      'Delete Selected Dates',
      `Are you sure you want to delete ${datesToDelete.length} selected date(s)? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              // API call to delete specific dates
              // const response = await fetch(`http://localhost:8080/vehicle/${viewingVehicle._id}/unavailability`, {
              //   method: 'DELETE',
              //   headers: { 'Content-Type': 'application/json' },
              //   body: JSON.stringify({ dates: datesToDelete })
              // });

              // Update local state
              const updatedUnavailability = {
                ...vehicleUnavailability,
                [viewingVehicle._id]: (vehicleUnavailability[viewingVehicle._id] || [])
                  .filter(date => !datesToDelete.includes(date))
              };
              setVehicleUnavailability(updatedUnavailability);

              // Update schedule view
              const updatedScheduleMarkedDates = { ...vehicleScheduleMarkedDates };
              datesToDelete.forEach(date => {
                if (updatedScheduleMarkedDates[date] && 
                   (updatedScheduleMarkedDates[date].selectedColor === '#EF4444' || 
                    updatedScheduleMarkedDates[date].selectedColor === '#DC2626')) {
                  delete updatedScheduleMarkedDates[date];
                }
              });
              setVehicleScheduleMarkedDates(updatedScheduleMarkedDates);

              Alert.alert(
                'Success', 
                `Successfully deleted ${datesToDelete.length} unavailable date(s)`,
                [{ text: 'OK', onPress: () => {
                  setDeleteMode(false);
                  setDatesToDelete([]);
                }}]
              );
            } catch (error) {
              console.error('Error deleting dates:', error);
              Alert.alert('Error', 'Failed to delete selected dates. Please try again.');
            }
          }
        }
      ]
    );
  };

  // Handle date selection in delete mode
  const handleDateSelectionForDelete = (day: any) => {
    const dateString = day.dateString;
    const dateInfo = vehicleScheduleMarkedDates[dateString];
    
    // Only allow selection of unavailable dates (red ones)
    if (!dateInfo || dateInfo.selectedColor !== '#EF4444') {
      Alert.alert('Info', 'You can only delete unavailable dates (red dates)');
      return;
    }

    setDatesToDelete(prevDates => {
      if (prevDates.includes(dateString)) {
        // Remove from selection
        const updatedMarkedDates = { ...vehicleScheduleMarkedDates };
        updatedMarkedDates[dateString] = {
          ...updatedMarkedDates[dateString],
          selectedColor: '#EF4444',
          customStyles: {
            container: {
              backgroundColor: '#EF4444',
              borderRadius: 16,
            },
            text: {
              color: '#FFFFFF',
              fontWeight: 'bold'
            }
          }
        };
        setVehicleScheduleMarkedDates(updatedMarkedDates);
        
        return prevDates.filter(date => date !== dateString);
      } else {
        // Add to selection
        const updatedMarkedDates = { ...vehicleScheduleMarkedDates };
        updatedMarkedDates[dateString] = {
          ...updatedMarkedDates[dateString],
          selectedColor: '#DC2626',
          customStyles: {
            container: {
              backgroundColor: '#DC2626',
              borderRadius: 16,
              borderWidth: 3,
              borderColor: '#FFFFFF',
            },
            text: {
              color: '#FFFFFF',
              fontWeight: 'bold'
            }
          }
        };
        setVehicleScheduleMarkedDates(updatedMarkedDates);
        
        return [...prevDates, dateString];
      }
    });
  };

  // Handle date selection from the DateTimePicker
  const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');

    if (selectedDate) {
      if (datePickerMode === 'from') {
        setFromDate(selectedDate);
      } else {
        setToDate(selectedDate);
      }
    }
    
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
  };

  // Add date range to unavailable dates
  const handleAddDateRange = () => {
    if (fromDate > toDate) {
      Alert.alert('Error', 'From date cannot be after To date');
      return;
    }

    const newMarkedDates = { ...markedDates };
    const newSelectedDates = [...selectedDates];
    
    // Generate all dates between fromDate and toDate
    const currentDate = new Date(fromDate);
    while (currentDate <= toDate) {
      const dateString = currentDate.toISOString().split('T')[0];
      
      if (!newSelectedDates.includes(dateString)) {
        newSelectedDates.push(dateString);
        newMarkedDates[dateString] = {
          selected: true,
          selectedColor: '#EF4444',
          selectedTextColor: '#FFFFFF'
        };
      }
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    setSelectedDates(newSelectedDates);
    setMarkedDates(newMarkedDates);
    
    Alert.alert('Success', `Added ${newSelectedDates.length - selectedDates.length} unavailable dates`);
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

  // Refresh data when screen comes into focus (e.g., after registering a new vehicle)
  useFocusEffect(
    useCallback(() => {
      getData();
    }, [])
  );

  useEffect(() => {
    if (vehicleData.length > 0) {
      loadVehicleUnavailability();
    }
  }, [vehicleData]);

  useEffect(() => {
    updateOverviewCalendar();
  }, [vehicleUnavailability, vehicleData]);

  const handleDateSelect = (day: any) => {
    const dateString = day.dateString;
    
    if (scheduleMode === 'individual') {
      setSelectedDates(prevDates => {
        const newDates = prevDates.includes(dateString)
          ? prevDates.filter(date => date !== dateString)
          : [...prevDates, dateString];
        
        // Update marked dates
        const newMarkedDates = { ...markedDates };
        if (newDates.includes(dateString)) {
          newMarkedDates[dateString] = {
            selected: true,
            selectedColor: '#EF4444',
            selectedTextColor: '#FFFFFF'
          };
        } else {
          delete newMarkedDates[dateString];
        }
        setMarkedDates(newMarkedDates);
        
        return newDates;
      });
    }
  };

  const handleConfirmSchedule = () => {
    if (selectedDates.length > 0 && selectedVehicle) {
      // Update vehicle unavailability data
      const updatedUnavailability = {
        ...vehicleUnavailability,
        [selectedVehicle._id]: selectedDates
      };
      setVehicleUnavailability(updatedUnavailability);
      
      const datesList = selectedDates.sort().join('\n');
      Alert.alert(
        'Unavailability Schedule Confirmed',
        `Vehicle: ${selectedVehicle.vehicleModel}\nDriver: ${selectedVehicle.firstName} ${selectedVehicle.lastName}\nUnavailable Dates:\n${datesList}`,
        [
          {
            text: 'OK',
            onPress: () => {
              // Here you would typically save to backend
              handleCloseModal();
            },
          },
        ]
      );
    } else {
      Alert.alert('Error', 'Please select at least one unavailable date');
    }
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedDates([]);
    setMarkedDates({});
    setSelectedVehicle(null);
    setScheduleMode('individual');
    setFromDate(new Date());
    setToDate(new Date());
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

        {/* Overview Calendar Section */}
        <View className="mx-4 mb-4">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-lg font-bold text-gray-900">Fleet Unavailability Overview</Text>
            <TouchableOpacity 
              onPress={() => setShowOverviewCalendar(!showOverviewCalendar)}
              className="p-2"
            >
              <FontAwesome 
                name={showOverviewCalendar ? "chevron-up" : "chevron-down"} 
                size={16} 
                color="#666" 
              />
            </TouchableOpacity>
          </View>
          
          {showOverviewCalendar && (
            <View className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <Calendar
                markedDates={allUnavailableDates}
                markingType="custom"
                minDate={new Date().toISOString().split('T')[0]}
                onDayPress={(day) => {
                  const dateInfo = allUnavailableDates[day.dateString];
                  if (dateInfo && dateInfo.vehicles) {
                    const vehicleList = dateInfo.vehicles
                      .map((v: any) => `• ${v.model} (${v.driver})`)
                      .join('\n');
                    Alert.alert(
                      `Unavailable Vehicles - ${day.dateString}`,
                      vehicleList,
                      [{ text: 'OK' }]
                    );
                  }
                }}
                theme={{
                  backgroundColor: '#ffffff',
                  calendarBackground: '#ffffff',
                  textSectionTitleColor: '#b6c1cd',
                  selectedDayBackgroundColor: '#EF4444',
                  selectedDayTextColor: '#FFFFFF',
                  todayTextColor: '#00adf5',
                  dayTextColor: '#2d4150',
                  textDisabledColor: '#d9e1e8',
                  arrowColor: '#EF4444',
                  monthTextColor: '#2d4150',
                  indicatorColor: '#EF4444',
                  textDayFontWeight: '300',
                  textMonthFontWeight: 'bold',
                  textDayHeaderFontWeight: '300',
                  textDayFontSize: 16,
                  textMonthFontSize: 16,
                  textDayHeaderFontSize: 13,
                }}
              />
              
              {/* Legend */}
              <View className="flex-row items-center justify-center mt-3 pt-3 border-t border-gray-200">
                <View className="flex-row items-center">
                  <View className="w-4 h-4 bg-red-500 rounded-full mr-2" />
                  <Text className="text-sm text-gray-600">Vehicles Unavailable</Text>
                </View>
              </View>
              
              {/* Quick Stats */}
              <View className="flex-row justify-around mt-3 pt-3 border-t border-gray-200">
                <View className="items-center">
                  <Text className="text-lg font-bold text-gray-900">
                    {Object.keys(allUnavailableDates).length}
                  </Text>
                  <Text className="text-xs text-gray-600">Days with Unavailability</Text>
                </View>
                <View className="items-center">
                  <Text className="text-lg font-bold text-gray-900">
                    {vehicleData.length}
                  </Text>
                  <Text className="text-xs text-gray-600">Total Vehicles</Text>
                </View>
                <View className="items-center">
                  <Text className="text-lg font-bold text-gray-900">
                    {Object.keys(vehicleUnavailability).length}
                  </Text>
                  <Text className="text-xs text-gray-600">Vehicles with Schedules</Text>
                </View>
              </View>
            </View>
          )}
        </View>

        {/* Vehicle Cards */}
        {vehicleData.length > 0 ? (
          vehicleData.map((vehicle) => (
            <VehicleCard 
              key={vehicle._id} 
              vehicle={vehicle} 
              onSchedule={handleSchedule}
              onViewSchedule={handleViewSchedule}
              onDelete={handleDeleteVehicle}
              unavailableDates={vehicleUnavailability[vehicle._id] || []}
            />
          ))
        ) : (
          <View className="flex-1 justify-center items-center py-20">
            <FontAwesome name="car" size={64} color="#ccc" />
            <Text className="text-gray-500 text-lg mt-4">No vehicles found</Text>
            <Text className="text-gray-400 text-sm mt-2">Add your first vehicle to get started</Text>
          </View>
        )}
      </ScrollView>

      {/* Enhanced Schedule Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={handleCloseModal}
      >
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
          <View className="bg-white rounded-2xl p-6 mx-4 w-full max-w-lg max-h-[90%]">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-bold text-gray-900">Set Vehicle Unavailability</Text>
              <TouchableOpacity onPress={handleCloseModal}>
                <FontAwesome name="times" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            {selectedVehicle && (
              <View className="mb-4 p-3 bg-gray-50 rounded-lg">
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

            {/* Mode Selection */}
            <View className="flex-row mb-4 bg-gray-100 rounded-lg p-1">
              <Pressable
                className={`flex-1 py-2 px-3 rounded-md ${scheduleMode === 'individual' ? 'bg-white shadow-sm' : ''}`}
                onPress={() => setScheduleMode('individual')}
              >
                <Text className={`text-center text-sm font-medium ${scheduleMode === 'individual' ? 'text-gray-900' : 'text-gray-600'}`}>
                  Individual Dates
                </Text>
              </Pressable>
              <Pressable
                className={`flex-1 py-2 px-3 rounded-md ${scheduleMode === 'range' ? 'bg-white shadow-sm' : ''}`}
                onPress={() => setScheduleMode('range')}
              >
                <Text className={`text-center text-sm font-medium ${scheduleMode === 'range' ? 'text-gray-900' : 'text-gray-600'}`}>
                  Date Range
                </Text>
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} className="max-h-80">
              {scheduleMode === 'individual' ? (
                <>
                  <Text className="text-base font-medium text-gray-900 mb-3">Select Unavailable Dates:</Text>
                  
                  <Calendar
                    onDayPress={handleDateSelect}
                    markedDates={markedDates}
                    minDate={new Date().toISOString().split('T')[0]}
                    theme={{
                      backgroundColor: '#ffffff',
                      calendarBackground: '#ffffff',
                      textSectionTitleColor: '#b6c1cd',
                      selectedDayBackgroundColor: '#EF4444',
                      selectedDayTextColor: '#FFFFFF',
                      todayTextColor: '#00adf5',
                      dayTextColor: '#2d4150',
                      textDisabledColor: '#d9e1e8',
                      arrowColor: '#EF4444',
                      monthTextColor: '#2d4150',
                      indicatorColor: '#EF4444',
                      textDayFontWeight: '300',
                      textMonthFontWeight: 'bold',
                      textDayHeaderFontWeight: '300',
                      textDayFontSize: 16,
                      textMonthFontSize: 16,
                      textDayHeaderFontSize: 13,
                    }}
                  />
                </>
              ) : (
                <>
                  <Text className="text-base font-medium text-gray-900 mb-3">Add Date Range:</Text>
                  
                  {/* Date Range Picker Section */}
                  <View className="bg-gray-50 p-4 rounded-lg mb-4">
                    <View className="flex-row justify-between items-center mb-3">
                      <Text className="text-sm font-medium text-gray-700 w-12">From</Text>
                      <TouchableOpacity
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 bg-white"
                        onPress={() => {
                          setDatePickerMode('from');
                          setShowDatePicker(true);
                        }}
                      >
                        <Text className="text-sm text-gray-900">
                          {fromDate.toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </Text>
                      </TouchableOpacity>
                    </View>
                    
                    <View className="flex-row justify-between items-center mb-3">
                      <Text className="text-sm font-medium text-gray-700 w-12">To</Text>
                      <TouchableOpacity
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 bg-white"
                        onPress={() => {
                          setDatePickerMode('to');
                          setShowDatePicker(true);
                        }}
                      >
                        <Text className="text-sm text-gray-900">
                          {toDate.toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </Text>
                      </TouchableOpacity>
                    </View>
                    
                    <Pressable
                      className="bg-[#EF4444] py-2 px-4 rounded-lg"
                      onPress={handleAddDateRange}
                    >
                      <Text className="text-white font-medium text-center">Add Range to Unavailable Dates</Text>
                    </Pressable>
                  </View>

                  {/* Calendar to show selected dates */}
                  <Text className="text-base font-medium text-gray-900 mb-3">Current Unavailable Dates:</Text>
                  <Calendar
                    markedDates={markedDates}
                    minDate={new Date().toISOString().split('T')[0]}
                    theme={{
                      backgroundColor: '#ffffff',
                      calendarBackground: '#ffffff',
                      textSectionTitleColor: '#b6c1cd',
                      selectedDayBackgroundColor: '#EF4444',
                      selectedDayTextColor: '#FFFFFF',
                      todayTextColor: '#00adf5',
                      dayTextColor: '#2d4150',
                      textDisabledColor: '#d9e1e8',
                      arrowColor: '#EF4444',
                      monthTextColor: '#2d4150',
                      indicatorColor: '#EF4444',
                      textDayFontWeight: '300',
                      textMonthFontWeight: 'bold',
                      textDayHeaderFontWeight: '300',
                      textDayFontSize: 16,
                      textMonthFontSize: 16,
                      textDayHeaderFontSize: 13,
                    }}
                  />
                </>
              )}
            </ScrollView>

            {selectedDates.length > 0 && (
              <View className="mt-4 p-3 bg-red-50 rounded-lg border border-red-200">
                <Text className="text-sm font-medium text-red-900 mb-2">
                  Unavailable Dates ({selectedDates.length}):
                </Text>
                <Text className="text-xs text-red-700">
                  {selectedDates.sort().slice(0, 10).join(', ')}
                  {selectedDates.length > 10 ? ` and ${selectedDates.length - 10} more...` : ''}
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
                className="bg-[#EF4444] px-6 py-3 rounded-lg flex-1 ml-2"
                onPress={handleConfirmSchedule}
              >
                <Text className="text-white font-medium text-center">Save Unavailability</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Date Picker */}
      {showDatePicker && (
        <DateTimePicker
          value={datePickerMode === 'from' ? fromDate : toDate}
          mode="date"
          display="default"
          minimumDate={new Date()}
          onChange={handleDateChange}
        />
      )}

      {/* Vehicle Schedule View Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isScheduleViewVisible}
        onRequestClose={handleCloseScheduleView}
      >
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
          <View className="bg-white rounded-2xl p-6 mx-4 w-full max-w-lg max-h-[90%]">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-bold text-gray-900">Vehicle Schedule</Text>
              <TouchableOpacity onPress={handleCloseScheduleView}>
                <FontAwesome name="times" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            {viewingVehicle && (
              <View className="mb-4 p-4 bg-gray-50 rounded-lg">
                <Text className="text-lg font-semibold text-gray-800 mb-2">
                  {viewingVehicle.vehicleModel}
                </Text>
                <Text className="text-sm text-gray-600 mb-1">
                  Driver: {viewingVehicle.firstName} {viewingVehicle.lastName}
                </Text>
                <Text className="text-sm text-gray-600 mb-1">
                  Phone: {viewingVehicle.phone}
                </Text>
                <Text className="text-sm text-gray-600">
                  Plate: {viewingVehicle.vehicleNumber}
                </Text>
              </View>
            )}

            <ScrollView showsVerticalScrollIndicator={false} className="max-h-80">
              <Text className="text-base font-medium text-gray-900 mb-3">
                {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </Text>
              
              <Calendar
                current={currentDate.toISOString().split('T')[0]}
                markedDates={vehicleScheduleMarkedDates}
                markingType="custom"
                minDate={new Date().toISOString().split('T')[0]}
                onDayPress={(day) => {
                  if (deleteMode) {
                    handleDateSelectionForDelete(day);
                  } else {
                    const dateInfo = vehicleScheduleMarkedDates[day.dateString];
                    if (dateInfo) {
                      let message = '';
                      if (dateInfo.selectedColor === '#EF4444' || dateInfo.selectedColor === '#DC2626') {
                        message = 'Vehicle is unavailable on this date';
                      } else if (dateInfo.selectedColor === '#FBBF24') {
                        message = 'Vehicle is booked on this date';
                      }
                      
                      if (message) {
                        Alert.alert(
                          `${day.dateString}`,
                          message,
                          [{ text: 'OK' }]
                        );
                      }
                    }
                  }
                }}
                theme={{
                  backgroundColor: '#ffffff',
                  calendarBackground: '#ffffff',
                  textSectionTitleColor: '#b6c1cd',
                  selectedDayBackgroundColor: '#EF4444',
                  selectedDayTextColor: '#FFFFFF',
                  todayTextColor: '#00adf5',
                  dayTextColor: '#2d4150',
                  textDisabledColor: '#d9e1e8',
                  arrowColor: '#007AFF',
                  monthTextColor: '#2d4150',
                  indicatorColor: '#007AFF',
                  textDayFontWeight: '300',
                  textMonthFontWeight: 'bold',
                  textDayHeaderFontWeight: '300',
                  textDayFontSize: 16,
                  textMonthFontSize: 16,
                  textDayHeaderFontSize: 13,
                }}
              />
              
              {/* Legend for schedule view */}
              <View className="mt-4 p-3 bg-gray-50 rounded-lg">
                <Text className="text-sm font-medium text-gray-900 mb-3">Legend:</Text>
                <View className="space-y-2">
                  <View className="flex-row items-center">
                    <View className="w-4 h-4 bg-red-500 rounded-full mr-3" />
                    <Text className="text-sm text-gray-600">Unavailable</Text>
                  </View>
                  <View className="flex-row items-center">
                    <View className="w-4 h-4 bg-yellow-400 rounded-full mr-3" />
                    <Text className="text-sm text-gray-600">Booked</Text>
                  </View>
                  <View className="flex-row items-center">
                    <View className="w-4 h-4 bg-green-500 rounded-full mr-3" />
                    <Text className="text-sm text-gray-600">Available</Text>
                  </View>
                  {deleteMode && (
                    <View className="flex-row items-center">
                      <View className="w-4 h-4 bg-red-700 border-2 border-white rounded-full mr-3" />
                      <Text className="text-sm text-gray-600">Selected for deletion</Text>
                    </View>
                  )}
                </View>
              </View>

              {/* Delete Mode Instructions */}
              {deleteMode && (
                <View className="mt-3 p-3 bg-red-50 rounded-lg border border-red-200">
                  <Text className="text-sm font-medium text-red-800 mb-1">Individual Delete Mode</Text>
                  <Text className="text-xs text-red-600">
                    Select individual unavailable dates (red) by tapping them. 
                    {datesToDelete.length > 0 && ` ${datesToDelete.length} date(s) selected for deletion.`}
                    {datesToDelete.length === 0 && ' Select dates to enable deletion.'}
                  </Text>
                </View>
              )}

              {/* Schedule Statistics */}
              {viewingVehicle && (
                <View className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <Text className="text-sm font-medium text-blue-900 mb-2">This Month's Stats:</Text>
                  <View className="flex-row justify-between">
                    <View className="items-center">
                      <Text className="text-lg font-bold text-blue-900">
                        {(vehicleUnavailability[viewingVehicle._id] || []).filter(date => 
                          new Date(date).getMonth() === new Date().getMonth()
                        ).length}
                      </Text>
                      <Text className="text-xs text-blue-700">Unavailable Days</Text>
                    </View>
                    <View className="items-center">
                      <Text className="text-lg font-bold text-blue-900">3</Text>
                      <Text className="text-xs text-blue-700">Bookings</Text>
                    </View>
                    <View className="items-center">
                      <Text className="text-lg font-bold text-blue-900">
                        {new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate() - 
                         (vehicleUnavailability[viewingVehicle._id] || []).filter(date => 
                           new Date(date).getMonth() === new Date().getMonth()
                         ).length - 3}
                      </Text>
                      <Text className="text-xs text-blue-700">Available Days</Text>
                    </View>
                  </View>
                </View>
              )}
            </ScrollView>

            {/* Action Buttons */}
            <View className="mt-6 space-y-3">
              {!deleteMode ? (
                <>
                  {/* Normal Mode Buttons */}
                  <Pressable
                    className="bg-red-500 px-4 py-3 rounded-lg"
                    onPress={() => setDeleteMode(true)}
                  >
                    <Text className="text-white font-medium text-center">Delete Individual Dates</Text>
                  </Pressable>
                  <Pressable
                    className="bg-gray-300 px-6 py-3 rounded-lg"
                    onPress={handleCloseScheduleView}
                  >
                    <Text className="text-gray-700 font-medium text-center">Close</Text>
                  </Pressable>
                </>
              ) : (
                <>
                  {/* Delete Mode Buttons */}
                  <View className="flex-row space-x-3">
                    <Pressable
                      className="bg-gray-400 px-4 py-3 rounded-lg flex-1"
                      onPress={() => {
                        setDeleteMode(false);
                        setDatesToDelete([]);
                        // Refresh the calendar to remove selection styling
                        if (viewingVehicle) {
                          handleViewSchedule(viewingVehicle);
                        }
                      }}
                    >
                      <Text className="text-white font-medium text-center">Cancel</Text>
                    </Pressable>
                    <Pressable
                      className={`px-4 py-3 rounded-lg flex-1 ${
                        datesToDelete.length > 0 ? 'bg-red-600' : 'bg-gray-300'
                      }`}
                      onPress={handleDeleteSelectedDates}
                      disabled={datesToDelete.length === 0}
                    >
                      <Text className={`font-medium text-center ${
                        datesToDelete.length > 0 ? 'text-white' : 'text-gray-500'
                      }`}>
                        Delete Selected ({datesToDelete.length})
                      </Text>
                    </Pressable>
                  </View>
                </>
              )}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}