import { TextInput, Text, View, ScrollView, TouchableOpacity } from 'react-native'
import { cssInterop } from 'nativewind'
import { Image } from 'expo-image'
import { useState } from 'react';


cssInterop(Image, { className: "style" });

const pic = require('../../assets/images/tabbar/towert.png')
const rcnt = require('../../assets/images/tabbar/rcnt.png')


export default function Group() {

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [des, setDes] = useState('')

    const handleSubmit = () => {

        if (!name || !email || !des) {

            alert("Fill all fields");

        } else {

            alert(`You are ${name}. Your email is ${email} and saying ${des}`)

        }

    }

    return (
        <View className='w-full h-full bg-[#F2F5FA]'>

            <Text className="font-extrabold text-3xl text-center my-5">Guide Services</Text>

            <ScrollView

                contentContainerClassName="flex-col justify-center pt-5"
            >
                <View className='w-full h-full gap-10'>

                    <View className='w-full'>
                        <Text className="text-[22px] font-semibold mt-5 m-3">Visited</Text>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            className="px-2"
                            contentContainerStyle={{ paddingRight: 20 }}
                        >
                            <View className="flex-row gap-10">
                                <View className="bg-gray-200 w-[350px] h-[220px] items-center rounded-[20px] ml-3">
                                    <View className="w-full flex-row absolute justify-between px-4 pt-3 z-10">
                                        <Text className="bg-gray-100 rounded-md px-2">Travel #1</Text>
                                        <Text className="bg-gray-100 rounded-md px-2">18/20</Text>
                                    </View>
                                    <Image
                                        className="opacity-65 mt-2 flex justify-center w-[335px] h-[100px] rounded-[15px] shadow-gray-400 shadow-lg"
                                        source={rcnt}
                                    />
                                    <View>
                                        <Text className="mt-1 text-[20px] text-center">
                                            Matara to Colombo
                                        </Text>
                                        <Text className="mt-1 text-[15px] text-center">
                                            20 Members|1 day|25 nov 2025|Confirmed
                                        </Text>
                                    </View>
                                    <View className="w-full flex flex-row justify-between px-3 mt-3">
                                        <Text className="mt-1 text-[20px] text-start font-bold">
                                            5000.00 LKR
                                        </Text>

                                        <TouchableOpacity className="rounded-md bg-black justify-center w-16 items-center" onPress={() => alert('menna ebuwa')}>
                                            <Text className=" text-white font-semibold">JOIN</Text>
                                        </TouchableOpacity>

                                    </View>
                                </View>
                                <View className="bg-gray-200 w-[350px] h-[220px] items-center rounded-[20px] ml-3">
                                    <View className="w-full flex-row absolute justify-between px-4 pt-3 z-10">
                                        <Text className="bg-gray-100 rounded-md px-2">Travel #1</Text>
                                        <Text className="bg-gray-100 rounded-md px-2">18/20</Text>
                                    </View>
                                    <Image
                                        className="opacity-65 mt-2 flex justify-center w-[335px] h-[100px] rounded-[15px] shadow-gray-400 shadow-lg"
                                        source={rcnt}
                                    />
                                    <View>
                                        <Text className="mt-1 text-[20px] text-center">
                                            Matara to Colombo
                                        </Text>
                                        <Text className="mt-1 text-[15px] text-center">
                                            20 Members|1 day|25 nov 2025|Confirmed
                                        </Text>
                                    </View>
                                    <View className="w-full flex flex-row justify-between px-3 mt-3">
                                        <Text className="mt-1 text-[20px] text-start font-bold">
                                            5000.00 LKR
                                        </Text>

                                        <TouchableOpacity className="rounded-md bg-black justify-center w-16 items-center" onPress={() => alert('menna ebuwa')}>
                                            <Text className=" text-white font-semibold">JOIN</Text>
                                        </TouchableOpacity>

                                    </View>
                                </View>


                            </View>
                        </ScrollView>
                    </View>
                    <View>
                        <Text className="text-[22px] font-semibold mt-5 m-3">Comming Soon</Text>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            className="px-2"
                            contentContainerStyle={{ paddingRight: 20 }}
                        >
                            <View className="flex-row gap-10">
                                <View className="bg-gray-200 w-[350px] h-[220px] items-center rounded-[20px] ml-3">
                                    <View className="w-full flex-row absolute justify-between px-4 pt-3 z-10">
                                        <Text className="bg-gray-100 rounded-md px-2">Travel #1</Text>
                                        <Text className="bg-gray-100 rounded-md px-2">18/20</Text>
                                    </View>
                                    <Image
                                        className="opacity-65 mt-2 flex justify-center w-[335px] h-[100px] rounded-[15px] shadow-gray-400 shadow-lg"
                                        source={pic}
                                    />
                                    <View>
                                        <Text className="mt-1 text-[20px] text-center">
                                            Matara to Colombo
                                        </Text>
                                        <Text className="mt-1 text-[15px] text-center">
                                            20 Members|1 day|25 nov 2025|Confirmed
                                        </Text>
                                    </View>
                                    <View className="w-full flex flex-row justify-between px-3 mt-3">
                                        <Text className="mt-1 text-[20px] text-start font-bold">
                                            5000.00 LKR
                                        </Text>

                                        <TouchableOpacity className="rounded-md bg-black justify-center w-16 items-center" onPress={() => alert('menna ebuwa')}>
                                            <Text className=" text-white font-semibold">JOIN</Text>
                                        </TouchableOpacity>

                                    </View>
                                </View>
                                <View className="bg-gray-200 w-[350px] h-[220px] items-center rounded-[20px] ml-3">
                                    <View className="w-full flex-row absolute justify-between px-4 pt-3 z-10">
                                        <Text className="bg-gray-100 rounded-md px-2">Travel #1</Text>
                                        <Text className="bg-gray-100 rounded-md px-2">18/20</Text>
                                    </View>
                                    <Image
                                        className="opacity-65 mt-2 flex justify-center w-[335px] h-[100px] rounded-[15px] shadow-gray-400 shadow-lg"
                                        source={pic}
                                    />
                                    <View>
                                        <Text className="mt-1 text-[20px] text-center">
                                            Matara to Colombo
                                        </Text>
                                        <Text className="mt-1 text-[15px] text-center">
                                            20 Members|1 day|25 nov 2025|Confirmed
                                        </Text>
                                    </View>
                                    <View className="w-full flex flex-row justify-between px-3 mt-3">
                                        <Text className="mt-1 text-[20px] text-start font-bold">
                                            5000.00 LKR
                                        </Text>

                                        <TouchableOpacity className="rounded-md bg-black justify-center w-16 items-center" onPress={() => alert('menna ebuwa')}>
                                            <Text className=" text-white font-semibold">JOIN</Text>
                                        </TouchableOpacity>

                                    </View>
                                </View>


                            </View>
                        </ScrollView>
                    </View>

                    <View>

                        <Text className="text-[22px] font-semibold mt-5 m-3">Request</Text>
                        <View className='items-center mb-5 gap-5'>

                            <TextInput className='rounded-xl w-[300px] border-2 border-gray-200 p-4' placeholder='Enter Your Name' placeholderTextColor="#8E8E8E" onChangeText={setName} />
                            <TextInput className='rounded-xl w-[300px] border-2 border-gray-200 p-4' placeholder='Enter Your Email' placeholderTextColor="#8E8E8E" onChangeText={setEmail} />
                            <TextInput multiline={true} className='rounded-xl w-[300px] h-[200px] border-2 border-gray-200 p-4' placeholderTextColor="#8E8E8E" placeholder='Enter Your Name' style={{ textAlignVertical: 'top' }} onChangeText={setDes} />


                            <TouchableOpacity onPress={handleSubmit} className='w-[76%] h-10 bg-[#FEFA17] rounded-lg justify-center'>
                                <Text className='text-[20px] text-center'>Submit</Text>
                            </TouchableOpacity>

                        </View>

                    </View>


                </View>
            </ScrollView>
        </View>



    )

}