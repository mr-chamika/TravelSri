import { Text, View, ScrollView, TouchableOpacity, Modal, TextInput } from 'react-native';
import { useState, useCallback } from 'react';
import { Calendar } from 'react-native-calendars';
import { cssInterop } from 'nativewind';
import { Image } from 'expo-image';
import { useRouter, useFocusEffect } from 'expo-router';

cssInterop(Image, { className: "style" });

const router = useRouter();

const mark = require('../../assets/images/tabbar/create/location/mark.png');
const pic = require('../../assets/images/tabbar/create/location/h.png');
const star = require('../../assets/images/tabbar/create/hotel/stars.png');
const tele = require('../../assets/images/tabbar/create/guide/telephones.png')

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
                        <View className="w-[93%] h-[97%] bg-white my-4 p-2 rounded-2xl   items-center">
                            <View className='w-full'>
                                <TouchableOpacity onPress={() => { setModalVisible(false); if (!fine || Object.keys(selectedDates).length === 0) router.back() }}>
                                    {(fine && Object.keys(selectedDates).length !== 0) ? <Text> Cancel</Text> : <Text> Back</Text>}
                                </TouchableOpacity>
                                <Text className="text-xl font-bold mb-8 text-center">Guide Hiring</Text>
                            </View>
                            <View className='w-full gap-5 h-full'>
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

                                <View className="w-full">

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
                </Modal>

                {Object.keys(selectedDates).length > 0 && (
                    <>
                        <View className="flex-row justify-between items-center p-4">
                            <Text className="text-lg font-medium">{displayDates}</Text>
                            <TouchableOpacity onPress={() => setModalVisible(true)} className="bg-gray-200 py-2 px-4 rounded-lg">
                                <Text className="font-semibold text-blue-600">Change</Text>
                            </TouchableOpacity>
                        </View>
                        <Text className="font-extrabold text-3xl text-center my-10">Guide Services</Text>

                        {/* <View className="px-4 space-y-1">
                            <Text className="text-sm">📍 Location: {location}</Text>
                            <Text className="text-sm">👤 Adults: {adults}</Text>
                            <Text className="text-sm">🧒 Children: {children}</Text>
                            <Text className="text-sm">🌙 Nights: {nights}</Text>
                        </View> */}

                        <View className="h-full flex-1">
                            <ScrollView

                                contentContainerClassName="flex-row flex-wrap justify-center items-start gap-5 py-3"
                                showsVerticalScrollIndicator={false}
                            >
                                {starCounts.map((starCount, index) => (
                                    <View key={index} className="bg-[#fbfbfb] w-[170px] h-[155px] items-center py-1 rounded-2xl border-2 border-gray-300">
                                        {/* <View className="w-full flex-row absolute justify-end px-3 pt-1 z-10">
                                            <TouchableOpacity
                                            className="w-6 h-6 rounded-full justify-center items-center border-2 bg-gray-200"
                                            onPress={() => toggleCardSelection(index)}
                                            >
                                            {selectedCardIndex === index && (
                                                    <Image className='w-4 h-4' source={mark} />
                                                    )}
                                                    </TouchableOpacity>
                                                    </View> */}
                                        <View className='flex-row mt-2 gap-2'>
                                            <Image
                                                className='w-[50px] h-[50px] rounded-full'
                                                source={pic}
                                                contentFit="cover"
                                            />
                                            <View>
                                                <Text className="text-lg font-semibold text-center">Guide #{index + 1}</Text>
                                                <View className="flex-row justify-start mt-1">
                                                    {[...Array(starCount)].map((_, i) => (
                                                        <Image key={i} className="w-3 h-3 mx-0.5" source={star} />
                                                    ))}
                                                </View>
                                            </View>
                                        </View>
                                        <View className='w-full mt-4 gap-2'>
                                            <View className='gap-6 flex-row w-full  pl-10'>
                                                <Image className='w-[14px] h-[14px]' source={tele}></Image>
                                                <Text className="text-[10px]">Phone Verified</Text>
                                            </View>
                                            <View className='gap-6 flex-row w-full pl-10'>
                                                <Image className='w-[14px] h-[14px]' source={mark}></Image>
                                                <Text className="text-[10px]">Identify Verified</Text>
                                            </View>

                                        </View>
                                        <TouchableOpacity
                                            className='mt-3 rounded-lg w-[90%] h-6 bg-[#FEFA17]'
                                            onPress={() => alert('mn guide')}
                                        >
                                            <Text className='text-center font-semibold'>View</Text>

                                        </TouchableOpacity>
                                    </View>
                                )
                                )
                                }
                            </ScrollView>
                        </View>
                    </>
                )}
            </View>
        </View>
    );
}
