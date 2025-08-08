import { Text, TouchableOpacity, View, Animated, TextInput, Alert, ScrollView, KeyboardAvoidingView, Platform, Modal } from 'react-native' // 1. Import Animated
import { useState, useRef, useEffect } from 'react'; // 2. Import useRef
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'expo-router';
import { keys } from 'lodash';
import { cssInterop } from 'nativewind'
import { Image } from 'expo-image'

cssInterop(Image, { className: "style" });

const profile = require('../../assets/images/sideTabs/image.png')
const edit = require('../../assets/images/tabbar/edit.png')
const off = require('../../assets/images/tabbar/off.png')
const on = require('../../assets/images/tabbar/on.png')
const logout = require('../../assets/images/profile/logout.png')

interface MyToken {
    sub: string;
    roles: string[];
    username: string;
    email: string;
    id: string
}

interface User {

    address: string;
    agreeTerms: boolean;
    businessRegPic1: string | null
    businessRegPic2: string | null
    country: string;
    dob: string;
    email: string;
    firstName: string;
    gender: string;
    identitypic1: string;
    identitypic2: string;
    lastName: string;
    locpic: string;
    mobileNumber: string;
    nicPassport: string;
    pp: string;
    role: string;
    status: string;
    username: string;
    whatsappNumber: string;

}

