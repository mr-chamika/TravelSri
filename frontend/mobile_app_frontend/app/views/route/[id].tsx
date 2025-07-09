import { useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { cssInterop } from 'nativewind'
import { Image } from 'expo-image'
import { useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage'

cssInterop(Image, { className: "style" });

const pic = require('../../../assets/images/tabbar/towert.png')
const map = require('../../../assets/images/map.png')
const g = require('../../../assets/images/tabbar/groupt/garden.png')
const l = require('../../../assets/images/tabbar/groupt/lake.png')
const te = require('../../../assets/images/tabbar/groupt/temple.png')
const groupCollection = [
    {
        id: '1',
        image: pic,
        title: 'Matara to Colombo',
        duration: 2,
        date: '04 june 2020',
        stats: 'Confirm',
        price: 5000,
        max: 20,
        current: 3,
        routes: [
            {
                place: 'peradeniya Botnical Garden',
                images: g,
                description: "The Peradeniya Botanical Gardens, located near Kandy in Sri Lanka, is one of the oldest and largest botanical gardens in the country, spanning 59 hectares (146 acres). Established in 1821 during British colonial rule, its history dates back to 1371 when it served as a royal court under King Wickramabahu III. Home to over 4,000 species of plants, including a renowned collection of orchids, palms, and tropical trees, the garden features notable attractions like the Orchid House, the classical Avenue of Palms, and memorial trees planted by historical figures. Situated along the Mahaweli River at an elevation of 460 meters above sea level, it attracts around 2 million visitors annually and remains a key center for botanical research and conservation under Sri Lanka's Department of Agriculture",
                arrives: '8.00 AM'
            },
            {
                place: 'Sri Dalada Maligawa',
                images: te,
                description: 'Sri Dalada Maligawa, commonly known as the Temple of the Sacred Tooth Relic, is a revered Buddhist temple in Kandy, Sri Lanka, located within the Royal Palace Complex of the former Kingdom of Kandy. It houses a tooth relic of Gautama Buddha, believed to be his left canine, which has historically symbolized the right to rule the country, making it a significant political and spiritual artifact. Built initially in the late 16th century by King Vimaladharmasuriya I, the current structure dates to the 18th century under King Kirthi Sri Rajasinghe. Declared a UNESCO World Heritage Site in 1988, the temple features unique Kandyan architecture with intricate carvings of gold, silver, bronze, and ivory. It attracts thousands of devotees and tourists daily, with rituals performed three times a day and the annual Esala Perahera festival honoring the relic through a grand procession',
                arrives: '9.00 AM'
            },
            {
                place: 'Kandy Lake Round',
                images: l,
                description: 'Kandy Lake Round, often referred to as the walking path around Kandy Lake, is a scenic and popular route in the heart of Kandy, Sri Lanka. This picturesque path, stretching approximately 2.7 to 3.2 kilometers depending on the specific route taken, encircles the artificial lake, also known as Kiri Muhuda or the Sea of Milk, which was built in 1807 by King Sri Wickrama Rajasinghe. The path offers a tranquil setting for leisurely strolls or jogs under the shade of large trees, with stunning views of the surrounding hills, the lake itself, and nearby landmarks like the Temple of the Tooth Relic. It serves as a favored spot for both locals and tourists to enjoy nature, observe wildlife such as birds and water monitors, and capture beautiful landscape photography. The serene atmosphere of Kandy Lake Round enhances the cultural and historical significance of the area, making it a must-visit feature of the city',
                arrives: '12.00 PM'
            }
        ]
    },
    // { id: '2', image: bg, title: 'Galle to Kurunegala', duration: 1, date: '05 july 2021', stats: 'Pending', price: 2300, max: 10, current: 13, routes: [{ place: 'peradeniya Botnical Garden', images: g }, { place: 'Sri Dalada Maligawa', images: l }, { place: 'Kandy Lake Round', images: te }] },
    {
        id: '3',
        image: pic,
        title: 'Matara to Colombo',
        duration: 2,
        date: '04 june 2020',
        stats: 'Confirm',
        price: 5000,
        max: 20,
        current: 3,
        routes: [
            {
                place: 'peradeniya Botnical Garden',
                images: g,
                description: "The Peradeniya Botanical Gardens, located near Kandy in Sri Lanka, is one of the oldest and largest botanical gardens in the country, spanning 59 hectares (146 acres). Established in 1821 during British colonial rule, its history dates back to 1371 when it served as a royal court under King Wickramabahu III. Home to over 4,000 species of plants, including a renowned collection of orchids, palms, and tropical trees, the garden features notable attractions like the Orchid House, the classical Avenue of Palms, and memorial trees planted by historical figures. Situated along the Mahaweli River at an elevation of 460 meters above sea level, it attracts around 2 million visitors annually and remains a key center for botanical research and conservation under Sri Lanka's Department of Agriculture",
                arrives: '8.00 AM'
            },
            {
                place: 'Sri Dalada Maligawa',
                images: te,
                description: 'Sri Dalada Maligawa, commonly known as the Temple of the Sacred Tooth Relic, is a revered Buddhist temple in Kandy, Sri Lanka, located within the Royal Palace Complex of the former Kingdom of Kandy. It houses a tooth relic of Gautama Buddha, believed to be his left canine, which has historically symbolized the right to rule the country, making it a significant political and spiritual artifact. Built initially in the late 16th century by King Vimaladharmasuriya I, the current structure dates to the 18th century under King Kirthi Sri Rajasinghe. Declared a UNESCO World Heritage Site in 1988, the temple features unique Kandyan architecture with intricate carvings of gold, silver, bronze, and ivory. It attracts thousands of devotees and tourists daily, with rituals performed three times a day and the annual Esala Perahera festival honoring the relic through a grand procession',
                arrives: '9.00 AM'
            },
            {
                place: 'Kandy Lake Round',
                images: l,
                description: 'Kandy Lake Round, often referred to as the walking path around Kandy Lake, is a scenic and popular route in the heart of Kandy, Sri Lanka. This picturesque path, stretching approximately 2.7 to 3.2 kilometers depending on the specific route taken, encircles the artificial lake, also known as Kiri Muhuda or the Sea of Milk, which was built in 1807 by King Sri Wickrama Rajasinghe. The path offers a tranquil setting for leisurely strolls or jogs under the shade of large trees, with stunning views of the surrounding hills, the lake itself, and nearby landmarks like the Temple of the Tooth Relic. It serves as a favored spot for both locals and tourists to enjoy nature, observe wildlife such as birds and water monitors, and capture beautiful landscape photography. The serene atmosphere of Kandy Lake Round enhances the cultural and historical significance of the area, making it a must-visit feature of the city',
                arrives: '12.00 PM'
            }
        ]
    },
    // { id: '2', image: bg, title: 'Galle to Kurunegala', duration: 1, date: '05 july 2021', stats: 'Pending', price: 2300, max: 10, current: 13, routes: [{ place: 'peradeniya Botnical Garden', images: g }, { place: 'Sri Dalada Maligawa', images: l }, { place: 'Kandy Lake Round', images: te }] },
    // { id: '3', image: t, title: 'Colombo to jaffna', duration: 4, date: '06 aug 2022', stats: 'Cancelled', price: 1500, max: 25, current: 10, routes: [{ place: 'peradeniya Botnical Garden', images: g }, { place: 'Sri Dalada Maligawa', images: l }, { place: 'Kandy Lake Round', images: te }] },
    // { id: '4', image: pic, title: 'Matara to Kandy', duration: 10, date: '07 sept 2023', stats: 'Pending', price: 9000, max: 10, current: 4, routes: [{ place: 'peradeniya Botnical Garden', images: g }, { place: 'Sri Dalada Maligawa', images: l }, { place: 'Kandy Lake Round', images: te }] },
    // { id: '5', image: bg, title: 'Galle to Dehiwala', duration: 2, date: '08 oct 2024', stats: 'Pending', price: 1800, max: 15, current: 10, routes: [{ place: 'peradeniya Botnical Garden', images: g }, { place: 'Sri Dalada Maligawa', images: l }, { place: 'Kandy Lake Round', images: te }] },
    // { id: '6', image: t, title: 'Matale to Rajarata', duration: 6, date: '09 nov 2025', stats: 'Confirm', price: 700, max: 30, current: 24, routes: [{ place: 'peradeniya Botnical Garden', images: g }, { place: 'Sri Dalada Maligawa', images: l }, { place: 'Kandy Lake Round', images: te }] },

];


export default function Views() {
    const router = useRouter();
    const { id } = useLocalSearchParams();

    const [item, setItem] = useState({
        id: '',
        image: null,
        title: '',
        duration: 0,
        date: '',
        stats: '',
        price: 0,
        max: 0,
        current: 0,
        routes: [{ place: '', images: '', description: '', arrives: '' }],
    });

    const getItem = (Id: string | string[]) => {
        const foundItem = groupCollection.find(collection => collection.id === Id);
        if (foundItem) {

            setItem(foundItem);
        } else {
            console.log(Id)
            alert('No item found');
            router.back();
        }
    };

    useEffect(() => {
        if (id) {
            getItem(id);
        }
    }, [id]);

    const route = item.title?.split(" ") || [];

    return (
        <View>

            <TouchableOpacity className="pl-3" onPress={() => router.back()}><Text>Back</Text></TouchableOpacity>
            {/* <View className="h-full justify-center items-center">
                <Text>group : {id}</Text>
            </View> */}
            <ScrollView

                className="w-full h-[97%]"
                contentContainerClassName="flex-col px-3 py-5 gap-5"
                showsVerticalScrollIndicator={false}

            >
                {/* <View className="h-full"> */}
                <View className="w-full gap-5">
                    {/* <View className="w-full">

                        <Image className="w-full h-44" source={item.image} />
                         <View className="absolute w-full flex-row justify-between px-3 py-16">
                                <Text>next</Text>
                                <Text>prev</Text>
                            </View> 
                        <View className="flex-row gap-2 items-start px-1">

                            <Text className="italic">Hosted by</Text>
                            <Text className="font-extrabold">Travelsri</Text>

                        </View>
                        <View className="flex-row w-[60%] justify-between px-1">
                            <View className="flex-row gap-1 items-center">

                                <Image className="w-3 h-3" source={clock} />
                                <Text className="italic text-[10px]">1 Day</Text>

                            </View>
                            <View className="flex-row gap-1 items-center">

                                <Image className="w-4 h-4" source={hiking} />
                                <Text className="italic text-[10px]">{item.routes.length} Stops</Text>

                            </View>
                            <View className="flex-row gap-1 items-center">

                                <Image className="w-3 h-3" source={user} />
                                <Text className="italic text-[10px]">20 Members</Text>

                            </View>
                            <View className="flex-row gap-1 items-center">

                                <Image className="w-3 h-3" source={location} />
                                <Text className="italic text-[10px]">Kandy</Text>

                            </View>
                        </View>

                    </View>*/}


                    <View className="w-full">

                        <Text className='bg-black w-20 px-1 rounded-lg py-1 text-center font-bold text-white'>Route</Text>
                        {/* <View className="w-full flex-wrap h-24 flex-row p-3 items-center justify-evenly gap-3 border-gray-200 border-2 rounded-2xl mt-2">
                            <View className="w-44 flex-row justify-evenly items-center bg-gray-300 px-1 py-1 rounded-xl">
                                <Image className="w-5 h-5" source={mark} />

                                <Text>Driver with A\C bus</Text>

                            </View>
                            <View className="w-44 flex-row justify-evenly items-center bg-gray-300 px-1 py-1 rounded-xl">
                                <Image className="w-5 h-5" source={mark} />

                                <Text>Accomodation</Text>

                            </View>
                            <View className="w-44 flex-row justify-evenly items-center bg-gray-300 px-1 py-1 rounded-xl">
                                <Image className="w-5 h-5" source={mark} />

                                <Text>Driver with A\C bus</Text>

                            </View>
                            <View className="w-44 flex-row justify-evenly items-center bg-gray-300 px-1 py-1 rounded-xl">
                                <Image className="w-5 h-5" source={mark} />

                                <Text>Accomodation</Text>

                            </View>
                        </View>*/}

                    </View>
                    <View>
                        <Image className="w-full h-40" source={map} />
                    </View>
                    <Text className='bg-black w-20 px-1 rounded-lg py-1 text-center font-bold text-white'>Locations</Text>
                    <View className=" w-full">
                        {/* <View className="pt-5">
                            <Text className="font-extrabold self-center mb-3">{route[0]} (start)</Text>
                            <Image className="w-5 h-5 self-center" source={dots} />
                        </View> */}
                        <View>
                            {item.routes.map((x, i) => {

                                return (

                                    <View key={i}>
                                        <Text className="py-1 font-black">{i + 1}.{x.place} <Text className="mx-5 italic text-gray-500">{/* Arrives {x.arrives} */}</Text></Text>


                                        <Image className="w-full h-48" source={x.images} />
                                        <Text className="px-3 text-sm italic text-justify my-5 text-gray-500 font-semibold">{x.description}</Text>

                                        {/* {id < (item.routes.length - 1) && */}

                                        {/* <Image className="w-5 h-5 self-center" source={dots} />
                                        <Image className="w-5 h-5 self-center" source={dots} /> */}

                                    </View>
                                )
                            })

                            }
                            {/* <View className="border-b-2 border-b-gray-200">
                                <Text className="font-extrabold self-center py-2">{route[2]} (end)</Text>
                            </View> */}
                        </View>
                    </View>
                    <View className="w-full">

                        {/*<Text className='bg-black w-20 px-1 rounded-lg py-1 text-center font-bold text-white'>Locations</Text>
                         <View className="w-full flex-wrap h-auto flex-row p-3 gap-4  items-center justify-between border-gray-200 border-2 rounded-2xl mt-2">
                            <View className="w-44 flex-row justify-evenly items-center bg-gray-300 px-1 py-1 rounded-xl">
                                <Image className="w-4 h-4" source={cross} />

                                <Text>Driver with A\C bus</Text>

                            </View>
                            <View className="w-44 flex-row justify-evenly items-center bg-gray-300 px-1 py-1 rounded-xl">
                                <Image className="w-4 h-4" source={cross} />

                                <Text>Accomodation</Text>

                            </View>
                            <View className="w-44 flex-row justify-evenly items-center bg-gray-300 px-1 py-1 rounded-xl">
                                <Image className="w-4 h-4" source={cross} />

                                <Text>Driver with A\C bus</Text>

                            </View>
                            <View className="w-44 flex-row justify-evenly items-center bg-gray-300 px-1 py-1 rounded-xl">
                                <Image className="w-4 h-4" source={cross} />

                                <Text>Accomodation</Text>

                            </View>
                        </View> */}

                    </View>
                </View>


                <View className="self-center flex-row items-center bg-[#FEFA17] w-[95%] h-12 rounded-2xl justify-between px-1 shadow-lg">

                    {/* <Text className="px-3 font-extrabold text-xl">{item.price}.00 LKR</Text> */}

                    <TouchableOpacity
                        className=" bg-[#84848460] rounded-xl w-full"
                        onPress={

                            async () => {
                                await AsyncStorage.setItem('selectedRouteId', item.id);
                                router.back();

                            }}>
                        <View className="py-2 px-3 flex-row justify-evenly w-full ">
                            <Text>Choose Route</Text>
                            {/* <Image className="w-5 h-5" source={back} /> */}
                        </View>
                    </TouchableOpacity>
                </View>
                {/* </View> */}
            </ScrollView>
        </View>


    );
}
