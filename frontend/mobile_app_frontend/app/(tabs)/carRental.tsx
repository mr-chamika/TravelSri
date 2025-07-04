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
import { useFocusEffect, useRouter } from 'expo-router';
import { Calendar } from 'react-native-calendars';
import SimpleTimePicker from '@/components/TimeSelector';
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

    const router = useRouter();

    const categories = [

        {

            id: '1',
            image: pic,
            members: 2,
            title: 'Tuk',
            price: 100

        },
        {

            id: '2',
            image: mini,
            members: 3,
            title: 'Mini',
            price: 200

        },
        {

            id: '3',
            image: sport,
            members: 4,
            title: 'Seddan',
            price: 250

        },
        {

            id: '4',
            image: car,
            members: 5,
            title: 'Van',
            price: 350

        },
        {

            id: '5',
            image: bus,
            members: 54,
            title: 'Non A/C',
            price: 5000

        },
        {

            id: '6',
            image: ac,
            members: 35,
            title: 'A/C',
            price: 15000

        }

    ]


    const [isModalVisible, setModalVisible] = useState(true);
    const [selectedDates, setSelectedDates] = useState<{ [key: string]: { selected: boolean; selectedColor: string } }>({});
    const [location, setLocation] = useState('');
    const [locationx, setLocationx] = useState('');
    const [lan, setLan] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [showDropdowns, setShowDropdowns] = useState(false);
    const [show, setShow] = useState(false);
    const [fine, setFine] = useState(false);

    const locations = ['Colombo', 'Kandy', 'Galle', 'Nuwara Eliya', 'Jaffna'];
    const languages = ['English', 'Korean', 'Russian', 'Japanese', 'Sinhala'];

    const [selectedTime, setSelectedTime] = useState({ hour: 12, minute: 30 });

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
        if (!lan || !selectedDates || !location || !locationx || (selectedTime.hour == 0 && selectedTime.minute == 0)) {
            alert('Please fill in all fields.');
            return;
        }
        setModalVisible(false);
        setFine(true)
        alert(`${Object.keys(selectedDates)},${locationx} to ${location}, ${lan}, and time (${selectedTime.hour}:${selectedTime.minute}) have been submitted!`);
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

            {/* <Modal
                animationType="fade"
                transparent={true}
                visible={isModalVisible}
                onRequestClose={() => {
                    if (Object.keys(selectedDates).length === 0) return;
                    setModalVisible(false);
                }}
            >
                <View className="h-full justify-center items-center bg-black/50">
                    <View className="w-[93%] h-[97%] bg-white my-4 p-6 rounded-2xl shadow-lg items-center">
                        <TouchableOpacity className="self-start" onPress={() => { setModalVisible(false); if (!fine || Object.keys(selectedDates).length === 0) router.back() }}>
                            {(fine && Object.keys(selectedDates).length !== 0) ? <Text> Cancel</Text> : <Text> Back</Text>}
                        </TouchableOpacity>
                        <Text className="text-xl font-bold mb-4 text-center">Vehicle Booking</Text>

                        
                         //<ScrollView className="w-full h-full" contentContainerStyle={{ paddingBottom: 20 }}>
                        <View className="w-full h-[93%] justify-between pb-3">
                            <View className='h-[73%]'>
                                <Calendar
                                    onDayPress={onDayPress}
                                    markedDates={selectedDates}
                                    minDate={new Date().toISOString().split('T')[0]}
                                    theme={{ todayTextColor: '#007BFF', arrowColor: '#007BFF' }}
                                />


                                <View className="w-full z-20 pb-32 gap-1 mt-2">
                                    <View className='flex-row justify-between'>
                                        <View className=' w-[47%]'>
                                            <TouchableOpacity onPress={() => { setShowDropdowns(!showDropdowns); if (show) setShow(false); if (showDropdown) setShowDropdown(false) }} className="border border-gray-300 rounded-xl px-4 py-3 bg-white">
                                                <Text className={`text-sm ${locationx ? 'text-black' : 'text-gray-400'}`}>{locationx || 'Select Start Location'}</Text>
                                            </TouchableOpacity>
                                            {showDropdowns && (
                                                <View className="absolute top-[42px] bg-white border border-gray-300 rounded-xl z-30 max-h-40 w-full">
                                                    <ScrollView>{locations.map((loc, index) => (
                                                        <TouchableOpacity key={index} onPress={() => { setLocationx(loc); setShowDropdowns(false); }} className={`px-4 py-2 ${locationx === loc ? 'bg-blue-100' : ''}`}><Text className="text-base">{loc}</Text></TouchableOpacity>
                                                    ))}</ScrollView>
                                                </View>
                                            )}
                                        </View>
                                        <View className=' w-[47%]'>

                                            <TouchableOpacity onPress={() => { setShowDropdown(!showDropdown); if (show) setShow(false); if (showDropdowns) setShowDropdowns(false) }} className="border border-gray-300 rounded-xl px-4 py-3 bg-white">
                                                <Text className={`text-sm ${location ? 'text-black' : 'text-gray-400'}`}>{location || 'Select End Location'}</Text>
                                            </TouchableOpacity>
                                            {showDropdown && (
                                                <View className="absolute top-[42px]  bg-white border border-gray-300 rounded-xl z-30 max-h-40 w-full">
                                                    <ScrollView>{locations.map((loc, index) => (
                                                        <TouchableOpacity key={index} onPress={() => { setLocation(loc); setShowDropdown(false); }} className={`px-4 py-2 ${location === loc ? 'bg-blue-100' : ''}`}><Text className="text-base">{loc}</Text></TouchableOpacity>
                                                    ))}</ScrollView>
                                                </View>
                                            )}
                                        </View>
                                    </View>
                                    <TouchableOpacity onPress={() => { setShow(!show); if (showDropdown) setShowDropdown(false); if (showDropdowns) setShowDropdowns(false); }} className="border border-gray-300 rounded-xl px-4 py-3 bg-white">
                                        <Text className={`text-base ${lan ? 'text-black' : 'text-gray-400'}`}>{lan || 'Select Language'}</Text>
                                    </TouchableOpacity>
                                    {show && (
                                        <View className="absolute top-[90px] left-4 right-4 bg-white border border-gray-300 rounded-xl z-30 max-h-40">
                                            <ScrollView>{languages.map((l, index) => (
                                                <TouchableOpacity key={index} onPress={() => { setLan(l); setShow(false); }} className={`px-4 py-2 ${lan === l ? 'bg-blue-100' : ''}`}><Text className="text-base">{l}</Text></TouchableOpacity>
                                            ))}</ScrollView>
                                        </View>
                                    )}
                                </View>
                            </View>
                            
                            <View className='h-[25%] justify-between'>
                                <View>
                                    <SimpleTimePicker onTimeChange={setSelectedTime} />
                                </View>
                                <View className="w-full">
                                    <TouchableOpacity
                                        onPress={handleSubmit}
                                        className="bg-[#FEFA17] py-3 rounded-xl"
                                    >
                                        <Text className="text-black text-center font-semibold">Submit</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            // </ScrollView>
                        </View>
                    </View>
                </View>
            </Modal> */}
            {/* {Object.keys(selectedDates).length > 0 && ( */}
            <>
                <View className="flex-row justify-between items-center p-4">
                    {/* <Text className="text-lg font-medium">{displayDates}</Text> */}
                    <Text className="text-2xl font-semibold">Category</Text>
                    {/*<TouchableOpacity onPress={() => setModalVisible(true)} className="bg-gray-200 py-2 px-4 rounded-lg">
                             <Text className="font-semibold text-blue-600">Change</Text> 
                        </TouchableOpacity>*/}
                </View>

                {/* <View className="px-4 space-y-1">
                            <Text className="text-sm">📍 Location: {location}</Text>
                            <Text className="text-sm">👤 Adults: {adults}</Text>
                            <Text className="text-sm">🧒 Children: {children}</Text>
                            <Text className="text-sm">🌙 Nights: {nights}</Text>
                        </View> */}

                <View>

                    <ScrollView
                        className="w-full h-[98%]"
                        contentContainerClassName="flex-row flex-wrap justify-center items-start gap-4"
                        showsVerticalScrollIndicator={false}
                    >
                        {categories.map((x, i) => {

                            return (
                                <TouchableOpacity key={i} onPress={() => router.push(`/views/car/solo/list/${x.id}`)}>


                                    <View className="bg-[#d9d9d98e] w-[170px] h-[190px] items-center  py-3 rounded-2xl justify-between">
                                        <View>
                                            <Image
                                                className="w-[90px] h-[90px]"
                                                source={x.image}
                                            />
                                            <View>
                                                <View className='flex-row items-center gap-4'>
                                                    <Image
                                                        className="w-[11px] h-[11px]"
                                                        source={p}
                                                    />
                                                    <Text className=" text-[13px] italic text-center">
                                                        {x.members} Members
                                                    </Text>
                                                </View>
                                                <View className='flex-row items-center gap-4 my-1'>
                                                    <Image
                                                        className="w-[11px] h-[11px]"
                                                        source={t}
                                                    />
                                                    <Text className=" text-[13px] italic text-center">
                                                        {x.title}
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>
                                        <View>
                                            <TouchableOpacity onPress={() => router.push(`/views/car/solo/list/${x.id}`)}>
                                                <View className="rounded-md bg-black justify-center w-32 h-5 items-center" >
                                                    <Text className=" text-white font-semibold text-[12px]">{x.price}.00 LKR/1km</Text>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </TouchableOpacity>

                            )
                        })
                        }

                    </ScrollView>
                </View>

            </>
            {/* )} */}

        </View>

    )
}
