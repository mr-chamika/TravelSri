import { useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, TouchableOpacity, ScrollView, Platform, Alert, Modal } from "react-native";
import { cssInterop } from 'nativewind';
import { Image } from 'expo-image';
import { useEffect, useState } from "react";
import { useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";

cssInterop(Image, { className: "style" });

interface MyToken {
    sub: string;
    roles: string[];
    username: string;
    email: string;
    id: string;
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
    name: string;
    location: string;
    distance?: string;
    description: string;
    images: string[];
    thumbnail: string;
    stars: number;
    ratings: number;
    reviewCount: number;
    price: string;
    originalPrice?: number;
    singlePrice?: number;
    doublePrice?: number;
    availableSingle: number;
    availableDouble: number;
    maxSingle: number;
    maxDouble: number;
    policies: string[];
    roomTypes: string[];
    facilities: string[];
    freeFeatures: string[];
    specialOffer?: string;
    mobileNumber: string;
    taxes?: string;
    priceDescription?: string;
    unavailable?: string[];
}

interface Review {
    _id: string;
    serviseId: string;
    text: string;
    country: string;
    stars: number;
    author: string;
    dp: string;
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

export default function HotelDetailsView() {
    const router = useRouter();
    const { id } = useLocalSearchParams();

    // States
    const [hotelv, setHotelv] = useState<HotelView | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [facilities, setFacilities] = useState<Facility[]>([]);
    const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
    const [booking, setBooking] = useState<Booking | null>(null);
    const [bookingData, setBookingData] = useState<BookingData | null>(null);
    const [selectedRoomCounts, setSelectedRoomCounts] = useState<{ [key: number]: number }>({});
    const [totalPrice, setTotalPrice] = useState(0);
    const [activeIndex, setActiveIndex] = useState(0);
    const [carouselWidth, setCarouselWidth] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [capacityWarning, setCapacityWarning] = useState('');
    const [isBookingInProgress, setIsBookingInProgress] = useState(false);
    
    // Info modal states
    const [showPriceInfo, setShowPriceInfo] = useState(false);
    const [showPolicyInfo, setShowPolicyInfo] = useState(false);
    const [showRoomInfo, setShowRoomInfo] = useState(false);

    // Calculate rating from hotel data
    const rating = hotelv && hotelv.reviewCount > 0
        ? parseFloat(((hotelv.ratings / hotelv.reviewCount) * 2).toFixed(1))
        : 0;

    // Get rating description
    const getRatingDescription = (rating: number) => {
        if (rating >= 4.5) return "Exceptional";
        if (rating >= 4.0) return "Excellent";
        if (rating >= 3.5) return "Very Good";
        if (rating >= 3.0) return "Good";
        if (rating >= 2.5) return "Fair";
        return "Poor";
    };

    // Load booking data from AsyncStorage
    useEffect(() => {
        const loadBookingData = async () => {
            try {
                const jsonValue = await AsyncStorage.getItem("soloHotelBook");
                if (jsonValue !== null) {
                    const data = JSON.parse(jsonValue);
                    setBookingData(data);
                    console.log('Loaded booking data:', data);
                } else {
                    console.log('No booking data found in AsyncStorage');
                }
            } catch (e) {
                console.error("Failed to load data from AsyncStorage", e);
            } finally {
                setIsLoading(false);
            }
        };
        loadBookingData();
    }, []);

    // Debug state changes
    useEffect(() => {
        console.log('State debug:', {
            hotelExists: !!hotelv,
            bookingDataExists: !!bookingData,
            roomTypesCount: roomTypes.length,
            selectedRoomsCount: Object.keys(selectedRoomCounts).length,
            totalPrice,
            isLoading
        });
    }, [hotelv, bookingData, roomTypes, selectedRoomCounts, totalPrice, isLoading]);

    // Fetch hotel data
    useEffect(() => {
        const getHotelData = async () => {
            if (!id) {
                console.log('No hotel ID provided');
                return;
            }
            
            try {
                console.log('Fetching hotel data for ID:', id);
                
                // Fetch hotel details
                const hotelRes = await fetch(`http://localhost:8080/traveler/hotels-view?id=${id}`);
                if (!hotelRes.ok) {
                    throw new Error(`Hotel fetch failed: ${hotelRes.status}`);
                }
                
                const hotelData: HotelView = await hotelRes.json();
                console.log('Hotel data received:', hotelData);
                setHotelv(hotelData);

                // Fetch facilities if available
                if (hotelData?.facilities && hotelData.facilities.length > 0) {
                    const facilityParams = new URLSearchParams();
                    hotelData.facilities.forEach(facilityId => {
                        facilityParams.append('ids', facilityId);
                    });

                    try {
                        const facilitiesRes = await fetch(`http://localhost:8080/traveler/facis-view?${facilityParams.toString()}`);
                        if (facilitiesRes.ok) {
                            const facilitiesData = await facilitiesRes.json();
                            console.log('Facilities data:', facilitiesData);
                            setFacilities(facilitiesData);
                        }
                    } catch (err) {
                        console.error('Error fetching facilities:', err);
                    }
                }

                // Fetch reviews
                try {
                    const reviewsRes = await fetch(`http://localhost:8080/traveler/reviews-view?id=${id}`);
                    if (reviewsRes.ok) {
                        const reviewsData = await reviewsRes.json();
                        console.log('Reviews data:', reviewsData);
                        setReviews(reviewsData);
                    }
                } catch (err) {
                    console.error('Error fetching reviews:', err);
                }

                // Fetch room types if available
                if (hotelData?.roomTypes && hotelData.roomTypes.length > 0) {
                    const roomParams = new URLSearchParams();
                    hotelData.roomTypes.forEach(roomId => {
                        roomParams.append('ids', roomId);
                    });

                    try {
                        const roomTypesRes = await fetch(`http://localhost:8080/traveler/roomtypes-view?${roomParams.toString()}`);
                        if (roomTypesRes.ok) {
                            const roomTypesData = await roomTypesRes.json();
                            console.log('Room types data:', roomTypesData);
                            setRoomTypes(roomTypesData);
                        }
                    } catch (err) {
                        console.error('Error fetching room types:', err);
                    }
                }

            } catch (err) {
                console.error('Error fetching hotel data:', err);
                Alert.alert('Error', 'Failed to load hotel data. Please try again.');
            }
        };

        getHotelData();
    }, [id]);

    // Auto-select default rooms based on guest count (minimum cost)
    const autoSelectRooms = useCallback(() => {
        if (!bookingData || roomTypes.length === 0 || Object.keys(selectedRoomCounts).length > 0) {
            console.log('Skipping auto-select:', {
                hasBookingData: !!bookingData,
                roomTypesLength: roomTypes.length,
                hasSelectedRooms: Object.keys(selectedRoomCounts).length > 0
            });
            return;
        }

        console.log('Auto-selecting rooms for guests:', bookingData.adults + bookingData.children);

        const totalGuests = bookingData.adults + bookingData.children;
        let minCost = Infinity;
        let bestCombination: { [key: number]: number } = {};

        // Generate all possible room combinations that can accommodate guests
        const generateCombinations = (remainingGuests: number, roomIndex: number, currentCombination: { [key: number]: number }, currentCost: number) => {
            if (remainingGuests <= 0) {
                if (currentCost < minCost) {
                    minCost = currentCost;
                    bestCombination = { ...currentCombination };
                }
                return;
            }

            if (roomIndex >= roomTypes.length) return;

            const room = roomTypes[roomIndex];
            const maxAvailable = room.name.toLowerCase().includes("single") 
                ? (hotelv?.availableSingle || 0) 
                : (hotelv?.availableDouble || 0);

            // Try different quantities of this room type
            for (let quantity = 0; quantity <= maxAvailable; quantity++) {
                const guestsAccommodated = quantity * room.capacity;
                const cost = quantity * room.pricePerRoom;
                
                if (guestsAccommodated <= remainingGuests || remainingGuests <= 0) {
                    const newCombination = { ...currentCombination };
                    if (quantity > 0) {
                        newCombination[roomIndex] = quantity;
                    }
                    
                    generateCombinations(
                        remainingGuests - guestsAccommodated,
                        roomIndex + 1,
                        newCombination,
                        currentCost + cost
                    );
                }
            }
        };

        generateCombinations(totalGuests, 0, {}, 0);

        // Verify the best combination can accommodate all guests
        let totalCapacity = 0;
        Object.entries(bestCombination).forEach(([index, count]) => {
            const room = roomTypes[parseInt(index)];
            if (room) {
                totalCapacity += count * room.capacity;
            }
        });

        if (totalCapacity >= totalGuests) {
            console.log('Auto-selected rooms:', bestCombination);
            setSelectedRoomCounts(bestCombination);
        } else {
            console.log('Could not find adequate room combination');
        }
    }, [bookingData, roomTypes, hotelv, selectedRoomCounts]);

    // Calculate total price including room selections and booking duration
    const calculateTotalPrice = useCallback(() => {
        if (!hotelv || !bookingData) {
            console.log('Cannot calculate price - missing data');
            return;
        }

        let basePrice = parseInt(hotelv.price) || 0;
        let roomsTotal = 0;

        // Calculate room costs
        roomTypes.forEach((room, index) => {
            const count = selectedRoomCounts[index] || 0;
            roomsTotal += count * room.pricePerRoom;
        });

        // Calculate total for all nights
        const totalNightly = (basePrice + roomsTotal) * (bookingData.nights || 1);
        console.log('Price calculation:', {
            basePrice,
            roomsTotal,
            nights: bookingData.nights,
            totalNightly
        });
        setTotalPrice(totalNightly);
    }, [hotelv, roomTypes, selectedRoomCounts, bookingData]);

    // Check if current selection is optimal (minimum cost)
    const isOptimalSelection = useCallback(() => {
        if (!bookingData || roomTypes.length === 0) return true;
        
        const totalGuests = bookingData.adults + bookingData.children;
        let minCost = Infinity;
        let optimalCombination: { [key: number]: number } = {};

        // Recalculate optimal combination
        const generateCombinations = (remainingGuests: number, roomIndex: number, currentCombination: { [key: number]: number }, currentCost: number) => {
            if (remainingGuests <= 0) {
                if (currentCost < minCost) {
                    minCost = currentCost;
                    optimalCombination = { ...currentCombination };
                }
                return;
            }

            if (roomIndex >= roomTypes.length) return;

            const room = roomTypes[roomIndex];
            const maxAvailable = room.name.toLowerCase().includes("single") 
                ? (hotelv?.availableSingle || 0) 
                : (hotelv?.availableDouble || 0);

            for (let quantity = 0; quantity <= maxAvailable; quantity++) {
                const guestsAccommodated = quantity * room.capacity;
                const cost = quantity * room.pricePerRoom;
                
                if (guestsAccommodated <= remainingGuests || remainingGuests <= 0) {
                    const newCombination = { ...currentCombination };
                    if (quantity > 0) {
                        newCombination[roomIndex] = quantity;
                    }
                    
                    generateCombinations(
                        remainingGuests - guestsAccommodated,
                        roomIndex + 1,
                        newCombination,
                        currentCost + cost
                    );
                }
            }
        };

        generateCombinations(totalGuests, 0, {}, 0);

        // Compare current selection with optimal
        const currentKeys = Object.keys(selectedRoomCounts).sort();
        const optimalKeys = Object.keys(optimalCombination).sort();
        
        if (currentKeys.length !== optimalKeys.length) return false;
        
        return currentKeys.every(key => selectedRoomCounts[parseInt(key)] === optimalCombination[parseInt(key)]);
    }, [bookingData, roomTypes, hotelv, selectedRoomCounts]);

    // Reset to minimum cost selection
    const resetToMinimumCost = () => {
        console.log('Resetting to minimum cost selection');
        setSelectedRoomCounts({});
        setTimeout(() => autoSelectRooms(), 100);
    };

    useEffect(() => {
        autoSelectRooms();
    }, [autoSelectRooms]);

    // Recalculate price when dependencies change
    useEffect(() => {
        calculateTotalPrice();
    }, [calculateTotalPrice]);

    // Handle room count changes with comprehensive validation
    const handleRoomCountChange = (index: number, change: number) => {
        if (!bookingData) return;

        const totalGuests = bookingData.adults + bookingData.children;

        setSelectedRoomCounts(prevCounts => {
            const room = roomTypes[index];
            if (!room) return prevCounts;

            // Determine max available rooms
            let maxAvailableRooms = 0;
            if (room.name.toLowerCase().includes("single")) {
                maxAvailableRooms = hotelv?.availableSingle || 0;
            } else {
                maxAvailableRooms = hotelv?.availableDouble || 0;
            }

            const currentCount = prevCounts[index] || 0;
            const newCount = currentCount + change;

            // Validate room availability
            if (change > 0 && currentCount >= maxAvailableRooms) {
                setCapacityWarning(`No more ${room.name}s available. Only ${maxAvailableRooms} rooms of this type are available.`);
                return prevCounts;
            }

            // Ensure count doesn't go below 0
            const clampedCount = Math.max(0, Math.min(newCount, maxAvailableRooms));

            const newSelectedRoomCounts = {
                ...prevCounts,
                [index]: clampedCount,
            };

            // Calculate total capacity and cost with new selection
            let newTotalCapacity = 0;
            let totalRoomCost = 0;
            Object.entries(newSelectedRoomCounts).forEach(([idx, count]) => {
                const r = roomTypes[parseInt(idx)];
                if (r) {
                    newTotalCapacity += count * r.capacity;
                    totalRoomCost += count * r.pricePerRoom;
                }
            });

            // Comprehensive validation messages
            if (newTotalCapacity === 0) {
                setCapacityWarning('Please select at least one room for your stay.');
            } else if (newTotalCapacity < totalGuests) {
                const shortfall = totalGuests - newTotalCapacity;
                setCapacityWarning(`Insufficient capacity. You need accommodation for ${shortfall} more guest${shortfall > 1 ? 's' : ''}. Current selection accommodates ${newTotalCapacity} guests but you have ${totalGuests} guests.`);
            } else if (newTotalCapacity > totalGuests + 2) {
                const excess = newTotalCapacity - totalGuests;
                setCapacityWarning(`You've selected rooms for ${excess} extra guests. This will increase your cost but you can proceed if you prefer more space.`);
            } else {
                setCapacityWarning('');
            }

            return newSelectedRoomCounts;
        });
    };

    // Handle carousel scroll
    const handleScroll = useCallback((event: any) => {
        if (carouselWidth > 0) {
            const newIndex = Math.round(event.nativeEvent.contentOffset.x / carouselWidth);
            setActiveIndex(newIndex);
        }
    }, [carouselWidth]);

    // UPDATED HOTEL BOOKING HANDLER WITH PAYHERE CHECKOUT REDIRECTION
    const handleBooking = async () => {
        console.log('=== HOTEL BOOKING DEBUG START ===');
        console.log('🏨 Starting hotel booking with PayHere integration...');
        
        if (isBookingInProgress) return;
        setIsBookingInProgress(true);

        try {
            // Step 1: Validate required data
            if (!hotelv || !bookingData) {
                console.log('❌ Missing required data');
                Alert.alert('Error', 'Missing hotel or booking data');
                return;
            }

            // Step 2: Check room selection and capacity
            const hasSelectedRooms = Object.values(selectedRoomCounts).some(count => count > 0);
            if (!hasSelectedRooms) {
                console.log('❌ No rooms selected');
                Alert.alert('No Rooms Selected', 'Please select at least one room for your stay.');
                return;
            }

            // Step 3: Validate guest capacity
            let totalRoomCapacity = 0;
            Object.entries(selectedRoomCounts).forEach(([index, count]) => {
                const room = roomTypes[parseInt(index)];
                if (room) {
                    totalRoomCapacity += count * room.capacity;
                }
            });

            const totalGuests = bookingData.adults + bookingData.children;
            if (totalRoomCapacity < totalGuests) {
                console.log('❌ Insufficient accommodation');
                Alert.alert('Insufficient Accommodation', 
                    `You need accommodation for ${totalGuests} guests but selected rooms can only accommodate ${totalRoomCapacity} guests. Please select more rooms.`
                );
                return;
            }

            // Step 4: Get authentication
            const token = await AsyncStorage.getItem("token");
            if (!token) {
                console.log('❌ No authentication token');
                Alert.alert('Authentication Required', 'Please log in to make a booking.');
                return;
            }

            const decodedToken = jwtDecode<MyToken>(token);
            console.log('✅ Token decoded, user ID:', decodedToken.id);

            // Step 5: Prepare room details
            const roomDetails: string[] = [];
            Object.entries(selectedRoomCounts).forEach(([index, count]) => {
                if (count > 0) {
                    const roomType = roomTypes[parseInt(index)].name;
                    roomDetails.push(`${count} ${roomType}${count > 1 ? 's' : ''}`);
                }
            });

            // Step 6: Calculate service dates
            const checkInDateTime = new Date(bookingData.selectedDates + 'T15:00:00').toISOString();
            const checkOutDateTime = new Date(bookingData.selectedoutDates + 'T11:00:00').toISOString();

            // Step 7: Prepare booking request for unified BookingController
            const bookingRequest = {
                // Core booking fields
                travelerId: decodedToken.id,
                providerId: Array.isArray(id) ? id[0] : id.toString(),
                providerType: "hotel",
                serviceName: hotelv.name,
                serviceDescription: `Hotel stay at ${hotelv.name} for ${bookingData.nights} nights`,
                serviceStartDate: checkInDateTime,
                serviceEndDate: checkOutDateTime,
                totalAmount: totalPrice,
                currency: "LKR",
                numberOfGuests: totalGuests,
                contactInformation: decodedToken.email,
                specialRequests: `Check-in: ${bookingData.selectedDates}, Check-out: ${bookingData.selectedoutDates}. Adults: ${bookingData.adults}, Children: ${bookingData.children}. Rooms: ${roomDetails.join(', ')}`,
                
                // Hotel-specific fields
                checkInDate: bookingData.selectedDates,
                checkOutDate: bookingData.selectedoutDates,
                numberOfRooms: Object.values(selectedRoomCounts).reduce((sum, count) => sum + count, 0),
                numberOfNights: bookingData.nights,
                roomTypes: roomDetails,
                adults: bookingData.adults,
                children: bookingData.children,
                
                // Additional hotel details for booking record
                title: hotelv.name,
                location: hotelv.location,
                thumbnail: hotelv.thumbnail || (hotelv.images && hotelv.images[0]) || '',
                stars: hotelv.stars,
                ratings: rating,
                facilities: facilities.map(f => f.title),
                mobileNumber: hotelv.mobileNumber
            };

            console.log('📋 Hotel booking request prepared:', JSON.stringify(bookingRequest, null, 2));

            // Step 8: Create hotel booking through unified BookingController
            console.log('🔄 Step 1: Creating hotel booking...');
            const bookingResponse = await fetch('http://localhost:8080/api/bookings/hotel/create', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(bookingRequest)
            });

            if (!bookingResponse.ok) {
                const errorText = await bookingResponse.text();
                throw new Error(`Booking creation failed: ${bookingResponse.status} - ${errorText}`);
            }

            const bookingResult = await bookingResponse.json();
            console.log('✅ Step 1: Hotel booking created successfully:', bookingResult);

            if (!bookingResult.success) {
                throw new Error(bookingResult.message || 'Hotel booking creation failed');
            }

            // Step 9: Create PayHere checkout using the same pattern as guide booking
            console.log('🔄 Step 2: Creating PayHere checkout...');
            const checkoutPayload = {
                bookingId: bookingResult.bookingId,
                amount: totalPrice,
                firstName: decodedToken.username || 'Hotel',
                lastName: 'Guest',
                email: decodedToken.email || 'guest@hotel.lk',
                phone: hotelv.mobileNumber || '+94771234567',
                address: hotelv.location || 'Colombo',
                city: 'Colombo',
                country: 'Sri Lanka',
                items: `${hotelv.name} - ${bookingData.nights} nights`
            };

            const checkoutResponse = await fetch('http://localhost:8080/api/payments/payhere/create-checkout', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(checkoutPayload)
            });

            if (!checkoutResponse.ok) {
                const errorText = await checkoutResponse.text();
                throw new Error(`Payment checkout creation failed: ${checkoutResponse.status} - ${errorText}`);
            }

            const paymentResponse = await checkoutResponse.json();
            console.log('✅ Step 2: PayHere checkout created successfully:', paymentResponse);

            if (!paymentResponse.success) {
                throw new Error(paymentResponse.message || 'Payment checkout creation failed');
            }

            // Step 10: Navigate to PayHere checkout page (SAME AS GUIDE BOOKING)
            if (paymentResponse.success && paymentResponse.paymentObject) {
                console.log('✅ Step 3: Payment data valid, navigating to PayHere checkout...');
                
                // Navigate to PayHere checkout page with payment data (SAME AS GUIDE BOOKING)
                router.push({
                    pathname: '../../../views/PayHereCheckout/[id]',
                    params: {
                        paymentData: JSON.stringify(paymentResponse.paymentObject),
                        bookingId: bookingResult.bookingId,
                        orderId: paymentResponse.orderId,
                        // Add hotel-specific booking details for confirmation page
                        bookingType: 'hotel',
                        hotelName: hotelv.name,
                        checkInDate: bookingData.selectedDates,
                        checkOutDate: bookingData.selectedoutDates,
                        numberOfNights: bookingData.nights.toString(),
                        totalGuests: totalGuests.toString(),
                        roomDetails: JSON.stringify(roomDetails),
                        totalAmount: totalPrice.toString(),
                        hotelLocation: hotelv.location,
                        hotelStars: hotelv.stars.toString()
                    }
                });
            } else {
                console.log('❌ Step 3: Invalid payment response - missing paymentObject');
                console.log('Available keys in response:', Object.keys(paymentResponse));
                throw new Error('Invalid payment response from server - missing paymentObject');
            }

            // Store booking info for potential future use
            await AsyncStorage.setItem('lastHotelBooking', JSON.stringify({
                bookingId: bookingResult.bookingId,
                orderId: paymentResponse.orderId,
                hotelName: hotelv.name,
                amount: totalPrice,
                status: 'pending_payment',
                checkIn: bookingData.selectedDates,
                checkOut: bookingData.selectedoutDates,
                rooms: roomDetails,
                guests: totalGuests
            }));

            console.log('✅ Hotel booking process completed successfully');

        } catch (error) {
            console.error('❌ Hotel booking error:', error);
            
            let errorMessage = 'An unexpected error occurred. Please try again.';
            if (error instanceof Error) {
                errorMessage = error.message;
                console.error('Error stack:', error.stack);
            }
            
            // Show user-friendly error messages
            if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
                errorMessage = 'Network error. Please check your internet connection and try again.';
            } else if (errorMessage.includes('Authentication')) {
                errorMessage = 'Authentication failed. Please log in again.';
            } else if (errorMessage.includes('validation')) {
                errorMessage = 'Invalid booking data. Please check your selections and try again.';
            }
            
            Alert.alert(
                'Hotel Booking Failed ❌', 
                errorMessage + '\n\nIf the problem persists, please contact support.',
                [
                    { text: 'Try Again', onPress: () => console.log('User will try again') },
                    { text: 'Contact Support', onPress: () => console.log('Navigate to support') }
                ]
            );
        } finally {
            setIsBookingInProgress(false);
            console.log('🏁 Hotel booking process finished');
        }
        console.log('=== HOTEL BOOKING DEBUG END ===');
    };

    // Info Modal Component
    const InfoModal = ({ visible, onClose, title, content }: { 
        visible: boolean; 
        onClose: () => void; 
        title: string; 
        content: string; 
    }) => (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View className="flex-1 justify-center items-center bg-black/50">
                <View className="bg-white rounded-xl p-6 mx-4 max-w-md">
                    <View className="flex-row justify-between items-center mb-4">
                        <Text className="text-xl font-bold text-gray-900">{title}</Text>
                        <TouchableOpacity
                            onPress={onClose}
                            className="w-8 h-8 bg-gray-100 rounded-full items-center justify-center"
                        >
                            <Text className="text-gray-600 font-bold">×</Text>
                        </TouchableOpacity>
                    </View>
                    <Text className="text-gray-700 text-base leading-6">{content}</Text>
                </View>
            </View>
        </Modal>
    );

    // Loading state
    if (isLoading || !hotelv) {
        return (
            <View className="flex-1 justify-center items-center bg-yellow-50">
                <View className="w-16 h-16 bg-yellow-400 rounded-full items-center justify-center mb-4">
                    <Text className="text-2xl">🏨</Text>
                </View>
                <Text className="text-lg text-yellow-800 font-medium">Loading hotel details...</Text>
            </View>
        );
    }

    return (
        <View className={`${Platform.OS === 'web' ? 'h-screen overflow-auto' : 'h-full'} bg-yellow-50`}>
            {/* Header */}
            <View className="flex-row items-center justify-between p-4 bg-white shadow-sm">
                <TouchableOpacity 
                    onPress={() => router.back()}
                    className="w-12 h-12 bg-yellow-100 rounded-full items-center justify-center"
                >
                    <Text className="text-yellow-700 text-xl font-bold">←</Text>
                </TouchableOpacity>
                <Text className="text-xl font-bold text-gray-800">🏨 Hotel Details</Text>
                <View className="w-12 h-12 bg-yellow-100 rounded-full items-center justify-center">
                    <Text className="text-yellow-700 text-xl">❤️</Text>
                </View>
            </View>

            <ScrollView
                className="flex-1"
                contentContainerStyle={{ paddingBottom: 120 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Hotel Images Carousel */}
                <View className="h-72 bg-gray-200 relative"
                    onLayout={(event) => setCarouselWidth(event.nativeEvent.layout.width)}
                >
                    {carouselWidth > 0 && hotelv.images && hotelv.images.length > 0 && (
                        <ScrollView
                            horizontal
                            pagingEnabled
                            onScroll={handleScroll}
                            scrollEventThrottle={16}
                            showsHorizontalScrollIndicator={false}
                        >
                            {hotelv.images.map((image, index) => (
                                <View key={index} style={{ width: carouselWidth }} className="h-full">
                                    <Image
                                        source={{ uri: `data:image/jpeg;base64,${image}` }}
                                        className="h-full w-full"
                                        contentFit="cover"
                                    />
                                </View>
                            ))}
                        </ScrollView>
                    )}
                    
                    {/* Image indicators */}
                    {hotelv.images && hotelv.images.length > 1 && (
                        <View className="absolute bottom-4 left-0 right-0 flex-row justify-center">
                            {hotelv.images.map((_, index) => (
                                <View
                                    key={index}
                                    className={`w-2 h-2 rounded-full mx-1 ${
                                        index === activeIndex ? 'bg-yellow-400' : 'bg-white/70'
                                    }`}
                                />
                            ))}
                        </View>
                    )}

                    {/* Photo count badge */}
                    <View className="absolute top-4 right-4 bg-black/60 px-3 py-1 rounded-full">
                        <Text className="text-white text-sm font-medium">
                            📸 {activeIndex + 1}/{hotelv.images?.length || 0}
                        </Text>
                    </View>
                </View>

                {/* Hotel Info */}
                <View className="bg-white mx-4 mt-4 rounded-xl p-6 shadow-sm">
                    <View className="flex-row justify-between items-start mb-4">
                        <View className="flex-1 pr-4">
                            <Text className="text-2xl font-bold text-gray-900 mb-2">
                                {hotelv.name}
                            </Text>
                            <View className="flex-row items-center mb-3">
                                <Text className="text-yellow-600 text-lg mr-2">📍</Text>
                                <Text className="text-gray-700 flex-1">{hotelv.location}</Text>
                            </View>
                            {hotelv.distance && (
                                <View className="flex-row items-center mb-3">
                                    <Text className="text-yellow-600 text-lg mr-2">🚗</Text>
                                    <Text className="text-gray-600">{hotelv.distance}</Text>
                                </View>
                            )}
                            <View className="flex-row items-center">
                                <View className="flex-row mr-3">
                                    {[...Array(hotelv.stars)].map((_, index) => (
                                        <Text key={index} className="text-yellow-400 text-lg">⭐</Text>
                                    ))}
                                </View>
                                <Text className="text-gray-600 text-sm">{hotelv.stars} Star Hotel</Text>
                            </View>
                        </View>
                        <View className="items-end">
                            <View className="bg-yellow-100 px-4 py-2 rounded-full mb-3 border border-yellow-200">
                                <View className="flex-row items-center">
                                    <Text className="text-yellow-800 font-bold text-lg mr-1">{rating.toFixed(1)}</Text>
                                    <Text className="text-yellow-600">⭐</Text>
                                </View>
                                <Text className="text-yellow-700 text-xs text-center">
                                    {getRatingDescription(rating)}
                                </Text>
                            </View>
                            <View className="items-end">
                                <View className="flex-row items-center">
                                    <Text className="text-2xl font-bold text-green-600">
                                        LKR {hotelv.price}
                                    </Text>
                                    <TouchableOpacity
                                        onPress={() => setShowPriceInfo(true)}
                                        className="ml-2 w-6 h-6 bg-yellow-100 rounded-full items-center justify-center"
                                    >
                                        <Text className="text-yellow-600 text-sm font-bold">ℹ️</Text>
                                    </TouchableOpacity>
                                </View>
                                <Text className="text-xs text-gray-500">
                                    {hotelv.priceDescription || 'per night'}
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Contact Button */}
                    <TouchableOpacity className="bg-yellow-400 flex-row items-center justify-center py-3 rounded-lg mb-4">
                        <Text className="text-lg mr-2">📞</Text>
                        <Text className="text-yellow-900 font-semibold">Contact Hotel</Text>
                    </TouchableOpacity>

                    {/* Special Offer Banner */}
                    {hotelv.specialOffer && (
                        <View className="bg-gradient-to-r from-yellow-100 to-orange-100 p-4 rounded-lg mb-4 border border-yellow-200">
                            <View className="flex-row items-center">
                                <Text className="text-2xl mr-3">🎉</Text>
                                <View className="flex-1">
                                    <Text className="text-orange-800 font-bold text-sm mb-1">SPECIAL OFFER</Text>
                                    <Text className="text-orange-700 text-sm">{hotelv.specialOffer}</Text>
                                </View>
                            </View>
                        </View>
                    )}

                    {/* Free Features */}
                    {hotelv.freeFeatures && hotelv.freeFeatures.length > 0 && (
                        <View className="mb-4">
                            <Text className="text-lg font-semibold text-gray-900 mb-3">✨ Free Amenities</Text>
                            <View className="flex-row flex-wrap">
                                {hotelv.freeFeatures.map((feature, index) => (
                                    <View key={index} className="bg-green-100 px-3 py-2 rounded-full mr-2 mb-2 border border-green-200">
                                        <Text className="text-green-700 text-sm font-medium">
                                            ✅ {feature}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}

                    {/* Description */}
                    {hotelv.description && (
                        <View className="mb-4">
                            <Text className="text-lg font-semibold text-gray-900 mb-2">📋 About This Hotel</Text>
                            <Text className="text-gray-700 text-base leading-6">
                                {hotelv.description}
                            </Text>
                        </View>
                    )}

                    {/* Tax Information */}
                    {hotelv.taxes && (
                        <View className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                            <View className="flex-row items-start">
                                <Text className="text-blue-600 text-lg mr-2">💡</Text>
                                <Text className="text-blue-800 text-sm flex-1">{hotelv.taxes}</Text>
                            </View>
                        </View>
                    )}
                </View>

                {/* Booking Summary */}
                {bookingData && (
                    <View className="mx-4 my-4 bg-yellow-100 rounded-xl p-6 border-2 border-yellow-200">
                        <View className="flex-row items-center mb-4">
                            <Text className="text-2xl mr-3">📅</Text>
                            <Text className="text-xl font-bold text-yellow-900">Your Booking</Text>
                        </View>
                        <View className="space-y-3">
                            <View className="flex-row justify-between items-center">
                                <View className="flex-row items-center">
                                    <Text className="text-yellow-700 text-lg mr-2">🏃‍♂️</Text>
                                    <Text className="text-yellow-800 font-medium">Check-in</Text>
                                </View>
                                <Text className="text-yellow-900 font-bold">{bookingData.selectedDates}</Text>
                            </View>
                            <View className="flex-row justify-between items-center">
                                <View className="flex-row items-center">
                                    <Text className="text-yellow-700 text-lg mr-2">🏃‍♀️</Text>
                                    <Text className="text-yellow-800 font-medium">Check-out</Text>
                                </View>
                                <Text className="text-yellow-900 font-bold">{bookingData.selectedoutDates}</Text>
                            </View>
                            <View className="flex-row justify-between items-center">
                                <View className="flex-row items-center">
                                    <Text className="text-yellow-700 text-lg mr-2">👥</Text>
                                    <Text className="text-yellow-800 font-medium">Guests</Text>
                                </View>
                                <Text className="text-yellow-900 font-bold">
                                    {bookingData.adults} Adults, {bookingData.children} Children
                                </Text>
                            </View>
                            <View className="flex-row justify-between items-center">
                                <View className="flex-row items-center">
                                    <Text className="text-yellow-700 text-lg mr-2">🌙</Text>
                                    <Text className="text-yellow-800 font-medium">Nights</Text>
                                </View>
                                <Text className="text-yellow-900 font-bold">{bookingData.nights}</Text>
                            </View>
                        </View>
                    </View>
                )}

                {/* Unavailable Days */}
                {hotelv.unavailable && hotelv.unavailable.length > 0 && (
                    <View className="mx-4 mb-4 bg-red-50 rounded-xl p-4 border border-red-200">
                        <View className="flex-row items-center mb-3">
                            <Text className="text-2xl mr-3">🚫</Text>
                            <Text className="text-lg font-semibold text-red-900">Unavailable Days</Text>
                        </View>
                        <Text className="text-red-700 mb-3">This hotel is not available on the following days:</Text>
                        <View className="flex-row flex-wrap">
                            {hotelv.unavailable.map((day, index) => (
                                <View key={index} className="bg-red-200 px-3 py-2 rounded-full mr-2 mb-2">
                                    <Text className="text-red-800 font-medium">{day}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                )}

                {/* Facilities */}
                {facilities.length > 0 && (
                    <View className="mx-4 mb-4 bg-white rounded-xl p-4 shadow-sm">
                        <View className="flex-row items-center mb-4">
                            <Text className="text-lg font-semibold text-gray-900">Facilities</Text>
                        </View>
                        <View className="flex-row flex-wrap">
                            {facilities.map((facility, index) => {
                                // Map facility names to appropriate icons
                                const getFacilityIcon = (title: string | null | undefined) => {
                                    if (!title || typeof title !== 'string') return '🏨';
                                    const lowerTitle = title.toLowerCase();
                                    if (lowerTitle.includes('wifi') || lowerTitle.includes('internet')) return '📶';
                                    if (lowerTitle.includes('pool') || lowerTitle.includes('swimming')) return '🏊';
                                    if (lowerTitle.includes('gym') || lowerTitle.includes('fitness')) return '💪';
                                    if (lowerTitle.includes('spa') || lowerTitle.includes('massage')) return '💆';
                                    if (lowerTitle.includes('restaurant') || lowerTitle.includes('dining')) return '🍽️';
                                    if (lowerTitle.includes('bar') || lowerTitle.includes('lounge')) return '🍸';
                                    if (lowerTitle.includes('parking')) return '🅿️';
                                    if (lowerTitle.includes('ac') || lowerTitle.includes('air')) return '❄️';
                                    if (lowerTitle.includes('tv') || lowerTitle.includes('television')) return '📺';
                                    if (lowerTitle.includes('laundry') || lowerTitle.includes('cleaning')) return '🧺';
                                    if (lowerTitle.includes('concierge') || lowerTitle.includes('service')) return '🛎️';
                                    if (lowerTitle.includes('elevator') || lowerTitle.includes('lift')) return '🛗';
                                    if (lowerTitle.includes('balcony') || lowerTitle.includes('terrace')) return '🏞️';
                                    if (lowerTitle.includes('safe') || lowerTitle.includes('security')) return '🔒';
                                    if (lowerTitle.includes('room service')) return '🛏️';
                                    return '🏨';
                                };

                                return (
                                    <View key={index} className="bg-yellow-50 rounded-lg p-3 m-1 border border-yellow-200">
                                        <View className="flex-row items-center">
                                            <Text className="text-lg mr-2">{getFacilityIcon(facility.title)}</Text>
                                            <Text className="text-sm text-gray-700 font-medium">
                                                {facility.title}
                                            </Text>
                                        </View>
                                    </View>
                                );
                            })}
                        </View>
                    </View>
                )}

                {/* Charge Breakdown */}
                {bookingData && (totalPrice > 0 || Object.keys(selectedRoomCounts).some(key => selectedRoomCounts[parseInt(key)] > 0)) && (
                    <View className="mx-4 mb-4 bg-white rounded-xl p-4 shadow-sm">
                        <View className="flex-row items-center justify-between mb-4">
                            <View className="flex-row items-center">
                                <Text className="text-lg font-semibold text-gray-900">Charge Breakdown</Text>
                                {isOptimalSelection() ? (
                                    <View className="ml-2 bg-green-100 px-2 py-1 rounded-full">
                                        <Text className="text-green-800 text-xs font-medium">Minimum Cost Option</Text>
                                    </View>
                                ) : (
                                    <View className="ml-2 bg-orange-100 px-2 py-1 rounded-full">
                                        <Text className="text-orange-800 text-xs font-medium">Customized Selection</Text>
                                    </View>
                                )}
                            </View>
                            {!isOptimalSelection() && (
                                <TouchableOpacity
                                    onPress={resetToMinimumCost}
                                    className="bg-blue-100 px-3 py-1 rounded-full"
                                >
                                    <Text className="text-blue-800 text-xs font-medium">Reset to Min Cost</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                        
                        {/* Base Hotel Price */}
                        <View className="bg-gray-50 rounded-lg p-3 mb-3">
                            <View className="flex-row justify-between items-center mb-2">
                                <Text className="text-gray-700 font-medium">Base Hotel Rate</Text>
                                <Text className="text-gray-900 font-semibold">LKR {parseInt(hotelv.price).toLocaleString()}</Text>
                            </View>
                            <Text className="text-xs text-gray-600">per night × {bookingData.nights} nights</Text>
                        </View>

                        {/* Room Charges */}
                        {Object.entries(selectedRoomCounts).map(([index, count]) => {
                            if (count === 0) return null;
                            const room = roomTypes[parseInt(index)];
                            if (!room) return null;
                            
                            return (
                                <View key={index} className="bg-blue-50 rounded-lg p-3 mb-3">
                                    <View className="flex-row justify-between items-center mb-1">
                                        <Text className="text-blue-700 font-medium">
                                            {count}x {room.name}
                                        </Text>
                                        <Text className="text-blue-900 font-semibold">
                                            LKR {(count * room.pricePerRoom * bookingData.nights).toLocaleString()}
                                        </Text>
                                    </View>
                                    <Text className="text-xs text-blue-600">
                                        LKR {room.pricePerRoom.toLocaleString()} per room × {count} room{count > 1 ? 's' : ''} × {bookingData.nights} nights
                                    </Text>
                                    <Text className="text-xs text-blue-600 mt-1">
                                        Accommodates up to {count * room.capacity} guests
                                    </Text>
                                </View>
                            );
                        })}

                        {/* Cost Comparison */}
                        {!isOptimalSelection() && (
                            <View className="bg-amber-50 p-3 rounded-lg mb-3 border border-amber-200">
                                <View className="flex-row items-center mb-1">
                                    <Text className="text-amber-600 text-sm mr-2">💡</Text>
                                    <Text className="text-amber-800 font-medium text-sm">Cost Comparison</Text>
                                </View>
                                <Text className="text-amber-700 text-xs">
                                    Your selection costs more than the minimum option. You can save money by clicking "Reset to Min Cost" above.
                                </Text>
                            </View>
                        )}

                        {/* Subtotal */}
                        <View className="border-t border-gray-200 pt-3">
                            <View className="flex-row justify-between items-center mb-2">
                                <Text className="text-gray-700">Subtotal per night:</Text>
                                <Text className="text-gray-900 font-medium">
                                    LKR {Math.round(totalPrice / (bookingData.nights || 1)).toLocaleString()}
                                </Text>
                            </View>
                            <View className="flex-row justify-between items-center mb-3">
                                <Text className="text-gray-700">Number of nights:</Text>
                                <Text className="text-gray-900 font-medium">{bookingData.nights}</Text>
                            </View>
                            <View className="flex-row justify-between items-center bg-yellow-100 p-3 rounded-lg">
                                <Text className="text-yellow-800 font-bold text-lg">Total Amount:</Text>
                                <Text className="text-yellow-900 font-bold text-xl">
                                    LKR {totalPrice.toLocaleString()}
                                </Text>
                            </View>
                        </View>

                        {/* Guest Capacity Summary */}
                        <View className="mt-3 bg-green-50 p-3 rounded-lg border border-green-200">
                            <View className="flex-row justify-between items-center">
                                <Text className="text-green-700 font-medium">Total Guest Capacity:</Text>
                                <Text className="text-green-800 font-semibold">
                                    {Object.entries(selectedRoomCounts).reduce((total, [index, count]) => {
                                        const room = roomTypes[parseInt(index)];
                                        return total + (room ? count * room.capacity : 0);
                                    }, 0)} guests
                                </Text>
                            </View>
                            <Text className="text-xs text-green-600 mt-1">
                                Your booking: {bookingData.adults} adults + {bookingData.children} children = {bookingData.adults + bookingData.children} guests
                            </Text>
                        </View>
                    </View>
                )}

                {/* Room Selection */}
                {roomTypes.length > 0 && (
                    <View className="mx-4 mb-4 bg-white rounded-xl p-4 shadow-sm">
                        <View className="flex-row items-center justify-between mb-4">
                            <Text className="text-lg font-semibold text-gray-900">Choose Your Rooms</Text>
                            <TouchableOpacity
                                onPress={() => setShowRoomInfo(true)}
                                className="w-6 h-6 bg-yellow-100 rounded-full items-center justify-center"
                            >
                                <Text className="text-yellow-600 text-xs font-bold">i</Text>
                            </TouchableOpacity>
                        </View>
                        
                        {/* Availability Summary */}
                        <View className="bg-yellow-50 p-3 rounded-lg mb-4 border border-yellow-200">
                            <Text className="text-yellow-800 font-medium text-sm mb-1">Room Availability</Text>
                            <View className="flex-row justify-between">
                                <Text className="text-yellow-700 text-xs">🛏️ Single: {hotelv.availableSingle} available</Text>
                                <Text className="text-yellow-700 text-xs">🛏️🛏️ Double: {hotelv.availableDouble} available</Text>
                            </View>
                        </View>

                        {roomTypes.map((room, index) => (
                            <View key={index} className="bg-gray-50 rounded-lg p-4 mb-3">
                                <View className="flex-row items-center">
                                    {/* Room Icon */}
                                    <View className="w-12 h-12 bg-yellow-100 rounded-lg items-center justify-center mr-3">
                                        <Text className="text-lg">
                                            {room.name.toLowerCase().includes("single") ? "🛏️" : "🛏️🛏️"}
                                        </Text>
                                    </View>
                                    
                                    {/* Room Details */}
                                    <View className="flex-1">
                                        <Text className="font-semibold text-gray-900 text-base">{room.name}</Text>
                                        <Text className="text-sm text-gray-600">Up to {room.capacity} guests</Text>
                                        <Text className="text-sm text-green-600">
                                            {room.name.toLowerCase().includes("single") ? hotelv.availableSingle : hotelv.availableDouble} rooms available
                                        </Text>
                                        <Text className="text-lg font-bold text-green-600 mt-1">
                                            LKR {room.pricePerRoom.toLocaleString()}<Text className="text-sm text-gray-500 font-normal">/night</Text>
                                        </Text>
                                    </View>
                                    
                                    {/* Counter Controls */}
                                    <View className="flex-row items-center">
                                        <TouchableOpacity
                                            className="w-10 h-10 bg-gray-200 rounded-full items-center justify-center"
                                            onPress={() => handleRoomCountChange(index, -1)}
                                        >
                                            <Text className="text-lg font-bold text-gray-600">−</Text>
                                        </TouchableOpacity>
                                        <View className="w-10 h-10 bg-yellow-400 rounded-full items-center justify-center mx-2">
                                            <Text className="text-lg font-bold text-yellow-900">
                                                {selectedRoomCounts[index] || 0}
                                            </Text>
                                        </View>
                                        <TouchableOpacity
                                            className="w-10 h-10 bg-yellow-400 rounded-full items-center justify-center"
                                            onPress={() => handleRoomCountChange(index, 1)}
                                        >
                                            <Text className="text-lg font-bold text-yellow-900">+</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        ))}
                        
                        {capacityWarning ? (
                            <View className={`p-3 rounded-lg border ${
                                capacityWarning.includes('Insufficient') ? 'bg-red-50 border-red-200' :
                                capacityWarning.includes('extra guests') ? 'bg-orange-50 border-orange-200' :
                                'bg-amber-50 border-amber-200'
                            }`}>
                                <View className="flex-row items-start">
                                    <Text className={`text-lg mr-2 ${
                                        capacityWarning.includes('Insufficient') ? 'text-red-600' :
                                        capacityWarning.includes('extra guests') ? 'text-orange-600' :
                                        'text-amber-600'
                                    }`}>
                                        {capacityWarning.includes('Insufficient') ? '❌' :
                                         capacityWarning.includes('extra guests') ? '💰' : '⚠️'}
                                    </Text>
                                    <Text className={`font-medium text-sm flex-1 ${
                                        capacityWarning.includes('Insufficient') ? 'text-red-800' :
                                        capacityWarning.includes('extra guests') ? 'text-orange-800' :
                                        'text-amber-800'
                                    }`}>
                                        {capacityWarning}
                                    </Text>
                                </View>
                            </View>
                        ) : (
                            <View className="bg-green-50 p-3 rounded-lg border border-green-200">
                                <View className="flex-row items-center">
                                    <Text className="text-green-600 text-lg mr-2">✅</Text>
                                    <Text className="text-green-800 font-medium text-sm">
                                        Perfect! Your room selection accommodates all guests comfortably.
                                    </Text>
                                </View>
                            </View>
                        )}
                    </View>
                )}

                {/* Reviews */}
                {reviews.length > 0 && (
                    <View className="mx-4 mb-4 bg-white rounded-xl p-4 shadow-sm">
                        <View className="flex-row items-center justify-between mb-4">
                            <Text className="text-lg font-semibold text-gray-900">Guest Reviews</Text>
                            <View className="bg-yellow-100 px-2 py-1 rounded-full">
                                <Text className="text-yellow-800 text-xs font-medium">{reviews.length} reviews</Text>
                            </View>
                        </View>
                        <ScrollView className="max-h-64" nestedScrollEnabled>
                            {reviews.map((review, index) => (
                                <View key={index} className="bg-gray-50 rounded-lg p-3 mb-3">
                                    <View className="flex-row items-center justify-between mb-2">
                                        <View className="flex-row items-center flex-1">
                                            <View className="w-8 h-8 bg-yellow-100 rounded-full items-center justify-center mr-3">
                                                <Text className="text-sm">👤</Text>
                                            </View>
                                            <View className="flex-1">
                                                <Text className="font-medium text-gray-900 text-sm">
                                                    {review.author}
                                                </Text>
                                                <Text className="text-xs text-gray-600">
                                                    {review.country}
                                                </Text>
                                            </View>
                                        </View>
                                        <View className="bg-yellow-100 px-2 py-1 rounded-full">
                                            <Text className="text-xs font-medium text-yellow-800">⭐ {review.stars}/5</Text>
                                        </View>
                                    </View>
                                    <Text className="text-gray-700 text-sm leading-5">{review.text}</Text>
                                </View>
                            ))}
                        </ScrollView>
                    </View>
                )}

                {/* Policies */}
                {hotelv.policies && hotelv.policies.length > 0 && (
                    <View className="mx-4 mb-4 bg-white rounded-xl p-4 shadow-sm">
                        <View className="flex-row items-center justify-between mb-4">
                            <Text className="text-lg font-semibold text-gray-900">Hotel Policies</Text>
                            <TouchableOpacity
                                onPress={() => setShowPolicyInfo(true)}
                                className="w-6 h-6 bg-yellow-100 rounded-full items-center justify-center"
                            >
                                <Text className="text-yellow-600 text-xs font-bold">i</Text>
                            </TouchableOpacity>
                        </View>
                        {hotelv.policies.map((policy, index) => (
                            <View key={index} className="flex-row items-start mb-2 bg-gray-50 p-3 rounded-lg">
                                <Text className="text-green-500 mr-3 text-sm">✓</Text>
                                <Text className="text-gray-700 flex-1 text-sm leading-5">{policy}</Text>
                            </View>
                        ))}
                    </View>
                )}
            </ScrollView>

            {/* Fixed Bottom Bar - IMPROVED */}
            <View className="absolute bottom-0 left-0 right-0 bg-white border-t-2 border-yellow-200 p-4 shadow-lg" style={{ zIndex: 1000 }}>
                <View className="flex-row items-center justify-between">
                    <View className="flex-1">
                        <View className="flex-row items-center">
                            <Text className="text-lg mr-2">💰</Text>
                            <Text className="text-sm text-gray-600">Total Price</Text>
                        </View>
                        <Text className="text-2xl font-bold text-green-600">
                            LKR {totalPrice.toLocaleString()}
                        </Text>
                        {bookingData && (
                            <Text className="text-xs text-gray-500">
                                for {bookingData.nights} night{bookingData.nights > 1 ? 's' : ''}
                            </Text>
                        )}
                    </View>
                    <TouchableOpacity
                        className={`px-8 py-4 rounded-xl shadow-lg ${isBookingInProgress ? 'bg-gray-400' : 'bg-yellow-400'}`}
                        onPress={() => {
                            console.log('📱 Book Now button pressed!');
                            handleBooking();
                        }}
                        disabled={isBookingInProgress}
                        activeOpacity={0.7}
                        hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                    >
                        <View className="flex-row items-center">
                            <Text className="text-2xl mr-2">🏨</Text>
                            <Text className={`font-bold text-lg ${isBookingInProgress ? 'text-gray-600' : 'text-yellow-900'}`}>
                                {isBookingInProgress ? 'Processing...' : 'Book Now'}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Info Modals */}
            <InfoModal
                visible={showPriceInfo}
                onClose={() => setShowPriceInfo(false)}
                title="💰 Price Information"
                content="This is the base price per night for the hotel room. Additional charges may apply for extra services, taxes, and selected room upgrades. The total price will be calculated based on your room selection and number of nights."
            />

            <InfoModal
                visible={showPolicyInfo}
                onClose={() => setShowPolicyInfo(false)}
                title="📋 Hotel Policies"
                content="These are the hotel's terms and conditions that guests must follow during their stay. Please read them carefully before booking. Policies may include check-in/check-out times, cancellation rules, pet policies, and other important guidelines."
            />

            <InfoModal
                visible={showRoomInfo}
                onClose={() => setShowRoomInfo(false)}
                title="🛏️ Room Selection Guide"
                content="Choose the number and type of rooms based on your guest count. Single rooms accommodate fewer guests, while double rooms can host more. Make sure to select enough room capacity for all your guests. Room prices are per night and will be added to the base hotel price."
            />
        </View>
    );
}
