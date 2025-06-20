import { Stack, useRouter } from 'expo-router';
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar, Text, TouchableOpacity, View, Image } from 'react-native';
const Arrow = require('../../assets/images/sideTabs/arrow.png')
const Notify = require('../../assets/images/top bar/notify1.png')

export default function _Layout() {

    const router = useRouter();

    return (

        <SafeAreaView className="flex-1 bg-[#F2F0EF]">
            <StatusBar barStyle="dark-content" backgroundColor="#F2F0EF" />
            <View className='flex flex-row justify-between m-3'>
                <TouchableOpacity onPress={() => router.back()}>
                    <View className='w-10 h-10 bg-[#FEFA17] rounded-full items-center justify-center shadow-lg shadow-[#538EBB66]'>
                        <Image source={Arrow}></Image>
                    </View>
                </TouchableOpacity>
                <View className='w-[180px] h-[40px] justify-center items-center'>

                    <Text className='text-lg font-bold'>TravelSri</Text>

                </View>
                <View className='w-[40px] h-[40px] bg-[#FEFA17] rounded-full items-center justify-center shadow-lg shadow-[#538EBB66]' >

                    <Image className='w-[19px] h-[20px]' source={Notify} />

                </View>
            </View>
            <Stack>
                <Stack.Screen name="groupTravel" options={{ headerShown: false }} />
                <Stack.Screen name="equipmentHire" options={{ headerShown: false }} />
                <Stack.Screen name="hotelBooking" options={{ headerShown: false }} />
                <Stack.Screen name="guideHire" options={{ headerShown: false }} />
                <Stack.Screen name="translator" options={{ headerShown: false }} />
            </Stack>

        </SafeAreaView>
    );
}
