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
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import * as FileSystem from 'expo-file-system'
import { ImagePickerAsset } from 'expo-image-picker';


// Combined FormData Interface for all steps
interface FormData {
  // Driver Registration (Section 1)
  firstName: string;
  lastName: string;
  nicNumber: string;
  driverDateOfBirth: string;
  age: string;
  location: string;
  gender: string;
  driverMobileNumber: string;
  emergencyContact: string;
  driverPhoto: ImagePickerAsset | null;

  // Vehicle Details (Section 2)
  vehicleOwner: string;
  vehicleType: string;
  vehicleModel: string;
  ac: string;
  fuelType: string;
  vehicleYearOfManufacture: string;
  vehicleSeatingCapacity: string;
  numberPlate: string;
  vehicleImage: ImagePickerAsset | null;
  vehicleLicenseCopy: ImagePickerAsset | null;
  insuranceDocument: ImagePickerAsset | null;
  rating: string;

  // License & Experience (Section 3)
  drivingLicenseNumber: string;
  licenseExpiryDate: string;
  licenseYearsOfExperience: string;
  languagesSpoken: string;
  additionalComments: string;
  licensePhoto: ImagePickerAsset | null;
}

// Combined FormErrors Interface for all fields
interface FormErrors {
  firstName?: string;
  lastName?: string;
  nicNumber?: string;
  driverDateOfBirth?: string;
  age?: string;
  location?: string;
  gender?: string;
  driverMobileNumber?: string;
  emergencyContact?: string;
  driverPhoto?: string;

  vehicleOwner?: string;
  vehicleType?: string;
  vehicleModel?: string;
  ac?: string;
  fuelType?: string;
  vehicleYearOfManufacture?: string;
  vehicleSeatingCapacity?: string;
  numberPlate?: string;
  vehicleImage?: string;
  vehicleLicenseCopy?: string;
  insuranceDocument?: string;
  rating?: string;

  drivingLicenseNumber?: string;
  licenseExpiryDate?: string;
  licenseYearsOfExperience?: string;
  languagesSpoken?: string;
  additionalComments?: string;
  licensePhoto?: string;
}

// Options for gender dropdown (Section 1)
const genderOptions = [
  { label: 'Select Gender', value: '' },
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Other', value: 'other' },
];



// Options for vehicle type dropdown (Section 2)
const vehicleTypes = [
  { label: 'Select Vehicle Type', value: '' },
  { label: 'Car', value: 'car' },
  { label: 'SUV', value: 'suv' },
  { label: 'Van', value: 'van' },
  { label: 'Truck', value: 'truck' },
  { label: 'Motorcycle', value: 'motorcycle' },
  { label: 'Bus', value: 'bus' },
];

// Options for seating capacity dropdown (Section 2 & 3)
const seatingCapacityOptions = [
  { label: 'Select Seating Capacity', value: '' },
  { label: '2 Seats', value: '2' },
  { label: '4 Seats', value: '4' },
  { label: '5 Seats', value: '5' },
  { label: '8 Seats', value: '8' },
  { label: '12 Seats', value: '12' },
  { label: '35+ Seats', value: '35+' },
];
// Options for ac dropdown
const acOptions = [
  { label: 'Select AC Type', value: '' },
  { label: 'AC', value: 'ac' },
  { label: 'Non-AC', value: 'nonac' },
];

// Options for year dropdown (Section 3, used for vehicle year of manufacture)
const yearOptions = [
  { label: 'Select Year', value: '' },
  ...Array.from({ length: 30 }, (_, i) => {
    const year = new Date().getFullYear() - i;
    return { label: year.toString(), value: year.toString() };
  }),
];

