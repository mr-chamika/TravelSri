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
import { User, Car, Upload, Award } from 'lucide-react-native';
import { router } from 'expo-router';


interface FormData {
 
  firstName: string;
  lastName: string;
  nicNumber: string;
  driverDateOfBirth: string;
  gender: string;
  driverMobileNumber: string;
  emergencyContact: string;

 
  vehicleOwner: string;
  vehicleType: string;
  vehicleModel: string;
  vehicleYearOfManufacture: string;
  vehicleSeatingCapacity: string;   
  memberPlate: string;
  numberPlate: string;
  vehicleImage: string | null;
  vehicleLicenseCopy: string | null;
  insuranceDocument: string | null;

 
  drivingLicenseNumber: string;
  licenseExpiryDate: string;
  licenseYearsOfExperience: string;
  languagesSpoken: string;
  additionalComments: string;
  licensePhoto:string|null
}


interface FormErrors {
  firstName?: string;
  lastName?: string;
  nicNumber?: string;
  driverDateOfBirth?: string;
  gender?: string;
  driverMobileNumber?: string;
  emergencyContact?: string;

  vehicleOwner?: string;
  vehicleType?: string;
  vehicleModel?: string;
  vehicleYearOfManufacture?: string;
  vehicleSeatingCapacity?: string;
  memberPlate?: string;
  numberPlate?: string;
  vehicleImage?: string;
  vehicleLicenseCopy?: string;
  insuranceDocument?: string;

  drivingLicenseNumber?: string;
  licenseExpiryDate?: string;
  licenseYearsOfExperience?: string;
  languagesSpoken?: string;
  additionalComments?: string;
  licensePhoto?:string
  
}


const genderOptions = [
  { label: 'Select Gender', value: '' },
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Other', value: 'other' },
];


const vehicleTypes = [
  { label: 'Select Vehicle Type', value: '' },
  { label: 'Car', value: 'car' },
  { label: 'SUV', value: 'suv' },
  { label: 'Van', value: 'van' },
  { label: 'Truck', value: 'truck' },
  { label: 'Motorcycle', value: 'motorcycle' },
  { label: 'Bus', value: 'bus' },
];


const seatingCapacityOptions = [
  { label: 'Select Seating Capacity', value: '' },
  { label: '2 Seats', value: '2' },
  { label: '4 Seats', value: '4' },
  { label: '5 Seats', value: '5' },
  { label: '7 Seats', value: '7' },
  { label: '8+ Seats', value: '8+' },
];


const yearOptions = [
  { label: 'Select Year', value: '' },
  ...Array.from({ length: 30 }, (_, i) => {
    const year = new Date().getFullYear() - i;
    return { label: year.toString(), value: year.toString() };
  }),
];

