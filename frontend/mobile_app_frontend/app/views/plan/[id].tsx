import { useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { cssInterop } from 'nativewind'
import { Image } from 'expo-image'
import { useEffect, useState } from "react";


cssInterop(Image, { className: "style" });


const map = require('../../../assets/images/map.png')
const g = require('../../../assets/images/tabbar/groupt/garden.png')
const l = require('../../../assets/images/tabbar/groupt/lake.png')
const te = require('../../../assets/images/tabbar/groupt/temple.png')

interface Trip {

    _id: string;
    creatorId: string;
    //route selection
    routeId: string;

    //hotel selection
    hotelId: string;
    hotel: string;
    hlocation: string;
    hprice: number;

    //guide selection
    guideId: string;
    glocation: string;
    gprice: number;
    guide: string;


    //car details
    carId: string;
    cprice: number;
    driver: string;
    category: string;

    //other
    start: string;
    destination: string;
    //<String> images:string;
    status: string;//"confirmed","pending","cancel:string"
    startDate: string;//vehicle booked dat:stringe
    map: string;

}
/* 
const trip: Trip =

{

    title: 'Colombo to Kandy',
    date: '04 june 2020',
    routeId: '1',
    hotelId: '1',
    guideId: '1',
    shopId: '1',
    vehicleId: '1',
    status: 'Confirmed',
    payment: { hotel: 100, guide: 20, vehicle: 200, total: 320 }

} */




const route = { routeId: '1', images: [map/* , g, l, te */] }
const hotel = { hotelId: '1', name: 'shrangi-la', location: 'Colombo' }
const guide = { guideId: '1', name: 'Nimal', location: 'Maharagama' }
const store = { shopId: '1', name: 'Mini Mart', location: 'Colombo' }
const vehicle = { vehicleId: '1', driver: 'Taxi karaya', category: 'Seddan' }

export default function Views() {

    const router = useRouter();
    const { id } = useLocalSearchParams();

    const [dataSet, setDataSet] = useState<Trip | null>(null)

    const getData = async () => {

        try {

            const res = await fetch(`http://localhost:8080/traveler/trip-one?id=${id}`)
            //const res = await fetch(`https://travelsri-backend.onrender.com/traveler/trip-one?id=${id}`)

            if (res) {

                const data = await res.json()
                setDataSet(data)
                //console.log(data)

            }

        } catch (err) {

            console.log(`Error from trip data getting : ${err}`)

        }


    }

    useEffect(() => {

        getData()

    }, [])

    return (

        <View className="h-full w-full">

            <TouchableOpacity className="ml-3" onPress={() => router.back()}><Text>Back</Text></TouchableOpacity>

            <ScrollView
                className="w-full h-[78%]"
                contentContainerClassName="flex-col justify-center items-start gap-3 py-5 px-2"
                showsVerticalScrollIndicator={false}
            >
                <View className="w-full py-5">

                    <Text className="text-3xl font-bold text-center">{dataSet?.start} to {dataSet?.destination}</Text>
                    <View className="items-center">
                        {/* <ScrollView
                            horizontal
                            className=" h-50 border-black rounded-2xl w-[81%] border-2"
                            contentContainerClassName=" py-3 pl-3"
                            showsHorizontalScrollIndicator={false}
                            nestedScrollEnabled={true}

                        > 
                            {route.images.map((x, i) => {

                                return (

                                    <View key={i} className=" w-[310px] h-40">
*/}
                        {dataSet && <Image className="my-5 w-[300px] h-40 "/* h-full"  source={x} */ source={{ uri: `data:image/jpeg;base64,${dataSet?.map}` }} alt="Map" />}
                        {/*
                                    </View>
                                )
                            })

                            }
                         </ScrollView> */}
                        <View className="w-[80%] mt-3 flex-row justify-between">
                            <Text>Date : {dataSet?.startDate}</Text>
                            <Text>{dataSet?.status}</Text>
                        </View>
                    </View>


                </View>
                <View className=" w-full py-2">

                    <Text className="text-xl font-semibold">Accomodation Details</Text>

                    <View className="items-center">
                        <View className="flex-row w-[90%] justify-between items-center">

                            <Text>Hotel : {dataSet?.hotel}</Text>
                            <Text>Location : {dataSet?.hlocation}</Text>
                            <TouchableOpacity onPress={() => router.replace(`/views/hotel/solo/${dataSet?.hotelId}`)} className="bg-[#FEFA17] px-4 py-1 rounded-lg"><Text className=" text-black font-extrabold">View</Text></TouchableOpacity>

                        </View>
                    </View>

                </View>
                <View className=" w-full py-2">

                    <Text className="text-xl font-semibold">Guide Details</Text>

                    <View className="items-center">
                        <View className="flex-row w-[90%] justify-between items-center">

                            <Text>Guide : {dataSet?.guide}</Text>
                            <Text>Location : {dataSet?.glocation}</Text>
                            <TouchableOpacity onPress={() => router.replace(`/views/guide/solo/${dataSet?.guideId}`)} className="bg-[#FEFA17] px-4 py-1 rounded-lg"><Text className=" text-black font-extrabold">View</Text></TouchableOpacity>

                        </View>
                    </View>

                </View>
                {/* <View className=" w-full py-2">

                    <Text className="text-xl font-semibold">Equipment Details</Text>

                    <View className="items-center">
                        <View className="flex-row w-[90%] justify-between items-center">

                            <Text>Store : {store.name}</Text>
                            <Text>Location : {store.location}</Text>
                            <TouchableOpacity onPress={() => router.replace(`/views/shop/${store.shopId}`)} className="bg-[#FEFA17] px-4 py-1 rounded-lg"><Text className=" text-black font-extrabold">View</Text></TouchableOpacity>

                        </View>
                    </View>

                </View> */}
                <View className=" w-full py-2">

                    <Text className="text-xl font-semibold">Vehicle Details</Text>

                    <View className="items-center">
                        <View className="flex-row w-[90%] justify-between items-center">

                            <Text>Driver : {dataSet?.driver}</Text>
                            <Text>Category : {dataSet?.category}</Text>
                            <TouchableOpacity onPress={() => router.replace(`/views/car/profile/${dataSet?.carId}`)} className="bg-[#FEFA17] px-4 py-1 rounded-lg"><Text className=" text-black font-extrabold">View</Text></TouchableOpacity>

                        </View>
                    </View>

                </View>
                <View className="w-full py-2">

                    <Text className="text-xl font-semibold">Bill Details</Text>

                    <View className="items-center py-2">
                        <View className="w-[90%] justify-between items-center">
                            <View className="mb-4 py-2">
                                <Text className="text-xl">Hotel Fee : Rs. {dataSet?.hprice}.00</Text>
                                <Text className="text-xl">Vehicle Fee : Rs. {dataSet?.cprice}.00</Text>
                                <Text className="text-xl">Guide Fee : Rs. {dataSet?.gprice}.00</Text>
                            </View>
                            <Text className="text-xl">Total : Rs. {dataSet && (dataSet?.hprice + dataSet?.cprice + dataSet?.gprice) || 0}.00</Text>
                            <TouchableOpacity onPress={() => router.replace(`/views/payment/${guide.guideId}`)} className="bg-[#FEFA17] self-end px-4 py-1 rounded-lg"><Text className=" text-black font-extrabold">Pay Now</Text></TouchableOpacity>

                        </View>
                    </View>

                </View>

            </ScrollView>
        </View>

    )

}