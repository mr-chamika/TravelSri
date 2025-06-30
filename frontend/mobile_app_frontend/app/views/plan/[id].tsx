import { useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { cssInterop } from 'nativewind'
import { Image } from 'expo-image'


cssInterop(Image, { className: "style" });


const map = require('../../../assets/images/map.png')
const g = require('../../../assets/images/tabbar/groupt/garden.png')
const l = require('../../../assets/images/tabbar/groupt/lake.png')
const te = require('../../../assets/images/tabbar/groupt/temple.png')

interface Trip {

    title: string,
    date: string,
    routeId: string,
    hotelId: string,
    guideId: string,
    shopId: string,
    vehicleId: string,
    stats: string,
    payment: any

}

const trip: Trip =

{

    title: 'Colombo to Kandy',
    date: '04 june 2020',
    routeId: '1',
    hotelId: '1',
    guideId: '1',
    shopId: '1',
    vehicleId: '1',
    stats: 'Confirmed',
    payment: { hotel: 100, guide: 20, vehicle: 200, total: 320 }

}




const route = { routeId: '1', images: [map, g, l, te] }
const hotel = { hotelId: '1', name: 'shrangi-la', location: 'Colombo' }
const guide = { guideId: '1', name: 'Nimal', location: 'Maharagama' }
const store = { shopId: '1', name: 'Mini Mart', location: 'Colombo' }
const vehicle = { vehicleId: '1', driver: 'Taxi karaya', category: 'Seddan' }

export default function Views() {

    const router = useRouter();
    const { id } = useLocalSearchParams();

    return (

        <View className="h-full w-full">

            <TouchableOpacity className="ml-3" onPress={() => router.back()}><Text>Back</Text></TouchableOpacity>

            <ScrollView
                className="w-full h-[78%]"
                contentContainerClassName="flex-col justify-center items-start gap-3 py-5 px-2"
                showsVerticalScrollIndicator={false}
            >
                <View className="w-full py-5">

                    <Text className="text-3xl font-bold text-center">{trip.title}</Text>
                    <View className="items-center">
                        <ScrollView
                            horizontal
                            className=" h-50 border-black rounded-2xl w-[81%] border-2"
                            contentContainerClassName=" py-3 pl-3 "
                            showsHorizontalScrollIndicator={false}
                            nestedScrollEnabled={true}

                        >
                            {route.images.map((x, i) => {

                                return (

                                    <View key={i} className=" w-[310px] h-40">

                                        <Image className=" w-[300px] h-full" source={x} />

                                    </View>
                                )
                            })

                            }
                        </ScrollView>
                        <View className="w-[80%] mt-3 flex-row justify-between">
                            <Text>Date : {trip.date}</Text>
                            <Text>{trip.stats}</Text>
                        </View>
                    </View>


                </View>
                <View className=" w-full py-2">

                    <Text className="text-xl font-semibold">Accomodation Details</Text>

                    <View className="items-center">
                        <View className="flex-row w-[90%] justify-between items-center">

                            <Text>Hotel : {hotel.name}</Text>
                            <Text>Location : {hotel.location}</Text>
                            <TouchableOpacity onPress={() => router.replace(`/views/hotel/solo/${hotel.hotelId}`)} className="bg-[#FEFA17] px-4 py-1 rounded-lg"><Text className=" text-black font-extrabold">View</Text></TouchableOpacity>

                        </View>
                    </View>

                </View>
                <View className=" w-full py-2">

                    <Text className="text-xl font-semibold">Guide Details</Text>

                    <View className="items-center">
                        <View className="flex-row w-[90%] justify-between items-center">

                            <Text>Guide : {guide.name}</Text>
                            <Text>Location : {guide.location}</Text>
                            <TouchableOpacity onPress={() => router.replace(`/views/guide/solo/${guide.guideId}`)} className="bg-[#FEFA17] px-4 py-1 rounded-lg"><Text className=" text-black font-extrabold">View</Text></TouchableOpacity>

                        </View>
                    </View>

                </View>
                <View className=" w-full py-2">

                    <Text className="text-xl font-semibold">Equipment Details</Text>

                    <View className="items-center">
                        <View className="flex-row w-[90%] justify-between items-center">

                            <Text>Store : {store.name}</Text>
                            <Text>Location : {store.location}</Text>
                            <TouchableOpacity onPress={() => router.replace(`/views/shop/${store.shopId}`)} className="bg-[#FEFA17] px-4 py-1 rounded-lg"><Text className=" text-black font-extrabold">View</Text></TouchableOpacity>

                        </View>
                    </View>

                </View>
                <View className=" w-full py-2">

                    <Text className="text-xl font-semibold">Vehicle Details</Text>

                    <View className="items-center">
                        <View className="flex-row w-[90%] justify-between items-center">

                            <Text>Driver : {vehicle.driver}</Text>
                            <Text>Category : {vehicle.category}</Text>
                            <TouchableOpacity onPress={() => router.replace(`/views/car/profile/${vehicle.vehicleId}`)} className="bg-[#FEFA17] px-4 py-1 rounded-lg"><Text className=" text-black font-extrabold">View</Text></TouchableOpacity>

                        </View>
                    </View>

                </View>
                <View className="w-full py-2">

                    <Text className="text-xl font-semibold">Bill Details</Text>

                    <View className="items-center py-2">
                        <View className="w-[90%] justify-between items-center">
                            <View className="mb-4 py-2">
                                <Text className="text-xl">Hotel Fee : {trip.payment.hotel}</Text>
                                <Text className="text-xl">Vehicle Fee : {trip.payment.vehicle}</Text>
                                <Text className="text-xl">Guide Fee : {trip.payment.guide}</Text>
                            </View>
                            <Text className="text-xl">Total : {trip.payment.total}</Text>
                            <TouchableOpacity onPress={() => router.replace(`/views/payment/${guide.guideId}`)} className="bg-[#FEFA17] self-end px-4 py-1 rounded-lg"><Text className=" text-black font-extrabold">Pay Now</Text></TouchableOpacity>

                        </View>
                    </View>

                </View>

            </ScrollView>
        </View>

    )

}