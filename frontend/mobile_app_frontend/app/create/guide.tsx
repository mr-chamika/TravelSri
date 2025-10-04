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
const pin = require('../../assets/images/tabbar/create/pin.png')
const xp = require('../../assets/images/xp.png')

interface Book {

    loc: string;
    lan: string;
}

interface Guid {
    _id: string;
    firstName: string;
    lastName: string;
    description: string;
    location: string;
    experience: string;
    stars: number;
    reviewCount: number
    dailyRate: number;
    pp: string;
    verified: boolean;
    identified: boolean;
    specializations: string[];
    responseTime: string;
    responseRate: string;
    bio: string;
    mobileNumber: string
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
    const [book, setBook] = useState<Book | null>(null);
    const [isModalVisible, setModalVisible] = useState(false);
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


    useEffect(() => {
        const initializeModal = async () => {
            const bookingComplete = await AsyncStorage.getItem('gbookingComplete');
            setModalVisible(bookingComplete !== 'true');
        };
        initializeModal();
    }, []);

    const toggleCardSelection = useCallback((index: string) => {

        setSelectedCardIndex(prev => {
            const newIndex = prev === index ? null : index; // Toggle logic for 0-based index

            // Async function to update AsyncStorage based on the resolved newIndex
            const updateStorage = async (selectedIndex: string | null) => {
                try {
                    if (guides) {
                        const selectedGuide = selectedIndex !== null ? guides.find(guide => guide._id == selectedIndex) : null;

                        if (selectedGuide) {

                            await AsyncStorage.setItem('selectedGuideBooking', selectedGuide._id);
                        } else {
                            await AsyncStorage.removeItem('selectedGuideBooking'); // Remove if no hotel is selected
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

        if (bookingType == 'visit' && (!destination.trim() || !lan.trim())) {

            setTravelDescription('')
            alert('Please fill in all fields.');
            return;

        } else if (bookingType == 'travel' && (!travelDescription.trim() || !lan.trim())) {

            setDestination('')
            alert('Please fill in all fields.');
            return;

        }

        const newBooking = { loc: destination ? destination : travelDescription, lan: lan, type: bookingType };
        setBook(newBooking);

        try {
            await AsyncStorage.setItem('gbookings', JSON.stringify(newBooking));
            await AsyncStorage.setItem('gbookingComplete', 'true');
            await AsyncStorage.setItem('gbookingSession', Date.now().toString());
            setModalVisible(false);
            setFine(true)

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
            const savedGuideBooking = await AsyncStorage.getItem('selectedGuideBooking');


            const carData = await AsyncStorage.getItem('cars')
            setCars(carData ? JSON.parse(carData) : []);

            // --- Reset local state before loading from storage ---
            setSelectedDates({});
            setSelectedCardIndex(null);
            setBook(null);
            setLocation('');
            setLan('');
            setShowDropdown(false);
            setShow(false);
            setTotal('0');

            if (savedIndex) {
                setSelectedCardIndex(savedIndex);
            }

            if (sessionExists && bookingComplete === 'true') {
                setModalVisible(false)
                setFine(true)
                const savedBookings = await AsyncStorage.getItem('gbookings');
                if (savedBookings) {
                    const bookingData = JSON.parse(savedBookings);
                    setBook(bookingData);
                    if (bookingData) {
                        console.log(bookingData)
                        const booking = bookingData;

                        setDestination(booking.loc);
                        setLan(booking.lan);
                        // Fetch guides now that we have location and language
                        await getGuides(booking.loc, booking.lan);
                    }
                }

                if (savedGuideBooking) {

                    setSelectedCardIndex(savedGuideBooking)

                }
            } else {
                await AsyncStorage.removeItem('gbookingSession');
                await AsyncStorage.setItem('bookingComplete', "false")
            }

        } catch (error) {
            console.error('Error loading data from AsyncStorage (guide):', error);
            setSelectedDates({});
            setSelectedCardIndex(null);
            setBook(null);
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

            const run = async () => {
                await loadBookingData();
                const bookingComplete = await AsyncStorage.getItem('gbookingComplete');
                if (bookingComplete !== 'true') {
                    setModalVisible(true);
                }
            };
            run();

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

        try {
            const res = bookingType == 'visit' ? await fetch(`http://localhost:8080/traveler/guides-all?location=${destination.trim().toLowerCase()}&language=${lan.trim().toLowerCase()}`) : await fetch(`http://localhost:8080/traveler/guides-alls?language=${lan.trim().toLowerCase()}`)

            //const res = await fetch(`https://travelsri-backend.onrender.com/traveler/guides-all?location=${guideLocation}&language=${guideLanguage}`)

            if (res.ok) {
                const data = await res.json()

                if (data.length > 0) {


                    const minimalGuides = data.map((guide: Guid) => ({
                        id: guide._id,
                        price: guide.dailyRate,
                    }));

                    await AsyncStorage.setItem('guides', JSON.stringify(minimalGuides) || '')
                    setGuides(data)

                } else {

                    setGuides([])
                    await AsyncStorage.removeItem('selectedGuideBooking')
                    console.log('No guides found')

                }
            } else {

                setGuides([])
                await AsyncStorage.removeItem('selectedGuideBooking')
                console.log('No guides found')


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

            const guideIndex = selectedCardIndex;
            if (guideIndex && guides.length > 0) { // Ensure guides list is populated
                const guide = guides.find(guide => guide._id === guideIndex);
                if (guide) {
                    total += guide.dailyRate;
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

    // UPDATED: Dependencies changed to fix calculation timing.
    useFocusEffect(
        useCallback(() => {
            count();
        }, [selectedCardIndex, cars, hotelx]) // Runs when selection or data changes
    );

    const checkAllAsyncStorageKeys = async () => {
        try {
            const keys = await AsyncStorage.getAllKeys();
            const stores = await AsyncStorage.multiGet(keys);
            console.log('All AsyncStorage keys and values:');
            stores.forEach(([key, value]) => {
                console.log(`${key}: ${value}`);
            });
        } catch (error) {
            console.error('Error reading AsyncStorage:', error);
        }
    };

    return (
        <View className='bg-[#F2F5FA] h-full'>
            <View className='bg-[#F2F5FA] h-full'>

                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={isModalVisible}
                    onRequestClose={() => {
                        //if (!lan || !location) return;
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
                    {/* <View className="flex-row justify-between items-center p-4">
                        <Text className="text-lg font-medium">Language:{lan}</Text>
                        <Text className="text-lg font-medium">Destination:{destination ? destination : travelDescription}</Text>
                        <Text className="text-lg font-medium">type:{bookingType}</Text>
                    </View> */}

                    <View className='flex-1'>
                        <ScrollView
                            className="w-full h-[81%]"
                            contentContainerClassName="flex-row flex-wrap justify-center items-start gap-3 py-5"
                            showsVerticalScrollIndicator={false}
                        >
                            {guides && guides.length > 0 && guides.map((guide, index) => {

                                const rating = guide.reviewCount > 0
                                    ? parseFloat(((guide.stars / guide.reviewCount) * 2).toFixed(1))
                                    : 0;

                                return (<TouchableOpacity
                                    key={guide._id}
                                    className="bg-white border mx-4 my-2 border-gray-100 rounded-lg overflow-hidden shadow-md w-[95%]"

                                    onPress={() => router.push(`/views/guide/group/${guide._id}`)}
                                    activeOpacity={0.7}
                                >
                                    <View className='h-full rounded-lg justify-between'>

                                        <View className=" w-full absolute items-end pr-1 z-10">
                                            <TouchableOpacity
                                                className="my-1 justify-center items-center w-6 h-6 rounded-full bg-gray-200 border-2"
                                                onPress={() => toggleCardSelection(guide._id)}
                                            >
                                                {selectedCardIndex === guide._id && (
                                                    <Image className='w-4 h-4' source={mark} />
                                                )}
                                            </TouchableOpacity>
                                        </View>
                                        {/* Guide Header */}
                                        <View className="flex-row mb-2 gap-2 p-2">
                                            {/* Guide Image and Basic Info */}
                                            <Image source={{ uri: `data:image/jpeg;base64,${guide.pp}` }} className='w-20 h-20 rounded-full' />

                                            <View className="flex-1">

                                                <View className="flex-col items-start mb-1 ml-1">
                                                    <Text className="text-lg font-semibold text-gray-800 flex-1">{`${guide.firstName} ${guide.lastName}`}</Text>
                                                    <Text className="text-sm text-gray-500 mb-1">{guide.description}</Text>
                                                    <View className='w-[96%] flex-row justify-between'>
                                                        <View className='gap-1 flex-row items-center'>
                                                            <Image className='w-4 h-4' source={guide.verified ? tele : cross}></Image>
                                                            <Text className="text-sm">Phone Verified</Text>
                                                        </View>
                                                        <View className='gap-1 flex-row items-center'>
                                                            <Image className='w-4 h-4' source={guide.identified ? mark : cross}></Image>
                                                            <Text className="text-sm">Identity Verified</Text>
                                                        </View>

                                                    </View>
                                                    {/* <TouchableOpacity 
                            className="p-1"
                            onPress={(e) => {
                                e.stopPropagation();
                                toggleFavorite(guide.id);
                            }}
                        >
                            <Icon 
                                name={favorites.includes(guide.id) ? "heart-filled" : "heart"} 
                                size={20} 
                                color={favorites.includes(guide.id) ? "#dc2626" : "#6b7280"} 
                            />
                        </TouchableOpacity> */}
                                                </View>
                                                <View className="flex-row justify-between mb-2">
                                                    <View className="flex-row items-center gap-1 flex-1">
                                                        <Image source={pin} className='w-5 h-5' />
                                                        <Text className="text-xs text-gray-600">{guide.location}</Text>
                                                    </View>
                                                    <View className="flex-row items-center gap-1 flex-1">
                                                        <Image source={xp} className='w-5 h-5' />
                                                        <Text className="text-xs text-gray-600">{guide.experience} experience</Text>
                                                    </View>
                                                </View>

                                                {/* Rating and Response */}
                                                <View className="flex-row items-center justify-between">
                                                    <View className="flex-row items-center gap-1">
                                                        <View className={`rounded px-1.5 py-0.5 ${rating >= 9 ? 'bg-green-500' :
                                                            rating >= 8 ? 'bg-emerald-400' :
                                                                rating >= 7 ? 'bg-yellow-400' :
                                                                    rating >= 5 ? 'bg-orange-400' :
                                                                        'bg-red-500'
                                                            }`}>
                                                            <Text className="text-white text-xs font-semibold">{rating}</Text>
                                                        </View>
                                                        {/* <View className="flex-row">
                                                            {renderStars(guide.rating)}
                                                        </View> */}
                                                        <Text className="text-[10px] text-gray-500">({guide.reviewCount} Reviews)</Text>
                                                    </View>

                                                    <View className="items-end">
                                                        <Text className="text-[10px] text-green-500 font-medium">{guide.responseTime}</Text>
                                                        <Text className="text-[10px] text-gray-500">{guide.responseRate}% response rate</Text>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>

                                        {/* Languages 
                                    <View className="mb-3">
                                        <Text className="text-xs font-semibold text-gray-700 mb-1.
                                        <View className="flex-row flex-wrap gap-1.5">
                                            {guide.languages.map((lang, index) => (
                                                <View key={index} className="bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                                                    <Text className="text-blue-600 text-[11px] font-medium">{lang}</Text>
                                                </View>
                                            ))}
                                        </View>
                                    </View>*/}

                                        {/* Specializations */}
                                        <View className="mb-3 p-2">
                                            <Text className="text-xs font-semibold text-gray-700 mb-1.5">Specializations:</Text>
                                            <View className="flex-row flex-wrap gap-1.5">
                                                {guide.specializations && guide.specializations.length > 0 && guide.specializations.map((spec, index) => (
                                                    <View key={index} className="bg-yellow-50 px-2 py-0.5 rounded-full border border-yellow-300">
                                                        <Text className="text-yellow-800 text-[11px] font-medium">{spec}</Text>
                                                    </View>
                                                ))}
                                            </View>
                                        </View>

                                        {/* Expertise 
                                        <View className="mb-3">
                                            <Text className="text-xs font-semibold text-gray-700 mb-1.5">K
                                            <Text className="text-xs text-green-600 font-medium">{guide.expertise.join(' • ')}</Text>
                                        </View>
                                        */}

                                        {/* bio */}
                                        <View className="mb-4 p-2">
                                            <Text className="text-sm text-gray-600 leading-5">{guide.bio}</Text>
                                        </View>

                                        {/* Pricing and Actions */}
                                        <View className="flex-row items-end justify-between border-t border-gray-100 pt-3 p-2">
                                            <View className="flex-1 flex-row justify-between mx-10">
                                                <Text className="text-sm text-gray-500  self-center">Starting from</Text>
                                                {/* <Text className="text-sm font-semibold text-red-600">{guide.currency} {formatPrice(guide.hourlyRate)}/hour</Text> */}
                                                <Text className="text-xl font-extrabold text-gray-600">LKR {(guide.dailyRate)}/day</Text>
                                            </View>

                                            <View className="flex-row gap-2">
                                                {/* <TouchableOpacity className="flex-row items-center px-3 py-2 border border-blue-600 rounded-md gap-1">
                                                    <Icon name="message" size={16} color="#2563eb" />
                                                    <Text className="text-xs text-blue-600 font-medium">Message</Text>
                                                </TouchableOpacity> */}
                                                {/* <View className="flex-row items-center px-3 py-2 bg-yellow-300 rounded-md gap-4 justify-center">
                                                    <Image source={tele} className='w-6 h-6' />
                                                    <Text className="text-sm text-gray-800 font-semibold">{guide.mobileNumber}</Text>
                                                </View> */}
                                            </View>
                                        </View>
                                    </View>
                                </TouchableOpacity>)
                            })}

                        </ScrollView>
                        {guides.length == 0 &&
                            <>
                                <View className="h-full justify-center items-center">
                                    <Text className="text-red-500 italic">No guides available</Text>
                                    <TouchableOpacity onPress={checkAllAsyncStorageKeys} style={{ padding: 10, backgroundColor: 'yellow' }}>
                                        <Text>Check All Storage Keys</Text>
                                    </TouchableOpacity>
                                </View>

                            </>
                        }
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