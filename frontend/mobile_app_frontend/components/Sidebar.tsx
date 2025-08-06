import { Text, View, TouchableOpacity } from 'react-native'
import { Href, useRouter } from 'expo-router'
import { cssInterop } from 'nativewind'
import { Image } from 'expo-image'
import { SafeAreaView } from 'react-native-safe-area-context';

cssInterop(Image, { className: "style" });

const Profile = require('../assets/images/sideTabs/image.png')
const group = require('../assets/images/sideTabs/grp.png')
const equipments = require('../assets/images/sideTabs/equips.png')
const hotel = require('../assets/images/sideTabs/bed.png')
const guide = require('../assets/images/sideTabs/guid.png')
const translator = require('../assets/images/sideTabs/translator.png')
const vehicle = require('../assets/images/tabbar/carr.png')

interface TopbarProps {
    close: () => void;
}

export default function Sidebar({ close }: TopbarProps) {

    const router = useRouter();

    const handleNavigation = (path: Href) => {

        // setTimeout(() => {
        //     router.push(path);
        // }, 200);
        router.push(path);
        close();

    };

    return (

        <View className='flex-1 h-full'>

            <View className='items-center'>
                <View className='w-[250px] h-[250px] mt-5'>

                    <Image className="w-full h-full rounded-full border-4 border-gray-200" source={Profile} />

                </View>

            </View>

            <View className='flex-1 justify-center'>
                <TouchableOpacity className='my-7 flex flex-row gap-24 w-80' onPress={() => { handleNavigation('/sideTabs/groupTravel') }}>
                    <Image source={group} className='justify-center items-center w-[35px] h-[35px]'></Image>
                    <Text className='flex justify-start items-center text-[20px] font-black w-96'>Group Travel</Text>
                </TouchableOpacity>
                <TouchableOpacity className='my-7 flex flex-row gap-24 w-80' onPress={() => { handleNavigation('/sideTabs/carRental') }}>
                    <Image source={vehicle} className='justify-center items-center w-[35px] h-[35px]'></Image>
                    <Text className='flex justify-start items-center text-[20px] font-black w-96'>Vehicle Booking</Text>
                </TouchableOpacity>

                <TouchableOpacity className='my-7 flex flex-row gap-24 w-80' onPress={() => { handleNavigation('/sideTabs/equipmentHire') }}>
                    <Image source={equipments} className='justify-center items-center w-[35px] h-[35px]'></Image>
                    <Text className='flex justify-start items-center text-[20px] font-black w-96'>Equipments Hiring</Text>
                </TouchableOpacity>

                <TouchableOpacity className='my-7 flex flex-row gap-24 w-80' onPress={() => { handleNavigation('/sideTabs/hotelBooking') }}>
                    <Image source={hotel} className='justify-center items-center w-[35px] h-[35px]'></Image>
                    <Text className='flex justify-start items-center text-[20px] font-black w-96'>Hotel Booking</Text>
                </TouchableOpacity>

                <TouchableOpacity className='my-7 flex flex-row gap-24 w-80' onPress={() => { handleNavigation('/sideTabs/guideHire') }}>
                    <Image source={guide} className='justify-center items-center w-[35px] h-[35px]'></Image>
                    <Text className='flex justify-start items-center text-[20px] font-black w-96'>Guide Hiring</Text>
                </TouchableOpacity>

                <TouchableOpacity className='my-7 flex flex-row gap-24 w-80' onPress={() => { handleNavigation('/sideTabs/translator') }}>
                    <Image source={translator} className='justify-center items-center w-[35px] h-[35px]'></Image>
                    <Text className='flex justify-start items-center text-[20px] font-black w-96'>Translator</Text>
                </TouchableOpacity>

            </View>

            <View className='items-center p-1'>

                <Text className='text-[14px]'>Tuesday, 01 January 2001</Text>
                <Text className='text-[14px]'>12 : 00 AM</Text>

            </View>

        </View>

    )

}