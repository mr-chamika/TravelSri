import { useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { cssInterop } from 'nativewind'
import { Image } from 'expo-image'
import { useEffect, useState } from "react";


cssInterop(Image, { className: "style" });

const pic = require('../../../../../assets/images/tabbar/towert.png')
const location = require('../../../../../assets/images/pin.png')
const thumbnail = require('../../../../../assets/images/tabbar/create/hotel/hotelthumb.png')
const star = require('../../../../../assets/images/tabbar/create/hotel/stars.png')
const back = require('../../../../../assets/images/back.png')
const profile = require('../../../../../assets/images/sideTabs/profile.jpg')
const tele = require('../../../../../assets/images/tabbar/create/guide/telephones.png')
const mark = require('../../../../../assets/images/mark.png')

export default function Views() {

    const userId = '1';

    const router = useRouter();
    const { id } = useLocalSearchParams();

    useEffect(() => {

        getItem(id)

    }, [id])

    const [item, setItem] = useState<{ id: string, mobile: string, image: any, name: string, stars: number, location: string, price: number, age: number, vehicle: string, reviewers: any[], langs: string[], ys: any[] }>({ id: '1', image: pic, name: 'Matara to Colombo', stars: 0, location: "", price: 0, vehicle: '', age: 0, reviewers: [], langs: [], ys: [], mobile: '' })

    const groupCollection = [
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

                            <Image className="rounded-full w-[200px] h-[200px] mb-2" source={item.image} />
                            <Text className="text-center font-semibold text-xl">Theekshana Doe</Text>

                            <View className="flex-row">
                                <Text className="font-light">{item.age} years old | {item.vehicle} | {item.mobile} |</Text>
                                <View className="flex-row items-center">
                                    <Image className="w-5 h-5" source={star} /><Text className=" font-light">{item.stars}/5</Text>
                                </View>
                            </View>

                        </View>

                        <View>
                            <Text className=" text-2xl font-semibold py-1">Photos</Text>


                            <View className="w-full items-center">
                                <ScrollView
                                    horizontal
                                    className="w-[80%] h-50 border-gray-200 rounded-2xl"
                                    contentContainerClassName="flex-row gap-1"
                                    showsHorizontalScrollIndicator={false}
                                    nestedScrollEnabled={true}

                                >
                                    {item.ys.map((x, i) => {

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

                        <View>

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

                        </View>
                    </View>


                    <View className="self-center flex-row items-center bg-[#FEFA17] w-[95%] h-12 rounded-2xl justify-between px-1 shadow-lg">

                        <Text className="px-3 font-extrabold text-xl">{item.price}.00 LKR/km</Text>

                        <TouchableOpacity className=" bg-[#84848460] rounded-xl w-[30%] " onPress={() => router.push(`/views/payment/${userId}`)}>
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