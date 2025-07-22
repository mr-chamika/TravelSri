import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import emailjs from '@emailjs/browser';


// You can use appropriate icons for your app
const lockIcon = require('../../assets/images/lock.png');
const otpIcon = require('../../assets/images/otp.png');
const newPasswordIcon = require('../../assets/images/newpassword.png'); // Add a suitable icon

export default function ForgotPassword() {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [generatedOtp, setGeneratedOtp] = useState({ code: '', timestamp: 0 });
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [emailCheckStatus, setEmailCheckStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    // --- 1. CORRECTED VALIDATION FUNCTION ---
    // It now accepts a field name and can validate passwords.
    const validateField = (field: string, value: string, secondValue?: string) => {
        let error = '';
        if (typeof value === 'string' && !value.trim()) {
            error = 'This field is required.';
        } else if (field === 'email' && !/\S+@\S+\.\S+/.test(value)) {
            error = 'Please enter a valid email address.';
        } else if (field === 'newPassword' && value.length < 8) {
            error = 'Password must be at least 8 characters long.';
        } else if (field === 'confirmPassword' && value !== secondValue) {
            error = 'Passwords do not match.';
        }
        return error;
    };

    // --- 2. SPECIFIC HANDLERS (REPLACING THE OLD `handleChange`) ---
    const handleEmailChange = (text: string) => {
        setEmail(text);
        const error = validateField('email', text);
        setErrors(prev => ({ ...prev, email: error }));
        if (error) {
            setEmailCheckStatus('idle');
        }
    };

    const handleNewPasswordChange = (text: string) => {
        setNewPassword(text);
        const error = validateField('newPassword', text);
        setErrors(prev => ({ ...prev, newPassword: error }));
        // Also re-validate the confirm password field if it has text
        if (confirmPassword) {
            const confirmError = validateField('confirmPassword', confirmPassword, text);
            setErrors(prev => ({ ...prev, confirmPassword: confirmError }));
        }
    };

    const handleConfirmPasswordChange = (text: string) => {
        setConfirmPassword(text);
        const error = validateField('confirmPassword', text, newPassword);
        setErrors(prev => ({ ...prev, confirmPassword: error }));
    };


    const checkEmailAvailability = async () => {
        // Validate email format before checking availability
        const emailError = validateField('email', email);
        if (emailError) {
            setErrors(prev => ({ ...prev, email: emailError }));
            return;
        }

        setEmailCheckStatus('checking');
        try {
            const response = await fetch(`http://localhost:8080/user/check-email?email=${email}`);
            const data = await response.text();
            if (data === "Exists") {
                setEmailCheckStatus('taken');
                setErrors(prev => ({ ...prev, email: '' })); // Clear format error, if any
                return true; // Email exists, proceed
            } else {
                setEmailCheckStatus('available');
                setErrors(prev => ({ ...prev, email: 'This email is not registered.' }));
                return false; // Email doesn't exist
            }
        } catch (error) {
            console.error('Error checking email availability:', error);
            setEmailCheckStatus('idle');
            setErrors(prev => ({ ...prev, email: 'Could not check email. Please try again.' }));
            return false;
        }
    };


    const handleSendOtp = async () => {
        const emailExists = await checkEmailAvailability();
        if (!emailExists) {
            return;
        }

        const newOtp = Math.floor(1000 + Math.random() * 9000).toString();
        setGeneratedOtp({ code: newOtp, timestamp: Date.now() });

        const templateParams = { email: email, otp_code: newOtp };

        try {
            await emailjs.send(
                'service_h0e38l2',      // 👈 Replace with your Service ID
                'template_crl1nc9',     // 👈 Replace with your Template ID
                templateParams,
                {

                    publicKey: 'Xav8YamG7K9e8q0nD'       // 👈 Replace with your Public Key
                }
            );
            Alert.alert('OTP Sent', `A 4-digit code has been sent to ${email}.`);
            setStep(2);
        } catch (error) {
            console.error('EmailJS Error:', error);
            Alert.alert('Error', 'Failed to send OTP. Please try again.');
        }
    };

    const handleVerifyOtp = () => {
        if (otp.length !== 4) {
            Alert.alert('Error', 'Please enter the 4-digit OTP.');
            return;
        }
        const tenMinutes = 10 * 60 * 1000;
        if (Date.now() - generatedOtp.timestamp > tenMinutes) {
            Alert.alert('Expired', 'The OTP has expired. Please request a new one.');
            setStep(1);
            return;
        }
        if (otp !== generatedOtp.code) {
            Alert.alert('Error', 'The entered OTP is incorrect.');
            return;
        }
        setStep(3);
    };

    const handleSetNewPassword = async () => {
        const newPasswordError = validateField('newPassword', newPassword);
        const confirmPasswordError = validateField('confirmPassword', confirmPassword, newPassword);

        if (newPasswordError || confirmPasswordError) {
            setErrors({ newPassword: newPasswordError, confirmPassword: confirmPasswordError });
            Alert.alert('Error', 'Please fix the errors before proceeding.');
            return;
        }

        try {

            const response = await fetch('http://localhost:8080/user/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password: newPassword }),
            });

            const data = await response.text()

            if (data == "Success") {

                console.log('Setting new password for email:', email);
                alert('Your password has been reset successfully.');
                router.replace('/(auth)')

            } else {

                alert(`Error reset password : ${data}`)

            }


        } catch (err) {
            Alert.alert('Error', 'An error occurred while resetting your password.');
        }
    };

    const renderStepContent = () => {
        switch (step) {
            case 1:
                return (
                    <View className='flex-1'>
                        <TouchableOpacity onPress={() => router.back()} className='bg-black w-16 px-3 py-1 rounded-lg mb-16'>
                            <Text className='text-white'> Back</Text>
                        </TouchableOpacity>
                        <View className="flex-1 justify-between">
                            <View className="items-center mb-10">
                                <View className="w-24 h-24 rounded-full bg-gray-100 justify-center items-center border-2 border-gray-200">
                                    <Image source={lockIcon} className="w-12 h-12" resizeMode="contain" tintColor="#333" />
                                </View>
                                <Text className="text-3xl font-bold mt-4 text-gray-800">Forgot Password?</Text>
                                <Text className="text-base text-gray-500 mt-2 text-center px-4">
                                    Enter your registered email below to receive a password reset code.
                                </Text>
                            </View>
                            <View className="w-full">
                                <Text className="mb-1 font-semibold text-base text-gray-700">Email Address</Text>
                                <TextInput
                                    className="w-full text-black border border-gray-300 rounded-lg p-3"
                                    value={email}
                                    onChangeText={handleEmailChange}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    onBlur={() => checkEmailAvailability()}
                                />
                                <Text className={`mt-1 ${errors.email ? 'text-red-500' : 'text-green-600'}`}>
                                    {errors.email || (emailCheckStatus === 'taken' ? 'Email is registered.' : ' ')}
                                </Text>
                                <TouchableOpacity
                                    className="bg-[#FEFA17] py-4 px-6 rounded-lg mt-6 items-center"
                                    onPress={handleSendOtp}
                                >
                                    <Text className="font-bold text-lg text-gray-800">Send Code</Text>
                                </TouchableOpacity>
                            </View>
                            <View className="mt-8">
                                <TouchableOpacity onPress={() => router.back()} className="py-2">
                                    <Text className="text-center font-semibold text-blue-500 text-base">
                                        ← Back to Login
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                );
            case 2:
                return (
                    <View className="flex-1 justify-between py-10">
                        <View className="items-center mb-10">
                            <View className="w-24 h-24 rounded-full bg-gray-100 justify-center items-center border-2 border-gray-200">
                                <Image source={otpIcon} className="w-12 h-12" resizeMode="contain" tintColor="#333" />
                            </View>
                            <Text className="text-3xl font-bold mt-4 text-gray-800">Enter OTP</Text>
                            <Text className="text-base text-gray-500 mt-2 text-center px-4">
                                A 4-digit code was sent to {'\n'}
                                <Text className="font-bold text-gray-700">{email}</Text>
                            </Text>
                        </View>
                        <View className="w-full">
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
                                onPress={handleVerifyOtp}
                            >
                                <Text className="font-bold text-lg text-gray-800">Verify Code</Text>
                            </TouchableOpacity>
                        </View>
                        <View className="mt-8 flex-row justify-center items-center">
                            <Text className="text-base text-gray-500">Didn't receive the code?</Text>
                            <TouchableOpacity onPress={handleSendOtp} className="py-2 ml-1">
                                <Text className="font-semibold text-blue-500 text-base">Resend</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                );
            case 3:
                return (
                    <View className="flex-1 justify-evenly">
                        <View className="items-center">
                            <View className="w-24 h-24 rounded-full bg-gray-100 justify-center items-center border-2 border-gray-200">
                                <Image source={newPasswordIcon} className="w-12 h-12" resizeMode="contain" tintColor="#333" />
                            </View>
                            <Text className="text-3xl font-bold mt-4 text-gray-800">Set New Password</Text>
                            <Text className="text-base text-gray-500 mt-2 text-center px-4">
                                Your new password must be different from previous ones.
                            </Text>
                        </View>
                        <View className="w-full">
                            <Text className="mb-1 font-semibold text-base text-gray-700">New Password</Text>
                            <View className="flex-row items-center border border-gray-300 rounded-lg py-1 px-3 mb-4">
                                <TextInput
                                    className="text-black flex-1 text-base h-12"
                                    placeholder="Enter new password"
                                    value={newPassword}
                                    onChangeText={handleNewPasswordChange}
                                    secureTextEntry={!isPasswordVisible}
                                />
                                <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
                                    <Text className="font-semibold text-blue-500">{isPasswordVisible ? 'Hide' : 'Show'}</Text>
                                </TouchableOpacity>
                            </View>
                            {errors.newPassword && <Text className="text-red-500 -mt-2 mb-2">{errors.newPassword}</Text>}

                            <Text className="mb-1 font-semibold text-base text-gray-700">Confirm New Password</Text>
                            <TextInput
                                className="text-black border border-gray-300 rounded-lg p-4 text-base"
                                placeholder="Confirm new password"
                                value={confirmPassword}
                                onChangeText={handleConfirmPasswordChange}
                                secureTextEntry={!isPasswordVisible}
                            />
                            {errors.confirmPassword && <Text className="text-red-500 mt-1">{errors.confirmPassword}</Text>}

                            <TouchableOpacity
                                className="bg-[#FEFA17] py-4 px-6 rounded-lg mt-6 items-center"
                                onPress={handleSetNewPassword}
                            >
                                <Text className="font-bold text-lg text-gray-800">Reset Password</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                );
            default:
                return null;
        }
    };

    return (
        <SafeAreaView edges={["bottom", "top"]} className="flex-1 bg-white p-5">
            {renderStepContent()}
        </SafeAreaView>
    );
}
