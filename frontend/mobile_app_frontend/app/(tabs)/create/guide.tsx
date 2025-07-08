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

interface Guide {
    id: string;
    image: any;
    title: string;
    stars: number;
    verified: boolean;
    identified: boolean;
    price: number
}

const guides: Guide[] = [
    {
        id: '1',
        image: pic,
        title: 'Theekshana',
        stars: 3,
        verified: true,
        identified: true,
        price: 1000
    },
    {
        id: '2',
        image: pic,
        title: 'Teshini',
        stars: 1,
        verified: true,
        identified: true,
        price: 2000
    },
    {
        id: '3',
        image: pic,
        title: 'Sudewa',
        stars: 2,
        verified: true,
        identified: true,
        price: 3000
    },
    {
        id: '4',
        image: pic,
        title: 'Bimsara',
        stars: 5,
        verified: true,
        identified: true,
        price: 4000
    },
    {
        id: '5',
        image: pic,
        title: 'Tharusha',
        stars: 3,
        verified: true,
        identified: true,
        price: 5000
    },
    {
        id: '6',
        image: pic,
        title: 'Viduranga',
        stars: 1,
        verified: true,
        identified: true,
        price: 6000
    },
    {
        id: '7',
        image: pic,
        title: 'Chamika',
        stars: 2,
        verified: true,
        identified: true,
        price: 7000
    },
    {
        id: '8',
        image: pic,
        title: 'Thathsara',
        stars: 5,
        verified: true,
        identified: true,
        price: 8000
    },
];

export default function Guide() {

    const hotels = [
        { id: '1', image: pic, title: 'Shangri-La', stars: 3, price: 1000, beds: [{ type: 'double', price: 1000 }, { type: 'single', price: 500 }] },
        { id: '2', image: pic, title: 'Bawana', stars: 1, price: 2000, beds: [{ type: 'double', price: 1000 }, { type: 'single', price: 500 }] },
        { id: '3', image: pic, title: 'Matara bath kade', stars: 2, price: 3000, beds: [{ type: 'double', price: 1000 }, { type: 'single', price: 500 }] },
        { id: '4', image: pic, title: 'Raheema', stars: 5, price: 4000, beds: [{ type: 'double', price: 1000 }, { type: 'single', price: 500 }] },
    ];

    const categories = [
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


    const router = useRouter();

    const [selectedDates, setSelectedDates] = useState<{ [key: string]: { selected: boolean; selectedColor: string } }>({});
    const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(null);
    const [isModalVisible, setModalVisible] = useState(false);
    const [fine, setFine] = useState(false);
    const [book, setBook] = useState<Book[] | null>([]);

    const [location, setLocation] = useState('');
    const [lan, setLan] = useState('');

    const [showDropdown, setShowDropdown] = useState(false);
    const [show, setShow] = useState(false);
    const locations = ['Colombo', 'Kandy', 'Galle', 'Nuwara Eliya', 'Jaffna'];
    const languages = ['English', 'Korean', 'Russian', 'Japanese', 'Sinhala'];
    const [total, setTotal] = useState('');


    const toggleCardSelection = useCallback((index: number) => {
        let newIndex: number | null = null;
        setSelectedCardIndex(prev => {
            newIndex = prev === index ? null : index;
            return newIndex;
        });
        // Update AsyncStorage after state change
        const updateStorage = async () => {
            try {
                await AsyncStorage.setItem('guide', newIndex !== null ? (newIndex + 1).toString() : '');
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
            //alert('Booking saved to AsyncStorage');
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

            // --- Explicitly reset local state before attempting to load from storage ---
            setSelectedDates({});
            setSelectedCardIndex(null);
            setModalVisible(false); // Default to not visible
            setFine(false); // Assume not complete until proven otherwise
            setBook([]);
            setLocation('');
            setLan('');
            setShowDropdown(false);
            setShow(false);
            setTotal('0'); // Reset total for this component as well

            if (savedIndex) {

                setSelectedCardIndex(Number(savedIndex) - 1);
            }

            // Check if there's an active session AND booking is complete
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
                    }
                }

            } else {
                // If no session or booking is NOT complete, start fresh by showing modal
                await AsyncStorage.setItem('gbookingSession', Date.now().toString()); // Start a new session
                setModalVisible(true);
                setFine(false); // Ensure false so modal is required
            }


        } catch (error) {
            console.error('Error loading data from AsyncStorage (guide):', error);
            // On error, also ensure a full reset and show modal
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

    useEffect(() => {
        loadBookingData();
    }, []);

    useFocusEffect(
        useCallback(() => {
            loadBookingData();
        }, [])
    );

    const count = async () => {
        try {
            let total = 0;

            // Car Booking Price
            const carIndex = await AsyncStorage.getItem('car');
            if (carIndex) {
                const category = categories.find(cat => cat.id === (Number(carIndex)).toString());
                if (category) {
                    total += category.price;
                }
            }

            // Guide Booking Price
            const guideIndex = await AsyncStorage.getItem('guide');
            if (guideIndex) {
                const guide = guides.find(guide => guide.id === (Number(guideIndex)).toString());
                if (guide) {
                    total += guide.price;
                }
            }

            // Hotel Booking Price
            const savedHotelBooking = await AsyncStorage.getItem('selectedHotelBooking'); // Use consistent key
            if (savedHotelBooking) {
                const hotelBookingData = JSON.parse(savedHotelBooking);
                const selectedHotel = hotels.find(hotel => hotel.id === hotelBookingData.id); // Find hotel by its ID

                if (selectedHotel) { // Null check for selectedHotel
                    if (selectedHotel.beds && selectedHotel.beds.length >= 2) {
                        const singleBedPrice = selectedHotel.beds.find(bed => bed.type === 'single')?.price || 0;
                        const doubleBedPrice = selectedHotel.beds.find(bed => bed.type === 'double')?.price || 0;
                        const numSingle = Number(hotelBookingData.s || 0); // Use s from stored data
                        const numDouble = Number(hotelBookingData.d || 0); // Use d from stored data
                        total += (singleBedPrice * numSingle) + (doubleBedPrice * numDouble);
                    }
                }
            }

            setTotal(total.toString());
        } catch (error) {
            console.error('Error calculating total price from AsyncStorage:', error);
            setTotal('0');
        }
    };


    useFocusEffect(
        useCallback(() => {

            count()

        }, [selectedCardIndex, total])
    )


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

                                        <TouchableOpacity onPress={() => router.push(`/views/guide/group/${Number(x.id) + 1}`)}>

                                            <View className='h-full py-3 justify-between'>
                                                <View className="w-full absolute items-end pr-1 z-10">
                                                    <TouchableOpacity
                                                        className="justify-center items-center w-6 h-6 rounded-full bg-gray-200"
                                                        onPress={() => toggleCardSelection(index)}
                                                    >
                                                        {selectedCardIndex === index + 1 && (
                                                            <Image className='w-4 h-4' source={mark} />
                                                        )}
                                                    </TouchableOpacity>
                                                </View>
                                                <View className='flex-row gap-5 px-3 w-44'>

                                                    <Image
                                                        className='w-[50px] h-[50px] rounded-full'
                                                        source={x.image}
                                                        contentFit="cover"
                                                    />
                                                    <View className=''>
                                                        <Text className="text-md font-semibold w-24 max-h-12 pt-2">{x.title}</Text>
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
