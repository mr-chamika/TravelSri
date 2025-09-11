import { Text, KeyboardAvoidingView, Platform, View, ScrollView, TouchableOpacity, Modal, TextInput } from 'react-native';
import { useState, useCallback, useEffect, useMemo } from 'react';
import { cssInterop } from 'nativewind';
import { Image } from 'expo-image';
import { useRouter, useFocusEffect, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';


cssInterop(Image, { classvehicleModel: "style" });

const setting = require('../../../../assets/images/setting.png')
const infinity = require('../../../../assets/images/infinity.png')

interface Vehicle {
    _id: string;
    vehicleModel: string;
    catId: string;
    doors: number;
    seats: number;
    gearType: string;
    mileage: string;
    image: string;
    location: string;
    stars: number;
    reviewCount: number;
    dailyRatePrice: number;
    duration: number;
}

interface Category {

    _id: string,
    title: string,

}
interface g {

    id: string,
    price: number

}

interface H {
    id: string,
    singlePrice: number,
    doublePrice: number,
}

interface Cat {

    _id: string,
    image: string,
    members: number,
    title: string,
    price: number

}

interface Car {

    _id: string;
    price: number;

}

interface Postdata {

    dayNumber: string,
    date: string,
    adults: string,
    children: string

}

export default function App() {
    const router = useRouter();

    const { id } = useLocalSearchParams();

    const timeOptions = [
        '12:00 AM', '12:30 AM', '01:00 AM', '01:30 AM', '02:00 AM', '02:30 AM',
        '03:00 AM', '03:30 AM', '04:00 AM', '04:30 AM', '05:00 AM', '05:30 AM',
        '06:00 AM', '06:30 AM', '07:00 AM', '07:30 AM', '08:00 AM', '08:30 AM',
        '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
        '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM',
        '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM',
        '06:00 PM', '06:30 PM', '07:00 PM', '07:30 PM', '08:00 PM', '08:30 PM',
        '09:00 PM', '09:30 PM', '10:00 PM', '10:30 PM', '11:00 PM', '11:30 PM'
    ];

    interface Book {
        start: string;
        end: string;
        language: string;
        oneWay: boolean;
        time: string
    }


    const x = async () => {

        try {
            const res = await fetch(`http://localhost:8080/traveler/vehicles-all`)
            //const res = await fetch(`https://travelsri-backend.onrender.com/traveler/vehicles-all`)

            const data = await res.json()

            if (data.length > 0) {
                //console.log(data)
                setCategories(data)
            }



        } catch (err) {

            console.log(err)

        }

    }
    useEffect(() => {
        loadBookingData()
        x();
    }, [])

    useFocusEffect(
        useCallback(() => {
            const loadInitialData = async () => {
                const pack = await AsyncStorage.getItem('order');
                if (pack) {
                    const parsedOrder = JSON.parse(pack);
                    if (JSON.stringify(order) !== JSON.stringify(parsedOrder)) {
                        setOrder(parsedOrder);
                    }
                }

                const locationp = await AsyncStorage.getItem('selectedLocation');
                if (locationp && locationp !== locationP) {
                    setLocationP(locationp);
                }
            };

            loadInitialData();
        }, [])
    );

    const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
    const [isModalVisible, setModalVisible] = useState(false);
    const [startLocation, setStartLocation] = useState('');
    const [endLocation, setEndLocation] = useState('');
    const [language, setLanguage] = useState('');
    const [isOneway, setOneWay] = useState(true);
    const [isWayback, setWayback] = useState(false);
    const [isBookingComplete, setIsBookingComplete] = useState(false);
    const [selectedTime, setSelectedTime] = useState({ hour: 12, minute: 30 });
    const [bookingData, setBookingData] = useState<Book | null>(null);
    const [total, setTotal] = useState('');
    const [time, setTime] = useState('')
    const [guides, setGuides] = useState<g[]>([])
    const [hotels, setHotels] = useState<H[]>([])
    const [categories, setCategories] = useState<Category[]>([])
    const [vehicles, setVehicles] = useState<Vehicle[]>([])

    const [locationP, setLocationP] = useState('');
    const [order, setOrder] = useState<Postdata | null>(null)


    const handleSubmit = async () => {
        // 1. Validate that all required fields are filled
        if (!startLocation.trim() || !endLocation.trim() || !language.trim() || !time) {
            alert('Please fill in all fields before submitting.');
            return;
        }

        // 2. Create the final booking object with all the data
        const newBooking = {
            date: order?.date,
            start: startLocation,
            end: endLocation,
            language: language,
            time: time,
            oneWay: isOneway, // Include the one-way trip status
        };

        // 3. Update the component's state to reflect the completed booking
        console.log(newBooking)
        setBookingData(newBooking);
        setModalVisible(false);
        setIsBookingComplete(true);

        //console.log(newBooking)

        const res = await fetch(`http://localhost:8080/traveler/vehicle-get?location=${newBooking.start}&language=${newBooking.language}&id=${id}`)

        const data = await res.json();

        if (data.length > 0) {

            //console.log(data)
            setVehicles(data)

            const res1 = await fetch(`http://localhost:8080/traveler/category-get`)

            const data1 = await res1.json();

            if (data1) {

                //console.log(data1)
                setCategories(data1)

            }
        } else {
            setVehicles([])
            console.log('No vehicles found')
            await AsyncStorage.removeItem('car')

        }

        // 4. Save the booking data to AsyncStorage for persistence
        try {
            await AsyncStorage.setItem('cbookings', JSON.stringify(newBooking));
            await AsyncStorage.setItem('cbookingComplete', 'true');
            await AsyncStorage.setItem('cbookingSession', Date.now().toString());
        } catch (error) {
            alert(`Error saving your booking. Please try again. Error: ${error}`);
        }
    };
    const loadBookingData = useCallback(async () => {
        try {
            const sessionExists = await AsyncStorage.getItem('cbookingSession');
            const bookingCompleteStatus = await AsyncStorage.getItem('cbookingComplete')
            console.log(sessionExists + " " + bookingCompleteStatus)
            if (sessionExists && bookingCompleteStatus === 'true') {
                setModalVisible(false);
                setIsBookingComplete(true);
                const savedBooking = await AsyncStorage.getItem('cbookings');
                if (savedBooking) {
                    const parsedBooking: Book = JSON.parse(savedBooking);
                    setBookingData(parsedBooking);
                    setStartLocation(parsedBooking.start);
                    setEndLocation(parsedBooking.end);
                    setLanguage(parsedBooking.language);
                    setTime(parsedBooking.time); setStartLocation(parsedBooking.start);
                    setEndLocation(parsedBooking.end);
                    setLanguage(parsedBooking.language);
                    //setSelectedTime(parsedBooking.time);
                    setTime(parsedBooking.time)
                }

                const res = await fetch(`http://localhost:8080/traveler/vehicle-get?location=${startLocation}&language=${language}&id=${id}`)

                const data = await res.json();

                if (data.length > 0) {

                    //console.log(data)
                    setVehicles(data)

                    const res1 = await fetch(`http://localhost:8080/traveler/category-get`)

                    const data1 = await res1.json();

                    if (data1) {

                        //console.log(data1)
                        setCategories(data1)

                    }
                } else {
                    setVehicles([])
                    console.log('No vehicles found')
                    await AsyncStorage.removeItem('car')

                }

            } else {
                await AsyncStorage.setItem('cbookingSession', Date.now().toString());
                setModalVisible(true);
                setIsBookingComplete(false);
            }
        } catch (error) {
            console.error('Error loading data from AsyncStorage:', error);

            setSelectedCardId(null);
            setModalVisible(true);
            setIsBookingComplete(false);
            setBookingData(null);
            setLanguage('');
            setTime('')
            setStartLocation('');
            setEndLocation('');
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            loadBookingData();
        }, [])
    );

    return (
        <View className={`${Platform.OS === 'web' ? 'h-screen overflow-auto' : 'h-full'}`}>

            <Modal
                animationType="fade"
                transparent={true}
                visible={isModalVisible}
                onRequestClose={() => {
                    setModalVisible(false);
                }}
            >
                <View className="flex-1 justify-center items-center bg-black/50">
                    {/* 1. KeyboardAvoidingView is necessary to handle the keyboard */}
                    <KeyboardAvoidingView
                        behavior={Platform.OS === "ios" ? "padding" : "height"}
                        className="w-[93%] h-[97%]"
                    >
                        <View className="flex-1 bg-white my-4 p-7 rounded-2xl shadow-lg">
                            <View>
                                <TouchableOpacity onPress={() => { setModalVisible(false); if (!isBookingComplete) router.back() }}>
                                    <Text>{(isBookingComplete) ? "Cancel" : "Back"}</Text>
                                </TouchableOpacity>
                                <Text className="text-xl font-bold mb-4 text-center">Vehicle Booking</Text>
                            </View>

                            {/* 2. A ScrollView is added to wrap all your form content */}
                            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                                <View className="w-full gap-7 mt-4">
                                    <View className='flex-row w-full justify-between'>

                                        <View className="flex-row items-center pt-2 gap-4">
                                            <Text className="text-base text-gray-800">One-Way Trip</Text>
                                            <TouchableOpacity onPress={() => { setOneWay(prevState => !prevState); setWayback(prevState => !prevState) }} className={`w-6 h-6 rounded border-2 justify-center items-center mr-2 ${isOneway ? 'bg-blue-500 border-blue-500' : 'border-gray-400'}`}>
                                                {isOneway && <Text className="text-white font-bold">✓</Text>}
                                            </TouchableOpacity>
                                        </View>
                                        <View className="flex-row items-center pt-2 gap-4">
                                            <Text className="text-base text-gray-800">Way-back Trip</Text>
                                            <TouchableOpacity onPress={() => { setWayback(prevState => !prevState); setOneWay(prevState => !prevState) }} className={`w-6 h-6 rounded border-2 justify-center items-center mr-2 ${isWayback ? 'bg-blue-500 border-blue-500' : 'border-gray-400'}`}>
                                                {isWayback && <Text className="text-white font-bold">✓</Text>}
                                            </TouchableOpacity>
                                        </View>
                                    </View>

                                    <View className='flex-row justify-between gap-2'>
                                        <View className='flex-1'>
                                            <Text className="text-sm font-medium text-gray-600 mb-1">Start Location</Text>
                                            <TextInput placeholder="colombo" value={startLocation} onChangeText={setStartLocation} className="border border-gray-300 rounded-xl px-4 py-3 bg-white text-base" />
                                        </View>
                                        <View className='flex-1'>
                                            <Text className="text-sm font-medium text-gray-600 mb-1">End Location</Text>
                                            <TextInput placeholder="kandy" value={endLocation} onChangeText={setEndLocation} className="border border-gray-300 rounded-xl px-4 py-3 bg-white text-base" />
                                        </View>
                                    </View>
                                    <View className='flex-row justify-between gap-2'>
                                        <View className='flex-1'>
                                            <Text className="text-sm font-medium text-gray-600 mb-1">Language</Text>
                                            <TextInput placeholder="sinhala" value={language} onChangeText={setLanguage} className=" border border-gray-300 rounded-xl px-4 py-3 bg-white text-base" />
                                        </View>

                                        <View className='flex-1'>
                                            <Text className="text-sm font-medium text-gray-600 mb-1">Pickup Time</Text>
                                            <View className="border h-[45px] border-gray-300 rounded-xl justify-center">
                                                <Picker selectedValue={time} onValueChange={(itemValue) => setTime(itemValue)}>
                                                    <Picker.Item label="Select..." value="" />
                                                    {timeOptions.map((time, index) => (<Picker.Item key={index} label={time} value={time} />))}
                                                </Picker>
                                            </View>
                                        </View>
                                    </View>

                                </View>
                            </ScrollView>

                            {/* 3. The Submit button is placed at the end */}
                            <View className="w-full pt-4">
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

            {isBookingComplete && (
                <View className="flex-1">
                    <View>
                        {bookingData && (
                            <View className="bg-white rounded-lg p-4 mx-4 mt-3 shadow">
                                <View className="justify-between flex-col gap-3">
                                    <View className='flex-row justify-between'>
                                        <View>
                                            <Text className="text-sm text-gray-500">Destination</Text>
                                            <Text className="text-base font-semibold text-gray-800">{bookingData.start}</Text>
                                        </View>
                                        <View>
                                            <Text className="text-sm text-gray-500">Booking Type</Text>
                                            <Text className="text-base font-semibold text-gray-800 capitalize">
                                                {bookingData.oneWay ? 'One way' : 'Way back'}
                                            </Text>
                                        </View>
                                        <View>
                                            <Text className="text-sm text-gray-500">Language</Text>
                                            <Text className="text-base font-semibold text-gray-800">{bookingData.language}</Text>
                                        </View>
                                    </View>
                                </View>
                                <Text className='text-xl text-center font-extrabold py-2'>Choose a vehicle</Text>
                            </View>
                        )}
                        <View className="flex-row justify-end items-center p-4 mb-1.5">
                            <TouchableOpacity onPress={() => setModalVisible(true)} className="bg-gray-200 py-2 px-4 rounded-lg">
                                <Text className="font-semibold text-blue-600">Change</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <ScrollView
                        className="flex-1"
                        contentContainerClassName="flex-row flex-wrap justify-center items-start gap-5 py-5"
                    >
                        {vehicles.length == 0 &&
                            <View className="flex-1 justify-center items-center min-h-[600px]">
                                <Text className="text-red-500 italic">No vehicles available</Text>
                            </View>
                        }
                        {vehicles.length > 0 && vehicles.map((vehicle, index) => {

                            const getReviewLabel = (score: number): string => {
                                if (score >= 9) return 'Excellent';
                                if (score >= 8) return 'Very Good';
                                if (score >= 7) return 'Good';
                                if (score >= 5) return 'Average';
                                return 'Poor';
                            };

                            const rating = vehicle.reviewCount > 0
                                ? parseFloat(((vehicle.stars / vehicle.reviewCount) * 2).toFixed(1))
                                : 0;

                            const catName = categories.find(cat => cat._id == vehicle.catId)

                            return (<TouchableOpacity
                                key={vehicle._id}
                                className={` bg-white w-[95%] my-2 rounded-lg border p-4 shadow-md border-gray-50`}
                                onPress={() => router.push(`/views/car/profile/${vehicle._id}`)}
                                activeOpacity={0.7}
                            >
                                {/* Vehicle Header */}
                                <View className="flex-row mb-3">
                                    <View className="flex-1">
                                        <Text className="text-base font-semibold text-gray-800 mb-0.5">{vehicle.vehicleModel}</Text>
                                        <Text className="text-xs text-gray-500 mb-2">{catName?.title}</Text>

                                        {/* Vehicle Specs */}
                                        <View className="space-y-1">

                                            <View className="flex-row items-center gap-1">
                                                <Image source={setting} className='w-5 h-5' />
                                                <Text className="text-xs text-gray-600">{vehicle.gearType}</Text>
                                            </View>

                                            <View className="flex-row items-center gap-1">

                                                <Image source={infinity} className='w-5 h-5' />
                                                <Text className="text-xs text-gray-600">{vehicle.mileage}</Text>
                                            </View>
                                        </View>
                                    </View>

                                    {/* Vehicle Image */}
                                    <View className="w-[200px] h-[120px]">
                                        <Image source={{ uri: `data:image/jpeg;base64,${vehicle.image}` }} className="w-full h-full" contentFit="contain" />
                                    </View>
                                </View>

                                {/* Location */}
                                <View className="mb-3">
                                    <Text className="text-sm font-semibold text-gray-800">{vehicle.location}</Text>
                                </View>

                                {/* Supplier stars */}
                                <View className="flex-row items-end justify-between mb-3">
                                    <View className="flex-row items-center gap-2">
                                        <View className={`rounded px-1.5 py-0.5 ${rating >= 9 ? 'bg-green-500' :
                                            rating >= 8 ? 'bg-emerald-400' :
                                                rating >= 7 ? 'bg-yellow-400' :
                                                    rating >= 5 ? 'bg-orange-400' :
                                                        'bg-red-500'}`}>
                                            <Text className="text-white text-xs font-semibold">{rating}</Text>
                                        </View>
                                        <View>
                                            <Text className="text-xs font-semibold text-gray-800">{getReviewLabel(rating)}</Text>
                                            <Text className="text-[10px] text-gray-500">{vehicle.reviewCount} reviews</Text>
                                        </View>
                                    </View>

                                    {/* Price Section */}
                                    <View className="items-end">
                                        <View className="items-end">
                                            <Text className="text-xs text-gray-500 mb-0.5">Price for {vehicle.duration} days</Text>
                                            <Text className="text-lg font-bold text-gray-800">
                                                LKR {(vehicle.dailyRatePrice)}.00
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>)
                        })}
                    </ScrollView>

                </View>

            )}
        </View>
    );
}
