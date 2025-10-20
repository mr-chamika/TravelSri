import React, { useState,useEffect } from 'react';
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
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import * as FileSystem from 'expo-file-system'
import { ImagePickerAsset } from 'expo-image-picker';


// Combined FormData Interface for all steps - aligned with ADD form
interface FormData {
  // Vehicle.java fields
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
  experience: number;
  languages: string[];
  image: ImagePickerAsset | null;
  insuranceDocument: ImagePickerAsset | null;
  insuranceDocument2: ImagePickerAsset | null;
  licensePhoto: ImagePickerAsset | null;
  licensePhoto2: ImagePickerAsset | null;
  vehicleNumber: string;
  vehicleModel: string;
  ac: boolean;
  fuelType: string;
  seats: number;
  catId: string;
  vehicleYearOfManufacture: string;
  gearType: boolean;
  perKm: boolean;
  perKmPrice: number;
  dailyRate: boolean;
  dailyRatePrice: number;
  driverNicpic1: ImagePickerAsset | null;
  driverNicpic2: ImagePickerAsset | null;
  vehicleLicenseCopy: ImagePickerAsset | null;
  images: ImagePickerAsset[];
  doors: number;
  mileage: string;
  whatsIncluded: string[];
  pricingOption1: string;
  pricingOption2: string;
  pricingOption3: string;
}

// Combined FormErrors Interface for all fields - aligned with ADD form
interface FormErrors {
  // Personal information
  firstName?: string;
  lastName?: string;
  nicNumber?: string;
  driverDateOfBirth?: string;
  location?: string;
  gender?: string;
  phone?: string;
  additionalComments?: string;
  drivingLicenseNumber?: string;
  licenseExpiryDate?: string;
  experience?: string; 
  languages?: string; 
  image?: string;
  insuranceDocument?: string;
  insuranceDocument2?: string;
  licensePhoto?: string;
  licensePhoto2?: string;
  driverNicpic1?: string;
  driverNicpic2?: string;
  vehicleLicenseCopy?: string;
  images?: string;
  vehicleNumber?: string;
  vehicleModel?: string;
  ac?: string;
  fuelType?: string;
  seats?: string; 
  catId?: string;
  vehicleYearOfManufacture?: string;
  gearType?: string;
  perKm?: string;
  perKmPrice?: string;
  dailyRate?: string;
  dailyRatePrice?: string;
  doors?: string;
  mileage?: string;
  whatsIncluded?: string;
  pricingOption1?: string;
  pricingOption2?: string;
  pricingOption3?: string;
}

// Options for gender dropdown (Section 1)
const genderOptions = [
  { label: 'Select Gender', value: '' },
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
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
  { label: 'Select Seating Capacity', value: 0 },
  { label: '2 Seats', value: 2 },
  { label: '4 Seats', value: 4 },
  { label: '5 Seats', value: 5 },
  { label: '8 Seats', value: 8 },
  { label: '12 Seats', value: 12 },
  { label: '35+ Seats', value: 35 },
];

// Options for doors dropdown
const doorsOptions = [
  { label: 'Select Number of Doors', value: 0 },
  { label: '2 Doors', value: 2 },
  { label: '3 Doors', value: 3 },
  { label: '4 Doors', value: 4 },
  { label: '5 Doors', value: 5 },
];

// Options for fuel type dropdown
const fuelTypeOptions = [
  { label: 'Select Fuel Type', value: '' },
  { label: 'Petrol', value: 'petrol' },
  { label: 'Diesel', value: 'diesel' },
  { label: 'Hybrid', value: 'hybrid' },
  { label: 'Electric', value: 'electric' },
];

// Options for gear type
const gearTypeOptions = [
  { label: 'Select Gear Type', value: '' },
  { label: 'Manual', value: false },
  { label: 'Automatic', value: true },
];

