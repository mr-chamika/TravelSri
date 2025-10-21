import { useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, TouchableOpacity, ScrollView, Platform } from "react-native";
import { cssInterop } from 'nativewind';
import { Image } from 'expo-image';
import { useEffect, useState } from "react";
import { useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
cssInterop(Image, { className: "style" });
import { jwtDecode } from "jwt-decode";
interface MyToken {
    sub: string;
    roles: string[];
    username: string;
    email: string;
    id: string
}
interface BookingData {
    selectedDates: string;
    selectedoutDates: string;
    adults: number;
    children: number;
    nights: number;
    location: string;
}

export interface HotelView {
    _id: string;
    images: string[];
    stars: number;
    ratings: number;
    reviewCount: number;
    currentPrice: number;
    name: string;
    location: string;
    description: string;
    policies: string[];
    roomTypes: string[];
    facilities: string[];
    availableSingle: number;
    availableDouble: number;
    mobileNumber: string;
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

interface Facility {
    _id: string;
    title: string;
    image: string;
    hotelId: string[];
}

interface RoomType {

    _id: string;
    name: string;
    pricePerRoom: number;
    capacity: number;

}

export interface Booking {
    _id: string;
    userId: string;
    serviceId: string;
    type: string;
    thumbnail: string;
    title: string;
    subtitle: string[];
    location: string;
    bookingDates: string[];
    stars: number;
    ratings: number;
    paymentStatus: boolean;
    guests: number;
    facilities: string[];
    price: number;
    status: string;
    mobileNumber: string;

    singleRooms: number;
    doubleRooms: number
}

interface Postdata {

    createdId: string,
    dayNumber: string,
    date: string,
    adults: string,
    children: string

}

const pic = require('../../../../assets/images/tabbar/towert.png');
const location = require('../../../../assets/images/pin.png');
const thumbnail = require('../../../../assets/images/tabbar/create/hotel/hotelthumb.png');
const star = require('../../../../assets/images/tabbar/create/hotel/stars.png');
const single = require('../../../../assets/images/tabbar/create/hotel/single.png');
const double = require('../../../../assets/images/tabbar/create/hotel/double.png');
const back = require('../../../../assets/images/back.png');

export default function Views() {
    const router = useRouter();
    const { createdId, id, tripId, dayNumber, date, adults, children, bookingDatas, editMode, viewMode, singleRooms, doubleRooms } = useLocalSearchParams();
    console.log(singleRooms)
    console.log(doubleRooms)
    console.log(viewMode)
    // console.log("createdId" + createdId)
    //console.log("id" + id)
    // console.log("dayNumber" + dayNumber)
    // console.log("date" + date)
    // console.log("adults" + adults)
    // console.log("children" + children)
    // console.log("bookingDatas" + bookingDatas)
    // console.log("editMode" + editMode)

    const [item, setItem] = useState<{ policies: string[], reviewCount: number, id: string, image: any[], title: string, ratings: number, stars: number, location: string, currentPrice: number, description: string, reviewers: any[], faci: any[], rooms: { _id: string, name: string, capacity: number, maxAvailable: number, nowAvailable: number, pricePerRoom: number }[] }>({ policies: [], reviewCount: 0, id: '1', image: [], title: 'Matara to Colombo', ratings: 0, stars: 0, location: "", currentPrice: 0, description: '', reviewers: [], faci: [], rooms: [] });
    const [selectedRoomCounts, setSelectedRoomCounts] = useState<{ [key: number]: number }>({});
    const [totalPrice, setTotalPrice] = useState(0);
    const [activeIndex, setActiveIndex] = useState(0);
    const [carouselWidth, setCarouselWidth] = useState(0);
    const [bookingData, setBookingData] = useState<BookingData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [capacityWarning, setCapacityWarning] = useState('');
    const [hotelv, setHotelv] = useState<HotelView | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [facilities, setFacilities] = useState<Facility[]>([]);
    const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
    const [order, setOrder] = useState<Postdata | null>(null)
    const [booking, setBooking] = useState<Booking | null>(null)

    useEffect(() => {

        const gethotel = async () => {

            if (bookingDatas) {

                try {
                    // Parse the existing booking data
                    const existingBookingData = bookingDatas ? JSON.parse(bookingDatas as string) : null;

                    // Fetch hotel data
                    const res1 = await fetch(`http://localhost:8080/traveler/hotels-view?id=${id}`)
                    const data1: HotelView = await res1.json()
                    setHotelv(data1)

                    // Fetch facilities if available
                    if (data1?.facilities && data1?.facilities.length > 0) {
                        const params = new URLSearchParams();
                        data1?.facilities.forEach(facilityId => {
                            params.append('ids', facilityId);
                        })

                        const res3 = await fetch(`http://localhost:8080/traveler/facis-view?ids=${params.toString()}`)
                        if (res3) {
                            const data3 = await res3.json()
                            setFacilities(data3)
                        }
                    }

                    // Fetch reviews
                    const res2 = await fetch(`http://localhost:8080/traveler/reviews-view?id=${id}`)
                    if (res2.ok) {
                        const data2 = await res2.json()
                        setReviews(data2)
                    } else {
                        setReviews([])
                    }

                    // Fetch room types and populate existing selections
                    if (data1?.roomTypes && data1?.roomTypes.length > 0) {
                        const params1 = new URLSearchParams();
                        data1.roomTypes.forEach(roomId => {
                            params1.append('ids', roomId);
                        })

                        const res4 = await fetch(`http://localhost:8080/traveler/roomtypes-view?${params1.toString()}`)
                        if (res4) {
                            const data4 = await res4.json()
                            setRoomTypes(data4)

                            // Populate existing room selections from bookingDatas
                            if (existingBookingData && data4 && data4.length > 0) {
                                let singleIndex = -1;
                                let doubleIndex = -1;

                                data4.forEach((room: RoomType, idx: number) => {
                                    if (room.name.toLowerCase().includes('single')) singleIndex = idx;
                                    if (room.name.toLowerCase().includes('double')) doubleIndex = idx;
                                });

                                // Set the existing room counts
                                const existingRoomCounts: { [key: number]: number } = {};
                                if (singleIndex !== -1 && existingBookingData.singleRooms) {
                                    existingRoomCounts[singleIndex] = Number(existingBookingData.singleRooms);
                                }
                                if (doubleIndex !== -1 && existingBookingData.doubleRooms) {
                                    existingRoomCounts[doubleIndex] = Number(existingBookingData.doubleRooms);
                                }

                                setSelectedRoomCounts(existingRoomCounts);
                            }
                        }
                    }

                    // Set the order data from the passed parameters
                    setOrder({
                        createdId: createdId.toString(),
                        dayNumber: dayNumber as string,
                        date: date as string,
                        adults: adults as string,
                        children: children as string
                    });

                } catch (err) {
                    console.log(`Error in edit mode hotel data getting : ${err}`)
                }

            } else {

                try {

                    const res1 = await fetch(`http://localhost:8080/traveler/hotels-view?id=${id}`)

                    const params = new URLSearchParams();
                    //const res1 = await fetch(`https://travelsri-backend.onrender.com/traveler/hotels-view?id=${id}`)
                    const data1: HotelView = await res1.json()

                    //console.log(data1)
                    setHotelv(data1)
                    //setHotel(data1)

                    if (data1?.facilities && data1?.facilities.length > 0) {

                        data1?.facilities.forEach(facilityId => {
                            params.append('ids', facilityId);
                        })




                        const res3 = await fetch(`http://localhost:8080/traveler/facis-view?ids=${params.toString()}`)
                        //const res3 = await fetch(`https://travelsri-backend.onrender.com/traveler/facis-view?id=${id}`)

                        if (res3) {

                            const data3 = await res3.json()
                            //console.log(data3)
                            setFacilities(data3)

                        }
                    }

                    const res2 = await fetch(`http://localhost:8080/traveler/reviews-view?id=${id}`)
                    //const res2 = await fetch(`https://travelsri-backend.onrender.com/traveler/reviews-view?id=${id}`)

                    if (res2.ok) {

                        const data2 = await res2.json()
                        console.log(data2)
                        setReviews(data2)

                    } else {

                        setReviews([])

                    }

                    if (data1?.roomTypes && data1?.roomTypes.length > 0) {
                        const params1 = new URLSearchParams();

                        data1.roomTypes.forEach(roomId => {
                            params1.append('ids', roomId);
                        })


                        const res4 = await fetch(`http://localhost:8080/traveler/roomtypes-view?${params1.toString()}`)
                        //const res3 = await fetch(`https://travelsri-backend.onrender.com/traveler/facis-view?id=${id}`)

                        if (res4) {

                            const data4 = await res4.json()
                            //console.log(data4)
                            setRoomTypes(data4)
                            const saved = await AsyncStorage.getItem('selectedHotelBooking');
                            if (saved && data1?._id) {
                                const booking = JSON.parse(saved);
                                if (booking.id === data1._id && data4 && data4.length > 0) {
                                    /// Find the indexes for single and double room types
                                    let singleIndex = -1;
                                    let doubleIndex = -1;
                                    data4.forEach((room: RoomType, idx: number) => {
                                        if (room.name.toLowerCase().includes('single')) singleIndex = idx;
                                        if (room.name.toLowerCase().includes('double')) doubleIndex = idx;
                                    });
                                    // Set initial selected room counts
                                    setSelectedRoomCounts({
                                        ...(singleIndex !== -1 ? { [singleIndex]: Number(booking.s) } : {}),
                                        ...(doubleIndex !== -1 ? { [doubleIndex]: Number(booking.d) } : {}),
                                    });
                                }

                            }
                        }

                    }
                } catch (err) {

                    console.log(`Error in hotel data getting : ${err}`)

                }
            }
        }
        gethotel()

    }, [])



    const rating = hotelv && hotelv?.reviewCount > 0
        ? parseFloat(((hotelv?.ratings / hotelv?.reviewCount) * 2).toFixed(1))
        : 0;


    useEffect(() => {
        calculateTotalPrice();
    }, [selectedRoomCounts, hotelv?.currentPrice]); // Recalculate when room counts or base item price changes


    const handleRoomCountChange = (index: number, change: number) => {
        // Calculate total guests once

        const totalGuests = (Number(order?.adults) || 0) + (order && (Number(order?.children) <= Number(order?.adults) ? 0 : (Number(order?.children) - Number(order?.adults)) % 2 == 0 ? (Number(order?.children) - Number(order?.adults)) / 2 : ((Number(order?.children) - Number(order?.adults)) + 1) / 2) || 0);


        setSelectedRoomCounts(prevCounts => {
            const room = roomTypes[index];
            if (!room) return prevCounts;

            // Determine the maximum number of available rooms
            let maxAvailableRooms = 0;
            if (room.name === "Standard Single Bedroom") {
                maxAvailableRooms = hotelv?.availableSingle || 0;
            } else {
                maxAvailableRooms = hotelv?.availableDouble || 0;
            }

            // Calculate and clamp the new count for the current room type
            const currentCount = prevCounts[index] || 0;
            const newCount = currentCount + change;

            if (change > 0 && currentCount >= maxAvailableRooms) {
                setCapacityWarning(`No more ${room.name}s are available.`);
                return prevCounts; // Return the previous state without changes
            }

            const clampedCount = Math.max(0, Math.min(newCount, maxAvailableRooms));

            // Create the new state object for room counts
            const newSelectedRoomCounts = {
                ...prevCounts,
                [index]: clampedCount,
            };

            // --- NEW MINIMUM GUEST COUNT LOGIC ---
            // Calculate the new total capacity based on the updated counts
            let newTotalCapacity = 0;
            Object.entries(newSelectedRoomCounts).forEach(([idx, count]) => {
                const r = roomTypes[parseInt(idx)];
                if (r) {
                    newTotalCapacity += count * r.capacity;
                }
            });

            // Set a warning if the new capacity is less than the total guests
            if (newTotalCapacity < totalGuests) {
                setCapacityWarning(`At least you must select ${totalGuests} capacity`);
            } else {
                setCapacityWarning(''); // Clear the warning if capacity is sufficient
            }

            return newSelectedRoomCounts;
        });
    };
    useEffect(() => {
        // Create an async function to load the data

        if (editMode != 'true') {
            const loadBookingData = async () => {
                try {
                    const pack = await AsyncStorage.getItem('order')

                    if (pack) {

                        setOrder(JSON.parse(pack))

                    }

                } catch (e) {
                    console.error("Failed to load data from AsyncStorage", e);
                } finally {
                    setIsLoading(false);
                }
            };

            loadBookingData();
        } else {

            const existingBookingData = bookingDatas ? JSON.parse(bookingDatas as string) : null;

            if (!existingBookingData) return;

            setOrder({
                createdId: createdId.toString(),
                dayNumber: existingBookingData.dayNumber,
                date: existingBookingData.date,
                adults: existingBookingData.adults,
                children: existingBookingData.children
            });

        }
    }, []); // The empty array [] ensures this runs only once when the screen loads


    const calculateTotalPrice = () => {
        let total = hotelv?.currentPrice || 0; // Start with the base hotel price
        roomTypes.forEach((room, index) => {
            const count = selectedRoomCounts[index] || 0;
            total += count * room.pricePerRoom;
        });
        setTotalPrice(total);
    };

    const handleScroll = useCallback((event: any) => {
        if (carouselWidth > 0) {
            // Calculate the index based on scroll position and width
            const newIndex = Math.round(event.nativeEvent.contentOffset.x / carouselWidth);
            setActiveIndex(newIndex);
        }
    }, [carouselWidth]);

    const handleBooking = async () => {
        // Guard clause to ensure hotel data is available
        if (!hotelv) {
            console.error("Hotel data is not loaded yet.");
            return; // Exit if there's no hotel data
        }

        if (Object.keys(selectedRoomCounts).length === 0 || capacityWarning != '') {

            alert('not enough accomodation')
            return;

        }

        try {
            // 1. Calculate the number of single and double rooms selected
            let singleRoomsCount = 0;
            let doubleRoomsCount = 0;

            // Iterate over the selected room counts
            Object.entries(selectedRoomCounts).forEach(([index, count]) => {
                const roomType = roomTypes[parseInt(index, 10)]; // Get the room type details
                if (roomType && count > 0) {
                    // Check the name to distinguish between single and double rooms
                    if (roomType.name.toLowerCase().includes('single')) {
                        singleRoomsCount += count;
                    } else {
                        doubleRoomsCount += count;
                    }
                }
            });

            // 2. Create the data object in the format the previous screen expects
            const bookingDetails = {
                id: hotelv._id,
                s: singleRoomsCount.toString(), // 's' for single
                d: doubleRoomsCount.toString(), // 'd' for double
            };

            // 3. Save the booking details to AsyncStorage
            await AsyncStorage.setItem('selectedHotelBooking', JSON.stringify(bookingDetails));
            console.log('Booking details saved:', bookingDetails);

            const orderx = await AsyncStorage.getItem('order');
            const tokenString = await AsyncStorage.getItem('token');

            if (!tokenString || !orderx) return;

            const token: MyToken = jwtDecode(tokenString);
            console.log('bookingDetails')
            console.log(order)
            // 4. Navigate back to the previous screen
            //router.back();
            await fetch('http://localhost:8080/traveler/create-trip', {

                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ obj: bookingDetails, order: order, type: 'hotel', serviceId: id, userId: token.id, id: tripId })

            })
                .then(res => res.text())
                .then(data => {

                    AsyncStorage.removeItem('selectedHotelBooking')
                    router.push({ pathname: `/(tabs)/creates`, params: { id: data } })

                })
                .catch(err => console.log(err))


        } catch (error) {
            console.error("Failed to save booking details to AsyncStorage:", error);
            // Optionally, show an alert to the user that something went wrong
        }
    };

    return (
        <View className={`${Platform.OS === 'web' ? 'h-screen overflow-auto' : 'h-full'}`}>
            <TouchableOpacity className="pl-3" onPress={() => router.back()}><Text>Back</Text></TouchableOpacity>

            <ScrollView
                className="w-full h-[97%]"
                contentContainerClassName="flex-col px-3 py-5 gap-7"
                showsVerticalScrollIndicator={false}
            >
                <View className="w-full gap-5">
                    <View className="">
                        <View className="w-full items-center h-56"

                            onLayout={(event) => {
                                setCarouselWidth(event.nativeEvent.layout.width);
                            }}

                        >
                            {carouselWidth > 0 && (
                                <ScrollView
                                    horizontal
                                    pagingEnabled
                                    onScroll={handleScroll}
                                    scrollEventThrottle={16}
                                    showsHorizontalScrollIndicator={false}

                                    contentContainerStyle={Platform.select({
                                        web: {
                                            scrollSnapType: 'x mandatory',
                                            overflowX: 'scroll',
                                        } as any, // Use 'as any' to satisfy TypeScript
                                    })}

                                >
                                    {hotelv?.images.map((x, index) => (
                                        <View key={index} style={{ width: carouselWidth }} className="p-1 h-full snap-center">
                                            <Image
                                                source={{ uri: `data:image/jpeg;base64,${x}` }}
                                                // 2. The Image now fills the padded container.
                                                className="h-full w-full border-2 border-gray-300"
                                                contentFit="cover"
                                            />
                                        </View>
                                    ))}
                                </ScrollView>
                            )}
                        </View>
                        <View className="flex-row justify-between pt-1">
                            <View>
                                <View className="flex-row items-center gap-3">
                                    <Text className="font-black text-xl">{hotelv?.name}</Text>
                                    <View className="flex-row">
                                        {[...Array(hotelv?.stars)].map((_, index) => (
                                            <Image
                                                key={index}
                                                source={star} // Your imported star image
                                                className="w-4 h-4 mx-0.5"
                                            />
                                        ))}
                                    </View>
                                </View>
                                <View className="flex-row items-center">
                                    <Image className="w-4 h-4" source={location} />
                                    <Text className="text-start">{hotelv?.location}</Text>
                                </View>
                            </View>
                            <View className="flex-row items-start">
                                {/* <Image className="w-5 h-5" source={star} /> */}
                                <Text className="text-sm rounded-lg bg-yellow-300 py-1 px-2 font-medium">{rating.toFixed(1)}</Text>
                            </View>
                        </View>
                    </View>

                    <View className=" bg-gray-100 rounded-lg shadow-md m-1 px-2">
                        <Text className=" text-2xl font-semibold py-2">Facilities</Text>
                        <View className="flex-wrap flex-row justify-evenly">

                            {facilities.map((x, i) => (
                                <View key={i} className="p-3 rounded-2xl">
                                    <View className="items-center">
                                        <Image className="w-10 h-10 rounded-full" source={{ uri: `data:image/jpeg;base64,${x.image}` }} />
                                        <Text className="text-center">{x.title}</Text>
                                    </View>
                                </View>
                            ))}

                        </View>
                    </View>
                    <View className=" bg-gray-100 rounded-lg shadow-md m-1 px-3">

                        {order ? (
                            <View >
                                {/* Row for Location */}
                                {/* <View className="flex-row justify-between items-center py-3">
                                    <Text className="text-base text-gray-600">Location</Text>
                                    <Text className="text-base font-bold text-gray-900">{bookingData.location}</Text>
                                </View> */}

                                <View className="h-px bg-gray-200" />

                                {/* Row for Dates
                                <View className="flex-row justify-between items-center py-3">
                                    <Text className="text-base text-gray-600">Check-in</Text>
                                    <Text className="text-base font-semibold text-gray-900">{bookingData.selectedDates}</Text>
                                </View>
                                <View className="flex-row justify-between items-center pb-3">
                                    <Text className="text-base text-gray-600">Check-out</Text>
                                    <Text className="text-base font-semibold text-gray-900">{bookingData.selectedoutDates}</Text>
                                </View>
 */}
                                <View className="h-px bg-gray-200" />

                                {/* Row for Guests and Nights */}
                                <View className="flex-row justify-between items-center py-3">
                                    <Text className="text-base text-gray-600">Guests</Text>
                                    <Text className="text-base font-bold text-gray-900">
                                        {order?.adults} Adults, {order?.children} Children
                                    </Text>
                                </View>
                                {/* <View className="flex-row justify-between items-center pb-3">
                                    <Text className="text-base text-gray-600">Total Nights</Text>
                                    <Text className="text-base font-bold text-gray-900">{bookingData.nights}</Text>
                                </View> */}
                            </View>
                        ) : (
                            <Text>No booking data found.</Text>
                        )}
                    </View>
                    <View className="gap-3">
                        {/* <Text className="px-3 text-sm italic text-justify text-gray-500 font-semibold">{item.description}</Text> */}

                        <View className=" bg-gray-100 rounded-lg shadow-md m-1">
                            <Text className=" text-2xl font-semibold px-2 py-1">Choose Rooms</Text>

                            {viewMode === 'true' && (
                                <View className="flex-row px-2 py-3 gap-12 items-center justify-between">

                                    <View className="space-y-2">
                                        {singleRooms && parseInt(singleRooms as string) > 0 && (

                                            <View className="flex-row justify-between items-center gap-16 ml-3">
                                                <Image className="w-10 h-10" source={single} />
                                                <Text className="text-base text-gray-700">Single Rooms:</Text>
                                                <Text className="text-base font-bold">{singleRooms}</Text>
                                            </View>
                                        )}
                                        {doubleRooms && parseInt(doubleRooms as string) > 0 && (
                                            <View className="flex-row justify-between items-center  ml-3">
                                                <Image className="w-10 h-10" source={double} />
                                                <Text className="text-base text-gray-700">Double Rooms:</Text>
                                                <Text className="text-base font-bold">{doubleRooms}</Text>
                                            </View>
                                        )}
                                    </View>
                                </View>
                            )}

                            {viewMode != 'true' && roomTypes.map((r, i) => (
                                <View key={i} className="flex-row px-2 py-3 gap-12 items-center justify-between">
                                    <View className="flex-row items-center gap-14">
                                        <Image className="w-10 h-10" source={r.name == "Standard Single Bedroom" ? single : double} />
                                        <Text>Available Rooms: {r.name == "Standard Single Bedroom" ? hotelv?.availableSingle : hotelv?.availableDouble}</Text>
                                    </View>
                                    <View className="flex-row items-center gap-1">
                                        {viewMode != 'true' && <TouchableOpacity
                                            className="bg-gray-300 pb-1 rounded-full w-8 h-8 items-center justify-center"
                                            onPress={() => handleRoomCountChange(i, -1)}
                                        >
                                            <Text className="font-bold text-lg">-</Text>
                                        </TouchableOpacity>}
                                        <Text className="text-lg font-bold">{selectedRoomCounts[i] || 0}</Text>
                                        {viewMode != 'true' && <TouchableOpacity
                                            className="bg-gray-300 pb-1 rounded-full w-8 h-8 items-center justify-center"
                                            onPress={() => handleRoomCountChange(i, 1)}
                                        >
                                            <Text className="font-bold text-lg">+</Text>
                                        </TouchableOpacity>}
                                    </View>
                                </View>
                            ))}

                            <Text
                                className={`
        text-red-500 font-semibold px-2 pb-2 text-center 
        ${capacityWarning ? 'opacity-100' : 'opacity-0'}
    `}
                            >
                                {capacityWarning || '\u00A0'}
                            </Text>

                        </View>


                        {reviews.length > 0 && <View className="gap-3">
                            <View className=" bg-gray-100 rounded-lg shadow-md m-1">
                                <Text className="px-2 text-2xl font-semibold">Reviews</Text>
                                <ScrollView
                                    className="w-full h-64 mb-1"
                                    contentContainerClassName=" flex-col px-2 py-2 gap-5 "
                                    showsVerticalScrollIndicator={false}
                                    nestedScrollEnabled={true}
                                >
                                    {reviews.map((x, i) => (
                                        <View key={i} className="bg-gray-200 px-3 rounded-2xl">
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
                            <View className="p-4 bg-gray-100 rounded-lg shadow-md m-1">
                                <Text className="text-lg font-bold text-gray-800 mb-3">Policies</Text>
                                <View className="space-y-4">
                                    {hotelv?.policies.map((policy, i) => (

                                        <View className="flex-row items-center" key={i}>
                                            {/* You can use a simple text character or an icon */}
                                            <Text className="text-blue-500 mr-2 text-lg">✓</Text>
                                            <Text className="text-base font-semibold text-gray-700">{policy}</Text>
                                        </View>


                                    ))}
                                </View>
                            </View>
                        </View>}



                    </View>
                </View>

                <View className="self-center flex-row items-center bg-[#FEFA17] w-[95%] h-12 rounded-2xl justify-between px-1 shadow-lg">
                    <Text className="px-3 font-extrabold text-xl">{totalPrice}.00 LKR/day</Text>
                    {viewMode != 'true' && <TouchableOpacity
                        className=" bg-[#84848460] rounded-xl w-[30%]"
                        // onPress={() => router.push(`/views/payment/${hotelv?._id}`)}
                        onPress={handleBooking}
                    >
                        <View className="py-2 px-3 flex-row justify-between items-center w-full" >
                            <Text>Choose</Text>
                            <Image className="w-5 h-5" source={back} />
                        </View>
                    </TouchableOpacity>}
                </View>
            </ScrollView>
        </View>
    );
}