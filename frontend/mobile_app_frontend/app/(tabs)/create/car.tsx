import { Text, View, ScrollView, TouchableOpacity, Modal, TextInput } from 'react-native';
import { useState, useCallback, useEffect } from 'react';
import { Calendar } from 'react-native-calendars';
import { cssInterop } from 'nativewind';
import { Image } from 'expo-image';
import { useRouter, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SimpleTimePicker from '../../../components/TimeSelector';

cssInterop(Image, { className: "style" });

const pic = require('../../../assets/images/tabbar/tuktuk.png')
const bus = require('../../../assets/images/tabbar/bus.png')
const ac = require('../../../assets/images/tabbar/ac.png')
const car = require('../../../assets/images/tabbar/car.png')
const mini = require('../../../assets/images/tabbar/mini.png')
const sport = require('../../../assets/images/tabbar/sport.png')
const p = require('../../../assets/images/user2.png')
const t = require('../../../assets/images/tag.png')
const mark = require('../../../assets/images/mark.png')

export default function App() {
    const router = useRouter();

    const hotels = [
        { id: '1', image: pic, title: 'Shangri-La', stars: 3, price: 1000 },
        { id: '2', image: pic, title: 'Bawana', stars: 1, price: 1000 },
        { id: '3', image: pic, title: 'Matara bath kade', stars: 2, price: 1000 },
        { id: '4', image: pic, title: 'Raheema', stars: 5, price: 1000 },
    ];

    const guides = [
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

    const categories = [
        {
            id: '1',
            image: pic,
            members: 2,
            title: 'Tuk',
            price: 100
        },
        {
            id: '2',
            image: mini,
            members: 3,
            title: 'Mini',
            price: 200
        },
        {
            id: '3',
            image: sport,
            members: 4,
            title: 'Seddan',
            price: 250
        },
        {
            id: '4',
            image: car,
            members: 5,
            title: 'Van',
            price: 350
        },
        {
            id: '5',
            image: bus,
            members: 54,
            title: 'Non A/C',
            price: 5000
        },
        {
            id: '6',
            image: ac,
            members: 35,
            title: 'A/C',
            price: 15000
        }
    ]

    const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(null);
    const [isModalVisible, setModalVisible] = useState(false);
    const [selectedDates, setSelectedDates] = useState<{ [key: string]: { selected: boolean; selectedColor: string } }>({});
    const [locationx, setLocationx] = useState('');
    const [location, setLocation] = useState('');
    const [lan, setLan] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [showDropdowns, setShowDropdowns] = useState(false);
    const [show, setShow] = useState(false);
    const [fine, setFine] = useState(false);
    const [selectedTime, setSelectedTime] = useState({ hour: 12, minute: 30 });
    const [total, setTotal] = useState('')

    const locations = ['Colombo', 'Kandy', 'Galle', 'Nuwara Eliya', 'Jaffna'];
    const languages = ['English', 'Korean', 'Russian', 'Japanese', 'Sinhala'];

    const onDayPress = (day: { dateString: string }) => {
        setSelectedDates((prev) => {
            const date = day.dateString;
            const updated = { ...prev };
            if (updated[date]) {
                delete updated[date];
            } else {
                updated[date] = { selected: true, selectedColor: '#007BFF' };
            }
            return updated;
        });
    };

    const handleSubmit = async () => {
        if (Object.keys(selectedDates).length === 0 || !location || !locationx || !lan || !selectedTime) {
            alert('Please fill in all fields.');
            return;
        }
        const newBooking = [{ dates: Object.keys(selectedDates), start: location, end: locationx, language: lan, time: selectedTime }];
        try {
            const bookingString = JSON.stringify(newBooking);
            await AsyncStorage.setItem('cbookings', bookingString);
            await AsyncStorage.setItem('cbookingComplete', 'true');
            await AsyncStorage.setItem('bookingSession', Date.now().toString());

            const savedBookings = await AsyncStorage.getItem('cbookings');
            if (savedBookings) {
                console.log('Successfully saved bookings:', savedBookings);
                setModalVisible(false);
                setFine(true);
                // alert('Booking saved successfully!');
            } else {
                alert('Failed to confirm booking save. Please try again.');
            }
        } catch (error) {
            alert(`Error saving booking to AsyncStorage: ${error}`);
        }
    };

    const handleCategoryNavigation = async (categoryId: string) => {
        try {
            await AsyncStorage.setItem('car', categoryId);
            router.push(`/views/car/list/${Number(categoryId)}`);
        } catch (error) {
            console.error('Error setting car category:', error);

        }
    };

    const toggleCardSelection = useCallback((index: number) => {
        let newIndex: number | null = null;
        setSelectedCardIndex(prev => {
            newIndex = prev === index ? null : index;
            return newIndex;
        });
        // Update AsyncStorage after state change
        const updateStorage = async () => {
            try {
                await AsyncStorage.setItem('car', newIndex !== null ? (newIndex + 1).toString() : '');
            } catch (error) {
                console.error('Error saving selectedCardIndex to AsyncStorage:', error);
            }
        };
        updateStorage();
    }, []);

    const displayDates = Object.keys(selectedDates)
        .sort()
        .map(date => new Date(date).toDateString())
        .join(', ');

    const loadBookingData = async () => {
        try {
            const sessionExists = await AsyncStorage.getItem('bookingSession');
            const bookingComplete = await AsyncStorage.getItem('cbookingComplete');
            const savedIndex = await AsyncStorage.getItem('car');

            if (savedIndex) {
                setSelectedCardIndex(Number(savedIndex) - 1); // Persist selected category
            }

            if (!sessionExists) {
                // No session exists, create a new one and show modal
                await AsyncStorage.setItem('bookingSession', Date.now().toString());
                setModalVisible(true);
            } else if (bookingComplete === 'true') {
                // Booking is complete, load saved data and hide modal
                setModalVisible(false);
                setFine(true);
                const savedBookings = await AsyncStorage.getItem('cbookings');
                if (savedBookings) {
                    const bookingData = JSON.parse(savedBookings)[0];
                    if (bookingData) {
                        // Reconstruct selectedDates object from saved dates array
                        const dates = bookingData.dates.reduce((acc: any, date: string) => {
                            acc[date] = { selected: true, selectedColor: '#007BFF' };
                            return acc;
                        }, {});
                        setSelectedDates(dates);
                        setLocation(bookingData.start);
                        setLocationx(bookingData.end);
                        setLan(bookingData.language);
                        setSelectedTime(bookingData.time);
                    }
                }
            } else {
                // Session exists but booking not complete, show modal
                setModalVisible(true);
            }
        } catch (error) {
            console.error('Error loading data from AsyncStorage:', error);
            setModalVisible(true); // Default to showing modal on error
        }
    };

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
                const category = categories.find(cat => cat.id === (Number(carIndex) - 1).toString());
                if (category) {
                    total += category.price;
                }
            }

            // Guide Booking Price
            const guideIndex = await AsyncStorage.getItem('guide');
            if (guideIndex !== null && guideIndex >= '0') {
                const guide = guides.find(guide => guide.id === (Number(guideIndex) - 1).toString());
                if (guide) {
                    total += guide.price;
                }
            }

            // Hotel Booking Price
            const hotelIndex = await AsyncStorage.getItem('hotel');
            if (hotelIndex) {
                const hotel = hotels.find(hotel => hotel.id === (Number(hotelIndex) - 1).toString());
                if (hotel) {
                    total += hotel.price;
                }
            }

            setTotal(total.toString());
        } catch (error) {
            console.error('Error calculating total price from AsyncStorage:', error);
            setTotal('0');
        }

    }


    useFocusEffect(
        useCallback(() => {

            count()

        }, [selectedCardIndex, total])
    )

    return (
        <View className='bg-[#F2F5FA] h-full'>
            <Modal
                animationType="fade"
                transparent={true}
                visible={isModalVisible}
                onRequestClose={() => {
                    if (fine) {
                        setModalVisible(false);
                    }
                }}
            >
                <View className="h-full justify-center items-center bg-black/50">
                    <View className="w-[93%] h-[97%] bg-white my-4 p-6 rounded-2xl shadow-lg items-center">
                        <View className='w-full'>

                            <TouchableOpacity onPress={() => { setModalVisible(false); if (!fine || Object.keys(selectedDates).length === 0) router.back() }}>
                                {(fine && Object.keys(selectedDates).length !== 0) ? <Text> Cancel</Text> : <Text> Back</Text>}
                            </TouchableOpacity>
                            <Text className="text-xl font-bold mb-8 text-center">Vehicle Booking</Text>
                        </View>
                        <View className="w-full h-[93%] justify-between pb-3">
                            <View className='h-[73%]'>
                                <Calendar
                                    onDayPress={onDayPress}
                                    markedDates={selectedDates}
                                    minDate={new Date().toISOString().split('T')[0]}
                                    theme={{ todayTextColor: '#007BFF', arrowColor: '#007BFF' }}
                                />
                                <View className="w-full z-20 pb-32 gap-1 mt-2">
                                    <View className='flex-row justify-between'>
                                        <View className='w-[47%]'>
                                            <TouchableOpacity onPress={() => { setShowDropdowns(!showDropdowns); if (show) setShow(false); if (showDropdown) setShowDropdown(false) }} className="border border-gray-300 rounded-xl px-4 py-3 bg-white">
                                                <Text className={`text-sm ${locationx ? 'text-black' : 'text-gray-400'}`}>{locationx || 'Select Start Location'}</Text>
                                            </TouchableOpacity>
                                            {showDropdowns && (
                                                <View className="absolute top-[42px] bg-white border border-gray-300 rounded-xl z-30 max-h-40 w-full">
                                                    <ScrollView>{locations.map((loc, index) => (loc != location &&
                                                        <TouchableOpacity key={index} onPress={() => { setLocationx(loc); setShowDropdowns(false); }} className={`px-4 py-2 ${locationx === loc ? 'bg-blue-100' : ''}`}><Text className="text-base">{loc}</Text></TouchableOpacity>
                                                    ))}</ScrollView>
                                                </View>
                                            )}
                                        </View>
                                        <View className='w-[47%]'>
                                            <TouchableOpacity onPress={() => { setShowDropdown(!showDropdown); if (show) setShow(false); if (showDropdowns) setShowDropdowns(false) }} className="border border-gray-300 rounded-xl px-4 py-3 bg-white">
                                                <Text className={`text-sm ${location ? 'text-black' : 'text-gray-400'}`}>{location || 'Select End Location'}</Text>
                                            </TouchableOpacity>
                                            {showDropdown && (
                                                <View className="absolute top-[42px] bg-white border border-gray-300 rounded-xl z-30 max-h-40 w-full">
                                                    <ScrollView>{locations.map((loc, index) => (loc != locationx &&
                                                        <TouchableOpacity key={index} onPress={() => { setLocation(loc); setShowDropdown(false); }} className={`px-4 py-2 ${location === loc ? 'bg-blue-100' : ''}`}><Text className="text-base">{loc}</Text></TouchableOpacity>
                                                    ))}</ScrollView>
                                                </View>
                                            )}
                                        </View>
                                    </View>
                                    <TouchableOpacity onPress={() => { setShow(!show); if (showDropdown) setShowDropdown(false); if (showDropdowns) setShowDropdowns(false); }} className="border border-gray-300 rounded-xl px-4 py-3 bg-white">
                                        <Text className={`text-base ${lan ? 'text-black' : 'text-gray-400'}`}>{lan || 'Select Language'}</Text>
                                    </TouchableOpacity>
                                    {show && (
                                        <View className="absolute top-[90px] left-4 right-4 bg-white border border-gray-300 rounded-xl z-30 max-h-40">
                                            <ScrollView>{languages.map((l, index) => (
                                                <TouchableOpacity key={index} onPress={() => { setLan(l); setShow(false); }} className={`px-4 py-2 ${lan === l ? 'bg-blue-100' : ''}`}><Text className="text-base">{l}</Text></TouchableOpacity>
                                            ))}</ScrollView>
                                        </View>
                                    )}
                                </View>
                            </View>
                            <View className='h-[25%] justify-between'>
                                <View>
                                    <Text>Choose a time</Text>
                                    <SimpleTimePicker onTimeChange={setSelectedTime} />
                                </View>
                                <View className="w-full">
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
            </Modal>

            {/* <View className='bg-[#F2F5FA] h-full'> */}
            {fine && (

                <View className="flex-row justify-between items-center p-5">
                    <Text className="text-lg font-medium">{displayDates}</Text>
                    <TouchableOpacity onPress={() => setModalVisible(true)} className="bg-gray-200 py-2 px-4 rounded-lg">
                        <Text className="font-semibold text-blue-600">Change</Text>
                    </TouchableOpacity>
                </View>
            )}

            <View>
                <ScrollView
                    className="w-full h-[80%]"
                    contentContainerClassName="flex-row flex-wrap justify-center items-start gap-5 py-6"
                    showsVerticalScrollIndicator={false}
                >
                    {categories.map((x, i) => {
                        return (
                            <View key={i}>
                                <View className="w-full flex-row absolute justify-end pr-1 pt-1 z-10">
                                    <TouchableOpacity
                                        className="w-6 h-6 rounded-full justify-center items-center bg-gray-200 border-2"
                                        onPress={() => toggleCardSelection(i + 1)}
                                    >
                                        {Number(selectedCardIndex) - 1 === i && (
                                            <Image className='w-4 h-4' source={mark} />
                                        )}
                                    </TouchableOpacity>
                                </View>
                                <View className="bg-[#d9d9d98e] w-[150px] h-[140px] items-center py-2 rounded-2xl">
                                    <Image
                                        className="w-[70px] h-[60px]"
                                        source={x.image}
                                    />
                                    <View>
                                        <View className='flex-row items-center gap-4'>
                                            <Image
                                                className="w-[11px] h-[11px]"
                                                source={p}
                                            />
                                            <Text className=" text-[13px] italic text-center">
                                                {x.members} Members
                                            </Text>
                                        </View>
                                        <View className='flex-row items-center gap-4 my-1'>
                                            <Image
                                                className="w-[11px] h-[11px]"
                                                source={t}
                                            />
                                            <Text className=" text-[13px] italic text-center">
                                                {x.title}
                                            </Text>
                                        </View>
                                    </View>
                                    <TouchableOpacity onPress={() => handleCategoryNavigation((Number(x.id) + 1).toString())}>
                                        <View className="rounded-md bg-black justify-center w-32 h-5 items-center" >
                                            <Text className=" text-white font-semibold text-[12px]">{x.price}.00 LKR/1km</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>)
                    })
                    }
                </ScrollView>
            </View>
            <View className=" border-t border-gray-200 bg-white py-4 h-[30%] pl-32 flex-row justify-center">
                {

                    <Text className="text-center font-bold text-lg">{total}.00 LKR</Text>

                }{/* </View> */}
                <TouchableOpacity onPress={() => { alert('plan created'); router.replace('/(tabs)') }}><View className='ml-6 bg-[#FEFA17] py-1 px-4 rounded-xl'><Text>Create Plan</Text></View></TouchableOpacity>
            </View>
        </View>
    );
}
