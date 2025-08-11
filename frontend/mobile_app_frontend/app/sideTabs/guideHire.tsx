import { Text, View, ScrollView, TouchableOpacity, KeyboardAvoidingView, Modal, TextInput, Platform } from 'react-native';
import { useState, useCallback, useMemo } from 'react';
import { Calendar } from 'react-native-calendars';
import { cssInterop } from 'nativewind';
import { Image } from 'expo-image';
import { useRouter, useFocusEffect } from 'expo-router';
import { Phone } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

cssInterop(Image, { className: "style" });

const router = useRouter();

const cross = require('../../assets/images/cross.png');
const mark = require('../../assets/images/tabbar/create/location/mark.png');
const pic = require('../../assets/images/tabbar/create/location/h.png');
const star = require('../../assets/images/tabbar/create/hotel/stars.png');
const tele = require('../../assets/images/tabbar/create/guide/telephones.png')
const pin = require('../../assets/images/tabbar/create/pin.png')
const xp = require('../../assets/images/xp.png')

/* interface Guide {
    id: strin'g';
    pp: any;
    description: string;
    stars: number;
    verified: boolean;
    identified:true,
    identified: boolean

} */
interface Guide {
    _id: string;
    firstName: string;
    lastName: string;
    description: string;
    location: string;
    experience: string;
    stars: number;
    reviewCount: number
    dailyRate: number;
    pp: string;
    verified: boolean;
    identified: boolean;
    specializations: string[];
    responseTime: string;
    responseRate: string;
    bio: string;
    mobileNumber: string
}

interface BookingDetails {
    dates: string[];
    destination: string;
    type: string;
    language: string;
}

/* const guides: Guide[] = [
    {
        id: '1',
        firstName: "Ravi",
        lastName: "Perera",
        description: "Cultural Heritage Specialist",
        location: "Kandy",
        experience: "8 years",
        stars: 600,
        reviewCount: 156,
        dailyRate: 8500,
        pp: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
        verified: true,
        identified: true,
        specializations: ["Cultural Heritage", "Historical Sites", "Religious Sites"],
        responseTime: "Within 1 hour",
        responseRate: "98",
        bio: "Expert in Sri Lankan cultural heritage with deep knowledge of ancient temples and traditional practices.",
        mobileNumber: "012 3456789"

    },
    {
        id: '2',
        firstName: "Priya",
        lastName: "Fernando",
        description: "City & Urban Explorer",
        location: "Colombo",
        experience: "5 years",
        stars: 100,
        reviewCount: 89,
        dailyRate: 6500,
        pp: "https://images.unsplash.com/photo-1494790108755-2616b612b524?w=400&h=400&fit=crop",
        verified: true,
        identified: true,
        specializations: ["City Tours", "Food & Cuisine", "Photography Tours"],
        responseTime: "Within 2 hours",
        responseRate: "95",
        bio: "Passionate about showcasing Colombo's vibrant culture, hidden gems, and diverse culinary scene.",
        mobileNumber: "078 1234567"
    },
    {
        id: '3',
        firstName: "Samantha",
        lastName: "Silva",
        description: "Wildlife & Adventure Guide",
        location: "Yala",
        experience: "12 years",
        stars: 900,
        reviewCount: 203,
        dailyRate: 12000,
        pp: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
        verified: true,
        identified: false,
        specializations: ["Nature & Wildlife", "Adventure Tours"],
        responseTime: "Within 30 minutes",
        responseRate: "99",
        bio: "Experienced wildlife guide with extensive knowledge of Sri Lankan fauna and conservation efforts.",
        mobileNumber: "076 1234567"
    },
    {
        id: '4',
        firstName: "Kamala",
        lastName: "Wijesinghe",
        description: "Culinary Arts Expert",
        location: "Galle",
        experience: "6 years",
        stars: 250,
        reviewCount: 74,
        dailyRate: 7500,
        pp: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
        verified: false,
        identified: true,
        specializations: ["Food & Cuisine", "Cultural Heritage"],
        responseTime: "Within 3 hours",
        responseRate: "92",
        bio: "Culinary expert specializing in traditional Sri Lankan cuisine and cooking techniques.",
        mobileNumber: "075 1234567"
    }
];
 */

