import { Text, View, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { useState, useCallback } from 'react';
import { Calendar } from 'react-native-calendars';
import { cssInterop } from 'nativewind';
import { Image } from 'expo-image';
import { useRouter, useFocusEffect } from 'expo-router';
// 1. Import the new time picker component
import SimpleTimePicker from '../../../../../components/TimeSelector';

cssInterop(Image, { className: "style" });

const mark = require('../../../../../assets/images/mark.png');
const pic = require('../../../../../assets/images/tabbar/create/car/drv.png');
const star = require('../../../../../assets/images/tabbar/create/hotel/stars.png');
const tele = require('../../../../../assets/images/tabbar/create/guide/telephones.png');

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
    // { id: '2', image: bg, title: 'Galle to Kurunegala', duration: 1, date: '05 july 2021', stats: 'Pending', price: 2300, max: 10, current: 13, routes: [{ place: 'peradeniya Botnical Garden', images: g }, { place: 'Sri Dalada Maligawa', images: l }, { place: 'Kandy Lake Round', images: te }] },
    // { id: '3', image: t, title: 'Colombo to jaffna', duration: 4, date: '06 aug 2022', stats: 'Cancelled', price: 1500, max: 25, current: 10, routes: [{ place: 'peradeniya Botnical Garden', images: g }, { place: 'Sri Dalada Maligawa', images: l }, { place: 'Kandy Lake Round', images: te }] },
    // { id: '4', image: pic, title: 'Matara to Kandy', duration: 10, date: '07 sept 2023', stats: 'Pending', price: 9000, max: 10, current: 4, routes: [{ place: 'peradeniya Botnical Garden', images: g }, { place: 'Sri Dalada Maligawa', images: l }, { place: 'Kandy Lake Round', images: te }] },
    // { id: '5', image: bg, title: 'Galle to Dehiwala', duration: 2, date: '08 oct 2024', stats: 'Pending', price: 1800, max: 15, current: 10, routes: [{ place: 'peradeniya Botnical Garden', images: g }, { place: 'Sri Dalada Maligawa', images: l }, { place: 'Kandy Lake Round', images: te }] },
    // { id: '6', image: t, title: 'Matale to Rajarata', duration: 6, date: '09 nov 2025', stats: 'Confirm', price: 700, max: 30, current: 24, routes: [{ place: 'peradeniya Botnical Garden', images: g }, { place: 'Sri Dalada Maligawa', images: l }, { place: 'Kandy Lake Round', images: te }] },

];

