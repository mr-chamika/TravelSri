/* import { Text, View } from 'react-native'

export default function Profile() {

    return (

        <View className='flex-1 justify-center items-center'>

            <Text>This is Profile</Text>

        </View>

    )

} */

import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, Text, TextInput, View, TouchableOpacity } from 'react-native';
import { cssInterop } from 'nativewind'
import { Image } from 'expo-image'


cssInterop(Image, { className: "style" });

const pic = require('../../assets/images/tabbar/tuktuk.png')
const bus = require('../../assets/images/tabbar/bus.png')
const ac = require('../../assets/images/tabbar/ac.png')
const car = require('../../assets/images/tabbar/car.png')
const mini = require('../../assets/images/tabbar/mini.png')
const sport = require('../../assets/images/tabbar/sport.png')
const p = require('../../assets/images/user2.png')
const t = require('../../assets/images/tag.png')

export default function App() {


    //const ip = 'localhost';// to connect pc browser
    const ip = '';//Enter you ip for connect the phone

    interface Student {
        _id: string;
        name: string;
        address: string;
    }
    const backendUrl = `http://${ip}:8080`;

    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [students, setStudents] = useState<Student[]>([]);

    //const [students, setStudents] = useState([]);
    const [ok, setOk] = useState(false);

    const handleSubmit = () => {
        fetch(`${backendUrl}/student/add`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, address }),
        })
            .then((res) => res.text())
            .then((data) => {
                console.log(data);
                Alert.alert('Success', 'Student added!');
            })
            .catch((err) => {
                console.error('Error:', err);
                Alert.alert('Error', 'Failed to add student');
            });
    };

    const getAll = () => {
        setOk(true);
        fetch(`${backendUrl}/student/getAll`)
            .then((res) => res.json())
            .then((data: Student[]) => setStudents(data))
            .catch((err) => {

                alert('Check your ip is metro ip ?')
                console.error('Error:', err);
                Alert.alert('Error', 'Failed to fetch students');
            });
    };

    const less = () => setOk(false);

    return (
        // <View className='w-full h-[90%]'>
        //     <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: 'center', paddingVertical: 10, justifyContent: 'center' }}>
        //         <View className="mb-4 w-[300px]">
        //             <TextInput
        //                 className="border border-gray-400 rounded px-4 py-2 text-base"
        //                 value={name}
        //                 onChangeText={setName}
        //                 placeholder="Enter name"
        //             />
        //         </View>
        //         <View className="mb-4 w-[300px]">
        //             <TextInput
        //                 className="border border-gray-400 rounded px-4 py-2 text-base"
        //                 value={address}
        //                 onChangeText={setAddress}
        //                 placeholder="Enter address"
        //             />
        //         </View>
        //         <Pressable onPress={handleSubmit} className="bg-blue-500 rounded py-3 mb-4">
        //             <Text className="text-white text-center font-semibold w-[300px]">Submit</Text>
        //         </Pressable>

        //         <Pressable onPress={getAll} className="bg-green-500 rounded  py-3 mb-6">
        //             <Text className="text-white text-center font-semibold w-[300px]">Get All</Text>
        //         </Pressable>

        //         {ok && (
        //             <View className="space-y-4 mb-6">
        //                 {students.map((student) => (
        //                     <View key={student._id} className="border border-gray-300 p-4 rounded">
        //                         <Text className="text-lg">Name: {student.name}</Text>
        //                         <Text className="text-lg">Address: {student.address}</Text>
        //                     </View>
        //                 ))}
        //                 <Pressable onPress={less} className="bg-red-500 rounded px-4 py-3">
        //                     <Text className="text-white text-center font-semibold">Show Less</Text>
        //                 </Pressable>
        //             </View>
        //         )}
        //     </ScrollView>
        // </View>

        <View className='bg-[#F2F5FA] w-full h-full'>

            <Text className='text-[24px] font-semibold mx-5 my-5'>Category</Text>

            <View className='w-full gap-10 items-center'>
                <View className='flex-row gap-7 px-4 '>
                    <TouchableOpacity className="bg-[#d9d9d98e] w-[160px] h-[170px] items-center gap-2  py-2 rounded-2xl">
                        <Image
                            className="w-[70px] h-[70px]"
                            source={pic}
                        />
                        <View>
                            <View className='flex-row items-center gap-4'>
                                <Image
                                    className="w-[11px] h-[11px]"
                                    source={p}
                                />
                                <Text className=" text-[13px] italic text-center">
                                    2 Members
                                </Text>
                            </View>
                            <View className='flex-row items-center gap-4 my-1'>
                                <Image
                                    className="w-[11px] h-[11px]"
                                    source={t}
                                />
                                <Text className=" text-[13px] italic text-center">
                                    Tuk
                                </Text>
                            </View>
                        </View>
                        <TouchableOpacity className="rounded-md bg-black justify-center w-32 h-5 items-center" onPress={() => alert('menna ebuwa')}>
                            <Text className=" text-white font-semibold text-[12px]">100.00 LKR/1km</Text>
                        </TouchableOpacity>
                    </TouchableOpacity>
                    <TouchableOpacity className="bg-[#d9d9d98e] w-[160px] h-[170px] items-center gap-2  py-2 rounded-2xl">
                        <Image
                            className="w-[70px] h-[70px]"
                            source={mini}
                        />
                        <View>
                            <View className='flex-row items-center gap-4'>
                                <Image
                                    className="w-[11px] h-[11px]"
                                    source={p}
                                />
                                <Text className=" text-[13px] italic text-center">
                                    3 Members
                                </Text>
                            </View>
                            <View className='flex-row items-center gap-4 my-1'>
                                <Image
                                    className="w-[11px] h-[11px]"
                                    source={t}
                                />
                                <Text className=" text-[13px] italic text-center">
                                    Mini
                                </Text>
                            </View>
                        </View>
                        <TouchableOpacity className="rounded-md bg-black justify-center w-32 h-5 items-center" onPress={() => alert('menna ebuwa')}>
                            <Text className=" text-white font-semibold text-[12px]">150.00 LKR/1km</Text>
                        </TouchableOpacity>
                    </TouchableOpacity>

                </View>

                <View className='flex-row gap-7 px-4'>
                    <TouchableOpacity className="bg-[#d9d9d98e] w-[160px] h-[170px] items-center gap-2  py-2 rounded-2xl">
                        <Image
                            className="w-[70px] h-[70px]"
                            source={sport}
                        />
                        <View>
                            <View className='flex-row items-center gap-4'>
                                <Image
                                    className="w-[11px] h-[11px]"
                                    source={p}
                                />
                                <Text className=" text-[13px] italic text-center">
                                    4 Members
                                </Text>
                            </View>
                            <View className='flex-row items-center gap-4 my-1'>
                                <Image
                                    className="w-[11px] h-[11px]"
                                    source={t}
                                />
                                <Text className=" text-[13px] italic text-center">
                                    Seddan
                                </Text>
                            </View>
                        </View>
                        <TouchableOpacity className="rounded-md bg-black justify-center w-32 h-5 items-center" onPress={() => alert('menna ebuwa')}>
                            <Text className=" text-white font-semibold text-[12px]">200.00 LKR/1km</Text>
                        </TouchableOpacity>
                    </TouchableOpacity>
                    <TouchableOpacity className="bg-[#d9d9d98e] w-[160px] h-[170px] items-center gap-2  py-2 rounded-2xl">
                        <Image
                            className="w-[70px] h-[70px]"
                            source={car}
                        />
                        <View>
                            <View className='flex-row items-center gap-4'>
                                <Image
                                    className="w-[11px] h-[11px]"
                                    source={p}
                                />
                                <Text className=" text-[13px] italic text-center">
                                    5 Members
                                </Text>
                            </View>
                            <View className='flex-row items-center gap-4 my-1'>
                                <Image
                                    className="w-[11px] h-[11px]"
                                    source={t}
                                />
                                <Text className=" text-[13px] italic text-center">
                                    Van
                                </Text>
                            </View>
                        </View>
                        <TouchableOpacity className="rounded-md bg-black justify-center w-32 h-5 items-center" onPress={() => alert('menna ebuwa')}>
                            <Text className=" text-white font-semibold text-[12px]">250.00 LKR/1km</Text>
                        </TouchableOpacity>
                    </TouchableOpacity>

                </View>
                <View className='flex-row gap-7 px-4'>
                    <TouchableOpacity className="bg-[#d9d9d98e] w-[160px] h-[170px] items-center gap-2  py-2 rounded-2xl">
                        <Image
                            className="w-[70px] h-[70px]"
                            source={bus}
                        />
                        <View>
                            <View className='flex-row items-center gap-4'>
                                <Image
                                    className="w-[11px] h-[11px]"
                                    source={p}
                                />
                                <Text className=" text-[13px] italic text-center">
                                    54 Members
                                </Text>
                            </View>
                            <View className='flex-row items-center gap-4 my-1'>
                                <Image
                                    className="w-[11px] h-[11px]"
                                    source={t}
                                />
                                <Text className=" text-[13px] italic text-center">
                                    Non A/C
                                </Text>
                            </View>
                        </View>
                        <TouchableOpacity className="rounded-md bg-black justify-center w-32 h-5 items-center" onPress={() => alert('menna ebuwa')}>
                            <Text className=" text-white font-semibold text-[12px]">1000.00 LKR/1km</Text>
                        </TouchableOpacity>
                    </TouchableOpacity>
                    <TouchableOpacity className="bg-[#d9d9d98e] w-[160px] h-[170px] items-center gap-2  py-2 rounded-2xl">
                        <Image
                            className="w-[70px] h-[70px]"
                            source={ac}
                        />
                        <View>
                            <View className='flex-row items-center gap-4'>
                                <Image
                                    className="w-[11px] h-[11px]"
                                    source={p}
                                />
                                <Text className=" text-[13px] italic text-center">
                                    35 Members
                                </Text>
                            </View>
                            <View className='flex-row items-center gap-4 my-1'>
                                <Image
                                    className="w-[11px] h-[11px]"
                                    source={t}
                                />
                                <Text className=" text-[13px] italic text-center">
                                    A/C
                                </Text>
                            </View>
                        </View>
                        <TouchableOpacity className="rounded-md bg-black justify-center w-32 h-5 items-center" onPress={() => alert('menna ebuwa')}>
                            <Text className=" text-white font-semibold text-[12px]">2500.00 LKR/1km</Text>
                        </TouchableOpacity>
                    </TouchableOpacity>

                </View>

            </View>
        </View>

    )
}
