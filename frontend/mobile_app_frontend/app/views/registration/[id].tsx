// File: frontend/mobile_app_frontend/expo/app/(tabs)/guide-registration.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Alert,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/buttons';
import { ImageUpload } from '../../../components/ui/imageUpload';
import DropDownPicker from 'react-native-dropdown-picker';
import MultiSelect from 'react-native-multiple-select';
import Topbar from "../../../components/topbar";
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing, } from "react-native-reanimated";


interface FormData {
  firstName: string;
  lastName: string;
  nic: string;
  birthDay: Date;
  gender: string;
  contactNumber: string;
  email: string;
  profileImage: string | null;
  frontNicImage: string | null;
  rearNicImage: string | null;
  guideLicenseNumber: string;
  guideLicenseExpireDate: Date;
  guideLicenseFrontImage: string | null;
  guideLicenseRearImage: string | null;
  language: string;
  district: string;
  area: string;
  rateForeigners: string;
  rateLocals: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  nic?: string;
  birthDay?: string;
  gender?: string;
  contactNumber?: string;
  email?: string;
  profileImage?: string;
  frontNicImage?: string;
  rearNicImage?: string;
  guideLicenseNumber?: string;
  guideLicenseExpireDate?: string;
  guideLicenseFrontImage?: string;
  guideLicenseRearImage?: string;
  language?: string;
  district?: string;
  area?: string;
  rateForeigners?: string;
  rateLocals?: string;
}

const languagesList = [
  { id: 'Sinhala', name: 'Sinhala' },
  { id: 'Tamil', name: 'Tamil' },
  { id: 'English', name: 'English' },
  { id: 'Hindi', name: 'Hindi' },
  { id: 'Chinese', name: 'Chinese' },
];

const districts = ['Colombo', 'Kandy', 'Galle', 'Jaffna'];

const areas: { [key: string]: string[] } = {
  Colombo: ['Dehiwala', 'Moratuwa', 'Nugegoda'],
  Kandy: ['Peradeniya', 'Katugastota'],
  Galle: ['Unawatuna', 'Hikkaduwa'],
  Jaffna: ['Nallur', 'Chavakachcheri'],
};



