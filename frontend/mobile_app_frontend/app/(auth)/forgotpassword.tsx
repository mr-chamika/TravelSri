import React, { useState } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    Image,
} from 'react-native';
import { router } from 'expo-router';

// You can use appropriate icons for your app
const lockIcon = require('../../assets/images/lock.png');
const otpIcon = require('../../assets/images/otp.png');
const newPasswordIcon = require('../../assets/images/newpassword.png'); // Add a suitable icon

export default function ForgotPassword() {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const handleSendResetLink = () => {
        if (!email) {
            Alert.alert('Error', 'Please enter your email address.');
            return;
        }
        const emailRegex = /\S+@\S+\.\S+/;
        if (!emailRegex.test(email)) {
            Alert.alert('Error', 'Please enter a valid email address.');
            return;
        }

        console.log('Sending password reset link to:', email);
        Alert.alert('OTP Sent', `A 4-digit code has been sent to ${email}.`);
        setStep(2);
    };

    const handleVerifyOtp = () => {
        if (otp.length !== 4) {
            Alert.alert('Error', 'Please enter the 4-digit OTP.');
            return;
        }

        console.log('Verifying OTP:', otp);
        setStep(3); // On success, move to the new password step
    };

    const handleSetNewPassword = () => {
        if (!newPassword || !confirmPassword) {
            Alert.alert('Error', 'Please fill in both password fields.');
            return;
        }
        if (newPassword !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match.');
            return;
        }
        if (newPassword.length < 8) {
            Alert.alert('Error', 'Password must be at least 8 characters long.');
            return;
        }

        // --- MOCK API CALL ---
        console.log('Setting new password for email:', email);
        Alert.alert(
            'Password Reset Successful',
            'You can now log in with your new password.',
            [
                { text: 'OK', onPress: () => router.replace('/(auth)') } // Navigate to login screen
            ]
        );
    };

    const renderStepContent = () => {
        switch (step) {
            // Step 1: Enter Email
            case 1:
                return (
                    // ... (Case 1 JSX remains the same)
                    <View className='flex-1'>
                        <TouchableOpacity onPress={() => { router.back() }} className='bg-black w-16 px-3 py-1 rounded-lg mb-16'>
                            <Text className='text-white'> Back</Text>
                        </TouchableOpacity>
                        <View className="flex-1 justify-between">

                            <View className="items-center mb-10">
                                <View className="w-24 h-24 rounded-full bg-gray-100 justify-center items-center border-2 border-gray-200">
                                    <Image
                                        source={lockIcon}
                                        className="w-12 h-12"
                                        resizeMode="contain"
                                        tintColor="#333"
                                    />
                                </View>
                                <Text className="text-3xl font-bold mt-4 text-gray-800">Forgot Password?</Text>
                                <Text className="text-base text-gray-500 mt-2 text-center px-4">
                                    No worries! Enter your email below and we'll send you a link to reset it.
                                </Text>
                            </View>
                            <View className="w-full">
                                <Text className="mb-1 font-semibold text-base text-gray-700">Email Address</Text>
                                <TextInput
                                    className=" text-black border border-gray-300 rounded-lg p-4 text-base"
                                    placeholder="youremail@example.com"
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                                <TouchableOpacity
                                    className="bg-[#FEFA17] py-4 px-6 rounded-lg mt-6 items-center"
                                    onPress={handleSendResetLink}
                                >
                                    <Text className="font-bold text-lg text-gray-800">Send Reset Link</Text>
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

            // Step 2: Enter OTP
            case 2:
                return (
                    // ... (Case 2 JSX remains the same)
                    <View className="flex-1 justify-between py-10">
                        <View className="items-center mb-10">
                            <View className="w-24 h-24 rounded-full bg-gray-100 justify-center items-center border-2 border-gray-200">
                                <Image
                                    source={otpIcon}
                                    className="w-12 h-12"
                                    resizeMode="contain"
                                    tintColor="#333"
                                />
                            </View>
                            <Text className="text-3xl font-bold mt-4 text-gray-800">Enter OTP</Text>
                            <Text className="text-base text-gray-500 mt-2 text-center px-4">
                                A 6-digit code was sent to {'\n'}
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
                            <TouchableOpacity onPress={() => Alert.alert("Resending OTP...")} className="py-2 ml-1">
                                <Text className="font-semibold text-blue-500 text-base">Resend</Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity onPress={() => setStep(1)} className="py-2 mt-2">
                            <Text className="text-center font-semibold text-gray-500 text-base">
                                ← Back to enter email
                            </Text>
                        </TouchableOpacity>
                    </View>
                );

            // Step 3: Enter New Password
            case 3:
                return (
                    <View className="flex-1 justify-evenly">
                        <View className="items-center mb-10">
                            <View className="w-24 h-24 rounded-full bg-gray-100 justify-center items-center border-2 border-gray-200">
                                <Image
                                    source={newPasswordIcon}
                                    className="w-12 h-12"
                                    resizeMode="contain"
                                    tintColor="#333"
                                />
                            </View>
                            <Text className="text-3xl font-bold mt-4 text-gray-800">Set New Password</Text>
                            <Text className="text-base text-gray-500 mt-2 text-center px-4">
                                Your new password must be different from previous ones.
                            </Text>
                        </View>
                        <View className="w-full">
                            {/* New Password Input */}
                            <Text className="mb-1 font-semibold text-base text-gray-700">New Password</Text>
                            <View className="flex-row items-center border border-gray-300 rounded-lg py-1 px-3 mb-4">
                                <TextInput
                                    className="text-black flex-1 text-base"
                                    placeholder="Enter new password"
                                    value={newPassword}
                                    onChangeText={setNewPassword}
                                    secureTextEntry={!isPasswordVisible}
                                />
                                <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
                                    <Text className="font-semibold text-blue-500">{isPasswordVisible ? 'Hide' : 'Show'}</Text>
                                </TouchableOpacity>
                            </View>

                            {/* Confirm Password Input */}
                            <Text className="mb-1 font-semibold text-base text-gray-700">Confirm New Password</Text>
                            <TextInput
                                className="text-black border border-gray-300 rounded-lg p-4 text-base"
                                placeholder="Confirm new password"
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                secureTextEntry={!isPasswordVisible}
                            />

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
        <SafeAreaView className="flex-1 bg-white p-5">
            {renderStepContent()}
        </SafeAreaView>
    );
}