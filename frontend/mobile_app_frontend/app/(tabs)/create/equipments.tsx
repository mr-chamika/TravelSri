import { View, Text, ScrollView, TouchableOpacity, Alert, TextInput } from "react-native";
import { cssInterop } from 'nativewind'
import { Image } from 'expo-image'
import { useRouter } from "expo-router";


cssInterop(Image, { className: "style" });

const pic = require('../../../assets/images/tabbar/create/equips/item.png')
const pics = require('../../../assets/images/tabbar/create/equips/str.png')
const search = require('../../../assets/images/search1.png')
const pin = require('../../../assets/images/tabbar/create/pin.png')
const tele = require('../../../assets/images/tabbar/create/guide/telephones.png')
const star = require('../../../assets/images/tabbar/create/hotel/stars.png')

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

    const router = useRouter();

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

        }

    ]

    const shops: Shop[] = [

        {

            id: '1',
            image: pics,
            location: 'Colombo',
            mobile: '0123456789',
            stars: 2,
            title: 'Mini Market'

        },
        {

            id: '2',
            image: pics,
            location: 'Galle',
            mobile: '000000000',
            stars: 3,
            title: 'GloMart'

        }

    ]

    return (

        <View className="w-full">

            <View className="w-[80%] items-center mx-10 flex-row justify-center bg-[#d9d9d976] rounded-2xl my-8">

                <Image className="w-7 h-7" source={search}></Image>
                <TextInput className=" h-[40px] w-[230px] pl-5 text-black" placeholder="Search...." placeholderTextColor="#8E8E8E" />

            </View>
            <View>

                <Text className="text-[22px] font-semibold mx-3 mb-4">Items</Text>

                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    className="px-5 h-[27%]"
                    contentContainerStyle={{ paddingRight: 40 }}
                >
                    <View className=" flex-row gap-3 h-full">
                        {items.map((item, i) => {
                            return (
                                <TouchableOpacity key={i} className="w-[83px] items-center " onPress={() => alert(`Contact us - ${item.contact}`)}>
                                    <Image
                                        className="w-[60px] h-[120px] rounded-[23px] shadow-gray-400"
                                        source={item.image}
                                    />
                                    <Text className="mt-2 text-[10px] italic text-center">
                                        {item.title}
                                    </Text>
                                    <Text className=" text-[10px] italic text-center">
                                        {item.price}.00 LKR
                                    </Text>
                                </TouchableOpacity>
                            )
                        })
                        }
                    </View>
                </ScrollView>
            </View>
            <View className="mt-5">

                <Text className="text-[22px] font-semibold mb-2 mx-3">Top Stores</Text>

                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    className="px-2"
                    contentContainerStyle={{ paddingRight: 20 }}
                >
                    <View className="flex-row gap-10">
                        {shops.map((shop, i) => {
                            return (
                                <TouchableOpacity key={i} className="bg-gray-200 w-[350px] h-[220px] items-center rounded-[20px] ml-3" onPress={() => router.push(`/views/shop/${shop.id}`)}>

                                    <Image
                                        className="opacity-65 mt-2 flex justify-center w-[335px] h-[130px] rounded-[15px] shadow-gray-400  "
                                        source={shop.image}
                                    />
                                    <View>
                                        <Text className="mt-1 text-[24px] text-center">
                                            {shop.title}
                                        </Text>
                                    </View>
                                    <View className="w-full flex flex-row justify-between px-3 mt-5">

                                        <View className="flex-row">

                                            <Image className="w-5 h-5" source={pin} />
                                            <Text>{shop.location}</Text>

                                        </View>
                                        <View className="flex-row justify-center items-center gap-1">

                                            <Image className="w-4 h-4" source={tele} />
                                            <Text>{shop.mobile}</Text>

                                        </View>
                                        <View className="flex-row justify-center items-center gap-1">

                                            <Image className="w-5 h-5" source={star} />
                                            <Text>{shop.stars}/5</Text>

                                        </View>


                                    </View>
                                </TouchableOpacity>
                            )
                        })
                        }
                    </View>
                </ScrollView>
            </View>

        </View>

    )

}