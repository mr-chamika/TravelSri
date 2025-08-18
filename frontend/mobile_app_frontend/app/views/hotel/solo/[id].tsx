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
    price: number;
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
    const { id } = useLocalSearchParams();

    const [item, setItem] = useState<{ policies: string[], reviewCount: number, id: string, image: any[], title: string, ratings: number, stars: number, location: string, price: number, description: string, reviewers: any[], faci: any[], rooms: { _id: string, name: string, capacity: number, maxAvailable: number, nowAvailable: number, pricePerRoom: number }[] }>({ policies: [], reviewCount: 0, id: '1', image: [], title: 'Matara to Colombo', ratings: 0, stars: 0, location: "", price: 0, description: '', reviewers: [], faci: [], rooms: [] });
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
    const [booking, setBooking] = useState<Booking | null>(null)


    useEffect(() => {

        const gethotel = async () => {

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

                if (res2) {

                    const data2 = await res2.json()
                    //console.log(data2)
                    setReviews(data2)

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

                    }
                }


            } catch (err) {

                console.log(`Error in hotel data getting : ${err}`)

            }

        }
        gethotel()

    }, [])


    /* const groupCollection = [
        {
            id: '1',
            image: [thumbnail, thumbnail],
            title: 'Shangri-La',
            ratings: 600,
            stars: 4,
            reviewCount: 269,
            location: 'Colombo',
            price: 9000, // Base price for the hotel (can be per night or per stay)
            description: 'Shangri-La Hotels and Resorts is a Hong Kong-based multinational hospitality company founded in 1971 by Malaysian tycoon Robert Kuok. Named after the mythical utopia from James Hilton’s novel Lost Horizon, it symbolizes serenity and luxury. The brand operates over 100 five-star luxury hotels and resorts across Asia, Europe, the Middle East, North America, and Oceania, with notable properties like Shangri-La Hotel Singapore, its first location, and Shangri-La Colombo in Sri Lanka. Renowned for its "hospitality from the heart," Shangri-La offers world-class service, exquisite dining, and inspirational architecture in premier city addresses and tranquil retreats',
            policies: [
                "Check-in from 13:00 until 00:00",
                "Check-out from 00:00 until 12:00",
                "WiFi is available in all areas and is free of charge.",
                "Free public parking is possible on site (reservation is needed).",
                "No booking or credit card fees"
            ],
            reviewers: [
                {
                    id: '1',
                    name: 'Sunny',
                    from: 'America',
                    images: pic,
                    review: 'mmh maru',
                    ratings: 3
                },
                {
                    id: '2',
                    name: 'Lena',
                    from: 'Spain',
                    images: pic,
                    review: "set na meka",
                    ratings: 2
                },
                {
                    id: '3',
                    name: 'Jhonny',
                    from: 'Sweedan',
                    images: pic,
                    review: "Goooood",
                    ratings: 0
                },
                {
                    id: '3',
                    name: 'Jhonny',
                    from: 'Sweedan',
                    images: pic,
                    review: "Goooood",
                    ratings: 0
                },
                {
                    id: '3',
                    name: 'Jhonny',
                    from: 'Sweedan',
                    images: pic,
                    review: "Goooood",
                    ratings: 0
                },
                {
                    id: '3',
                    name: 'Jhonny',
                    from: 'Sweedan',
                    images: pic,
                    review: "Goooood",
                    ratings: 0
                }
            ],
            faci: [
                {
                    id: '1',
                    name: 'Swimming pool',
                    images: pic
                },
                {
                    id: '2',
                    name: 'Free WiFi',
                    images: pic
                },
                {
                    id: '3',
                    name: 'Free breakfast',
                    images: pic
                },
                {
                    id: '4',
                    name: '1 bathtub',
                    images: pic
                },
                {
                    id: '5',
                    name: 'Room service',
                    images: pic
                },
                {
                    id: '6',
                    name: 'Bar',
                    images: pic
                }
            ],
            roomsType: [
                {
                    id:'1',
                    name: "singleBedroom",
                    capacity: 5, // Total available single rooms
                    pricePerRoom: 5000,
                    persons: 1 // Price per single room per day,
                    
                },
                {
                    id:'2',
                    name: "doubleBedroom",
                    capacity: 2, // Total available double rooms
                    pricePerRoom: 8000,
                    persons: 2// Price per double room per day
                }
            ]
        },
    ];
 */
    const rating = hotelv && hotelv?.reviewCount > 0
        ? parseFloat(((hotelv?.ratings / hotelv?.reviewCount) * 2).toFixed(1))
        : 0;

    /*  useEffect(() => {
         getItem(id);
     }, [id]); */

    useEffect(() => {
        calculateTotalPrice();
    }, [selectedRoomCounts, hotelv?.price]); // Recalculate when room counts or base item price changes

    /* const getItem = (Id: string | string[]) => {
        const foundItem = groupCollection.find(collection => collection.id === Id);
        if (foundItem) {
            setItem(foundItem);
            // Initialize selectedRoomCounts based on available room types
            const initialRoomCounts: { [key: number]: number } = {};
            foundItem.rooms.forEach((_, index) => {
                initialRoomCounts[index] = 0; // Start with 0 selected rooms for each type
            });
            setSelectedRoomCounts(initialRoomCounts);
        }
    }; */

    const handleRoomCountChange = (index: number, change: number) => {
        // Calculate total guests once
        const totalGuests = (bookingData?.adults || 0) + (bookingData?.children || 0);

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
                setCapacityWarning(`You need to select rooms for at least ${totalGuests} guests.`);
            } else {
                setCapacityWarning(''); // Clear the warning if capacity is sufficient
            }

            return newSelectedRoomCounts;
        });
    };
    useEffect(() => {
        // Create an async function to load the data
        const loadBookingData = async () => {
            try {
                const jsonValue = await AsyncStorage.getItem("soloHotelBook");
                if (jsonValue !== null) {
                    // If data exists, parse it and set it to state
                    const data = JSON.parse(jsonValue);
                    setBookingData(data);
                }
            } catch (e) {
                console.error("Failed to load data from AsyncStorage", e);
            } finally {
                setIsLoading(false);
            }
        };

        loadBookingData();
    }, []); // The empty array [] ensures this runs only once when the screen loads


    const calculateTotalPrice = () => {
        let total = hotelv?.price || 0; // Start with the base hotel price
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

        let totalCapacity = 0;
        Object.entries(selectedRoomCounts).forEach(([index, count]) => {
            const room = roomTypes[parseInt(index)];
            if (room) {
                totalCapacity += count * room.capacity;
            }
        });

        if (bookingData && totalCapacity < bookingData?.adults + bookingData?.children) {

            alert('Select enough accomodation')
            return;

        }



        const keys = await AsyncStorage.getItem("token");

        if (keys) {

            const token: MyToken = jwtDecode(keys)


            const book = { ...booking }
            book.userId = token.id
            book.serviceId = id.toString();
            book.type = 'hotel';
            book.thumbnail = hotelv?.images[0];
            book.title = hotelv?.name;

            var x = new Array();

            Object.entries(selectedRoomCounts).forEach(n => { if (n[1] > 0) x.push(n[0] == '0' ? n[1] + ` Single bed room ${n[1] > 1 ? 's' : ''}` : n[1] + ` Double bed room ${n[1] > 1 ? 's' : ''}`) })

            book.subtitle = x;
            book.location = hotelv?.location;
            if (bookingData) {

                book.bookingDates = [bookingData.selectedDates, bookingData.selectedoutDates];
                book.guests = bookingData?.adults + bookingData?.children;
            }
            book.stars = hotelv?.stars;
            book.ratings = rating;
            book.paymentStatus = false;

            var y = new Array();

            facilities.map((x, i) => {

                y.push(x.title);

            })

            book.facilities = y;
            book.price = totalPrice;
            book.status = 'active';
            book.mobileNumber = hotelv?.mobileNumber;

            await fetch(`http://localhost:8080/traveler/create-booking`, {

                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(book)

            })
                .then(res => res.text())
                .then(data => { console.log(data); router.replace('/(tabs)/bookings') })
                .catch(err => console.log("Error from booking create " + err))

        }

    }

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

                        {bookingData ? (
                            <View >
                                {/* Row for Location */}
                                <View className="flex-row justify-between items-center py-3">
                                    <Text className="text-base text-gray-600">Location</Text>
                                    <Text className="text-base font-bold text-gray-900">{bookingData.location}</Text>
                                </View>

                                <View className="h-px bg-gray-200" />

                                {/* Row for Dates */}
                                <View className="flex-row justify-between items-center py-3">
                                    <Text className="text-base text-gray-600">Check-in</Text>
                                    <Text className="text-base font-semibold text-gray-900">{bookingData.selectedDates}</Text>
                                </View>
                                <View className="flex-row justify-between items-center pb-3">
                                    <Text className="text-base text-gray-600">Check-out</Text>
                                    <Text className="text-base font-semibold text-gray-900">{bookingData.selectedoutDates}</Text>
                                </View>

                                <View className="h-px bg-gray-200" />

                                {/* Row for Guests and Nights */}
                                <View className="flex-row justify-between items-center py-3">
                                    <Text className="text-base text-gray-600">Guests</Text>
                                    <Text className="text-base font-bold text-gray-900">
                                        {bookingData.adults} Adults, {bookingData.children} Children
                                    </Text>
                                </View>
                                <View className="flex-row justify-between items-center pb-3">
                                    <Text className="text-base text-gray-600">Total Nights</Text>
                                    <Text className="text-base font-bold text-gray-900">{bookingData.nights}</Text>
                                </View>
                            </View>
                        ) : (
                            <Text>No booking data found.</Text>
                        )}
                    </View>
                    <View className="gap-3">
                        {/* <Text className="px-3 text-sm italic text-justify text-gray-500 font-semibold">{item.description}</Text> */}

                        <View className=" bg-gray-100 rounded-lg shadow-md m-1">
                            <Text className=" text-2xl font-semibold px-2 py-1">Choose Rooms</Text>
                            {roomTypes.map((r, i) => (
                                <View key={i} className="flex-row px-2 py-3 gap-12 items-center justify-between">
                                    <View className="flex-row items-center gap-14">
                                        <Image className="w-10 h-10" source={r.name == "Standard Single Bedroom" ? single : double} />
                                        <Text>Available Rooms: {r.name == "Standard Single Bedroom" ? hotelv?.availableSingle : hotelv?.availableDouble}</Text>
                                    </View>
                                    <View className="flex-row items-center gap-3">
                                        <TouchableOpacity
                                            className="bg-gray-300 pb-1 rounded-full w-8 h-8 items-center justify-center"
                                            onPress={() => handleRoomCountChange(i, -1)}
                                        >
                                            <Text className="font-bold text-lg">-</Text>
                                        </TouchableOpacity>
                                        <Text className="text-lg font-bold">{selectedRoomCounts[i] || 0}</Text>
                                        <TouchableOpacity
                                            className="bg-gray-300 pb-1 rounded-full w-8 h-8 items-center justify-center"
                                            onPress={() => handleRoomCountChange(i, 1)}
                                        >
                                            <Text className="font-bold text-lg">+</Text>
                                        </TouchableOpacity>
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
                    <TouchableOpacity
                        className=" bg-[#84848460] rounded-xl w-[30%]"
                        // onPress={() => router.push(`/views/payment/${hotelv?._id}`)}
                        onPress={handleBooking}
                    >
                        <View className="py-2 px-3 flex-row justify-between items-center w-full" >
                            <Text>Book Now</Text>
                            <Image className="w-5 h-5" source={back} />
                        </View>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}