export default function Car() {
    const router = useRouter();

    const [selectedDates, setSelectedDates] = useState<{ [key: string]: { selected: boolean; selectedColor: string } }>({});
    const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(null);
    const [isModalVisible, setModalVisible] = useState(true);

    const [locationx, setLocationx] = useState('');
    const [location, setLocation] = useState('');
    const [lan, setLan] = useState('');
    const [fine, setFine] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [showDropdowns, setShowDropdowns] = useState(false);

    const [show, setShow] = useState(false);

    // 2. Add state to hold the selected time
    const [selectedTime, setSelectedTime] = useState({ hour: 12, minute: 30 });

    const locations = ['Colombo', 'Kandy', 'Galle', 'Nuwara Eliya', 'Jaffna'];
    const languages = ['English', 'Korean', 'Russian', 'Japanese', 'Sinhala'];
    const starCounts = [2, 2, 2, 5, 1, 0, 3];

    const onDayPress = (day: { dateString: string }) => {
        setSelectedDates((prev) => {
            const date = day.dateString;
            const updated = { ...prev };
            if (updated[date]) {
                delete updated[date];
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
        // You can now use selectedTime here

        alert(`${Object.keys(selectedDates)},${locationx} to ${location}, ${lan}, and time (${selectedTime.hour}:${selectedTime.minute}) have been submitted!`);
        setModalVisible(false);
        setFine(true);
    };

    const toggleCardSelection = (index: number) => {
        setSelectedCardIndex(prev => (prev === index ? null : index));
    };
    const displayDates = Object.keys(selectedDates).sort().map(date => new Date(date).toDateString()).join(', ');

    useFocusEffect(useCallback(() => {
        if (Object.keys(selectedDates).length === 0) {
            setModalVisible(true);
        }
    }, [selectedDates]));

    return (
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
                    <View className="w-[93%] h-[97%] bg-white my-4 p-6 rounded-2xl shadow-lg items-center">
                        <TouchableOpacity className="self-start" onPress={() => { setModalVisible(false); if (!fine || Object.keys(selectedDates).length === 0) router.back() }}>
                            {(fine && Object.keys(selectedDates).length !== 0) ? <Text> Cancel</Text> : <Text> Back</Text>}
                        </TouchableOpacity>
                        <Text className="text-xl font-bold mb-4 text-center">Vehicle Booking</Text>

                        {/* 3. Wrap modal content in a ScrollView */}
                        {/* <ScrollView className="w-full h-full" contentContainerStyle={{ paddingBottom: 20 }}> */}
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
                                        <View className='w-[47%]'>
                                            <TouchableOpacity onPress={() => { setShowDropdowns(!showDropdowns); if (show) setShow(false); if (showDropdown) setShowDropdown(false) }} className="border border-gray-300 rounded-xl px-4 py-3 bg-white">
                                                <Text className={`text-sm ${locationx ? 'text-black' : 'text-gray-400'}`}>{locationx || 'Select Start Location'}</Text>
                                            </TouchableOpacity>
                                            {showDropdowns && (
                                                <View className="absolute top-[42px] bg-white border border-gray-300 rounded-xl z-30 max-h-40 w-full">
                                                    <ScrollView>{locations.map((loc, index) => (loc != location &&
                                                        <TouchableOpacity key={index} onPress={() => { setLocationx(loc); setShowDropdowns(false); }} className={`px-4 py-2 ${locationx === loc ? 'bg-blue-100' : ''}`}><Text className="text-base">{loc}</Text></TouchableOpacity>
                                                    ))}</ScrollView>
                                                </View>
                                            )}
                                        </View>
                                        <View className='w-[47%]'>

                                            <TouchableOpacity onPress={() => { setShowDropdown(!showDropdown); if (show) setShow(false); if (showDropdowns) setShowDropdowns(false) }} className="border border-gray-300 rounded-xl px-4 py-3 bg-white">
                                                <Text className={`text-sm ${location ? 'text-black' : 'text-gray-400'}`}>{location || 'Select End Location'}</Text>
                                            </TouchableOpacity>
                                            {showDropdown && (
                                                <View className="absolute top-[42px]  bg-white border border-gray-300 rounded-xl z-30 max-h-40 w-full">
                                                    <ScrollView>{locations.map((loc, index) => (loc != locationx &&
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
                            {/* 4. Add the SimpleTimePicker component */}
                            <View className='h-[25%] justify-between'>
                                <View>
                                    <Text>Choose a time</Text>
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
                            {/* </ScrollView> */}
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
                    <View>

                        <Text className='text-2xl text-center font-extrabold py-8'>Choose a driver</Text>

                        <ScrollView
                            className="w-full h-[81%]"
                            contentContainerClassName="flex-row flex-wrap justify-center items-start gap-5 py-5"
                        >
                            {guides.map((guide, index) => (
                                <TouchableOpacity key={index} onPress={() => router.push(`/views/car/solo/profile/${guide.id}`)}>
                                    <View className="bg-white w-[170px] h-[135px] pb-2 rounded-2xl border border-gray-200 justify-between">
                                        {/* <View className="w-full flex-row absolute justify-end pr-1 pt-1 z-10">
                                            <TouchableOpacity
                                                className="w-6 h-6 rounded-full justify-center items-center bg-gray-200"
                                                onPress={() => toggleCardSelection(index)}
                                            >
                                                {selectedCardIndex === index && (
                                                    <Image className='w-4 h-4' source={mark} />
                                                )}
                                            </TouchableOpacity>
                                        </View> */}
                                        <View className='flex-row mt-2 gap-2 items-center px-3'>
                                            <Image className='w-[50px] h-[50px] rounded-full' source={guide.image} contentFit="cover" />
                                            <View>
                                                <Text className="text-lg font-semibold">{guide.title}</Text>
                                                <View className="flex-row justify-start mt-1">
                                                    {[...Array(guide.stars)].map((_, i) => (
                                                        <Image key={i} className="w-3 h-3 mx-0.5" source={star} />
                                                    ))}
                                                </View>
                                            </View>
                                        </View>
                                        <View className='w-full mt-4 gap-1 items-center'>
                                            <View className='gap-4 flex-row items-center'><Image className='w-[14px] h-[14px]' source={tele}></Image><Text className="text-md">Phone Verified</Text></View>
                                            <View className='gap-4 flex-row items-center'><Image className='w-[14px] h-[14px]' source={mark}></Image><Text className="text-md">Identity Verified</Text></View>
                                        </View>

                                    </View>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>

                    </View>
                </>
            )}
        </View>
    );
}