export default function Profile() {

    const router = useRouter()

    const [settings, setSettings] = useState([{ dark: true }, { dark: true }, { dark: true }])
    const [user, setUser] = useState<User | null>(null)
    const [isPasswordVisible, setIsPasswordVisible] = useState(false)
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false)
    const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);

    // 3. Create one animated value for the press interaction.
    // We can reuse this for all buttons.
    const scaleAnim = useRef(new Animated.Value(1)).current;

    // 4. Animation for when the user presses down.
    const onPressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.8, // Scale down to 80%
            useNativeDriver: true, // Use the native thread for smooth animation
        }).start();
    };

    // 5. Animation for when the user releases the press.
    const onPressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1, // Scale back to 100%
            friction: 3,
            tension: 40,
            useNativeDriver: true,
        }).start();
    };

    useEffect(() => {

        const getAll = async () => {

            const keys = await AsyncStorage.getItem("token");

            if (keys) {

                const x: MyToken = jwtDecode(keys)
                try {

                    const res = await fetch(`http://localhost:8080/user/profile?email=${x.email}`)
                    //const res = await fetch(`https://travelsri-backend.onrender.com/user/profile?email=${x.email}`)

                    const data = await res.json()

                    //console.log(data.user)
                    setUser(data.user)


                } catch (err) {

                    console.log(err)

                }


            }

        }
        getAll()


    }, [])

    const handleToggling = (index: number) => {
        const newSettings = settings.map((setting, i) => {
            if (i === index) {
                return { ...setting, dark: !setting.dark }
            }
            return setting;
        })
        setSettings(newSettings)
    }

    interface IFormData {
        password: string;
        confirmPassword: string;
    }

    // Define the shape of our errors object
    // The keys match IFormData, but values can be string or null
    type IFormErrors = {
        [key in keyof IFormData]?: string | null;
    };

    // Use the types with useState for type safety
    const [formData, setFormData] = useState<IFormData>({
        password: '',
        confirmPassword: '',
    });

    const [errors, setErrors] = useState<IFormErrors>({});

    // Fix: Add explicit types for the function parameters
    const handleChange = (name: keyof IFormData, value: string) => {
        setFormData(prevState => ({
            ...prevState,
            [name]: value, // TypeScript now knows 'name' is a valid key
        }));

        if (errors[name]) {
            setErrors(prevErrors => ({
                ...prevErrors,
                [name]: null,
            }));
        }
    };

    const validate = (): IFormErrors => {
        const newErrors: IFormErrors = {};

        // 1. Strong password validation (copied from your signup form)
        const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/;
        if (!formData.password) {
            newErrors.password = 'Password is required.';
        } else if (!strongPasswordRegex.test(formData.password)) {
            newErrors.password = 'Need 8+ characters (1 uppercase, 1 number, 1 symbol)';
        }

        // 2. Confirm password validation
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your new password.';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match.';
        }

        return newErrors;
    };

    const handleSubmit = async () => {
        try {
            const newErrors = validate();
            if (Object.keys(newErrors).length > 0) {
                setErrors(newErrors);
            } else {

                const res = await fetch(`http://localhost:8080/user/reset-password`, {

                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: user?.email, password: formData.password })

                })
                    .then(res => res.text())
                    .then(data => {

                        console.log(data)
                        setFormData({
                            password: '',
                            confirmPassword: '',
                        });

                    })
                    .catch(err => console.log(err))


            }
        } catch (err) {

            alert(err)

        }
    };

    // 6. Define the style object that the animation will control.
    // This is the only place we need to use the `style` prop.
    const animatedStyle = {
        transform: [{ scale: scaleAnim }],
    };

    const clear = async () => {

        try {

            const allKeys = await AsyncStorage.getAllKeys();

            const keysToRemove = allKeys.filter(
                (key) => key !== 'hasViewedOnboarding'
            );

            if (keysToRemove.length > 0) {
                await AsyncStorage.multiRemove(keysToRemove);
                //alert('Storage cleared successfully (except onboarding status).');
            } else {
                console.log('No keys to clear.');
            }

        } catch (e) {
            alert(`Error clearing AsyncStorage: ${e}`);
        }
    }
    const loggingout = async () => {

        if (Platform.OS === 'ios' || Platform.OS === 'android') {
            Alert.alert(
                "Confirm Logout",
                "Are you sure you want to log out?",
                [
                    { text: "Cancel", style: "cancel" },
                    {
                        text: "Logout",
                        onPress: async () => {
                            await clear();
                            await AsyncStorage.removeItem('token');
                            setUser(null);
                            router.replace('/(auth)');
                        },
                        style: "destructive"
                    }
                ]
            );
        } else {
            // For web, show the custom modal
            setIsLogoutModalVisible(true);
        }
    };


    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className='flex-1'
        >
            <Modal
                transparent={true}
                visible={isLogoutModalVisible}
                animationType="fade"
                onRequestClose={() => setIsLogoutModalVisible(false)}
            >
                <View className="flex-1 justify-center items-center bg-black/50">
                    <View className="bg-white rounded-lg p-6 w-80 shadow-lg">
                        <Text className="text-lg font-bold text-gray-800">Confirm Logout</Text>
                        <Text className="text-base text-gray-600 my-4">Are you sure you want to log out?</Text>
                        <View className="flex-row justify-center gap-3">
                            <TouchableOpacity
                                onPress={() => setIsLogoutModalVisible(false)}
                                className="px-4 py-2 rounded"
                            >
                                <Text className="font-semibold text-red-500">Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={async () => {
                                    setIsLogoutModalVisible(false); // Close modal first
                                    await clear();
                                    await AsyncStorage.removeItem('token');
                                    setUser(null);
                                    router.replace('/(auth)');
                                }}
                                className=" px-4 py-2"
                            >
                                <Text className="font-semibold text-blue-500">Logout</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>


            <ScrollView className='bg-[#F2F5FA] w-full flex-1'>
                {/* --- Profile and Personal Details Sections (Unchanged) --- */}
                <View className='items-center mb-5'>
                    <View className='w-[210px] h-[210px] mb-2'>
                        <Image className="w-full h-full rounded-full border-4 border-gray-200" source={user ? { uri: `data:image/jpeg;base64,${user.pp}` } : profile} />
                        <Text className='text-center font-bold text-[18px]'>
                            {user
                                ? `${(user?.firstName ?? '').charAt(0).toUpperCase() + (user?.firstName ?? '').slice(1)} ${(user?.lastName ?? '').charAt(0).toUpperCase() + (user?.lastName ?? '').slice(1)}`.trim()
                                : 'John Doe'
                            }
                        </Text>
                    </View>
                </View>
                <View className=' gap-3'>
                    <View className='w-full items-center '>
                        <View className='w-[85%] flex flex-row justify-between items-center '>
                            <Text className='border-2 border-yellow-400 rounded-lg px-2 pb-1 text-[14px]'>Personal Details</Text>
                            <TouchableOpacity onPress={() => alert('editing....')}><Image className='w-[20px] h-[20px]' source={edit}></Image></TouchableOpacity>
                        </View>
                        <View className='w-[85%] h-auto ml-4'>
                            <View className='mt-2 rounded-[10px] bg-[rgba(217,217,217,0.44)] h-12 flex flex-row w-full justify-between px-2 items-center'>
                                <Text className='font-bold'>Email</Text>
                                <Text className='font-normal'>{user?.email}</Text>
                            </View>
                            <View className='mt-2 rounded-[10px] bg-[rgba(217,217,217,0.44)] h-12 flex flex-row w-full justify-between px-2 items-center'>
                                <Text className='font-bold'>Phone</Text>
                                <Text className='font-normal'>{user?.mobileNumber}</Text>
                            </View>
                            <View className='mt-2 rounded-[10px] bg-[rgba(217,217,217,0.44)] h-12 flex flex-row w-full justify-between px-2 items-center'>
                                <Text className='font-bold'>Username</Text>
                                <Text className='font-normal'>{user?.username}</Text>
                            </View>

                        </View>
                    </View>

                    {/* --- Settings Section (With Inline Animations) --- */}
                    <View className='w-full items-center'>
                        <View className='w-[85%] flex flex-row justify-between items-center mb-2 '>
                            <Text className='border-2 border-yellow-400 rounded-lg px-2 pb-1 text-[14px]'>Change Password</Text>
                        </View>
                        <View className='w-[85%] h-auto ml-4'>

                            <View className="">
                                <View className="flex-row items-center border border-gray-300 rounded-lg">
                                    <TextInput
                                        className="px-3 flex-1 text-base py-1"
                                        value={formData.password}
                                        onChangeText={v => handleChange('password', v)} secureTextEntry={!isPasswordVisible}
                                        placeholder='New Password'
                                        placeholderTextColor='gray'
                                    />
                                    <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)} className='px-3'><Text className="font-semibold text-blue-500">{isPasswordVisible ? 'Hide' : 'Show'}</Text></TouchableOpacity>
                                </View>
                                <Text className={`text-red-500 text-sm mt-1 ${errors.password ? 'opacity-100' : 'opacity-0'}`}>{errors.password || ' '}</Text>
                            </View>
                            <View>
                                <View className="flex-row items-center border border-gray-300 rounded-lg">
                                    <TextInput
                                        className="px-3 flex-1 text-base py-1"
                                        value={formData.confirmPassword}
                                        onChangeText={v => handleChange('confirmPassword', v)}
                                        secureTextEntry={!isConfirmPasswordVisible}
                                        placeholder='Confirm New Password'
                                        placeholderTextColor='gray'

                                    />
                                    <TouchableOpacity onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)} className='px-3'><Text className="font-semibold text-blue-500">{isConfirmPasswordVisible ? 'Hide' : 'Show'}</Text></TouchableOpacity>
                                </View>
                                <Text className={`text-red-500 text-sm mt-1 ${errors.confirmPassword ? 'opacity-100' : 'opacity-0'}`}>{errors.confirmPassword || ' '}</Text>
                            </View>

                            <TouchableOpacity
                                className='bg-black rounded-lg border-2 w-36 py-1 px-1'
                                disabled={formData.password == '' || formData.confirmPassword == ''}
                                onPress={handleSubmit}
                            >
                                <Text className='text-center text-white'>Update Password</Text>
                            </TouchableOpacity>

                        </View>
                    </View>
                    <View className='w-full items-center'>
                        <View className='w-[85%] flex flex-row justify-between items-center '>
                            <Text className='border-2 border-yellow-400 rounded-lg px-2 pb-1 text-[14px]'>Settings</Text>
                        </View>
                        <View className='w-[85%] h-auto ml-4'>
                            {/* --- Dark Mode Toggle --- 
                        <View className='mt-2 rounded-[10px] h-12 flex flex-row w-full justify-between px-2 items-center'>
                            <Text className='font-bold'>Dark Mode</Text>
                            <Animated.View style={animatedStyle}>
                                <TouchableOpacity
                                    activeOpacity={1} // Disable default opacity feedback
                                    onPressIn={onPressIn}
                                    onPressOut={onPressOut}
                                    onPress={() => handleToggling(0)}
                                >
                                    <Image className='w-8 h-8' source={settings[0].dark ? on : off} />
                                </TouchableOpacity>
                            </Animated.View>
                        </View>*/}

                            {/* --- Visibility Toggle --- 
                        <View className='mt-2 rounded-[10px] h-12 flex flex-row w-full justify-between px-2 items-center'>
                            <Text className='font-bold'>Visibility</Text>
                            <Animated.View style={animatedStyle}>
                                <TouchableOpacity
                                    activeOpacity={1}
                                    onPressIn={onPressIn}
                                    onPressOut={onPressOut}
                                    onPress={() => handleToggling(1)}
                                >
                                    <Image className='w-8 h-8' source={settings[1].dark ? on : off} />
                                </TouchableOpacity>
                            </Animated.View>
                        </View>*/}

                            {/* --- Credential Toggle --- */}
                            <View className=' rounded-[10px] h-8 flex flex-row w-full justify-between px-2 items-center'>
                                <Text className='font-bold'>Ask credential when login</Text>
                                <Animated.View style={animatedStyle}>
                                    <TouchableOpacity
                                        activeOpacity={1}
                                        onPressIn={onPressIn}
                                        onPressOut={onPressOut}
                                        onPress={() => handleToggling(2)}
                                    >
                                        <Image className='w-8 h-8' source={settings[2].dark ? on : off} />
                                    </TouchableOpacity>
                                </Animated.View>
                            </View>

                            <TouchableOpacity className=" rounded-[10px] h-12 flex-row w-full justify-between px-2 items-center" onPress={loggingout}>
                                <Text className='font-bold'>Logout</Text>
                                <Image className='w-7 h-7' source={logout} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}