export default function MultiStepForm() {
  // State for current step in the form
  const [step, setStep] = useState(1);

  // State to hold all form data
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    nicNumber: '',
    driverDateOfBirth: '',
    gender: '',
    age: '',
    location: '',
    driverMobileNumber: '',
    emergencyContact: '',
    driverPhoto: null,
    vehicleOwner: '',
    vehicleType: '',
    vehicleModel: '',
    ac: '',
    fuelType: '',
    vehicleYearOfManufacture: '',
    vehicleSeatingCapacity: '',
    numberPlate: '',
    vehicleImage: null,
    vehicleLicenseCopy: null,
    insuranceDocument: null,
    rating: '',
    drivingLicenseNumber: '',
    licenseExpiryDate: '',
    licenseYearsOfExperience: '',
    languagesSpoken: '',
    additionalComments: '',
    licensePhoto: null,
  });

  // State to hold form validation errors
  const [errors, setErrors] = useState<FormErrors>({});

  // States to control visibility of dropdown pickers
  const [showGenderPicker, setShowGenderPicker] = useState(false);
  const [showAcPicker, setShowAcPicker] = useState(false);
  const [showVehicleTypePicker, setShowVehicleTypePicker] = useState(false);
  const [showSeatingCapacityPicker, setShowSeatingCapacityPicker] = useState(false);
  const [showYearPicker, setShowYearPicker] = useState(false);

  /**
  //  * Requests camera and media library permissions
  //  */
  // const requestPermissions = async () => {
  //   const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
  //   const { status: mediaLibraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();

  //   if (cameraStatus !== 'granted' || mediaLibraryStatus !== 'granted') {
  //     Alert.alert(
  //       'Permissions Required',
  //       'Please grant camera and photo library permissions to upload images.',
  //       [{ text: 'OK' }]
  //     );
  //     return false;
  //   }
  //   return true;
  // };

  // /**
  //  * Handles image selection from camera or gallery
  //  */
  // const handleImageUpload = async (type: 'vehicleImage' | 'vehicleLicenseCopy' | 'insuranceDocument' | 'licensePhoto' | 'driverPhoto') => {
  //   const hasPermissions = await requestPermissions();
  //   if (!hasPermissions) return;

  //   Alert.alert(
  //     'Select Image',
  //     'Choose an option',
  //     [
  //       {
  //         text: 'Camera',
  //         onPress: () => openCamera(type),
  //       },
  //       {
  //         text: 'Gallery',
  //         onPress: () => openGallery(type),
  //       },
  //       { text: 'Cancel', style: 'cancel' },
  //     ]
  //   );
  // };

  // /**
  //  * Opens device camera to take a photo
  //  */
  // const openCamera = async (type: keyof FormData) => {
  //   try {
  //     const result = await ImagePicker.launchCameraAsync({
  //       mediaTypes: ImagePicker.MediaTypeOptions.Images,
  //       allowsEditing: true,
  //       aspect: [4, 3],
  //       quality: 0.8,
  //     });

  //     if (!result.canceled && result.assets[0]) {
  //       handleInputChange(type, result.assets[0].uri);
  //     }
  //   } catch (error) {
  //     Alert.alert('Error', 'Failed to take photo. Please try again.');
  //   }
  // };

  // /**
  //  * Opens device gallery to select a photo
  //  */
  // const openGallery = async (type: keyof FormData) => {
  //   try {
  //     const result = await ImagePicker.launchImageLibraryAsync({
  //       mediaTypes: ImagePicker.MediaTypeOptions.Images,
  //       allowsEditing: true,
  //       aspect: [4, 3],
  //       quality: 0.8,
  //     });

  //     if (!result.canceled && result.assets[0]) {
  //       handleInputChange(type, result.assets[0].uri);
  //     }
  //   } catch (error) {
  //     Alert.alert('Error', 'Failed to select image. Please try again.');
  //   }
  // };

  /**
   * Validates the form data based on the current step.
   */

  const handleImageUpload = async (field: keyof FormData) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to make this work!');
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
        base64: true,
      });

      if (!result.canceled && result.assets.length > 0) {
        const base64Data = result.assets[0];

        if (base64Data) {
          setFormData(prevState => ({
            ...prevState,
            [field]: base64Data, // ✅ Store only the base64 string
          }));

          if (errors[field]) {
            setErrors(prevErrors => {
              const newErrors = { ...prevErrors };
              delete newErrors[field];
              return newErrors;
            });
          }
        } else {
          Alert.alert('Error', 'Base64 data not found.');
        }
      }
    } catch (error) {
      console.error("Image picker error:", error);
      Alert.alert("Error", "An error occurred while picking the image.");
    }
  };



  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    // Validation for Section 1 (Driver Information)
    if (step === 1) {
      const nameRegex = /^[A-Za-z]+$/;
      const oldNICRegex = /^\d{9}[VXvx]$/;      // e.g., 931234567V or 931234567x
      const newNICRegex = /^\d{12}$/;           // e.g., 200012345678
      const cleanedNumber = formData.driverMobileNumber.replace(/\D/g, ''); // remove non-digits
      const cleaneddNumber = formData.emergencyContact.replace(/\D/g, '');

      // First Name Validation
      if (!formData.firstName.trim()) {
        newErrors.firstName = 'First name is required';
        isValid = false;
      } else if (!nameRegex.test(formData.firstName.trim())) {
        newErrors.firstName = 'First name must contain only letters';
        isValid = false;
      }

      // Last Name Validation
      if (!formData.lastName.trim()) {
        newErrors.lastName = 'Last name is required';
        isValid = false;
      } else if (!nameRegex.test(formData.lastName.trim())) {
        newErrors.lastName = 'Last name must contain only letters';
        isValid = false;
      }
      if (!formData.nicNumber.trim()) {
        newErrors.nicNumber = 'NIC number is required';
        isValid = false;
      } else if (
        !oldNICRegex.test(formData.nicNumber.trim()) &&
        !newNICRegex.test(formData.nicNumber.trim())
      ) {
        newErrors.nicNumber = 'Enter a valid  NIC number';
        isValid = false;
      }
      if (!formData.driverDateOfBirth.trim()) {
        newErrors.driverDateOfBirth = 'Date of birth is required';
        isValid = false;
      } else if (!/^\d{2}\/\d{2}\/\d{4}$/.test(formData.driverDateOfBirth)) {
        newErrors.driverDateOfBirth = 'Please enter date in DD/MM/YYYY format';
        isValid = false;
      } else {
        // Split the date into components
        const [day, month, year] = formData.driverDateOfBirth.split('/').map(Number);
        const currentYear = new Date().getFullYear();
        const currentDate = new Date();

        // Validate year
        if (year < 1900 || year > currentYear) {
          newErrors.driverDateOfBirth = 'Please enter a valid year between 1900 and ' + currentYear;
          isValid = false;
        }
        // Validate month
        else if (month < 1 || month > 12) {
          newErrors.driverDateOfBirth = 'Please enter a valid month (01-12)';
          isValid = false;
        }
        // Validate day
        else if (day < 1 || day > 31) {
          newErrors.driverDateOfBirth = 'Please enter a valid day (01-31)';
          isValid = false;
        }
        // Validate days in specific months
        else if ((month === 4 || month === 6 || month === 9 || month === 11) && day > 30) {
          newErrors.driverDateOfBirth = 'This month only has 30 days';
          isValid = false;
        }
        // Validate February
        else if (month === 2) {
          const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
          const maxDaysInFeb = isLeapYear ? 29 : 28;
          if (day > maxDaysInFeb) {
            newErrors.driverDateOfBirth = `February ${year} only has ${maxDaysInFeb} days`;
            isValid = false;
          }
        }
        // Check if date is not in the future
        else {
          const inputDate = new Date(year, month - 1, day); // month is 0-indexed in Date constructor
          if (inputDate > currentDate) {
            newErrors.driverDateOfBirth = 'Date of birth cannot be in the future';
            isValid = false;
          }
          // Optional: Check if person is at least a certain age (e.g., 16 for driving)
          else {
            const age = currentYear - year;
            const hasHadBirthdayThisYear = new Date(currentYear, month - 1, day) <= currentDate;
            const actualAge = hasHadBirthdayThisYear ? age : age - 1;


            if (actualAge < 16) {
              newErrors.driverDateOfBirth = 'Driver must be at least 16 years old';
              isValid = false;
            }
          }
        }
      }
      if (!formData.gender) {
        newErrors.gender = 'Gender is required';
        isValid = false;
      }
      if (!formData.age) {
        newErrors.age = 'Age is required';
        isValid = false;
      }
      if (!formData.location) {
        newErrors.location = 'Location is required';
        isValid = false;
      }
      if (!formData.driverMobileNumber.trim()) {
        newErrors.driverMobileNumber = 'Mobile number is required';
        isValid = false;
      } else if (
        !(
          // 07xxxxxxxx
          /^07\d{8}$/.test(cleanedNumber) ||
          // 947xxxxxxxx (country code without +)
          /^947\d{8}$/.test(cleanedNumber) ||
          // +947xxxxxxxx (country code with +) - optional if you want to allow +
          formData.driverMobileNumber.startsWith('+') && /^947\d{8}$/.test(cleanedNumber)
        )
      ) {
        newErrors.driverMobileNumber = 'Please enter a valid Sri Lankan mobile number';
        isValid = false;
      }
      if (formData.emergencyContact.trim()) {
        // Only validate if something is entered
        if (
          !(
            /^07\d{8}$/.test(cleaneddNumber) ||
            /^947\d{8}$/.test(cleaneddNumber) ||
            (formData.emergencyContact.startsWith('+') && /^947\d{8}$/.test(cleaneddNumber))
          )
        ) {
          newErrors.emergencyContact = 'Please enter a valid Sri Lankan mobile number';
          isValid = false;
        }
      }
      if (!formData.driverPhoto) {
        newErrors.driverPhoto = 'Driver photo is required';
        isValid = false;
      }
    }
    // Validation for Section 2 (Vehicle Details)
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
      if (!formData.ac.trim()) {
        newErrors.ac = 'AC or nonAc is required';
        isValid = false;
      }
      if (!formData.fuelType.trim()) {
        newErrors.ac = 'Fuel Type is required';
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

    // Validation for Section 3 (License & Experience)
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
      if (!formData.licensePhoto) {
        newErrors.licensePhoto = 'License photo is required';
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

  /**
   * Handles input changes for any form field.
   */
  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  /**
   * Formats a date input to DD/MM/YYYY.
   */
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

  /**
   * Handles the "Next" button press.
   */
  const [isValidating, setIsValidating] = useState(false);

  // Enhanced handleNext with loading state
  const handleNext = async () => {
    setIsValidating(true);

    try {
      // Small delay to show loading state (optional)
      await new Promise(resolve => setTimeout(resolve, 200));

      const isFormValid = validateForm();

      if (!isFormValid) {
        Alert.alert(
          'Validation Error',
          'Please fill in all required fields correctly before proceeding.',
          [{ text: 'OK' }]
        );
        return;
      }

      if (step < 3) {
        setStep(prevStep => prevStep + 1);
        setErrors({});
      } else {
        await submitForm();
      }
    } finally {
      setIsValidating(false);
    }
  };

  /**
   * Handles the "Previous" button press.
   */
  const handlePrevious = () => {
    if (step > 1) {
      setStep(prevStep => prevStep - 1);
      setErrors({});
    }
  };

  /**
   * Simulates the final form submission.
   */
  const submitForm = async () => {
    console.log(formData);

    try {

      const x = {
        ...formData,
        vehicleImage: formData.vehicleImage?.base64,
        driverPhoto: formData.driverPhoto?.base64,
        vehicleLicenseCopy: formData.vehicleLicenseCopy?.base64,
        insuranceDocument: formData.insuranceDocument?.base64,
        licensePhoto: formData.licensePhoto?.base64,
      }


      const response = await fetch(`http://localhost:8080/vehicle/addVehicle`, {
        method: "POST",
        headers: { 'Content-Type': "application/json" },
        body: JSON.stringify(x),
      });

      const data = await response.text();
      console.log(data);
      router.push('/(vehicle)/myVehicles')
      Alert.alert(
        'Registration Complete!',
        'Your driver registration has been submitted successfully.',
        [{ text: 'OK' }]
      );
    } catch (err) {
      console.log('Error from submit form:', err);
      Alert.alert('Error', 'Failed to submit registration. Please try again.');
    }
  };

  /**
   * Renders a generic text input field.
   */
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
        className={`border border-gray-300 rounded-lg px-4 py-3 text-base text-gray-900 bg-white ${multiline ? 'h-24 text-top' : ''
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

  /**
   * Renders a dropdown component.
   */
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
        className={`border border-gray-300 rounded-lg px-4 py-3 bg-white justify-center ${errors[field as keyof FormErrors] ? 'border-red-500' : ''
          }`}
        onPress={() => setShowPicker(!showPicker)}
      >
        <Text
          className={`text-base ${!formData[field] ? 'text-gray-400' : 'text-gray-900'
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

  /**
   * Renders an image upload area.
   */
  const renderImageUpload = (
    type: 'vehicleImage' | 'vehicleLicenseCopy' | 'insuranceDocument' | 'licensePhoto' | 'driverPhoto',
    title: string,
    subtitle: string
  ) => (
    <View className="mb-6">
      <Text className="text-sm font-medium text-gray-700 mb-2">
        {title} <Text className="text-red-500">*</Text>
      </Text>
      <TouchableOpacity
        className={`border-2 border-gray-200 border-dashed rounded-lg py-8 px-4 items-center justify-center bg-gray-50 min-h-[120px] ${errors[type] ? 'border-red-500' : ''
          }`}
        onPress={() => handleImageUpload(type)}
      >
        {formData[type] ? (
          <Image
            source={{ uri: formData[type].uri }}
            className="w-full h-[100px] rounded-sm"
            style={{ resizeMode: 'cover' }}
          />
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

  /**
   * Renders the content for the current step.
   */
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
                <View className="w-full px-6 pt-5 pb-2 justify-center items-center relative">
                  <TouchableOpacity
                    className="absolute left-6 top-5 z-10"
                    onPress={() => {
                      console.log('Back button pressed');
                      if (router.canGoBack()) {
                        router.back();
                      } else {
                        router.push('/(tabs)');
                      }
                    }}
                  >
                    <Ionicons name="arrow-back" size={24} color="#000" />
                  </TouchableOpacity>

                  <Text className="text-sm font-medium text-gray-500 text-center">
                    Section 1 of 3
                  </Text>
                </View>

                <View className="items-center py-8">
                  <Text className="text-lg font-semibold text-gray-900">Driver Details</Text>
                </View>

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

                  {renderInput('age', 'Age', true)}
                  {renderInput('location', 'Location', true)}

                  <View className="mb-5">
                    <Text className="text-sm font-medium text-gray-700 mb-2">
                      Gender <Text className="text-red-500">*</Text>
                    </Text>
                    <TouchableOpacity
                      className={`border border-gray-300 rounded-lg px-4 py-3 bg-white justify-center ${errors.gender ? 'border-red-500' : ''
                        }`}
                      onPress={() => setShowGenderPicker(!showGenderPicker)}
                    >
                      <Text
                        className={`text-base ${!formData.gender ? 'text-gray-400' : 'text-gray-900'
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

                  {renderImageUpload('driverPhoto', "Driver's Photo", 'Tap to upload driver photo')}
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
                <View className="px-6 pt-5 pb-2 items-center">
                  <Text className="text-sm font-medium text-gray-500 text-center">
                    Section 2 of 3
                  </Text>
                </View>

                <View className="items-center py-8">
                  <Text className="text-lg font-semibold text-gray-900">Vehicle Details</Text>
                </View>

                <View className="px-6 pb-5">
                  {renderInput('vehicleOwner', 'Vehicle Owner', true)}

                  {renderDropdown(
                    'vehicleType',
                    'Vehicle Type',
                    vehicleTypes,
                    showVehicleTypePicker,
                    setShowVehicleTypePicker
                  )}

                  {renderInput('vehicleModel', 'Vehicle Model', true)}

                  {renderDropdown(
                    'ac',
                    'AC Type',
                    acOptions,
                    showAcPicker,            // ✅ correct variable defined at the top
                    setShowAcPicker          // ✅ correct setter
                  )}

                  {renderInput('fuelType', 'Fuel Type', true)}

                  {renderInput('vehicleYearOfManufacture', 'Year of Manufacture', true, 'numeric')}

                  {renderDropdown(
                    'vehicleSeatingCapacity',
                    'Seating Capacity',
                    seatingCapacityOptions,
                    showSeatingCapacityPicker,
                    setShowSeatingCapacityPicker
                  )}

                  {renderInput('numberPlate', 'Number Plate', true)}

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
                    Section 3 of 3
                  </Text>
                </View>

                <View className="items-center py-8">
                  <Text className="text-lg font-semibold text-gray-900">License & Experience</Text>
                </View>

                <View className="px-6 pb-5">
                  {renderInput('drivingLicenseNumber', 'Driving License Number', true)}
                  {renderInput('licenseExpiryDate', 'License Expiry Date (DD/MM/YYYY)', true)}



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
          className={`rounded-lg py-4 items-center shadow-md ${step === 1 ? 'w-full' : 'flex-1'} ${isValidating ? 'opacity-70' : ''
            }`}
          style={{
            backgroundColor: step < 3 ? '#FEFA17' : '#22C55E',
          }}
          onPress={handleNext}
          activeOpacity={0.8}
          disabled={isValidating}
        >
          {isValidating ? (
            <Text className="text-base font-semibold text-gray-900">
              Validating...
            </Text>
          ) : (
            <Text className="text-base font-semibold text-gray-900">
              {step < 3 ? 'Next' : 'Submit'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}