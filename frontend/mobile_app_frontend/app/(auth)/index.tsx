import { useState, useEffect } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, ScrollView, Platform, KeyboardAvoidingView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import * as SecureStore from 'expo-secure-store';
import { AuthScreenProps } from '../../lib/navigation.types';
const logo = require('../../assets/images/logo.png');

const windowHeight = Dimensions.get('window').height;

export default function LoginScreen({ route }: AuthScreenProps<'index'>) {

    interface User {
        email: string,
        password: string
    }

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [credentE, setCredentE] = useState(false)
    const [invalidE, setInvalidE] = useState(false);
    const [wrongP, setWrongP] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false)
    const [tokenE, setTokenE] = useState<string | string[]>('')

    const router = useRouter();

    const { reason } = useLocalSearchParams()

    useEffect(() => {
        if (reason) {
            setTokenE(reason)
        }
    }, [route]);

    const validateEmail = (text: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(text);
    };

    const handleLogin = async () => {
        setCredentE(false);
        setInvalidE(false);
        setWrongP(false);

        if (!password || !validateEmail(email)) {
            setCredentE(true);
            return;
        }

        if (email == 'merchant@gmail.com' && password == '1234') {

            return router.replace('/(merchant-tabs)')

        } else if (email == 'traveler@gmail.com' && password == '1234') {

            return router.replace('/(tabs)')

        } else if (email == 'vehicle@gmail.com' && password == '1234') {

            return router.replace('/(vehicle)')

        } else if (email == 'guide@gmail.com' && password == '1234') {

            return router.replace('/(guide)')

        }

        try {
            const res = await fetch('http://localhost:8080/user/login', {

                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })

            });

            if (res.ok) {
                const data = await res.json()

                if (data && data.token) {

                    setWrongP(false)
                    setInvalidE(false)
                    setCredentE(false)

                    //await SecureStore.setItemAsync("token", data.token)
                    await AsyncStorage.setItem("token", data.token)

                    return router.replace('/(tabs)')
                } else {

                    alert('No token')

                }


            } else {

                const data = await res.json();
                if (data.error == "invalid email") {

                    setInvalidE(true)
                    setCredentE(false)
                    setWrongP(false)

                } else {

                    setWrongP(true)
                    setInvalidE(false)
                    setCredentE(false)


                }

            }
        } catch (err) {

            alert(`Network error : ${err}`)

        }



    };

    return (

        <SafeAreaView className="flex-1 bg-white">

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}            >

                <ScrollView

                    contentContainerStyle={{ flexGrow: 1 }}

                    showsVerticalScrollIndicator={false}
                    bounces={false}
                >

                    <View className="w-full bg-white px-5 py-10 justify-between" style={{ minHeight: windowHeight }}>

                        <View className='justify-center'>
                            <View className="items-center mb-6">
                                <Image
                                    source={logo}
                                    className="w-56 h-56"
                                    resizeMode="contain"
                                />
                            </View>
                            <View className="text-center">
                                <Text className="text-2xl font-bold text-gray-800 text-center">Welcome Back!</Text>
                                <Text className="text-gray-500 text-center mt-1">Please sign in to continue</Text>
                            </View>
                        </View>


                        <View>
                            <View className="gap-6 py-5 flex-1">

                                <View>
                                    <Text className="text-base font-medium text-gray-700 mb-1">Email Address</Text>
                                    <TextInput
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                                        placeholder="role@gmail.com"
                                        placeholderTextColor="#9CA3AF"
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        value={email}
                                        onChangeText={setEmail}
                                    />
                                    <Text className={`text-red-500 text-sm ${invalidE ? 'opacity-100' : 'opacity-0'}`}>Email not registered yet</Text>
                                </View>


                                <View>
                                    <Text className="text-base font-medium text-gray-700 mb-1">Password</Text>

                                    <View className="w-full flex-row items-center border border-gray-300 rounded-lg">
                                        <TextInput

                                            className="flex-1 pl-4 py-3 text-black text-base"
                                            placeholder="••••••••"
                                            placeholderTextColor="#9CA3AF"
                                            secureTextEntry={!isPasswordVisible}
                                            value={password}
                                            onChangeText={setPassword}
                                        />

                                        <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
                                            <Text className="font-semibold text-blue-600 text-center px-3">
                                                {isPasswordVisible ? 'Hide' : 'Show'}
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                    <Text className={`text-red-500 text-sm ${wrongP ? 'opacity-100' : 'opacity-0'}`}>Wrong Password</Text>
                                    <Text className={`text-red-500 ${credentE ? 'opacity-100' : 'opacity-0'}`} >Fill all fields with valid format</Text>
                                    <Text className={`text-red-500 ${tokenE ? 'opacity-100' : 'opacity-0'}`} >Token Expired !!! Login Again.</Text>
                                </View>


                                <View className='justify-between'>
                                    <TouchableOpacity className='my-2' onPress={() => router.push('/(auth)/forgotpassword')}>
                                        <Text className="text-sm font-medium text-yellow-600 text-right">
                                            Forgot Password?
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity

                                        className="w-full bg-[#FEFA17] py-3 rounded-lg shadow-sm"
                                        onPress={handleLogin}
                                    >
                                        <Text className="text-center text-black font-bold text-lg">
                                            Sign In
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View className="mt-3 justify-center flex-row">
                                <Text className="text-sm text-gray-600 pt-[2px]">
                                    Don't have an account?
                                </Text>
                                <TouchableOpacity onPress={() => router.push(`/(auth)/signup`)} >
                                    <Text className="font-medium text-yellow-600">
                                        Sign Up
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}