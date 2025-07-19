import { View, Text, ScrollView, TouchableOpacity, Alert, TextInput, KeyboardAvoidingView, Platform, Modal } from "react-native";
import { cssInterop } from 'nativewind'
import { Image } from 'expo-image'
import { router, useLocalSearchParams } from "expo-router";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";

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
    shopId: string,
    image: string,
    name: string,
    price: number
    contact: string,
    buyCount: number

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

interface Shop {

    _id: string,
    image: string,
    location: string,
    phone: string,
    stars: number,
    name: string


}

interface MyToken {
    sub: string;
    roles: string[];
    username: string;
    email: string;
    id: string
}

// (Shop interface would likely be here, but using the single `shop` object for now)

export default function ShopDetailScreen() {

    const { id } = useLocalSearchParams()

    const [selectedStars, setSelectedStars] = useState<number[]>([]);
    const [review, setReview] = useState('');
    const [items, setItems] = useState<Item[]>([]);
    const [rev, setRev] = useState<Review[]>([])
    const [shop, setShop] = useState<Shop | null>(null)
    const [keyword, setKeyword] = useState('');
    const [isModalVisible, setModalVisible] = useState(false);
    const [searchResults, setSearchResults] = useState<{ /* stores: Shop[], */ items: Item[] } | null>(null);

    const getReviews = async () => {

        try {

            const res = await fetch(`http://localhost:8080/traveler/shop-reviews?id=${id}`)

            if (res.ok) {

                const data = await res.json()
                //console.log(data)
                setRev(data)

            } else {

                console.log("No items found")
                setRev([])

            }

        } catch (err) {

            console.log(`Error from items getting : ${err}`)

        }

    }

    useEffect(() => {
        const getItems = async () => {

            try {

                const res = await fetch(`http://localhost:8080/traveler/shop-items?id=${id}`)

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

        const getShop = async () => {

            try {

                const res = await fetch(`http://localhost:8080/traveler/shop-get?id=${id}`)

                if (res.ok) {

                    const data = await res.json()
                    //console.log(data)
                    setShop(data)

                } else {

                    console.log("No shops found")
                    setItems([])

                }

            } catch (err) {

                console.log(`Error from shops getting : ${err}`)

            }

        }

        getShop()
        getItems();
        getReviews();
    }, [])


    // --- Mock Data ---
    /* const items: Item[] = [

        {

            id: '1',
            image: pic,
            name: 'Rope (Large)',
            price: 500,
            contact: '0771161615'

        },
        {

            id: '2',
            image: pic,
            name: 'Rain Coat',
            price: 5000,
            contact: '0786715765'

        },
        {

            id: '3',
            image: pic,
            name: 'Tent (Mini)',
            price: 90000,
            contact: '0786715765'

        },

        {

            id: '4',
            image: pic,
            name: 'Hike Shoes',
            price: 2000,
            contact: '0786715765'

        },
        {

            id: '1',
            image: pic,
            name: 'Rope (Large)',
            price: 500,
            contact: '0771161615'

        },
        {

            id: '2',
            image: pic,
            name: 'Rain Coat',
            price: 5000,
            contact: '0786715765'

        },
        {

            id: '3',
            image: pic,
            name: 'Tent (Mini)',
            price: 90000,
            contact: '0786715765'

        },

        {

            id: '4',
            image: pic,
            name: 'Hike Shoes',
            price: 2000,
            contact: '0786715765'

        }, {

            id: '1',
            image: pic,
            name: 'Rope (Large)',
            price: 500,
            contact: '0771161615'

        },
        {

            id: '2',
            image: pic,
            name: 'Rain Coat',
            price: 5000,
            contact: '0786715765'

        },
        {

            id: '3',
            image: pic,
            name: 'Tent (Mini)',
            price: 90000,
            contact: '0786715765'

        },

        {

            id: '4',
            image: pic,
            name: 'Hike Shoes',
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
        name: 'Mini Market',
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
*/
    const handleRating = (starIndex: number) => {
        const rating = starIndex + 1;
        // Allows toggling and setting a new rating
        setSelectedStars(prev => prev.length === rating ? [] : Array.from({ length: rating }, (_, i) => i));


    };

    const searching = async () => {
        if (!keyword.trim()) return;

        try {
            const res = await fetch(`http://localhost:8080/traveler/search?keyword=${encodeURIComponent(keyword)}`);
            if (res.ok) {
                const data = await res.json();
                setSearchResults(data);
            } else {
                setSearchResults({ /* stores: [], */ items: [] });
            }
        } catch (err) {
            console.log('Error from equipment search: ', err);
            setSearchResults({ /* stores: [], */ items: [] });
        }
        setModalVisible(true);
    };

    const handleReview = async () => {

        //alert(`Stars - ${selectedStars.length} Review - ${review}`)
        const keys = await AsyncStorage.getItem("token")

        if (keys) {

            const x: MyToken = jwtDecode(keys)

            const form = {
                text: review,
                stars: selectedStars.length,
                authorId: x.id,
                serviceId: id.toString()
            }

            await fetch(`http://localhost:8080/traveler/review-create`, {

                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)

            })
                .then(res => res.json())
                .then(data => { if (data) { getReviews(); } setReview(""); setSelectedStars([]) })
                .catch(err => console.log('Error from review create in store : ', err))

        } else {

            console.log('Token not found')
        }

    }

    return (
        <>
            <View className="h-full gap-10">

                <View className="h-[20%]">
                    {/* --- Header Section --- */}
                    <TouchableOpacity onPress={() => router.back()}><Text className="ml-3">Back</Text></TouchableOpacity>
                    <View className="items-center pt-10 pb-5">
                        <Text className="text-4xl font-black">{shop?.name}</Text>
                        <Text>Contact us - {shop?.phone}</Text>
                    </View>

                    {/* --- Search Bar --- */}
                    <View className="w-[80%] items-center mx-10 flex-row justify-center bg-[#d9d9d976] rounded-2xl my-5">
                        <TouchableOpacity onPress={searching} className="p-2">
                            <Image className="w-7 h-7" source={search}></Image>
                        </TouchableOpacity>
                        <TextInput className=" h-[40px] w-[250px] pl-5 text-black" placeholder="Search...." placeholderTextColor="#8E8E8E" value={keyword} onChangeText={setKeyword} />

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
                                contentContainerClassName="bg-white flex-row flex-wrap justify-center gap-12 py-1"
                                showsVerticalScrollIndicator={false}
                                nestedScrollEnabled={true}

                            >


                                {items.map((item, i) => {
                                    return (
                                        <TouchableOpacity key={i} onPress={() => alert(`Contact us - ${item.contact}`)}>
                                            <View className=" w-full">

                                                <Image
                                                    className="w-[90px] h-[130px] rounded-[23px] shadow-gray-400"
                                                    source={{ uri: `data:image/jpeg;base64,${item.image}` }}
                                                />
                                                <Text className="mt-2 text-[10px] italic text-center">
                                                    {item.name}
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
                                    contentContainerClassName=" flex-col bg-white px-2 py-3 gap-3 "
                                    showsVerticalScrollIndicator={false}
                                    nestedScrollEnabled={true}
                                >
                                    {rev.map((x, i) => (
                                        <View key={i} className="bg-gray-100 px-3 rounded-2xl">
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
                                    ))}
                                </ScrollView>
                            </View>

                            <View className="w-full ">

                                <View className="flex-row items-center">
                                    {/* <Text className="text-lg px-3 py-5">Rate {shop.name}</Text> */}
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

                                    <TextInput className=" h-[40px] w-[270px] p-3 bg-[#d9d9d976] text-black" value={review} placeholder="Type a review..." placeholderTextColor="#8E8E8E" onChangeText={setReview} />
                                    <TouchableOpacity className="" onPress={handleReview}>
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
            <Modal
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
                                                {searchResults.items.map((item) => (
                                                    <TouchableOpacity key={item.id} className="flex-row items-center bg-gray-100 p-2 rounded-lg mb-2" onPress={() => alert(`Contact us - ${item.contact}`)}>
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
                                {/* <View className="flex-1 mt-2">
                                    <Text className="text-xl font-semibold mb-2">Stores ({searchResults.stores.length})</Text>
                                    <View className="flex-1 border border-gray-200 rounded-lg">
                                        {searchResults.stores.length > 0 ? (
                                            <ScrollView showsVerticalScrollIndicator={false} className="p-2">
                                                {searchResults.stores.map((shop) => (
                                                    <TouchableOpacity key={shop._id} className="flex-row items-center bg-gray-100 p-2 rounded-lg mb-2">
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
                                </View> */}
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
    );
}