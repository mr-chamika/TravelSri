/* import { Text, View } from 'react-native'

export default function Profile() {

    return (

        <View className='flex-1 justify-center items-center'>

            <Text>This is Profile</Text>

        </View>

    )

} */

import React, { useState, useCallback } from 'react';
import { Alert, Pressable, ScrollView, Text, TextInput, View, TouchableOpacity, Modal } from 'react-native';
import { cssInterop } from 'nativewind'
import { Image } from 'expo-image'
import { useFocusEffect, useRouter } from 'expo-router';
import { Calendar } from 'react-native-calendars';


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

    const router = useRouter();

    const [isModalVisible, setModalVisible] = useState(true);
    const [selectedDates, setSelectedDates] = useState<{ [key: string]: { selected: boolean; selectedColor: string } }>({});
    const [location, setLocation] = useState('');
    const [lan, setLan] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [show, setShow] = useState(false);
    const [fine, setFine] = useState(false);

    const locations = ['Colombo', 'Kandy', 'Galle', 'Nuwara Eliya', 'Jaffna'];
    const languages = ['English', 'Korean', 'Russian', 'Japanese', 'Sinhala'];

    const onDayPress = (day: { dateString: string }) => {
        setSelectedDates((prev) => {
            const date = day.dateString;
            const updated = { ...prev };
            if (updated[date]) {
                delete updated[date]; // Unselect
            } else {
                updated[date] = { selected: true, selectedColor: '#007BFF' };
            }
            return updated;
        });
    };

    const handleSubmit = () => {
        if (!lan || !selectedDates || !location) {
            alert('Please fill in all fields.');
            return;
        }
        setModalVisible(false);
        setFine(true)
    };

    const displayDates = Object.keys(selectedDates)
        .sort()
        .map(date => new Date(date).toDateString())
        .join(', ');

    useFocusEffect(
        useCallback(() => {
            if (Object.keys(selectedDates).length === 0) {
                setModalVisible(true);
            }
        }, [selectedDates])
    );

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

    // const handleSubmit = () => {
    //     fetch(`${backendUrl}/student/add`, {
    //         method: 'POST',
    //         headers: { 'Content-Type': 'application/json' },
    //         body: JSON.stringify({ name, address }),
    //     })
    //         .then((res) => res.text())
    //         .then((data) => {
    //             console.log(data);
    //             Alert.alert('Success', 'Student added!');
    //         })
    //         .catch((err) => {
    //             console.error('Error:', err);
    //             Alert.alert('Error', 'Failed to add student');
    //         });
    // };

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

            <Modal
                animationType="fade"
                transparent={true}
                visible={isModalVisible}
                onRequestClose={() => {
                    if (Object.keys(selectedDates).length === 0) return;
                    setModalVisible(false);
                }}
            >
                <View className="h-full justify-center items-center bg-black/50">
                    <View className="w-[90%] h-[96%] bg-white my-4 p-2 rounded-2xl   items-center">
                        <View className='w-full'>
                            <TouchableOpacity onPress={() => { setModalVisible(false); if (!fine || Object.keys(selectedDates).length === 0) router.back() }}>
                                {(fine && Object.keys(selectedDates).length !== 0) ? <Text> Cancel</Text> : <Text> Back</Text>}
                            </TouchableOpacity>
                            <Text className="text-xl font-bold mb-8 text-center">Enter Travel Details</Text>
                        </View>
                        <View className='w-full gap-8 h-full'>
                            <Calendar
                                style={{ width: 320, maxWidth: '100%' }}
                                onDayPress={onDayPress}
                                markedDates={selectedDates}
                                minDate={new Date().toISOString().split('T')[0]}
                                theme={{
                                    todayTextColor: '#007BFF',
                                    arrowColor: '#007BFF',
                                }}
                            />

                            <View className="w-full h-[35%] relative z-20 mt-4 gap-16">
                                <TouchableOpacity
                                    onPress={() => { setShowDropdown(!showDropdown); if (show) setShow(false) }}
                                    className="border border-gray-300 rounded-xl px-4 py-3 bg-white w-full"
                                >
                                    <Text className={`text-base ${location ? 'text-black' : 'text-gray-400'}`}>
                                        {location || 'Select Location'}
                                    </Text>
                                </TouchableOpacity>
                                {showDropdown && (
                                    <View className="absolute top-[52px] left-0 right-0 bg-white border border-gray-300 rounded-xl z-30 max-h-40">
                                        <ScrollView>
                                            {locations.map((loc, index) => (
                                                <TouchableOpacity
                                                    key={index}
                                                    onPress={() => {
                                                        setLocation(loc);
                                                        setShowDropdown(false);
                                                    }}
                                                    className={`px-4 py-2 ${location === loc ? 'bg-blue-100' : ''}`}
                                                >
                                                    <Text className="text-base">{loc}</Text>
                                                </TouchableOpacity>
                                            ))}
                                        </ScrollView>
                                    </View>
                                )}
                                <TouchableOpacity
                                    onPress={() => { setShow(!show) }}
                                    className="border border-gray-300 rounded-xl px-4 py-3 bg-white"
                                >
                                    <Text className={`text-base ${lan ? 'text-black' : 'text-gray-400'}`}>
                                        {lan || 'Select Language'}
                                    </Text>
                                </TouchableOpacity>
                                {show && (
                                    <View className="absolute top-[152px] left-0 right-0 bg-white border border-gray-300 rounded-xl z-30 max-h-40">
                                        <ScrollView>
                                            {languages.map((l, index) => (
                                                <TouchableOpacity
                                                    key={index}
                                                    onPress={() => {
                                                        setLan(l);
                                                        setShow(false);
                                                    }}
                                                    className={`px-4 py-2 ${lan === l ? 'bg-blue-100' : ''}`}
                                                >
                                                    <Text className="text-base">{l}</Text>
                                                </TouchableOpacity>
                                            ))}
                                        </ScrollView>
                                    </View>
                                )}
                            </View>

                            <View className="w-full space-y-8 justify-evenly">

                                <TouchableOpacity
                                    onPress={handleSubmit}
                                    className="bg-blue-600 py-3 rounded-xl"
                                >
                                    <Text className="text-white text-center font-semibold">Submit</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>

            <View className="flex-row justify-between items-center p-4">
                <Text className="text-lg font-medium">{displayDates}</Text>
                <TouchableOpacity onPress={() => setModalVisible(true)} className="bg-gray-200 py-2 px-4 rounded-lg">
                    <Text className="font-semibold text-blue-600">Change</Text>
                </TouchableOpacity>
            </View>

            <Text className='text-[24px] font-semibold mx-5 my-2'>Category</Text>

            <View className='w-full gap-5 items-center'>
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
