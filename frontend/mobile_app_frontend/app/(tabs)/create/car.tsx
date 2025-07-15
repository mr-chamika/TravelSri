import { Text, View, ScrollView, TouchableOpacity, Modal, TextInput } from 'react-native';
import { useState, useCallback, useEffect } from 'react';
import { Calendar } from 'react-native-calendars';
import { cssInterop } from 'nativewind';
import { Image } from 'expo-image';
import { useRouter, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SimpleTimePicker from '../../../components/TimeSelector';


cssInterop(Image, { className: "style" });

const pic = require('../../../assets/images/tabbar/tuktuk.png');
const bus = require('../../../assets/images/tabbar/bus.png');
const ac = require('../../../assets/images/tabbar/ac.png');
const car = require('../../../assets/images/tabbar/car.png');
const mini = require('../../../assets/images/tabbar/mini.png');
const sport = require('../../../assets/images/tabbar/sport.png');
const p = require('../../../assets/images/user2.png');
const t = require('../../../assets/images/tag.png');
const mark = require('../../../assets/images/mark.png');

export default function App() {
    const router = useRouter();

    interface Book {
        dates: string[];
        start: string;
        end: string;
        language: string;
        time: { hour: number; minute: number };
    }

    const hotels = [
        { id: '1', image: pic, title: 'Shangri-La', stars: 3, price: 1000, beds: [{ type: 'double', price: 1000 }, { type: 'single', price: 500 }] },
        { id: '2', image: pic, title: 'Bawana', stars: 1, price: 2000, beds: [{ type: 'double', price: 1000 }, { type: 'single', price: 500 }] },
        { id: '3', image: pic, title: 'Matara bath kade', stars: 2, price: 3000, beds: [{ type: 'double', price: 1000 }, { type: 'single', price: 500 }] },
        { id: '4', image: pic, title: 'Raheema', stars: 5, price: 4000, beds: [{ type: 'double', price: 1000 }, { type: 'single', price: 500 }] },
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
    ];

    const [selectedCardId, setSelectedCardId] = useState<number | null>(null);
    const [isModalVisible, setModalVisible] = useState(false);
    const [selectedDates, setSelectedDates] = useState<{ [key: string]: { selected: boolean; selectedColor: string } }>({});
    const [startLocation, setStartLocation] = useState('');
    const [endLocation, setEndLocation] = useState('');
    const [language, setLanguage] = useState('');
    const [showStartDropdown, setShowStartDropdown] = useState(false);
    const [showEndDropdown, setShowEndDropdown] = useState(false);
    const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
    const [isBookingComplete, setIsBookingComplete] = useState(false);
    const [selectedTime, setSelectedTime] = useState({ hour: 12, minute: 30 });
    const [bookingData, setBookingData] = useState<Book | null>(null);
    const [total, setTotal] = useState('');

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
        if (Object.keys(selectedDates).length === 0 || !startLocation || !endLocation || !language /* || !selectedTime */) {
            alert('Please fill in all fields.');
            return;
        }
        const newBooking: Book = { dates: Object.keys(selectedDates), start: startLocation, end: endLocation, language: language, time: selectedTime };
        setBookingData(newBooking);
        setModalVisible(false);
        setIsBookingComplete(true);
        try {
            await AsyncStorage.setItem('cbookings', JSON.stringify(newBooking));
            await AsyncStorage.setItem('cbookingComplete', 'true');
            await AsyncStorage.setItem('cbookingSession', Date.now().toString());
        } catch (error) {
            alert(`Error saving booking to AsyncStorage: ${error}`);
        }
    };

    const handleCategoryNavigation = async (categoryId: string) => {
        try {
            await AsyncStorage.setItem('car', categoryId);
            router.push(`/views/car/list/${categoryId}`);
        } catch (error) {
            console.error('Error setting car category:', error);
        }
    };

    const toggleCardSelection = useCallback((index: number) => {
        let newIndex: number | null = null;
        setSelectedCardId(prev => {
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

    const loadBookingData = useCallback(async () => {
        try {
            const sessionExists = await AsyncStorage.getItem('cbookingSession');
            const bookingCompleteStatus = await AsyncStorage.getItem('cbookingComplete');
            const savedSelectedCarId = await AsyncStorage.getItem('car');

            setSelectedCardId(null);
            setSelectedDates({});
            setIsBookingComplete(false);
            setBookingData(null);
            setLanguage('');
            setStartLocation('');
            setEndLocation('');
            setShowLanguageDropdown(false);
            setShowStartDropdown(false);
            setShowEndDropdown(false);

            if (savedSelectedCarId) {
                setSelectedCardId(Number(savedSelectedCarId) - 1);
            }

            if (sessionExists && bookingCompleteStatus === 'true') {
                setModalVisible(false);
                setIsBookingComplete(true);
                const savedBooking = await AsyncStorage.getItem('cbookings');
                if (savedBooking) {
                    const parsedBooking: Book = JSON.parse(savedBooking);
                    setBookingData(parsedBooking);
                    const dates = parsedBooking.dates.reduce((acc: any, date: string) => {
                        acc[date] = { selected: true, selectedColor: '#007BFF' };
                        return acc;
                    }, {});
                    setSelectedDates(dates);
                    setStartLocation(parsedBooking.start);
                    setEndLocation(parsedBooking.end);
                    setLanguage(parsedBooking.language);
                    setSelectedTime(parsedBooking.time);
                }

            } else {
                await AsyncStorage.setItem('cbookingSession', Date.now().toString());
                setModalVisible(true);
                setIsBookingComplete(false);
            }
        } catch (error) {
            console.error('Error loading data from AsyncStorage:', error);

            setSelectedCardId(null);
            setSelectedDates({});
            setModalVisible(true);
            setIsBookingComplete(false);
            setBookingData(null);
            setLanguage('');
            setStartLocation('');
            setEndLocation('');
            setShowLanguageDropdown(false);
            setShowStartDropdown(false);
            setShowEndDropdown(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            loadBookingData();
        }, [loadBookingData])
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
            count();
        }, [selectedCardId, total])
    );

    const handleCreatePlan = async () => {
        try {
            await AsyncStorage.multiRemove([
                'selectedLocation',
                'hasMadeInitialSelection',
                'hotel',
                'guide',
                'car',
                'hbookings',
                'hbookingComplete',
                'hbookingSession',
                'bookingSession',
                'gbookings',
                'gbookingComplete',
                'gbookingSession',
                'cbookings',
                'cbookingComplete',
                'cbookingSession',
                'bookingSession',
                'total',
                'route',
                'selectedHotelBooking',
                'selectedRouteId',
                'guides',
                'hotels'


            ]);

            setSelectedDates({});
            setIsBookingComplete(false);
            setLanguage('');
            setStartLocation('');
            setEndLocation('');
            setModalVisible(true);
            setSelectedCardId(null);
            setTotal('0');
            setBookingData(null);

            // alert('Plan created and session reset!');
            router.push('/(tabs)/create');
            router.replace('/(tabs)');
        } catch (e) {
            alert(`Error creating plan and resetting session: ${e}`);
            console.error('Error creating plan and resetting session:', e);
        }
    };

    return (
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
                    <View className="w-[93%] h-[97%] bg-white my-4 p-6 rounded-2xl shadow-lg items-center">
                        <View className='w-full'>
                            <TouchableOpacity onPress={() => {
                                if (isBookingComplete) {
                                    setModalVisible(false);
                                } else {
                                    setModalVisible(false);
                                    router.back();
                                }
                            }}>
                                {isBookingComplete ? <Text> Cancel</Text> : <Text> Back</Text>}
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
                                            <TouchableOpacity onPress={() => {
                                                setShowStartDropdown(!showStartDropdown);
                                                setShowEndDropdown(false);
                                                setShowLanguageDropdown(false);
                                            }} className="border border-gray-300 rounded-xl px-4 py-3 bg-white">
                                                <Text className={`text-sm ${startLocation ? 'text-black' : 'text-gray-400'}`}>{startLocation || 'Select Start Location'}</Text>
                                            </TouchableOpacity>
                                            {showStartDropdown && (
                                                <View className="absolute top-[42px] bg-white border border-gray-300 rounded-xl z-30 max-h-40 w-full">
                                                    <ScrollView>{locations.map((loc, index) => (loc !== endLocation &&
                                                        <TouchableOpacity key={index} onPress={() => { setStartLocation(loc); setShowStartDropdown(false); }} className={`px-4 py-2 ${startLocation === loc ? 'bg-blue-100' : ''}`}><Text className="text-base">{loc}</Text></TouchableOpacity>
                                                    ))}</ScrollView>
                                                </View>
                                            )}
                                        </View>
                                        <View className='w-[47%]'>
                                            <TouchableOpacity onPress={() => {
                                                setShowEndDropdown(!showEndDropdown);
                                                setShowStartDropdown(false);
                                                setShowLanguageDropdown(false);
                                            }} className="border border-gray-300 rounded-xl px-4 py-3 bg-white">
                                                <Text className={`text-sm ${endLocation ? 'text-black' : 'text-gray-400'}`}>{endLocation || 'Select End Location'}</Text>
                                            </TouchableOpacity>
                                            {showEndDropdown && (
                                                <View className="absolute top-[42px] bg-white border border-gray-300 rounded-xl z-30 max-h-40 w-full">
                                                    <ScrollView>{locations.map((loc, index) => (loc !== startLocation &&
                                                        <TouchableOpacity key={index} onPress={() => { setEndLocation(loc); setShowEndDropdown(false); }} className={`px-4 py-2 ${endLocation === loc ? 'bg-blue-100' : ''}`}><Text className="text-base">{loc}</Text></TouchableOpacity>
                                                    ))}</ScrollView>
                                                </View>
                                            )}
                                        </View>
                                    </View>
                                    <TouchableOpacity onPress={() => {
                                        setShowLanguageDropdown(!showLanguageDropdown);
                                        setShowStartDropdown(false);
                                        setShowEndDropdown(false);
                                    }} className="border border-gray-300 rounded-xl px-4 py-3 bg-white">
                                        <Text className={`text-base ${language ? 'text-black' : 'text-gray-400'}`}>{language || 'Select Language'}</Text>
                                    </TouchableOpacity>
                                    {showLanguageDropdown && (
                                        <View className="absolute top-[90px] left-4 right-4 bg-white border border-gray-300 rounded-xl z-30 max-h-40">
                                            <ScrollView>{languages.map((l, index) => (
                                                <TouchableOpacity key={index} onPress={() => { setLanguage(l); setShowLanguageDropdown(false); }} className={`px-4 py-2 ${language === l ? 'bg-blue-100' : ''}`}><Text className="text-base">{l}</Text></TouchableOpacity>
                                            ))}</ScrollView>
                                        </View>
                                    )}
                                </View>
                            </View>
                            <View className='h-[25%] justify-between'>
                                <View>
                                    <Text>Choose a time</Text>
                                    {/* <SimpleTimePicker onTimeChange={setSelectedTime} /> */}
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

            {isBookingComplete && (
                <>
                    <View className="flex-row justify-between items-center p-4 mb-1.5">
                        <Text className="text-lg font-medium">{displayDates}</Text>
                        <TouchableOpacity onPress={() => setModalVisible(true)} className="bg-gray-200 py-2 px-4 rounded-lg">
                            <Text className="font-semibold text-blue-600">Change</Text>
                        </TouchableOpacity>
                    </View>


                    <View>
                        <ScrollView
                            className="w-full h-[80%]"
                            contentContainerClassName="flex-row flex-wrap justify-center items-start gap-5 py-6"
                            showsVerticalScrollIndicator={false}
                        >
                            {categories.map((x, i) => {
                                return (
                                    <TouchableOpacity onPress={() => handleCategoryNavigation(x.id)} key={x.id}>
                                        <View className="w-full flex-row absolute justify-end pr-1 pt-1 z-10">
                                            <TouchableOpacity
                                                className="w-6 h-6 rounded-full justify-center items-center bg-gray-200 border-2"
                                                onPress={() => toggleCardSelection(i)}
                                            >
                                                {selectedCardId === i && (
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
                                            <TouchableOpacity onPress={() => handleCategoryNavigation(x.id)}>
                                                <View className="rounded-md bg-black justify-center w-32 h-5 items-center" >
                                                    <Text className=" text-white font-semibold text-[12px]">{x.price}.00 LKR/1km</Text>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                    </TouchableOpacity>)
                            })}
                        </ScrollView>
                    </View>
                    <View className=" border-t border-gray-200 bg-white py-4 h-[30%] pl-32 flex-row justify-center">
                        <Text className="text-center font-bold text-lg">{total}.00 LKR</Text>
                        <TouchableOpacity onPress={handleCreatePlan}><View className='ml-6 bg-[#FEFA17] py-1 px-4 rounded-xl'><Text>Create Plan</Text></View></TouchableOpacity>
                    </View>
                </>

            )}
        </View>
    );
}