// Options for categories
const categoryOptions = [
  { label: 'Select Vehicle Category', value: '' },
  { label: 'Tuk (Three Wheeler)', value: 'tuk' },
  { label: 'Car', value: 'car' },
  { label: 'Van', value: 'van' },
  { label: 'Minivan', value: 'minivan' },
  { label: 'Bus', value: 'bus' },
  { label: 'Bike (Motorcycle)', value: 'bike' },
];

// Options for AC
const acOptions = [
  { label: 'Select AC Availability', value: '' },
  { label: 'No AC', value: 'false' },
  { label: 'AC Available', value: 'true' },
];

// Year options
const yearOptions = [
  { label: 'Select Year', value: '' },
  ...Array.from({ length: 30 }, (_, i) => {
    const year = new Date().getFullYear() - i;
    return { label: year.toString(), value: year.toString() };
  }),
];

// What's included options
const whatsIncludedOptions = [
  'Air Conditioning',
  'GPS Navigation',
  'Bluetooth',
  'USB Charging',
  'WiFi Hotspot',
  'Child Safety Seats',
  'First Aid Kit',
  'Spare Tire',
  'Tool Kit',
  'Fire Extinguisher'
];

export default function MultiStepForm() {

  const {id} = useLocalSearchParams()
console.log(id)
  // State for current step in the form
  const [step, setStep] = useState(1);

  // State to hold all form data - aligned with ADD form
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    nicNumber: '',
    driverDateOfBirth: '',
    location: '',
    gender: '',
    phone: '',
    additionalComments: '',
    drivingLicenseNumber: '',
    licenseExpiryDate: '',
    experience: 0,
    languages: [],
    image: null,
    insuranceDocument: null,
    insuranceDocument2: null,
    licensePhoto: null,
    licensePhoto2: null,
    vehicleNumber: '',
    vehicleModel: '',
    ac: false,
    fuelType: '',
    seats: 0,
    catId: '',
    vehicleYearOfManufacture: '',
    gearType: false,
    perKm: false,
    perKmPrice: 0,
    dailyRate: false,
    dailyRatePrice: 0,
    driverNicpic1: null,
    driverNicpic2: null,
    vehicleLicenseCopy: null,
    images: [],
    doors: 0,
    mileage: '',
    whatsIncluded: [],
    pricingOption1: '',
    pricingOption2: '',
    pricingOption3: '',
  });

  // State to hold form validation errors
  const [errors, setErrors] = useState<FormErrors>({});

  // States to control visibility of dropdown pickers
  const [showGenderPicker, setShowGenderPicker] = useState(false);
  const [showFuelTypePicker, setShowFuelTypePicker] = useState(false);
  const [showSeatingCapacityPicker, setShowSeatingCapacityPicker] = useState(false);
  const [showDoorsPicker, setShowDoorsPicker] = useState(false);
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [showGearTypePicker, setShowGearTypePicker] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [showAcPicker, setShowAcPicker] = useState(false);

  // Language input state - moved to top level to avoid conditional hook usage
  const [languageInput, setLanguageInput] = useState('');

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

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const response = await fetch(`http://localhost:8080/vehicle/edit?id=${id}`); // Replace {vehicle_id} with actual ID
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        // console.log(data)

        /* const imageOrNull = (base64: string | null) =>
          base64 ? { uri: `data:image/jpeg;base64,${base64}` } : null; */

        setFormData({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          nicNumber: data.nicNumber || '',
          driverDateOfBirth: data.driverDateOfBirth || '',
          location: data.location || '',
          gender: data.gender || '',
          phone: data.phone || data.driverMobileNumber || '',
          additionalComments: data.additionalComments || '',
          drivingLicenseNumber: data.drivingLicenseNumber || '',
          licenseExpiryDate: data.licenseExpiryDate || '',
          experience: data.experience || data.licenseYearsOfExperience || 0,
          languages: data.languages || (data.languagesSpoken ? data.languagesSpoken.split(',') : []),
          image: data.image || data.driverPhoto || null,
          insuranceDocument: data.insuranceDocument || null,
          insuranceDocument2: data.insuranceDocument2 || null,
          licensePhoto: data.licensePhoto || null,
          licensePhoto2: data.licensePhoto2 || null,
          vehicleNumber: data.vehicleNumber || data.numberPlate || '',
          vehicleModel: data.vehicleModel || '',
          ac: data.ac === true || data.ac === 'ac' || false,
          fuelType: data.fuelType || '',
          seats: data.seats || data.vehicleSeatingCapacity || 0,
          catId: data.catId || data.vehicleType || '',
          vehicleYearOfManufacture: data.vehicleYearOfManufacture || '',
          gearType: data.gearType || false,
          perKm: data.perKm || false,
          perKmPrice: data.perKmPrice || 0,
          dailyRate: data.dailyRate || false,
          dailyRatePrice: data.dailyRatePrice || 0,
          driverNicpic1: data.driverNicpic1 || null,
          driverNicpic2: data.driverNicpic2 || null,
          vehicleLicenseCopy: data.vehicleLicenseCopy || null,
          images: data.images || (data.vehicleImage ? [data.vehicleImage] : []),
          doors: data.doors || 0,
          mileage: data.mileage || '',
          whatsIncluded: data.whatsIncluded || [],
          pricingOption1: data.pricingOption1 || '',
          pricingOption2: data.pricingOption2 || '',
          pricingOption3: data.pricingOption3 || '',
        });
      } catch (error) {
        console.error('Failed to load vehicle data:', error);
      }
    };

    fetchVehicle();
  }, []);



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

      // NIC Number Validation
      if (!formData.nicNumber.trim()) {
        newErrors.nicNumber = 'NIC number is required';
        isValid = false;
      } else if (
        !oldNICRegex.test(formData.nicNumber.trim()) &&
        !newNICRegex.test(formData.nicNumber.trim())
      ) {
        newErrors.nicNumber = 'Enter a valid NIC number';
        isValid = false;
      }

      // Date of Birth Validation
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
      if (!formData.location) {
        newErrors.location = 'Location is required';
        isValid = false;
      }
      if (!formData.phone.trim()) {
        newErrors.phone = 'Mobile number is required';
        isValid = false;
      } else if (
        !(
          // 07xxxxxxxx
          /^07\d{8}$/.test(formData.phone.replace(/\D/g, '')) ||
          // 947xxxxxxxx (country code without +)
          /^947\d{8}$/.test(formData.phone.replace(/\D/g, '')) ||
          // +947xxxxxxxx (country code with +) - optional if you want to allow +
          formData.phone.startsWith('+') && /^947\d{8}$/.test(formData.phone.replace(/\D/g, ''))
        )
      ) {
        newErrors.phone = 'Please enter a valid Sri Lankan mobile number';
        isValid = false;
      }
      if (!formData.image) {
        newErrors.image = 'Driver photo is required';
        isValid = false;
      }
      if (!formData.driverNicpic1) {
        newErrors.driverNicpic1 = 'Driver NIC front photo is required';
        isValid = false;
      }
      if (!formData.driverNicpic2) {
        newErrors.driverNicpic2 = 'Driver NIC back photo is required';
        isValid = false;
      }
    }

    // Validation for Section 2 (Vehicle Details)
    if (step === 2) {
      if (!formData.vehicleNumber.trim()) {
        newErrors.vehicleNumber = 'Vehicle number is required';
        isValid = false;
      }
      if (!formData.vehicleModel.trim()) {
        newErrors.vehicleModel = 'Vehicle model is required';
        isValid = false;
      }
      if (!formData.fuelType.trim()) {
        newErrors.fuelType = 'Fuel Type is required';
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
      if (!formData.seats || formData.seats === 0) {
        newErrors.seats = 'Seating capacity is required';
        isValid = false;
      }
      if (!formData.doors || formData.doors === 0) {
        newErrors.doors = 'Number of doors is required';
        isValid = false;
      }
      if (!formData.catId.trim()) {
        newErrors.catId = 'Vehicle category is required';
        isValid = false;
      }
      if (!formData.mileage.trim()) {
        newErrors.mileage = 'Vehicle mileage is required';
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
      if (formData.images.length === 0) {
        newErrors.images = 'At least one vehicle image is required';
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
      if (!formData.experience || formData.experience === 0) {
        newErrors.experience = 'Years of experience is required';
        isValid = false;
      } else if (formData.experience < 0 || formData.experience > 50) {
        newErrors.experience = 'Please enter a valid number of years (0-50)';
        isValid = false;
      }
      if (formData.languages.length === 0) {
        newErrors.languages = 'At least one language is required';
        isValid = false;
      }
      // Pricing validation
      if (!formData.perKm && !formData.dailyRate) {
        newErrors.perKm = 'At least one pricing option must be selected';
        isValid = false;
      }
      if (formData.perKm && (!formData.perKmPrice || formData.perKmPrice <= 0)) {
        newErrors.perKmPrice = 'Per km price is required and must be greater than 0';
        isValid = false;
      }
      if (formData.dailyRate && (!formData.dailyRatePrice || formData.dailyRatePrice <= 0)) {
        newErrors.dailyRatePrice = 'Daily rate price is required and must be greater than 0';
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
    setFormData(prev => ({
      ...prev,
      [field]: field === 'seats' || field === 'doors' || field === 'experience' || field === 'perKmPrice' || field === 'dailyRatePrice'
        ? Number(value) || 0
        : field === 'ac' || field === 'gearType' || field === 'perKm' || field === 'dailyRate'
        ? value === 'true'
        : field === 'languages'
        ? prev.languages // Don't change languages through this function
        : field === 'whatsIncluded'
        ? value.split(',').map(item => item.trim()).filter(item => item)
        : value
    }));
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
   * Toggles language selection
   */
  const toggleLanguage = (language: string) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.includes(language)
        ? prev.languages.filter(lang => lang !== language)
        : [...prev.languages, language]
    }));
  };



  /**
   * Simulates the final form submission.
   */
  const submitForm = async () => {
    console.log(formData);

    try {

// Build payload matching backend Vehicle.java with correct field mapping
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        nicNumber: formData.nicNumber,
        driverDateOfBirth: formData.driverDateOfBirth,
        location: formData.location,
        gender: formData.gender,
        phone: formData.phone,
        additionalComments: formData.additionalComments,
        drivingLicenseNumber: formData.drivingLicenseNumber,
        licenseExpiryDate: formData.licenseExpiryDate,
        experience: formData.experience,
        languages: formData.languages,
        
        // Send image (driver photo) as base64 string
        image: formData.image?.base64 || '',
        insuranceDocument: formData.insuranceDocument?.base64 || '',
        insuranceDocument2: formData.insuranceDocument2?.base64 || '',
        licensePhoto: formData.licensePhoto?.base64 || '',
        licensePhoto2: formData.licensePhoto2?.base64 || '',
        
        vehicleNumber: formData.vehicleNumber,
        vehicleModel: formData.vehicleModel,
        ac: formData.ac,
        fuelType: formData.fuelType,
        seats: formData.seats,
        catId: formData.catId,
        vehicleYearOfManufacture: formData.vehicleYearOfManufacture,
        gearType: formData.gearType,
        perKm: formData.perKm,
        perKmPrice: formData.perKmPrice,
        dailyRate: formData.dailyRate,
        dailyRatePrice: formData.dailyRatePrice,
        driverNicpic1: formData.driverNicpic1?.base64 || '',
        driverNicpic2: formData.driverNicpic2?.base64 || '',
        vehicleLicenseCopy: formData.vehicleLicenseCopy?.base64 || '',
        doors: formData.doors,
        mileage: formData.mileage,
        whatsIncluded: formData.whatsIncluded,
        
        // Send images array as array of base64 strings
        images: formData.images.map(img => img?.base64 || '').filter(str => str !== ''),
      }
      

      const response = await fetch(`http://localhost:8080/vehicle/addVehicle`, {
        method: "POST",
        headers: { 
          'Content-Type': "application/json",
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload),
      });
      
      const data = await response.text();
      console.log(data);
      
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
    options: { label: string; value: string | number }[],
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
                  handleInputChange(field, String(option.value));
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
    type: 'image' | 'insuranceDocument' | 'insuranceDocument2' | 'licensePhoto' | 'licensePhoto2' | 'vehicleLicenseCopy' | 'driverNicpic1' | 'driverNicpic2' | 'images',
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
            source={{ 
              uri: Array.isArray(formData[type]) 
                ? (formData[type] as ImagePickerAsset[])[0]?.uri 
                : (formData[type] as ImagePickerAsset)?.uri || `data:image/jpeg;base64,${formData[type]}` 
            }} 
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

                  {renderInput('phone', 'Mobile Number', true, 'phone-pad')}
                  
                  {renderImageUpload('driverNicpic1', "Driver's NIC Front", 'Tap to upload NIC front photo')}
                  {renderImageUpload('driverNicpic2', "Driver's NIC Back", 'Tap to upload NIC back photo')}
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
                  {renderDropdown(
                    'catId',
                    'Vehicle Category',
                    categoryOptions,
                    showCategoryPicker,
                    setShowCategoryPicker
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
                    'seats',
                    'Seating Capacity',
                    seatingCapacityOptions,
                    showSeatingCapacityPicker,
                    setShowSeatingCapacityPicker
                  )}

                  {renderInput('vehicleNumber', 'Number Plate', true)}

                  {renderImageUpload('image', 'Vehicle Image', 'Tap to upload vehicle photo')}
                  {renderImageUpload('vehicleLicenseCopy', 'Vehicle License Copy', 'Tap to upload license document')}
                  {renderImageUpload('insuranceDocument', 'Insurance Document', 'Tap to upload insurance document')}
                  {renderImageUpload('insuranceDocument2', 'Insurance Document 2', 'Tap to upload second insurance document')}
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
                  {renderInput('experience', 'Years of Experience', true, 'numeric')}
                  
                  {renderImageUpload('licensePhoto', 'License Photo Front', 'Upload the driving license front photo')}
                  {renderImageUpload('licensePhoto2', 'License Photo Back', 'Upload the driving license back photo')}

                  <Text className="text-gray-700 text-lg font-medium mb-3 mt-6">Language Preferences</Text>
                  <View className="bg-white rounded-lg p-4 shadow-sm mb-4">
                    <Text className="text-gray-600 text-sm mb-2">Languages you can communicate in</Text>
                    <View className="flex-row flex-wrap">
                      {['English', 'Sinhala', 'Tamil', 'German', 'French', 'Chinese', 'Japanese'].map((lang) => (
                        <TouchableOpacity
                          key={lang}
                          onPress={() => toggleLanguage(lang)}
                          className={`mr-2 mb-2 px-3 py-2 rounded-full border ${
                            formData.languages.includes(lang) 
                              ? 'bg-yellow-500 border-yellow-500' 
                              : 'bg-gray-100 border-gray-300'
                          }`}
                        >
                          <Text className={`text-sm ${formData.languages.includes(lang) ? 'text-white' : 'text-gray-700'}`}>
                            {lang}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                  
                  <Text className="text-gray-700 text-lg font-medium mb-3">Pricing Options</Text>
                  <View className="space-y-4 mb-4">
                    {renderInput('pricingOption1', 'Pricing Option 1 (e.g., Per Day)', false)}
                    {renderInput('pricingOption2', 'Pricing Option 2 (e.g., Per Hour)', false)}
                    {renderInput('pricingOption3', 'Pricing Option 3 (e.g., Per KM)', false)}
                  </View>
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
  className={`rounded-lg py-4 items-center shadow-md ${step === 1 ? 'w-full' : 'flex-1'} ${
    isValidating ? 'opacity-70' : ''
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