import { Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { useState, useCallback, useEffect } from 'react';
import { cssInterop } from 'nativewind';
import { Image } from 'expo-image';
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

cssInterop(Image, { className: "style" });

const mark = require('../../../../assets/images/mark.png');
const cross = require('../../../../assets/images/cross.png')
const pic = require('../../../../assets/images/tabbar/create/car/drv.png');
const star = require('../../../../assets/images/tabbar/create/hotel/stars.png');
const tele = require('../../../../assets/images/tabbar/create/guide/telephones.png');

interface Driver {
    _id: string;
    image: any;
    name: string;
    stars: number;
    verified: string;
    identified: string;
}

/* const guides: Guide[] = [
    {
        id: '1',
        image: pic,
        title: 'Theekshana',
        stars: 3,
        verified: true,
        identified: true,
        },
        {
            id: '2',
            image: pic,
            title: 'Teshini',
            stars: 1,
            verified: true,
            identified: true,
            },
            {
                id: '3',
                image: pic,
                title: 'Sudewa',
                stars: 2,
                verified: true,
                identified: true,
                },
                {
                    id: '4',
                    image: pic,
                    title: 'Bimsara',
                    stars: 5,
                    verified: true,
                    identified: true,
                    },
                    {
                        id: '5',
                        image: pic,
                        title: 'Tharusha',
                        stars: 3,
                        verified: true,
                        identified: true,
                        },
                        {
                            id: '6',
                            image: pic,
                            title: 'Viduranga',
                            stars: 1,
                            verified: true,
                            identified: true,
                            },
                            {
                                id: '7',
                                image: pic,
                                title: 'Chamika',
                                stars: 2,
                                verified: true,
                                identified: true,
                                },
                                {
                                    id: '8',
                                    image: pic,
                                    title: 'Thathsara',
                                    stars: 5,
                                    verified: true,
                                    identified: true,
                                    },
                                    {
                                        id: '9',
                                        image: pic,
                                        title: 'Viduranga',
                                        stars: 1,
                                        verified: true,
                                        identified: true,
                                        },
                                        {
                                            id: '10',
                                            image: pic,
                                            title: 'Chamika',
                                            stars: 2,
                                            verified: true,
                                            identified: true,
    },
    {
        id: '11',
        image: pic,
        title: 'Thathsara',
        stars: 5,
        verified: true,
        identified: true,
        },
        ];
        */
export default function Car() {


    const [selectedCardIndex, setSelectedCardIndex] = useState<string | null>(null);
    const [drivers, setDrivers] = useState<Driver[]>([])

    const router = useRouter();
    const { id } = useLocalSearchParams();

    const getDrivers = async () => {

        try {
            const res = await fetch(`http://localhost:8080/traveler/driver-get?id=${id}`)

            const data = await res.json()

            if (data.length > 0) {

                //console.log(data)
                setDrivers(data)

            } else {

                console.log('Not found')

            }
        } catch (err) {

            console.log(err)

        }

    }


    const toggleCardSelection = (index: string) => {
        setSelectedCardIndex(prev => (prev === index ? null : index));
    };

    useFocusEffect(
        useCallback(() => {
            const refreshState = async () => {
                try {
                    const savedIndex = await AsyncStorage.getItem('car');
                    if (savedIndex) {
                        setSelectedCardIndex(savedIndex);
                        getDrivers()
                    }
                } catch (error) {
                    console.error('Error refreshing state from AsyncStorage:', error);
                }
            };
            refreshState();
        }, [])
    );

    return (
        <View className='bg-[#F2F5FA] h-full'>
            <View>
                {drivers.length == 0 && <TouchableOpacity onPress={async () => { router.back(); if (await AsyncStorage.getItem('car') == id) { await AsyncStorage.removeItem('car') } }} className=' w-full pt-4 pl-4'><Text>Back</Text></TouchableOpacity>}
                <Text className='text-2xl text-center font-extrabold py-8'>Choose a driver</Text>
                {drivers.length == 0 && <View className=' w-full h-screen justify-center items-center'><Text className='italic text-gray-400'>No Drivers Found</Text></View>}
                <ScrollView
                    className="w-full h-[87%]"
                    contentContainerClassName="flex-row flex-wrap justify-center items-start gap-5 py-5"
                >
                    {drivers.length > 0 && drivers.map((driver, index) => (
                        <TouchableOpacity key={index} onPress={() => router.push(`/views/car/profile/${driver._id}`)}>
                            <View className="bg-white w-[170px] h-[135px] pb-2 rounded-2xl border border-gray-200 justify-between">
                                <View className='flex-row mt-2 gap-2 items-center px-3'>
                                    <Image className='w-[50px] h-[50px] rounded-full' source={{ uri: `data:image/jpeg;base64,${driver.image}` }} contentFit="cover" />
                                    <View>
                                        <Text className="text-lg font-semibold">{driver.name}</Text>
                                        <View className="flex-row justify-start mt-1">
                                            {[...Array(driver.stars)].map((_, i) => (
                                                <Image key={i} className="w-3 h-3 mx-0.5" source={star} />
                                            ))}
                                        </View>
                                    </View>
                                </View>
                                <View className='w-full mt-4 gap-1 items-center'>
                                    <View className='gap-4 flex-row items-center'><Image className='w-[14px] h-[14px]' source={driver.identified == 'pending' ? cross : tele}></Image><Text className="text-md">Phone Verified</Text></View>
                                    <View className='gap-4 flex-row items-center'><Image className='w-[14px] h-[14px]' source={driver.verified == 'pending' ? cross : mark}></Image><Text className="text-md">Identity Verified</Text></View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
        </View>
    );
}
