import { useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, TouchableOpacity, ScrollView, Platform } from "react-native";
import { cssInterop } from 'nativewind'
import { Image } from 'expo-image'
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";


cssInterop(Image, { className: "style" });

const pic = require('../../../../assets/images/tabbar/towert.png')
const location = require('../../../../assets/images/tabbar/create/pin.png')
const thumbnail = require('../../../../assets/images/tabbar/create/hotel/hotelthumb.png')
const star = require('../../../../assets/images/tabbar/create/hotel/stars.png')
const back = require('../../../../assets/images/back.png')
const profile = require('../../../../assets/images/sideTabs/profile.jpg')
const tele = require('../../../../assets/images/tabbar/create/guide/telephones.png')
const globl = require('../../../../assets/images/tabbar/create/guide/global.png')
const mark = require('../../../../assets/images/mark.png')
const cross = require('../../../../assets/images/cross.png');
const xp = require('../../../../assets/images/xp.png')
const education = require('../../../../assets/images/mortarboard.png')
const certificate = require('../../../../assets/images/quality.png')
const award = require('../../../../assets/images/trophy.png')

interface Review {

    _id: string,
    serviseId: string,
    text: string,
    country: string,
    stars: number,
    author: string,
    dp: string,

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

interface Guide {
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
    verified: string;
    identified: string;
    specializations: string[];
    responseTime: string;
    responseRate: number;
    mobileNumber: string;
    languages: string[];
    images: any[];
    bio: string,
    education: string[];
    certifications: string[];
    whyChooseMe: string[];
    tourStyles: string[];
    awards: string[];
    daysPerWeek: string[];
}


export default function Views() {

    const router = useRouter();
    const { id } = useLocalSearchParams();

    const [item, setItem] = useState<Guide | null>(null)
    const [reviews, setReviews] = useState<Review[]>([]);
    const [booking, setBooking] = useState<Booking | null>(null)



    useEffect(() => {

        const getGuide = async () => {

            try {

                const res = await fetch(`http://localhost:8080/traveler/guides-view?id=${id}`)

                const data = await res.json()

                if (data) {

                    //console.log(data);
                    setItem(data)

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

        getGuide()

    }, [])

    const handleBooking = async () => {

        const keys = await AsyncStorage.getItem("token");

        if (keys) {

            const data = await AsyncStorage.getItem('soloGuideBook')


            const token: MyToken = jwtDecode(keys)


            const book = { ...booking }
            book.userId = token.id
            book.serviceId = id.toString();
            book.type = 'guide';
            book.thumbnail = item?.pp;
            book.title = item?.firstName + " " + item?.lastName;

            book.subtitle = item?.tourStyles.slice(0, 2) || [];

            book.location = item?.location;

            if (data) {

                const bookingData = JSON.parse(data)

                if (bookingData) {

                    book.bookingDates = bookingData.dates;

                }

                book.ratings = rating;
                book.paymentStatus = false;
                book.facilities = item?.specializations;
                book.price = item?.dailyRate;
                book.status = 'active';
                book.mobileNumber = item?.mobileNumber;

                await fetch(`http://localhost:8080/traveler/create-booking`, {

                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(book)

                })
                    .then(res => res.text())
                    .then(data => { console.log(data); router.replace('/(tabs)/bookings') })
                    .catch(err => console.log("Error from booking create " + err))

            }
        }

    }



    const rating = item && item.reviewCount > 0
        ? parseFloat(((item?.stars / item?.reviewCount) * 2).toFixed(1))
        : 0;

    return (

        <View className={`${Platform.OS === 'web' ? 'h-screen overflow-auto' : 'h-full'}`}>


            <TouchableOpacity className="pl-3" onPress={() => router.back()}><Text>Back</Text></TouchableOpacity>

            <ScrollView

                className="w-full h-[97%]"
                contentContainerClassName="flex-col py-5"
                showsVerticalScrollIndicator={false}

            >
                <View className="w-full justify-between">
                    <View className="w-full gap-5 mb-4">
                        <View className="bg-white pb-2  px-3 py-2">
                            <View className="w-full flex-row mb-2 gap-5">
                                {/* Guide Image and Basic Info */}
                                {item && item.pp &&
                                    <Image source={{ uri: `data:image/jpeg;base64,${item?.pp}` }} className='w-20 h-20 rounded-full' />
                                }

                                <View className="flex-1">

                                    <View className="flex-col items-start mb-1 ml-1 space-y-2">
                                        <Text className="text-lg font-semibold text-gray-800 flex-1">{`${item?.firstName} ${item?.lastName}`}</Text>
                                        <Text className="text-sm text-gray-500 mb-1">{item?.description}</Text>
                                        <View className='w-[90%] flex-row justify-between'>
                                            <View className='gap-1 flex-row items-center'>
                                                <Image className='w-4 h-4' source={item?.verified == "done" ? tele : cross}></Image>
                                                <Text className="text-sm">Phone Verified</Text>
                                            </View>
                                            <View className='gap-1 flex-row items-center'>
                                                <Image className='w-4 h-4' source={item?.identified == "done" ? mark : cross}></Image>
                                                <Text className="text-sm">Identity Verified</Text>
                                            </View>

                                        </View>

                                    </View>
                                    <View className="flex-row justify-between mb-2">
                                        <View className="flex-row items-center gap-1 flex-1">
                                            <Image source={location} className='w-5 h-5' />
                                            <Text className="text-xs text-gray-600">{item?.location}</Text>
                                        </View>
                                        <View className="flex-row items-center gap-1 flex-1">
                                            <Image source={xp} className='w-5 h-5' />
                                            <Text className="text-xs text-gray-600">{item?.experience} experience</Text>
                                        </View>
                                    </View>

                                    {/* Rating and Response */}
                                    <View className="w-[92%] flex-row items-center justify-between">
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
                                            <Text className="text-[10px] text-gray-500">({reviews.length} Reviews)</Text>
                                        </View>

                                        <View className="items-end">
                                            <Text className="text-[10px] text-green-500 font-medium">{item?.responseTime}</Text>
                                            <Text className="text-[10px] text-gray-500">{item?.responseRate}% response rate</Text>
                                        </View>
                                    </View>
                                </View>



                            </View>

                            <View className="w-full pt-2 flex-row justify-between px-2 border-t border-gray-300">

                                <View>

                                    <Text className="text-lg font-bold self-center">{reviews.length}</Text>
                                    <Text className="text-sm text-gray-500">Reviews</Text>

                                </View>

                                <View>

                                    <Text className="text-lg font-bold self-center">{item?.experience}</Text>
                                    <Text className="text-sm text-gray-500">Experience</Text>

                                </View>
                                <View>

                                    <Text className="text-lg font-bold self-center">{item?.languages.length}</Text>
                                    <Text className="text-sm text-gray-500">Languages</Text>

                                </View>
                                <View>

                                    <Text className="text-lg font-bold self-center">{item?.specializations.length}</Text>
                                    <Text className="text-sm text-gray-500">Specializations</Text>

                                </View>


                            </View>
                        </View>

                        <View className="bg-white mx-4 my-2 p-4 rounded-lg shadow-md">
                            <Text className="text-lg font-semibold text-gray-800 mb-4">Available Days</Text>
                            <View className="flex-row flex-wrap gap-2">
                                {item?.daysPerWeek.map((day, index) => (
                                    <View key={index} className="flex-row items-center bg-orange-50 px-3 py-1.5 rounded-full border border-orange-200 gap-1.5">
                                        <Text className="text-sm text-orange-600 font-medium">{day}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                        <View className="bg-white mx-4 my-2 p-4 rounded-lg shadow-md">
                            <Text className="text-lg font-semibold text-gray-800 mb-4">Languages</Text>
                            <View className="flex-row flex-wrap gap-2">
                                {item?.languages.map((language, index) => (
                                    <View key={index} className="flex-row items-center bg-blue-50 px-3 py-1.5 rounded-full border border-blue-200 gap-1.5">
                                        <Image source={globl} className="w-5 h-5" />
                                        <Text className="text-sm text-blue-600 font-medium">{language}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>

                        <View className=" bg-white rounded-lg shadow-md m-1 px-2 pb-10 mx-5">
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

                                                <Image className=" w-[310px] h-full" source={{ uri: `data:image/jpeg;base64,${x}` }} />

                                            </View>
                                        )
                                    })

                                    }
                                </ScrollView>

                            </View>

                        </View>

                        <View className="gap-5 px-3">
                            <View className=" bg-white rounded-lg shadow-md m-1 px-2">
                                <Text className=" text-2xl font-semibold py-1">About Me</Text>
                                <Text className="px-3 my-2 text-sm italic text-justify text-gray-500 font-semibold">{item?.bio}</Text>
                            </View>

                            <View className="bg-white mx- my-2 p-4 rounded-lg shadow-md">
                                <Text className="text-lg font-semibold text-gray-800 mb-4">Specializations</Text>
                                <View className="flex-row flex-wrap gap-2">
                                    {item?.specializations.map((language, index) => (
                                        <View key={index} className="flex-row items-center bg-yellow-50 px-3 py-1.5 rounded-full border border-yellow-200 gap-1.5">
                                            <Text className="text-sm text-blue-600 font-medium">{language}</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>

                            <View className="bg-white mx-1 my-2 p-4 rounded-lg shadow-md">
                                <Text className="text-lg font-semibold text-gray-800 mb-4">Why Choose Me</Text>
                                <View className="space-y-3">
                                    {item?.whyChooseMe.map((reason, index) => (
                                        <View key={index} className="flex-row items-center gap-3">
                                            <Image source={mark} className="w-3 h-3" />
                                            <Text className="text-sm text-gray-600 flex-1 leading-snug">{reason}</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>

                            {(item?.education || item?.certifications || item?.awards) && (<View className="bg-white mx-1 my-2 p-4 rounded-lg shadow-md">
                                <Text className="text-lg font-semibold text-gray-800 mb-4">Education & Certifications</Text>

                                <View className="space-y-5">
                                    {/* Education Group */}
                                    {item.education && (<View>
                                        <View className="flex-row items-center gap-2 mb-1">
                                            <Image source={education} className="w-3 h-3" />
                                            <Text className="text-base font-semibold text-gray-800">Education</Text>
                                        </View>
                                        {item?.education.map((edu, index) => (
                                            <Text key={index} className=" text-sm text-gray-600 ml-8 leading-snug">* {edu}</Text>
                                        ))}
                                    </View>)}

                                    {/* Certifications Group */}
                                    {item.certifications && (<View>
                                        <View className="flex-row items-center gap-2 mb-1">
                                            <Image source={certificate} className="w-3 h-3" />
                                            <Text className="text-base font-semibold text-gray-800">Certifications</Text>
                                        </View>
                                        {item?.certifications.map((cert, index) => (
                                            <Text key={index} className="text-sm text-gray-600 ml-8 leading-snug">* {cert}</Text>
                                        ))}
                                    </View>)}

                                    {/* Awards Group */}
                                    {item.awards && (<View>
                                        <View className="flex-row items-center gap-2 mb-1">
                                            <Image source={award} className="w-3 h-3" />
                                            <Text className="text-base font-semibold text-gray-800">Awards</Text>
                                        </View>
                                        {item?.awards.map((award, index) => (
                                            <Text key={index} className="text-sm text-gray-600 ml-8 leading-snug">* {award}</Text>
                                        ))}
                                    </View>)}
                                </View>
                            </View>)}

                            {item?.tourStyles && (<View className="bg-white mx-1 my-2 p-4 rounded-lg shadow-md">
                                <Text className="text-lg font-semibold text-gray-800 mb-4">Tour Styles</Text>
                                <View className="flex-row flex-wrap gap-2">
                                    {item?.tourStyles.map((style, index) => (
                                        <View key={index} className="bg-green-50 px-3 py-1.5 rounded-full border border-green-200">
                                            <Text className="text-sm text-green-700 font-medium">{style}</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>)}

                            {reviews.length > 0 &&

                                <View className=" bg-white rounded-lg shadow-md m-1 px-2">
                                    <View className="w-[35%] flex-row justify-between">
                                        <Text className=" text-2xl font-semibold py-1">Reviews</Text>
                                        {/* <View className="flex-row items-center">
                                    <Image className="w-5 h-5" source={star} />
                                    <Text>{item.stars}/5</Text>
                                </View> */}
                                    </View>
                                    <View>
                                        <ScrollView

                                            className="w-full h-72 rounded-2xl mx-2 mb-2"
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
                    </View>


                    <View className="self-center flex-row items-center bg-[#FEFA17] w-[95%] h-12 rounded-2xl justify-between px-1 shadow-lg">

                        <Text className="px-3 font-extrabold text-xl">{item?.dailyRate}.00 LKR/day</Text>

                        <TouchableOpacity className=" bg-[#84848460] rounded-xl w-[30%]" onPress={handleBooking}>
                            <View className="py-2 px-3 flex-row justify-between items-center w-full">
                                <Text>Book Now</Text>
                                <Image className="w-5 h-5" source={back} />
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>

            </ScrollView>
        </View>

    )

}