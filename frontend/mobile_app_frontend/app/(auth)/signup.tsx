import React, { useState } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Alert,
    Image
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { router } from 'expo-router';

// Make sure this path is correct in your project
const plusIcon = require('../../assets/images/plus (1).png');

const steps = [
    { id: 1, title: 'Personal Details' },
    { id: 2, title: 'Business Info' },
    { id: 3, title: 'Legal Documents' },
    { id: 4, title: 'Confirmation' },
];

// Updated countries array to include phone codes
const countries = [
    { label: 'Select Country...', value: '', phoneCode: '' },
    { label: 'Sri Lanka', value: 'LK', phoneCode: '+94' },
    { label: 'India', value: 'IN', phoneCode: '+91' },
    { label: 'United States', value: 'US', phoneCode: '+1' },
    { label: 'United Kingdom', value: 'GB', phoneCode: '+44' },
    { label: 'Australia', value: 'AU', phoneCode: '+61' },
    { label: 'Germany', value: 'DE', phoneCode: '+49' },
    { label: 'Japan', value: 'JP', phoneCode: '+81' },
    // In a real app, this list would be much longer
];


export default function SignupForm() {
    const [step, setStep] = useState(1);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [formData, setFormData] = useState({
        businessName: '',
        registrationNumber: '',
        businessType: 'Tent Rentals',
        description: '',
        businessAddress: '',
        operatingAreas: '',
        ownerName: '',
        mobileNumber: '',
        whatsappNumber: '',
        email: '',
        username: '',
        address: '',
        nicPassport: '',
        dob: '',
        gender: '',
        country: '',
        password: '',
        confirmPassword: '',
        availableProducts: '',
        rentalPrice: '',
        securityDeposit: '',
        rentingTime: '',
        advancePeriod: '',
        agreeTerms: false,
        confirmCondition: false,
        role: ''
    });

    const handleChange = (field: keyof typeof formData, value: string | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const nextStep = () => {
        if (formData.role == '') {

            alert('please select a role')
            return;

        } else {


            if (formData.role == 'user') {

                if (step < steps.length) setStep(4);

            } else {

                if (step < steps.length) setStep(step + 1);

            }


        }
    };

    const prevStep = () => {

        if (formData.role == 'user') {

            if (step > 1) setStep(1);


        } else {

            if (step > 1) setStep(step - 1);


        }

    };

    const handleSubmit = () => {
        // Here you would typically send the formData to your backend API
        Alert.alert('Success', 'Form submitted successfully!');
        router.replace('/(auth)'); // Navigate to a different screen on success
    };

    const renderStepContent = () => {
        const selectedCountry = countries.find(c => c.value === formData.country);

        switch (step) {
            case 1:
                return (
                    <View>
                        <TouchableOpacity onPress={() => { router.back() }} className='bg-black w-16 px-3 py-1 rounded-lg'>
                            <Text className='text-white'> Back</Text>
                        </TouchableOpacity>
                        <View className="items-center w-full my-10">
                            <TouchableOpacity
                                onPress={() => alert('Upload owner photo')}
                                className="w-44 h-44 rounded-full bg-gray-100 justify-center items-center border-2 border-dashed border-gray-300"
                            >
                                <Image
                                    source={plusIcon}
                                    className="w-16 h-16 opacity-60"
                                    resizeMode="contain"
                                />
                            </TouchableOpacity>
                            <Text className="text-base text-gray-600 mt-2">Add Owner's Photo</Text>
                        </View>


                        <Text className="mb-1 font-semibold text-base">Full Name</Text>
                        <TextInput className="text-black border border-gray-300 rounded-lg p-3 mb-4" value={formData.ownerName} onChangeText={v => handleChange('ownerName', v)} />

                        <Text className="mb-1 font-semibold text-base">Date of Birth</Text>
                        <TextInput
                            className="text-black border border-gray-300 rounded-lg p-3 mb-4"
                            placeholder="YYYY-MM-DD"
                            maxLength={10}
                            keyboardType="numeric"
                            value={formData.dob}
                            onChangeText={v => handleChange('dob', v)}
                        />

                        <Text className="mb-1 font-semibold text-base">Gender</Text>
                        <View className="border border-gray-300 rounded-lg mb-4">
                            <Picker selectedValue={formData.gender} onValueChange={v => handleChange('gender', v as string)}>
                                <Picker.Item label="Select Gender..." value="" />
                                <Picker.Item label="Male" value="male" />
                                <Picker.Item label="Female" value="female" />
                                <Picker.Item label="Other" value="other" />
                            </Picker>
                        </View>

                        <Text className="mb-1 font-semibold text-base">Country</Text>
                        <View className="border border-gray-300 rounded-lg mb-4">
                            <Picker selectedValue={formData.country} onValueChange={v => handleChange('country', v as string)}>
                                {countries.map(country => (
                                    <Picker.Item key={country.value} label={country.label} value={country.value} />
                                ))}
                            </Picker>
                        </View>

                        <Text className="mb-1 font-semibold text-base">Mobile Number</Text>
                        <View className="flex-row items-center border border-gray-300 rounded-lg px-3 mb-4">
                            <Text className="text-base text-gray-800 mr-2">
                                {selectedCountry?.phoneCode || '+'}
                            </Text>
                            <View className="w-px h-6 bg-gray-300 mr-3" />
                            <TextInput
                                className="flex-1 text-base text-black"
                                placeholder="77 123 4567"
                                value={formData.mobileNumber}
                                onChangeText={v => handleChange('mobileNumber', v)}
                                keyboardType="phone-pad"
                            />
                        </View>

                        <Text className="mb-1 font-semibold text-base">WhatsApp Number</Text>
                        <TextInput className="text-black border border-gray-300 rounded-lg p-3 mb-4" value={formData.whatsappNumber} onChangeText={v => handleChange('whatsappNumber', v)} keyboardType="phone-pad" />

                        <Text className="mb-1 font-semibold text-base">Email</Text>
                        <TextInput className="text-black border border-gray-300 rounded-lg p-3 mb-4" value={formData.email} onChangeText={v => handleChange('email', v)} keyboardType="email-address" />

                        <Text className="mb-1 font-semibold text-base">Username</Text>
                        <TextInput className="text-black border border-gray-300 rounded-lg p-3 mb-4" value={formData.username} onChangeText={v => handleChange('username', v)} />

                        <Text className="mb-1 font-semibold text-base">Current Address</Text>
                        <TextInput className="text-black border border-gray-300 rounded-lg p-3 mb-4" value={formData.address} onChangeText={v => handleChange('address', v)} />

                        <Text className="mb-1 font-semibold text-base">NIC / Passport Number</Text>
                        <TextInput className="text-black border border-gray-300 rounded-lg p-3 mb-4" value={formData.nicPassport} onChangeText={v => handleChange('nicPassport', v)} />

                        <Text className="mb-1 font-semibold text-base">Password</Text>
                        <View className="flex-row items-center border border-gray-300 rounded-lg  px-3 mb-4">
                            <TextInput
                                className="flex-1 text-base"
                                value={formData.password}
                                onChangeText={v => handleChange('password', v)}
                                secureTextEntry={!isPasswordVisible}
                            />
                            <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
                                <Text className="font-semibold text-blue-500">{isPasswordVisible ? 'Hide' : 'Show'}</Text>
                            </TouchableOpacity>
                        </View>

                        <Text className="mb-1 font-semibold text-base">Confirm Password</Text>
                        <TextInput
                            className="text-black border border-gray-300 rounded-lg p-3 mb-4"
                            value={formData.confirmPassword}
                            onChangeText={v => handleChange('confirmPassword', v)}
                            secureTextEntry={!isPasswordVisible}
                        />

                        <Text className="mb-1 font-semibold text-base">Choose</Text>
                        <View className="border border-gray-300 rounded-lg mb-4">
                            <Picker selectedValue={formData.role} onValueChange={v => handleChange('role', v as string)}>
                                <Picker.Item label="Register as..." value="" />
                                <Picker.Item label="Traveler" value="user" />
                                <Picker.Item label="Other" value="other" />
                            </Picker>
                        </View>

                    </View>
                );

            case 2:
                return (
                    <View>
                        <View className="items-center w-full my-7">
                            <TouchableOpacity
                                onPress={() => alert('Upload business item photo')}
                                className="w-44 h-44 rounded-full bg-gray-100 justify-center items-center border-2 border-dashed border-gray-300"
                            >
                                <Image
                                    source={plusIcon}
                                    className="w-16 h-16 opacity-60"
                                    resizeMode="contain"
                                />
                            </TouchableOpacity>
                            <Text className="text-base text-gray-600 mt-2">Business Item Photo</Text>
                        </View>

                        <Text className="mb-1 font-semibold text-base">Business Name</Text>
                        <TextInput className="text-black border border-gray-300 rounded-lg p-3 mb-4" value={formData.businessName} onChangeText={v => handleChange('businessName', v)} />

                        <Text className="mb-1 font-semibold text-base">Registration Number</Text>
                        <TextInput className="text-black border border-gray-300 rounded-lg p-3 mb-4" value={formData.registrationNumber} onChangeText={v => handleChange('registrationNumber', v)} />

                        <Text className="mb-1 font-semibold text-base">Business Type</Text>
                        <View className="border border-gray-300 rounded-lg mb-4">
                            <Picker selectedValue={formData.businessType} onValueChange={v => handleChange('businessType', v)}>
                                <Picker.Item label="Tent Rentals" value="Tent Rentals" />
                                <Picker.Item label="Vehicle Rentals" value="Vehicle Rentals" />
                                <Picker.Item label="Equipment Rentals" value="Equipment Rentals" />
                            </Picker>
                        </View>

                        <Text className="mb-1 font-semibold text-base">Description</Text>
                        <TextInput className="text-black border border-gray-300 rounded-lg p-3 mb-4 h-24" multiline value={formData.description} onChangeText={v => handleChange('description', v)} />

                        <Text className="mb-1 font-semibold text-base">Business Address</Text>
                        <TextInput className="text-black border border-gray-300 rounded-lg p-3 mb-8 mt-4" value={formData.businessAddress} onChangeText={v => handleChange('businessAddress', v)} />
                    </View>
                );

            case 3:
                return (
                    <View>
                        <View className='py-16'>
                            <Text className="mb-1 font-semibold text-base">Renting Time</Text>
                            <TextInput className="text-black border border-gray-300 rounded-lg p-3 mb-4" value={formData.rentingTime} onChangeText={v => handleChange('rentingTime', v)} />
                        </View>

                        <View className="items-center w-full my-8">
                            <TouchableOpacity
                                onPress={() => alert('Upload Business Registration')}
                                className="w-[98%] h-44 rounded-lg bg-gray-100 justify-center items-center border-2 border-dashed border-gray-300"
                            >
                                <Image
                                    source={plusIcon}
                                    className="w-16 h-16 opacity-60"
                                    resizeMode="contain"
                                />
                            </TouchableOpacity>
                            <Text className="text-base text-gray-600 mt-2">Business Registration Certificate</Text>
                        </View>

                        <View className="items-center w-full my-8">
                            <TouchableOpacity
                                onPress={() => alert('Upload Cancellation Policy')}
                                className="w-[98%] h-44 rounded-lg bg-gray-100 justify-center items-center border-2 border-dashed border-gray-300"
                            >
                                <Image
                                    source={plusIcon}
                                    className="w-16 h-16 opacity-60"
                                    resizeMode="contain"
                                />
                            </TouchableOpacity>
                            <Text className="text-base text-gray-600 mt-2">Cancellation Policy</Text>
                        </View>
                    </View>
                );

            case 4:
                return (
                    <View>
                        <View className="items-center w-full my-10">
                            <TouchableOpacity
                                onPress={() => alert('Upload National ID')}
                                className="w-[98%] h-44 rounded-lg bg-gray-100 justify-center items-center border-2 border-dashed border-gray-300"
                            >
                                <Image
                                    source={plusIcon}
                                    className="w-16 h-16 opacity-60"
                                    resizeMode="contain"
                                />
                            </TouchableOpacity>
                            <Text className="text-base text-gray-600 mt-2">National Identity Card</Text>
                        </View>

                        <View className="items-center w-full my-8">
                            <TouchableOpacity
                                onPress={() => alert('Select Location on Map')}
                                className="w-[98%] h-44 rounded-lg bg-gray-100 justify-center items-center border-2 border-dashed border-gray-300"
                            >
                                <Image
                                    source={plusIcon}
                                    className="w-16 h-16 opacity-60"
                                    resizeMode="contain"
                                />
                            </TouchableOpacity>
                            <Text className="text-base text-gray-600 mt-2 mb-8">Location On Map</Text>
                        </View>
                        <View className=" my-10">
                            <View className='flex-row items-center mb-5'>
                                <TouchableOpacity onPress={() => handleChange('agreeTerms', !formData.agreeTerms)}>
                                    <View className={`w-6 h-6 border-2 rounded mr-3 justify-center items-center ${formData.agreeTerms ? 'bg-[#FEFA17]' : 'border-gray-400'}`}>
                                        {formData.agreeTerms && <Text className="text-black font-extrabold text-center">✓</Text>}
                                    </View>
                                </TouchableOpacity>
                                <Text className="text-base text-gray-700 flex-1 font-bold">I agree to the terms and conditions</Text>
                            </View>
                            <View className='flex-row items-center mb-4'>
                                <TouchableOpacity onPress={() => handleChange('confirmCondition', !formData.confirmCondition)}>
                                    <View className={`w-6 h-6 border-2 rounded mr-3 justify-center items-center ${formData.confirmCondition ? 'bg-[#FEFA17]' : 'border-gray-400'}`}>
                                        {formData.confirmCondition && <Text className="text-black font-extrabold text-center">✓</Text>}
                                    </View>
                                </TouchableOpacity>
                                <Text className="text-base text-gray-700 flex-1 font-bold">I confirm that all rental items are in safe, usable condition</Text>
                            </View>
                        </View>
                    </View>
                );
        }
    };

    return (
        <SafeAreaView className="flex-1 p-5 bg-white">
            <Text className="text-xl font-bold mb-5">{/* Step {step} of {steps.length}:  */}{steps[step - 1].title}</Text>
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {renderStepContent()}

                <View className="flex-row justify-between mt-6 mb-4">
                    {step > 1 ? (
                        <TouchableOpacity className="bg-gray-300 py-3 px-8 rounded-lg" onPress={prevStep}>
                            <Text className="font-semibold text-gray-800">Previous</Text>
                        </TouchableOpacity>
                    ) : <View />}

                    {step < steps.length ? (
                        <TouchableOpacity className="bg-[#FEFA17] py-3 px-8 rounded-lg" onPress={nextStep}>
                            <Text className="font-semibold text-gray-800">Next</Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity className="bg-blue-500 py-3 px-8 rounded-lg" onPress={handleSubmit}>
                            <Text className="font-semibold text-white">Submit</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}