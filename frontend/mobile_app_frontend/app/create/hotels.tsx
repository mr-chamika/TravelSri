import React, { useState, useMemo, useCallback, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useRouter, useFocusEffect, useLocalSearchParams } from "expo-router";
import { cssInterop } from 'nativewind';
import { Image } from 'expo-image';
import AsyncStorage from "@react-native-async-storage/async-storage";


cssInterop(Image, { className: "style" });

const mark = require('../../assets/images/tabbar/create/location/mark.png');
const pic = require('../../assets/images/tabbar/create/location/h.png');
const star = require('../../assets/images/tabbar/create/hotel/stars.png');
const pin = require('../../assets/images/pin.png')


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

interface Postdata {

    dayNumber: string,
    date: string,
    adults: string,
    children: string

}

interface Hotel {
    id: string;
    image: any;
    title: string;
    stars: number;
    price: number
    beds: { type: string; price: number }[]
}

interface x {

    _id: string;
    name: string;
    location: string;
    distance: string;
    ratings: number,
    reviewCount: number
    thumbnail: string;
    originalPrice: number;
    currentPrice: number;
    taxes: string;
    priceDescription: string;
    specialOffer?: string;
    freeFeatures: string[];
    singlePrice: number;
    doublePrice: number;
    availableDouble: number;
    availableSingle: number;

}

interface g {

    id: string,
    price: number

}

interface Car {

    id: string;
    price: number;

}


