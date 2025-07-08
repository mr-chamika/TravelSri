import React, { useState, useRef } from 'react';
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
const plusIcon = require('../../assets/images/plus (1).png');

const steps = [
    { id: 1, title: 'Business Details' },
    { id: 2, title: 'Contact Info' },
    { id: 3, title: 'Legal Documents' },
    { id: 4, title: 'Confirmation' },
];

export default function SignupForm() {
    const [step, setStep] = useState(1);
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
        nicPassport: '',
        availableProducts: '',
        rentalPrice: '',
        securityDeposit: '',
        rentingTime: '',
        advancePeriod: '',
        agreeTerms: false,
        confirmCondition: false,
    });

    const handleChange = (field: keyof typeof formData, value: string | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const nextStep = () => {
        if (step < steps.length) setStep(step + 1);
    };

    const prevStep = () => {
        if (step > 1) setStep(step - 1);
    };

    const handleSubmit = () => {

        Alert.alert('Success', 'Form submitted successfully!');
        router.replace('/(auth)')
    };

    const renderStepContent = () => {
        switch (step) {
            case 1:
                return (
                    // Removed 'h-full' and 'border-2' from this View
                    <View>
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


                        <Text className="mb-1 font-semibold text-base">Owner Name</Text>
                        <TextInput className="border border-gray-300 rounded-lg p-3 mb-4" value={formData.ownerName} onChangeText={v => handleChange('ownerName', v)} />

                        <Text className="mb-1 font-semibold text-base">Mobile Number</Text>
                        <TextInput className="border border-gray-300 rounded-lg p-3 mb-4" value={formData.mobileNumber} onChangeText={v => handleChange('mobileNumber', v)} keyboardType="phone-pad" />

                        <Text className="mb-1 font-semibold text-base">WhatsApp Number</Text>
                        <TextInput className="border border-gray-300 rounded-lg p-3 mb-4" value={formData.whatsappNumber} onChangeText={v => handleChange('whatsappNumber', v)} keyboardType="phone-pad" />

                        <Text className="mb-1 font-semibold text-base">Email</Text>
                        <TextInput className="border border-gray-300 rounded-lg p-3 mb-4" value={formData.email} onChangeText={v => handleChange('email', v)} keyboardType="email-address" />

                        <Text className="mb-1 font-semibold text-base">NIC / Passport</Text>
                        <TextInput className="border border-gray-300 rounded-lg p-3 mb-4" value={formData.nicPassport} onChangeText={v => handleChange('nicPassport', v)} />
                    </View>
                );

            case 2:
                return (
                    <View>

                        <View className="items-center w-full my-7">
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
                            <Text className="text-base text-gray-600 mt-2">Business Item Photo</Text>
                        </View>

                        <Text className="mb-1 font-semibold text-base">Business Name</Text>
                        <TextInput className="border border-gray-300 rounded-lg p-3 mb-4" value={formData.businessName} onChangeText={v => handleChange('businessName', v)} />

                        <Text className="mb-1 font-semibold text-base">Registration Number</Text>
                        <TextInput className="border border-gray-300 rounded-lg p-3 mb-4" value={formData.registrationNumber} onChangeText={v => handleChange('registrationNumber', v)} />

                        <Text className="mb-1 font-semibold text-base">Business Type</Text>
                        <View className="border border-gray-300 rounded-lg mb-4">
                            <Picker selectedValue={formData.businessType} onValueChange={v => handleChange('businessType', v)}>
                                <Picker.Item label="Tent Rentals" value="Tent Rentals" />
                                <Picker.Item label="Vehicle Rentals" value="Vehicle Rentals" />
                                <Picker.Item label="Equipment Rentals" value="Equipment Rentals" />
                            </Picker>
                        </View>

                        <Text className="mb-1 font-semibold text-base">Description</Text>
                        <TextInput className="border border-gray-300 rounded-lg p-3 mb-4 h-24" multiline value={formData.description} onChangeText={v => handleChange('description', v)} />

                        <Text className="mb-1 font-semibold text-base">Business Address</Text>
                        <TextInput className="border border-gray-300 rounded-lg p-3 mb-8 mt-4" value={formData.businessAddress} onChangeText={v => handleChange('businessAddress', v)} />
                    </View>
                );

            // ... other cases remain the same


            case 3:
                return (
                    <View >
                        <View className='py-16'>

                            <Text className="mb-1 font-semibold text-base">Renting Time</Text>
                            <TextInput className="border border-gray-300 rounded-lg p-3 mb-4" value={formData.rentingTime} onChangeText={v => handleChange('rentingTime', v)} />
                        </View>

                        <View className="items-center w-full my-8">
                            <TouchableOpacity
                                onPress={() => alert('Upload owner photo')}
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
                                onPress={() => alert('Upload owner photo')}
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
                                onPress={() => alert('Upload owner photo')}
                                className="w-[98%] h-44 rounded-lg bg-gray-100 justify-center items-center border-2 border-dashed border-gray-300"
                            >
                                <Image
                                    source={plusIcon}
                                    className="w-16 h-16 opacity-60"
                                    resizeMode="contain"
                                />
                            </TouchableOpacity>
                            <Text className="text-base text-gray-600 mt-2">National Identiy Card</Text>
                        </View>

                        <View className="items-center w-full my-8">
                            <TouchableOpacity
                                onPress={() => alert('Upload owner photo')}
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
                            <View className='flex-row'>
                                <TouchableOpacity onPress={() => handleChange('agreeTerms', !formData.agreeTerms)} className="flex-row items-center mb-5">
                                    <View className={`w-6 h-6 border-2 rounded mr-3 justify-center items-center ${formData.agreeTerms ? 'bg-yellow-500 border-yellow-500' : 'border-gray-400'}`}>
                                        {/* Replaced Icon with Text */}
                                        {formData.agreeTerms && <Text className="text-black font-extrabold text-center">✓</Text>}
                                    </View>
                                </TouchableOpacity>
                                <Text className="text-base text-gray-700 flex-1">I agree to the terms and conditions</Text>
                            </View>
                            <View className='flex-row'>
                                <TouchableOpacity onPress={() => handleChange('confirmCondition', !formData.confirmCondition)} className="flex-row items-center mb-4">
                                    <View className={`w-6 h-6 border-2 rounded mr-3 justify-center items-center ${formData.confirmCondition ? 'bg-yellow-500 border-yellow-500' : 'border-gray-400'}`}>
                                        {/* Replaced Icon with Text */}
                                        {formData.confirmCondition && <Text className="text-black font-extrabold text-center">✓</Text>}
                                    </View>
                                </TouchableOpacity>
                                <Text className="text-base text-gray-700 flex-1">I confirm that all rental items are in safe, usable condition</Text>
                            </View>
                        </View>
                    </View>
                );
        }
    };

    return (
        <SafeAreaView className="flex-1 p-5">
            <Text className="text-xl font-bold mb-5">Step {step} of {steps.length}: {steps[step - 1].title}</Text>
            {/* Added 'flex-1' to this ScrollView */}
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {renderStepContent()}

                <View className="flex-row justify-between mt-6">
                    {step > 1 && (
                        <TouchableOpacity className="bg-gray-300 py-2 px-6 rounded-lg" onPress={prevStep}>
                            <Text className="font-semibold">Previous</Text>
                        </TouchableOpacity>
                    )}
                    {step < steps.length && (
                        <TouchableOpacity className="bg-[#FEFA17] py-2 px-6 rounded-lg" onPress={nextStep}>
                            <Text className="font-semibold">Next</Text>
                        </TouchableOpacity>
                    )}
                    {step == steps.length && (
                        <TouchableOpacity className="bg-blue-500 py-2 px-6 rounded-lg" onPress={handleSubmit}>
                            <Text className="font-semibold text-white">Submit</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}