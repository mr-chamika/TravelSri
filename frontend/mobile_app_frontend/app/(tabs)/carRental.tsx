import { Text, View, ScrollView, TouchableOpacity, Modal, TextInput } from 'react-native';
import { useState, useCallback, useEffect } from 'react';
import { Calendar } from 'react-native-calendars';
import { cssInterop } from 'nativewind';
import { Image } from 'expo-image';
import { useRouter, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SimpleTimePicker from '../../components/TimeSelector';


cssInterop(Image, { className: "style" });

const pic = require('../../assets/images/tabbar/tuktuk.png');
const bus = require('../../assets/images/tabbar/bus.png');
const ac = require('../../assets/images/tabbar/ac.png');
const car = require('../../assets/images/tabbar/car.png');
const mini = require('../../assets/images/tabbar/mini.png');
const sport = require('../../assets/images/tabbar/sport.png');
const p = require('../../assets/images/user2.png');
const t = require('../../assets/images/tag.png');
const mark = require('../../assets/images/mark.png');

export default function App() {
    const router = useRouter();

    interface Book {
        dates: string[];
        start: string;
        end: string;
        language: string;
        time: { hour: number; minute: number };
    }

    const categories = [
        {
            id: '1',
            image: pic,
            members: 2,
            title: 'Tuk',
            price: 100
        },
        {
            id: '2',
            image: mini,
            members: 3,
            title: 'Mini',
            price: 200
        },
        {
            id: '3',
            image: sport,
            members: 4,
            title: 'Seddan',
            price: 250
        },
        {
            id: '4',
            image: car,
            members: 5,
            title: 'Van',
            price: 350
        },
        {
            id: '5',
            image: bus,
            members: 54,
            title: 'Non A/C',
            price: 5000
        },
        {
            id: '6',
            image: ac,
            members: 35,
            title: 'A/C',
            price: 15000
        }
    ];


    return (
        <View className='bg-[#F2F5FA] h-full'>


            <>
                <View className="flex-row justify-between items-center p-4">
                    {/* <Text className="text-lg font-medium">{displayDates}</Text> */}
                    <Text className="text-2xl font-semibold">Category</Text>
                    {/*<TouchableOpacity onPress={() => setModalVisible(true)} className="bg-gray-200 py-2 px-4 rounded-lg">
                             <Text className="font-semibold text-blue-600">Change</Text> 
                        </TouchableOpacity>*/}
                </View>

                {/* <View className="px-4 space-y-1">
                            <Text className="text-sm">📍 Location: {location}</Text>
                            <Text className="text-sm">👤 Adults: {adults}</Text>
                            <Text className="text-sm">🧒 Children: {children}</Text>
                            <Text className="text-sm">🌙 Nights: {nights}</Text>
                        </View> */}

                <View>

                    <ScrollView
                        className="w-full h-[98%]"
                        contentContainerClassName="flex-row flex-wrap justify-center items-start gap-4"
                        showsVerticalScrollIndicator={false}
                    >
                        {categories.map((x, i) => {

                            return (
                                <TouchableOpacity key={i} onPress={() => router.push(`/views/car/solo/list/${x.id}`)}>


                                    <View className="bg-[#d9d9d98e] w-[170px] h-[190px] items-center  py-3 rounded-2xl justify-between">
                                        <View>
                                            <Image
                                                className="w-[90px] h-[90px]"
                                                source={x.image}
                                            />
                                            <View>
                                                <View className='flex-row items-center gap-4'>
                                                    <Image
                                                        className="w-[11px] h-[11px]"
                                                        source={p}
                                                    />
                                                    <Text className=" text-[13px] italic text-center">
                                                        {x.members} Members
                                                    </Text>
                                                </View>
                                                <View className='flex-row items-center gap-4 my-1'>
                                                    <Image
                                                        className="w-[11px] h-[11px]"
                                                        source={t}
                                                    />
                                                    <Text className=" text-[13px] italic text-center">
                                                        {x.title}
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>
                                        <View>
                                            <TouchableOpacity onPress={() => router.push(`/views/car/solo/list/${x.id}`)}>
                                                <View className="rounded-md bg-black justify-center w-32 h-5 items-center" >
                                                    <Text className=" text-white font-semibold text-[12px]">{x.price}.00 LKR/1km</Text>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </TouchableOpacity>

                            )
                        })
                        }

                    </ScrollView>
                </View>

            </>


        </View>
    );
}