export default function HotelsBookingScreen() {

    const router = useRouter();

    const [selectedDates, setSelectedDates] = useState<{ [key: string]: { selected: boolean; selectedColor: string } }>({});
    const [selectedCardIndex, setSelectedCardIndex] = useState<string | null>(null); // Stores the array index (0-based) of the selected hotel
    const [book, setBook] = useState<Book[] | null>(null);
    const [order, setOrder] = useState<Postdata | null>(null)
    const [adultsNo, setAdults] = useState('');
    const [childrenNo, setChildren] = useState('');
    const [nights, setNights] = useState('');
    const [s, setS] = useState('');
    const [d, setD] = useState('');
    const [location, setLocation] = useState('');
    const [locationP, setLocationP] = useState('');
    const [total, setTotal] = useState('');
    const [hotes, setHotels] = useState<x[] | null>(null)
    const [input, setInput] = useState({
        id: '',
        s: '',
        d: ''
    })
    const [guides, setGuides] = useState<g[]>([])
    const [cars, setCars] = useState<Car[]>([])

    const sortedLocations = useMemo(() => {
        if (!location) return LOCATIONS;
        return [location, ...LOCATIONS.filter((loc) => loc !== location)];
    }, [location]);

    const displayDates = useMemo(() => {
        return Object.keys(selectedDates).sort().map(date => new Date(date).toDateString()).join(', ');
    }, [selectedDates]);

    const toggleCardSelection = useCallback((index: string) => {

        setSelectedCardIndex(prev => {
            const newIndex = prev === index ? null : index; // Toggle logic for 0-based index

            // Async function to update AsyncStorage based on the resolved newIndex
            const updateStorage = async (selectedIndex: string | null) => {
                try {
                    if (hotes) {
                        const selectedHotel = selectedIndex !== null ? hotes.find(hotel => hotel._id == selectedIndex) : null;

                        if (selectedHotel) {

                            const hotelData = {
                                id: selectedHotel._id, // Store the actual hotel ID (e.g., '1', '2')
                                s: s || '1',
                                d: d || '1'
                            };
                            await AsyncStorage.setItem('selectedHotelBooking', JSON.stringify(hotelData));
                        } else {
                            await AsyncStorage.removeItem('selectedHotelBooking'); // Remove if no hotel is selected
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
    }, [s, d, hotes, selectedCardIndex]); // Dependencies for useCallback to prevent stale closures of s, d, hotels

    const loadBookingData = async () => {
        try {
            const sessionExists = await AsyncStorage.getItem('hbookingSession');
            const bookingCompleteStatus = await AsyncStorage.getItem('hbookingComplete');
            const savedHotelBooking = await AsyncStorage.getItem('selectedHotelBooking'); // Use the consistent key
            const guideData = await AsyncStorage.getItem('guides')
            const locationp = await AsyncStorage.getItem('selectedLocation')
            const hotel = await AsyncStorage.getItem('selectedHotelBooking')

            if (hotel) {

                console.log(JSON.parse(hotel))


            }
            const pack = await AsyncStorage.getItem('order')
            if (pack) {

                const parsedOrder = JSON.parse(pack);
                if (JSON.stringify(order) !== JSON.stringify(parsedOrder)) {
                    setOrder(parsedOrder);
                }

            }

            if (locationp && locationp !== locationP) {
                setLocationP(locationp);
            }
            if (guideData) {

                setGuides(guideData ? JSON.parse(guideData) : [])

            }

            const carData = await AsyncStorage.getItem('cars')
            setCars(carData ? JSON.parse(carData) : []);

            // Reset states before loading new data
            setSelectedDates({});
            setBook(null);
            setLocation('');
            setAdults('');
            setChildren('');
            setNights('');
            setS('');
            setD('');

            let hotelWasFound = false;
            if (savedHotelBooking) {
                const hotelData = JSON.parse(savedHotelBooking);
                // Find the array index of the hotel based on its 'id'
                if (hotes) {
                    const hotelIndex = hotes.find(h => h._id === hotelData.id);
                    if (hotelIndex) {
                        setSelectedCardIndex(hotelIndex._id); // Set the array index (0-based)
                        setS(hotelData.s || ''); // Load s from stored data
                        setD(hotelData.d || ''); // Load d from stored data
                        hotelWasFound = true;
                    }
                }
            }

            if (!hotelWasFound) {
                setSelectedCardIndex(null);
            }

            if (sessionExists && bookingCompleteStatus === 'true') {

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

            }
        } catch (error) {
            console.error('Error loading data from AsyncStorage:', error);
            setSelectedDates({});
            setSelectedCardIndex(null);
            setBook([]);
            setLocation('');
            setAdults('');
            setChildren('');
            setNights('');
            setS('');
            setD('');
        }
    };

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

    useEffect(() => {
        if (!locationP || !order) return;

        const getHotels = async () => {

            if (!locationP || !order) return;


            try {
                console.log(locationP.toLocaleLowerCase(), Number(order?.adults) + Number(order?.children))
                const res = await fetch(`http://localhost:8080/traveler/hotels-all?location=${locationP.toLocaleLowerCase()}&guests=${Number(order?.adults) + Number(order?.children)}`)
                //const res = await fetch('https://travelsri-backend.onrender.com/traveler/hotels-all')

                if (res) {

                    const data = await res.json()
                    setHotels(data)

                    const minimalHotles = data.map((hotel: x) => ({
                        id: hotel._id,
                        singlePrice: hotel.singlePrice,
                        doublePrice: hotel.doublePrice,
                    }));
                    await AsyncStorage.setItem('hotels', JSON.stringify(minimalHotles))

                    // FIX: Update selection mark after hotels are loaded

                }

            } catch (err) {

                console.log(`Error from hotel getting : ${err}`)

            }

        }
        //
        getHotels();
    }, [locationP, order])

    useEffect(() => {
        if (hotes) {
            loadBookingData();
        }
    }, [hotes]);
    const count = async () => {

        try {
            let total = 0;

            // Car Booking Price
            const carIndex = await AsyncStorage.getItem('car');
            if (carIndex) {
                const category = cars.find(cat => cat.id === carIndex);
                if (category) {
                    total += category.price;
                }
            }

            // Guide Booking Price
            const guideIndex = await AsyncStorage.getItem('guide');
            if (guideIndex && guides) {
                const guide = guides.find(guide => guide.id === guideIndex);
                if (guide) {
                    total += guide.price;
                }
            }

            // Hotel Booking Price
            const savedHotelBooking = await AsyncStorage.getItem('selectedHotelBooking'); // Use consistent key
            if (savedHotelBooking && hotes) {
                const hotelBookingData = JSON.parse(savedHotelBooking);
                const selectedHotel = hotes.find(hotel => hotel._id === hotelBookingData.id); // Find hotel by its ID

                if (selectedHotel) { // Null check for selectedHotel
                    console.log(selectedHotel)
                    const numSingle = Number(hotelBookingData.s || 0); // Use s from stored data
                    const numDouble = Number(hotelBookingData.d || 0); // Use d from stored data

                    if (selectedHotel.availableDouble >= numDouble && selectedHotel.availableSingle >= numSingle) {
                        const singleBedPrice = selectedHotel.singlePrice || 0;
                        const doubleBedPrice = selectedHotel.doublePrice || 0;
                        total += (singleBedPrice * numSingle) + (doubleBedPrice * numDouble);

                    } else {

                        await AsyncStorage.removeItem('selectedHotelBooking')

                    }
                }
            }

            setTotal(total.toString());
        } catch (error) {
            console.error('Error calculating total price from AsyncStorage:', error);
            setTotal('0');
        }
    };//

    const formatPrice = (price: number) => {
        return `LKR ${price.toLocaleString()}`;
    };

    useFocusEffect(
        useCallback(() => {
            count()
        }, [selectedCardIndex, s, d, guides, cars, hotes]) // Dependencies for recalculation, ensuring it reacts to s/d changes
    );
    return (
        <View className='bg-[#F2F5FA] flex-1'>
            <View className='bg-[#F2F5FA] h-full'>

                <>

                    {/* Hotel Cards */}
                    <View className="flex-1">
                        <ScrollView
                            className="w-full h-[81%]"
                            contentContainerClassName="flex-row flex-wrap justify-center items-start gap-3 py-5"
                            showsVerticalScrollIndicator={false}
                        >
                            {hotes && hotes.length > 0 && hotes.map((hotel) => {

                                const getReviewLabel = (score: number): string => {
                                    if (score >= 9) return 'Excellent';
                                    if (score >= 8) return 'Very Good';
                                    if (score >= 7) return 'Good';
                                    if (score >= 5) return 'Average';
                                    return 'Poor';
                                };
                                const rating = hotel.reviewCount > 0
                                    ? parseFloat(((hotel.ratings / hotel.reviewCount) * 2).toFixed(1))
                                    : 0;

                                return (
                                    <TouchableOpacity
                                        key={hotel._id}
                                        className="bg-white border mx-4 my-2 border-gray-100 rounded-lg overflow-h_idden shadow-md w-[95%]"
                                        onPress={() => router.push(`/views/hotel/group/${hotel._id}`)}
                                        activeOpacity={0.7}
                                    >
                                        <View className='h-full rounded-lg justify-between'>
                                            <View className="w-full absolute items-start pr-1 z-10">
                                                <TouchableOpacity
                                                    className={`justify-center items-center w-6 h-6 rounded-full bg-gray-200 ${selectedCardIndex === hotel._id ? 'border-2' : ''}`}
                                                    onPress={() => toggleCardSelection(hotel._id)}
                                                >
                                                    {selectedCardIndex === hotel._id && (
                                                        <Image className='w-4 h-4' source={mark} />
                                                    )}
                                                </TouchableOpacity>
                                            </View>
                                            <View className=" h-40">
                                                <Image

                                                    source={{ uri: `data:image/jpeg;base64,${hotel.thumbnail}` }}
                                                    className="w-full h-full"
                                                    contentFit="cover"
                                                />

                                                {hotel.specialOffer && (
                                                    <View className="absolute bottom-3 left-3 bg-emerald-500 px-2 py-1 rounded-sm">
                                                        <Text className="text-white text-xs font-semibold">{hotel.specialOffer}</Text>
                                                    </View>
                                                )}
                                            </View>

                                            <View className="p-4">

                                                <View className="mb-2">
                                                    <View className="mb-1">
                                                        <View className="flex-row justify-between">
                                                            <Text className="text-base font-semibold text-gray-800 mb-1">{hotel.name}</Text>
                                                        </View>
                                                        <View className="flex-row justify-between">
                                                            <View className="justify-evenly">
                                                                <View>
                                                                    <View>
                                                                        <View className="flex-row items-center gap-2">

                                                                            <View className="flex-row justify-center mt-1">
                                                                                {[...Array(Math.floor((rating) / 2))].map((_, i) => (
                                                                                    <Image key={i} className="w-3 h-3 mx-0.5" source={star} />
                                                                                ))}
                                                                            </View>

                                                                        </View>
                                                                    </View>
                                                                </View>

                                                                <View className="flex-row items-center mb-2 gap-2">
                                                                    <View className={`rounded-sm px-2 py-1 ${rating >= 9 ? 'bg-green-500' :
                                                                        rating >= 8 ? 'bg-emerald-400' :
                                                                            rating >= 7 ? 'bg-yellow-400' :
                                                                                rating >= 5 ? 'bg-orange-400' :
                                                                                    'bg-red-500'
                                                                        }`}>
                                                                        <Text className="text-white text-xs font-semibold">{rating}</Text>
                                                                    </View>
                                                                    <View className="flex-1">
                                                                        <Text
                                                                            className={`text-xs font-semibold`}
                                                                        >
                                                                            {getReviewLabel(rating)}
                                                                        </Text>
                                                                        <Text className="text-xs text-gray-600">{hotel.reviewCount} reviews</Text>
                                                                    </View>
                                                                </View>

                                                                <View className="flex-row items-center mb-2 gap-1">
                                                                    <Image source={pin} className="w-4 h-4" />
                                                                    <Text className="text-xs text-gray-600">{hotel.distance} from {hotel.location}</Text>
                                                                </View>

                                                            </View>
                                                            <View className=" border-gray-200">
                                                                <View className="items-end">
                                                                    <Text className="text-xs font-semibold text-gray-600 mb-1">{hotel.priceDescription}</Text>
                                                                    {hotel.originalPrice !== hotel.currentPrice && (
                                                                        <Text className="text-xs text-gray-400 line-through mb-0.5">
                                                                            {formatPrice(hotel.originalPrice)}
                                                                        </Text>
                                                                    )}
                                                                    <Text className="text-lg font-bold text-red-600 mb-0.5">
                                                                        {formatPrice(hotel.currentPrice)}
                                                                    </Text>
                                                                    <Text className="text-[10px] text-gray-600 mb-2">{hotel.taxes}</Text>

                                                                    <View className="gap-1">
                                                                        {hotel.freeFeatures.map((feature, index) => (
                                                                            <View key={index} className="flex-row items-center gap-1">
                                                                                <Text className="text-[10px] text-emerald-500 font-medium">{feature}</Text>
                                                                            </View>
                                                                        ))}
                                                                    </View>
                                                                </View>
                                                            </View>
                                                        </View>
                                                    </View>
                                                </View>

                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                )
                            })}
                        </ScrollView>
                        {(hotes?.length == 0 && <View className=" h-full items-center justify-center"><Text className="text-red-200 italic">No hotels available</Text></View>)}
                    </View>

                    <View className=" p-4 border-t border-gray-200 bg-white">
                        <Text className="text-center font-bold text-lg">{total}.00 LKR</Text>
                    </View>
                </>

            </View>
        </View>
    );
}