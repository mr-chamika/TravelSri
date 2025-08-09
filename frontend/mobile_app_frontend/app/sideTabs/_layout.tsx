import { Stack, useRouter } from 'expo-router';
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { useState } from 'react';
import NotifyModal from '../../components/Notifi';
import { Image } from 'expo-image'
import { cssInterop } from 'nativewind'
cssInterop(Image, { className: "style" });

const Arrow = require('../../assets/images/sideTabs/arrow.png')
const Notify = require('../../assets/images/top bar/notify1.png')

export default function _Layout() {
    const [notify, setNotify] = useState(false);
    const router = useRouter();

    const toggling = () => {
        setNotify(!notify);
    };

    return (
        <>
            <SafeAreaView className="flex-1 bg-slate-50" edges={["bottom", "top"]}>
                <NotifyModal
                    isVisible={notify}
                    onClose={toggling}
                />
                <View className="flex-1">
                    <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />
                    
                    {/* Modern Header */}
                    <View className='bg-white border-b border-gray-200 shadow-sm'>
                        <View className='flex flex-row justify-between items-center py-4 px-5'>
                            {/* Back Button */}
                            <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
                                <View className='w-12 h-12 bg-amber-400 rounded-2xl items-center justify-center shadow-md'>
                                    <Image className='w-5 h-5' source={Arrow} />
                                </View>
                            </TouchableOpacity>

                            {/* Title Section */}
                            <View className='flex-1 items-center mx-4'>
                                <Text className='text-2xl font-bold text-gray-800'>TravelSri</Text>
                                <View className='w-16 h-1 bg-amber-400 rounded-full mt-2'></View>
                            </View>

                            {/* Notification Button */}
                            <TouchableOpacity onPress={toggling} activeOpacity={0.7}>
                                <View className='w-12 h-12 bg-amber-400 rounded-2xl items-center justify-center shadow-md relative'>
                                    <Image className='w-6 h-6' source={Notify} />
                                    {/* Notification Badge */}
                                    <View className='absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white'>
                                        <Text className='text-xs text-white text-center font-bold leading-3'>3</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Content Area */}
                    <View className="flex-1 bg-gray-50">
                        <Stack>
                            <Stack.Screen name="groupTravel" options={{ headerShown: false }} />
                            <Stack.Screen name="carRental" options={{ headerShown: false }} />
                            <Stack.Screen name="equipmentHire" options={{ headerShown: false }} />
                            <Stack.Screen name="hotelBooking" options={{ headerShown: false }} />
                            <Stack.Screen name="guideHire" options={{ headerShown: false }} />
                            <Stack.Screen name="translator" options={{ headerShown: false }} />
                        </Stack>
                    </View>
                </View>
            </SafeAreaView>
        </>
    );
}