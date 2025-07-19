import { useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useEffect, useState } from "react";
import { cssInterop } from 'nativewind'
import { Image } from 'expo-image'
import AsyncStorage from '@react-native-async-storage/async-storage';

cssInterop(Image, { className: "style" });

const pic = require('../../../../assets/images/tabbar/towert.png')
const location = require('../../../../assets/images/pin.png')
const thumbnail = require('../../../../assets/images/tabbar/create/hotel/hotelthumb.png')
const star = require('../../../../assets/images/tabbar/create/hotel/stars.png')
const back = require('../../../../assets/images/back.png')
const profile = require('../../../../assets/images/sideTabs/profile.jpg')
const tele = require('../../../../assets/images/tabbar/create/guide/telephones.png')
const mark = require('../../../../assets/images/mark.png')

interface Data {

    _id: string;
    name: string;
    image: string;
    driverAge: number;
    vehicleNumber: string;
    phone: string;
    stars: number;
    images: string[];
    price: number;
    location: string;

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

    /* useEffect(() => {
        getItem(id)
    }, [id]) */

    const [data, setData] = useState<Data | null>(null)
    const [review, setReview] = useState<Review[]>([])

    const getData = async () => {

        try {
            const res = await fetch(`http://localhost:8080/traveler/driver-data?id=${id}`)

            var data;
            try {
                data = await res.json();
            } catch {
                data = await res.text();
            }

            if (typeof (data) == 'object') {

                //console.log(data)
                setData(data)
            } else {

                console.log(data)
            }
        } catch (err) {

            console.log(err)

        }

    }

    const getReviews = async () => {

        try {

            const res = await fetch(`http://localhost:8080/traveler/get-reviews?id=${id}`)

            if (res) {

                const data = await res.json()
                //console.log(data)
                setReview(data)

            }

        } catch (err) {

            console.log(`Error in guide reviews getting : ${err}`)

        }

    }


    useEffect(() => {

        getData();
        getReviews();

    }, [])

    /* const groupCollection = [
        {
            id: '1',
            age: 50,
            image: profile,
            name: 'Kasthuri',
            stars: 3,
            location: 'Colombo',
            price: 100,
            vehicle: 'ABC 0123',
            mobile: '0123456789',
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
                    id: '4',
                    name: 'Jhonny',
                    from: 'Sweedan',
                    images: pic,
                    review: "Goooood",
                    stars: 0
                },
                {
                    id: '5',
                    name: 'Jhonny',
                    from: 'Sweedan',
                    images: pic,
                    review: "Goooood",
                    stars: 0
                },
                {
                    id: '6',
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
    ];

    const getItem = (Id: string | string[]) => {
        groupCollection.map((collection, i) => {
            if (collection.id == Id) {
                setItem(collection)
            }
        })
    }
 */
    const handleBookNow = async () => {
        try {
            // Set a new session timestamp to indicate new booking intent
            await AsyncStorage.setItem('bookingSession', Date.now().toString());
            router.push(`/(tabs)/create/car`);
        } catch (error) {
            console.error('Error updating booking session in AsyncStorage:', error);
            router.push(`/(tabs)/create/car`);
        }
    };

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
                            <Image className="rounded-full w-[200px] h-[200px] mb-2" source={{ uri: `data:image/jpeg;base64,${data && data.image}` }} />
                            <Text className="text-center font-semibold text-xl">Theekshana Doe</Text>
                            <View className="flex-row">
                                <Text className="font-light">{data && data.driverAge} years old | {data && data.vehicleNumber} | {data && data.phone} |</Text>
                                <View className="flex-row items-center">
                                    <Image className="w-5 h-5" source={star} /><Text className=" font-light">{data && data.stars}/5</Text>
                                </View>
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
                                    {data && data.images.map((x, i) => {
                                        return (
                                            <View key={i} className=" w-[310px] h-40">
                                                <Image className=" w-[300px] h-full" source={{ uri: `data:image/jpeg;base64,${x}` }} />
                                            </View>
                                        )
                                    })}
                                </ScrollView>
                            </View>
                        </View>

                        <View>
                            <View className="w-[35%] flex-row justify-between">
                                <Text className=" text-2xl font-semibold py-1">Reviews</Text>
                                <View className="flex-row items-center">
                                    <Image className="w-5 h-5" source={star} />
                                    <Text>{data && data.stars}/5</Text>
                                </View>
                            </View>
                            <View>
                                {review.length == 0 && <View className=' w-full h-full justify-center items-center'><Text className='italic text-gray-400'>No Reviews Yet</Text></View>}
                                <ScrollView
                                    className="w-full h-72 border-2 border-gray-200 rounded-2xl mx-2"
                                    contentContainerClassName=" flex-col px-2 py-3 gap-5 "
                                    showsVerticalScrollIndicator={false}
                                    nestedScrollEnabled={true}
                                >
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
                                    })}
                                </ScrollView>
                            </View>
                        </View>
                    </View>

                    <View className="self-center flex-row items-center bg-[#FEFA17] w-[95%] h-12 rounded-2xl justify-between px-1 shadow-lg">
                        <Text className="px-3 font-extrabold text-xl">{data && data.price}.00 LKR/km</Text>
                        <TouchableOpacity className=" bg-[#84848460] rounded-xl w-[30%] " onPress={handleBookNow}>
                            <View className="py-2 px-2 flex-row justify-between items-center w-full">
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
