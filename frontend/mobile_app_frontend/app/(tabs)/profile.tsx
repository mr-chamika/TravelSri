import { Text, View } from 'react-native'
import { cssInterop } from 'nativewind'
import { Image } from 'expo-image'

cssInterop(Image, { className: "style" });

const profile = require('../../assets/images/sideTabs/profile.png')
const edit = require('../../assets/images/tabbar/edit.png')
const off = require('../../assets/images/tabbar/off.png')
const on = require('../../assets/images/tabbar/on.png')

export default function Profile() {

    return (

        <View className='bg-[#F2F5FA] w-full h-full flex-1 flex-col gap-10'>

            <View className='items-center'>
                <View className='w-[250px] h-[250px] mb-4'>

                    <Image className="w-full h-full rounded-full border-4 border-gray-200" source={profile} />
                    <Text className='text-center font-bold text-[18px]'>Nirdha Uyanhewa</Text>

                </View>

            </View>
            <View className='h-full gap-8'>
                <View className='w-full items-center'>
                    <View className='w-[85%] flex flex-row justify-between items-center'>
                        <Text className='text-[14px]'>Personal Details</Text>
                        <Image className='w-[20px] h-[20px]' source={edit}></Image>
                    </View>
                    <View className='w-[85%] h-auto'>
                        <View className='mt-2 rounded-[10px] bg-[rgba(217,217,217,0.44)] h-12 flex flex-row w-full justify-between px-2 items-center'>
                            <Text className='font-bold'>Email</Text>
                            <Text className='font-normal'>uyanhewa@gmail.com</Text>
                        </View>
                        <View className='mt-2 rounded-[10px] bg-[rgba(217,217,217,0.44)] h-12 flex flex-row w-full justify-between px-2 items-center'>
                            <Text className='font-bold'>Phone</Text>
                            <Text className='font-normal'>0123456789</Text>
                        </View>
                        <View className='mt-2 rounded-[10px] bg-[rgba(217,217,217,0.44)] h-12 flex flex-row w-full justify-between px-2 items-center'>
                            <Text className='font-bold'>Username</Text>
                            <Text className='font-normal'>Nirdha Uyanhewa</Text>
                        </View>

                    </View>
                </View>
                <View className='w-full items-center'>
                    <View className='w-[85%] flex flex-row justify-between items-center'>
                        <Text className='text-[14px]'>Settings</Text>
                    </View>
                    <View className='w-[85%] h-auto'>
                        <View className='mt-2 rounded-[10px] h-12 flex flex-row w-full justify-between px-2 items-center'>
                            <Text className='font-bold'>Dark Mode</Text>
                            <Image className='w-[20px] h-[20px]' source={off}></Image>
                        </View>
                        <View className='mt-2 rounded-[10px] h-12 flex flex-row w-full justify-between px-2 items-center'>
                            <Text className='font-bold'>Visibility</Text>
                            <Image className='w-[20px] h-[20px]' source={off}></Image>
                        </View>
                        <View className='mt-2 rounded-[10px] h-12 flex flex-row w-full justify-between px-2 items-center'>
                            <Text className='font-bold'>Ask credential when login</Text>
                            <Image className='w-[20px] h-[20px]' source={on}></Image>
                        </View>

                    </View>
                </View>
            </View>
        </View>

    )

}