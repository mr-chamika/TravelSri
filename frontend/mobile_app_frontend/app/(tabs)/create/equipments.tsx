import { View, Text, ScrollView, TouchableOpacity, Alert, TextInput } from "react-native";
import { cssInterop } from 'nativewind'
import { Image } from 'expo-image'


cssInterop(Image, { className: "style" });

const pic = require('../../../assets/images/tabbar/create/equips/item.png')
const pics = require('../../../assets/images/tabbar/create/equips/str.png')
const search = require('../../../assets/images/search1.png')
const pin = require('../../../assets/images/tabbar/create/pin.png')
const tele = require('../../../assets/images/tabbar/create/guide/telephones.png')
const star = require('../../../assets/images/tabbar/create/hotel/stars.png')


export default function Equipments() {

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
                    <View className=" flex-row gap-10 h-full">
                        <TouchableOpacity className="w-[83px] items-center">
                            <Image
                                className="w-[60px] h-[120px] rounded-[23px] shadow-gray-400"
                                source={pic}
                            />
                            <Text className="mt-2 text-[10px] italic text-center">
                                Rope (Large)
                            </Text>
                            <Text className=" text-[10px] italic text-center">
                                500.00 LKR
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity className="w-[83px] items-center">
                            <Image
                                className="w-[60px] h-[120px] rounded-[23px] shadow-gray-400"
                                source={pic}
                            />
                            <Text className="mt-2 text-[10px] italic text-center">
                                Rain Coat
                            </Text>
                            <Text className=" text-[10px] italic text-center">
                                5000.00 LKR
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="w-[83px] items-center">
                            <Image
                                className="w-[60px] h-[120px] rounded-[23px] shadow-gray-400"
                                source={pic}
                            />
                            <Text className="mt-2 text-[10px] italic text-center">
                                Tent (Mini)
                            </Text>
                            <Text className="text-[10px] italic text-center">
                                90 000.00 LKR
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="w-[83px] items-center">
                            <Image
                                className="w-[60px] h-[120px] rounded-[23px] shadow-gray-400"
                                source={pic}
                            />
                            <Text className="mt-2 text-[10px] italic text-center">
                                Hike Shoes
                            </Text>
                            <Text className="text-[10px] italic text-center">
                                2000.00 LKR
                            </Text>
                        </TouchableOpacity>

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
                        <View className="bg-gray-200 w-[350px] h-[220px] items-center rounded-[20px] ml-3">

                            <Image
                                className="opacity-65 mt-2 flex justify-center w-[335px] h-[130px] rounded-[15px] shadow-gray-400  "
                                source={pics}
                            />
                            <View>
                                <Text className="mt-1 text-[24px] text-center">
                                    Mini Market
                                </Text>
                            </View>
                            <View className="w-full flex flex-row justify-between px-3 mt-5">

                                <View className="flex-row">

                                    <Image className="w-5 h-5" source={pin} />
                                    <Text>Colombo</Text>

                                </View>
                                <View className="flex-row justify-center items-center gap-1">

                                    <Image className="w-4 h-4" source={tele} />
                                    <Text>0123456789</Text>

                                </View>
                                <View className="flex-row justify-center items-center gap-1">

                                    <Image className="w-5 h-5" source={star} />
                                    <Text>2/5</Text>

                                </View>


                            </View>
                        </View>
                        <View className="bg-gray-200 w-[350px] h-[220px] items-center rounded-[20px] ml-3">

                            <Image
                                className="opacity-65 mt-2 flex justify-center w-[335px] h-[130px] rounded-[15px] shadow-gray-400  "
                                source={pics}
                            />
                            <View>
                                <Text className="mt-1 text-[24px] text-center">
                                    Mini Market
                                </Text>
                            </View>
                            <View className="w-full flex flex-row justify-between px-3 mt-5">

                                <View className="flex-row">

                                    <Image className="w-5 h-5" source={pin} />
                                    <Text>Colombo</Text>

                                </View>
                                <View className="flex-row justify-center items-center gap-1">

                                    <Image className="w-4 h-4" source={tele} />
                                    <Text>0123456789</Text>

                                </View>
                                <View className="flex-row justify-center items-center gap-1">

                                    <Image className="w-5 h-5" source={star} />
                                    <Text>2/5</Text>

                                </View>


                            </View>
                        </View>


                    </View>
                </ScrollView>
            </View>

        </View>

    )

}