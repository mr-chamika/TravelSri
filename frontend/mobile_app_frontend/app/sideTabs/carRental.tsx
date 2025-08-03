import { Text, KeyboardAvoidingView, Platform, View, ScrollView, TouchableOpacity, Modal, TextInput } from 'react-native';
import { useState, useCallback, useEffect, useMemo } from 'react';
import { Calendar } from 'react-native-calendars';
import { cssInterop } from 'nativewind';
import { Image } from 'expo-image';
import { useRouter, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { jwtDecode } from 'jwt-decode';

interface MyToken {
    sub: string;
    roles: string[];
    username: string;
    email: string;
    id: string
}

cssInterop(Image, { className: "style" });

const pic = require('../../assets/images/tabbar/tuktuk.png');
const bus = require('../../assets/images/tabbar/bus.png');
const ac = require('../../assets/images/tabbar/ac.png');
const car = require('../../assets/images/tabbar/car.png');
const mini = require('../../assets/images/tabbar/mini.png');
const sport = require('../../assets/images/tabbar/sport.png');
const p = require('../../assets/images/user2.png');
const t = require('../../assets/images/tag.png');
const mark = require('../../assets/images/mark.png');

interface BookO {
    dates: string[];
    loc: string;
    ad: string;
    ch: string;
    ni: string;
    s: string;
    d: string
}
interface BookG {
    dates: string[];
    loc: string;
    lan: string;
}

interface Form {

    //index.tsx (select a route)
    routeId: string;
    creatorId: string;

    //hotel.tsx(select dates, locaton, no of children, no of adults, no of nights, no of single beds, no of double beds)
    hotelId: string;
    singleBeds: number;
    doubleBeds: number;
    hdatesBooked: string[];
    hlocation: string;
    adults: number;
    children: number;
    nights: number;
    hprice: number;

    //guide.tsx (select dates, location, language)

    guideId: string;
    gdatesBooked: string[];
    glocation: string;
    glanguage: string;
    gprice: number;


    //car.tsx (select dates, location, language)

    carId: string;
    cdatesBooked: string[];
    startLocation: string;
    endLocation: string;
    clanguage: string;
    bookedTime: string;
    cprice: number;


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

export default function App() {
    const router = useRouter();

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
        dates: string[];
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

                const minimalCars = data.map((car: Car) => ({
                    id: car._id,
                    price: car.price,
                }));
                await AsyncStorage.setItem('cars', JSON.stringify(minimalCars))
                //console.log(data)
                setCategories(data)
            }



        } catch (err) {

            console.log(err)

        }

    }
    useEffect(() => {
        x();
    }, [])

    const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
    const [isModalVisible, setModalVisible] = useState(false);
    const [selectedDates, setSelectedDates] = useState<string[]>([]);
    const [startLocation, setStartLocation] = useState('');
    const [endLocation, setEndLocation] = useState('');
    const [language, setLanguage] = useState('');
    const [isOneway, setOneWay] = useState(false);
    const [isBookingComplete, setIsBookingComplete] = useState(false);
    const [selectedTime, setSelectedTime] = useState({ hour: 12, minute: 30 });
    const [bookingData, setBookingData] = useState<Book | null>(null);
    const [total, setTotal] = useState('');
    const [time, setTime] = useState('')
    const [guides, setGuides] = useState<g[]>([])
    const [hotels, setHotels] = useState<H[]>([])
    const [categories, setCategories] = useState<Cat[]>([])

    const [hotelId, setHotelId] = useState<string | null>(null)
    const [guideId, setGuideId] = useState<string | null>(null)
    const [submitForm, setSubmitForm] = useState<Form>({

        routeId: '',
        creatorId: '',

        //hotel.tsx(select dates, locaton, no of children, no of adults, no of nights, no of single beds, no of double beds)
        hotelId: '',
        singleBeds: 0,
        doubleBeds: 0,
        hdatesBooked: [],
        hlocation: '',
        adults: 0,
        children: 0,
        nights: 0,
        hprice: 0,

        //guide.tsx (select dates, location, language)

        guideId: '',
        gdatesBooked: [],
        glocation: '',
        glanguage: '',
        gprice: 0,

        //car.tsx (select dates, location, language)

        carId: '',
        cdatesBooked: [],
        startLocation: '',
        endLocation: '',
        clanguage: '',
        bookedTime: '',
        cprice: 0


    })
    const [catPrice, setCatPrice] = useState(0);
    const [guidePrice, setGuidePrice] = useState(0);
    const [hotelPrice, setHotelPrice] = useState(0);
    var m = ''

    const onDayPress = (day: { dateString: string }) => {
        const date = day.dateString;
        // ✅ UPDATE this logic
        setSelectedDates((currentDates) => {
            if (currentDates.includes(date)) {
                // If date exists, remove it
                return currentDates.filter((d) => d !== date);
            } else {
                // Otherwise, add the new date
                return [...currentDates, date];
            }
        });
    };

    const markedDates = useMemo(() => {
        // ✅ FIX: Check if selectedDates is an array before using .reduce()
        if (!Array.isArray(selectedDates)) {
            return {}; // Return an empty object if it's not an array
        }

        return selectedDates.reduce((acc, date) => {
            acc[date] = { selected: true, selectedColor: '#007BFF' };
            return acc;
        }, {} as { [key: string]: { selected: boolean; selectedColor: string } });
    }, [selectedDates]);
    const handleSubmit = async () => {
        // 1. Validate that all required fields are filled
        if (Object.keys(selectedDates).length === 0 || !startLocation.trim() || !endLocation.trim() || !language.trim() || !time) {
            alert('Please fill in all fields before submitting.');
            return;
        }

        // 2. Create the final booking object with all the data
        const newBooking = {
            dates: selectedDates, // Converts the dates object to a string array
            start: startLocation,
            end: endLocation,
            language: language,
            time: time,
            oneWay: isOneway, // Include the one-way trip status
        };

        // 3. Update the component's state to reflect the completed booking
        setBookingData(newBooking);
        setModalVisible(false);
        setIsBookingComplete(true);

        console.log(newBooking)

        // 4. Save the booking data to AsyncStorage for persistence
        try {
            await AsyncStorage.setItem('cbookings', JSON.stringify(newBooking));
            await AsyncStorage.setItem('cbookingComplete', 'true');
            await AsyncStorage.setItem('cbookingSession', Date.now().toString());
        } catch (error) {
            alert(`Error saving your booking. Please try again. Error: ${error}`);
        }
    };
    const handleCategoryNavigation = async (categoryId: string) => {
        try {
            await AsyncStorage.setItem('car', categoryId);
            router.push(`/views/car/solo/list/${categoryId}`);
        } catch (error) {
            console.error('Error setting car category:', error);
        }
    };

    const toggleCardSelection = useCallback((index: string) => {
        let newIndex: string | null = null;
        setSelectedCardId(prev => {
            newIndex = prev === index ? null : index;
            return newIndex;
        });
        // Update AsyncStorage after state change
        const updateStorage = async (selectedIndex: string | null) => {
            try {
                if (categories) {

                    await AsyncStorage.setItem('car', newIndex !== null ? newIndex : '');

                } else {

                    await AsyncStorage.removeItem('car');

                }
            } catch (error) {
                console.error('Error saving selectedCardIndex to AsyncStorage:', error);
            }
        };
        updateStorage(newIndex);
        return newIndex;
    }, [categories, selectedCardId]);

    const displayDates =
        (Array.isArray(selectedDates) && selectedDates.length > 0)
            ? selectedDates
                .sort()
                .map(date => new Date(date).toDateString())
                .join(', ')
            : '';

    const loadBookingData = useCallback(async () => {
        try {
            const sessionExists = await AsyncStorage.getItem('cbookingSession');
            const bookingCompleteStatus = await AsyncStorage.getItem('cbookingComplete');
            const savedSelectedCarId = await AsyncStorage.getItem('car');
            const guideData = await AsyncStorage.getItem('guides')

            setGuides(guideData ? JSON.parse(guideData) : [])

            const hotelData = await AsyncStorage.getItem('hotels')
            setHotels(hotelData ? JSON.parse(hotelData) : [])

            setSelectedCardId(null);
            setSelectedDates([]);
            setIsBookingComplete(false);
            setBookingData(null);
            setLanguage('');
            setStartLocation('');
            setEndLocation('');
            setTime('')
            setModalVisible(true)

            if (savedSelectedCarId) {
                setSelectedCardId(savedSelectedCarId);
            }

            if (sessionExists && bookingCompleteStatus === 'true') {
                setModalVisible(false);
                setIsBookingComplete(true);
                const savedBooking = await AsyncStorage.getItem('cbookings');
                if (savedBooking) {
                    const parsedBooking: Book = JSON.parse(savedBooking);
                    setBookingData(parsedBooking);
                    if (Array.isArray(parsedBooking.dates)) {
                        setSelectedDates(parsedBooking.dates);
                    }

                    setStartLocation(parsedBooking.start);
                    setEndLocation(parsedBooking.end);
                    setLanguage(parsedBooking.language);
                    setTime(parsedBooking.time); setStartLocation(parsedBooking.start);
                    setEndLocation(parsedBooking.end);
                    setLanguage(parsedBooking.language);
                    //setSelectedTime(parsedBooking.time);
                    setTime(parsedBooking.time)
                }

            } else {
                await AsyncStorage.setItem('cbookingSession', Date.now().toString());
                setModalVisible(true);
                setIsBookingComplete(false);
            }
        } catch (error) {
            console.error('Error loading data from AsyncStorage:', error);

            setSelectedCardId(null);
            setSelectedDates([]);
            setModalVisible(true);
            setIsBookingComplete(false);
            setBookingData(null);
            setLanguage('');
            setTime('')
            setStartLocation('');
            setEndLocation('');
        }
    }, []);

    return (
        <View className='bg-[#F2F5FA] h-full'>

            <Text className='text-xl font-bold p-4'>Select a Category</Text>

            <View className='flex-1'>
                <ScrollView
                    className="w-full flex-1"
                    contentContainerClassName="flex-row flex-wrap justify-center items-start gap-10 py-6"
                    showsVerticalScrollIndicator={false}
                >
                    {categories.map((x, i) => {
                        return (
                            <TouchableOpacity onPress={() => handleCategoryNavigation(x._id)} key={x._id}>
                                <View className="w-full flex-row absolute justify-end pr-1 pt-1 z-10">
                                    {/* <TouchableOpacity
                                                className="w-6 h-6 rounded-full justify-center items-center bg-gray-200 border-2"
                                                onPress={() => toggleCardSelection(x._id)}
                                            >
                                                {selectedCardId === x._id && (
                                                    <Image className='w-4 h-4' source={mark} />
                                                )}
                                            </TouchableOpacity> */}
                                </View>
                                <View className="bg-[#d9d9d98e] w-[160px] h-[200px] items-center py-5 rounded-2xl">
                                    <Image
                                        className="w-[150px] h-[100px]"
                                        source={{ uri: `data:image/jpeg;base64,${x.image}` }}
                                    />
                                    <View className='pt-2'>
                                        <View className='flex-row items-center gap-4'>
                                            <Image
                                                className="w-[15px] h-[15px]"
                                                source={p}
                                            />
                                            <Text className=" text-md italic text-center">
                                                {x.members} Members
                                            </Text>
                                        </View>
                                        <View className='flex-row items-center gap-4 my-1'>
                                            <Image
                                                className="w-[15px] h-[15px]"
                                                source={t}
                                            />
                                            <Text className=" text-md italic text-center">
                                                {x.title}
                                            </Text>
                                        </View>
                                    </View>
                                    <TouchableOpacity onPress={() => handleCategoryNavigation(x._id)}>
                                        <View className="rounded-md bg-black justify-center w-32 h-5 items-center" >
                                            <Text className=" text-white font-semibold text-[12px]">{x.price}.00 LKR/1km</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </TouchableOpacity>)
                    })}
                </ScrollView>



            </View>
        </View>
    );
}