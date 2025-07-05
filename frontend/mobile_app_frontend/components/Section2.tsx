import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Car, Upload } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  DriverRegistration: undefined;
  VehicleDetails: undefined;
  LicenseExperience: undefined;
};

type VehicleDetailsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'VehicleDetails'
>;

interface VehicleFormData {
  vehicleOwner: string;
  vehicleType: string;
  vehicleModel: string;
  yearOfManufacture: string;
  seatingCapacity: string;
  memberPlate: string;
  numberPlate: string;
  vehicleImage: string | null;
  vehicleLicenseCopy: string | null;
  insuranceDocument: string | null;
}

interface FormErrors {
  vehicleOwner?: string;
  vehicleType?: string;
  vehicleModel?: string;
  yearOfManufacture?: string;
  seatingCapacity?: string;
  memberPlate?: string;
  numberPlate?: string;
  vehicleImage?: string;
  vehicleLicenseCopy?: string;
  insuranceDocument?: string;
}

const vehicleTypes = [
  { label: 'Select Vehicle Type', value: '' },
  { label: 'Car', value: 'car' },
  { label: 'SUV', value: 'suv' },
  { label: 'Van', value: 'van' },
  { label: 'Truck', value: 'truck' },
  { label: 'Motorcycle', value: 'motorcycle' },
  { label: 'Bus', value: 'bus' },
];

const seatingCapacities = [
  { label: 'Select Seating Capacity', value: '' },
  { label: '2 Seats', value: '2' },
  { label: '4 Seats', value: '4' },
  { label: '5 Seats', value: '5' },
  { label: '7 Seats', value: '7' },
  { label: '8+ Seats', value: '8+' },
];

