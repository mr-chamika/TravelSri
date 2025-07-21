import { View, Text, ScrollView, TouchableOpacity, Alert, TextInput, KeyboardAvoidingView, Platform } from "react-native";
import { cssInterop } from 'nativewind'
import { Image } from 'expo-image'
import { router } from "expo-router";
import { useState } from "react";

cssInterop(Image, { className: "style" });

// --- Asset Imports ---
const pic = require('../../../assets/images/tabbar/create/equips/item.png')
const pics = require('../../../assets/images/tabbar/create/equips/str.png')
const search = require('../../../assets/images/search1.png')
const pin = require('../../../assets/images/tabbar/create/pin.png')
const tele = require('../../../assets/images/tabbar/create/guide/telephones.png')
const star = require('../../../assets/images/tabbar/create/hotel/stars.png')
const starE = require('../../../assets/images/stare.png')

// --- Interfaces ---
interface Item {
    id: string,
    image: any,
    title: string,
    price: number
    contact: string
}

// (Shop interface would likely be here, but using the single `shop` object for now)

export default function ShopDetailScreen() {

    const [selectedStars, setSelectedStars] = useState<number[]>([]);
    const [review, setReview] = useState('');

    // --- Mock Data ---
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
        title: 'Mini Market',
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

    }

    const handleRating = (starIndex: number) => {
        const rating = starIndex + 1;
        // Allows toggling and setting a new rating
        setSelectedStars(prev => prev.length === rating ? [] : Array.from({ length: rating }, (_, i) => i));
    };

    return (
        <View className="h-full gap-10">

            <View className="h-[20%]">
                {/* --- Header Section --- */}
                <TouchableOpacity onPress={() => router.back()}><Text className="ml-3">Back</Text></TouchableOpacity>
                <View className="items-center pt-10 pb-5">
                    <Text className="text-4xl font-black">{shop.title}</Text>
                    <Text>Contact us - {shop.mobile}</Text>
                </View>

                {/* --- Search Bar --- */}
                <View className="w-[80%] items-center mx-10 flex-row justify-center bg-[#d9d9d976] rounded-2xl my-5">

                    <Image className="w-7 h-7" source={search}></Image>
                    <TextInput className=" h-[40px] w-[250px] pl-5 text-black" placeholder="Search...." placeholderTextColor="#8E8E8E" />

                </View>
            </View>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                className="flex-1"
            >
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ justifyContent: 'space-evenly' }}
                >
                    <View className="h-[36%]">
                        <Text className="text-[22px] font-semibold mx-3 py-6">Items</Text>

                        <ScrollView
                            className="h-[28%] w-full  pt-2 px-3"
                            contentContainerClassName="bg-white flex-row flex-wrap justify-center gap-12 py-3"
                            showsVerticalScrollIndicator={false}
                            nestedScrollEnabled={true}

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
                    {/* --- Reviews Section --- */}
                    <View className="justify-between h-[63%] ">
                        <View className="px-3 h-[75%]">
                            <Text className=" text-2xl font-semibold py-10">Reviews</Text>
                            <ScrollView
                                className="w-full h-64 border-2 border-gray-200 rounded-2xl"
                                contentContainerClassName=" flex-col bg-white px-2 py-3 gap-5 "
                                showsVerticalScrollIndicator={false}
                                nestedScrollEnabled={true}
                            >
                                {shop.reviewers.map((x, i) => (
                                    <View key={i} className="bg-gray-100 px-3 rounded-2xl">
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
                                ))}
                            </ScrollView>
                        </View>

                        <View className="w-full ">

                            <View className="flex-row items-center">
                                <Text className="text-lg px-3 py-5">Rate {shop.title}</Text>
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
                            <View className="w-full px-3 items-center flex-row justify-between rounded-2xl mb-6 ">

                                <TextInput className=" h-[40px] w-[270px] p-3 bg-[#d9d9d976] text-black" placeholder="Type a review..." placeholderTextColor="#8E8E8E" onChangeText={setReview} />
                                <TouchableOpacity className="" onPress={() => alert(`Stars - ${selectedStars.length} Review - ${review}`)}>
                                    <View className="bg-[#FEFA17]  rounded-xl">
                                        <Text className="py-3 px-5 font-semibold">Send</Text>
                                    </View>
                                </TouchableOpacity>

                            </View>

                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

        </View>
    );
}