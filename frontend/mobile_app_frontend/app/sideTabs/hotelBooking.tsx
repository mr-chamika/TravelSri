import React, { useState, useMemo, useCallback, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, FlatList, TextInput, Modal } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { cssInterop } from 'nativewind';
import { Image } from 'expo-image';
import { Calendar } from 'react-native-calendars';
import { send } from "@emailjs/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

cssInterop(Image, { className: "style" });

const router = useRouter();

const mark = require('../../assets/images/tabbar/create/location/mark.png');
const pic = require('../../assets/images/tabbar/create/location/h.png');
const star = require('../../assets/images/tabbar/create/hotel/stars.png');
const pin = require('../../assets/images/pin.png')

const LOCATIONS = ['Colombo', 'Kandy', 'Galle', 'Nuwara Eliya', 'Jaffna'];

interface Hotel {
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
}

export default function HotelsBookingScreen() {

    const [hotels, setHotels] = useState<Hotel[]>([])
    const [hotelsS, setHotelsS] = useState<Hotel[]>([])

    const [selectedDates, setSelectedDates] = useState<string>('');
    const [selectedoutDates, setSelectedOutDates] = useState<string>('');
    const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [bookingComplete, setBookingComplete] = useState(false);

    const [adults, setAdults] = useState(0);
    const [children, setChildren] = useState(0);
    const [nights, setNights] = useState(0);
    const [location, setLocation] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);

    const [book, setbook] = useState({

        selectedDates: '',
        selectedoutDates: '',
        adults: 0,
        children: 0,
        nights: 0,
        location: ''

    })

    useEffect(() => {
        if (selectedDates && selectedoutDates) {
            const checkInDate = new Date(selectedDates);
            const checkOutDate = new Date(selectedoutDates);

            if (checkOutDate > checkInDate) {
                const differenceInTime = checkOutDate.getTime() - checkInDate.getTime();
                const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));
                setNights(differenceInDays);
            } else {
                setNights(0);
            }
        } else {
            setNights(0);
        }
    }, [selectedDates, selectedoutDates]);

    const sortedLocations = useMemo(() => {
        if (!location) return LOCATIONS;
        return [location, ...LOCATIONS.filter((loc) => loc !== location)];
    }, [location]);

    const toggleCardSelection = (index: number) => {
        setSelectedCardIndex(prev => (prev === index ? null : index));
    };

    const onDayPress = (day: { dateString: string }) => {

        setSelectedDates(day.dateString)

    };
    const onDayoutPress = (day: { dateString: string }) => {

        setSelectedOutDates(day.dateString)
    }
    const handleLocationSelect = (selectedLocation: string) => {
        setLocation(selectedLocation);
        setShowDropdown(false);
    };

    const handleSubmit = async () => {
        if (selectedoutDates === '' || selectedDates === '' || !location || !adults || !children || nights < 0) {
            alert('Please fill in all fields.');
            return;
        }

        const sending = { ...book }

        sending.selectedDates = selectedDates;
        sending.selectedoutDates = selectedoutDates;
        sending.adults = adults;
        sending.children = children;
        sending.nights = nights;
        sending.location = location;

        setModalVisible(false);
        setBookingComplete(true);

        setbook(sending)

        try {

            await AsyncStorage.setItem("soloHotelBook", JSON.stringify(sending));
            const res = await fetch(`http://localhost:8080/traveler/hotels-all?location=${location.toLocaleLowerCase()}&guests=${adults + children}`)


            if (res) {

                const data = await res.json()

                if (data.length > 0) {

                    setHotels(data)

                } else {

                    setHotels([])
                    const res = await fetch(`http://localhost:8080/traveler/hotel-all?guests=${adults + children}`)

                    if (res) {

                        const data = await res.json()

                        setHotelsS(data)

                    } else {

                        setHotels([])
                    }

                }

            }


        } catch (e) {

            console.error("Failed to save data to AsyncStorage", e);
        }

    };

    const minCheckoutDate = useMemo(() => {

        if (!selectedDates) {
            return new Date().toISOString().split('T')[0];
        }

        const checkInDate = new Date(selectedDates);
        checkInDate.setDate(checkInDate.getDate());
        return checkInDate.toISOString().split('T')[0];

    }, [selectedDates]);

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

    const formatPrice = (price: number) => {
        return `LKR ${price.toLocaleString()}`;
    };

    return (
        <View className='bg-[#F2F5FA] h-full'>
            <View className='bg-[#F2F5FA] h-full'>

                <Modal
                    visible={modalVisible}
                    transparent={true}
                    animationType="fade"
                    onRequestClose={() => {
                        if (bookingComplete) setModalVisible(false);
                    }}
                >
                    <View className="h-full bg-black/50 justify-center items-center">
                        <View className="w-[93%] h-[97%] bg-white rounded-2xl overflow-hidden">


                            <View className="w-full p-6 pb-4">
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


                            <ScrollView className="flex-1 px-6" keyboardShouldPersistTaps="handled">
                                <View className="w-full flex flex-col gap-y-5 pb-6">


                                    <View className="w-full">
                                        <Text>Check-in Date</Text>
                                        <View className="w-[90%] ml-7 p-1 border-2 rounded-xl border-gray-200 mt-3">
                                            <Calendar
                                                onDayPress={onDayPress}
                                                markedDates={selectedDates ? {
                                                    [selectedDates]: {
                                                        selected: true,
                                                        selectedColor: '#007BFF',
                                                        disableTouchEvent: true,
                                                        selectedTextColor: 'white',
                                                    },
                                                } : {}}
                                                minDate={new Date().toISOString().split('T')[0]}
                                                theme={{
                                                    todayTextColor: '#007BFF',
                                                    arrowColor: '#007BFF',
                                                    calendarBackground: '#ffffff',
                                                }}
                                                style={{ paddingBottom: 10 }}
                                            />
                                        </View>
                                    </View>

                                    <View className="w-full">
                                        <Text>Check-out Date</Text>
                                        <View className="w-[90%] ml-7 p-1 border-2 rounded-xl border-gray-200 mt-3">
                                            <Calendar
                                                onDayPress={onDayoutPress}
                                                markedDates={selectedoutDates ? {
                                                    [selectedoutDates]: {
                                                        selected: true,
                                                        selectedColor: '#007BFF',
                                                        disableTouchEvent: true,
                                                        selectedTextColor: 'white',
                                                    },
                                                } : {}}
                                                minDate={minCheckoutDate}
                                                theme={{
                                                    todayTextColor: '#007BFF',
                                                    arrowColor: '#007BFF',
                                                    calendarBackground: '#ffffff',
                                                }}
                                                style={{ paddingBottom: 10 }}
                                            />
                                        </View>
                                    </View>

                                    <View className="w-full">
                                        <Text className="mb-2 text-base font-medium text-gray-700">Location</Text>
                                        <TextInput
                                            placeholder="colombo"
                                            placeholderTextColor="#8E8E8E"
                                            value={location}
                                            onChangeText={(text) => setLocation(text)}
                                            keyboardType="default"
                                            className="mt-2 w-[90%] ml-7 text-black border border-gray-300 rounded-xl px-3 py-3 text-base"
                                        />

                                    </View>

                                    <View>
                                        <Text>Enter number of adults</Text>
                                        <TextInput
                                            placeholder="1"
                                            placeholderTextColor="#8E8E8E"
                                            value={adults.toString()}
                                            onChangeText={(text) => setAdults(parseInt(text.replace(/[^0-9]/g, '')) || 0)}
                                            keyboardType="numeric"
                                            className="mt-2 w-[90%] ml-7 text-black border border-gray-300 rounded-xl px-3 py-3 text-base"
                                        />
                                    </View>

                                    <View>
                                        <Text>Enter number of children</Text>
                                        <TextInput
                                            placeholder="1"
                                            placeholderTextColor="#8E8E8E"
                                            value={children.toString()}
                                            onChangeText={(text) => setChildren(parseInt(text.replace(/[^0-9]/g, '')) || 0)}
                                            keyboardType="numeric"
                                            className="mt-2 w-[90%] ml-7 text-black border border-gray-300 rounded-xl px-3 py-3 text-base"
                                        />
                                    </View>

                                    <View>
                                        <Text>Number of nights</Text>
                                        <View className="mt-2 w-[90%] ml-7 bg-gray-100 border border-gray-300 rounded-xl px-3 py-3">
                                            <Text className="text-black text-base">
                                                {nights > 0 ? nights : 0}
                                            </Text>
                                        </View>
                                    </View>

                                </View>
                            </ScrollView>

                            <View className="w-full p-6 bg-white">
                                <TouchableOpacity
                                    onPress={handleSubmit}
                                    className="bg-[#FEFA17] py-3 rounded-xl"
                                >
                                    <Text className="text-black text-center font-semibold text-base">Submit</Text>
                                </TouchableOpacity>
                            </View>

                        </View>
                    </View>
                </Modal>

                {bookingComplete && (
                    <View className="flex-1 flex-col">

                        <View className=" p-4">
                            <View className="w-full pt-4 flex-row items-start justify-between">
                                <View className="w-[60%] flex-col justify-evenly">
                                    <View className="flex-row justify-between">
                                        <Text className="text-sm font-medium text-center self-center">Check-in</Text>
                                        <Text className="text-lg font-medium text-start w-[45%]">{book.selectedDates}</Text>
                                    </View>
                                    <View className="flex-row justify-between">
                                        <Text className="text-sm font-medium text-center self-center">Check-out</Text>
                                        <Text className="text-lg font-medium w-[45%]">{book.selectedoutDates}</Text>
                                    </View>


                                    <View className="w-full flex-row justify-between">
                                        <Text className="text-sm font-medium text-center self-center">Location</Text>
                                        <Text className="text-lg font-medium text-start w-[45%] overflow-hidden" numberOfLines={1}>{book.location}</Text>
                                    </View>
                                    <View className="flex-row justify-between">
                                        <Text className="text-sm font-medium text-center self-center">Adults</Text>
                                        <Text className="text-lg font-medium w-[45%]">{book.adults}</Text>
                                    </View>
                                    <View className="flex-row justify-between">
                                        <Text className="text-sm font-medium text-center self-center">Children</Text>
                                        <Text className="w-[45%] text-lg font-medium text-start">{book.children}</Text>
                                    </View>
                                </View>
                                <TouchableOpacity
                                    onPress={() => setModalVisible(true)}
                                    className="items-end justify-center"
                                >
                                    <Text className="font-semibold text-blue-600 bg-gray-200 py-2 px-4 rounded-lg">Change</Text>
                                </TouchableOpacity>
                            </View>

                        </View>

                        <ScrollView
                            className="flex-1"
                            contentContainerClassName="flex-col justify-center items-center gap-3 py-5"
                            showsVerticalScrollIndicator={false}
                        >

                            {hotels.length == 0 &&
                                <View>
                                    <View className="p-10 bg-red-200 w-full flex-1 justify-center items-center">
                                        <Text>No results found</Text>
                                    </View>
                                    <View>
                                        <Text className="self-start p-3 text-xl font-semibold">Suggested Accomodations</Text>

                                        {hotelsS.map((hotel) => {

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
                                                    className="bg-white border mx-3 my-2 border-gray-100 rounded-lg overflow-hidden shadow-md w-[95%]"
                                                    onPress={() => router.push(`/views/hotel/solo/${hotel._id}`)}
                                                    activeOpacity={0.7}
                                                >
                                                    <View>
                                                        <View className="relative h-40">
                                                            <Image
                                                                source={{ uri: hotel.thumbnail }}
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

                                    </View>
                                </View>
                            }

                            {hotels.length > 0 && hotels.map((hotel) => {

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
                                        onPress={() => router.push(`/views/hotel/solo/${hotel._id}`)}
                                        activeOpacity={0.7}
                                    >
                                        <View>
                                            <View className="relative h-40">
                                                <Image
                                                    source={{ uri: hotel.thumbnail }}
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



                    </View>
                )}




            </View>
        </View>
    );
}