export default function VehicleDetails() {
  const navigation = useNavigation<VehicleDetailsScreenNavigationProp>();
  const [formData, setFormData] = useState<VehicleFormData>({
    vehicleOwner: '',
    vehicleType: '',
    vehicleModel: '',
    yearOfManufacture: '',
    seatingCapacity: '',
    memberPlate: '',
    numberPlate: '',
    vehicleImage: null,
    vehicleLicenseCopy: null,
    insuranceDocument: null,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [showVehicleTypePicker, setShowVehicleTypePicker] = useState(false);
  const [showSeatingCapacityPicker, setShowSeatingCapacityPicker] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.vehicleOwner.trim()) {
      newErrors.vehicleOwner = 'Vehicle owner is required';
    }

    if (!formData.vehicleType) {
      newErrors.vehicleType = 'Vehicle type is required';
    }

    if (!formData.vehicleModel.trim()) {
      newErrors.vehicleModel = 'Vehicle model is required';
    }

    if (!formData.yearOfManufacture.trim()) {
      newErrors.yearOfManufacture = 'Year of manufacture is required';
    } else {
      const year = parseInt(formData.yearOfManufacture);
      const currentYear = new Date().getFullYear();
      if (year < 1900 || year > currentYear) {
        newErrors.yearOfManufacture = `Please enter a valid year between 1900 and ${currentYear}`;
      }
    }

    if (!formData.seatingCapacity) {
      newErrors.seatingCapacity = 'Seating capacity is required';
    }

    if (!formData.memberPlate.trim()) {
      newErrors.memberPlate = 'Member plate is required';
    }

    if (!formData.numberPlate.trim()) {
      newErrors.numberPlate = 'Number plate is required';
    }

    if (!formData.vehicleImage) {
      newErrors.vehicleImage = 'Vehicle image is required';
    }

    if (!formData.vehicleLicenseCopy) {
      newErrors.vehicleLicenseCopy = 'Vehicle license copy is required';
    }

    if (!formData.insuranceDocument) {
      newErrors.insuranceDocument = 'Insurance document is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof VehicleFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleImageUpload = (type: 'vehicleImage' | 'vehicleLicenseCopy' | 'insuranceDocument') => {
    // In a real app, this would open camera/gallery
    Alert.alert(
      'Upload Image',
      'Choose an option',
      [
        {
          text: 'Camera',
          onPress: () => {
            // Simulate successful upload
            const mockImageUrl = 'https://images.pexels.com/photos/170811/cars-audi-auto-automotive-170811.jpeg?auto=compress&cs=tinysrgb&w=400';
            handleInputChange(type, mockImageUrl);
          }
        },
        {
          text: 'Gallery',
          onPress: () => {
            // Simulate successful upload
            const mockImageUrl = 'https://images.pexels.com/photos/170811/cars-audi-auto-automotive-170811.jpeg?auto=compress&cs=tinysrgb&w=400';
            handleInputChange(type, mockImageUrl);
          }
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleNext = () => {
    if (validateForm()) {
      Alert.alert(
        'Success',
        'Vehicle details saved successfully! Proceeding to next section...',
        [
          {
            text: 'OK',
            onPress: () => {
              console.log('Vehicle form data:', formData);
              navigation.navigate('LicenseExperience'); // Navigate to next section
            },
          },
        ]
      );
    }
  };

  const handlePrevious = () => {
    Alert.alert('Going back to previous section...');
    navigation.goBack();
  };

  const renderInput = (
    field: keyof VehicleFormData,
    placeholder: string,
    keyboardType: 'default' | 'numeric' = 'default'
  ) => (
    <View className="mb-5">
      <Text className="text-sm font-medium text-gray-700 mb-2">
        {placeholder} <Text className="text-red-500">*</Text>
      </Text>
      <TextInput
        className={`border border-gray-300 rounded-lg px-4 py-3 text-base text-gray-900 bg-white ${
          errors[field as keyof FormErrors] ? 'border-red-500' : ''
        }`}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        value={formData[field] as string}
        onChangeText={(text) => handleInputChange(field, text)}
        keyboardType={keyboardType}
      />
      {errors[field as keyof FormErrors] && (
        <Text className="text-red-500 text-xs mt-1">
          {errors[field as keyof FormErrors]}
        </Text>
      )}
    </View>
  );

  const renderDropdown = (
    field: keyof VehicleFormData,
    placeholder: string,
    options: { label: string; value: string }[],
    showPicker: boolean,
    setShowPicker: (show: boolean) => void
  ) => (
    <View className="mb-5">
      <Text className="text-sm font-medium text-gray-700 mb-2">
        {placeholder} <Text className="text-red-500">*</Text>
      </Text>
      <TouchableOpacity
        className={`border border-gray-300 rounded-lg px-4 py-3 bg-white justify-center ${
          errors[field as keyof FormErrors] ? 'border-red-500' : ''
        }`}
        onPress={() => setShowPicker(!showPicker)}
      >
        <Text
          className={`text-base ${
            !formData[field] ? 'text-gray-400' : 'text-gray-900'
          }`}
        >
          {formData[field]
            ? options.find((option) => option.value === formData[field])?.label
            : placeholder}
        </Text>
      </TouchableOpacity>
      {showPicker && (
        <View className="border border-gray-300 rounded-lg bg-white mt-1 shadow-md">
          {options.slice(1).map((option) => (
            <TouchableOpacity
              key={option.value}
              className="px-4 py-3 border-b border-gray-100 last:border-b-0"
              onPress={() => {
                handleInputChange(field, option.value);
                setShowPicker(false);
              }}
            >
              <Text className="text-base text-gray-900">{option.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      {errors[field as keyof FormErrors] && (
        <Text className="text-red-500 text-xs mt-1">
          {errors[field as keyof FormErrors]}
        </Text>
      )}
    </View>
  );

  const renderImageUpload = (
    type: 'vehicleImage' | 'vehicleLicenseCopy' | 'insuranceDocument',
    title: string,
    subtitle: string
  ) => (
    <View className="mb-6">
      <Text className="text-sm font-medium text-gray-700 mb-2">
        {title} <Text className="text-red-500">*</Text>
      </Text>
      <TouchableOpacity
        className={`border-2 border-gray-200 border-dashed rounded-lg py-8 px-4 items-center justify-center bg-gray-50 min-h-[120px] ${
          errors[type] ? 'border-red-500' : ''
        }`}
        onPress={() => handleImageUpload(type)}
      >
        {formData[type] ? (
          <Image source={{ uri: formData[type]! }} className="w-full h-[100px] rounded-sm resize-cover" />
        ) : (
          <>
            <Upload size={32} color="#9CA3AF" />
            <Text className="text-gray-500 text-sm mt-2 text-center">{subtitle}</Text>
          </>
        )}
      </TouchableOpacity>
      {errors[type] && (
        <Text className="text-red-500 text-xs mt-1">{errors[type]}</Text>
      )}
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View className="px-6 pt-5 pb-2 items-center">
            <Text className="text-sm font-medium text-gray-500 text-center">
              Section 2 of 3 - Vehicle Details
            </Text>
          </View>

          {/* Profile Section */}
          <View className="items-center py-8">
            <View className="w-20 h-20 rounded-full bg-yellow-400 justify-center items-center mb-4 shadow-md">
              <Car size={40} color="#FFFFFF" />
            </View>
            <Text className="text-lg font-semibold text-gray-900">Vehicle Details</Text>
          </View>

          {/* Form */}
          <View className="px-6 pb-5">
            {renderInput('vehicleOwner', 'Vehicle Owner')}

            {renderDropdown(
              'vehicleType',
              'Vehicle Type',
              vehicleTypes,
              showVehicleTypePicker,
              setShowVehicleTypePicker
            )}

            {renderInput('vehicleModel', 'Vehicle Model')}
            {renderInput('yearOfManufacture', 'Year of Manufacture', 'numeric')}

            {renderDropdown(
              'seatingCapacity',
              'Seating Capacity',
              seatingCapacities,
              showSeatingCapacityPicker,
              setShowSeatingCapacityPicker
            )}

            {renderInput('memberPlate', 'Member Plate')}
            {renderInput('numberPlate', 'Number Plate')}

            {/* Image Uploads */}
            {renderImageUpload('vehicleImage', 'Vehicle Image', 'Tap to upload vehicle photo')}
            {renderImageUpload('vehicleLicenseCopy', 'Vehicle License Copy', 'Tap to upload license document')}
            {renderImageUpload('insuranceDocument', 'Insurance Document', 'Tap to upload insurance document')}
          </View>

          {/* Navigation Buttons */}
          <View className="flex-row px-6 pb-8 gap-3">
            <TouchableOpacity
              className="flex-1 bg-gray-100 rounded-lg py-4 items-center shadow-md"
              onPress={handlePrevious}
              activeOpacity={0.8}
            >
              <Text className="text-base font-semibold text-gray-700">Previous</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-1 bg-yellow-400 rounded-lg py-4 items-center shadow-md"
              onPress={handleNext}
              activeOpacity={0.8}
            >
              <Text className="text-base font-semibold text-gray-900">Next</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}