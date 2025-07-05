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
import { Award, Upload } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  DriverRegistration: undefined;
  VehicleDetails: undefined;
  LicenseExperience: undefined;
};

type LicenseExperienceScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'LicenseExperience'
>;

interface LicenseFormData {
  drivingLicenseNumber: string;
  licenseExpiryDate: string;
  yearOfManufacture: string;
  seatingCapacity: string;
  licensePhoto: string | null;
  yearsOfExperience: string;
  languagesSpoken: string;
  additionalComments: string;
}

interface FormErrors {
  drivingLicenseNumber?: string;
  licenseExpiryDate?: string;
  yearOfManufacture?: string;
  seatingCapacity?: string;
  licensePhoto?: string;
  yearsOfExperience?: string;
  languagesSpoken?: string;
}

const yearOptions = [
  { label: 'Select Year', value: '' },
  ...Array.from({ length: 30 }, (_, i) => {
    const year = new Date().getFullYear() - i;
    return { label: year.toString(), value: year.toString() };
  }),
];

const seatingCapacityOptions = [
  { label: 'Select Seating Capacity', value: '' },
  { label: '2 Seats', value: '2' },
  { label: '4 Seats', value: '4' },
  { label: '5 Seats', value: '5' },
  { label: '7 Seats', value: '7' },
  { label: '8+ Seats', value: '8+' },
];

