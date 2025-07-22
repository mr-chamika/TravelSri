import { Text, TouchableOpacity, View, Animated } from 'react-native' // 1. Import Animated
import { cssInterop } from 'nativewind'
import { Image } from 'expo-image'
import { useState, useRef, useEffect } from 'react'; // 2. Import useRef
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'expo-router';
import { keys } from 'lodash';

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


export default function Profile() {

    const router = useRouter()

    const [settings, setSettings] = useState([{ dark: true }, { dark: true }, { dark: true }])
    const [user, setUser] = useState(null)

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

                    setUser(data.pp)


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

    // 6. Define the style object that the animation will control.
    // This is the only place we need to use the `style` prop.
    const animatedStyle = {
        transform: [{ scale: scaleAnim }],
    };

    const clear = async () => {

        const keys = await AsyncStorage.getAllKeys();
        try {

            await AsyncStorage.multiRemove(keys);
        } catch (e) {
            alert(`Error clearing AsyncStorage:, ${e}`);
        }
    }
    const loggingout = async () => {


        await clear();

        await AsyncStorage.removeItem('token')
        setUser(null)
        router.replace('/(auth)');

    }

    return (
        <View className='bg-[#F2F5FA] w-full h-full flex-1 flex-col gap-10'>
            {/* --- Profile and Personal Details Sections (Unchanged) --- */}
            <View className='items-center'>
                <View className='w-[220px] h-[220px] mb-4'>
                    <Image className="w-full h-full rounded-full border-4 border-gray-200" source={user ? { uri: `data:image/jpeg;base64,${user}` } : profile} />
                    <Text className='text-center font-bold text-[18px]'>John Doe</Text>
                </View>
            </View>
            <View className='h-full gap-8'>
                <View className='w-full items-center'>
                    <View className='w-[85%] flex flex-row justify-between items-center'>
                        <Text className='text-[14px]'>Personal Details</Text>
                        <TouchableOpacity onPress={() => alert('editing....')}><Image className='w-[20px] h-[20px]' source={edit}></Image></TouchableOpacity>
                    </View>
                    <View className='w-[85%] h-auto'>
                        <View className='mt-2 rounded-[10px] bg-[rgba(217,217,217,0.44)] h-12 flex flex-row w-full justify-between px-2 items-center'>
                            <Text className='font-bold'>Email</Text>
                            <Text className='font-normal'>doe1234@gmail.com</Text>
                        </View>
                        <View className='mt-2 rounded-[10px] bg-[rgba(217,217,217,0.44)] h-12 flex flex-row w-full justify-between px-2 items-center'>
                            <Text className='font-bold'>Phone</Text>
                            <Text className='font-normal'>0123456789</Text>
                        </View>
                        <View className='mt-2 rounded-[10px] bg-[rgba(217,217,217,0.44)] h-12 flex flex-row w-full justify-between px-2 items-center'>
                            <Text className='font-bold'>Username</Text>
                            <Text className='font-normal'>john</Text>
                        </View>

                    </View>
                </View>

                {/* --- Settings Section (With Inline Animations) --- */}
                <View className='w-full items-center'>
                    <View className='w-[85%] flex flex-row justify-between items-center'>
                        <Text className='text-[14px]'>Settings</Text>
                    </View>
                    <View className='w-[85%] h-auto'>
                        {/* --- Dark Mode Toggle --- */}
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
                        </View>

                        {/* --- Visibility Toggle --- */}
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
                        </View>

                        {/* --- Credential Toggle --- */}
                        <View className='mt-2 rounded-[10px] h-12 flex flex-row w-full justify-between px-2 items-center'>
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

                        <TouchableOpacity className="mt-2 rounded-[10px] h-12 flex-row w-full justify-between px-2 items-center" onPress={loggingout}>
                            <Text className='font-bold'>Logout</Text>
                            <Image className='w-8 h-8' source={logout} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    )
}
