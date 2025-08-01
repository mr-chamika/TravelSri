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

// interface Hotel {
//     id: string;
//     image: any;
//     title: string;
//     ratings: number;

// }

interface Hotel {
    id: string;
    name: string;
    location: string;
    distance: string;
    // rating: number;
    ratings: number,
    reviewCount: number
    image: string;
    originalPrice: number;
    currentPrice: number;
    taxes: string;
    /* rooms: string; */
    priceDescription: string;
    //beds: string;
    specialOffer?: string;
    freeFeatures: string[];
}

const hotels: Hotel[] = [
    {
        id: '1',
        name: "Mandara Rosen Yala",
        location: "Kataragama",
        distance: "1.2 miles",
        // rating: 8.2,
        ratings: 600,
        reviewCount: 269,
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop",
        originalPrice: 48804,
        currentPrice: 38878,
        taxes: "+ LKR 12,044 taxes and charges",
        // rooms: "Price for 1 night, 2 adults",
        priceDescription: '1 Night',
        //beds: "2 beds",
        freeFeatures: ["Free cancellation", "No prepayment needed"]
    },
    {
        id: '2',
        name: "Hotel Sunflower",
        location: "Kataragama",
        distance: "0.6 miles",
        // rating: 2,
        ratings: 400,
        reviewCount: 71,
        image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop",
        originalPrice: 15839,
        currentPrice: 13830,
        taxes: "Includes taxes and charges",
        // rooms: "Price for 1 night, 2 adults",
        priceDescription: '2 nights',
        //beds: "2 beds",
        freeFeatures: ["Free cancellation", "No prepayment needed"]
    },
    {
        id: '3',
        name: "Funky Leopard Safari Lodge Bordering Yala National Park",
        location: "Yala",
        distance: "2.3 miles",
        // rating: 3,
        ratings: 400,
        reviewCount: 111,
        image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300&fit=crop",
        originalPrice: 39650,
        currentPrice: 31047,
        taxes: "Includes taxes and charges",
        // rooms: "Price for 1 night, 2 adults",
        //beds: "4 beds",
        priceDescription: 'Upto',
        specialOffer: "Breakfast included",
        freeFeatures: ["Secret Deal"]
    }
];

/* const hotels: Hotel[] = [
    {
        id: '1',
        image: pic,
        title: 'Shangri-La',
        ratings: 3,
    },
    {
        id: '2',
        image: pic,
        title: 'Bawana',
        ratings: 1,
    },
    {
        id: '1',
        image: pic,
        title: 'Shangri-La',
        ratings: 3,
    },
    {
        id: '2',
        image: pic,
        title: 'Bawana',
        ratings: 1,
    },
    {
        id: '3',
        image: pic,
        title: 'Matara bath kade',
        ratings: 2,
    },
    {
        id: '4',
        image: pic,
        title: 'Raheema',
        ratings: 5,
    },
    {
        id: '1',
        image: pic,
        title: 'Shangri-La',
        ratings: 3,
    },
    {
        id: '2',
        image: pic,
        title: 'Bawana',
        ratings: 1,
    },
    {
        id: '3',
        image: pic,
        title: 'Matara bath kade',
        ratings: 2,
    },
    {
        id: '4',
        image: pic,
        title: 'Raheema',
        ratings: 5,
    },
    // { id: '2', image: bg, title: 'Galle to Kurunegala', duration: 1, date: '05 july 2021', stats: 'Pending', price: 2300, max: 10, current: 13, routes: [{ place: 'peradeniya Botnical Garden', images: g }, { place: 'Sri Dalada Maligawa', images: l }, { place: 'Kandy Lake Round', images: te }] },
    // { id: '3', image: t, title: 'Colombo to jaffna', duration: 4, date: '06 aug 2022', stats: 'Cancelled', price: 1500, max: 25, current: 10, routes: [{ place: 'peradeniya Botnical Garden', images: g }, { place: 'Sri Dalada Maligawa', images: l }, { place: 'Kandy Lake Round', images: te }] },
    // { id: '4', image: pic, title: 'Matara to Kandy', duration: 10, date: '07 sept 2023', stats: 'Pending', price: 9000, max: 10, current: 4, routes: [{ place: 'peradeniya Botnical Garden', images: g }, { place: 'Sri Dalada Maligawa', images: l }, { place: 'Kandy Lake Round', images: te }] },
    // { id: '5', image: bg, title: 'Galle to Dehiwala', duration: 2, date: '08 oct 2024', stats: 'Pending', price: 1800, max: 15, current: 10, routes: [{ place: 'peradeniya Botnical Garden', images: g }, { place: 'Sri Dalada Maligawa', images: l }, { place: 'Kandy Lake Round', images: te }] },
    // { id: '6', image: t, title: 'Matale to Rajarata', duration: 6, date: '09 nov 2025', stats: 'Confirm', price: 700, max: 30, current: 24, routes: [{ place: 'peradeniya Botnical Garden', images: g }, { place: 'Sri Dalada Maligawa', images: l }, { place: 'Kandy Lake Round', images: te }] },

];
 */

