import React, { useEffect, useState } from 'react';
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

const countries = [
    { label: 'Select Country...', value: '', phoneCode: '' },
    { label: 'Sri Lanka', value: 'LK', phoneCode: '+94' },
    { label: 'India', value: 'IN', phoneCode: '+91' },
    { label: 'United States', value: 'US', phoneCode: '+1' },
    { label: 'United Kingdom', value: 'GB', phoneCode: '+44' },
    { label: 'Australia', value: 'AU', phoneCode: '+61' },
    { label: 'Germany', value: 'DE', phoneCode: '+49' },
    { label: 'Japan', value: 'JP', phoneCode: '+81' },
];


export default function SignupForm() {
    const [step, setStep] = useState(1);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
    const [formData, setFormData] = useState({
        businessName: '',
        registrationNumber: '',
        businessType: '',
        description: '',
        businessAddress: '',
        operatingAreas: '',
        fullName: '',
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
        role: '',
        pp: '',
        nicpic: '',
        locpic: '',
        status: 'active',
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const validateField = (field: string, value: string | boolean) => {
        let error = '';
        // General check for empty fields
        if (typeof value === 'string' && !value.trim()) {
            error = 'This field is required.';
        }
        // Specific validation for DOB
        else if (field === 'dob') {
            const dobRegex = /^\d{4}-\d{2}-\d{2}$/;
            if (!dobRegex.test(value as string)) {
                error = 'Please use YYYY-MM-DD format.';
            } else {
                const birthDate = new Date(value as string);
                const today = new Date();

                // Check if the entered date is a real date
                if (isNaN(birthDate.getTime())) {
                    error = 'Please enter a valid date.';
                }
                // Check if the date is in the future
                else if (birthDate > today) {
                    error = 'Date of birth cannot be in the future.';
                } else {
                    // Check if the user is at least 18 years old
                    const eighteenYearsAgo = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
                    if (birthDate > eighteenYearsAgo) {
                        error = 'You must be at least 18 years old to register.';
                    }
                }
            }
        }
        // Other specific validations
        else if (field === 'email' && typeof value === 'string' && !/\S+@\S+\.\S+/.test(value)) {
            error = 'Please enter a valid email address.';
        } else if (field === 'password' && typeof value === 'string' && value.length < 8) {
            error = 'Password must be at least 8 characters long.';
        } else if (field === 'confirmPassword' && value !== formData.password) {
            error = 'Passwords do not match.';
        }
        return error;
    };

    const handleChange = (field: keyof typeof formData, value: string | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        const error = validateField(field, value);
        setErrors(prev => {
            const newErrors = { ...prev };
            if (error) {
                newErrors[field] = error;
            } else {
                delete newErrors[field];
            }
            return newErrors;
        });
    };

    const validateStep1 = () => {
        const step1Errors: { [key: string]: string } = {};
        const fieldsToValidate: (keyof typeof formData)[] = [
            'fullName', 'mobileNumber', 'whatsappNumber', 'email', 'username',
            'address', 'nicPassport', 'dob', 'gender', 'country', 'password',
            'confirmPassword', 'role', 'pp'
        ];

        fieldsToValidate.forEach(field => {
            const error = validateField(field, formData[field]);
            if (error) {
                step1Errors[field] = error;
            }
        });

        setErrors(step1Errors);
        return Object.keys(step1Errors).length === 0;
    };

    const validateStep4 = () => {
        const step4Errors: { [key: string]: string } = {};
        const fieldsToValidate: (keyof typeof formData)[] = [
            'nicpic', 'locpic', 'agreeTerms'
        ];

        fieldsToValidate.forEach(field => {
            const error = validateField(field, formData[field]);
            if (error) {
                step4Errors[field] = error;
            }
        });

        if (!formData.agreeTerms) step4Errors['agreeTerms'] = "You must agree to the terms.";
        //if (!formData.confirmCondition) step4Errors['confirmCondition'] = "You must confirm the item condition.";


        setErrors(prev => ({ ...prev, ...step4Errors })); // Merge errors
        return Object.keys(step4Errors).length === 0;

    }

    const nextStep = () => {
        if (!validateStep1()) {
            return;
        }

        if (formData.role === 'user') {
            setStep(4);
        } else if (formData.role === 'other') {
            if (step < steps.length) setStep(step + 1);
        }
    };

    const prevStep = () => {
        if (formData.role === 'user' && step > 1) {
            setStep(1);
        } else if (step > 1) {
            setStep(step - 1);
        }
    };

    const handleSubmit = async () => {
        const isStep1Valid = validateStep1();
        const isStep4Valid = validateStep4();

        if (formData.role == 'user' && isStep1Valid && isStep4Valid) {
            console.log(formData)
            try {

                await fetch('http://localhost:8080/traveler/signup', {

                    method: 'POST',
                    body: JSON.stringify(formData),
                    headers: { 'Content-Type': 'application/json' }

                })
                    .then(res => res.text())
                    .then(data => { if (data == "Success") { router.replace('/(auth)'); } else { alert('An error occurs, Try again later..') } })
                    .catch(err => alert(`${err}`))


            }/*  else {
                alert("Validation Error Please fill all required fields correctly.");
            } */

            catch (err) {
                console.log(err)
            }
        }
    };

    const renderStepContent = () => {
        const selectedCountry = countries.find(c => c.value === formData.country);

        switch (step) {
            case 1:
                return (
                    <View>
                        <TouchableOpacity onPress={() => router.back()} className='bg-black w-16 px-3 py-1 rounded-lg'>
                            <Text className='text-white'> Back</Text>
                        </TouchableOpacity>
                        <View className="items-center w-full my-10">
                            {/*<TouchableOpacity
                                onPress={() => alert('Upload owner photo')}
                                className="w-44 h-44 rounded-full bg-gray-100 justify-center items-center border-2 border-dashed border-gray-300"
                            >
                                 <Image
                                    source={plusIcon}
                                    className="w-16 h-16 opacity-60"
                                    resizeMode="contain"
                            </TouchableOpacity>
                                /> */}
                            <TextInput className="text-black border border-gray-300 rounded-lg p-3" value={formData.pp} onChangeText={v => handleChange('pp', v)} />
                            <Text className={`text-red-500 text-sm mt-1 ${errors.pp ? 'opacity-100' : 'opacity-0'}`}>{errors.fullName || ' '}</Text>
                            <Text className="text-base text-gray-600 mt-2">Add Owner's Photo</Text>
                        </View>

                        <View className="mb-4">
                            <Text className="mb-1 font-semibold text-base">Full Name</Text>
                            <TextInput className="text-black border border-gray-300 rounded-lg p-3" value={formData.fullName} onChangeText={v => handleChange('fullName', v)} />
                            <Text className={`text-red-500 text-sm mt-1 ${errors.fullName ? 'opacity-100' : 'opacity-0'}`}>{errors.fullName || ' '}</Text>
                        </View>

                        <View className="mb-4">
                            <Text className="mb-1 font-semibold text-base">Date of Birth</Text>
                            <TextInput
                                className="text-black border border-gray-300 rounded-lg p-3"
                                placeholder="YYYY-MM-DD"
                                maxLength={10}
                                keyboardType="numeric"
                                value={formData.dob}
                                onChangeText={v => handleChange('dob', v)}
                            />
                            <Text className={`text-red-500 text-sm mt-1 ${errors.dob ? 'opacity-100' : 'opacity-0'}`}>{errors.dob || ' '}</Text>
                        </View>

                        <View className="mb-4">
                            <Text className="mb-1 font-semibold text-base text-black">Gender</Text>
                            <View className="border border-gray-300 rounded-lg">
                                <Picker selectedValue={formData.gender} onValueChange={v => handleChange('gender', v as string)}>
                                    <Picker.Item label="Select Gender..." value="" />
                                    <Picker.Item label="Male" value="male" />
                                    <Picker.Item label="Female" value="female" />
                                    <Picker.Item label="Other" value="other" />
                                </Picker>
                            </View>
                            <Text className={`text-red-500 text-sm mt-1 ${errors.gender ? 'opacity-100' : 'opacity-0'}`}>{errors.gender || ' '}</Text>
                        </View>

                        <View className="mb-4">
                            <Text className="mb-1 font-semibold text-base text-black">Country</Text>
                            <View className="border border-gray-300 rounded-lg">
                                <Picker selectedValue={formData.country} onValueChange={v => handleChange('country', v as string)}>
                                    {countries.map(country => (
                                        <Picker.Item key={country.value} label={country.label} value={country.value} />
                                    ))}
                                </Picker>
                            </View>
                            <Text className={`text-red-500 text-sm mt-1 ${errors.country ? 'opacity-100' : 'opacity-0'}`}>{errors.country || ' '}</Text>
                        </View>

                        <View className="mb-4">
                            <Text className="mb-1 font-semibold text-base">Mobile Number</Text>
                            <View className="flex-row items-center border border-gray-300 rounded-lg px-3">
                                <Text className="text-base text-gray-800 mr-2">
                                    {selectedCountry?.phoneCode || '+'}
                                </Text>
                                <View className="w-px h-6 bg-gray-300 mr-3" />
                                <TextInput
                                    className="flex-1 text-base text-black py-3"
                                    placeholder="771234567"
                                    value={formData.mobileNumber}
                                    onChangeText={v => handleChange('mobileNumber', v)}
                                    keyboardType="number-pad"
                                />
                            </View>
                            <Text className={`text-red-500 text-sm mt-1 ${errors.mobileNumber ? 'opacity-100' : 'opacity-0'}`}>{errors.mobileNumber || ' '}</Text>
                        </View>

                        <View className="mb-4">
                            <Text className="mb-1 font-semibold text-base">WhatsApp Number</Text>
                            <TextInput className="text-black border border-gray-300 rounded-lg p-3" value={formData.whatsappNumber} onChangeText={v => handleChange('whatsappNumber', v)} keyboardType="number-pad" />
                            <Text className={`text-red-500 text-sm mt-1 ${errors.whatsappNumber ? 'opacity-100' : 'opacity-0'}`}>{errors.whatsappNumber || ' '}</Text>
                        </View>

                        <View className="mb-4">
                            <Text className="mb-1 font-semibold text-base">Email</Text>
                            <TextInput className="text-black border border-gray-300 rounded-lg p-3" value={formData.email} onChangeText={v => handleChange('email', v)} keyboardType="email-address" autoCapitalize="none" />
                            <Text className={`text-red-500 text-sm mt-1 ${errors.email ? 'opacity-100' : 'opacity-0'}`}>{errors.email || ' '}</Text>
                        </View>

                        <View className="mb-4">
                            <Text className="mb-1 font-semibold text-base">Username</Text>
                            <TextInput className="text-black border border-gray-300 rounded-lg p-3" value={formData.username} onChangeText={v => handleChange('username', v)} autoCapitalize="none" />
                            <Text className={`text-red-500 text-sm mt-1 ${errors.username ? 'opacity-100' : 'opacity-0'}`}>{errors.username || ' '}</Text>
                        </View>

                        <View className="mb-4">
                            <Text className="mb-1 font-semibold text-base">Current Address</Text>
                            <TextInput className="text-black border border-gray-300 rounded-lg p-3" value={formData.address} onChangeText={v => handleChange('address', v)} />
                            <Text className={`text-red-500 text-sm mt-1 ${errors.address ? 'opacity-100' : 'opacity-0'}`}>{errors.address || ' '}</Text>
                        </View>

                        <View className="mb-4">
                            <Text className="mb-1 font-semibold text-base">NIC / Passport Number</Text>
                            <TextInput className="text-black border border-gray-300 rounded-lg p-3" value={formData.nicPassport} onChangeText={v => handleChange('nicPassport', v)} />
                            <Text className={`text-red-500 text-sm mt-1 ${errors.nicPassport ? 'opacity-100' : 'opacity-0'}`}>{errors.nicPassport || ' '}</Text>
                        </View>

                        <View className="mb-4">
                            <Text className="mb-1 font-semibold text-base">Password</Text>
                            <View className="flex-row items-center border border-gray-300 rounded-lg">
                                <TextInput
                                    className="px-3 flex-1 text-base py-3"
                                    value={formData.password}
                                    onChangeText={v => handleChange('password', v)}
                                    secureTextEntry={!isPasswordVisible}
                                />
                                <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)} className='px-3'>
                                    <Text className="font-semibold text-blue-500">{isPasswordVisible ? 'Hide' : 'Show'}</Text>
                                </TouchableOpacity>
                            </View>
                            <Text className={`text-red-500 text-sm mt-1 ${errors.password ? 'opacity-100' : 'opacity-0'}`}>{errors.password || ' '}</Text>
                        </View>

                        <View className="mb-4">
                            <Text className="mb-1 font-semibold text-base">Confirm Password</Text>
                            <View className="flex-row items-center border border-gray-300 rounded-lg">
                                <TextInput
                                    className="px-3 flex-1 text-base py-3"
                                    value={formData.confirmPassword}
                                    onChangeText={v => handleChange('confirmPassword', v)}
                                    secureTextEntry={!isConfirmPasswordVisible}
                                />
                                <TouchableOpacity onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)} className='px-3'>
                                    <Text className="font-semibold text-blue-500">{isConfirmPasswordVisible ? 'Hide' : 'Show'}</Text>
                                </TouchableOpacity>
                            </View>
                            <Text className={`text-red-500 text-sm mt-1 ${errors.confirmPassword ? 'opacity-100' : 'opacity-0'}`}>{errors.confirmPassword || ' '}</Text>
                        </View>

                        <View className="mb-4">
                            <Text className="mb-1 font-semibold text-base text-black">Choose</Text>
                            <View className="border border-gray-300 rounded-lg">
                                <Picker selectedValue={formData.role} onValueChange={v => handleChange('role', v as string)}>
                                    <Picker.Item label="Register as..." value="" />
                                    <Picker.Item label="Traveler" value="user" />
                                    <Picker.Item label="Other" value="other" />
                                </Picker>
                            </View>
                            <Text className={`text-red-500 text-sm mt-1 ${errors.role ? 'opacity-100' : 'opacity-0'}`}>{errors.role || ' '}</Text>
                        </View>
                    </View>
                );

            case 2:
                // You can expand validation for other steps similarly
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
                            <Picker selectedValue={formData.businessType} onValueChange={v => handleChange('businessType', v as string)}>
                                <Picker.Item label="Tent Rentals" value="Tent Rentals" />
                                <Picker.Item label="Vehicle Rentals" value="Vehicle Rentals" />
                                <Picker.Item label="Equipment Rentals" value="Equipment Rentals" />
                            </Picker>
                        </View>

                        <Text className="mb-1 font-semibold text-base">Description</Text>
                        <TextInput className="text-black border border-gray-300 rounded-lg p-3 mb-4 h-24" multiline value={formData.description} onChangeText={v => handleChange('description', v)} />

                        <Text className="mb-1 font-semibold text-base">Business Address</Text>
                        <TextInput className="text-black border border-gray-300 rounded-lg p-3 mb-8" value={formData.businessAddress} onChangeText={v => handleChange('businessAddress', v)} />
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
                            {/* <TouchableOpacity
                                onPress={() => alert('Upload National ID')}
                                className="w-[98%] h-44 rounded-lg bg-gray-100 justify-center items-center border-2 border-dashed border-gray-300"
                            >
                                <Image
                                    source={plusIcon}
                                    className="w-16 h-16 opacity-60"
                                    resizeMode="contain"
                                />
                            </TouchableOpacity> */}
                            <TextInput className="text-black border border-gray-300 rounded-lg p-3 mb-4" value={formData.nicpic} onChangeText={v => handleChange('nicpic', v)} />
                            <Text className={`text-red-500 text-sm mt-1 ${errors.nicpic ? 'opacity-100' : 'opacity-0'}`}>{errors.nicpic || ' '}</Text>
                            <Text className="text-base text-gray-600 mt-2">National Identity Card</Text>
                        </View>

                        <View className="items-center w-full my-8">
                            {/* <TouchableOpacity
                                onPress={() => alert('Select Location on Map')}
                                className="w-[98%] h-44 rounded-lg bg-gray-100 justify-center items-center border-2 border-dashed border-gray-300"
                                >
                                <Image
                                source={plusIcon}
                                className="w-16 h-16 opacity-60"
                                resizeMode="contain"
                                />
                                </TouchableOpacity> */}
                            <TextInput className="text-black border border-gray-300 rounded-lg p-3 mb-4" value={formData.locpic} onChangeText={v => handleChange('locpic', v)} />
                            <Text className={`text-red-500 text-sm mt-1 ${errors.locpic ? 'opacity-100' : 'opacity-0'}`}>{errors.locpic || ' '}</Text>
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
                            {formData.role != 'user' && <View className='flex-row items-center mb-4'>
                                <TouchableOpacity onPress={() => handleChange('confirmCondition', !formData.confirmCondition)}>
                                    <View className={`w-6 h-6 border-2 rounded mr-3 justify-center items-center ${formData.confirmCondition ? 'bg-[#FEFA17]' : 'border-gray-400'}`}>
                                        {formData.confirmCondition && <Text className="text-black font-extrabold text-center">✓</Text>}
                                    </View>
                                </TouchableOpacity>
                                <Text className="text-base text-gray-700 flex-1 font-bold">I confirm that all rental items are in safe, usable condition</Text>
                            </View>}
                        </View>
                        <Text className={`text-red-500 text-sm mt-1 ${errors.confirmCondition && formData.role != 'user' ? 'opacity-100' : 'opacity-0'}`}>{errors.confirmCondition || ' '}</Text>
                        <Text className={`text-red-500 text-sm mt-1 ${errors.agreeTerms ? 'opacity-100' : 'opacity-0'}`}>{errors.agreeTerms || ' '}</Text>
                    </View>
                );
        }
    };

    return (
        <SafeAreaView className="flex-1 p-5 bg-white">
            <Text className="text-xl font-bold mb-5">{steps[step - 1].title}</Text>
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