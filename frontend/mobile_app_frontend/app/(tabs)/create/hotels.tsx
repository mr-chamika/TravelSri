import React, { useState, useMemo, useCallback, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, FlatList, TextInput, Modal } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { cssInterop } from 'nativewind';
import { Image } from 'expo-image';
import { Calendar } from 'react-native-calendars';
import AsyncStorage from "@react-native-async-storage/async-storage";

cssInterop(Image, { className: "style" });

const mark = require('../../../assets/images/tabbar/create/location/mark.png');
const pic = require('../../../assets/images/tabbar/create/location/h.png');
const star = require('../../../assets/images/tabbar/create/hotel/stars.png');

const LOCATIONS = ['Colombo', 'Kandy', 'Galle', 'Nuwara Eliya', 'Jaffna'];

interface Book {
    dates: string[];
    loc: string;
    ad: string;
    ch: string;
    ni: string;
}

interface Hotel {
    id: string;
    image: any;
    title: string;
    stars: number;
    price: number
}

const hotels: Hotel[] = [
    { id: '1', image: pic, title: 'Shangri-La', stars: 3, price: 1000 },
    { id: '2', image: pic, title: 'Bawana', stars: 1, price: 1000 },
    { id: '3', image: pic, title: 'Matara bath kade', stars: 2, price: 1000 },
    { id: '4', image: pic, title: 'Raheema', stars: 5, price: 1000 },
];

