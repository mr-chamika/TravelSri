import { View, Text, TouchableOpacity } from 'react-native'

import { cssInterop } from 'nativewind'
import { Image } from 'expo-image'

const Menu = require('../assets/images/top bar/menu.png')
const Notify = require('../assets/images/top bar/notify1.png')


cssInterop(Image, { className: "style" });
export default function Topbar() {

    return (

        <View className=' h-[64px] items-center justify-center px-2'>

            <View className='justify-between flex flex-row w-full px-2'>
                <TouchableOpacity>
                    <View className='absolute w-[40px] h-[40px] bg-[#FEFA17] rounded-full items-center justify-center shadow-lg shadow-[#538EBB66] z-60' >

                        <Image className='w-[20px] h-[20px]' source={Menu} />

                    </View>
                </TouchableOpacity>
                <View className='w-[180px] h-[40px] justify-center items-center'>

                    <Text className='text-lg font-bold'>TravelSri</Text>

                </View>
                <View className='w-[40px] h-[40px] bg-[#FEFA17] rounded-full items-center justify-center shadow-lg shadow-[#538EBB66]' >

                    <Image className='w-[19px] h-[20px]' source={Notify} />

                </View>
            </View>

        </View>

    );

}