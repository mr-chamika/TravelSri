import { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert, TextInput, Modal } from "react-native";
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
    shopid: string
    image: string,
    name: string,
    price: number
    contact: string,
    buyCount: number

}

interface Shop {

    _id: string,
    image: string,
    location: string,
    phone: string,
    stars: number,
    name: string


}

export default function Equipments() {

    const router = useRouter();
    const [items, setItems] = useState<Item[]>([])
    const [shops, setShops] = useState<Shop[]>([])
    const [keyword, setKeyword] = useState('');
    const [isModalVisible, setModalVisible] = useState(false);
    const [searchResults, setSearchResults] = useState<{ stores: Shop[], items: Item[] } | null>(null);


    /* const items: Item[] = [

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
*/

    const searching = async () => {
        if (!keyword.trim()) return;

        try {
            const res = await fetch(`http://localhost:8080/traveler/search?keyword=${encodeURIComponent(keyword)}`);
            if (res.ok) {
                const data = await res.json();
                setSearchResults(data);
            } else {
                setSearchResults({ stores: [], items: [] });
            }
        } catch (err) {
            console.log('Error from equipment search: ', err);
            setSearchResults({ stores: [], items: [] });
        }
        setModalVisible(true);

    };

    useEffect(() => {
        const getItems = async () => {

            try {

                const res = await fetch(`http://localhost:8080/traveler/items-top?count=${10}`)

                if (res.ok) {

                    const data = await res.json()
                    //console.log(data)
                    setItems(data)

                } else {

                    console.log("No items found")
                    setItems([])

                }

            } catch (err) {

                console.log(`Error from items getting : ${err}`)

            }

        }
        const getShops = async () => {

            try {

                const res = await fetch(`http://localhost:8080/traveler/shops-get`)

                if (res.ok) {

                    const data = await res.json()
                    //console.log(data)
                    setShops(data)

                } else {

                    console.log("No shops found")
                    setItems([])

                }

            } catch (err) {

                console.log(`Error from shops getting : ${err}`)

            }

        }

        getItems();
        getShops();
    }, [])

    return (
        <>
            <View className="w-full gap-10">

                <View className="w-[80%] items-center mx-10 flex-row justify-center bg-[#d9d9d976] rounded-2xl my-8">

                    <TouchableOpacity onPress={searching}>

                        <Image className="w-7 h-7" source={search}></Image>

                    </TouchableOpacity>
                    <TextInput className=" h-[40px] w-[230px] pl-5 text-black" placeholder="Search...." placeholderTextColor="#8E8E8E" value={keyword} onChangeText={setKeyword} />

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
                            {items.length > 0 && items.map((item, i) => {
                                return (
                                    <TouchableOpacity key={i} className="w-[83px] items-center " onPress={() => alert(`Contact us - ${item.contact}`)}>
                                        <Image
                                            className="w-[60px] h-[120px] rounded-[23px] shadow-gray-400"
                                            source={{ uri: `data:image/jpeg;base64,${item.image}` }}
                                        />
                                        <Text className="mt-2 text-[10px] italic text-center">
                                            {item.name}
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
                                    <TouchableOpacity key={i} className="bg-gray-200 w-[350px] h-[220px] items-center rounded-[20px] ml-3" onPress={() => router.push(`/views/shop/${shop._id}`)}>

                                        <Image
                                            className="opacity-65 mt-2 flex justify-center w-[335px] h-[130px] rounded-[15px] shadow-gray-400  "
                                            source={{ uri: `data:image/jpeg;base64,${shop.image}` }}
                                        />
                                        <View>
                                            <Text className="mt-1 text-[24px] text-center">
                                                {shop.name}
                                            </Text>
                                        </View>
                                        <View className="w-full flex flex-row justify-between px-3 mt-5">

                                            <View className="flex-row">

                                                <Image className="w-5 h-5" source={pin} />
                                                <Text>{shop.location}</Text>

                                            </View>
                                            <View className="flex-row justify-center items-center gap-1">

                                                <Image className="w-4 h-4" source={tele} />
                                                <Text>{shop.phone}</Text>

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

            </View><Modal
                animationType="fade"
                transparent={true}
                visible={isModalVisible}
                onRequestClose={() => { setModalVisible(false); }}
            >
                {/* Backdrop: Fills screen and centers content */}
                <View className="flex-1 justify-center items-center" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>

                    {/* Modal Content Box */}
                    <View className="w-[90%] h-[75%] bg-white rounded-2xl p-4 shadow-lg flex flex-col">
                        <Text className="text-2xl font-bold mb-4 text-center">Results for "{keyword}"</Text>

                        {searchResults && (searchResults.items.length > 0 /* || searchResults.stores.length > 0 */) ? (
                            <View className="flex-1">
                                {/* Items Section (50% Height) */}
                                <View className="flex-1 mb-2">
                                    <Text className="text-xl font-semibold mb-2">Items ({searchResults.items.length})</Text>
                                    <View className="flex-1 border border-gray-200 rounded-lg">
                                        {searchResults.items.length > 0 ? (
                                            <ScrollView showsVerticalScrollIndicator={false} className="p-2">
                                                {searchResults.items.map((item, i) => (
                                                    <TouchableOpacity key={i} className="flex-row items-center bg-gray-100 p-2 rounded-lg mb-2" onPress={() => alert(`Contact us - ${item.contact}`)}>
                                                        <Image className="w-14 h-14 rounded-md" source={{ uri: `data:image/jpeg;base64,${item.image}` }} />
                                                        <View className="ml-3 flex-1">
                                                            <Text className="font-bold">{item.name}</Text>
                                                            <Text className="text-gray-600">{item.price}.00 LKR</Text>
                                                        </View>
                                                    </TouchableOpacity>
                                                ))}
                                            </ScrollView>
                                        ) : (
                                            <View className="flex-1 justify-center items-center"><Text className="text-gray-400">No matching items</Text></View>
                                        )}
                                    </View>
                                </View>

                                {/* Stores Section (50% Height) */}
                                <View className="flex-1 mt-2">
                                    <Text className="text-xl font-semibold mb-2">Stores ({searchResults.stores.length})</Text>
                                    <View className="flex-1 border border-gray-200 rounded-lg">
                                        {searchResults.stores.length > 0 ? (
                                            <ScrollView showsVerticalScrollIndicator={false} className="p-2">
                                                {searchResults.stores.map((shop) => (
                                                    <TouchableOpacity key={shop._id} className="flex-row items-center bg-gray-100 p-2 rounded-lg mb-2" onPress={() => { router.push(`/views/shop/${shop._id}`); setModalVisible(false) }}>
                                                        <Image className="w-14 h-14 rounded-md" source={{ uri: `data:image/jpeg;base64,${shop.image}` }} />
                                                        <View className="ml-3 flex-1">
                                                            <Text className="font-bold">{shop.name}</Text>
                                                            <Text className="text-gray-600">{shop.location}</Text>
                                                        </View>
                                                    </TouchableOpacity>
                                                ))}
                                            </ScrollView>
                                        ) : (
                                            <View className="flex-1 justify-center items-center"><Text className="text-gray-400">No matching stores</Text></View>
                                        )}
                                    </View>
                                </View>
                            </View>
                        ) : (
                            <View className="flex-1 justify-center items-center">
                                <Text className="text-lg text-gray-500">No results found.</Text>
                            </View>
                        )}

                        {/* Close Button */}
                        <TouchableOpacity className="bg-[#FEFA17] mt-4 p-3 rounded-lg" onPress={() => { setModalVisible(false); setKeyword('') }}>
                            <Text className="text-black font-semibold text-center text-base">Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </>

    )

}