export default function HotelsBookingScreen() {

    const categories = [
        {
            id: '1',
            members: 2,
            title: 'Tuk',
            price: 100
        },
        {
            id: '2',
            members: 3,
            title: 'Mini',
            price: 200
        },
        {
            id: '3',
            members: 4,
            title: 'Seddan',
            price: 250
        },
        {
            id: '4',
            members: 5,
            title: 'Van',
            price: 350
        },
        {
            id: '5',
            members: 54,
            title: 'Non A/C',
            price: 5000
        },
        {
            id: '6',
            members: 35,
            title: 'A/C',
            price: 15000
        }
    ]



    const guides = [
        {
            id: '1',
            image: pic,
            title: 'Theekshana',
            stars: 3,
            verified: true,
            identified: true,
            price: 1000
        },
        {
            id: '2',
            image: pic,
            title: 'Teshini',
            stars: 1,
            verified: true,
            identified: true,
            price: 2000
        },
        {
            id: '3',
            image: pic,
            title: 'Sudewa',
            stars: 2,
            verified: true,
            identified: true,
            price: 3000
        },
        {
            id: '4',
            image: pic,
            title: 'Bimsara',
            stars: 5,
            verified: true,
            identified: true,
            price: 4000
        },
        {
            id: '5',
            image: pic,
            title: 'Tharusha',
            stars: 3,
            verified: true,
            identified: true,
            price: 5000
        },
        {
            id: '6',
            image: pic,
            title: 'Viduranga',
            stars: 1,
            verified: true,
            identified: true,
            price: 6000
        },
        {
            id: '7',
            image: pic,
            title: 'Chamika',
            stars: 2,
            verified: true,
            identified: true,
            price: 7000
        },
        {
            id: '8',
            image: pic,
            title: 'Thathsara',
            stars: 5,
            verified: true,
            identified: true,
            price: 8000
        },
    ];


    const router = useRouter();

    const [selectedDates, setSelectedDates] = useState<{ [key: string]: { selected: boolean; selectedColor: string } }>({});
    const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [bookingComplete, setBookingComplete] = useState(false);
    const [book, setBook] = useState<Book[] | null>([]);
    const [adults, setAdults] = useState('');
    const [children, setChildren] = useState('');
    const [nights, setNights] = useState('');
    const [location, setLocation] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [total, setTotal] = useState('');

    const sortedLocations = useMemo(() => {
        if (!location) return LOCATIONS;
        return [location, ...LOCATIONS.filter((loc) => loc !== location)];
    }, [location]);

    const displayDates = useMemo(() => {
        return Object.keys(selectedDates).sort().map(date => new Date(date).toDateString()).join(', ');
    }, [selectedDates]);

    const toggleCardSelection = useCallback((index: number) => {
        let newIndex: number | null = null;
        setSelectedCardIndex(prev => {
            newIndex = prev === index ? null : index;
            return newIndex;
        });
        // Update AsyncStorage after state change
        const updateStorage = async () => {
            try {
                await AsyncStorage.setItem('hotel', newIndex !== null ? (newIndex + 1).toString() : '');
            } catch (error) {
                console.error('Error saving selectedCardIndex to AsyncStorage:', error);
            }
        };
        updateStorage();
    }, []);

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

    const handleSubmit = async () => {
        if (Object.keys(selectedDates).length === 0 || !location || !adults || !children || !nights) {
            alert('Please fill in all fields.');
            return;
        }
        const newBooking = [{ dates: Object.keys(selectedDates), loc: location, ad: adults, ch: children, ni: nights }];
        setBook(newBooking);
        setModalVisible(false);
        setBookingComplete(true);
        try {
            await AsyncStorage.setItem('hbookings', JSON.stringify(newBooking));
            await AsyncStorage.setItem('hbookingComplete', 'true');
            await AsyncStorage.setItem('hbookingSession', Date.now().toString());
            //alert('Booking saved to AsyncStorage');
        } catch (error) {
            alert(`Error saving booking to AsyncStorage: ${error}`);
        }
    };

    const loadBookingData = async () => {
        try {
            const sessionExists = await AsyncStorage.getItem('hbookingSession');
            const bookingCompleteStatus = await AsyncStorage.getItem('hbookingComplete');
            const savedIndex = await AsyncStorage.getItem('hotel');

            if (savedIndex) {
                setSelectedCardIndex(Number(savedIndex) - 1); // Persist selected hotel
            }

            if (!sessionExists) {
                // No session exists, create a new one and show modal
                await AsyncStorage.setItem('hbookingSession', Date.now().toString());
                setModalVisible(true);
                setBookingComplete(false);
            } else if (bookingCompleteStatus === 'true') {
                // Booking is complete, load saved data and hide modal
                setModalVisible(false);
                setBookingComplete(true);
                const savedBookings = await AsyncStorage.getItem('hbookings');
                if (savedBookings) {
                    const bookingData = JSON.parse(savedBookings);
                    setBook(bookingData);
                    if (bookingData.length > 0) {
                        const booking = bookingData[0];
                        // Reconstruct selectedDates object from saved dates array
                        const dates = booking.dates.reduce((acc: any, date: string) => {
                            acc[date] = { selected: true, selectedColor: '#007BFF' };
                            return acc;
                        }, {});
                        setSelectedDates(dates);
                        setLocation(booking.loc);
                        setAdults(booking.ad);
                        setChildren(booking.ch);
                        setNights(booking.ni);
                    }
                }
            } else {
                // Session exists but booking not complete, show modal
                setModalVisible(true);
                setBookingComplete(false);
            }
        } catch (error) {
            console.error('Error loading data from AsyncStorage:', error);
            setModalVisible(true); // Default to showing modal on error
        }
    };

    useEffect(() => {
        loadBookingData();
    }, []);

    useFocusEffect(
        useCallback(() => {
            loadBookingData();
            count()
        }, [])
    );
    useFocusEffect(
        useCallback(() => {

            count()
        }, [selectedCardIndex, total])
    );

    // useFocusEffect(
    //     useCallback(() => {
    //         const calculateTotal = async () => {
    //             try {
    //                 const baseTotal = await AsyncStorage.getItem('total');
    //                 const base = baseTotal ? Number(baseTotal) : 0;

    //                 if (selectedCardIndex !== null) {
    //                     const hotel = hotels.find(h => Number(h.id) === selectedCardIndex);
    //                     if (hotel) {
    //                         const newTotal = base + hotel.price;
    //                         setTotal(newTotal.toString());
    //                         await AsyncStorage.setItem('total', newTotal.toString());
    //                     } else {
    //                         alert('Hotel not exists');
    //                     }
    //                 } else {
    //                     setTotal(base.toString());
    //                 }
    //             } catch (error) {
    //                 console.error('Error calculating total:', error);
    //                 alert('Error calculating total price');
    //             }
    //         };

    //         calculateTotal();
    //     }, [selectedCardIndex])
    // );
    const count = async () => {

        try {
            let total = 0;

            // Car Booking Price
            const carIndex = await AsyncStorage.getItem('car');
            if (carIndex) {
                const category = categories.find(cat => cat.id === (Number(carIndex) - 1).toString());
                if (category) {
                    total += category.price;
                }
            }

            // Guide Booking Price
            const guideIndex = await AsyncStorage.getItem('guide');
            if (guideIndex !== null && guideIndex >= '0') {
                const guide = guides.find(guide => guide.id === (Number(guideIndex) - 1).toString());
                if (guide) {
                    total += guide.price;
                }
            }

            // Hotel Booking Price
            const hotelIndex = await AsyncStorage.getItem('hotel');
            if (hotelIndex) {
                const hotel = hotels.find(hotel => hotel.id === (Number(hotelIndex) - 1).toString());
                if (hotel) {
                    total += hotel.price;
                }
            }

            setTotal(total.toString());
        } catch (error) {
            console.error('Error calculating total price from AsyncStorage:', error);
            setTotal('0');
        }

    }




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
                    <View className="h-full bg-black/50 justify-center items-center">
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
                                                style={{ maxHeight: 90 }}
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
                                className="w-full h-[81%]"
                                contentContainerClassName="flex-row flex-wrap justify-center items-start gap-3 py-5"
                                showsVerticalScrollIndicator={false}
                            >
                                {hotels.map((hotel, index) => (
                                    <View key={index} className="bg-[#fbfbfb] w-[175px] h-[155px] items-center py-1 rounded-2xl border-2 border-gray-300">
                                        <TouchableOpacity
                                            onPress={() => router.push(`/views/hotel/group/${(Number(hotel.id) + 1).toString()}`)}
                                            className="w-full h-full"
                                        >
                                            <View className="h-full ">
                                                <View className="w-full h-[75%]">
                                                    <View className="w-full absolute items-end pr-2 pt-1 z-10">
                                                        <TouchableOpacity
                                                            className="justify-center items-center w-6 h-6 rounded-full bg-gray-200"
                                                            onPress={() => toggleCardSelection(index + 1)}
                                                        >
                                                            {Number(selectedCardIndex) - 1 === index && (
                                                                <Image className='w-4 h-4' source={mark} />
                                                            )}
                                                        </TouchableOpacity>
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

                        <View className="p-4 border-t border-gray-200 bg-white">
                            {

                                <Text className="text-center font-bold text-lg">{total}.00 LKR</Text>

                            }
                        </View>
                    </>
                )}
            </View>
        </View>
    );
}
