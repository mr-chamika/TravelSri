import { Text, View, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { useState, useCallback } from 'react';
import { Calendar } from 'react-native-calendars';
import { cssInterop } from 'nativewind';
import { Image } from 'expo-image';
import { useRouter, useFocusEffect } from 'expo-router';
// 1. Import the new time picker component
import SimpleTimePicker from '../../../components/TimeSelector'; // Adjust path if necessary

cssInterop(Image, { className: "style" });

const mark = require('../../../assets/images/tabbar/create/location/mark.png');
const pic = require('../../../assets/images/tabbar/create/car/drv.png');
const star = require('../../../assets/images/tabbar/create/hotel/stars.png');
const tele = require('../../../assets/images/tabbar/create/guide/telephones.png');

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
                                                    <ScrollView>{locations.map((loc, index) => (
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
                            {/* 4. Add the SimpleTimePicker component */}
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
                        <ScrollView
                            className="w-full h-[81%]"
                            contentContainerClassName="flex-row flex-wrap justify-center items-start gap-5 py-5"
                        >
                            {starCounts.map((starCount, index) => (
                                <View key={index} className="bg-white w-[170px] h-[155px] items-center py-1 rounded-2xl border border-gray-200">
                                    <View className='flex-row mt-2 gap-2 items-center'>
                                        <Image className='w-[50px] h-[50px] rounded-full' source={pic} contentFit="cover" />
                                        <View>
                                            <Text className="text-lg font-semibold">Driver #{index + 1}</Text>
                                            <View className="flex-row justify-start mt-1">
                                                {[...Array(starCount)].map((_, i) => (
                                                    <Image key={i} className="w-3 h-3 mx-0.5" source={star} />
                                                ))}
                                            </View>
                                        </View>
                                    </View>
                                    <View className='w-full mt-4 gap-2 pl-4'>
                                        <View className='gap-4 flex-row items-center'><Image className='w-[14px] h-[14px]' source={tele}></Image><Text className="text-[10px]">Phone Verified</Text></View>
                                        <View className='gap-4 flex-row items-center'><Image className='w-[14px] h-[14px]' source={mark}></Image><Text className="text-[10px]">Identity Verified</Text></View>
                                    </View>
                                    <TouchableOpacity className='mt-3 rounded-lg w-[90%] h-6 bg-[#FEFA17]' onPress={() => alert('mn driver')}>
                                        <Text className='text-center font-semibold text-black'>View</Text>
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </ScrollView>
                        <View className="p-4 border-t border-gray-200 bg-white">
                            <Text className="text-center font-bold text-lg">Total: 1000 LKR</Text>
                        </View>
                    </View>
                </>
            )}
        </View>
    );
}
