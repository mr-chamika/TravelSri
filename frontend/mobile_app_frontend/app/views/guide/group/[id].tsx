import { useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { cssInterop } from 'nativewind'
import { Image } from 'expo-image'
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";


cssInterop(Image, { className: "style" });

const pic = require('../../../../assets/images/tabbar/towert.png')
const location = require('../../../../assets/images/pin.png')
const thumbnail = require('../../../../assets/images/tabbar/create/hotel/hotelthumb.png')
const star = require('../../../../assets/images/tabbar/create/hotel/stars.png')
const back = require('../../../../assets/images/back.png')
const profile = require('../../../../assets/images/sideTabs/profile.jpg')
const tele = require('../../../../assets/images/tabbar/create/guide/telephones.png')
const globl = require('../../../../assets/images/tabbar/create/guide/global.png')
const mark = require('../../../../assets/images/mark.png')

interface Guide {

    id: string;
    pp: string;
    stars: number;
    username: string;
    verified: string;
    identified: string;
    languages: string[];
    location: string;
    images: string[];
    description: string;
    price: number;

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

export default function Views() {

    const router = useRouter();
    const { id } = useLocalSearchParams();

    /*     useEffect(() => {
    
            getItem((Number(id) - 1).toString())
    
        }, [id]) */

    const [item, setItem] = useState<{ id: string, image: any, title: string, stars: number, location: string, price: number, description: string, reviewers: any[], langs: string[], ys: any[] }>({ id: '1', image: pic, title: 'Matara to Colombo', stars: 0, location: "", price: 0, description: '', reviewers: [], langs: [], ys: [] })
    const [guideV, setGuidev] = useState<Guide | null>(null)
    const [review, setReviewv] = useState<Review[]>([])
    /* const groupCollection = [
        {
            id: '1',
            image: profile,
            title: 'Shangri-La',
            stars: 3,
            location: 'Colombo',
            price: 9000,
            description: 'Shangri-La Hotels and Resorts is a Hong Kong-based multinational hospitality company founded in 1971 by Malaysian tycoon Robert Kuok. Named after the mythical utopia from James Hilton’s novel Lost Horizon, it symbolizes serenity and luxury. The brand operates over 100 five-star luxury hotels and resorts across Asia, Europe, the Middle East, North America, and Oceania, with notable properties like Shangri-La Hotel Singapore, its first location, and Shangri-La Colombo in Sri Lanka. Renowned for its "hospitality from the heart," Shangri-La offers world-class service, exquisite dining, and inspirational architecture in premier city addresses and tranquil retreats',
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
            ys: [pic, thumbnail, thumbnail, thumbnail, thumbnail, thumbnail]

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

    const route = item.title.split(" ");
*/useEffect(() => {

        const getguide = async () => {

            try {

                const res1 = await fetch(`http://localhost:8080/traveler/guides-view?id=${id}`)
                //const res1 = await fetch(`https://travelsri-backend.onrender.com/traveler/guides-view?id=${id}`)

                if (res1) {

                    const data1 = await res1.json()
                    //console.log(data1)
                    setGuidev(data1)

                }

            } catch (err) {

                console.log(`Error in guide data getting : ${err}`)

            }

        }
        const getReviews = async () => {

            try {

                const res1 = await fetch(`http://localhost:8080/traveler/get-reviews?id=${id}`)
                //const res1 = await fetch(`https://travelsri-backend.onrender.com/traveler/get-reviews?id=${id}`)

                if (res1) {

                    const data1 = await res1.json()
                    //console.log(data1)
                    setReviewv(data1)

                }

            } catch (err) {

                console.log(`Error in guide reviews getting : ${err}`)

            }

        }
        getguide()
        getReviews()

    }, [])

    return (

        <View className="">
            <TouchableOpacity className="pl-3" onPress={() => router.back()}><Text>Back</Text></TouchableOpacity>

            <ScrollView

                className="w-full h-[97%]"
                contentContainerClassName="flex-col px-3 py-5"
                showsVerticalScrollIndicator={false}

            >
                <View className="justify-between gap-5">
                    <View className="w-full gap-5">

                        <View className=" items-center">

                            <Image className="rounded-full w-[200px] h-[200px] mb-2" source={{ uri: `data:image/jpeg;base64,${guideV && guideV.pp}` }} />
                            <Text className="text-center font-semibold text-xl">{guideV?.username}</Text>
                            <View className='w-[90%] justify-between mt-4 flex-row'>
                                <View className='gap-6 flex-row'>
                                    <Image className='w-5 h-5' source={tele}></Image>
                                    <Text className="text-md font-light">{guideV?.verified ? "Phone Verified" : "Pending"}</Text>
                                </View>
                                <View className='gap-6 flex-row'>
                                    <Image className='w-5 h-5' source={mark}></Image>
                                    <Text className="text-md font-light">{guideV?.identified ? " Identify Verified" : "Pending"}</Text>
                                </View>

                            </View>
                            <View className='w-[90%] gap-2 flex-row my-3 items-center'>
                                <Image className='w-5 h-5' source={globl}></Image>
                                <View className="flex-row gap-3 px-4">
                                    {

                                        guideV && guideV.languages && guideV.languages.map((lan, i) => {
                                            return (

                                                <Text key={i} className="text-sm font-light">{lan}</Text>

                                            );
                                        })

                                    }
                                </View>

                            </View>
                            <View className='w-[90%] gap-6 flex-row'>
                                <Image className='w-5 h-5' source={location} />
                                <Text className="text-md font-light">{guideV && guideV.location}</Text>
                            </View>
                        </View>

                        <View>
                            <Text className=" text-2xl font-semibold py-1">Photos</Text>


                            <View className="w-full items-center">
                                <ScrollView
                                    horizontal
                                    className=" h-50 border-black rounded-2xl border-2 w-[89%]"
                                    contentContainerClassName=" py-3 pl-3"
                                    showsHorizontalScrollIndicator={false}
                                    nestedScrollEnabled={true}

                                >
                                    {guideV?.images.map((x, i) => {

                                        return (

                                            <View key={i} className=" w-[310px] h-40">

                                                <Image className=" w-[300px] h-full" source={{ uri: `data:image/jpeg;base64,${x}` }} />

                                            </View>
                                        )
                                    })

                                    }
                                </ScrollView>

                            </View>

                        </View>

                        <View>

                            <Text className=" text-2xl font-semibold py-1">About</Text>
                            <Text className="px-3 my-2 text-sm italic text-justify text-gray-500 font-semibold">{guideV?.description}</Text>
                            <View className="w-[35%] flex-row justify-between">
                                <Text className=" text-2xl font-semibold py-1">Reviews</Text>
                                <View className="flex-row items-center">
                                    <Image className="w-5 h-5" source={star} />
                                    <Text>{item.stars}/5</Text>
                                </View>
                            </View>
                            <View>
                                <ScrollView

                                    className="w-full h-72 border-2 border-gray-200 rounded-2xl mx-2"
                                    contentContainerClassName={`flex-col px-2 py-3 gap-5 ${!review || review.length == 0 ? 'h-full' : ''}`}
                                    showsVerticalScrollIndicator={false}
                                    nestedScrollEnabled={true}

                                >
                                    {!review || review.length == 0 && <View className="h-full items-center justify-center"><Text>No reviews yet</Text></View>}
                                    {review.map((x, i) => {

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
                    </View>


                    <View className="self-center flex-row items-center bg-[#FEFA17] w-[95%] h-12 rounded-2xl justify-between px-1 shadow-lg">

                        <Text className="px-3 font-extrabold text-xl">{guideV?.price}.00 LKR/day</Text>

                        <TouchableOpacity className=" bg-[#84848460] rounded-xl w-[30%]" onPress={

                            async () => {

                                await AsyncStorage.setItem('guide', id.toString())
                                //await AsyncStorage.setItem('guide', item.id)
                                router.back()

                            }

                        }>
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