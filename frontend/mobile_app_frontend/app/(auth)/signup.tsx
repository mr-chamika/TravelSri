import React, { useState, useEffect } from 'react';
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
import * as ImagePicker from 'expo-image-picker';
import { ImagePickerAsset } from 'expo-image-picker';
import * as FileSystem from 'expo-file-system'
import emailjs from '@emailjs/browser'

// Make sure this path is correct in your project
const plusIcon = require('../../assets/images/plus (1).png');
const otpIcon = require('../../assets/images/otp.png');


const steps = [
    { id: 1, title: 'Personal Details' },
    { id: 2, title: 'Business Info' },
    { id: 3, title: 'Availability & Documents' },
    { id: 4, title: 'Confirmation' },
    { id: 5, title: 'Authentication' },
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

const timeOptions = [
    '12:00 AM', '12:30 AM', '01:00 AM', '01:30 AM', '02:00 AM', '02:30 AM',
    '03:00 AM', '03:30 AM', '04:00 AM', '04:30 AM', '05:00 AM', '05:30 AM',
    '06:00 AM', '06:30 AM', '07:00 AM', '07:30 AM', '08:00 AM', '08:30 AM',
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM',
    '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM',
    '06:00 PM', '06:30 PM', '07:00 PM', '07:30 PM', '08:00 PM', '08:30 PM',
    '09:00 PM', '09:30 PM', '10:00 PM', '10:30 PM', '11:00 PM', '11:30 PM'
];

interface FormData {
    // Step 1
    fullName: string;
    mobileNumber: string;
    whatsappNumber: string;
    email: string;
    username: string;
    address: string;
    nicPassport: string;
    dob: string;
    gender: string;
    country: string;
    password: string;
    confirmPassword: string;
    role: string;
    pp: ImagePickerAsset | null; // Profile Picture

    // Step 2
    businessName: string;
    registrationNumber: string;
    businessType: string;
    description: string;
    businessAddress: string;
    bp: ImagePickerAsset | null; // Business Photo

    // Step 3
    daysPerWeek: string;
    startTime: string;
    endTime: string;
    businessRegPic: ImagePickerAsset | null;
    cancellationPolicyPic: ImagePickerAsset | null;

    // Step 4 & Others
    nicpic: ImagePickerAsset | null;
    locpic: ImagePickerAsset | null;
    agreeTerms: boolean;
    confirmCondition: boolean;
    status: string;
}

export default function SignupForm() {
    const [step, setStep] = useState(1);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
    const [otp, setOtp] = useState('');
    const [generatedOtp, setGeneratedOtp] = useState({ code: '', timestamp: 0 });
    const [formData, setFormData] = useState<FormData>({
        // Step 1
        fullName: 'W.K. Hasith Chamika Wijesinghe',//
        mobileNumber: '771161615',//
        whatsappNumber: '0786715765',//
        email: 'chamikauni2001@gmail.com',//
        username: 'chami',//
        address: '"WIJAYAWASA",HATHTHAKA,PITIGALA.',//
        nicPassport: '200124102989',//
        dob: '2001-08-28',//
        gender: 'male',//
        country: 'SL',//
        password: '123456789',//
        confirmPassword: '123456789',
        role: 'user',//
        pp: null, // Profile Picture

        // Step 2
        businessName: '',//
        registrationNumber: '',//
        businessType: '',//
        description: '',//
        businessAddress: '',//
        bp: null, // Business Photo

        // Step 3
        daysPerWeek: '',//
        startTime: '',//
        endTime: '',//
        businessRegPic: null,//
        cancellationPolicyPic: null,//

        // Step 4 & Others
        nicpic: null,//
        locpic: null,//
        agreeTerms: false,//
        confirmCondition: false,//
        status: '',//
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [emailCheckStatus, setEmailCheckStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');
    const [selectedImage, setSelectedImage] = useState(null)

    const handleChoosePhoto = async (field: keyof FormData) => {
        // 1. Request permission
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to make this work!');
            return;
        }

        // 2. Launch the image library
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true, // Optional: for simple cropping
                quality: 1,
                base64: true, // Ask for the Base64 string directly
            });

            if (!result.canceled) {
                // The 'Asset' from expo-image-picker is compatible
                const selectedAsset = result.assets[0];

                setFormData(prevState => ({
                    ...prevState,
                    [field]: selectedAsset,
                }));

                if (errors[field]) {
                    setErrors(prevErrors => {
                        const newErrors = { ...prevErrors };
                        delete newErrors[field];
                        return newErrors;
                    });
                }
            }
        } catch (error) {
            console.error("Image picker error:", error);
            Alert.alert("Error", "An error occurred while picking the image.");
        }
    };

    const handleUploadPhoto = async () => {
        if (!selectedImage) {
            alert('No Image Selected Please select an image to upload.');
            return;
        }
    }

    const validateField = (field: string, value: string | boolean) => {
        let error = '';
        if (typeof value === 'string' && !value.trim()) {
            error = 'This field is required.';
        } else if (field === 'agreeTerms' && !value) {
            error = 'You must agree to the terms and conditions.';
        } else if (field === 'confirmCondition' && !value) {
            error = 'You must confirm the item condition.';
        }
        else if (field === 'dob') {
            const dobRegex = /^\d{4}-\d{2}-\d{2}$/;
            if (!dobRegex.test(value as string)) {
                error = 'Please use YYYY-MM-DD format.';
            } else {
                const birthDate = new Date(value as string);
                const today = new Date();
                if (isNaN(birthDate.getTime())) {
                    error = 'Please enter a valid date.';
                } else if (birthDate > today) {
                    error = 'Date of birth cannot be in the future.';
                } else {
                    const eighteenYearsAgo = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
                    if (birthDate > eighteenYearsAgo) {
                        error = 'You must be at least 18 years old.';
                    }
                }
            }
        } else if (field === 'email' && typeof value === 'string' && !/\S+@\S+\.\S+/.test(value)) {
            error = 'Please enter a valid email address.';
        } else if (field === 'password' && typeof value === 'string' && value.length < 8) {
            error = 'Password must be at least 8 characters long.';
        } else if (field === 'confirmPassword' && value !== formData.password) {
            error = 'Passwords do not match.';
        } else if (field === 'daysPerWeek') {
            const numDays = parseInt(value as string, 10);
            if (isNaN(numDays) || numDays <= 0) {
                error = 'Please enter a valid number of days.';
            } else if (numDays > 7) {
                error = 'Days cannot exceed 7.';
            }
        }
        return error;
    };

    const checkEmailAvailability = async (email: string) => {
        if (!email) {
            setEmailCheckStatus('idle');
            return;
        }

        setEmailCheckStatus('checking');
        try {
            // Replace with your actual backend endpoint for email validation
            const response = await fetch(`http://localhost:8080/user/check-email?email=${email}`);
            const data = await response.text();
            console.log(data)
            if (data === "Exists") {
                setEmailCheckStatus('taken');
                setErrors(prev => ({ ...prev, email: 'This email is already registered.' }));
            } else {
                setEmailCheckStatus('available');
                setErrors(prev => {
                    const newErrors = { ...prev };
                    delete newErrors.email;
                    return newErrors;
                });
            }
        } catch (error) {
            console.error('Error checking email availability:', error);
            setEmailCheckStatus('idle'); // Or 'error'
            setErrors(prev => ({ ...prev, email: 'Could not check email. Please try again.' }));
        }
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

        if (field === 'email') {
            if (typeof value === 'string' && /\S+@\S+\.\S+/.test(value)) {
                checkEmailAvailability(value);
            } else {
                setEmailCheckStatus('idle');
            }
        }
    };

    const validateStep1 = () => {
        const step1Errors: { [key: string]: string } = {};
        const fieldsToValidate: (keyof typeof formData)[] = [
            'pp', 'fullName', 'dob', 'gender', 'country', 'mobileNumber', 'whatsappNumber',
            'email', 'username', 'address', 'nicPassport', 'password', 'confirmPassword', 'role'
        ];
        fieldsToValidate.forEach(field => {

            const value = formData[field as keyof FormData];
            if (typeof value === 'string' || typeof value === 'boolean') {
                const error = validateField(field, value);
                if (error) {
                    step1Errors[field as keyof typeof step1Errors] = error;
                }
            }
        });

        if (!formData.pp) {
            step1Errors.pp = 'Owner photo is required.';
        }

        // Add email availability check to validation
        if (emailCheckStatus === 'taken') {
            step1Errors.email = 'This email is already registered.';
        }

        setErrors(step1Errors);
        return Object.keys(step1Errors).length === 0;
    };

    const validateStep2 = () => {
        const step2Errors: { [key: string]: string } = {};
        const fieldsToValidate: (keyof typeof formData)[] = [
            'bp', 'businessName', 'registrationNumber', 'businessType', 'description', 'businessAddress'
        ];
        fieldsToValidate.forEach(field => {

            const value = formData[field as keyof FormData];
            if (typeof value === 'string' || typeof value === 'boolean') {
                const error = validateField(field, value);
                if (error) {
                    step2Errors[field as keyof typeof step2Errors] = error;
                }
            }
        });

        if (!formData.bp) {
            step2Errors.bp = 'Business photo is required.';
        }

        setErrors(step2Errors);
        return Object.keys(step2Errors).length === 0;
    };

    const validateStep3 = () => {
        const step3Errors: { [key: string]: string } = {};
        const fieldsToValidate: (keyof typeof formData)[] = [
            'daysPerWeek', 'startTime', 'endTime', 'businessRegPic', 'cancellationPolicyPic'
        ];
        fieldsToValidate.forEach(field => {

            const value = formData[field as keyof FormData];
            if (typeof value === 'string' || typeof value === 'boolean') {
                const error = validateField(field, value);
                if (error) {
                    step3Errors[field as keyof typeof step3Errors] = error;
                }
            }
        });

        const startIndex = timeOptions.indexOf(formData.startTime);
        const endIndex = timeOptions.indexOf(formData.endTime);

        if (startIndex !== -1 && endIndex !== -1 && endIndex <= startIndex) {
            step3Errors['endTime'] = 'End time must be after start time.';
        }

        if (!formData.businessRegPic) {
            step3Errors.businessRegPic = 'This photo is required.';
        }
        if (!formData.cancellationPolicyPic) {
            step3Errors.cancellationPolicyPic = 'This photo is required.';
        }

        setErrors(step3Errors);
        return Object.keys(step3Errors).length === 0;
    };

    const validateStep4 = () => {
        const step4Errors: { [key: string]: string } = {};
        const fieldsToValidate: (keyof typeof formData)[] = [
            'nicpic', 'locpic', 'agreeTerms'
        ];
        if (formData.role !== 'user') {
            fieldsToValidate.push('confirmCondition');
        }
        fieldsToValidate.forEach(field => {

            const value = formData[field as keyof FormData];
            if (typeof value === 'string' || typeof value === 'boolean') {
                const error = validateField(field, value);
                if (error) {
                    step4Errors[field as keyof typeof step4Errors] = error;
                }
            }
        });

        if (!formData.nicpic) {
            step4Errors.nicpic = 'NIC photo is required.';
        }
        if (!formData.locpic) {
            step4Errors.locpic = 'Location is required.';
        }

        setErrors(step4Errors);
        return Object.keys(step4Errors).length === 0;
    };

    const nextStep = () => {
        let isStepValid = false;
        switch (step) {
            case 1: isStepValid = validateStep1(); break;
            case 2: isStepValid = formData.role === 'other' ? validateStep2() : true; break;
            case 3: isStepValid = formData.role === 'other' ? validateStep3() : true; break;
            case 4: isStepValid = validateStep4(); break;
            default: isStepValid = true; break;
        }

        // Prevent moving to the next step if email is taken
        if (step === 1 && emailCheckStatus === 'taken') {
            Alert.alert("Validation Error", "Please fix the email error before proceeding.");
            return;
        }

        if (!isStepValid) return;

        if (step === 1 && formData.role === 'user') {
            setStep(4);
        } else if ((step === 4 && formData.role === 'user') || step < steps.length) {
            setStep(step + 1);
        }
    };

    const prevStep = () => {
        if (step === 4 && formData.role === 'user') {
            setStep(1);
        } else if (step > 1) {
            setStep(step - 1);
        }
    };

    const handleSendOtp = async () => {
        // First, validate the current step to ensure all data is present
        if (!validateStep4()) return;

        // 1. Generate a 4-digit OTP
        const newOtp = Math.floor(1000 + Math.random() * 9000).toString();
        setGeneratedOtp({ code: newOtp, timestamp: Date.now() });
        // 2. Prepare the template parameters
        const templateParams = {
            to_name: formData.fullName,
            email: formData.email, // Make sure you collect the email
            otp_code: newOtp,
        };

        // 3. Send the email using EmailJS
        try {
            await emailjs.send(
                'service_ug7b6t5',      // 👈 Replace with your Service ID
                'template_ozobnan',     // 👈 Replace with your Template ID
                templateParams,
                'l0b_m5wGJi-b4JhDW'       // 👈 Replace with your Public Key
            );
            alert(`A verification code has been sent to ${formData.email}.`);
            setStep(5); // Move to the OTP verification screen
        } catch (error) {
            console.error('EmailJS Error:', error);
            Alert.alert('Error', 'Failed to send OTP. Please try again.');
        }
    };

    useEffect(() => {

        if (step === 5) {
            handleSendOtp();
        }
    }, [step]);

    const handleSubmit = async () => {

        const dur = 5 * 60 * 1000;
        const timeElapsed = Date.now() - generatedOtp.timestamp;

        if (timeElapsed > dur) {

            alert('OTP has expired')
            return;

        }

        if (otp !== generatedOtp.code) {

            alert('otp is wrong')
            return;

        }

        const isStep1Valid = validateStep1();
        const isStep2Valid = formData.role === 'other' ? validateStep2() : true;
        const isStep3Valid = formData.role === 'other' ? validateStep3() : true;
        const isStep4Valid = validateStep4();

        if (emailCheckStatus === 'taken') {
            Alert.alert("Validation Error", "The email is already registered. Please use a different email.");
            return;
        }



        //console.log(submit)
        if (formData.role == 'user' && isStep1Valid && isStep4Valid) {

            try {
                //to mobile
                /* var submit = {}
                const {
                    confirmCondition,
                    bp,
                    businessAddress,
                    businessName,
                    businessRegPic,
                    businessType,
                    cancellationPolicyPic,
                    confirmPassword,
                    daysPerWeek,
                    description,
                    endTime,
                    registrationNumber,
                    startTime,
                    ...payload
                } = formData;
                if (formData.pp && formData.pp.uri) { 
                    //console.log(formData.pp)

                     const pps = await FileSystem.readAsStringAsync(formData.pp.uri, {
                        encoding: FileSystem.EncodingType.Base64,
                    });
                    submit = { ...payload, status: 'active', pp: pps }
                }*/

                const dataToSend: any = { ...formData, status: 'active' };
                const imageFields: (keyof FormData)[] = ['pp'/* , 'bp', 'businessRegPic', 'cancellationPolicyPic'*/, 'nicpic', 'locpic'];

                for (const field of imageFields) {
                    const imageAsset = formData[field] as ImagePickerAsset | null;

                    // USE THIS LOGIC
                    // The 'base64' property is provided by the picker on all platforms
                    if (imageAsset && imageAsset.base64) {
                        dataToSend[field] = imageAsset.base64;
                    } else {
                        // Handle case where image might be in state but base64 is missing
                        dataToSend[field] = null;
                    }
                }

                const {
                    confirmCondition,
                    bp,
                    businessAddress,
                    businessName,
                    businessRegPic,
                    businessType,
                    cancellationPolicyPic,
                    confirmPassword,
                    daysPerWeek,
                    description,
                    endTime,
                    registrationNumber,
                    startTime,
                    ...payload
                } = dataToSend;

                await fetch('http://localhost:8080/user/signup', {

                    method: 'POST',
                    body: JSON.stringify(payload),
                    headers: { 'Content-Type': 'application/json' }

                })
                    .then(res => res.text())
                    .then(data => { if (data == "Success") { router.replace('/(auth)'); } else { alert('An error occurs, Try again later..') } })
                    .catch(err => alert(`${err}`))


            }/* else {
                alert("Validation Error Please fill all required fields correctly.");
            } */

            catch (err) {
                console.log(err)
            }
        }
        if (formData.role != 'user' && isStep1Valid && isStep2Valid && isStep3Valid && isStep4Valid) {

            try {


                const dataToSend: any = { ...formData, status: 'pending', role: formData.businessType };
                const imageFields: (keyof FormData)[] = ['pp', 'bp', 'businessRegPic', 'cancellationPolicyPic', 'nicpic', 'locpic'];

                for (const field of imageFields) {
                    const imageAsset = formData[field] as ImagePickerAsset | null;

                    // USE THIS LOGIC
                    // The 'base64' property is provided by the picker on all platforms
                    if (imageAsset && imageAsset.base64) {
                        dataToSend[field] = imageAsset.base64;
                    } else {
                        // Handle case where image might be in state but base64 is missing
                        dataToSend[field] = null;
                    }
                }

                const { businessType, confirmPassword, ...payload } = dataToSend

                await fetch('http://localhost:8080/user/signup', {

                    method: 'POST',
                    body: JSON.stringify(payload),
                    headers: { 'Content-Type': 'application/json' }

                })
                    .then(res => res.text())
                    .then(data => { if (data == "Success") { router.replace('/(auth)'); } else { alert('An error occurs, Try again later..') } })
                    .catch(err => alert(`${err}`))


            }/* else {
                alert("Validation Error Please fill all required fields correctly.");
            } */

            catch (err) {
                console.log(err)
            }
        }
    };

    const renderStepContent = () => {
        const selectedCountry = countries.find(c => c.value === formData.country);
        return (
            <View>
                {step === 1 && (
                    <View>
                        <TouchableOpacity onPress={() => router.back()} className='bg-black border-2 w-14 py-1 px-1  rounded-lg'>
                            <Text className='text-white'> Back</Text>
                        </TouchableOpacity>
                        <View className="items-center w-full my-10">
                            {/* <TextInput placeholder="URL for owner photo" className="w-full text-black border border-gray-300 rounded-lg p-3" value={formData.pp} onChangeText={v => handleChange('pp', v)} /> */}
                            <TouchableOpacity
                                onPress={() => { handleChoosePhoto('pp') }}
                                className={`w-56 h-56 rounded-full bg-gray-100 justify-center items-center ${formData.pp == null ? 'border-2 border-dashed border-gray-300' : ''}`}
                            >
                                {formData.pp ? (
                                    <Image
                                        source={{ uri: formData.pp.uri }}
                                        className="w-full h-full rounded-full border-2 border-gray-100"
                                        resizeMode="cover"

                                    />
                                ) : (
                                    <Image
                                        source={plusIcon}
                                        className="w-16 h-16 opacity-50"
                                        resizeMode="contain"
                                    />
                                )}
                            </TouchableOpacity>
                            <Text className="text-base text-gray-600 mt-2">Add Owner's Photo</Text>
                            <Text className={`text-red-500 text-sm mt-1 ${errors.pp ? 'opacity-100' : 'opacity-0'}`}>{errors.pp || ' '}</Text>
                        </View>
                        <View className="mb-4">
                            <Text className="mb-1 font-semibold text-base">Full Name</Text>
                            <TextInput className="w-full text-black border border-gray-300 rounded-lg p-3" value={formData.fullName} onChangeText={v => handleChange('fullName', v)} />
                            <Text className={`text-red-500 text-sm mt-1 ${errors.fullName ? 'opacity-100' : 'opacity-0'}`}>{errors.fullName || ' '}</Text>
                        </View>
                        <View className="mb-4">
                            <Text className="mb-1 font-semibold text-base">Date of Birth</Text>
                            <TextInput className="w-full text-black border border-gray-300 rounded-lg p-3" placeholder="YYYY-MM-DD" maxLength={10} value={formData.dob} onChangeText={v => handleChange('dob', v)} />
                            <Text className={`text-red-500 text-sm mt-1 ${errors.dob ? 'opacity-100' : 'opacity-0'}`}>{errors.dob || ' '}</Text>
                        </View>
                        <View className="mb-4">
                            <Text className="mb-1 font-semibold text-base text-black">Gender</Text>
                            <View className="border border-gray-300 rounded-lg">
                                <Picker selectedValue={formData.gender} onValueChange={v => handleChange('gender', v as string)}>
                                    <Picker.Item label="Select Gender..." value="" />
                                    <Picker.Item label="Male" value="male" />
                                    <Picker.Item label="Female" value="female" />
                                </Picker>
                            </View>
                            <Text className={`text-red-500 text-sm mt-1 ${errors.gender ? 'opacity-100' : 'opacity-0'}`}>{errors.gender || ' '}</Text>
                        </View>
                        <View className="mb-4">
                            <Text className="mb-1 font-semibold text-base text-black">Country</Text>
                            <View className="border border-gray-300 rounded-lg">
                                <Picker selectedValue={formData.country} onValueChange={v => handleChange('country', v as string)}>
                                    {countries.map(c => <Picker.Item key={c.value} label={c.label} value={c.value} />)}
                                </Picker>
                            </View>
                            <Text className={`text-red-500 text-sm mt-1 ${errors.country ? 'opacity-100' : 'opacity-0'}`}>{errors.country || ' '}</Text>
                        </View>
                        <View className="mb-4">
                            <Text className="mb-1 font-semibold text-base">Mobile Number</Text>
                            <View className="flex-row items-center border border-gray-300 rounded-lg px-3">
                                <Text className="text-base text-gray-800 mr-2">{selectedCountry?.phoneCode || '+'}</Text>
                                <View className="w-px h-6 bg-gray-300 mr-3" />
                                <TextInput className="flex-1 text-base text-black py-3" placeholder="771234567" value={formData.mobileNumber} onChangeText={v => handleChange('mobileNumber', v)} keyboardType="number-pad" />
                            </View>
                            <Text className={`text-red-500 text-sm mt-1 ${errors.mobileNumber ? 'opacity-100' : 'opacity-0'}`}>{errors.mobileNumber || ' '}</Text>
                        </View>
                        <View className="mb-4">
                            <Text className="mb-1 font-semibold text-base">WhatsApp Number</Text>
                            <TextInput className="w-full text-black border border-gray-300 rounded-lg p-3" value={formData.whatsappNumber} onChangeText={v => handleChange('whatsappNumber', v)} keyboardType="number-pad" />
                            <Text className={`text-red-500 text-sm mt-1 ${errors.whatsappNumber ? 'opacity-100' : 'opacity-0'}`}>{errors.whatsappNumber || ' '}</Text>
                        </View>
                        <View className="mb-4">
                            <Text className="mb-1 font-semibold text-base">Email</Text>
                            <TextInput
                                className="w-full text-black border border-gray-300 rounded-lg p-3"
                                value={formData.email}
                                onChangeText={v => handleChange('email', v)}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                onBlur={() => { // Trigger check on blur if not already checking or taken
                                    if (emailCheckStatus === 'idle' || emailCheckStatus === 'available') {
                                        checkEmailAvailability(formData.email);
                                    }
                                }}
                            />
                            <Text className={`text-red-500 text-sm mt-1 ${errors.email ? 'opacity-100' : 'opacity-0'}`}>
                                {errors.email || (emailCheckStatus === 'checking' ? 'Checking email availability...' : '')}
                                {emailCheckStatus === 'available' && !errors.email ? 'Email is available.' : ''}
                                {emailCheckStatus === 'taken' && !errors.email ? 'This email is already registered.' : ''}
                                {' '}
                            </Text>
                        </View>
                        <View className="mb-4">
                            <Text className="mb-1 font-semibold text-base">Username</Text>
                            <TextInput className="w-full text-black border border-gray-300 rounded-lg p-3" value={formData.username} onChangeText={v => handleChange('username', v)} autoCapitalize="none" />
                            <Text className={`text-red-500 text-sm mt-1 ${errors.username ? 'opacity-100' : 'opacity-0'}`}>{errors.username || ' '}</Text>
                        </View>
                        <View className="mb-4">
                            <Text className="mb-1 font-semibold text-base">Current Address</Text>
                            <TextInput className="w-full text-black border border-gray-300 rounded-lg p-3" value={formData.address} onChangeText={v => handleChange('address', v)} />
                            <Text className={`text-red-500 text-sm mt-1 ${errors.address ? 'opacity-100' : 'opacity-0'}`}>{errors.address || ' '}</Text>
                        </View>
                        <View className="mb-4">
                            <Text className="mb-1 font-semibold text-base">NIC / Passport Number</Text>
                            <TextInput className="w-full text-black border border-gray-300 rounded-lg p-3" value={formData.nicPassport} onChangeText={v => handleChange('nicPassport', v)} />
                            <Text className={`text-red-500 text-sm mt-1 ${errors.nicPassport ? 'opacity-100' : 'opacity-0'}`}>{errors.nicPassport || ' '}</Text>
                        </View>
                        <View className="mb-4">
                            <Text className="mb-1 font-semibold text-base">Password</Text>
                            <View className="flex-row items-center border border-gray-300 rounded-lg">
                                <TextInput className="px-3 flex-1 text-base py-3" value={formData.password} onChangeText={v => handleChange('password', v)} secureTextEntry={!isPasswordVisible} />
                                <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)} className='px-3'><Text className="font-semibold text-blue-500">{isPasswordVisible ? 'Hide' : 'Show'}</Text></TouchableOpacity>
                            </View>
                            <Text className={`text-red-500 text-sm mt-1 ${errors.password ? 'opacity-100' : 'opacity-0'}`}>{errors.password || ' '}</Text>
                        </View>
                        <View className="mb-4">
                            <Text className="mb-1 font-semibold text-base">Confirm Password</Text>
                            <View className="flex-row items-center border border-gray-300 rounded-lg">
                                <TextInput className="px-3 flex-1 text-base py-3" value={formData.confirmPassword} onChangeText={v => handleChange('confirmPassword', v)} secureTextEntry={!isConfirmPasswordVisible} />
                                <TouchableOpacity onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)} className='px-3'><Text className="font-semibold text-blue-500">{isConfirmPasswordVisible ? 'Hide' : 'Show'}</Text></TouchableOpacity>
                            </View>
                            <Text className={`text-red-500 text-sm mt-1 ${errors.confirmPassword ? 'opacity-100' : 'opacity-0'}`}>{errors.confirmPassword || ' '}</Text>
                        </View>
                        <View className="mb-4">
                            <Text className="mb-1 font-semibold text-base text-black">Register As</Text>
                            <View className="border border-gray-300 rounded-lg">
                                <Picker selectedValue={formData.role} onValueChange={v => handleChange('role', v as string)}>
                                    <Picker.Item label="Select Role..." value="" />
                                    <Picker.Item label="Traveler" value="user" />
                                    <Picker.Item label="Other" value="other" />
                                </Picker>
                            </View>
                            <Text className={`text-red-500 text-sm mt-1 ${errors.role ? 'opacity-100' : 'opacity-0'}`}>{errors.role || ' '}</Text>
                        </View>
                    </View>
                )}

                {step === 2 && (
                    <View>
                        <View className="items-center w-full my-7">
                            {/* <TextInput placeholder="URL for business item photo" className="w-full text-black border border-gray-300 rounded-lg p-3" value={formData.bp} onChangeText={v => handleChange('bp', v)} /> */}
                            <TouchableOpacity
                                onPress={() => { handleChoosePhoto('bp') }}
                                className={`w-[98%] h-44 rounded-lg bg-gray-100 justify-center items-center ${formData.bp == null ? 'border-2 border-dashed border-gray-300' : ''}`}
                            >
                                {formData.bp ? (
                                    <Image
                                        source={{ uri: formData.bp.uri }}
                                        className="w-full h-full rounded-lg border-2 border-gray-100"
                                        resizeMode="cover"

                                    />
                                ) : (
                                    <Image
                                        source={plusIcon}
                                        className="w-16 h-16 opacity-50"
                                        resizeMode="contain"
                                    />
                                )}
                            </TouchableOpacity>
                            <Text className={`text-red-500 text-sm mt-1 ${errors.bp ? 'opacity-100' : 'opacity-0'}`}>{errors.bp || ' '}</Text>
                            <Text className="text-base text-gray-600 mt-2">Business Photo</Text>
                        </View>
                        <View className="mb-4">
                            <Text className="mb-1 font-semibold text-base">Business Name</Text>
                            <TextInput className="w-full text-black border border-gray-300 rounded-lg p-3" value={formData.businessName} onChangeText={v => handleChange('businessName', v)} />
                            <Text className={`text-red-500 text-sm mt-1 ${errors.businessName ? 'opacity-100' : 'opacity-0'}`}>{errors.businessName || ' '}</Text>
                        </View>
                        <View className="mb-4">
                            <Text className="mb-1 font-semibold text-base">Registration Number</Text>
                            <TextInput className="w-full text-black border border-gray-300 rounded-lg p-3" value={formData.registrationNumber} onChangeText={v => handleChange('registrationNumber', v)} />
                            <Text className={`text-red-500 text-sm mt-1 ${errors.registrationNumber ? 'opacity-100' : 'opacity-0'}`}>{errors.registrationNumber || ' '}</Text>
                        </View>
                        <View className="mb-4">
                            <Text className="mb-1 font-semibold text-base">Business Type</Text>
                            <View className="border border-gray-300 rounded-lg">
                                <Picker selectedValue={formData.businessType} onValueChange={v => handleChange('businessType', v as string)}>
                                    <Picker.Item label="Select Type..." value="" />
                                    <Picker.Item label="Guiding" value="guide" />
                                    <Picker.Item label="Vehicle Renting" value="vehicle renter" />
                                    <Picker.Item label="Equipment Renting" value="equipment rental" />
                                </Picker>
                            </View>
                            <Text className={`text-red-500 text-sm mt-1 ${errors.businessType ? 'opacity-100' : 'opacity-0'}`}>{errors.businessType || ' '}</Text>
                        </View>
                        <View className="mb-4">
                            <Text className="mb-1 font-semibold text-base">Description</Text>
                            <TextInput className="w-full text-black border border-gray-300 rounded-lg p-3 h-24" multiline value={formData.description} onChangeText={v => handleChange('description', v)} />
                            <Text className={`text-red-500 text-sm mt-1 ${errors.description ? 'opacity-100' : 'opacity-0'}`}>{errors.description || ' '}</Text>
                        </View>
                        <View className="mb-8">
                            <Text className="mb-1 font-semibold text-base">Business Address</Text>
                            <TextInput className="w-full text-black border border-gray-300 rounded-lg p-3" value={formData.businessAddress} onChangeText={v => handleChange('businessAddress', v)} />
                            <Text className={`text-red-500 text-sm mt-1 ${errors.businessAddress ? 'opacity-100' : 'opacity-0'}`}>{errors.businessAddress || ' '}</Text>
                        </View>
                    </View>
                )}

                {step === 3 && (
                    <View>
                        <View className="mb-4 pt-10">
                            <Text className="mb-1 font-semibold text-base">🗓️ Days Available (Max 7)</Text>
                            <TextInput
                                className="w-full text-black border border-gray-300 rounded-lg p-3"
                                placeholder="e.g., 2"
                                keyboardType="numeric"
                                maxLength={1}
                                value={formData.daysPerWeek}
                                onChangeText={v => handleChange('daysPerWeek', v)}
                            />
                            <Text className={`text-red-500 text-sm mt-1 ${errors.daysPerWeek ? 'opacity-100' : 'opacity-0'}`}>{errors.daysPerWeek || ' '}</Text>
                        </View>
                        <View className="mb-4">
                            <Text className="mb-1 font-semibold text-base">⏰ Time Slot</Text>
                            <View className="flex-row justify-between">
                                <View className="w-[48%]">
                                    <Text className="text-sm text-gray-500">Start Time</Text>
                                    <View className="border border-gray-300 rounded-lg">
                                        <Picker numberOfLines={5} selectedValue={formData.startTime} onValueChange={(itemValue) => handleChange('startTime', itemValue)}>
                                            <Picker.Item label="Select..." value="" />
                                            {timeOptions.map((time, index) => (<Picker.Item key={index} label={time} value={time} />))}
                                        </Picker>
                                    </View>
                                    <Text className={`text-red-500 text-sm mt-1 ${errors.startTime ? 'opacity-100' : 'opacity-0'}`}>{errors.startTime || ' '}</Text>
                                </View>
                                <View className="w-[48%]">
                                    <Text className="text-sm text-gray-500">End Time</Text>
                                    <View className="border border-gray-300 rounded-lg">
                                        <Picker itemStyle={{ height: 120 }} selectedValue={formData.endTime} onValueChange={(itemValue) => handleChange('endTime', itemValue)}>
                                            <Picker.Item label="Select..." value="" />
                                            {timeOptions.map((time, index) => (<Picker.Item key={index} label={time} value={time} />))}
                                        </Picker>
                                    </View>
                                    <Text className={`text-red-500 text-sm mt-1 ${errors.endTime ? 'opacity-100' : 'opacity-0'}`}>{errors.endTime || ' '}</Text>
                                </View>
                            </View>
                        </View>
                        <View className="items-center w-full my-8">
                            <Text className="w-full mb-1 font-semibold text-base">Business Registration Certificate</Text>
                            {/* <TextInput placeholder="URL for registration certificate" className="w-full text-black border border-gray-300 rounded-lg p-3" value={formData.businessRegPic} onChangeText={v => handleChange('businessRegPic', v)} /> */}
                            <TouchableOpacity
                                onPress={() => { handleChoosePhoto('businessRegPic') }}
                                className={`w-[98%] h-44 rounded-lg bg-gray-100 justify-center items-center ${formData.businessRegPic == null ? 'border-2 border-dashed border-gray-300' : ''}`}
                            >
                                {formData.businessRegPic ? (
                                    <Image
                                        source={{ uri: formData.businessRegPic.uri }}
                                        className="w-full h-full rounded-lg border-2 border-gray-100"
                                        resizeMode="cover"

                                    />
                                ) : (
                                    <Image
                                        source={plusIcon}
                                        className="w-16 h-16 opacity-50"
                                        resizeMode="contain"
                                    />
                                )}
                            </TouchableOpacity>
                            <Text className={`text-red-500 text-sm mt-1 w-full ${errors.businessRegPic ? 'opacity-100' : 'opacity-0'}`}>{errors.businessRegPic || ' '}</Text>
                        </View>
                        <View className="items-center w-full my-8">
                            <Text className="w-full mb-1 font-semibold text-base">Cancellation Policy</Text>
                            {/* <TextInput placeholder="URL for cancellation policy" className="w-full text-black border border-gray-300 rounded-lg p-3" value={formData.cancellationPolicyPic} onChangeText={v => handleChange('cancellationPolicyPic', v)} /> */}
                            <TouchableOpacity
                                onPress={() => { handleChoosePhoto('cancellationPolicyPic') }}
                                className={`w-[98%] h-44 rounded-lg bg-gray-100 justify-center items-center ${formData.cancellationPolicyPic == null ? 'border-2 border-dashed border-gray-300' : ''}`}
                            >
                                {formData.cancellationPolicyPic ? (
                                    <Image
                                        source={{ uri: formData.cancellationPolicyPic.uri }}
                                        className="w-full h-full rounded-lg border-2 border-gray-100"
                                        resizeMode="cover"

                                    />
                                ) : (
                                    <Image
                                        source={plusIcon}
                                        className="w-16 h-16 opacity-50"
                                        resizeMode="contain"
                                    />
                                )}
                            </TouchableOpacity>
                            <Text className={`text-red-500 text-sm mt-1 w-full ${errors.cancellationPolicyPic ? 'opacity-100' : 'opacity-0'}`}>{errors.cancellationPolicyPic || ' '}</Text>
                        </View>
                    </View>
                )}

                {step === 4 && (
                    <View>
                        <View className="items-center w-full my-10">
                            {/* <TextInput placeholder="URL for National ID" className="w-full text-black border border-gray-300 rounded-lg p-3" value={formData.nicpic} onChangeText={v => handleChange('nicpic', v)} /> */}
                            <TouchableOpacity
                                onPress={() => { handleChoosePhoto('nicpic') }}
                                className={`w-[98%] h-44 bg-gray-100 justify-center items-center ${formData.nicpic == null ? 'border-2 border-dashed border-gray-300' : ''}`}
                            >
                                {formData.nicpic ? (
                                    <Image
                                        source={{ uri: formData.nicpic.uri }}
                                        className="w-full h-full border-2 border-gray-100"
                                        resizeMode="cover"

                                    />
                                ) : (
                                    <Image
                                        source={plusIcon}
                                        className="w-16 h-16 opacity-50"
                                        resizeMode="contain"
                                    />
                                )}
                            </TouchableOpacity>
                            <Text className={`text-red-500 text-sm mt-1 ${errors.nicpic ? 'opacity-100' : 'opacity-0'}`}>{errors.nicpic || ' '}</Text>
                            <Text className="text-base text-gray-600 mt-2">National Identity Card</Text>
                        </View>
                        <View className="items-center w-full my-8">
                            {/* <TextInput placeholder="URL for map location" className="w-full text-black border border-gray-300 rounded-lg p-3" value={formData.locpic} onChangeText={v => handleChange('locpic', v)} /> */}
                            <TouchableOpacity
                                onPress={() => { handleChoosePhoto('locpic') }}
                                className={`w-[98%] h-44 bg-gray-100 justify-center items-center ${formData.locpic == null ? 'border-2 border-dashed border-gray-300' : ''}`}
                            >
                                {formData.locpic ? (
                                    <Image
                                        source={{ uri: formData.locpic.uri }}
                                        className="w-full h-full border-2 border-gray-100"
                                        resizeMode="cover"

                                    />
                                ) : (
                                    <Image
                                        source={plusIcon}
                                        className="w-16 h-16 opacity-50"
                                        resizeMode="contain"
                                    />
                                )}
                            </TouchableOpacity>
                            <Text className={`text-red-500 text-sm mt-1 ${errors.locpic ? 'opacity-100' : 'opacity-0'}`}>{errors.locpic || ' '}</Text>
                            <Text className="text-base text-gray-600 mt-2 mb-8">Location On Map</Text>
                        </View>
                        <View className="my-10">
                            <View className='flex-row items-center mb-5'>
                                <TouchableOpacity onPress={() => handleChange('agreeTerms', !formData.agreeTerms)}>
                                    <View className={`w-6 h-6 border-2 rounded mr-3 justify-center items-center ${formData.agreeTerms ? 'bg-[#FEFA17]' : 'border-gray-400'}`}>
                                        {formData.agreeTerms && <Text className="text-black font-extrabold text-center">✓</Text>}
                                    </View>
                                </TouchableOpacity>
                                <Text className="text-base text-gray-700 flex-1 font-bold">I agree to the terms and conditions</Text>
                            </View>
                            {formData.role !== 'user' && (
                                <>
                                    <View className='flex-row items-center mb-4'>
                                        <TouchableOpacity onPress={() => handleChange('confirmCondition', !formData.confirmCondition)}>
                                            <View className={`w-6 h-6 border-2 rounded mr-3 justify-center items-center ${formData.confirmCondition ? 'bg-[#FEFA17]' : 'border-gray-400'}`}>
                                                {formData.confirmCondition && <Text className="text-black font-extrabold text-center">✓</Text>}
                                            </View>
                                        </TouchableOpacity>
                                        <Text className="text-base text-gray-700 flex-1 font-bold">I confirm all items are in safe condition</Text>
                                    </View>
                                </>
                            )}
                        </View>
                        <Text className={`text-red-500 text-sm -mt-4 mb-4 ${errors.agreeTerms ? 'opacity-100' : 'opacity-0'}`}>{errors.agreeTerms || ' '}</Text>
                        <Text className={`text-red-500 text-sm -mt-4 mb-4 ${errors.confirmCondition && formData.role != 'user' ? 'opacity-100' : 'opacity-0'}`}>{errors.confirmCondition || ' '}</Text>
                    </View>
                )}
                {step === 5 && (
                    <View className='flex-1'>
                        <View className="flex-1 justify-between items-center my-10 w-full">
                            <View className="items-center mb-20">
                                <View className="w-48 h-48 rounded-full my-5 bg-gray-100 justify-center items-center border-2 border-gray-200">
                                    <Image
                                        source={otpIcon}
                                        className="w-24 h-24"
                                        resizeMode="contain"
                                        tintColor="#333"
                                    />
                                </View>
                                <Text className="text-3xl font-bold mt-4 text-gray-800">Enter OTP</Text>
                                <Text className="text-base text-gray-500 mt-2 text-center px-4">
                                    A 4-digit code was sent to {'\n'}
                                    <Text className="font-bold text-gray-700">{formData.email}</Text>
                                </Text>
                            </View>
                            <View className="w-full my-10">
                                <Text className="mb-1 font-semibold text-base text-gray-700">Verification Code</Text>
                                <TextInput
                                    className="text-black border border-gray-300 rounded-lg p-4 text-2xl text-center tracking-widest"
                                    value={otp}
                                    onChangeText={setOtp}
                                    keyboardType="numeric"
                                    maxLength={4}
                                />
                                <TouchableOpacity
                                    className="bg-[#FEFA17] py-4 px-6 rounded-lg mt-6 items-center"
                                    onPress={handleSubmit}
                                >
                                    <Text className="font-bold text-lg text-gray-800">Verify Code</Text>
                                </TouchableOpacity>
                            </View>
                            <View className="mt-14 flex-row justify-center items-center">
                                <Text className="text-base text-gray-500">Didn't receive the code?</Text>
                                <TouchableOpacity onPress={() => Alert.alert("Resending OTP...")} className="py-2 ml-1">
                                    <Text className="font-semibold text-blue-500 text-base">Resend</Text>
                                </TouchableOpacity>
                            </View>
                            {/* <TouchableOpacity onPress={() => setStep(1)} className="py-2 mt-2">
                                <Text className="text-center font-semibold text-gray-500 text-base">
                                    ← Back to enter email
                                </Text>
                            </TouchableOpacity> */}
                        </View>
                    </View>
                )}
            </View>
        );
    };

    return (
        <SafeAreaView className="flex-1 p-5 bg-white">
            <View className="flex-row items-center justify-between">
                <Text className="text-2xl font-bold">{steps[step - 1].title}</Text>
            </View>
            <ScrollView
                className="flex-1 mt-5"
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                {renderStepContent()}
                {step != 5 && <View className="flex-row justify-between mt-6 mb-4">
                    {step > 1 ? (
                        <TouchableOpacity className="bg-gray-300 py-3 px-8 rounded-lg" onPress={prevStep}>
                            <Text className="font-semibold text-gray-800">Previous</Text>
                        </TouchableOpacity>
                    ) : <View />}

                    {step < steps.length - 1 ? (
                        <TouchableOpacity className="bg-[#FEFA17] py-3 px-8 rounded-lg" onPress={nextStep}>
                            <Text className="font-semibold text-gray-800">Next</Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity className="bg-blue-500 py-3 px-8 rounded-lg" onPress={nextStep}>
                            <Text className="font-semibold text-white">Submit</Text>
                        </TouchableOpacity>
                    )}
                </View>}
            </ScrollView>
        </SafeAreaView>
    );
}