import { Text, View, ScrollView, TouchableOpacity, Modal, TextInput } from 'react-native';
import { useState, useCallback, useEffect } from 'react';
import { cssInterop } from 'nativewind';
import { Image } from 'expo-image';
import { useRouter, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
interface Postdata {

    dayNumber: string,
    date: string,
    adults: string,
    children: string

}
interface MyToken {
    sub: string;
    roles: string[];
    username: string;
    email: string;
    id: string
}

cssInterop(Image, { className: "style" });

const p = require('../../assets/images/user2.png');
const t = require('../../assets/images/tag.png');
const mark = require('../../assets/images/mark.png');

interface BookO {
    ad: string;
    ch: string;
    s: string;
    d: string
}
interface BookG {
    loc: string;
    lan: string;
    type: string;
}

interface Form {

    //index.tsx (select a route)
    routeId: string;
    creatorId: string;
    date: string;

    //hotel.tsx(select dates, locaton, no of children, no of adults, no of nights, no of single beds, no of double beds)
    hotelId: string;
    singleBeds: number;
    doubleBeds: number;
    adults: number;
    children: number;
    hprice: number;

    //guide.tsx (select dates, location, language)

    guideId: string;
    glocation: string;
    glanguage: string;
    gprice: number;
    type: string;


    //car.tsx (select dates, location, language)

    carId: string;
    startLocation: string;
    endLocation: string;
    clanguage: string;
    bookedTime: string;
    cprice: number;
    isOneway: boolean;


}

interface Postdata {

    dayNumber: string,
    date: string,
    adults: string,
    children: string

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
    const [selectedDates, setSelectedDates] = useState<{ [key: string]: { selected: boolean; selectedColor: string } }>({});
    const [startLocation, setStartLocation] = useState('');
    const [endLocation, setEndLocation] = useState('');
    const [language, setLanguage] = useState('');
    const [bookingData, setBookingData] = useState<Book | null>(null);
    const [total, setTotal] = useState('');
    const [time, setTime] = useState('')
    const [guides, setGuides] = useState<g[]>([])
    const [hotels, setHotels] = useState<H[]>([])
    const [categories, setCategories] = useState<Cat[]>([])

    const [locationP, setLocationP] = useState('');
    const [order, setOrder] = useState<Postdata | null>(null)

    const [hotelId, setHotelId] = useState<string | null>(null)
    const [guideId, setGuideId] = useState<string | null>(null)
    const [submitForm, setSubmitForm] = useState<Form>({

        routeId: '',
        creatorId: '',
        date: '',

        //hotel.tsx(select dates, locaton, no of children, no of adults, no of nights, no of single beds, no of double beds)
        hotelId: '',
        singleBeds: 0,
        doubleBeds: 0,
        adults: 0,
        children: 0,
        hprice: 0,

        //guide.tsx (select dates, location, language)

        guideId: '',
        glocation: '',
        glanguage: '',
        gprice: 0,
        type: '',

        //car.tsx (select dates, location, language)

        carId: '',
        startLocation: '',
        endLocation: '',
        clanguage: '',
        bookedTime: '',
        cprice: 0,
        isOneway: false


    })
    const [catPrice, setCatPrice] = useState(0);
    const [guidePrice, setGuidePrice] = useState(0);
    const [hotelPrice, setHotelPrice] = useState(0);
    var m = ''

    const handleCategoryNavigation = async (categoryId: string) => {
        try {
            await AsyncStorage.setItem('car', categoryId);
            router.push(`/views/car/list/${categoryId}`);
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

    const displayDates = Object.keys(selectedDates)
        .sort()
        .map(date => new Date(date).toDateString())
        .join(', ');

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
            setSelectedDates({});
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
                const savedBooking = await AsyncStorage.getItem('cbookings');
                if (savedBooking) {
                    const parsedBooking: Book = JSON.parse(savedBooking);
                    setBookingData(parsedBooking);
                    setStartLocation(parsedBooking.start);
                    setEndLocation(parsedBooking.end);
                    setLanguage(parsedBooking.language);
                    //setSelectedTime(parsedBooking.time);
                    setTime(parsedBooking.time)
                }

            } else {
                await AsyncStorage.setItem('cbookingSession', Date.now().toString());
            }
        } catch (error) {
            console.error('Error loading data from AsyncStorage:', error);

            setSelectedCardId(null);
            setSelectedDates({});
            setModalVisible(true);
            setBookingData(null);
            setLanguage('');
            setTime('')
            setStartLocation('');
            setEndLocation('');
        }
    }, []);

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

                // Also run count() on focus
                count();
            };

            loadInitialData();
        }, [])
    );

    useFocusEffect(
        useCallback(() => {
            loadBookingData();
            count()
        }, [categories])
    );
    const count = async () => {
        try {
            let total = 0;

            // Car Booking Price
            const carIndex = await AsyncStorage.getItem('car');
            if (carIndex) {
                const category = categories.find(cat => cat._id === carIndex);
                if (category) {
                    total += category.price;
                    setCatPrice(category.price)
                }
            }

            // Guide Booking Price
            const guideIndex = await AsyncStorage.getItem('selectedGuideBooking');

            if (guideIndex && guides) {
                setGuideId(guideIndex)
                const guide = guides.find(guide => guide.id === guideIndex);
                if (guide) {
                    total += guide.price;
                    setGuidePrice(guide.price)
                }
            }

            // Hotel Booking Price
            const savedHotelBooking = await AsyncStorage.getItem('selectedHotelBooking'); // Use consistent key
            if (savedHotelBooking && hotels.length > 0) {
                const hotelBookingData = JSON.parse(savedHotelBooking);
                setHotelId(hotelBookingData.id)
                const selectedHotel = hotels.find(hotel => hotel.id === hotelBookingData.id); // Find hotel by its ID

                if (selectedHotel && hotelBookingData) { // Null check for selectedHotel
                    // if (selectedHotel.beds && selectedHotel.beds.length >= 2) {
                    const singleBedPrice = selectedHotel.singlePrice || 0;
                    const doubleBedPrice = selectedHotel.doublePrice || 0;
                    const numSingle = Number(hotelBookingData.s || 0); // Use s from stored data
                    const numDouble = Number(hotelBookingData.d || 0); // Use d from stored data
                    total += (singleBedPrice * numSingle) + (doubleBedPrice * numDouble);
                    setHotelPrice((singleBedPrice * numSingle) + (doubleBedPrice * numDouble))
                    //}
                }
            }

            setTotal(total.toString());
        } catch (error) {
            console.error('Error calculating total price from AsyncStorage:', error);
            setTotal('0');
        }
    };

    useEffect(() => {
        count();
    }, [selectedCardId, guideId, hotelId, guides, hotels]);


    const handleCreatePlan = async () => {
        try {
            const keys = await AsyncStorage.getItem("token");

            if (keys) {

                const token: MyToken = jwtDecode(keys)
                const finalFormObject = { ...submitForm }


                const routeId = await AsyncStorage.getItem('selectedRouteId')
                if (routeId) {
                    finalFormObject.routeId = routeId
                } else {
                    m = m + ' Please select a location |'
                }

                const s = await AsyncStorage.getItem('order')
                if (s) {

                    const order: Postdata = JSON.parse(s)
                    if (order) {

                        finalFormObject.date = order.date;
                        finalFormObject.adults = Number(order.adults);
                        finalFormObject.children = Number(order.children);
                    }

                }
                //setting hotel details
                const hbookings = await AsyncStorage.getItem('selectedHotelBooking');
                const hotelData = hbookings ? JSON.parse(hbookings) : '';
                const obj = hotelData;

                if (hotelData && hotelId) {
                    finalFormObject.creatorId = token.id;

                    finalFormObject.hotelId = hotelId;
                    finalFormObject.singleBeds = Number(obj.s);
                    finalFormObject.doubleBeds = Number(obj.d);
                    finalFormObject.hprice = hotelPrice

                } else {

                    console.log('hotel not found');
                    m = m + ' Please select a hotel |';

                }

                //setting guide details
                const gbookings = await AsyncStorage.getItem('gbookings');
                const guideData: BookG = gbookings ? JSON.parse(gbookings) : '';
                console.log(guideData)

                if (guideData && guideId) {

                    finalFormObject.guideId = guideId;
                    finalFormObject.glocation = guideData.loc;
                    finalFormObject.glanguage = guideData.lan;
                    finalFormObject.gprice = guidePrice;
                    finalFormObject.type = guideData.type;

                } else {

                    console.log('guide not found');
                    m = m + ' Please select a guide |'
                }

                //setting car details
                const driver = await AsyncStorage.getItem('cbookings')
                const ids = await AsyncStorage.getItem('selectedCar')
                if (driver && ids) {

                    const bookingData = JSON.parse(driver);
                    if (bookingData && selectedCardId) {

                        finalFormObject.carId = ids;
                        finalFormObject.startLocation = bookingData.start;
                        finalFormObject.endLocation = bookingData.end;
                        finalFormObject.clanguage = bookingData.language;
                        finalFormObject.bookedTime = bookingData.time;
                        finalFormObject.cprice = catPrice;
                        finalFormObject.isOneway = bookingData.oneWay;
                    } else {

                        console.log('vehicle not found')
                        m = m + ' Please select a vehicle |'

                    }
                }
                if (m == '') {
                    console.log(finalFormObject)

                    await fetch('http://localhost:8080/traveler/create-trip', {
                        //await fetch('https://travelsri-backend.onrender.com/traveler/create-trip', {

                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(finalFormObject)

                    })
                        .then(res => res.text())
                        .then(data => console.log(data))
                        .catch(err => console.log(err))

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
                        'hotels',
                        'driver',
                        'selectedCar'


                    ]);

                    setSelectedDates({});
                    setLanguage('');
                    setStartLocation('');
                    setEndLocation('');
                    setModalVisible(false);
                    setSelectedCardId(null);
                    setTotal('0');
                    setBookingData(null);

                    //==setSubmitForm(finalFormObject)
                    alert('Plan created and session reset!');
                    //router.push('/(tabs)/create');
                    router.replace('/(tabs)');
                } else {

                    alert(m)
                    m = '';

                }
            } else {

                alert('Not allowed for this action')
            }

        } catch (e) {
            alert(`Error creating plan and resetting session: ${e}`);
            console.error('Error creating plan and resetting session:', e);
        }

    };

    return (
        <View className='bg-[#F2F5FA] h-full'>

            <>
                <View className="flex-row justify-between items-center p-4 mb-1.5">
                    <Text className="text-lg font-medium">{displayDates}</Text>
                    {/* <TouchableOpacity onPress={() => setModalVisible(true)} className="bg-gray-200 py-2 px-4 rounded-lg">
                        <Text className="font-semibold text-blue-600">Change</Text>
                    </TouchableOpacity> */}
                </View>


                <View>
                    <ScrollView
                        className="w-full h-[80%]"
                        contentContainerClassName="flex-row flex-wrap justify-center items-start gap-5 py-6"
                        showsVerticalScrollIndicator={false}
                    >
                        {categories

                            .filter(x => {
                                if (!order) return false;
                                const totalPeople = Number(order.adults) + Number(order.children);

                                // Only show vehicles that fit the group
                                if (x.members < totalPeople) return false;

                                // Hide buses for small groups (e.g., less than 10 people)
                                if (x.title.toLowerCase().includes('bus') && totalPeople < 10) return false;

                                // Hide vans for very small groups (e.g., less than 4 people)
                                if (x.title.toLowerCase().includes('van') && totalPeople < 4) return false;

                                // Hide large vehicles (capacity > 10) for groups smaller than 4
                                if (x.members > 10 && totalPeople < 4) return false;

                                return true;
                            })
                            .map((x, i) => {
                                //if (order && x.members > Number(order.adults) + Number(order.children)) {
                                return (
                                    <TouchableOpacity onPress={() => handleCategoryNavigation(x._id)} key={x._id}>
                                        <View className="w-full flex-row absolute justify-end pr-1 pt-1 z-10">
                                            <TouchableOpacity
                                                className="w-6 h-6 rounded-full justify-center items-center bg-gray-200 border-2"
                                                onPress={() => toggleCardSelection(x._id)}
                                            >
                                                {selectedCardId === x._id && (
                                                    <Image className='w-4 h-4' source={mark} />
                                                )}
                                            </TouchableOpacity>
                                        </View>
                                        <View className="bg-[#d9d9d98e] w-[160px] h-[200px] items-center py-2 rounded-2xl">
                                            <Image
                                                className="w-[130px] h-[90px]"
                                                source={{ uri: `data:image/jpeg;base64,${x.image}` }}
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
                                            <TouchableOpacity onPress={() => handleCategoryNavigation(x._id)}>
                                                <View className="rounded-md bg-black justify-center w-32 h-5 items-center" >
                                                    <Text className=" text-white font-semibold text-[12px]">{x.price}.00 LKR/1km</Text>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                    </TouchableOpacity>
                                )
                                //}
                            }
                            )}
                    </ScrollView>
                </View>
                <View className="absolute bottom-0 right-0 left-0 border-t border-gray-200 bg-white py-4 pl-32 flex-row justify-center">
                    <Text className="text-center font-bold text-lg">{total}.00 LKR</Text>
                    <TouchableOpacity onPress={handleCreatePlan}><View className='ml-6 bg-[#FEFA17] py-1 px-4 rounded-xl'><Text>Create Plan</Text></View></TouchableOpacity>
                </View>
            </>
        </View>
    );
}