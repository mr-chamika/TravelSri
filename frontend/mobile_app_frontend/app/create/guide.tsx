import { Text, View, ScrollView, TouchableOpacity, Modal, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import { Calendar } from 'react-native-calendars';
import { cssInterop } from 'nativewind';
import { Image } from 'expo-image';
import { useRouter, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

cssInterop(Image, { className: "style" });

const cross = require('../../assets/images/cross.png');
const mark = require('../../assets/images/tabbar/create/location/mark.png');
const pic = require('../../assets/images/tabbar/create/location/h.png');
const star = require('../../assets/images/tabbar/create/hotel/stars.png');
const tele = require('../../assets/images/tabbar/create/guide/telephones.png')

interface Book {

    loc: string;
    lan: string;
}

interface Guid {
    _id: string;
    pp: string;
    username: string;
    stars: number;
    verified: string;
    identified: string;
    price: number
}


interface Postdata {

    dayNumber: string,
    date: string,
    adults: string,
    children: string

}

interface H {
    id: string,
    singlePrice: number,
    doublePrice: number,
}

interface Car {

    id: string;
    price: number;

}

export default function Guide() {

    const router = useRouter();

    const [selectedDates, setSelectedDates] = useState<{ [key: string]: { selected: boolean; selectedColor: string } }>({});
    const [selectedCardIndex, setSelectedCardIndex] = useState<string | null>(null);
    const [book, setBook] = useState<Book[] | null>([]);
    const [isModalVisible, setModalVisible] = useState(true);
    const [travelDescription, setTravelDescription] = useState('');

    const [location, setLocation] = useState('');
    const [lan, setLan] = useState('');
    const [guides, setGuides] = useState<Guid[]>([])
    const [hotelx, setHotels] = useState<H[]>([])
    const [cars, setCars] = useState<Car[]>([])
    const [locationP, setLocationP] = useState('');
    const [order, setOrder] = useState<Postdata | null>(null)

    const [fine, setFine] = useState(false);
    const [bookingType, setBookingType] = useState('visit')


    const [showDropdown, setShowDropdown] = useState(false);
    const [show, setShow] = useState(false);
    const locations = ['Colombo', 'Kandy', 'Galle', 'Nuwara Eliya', 'Jaffna'];
    const languages = ['English', 'Korean', 'Russian', 'Japanese', 'Sinhala'];
    const [total, setTotal] = useState('');

    const [destination, setDestination] = useState('');


    const toggleCardSelection = useCallback((index: string) => {

        setSelectedCardIndex(prev => {
            const newIndex = prev === index ? null : index; // Toggle logic for 0-based index

            // Async function to update AsyncStorage based on the resolved newIndex
            const updateStorage = async (selectedIndex: string | null) => {
                try {
                    if (guides) {
                        const selectedGuide = selectedIndex !== null ? guides.find(guide => guide._id == selectedIndex) : null;

                        if (selectedGuide) {

                            await AsyncStorage.setItem('guide', selectedGuide._id);
                        } else {
                            await AsyncStorage.removeItem('guide'); // Remove if no hotel is selected
                        }
                    }
                    count()
                } catch (error) {
                    console.error('Error saving selectedHotelBooking to AsyncStorage:', error);
                }
            };
            updateStorage(newIndex); // Call with the resolved newIndex
            return newIndex;
        });
    }, [guides, selectedCardIndex]); // Dependencies for useCallback to prevent stale closures of s, d, hotels

    const handleSubmit = async () => {

        if (!destination || !lan) {
            alert('Please fill in all fields.');
            return;
        }
        const newBooking = [{ loc: location, lan: lan }];
        setBook(newBooking);

        try {
            await AsyncStorage.setItem('gbookings', JSON.stringify(newBooking));
            await AsyncStorage.setItem('gbookingComplete', 'true');
            await AsyncStorage.setItem('gbookingSession', Date.now().toString());
            setModalVisible(false);
            setFine(true)
            console.log('gives', destination, lan)
            await getGuides(destination, lan)
            loadBookingData()
        } catch (error) {
            alert(`Error saving booking to AsyncStorage: ${error}`);
        }
    };

    const loadBookingData = async () => {
        try {
            const sessionExists = await AsyncStorage.getItem('gbookingSession');
            const bookingComplete = await AsyncStorage.getItem('gbookingComplete');
            const savedIndex = await AsyncStorage.getItem('guide');
            const hotelData = await AsyncStorage.getItem('hotels')
            setHotels(hotelData ? JSON.parse(hotelData) : [])

            const carData = await AsyncStorage.getItem('cars')
            setCars(carData ? JSON.parse(carData) : []);

            // --- Reset local state before loading from storage ---
            setSelectedDates({});
            setSelectedCardIndex(null);
            setBook([]);
            setLocation('');
            setLan('');
            setShowDropdown(false);
            setShow(false);
            setTotal('0');

            if (savedIndex) {
                setSelectedCardIndex(savedIndex);
            }

            if (sessionExists && bookingComplete === 'true') {
                const savedBookings = await AsyncStorage.getItem('gbookings');
                if (savedBookings) {
                    const bookingData = JSON.parse(savedBookings);
                    setBook(bookingData);
                    if (bookingData.length > 0) {

                        const booking = bookingData[0];

                        setLocation(booking.loc);
                        setLan(booking.lan);
                        // Fetch guides now that we have location and language
                        await getGuides(booking.loc, booking.lan);
                    }
                }
            } else {
                await AsyncStorage.setItem('gbookingSession', Date.now().toString());
            }

        } catch (error) {
            console.error('Error loading data from AsyncStorage (guide):', error);
            setSelectedDates({});
            setSelectedCardIndex(null);
            setBook([]);
            setLocation('');
            setLan('');
            setShowDropdown(false);
            setShow(false);
            setTotal('0');
        }
    }

    useFocusEffect(
        useCallback(() => {
            const loadInitialData = async () => {
                const pack = await AsyncStorage.getItem('order');
                if (pack) {
                    const parsedOrder = JSON.parse(pack);
                    if (JSON.stringify(order) !== JSON.stringify(parsedOrder)) {
                        setOrder(parsedOrder);
                    }
                }

                const locationp = await AsyncStorage.getItem('selectedLocation');
                if (locationp && locationp !== locationP) {
                    setLocationP(locationp);
                }

                // Also run count() on focus
                count();
            };

            loadInitialData();
        }, [])
    );
    // UPDATED: Now accepts optional parameters to be called after loading booking data.
    const getGuides = async (loc?: string, language?: string) => {
        const guideLocation = loc;
        const guideLanguage = language;
        // Prevent API call if essential data is missing
        if (!guideLocation || !guideLanguage) {
            return;
        }

        console.log('hello', guideLanguage, guideLocation)
        try {
            const res = await fetch(`http://localhost:8080/traveler/guides-all?location=${destination.trim().toLowerCase()}&language=${lan.trim().toLowerCase()}`)
            //const res = await fetch(`https://travelsri-backend.onrender.com/traveler/guides-all?location=${guideLocation}&language=${guideLanguage}`)

            if (res.ok) {
                const data = await res.json()
                console.log('destination', destination, 'language', lan, 'data', data)
                if (data.length > 0) {


                    const minimalGuides = data.map((guide: Guid) => ({
                        id: guide._id,
                        price: guide.price,
                    }));

                    await AsyncStorage.setItem('guides', JSON.stringify(minimalGuides) || '')
                    setGuides(data)

                }

                else {

                    setGuides([])
                    await AsyncStorage.removeItem('guide')
                    console.log('No guides found')

                }
            }
        } catch (err) {
            console.log(`Error from guide getting : ${err}`)
        }
    }

    useFocusEffect(
        useCallback(() => {
            loadBookingData();
            count()
        }, [])
    );

    const count = async () => {
        try {
            let total = 0;

            const carIndex = await AsyncStorage.getItem('car');
            if (carIndex && cars.length > 0) {
                const category = cars.find(cat => cat.id === carIndex);
                if (category) {
                    total += category.price;
                }
            }

            const guideIndex = await AsyncStorage.getItem('guide');
            if (guideIndex && guides.length > 0) { // Ensure guides list is populated
                const guide = guides.find(guide => guide._id === guideIndex);
                if (guide) {
                    total += guide.price;
                }
            }

            const savedHotelBooking = await AsyncStorage.getItem('selectedHotelBooking');
            if (savedHotelBooking && hotelx.length > 0) { // Ensure hotels list is populated
                const hotelBookingData = JSON.parse(savedHotelBooking);
                const selectedHotel = hotelx.find(hotel => hotel.id === hotelBookingData.id);
                if (selectedHotel && hotelBookingData) {
                    const singleBedPrice = selectedHotel.singlePrice || 0;
                    const doubleBedPrice = selectedHotel.doublePrice || 0;
                    const numSingle = Number(hotelBookingData.s || 0);
                    const numDouble = Number(hotelBookingData.d || 0);
                    total += (singleBedPrice * numSingle) + (doubleBedPrice * numDouble);
                }
            }

            setTotal(total.toString());
        } catch (error) {
            console.error('Error calculating total price from AsyncStorage:', error);
            setTotal('0');
        }
    };
    console.log(guides)
    // UPDATED: Dependencies changed to fix calculation timing.
    useFocusEffect(
        useCallback(() => {
            count();
        }, [selectedCardIndex, cars, hotelx]) // Runs when selection or data changes
    );


    return (
        <View className='bg-[#F2F5FA] h-full'>
            <View className='bg-[#F2F5FA] h-full'>

                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={isModalVisible}
                    onRequestClose={() => {
                        if (!lan || !location) return;
                        setModalVisible(false);
                    }}
                >
                    <View className="flex-1 justify-center items-center bg-black/60">
                        {/* 1. Add KeyboardAvoidingView to wrap the entire modal card */}
                        <KeyboardAvoidingView
                            behavior={Platform.OS === "ios" ? "padding" : "height"}
                            className="w-[93%] h-[97%]"
                        >
                            <View className="flex-1 bg-white rounded-2xl">
                                {/* Header */}
                                <View className="p-4 border-gray-200">
                                    <TouchableOpacity onPress={() => { setModalVisible(false); if (!fine) router.back(); }}>
                                        <Text>{(fine) ? "Cancel" : "Back"}</Text>
                                    </TouchableOpacity>
                                    <Text className="text-xl font-bold mt-2 text-center">Guide Booking</Text>
                                </View>

                                {/* 2. Add a ScrollView to contain all the form elements */}
                                <ScrollView
                                    className="flex-1"
                                    contentContainerClassName="pt-4 px-4"
                                    keyboardShouldPersistTaps="handled"
                                >
                                    <View className='h-full'>

                                        {/* Booking Type Radio Buttons */}
                                        <View className='py-3'>
                                            <Text className="text-base font-medium text-gray-700 mb-3">Booking Type</Text>
                                            <View className="gap-2 ml-3">
                                                {/* Option 1 */}
                                                <TouchableOpacity
                                                    className="flex-row items-center"
                                                    onPress={() => setBookingType('visit')}
                                                >
                                                    <View className={`w-6 h-6 rounded-full border-2 justify-center items-center mr-3 ${bookingType === 'visit' ? 'border-blue-500' : 'border-gray-400'}`}>
                                                        {bookingType === 'visit' && <View className="w-3 h-3 rounded-full bg-blue-500" />}
                                                    </View>
                                                    <Text className="text-base text-gray-800">Guide for a place to visit</Text>
                                                </TouchableOpacity>

                                                {/* Option 2 */}
                                                <TouchableOpacity
                                                    className="flex-row items-center"
                                                    onPress={() => setBookingType('travel')}
                                                >
                                                    <View className={`w-6 h-6 rounded-full border-2 justify-center items-center mr-3 ${bookingType === 'travel' ? 'border-blue-500' : 'border-gray-400'}`}>
                                                        {bookingType === 'travel' && <View className="w-3 h-3 rounded-full bg-blue-500" />}
                                                    </View>
                                                    <Text className="text-base text-gray-800">Guide to travel with you</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>

                                        {/* Destination Input */}
                                        {bookingType == 'visit' &&
                                            <View className='mb-3'>
                                                <Text className="text-base font-medium text-gray-700 mb-2">Destination or Place</Text>
                                                <TextInput
                                                    placeholder="Galle"
                                                    value={destination}
                                                    onChangeText={setDestination}
                                                    className="text-black border border-gray-300 rounded-xl px-4 ml-3 py-3 text-base"
                                                />
                                            </View>

                                        }

                                        {bookingType == 'travel' &&
                                            <View className='mb-3'>
                                                <Text className="text-base font-medium text-gray-700 mb-2">Travel Description</Text>
                                                <TextInput
                                                    placeholder="We are about to go ..."
                                                    value={travelDescription}
                                                    onChangeText={setTravelDescription}
                                                    className="text-black border border-gray-300 rounded-xl px-4 ml-3 py-3 text-base"
                                                />
                                            </View>
                                        }
                                        {/* Language Input */}
                                        <View className='mb-3'>
                                            <Text className="text-base font-medium text-gray-700 mb-2">Preferred Language</Text>
                                            <TextInput
                                                placeholder="sinhala"
                                                value={lan} // Use your new 'language' state
                                                onChangeText={setLan} // And 'setLanguage' setter
                                                className="text-black border ml-3 border-gray-300 rounded-xl px-4 py-3 text-base"
                                            />
                                        </View>

                                    </View>
                                </ScrollView>

                                {/* Submit Button Footer */}
                                <View className="p-4 border-gray-200">
                                    <TouchableOpacity
                                        onPress={handleSubmit}
                                        className="bg-[#FEFA17] py-3 rounded-xl"
                                    >
                                        <Text className="text-black text-center font-semibold">Submit</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </KeyboardAvoidingView>
                    </View>
                </Modal>

                <>
                    <View className="flex-row justify-end items-center p-4">
                        <TouchableOpacity onPress={() => setModalVisible(true)} className="bg-gray-200 py-2 px-4 rounded-lg">
                            <Text className="font-semibold text-blue-600">Change</Text>
                        </TouchableOpacity>
                    </View>
                    <View className="flex-row justify-between items-center p-4">
                        <Text className="text-lg font-medium">Language:{lan}</Text>
                        <Text className="text-lg font-medium">Destination:{destination}</Text>
                    </View>

                    <View>
                        <ScrollView
                            className="w-full h-[81%]"
                            contentContainerClassName="flex-row flex-wrap justify-center items-start gap-3 py-5"
                            showsVerticalScrollIndicator={false}
                        >
                            {guides.map((x, index) => (
                                <View key={index} className="bg-[#fbfbfb] w-[175px] h-[155px] py-1 rounded-2xl border-2 border-gray-300">

                                    <TouchableOpacity onPress={() => router.push(`/views/guide/group/${x._id}`)}>

                                        <View className='h-full py-3 justify-between'>
                                            <View className="w-full absolute items-end pr-1 z-10">
                                                <TouchableOpacity
                                                    className="justify-center items-center w-6 h-6 rounded-full bg-gray-200"
                                                    onPress={() => toggleCardSelection(x._id)}
                                                >
                                                    {selectedCardIndex === x._id && (
                                                        <Image className='w-4 h-4' source={mark} />
                                                    )}
                                                </TouchableOpacity>
                                            </View>
                                            <View className='flex-row gap-5 px-3 w-44'>

                                                <Image
                                                    className='w-[50px] h-[50px] rounded-full'
                                                    source={{ uri: `data:image/jpeg;base64,${x.pp}` }}
                                                    contentFit="cover"
                                                />
                                                <View className=''>
                                                    <Text className="text-md font-semibold w-24 max-h-12 pt-2">{x.username}</Text>
                                                    <View className="flex-row justify-start mt-1">
                                                        {[...Array(x.stars)].map((_, i) => (
                                                            <Image key={i} className="w-3 h-3 mx-0.5" source={star} />
                                                        ))}
                                                    </View>
                                                </View>
                                            </View>
                                            <View className='w-full mt-4 gap-2'>
                                                <View className='gap-6 flex-row w-full pl-5'>
                                                    <Image className='w-5 h-5' source={tele}></Image>
                                                    <Text className="text-md">Phone Verified</Text>
                                                </View>
                                                <View className='gap-6 flex-row w-full pl-5'>
                                                    <Image className='w-5 h-5' source={mark}></Image>
                                                    <Text className="text-md">Identify Verified</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </ScrollView>
                    </View>
                    <View className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
                        {

                            <Text className="text-center font-bold text-lg">{total}.00 LKR</Text>

                        }
                    </View>

                </>

            </View>
        </View>
    );
}