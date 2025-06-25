import { View, Text, TouchableOpacity, Modal } from 'react-native'
import { useState } from 'react'

import { Image } from 'expo-image'
import { cssInterop } from 'nativewind'

const Menu = require('../assets/images/top bar/menu.png')
const Notify = require('../assets/images/top bar/notify1.png')

interface TopbarProps {
    pressing: () => void;
    notifying: () => void;
}

cssInterop(Image, { className: "style" });
export default function Topbar({ pressing, notifying }: TopbarProps) {


    return (

        <View className='bg-[#F2F5FA] h-[64px] items-center justify-center px-2'>

            <View className='justify-between flex-row w-full px-2'>
                <TouchableOpacity onPress={pressing}>
                    <View className='absolute w-[40px] h-[40px] bg-[#FEFA17] rounded-full items-center justify-center shadow-lg z-60' >

                        <Image className='w-[20px] h-[20px]' source={Menu} />

                    </View>
                </TouchableOpacity>
                <View className='w-[180px] h-[40px] justify-center items-center'>

                    <Text className='text-lg font-bold'>TravelSri</Text>

                </View>
                <TouchableOpacity onPress={notifying}>
                    <View className='w-[40px] h-[40px] bg-[#FEFA17] rounded-full items-center justify-center shadow-lg ' >

                        <Image className='w-[19px] h-[20px]' source={Notify} />

                    </View>
                </TouchableOpacity>
            </View>
        </View>


    );

}