export default function LicenseExperience() {
  const navigation = useNavigation<LicenseExperienceScreenNavigationProp>();
  const [formData, setFormData] = useState<LicenseFormData>({
    drivingLicenseNumber: '',
    licenseExpiryDate: '',
    yearOfManufacture: '',
    seatingCapacity: '',
    licensePhoto: null,
    yearsOfExperience: '',
    languagesSpoken: '',
    additionalComments: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [showSeatingCapacityPicker, setShowSeatingCapacityPicker] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.drivingLicenseNumber.trim()) {
      newErrors.drivingLicenseNumber = 'Driving license number is required';
    }

    if (!formData.licenseExpiryDate.trim()) {
      newErrors.licenseExpiryDate = 'License expiry date is required';
    } else if (!/^\d{2}\/\d{2}\/\d{4}$/.test(formData.licenseExpiryDate)) {
      newErrors.licenseExpiryDate = 'Please enter date in DD/MM/YYYY format';
    } else {
      // Check if expiry date is in the future
      const [day, month, year] = formData.licenseExpiryDate.split('/').map(Number);
      const expiryDate = new Date(year, month - 1, day);
      const today = new Date();
      if (expiryDate <= today) {
        newErrors.licenseExpiryDate = 'License expiry date must be in the future';
      }
    }

    if (!formData.yearOfManufacture) {
      newErrors.yearOfManufacture = 'Year of manufacture is required';
    }

    if (!formData.seatingCapacity) {
      newErrors.seatingCapacity = 'Seating capacity is required';
    }

    if (!formData.licensePhoto) {
      newErrors.licensePhoto = 'License photo is required';
    }

    if (!formData.yearsOfExperience.trim()) {
      newErrors.yearsOfExperience = 'Years of experience is required';
    } else {
      const experience = parseInt(formData.yearsOfExperience);
      if (isNaN(experience) || experience < 0 || experience > 50) {
        newErrors.yearsOfExperience = 'Please enter a valid number of years (0-50)';
      }
    }

    if (!formData.languagesSpoken.trim()) {
      newErrors.languagesSpoken = 'Languages spoken is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof LicenseFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const formatDate = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    let formatted = cleaned;

    if (cleaned.length >= 2) {
      formatted = cleaned.slice(0, 2) + '/' + cleaned.slice(2);
    }
    if (cleaned.length >= 4) {
      formatted = cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4) + '/' + cleaned.slice(4, 8);
    }

    return formatted;
  };

  const handleDateChange = (text: string) => {
    const formatted = formatDate(text);
    handleInputChange('licenseExpiryDate', formatted);
  };

  const handleImageUpload = () => {
    Alert.alert(
      'Upload License Photo',
      'Choose an option',
      [
        {
          text: 'Camera',
          onPress: () => {
            const mockImageUrl = 'https://images.pexels.com/photos/1005644/pexels-photo-1005644.jpeg?auto=compress&cs=tinysrgb&w=400';
            handleInputChange('licensePhoto', mockImageUrl);
          }
        },
        {
          text: 'Gallery',
          onPress: () => {
            const mockImageUrl = 'https://images.pexels.com/photos/1005644/pexels-photo-1005644.jpeg?auto=compress&cs=tinysrgb&w=400';
            handleInputChange('licensePhoto', mockImageUrl);
          }
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleSubmit = () => {
    if (validateForm()) {
      Alert.alert(
        'Registration Complete!',
        'Your driver registration has been submitted successfully. You will be notified once your application is reviewed.',
        [
          {
            text: 'OK',
            onPress: () => {
              console.log('Complete registration data:', formData);
              // Optionally navigate back to the first screen or a success screen
              navigation.navigate('DriverRegistration');
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
    field: keyof LicenseFormData,
    placeholder: string,
    keyboardType: 'default' | 'numeric' = 'default',
    multiline: boolean = false
  ) => (
    <View className="mb-5">
      <Text className="text-sm font-medium text-gray-700 mb-2">
        {placeholder} <Text className="text-red-500">*</Text>
      </Text>
      <TextInput
        className={`border border-gray-300 rounded-lg px-4 py-3 text-base text-gray-900 bg-white ${
          multiline ? 'h-24 text-top' : ''
        } ${errors[field as keyof FormErrors] ? 'border-red-500' : ''}`}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        value={formData[field] as string}
        onChangeText={(text) => {
          if (field === 'licenseExpiryDate') {
            handleDateChange(text);
          } else {
            handleInputChange(field, text);
          }
        }}
        keyboardType={keyboardType}
        multiline={multiline}
        numberOfLines={multiline ? 4 : 1}
        maxLength={field === 'licenseExpiryDate' ? 10 : undefined}
      />
      {errors[field as keyof FormErrors] && (
        <Text className="text-red-500 text-xs mt-1">
          {errors[field as keyof FormErrors]}
        </Text>
      )}
    </View>
  );

  const renderOptionalInput = (
    field: keyof LicenseFormData,
    placeholder: string,
    multiline: boolean = false
  ) => (
    <View className="mb-5">
      <Text className="text-sm font-medium text-gray-700 mb-2">{placeholder}</Text>
      <TextInput
        className={`border border-gray-300 rounded-lg px-4 py-3 text-base text-gray-900 bg-white ${
          multiline ? 'h-24 text-top' : ''
        }`}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        value={formData[field] as string}
        onChangeText={(text) => handleInputChange(field, text)}
        multiline={multiline}
        numberOfLines={multiline ? 4 : 1}
      />
    </View>
  );

  const renderDropdown = (
    field: keyof LicenseFormData,
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
        <View className="border border-gray-300 rounded-lg bg-white mt-1 shadow-md max-h-52">
          <ScrollView nestedScrollEnabled>
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
          </ScrollView>
        </View>
      )}
      {errors[field as keyof FormErrors] && (
        <Text className="text-red-500 text-xs mt-1">
          {errors[field as keyof FormErrors]}
        </Text>
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
              Section 3 of 3 - License & Experience
            </Text>
          </View>

          {/* Profile Section */}
          <View className="items-center py-8">
            <View className="w-20 h-20 rounded-full bg-yellow-400 justify-center items-center mb-4 shadow-md">
              <Award size={40} color="#FFFFFF" />
            </View>
            <Text className="text-lg font-semibold text-gray-900">License & Experience</Text>
          </View>

          {/* Form */}
          <View className="px-6 pb-5">
            {renderInput('drivingLicenseNumber', 'Driving License Number')}
            {renderInput('licenseExpiryDate', 'License Expiry Date')}

            <View className="flex-row justify-between mb-0">
              <View className="w-[48%]">
                {renderDropdown(
                  'yearOfManufacture',
                  'Year of Manufacture',
                  yearOptions,
                  showYearPicker,
                  setShowYearPicker
                )}
              </View>
              <View className="w-[48%]">
                {renderDropdown(
                  'seatingCapacity',
                  'Seating Capacity',
                  seatingCapacityOptions,
                  showSeatingCapacityPicker,
                  setShowSeatingCapacityPicker
                )}
              </View>
            </View>

            {/* License Photo Upload */}
            <View className="mb-6">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                License Photo <Text className="text-red-500">*</Text>
              </Text>
              <TouchableOpacity
                className={`border-2 border-gray-200 border-dashed rounded-lg py-8 px-4 items-center justify-center bg-gray-50 min-h-[120px] ${
                  errors.licensePhoto ? 'border-red-500' : ''
                }`}
                onPress={handleImageUpload}
              >
                {formData.licensePhoto ? (
                  <Image source={{ uri: formData.licensePhoto }} className="w-full h-[100px] rounded-sm resize-cover" />
                ) : (
                  <>
                    <Upload size={32} color="#9CA3AF" />
                    <Text className="text-gray-500 text-sm mt-2 text-center">
                      Upload the driving license photo
                    </Text>
                  </>
                )}
              </TouchableOpacity>
              {errors.licensePhoto && (
                <Text className="text-red-500 text-xs mt-1">{errors.licensePhoto}</Text>
              )}
            </View>

            {renderInput('yearsOfExperience', 'Years of Experience', 'numeric')}
            {renderInput('languagesSpoken', 'Languages Spoken')}
            {renderOptionalInput('additionalComments', 'Additional Comments or Special Notes', true)}
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
              onPress={handleSubmit}
              activeOpacity={0.8}
            >
              <Text className="text-base font-semibold text-gray-900">Submit</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}