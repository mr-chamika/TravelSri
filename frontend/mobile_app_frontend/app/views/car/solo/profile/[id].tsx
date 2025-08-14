import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, TouchableOpacity, ScrollView, Platform, Alert } from "react-native";
import { cssInterop } from 'nativewind'
import { Image } from 'expo-image'
import { useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";

interface Book {
    dates: string[];
    start: string;
    end: string;
    language: string;
    oneWay: boolean;
    time: string;
}

interface Review {
    _id: string,
    serviseId: string,
    text: string,
    country: string,
    stars: number,
    author: string,
    dp: string,
}

interface Category {
    _id: string,
    title: string,
}

interface Vehicle {
    _id: string;
    image: any;
    firstName: string;
    lastName: string;
    stars: number;
    location: string;
    dailyRatePrice: number;
    driverAge: number;
    vehicleNumber: string;
    phone: string;
    reviewCount: number;
    vehicleModel: string;
    catId: string;
    doors: number;
    seats: number;
    gearType: string;
    mileage: string;
    images: string[];
    whatsIncluded: string[];
    ac: boolean,
    languages: string[],
    verified: string,
    experience: string,
    pp: string,
    vehicleOwnerId: string;
    perKm: boolean;
    perKmPrice: number;
    dailyRate: boolean;
}

interface MyToken {
    sub: string;
    roles: string[];
    username: string;
    email: string;
    id: string
}

// Updated vehicle booking request interface to match backend
interface VehicleBookingRequest {
    vehicleId: string;
    travelerId: string;
    startDate: string;
    endDate: string;
    startLocation: string;
    endLocation: string;
    pickupTime: string;
    oneWay: boolean;
    languagePreference: string;
    numberOfPassengers: number;
    specialRequests?: string;
    contactInformation?: string;
}

cssInterop(Image, { className: "style" });

const pic = require('../../../../../assets/images/tabbar/towert.png')
const location = require('../../../../../assets/images/pin.png')
const thumbnail = require('../../../../../assets/images/tabbar/create/hotel/hotelthumb.png')
const star = require('../../../../../assets/images/tabbar/create/hotel/stars.png')
const back = require('../../../../../assets/images/back.png')
const profile = require('../../../../../assets/images/sideTabs/profile.jpg')
const tele = require('../../../../../assets/images/tabbar/create/guide/telephones.png')
const mark = require('../../../../../assets/images/mark.png')
const setting = require('../../../../../assets/images/setting.png')
const infinity = require('../../../../../assets/images/infinity.png')

export default function Views() {
    const router = useRouter();
    const { id } = useLocalSearchParams();

    const [booking, setBooking] = useState<Book | null>(null);
    const [vehicle, setVehicle] = useState<Vehicle | null>(null)
    const [categories, setCategories] = useState<Category[]>([])
    const [reviews, setReviews] = useState<Review[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const getDetails = async () => {
            try {
                const res = await fetch(`http://localhost:8080/traveler/vehicle-data?id=${id}`)
                const data = await res.json();
                if (data) {
                    setVehicle(data)
                }

                const res1 = await fetch(`http://localhost:8080/traveler/vehicles-all`)
                const data1 = await res1.json()
                if (data1.length > 0) {
                    setCategories(data1)
                }

                const res2 = await fetch(`http://localhost:8080/traveler/reviews-view?id=${id}`)
                if (res2) {
                    const data2 = await res2.json()
                    setReviews(data2)
                }
            } catch (err) {
                console.log(err)
            }
        }
        getDetails()
    }, [])

    // Load booking data on focus
    useFocusEffect(
        useCallback(() => {
            const loadData = async () => {
                try {
                    const savedBooking = await AsyncStorage.getItem('solocbookings');
                    if (savedBooking) {
                        setBooking(JSON.parse(savedBooking));
                    }
                } catch (error) {
                    console.error("Failed to load booking data:", error);
                }
            };
            loadData();
        }, [])
    );

    const getReviewLabel = (score: number): string => {
        if (score >= 9) return 'Excellent';
        if (score >= 8) return 'Very Good';
        if (score >= 7) return 'Good';
        if (score >= 5) return 'Average';
        return 'Poor';
    };

    const catName = categories.find(cat => cat._id == vehicle?.catId)

    const rating = vehicle && vehicle?.reviewCount > 0
        ? parseFloat(((vehicle?.stars / vehicle?.reviewCount) * 2).toFixed(1))
        : 0;

    // NEW: Updated booking function with proper API integration
    const handleBooking = async () => {
        if (!vehicle || !booking) {
            Alert.alert("Error", "Vehicle or booking data not available");
            return;
        }

        try {
            setIsLoading(true);
            
            // Get user token
            const keys = await AsyncStorage.getItem("token");
            if (!keys) {
                Alert.alert("Error", "Please login to continue");
                router.push("/(auth)");
                return;
            }

            const token: MyToken = jwtDecode(keys);

            // Prepare booking request data
            const bookingRequest: VehicleBookingRequest = {
                vehicleId: vehicle._id,
                travelerId: token.id,
                startDate: booking.dates[0], // First selected date
                endDate: booking.dates[booking.dates.length - 1], // Last selected date
                startLocation: booking.start,
                endLocation: booking.end,
                pickupTime: booking.time,
                oneWay: booking.oneWay,
                languagePreference: booking.language,
                numberOfPassengers: vehicle.seats, // You might want to make this user-selectable
                specialRequests: "", // Could be added to your booking form
                contactInformation: token.email || ""
            };

            // Make API call to create vehicle booking
            const response = await fetch('http://localhost:8080/vehicle/book', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // If you have authentication headers, add them here
                    // 'Authorization': `Bearer ${keys}`
                },
                body: JSON.stringify(bookingRequest)
            });

            if (response.ok) {
                const createdBooking = await response.json();
                console.log("Booking created successfully:", createdBooking);

                // Clear booking session data
                await AsyncStorage.multiRemove([
                    'solocbookingSession',
                    'solocbookingComplete',
                    'solocbookings'
                ]);

                Alert.alert(
                    "Booking Successful!",
                    `Your vehicle booking has been created successfully. Booking ID: ${createdBooking._id}`,
                    [
                        {
                            text: "OK",
                            onPress: () => {
                                router.replace('/(tabs)/bookings');
                            }
                        }
                    ]
                );
            } else {
                const errorData = await response.text();
                console.error("Booking failed:", errorData);
                Alert.alert("Booking Failed", errorData || "Failed to create booking. Please try again.");
            }

        } catch (error) {
            console.error("Error creating booking:", error);
            Alert.alert("Error", "An error occurred while creating your booking. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    // Calculate price display
    const getPriceDisplay = () => {
        if (!vehicle || !booking) return "N/A";
        
        const days = booking.dates.length;
        
        if (vehicle.dailyRate) {
            const totalPrice = vehicle.dailyRatePrice * days;
            return `${totalPrice}.00 LKR (${days} day${days > 1 ? 's' : ''})`;
        } else if (vehicle.perKm) {
            return `${vehicle.perKmPrice}.00 LKR/km`;
        }
        
        return `${vehicle.dailyRatePrice}.00 LKR`;
    };

    return (
        <View className={`${Platform.OS === 'web' ? 'h-screen overflow-auto' : 'h-full'} bg-gray-200`}>
            <TouchableOpacity className="pl-3" onPress={() => router.back()}>
                <Text>Back</Text>
            </TouchableOpacity>

            <ScrollView
                className="w-full h-[97%]"
                contentContainerClassName="flex-col w-full py-5"
                showsVerticalScrollIndicator={false}
            >
                <View className="justify-between gap-5">
                    <View className="w-full gap-5">
                        {/* Vehicle Details Section */}
                        <View className="w-full">
                            <View className="w-full flex-row gap-5 bg-white mx-0">
                                <View className="w-[200px] h-[160px] p-3">
                                    <Image source={{ uri: `data:image/jpeg;base64,${vehicle?.image}` }} className="w-full h-full" />
                                </View>
                                <View className="flex-1 pr-3 mt-1">
                                    <View className="flex-row justify-between">
                                        <Text className="text-base font-semibold text-gray-800 mb-0.5">{vehicle?.vehicleModel}</Text>
                                        <Text className="text-base font-semibold text-gray-800 mb-0.5 bg-yellow-200 px-1 rounded-lg">{vehicle?.vehicleNumber}</Text>
                                    </View>
                                    <View>
                                        <View className="w-[80%] flex-row justify-between">
                                            <Text className="text-xs text-gray-500 mb-2">{catName?.title}</Text>
                                            <View className="flex-row items-start gap-2">
                                                <Image source={mark} className='w-4 h-4' />
                                                <Text className="text-xs text-gray-500 mb-2">{vehicle?.ac ? 'A/C' : 'Non A/C'}</Text>
                                            </View>
                                        </View>
                                        <View className="flex-row gap-1">
                                            <Image source={setting} className='w-4 h-4' />
                                            <Text className="text-xs text-gray-500 mb-2">{vehicle?.gearType}</Text>
                                        </View>
                                        <View className="flex-row items-center gap-1">
                                            <Image source={infinity} className='w-5 h-5' />
                                            <Text className="text-xs text-gray-600">{vehicle?.mileage}</Text>
                                        </View>
                                    </View>
                                    <View className="mb-3 item">
                                        <Text className="text-sm font-semibold text-gray-800">Around {vehicle?.location}</Text>
                                    </View>

                                    <View className="flex-row justify-between">
                                        <View>
                                            <Text>{vehicle?.doors} doors</Text>
                                            <Text>{vehicle?.seats} seats</Text>
                                        </View>
                                        <View className="justify-between mb-3">
                                            <View className="flex-row gap-2">
                                                <View className={`rounded px-3 py-1 ${rating >= 9 ? 'bg-green-500' :
                                                    rating >= 8 ? 'bg-emerald-400' :
                                                        rating >= 7 ? 'bg-yellow-400' :
                                                            rating >= 5 ? 'bg-orange-400' :
                                                                'bg-red-500'}`}>
                                                    <Text className="text-white text-lg font-semibold">{rating}</Text>
                                                </View>
                                                <View>
                                                    <Text className="text-md font-semibold text-gray-800">{getReviewLabel(rating)}</Text>
                                                    <Text className="text-sm text-gray-500">{vehicle?.reviewCount} reviews</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>

                        {/* Photos Section */}
                        <View className="bg-white mx-4 my-2 pb-8 px-3 rounded-lg shadow-md">
                            <Text className=" text-2xl font-semibold py-1">Photos</Text>
                            <View className="w-full items-center">
                                <ScrollView
                                    horizontal
                                    className="w-[80%] h-50 border-gray-200 rounded-2xl"
                                    contentContainerClassName="flex-row gap-1"
                                    showsHorizontalScrollIndicator={false}
                                    nestedScrollEnabled={true}
                                >
                                    {vehicle?.images.map((x, i) => {
                                        return (
                                            <View key={i} className="flex-row w-[310px] h-40">
                                                <Image className=" w-[310px] h-full" source={{ uri: `data:image/jpeg;base64,${x}` }} />
                                            </View>
                                        )
                                    })}
                                </ScrollView>
                            </View>
                        </View>

                        {/* Driver Details Section */}
                        <View className="bg-white mx-4 px-3 rounded-lg shadow-md">
                            <Text className="text-xl py-2 font-semibold">Driver Details</Text>
                            <View>
                                <View className="flex-row items-center px-2 gap-10">
                                    <Image source={{ uri: `data:image/jpeg;base64,${vehicle?.pp}` }} className="w-24 h-24 rounded-full mb-10" />
                                    <View className=" gap-3 flex-col">
                                        <View className="flex-row gap-10">
                                            <View className="flex-1 ml-2">
                                                <Text className="text-xl font-bold text-gray-800">{vehicle?.firstName}</Text>
                                                <Text className="text-sm text-gray-500">{vehicle?.lastName}</Text>
                                            </View>
                                            <View>
                                                {vehicle?.verified && (
                                                    <View className="bg-white p-1 rounded-full flex-row items-end gap-2">
                                                        <Image source={mark} className="w-4 h-4" />
                                                        <Text>Verified</Text>
                                                    </View>
                                                )}
                                            </View>
                                        </View>
                                        <View className="items-center flex-row gap-3 justify-center">
                                            <Image source={tele} className="w-4 h-4" />
                                            <Text>{vehicle?.phone}</Text>
                                        </View>
                                        <View className="flex-row flex-wrap gap-2 pt-3">
                                            {vehicle?.languages.map((language, index) => (
                                                <View key={index} className="flex-row items-center bg-blue-50 px-3 py-1.5 rounded-full border border-blue-200 gap-1.5">
                                                    <Text className="text-sm text-blue-600 font-medium">{language}</Text>
                                                </View>
                                            ))}
                                        </View>
                                    </View>
                                </View>
                            </View>

                            {/* Stats Section */}
                            <View className="flex-row justify-around my-4 py-3 bg-gray-50 rounded-lg">
                                <View className="items-center">
                                    <Text className="text-lg font-bold text-gray-800">{vehicle?.driverAge}</Text>
                                    <Text className="text-sm text-gray-500">Age</Text>
                                </View>
                                <View className="items-center">
                                    <Text className="text-lg font-bold text-gray-800">{vehicle?.experience}</Text>
                                    <Text className="text-sm text-gray-500">Experience</Text>
                                </View>
                                <View className="items-center">
                                    <Text className="text-lg font-bold text-gray-800">{vehicle?.location}</Text>
                                    <Text className="text-sm text-gray-500">Based In</Text>
                                </View>
                            </View>
                        </View>

                        {/* Trip Details Section */}
                        {booking && (
                            <View className="p-4 m-4 bg-white rounded-lg shadow">
                                <View className="my-4 flex-row justify-between">
                                    <View className="flex-col items-start">
                                        <Text className="text-base text-gray-700">{booking?.start}</Text>
                                        <Image source={location} className="w-5 h-5" />
                                    </View>
                                    <View className="flex-col items-end">
                                        <Text className="text-base text-gray-700">{booking?.end}</Text>
                                        <Image source={location} className="w-5 h-5" />
                                    </View>
                                </View>
                                <View className="flex-1 mx-1 border-t-8 border-dotted border-gray-300" />
                                <View className="h-px bg-gray-200" />

                                {/* Date & Duration Details */}
                                <View className="my-4 flex-row justify-between items-center">
                                    <View className="flex-row items-center">
                                        <View className="ml-3">
                                            <Text className="text-sm text-gray-500">Dates</Text>
                                            <Text className="text-base font-semibold text-gray-800">
                                                {booking?.dates[0]} {booking && booking?.dates.length > 1 && `- ${booking?.dates[booking.dates.length - 1]}`}
                                            </Text>
                                        </View>
                                    </View>
                                    <View className="items-end">
                                        <Text className="text-sm text-gray-500">Duration</Text>
                                        <Text className="text-base font-semibold text-gray-800">
                                            {booking?.dates.length} Day {booking && booking?.dates.length > 1 ? 's' : ''}
                                        </Text>
                                    </View>
                                </View>

                                <View className="h-px bg-gray-200" />

                                {/* Trip Type & Pickup Time */}
                                <View className="mt-4 flex-row justify-between items-center">
                                    <View>
                                        <Text className="text-base font-semibold text-gray-700">Trip Type</Text>
                                        <View className="flex-row items-center gap-2 bg-blue-50 px-3 py-1 rounded-full mt-1">
                                            <Text className="text-blue-700 font-bold">
                                                {booking?.oneWay ? 'One-Way' : 'Round Trip'}
                                            </Text>
                                        </View>
                                    </View>
                                    <View>
                                        <Text className="text-base font-semibold text-gray-700">Pickup Time</Text>
                                        <Text className="text-base text-gray-600 mt-1">{booking?.time}</Text>
                                    </View>
                                </View>

                                {/* Language Preference */}
                                <View className="mt-4">
                                    <Text className="text-sm text-gray-500">Language Preference</Text>
                                    <Text className="text-base font-semibold text-gray-800">{booking?.language}</Text>
                                </View>
                            </View>
                        )}

                        {/* What's Included Section */}
                        <View className="bg-white mx-4 my-2 p-4 rounded-lg shadow-md">
                            <Text className="text-lg font-semibold text-gray-800 mb-4">What's included</Text>
                            <View className="space-y-3">
                                {vehicle?.whatsIncluded.map((item, index) => (
                                    <View key={index} className="flex-row items-center gap-3">
                                        <Image source={mark} className="w-5 h-5" />
                                        <Text className="text-sm text-gray-600 flex-1">{item}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>

                        {/* Reviews Section */}
                        {reviews.length > 0 && (
                            <View className="bg-white mx-4 my-2 p-4 rounded-lg shadow-md">
                                <View className="w-[35%] flex-row justify-between">
                                    <Text className=" text-2xl font-semibold py-1">Reviews</Text>
                                </View>
                                <View>
                                    <ScrollView
                                        className="w-full h-72 rounded-2xl mx-2"
                                        contentContainerClassName=" flex-col px-2 py-3 gap-5 "
                                        showsVerticalScrollIndicator={false}
                                        nestedScrollEnabled={true}
                                    >
                                        {reviews.map((x, i) => {
                                            return (
                                                <View key={i} className="bg-gray-200 px-3 rounded-2xl">
                                                    <View className="flex-row items-center">
                                                        <Image className="w-10 h-10 rounded-full" source={{ uri: `data:image/jpeg;base64,${x.dp}` }} />
                                                        <Text className="px-3 text-justify my-5 text-gray-500 font-semibold">{x.author} from {x.country}</Text>
                                                        <View className="flex-row items-center gap-1">
                                                            <Image className="w-5 h-5" source={star} />
                                                            <Text>{x.stars}/5</Text>
                                                        </View>
                                                    </View>
                                                    <Text className="text-lg mx-5 my-2">{x.text}</Text>
                                                </View>
                                            )
                                        })}
                                    </ScrollView>
                                </View>
                            </View>
                        )}
                    </View>

                    {/* Book Now Section */}
                    <View className="self-center flex-row items-center bg-[#FEFA17] w-[95%] h-12 rounded-2xl justify-between px-1 shadow-lg">
                        <Text className="px-3 font-extrabold text-xl">{getPriceDisplay()}</Text>
                        <TouchableOpacity 
                            className={`rounded-xl w-[30%] ${isLoading ? 'bg-gray-400' : 'bg-[#84848460]'}`} 
                            onPress={handleBooking}
                            disabled={isLoading}
                        >
                            <View className="py-2 px-2 flex-row justify-between items-center w-full">
                                <Text className={isLoading ? 'text-gray-600' : 'text-black'}>
                                    {isLoading ? 'Booking...' : 'Book Now'}
                                </Text>
                                {!isLoading && <Image className="w-5 h-5" source={back} />}
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}