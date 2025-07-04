import { View, Text, ScrollView, TouchableOpacity, Alert, TextInput } from "react-native";
import { cssInterop } from 'nativewind'
import { Image } from 'expo-image'
import { router } from "expo-router";
import { useState } from "react";


cssInterop(Image, { className: "style" });

const pic = require('../../../assets/images/tabbar/create/equips/item.png')
const pics = require('../../../assets/images/tabbar/create/equips/str.png')
const search = require('../../../assets/images/search1.png')
const pin = require('../../../assets/images/tabbar/create/pin.png')
const tele = require('../../../assets/images/tabbar/create/guide/telephones.png')
const star = require('../../../assets/images/tabbar/create/hotel/stars.png')
const starE = require('../../../assets/images/stare.png')

interface Item {

    id: string,
    //shopid:string
    image: any,
    title: string,
    price: number
    contact: string

}

interface Shop {

    id: string,
    image: any,
    location: string,
    mobile: string,
    stars: number,
    title: string


}

export default function Equipments() {

    const [selectedStars, setSelectedStars] = useState<number[]>([]);
    const [review, setReview] = useState('')


    const items: Item[] = [

        {

            id: '1',
            image: pic,
            title: 'Rope (Large)',
            price: 500,
            contact: '0771161615'

        },
        {

            id: '2',
            image: pic,
            title: 'Rain Coat',
            price: 5000,
            contact: '0786715765'

        },
        {

            id: '3',
            image: pic,
            title: 'Tent (Mini)',
            price: 90000,
            contact: '0786715765'

        },

        {

            id: '4',
            image: pic,
            title: 'Hike Shoes',
            price: 2000,
            contact: '0786715765'

        },
        {

            id: '1',
            image: pic,
            title: 'Rope (Large)',
            price: 500,
            contact: '0771161615'

        },
        {

            id: '2',
            image: pic,
            title: 'Rain Coat',
            price: 5000,
            contact: '0786715765'

        },
        {

            id: '3',
            image: pic,
            title: 'Tent (Mini)',
            price: 90000,
            contact: '0786715765'

        },

        {

            id: '4',
            image: pic,
            title: 'Hike Shoes',
            price: 2000,
            contact: '0786715765'

        }, {

            id: '1',
            image: pic,
            title: 'Rope (Large)',
            price: 500,
            contact: '0771161615'

        },
        {

            id: '2',
            image: pic,
            title: 'Rain Coat',
            price: 5000,
            contact: '0786715765'

        },
        {

            id: '3',
            image: pic,
            title: 'Tent (Mini)',
            price: 90000,
            contact: '0786715765'

        },

        {

            id: '4',
            image: pic,
            title: 'Hike Shoes',
            price: 2000,
            contact: '0786715765'

        }



    ]

    const shop =

    {

        id: '1',
        image: pics,
        location: 'Colombo',
        mobile: '0123456789',
        stars: 2,
        title: 'Mini Market'

    }

    const handleRating = (starIndex: number) => {
        setSelectedStars(prev => {
            const rating = starIndex + 1;
            const lastSelected = prev.length > 0 ? Math.max(...prev) : -1;
            if (lastSelected === starIndex) {

                return [];
            }
            return Array.from({ length: rating }, (_, i) => i);
        });
    };

    return (

        <View className="w-full h-full justify-between">
            <View className="w-full h-[88%]">
                <TouchableOpacity onPress={() => router.back()}><Text className="ml-3">Back</Text></TouchableOpacity>
                <View className="items-center py-10 ">
                    <Text className="text-4xl font-black">{shop.title}</Text>
                    <Text>Contact us - {shop.mobile}</Text>

                </View>

                <View className="w-[80%] items-center mx-10 flex-row justify-center bg-[#d9d9d976] rounded-2xl my-5">

                    <Image className="w-7 h-7" source={search}></Image>
                    <TextInput className=" h-[40px] w-[250px] pl-5 text-black" placeholder="Search...." placeholderTextColor="#8E8E8E" />

                </View>
                <View className="">

                    <Text className="text-[22px] font-semibold mx-3 mb-4">Items</Text>

                    <ScrollView
                        className="h-[60%] w-full"
                        contentContainerClassName="flex-row flex-wrap justify-center gap-12"
                        showsVerticalScrollIndicator={false}
                    >

                        {items.map((item, i) => {
                            return (
                                <TouchableOpacity key={i} onPress={() => alert(`Contact us - ${item.contact}`)}>
                                    <View className=" w-full">

                                        <Image
                                            className="w-[90px] h-[150px] rounded-[23px] shadow-gray-400"
                                            source={item.image}
                                        />
                                        <Text className="mt-2 text-[10px] italic text-center">
                                            {item.title}
                                        </Text>
                                        <Text className=" text-[10px] italic text-center">
                                            {item.price}.00 LKR
                                        </Text>

                                    </View>
                                </TouchableOpacity>
                            )
                        })
                        }

                    </ScrollView>
                </View>
            </View>
            <View className="w-full justify-center">

                <View className="flex-row items-center">
                    <Text className="text-lg px-3">Rate {shop.title}</Text>
                    <View className=" flex-row  gap-2">
                        {[...Array(5)].map((x, i) => {

                            const isSelected = selectedStars.includes(i);

                            return (
                                <TouchableOpacity key={i} onPress={() => handleRating(i)}>
                                    <Image key={i} className="w-4 h-4" source={isSelected ? star : starE} />
                                </TouchableOpacity>

                            )
                        })}
                    </View>
                </View>
                <View className="w-[85%]  mx-10 items-center flex-row justify-between rounded-2xl mb-6 ">

                    <TextInput className=" h-[40px] w-[270px] p-3 bg-[#d9d9d976] text-black" placeholder="Type a review..." placeholderTextColor="#8E8E8E" onChangeText={setReview} />
                    <TouchableOpacity className="" onPress={() => alert(`Stars - ${selectedStars.length} Review - ${review}`)}>
                        <View className="bg-[#FEFA17]  rounded-xl">
                            <Text className="py-3 px-5 font-semibold">Send</Text>
                        </View>
                    </TouchableOpacity>

                </View>

            </View>

        </View>

    )

}