export default function GuideRegistrationScreen() {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    nic: '',
    birthDay: new Date(),
    gender: '',
    contactNumber: '',
    email: '',
    profileImage: null,
    frontNicImage: null,
    rearNicImage: null,
    guideLicenseNumber: '',
    guideLicenseExpireDate: new Date(),
    guideLicenseFrontImage: null,
    guideLicenseRearImage: null,
    language: '',
    district: '',
    area: '',
    rateForeigners: '',
    rateLocals: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.nic.trim()) {
      newErrors.nic = 'NIC is required';
    } else if (!/^\d{9}[vVxX]$|^\d{12}$/.test(formData.nic)) {
      newErrors.nic = 'Invalid NIC format';
    }

    if (!formData.gender) {
      newErrors.gender = 'Gender is required';
    }

    if (!formData.contactNumber.trim()) {
      newErrors.contactNumber = 'Contact number is required';
    } else if (!/^[0-9]{10}$/.test(formData.contactNumber)) {
      newErrors.contactNumber = 'Invalid contact number format';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.profileImage) {
      newErrors.profileImage = 'Profile image is required';
    }

    if (!formData.frontNicImage) {
      newErrors.frontNicImage = 'Front side of NIC is required';
    }

    if (!formData.rearNicImage) {
      newErrors.rearNicImage = 'Rear side of NIC is required';
    }

    if (!formData.guideLicenseNumber?.trim()) {
      newErrors.guideLicenseNumber = 'Guide License Number is required';
    } else if (!/^[A-Za-z]{2}\d{6}$/.test(formData.guideLicenseNumber)) {
      newErrors.guideLicenseNumber = 'Invalid Guide License Number format (e.g. SL123456)';
    }

    if (!formData.guideLicenseExpireDate) {
      newErrors.guideLicenseExpireDate = 'Guide License Expire Date is required';
    } else if (formData.guideLicenseExpireDate < new Date()) {
      newErrors.guideLicenseExpireDate = 'Expire date cannot be in the past';
    }

    if (!formData.guideLicenseFrontImage) {
      newErrors.guideLicenseFrontImage = 'Front side of Guide License is required';
    }

    if (!formData.guideLicenseRearImage) {
      newErrors.guideLicenseRearImage = 'Rear side of Guide License is required';
    }

    if (selectedLanguages.length === 0) {
      newErrors.language = 'Languages is required';
    }

    if (!selectedDistrict) {
      newErrors.district = 'District is required';
    }

    if (!selectedArea) {
      newErrors.area = 'Area is required';
    }

    if (!formData.rateForeigners) {
      newErrors.rateForeigners = 'Rate for foreign is required';
    }

    if (!formData.rateLocals) {
      newErrors.rateLocals = 'Rate for locals is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
    if (field === 'rateForeigners' || field === 'rateLocals') {
      setFormData({ ...formData, [field]: Number(value) });
    } else {
      setFormData({ ...formData, [field]: value });
    }
  };

  const handleImagePick = async (field: 'profileImage' | 'frontNicImage' | 'rearNicImage' | 'guideLicenseFrontImage' | 'guideLicenseRearImage') => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.granted === false) {
        Alert.alert('Permission required', 'Please allow access to photo library');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: field === 'profileImage' ? [1, 1] : [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        handleInputChange(field, result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      handleInputChange('birthDay', selectedDate);
      handleInputChange('guideLicenseExpireDate', selectedDate);
    }
  };



  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fill all required fields correctly');
      return;
    }

    setIsLoading(true);
    try {
      // Create FormData for multipart upload
      const submitData = new FormData();

      // Add text fields
      submitData.append('firstName', formData.firstName);
      submitData.append('lastName', formData.lastName);
      submitData.append('nic', formData.nic);
      submitData.append('birthDay', formData.birthDay.toISOString());
      submitData.append('gender', formData.gender);
      submitData.append('contactNumber', formData.contactNumber);
      submitData.append('email', formData.email);
      submitData.append('guideLicenseNumber', formData.guideLicenseNumber);

      // Add images
      if (formData.profileImage) {
        submitData.append('profileImage', {
          uri: formData.profileImage,
          type: 'image/jpeg',
          name: 'profile.jpg',
        } as any);
      }

      if (formData.frontNicImage) {
        submitData.append('frontNicImage', {
          uri: formData.frontNicImage,
          type: 'image/jpeg',
          name: 'front_nic.jpg',
        } as any);
      }

      if (formData.rearNicImage) {
        submitData.append('rearNicImage', {
          uri: formData.rearNicImage,
          type: 'image/jpeg',
          name: 'rear_nic.jpg',
        } as any);
      }

      // Submit to Spring Boot backend
      const response = await fetch('http://YOUR_BACKEND_URL:8080/api/guides/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: submitData,
      });

      if (response.ok) {
        Alert.alert('Success', 'Guide registration submitted successfully!');
        // Navigate to next screen or reset form
      } else {
        throw new Error('Registration failed');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to submit registration. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrevious = () => {
    // Navigate back or implement previous step logic
    console.log('Previous pressed');
  };

  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedArea, setSelectedArea] = useState('');

  const [show, setShow] = useState(false);
  const translateX = useSharedValue(-1000);
  const opacity = useSharedValue(0);

  const menuStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    opacity: opacity.value,
  }));

  const toggleMenu = () => {
    setShow(!show);
    if (!show) {
      translateX.value = withTiming(0, {
        duration: 300,
        easing: Easing.inOut(Easing.ease),
      });
      opacity.value = withTiming(1, { duration: 400 });
    } else {
      translateX.value = withTiming(-1000, {
        duration: 300,
        easing: Easing.inOut(Easing.ease),
      });
      opacity.value = withTiming(0, { duration: 300 });
    }
  };

  const logo = require('../../../assets/images/top bar/logo.png')


  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar style="dark" />



      {/* Header */}
      <View className='h-[70px] items-center justify-center px-2'>
        <View className='justify-between flex flex-row w-full px-2 items-center'>
          <View className='flex-1 flex-row items-center justify-center '>
            <Image className='w-[30px] h-[30px] mr-2' source={logo} />
            <Text className='text-lg font-bold text-black'>TravelSri</Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 py-6" contentContainerStyle={{ paddingBottom: 50 }}>
        <Text className="text-xl font-bold text-gray-900 mb-6">Guide Registration</Text>

        {/* Name Fields */}
        <View className="flex-row space-x-3 mb-4">
          <View className="flex-1">
            <Input
              label="First Name *"
              placeholder="Kasila"
              value={formData.firstName}
              onChangeText={(text) => handleInputChange('firstName', text)}
              error={errors.firstName}
              className='mr-2'
            />
          </View>
          <View className="flex-1">
            <Input
              label="Last Name *"
              placeholder="Kumara"
              value={formData.lastName}
              onChangeText={(text) => handleInputChange('lastName', text)}
              error={errors.lastName}
              className='ml-2'
            />
          </View>
        </View>

        {/* NIC */}
        <Input
          label="NIC *"
          placeholder="578956122x or 197616637"
          value={formData.nic}
          onChangeText={(text) => handleInputChange('nic', text)}
          error={errors.nic}
          className="mb-4"
        />

        {/* Birth Day and Gender */}
        <View className="flex-row space-x-3 mb-4">
          <View className="flex-1">
            <Text className="text-gray-700 font-medium mb-2">Birth Day *</Text>
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              className={`border border-gray-300 rounded-lg px-4 py-3 mr-2 ${errors.birthDay ? 'border-red-500' : ''
                }`}
            >
              <Text className="text-gray-900">{formatDate(formData.birthDay)}</Text>
            </TouchableOpacity>
            {errors.birthDay && (
              <Text className="text-red-500 text-sm mt-1">{errors.birthDay}</Text>
            )}
          </View>

          <View className="flex-1">
            <Text className="text-gray-700 font-medium mb-2">Gender *</Text>
            <View className={`border border-gray-300 rounded-lg ml-2 ${errors.gender ? 'border-red-500' : ''
              }`}>
              <Picker
                selectedValue={formData.gender}
                onValueChange={(value) => handleInputChange('gender', value)}
                style={{
                  paddingVertical: 0,
                  marginVertical: -6,
                  fontSize: 14,
                }}
              >
                <Picker.Item label="Male or Female" value="" />
                <Picker.Item label="Male" value="Male" />
                <Picker.Item label="Female" value="Female" />
              </Picker>
            </View>
            {errors.gender && (
              <Text className="text-red-500 text-sm mt-1">{errors.gender}</Text>
            )}
          </View>
        </View>

        {/* Contact Number */}
        <Input
          label="Contact Number *"
          placeholder="Please enter your mobile number"
          value={formData.contactNumber}
          onChangeText={(text) => handleInputChange('contactNumber', text)}
          keyboardType="phone-pad"
          error={errors.contactNumber}
          className="mb-4"
        />

        {/* Email */}
        <Input
          label="Email *"
          placeholder="kasithakumara@gmail.com"
          value={formData.email}
          onChangeText={(text) => handleInputChange('email', text)}
          keyboardType="email-address"
          autoCapitalize="none"
          error={errors.email}
          className="mb-4"
        />

        {/* Profile Image */}
        <ImageUpload
          label="Profile Image *"
          placeholder="Tap to upload Profile Image"
          imageUri={formData.profileImage}
          onPress={() => handleImagePick('profileImage')}
          error={errors.profileImage}
          className="mb-4"
        />

        {/* Front Side of NIC */}
        <ImageUpload
          label="Font Side of the NIC *"
          placeholder="Upload font side of the NIC"
          imageUri={formData.frontNicImage}
          onPress={() => handleImagePick('frontNicImage')}
          error={errors.frontNicImage}
          className="mb-4"
        />

        {/* Rear Side of NIC */}
        <ImageUpload
          label="Rare Side of the NIC *"
          placeholder="Upload rare side of the NIC"
          imageUri={formData.rearNicImage}
          onPress={() => handleImagePick('rearNicImage')}
          error={errors.rearNicImage}
          className="mb-8"
        />

        {/* Date Picker Modal */}
        {showDatePicker && (
          <DateTimePicker
            value={formData.birthDay}
            mode="date"
            display="default"
            onChange={handleDateChange}
            maximumDate={new Date()}
          />
        )}

        {/* part 2 of the form */}

        {/*Guide Licence Number */}
        <Input
          label="Guide License Number *"
          placeholder="SL123456"
          value={formData.guideLicenseNumber}
          onChangeText={(text) => handleInputChange('guideLicenseNumber', text)}
          error={errors.guideLicenseNumber}
          className="mb-4"
        />

        {/* Guide License Expire Date */}
        <View className="mb-4">
          <Text className="text-gray-700 font-medium mb-2">Guide License Expire Date *</Text>
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            className={`border border-gray-300 rounded-lg px-4 py-3 w-1/2 mr-2 ${errors.guideLicenseExpireDate ? 'border-red-500' : ''
              }`}
          >
            <Text className="text-gray-900">
              {formatDate(formData.guideLicenseExpireDate)}
            </Text>
          </TouchableOpacity>
          {errors.guideLicenseExpireDate && (
            <Text className="text-red-500 text-sm mt-1">{errors.guideLicenseExpireDate}</Text>
          )}
        </View>

        {/* Front Side of Guide License */}
        <ImageUpload
          label="Front Side of Guide License *"
          placeholder="Upload front side of Guide License"
          imageUri={formData.guideLicenseFrontImage}
          onPress={() => handleImagePick('guideLicenseFrontImage')}
          error={errors.guideLicenseFrontImage}
          className="mb-8"
        />

        {/* Rear Side of Guide License */}
        <ImageUpload
          label="Rear Side of Guide License *"
          placeholder="Upload rear side of Guide License"
          imageUri={formData.guideLicenseRearImage}
          onPress={() => handleImagePick('guideLicenseRearImage')}
          error={errors.guideLicenseRearImage}
          className="mb-8"
        />

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1, padding: 0, }}
        >
          <View style={{ flex: 1 }}>
            {/* Language Selection */}
            <Text style={{ fontSize: 14, fontWeight: 'bold', marginTop: 20, color: '#374151' }}>Languages You Speak *</Text>
            <MultiSelect
              items={languagesList}
              uniqueKey="id"
              onSelectedItemsChange={(selected) => setSelectedLanguages(selected)}
              selectedItems={selectedLanguages}
              selectText="Select Languages"
              searchInputPlaceholderText="Search languages..."
              displayKey="name"
              submitButtonColor="#007AFF"
              submitButtonText="Done"
              styleMainWrapper={{
                marginTop: 10,
              }}
              styleDropdownMenuSubsection={{
                borderWidth: 1,
                borderColor: '#ccc',
                borderRadius: 10,
                height: 45,
                justifyContent: 'center',
                paddingHorizontal: 10,
                paddingLeft: 25,
                overflow: 'hidden',
              }}
              styleInputGroup={{
                height: 45,
              }}
            />
            {errors.language && (
              <Text style={{ color: 'red', fontSize: 12, marginTop: 5 }}>
                {errors.language}
              </Text>
            )}



            {/* District Picker */}
            <Text style={{ fontSize: 14, fontWeight: 'bold', marginTop: 20, color: '#374151' }}>Base District *</Text>
            <View style={{ borderWidth: 1, borderColor: '#ccc', marginTop: 5, borderRadius: 10, height: 45, justifyContent: 'center', paddingHorizontal: 10, overflow: 'hidden', }}>
              <Picker
                selectedValue={selectedDistrict}
                onValueChange={(value) => {
                  setSelectedDistrict(value);
                  setSelectedArea('');
                }}
              >
                <Picker.Item label="Select District" value="" />
                {districts.map((district) => (
                  <Picker.Item key={district} label={district} value={district} />
                ))}
              </Picker>
            </View>
            {errors.district && (
              <Text style={{ color: 'red', fontSize: 12, marginTop: 5 }}>
                {errors.district}
              </Text>
            )}



            {/* Area Picker */}
            <Text style={{ fontSize: 14, fontWeight: 'bold', marginTop: 20, color: '#374151' }}>Base Area *</Text>
            <View style={{ borderWidth: 1, borderColor: '#ccc', marginTop: 5, borderRadius: 10, height: 45, justifyContent: 'center', paddingHorizontal: 10, overflow: 'hidden', }}>
              <Picker
                selectedValue={selectedArea}
                onValueChange={(value) => setSelectedArea(value)}
                enabled={!!selectedDistrict}
              >
                <Picker.Item label="Select Area " value="" />
                {(areas[selectedDistrict] || []).map((area) => (
                  <Picker.Item key={area} label={area} value={area} />
                ))}
              </Picker>
            </View>
            {errors.area && (
              <Text style={{ color: 'red', fontSize: 12, marginTop: 5 }}>
                {errors.area}
              </Text>
            )}


          </View>
        </KeyboardAvoidingView>

        {/* Daily Rates */}
        <Text style={{ fontSize: 14, fontWeight: 'bold', marginTop: 20, color: '#374151' }}>Daily Rate *</Text>
        <View className="flex-row space-x-3 mb-4">
          {/* Foreigners Rate (USD) */}
          <View className="flex-1">
            <Text className="text-gray-700 font-medium mb-2 mt-5 ml-2">for Foreigners (USD) *</Text>
            <View className={`border border-gray-300 rounded-lg flex-row items-center px-3 py-2 ${errors.rateForeigners ? 'border-red-500' : ''
              }`}>
              <Text className="text-gray-700 text-base mr-1">$</Text>
              <Input
                className="flex-1 text-gray-900"
                keyboardType="numeric"
                placeholder="Enter amount"
                value={formData.rateForeigners}
                onChangeText={(text) => handleInputChange('rateForeigners', text)}
              />
            </View>
            {errors.rateForeigners && (
              <Text className="text-red-500 text-sm mt-1">{errors.rateForeigners}</Text>
            )}
          </View>

          {/* Locals Rate (LKR) */}
          <View className="flex-1">
            <Text className="text-gray-700 font-medium mb-2 mt-5 ml-4">for Locals (LKR) *</Text>
            <View className={`border border-gray-300 rounded-lg flex-row items-center px-3 py-2 ml-2 ${errors.rateLocals ? 'border-red-500' : ''
              }`}>
              <Text className="text-gray-700 text-base mr-1">Rs</Text>
              <Input
                className="flex-1 text-gray-900"
                keyboardType="numeric"
                placeholder="Enter amount"
                value={formData.rateLocals}
                onChangeText={(text) => handleInputChange('rateLocals', text)}
              />
            </View>
            {errors.rateLocals && (
              <Text className="text-red-500 text-sm mt-1">{errors.rateLocals}</Text>
            )}
          </View>
        </View>


      </ScrollView>

      {/* Bottom Buttons */}
      <View className="bg-white px-4 py-4 border-t border-gray-200">
        <View className="flex-row space-x-10">
          <Button
            title="Previous"
            variant="secondary"
            onPress={handlePrevious}
            className="flex-1 bg-gray-400 text-black mr-2 "
          />

          <Button
            title="Next"
            variant="primary"
            onPress={handleSubmit}
            disabled={isLoading}
            className="flex-1 bg-yellow-400 ml-2"
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

