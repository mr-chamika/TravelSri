import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, TouchableOpacity, ScrollView, Platform } from "react-native";
import { cssInterop } from 'nativewind'
import { Image } from 'expo-image'
import { useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Languages } from "lucide-react-native";

interface Book {
    dates: string[];
    start: string;
    end: string;
    language: string;
    oneWay: boolean;
    time: string;
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
    id: string;
    image: any;
    firstName: string;
    lastName: string;
    stars: number;
    location: string;
    price: number;
    age: number;
    vehicleNumber: string;
    phone: string;
    reviewCount: number;
    name: string;
    category: string;
    doors: number;
    seats: number;
    gearType: string;
    mileage: string;
    reviewers: any[];
    images: any[]; // Assuming 'images' is an array of images for the gallery
    whatsIncluded: string[];
    ac: boolean,
    languages: string[],
    verified: string,
    identified: string,
    experience: string,
    pp: string,
}

export default function Views() {

    const router = useRouter();
    const { id } = useLocalSearchParams();

    useEffect(() => {

        getItem(id)

    }, [id])

    const [item, setItem] = useState<Vehicle | null>(null)
    const [booking, setBooking] = useState<Book | null>(null);

    const groupCollection = [
        {
            id: '1',
            age: 30,
            image: "https://images.unsplash.com/photo-1549924231-f129b911e442?w=300&h=200&fit=crop",
            pp: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
            firstName: 'Kasthuri',
            lastName: 'zoisa',
            stars: 3,
            location: 'Colombo',
            price: 100,
            vehicleNumber: 'ABC 0123',
            phone: '0123456789',
            reviewCount: 2,
            name: "Perodua Axia",
            category: "Seddan",
            doors: 2,
            seats: 4,
            gearType: "Automatic",
            mileage: "Unlimited km",
            ac: true,
            languages: ["sinhala", "tamil"],
            verified: 'done',
            identified: 'done',
            experience: '2 years',
            whatsIncluded: [
                "Collision Damage Waiver (CDW)",
                "Theft Cover",
                "Third-Party Liability (TPL)"
            ],
            reviewers: [
                {
                    id: '1',
                    name: 'Sunny',
                    from: 'America',
                    images: pic,
                    review: 'mmh maru',
                    stars: 3
                },
                {
                    id: '2',
                    name: 'Lena',
                    from: 'Spain',
                    images: pic,
                    review: "set na meka",
                    stars: 2
                },
                {
                    id: '3',
                    name: 'Jhonny',
                    from: 'Sweedan',
                    images: pic,
                    review: "Goooood",
                    stars: 0
                },
                {
                    id: '3',
                    name: 'Jhonny',
                    from: 'Sweedan',
                    images: pic,
                    review: "Goooood",
                    stars: 0
                },
                {
                    id: '3',
                    name: 'Jhonny',
                    from: 'Sweedan',
                    images: pic,
                    review: "Goooood",
                    stars: 0
                },
                {
                    id: '3',
                    name: 'Jhonny',
                    from: 'Sweedan',
                    images: pic,
                    review: "Goooood",
                    stars: 0
                }
            ],
            langs: ['sinhala', 'English', 'French', 'Mexican', 'Tamil', 'Japan'],
            images: [pic, thumbnail, thumbnail, thumbnail, thumbnail, thumbnail]

        },
        // { id: '2', image: bg, title: 'Galle to Kurunegala', duration: 1, date: '05 july 2021', stats: 'Pending', price: 2300, max: 10, current: 13, routes: [{ place: 'peradeniya Botnical Garden', images: g }, { place: 'Sri Dalada Maligawa', images: l }, { place: 'Kandy Lake Round', images: te }] },
        // { id: '3', image: t, title: 'Colombo to jaffna', duration: 4, date: '06 aug 2022', stats: 'Cancelled', price: 1500, max: 25, current: 10, routes: [{ place: 'peradeniya Botnical Garden', images: g }, { place: 'Sri Dalada Maligawa', images: l }, { place: 'Kandy Lake Round', images: te }] },
        // { id: '4', image: pic, title: 'Matara to Kandy', duration: 10, date: '07 sept 2023', stats: 'Pending', price: 9000, max: 10, current: 4, routes: [{ place: 'peradeniya Botnical Garden', images: g }, { place: 'Sri Dalada Maligawa', images: l }, { place: 'Kandy Lake Round', images: te }] },
        // { id: '5', image: bg, title: 'Galle to Dehiwala', duration: 2, date: '08 oct 2024', stats: 'Pending', price: 1800, max: 15, current: 10, routes: [{ place: 'peradeniya Botnical Garden', images: g }, { place: 'Sri Dalada Maligawa', images: l }, { place: 'Kandy Lake Round', images: te }] },
        // { id: '6', image: t, title: 'Matale to Rajarata', duration: 6, date: '09 nov 2025', stats: 'Confirm', price: 700, max: 30, current: 24, routes: [{ place: 'peradeniya Botnical Garden', images: g }, { place: 'Sri Dalada Maligawa', images: l }, { place: 'Kandy Lake Round', images: te }] },

    ];

    const getItem = (Id: string | string[]) => {
        groupCollection.map((collection, i) => {
            if (collection.id == Id) {
                setItem(collection)
            }
        })
    }

    const getReviewLabel = (score: number): string => {
        if (score >= 9) return 'Excellent';
        if (score >= 8) return 'Very Good';
        if (score >= 7) return 'Good';
        if (score >= 5) return 'Average';
        return 'Poor';
    };

    const rating = item && item?.reviewCount > 0
        ? parseFloat(((item?.stars / item?.reviewCount) * 2).toFixed(1))
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
                                    <Image source={{ uri: item?.image }} className="w-full h-full" />
                                </View>
                                <View className="flex-1 pr-3 mt-1">
                                    <View className="flex-row justify-between">
                                        <Text className="text-base font-semibold text-gray-800 mb-0.5">{item?.name}</Text>
                                        <Text className="text-base font-semibold text-gray-800 mb-0.5 bg-yellow-200 px-1 rounded-lg">{item?.vehicleNumber}</Text>
                                    </View>
                                    <View>
                                        <View className="w-[80%] flex-row justify-between">
                                            <Text className="text-xs text-gray-500 mb-2">{item?.category}</Text>
                                            <View className="flex-row items-start gap-2">
                                                <Image source={mark} className='w-4 h-4' />
                                                <Text className="text-xs text-gray-500 mb-2">{item?.ac ? 'A/C' : 'Non A/C'}</Text>

                                            </View>
                                        </View>
                                        <View className="flex-row gap-1">

                                            <Image source={setting} className='w-5 h-5' />
                                            <Text className="text-xs text-gray-500 mb-2">{item?.gearType}</Text>
                                        </View>

                                        <View className="flex-row items-center gap-1">

                                            <Image source={infinity} className='w-5 h-5' />
                                            <Text className="text-xs text-gray-600">{item?.mileage}</Text>
                                        </View>
                                    </View>
                                    {/* Location */}
                                    <View className="mb-3 item">
                                        <Text className="text-sm font-semibold text-gray-800">Around {item?.location}</Text>
                                    </View>

                                    <View className="flex-row justify-between">
                                        <View>
                                            <Text>{item?.doors} doors</Text>
                                            <Text>{item?.seats} seats</Text>
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
                                                    <Text className="text-sm text-gray-500">{item?.reviewCount} reviews</Text>
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
                                    {item?.images.map((x, i) => {

                                        return (

                                            <View key={i} className="flex-row w-[310px] h-40">

                                                <Image className=" w-[310px] h-full" source={x} />

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
                                    <Image source={item?.pp} className="w-24 h-24 rounded-full mb-10" />
                                    <View className=" gap-3 flex-col">
                                        <View className="flex-row gap-10">
                                            <View className="flex-1 ml-2">
                                                <Text className="text-xl font-bold text-gray-800">{item?.firstName}</Text>
                                                <Text className="text-sm text-gray-500">{item?.lastName}</Text>
                                            </View>
                                            <View>
                                                {item?.verified && (
                                                    <View className="bg-white p-1 rounded-full flex-row items-end gap-2">
                                                        <Image source={mark} className="w-4 h-4" />
                                                        <Text>Verified</Text>
                                                    </View>
                                                )}
                                            </View>
                                        </View>
                                        <View className="items-center flex-row gap-3 justify-center">

                                            <Image source={tele} className="w-4 h-4" />
                                            <Text>{item?.phone}</Text>

                                        </View>
                                        <View className="flex-row flex-wrap gap-2 pt-3">
                                            {item?.languages.map((language, index) => (
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
                                    <Text className="text-lg font-bold text-gray-800">{item?.age}</Text>
                                    <Text className="text-sm text-gray-500">Age</Text>
                                </View>
                                <View className="items-center">
                                    <Text className="text-lg font-bold text-gray-800">{item?.experience}</Text>
                                    <Text className="text-sm text-gray-500">Experience</Text>
                                </View>
                                <View className="items-center">
                                    <Text className="text-lg font-bold text-gray-800">{item?.location}</Text>
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
                                        {booking?.oneWay ? 'One-Way' : 'Round Trip'}
                                    </Text>
                                </View>
                            </View>
                        </View>
                        <View className="bg-white mx-4 my-2 p-4 rounded-lg shadow-md">
                            <Text className="text-lg font-semibold text-gray-800 mb-4">What's included</Text>
                            <View className="space-y-3">
                                {item?.whatsIncluded.map((item, index) => (
                                    <View key={index} className="flex-row items-center gap-3">
                                        <Image source={mark} className="w-5 h-5" />
                                        <Text className="text-sm text-gray-600 flex-1">{item}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>

                        <View className="bg-white mx-4 my-2 p-4 rounded-lg shadow-md">

                            <View className="w-[35%] flex-row justify-between">
                                <Text className=" text-2xl font-semibold py-1">Reviews</Text>
                                {/* <View className="flex-row items-center">
                                    <Image className="w-5 h-5" source={star} />
                                    <Text>{item?.stars}/5</Text>
                                </View> */}
                            </View>
                            <View>
                                <ScrollView

                                    className="w-full h-72 rounded-2xl mx-2"
                                    contentContainerClassName=" flex-col px-2 py-3 gap-5 "
                                    showsVerticalScrollIndicator={false}
                                    nestedScrollEnabled={true}

                                >
                                    {item?.reviewers.map((x, i) => {

                                        return (

                                            <View key={i} className="bg-gray-200 px-3 rounded-2xl">
                                                <View className="flex-row items-center">
                                                    <Image className="w-10 h-10 rounded-full" source={x.images} />
                                                    <Text className="px-3 text-justify my-5 text-gray-500 font-semibold">{x.name} from {x.from}</Text>
                                                    <View className="flex-row items-center gap-1">
                                                        <Image className="w-5 h-5" source={star} />
                                                        <Text>{x.stars}/5</Text>
                                                    </View>
                                                </View>
                                                <Text className="text-lg mx-5 my-2">{x.review}</Text>

                                            </View>
                                        )
                                    })

                                    }
                                </ScrollView>

                            </View>

                        </View>
                    </View>


                    <View className="self-center flex-row items-center bg-[#FEFA17] w-[95%] h-12 rounded-2xl justify-between px-1 shadow-lg">

                        <Text className="px-3 font-extrabold text-xl">{item?.price}.00 LKR/km</Text>

                        <TouchableOpacity className=" bg-[#84848460] rounded-xl w-[30%] " onPress={() => router.push(`/views/payment/${id}`)}>
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