export default function MultiStepForm() {
 
  const [step, setStep] = useState(1);

 
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    nicNumber: '',
    driverDateOfBirth: '',
    gender: '',
    driverMobileNumber: '',
    emergencyContact: '',
    vehicleOwner: '',
    vehicleType: '',
    vehicleModel: '',
    vehicleYearOfManufacture: '',
    vehicleSeatingCapacity: '',
    memberPlate: '',
    numberPlate: '',
    vehicleImage: null,
    vehicleLicenseCopy: null,
    insuranceDocument: null,
    drivingLicenseNumber: '',
    licenseExpiryDate: '',
    licenseYearsOfExperience: '',
    languagesSpoken: '',
    additionalComments: '',
    licensePhoto:''
  });

 
  const [errors, setErrors] = useState<FormErrors>({});

 
  const [showGenderPicker, setShowGenderPicker] = useState(false);
  const [showVehicleTypePicker, setShowVehicleTypePicker] = useState(false);
  const [showSeatingCapacityPicker, setShowSeatingCapacityPicker] = useState(false);
  const [showYearPicker, setShowYearPicker] = useState(false);

 
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

   
    if (step === 1) {
      if (!formData.firstName.trim()) {
        newErrors.firstName = 'First name is required';
        isValid = false;
      }
      if (!formData.lastName.trim()) {
        newErrors.lastName = 'Last name is required';
        isValid = false;
      }
      if (!formData.nicNumber.trim()) {
        newErrors.nicNumber = 'NIC number is required';
        isValid = false;
      } else if (formData.nicNumber.length < 10) {
        newErrors.nicNumber = 'NIC number must be at least 10 characters';
        isValid = false;
      }
      if (!formData.driverDateOfBirth.trim()) {
        newErrors.driverDateOfBirth = 'Date of birth is required';
        isValid = false;
      } else if (!/^\d{2}\/\d{2}\/\d{4}$/.test(formData.driverDateOfBirth)) {
        newErrors.driverDateOfBirth = 'Please enter date in DD/MM/YYYY format';
        isValid = false;
      }
      if (!formData.gender) {
        newErrors.gender = 'Gender is required';
        isValid = false;
      }
      if (!formData.driverMobileNumber.trim()) {
        newErrors.driverMobileNumber = 'Mobile number is required';
        isValid = false;
      } else if (!/^\d{10}$/.test(formData.driverMobileNumber.replace(/\D/g, ''))) {
        newErrors.driverMobileNumber = 'Please enter a valid 10-digit mobile number';
        isValid = false;
      }
    }

   
    if (step === 2) {
      if (!formData.vehicleOwner.trim()) {
        newErrors.vehicleOwner = 'Vehicle owner is required';
        isValid = false;
      }
      if (!formData.vehicleType) {
        newErrors.vehicleType = 'Vehicle type is required';
        isValid = false;
      }
      if (!formData.vehicleModel.trim()) {
        newErrors.vehicleModel = 'Vehicle model is required';
        isValid = false;
      }
      if (!formData.vehicleYearOfManufacture.trim()) {
        newErrors.vehicleYearOfManufacture = 'Year of manufacture is required';
        isValid = false;
      } else {
        const year = parseInt(formData.vehicleYearOfManufacture);
        const currentYear = new Date().getFullYear();
        if (isNaN(year) || year < 1900 || year > currentYear) {
          newErrors.vehicleYearOfManufacture = `Please enter a valid year between 1900 and ${currentYear}`;
          isValid = false;
        }
      }
      if (!formData.vehicleSeatingCapacity) {
        newErrors.vehicleSeatingCapacity = 'Seating capacity is required';
        isValid = false;
      }
      if (!formData.memberPlate.trim()) {
        newErrors.memberPlate = 'Member plate is required';
        isValid = false;
      }
      if (!formData.numberPlate.trim()) {
        newErrors.numberPlate = 'Number plate is required';
        isValid = false;
      }
      if (!formData.vehicleImage) {
        newErrors.vehicleImage = 'Vehicle image is required';
        isValid = false;
      }
      if (!formData.vehicleLicenseCopy) {
        newErrors.vehicleLicenseCopy = 'Vehicle license copy is required';
        isValid = false;
      }
      if (!formData.insuranceDocument) {
        newErrors.insuranceDocument = 'Insurance document is required';
        isValid = false;
      }
    }

   
    if (step === 3) {
      if (!formData.drivingLicenseNumber.trim()) {
        newErrors.drivingLicenseNumber = 'Driving license number is required';
        isValid = false;
      }
      if (!formData.licenseExpiryDate.trim()) {
        newErrors.licenseExpiryDate = 'License expiry date is required';
        isValid = false;
      } else if (!/^\d{2}\/\d{2}\/\d{4}$/.test(formData.licenseExpiryDate)) {
        newErrors.licenseExpiryDate = 'Please enter date in DD/MM/YYYY format';
        isValid = false;
      } else {
        const [day, month, year] = formData.licenseExpiryDate.split('/').map(Number);
        const expiryDate = new Date(year, month - 1, day);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        expiryDate.setHours(0, 0, 0, 0);
        if (expiryDate <= today) {
          newErrors.licenseExpiryDate = 'License expiry date must be in the future';
          isValid = false;
        }
      }
     
     
     
      if (!formData.vehicleYearOfManufacture) {
        newErrors.vehicleYearOfManufacture = 'Year of manufacture is required';
        isValid = false;
      }
      if (!formData.vehicleSeatingCapacity) {
        newErrors.vehicleSeatingCapacity = 'Seating capacity is required';
        isValid = false;
      }
      if (!formData.vehicleLicenseCopy) {
        newErrors.vehicleLicenseCopy = 'License photo is required';
        isValid = false;
      }
      if (!formData.licenseYearsOfExperience.trim()) {
        newErrors.licenseYearsOfExperience = 'Years of experience is required';
        isValid = false;
      } else {
        const experience = parseInt(formData.licenseYearsOfExperience);
        if (isNaN(experience) || experience < 0 || experience > 50) {
          newErrors.licenseYearsOfExperience = 'Please enter a valid number of years (0-50)';
          isValid = false;
        }
      }
      if (!formData.languagesSpoken.trim()) {
        newErrors.languagesSpoken = 'Languages spoken is required';
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
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


  const handleImageUpload = (type: 'vehicleImage' | 'vehicleLicenseCopy' | 'insuranceDocument' | 'licensePhoto') => {
    Alert.alert(
      'Upload Image',
      'Choose an option',
      [
        {
          text: 'Camera',
          onPress: () => {
           
            const mockImageUrl = `https://placehold.co/400x200/${type === 'licensePhoto' ? 'FEFA17' : 'FFD700'}/000000?text=${type.replace(/([A-Z])/g, ' $1').trim()}`;
            handleInputChange(type as keyof FormData, mockImageUrl);
          }
        },
        {
          text: 'Gallery',
          onPress: () => {
           
            const mockImageUrl = `https://placehold.co/400x200/${type === 'licensePhoto' ? 'FEFA17' : 'FFD700'}/000000?text=${type.replace(/([A-Z])/g, ' $1').trim()}`;
            handleInputChange(type as keyof FormData, mockImageUrl);
          }
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };


  const handleNext = () => {
   
      if (step < 3) {
        setStep(prevStep => prevStep + 1);
       
        setErrors({});
      } else {
        submitForm();
      }
   
  };


  const handlePrevious = () => {
    if (step > 1) {
      setStep(prevStep => prevStep - 1);
     
      setErrors({});
    }
  };

  const submitForm = () => {
    Alert.alert(
      'Registration Complete!',
      'Your driver registration has been submitted successfully. You will be notified once your application is reviewed.',
      [
        {
          text: 'OK',
          onPress: () => {
            console.log('Complete registration data:', formData);
           
            setFormData({
              firstName: '', lastName: '', nicNumber: '', driverDateOfBirth: '', gender: '',
              driverMobileNumber: '', emergencyContact: '', vehicleOwner: '', vehicleType: '',
              vehicleModel: '', vehicleYearOfManufacture: '', vehicleSeatingCapacity: '',
              memberPlate: '', numberPlate: '', vehicleImage: null, vehicleLicenseCopy: null,
              insuranceDocument: null, drivingLicenseNumber: '', licenseExpiryDate: '',
              licenseYearsOfExperience: '', languagesSpoken: '', additionalComments: '',licensePhoto:''
            });
            setStep(1);
            setErrors({});
          },
        },
      ]
    );
  };

  const renderInput = (
    field: keyof FormData,
    placeholder: string,
    required: boolean = false,
    keyboardType: 'default' | 'numeric' | 'phone-pad' = 'default',
    multiline: boolean = false
  ) => (
    <View className="mb-5">
      <Text className="text-sm font-medium text-gray-700 mb-2">
        {placeholder} {required && <Text className="text-red-500">*</Text>}
      </Text>
      <TextInput
        className={`border border-gray-300 rounded-lg px-4 py-3 text-base text-gray-900 bg-white ${
          multiline ? 'h-24 text-top' : ''
        } ${errors[field as keyof FormErrors] ? 'border-red-500' : ''}`}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        value={formData[field] as string}
        onChangeText={(text) => {
         
          if (field === 'driverDateOfBirth' || field === 'licenseExpiryDate') {
            handleInputChange(field, formatDate(text));
          } else {
            handleInputChange(field, text);
          }
        }}
        keyboardType={keyboardType}
        maxLength={
          field === 'driverDateOfBirth' || field === 'licenseExpiryDate' ? 10 : undefined
        }
        multiline={multiline}
        numberOfLines={multiline ? 4 : 1}
      />
      {errors[field as keyof FormErrors] && (
        <Text className="text-red-500 text-xs mt-1">
          {errors[field as keyof FormErrors]}
        </Text>
      )}
    </View>
  );


  const renderDropdown = (
    field: keyof FormData,
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

  const renderImageUpload = (
    type: 'vehicleImage' | 'vehicleLicenseCopy' | 'insuranceDocument' | 'licensePhoto',
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

  const renderStep = () => {
    switch (step) {
      case 1:
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
                <View className="w-full px-6 pt-5 pb-2 justify-between flex-row ">
                    <TouchableOpacity className='bg-black py-1 px-3 rounded-lg pb-2' onPress={()=>router.back()}><Text className='text-white text-center'>Back</Text></TouchableOpacity>
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
                  {renderInput('driverDateOfBirth', 'Date of Birth (DD/MM/YYYY)', true)}

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

                  {renderInput('driverMobileNumber', 'Mobile Number', true, 'phone-pad')}
                  {renderInput('emergencyContact', 'Emergency Contact Number', false, 'phone-pad')}
                </View>
              </ScrollView>
            </KeyboardAvoidingView>
          </SafeAreaView>
        );
      case 2:
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

               
                <View className="px-6 pb-5">
                 
                  {renderImageUpload('vehicleImage', 'Vehicle Image', 'Tap to upload vehicle photo')}
                  {renderImageUpload('vehicleLicenseCopy', 'Vehicle License Copy', 'Tap to upload license document')}
                  {renderImageUpload('insuranceDocument', 'Insurance Document', 'Tap to upload insurance document')}
                </View>
              </ScrollView>
            </KeyboardAvoidingView>
          </SafeAreaView>
        );
      case 3:
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
                
                <View className="px-6 pt-5 pb-2 items-center">
                  <Text className="text-sm font-medium text-gray-500 text-center">
                    Section 3 of 3 - License & Experience
                  </Text>
                </View>

                
                <View className="items-center py-8">
                  <View className="w-20 h-20 rounded-full bg-yellow-400 justify-center items-center mb-4 shadow-md">
                    <Award size={40} color="#FFFFFF" />
                  </View>
                  <Text className="text-lg font-semibold text-gray-900">License & Experience</Text>
                </View>

                <View className="px-6 pb-5">
                  {renderInput('drivingLicenseNumber', 'Driving License Number', true)}
                  {renderInput('licenseExpiryDate', 'License Expiry Date (DD/MM/YYYY)', true)}

                  <View className="flex-row justify-between mb-0">
                    <View className="w-[48%]">
                      {renderDropdown(
                        'vehicleYearOfManufacture',
                        'Vehicle Year of Manufacture',
                        yearOptions,
                        showYearPicker,
                        setShowYearPicker
                      )}
                    </View>
                    <View className="w-[48%]">
                      {renderDropdown(
                        'vehicleSeatingCapacity',
                        'Vehicle Seating Capacity',
                        seatingCapacityOptions,
                        showSeatingCapacityPicker,
                        setShowSeatingCapacityPicker
                      )}
                    </View>
                  </View>

               
                  {renderImageUpload('licensePhoto', 'License Photo', 'Upload the driving license photo')}

                  {renderInput('licenseYearsOfExperience', 'Years of Experience', true, 'numeric')}
                  {renderInput('languagesSpoken', 'Languages Spoken', true)}
                  {renderInput('additionalComments', 'Additional Comments or Special Notes', false, 'default', true)}
                </View>
              </ScrollView>
            </KeyboardAvoidingView>
          </SafeAreaView>
        );
      default:
        return null;
    }
  };

  return (
    <View className="flex-1 bg-white"> 
      {renderStep()}

      
      <View className="flex-row px-6 pb-8 pt-4 gap-3 justify-between items-center">
        {step > 1 && (
          <TouchableOpacity
            className="w-[50%] bg-gray-100 rounded-lg py-4 items-center shadow-md"
            onPress={handlePrevious}
            activeOpacity={0.8}
          >
            <Text className="text-base font-semibold text-gray-700">Previous</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          className={`rounded-lg py-4 items-center shadow-md ${
            step === 1 ? 'w-full' : 'flex-1'
          } ${step < 3 ? 'bg-yellow-500' : 'bg-green-500'}`}
          onPress={handleNext}
          activeOpacity={0.8}
        >
          <Text className="text-base font-semibold text-gray-900">
            {step < 3 ? 'Next' : 'Submit'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}