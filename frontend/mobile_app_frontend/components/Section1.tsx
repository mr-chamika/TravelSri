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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

// Define your root stackParamList
type RootStackParamList = {
  DriverRegistration: undefined;
  VehicleDetails: undefined;
  LicenseExperience: undefined;
};

type DriverRegistrationScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'DriverRegistration'
>;

interface FormData {
  firstName: string;
  lastName: string;
  nicNumber: string;
  dateOfBirth: string;
  gender: string;
  mobileNumber: string;
  emergencyContact: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  nicNumber?: string;
  dateOfBirth?: string;
  gender?: string;
  mobileNumber?: string;
}

const genderOptions = [
  { label: 'Select Gender', value: '' },
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Other', value: 'other' },
];

export default function DriverRegistration() {
  const navigation = useNavigation<DriverRegistrationScreenNavigationProp>();
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    nicNumber: '',
    dateOfBirth: '',
    gender: '',
    mobileNumber: '',
    emergencyContact: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [showGenderPicker, setShowGenderPicker] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.nicNumber.trim()) {
      newErrors.nicNumber = 'NIC number is required';
    } else if (formData.nicNumber.length < 10) {
      newErrors.nicNumber = 'NIC number must be at least 10 characters';
    }

    if (!formData.dateOfBirth.trim()) {
      newErrors.dateOfBirth = 'Date of birth is required';
    } else if (!/^\d{2}\/\d{2}\/\d{4}$/.test(formData.dateOfBirth)) {
      newErrors.dateOfBirth = 'Please enter date in DD/MM/YYYY format';
    }

    if (!formData.gender) {
      newErrors.gender = 'Gender is required';
    }

    if (!formData.mobileNumber.trim()) {
      newErrors.mobileNumber = 'Mobile number is required';
    } else if (!/^\d{10}$/.test(formData.mobileNumber.replace(/\D/g, ''))) {
      newErrors.mobileNumber = 'Please enter a valid 10-digit mobile number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const formatDateOfBirth = (text: string) => {
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

  const handleDateOfBirthChange = (text: string) => {
    const formatted = formatDateOfBirth(text);
    handleInputChange('dateOfBirth', formatted);
  };

  const handleNext = () => {
    if (validateForm()) {
      Alert.alert(
        'Success',
        'Driver details saved successfully! Proceeding to next section...',
        [
          {
            text: 'OK',
            onPress: () => {
              console.log('Form data:', formData);
              navigation.navigate('VehicleDetails'); // Navigate to next section
            },
          },
        ]
      );
    }
  };

  const renderInput = (
    field: keyof FormData,
    placeholder: string,
    required: boolean = false,
    keyboardType: 'default' | 'numeric' | 'phone-pad' = 'default'
  ) => (
    <View className="mb-5">
      <Text className="text-sm font-medium text-gray-700 mb-2">
        {placeholder} {required && <Text className="text-red-500">*</Text>}
      </Text>
      <TextInput
        className={`border border-gray-300 rounded-lg px-4 py-3 text-base text-gray-900 bg-white ${
          errors[field as keyof FormErrors] ? 'border-red-500' : ''
        }`}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        value={formData[field]}
        onChangeText={(text) => {
          if (field === 'dateOfBirth') {
            handleDateOfBirthChange(text);
          } else {
            handleInputChange(field, text);
          }
        }}
        keyboardType={keyboardType}
        maxLength={field === 'dateOfBirth' ? 10 : undefined}
      />
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
              Section 1 of 3 - Driver's Information
            </Text>
          </View>

          {/* Profile Section */}
          <View className="items-center py-8">
            <View className="w-20 h-20 rounded-full bg-yellow-500 justify-center items-center mb-4 shadow-md">
              <User size={40} color="#FFFFFF" />
            </View>
            <Text className="text-lg font-semibold text-gray-900">Driver Details</Text>
          </View>

          {/* Form */}
          <View className="px-6 pb-5">
            <View className="flex-row justify-between mb-0">
              <View className="w-[48%]">
                {renderInput('firstName', 'First Name', true)}
              </View>
              <View className="w-[48%]">
                {renderInput('lastName', 'Last Name', true)}
              </View>
            </View>

            {renderInput('nicNumber', 'NIC Number', true)}
            {renderInput('dateOfBirth', 'Date of Birth', true)}

            {/* Gender Dropdown */}
            <View className="mb-5">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Gender <Text className="text-red-500">*</Text>
              </Text>
              <TouchableOpacity
                className={`border border-gray-300 rounded-lg px-4 py-3 bg-white justify-center ${
                  errors.gender ? 'border-red-500' : ''
                }`}
                onPress={() => setShowGenderPicker(!showGenderPicker)}
              >
                <Text
                  className={`text-base ${
                    !formData.gender ? 'text-gray-400' : 'text-gray-900'
                  }`}
                >
                  {formData.gender
                    ? genderOptions.find((option) => option.value === formData.gender)?.label
                    : 'Select Gender'}
                </Text>
              </TouchableOpacity>
              {showGenderPicker && (
                <View className="border border-gray-300 rounded-lg bg-white mt-1 shadow-md">
                  {genderOptions.slice(1).map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      className="px-4 py-3 border-b border-gray-100 last:border-b-0"
                      onPress={() => {
                        handleInputChange('gender', option.value);
                        setShowGenderPicker(false);
                      }}
                    >
                      <Text className="text-base text-gray-900">{option.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
              {errors.gender && (
                <Text className="text-red-500 text-xs mt-1">{errors.gender}</Text>
              )}
            </View>

            {renderInput('mobileNumber', 'Mobile Number', true, 'phone-pad')}
            {renderInput('emergencyContact', 'Emergency Contact Number')}
          </View>

          {/* Next Button */}
          <View className="px-6 pb-8">
            <TouchableOpacity
              className="bg-yellow-500 rounded-lg py-4 items-center shadow-md"
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