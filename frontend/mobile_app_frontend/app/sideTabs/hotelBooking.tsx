import React, { useState, useMemo, useCallback, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, FlatList, TextInput, Modal } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { cssInterop } from 'nativewind';
import { Image } from 'expo-image';
import { Calendar } from 'react-native-calendars';

cssInterop(Image, { className: "style" });

const router = useRouter();

const mark = require('../../assets/images/tabbar/create/location/mark.png');
const pic = require('../../assets/images/tabbar/create/location/h.png');
const star = require('../../assets/images/tabbar/create/hotel/stars.png');

const LOCATIONS = ['Colombo', 'Kandy', 'Galle', 'Nuwara Eliya', 'Jaffna'];

interface Hotel {
    id: string;
    image: any;
    title: string;
    stars: number;

}
const hotels: Hotel[] = [
    {
        id: '1',
        image: pic,
        title: 'Shangri-La',
        stars: 3,
    },
    {
        id: '2',
        image: pic,
        title: 'Bawana',
        stars: 1,
    },
    {
        id: '1',
        image: pic,
        title: 'Shangri-La',
        stars: 3,
    },
    {
        id: '2',
        image: pic,
        title: 'Bawana',
        stars: 1,
    },
    {
        id: '3',
        image: pic,
        title: 'Matara bath kade',
        stars: 2,
    },
    {
        id: '4',
        image: pic,
        title: 'Raheema',
        stars: 5,
    },
    {
        id: '1',
        image: pic,
        title: 'Shangri-La',
        stars: 3,
    },
    {
        id: '2',
        image: pic,
        title: 'Bawana',
        stars: 1,
    },
    {
        id: '3',
        image: pic,
        title: 'Matara bath kade',
        stars: 2,
    },
    {
        id: '4',
        image: pic,
        title: 'Raheema',
        stars: 5,
    },
    // { id: '2', image: bg, title: 'Galle to Kurunegala', duration: 1, date: '05 july 2021', stats: 'Pending', price: 2300, max: 10, current: 13, routes: [{ place: 'peradeniya Botnical Garden', images: g }, { place: 'Sri Dalada Maligawa', images: l }, { place: 'Kandy Lake Round', images: te }] },
    // { id: '3', image: t, title: 'Colombo to jaffna', duration: 4, date: '06 aug 2022', stats: 'Cancelled', price: 1500, max: 25, current: 10, routes: [{ place: 'peradeniya Botnical Garden', images: g }, { place: 'Sri Dalada Maligawa', images: l }, { place: 'Kandy Lake Round', images: te }] },
    // { id: '4', image: pic, title: 'Matara to Kandy', duration: 10, date: '07 sept 2023', stats: 'Pending', price: 9000, max: 10, current: 4, routes: [{ place: 'peradeniya Botnical Garden', images: g }, { place: 'Sri Dalada Maligawa', images: l }, { place: 'Kandy Lake Round', images: te }] },
    // { id: '5', image: bg, title: 'Galle to Dehiwala', duration: 2, date: '08 oct 2024', stats: 'Pending', price: 1800, max: 15, current: 10, routes: [{ place: 'peradeniya Botnical Garden', images: g }, { place: 'Sri Dalada Maligawa', images: l }, { place: 'Kandy Lake Round', images: te }] },
    // { id: '6', image: t, title: 'Matale to Rajarata', duration: 6, date: '09 nov 2025', stats: 'Confirm', price: 700, max: 30, current: 24, routes: [{ place: 'peradeniya Botnical Garden', images: g }, { place: 'Sri Dalada Maligawa', images: l }, { place: 'Kandy Lake Round', images: te }] },

];


