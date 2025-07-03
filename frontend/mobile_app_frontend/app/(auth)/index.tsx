import React, { useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

const logo = require('../../assets/images/logo.png')

export default function LoginScreen() {

    interface User {

        email: string,
        password: string

    }

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [user, setUser] = useState<User | null>(null)
    const [invalidE, setInvalidE] = useState(false)

    const router = useRouter();

    const validateEmail = (text: string) => {

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(text);
    };

    const handleLogin = () => {

        if (!password || validateEmail(email) == false) {

            alert("Fill all fields with valid format");


        } else {

            //alert(`You are ${name}. Your email is ${email} and saying ${des}`)
            //alert(`Email is ${email} and password is ${password}`)

            fetch('http://localhost:8080/traveler/login', {

                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })

            })
                .then(res => res.text())
                .then(data => {

                    if (data == "wrong password") {

                        setInvalidE(false)
                        alert(data)

                    } else if (data == "true") {

                        setInvalidE(false)
                        router.replace('/(tabs)')

                    } else if (data == "invalid email") {

                        setInvalidE(true)

                    }

                })
                .catch(err => { alert(err); console.log(err) })


        }

    }


    return (

        <View className=" justify-center">
            <ScrollView contentContainerClassName='min-h-screen'>

                <View className="w-full h-full bg-white rounded-2xl px-8 py-10 justify-between">
                    <View className='h-[45%] justify-center'>

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
                    <View className='h-[45%]'>

                        <View className="gap-6 h-[90%] py-5">

                            <View>
                                <Text className="text-base font-medium text-gray-700 mb-1">Email Address</Text>
                                <TextInput
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                                    placeholder="you@example.com"
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
                                <TextInput
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg "
                                    placeholder="••••••••"
                                    placeholderTextColor="#9CA3AF"
                                    secureTextEntry
                                    value={password}
                                    onChangeText={setPassword}
                                />
                            </View>

                            <View className='justify-between'>

                                <TouchableOpacity className='my-2' onPress={() => router.push('/(auth)/forgotpassword')}>
                                    <Text className="text-sm font-medium text-yellow-600 text-right">
                                        Forgot Password?
                                    </Text>
                                </TouchableOpacity>


                                <TouchableOpacity className=" w-full bg-['#FEFA17'] py-3 rounded-lg shadow-sm active:bg-yellow-500" /* onPress={() => router.replace(`/(tabs)`)} */ onPress={handleLogin}>
                                    <Text className="text-center text-black font-bold text-lg">
                                        Sign In
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>


                        <View className="mt-3 justify-center flex-row">
                            <Text className="text-sm text-gray-600 pt-[2px]">
                                Don't have an account?{' '}
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
        </View>

    );
}
