import { Text, View, ScrollView, TouchableOpacity, Modal, TextInput } from 'react-native';
import { useState, useCallback } from 'react';
import { Calendar } from 'react-native-calendars';
import { cssInterop } from 'nativewind';
import { Image } from 'expo-image';
import { useRouter, useFocusEffect } from 'expo-router';

cssInterop(Image, { className: "style" });

const router = useRouter();

const cross = require('../../assets/images/cross.png');
const mark = require('../../assets/images/tabbar/create/location/mark.png');
const pic = require('../../assets/images/tabbar/create/location/h.png');
const star = require('../../assets/images/tabbar/create/hotel/stars.png');
const tele = require('../../assets/images/tabbar/create/guide/telephones.png')

interface Guide {
    id: string;
    image: any;
    title: string;
    stars: number;
    verified: boolean;
    identified: boolean

}
const guides: Guide[] = [
    {
        id: '1',
        image: pic,
        title: 'Theekshana',
        stars: 3,
        verified: true,
        identified: true,
    },
    {
        id: '2',
        image: pic,
        title: 'Teshini',
        stars: 1,
        verified: true,
        identified: true,
    },
    {
        id: '3',
        image: pic,
        title: 'Sudewa',
        stars: 2,
        verified: true,
        identified: true,
    },
    {
        id: '4',
        image: pic,
        title: 'Bimsara',
        stars: 5,
        verified: true,
        identified: true,
    },
    {
        id: '5',
        image: pic,
        title: 'Tharusha',
        stars: 3,
        verified: true,
        identified: true,
    },
    {
        id: '6',
        image: pic,
        title: 'Viduranga',
        stars: 1,
        verified: true,
        identified: true,
    },
    {
        id: '7',
        image: pic,
        title: 'Chamika',
        stars: 2,
        verified: true,
        identified: true,
    },
    {
        id: '8',
        image: pic,
        title: 'Thathsara',
        stars: 5,
        verified: true,
        identified: true,
    },
    {
        id: '7',
        image: pic,
        title: 'Chamika',
        stars: 2,
        verified: true,
        identified: true,
    },
    {
        id: '8',
        image: pic,
        title: 'Thathsara',
        stars: 5,
        verified: true,
        identified: true,
    },
    // { id: '2', image: bg, title: 'Galle to Kurunegala', duration: 1, date: '05 july 2021', stats: 'Pending', price: 2300, max: 10, current: 13, routes: [{ place: 'peradeniya Botnical Garden', images: g }, { place: 'Sri Dalada Maligawa', images: l }, { place: 'Kandy Lake Round', images: te }] },
    // { id: '3', image: t, title: 'Colombo to jaffna', duration: 4, date: '06 aug 2022', stats: 'Cancelled', price: 1500, max: 25, current: 10, routes: [{ place: 'peradeniya Botnical Garden', images: g }, { place: 'Sri Dalada Maligawa', images: l }, { place: 'Kandy Lake Round', images: te }] },
    // { id: '4', image: pic, title: 'Matara to Kandy', duration: 10, date: '07 sept 2023', stats: 'Pending', price: 9000, max: 10, current: 4, routes: [{ place: 'peradeniya Botnical Garden', images: g }, { place: 'Sri Dalada Maligawa', images: l }, { place: 'Kandy Lake Round', images: te }] },
    // { id: '5', image: bg, title: 'Galle to Dehiwala', duration: 2, date: '08 oct 2024', stats: 'Pending', price: 1800, max: 15, current: 10, routes: [{ place: 'peradeniya Botnical Garden', images: g }, { place: 'Sri Dalada Maligawa', images: l }, { place: 'Kandy Lake Round', images: te }] },
    // { id: '6', image: t, title: 'Matale to Rajarata', duration: 6, date: '09 nov 2025', stats: 'Confirm', price: 700, max: 30, current: 24, routes: [{ place: 'peradeniya Botnical Garden', images: g }, { place: 'Sri Dalada Maligawa', images: l }, { place: 'Kandy Lake Round', images: te }] },

];


