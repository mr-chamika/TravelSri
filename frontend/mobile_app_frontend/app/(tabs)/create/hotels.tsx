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
    s: string;
    d: string
}

interface Hotel {
    id: string;
    image: any;
    title: string;
    stars: number;
    price: number
    beds: { type: string; price: number }[]
}

const hotels: Hotel[] = [
    { id: '1', image: pic, title: 'Shangri-La', stars: 3, price: 1000, beds: [{ type: 'double', price: 1000 }, { type: 'single', price: 500 }] },
    { id: '2', image: pic, title: 'Bawana', stars: 1, price: 2000, beds: [{ type: 'double', price: 1000 }, { type: 'single', price: 500 }] },
    { id: '3', image: pic, title: 'Matara bath kade', stars: 2, price: 3000, beds: [{ type: 'double', price: 1000 }, { type: 'single', price: 500 }] },
    { id: '4', image: pic, title: 'Raheema', stars: 5, price: 4000, beds: [{ type: 'double', price: 1000 }, { type: 'single', price: 500 }] },
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
    const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(null); // Stores the array index (0-based) of the selected hotel
    const [modalVisible, setModalVisible] = useState(false);
    const [bookingComplete, setBookingComplete] = useState(false);
    const [book, setBook] = useState<Book[] | null>(null);
    const [adults, setAdults] = useState('');
    const [children, setChildren] = useState('');
    const [nights, setNights] = useState('');
    const [s, setS] = useState('');
    const [d, setD] = useState('');
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
        setSelectedCardIndex(prev => {
            const newIndex = prev === index ? null : index; // Toggle logic for 0-based index

            // Async function to update AsyncStorage based on the resolved newIndex
            const updateStorage = async (selectedIndex: number | null) => {
                try {
                    const selectedHotel = selectedIndex !== null ? hotels[selectedIndex] : null;

                    if (selectedHotel) {
                        const hotelData = {
                            id: selectedHotel.id, // Store the actual hotel ID (e.g., '1', '2')
                            s: s,
                            d: d
                        };
                        await AsyncStorage.setItem('selectedHotelBooking', JSON.stringify(hotelData));
                    } else {
                        await AsyncStorage.removeItem('selectedHotelBooking'); // Remove if no hotel is selected
                    }
                } catch (error) {
                    console.error('Error saving selectedHotelBooking to AsyncStorage:', error);
                }
            };
            updateStorage(newIndex); // Call with the resolved newIndex
            return newIndex;
        });
    }, [s, d, hotels]); // Dependencies for useCallback to prevent stale closures of s, d, hotels

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
        const newBooking: Book[] = [{ dates: Object.keys(selectedDates), loc: location, ad: adults, ch: children, ni: nights, s: s, d: d }];
        setBook(newBooking);
        setModalVisible(false);
        setBookingComplete(true);
        try {
            await AsyncStorage.setItem('hbookings', JSON.stringify(newBooking));
            await AsyncStorage.setItem('hbookingComplete', 'true');
            await AsyncStorage.setItem('hbookingSession', Date.now().toString());

            // Also ensure selected hotel data (s, d) is updated in storage
            const selectedHotel = selectedCardIndex !== null ? hotels[selectedCardIndex] : null;
            if (selectedHotel) {
                const hotelData = {
                    id: selectedHotel.id,
                    s: s,
                    d: d
                };
                await AsyncStorage.setItem('selectedHotelBooking', JSON.stringify(hotelData));
            } else {
                await AsyncStorage.removeItem('selectedHotelBooking');
            }
            count()

        } catch (error) {
            alert(`Error saving booking to AsyncStorage: ${error}`);
        }
    };

    const loadBookingData = async () => {
        try {
            const sessionExists = await AsyncStorage.getItem('hbookingSession');
            const bookingCompleteStatus = await AsyncStorage.getItem('hbookingComplete');
            const savedHotelBooking = await AsyncStorage.getItem('selectedHotelBooking'); // Use the consistent key

            // Reset states before loading new data
            setSelectedDates({});
            setSelectedCardIndex(null);
            setBookingComplete(false);
            setBook(null);
            setLocation('');
            setAdults('');
            setShowDropdown(false);
            setChildren('');
            setNights('');
            setS('');
            setD('');

            if (savedHotelBooking) {
                const hotelData = JSON.parse(savedHotelBooking);
                // Find the array index of the hotel based on its 'id'
                const hotelIndex = hotels.findIndex(h => h.id === hotelData.id);
                if (hotelIndex !== -1) {
                    setSelectedCardIndex(hotelIndex); // Set the array index (0-based)
                    setS(hotelData.s || ''); // Load s from stored data
                    setD(hotelData.d || ''); // Load d from stored data
                }
            }

            if (sessionExists && bookingCompleteStatus === 'true') {
                setModalVisible(false);
                setBookingComplete(true);

                const savedBookings = await AsyncStorage.getItem('hbookings');
                if (savedBookings) {
                    const bookingData: Book[] = JSON.parse(savedBookings);
                    setBook(bookingData);
                    if (bookingData.length > 0) {
                        const booking = bookingData[0];
                        const dates = booking.dates.reduce((acc: any, date: string) => {
                            acc[date] = { selected: true, selectedColor: '#007BFF' };
                            return acc;
                        }, {});
                        setSelectedDates(dates);
                        setLocation(booking.loc);
                        setAdults(booking.ad);
                        setChildren(booking.ch);
                        setNights(booking.ni);
                        setS(booking.s || '')
                        setD(booking.d || '')
                        // s and d for the booking modal inputs will be loaded from 'selectedHotelBooking' if a hotel is selected,
                        // otherwise they default to empty strings.
                    }
                }
            } else {
                await AsyncStorage.setItem('hbookingSession', Date.now().toString());
                setModalVisible(true);
                setBookingComplete(false);
            }
        } catch (error) {
            console.error('Error loading data from AsyncStorage:', error);
            setSelectedDates({});
            setSelectedCardIndex(null);
            setModalVisible(true);
            setBookingComplete(false);
            setBook([]);
            setLocation('');
            setAdults('');
            setShowDropdown(false);
            setChildren('');
            setNights('');
            setS('');
            setD('');
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadBookingData();
            count()
        }, [])
    );

    const count = async () => {
        try {
            let total = 0;

            // Car Booking Price
            const carIndex = await AsyncStorage.getItem('car');
            if (carIndex) {
                const category = categories.find(cat => cat.id === (Number(carIndex)).toString());
                if (category) {
                    total += category.price;
                }
            }

            // Guide Booking Price
            const guideIndex = await AsyncStorage.getItem('guide');
            if (guideIndex) {
                const guide = guides.find(guide => guide.id === (Number(guideIndex)).toString());
                if (guide) {
                    total += guide.price;
                }
            }

            // Hotel Booking Price
            const savedHotelBooking = await AsyncStorage.getItem('selectedHotelBooking'); // Use consistent key
            if (savedHotelBooking) {
                const hotelBookingData = JSON.parse(savedHotelBooking);
                const selectedHotel = hotels.find(hotel => hotel.id === hotelBookingData.id); // Find hotel by its ID

                if (selectedHotel) { // Null check for selectedHotel
                    if (selectedHotel.beds && selectedHotel.beds.length >= 2) {
                        const singleBedPrice = selectedHotel.beds.find(bed => bed.type === 'single')?.price || 0;
                        const doubleBedPrice = selectedHotel.beds.find(bed => bed.type === 'double')?.price || 0;
                        const numSingle = Number(hotelBookingData.s || 0); // Use s from stored data
                        const numDouble = Number(hotelBookingData.d || 0); // Use d from stored data
                        total += (singleBedPrice * numSingle) + (doubleBedPrice * numDouble);
                    }
                }
            }

            setTotal(total.toString());
        } catch (error) {
            console.error('Error calculating total price from AsyncStorage:', error);
            setTotal('0');
        }
    };


    useFocusEffect(
        useCallback(() => {
            count()
        }, [selectedCardIndex, s, d]) // Dependencies for recalculation, ensuring it reacts to s/d changes
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
                                            setModalVisible(false);
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
                                    <View className='flex-col gap-2'>
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
                                        <View className='flex-row justify-between gap-3'>
                                            <TextInput
                                                placeholder="# Single Beds"
                                                placeholderTextColor="#8E8E8E"
                                                value={s}
                                                onChangeText={(text) => {
                                                    const numericText = text.replace(/[^0-9]/g, '');
                                                    setS(numericText);
                                                }}
                                                keyboardType="numeric"
                                                className="text-black border border-gray-300 rounded-xl px-3 py-3 text-base flex-1"
                                            />
                                            <TextInput
                                                placeholder="# Double Beds"
                                                placeholderTextColor="#8E8E8E"
                                                value={d}
                                                onChangeText={(text) => {
                                                    const numericText = text.replace(/[^0-9]/g, '');
                                                    setD(numericText);
                                                }}
                                                keyboardType="numeric"
                                                className="text-black border border-gray-300 rounded-xl px-3 py-3 text-base flex-1"
                                            />
                                        </View>
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
                                    <View key={index} className={`bg-[#fbfbfb] w-[175px] h-[155px] items-center py-1 rounded-2xl border-2 border-gray-300`}>
                                        <TouchableOpacity
                                            onPress={() => router.push(`/views/hotel/group/${Number(hotel.id) + 1}`)} // Pass actual hotel.id (e.g., '1', '2')
                                            className="w-full"
                                        >
                                            <View className="h-[75%] ">
                                                <View className="w-full absolute items-end pr-2 pt-1 z-10">
                                                    <TouchableOpacity
                                                        className="justify-center items-center w-6 h-6 rounded-full bg-gray-200"
                                                        onPress={() => toggleCardSelection(index)} // Pass array index (0-based)
                                                    >
                                                        {selectedCardIndex === index && ( // Compare with array index (0-based)
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
                                        </TouchableOpacity>
                                    </View>
                                ))}
                            </ScrollView>
                        </View>

                        <View className="p-4 border-t border-gray-200 bg-white">
                            <Text className="text-center font-bold text-lg">{total}.00 LKR</Text>
                        </View>
                    </>
                )}
            </View>
        </View>
    );
}