export default function Guide() {

    const [selectedDates, setSelectedDates] = useState<string[]>([]);
    const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(null);
    const [isModalVisible, setModalVisible] = useState(true);
    const [fine, setFine] = useState(false);
    const [lan, setLan] = useState('');

    const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);
    const [guides, setGuides] = useState<Guide[]>([])
    const [guidesS, setGuidesS] = useState<Guide[]>([])

    const [destination, setDestination] = useState('');
    const [bookingType, setBookingType] = useState('visit')

    const onDayPress = (day: { dateString: string }) => {
        const date = day.dateString;
        setSelectedDates((currentDates) => {
            if (currentDates.includes(date)) {
                // If the date is already in the array, remove it
                return currentDates.filter((d) => d !== date);
            } else {
                // Otherwise, add the new date to the array
                return [...currentDates, date];
            }
        });
    };

    const handleSubmit = async () => {

        try {
            if (selectedDates.length === 0 || !destination.trim() || !lan.trim()) {
                alert('Please fill in all fields.');
                return;
            }

            const book: BookingDetails = {
                dates: selectedDates,
                destination: destination,
                type: bookingType,
                language: lan
            };

            setBookingDetails(book);
            setModalVisible(false);
            setFine(true)

            await AsyncStorage.setItem('soloGuideBook', JSON.stringify(book));

            const res = await fetch(`http://localhost:8080/traveler/guides-all?location=${destination.trim().toLowerCase()}&language=${lan.trim().toLowerCase()}`)

            if (res.ok) {

                const data = await res.json();

                //console.log(data);
                setGuides(data)

            } else {

                console.log(await res.text());
                setGuides([])
                const res1 = await fetch(`http://localhost:8080/traveler/guide-all`)

                if (res1) {

                    const data1 = await res1.json()

                    //console.log(data1)
                    setGuidesS(data1)

                }


            }

        } catch (err) {

            console.log(err)

        }

    };

    const displayDates = selectedDates
        .sort()
        .map(date => new Date(date).toDateString())
        .join(', ');

    useFocusEffect(
        useCallback(() => {
            if (Object.keys(selectedDates).length === 0) {
                setModalVisible(true);
            }
        }, [selectedDates])
    );

    const markedDates = useMemo(() => {
        return selectedDates.reduce((acc, date) => {
            acc[date] = { selected: true, selectedColor: '#007BFF' };
            return acc;
        }, {} as { [key: string]: { selected: boolean; selectedColor: string } });
    }, [selectedDates]);

    return (
        <View className={`${Platform.OS === 'web' ? 'h-screen overflow-auto' : 'h-full'}`}>
            <View className='bg-[#F2F5FA] h-full'>
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={isModalVisible}
                    onRequestClose={() => {
                        if (selectedDates.length === 0) return;
                        setModalVisible(false);
                    }}
                >
                    <View className="flex-1 justify-center items-center bg-black/60">
                        {/* 1. Add KeyboardAvoidingView to wrap the entire modal card */}
                        <KeyboardAvoidingView
                            behavior={Platform.OS === "ios" ? "padding" : "height"}
                            className="w-[93%] h-[97%]"
                        >
                            <View className="flex-1 bg-white rounded-2xl">
                                {/* Header */}
                                <View className="p-4 border-gray-200">
                                    <TouchableOpacity onPress={() => { setModalVisible(false); if (!fine || selectedDates.length === 0) router.back(); }}>
                                        <Text>{(fine && selectedDates.length !== 0) ? "Cancel" : "Back"}</Text>
                                    </TouchableOpacity>
                                    <Text className="text-xl font-bold mt-2 text-center">Guide Booking</Text>
                                </View>

                                {/* 2. Add a ScrollView to contain all the form elements */}
                                <ScrollView
                                    className="flex-1"
                                    contentContainerClassName="pt-4 px-4"
                                    keyboardShouldPersistTaps="handled"
                                >
                                    <View className='h-full'>
                                        <Text className="text-base font-medium text-gray-700 mb-2">Select Dates</Text>
                                        {/* Calendar */}
                                        <View className='mb-3 border border-gray-300 rounded-xl ml-3'>
                                            <Calendar
                                                onDayPress={onDayPress}
                                                markedDates={markedDates}
                                                minDate={new Date().toISOString().split('T')[0]}
                                                theme={{
                                                    todayTextColor: '#007BFF',
                                                    arrowColor: '#007BFF',
                                                }}
                                            />
                                        </View>

                                        {/* Destination Input */}
                                        <View className='mb-3'>
                                            <Text className="text-base font-medium text-gray-700 mb-2">Destination or Place</Text>
                                            <TextInput
                                                placeholder="Galle"
                                                value={destination}
                                                onChangeText={setDestination}
                                                className="text-black border border-gray-300 rounded-xl px-4 ml-3 py-3 text-base"
                                            />
                                        </View>

                                        {/* Language Input */}
                                        <View className='mb-3'>
                                            <Text className="text-base font-medium text-gray-700 mb-2">Preferred Language</Text>
                                            <TextInput
                                                placeholder="sinhala"
                                                value={lan} // Use your new 'language' state
                                                onChangeText={setLan} // And 'setLanguage' setter
                                                className="text-black border ml-3 border-gray-300 rounded-xl px-4 py-3 text-base"
                                            />
                                        </View>

                                        {/* Booking Type Radio Buttons */}
                                        <View>
                                            <Text className="text-base font-medium text-gray-700 mb-3">Booking Type</Text>
                                            <View className="gap-2 ml-3">
                                                {/* Option 1 */}
                                                <TouchableOpacity
                                                    className="flex-row items-center"
                                                    onPress={() => setBookingType('visit')}
                                                >
                                                    <View className={`w-6 h-6 rounded-full border-2 justify-center items-center mr-3 ${bookingType === 'visit' ? 'border-blue-500' : 'border-gray-400'}`}>
                                                        {bookingType === 'visit' && <View className="w-3 h-3 rounded-full bg-blue-500" />}
                                                    </View>
                                                    <Text className="text-base text-gray-800">Guide for a place to visit</Text>
                                                </TouchableOpacity>

                                                {/* Option 2 */}
                                                <TouchableOpacity
                                                    className="flex-row items-center"
                                                    onPress={() => setBookingType('travel')}
                                                >
                                                    <View className={`w-6 h-6 rounded-full border-2 justify-center items-center mr-3 ${bookingType === 'travel' ? 'border-blue-500' : 'border-gray-400'}`}>
                                                        {bookingType === 'travel' && <View className="w-3 h-3 rounded-full bg-blue-500" />}
                                                    </View>
                                                    <Text className="text-base text-gray-800">Guide to travel with you</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View>
                                </ScrollView>

                                {/* Submit Button Footer */}
                                <View className="p-4 border-gray-200">
                                    <TouchableOpacity
                                        onPress={handleSubmit}
                                        className="bg-[#FEFA17] py-3 rounded-xl"
                                    >
                                        <Text className="text-black text-center font-semibold">Submit</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </KeyboardAvoidingView>
                    </View>
                </Modal>

                {Object.keys(selectedDates).length > 0 && (
                    <>
                        <View>
                            <View className="flex-row justify-between items-center p-4">
                                <Text className="text-lg font-medium">{displayDates}</Text>
                                <TouchableOpacity onPress={() => setModalVisible(true)} className="bg-gray-200 py-2 px-4 rounded-lg">
                                    <Text className="font-semibold text-blue-600">Change</Text>
                                </TouchableOpacity>
                            </View>
                            {bookingDetails && (
                                <View className="bg-white rounded-lg p-4 mx-4 mb-2 shadow">
                                    <View className="justify-between flex-row">
                                        <View>
                                            <Text className="text-sm text-gray-500">Destination</Text>
                                            <Text className="text-base font-semibold text-gray-800">{bookingDetails.destination}</Text>
                                        </View>
                                        <View>
                                            <Text className="text-sm text-gray-500">Booking Type</Text>
                                            <Text className="text-base font-semibold text-gray-800 capitalize">
                                                {bookingDetails.type === 'visit' ? 'Place Visit' : 'Travel Along'}
                                            </Text>
                                        </View>
                                        <View>
                                            <Text className="text-sm text-gray-500">Language</Text>
                                            <Text className="text-base font-semibold text-gray-800">{bookingDetails.language}</Text>
                                        </View>
                                    </View>
                                </View>
                            )}
                        </View>
                        {/* <View className="px-4 space-y-1">
                            <Text className="text-sm">📍 Location: {location}</Text>
                            <Text className="text-sm">👤 Adults: {adults}</Text>
                            <Text className="text-sm">🧒 Children: {children}</Text>
                            <Text className="text-sm">🌙 Nights: {nights}</Text>
                        </View> */}
                        {/* 
{guides.map((x, index) => (
                                    <View key={index} className="bg-[#fbfbfb] w-[175px] h-[155px] py-1 rounded-2xl border-2 border-gray-300">

                                        <TouchableOpacity onPress={() => router.push(`/views/guide/solo/${x.id}`)}>
                                            <View className='h-full py-3 justify-between'>

                                                <View className="w-full absolute items-end pr-1 z-10">
                                                    <TouchableOpacity
                                                        className="justify-center items-center w-6 h-6 rounded-full bg-gray-200"
                                                        onPress={() => toggleCardSelection(index)}
                                                    >
                                                        {selectedCardIndex === index && (
                                                            <Image className='w-4 h-4' source={mark} />
                                                        )}
                                                    </TouchableOpacity>
                                                </View>
                                                <View className='flex-row gap-5 px-3  w-44'>
                                                    <Image
                                                        className=' w-[50px] h-[50px] rounded-full'
                                                        source={x.image}
                                                        contentFit="cover"
                                                    />
                                                    <View className=''>
                                                        <Text className="text-md font-semibold w-24 max-h-12 pt-2">{x.description}</Text>
                                                        <View className="flex-row justify-start mt-1">
                                                            {[...Array(x.stars)].map((_, i) => (
                                                                <Image key={i} className="w-3 h-3 mx-0.5" source={star} />
                                                            ))}
                                                        </View>
                                                    </View>

                                                </View>
                                                <View className='w-full mt-4 gap-2'>
                                                    <View className='gap-6 flex-row w-full  pl-5'>
                                                        <Image className='w-5 h-5' source={tele}></Image>
                                                        <Text className="text-md">Phone Verified</Text>
                                                    </View>
                                                    <View className='gap-6 flex-row w-full pl-5'>
                                                        <Image className='w-5 h-5' source={mark}></Image>
                                                        <Text className="text-">Identify Verified</Text>
                                                    </View>

                                                </View>
                                                {/* <TouchableOpacity
                                            className='mt-3 rounded-lg w-[90%] h-6 bg-[#FEFA17] self-center'
                                            onPress={() => alert('mn guide')}
                                        >
                                            <Text className='text-center font-semibold'>View</Text>

                                        </TouchableOpacity>

                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                )
                                )
                                } */}


                        <ScrollView
                            className="flex-1"
                            showsVerticalScrollIndicator={false}>

                            {guides.length == 0 &&
                                <View>

                                    <View className="p-10 bg-red-200 w-full flex-1 justify-center items-center">
                                        <Text>No results found</Text>
                                    </View>
                                    <View>
                                        <Text className="self-start p-3 text-xl font-semibold">Suggested Guides</Text>
                                        {guidesS.map((guide) => {

                                            const rating = guide.reviewCount > 0
                                                ? parseFloat(((guide.stars / guide.reviewCount) * 2).toFixed(1))
                                                : 0;

                                            return (
                                                <TouchableOpacity
                                                    key={guide._id}
                                                    className={`bg-white mx-4 my-2 rounded-lg border p-4 shadow-sm border-gray-100`}
                                                    onPress={() => router.push(`/views/guide/solo/${guide._id}`)}
                                                    activeOpacity={0.7}
                                                >
                                                    {/* Guide Header */}
                                                    <View className="flex-row mb-2 gap-2">
                                                        {/* Guide Image and Basic Info */}
                                                        <Image source={{ uri: `data:image/jpeg;base64,${guide.pp}` }} className='w-20 h-20 rounded-full' />

                                                        <View className="flex-1">

                                                            <View className="flex-col items-start mb-1 ml-1">
                                                                <Text className="text-lg font-semibold text-gray-800 flex-1">{`${guide.firstName} ${guide.lastName}`}</Text>
                                                                <Text className="text-sm text-gray-500 mb-1">{guide.description}</Text>
                                                                <View className='w-[96%] flex-row justify-between'>
                                                                    <View className='gap-1 flex-row items-center'>
                                                                        <Image className='w-4 h-4' source={guide.verified ? tele : cross}></Image>
                                                                        <Text className="text-sm">Phone Verified</Text>
                                                                    </View>
                                                                    <View className='gap-1 flex-row items-center'>
                                                                        <Image className='w-4 h-4' source={guide.identified ? mark : cross}></Image>
                                                                        <Text className="text-sm">Identity Verified</Text>
                                                                    </View>

                                                                </View>

                                                            </View>
                                                            <View className="flex-row justify-between mb-2">
                                                                <View className="flex-row items-center gap-1 flex-1">
                                                                    <Image source={pin} className='w-5 h-5' />
                                                                    <Text className="text-xs text-gray-600">{guide.location}</Text>
                                                                </View>
                                                                <View className="flex-row items-center gap-1 flex-1">
                                                                    <Image source={xp} className='w-5 h-5' />
                                                                    <Text className="text-xs text-gray-600">{guide.experience} experience</Text>
                                                                </View>
                                                            </View>

                                                            <View className="flex-row items-center justify-between">
                                                                <View className="flex-row items-center gap-1">
                                                                    <View className={`rounded px-1.5 py-0.5 ${rating >= 9 ? 'bg-green-500' :
                                                                        rating >= 8 ? 'bg-emerald-400' :
                                                                            rating >= 7 ? 'bg-yellow-400' :
                                                                                rating >= 5 ? 'bg-orange-400' :
                                                                                    'bg-red-500'
                                                                        }`}>
                                                                        <Text className="text-white text-xs font-semibold">{rating}</Text>
                                                                    </View>

                                                                    <Text className="text-[10px] text-gray-500">({guide.reviewCount} Reviews)</Text>
                                                                </View>

                                                                <View className="items-end">
                                                                    <Text className="text-[10px] text-green-500 font-medium">{guide.responseTime}</Text>
                                                                    <Text className="text-[10px] text-gray-500">{guide.responseRate}% response rate</Text>
                                                                </View>
                                                            </View>
                                                        </View>
                                                    </View>

                                                    <View className="mb-3">
                                                        <Text className="text-xs font-semibold text-gray-700 mb-1.5">Specializations:</Text>
                                                        <View className="flex-row flex-wrap gap-1.5">
                                                            {guide.specializations.map((spec, index) => (
                                                                <View key={index} className="bg-yellow-50 px-2 py-0.5 rounded-full border border-yellow-300">
                                                                    <Text className="text-yellow-800 text-[11px] font-medium">{spec}</Text>
                                                                </View>
                                                            ))}
                                                        </View>
                                                    </View>



                                                    <View className="mb-4">
                                                        <Text className="text-sm text-gray-600 leading-5">{guide.bio}</Text>
                                                    </View>


                                                    <View className="flex-row items-end justify-between border-t border-gray-100 pt-3">
                                                        <View className="flex-1">
                                                            <Text className="text-sm text-gray-500 mb-0.5">Starting from</Text>

                                                            <Text className="text-xl font-extrabold text-gray-600">LKR {(guide.dailyRate)}/day</Text>
                                                        </View>

                                                        <View className="flex-row gap-2">

                                                            <View className="flex-row items-center px-3 py-2 bg-yellow-300 rounded-md gap-4 justify-center">
                                                                <Image source={tele} className='w-6 h-6' />
                                                                <Text className="text-sm text-gray-800 font-semibold">{guide.mobileNumber}</Text>
                                                            </View>
                                                        </View>
                                                    </View>
                                                </TouchableOpacity>
                                            )
                                        })}
                                    </View>
                                </View>
                            }

                            {guides.length > 0 && guides.map((guide, index) => {

                                const rating = guide.reviewCount > 0
                                    ? parseFloat(((guide.stars / guide.reviewCount) * 2).toFixed(1))
                                    : 0;

                                return (<TouchableOpacity
                                    key={guide._id}
                                    className={`bg-white mx-4 my-2 rounded-lg border p-4 shadow-sm border-gray-100`}
                                    onPress={() => router.push(`/views/guide/solo/${guide._id}`)}
                                    activeOpacity={0.7}
                                >
                                    {/* Guide Header */}
                                    <View className="flex-row mb-2 gap-2">
                                        {/* Guide Image and Basic Info */}
                                        <Image source={{ uri: `data:image/jpeg;base64,${guide.pp}` }} className='w-20 h-20 rounded-full' />

                                        <View className="flex-1">

                                            <View className="flex-col items-start mb-1 ml-1">
                                                <Text className="text-lg font-semibold text-gray-800 flex-1">{`${guide.firstName} ${guide.lastName}`}</Text>
                                                <Text className="text-sm text-gray-500 mb-1">{guide.description}</Text>
                                                <View className='w-[96%] flex-row justify-between'>
                                                    <View className='gap-1 flex-row items-center'>
                                                        <Image className='w-4 h-4' source={guide.verified ? tele : cross}></Image>
                                                        <Text className="text-sm">Phone Verified</Text>
                                                    </View>
                                                    <View className='gap-1 flex-row items-center'>
                                                        <Image className='w-4 h-4' source={guide.identified ? mark : cross}></Image>
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
                                                    <Image source={pin} className='w-5 h-5' />
                                                    <Text className="text-xs text-gray-600">{guide.location}</Text>
                                                </View>
                                                <View className="flex-row items-center gap-1 flex-1">
                                                    <Image source={xp} className='w-5 h-5' />
                                                    <Text className="text-xs text-gray-600">{guide.experience} experience</Text>
                                                </View>
                                            </View>

                                            {/* Rating and Response */}
                                            <View className="flex-row items-center justify-between">
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
                                                    <Text className="text-[10px] text-gray-500">({guide.reviewCount} Reviews)</Text>
                                                </View>

                                                <View className="items-end">
                                                    <Text className="text-[10px] text-green-500 font-medium">{guide.responseTime}</Text>
                                                    <Text className="text-[10px] text-gray-500">{guide.responseRate}% response rate</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>

                                    {/* Languages 
                                    <View className="mb-3">
                                        <Text className="text-xs font-semibold text-gray-700 mb-1.
                                        <View className="flex-row flex-wrap gap-1.5">
                                            {guide.languages.map((lang, index) => (
                                                <View key={index} className="bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                                                    <Text className="text-blue-600 text-[11px] font-medium">{lang}</Text>
                                                </View>
                                            ))}
                                        </View>
                                    </View>*/}

                                    {/* Specializations */}
                                    <View className="mb-3">
                                        <Text className="text-xs font-semibold text-gray-700 mb-1.5">Specializations:</Text>
                                        <View className="flex-row flex-wrap gap-1.5">
                                            {guide.specializations.map((spec, index) => (
                                                <View key={index} className="bg-yellow-50 px-2 py-0.5 rounded-full border border-yellow-300">
                                                    <Text className="text-yellow-800 text-[11px] font-medium">{spec}</Text>
                                                </View>
                                            ))}
                                        </View>
                                    </View>

                                    {/* Expertise 
                                        <View className="mb-3">
                                            <Text className="text-xs font-semibold text-gray-700 mb-1.5">K
                                            <Text className="text-xs text-green-600 font-medium">{guide.expertise.join(' • ')}</Text>
                                        </View>
                                        */}

                                    {/* bio */}
                                    <View className="mb-4">
                                        <Text className="text-sm text-gray-600 leading-5">{guide.bio}</Text>
                                    </View>

                                    {/* Pricing and Actions */}
                                    <View className="flex-row items-end justify-between border-t border-gray-100 pt-3">
                                        <View className="flex-1">
                                            <Text className="text-sm text-gray-500 mb-0.5">Starting from</Text>
                                            {/* <Text className="text-sm font-semibold text-red-600">{guide.currency} {formatPrice(guide.hourlyRate)}/hour</Text> */}
                                            <Text className="text-xl font-extrabold text-gray-600">LKR {(guide.dailyRate)}/day</Text>
                                        </View>

                                        <View className="flex-row gap-2">
                                            {/* <TouchableOpacity className="flex-row items-center px-3 py-2 border border-blue-600 rounded-md gap-1">
                                                    <Icon name="message" size={16} color="#2563eb" />
                                                    <Text className="text-xs text-blue-600 font-medium">Message</Text>
                                                </TouchableOpacity> */}
                                            <View className="flex-row items-center px-3 py-2 bg-yellow-300 rounded-md gap-4 justify-center">
                                                <Image source={tele} className='w-6 h-6' />
                                                <Text className="text-sm text-gray-800 font-semibold">{guide.mobileNumber}</Text>
                                            </View>
                                        </View>
                                    </View>
                                </TouchableOpacity>)
                            })}

                            {/* Bottom Padding */}
                            <View className="h-20" />
                        </ScrollView>
                        {/*  <View className="p-4 border-t border-gray-200 bg-white">
                            <Text className="text-center font-bold text-lg">Total: 1000 LKR</Text>
                        </View> */}
                    </>
                )}

            </View>
        </View>
    );
}