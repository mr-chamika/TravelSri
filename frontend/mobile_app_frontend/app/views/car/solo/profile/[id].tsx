import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, TouchableOpacity, ScrollView, Platform } from "react-native";
import { cssInterop } from 'nativewind'
import { Image } from 'expo-image'
import { useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Languages } from "lucide-react-native";
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

// Define a clear interface for your data
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
    images: string[]; // Assuming 'images' is an array of images for the gallery
    whatsIncluded: string[];
    ac: boolean,
    languages: string[],
    verified: string,
    experience: string,
    pp: string,
}


export interface Booking {
    _id: string;
    userId: string;
    serviceId: string;
    type: string;
    thumbnail: string;
    title: string;
    subtitle: string[];
    location: string;
    bookingDates: string[];
    stars: number;
    ratings: number;
    paymentStatus: boolean;
    guests: number;
    facilities: string[];
    price: number;
    status: string;
    mobileNumber: string;
}

interface MyToken {
    sub: string;
    roles: string[];
    username: string;
    email: string;
    id: string
}


export default function Views() {

    const router = useRouter();
    const { id } = useLocalSearchParams();

    const [booking, setBooking] = useState<Book | null>(null);
    const [vehicle, setVehicle] = useState<Vehicle | null>(null)
    const [categories, setCategories] = useState<Category[]>([])
    const [reviews, setReviews] = useState<Review[]>([]);
    const [bookings, setBookings] = useState<Booking | null>(null)



    useEffect(() => {

        const getDetails = async () => {
            try {
                const res = await fetch(`http://localhost:8080/traveler/vehicle-data?id=${id}`)

                const data = await res.json();

                if (data) {

                    //console.log(data)
                    setVehicle(data)

                }

                const res1 = await fetch(`http://localhost:8080/traveler/vehicles-all`)
                //const res = await fetch(`https://travelsri-backend.onrender.com/traveler/vehicles-all`)

                const data1 = await res1.json()

                if (data1.length > 0) {
                    //console.log(data1)
                    setCategories(data1)
                }

                const res2 = await fetch(`http://localhost:8080/traveler/reviews-view?id=${id}`)
                //const res2 = await fetch(`https://travelsri-backend.onrender.com/traveler/reviews-view?id=${id}`)

                if (res2) {

                    const data2 = await res2.json()
                    //console.log(data2)
                    setReviews(data2)

                }

            } catch (err) {

                console.log(err)

            }
        }
        getDetails()
    }, [])

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

    useFocusEffect(
        useCallback(() => {
            const loadData = async () => {
                try {
                    // 1. Get the item from storage using its key
                    const savedBooking = await AsyncStorage.getItem('solocbookings');

                    // 2. Check if data exists
                    if (savedBooking) {
                        // 3. Parse the JSON string back into an object
                        setBooking(JSON.parse(savedBooking));
                    }
                } catch (error) {
                    console.error("Failed to load booking data:", error);
                }
            };

            loadData();
        }, [])
    );

    const handleBooking = async () => {

        const keys = await AsyncStorage.getItem("token");

        if (keys) {

            const data = await AsyncStorage.getItem('solocbookings')


            const token: MyToken = jwtDecode(keys)


            const book = { ...bookings }
            book.userId = token.id
            book.serviceId = id.toString();
            book.type = 'vehicle';
            book.thumbnail = vehicle?.image;
            book.title = vehicle?.firstName + " " + vehicle?.lastName + " | " + vehicle?.vehicleModel + " | " + catName?.title;
            book.location = vehicle?.location;

            if (data) {

                const bookingData = JSON.parse(data)

                if (bookingData) {

                    book.bookingDates = bookingData.dates;

                    var l = new Array()

                    l.push(bookingData.start + " to " + bookingData.end)

                    book.subtitle = l || [];

                }

                book.ratings = rating;
                book.paymentStatus = false;
                book.facilities = vehicle?.whatsIncluded;
                book.price = vehicle?.dailyRatePrice;
                book.status = 'active';
                book.mobileNumber = vehicle?.phone;

                await fetch(`http://localhost:8080/traveler/create-booking`, {

                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(book)

                })
                    .then(res => res.text())
                    .then(

                        async (data) => {

                            console.log(data);
                            await AsyncStorage.removeItem('solocbookingSession');
                            await AsyncStorage.removeItem('solocbookingComplete')
                            router.replace('/(tabs)/bookings')

                        })
                    .catch(err => console.log("Error from booking create " + err))

            }
        }

    }

    return (

        <View className={`${Platform.OS === 'web' ? 'h-screen overflow-auto' : 'h-full'} bg-gray-200`}>

            <TouchableOpacity className="pl-3" onPress={() => router.back()}><Text>Back</Text></TouchableOpacity>

            <ScrollView

                className="w-full h-[97%]"
                contentContainerClassName="flex-col w-full py-5"
                showsVerticalScrollIndicator={false}

            >
                <View className="justify-between gap-5">
                    <View className="w-full gap-5">

                        <View className="w-full">

                            <View className="w-full flex-row gap-5 bg-white mx-0">


                                {/* Vehicle Image */}
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
                                    {/* Location */}
                                    <View className="mb-3 item">
                                        <Text className="text-sm font-semibold text-gray-800">Around {vehicle?.location}</Text>
                                    </View>

                                    <View className="flex-row justify-between">
                                        <View>
                                            <Text>{vehicle?.doors} doors</Text>
                                            <Text>{vehicle?.seats} seats</Text>
                                        </View>
                                        {/* Supplier stars */}
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
                                    })

                                    }
                                </ScrollView>

                            </View>

                        </View>

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

                            {/* --- Stats Section --- */}
                            <View className="flex-row justify-around my-4 py-3 bg-gray-50 rounded-lg">
                                <View className="items-center">
                                    <Text className="text-lg font-bold text-gray-800">{vehicle?.driverAge}</Text>
                                    <Text className="text-sm text-gray-500">Age</Text>
                                </View>
                                <View className="items-center">
                                    <Text className="text-lg font-bold text-gray-800">{vehicle?.experience} years</Text>
                                    <Text className="text-sm text-gray-500">Experience</Text>
                                </View>
                                <View className="items-center">
                                    <Text className="text-lg font-bold text-gray-800">{vehicle?.location}</Text>
                                    <Text className="text-sm text-gray-500">Based In</Text>
                                </View>

                            </View>
                        </View>

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
                                        <Text className="text-base font-semibold text-gray-800">{booking?.dates[0]} {booking && booking?.dates.length > 1 && `- ${booking?.dates[booking.dates.length - 1]}`}</Text>
                                    </View>
                                </View>
                                <View className="items-end">
                                    <Text className="text-sm text-gray-500">Duration</Text>
                                    <Text className="text-base font-semibold text-gray-800">{booking?.dates.length} Day {booking && booking?.dates.length > 1 ? 's' : ''}</Text>
                                </View>
                            </View>

                            <View className="h-px bg-gray-200" />

                            {/* Trip Type */}
                            <View className="mt-4 flex-row justify-between items-center">
                                <Text className="text-base font-semibold text-gray-700">Trip Type</Text>
                                <View className="flex-row items-center gap-2 bg-blue-50 px-3 py-1 rounded-full">
                                    <Text className="text-blue-700 font-bold">
                                        {booking?.oneWay ? 'One-Way' : 'Way Back'}
                                    </Text>
                                </View>
                            </View>
                        </View>
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


                        {reviews.length > 0 &&

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
                                        })

                                        }
                                    </ScrollView>

                                </View>

                            </View>
                        }


                    </View>


                    <View className="self-center flex-row items-center bg-[#FEFA17] w-[95%] h-12 rounded-2xl justify-between px-1 shadow-lg">

                        <Text className="px-3 font-extrabold text-xl">{vehicle?.dailyRatePrice}.00 LKR/km</Text>

                        <TouchableOpacity className=" bg-[#84848460] rounded-xl w-[30%] " onPress={handleBooking}>
                            <View className="py-2 px-2 flex-row justify-between items-center w-full">
                                <Text>Book Now</Text>
                                <Image className="w-5 h-5" source={back} />
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>

            </ScrollView >
        </View >

    )

}