export default function HotelsBookingScreen() {
    //for multiple dates const [selectedDates, setSelectedDates] = useState<{ [key: string]: { selected: boolean; selectedColor: string } }>({});
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

    //const hotels = [1, 1, 1, 2, 5, 1, 0, 3, 1, 1, 1, 2, 5, 1, 0, 3];

    useEffect(() => {
        if (selectedDates && selectedoutDates) {
            const checkInDate = new Date(selectedDates);
            const checkOutDate = new Date(selectedoutDates);

            // Ensure check-out is after check-in
            if (checkOutDate > checkInDate) {
                const differenceInTime = checkOutDate.getTime() - checkInDate.getTime();
                const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));
                setNights(differenceInDays);
            } else {
                // Reset nights if dates are invalid (e.g., check-out is before check-in)
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

    /* const displayDates = useMemo(() => {
        return Object.keys(selectedDates).sort().map(date => new Date(date).toDateString()).join(', ');
    }, [selectedDates]); */

    const toggleCardSelection = (index: number) => {
        setSelectedCardIndex(prev => (prev === index ? null : index));
    };

    const onDayPress = (day: { dateString: string }) => {

        setSelectedDates(day.dateString)

        /*for multiple date selection setSelectedDates((prev) => {
            const date = day.dateString;
            const updated = { ...prev };
            if (updated[date]) {
                delete updated[date];
                } else {
                    updated[date] = { selected: true, selectedColor: '#007BFF' };
            }
            return updated;
            }); */
    };
    const onDayoutPress = (day: { dateString: string }) => {

        setSelectedOutDates(day.dateString)
    }
    const handleLocationSelect = (selectedLocation: string) => {
        setLocation(selectedLocation);
        setShowDropdown(false);
    };

    const handleSubmit = async () => {
        //if (Object.keys(selectedDates).length === 0 || !location || !adults || !children || !nights) {
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
        } catch (e) {
            // Handle saving error
            console.error("Failed to save data to AsyncStorage", e);
        }

    };

    const minCheckoutDate = useMemo(() => {
        // If no check-in date is selected, the minimum date is today.
        if (!selectedDates) {
            return new Date().toISOString().split('T')[0];
        }

        // Otherwise, the minimum date is the day AFTER the selected check-in date.
        const checkInDate = new Date(selectedDates);
        checkInDate.setDate(checkInDate.getDate());
        return checkInDate.toISOString().split('T')[0];

    }, [selectedDates]);

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

    const formatPrice = (price: number) => {
        return `LKR ${price.toLocaleString()}`;
    };

    return (
        <View className='bg-[#F2F5FA] h-full'>
            <View className='bg-[#F2F5FA] h-full'>
                {/* Booking Modal */}
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

                            {/* Header */}
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

                            {/* Scrollable content */}
                            <ScrollView className="flex-1 px-6" keyboardShouldPersistTaps="handled">
                                <View className="w-full flex flex-col gap-y-5 pb-6">

                                    {/* Check-in Calendar */}
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

                                    {/* Check-out Calendar */}
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

                                    {/* Location Selection Dropdown */}
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
                                        {/* <TouchableOpacity
                                            onPress={() => setShowDropdown(!showDropdown)}
                                            className="border w-[90%] ml-7 border-gray-300 rounded-xl px-4 py-3 bg-white flex-row justify-between items-center"
                                        >
                                            <Text className={`text-base ${location ? 'text-black' : 'text-gray-400'}`}>
                                                {location || 'Select a location'}
                                            </Text>
                                            <Text className="text-gray-400 ml-2">{showDropdown ? '▲' : '▼'}</Text>
                                        </TouchableOpacity> */}

                                        {/* {showDropdown && (
                                            <View className="w-[90%] ml-7 bg-white rounded-xl border border-gray-200 mt-1 max-h-[130px]">
                                                <ScrollView
                                                    keyboardShouldPersistTaps="handled"
                                                    showsVerticalScrollIndicator={true}
                                                    nestedScrollEnabled={true}
                                                >
                                                    {sortedLocations.map((item, index) => (
                                                        <TouchableOpacity
                                                            key={item}
                                                            onPress={() => handleLocationSelect(item)}
                                                            className={`px-4 py-3 ${location === item ? 'bg-blue-100' : ''} ${index < sortedLocations.length - 1 ? 'border-b border-gray-200' : ''}`}
                                                        >
                                                            <Text className="text-gray-700 text-center text-base">{item}</Text>
                                                        </TouchableOpacity>
                                                    ))}
                                                </ScrollView>
                                            </View>
                                        )} */}
                                    </View>

                                    {/* Adults */}
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

                                    {/* Children */}
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

                                    {/* Nights */}
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

                            {/* Submit Button Fixed at Bottom */}
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

                {/* Only show main content if booking is complete */}
                {bookingComplete && (
                    <View className="flex-1 flex-col">

                        <View className=" p-4">
                            <View className="w-full pt-4 flex-row items-start justify-between">
                                <View className="w-[50%] flex-col justify-evenly">
                                    <View className="flex-row justify-between">
                                        <Text className="text-sm font-medium text-center self-center">Check-in</Text>
                                        <Text className="text-lg font-medium">{book.selectedDates}</Text>
                                    </View>
                                    <View className="flex-row justify-between">
                                        <Text className="text-sm font-medium text-center self-center">Check-out</Text>
                                        <Text className="text-lg font-medium">{book.selectedoutDates}</Text>
                                    </View>


                                    <View className="flex-row justify-between">
                                        <Text className="text-sm font-medium text-center self-center">Location</Text>
                                        <Text className="text-lg font-medium w-[50%]">{book.location}</Text>
                                    </View>
                                    <View className="flex-row justify-between">
                                        <Text className="text-sm font-medium text-center self-center">Adults</Text>
                                        <Text className="text-lg font-medium w-[50%]">{book.adults}</Text>
                                    </View>
                                    <View className="flex-row justify-between">
                                        <Text className="text-sm font-medium text-center self-center">Children</Text>
                                        <Text className="text-lg font-medium w-[50%]">{book.children}</Text>
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

                        {/* Hotel Cards */}

                        <ScrollView
                            className="flex-1"
                            contentContainerClassName="flex-row flex-wrap justify-center items-start gap-3 py-5"
                            showsVerticalScrollIndicator={false}
                        >
                            {/*{hotels.map((hotel, index) => (

                                <View key={index} className="bg-[#fbfbfb] w-[175px] h-[155px] items-center py-1 rounded-2xl border-2 border-gray-300">


                                    <TouchableOpacity
                                        onPress={() => router.push(`/views/hotel/solo/${Number(hotel.id) + 1}`)}
                                        className="w-full h-full"
                                    >

                                        <View className="h-full ">
                                            <View className="w-full h-[75%]">
                                                <View className="w-full absolute items-end pr-2 pt-1 z-10">
                                                    //  <TouchableOpacity
                                                    //         className="justify-center items-center w-6 h-6 rounded-full bg-gray-200"
                                                    //         onPress={() => toggleCardSelection(index)}
                                                    //     >
                                                    //         {selectedCardIndex === index && (
                                                    //             <Image className='w-4 h-4' source={mark} />
                                                    //         )}
                                                    //     </TouchableOpacity> 
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
                            ))}*/}

                            {hotels.map((hotel) => {

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

                                return (<TouchableOpacity
                                    key={hotel.id}
                                    className="bg-white border mx-4 my-2 border-gray-100 rounded-lg overflow-hidden shadow-md w-[95%]"
                                    onPress={() => router.push(`/views/hotel/solo/${hotel.id}`)}
                                    activeOpacity={0.7}
                                >
                                    {/* Hotel Image */}
                                    <View className="relative h-40">
                                        <Image
                                            source={{ uri: hotel.image }}
                                            className="w-full h-full"
                                            contentFit="cover"
                                        />
                                        {/* <TouchableOpacity 
                className="absolute top-3 right-3 bg-white/90 rounded-full p-2"
                onPress={(e) => {
                    e.stopPropagation(); // Prevent triggering the hotel card press
                    toggleFavorite(hotel.id);
                }}
            >
                <Icon 
                    name={favorites.includes(hotel.id) ? "heart-filled" : "heart"} 
                    size={20} 
                    color={favorites.includes(hotel.id) ? "#dc2626" : "#6b7280"} // Using hex for colors.textMuted
                />
            </TouchableOpacity> */}
                                        {hotel.specialOffer && (
                                            <View className="absolute bottom-3 left-3 bg-emerald-500 px-2 py-1 rounded-sm">
                                                <Text className="text-white text-xs font-semibold">{hotel.specialOffer}</Text>
                                            </View>
                                        )}
                                    </View>

                                    {/* Hotel Info */}
                                    <View className="p-4">

                                        {/* Hotel Name and Rating */}
                                        <View className="mb-2">
                                            <View className="mb-1">
                                                <View className="flex-row justify-between">
                                                    <Text className="text-base font-semibold text-gray-800 mb-1">{hotel.name}</Text>
                                                    {/* <Text className="text-base font-semibold text-gray-800 mb-1">{hotel.location}</Text> */}
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
                                                                    {/* {hotel.genius && (
                                                                        <View className="bg-yellow-300 px-2 py-1 rounded-sm">
                                                                            <Text className="text-white text-[10px] font-semibold">Genius</Text>
                                                                        </View>
                                                                    )} */}
                                                                </View>
                                                            </View>
                                                        </View>

                                                        {/* Rating Score */}
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

                                                        {/* Location */}
                                                        <View className="flex-row items-center mb-2 gap-1">
                                                            {/* <Icon name="location" size={12} color="#6b7280" /> */}
                                                            <Image source={pin} className="w-4 h-4" />
                                                            <Text className="text-xs text-gray-600">{hotel.distance} from {hotel.location}</Text>
                                                        </View>

                                                        {/* Room Info 
                                                        <View className="mb-3">
                                                        <Text className="text-xs text-gray-600">{hotel.features.join(" • ")}</Text>
                                                        </View>*/}
                                                    </View>
                                                    <View className=" border-gray-200">
                                                        <View className="items-end">
                                                            {/* <Text className="text-xs text-gray-600 mb-1">{hotel.rooms}</Text> */}
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

                                                            {/* Free Features */}
                                                            <View className="gap-1">
                                                                {hotel.freeFeatures.map((feature, index) => (
                                                                    <View key={index} className="flex-row items-center gap-1">
                                                                        {/* <Icon name="check" size={12} color="#10b981" /> */}
                                                                        <Text className="text-[10px] text-emerald-500 font-medium">{feature}</Text>
                                                                    </View>
                                                                ))}
                                                            </View>
                                                        </View>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                        {/* Price Section */}

                                    </View>
                                </TouchableOpacity>)
                            })}
                        </ScrollView>


                        {/* <View className="p-4 border-t border-gray-200 bg-white">
                            <Text className="text-center font-bold text-lg">Total: 1000 LKR</Text>
                        </View> */}
                    </View>
                )}




            </View>
        </View>
    );
}
