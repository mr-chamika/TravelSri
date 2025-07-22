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

interface Hotel {

    _id: string,
    images: string[],
    name: string,
    location: string,
    stars: number,
    description: string,
    price: number

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

interface Faci {

    _id: string,
    hotelId: string,
    image: string,
    title: string

}

export default function Views() {

    const router = useRouter();
    const { id } = useLocalSearchParams();

    const [hotelv, setHotelv] = useState<Hotel>()
    const [reviewv, setReviewv] = useState<Review[]>([])
    const [faciv, setFaciv] = useState<Faci[]>([])


    useEffect(() => {

        const gethotel = async () => {

            try {

                const res1 = await fetch(`http://localhost:8080/traveler/hotels-view?id=${id}`)
                //const res1 = await fetch(`https://travelsri-backend.onrender.com/traveler/hotels-view?id=${id}`)

                if (res1) {

                    const data1 = await res1.json()
                    //console.log(data1)
                    setHotelv(data1)

                }

            } catch (err) {

                console.log(`Error in hotel data getting : ${err}`)

            }

        }
        const getReviews = async () => {

            try {

                const res2 = await fetch(`http://localhost:8080/traveler/reviews-view?id=${id}`)
                //const res2 = await fetch(`https://travelsri-backend.onrender.com/traveler/reviews-view?id=${id}`)

                if (res2) {

                    const data2 = await res2.json()
                    // console.log(data2)
                    setReviewv(data2)

                }

            } catch (err) {

                console.log(`Error in hotel reviews getting : ${err}`)

            }

        }
        const getFaci = async () => {

            try {

                const res3 = await fetch(`http://localhost:8080/traveler/facis-view?id=${id}`)
                //const res3 = await fetch(`https://travelsri-backend.onrender.com/traveler/facis-view?id=${id}`)

                if (res3) {

                    const data3 = await res3.json()
                    //console.log(data3)
                    setFaciv(data3)

                }

            } catch (err) {

                console.log(`Error in hotel reviews getting : ${err}`)

            }

        }
        gethotel()
        getReviews()
        getFaci()
    }, [])

    /*  useEffect(() => {
         // Ensure id is treated as a string for getItem, or convert it if necessary
         getItem((Number(id) - 1).toString());
 
     }, [id]) */

    //const [item, setItem] = useState<{ id: string, image: any[], title: string, stars: number, location: string, price: number, description: string, reviewers: any[], faci: any[] }>({ id: '1', image: [], title: 'Matara to Colombo', stars: 0, location: "", price: 0, description: '', reviewers: [], faci: [] })

    /* const groupCollection = [
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
    ];
 */
    /* const getItem = (Id: string) => { // Changed type to string as id from useLocalSearchParams is string
        groupCollection.map((collection, i) => {
            if (collection.id == Id) {
                setItem(collection)
            }
        })
    } */

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
                                {hotelv && hotelv.images && hotelv.images.map((x, i) => {

                                    return (

                                        <View key={i} className=" w-[310px] h-40">

                                            <Image className=" w-[300px] h-full" source={{ uri: `data:image/jpeg;base64,${x}` }} />

                                        </View>
                                    )
                                })

                                }
                            </ScrollView>

                        </View>
                        <View className="flex-row justify-between pt-1">
                            <View>
                                <Text className="font-black text-xl">{hotelv && hotelv.name}</Text>
                                <View className="flex-row items-center">
                                    <Image className="w-4 h-4" source={location} />
                                    <Text className="text-start">{hotelv && hotelv.location}</Text>
                                </View>
                            </View>
                            <View className="flex-row items-start">
                                <Image className="w-5 h-5" source={star} />
                                <Text>{hotelv && hotelv.stars}</Text>
                            </View>
                        </View>
                    </View>

                    <View>

                        <Text className="px-3 text-sm italic text-justify text-gray-500 font-semibold">{hotelv && hotelv.description}</Text>
                        <Text className=" text-2xl font-semibold py-1">Reviews</Text>

                        <View>
                            <ScrollView

                                className="w-full h-64 border-2 border-gray-200 rounded-2xl"
                                contentContainerClassName={`flex-col px-2 py-3 gap-5 ${!reviewv || reviewv.length == 0 ? 'h-full' : ''}`}
                                showsVerticalScrollIndicator={false}
                                nestedScrollEnabled={true}

                            >
                                {!reviewv || reviewv.length == 0 && <View className="w-full h-full items-center justify-center"><Text>No Reviews yet</Text></View>}
                                {reviewv.map((x, i) => {

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
                        <View>

                            <Text className=" text-2xl font-semibold py-2">Facilities</Text>

                            <View>
                                <ScrollView
                                    horizontal
                                    className="w-full rounded-2xl px-1"
                                    contentContainerClassName="flex-row w-full px-1 py-2 bg-gray-200 gap-4 items-center"
                                    showsHorizontalScrollIndicator={false}
                                    nestedScrollEnabled={true}

                                >
                                    {faciv.map((x, i) => {

                                        return (

                                            <View key={i} className="p-3 rounded-2xl">
                                                <View className="items-center">

                                                    <Image className="w-10 h-10 rounded-full" source={{ uri: `data:image/jpeg;base64,${x.image}` }} />
                                                    <Text className="text-center">{x.title}</Text>

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

                    <Text className="px-3 font-extrabold text-xl">{hotelv && hotelv.price}.00 LKR/day</Text>

                    <TouchableOpacity className=" bg-[#84848460] rounded-xl w-[30%]" onPress={
                        async () => {
                            // Use the consistent key 'selectedHotelBooking'
                            const existingHotelBooking = await AsyncStorage.getItem('selectedHotelBooking');
                            let hotelDataToSave = {
                                id: id, // Store the actual ID from route params
                                s: '',
                                d: ''
                            };

                            if (existingHotelBooking) {
                                const parsedExisting = JSON.parse(existingHotelBooking);
                                // Preserve s and d from the existing booking if they exist
                                hotelDataToSave.s = parsedExisting.s || '';
                                hotelDataToSave.d = parsedExisting.d || '';
                            } else {
                                // Fallback to hbookings if selectedHotelBooking doesn't exist to get s and d
                                const hbookings = await AsyncStorage.getItem('hbookings');
                                if (hbookings) {
                                    const parsedHbookings = JSON.parse(hbookings);
                                    if (parsedHbookings.length > 0) {
                                        hotelDataToSave.s = parsedHbookings[0].s || '';
                                        hotelDataToSave.d = parsedHbookings[0].d || '';
                                    }
                                }
                            }

                            await AsyncStorage.setItem('selectedHotelBooking', JSON.stringify(hotelDataToSave));
                            router.back();
                        }}>
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