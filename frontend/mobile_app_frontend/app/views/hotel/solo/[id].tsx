import { useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { cssInterop } from 'nativewind'
import { Image } from 'expo-image'
import { useEffect, useState } from "react";


cssInterop(Image, { className: "style" });

const pic = require('../../../../assets/images/tabbar/towert.png')
const location = require('../../../../assets/images/pin.png')
const thumbnail = require('../../../../assets/images/tabbar/create/hotel/hotelthumb.png')
const star = require('../../../../assets/images/tabbar/create/hotel/stars.png')
const back = require('../../../../assets/images/back.png')

export default function Views() {

    const router = useRouter();
    const { id } = useLocalSearchParams();

    useEffect(() => {

        getItem(id)

    }, [id])

    const [item, setItem] = useState<{ id: string, image: any[], title: string, stars: number, location: string, price: number, description: string, reviewers: any[], faci: any[] }>({ id: '1', image: [], title: 'Matara to Colombo', stars: 0, location: "", price: 0, description: '', reviewers: [], faci: [] })

    const groupCollection = [
        {
            id: '1',
            image: [thumbnail, thumbnail],
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
            faci: [

                {

                    id: '1',
                    name: 'Swimming pool',
                    images: pic

                },
                {

                    id: '2',
                    name: 'Free WiFi',
                    images: pic

                },
                {

                    id: '3',
                    name: 'Free breakfast',
                    images: pic

                },
                {

                    id: '4',
                    name: '1 bathtub',
                    images: pic

                },
                {

                    id: '5',
                    name: 'Room service',
                    images: pic

                },
                {

                    id: '6',
                    name: 'Bar',
                    images: pic

                }
            ]
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

    return (

        <View>

            <TouchableOpacity className="pl-3" onPress={() => router.back()}><Text>Back</Text></TouchableOpacity>

            <ScrollView

                className="w-full h-[97%]"
                contentContainerClassName="flex-col px-3 py-5 gap-7"
                showsVerticalScrollIndicator={false}

            >
                <View className="w-full gap-5">

                    <View className="">
                        <View className="w-full items-center">
                            <ScrollView
                                horizontal
                                className=" h-50 border-black rounded-2xl border-2 w-[89%]"
                                contentContainerClassName=" py-3 pl-3"
                                showsHorizontalScrollIndicator={false}
                                nestedScrollEnabled={true}

                            >
                                {item.image.map((x, i) => {

                                    return (

                                        <View key={i} className=" w-[310px] h-40">

                                            <Image className=" w-[300px] h-full" source={x} />

                                        </View>
                                    )
                                })

                                }
                            </ScrollView>

                        </View>
                        <View className="flex-row justify-between pt-1">
                            <View>
                                <Text className="font-black text-xl">{item.title}</Text>
                                <View className="flex-row items-center">
                                    <Image className="w-4 h-4" source={location} />
                                    <Text className="text-start">{item.location}</Text>
                                </View>
                            </View>
                            <View className="flex-row items-start">
                                <Image className="w-5 h-5" source={star} />
                                <Text>{item.stars}</Text>
                            </View>
                        </View>
                    </View>

                    <View>

                        <Text className="px-3 text-sm italic text-justify text-gray-500 font-semibold">{item.description}</Text>
                        <Text className=" text-2xl font-semibold py-1">Reviews</Text>

                        <View>
                            <ScrollView

                                className="w-full h-64 border-2 border-gray-200 rounded-2xl"
                                contentContainerClassName=" flex-col px-2 py-3 gap-5 "
                                showsVerticalScrollIndicator={false}
                                nestedScrollEnabled={true}

                            >
                                {item.reviewers.map((x, i) => {

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
                        <View>

                            <Text className=" text-2xl font-semibold py-2">Facilities</Text>

                            <View>
                                <ScrollView
                                    horizontal
                                    className="w-full rounded-2xl px-1"
                                    contentContainerClassName="flex-row px-1 py-2 bg-gray-200 gap-4"
                                    showsHorizontalScrollIndicator={false}
                                    nestedScrollEnabled={true}

                                >
                                    {item.faci.map((x, i) => {

                                        return (

                                            <View key={i} className="p-3 rounded-2xl">
                                                <View className="items-center">

                                                    <Image className="w-10 h-10 rounded-full" source={x.images} />
                                                    <Text className="text-center">{x.name}</Text>

                                                </View>


                                            </View>
                                        )
                                    })

                                    }
                                </ScrollView>
                            </View>

                        </View>
                    </View>
                </View>


                <View className="self-center flex-row items-center bg-[#FEFA17] w-[95%] h-12 rounded-2xl justify-between px-1 shadow-lg">

                    <Text className="px-3 font-extrabold text-xl">{item.price}.00 LKR/day</Text>

                    <TouchableOpacity className=" bg-[#84848460] rounded-xl w-[30%]" onPress={() => router.push(`/views/payment/${item.id}`)}>
                        <View className="py-2 px-3 flex-row justify-between items-center w-full">
                            <Text>Book Now</Text>
                            <Image className="w-5 h-5" source={back} />
                        </View>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </View>

    )

}