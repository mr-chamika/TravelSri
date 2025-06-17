import { View, Text, Image } from 'react-native'
const Menu = require('../assets/images/top bar/menu.png')
const Notify = require('../assets/images/top bar/notify1.png')

export default function Topbar() {

    return (

        <View className=' h-[64px] items-center justify-center px-2'>

            <View className='justify-between flex flex-row w-full px-2'>
                <View className='w-[40px] h-[40px] bg-[#FEFA17] rounded-full items-center justify-center shadow-lg shadow-[#538EBB66]' >

                    <Image source={Menu} />

                </View>
                <View className='w-[180px] h-[40px] justify-center items-center'>

                    <Text className='text-lg font-bold'>TravelSri</Text>

                </View>
                <View className='w-[40px] h-[40px] bg-[#FEFA17] rounded-full items-center justify-center shadow-lg shadow-[#538EBB66]' >

                    <Image source={Notify} />

                </View>
            </View>

        </View>

    );

}