export default function HotelsBookingScreen() {
    const [selectedDates, setSelectedDates] = useState<{ [key: string]: { selected: boolean; selectedColor: string } }>({});
    const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [bookingComplete, setBookingComplete] = useState(false);

    const [adults, setAdults] = useState('');
    const [children, setChildren] = useState('');
    const [nights, setNights] = useState('');
    const [location, setLocation] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);

    //const hotels = [1, 1, 1, 2, 5, 1, 0, 3, 1, 1, 1, 2, 5, 1, 0, 3];

    const sortedLocations = useMemo(() => {
        if (!location) return LOCATIONS;
        return [location, ...LOCATIONS.filter((loc) => loc !== location)];
    }, [location]);

    const displayDates = useMemo(() => {
        return Object.keys(selectedDates).sort().map(date => new Date(date).toDateString()).join(', ');
    }, [selectedDates]);

    const toggleCardSelection = (index: number) => {
        setSelectedCardIndex(prev => (prev === index ? null : index));
    };

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

    const handleLocationSelect = (selectedLocation: string) => {
        setLocation(selectedLocation);
        setShowDropdown(false);
    };

    const handleSubmit = () => {
        if (Object.keys(selectedDates).length === 0 || !location || !adults || !children || !nights) {
            alert('Please fill in all fields.');
            return;
        }
        setModalVisible(false);
        setBookingComplete(true);
    };

    // Show modal initially
    useEffect(() => {
        if (!bookingComplete) {
            setModalVisible(true);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            if (!bookingComplete) {
                setModalVisible(true);
            }
        }, [bookingComplete])
    );

    return (
        <View className='bg-[#F2F5FA] h-full'>
            <View className='bg-[#F2F5FA] h-full'>
                {/* Booking Modal */}
                <Modal
                    visible={modalVisible}
                    transparent={true}
                    animationType="fade"
                    onRequestClose={() => {
                        if (bookingComplete) {
                            setModalVisible(false);
                        }
                    }}
                >
                    <View className="h-full  bg-black/50 justify-center items-center">
                        <View className="w-[93%] h-[97%] bg-white rounded-2xl overflow-hidden">
                            {/* Header */}
                            <View className='w-full p-6 pb-4'>
                                <TouchableOpacity
                                    className="self-start mb-2"
                                    onPress={() => {
                                        if (bookingComplete) {
                                            setModalVisible(false);
                                        } else {
                                            router.back();
                                        }
                                    }}
                                >
                                    <Text className="text-black text-base">
                                        {!bookingComplete ? "Back" : "Cancel"}
                                    </Text>
                                </TouchableOpacity>
                                <Text className="text-xl font-bold text-center">Hotel Booking</Text>
                            </View>

                            {/* Scrollable Content */}
                            <View className="flex-1 px-6">
                                <View className='w-full'>
                                    {/* Calendar */}
                                    <View className="w-full">
                                        <Calendar
                                            className='border-2 w-full rounded-lg'
                                            onDayPress={onDayPress}
                                            markedDates={selectedDates}
                                            minDate={new Date().toISOString().split('T')[0]}
                                            theme={{
                                                todayTextColor: '#007BFF',
                                                arrowColor: '#007BFF',
                                                calendarBackground: '#ffffff',
                                            }}
                                            style={{ paddingBottom: 10 }}
                                        />
                                    </View>

                                    {/* Location Selection */}
                                    <View className="w-full">
                                        <TouchableOpacity
                                            onPress={() => setShowDropdown(!showDropdown)}
                                            className="border border-gray-300 rounded-xl px-4 py-3 bg-white"
                                        >
                                            <Text className={`text-base ${location ? 'text-black' : 'text-gray-400'}`}>
                                                {location || 'Select Location'}
                                            </Text>
                                        </TouchableOpacity>
                                    </View>

                                    {/* Location Dropdown */}
                                    {showDropdown && (
                                        <View className="w-full bg-white rounded-xl border border-gray-200 mt-1">
                                            <FlatList
                                                data={sortedLocations}
                                                keyExtractor={(item) => item}
                                                style={{ maxHeight: 128 }}
                                                showsVerticalScrollIndicator={true}
                                                keyboardShouldPersistTaps="handled"
                                                nestedScrollEnabled={true}
                                                renderItem={({ item, index }) => (
                                                    <TouchableOpacity
                                                        onPress={() => handleLocationSelect(item)}
                                                        className={`px-4 py-3 ${location === item ? 'bg-blue-100' : ''} ${index < sortedLocations.length - 1 ? 'border-b border-gray-200' : ''}`}
                                                    >
                                                        <Text className="text-gray-700 text-center text-base">{item}</Text>
                                                    </TouchableOpacity>
                                                )}
                                            />
                                        </View>
                                    )}
                                </View>
                            </View>

                            {/* Fixed Bottom Section - Text Inputs and Button */}
                            <View className="w-full p-6 bg-white h-[25%]">
                                <View className="w-full gap-4 justify-between h-full">
                                    <View className='flex-row justify-between gap-3'>
                                        <TextInput
                                            placeholder="# Adults"
                                            placeholderTextColor="#8E8E8E"
                                            value={adults}
                                            onChangeText={(text) => {
                                                const numericText = text.replace(/[^0-9]/g, '');
                                                setAdults(numericText);
                                            }}
                                            keyboardType="numeric"
                                            className="text-black border border-gray-300 rounded-xl px-3 py-3 text-base flex-1"
                                        />
                                        <TextInput
                                            placeholder="# Children"
                                            placeholderTextColor="#8E8E8E"
                                            value={children}
                                            onChangeText={(text) => {
                                                const numericText = text.replace(/[^0-9]/g, '');
                                                setChildren(numericText);
                                            }}
                                            keyboardType="numeric"
                                            className="text-black border border-gray-300 rounded-xl px-3 py-3 text-base flex-1"
                                        />
                                        <TextInput
                                            placeholder="# Nights"
                                            placeholderTextColor="#8E8E8E"
                                            value={nights}
                                            onChangeText={(text) => {
                                                const numericText = text.replace(/[^0-9]/g, '');
                                                setNights(numericText);
                                            }}
                                            keyboardType="numeric"
                                            className="text-black border border-gray-300 rounded-xl px-3 py-3 text-base flex-1"
                                        />
                                    </View>

                                    <TouchableOpacity
                                        onPress={handleSubmit}
                                        className="bg-[#FEFA17] py-3 rounded-xl bottom-0"
                                    >
                                        <Text className="text-black text-center font-semibold text-base">Submit</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                </Modal>

                {/* Only show main content if booking is complete */}
                {bookingComplete && (
                    <>

                        <View className="flex-row justify-between items-center p-4">
                            <Text className="text-lg font-medium">{displayDates}</Text>
                            <TouchableOpacity
                                onPress={() => setModalVisible(true)}
                                className="bg-gray-200 py-2 px-4 rounded-lg"
                            >
                                <Text className="font-semibold text-blue-600">Change</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Hotel Cards */}
                        <View>
                            <ScrollView
                                className="w-full h-[86%]"
                                contentContainerClassName="flex-row flex-wrap justify-center items-start gap-3 py-5"
                                showsVerticalScrollIndicator={false}
                            >
                                {hotels.map((hotel, index) => (

                                    <View key={index} className="bg-[#fbfbfb] w-[175px] h-[155px] items-center py-1 rounded-2xl border-2 border-gray-300">


                                        <TouchableOpacity
                                            onPress={() => router.push(`/views/hotel/solo/${Number(hotel.id) + 1}`)}
                                            className="w-full h-full"
                                        >

                                            <View className="h-full ">
                                                <View className="w-full h-[75%]">
                                                    <View className="w-full absolute items-end pr-2 pt-1 z-10">
                                                        {/* <TouchableOpacity
                                                            className="justify-center items-center w-6 h-6 rounded-full bg-gray-200"
                                                            onPress={() => toggleCardSelection(index)}
                                                        >
                                                            {selectedCardIndex === index && (
                                                                <Image className='w-4 h-4' source={mark} />
                                                            )}
                                                        </TouchableOpacity> */}
                                                    </View>
                                                    <Image
                                                        className='w-[95%] h-full rounded-xl self-center'
                                                        source={pic}
                                                        contentFit="cover"
                                                    />
                                                </View>

                                                <View>
                                                    <Text className="text-sm font-semibold text-center" numberOfLines={1}>
                                                        {hotel.title}
                                                    </Text>
                                                    <View className="flex-row justify-center mt-1">
                                                        {[...Array(hotel.stars)].map((_, i) => (
                                                            <Image key={i} className="w-3 h-3 mx-0.5" source={star} />
                                                        ))}
                                                    </View>
                                                </View>


                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                ))}
                            </ScrollView>
                        </View>

                        {/* <View className="p-4 border-t border-gray-200 bg-white">
                            <Text className="text-center font-bold text-lg">Total: 1000 LKR</Text>
                        </View> */}
                    </>
                )}




            </View>
        </View>
    );
}
