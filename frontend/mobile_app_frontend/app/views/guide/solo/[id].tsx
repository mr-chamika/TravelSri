import { useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, TouchableOpacity, ScrollView, Platform } from "react-native";
import { cssInterop } from 'nativewind'
import { Image } from 'expo-image'
import { useEffect, useState } from "react";


cssInterop(Image, { className: "style" });

const pic = require('../../../../assets/images/tabbar/towert.png')
const location = require('../../../../assets/images/tabbar/create/pin.png')
const thumbnail = require('../../../../assets/images/tabbar/create/hotel/hotelthumb.png')
const star = require('../../../../assets/images/tabbar/create/hotel/stars.png')
const back = require('../../../../assets/images/back.png')
const profile = require('../../../../assets/images/sideTabs/profile.jpg')
const tele = require('../../../../assets/images/tabbar/create/guide/telephones.png')
const globl = require('../../../../assets/images/tabbar/create/guide/global.png')
const mark = require('../../../../assets/images/mark.png')
const cross = require('../../../../assets/images/cross.png');
const xp = require('../../../../assets/images/xp.png')
const education = require('../../../../assets/images/mortarboard.png')
const certificate = require('../../../../assets/images/quality.png')
const award = require('../../../../assets/images/trophy.png')


interface Guide {
    id: string;
    firstName: string;
    lastName: string;
    title: string;
    location: string;
    experience: string;
    stars: number;
    reviewCount: number
    dailyRate: number;
    currency: string;
    pp: string;
    verified: boolean;
    identified: boolean;
    specializations: string[];
    responseTime: string;
    responseRate: string;
    description: string;
    mobileNumber: string;
    languages: string[];
    images: any[];
    bio: string,
    education: string[];
    certifications: string[];
    whyChooseMe: string[];
    tourStyles: string[];
    awards: string[];
    daysPerWeek: string[];
}