export default function Guide() {

    const [selectedDates, setSelectedDates] = useState<{ [key: string]: { selected: boolean; selectedColor: string } }>({});
    const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(null);
    const [isModalVisible, setModalVisible] = useState(true);
    const [fine, setFine] = useState(false);


    const [location, setLocation] = useState('');
    const [lan, setLan] = useState('');

    const [showDropdown, setShowDropdown] = useState(false);
    const [show, setShow] = useState(false);
    const locations = ['Colombo', 'Kandy', 'Galle', 'Nuwara Eliya', 'Jaffna'];
    const languages = ['English', 'Korean', 'Russian', 'Japanese', 'Sinhala'];

    const starCounts = [2, 2, 2, 5, 1, 0, 3];

    const toggleCardSelection = (index: number) => {
        setSelectedCardIndex(prev => (prev === index ? null : index));
    };

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
        if (Object.keys(selectedDates).length === 0 || !location || !lan) {
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

    return (
        <View className='bg-[#F2F5FA] h-full'>
            <View className='bg-[#F2F5FA] h-full'>
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
                        <View className="w-[93%] h-[97%] bg-white my-4 p-6 rounded-2xl   items-center">
                            <View className='w-full'>
                                <TouchableOpacity onPress={() => { setModalVisible(false); if (!fine || Object.keys(selectedDates).length === 0) router.back() }}>
                                    {(fine && Object.keys(selectedDates).length !== 0) ? <Text> Cancel</Text> : <Text> Back</Text>}
                                </TouchableOpacity>
                                <Text className="text-xl font-bold mb-8 text-center">Guide Booking</Text>
                            </View>
                            <View className='w-full flex-1'>
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
                                <View className="w-full p-2 bg-white h-[30%] ">
                                    <View className='justify-between'>
                                        <View className="w-full h-[80%] relative z-20 mt-4 gap-6">
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
                                                <View className="absolute top-[130px] left-0 right-0 bg-white border border-gray-300 rounded-xl z-30 max-h-40">
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
                                        <View className="w-full h-full bottom-0">

                                            <TouchableOpacity
                                                onPress={handleSubmit}
                                                className="bg-[#FEFA17] py-3 rounded-xl"
                                            >
                                                <Text className="text-black text-center font-semibold">Submit</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                </Modal>

                {Object.keys(selectedDates).length > 0 && (
                    <>
                        <View className="flex-row justify-between items-center p-4">
                            <Text className="text-lg font-medium">{displayDates}</Text>
                            <TouchableOpacity onPress={() => setModalVisible(true)} className="bg-gray-200 py-2 px-4 rounded-lg">
                                <Text className="font-semibold text-blue-600">Change</Text>
                            </TouchableOpacity>
                        </View>

                        {/* <View className="px-4 space-y-1">
                            <Text className="text-sm">📍 Location: {location}</Text>
                            <Text className="text-sm">👤 Adults: {adults}</Text>
                            <Text className="text-sm">🧒 Children: {children}</Text>
                            <Text className="text-sm">🌙 Nights: {nights}</Text>
                        </View> */}

                        <View>
                            <ScrollView
                                className="w-full h-[88%]"
                                contentContainerClassName="flex-row flex-wrap justify-center items-start gap-3 py-5"
                                showsVerticalScrollIndicator={false}
                            >
                                {guides.map((x, index) => (
                                    <View key={index} className="bg-[#fbfbfb] w-[175px] h-[155px] py-1 rounded-2xl border-2 border-gray-300">

                                        <TouchableOpacity onPress={() => router.push(`/views/guide/solo/${x.id}`)}>
                                            <View className='h-full py-3 justify-between'>

                                                <View className="w-full absolute items-end pr-1 z-10">
                                                    <TouchableOpacity
                                                        className="justify-center items-center w-6 h-6 rounded-full bg-gray-200"
                                                        onPress={() => toggleCardSelection(index)}
                                                    >
                                                        {selectedCardIndex === index && (
                                                            <Image className='w-4 h-4' source={mark} />
                                                        )}
                                                    </TouchableOpacity>
                                                </View>
                                                <View className='flex-row gap-5 px-3  w-44'>
                                                    <Image
                                                        className=' w-[50px] h-[50px] rounded-full'
                                                        source={x.image}
                                                        contentFit="cover"
                                                    />
                                                    <View className=''>
                                                        <Text className="text-md font-semibold w-24 max-h-12 pt-2">{x.title}</Text>
                                                        <View className="flex-row justify-start mt-1">
                                                            {[...Array(x.stars)].map((_, i) => (
                                                                <Image key={i} className="w-3 h-3 mx-0.5" source={star} />
                                                            ))}
                                                        </View>
                                                    </View>

                                                </View>
                                                <View className='w-full mt-4 gap-2'>
                                                    <View className='gap-6 flex-row w-full  pl-5'>
                                                        <Image className='w-5 h-5' source={tele}></Image>
                                                        <Text className="text-md">Phone Verified</Text>
                                                    </View>
                                                    <View className='gap-6 flex-row w-full pl-5'>
                                                        <Image className='w-5 h-5' source={mark}></Image>
                                                        <Text className="text-">Identify Verified</Text>
                                                    </View>

                                                </View>
                                                {/* <TouchableOpacity
                                            className='mt-3 rounded-lg w-[90%] h-6 bg-[#FEFA17] self-center'
                                            onPress={() => alert('mn guide')}
                                        >
                                            <Text className='text-center font-semibold'>View</Text>

                                        </TouchableOpacity> */}

                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                )
                                )
                                }
                            </ScrollView>
                        </View>
                        {/*  <View className="p-4 border-t border-gray-200 bg-white">
                            <Text className="text-center font-bold text-lg">Total: 1000 LKR</Text>
                        </View> */}
                    </>
                )}

            </View>
        </View>
    );
}
