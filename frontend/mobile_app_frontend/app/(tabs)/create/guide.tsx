import { Text, View, ScrollView, TouchableOpacity, Modal, TextInput } from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import { Calendar } from 'react-native-calendars';
import { cssInterop } from 'nativewind';
import { Image } from 'expo-image';
import { useRouter, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

cssInterop(Image, { className: "style" });

const cross = require('../../../assets/images/cross.png');
const mark = require('../../../assets/images/tabbar/create/location/mark.png');
const pic = require('../../../assets/images/tabbar/create/location/h.png');
const star = require('../../../assets/images/tabbar/create/hotel/stars.png');
const tele = require('../../../assets/images/tabbar/create/guide/telephones.png')

interface Book {
    dates: string[];
    loc: string;
    lan: string;
}

interface Guid {
    _id: string;
    pp: string;
    username: string;
    stars: number;
    verified: string;
    identified: string;
    price: number
}

interface H {
    id: string,
    singlePrice: number,
    doublePrice: number,
}

interface Car {

    id: string;
    price: number;

}

export default function Guide() {

    /* const categories = [
        {
            id: '1',
            members: 2,
            title: 'Tuk',
            price: 100
        },
        {
            id: '2',
            members: 3,
            title: 'Mini',
            price: 200
        },
        {
            id: '3',
            members: 4,
            title: 'Seddan',
            price: 250
        },
        {
            id: '4',
            members: 5,
            title: 'Van',
            price: 350
        },
        {
            id: '5',
            members: 54,
            title: 'Non A/C',
            price: 5000
        },
        {
            id: '6',
            members: 35,
            title: 'A/C',
            price: 15000
        }
    ]
 */
    const router = useRouter();

    const [selectedDates, setSelectedDates] = useState<{ [key: string]: { selected: boolean; selectedColor: string } }>({});
    const [selectedCardIndex, setSelectedCardIndex] = useState<string | null>(null);
    const [isModalVisible, setModalVisible] = useState(false);
    const [fine, setFine] = useState(false);
    const [book, setBook] = useState<Book[] | null>([]);

    const [location, setLocation] = useState('');
    const [lan, setLan] = useState('');
    const [guides, setGuides] = useState<Guid[]>([])
    const [hotelx, setHotels] = useState<H[]>([])
    const [cars, setCars] = useState<Car[]>([])


    const [showDropdown, setShowDropdown] = useState(false);
    const [show, setShow] = useState(false);
    const locations = ['Colombo', 'Kandy', 'Galle', 'Nuwara Eliya', 'Jaffna'];
    const languages = ['English', 'Korean', 'Russian', 'Japanese', 'Sinhala'];
    const [total, setTotal] = useState('');


    const toggleCardSelection = useCallback((index: string) => {
        let newIndex: string | null = null;
        setSelectedCardIndex(prev => {
            newIndex = prev === index ? null : index;
            return newIndex;
        });
        // Update AsyncStorage after state change
        const updateStorage = async () => {
            try {
                await AsyncStorage.setItem('guide', newIndex !== null ? newIndex : '');
            } catch (error) {
                console.error('Error saving selectedCardIndex to AsyncStorage:', error);
            }
        };
        updateStorage();
    }, []);

    const onDayPress = (day: { dateString: string }) => {
        setSelectedDates((prev) => {
            const date = day.dateString;
            const updated = { ...prev };
            if (updated[date]) {
                delete updated[date]; // Unselect
            } else {
                updated[date] = { selected: true, selectedColor: '#007BFF' };
            }
            return updated;
        });
    };

    const handleSubmit = async () => {
        if (Object.keys(selectedDates).length === 0 || !location || !lan) {
            alert('Please fill in all fields.');
            return;
        }
        const newBooking = [{ dates: Object.keys(selectedDates), loc: location, lan: lan }];
        setBook(newBooking);
        setFine(true);
        setModalVisible(false);

        try {
            await AsyncStorage.setItem('gbookings', JSON.stringify(newBooking));
            await AsyncStorage.setItem('gbookingComplete', 'true');
            await AsyncStorage.setItem('gbookingSession', Date.now().toString());
            await getGuides()
            loadBookingData()
        } catch (error) {
            alert(`Error saving booking to AsyncStorage: ${error}`);
        }
    };

    const displayDates = Object.keys(selectedDates)
        .sort()
        .map(date => new Date(date).toDateString())
        .join(', ');

    const loadBookingData = async () => {
        try {
            const sessionExists = await AsyncStorage.getItem('gbookingSession');
            const bookingComplete = await AsyncStorage.getItem('gbookingComplete');
            const savedIndex = await AsyncStorage.getItem('guide');
            const hotelData = await AsyncStorage.getItem('hotels')
            setHotels(hotelData ? JSON.parse(hotelData) : [])

            const carData = await AsyncStorage.getItem('cars')
            setCars(carData ? JSON.parse(carData) : []);

            // --- Reset local state before loading from storage ---
            setSelectedDates({});
            setSelectedCardIndex(null);
            setModalVisible(false);
            setFine(false);
            setBook([]);
            setLocation('');
            setLan('');
            setShowDropdown(false);
            setShow(false);
            setTotal('0');

            if (savedIndex) {
                setSelectedCardIndex(savedIndex);
            }

            if (sessionExists && bookingComplete === 'true') {
                setModalVisible(false);
                setFine(true);
                const savedBookings = await AsyncStorage.getItem('gbookings');
                if (savedBookings) {
                    const bookingData = JSON.parse(savedBookings);
                    setBook(bookingData);
                    if (bookingData.length > 0) {
                        const booking = bookingData[0];
                        const dates = booking.dates.reduce((acc: any, date: string) => {
                            acc[date] = { selected: true, selectedColor: '#007BFF' };
                            return acc;
                        }, {});
                        setSelectedDates(dates);
                        setLocation(booking.loc);
                        setLan(booking.lan);
                        // Fetch guides now that we have location and language
                        await getGuides(booking.loc, booking.lan);
                    }
                }
            } else {
                await AsyncStorage.setItem('gbookingSession', Date.now().toString());
                setModalVisible(true);
                setFine(false);
            }

        } catch (error) {
            console.error('Error loading data from AsyncStorage (guide):', error);
            setSelectedDates({});
            setSelectedCardIndex(null);
            setModalVisible(true);
            setFine(false);
            setBook([]);
            setLocation('');
            setLan('');
            setShowDropdown(false);
            setShow(false);
            setTotal('0');
        }
    }

    // UPDATED: Now accepts optional parameters to be called after loading booking data.
    const getGuides = async (loc?: string, language?: string) => {
        const guideLocation = loc || location;
        const guideLanguage = language || lan;

        // Prevent API call if essential data is missing
        if (!guideLocation || !guideLanguage) {
            return;
        }

        try {
            const res = await fetch(`http://localhost:8080/traveler/guides-all?location=${guideLocation}&language=${guideLanguage}`)
            //const res = await fetch(`https://travelsri-backend.onrender.com/traveler/guides-all?location=${guideLocation}&language=${guideLanguage}`)

            if (res.ok) {
                const data = await res.json()

                if (data.length > 0) {


                    const minimalGuides = data.map((guide: Guid) => ({
                        id: guide._id,
                        price: guide.price,
                    }));

                    await AsyncStorage.setItem('guides', JSON.stringify(minimalGuides) || '')
                    setGuides(data)

                }

                else {

                    setGuides([])
                    await AsyncStorage.removeItem('guide')
                    console.log('No guides found')

                }
            }
        } catch (err) {
            console.log(`Error from guide getting : ${err}`)
        }
    }

    useFocusEffect(
        useCallback(() => {
            loadBookingData();
            count()
        }, [])
    );

    const count = async () => {
        try {
            let total = 0;

            const carIndex = await AsyncStorage.getItem('car');
            if (carIndex && cars.length > 0) {
                const category = cars.find(cat => cat.id === carIndex);
                if (category) {
                    total += category.price;
                }
            }

            const guideIndex = await AsyncStorage.getItem('guide');
            if (guideIndex && guides.length > 0) { // Ensure guides list is populated
                const guide = guides.find(guide => guide._id === guideIndex);
                if (guide) {
                    total += guide.price;
                }
            }

            const savedHotelBooking = await AsyncStorage.getItem('selectedHotelBooking');
            if (savedHotelBooking && hotelx.length > 0) { // Ensure hotels list is populated
                const hotelBookingData = JSON.parse(savedHotelBooking);
                const selectedHotel = hotelx.find(hotel => hotel.id === hotelBookingData.id);
                if (selectedHotel && hotelBookingData) {
                    const singleBedPrice = selectedHotel.singlePrice || 0;
                    const doubleBedPrice = selectedHotel.doublePrice || 0;
                    const numSingle = Number(hotelBookingData.s || 0);
                    const numDouble = Number(hotelBookingData.d || 0);
                    total += (singleBedPrice * numSingle) + (doubleBedPrice * numDouble);
                }
            }

            setTotal(total.toString());
        } catch (error) {
            console.error('Error calculating total price from AsyncStorage:', error);
            setTotal('0');
        }
    };

    // UPDATED: Dependencies changed to fix calculation timing.
    useFocusEffect(
        useCallback(() => {
            count();
        }, [selectedCardIndex, cars, hotelx]) // Runs when selection or data changes
    );


    return (
        <View className='bg-[#F2F5FA] h-full'>
            <View className='bg-[#F2F5FA] h-full'>
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={isModalVisible}
                    onRequestClose={() => {
                        setModalVisible(false);
                    }}
                >
                    <View className="h-full justify-center items-center bg-black/50">
                        <View className="w-[93%] h-[97%] bg-white my-4 p-6 rounded-2xl items-center">
                            <View className='w-full'>
                                <TouchableOpacity onPress={() => { setModalVisible(false); if (!fine || Object.keys(selectedDates).length === 0) { setModalVisible(false); router.back() } }}>
                                    {(fine && Object.keys(selectedDates).length !== 0) ? <Text> Cancel</Text> : <Text> Back</Text>}
                                </TouchableOpacity>
                                <Text className="text-xl font-bold mb-8 text-center">Guide Booking</Text>
                            </View>
                            <View className='w-full flex-1'>
                                <Calendar
                                    style={{ width: 320, maxWidth: '100%' }}
                                    onDayPress={onDayPress}
                                    markedDates={selectedDates}
                                    minDate={new Date().toISOString().split('T')[0]}
                                    theme={{
                                        todayTextColor: '#007BFF',
                                        arrowColor: '#007BFF',
                                    }}
                                />
                                <View className="w-full p-2 bg-white h-[30%] ">
                                    <View className='justify-between'>
                                        <View className="w-full h-[80%] relative z-20 mt-4 gap-6">
                                            <TouchableOpacity
                                                onPress={() => { setShowDropdown(!showDropdown); if (show) setShow(false) }}
                                                className="border border-gray-300 rounded-xl px-4 py-3 bg-white w-full"
                                            >
                                                <Text className={`text-base ${location ? 'text-black' : 'text-gray-400'}`}>
                                                    {location || 'Select Location'}
                                                </Text>
                                            </TouchableOpacity>
                                            {showDropdown && (
                                                <View className="absolute top-[52px] left-0 right-0 bg-white border border-gray-300 rounded-xl z-30 max-h-40">
                                                    <ScrollView>
                                                        {locations.map((loc, index) => (
                                                            <TouchableOpacity
                                                                key={index}
                                                                onPress={() => {
                                                                    setLocation(loc);
                                                                    setShowDropdown(false);
                                                                }}
                                                                className={`px-4 py-2 ${location === loc ? 'bg-blue-100' : ''}`}
                                                            >
                                                                <Text className="text-base">{loc}</Text>
                                                            </TouchableOpacity>
                                                        ))}
                                                    </ScrollView>
                                                </View>
                                            )}
                                            <TouchableOpacity
                                                onPress={() => { setShow(!show) }}
                                                className="border border-gray-300 rounded-xl px-4 py-3 bg-white"
                                            >
                                                <Text className={`text-base ${lan ? 'text-black' : 'text-gray-400'}`}>
                                                    {lan || 'Select Language'}
                                                </Text>
                                            </TouchableOpacity>
                                            {show && (
                                                <View className="absolute top-[130px] left-0 right-0 bg-white border border-gray-300 rounded-xl z-30 max-h-40">
                                                    <ScrollView>
                                                        {languages.map((l, index) => (
                                                            <TouchableOpacity
                                                                key={index}
                                                                onPress={() => {
                                                                    setLan(l);
                                                                    setShow(false);
                                                                }}
                                                                className={`px-4 py-2 ${lan === l ? 'bg-blue-100' : ''}`}
                                                            >
                                                                <Text className="text-base">{l}</Text>
                                                            </TouchableOpacity>
                                                        ))}
                                                    </ScrollView>
                                                </View>
                                            )}
                                        </View>
                                        <View className="w-full h-full bottom-0">
                                            <TouchableOpacity
                                                onPress={handleSubmit}
                                                className="bg-[#FEFA17] py-3 rounded-xl"
                                            >
                                                <Text className="text-black text-center font-semibold">Submit</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                </Modal>

                {fine && (
                    <>
                        <View className="flex-row justify-between items-center p-4">
                            <Text className="text-lg font-medium">{displayDates}</Text>
                            <TouchableOpacity onPress={() => setModalVisible(true)} className="bg-gray-200 py-2 px-4 rounded-lg">
                                <Text className="font-semibold text-blue-600">Change</Text>
                            </TouchableOpacity>
                        </View>

                        <View>
                            <ScrollView
                                className="w-full h-[81%]"
                                contentContainerClassName="flex-row flex-wrap justify-center items-start gap-3 py-5"
                                showsVerticalScrollIndicator={false}
                            >
                                {guides.map((x, index) => (
                                    <View key={index} className="bg-[#fbfbfb] w-[175px] h-[155px] py-1 rounded-2xl border-2 border-gray-300">

                                        <TouchableOpacity onPress={() => router.push(`/views/guide/group/${x._id}`)}>

                                            <View className='h-full py-3 justify-between'>
                                                <View className="w-full absolute items-end pr-1 z-10">
                                                    <TouchableOpacity
                                                        className="justify-center items-center w-6 h-6 rounded-full bg-gray-200"
                                                        onPress={() => toggleCardSelection(x._id)}
                                                    >
                                                        {selectedCardIndex === x._id && (
                                                            <Image className='w-4 h-4' source={mark} />
                                                        )}
                                                    </TouchableOpacity>
                                                </View>
                                                <View className='flex-row gap-5 px-3 w-44'>

                                                    <Image
                                                        className='w-[50px] h-[50px] rounded-full'
                                                        source={{ uri: `data:image/jpeg;base64,${x.pp}` }}
                                                        contentFit="cover"
                                                    />
                                                    <View className=''>
                                                        <Text className="text-md font-semibold w-24 max-h-12 pt-2">{x.username}</Text>
                                                        <View className="flex-row justify-start mt-1">
                                                            {[...Array(x.stars)].map((_, i) => (
                                                                <Image key={i} className="w-3 h-3 mx-0.5" source={star} />
                                                            ))}
                                                        </View>
                                                    </View>
                                                </View>
                                                <View className='w-full mt-4 gap-2'>
                                                    <View className='gap-6 flex-row w-full pl-5'>
                                                        <Image className='w-5 h-5' source={tele}></Image>
                                                        <Text className="text-md">Phone Verified</Text>
                                                    </View>
                                                    <View className='gap-6 flex-row w-full pl-5'>
                                                        <Image className='w-5 h-5' source={mark}></Image>
                                                        <Text className="text-md">Identify Verified</Text>
                                                    </View>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                ))}
                            </ScrollView>
                        </View>
                        <View className="p-4 border-t border-gray-200 bg-white">
                            {

                                <Text className="text-center font-bold text-lg">{total}.00 LKR</Text>

                            }
                        </View>

                    </>
                )}
            </View>
        </View>
    );
}