export default function Views() {

    const router = useRouter();
    const { id } = useLocalSearchParams();

    useEffect(() => {

        getItem(id)

    }, [id])

    const [item, setItem] = useState<Guide | null>(null)

    const guides: Guide[] = [
        {
            id: '1',
            firstName: "Ravi",
            lastName: "Perera",
            title: "Cultural Heritage Specialist",
            location: "Kandy",
            experience: "8 years",
            stars: 600,
            reviewCount: 156,
            dailyRate: 8500,
            currency: "LKR",
            pp: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
            verified: true,
            identified: true,
            specializations: ["Cultural Heritage", "Historical Sites", "Religious Sites"],
            responseTime: "Within 1 hour",
            responseRate: "98%",
            description: "Expert in Sri Lankan cultural heritage with deep knowledge of ancient temples and traditional practices.",
            mobileNumber: "012 3456789",
            languages: ["English", "Sinhala", "German", "French"],
            images: [pic, thumbnail, thumbnail, thumbnail, thumbnail, thumbnail],
            bio: "With over 10 years of experience exploring the ancient kingdoms of Anuradhapura and Polonnaruwa, I bring the stories of Sri Lanka's rich history to life. Join me to walk through majestic ruins, understand timeless traditions, and uncover the island's vibrant legacy, one story at a time.",
            education: ["BA in History - University of Peradeniya", "Diploma in Tourism Management"],
            certifications: ["Licensed Tourist Guide - SLTB", "Cultural Heritage Specialist", "First Aid Certified"],
            whyChooseMe: [
                "Extensive knowledge of local history and culture",
                "Fluent in 4 languages for international visitors",
                "Licensed and certified professional guide",
                "Flexible and personalized tour experiences",
                "Excellent safety record and first aid certified"
            ],
            tourStyles: ["Walking Tours", "Private Vehicle Tours", "Photography Tours", "Educational Tours", "Family-Friendly Tours"],
            awards: ["Best Local Guide 2022", "Excellence in Cultural Tourism 2021"],
            daysPerWeek: ["Monday", "Sunday", "Friday"]
        },
        {
            id: '2',
            firstName: "Priya",
            lastName: "Fernando",
            title: "City & Urban Explorer",
            location: "Colombo",
            experience: "5 years",
            stars: 100,
            reviewCount: 89,
            dailyRate: 6500,
            currency: "LKR",
            pp: "https://images.unsplash.com/photo-1494790108755-2616b612b524?w=400&h=400&fit=crop",
            verified: true,
            identified: true,
            specializations: ["City Tours", "Food & Cuisine", "Photography Tours"],
            responseTime: "Within 2 hours",
            responseRate: "95%",
            description: "Passionate about showcasing Colombo's vibrant culture, hidden gems, and diverse culinary scene.",
            mobileNumber: "078 1234567",
            languages: ["English", "Sinhala"],
            images: [pic, thumbnail, thumbnail, thumbnail, thumbnail, thumbnail],
            bio: "As a certified naturalist, my office is the untamed wilderness of Sri Lanka. From tracking leopards in Yala National Park to spotting blue whales off the coast of Mirissa, I offer an unforgettable adventure into the wild heart of the island for nature lovers and thrill-seekers alike.",
            education: ["BA in History - University of Peradeniya", "Diploma in Tourism Management"],
            certifications: ["Licensed Tourist Guide - SLTB", "Cultural Heritage Specialist", "First Aid Certified"],
            whyChooseMe: [
                "Extensive knowledge of local history and culture",
                "Fluent in 4 languages for international visitors",
                "Licensed and certified professional guide",
                "Flexible and personalized tour experiences",
                "Excellent safety record and first aid certified"
            ],
            tourStyles: ["Walking Tours", "Private Vehicle Tours", "Photography Tours", "Educational Tours", "Family-Friendly Tours"],
            awards: ["Best Local Guide 2022", "Excellence in Cultural Tourism 2021"],
            daysPerWeek: ["Monday", "Sunday", "Friday"]
        },
        {
            id: '3',
            firstName: "Samantha",
            lastName: "Silva",
            title: "Wildlife & Adventure Guide",
            location: "Yala",
            experience: "12 years",
            stars: 900,
            reviewCount: 203,
            dailyRate: 12000,
            currency: "LKR",
            pp: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
            verified: true,
            identified: false,
            specializations: ["Nature & Wildlife", "Adventure Tours"],
            responseTime: "Within 30 minutes",
            responseRate: "99%",
            description: "Experienced wildlife guide with extensive knowledge of Sri Lankan fauna and conservation efforts.",
            mobileNumber: "076 1234567",
            languages: ["English", "Sinhala", "French"],
            images: [pic, thumbnail, thumbnail, thumbnail, thumbnail, thumbnail],
            bio: "They say the best way to know a country is through its food. I'll take you on a flavorful journey through bustling local markets and family kitchens, where you'll taste authentic curries, learn the secret of a perfect hopper, and explore the island's world-famous spices.",
            education: ["BA in History - University of Peradeniya", "Diploma in Tourism Management"],
            certifications: ["Licensed Tourist Guide - SLTB", "Cultural Heritage Specialist", "First Aid Certified"],
            whyChooseMe: [
                "Extensive knowledge of local history and culture",
                "Fluent in 4 languages for international visitors",
                "Licensed and certified professional guide",
                "Flexible and personalized tour experiences",
                "Excellent safety record and first aid certified"
            ],
            tourStyles: ["Walking Tours", "Private Vehicle Tours", "Photography Tours", "Educational Tours", "Family-Friendly Tours"],
            awards: ["Best Local Guide 2022", "Excellence in Cultural Tourism 2021"],
            daysPerWeek: ["Monday", "Sunday", "Friday"]

        },
        {
            id: '4',
            firstName: "Kamala",
            lastName: "Wijesinghe",
            title: "Culinary Arts Expert",
            location: "Galle",
            experience: "6 years",
            stars: 250,
            reviewCount: 74,
            dailyRate: 7500,
            currency: "LKR",
            pp: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
            verified: false,
            identified: true,
            specializations: ["Food & Cuisine", "Cultural Heritage"],
            responseTime: "Within 3 hours",
            responseRate: "92%",
            description: "Culinary expert specializing in traditional Sri Lankan cuisine and cooking techniques.",
            mobileNumber: "075 1234567",
            languages: ["Sinhala", "German"],
            images: [pic, thumbnail, thumbnail, thumbnail, thumbnail, thumbnail],
            bio: "If you're looking to escape the crowds, I'm your guide. Let's conquer the misty trails of the Knuckles Mountain Range, chase hidden waterfalls in Ella, or discover remote tea villages. I specialize in crafting unique trekking adventures that show you a side of Sri Lanka most people never see.",
            education: ["BA in History - University of Peradeniya", "Diploma in Tourism Management"],
            certifications: ["Licensed Tourist Guide - SLTB", "Cultural Heritage Specialist", "First Aid Certified"],
            whyChooseMe: [
                "Extensive knowledge of local history and culture",
                "Fluent in 4 languages for international visitors",
                "Licensed and certified professional guide",
                "Flexible and personalized tour experiences",
                "Excellent safety record and first aid certified"
            ],
            tourStyles: ["Walking Tours", "Private Vehicle Tours", "Photography Tours", "Educational Tours", "Family-Friendly Tours"],
            awards: ["Best Local Guide 2022", "Excellence in Cultural Tourism 2021"],
            daysPerWeek: ["Monday", "Sunday", "Friday"]
        }
    ];

    const reviewers = [
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
    ]
    /* const groupCollection = [
        {
            id: '1',
            image: profile,
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
            langs: ['sinhala', 'English', 'French', 'Mexican', 'Tamil', 'Japan'],
            ys: [pic, thumbnail, thumbnail, thumbnail, thumbnail, thumbnail]

        },
        // { id: '2', image: bg, title: 'Galle to Kurunegala', duration: 1, date: '05 july 2021', stats: 'Pending', price: 2300, max: 10, current: 13, routes: [{ place: 'peradeniya Botnical Garden', images: g }, { place: 'Sri Dalada Maligawa', images: l }, { place: 'Kandy Lake Round', images: te }] },
        // { id: '3', image: t, title: 'Colombo to jaffna', duration: 4, date: '06 aug 2022', stats: 'Cancelled', price: 1500, max: 25, current: 10, routes: [{ place: 'peradeniya Botnical Garden', images: g }, { place: 'Sri Dalada Maligawa', images: l }, { place: 'Kandy Lake Round', images: te }] },
        // { id: '4', image: pic, title: 'Matara to Kandy', duration: 10, date: '07 sept 2023', stats: 'Pending', price: 9000, max: 10, current: 4, routes: [{ place: 'peradeniya Botnical Garden', images: g }, { place: 'Sri Dalada Maligawa', images: l }, { place: 'Kandy Lake Round', images: te }] },
        // { id: '5', image: bg, title: 'Galle to Dehiwala', duration: 2, date: '08 oct 2024', stats: 'Pending', price: 1800, max: 15, current: 10, routes: [{ place: 'peradeniya Botnical Garden', images: g }, { place: 'Sri Dalada Maligawa', images: l }, { place: 'Kandy Lake Round', images: te }] },
        // { id: '6', image: t, title: 'Matale to Rajarata', duration: 6, date: '09 nov 2025', stats: 'Confirm', price: 700, max: 30, current: 24, routes: [{ place: 'peradeniya Botnical Garden', images: g }, { place: 'Sri Dalada Maligawa', images: l }, { place: 'Kandy Lake Round', images: te }] },

    ];
 */
    const getItem = (Id: string | string[]) => {
        guides.map((collection, i) => {
            if (collection.id == Id) {
                setItem(collection)
            }
        })
    }

    const rating = item && item.reviewCount > 0
        ? parseFloat(((item?.stars / item?.reviewCount) * 2).toFixed(1))
        : 0;

    const route = item?.title.split(" ");

    return (

        <View className={`${Platform.OS === 'web' ? 'h-screen overflow-auto' : 'h-full'}`}>


            <TouchableOpacity className="pl-3" onPress={() => router.back()}><Text>Back</Text></TouchableOpacity>

            <ScrollView

                className="w-full h-[97%]"
                contentContainerClassName="flex-col py-5"
                showsVerticalScrollIndicator={false}

            >
                <View className="w-full justify-between">
                    <View className="w-full gap-5 mb-4">
                        <View className="bg-white pb-2  px-3 py-2">
                            <View className="w-full flex-row mb-2 gap-5">
                                {/* Guide Image and Basic Info */}
                                <Image source={item?.pp} className='w-20 h-20 rounded-full' />

                                <View className="flex-1">

                                    <View className="flex-col items-start mb-1 ml-1 space-y-2">
                                        <Text className="text-lg font-semibold text-gray-800 flex-1">{`${item?.firstName} ${item?.lastName}`}</Text>
                                        <Text className="text-sm text-gray-500 mb-1">{item?.title}</Text>
                                        <View className='w-[90%] flex-row justify-between'>
                                            <View className='gap-1 flex-row items-center'>
                                                <Image className='w-4 h-4' source={item?.verified ? tele : cross}></Image>
                                                <Text className="text-sm">Phone Verified</Text>
                                            </View>
                                            <View className='gap-1 flex-row items-center'>
                                                <Image className='w-4 h-4' source={item?.identified ? mark : cross}></Image>
                                                <Text className="text-sm">Identity Verified</Text>
                                            </View>

                                        </View>
                                        {/* <TouchableOpacity 
                            className="p-1"
                            onPress={(e) => {
                                e.stopPropagation();
                                toggleFavorite(guide.id);
                            }}
                        >
                            <Icon 
                                name={favorites.includes(guide.id) ? "heart-filled" : "heart"} 
                                size={20} 
                                color={favorites.includes(guide.id) ? "#dc2626" : "#6b7280"} 
                            />
                        </TouchableOpacity> */}
                                    </View>
                                    <View className="flex-row justify-between mb-2">
                                        <View className="flex-row items-center gap-1 flex-1">
                                            <Image source={location} className='w-5 h-5' />
                                            <Text className="text-xs text-gray-600">{item?.location}</Text>
                                        </View>
                                        <View className="flex-row items-center gap-1 flex-1">
                                            <Image source={xp} className='w-5 h-5' />
                                            <Text className="text-xs text-gray-600">{item?.experience} experience</Text>
                                        </View>
                                    </View>

                                    {/* Rating and Response */}
                                    <View className="w-[92%] flex-row items-center justify-between">
                                        <View className="flex-row items-center gap-1">
                                            <View className={`rounded px-1.5 py-0.5 ${rating >= 9 ? 'bg-green-500' :
                                                rating >= 8 ? 'bg-emerald-400' :
                                                    rating >= 7 ? 'bg-yellow-400' :
                                                        rating >= 5 ? 'bg-orange-400' :
                                                            'bg-red-500'
                                                }`}>
                                                <Text className="text-white text-xs font-semibold">{rating}</Text>
                                            </View>
                                            {/* <View className="flex-row">
                                                            {renderStars(guide.rating)}
                                                        </View> */}
                                            <Text className="text-[10px] text-gray-500">({item?.reviewCount} Reviews)</Text>
                                        </View>

                                        <View className="items-end">
                                            <Text className="text-[10px] text-green-500 font-medium">{item?.responseTime}</Text>
                                            <Text className="text-[10px] text-gray-500">{item?.responseRate} response rate</Text>
                                        </View>
                                    </View>
                                </View>

                                {/* <View className='w-[90%] gap-2 flex-row my-3 items-center'>
                                <Image className='w-5 h-5' source={globl}></Image>
                                <View className="flex-row gap-3 px-4">
                                    {

                                        item?.languages.map((lan, i) => {
                                            return (

                                                <Text key={i} className="text-sm font-light">{lan}</Text>

                                            );
                                        })

                                    }
                                </View>

                            </View>
                            <View className='w-[90%] gap-6 flex-row'>
                                <Image className='w-5 h-5' source={location} />
                                <Text className="text-md font-light">{item?.location}</Text>
                            </View>*/}

                            </View>

                            <View className="w-full pt-2 flex-row justify-between px-2 border-t border-gray-300">

                                <View>

                                    <Text className="text-lg font-bold self-center">{reviewers.length}</Text>
                                    <Text className="text-sm text-gray-500">Reviews</Text>

                                </View>

                                <View>

                                    <Text className="text-lg font-bold self-center">{item?.experience}</Text>
                                    <Text className="text-sm text-gray-500">Experience</Text>

                                </View>
                                <View>

                                    <Text className="text-lg font-bold self-center">{item?.languages.length}</Text>
                                    <Text className="text-sm text-gray-500">Languages</Text>

                                </View>
                                <View>

                                    <Text className="text-lg font-bold self-center">{item?.specializations.length}</Text>
                                    <Text className="text-sm text-gray-500">Specializations</Text>

                                </View>


                            </View>
                        </View>

                        <View className="bg-white mx-4 my-2 p-4 rounded-lg shadow-md">
                            <Text className="text-lg font-semibold text-gray-800 mb-4">Available Days</Text>
                            <View className="flex-row flex-wrap gap-2">
                                {item?.daysPerWeek.map((day, index) => (
                                    <View key={index} className="flex-row items-center bg-orange-50 px-3 py-1.5 rounded-full border border-orange-200 gap-1.5">
                                        <Text className="text-sm text-orange-600 font-medium">{day}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                        <View className="bg-white mx-4 my-2 p-4 rounded-lg shadow-md">
                            <Text className="text-lg font-semibold text-gray-800 mb-4">Languages</Text>
                            <View className="flex-row flex-wrap gap-2">
                                {item?.languages.map((language, index) => (
                                    <View key={index} className="flex-row items-center bg-blue-50 px-3 py-1.5 rounded-full border border-blue-200 gap-1.5">
                                        <Image source={globl} className="w-5 h-5" />
                                        <Text className="text-sm text-blue-600 font-medium">{language}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>

                        <View className=" bg-white rounded-lg shadow-md m-1 px-2 pb-10 mx-5">
                            <Text className=" text-2xl font-semibold py-1">Photos</Text>


                            <View className="w-full items-center">
                                <ScrollView
                                    horizontal
                                    className="w-[80%] h-50 border-gray-200 rounded-2xl"
                                    contentContainerClassName="flex-row gap-1"
                                    showsHorizontalScrollIndicator={false}
                                    nestedScrollEnabled={true}

                                >
                                    {item?.images.map((x, i) => {

                                        return (

                                            <View key={i} className="flex-row w-[310px] h-40">

                                                <Image className=" w-[310px] h-full" source={x} />

                                            </View>
                                        )
                                    })

                                    }
                                </ScrollView>

                            </View>

                        </View>

                        <View className="gap-5 px-3">
                            <View className=" bg-white rounded-lg shadow-md m-1 px-2">
                                <Text className=" text-2xl font-semibold py-1">About Me</Text>
                                <Text className="px-3 my-2 text-sm italic text-justify text-gray-500 font-semibold">{item?.description}</Text>
                            </View>

                            <View className="bg-white mx- my-2 p-4 rounded-lg shadow-md">
                                <Text className="text-lg font-semibold text-gray-800 mb-4">Specializations</Text>
                                <View className="flex-row flex-wrap gap-2">
                                    {item?.specializations.map((language, index) => (
                                        <View key={index} className="flex-row items-center bg-yellow-50 px-3 py-1.5 rounded-full border border-yellow-200 gap-1.5">
                                            <Text className="text-sm text-blue-600 font-medium">{language}</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>

                            <View className="bg-white mx-1 my-2 p-4 rounded-lg shadow-md">
                                <Text className="text-lg font-semibold text-gray-800 mb-4">Why Choose Me</Text>
                                <View className="space-y-3">
                                    {item?.whyChooseMe.map((reason, index) => (
                                        <View key={index} className="flex-row items-center gap-3">
                                            <Image source={mark} className="w-3 h-3" />
                                            <Text className="text-sm text-gray-600 flex-1 leading-snug">{reason}</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>

                            {(item?.education || item?.certifications || item?.awards) && (<View className="bg-white mx-1 my-2 p-4 rounded-lg shadow-md">
                                <Text className="text-lg font-semibold text-gray-800 mb-4">Education & Certifications</Text>

                                <View className="space-y-5">
                                    {/* Education Group */}
                                    {item.education && (<View>
                                        <View className="flex-row items-center gap-2 mb-1">
                                            <Image source={education} className="w-3 h-3" />
                                            <Text className="text-base font-semibold text-gray-800">Education</Text>
                                        </View>
                                        {item?.education.map((edu, index) => (
                                            <Text key={index} className=" text-sm text-gray-600 ml-8 leading-snug">* {edu}</Text>
                                        ))}
                                    </View>)}

                                    {/* Certifications Group */}
                                    {item.certifications && (<View>
                                        <View className="flex-row items-center gap-2 mb-1">
                                            <Image source={certificate} className="w-3 h-3" />
                                            <Text className="text-base font-semibold text-gray-800">Certifications</Text>
                                        </View>
                                        {item?.certifications.map((cert, index) => (
                                            <Text key={index} className="text-sm text-gray-600 ml-8 leading-snug">* {cert}</Text>
                                        ))}
                                    </View>)}

                                    {/* Awards Group */}
                                    {item.awards && (<View>
                                        <View className="flex-row items-center gap-2 mb-1">
                                            <Image source={award} className="w-3 h-3" />
                                            <Text className="text-base font-semibold text-gray-800">Awards</Text>
                                        </View>
                                        {item?.awards.map((award, index) => (
                                            <Text key={index} className="text-sm text-gray-600 ml-8 leading-snug">* {award}</Text>
                                        ))}
                                    </View>)}
                                </View>
                            </View>)}

                            {item?.tourStyles && (<View className="bg-white mx-1 my-2 p-4 rounded-lg shadow-md">
                                <Text className="text-lg font-semibold text-gray-800 mb-4">Tour Styles</Text>
                                <View className="flex-row flex-wrap gap-2">
                                    {item?.tourStyles.map((style, index) => (
                                        <View key={index} className="bg-green-50 px-3 py-1.5 rounded-full border border-green-200">
                                            <Text className="text-sm text-green-700 font-medium">{style}</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>)}

                            <View className=" bg-white rounded-lg shadow-md m-1 px-2">
                                <View className="w-[35%] flex-row justify-between">
                                    <Text className=" text-2xl font-semibold py-1">Reviews</Text>
                                    {/* <View className="flex-row items-center">
                                    <Image className="w-5 h-5" source={star} />
                                    <Text>{item.stars}/5</Text>
                                </View> */}
                                </View>
                                <View>
                                    <ScrollView

                                        className="w-full h-72 rounded-2xl mx-2 mb-2"
                                        contentContainerClassName=" flex-col px-2 py-3 gap-5 "
                                        showsVerticalScrollIndicator={false}
                                        nestedScrollEnabled={true}

                                    >
                                        {reviewers.map((x, i) => {

                                            return (

                                                <View key={i} className="bg-gray-200 px-3 rounded-2xl">
                                                    <View className="flex-row items-center">
                                                        <Image className="w-10 h-10 rounded-full" source={x.images} />
                                                        <Text className="px-3 text-justify my-5 text-gray-500 font-semibold">{x.name} from {x.from}</Text>
                                                        <View className="flex-row items-center gap-1">
                                                            <Image className="w-5 h-5" source={star} />
                                                            <Text>{x.stars}/5</Text>
                                                        </View>
                                                    </View>
                                                    <Text className="text-lg mx-5 my-2">{x.review}</Text>

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

                        <Text className="px-3 font-extrabold text-xl">{item?.dailyRate}.00 LKR/day</Text>

                        <TouchableOpacity className=" bg-[#84848460] rounded-xl w-[30%]" onPress={() => router.replace(`/views/payment/${item?.id}`)}>
                            <View className="py-2 px-3 flex-row justify-between items-center w-full">
                                <Text>Book Now</Text>
                                <Image className="w-5 h-5" source={back} />
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>

            </ScrollView>
        </View>

    )

}