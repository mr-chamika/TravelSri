import { Stack, useRouter } from 'expo-router';
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar, Text, TouchableOpacity, View, Image } from 'react-native';
import { useState } from 'react';
import NotifyModal from '../../components/Notifi';

const Arrow = require('../../assets/images/sideTabs/arrow.png')
const Notify = require('../../assets/images/top bar/notify1.png')

export default function _Layout() {

    const [notify, setNotify] = useState(false);

    const router = useRouter();

    const toggling = () => {
        setNotify(!notify);
    };

    return (

        <SafeAreaView className="flex-1 bg-[#F2F5FA]" edges={["bottom", "top"]}>
            <View className="flex-1 bg-[#F2F5FA]">
                <StatusBar barStyle="dark-content" backgroundColor="#F2F0EF" />
                <View className='flex flex-row justify-between py-3 px-3'>
                    <TouchableOpacity onPress={() => router.back()}>
                        <View className='w-10 h-10 bg-[#FEFA17] rounded-full items-center justify-center shadow-lg'>
                            <Image source={Arrow}></Image>
                        </View>
                    </TouchableOpacity>
                    <View className='w-[180px] h-[40px] justify-center items-center'>

                        <Text className='text-lg font-bold'>TravelSri</Text>

                    </View>
                    <TouchableOpacity onPress={toggling}>
                        <View className='w-[40px] h-[40px] bg-[#FEFA17] rounded-full items-center justify-center shadow-lg ' >

                            <Image className='w-[19px] h-[20px]' source={Notify} />

                        </View>
                    </TouchableOpacity>

                </View>
                <Stack>
                    <Stack.Screen name="groupTravel" options={{ headerShown: false }} />
                    <Stack.Screen name="equipmentHire" options={{ headerShown: false }} />
                    <Stack.Screen name="hotelBooking" options={{ headerShown: false }} />
                    <Stack.Screen name="guideHire" options={{ headerShown: false }} />
                    <Stack.Screen name="translator" options={{ headerShown: false }} />
                </Stack>
                <NotifyModal

                    isVisible={notify}
                    onClose={toggling}

                />
            </View>
        </SafeAreaView>
    );
}
