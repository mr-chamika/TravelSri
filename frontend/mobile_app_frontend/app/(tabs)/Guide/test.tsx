import { View, Text, TouchableOpacity } from 'react-native'

import { cssInterop } from 'nativewind'
import { Image } from 'expo-image'

const Menu = require('../../../assets/images/top bar/menu.png')
const Notify = require('../../../assets/images/top bar/notify1.png')
const logo = require('../../../assets/images/top bar/logo.png')

interface TopbarProps {
    pressing: () => void;
}

cssInterop(Image, { className: "style" });
export default function Topbar({ pressing }: TopbarProps) {

    return (

        <View className='h-[110px] items-center justify-center px-2'>
    <View className='justify-between flex flex-row w-full px-2 items-center'>
        <View className='w-[40px]'>
            <TouchableOpacity onPress={pressing}>
                <View className='w-[40px] h-[40px] bg-[#FEFA17] rounded-full items-center justify-center shadow-lg shadow-[#538EBB66] z-60'>
                    <Image className='w-[30px] h-[30px]' source={Menu} />
                </View>
            </TouchableOpacity>
        </View>
        
        <View className='flex-1 flex-row items-center justify-center'>
            <Image className='w-[30px] h-[30px] mr-2' source={logo} />
            <Text className='text-lg font-bold text-black'>TravelSri</Text>
        </View>

        <View className='w-[40px] h-[40px] items-center justify-center shadow-lg shadow-[#538EBB66]'>
            <Image className='w-[40px] h-[40px]' source={Notify} />
        </View>
    </View>
</View>

    );

}