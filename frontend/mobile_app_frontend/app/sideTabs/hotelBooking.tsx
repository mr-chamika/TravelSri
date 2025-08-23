import React, { useState, useMemo, useCallback, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, TextInput, Modal, KeyboardAvoidingView, Platform } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { cssInterop } from 'nativewind';
import { Image } from 'expo-image';
import AsyncStorage from "@react-native-async-storage/async-storage";

cssInterop(Image, { className: "style" });

const router = useRouter();

// Popular Sri Lankan destinations for search suggestions
const popularDestinations = [
    'Colombo', 'Kandy', 'Galle', 'Nuwara Eliya', 'Jaffna', 'Negombo', 'Bentota', 'Mirissa', 'Ella', 'Sigiriya',
    'Anuradhapura', 'Polonnaruwa', 'Yala National Park', 'Dambulla', 'Trincomalee', 'Arugam Bay', 'Haputale',
    'Bandarawela', 'Kitulgala', 'Pinnawala', 'Horton Plains', 'Adam\'s Peak', 'Tangalle', 'Unawatuna',
    'Hikkaduwa', 'Udawalawe', 'Minneriya', 'Kalpitiya', 'Passikudah', 'Nilaveli'
];

interface Hotel {
    _id: string;
    name: string;
    location: string;
    distance: string;
    ratings: number;
    reviewCount: number;
    thumbnail: string;
    originalPrice: number;
    currentPrice: number;
    taxes: string;
    priceDescription: string;
    specialOffer?: string;
    freeFeatures: string[];
}

interface BookingDetails {
    selectedDates: string;
    selectedoutDates: string;
    adults: number;
    children: number;
    nights: number;
    location: string;
}

export default function HotelsBookingScreen() {
    const [hotels, setHotels] = useState<Hotel[]>([]);
    const [hotelsS, setHotelsS] = useState<Hotel[]>([]);
    const [selectedDates, setSelectedDates] = useState<string>('');
    const [selectedoutDates, setSelectedOutDates] = useState<string>('');
    const [modalVisible, setModalVisible] = useState(true);
    const [bookingComplete, setBookingComplete] = useState(false);
    const [adults, setAdults] = useState(1);
    const [children, setChildren] = useState(0);
    const [nights, setNights] = useState(0);
    const [location, setLocation] = useState('');
    const [showLocationDropdown, setShowLocationDropdown] = useState(false);
    const [locationSearch, setLocationSearch] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [datePickerMode, setDatePickerMode] = useState<'checkin' | 'checkout'>('checkin');

    // Location search states
    const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
    const [filteredDestinations, setFilteredDestinations] = useState<string[]>([]);

    const [bookingDetails, setBookingDetails] = useState<BookingDetails>({
        selectedDates: '',
        selectedoutDates: '',
        adults: 0,
        children: 0,
        nights: 0,
        location: ''
    });

    // Location search functionality
    const searchDestinations = (input: string) => {
        if (input.length < 2) {
            setFilteredDestinations([]);
            setShowLocationSuggestions(false);
            return;
        }

        const filtered = popularDestinations.filter(dest => 
            dest.toLowerCase().includes(input.toLowerCase())
        );
        
        setFilteredDestinations(filtered);
        setShowLocationSuggestions(filtered.length > 0);
    };

    // Debounced location search
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (location) {
                searchDestinations(location);
            }
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [location]);

    const handleLocationSelect = (selectedLocation: string) => {
        setLocation(selectedLocation);
        setShowLocationSuggestions(false);
        setFilteredDestinations([]);
    };

    const handleLocationChange = (text: string) => {
        setLocation(text);
        if (text.length < 2) {
            setShowLocationSuggestions(false);
            setFilteredDestinations([]);
        }
    };

    // Calculate nights when dates change
    useEffect(() => {
        if (selectedDates && selectedoutDates) {
            const checkInDate = new Date(selectedDates);
            const checkOutDate = new Date(selectedoutDates);

            if (checkOutDate > checkInDate) {
                const differenceInTime = checkOutDate.getTime() - checkInDate.getTime();
                const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));
                setNights(differenceInDays);
            } else {
                setNights(0);
            }
        } else {
            setNights(0);
        }
    }, [selectedDates, selectedoutDates]);

    // Generate calendar days with range selection
    const generateCalendarDays = (month: Date) => {
        const year = month.getFullYear();
        const monthIndex = month.getMonth();
        const firstDay = new Date(year, monthIndex, 1);
        const lastDay = new Date(year, monthIndex + 1, 0);
        const today = new Date();
        
        const days = [];
        for (let i = 1; i <= lastDay.getDate(); i++) {
            const date = new Date(year, monthIndex, i);
            const dateString = date.toISOString().split('T')[0];
            const isToday = date.toDateString() === today.toDateString();
            const isPast = date < today && !isToday;
            const isSelected = dateString === selectedDates || dateString === selectedoutDates;
            const isInRange = selectedDates && selectedoutDates && 
                              date >= new Date(selectedDates) && date <= new Date(selectedoutDates);
            
            days.push({
                day: i,
                dateString,
                isToday,
                isPast,
                isSelected,
                isInRange,
                isCheckin: dateString === selectedDates,
                isCheckout: dateString === selectedoutDates
            });
        }
        return days;
    };

    const selectDate = (dateString: string, isPast: boolean) => {
        if (isPast) return;
        
        if (!selectedDates || (selectedDates && selectedoutDates)) {
            // Start new selection
            setSelectedDates(dateString);
            setSelectedOutDates('');
        } else if (selectedDates && !selectedoutDates) {
            // Set checkout date
            if (new Date(dateString) > new Date(selectedDates)) {
                setSelectedOutDates(dateString);
            } else {
                // If selected date is before check-in, reset
                setSelectedDates(dateString);
                setSelectedOutDates('');
            }
        }
    };

    const navigateMonth = (direction: 'prev' | 'next') => {
        setCurrentMonth(prev => {
            const newMonth = new Date(prev);
            if (direction === 'prev') {
                newMonth.setMonth(prev.getMonth() - 1);
            } else {
                newMonth.setMonth(prev.getMonth() + 1);
            }
            return newMonth;
        });
    };

    const handleSubmit = async () => {
        if (selectedoutDates === '' || selectedDates === '' || !location || !adults || children < 0 || nights < 0) {
            alert('Please fill in all fields.');
            return;
        }

        const bookingData: BookingDetails = {
            selectedDates,
            selectedoutDates,
            adults,
            children,
            nights,
            location
        };

        setModalVisible(false);
        setBookingComplete(true);
        setBookingDetails(bookingData);

        try {
            await AsyncStorage.setItem("soloHotelBook", JSON.stringify(bookingData));
            const res = await fetch(`http://localhost:8080/traveler/hotels-all?location=${location.toLowerCase()}&guests=${adults + children}`);

            if (res.ok) {
                const data = await res.json();
                if (data.length > 0) {
                    setHotels(data);
                } else {
                    setHotels([]);
                    const fallbackRes = await fetch(`http://localhost:8080/traveler/hotel-all?guests=${adults + children}`);
                    if (fallbackRes.ok) {
                        const fallbackData = await fallbackRes.json();
                        setHotelsS(fallbackData);
                    }
                }
            }
        } catch (e) {
            console.error("Failed to save data to AsyncStorage", e);
        }
    };

    useFocusEffect(
        useCallback(() => {
            if (!bookingComplete) {
                setModalVisible(true);
            }
        }, [bookingComplete])
    );

    const formatPrice = (price: number) => {
        return `LKR ${price.toLocaleString()}`;
    };

    const getReviewLabel = (score: number): string => {
        if (score >= 9) return 'Excellent';
        if (score >= 8) return 'Very Good';
        if (score >= 7) return 'Good';
        if (score >= 5) return 'Average';
        return 'Poor';
    };

    // Hotel Card Component
    const HotelCard = ({ hotel }: { hotel: Hotel }) => {
        const rating = hotel.reviewCount > 0
            ? parseFloat(((hotel.ratings / hotel.reviewCount) * 2).toFixed(1))
            : 0;

        return (
            <TouchableOpacity
                className="bg-white rounded-3xl shadow-lg border border-gray-50 mb-6 overflow-hidden"
                onPress={() => router.push(`/views/hotel/solo/${hotel._id}`)}
                style={{ 
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.1,
                    shadowRadius: 12,
                    elevation: 8,
                }}
            >
                {/* Hotel Image */}
                <View className="relative h-48">
                    <Image
                        source={{ uri: `data:image/jpeg;base64,${hotel.thumbnail}` }}
                        className="w-full h-full"
                        contentFit="cover"
                    />
                    {hotel.specialOffer && (
                        <View className="absolute bottom-3 left-3 bg-emerald-500 px-3 py-1.5 rounded-lg">
                            <Text className="text-white text-xs font-semibold">{hotel.specialOffer}</Text>
                        </View>
                    )}
                </View>

                {/* Hotel Info */}
                <View className="p-5">
                    {/* Header with name and rating */}
                    <View className="flex-row items-start justify-between mb-3">
                        <View className="flex-1 mr-3">
                            <Text className="text-xl font-bold text-gray-900 mb-1">{hotel.name}</Text>
                            <View className="flex-row items-center">
                                <Text className="text-gray-500 text-sm mr-1">📍</Text>
                                <Text className="text-sm text-gray-600">{hotel.distance} from {hotel.location}</Text>
                            </View>
                        </View>
                        
                        {/* Rating Badge */}
                        <View className="bg-yellow-50 border border-yellow-200 rounded-full px-3 py-1 flex-row items-center">
                            <Text className="text-yellow-600 text-lg mr-1">⭐</Text>
                            <Text className="text-yellow-700 font-bold text-sm">{rating.toFixed(1)}</Text>
                            <Text className="text-yellow-600 text-xs ml-1">({hotel.reviewCount})</Text>
                        </View>
                    </View>

                    {/* Star rating */}
                    <View className="flex-row items-center mb-3">
                        <View className="flex-row">
                            {[...Array(Math.floor(rating / 2))].map((_, i) => (
                                <Text key={i} className="text-yellow-400 text-lg">★</Text>
                            ))}
                        </View>
                        <Text className="text-sm font-semibold text-gray-700 ml-2">
                            {getReviewLabel(rating)}
                        </Text>
                    </View>

                    {/* Features */}
                    {hotel.freeFeatures.length > 0 && (
                        <View className="mb-4">
                            <Text className="text-gray-500 text-xs font-semibold mb-2 uppercase tracking-wide">
                                Free Amenities
                            </Text>
                            <View className="flex-row flex-wrap">
                                {hotel.freeFeatures.slice(0, 3).map((feature, index) => (
                                    <View key={index} className="bg-green-50 border border-green-100 px-3 py-1.5 rounded-full mr-2 mb-2">
                                        <Text className="text-green-700 text-xs font-medium">{feature}</Text>
                                    </View>
                                ))}
                                {hotel.freeFeatures.length > 3 && (
                                    <View className="bg-gray-100 border border-gray-200 px-3 py-1.5 rounded-full">
                                        <Text className="text-gray-600 text-xs font-medium">
                                            +{hotel.freeFeatures.length - 3} more
                                        </Text>
                                    </View>
                                )}
                            </View>
                        </View>
                    )}

                    {/* Pricing Section */}
                    <View className="bg-gray-50 border-t border-gray-100 -mx-5 -mb-5 p-5">
                        <View className="flex-row justify-between items-center">
                            <View className="flex-1">
                                <Text className="text-xs font-semibold text-gray-600 mb-1">{hotel.priceDescription}</Text>
                                {hotel.originalPrice !== hotel.currentPrice && (
                                    <Text className="text-sm text-gray-400 line-through mb-1">
                                        {formatPrice(hotel.originalPrice)}
                                    </Text>
                                )}
                                <Text className="text-xs text-gray-500">{hotel.taxes}</Text>
                            </View>
                            
                            <View className="items-end">
                                <Text className="text-3xl font-bold text-green-600">
                                    {formatPrice(hotel.currentPrice)}
                                </Text>
                                <Text className="text-gray-500 text-xs">per night</Text>
                                
                                <TouchableOpacity className="bg-yellow-400 px-6 py-3 rounded-xl mt-3 flex-row items-center">
                                    <Text className="text-black font-bold text-sm">Book Now</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View className='bg-[#F2F5FA] h-full'>
            {/* Modern Modal */}
            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => {
                    if (bookingComplete) setModalVisible(false);
                }}
            >
                <View className="flex-1 justify-center items-center bg-black/60">
                    <KeyboardAvoidingView
                        behavior={Platform.OS === "ios" ? "padding" : "height"}
                        className="w-[93%] h-[97%]"
                    >
                        <View className="flex-1 bg-white rounded-3xl shadow-2xl">
                            {/* Modern Header */}
                            <View className="px-6 py-5 border-b border-gray-100">
                                <View className="flex-row items-center justify-between">
                                    <TouchableOpacity 
                                        onPress={() => {
                                            if (bookingComplete) {
                                                setModalVisible(false);
                                            } else {
                                                router.back();
                                            }
                                        }}
                                        className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center"
                                    >
                                        <Text className="text-gray-600 font-medium">✕</Text>
                                    </TouchableOpacity>
                                    <Text className="text-xl font-bold text-gray-800">Hotel Booking</Text>
                                    <View className="w-10" />
                                </View>
                            </View>

                            <ScrollView
                                className="flex-1"
                                contentContainerStyle={{ padding: 24 }}
                                keyboardShouldPersistTaps="handled"
                                showsVerticalScrollIndicator={false}
                            >
                                {/* Date Selection */}
                                <View className="mb-8">
                                    <View className="flex-row items-center mb-4">
                                        <View className="w-8 h-8 bg-blue-100 rounded-full items-center justify-center mr-3">
                                            <Text className="text-blue-600 font-bold text-sm">📅</Text>
                                        </View>
                                        <Text className="text-lg font-semibold text-gray-800">Select Your Dates</Text>
                                    </View>
                                    
                                    {/* Date Display */}
                                    <TouchableOpacity
                                        onPress={() => setShowDatePicker(!showDatePicker)}
                                        className="bg-white rounded-2xl p-4 border-2 border-gray-200"
                                    >
                                        <View className="flex-row items-center justify-between">
                                            <View className="flex-1">
                                                {selectedDates && selectedoutDates ? (
                                                    <View>
                                                        <Text className="text-sm text-gray-500 mb-1">Selected Dates</Text>
                                                        <Text className="text-base font-medium text-gray-800">
                                                            {new Date(selectedDates).toLocaleDateString()} - {new Date(selectedoutDates).toLocaleDateString()}
                                                        </Text>
                                                        <Text className="text-sm text-blue-600 mt-1">
                                                            {nights} night{nights > 1 ? 's' : ''}
                                                        </Text>
                                                    </View>
                                                ) : selectedDates ? (
                                                    <View>
                                                        <Text className="text-sm text-gray-500 mb-1">Check-in Selected</Text>
                                                        <Text className="text-base font-medium text-gray-800">
                                                            {new Date(selectedDates).toLocaleDateString()}
                                                        </Text>
                                                        <Text className="text-sm text-yellow-600">Select check-out date</Text>
                                                    </View>
                                                ) : (
                                                    <Text className="text-gray-400 text-base">Tap to select check-in and check-out dates</Text>
                                                )}
                                            </View>
                                            <Text className="text-blue-600 text-lg">{showDatePicker ? '▲' : '▼'}</Text>
                                        </View>
                                    </TouchableOpacity>

                                    {/* Unified Calendar */}
                                    {showDatePicker && (
                                        <View className="bg-gray-50 rounded-2xl p-4 border border-gray-200 mt-3">
                                            <View className="flex-row items-center justify-between mb-4">
                                                <Text className="text-sm font-medium text-gray-600">
                                                    {!selectedDates ? 'Select check-in date' : !selectedoutDates ? 'Select check-out date' : 'Dates selected'}
                                                </Text>
                                                <TouchableOpacity 
                                                    onPress={() => setShowDatePicker(false)}
                                                    className="w-8 h-8 bg-white rounded-full items-center justify-center"
                                                >
                                                    <Text className="text-gray-600">✕</Text>
                                                </TouchableOpacity>
                                            </View>
                                            
                                            {/* Month Navigation */}
                                            <View className="flex-row items-center justify-between mb-4">
                                                <TouchableOpacity 
                                                    onPress={() => navigateMonth('prev')}
                                                    className="w-10 h-10 bg-white rounded-full items-center justify-center shadow-sm"
                                                >
                                                    <Text className="text-blue-600 font-bold">‹</Text>
                                                </TouchableOpacity>
                                                
                                                <Text className="text-lg font-semibold text-gray-800">
                                                    {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                                </Text>
                                                
                                                <TouchableOpacity 
                                                    onPress={() => navigateMonth('next')}
                                                    className="w-10 h-10 bg-white rounded-full items-center justify-center shadow-sm"
                                                >
                                                    <Text className="text-blue-600 font-bold">›</Text>
                                                </TouchableOpacity>
                                            </View>

                                            {/* Days Grid */}
                                            <View className="flex-row flex-wrap justify-between">
                                                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                                                    <View key={index} className="w-10 h-8 items-center justify-center">
                                                        <Text className="text-xs font-medium text-gray-500">{day}</Text>
                                                    </View>
                                                ))}
                                                
                                                {generateCalendarDays(currentMonth).map((dateObj, index) => (
                                                    <TouchableOpacity
                                                        key={index}
                                                        onPress={() => selectDate(dateObj.dateString, dateObj.isPast)}
                                                        disabled={dateObj.isPast}
                                                        className={`w-10 h-10 items-center justify-center rounded-full m-0.5 ${
                                                            dateObj.isCheckin 
                                                                ? 'bg-blue-500' 
                                                                : dateObj.isCheckout
                                                                    ? 'bg-green-500'
                                                                    : dateObj.isInRange && selectedDates && selectedoutDates
                                                                        ? 'bg-blue-100'
                                                                        : dateObj.isToday 
                                                                            ? 'bg-blue-100 border border-blue-300' 
                                                                            : dateObj.isPast 
                                                                                ? 'bg-gray-100' 
                                                                                : 'bg-white hover:bg-gray-50'
                                                        }`}
                                                    >
                                                        <Text className={`text-sm ${
                                                            dateObj.isCheckin || dateObj.isCheckout
                                                                ? 'text-white font-bold' 
                                                                : dateObj.isPast 
                                                                    ? 'text-gray-300' 
                                                                    : dateObj.isInRange && selectedDates && selectedoutDates
                                                                        ? 'text-blue-600 font-medium'
                                                                        : 'text-gray-700'
                                                        }`}>
                                                            {dateObj.day}
                                                        </Text>
                                                    </TouchableOpacity>
                                                ))}
                                            </View>
                                            
                                            {selectedDates && selectedoutDates && (
                                                <View className="mt-4 p-3 bg-blue-50 rounded-xl border border-blue-200">
                                                    <Text className="text-sm font-medium text-blue-700 text-center">
                                                        {new Date(selectedDates).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(selectedoutDates).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} ({nights} night{nights > 1 ? 's' : ''})
                                                    </Text>
                                                </View>
                                            )}
                                        </View>
                                    )}
                                </View>

                                {/* Location Selection with Search */}
                                <View className="mb-6 relative z-20">
                                    <View className="flex-row items-center mb-3">
                                        <View className="w-8 h-8 bg-green-100 rounded-full items-center justify-center mr-3">
                                            <Text className="text-green-600 font-bold text-sm">📍</Text>
                                        </View>
                                        <Text className="text-lg font-semibold text-gray-800">Location in Sri Lanka</Text>
                                    </View>
                                    
                                    <View className="relative">
                                        <TextInput
                                            placeholder="Search for places in Sri Lanka..."
                                            placeholderTextColor="#9CA3AF"
                                            value={location}
                                            onChangeText={handleLocationChange}
                                            onFocus={() => {
                                                if (location.length >= 2 && filteredDestinations.length > 0) {
                                                    setShowLocationSuggestions(true);
                                                }
                                            }}
                                            className="bg-white rounded-2xl border-2 border-gray-200 px-4 py-4 text-base font-medium text-gray-800"
                                        />
                                    </View>

                                    {/* Location Suggestions */}
                                    {showLocationSuggestions && filteredDestinations.length > 0 && (
                                        <View className="absolute top-full left-0 right-0 bg-white rounded-2xl border border-gray-200 mt-2 shadow-lg z-30 max-h-60">
                                            <ScrollView 
                                                showsVerticalScrollIndicator={false}
                                                keyboardShouldPersistTaps="handled"
                                            >
                                                {filteredDestinations.map((dest, index) => (
                                                    <TouchableOpacity
                                                        key={index}
                                                        onPress={() => handleLocationSelect(dest)}
                                                        className="px-4 py-3 border-b border-gray-100"
                                                    >
                                                        <Text className="text-base font-medium text-gray-800">
                                                            {dest}
                                                        </Text>
                                                        <Text className="text-sm text-gray-500 mt-1">
                                                            {dest}, Sri Lanka
                                                        </Text>
                                                    </TouchableOpacity>
                                                ))}
                                            </ScrollView>
                                        </View>
                                    )}

                                    {/* Popular Places */}
                                    {!showLocationSuggestions && location.length < 2 && (
                                        <View className="mt-4">
                                            <Text className="text-sm font-medium text-gray-600 mb-3">Popular Destinations</Text>
                                            <View className="flex-row flex-wrap">
                                                {popularDestinations.slice(0, 12).map((place, index) => (
                                                    <TouchableOpacity
                                                        key={index}
                                                        onPress={() => setLocation(place)}
                                                        className="bg-green-50 border border-green-200 rounded-xl px-3 py-2 mr-2 mb-2"
                                                    >
                                                        <Text className="text-green-700 text-sm font-medium">
                                                            {place}
                                                        </Text>
                                                    </TouchableOpacity>
                                                ))}
                                            </View>
                                        </View>
                                    )}
                                </View>

                                {/* Guests Selection */}
                                <View className="mb-6">
                                    <View className="flex-row items-center mb-3">
                                        <View className="w-8 h-8 bg-purple-100 rounded-full items-center justify-center mr-3">
                                            <Text className="text-purple-600 font-bold text-sm">👥</Text>
                                        </View>
                                        <Text className="text-lg font-semibold text-gray-800">Guests</Text>
                                    </View>
                                    
                                    <View className="space-y-4">
                                        <View className="flex-row items-center justify-between bg-white rounded-2xl border-2 border-gray-200 px-4 py-4">
                                            <View>
                                                <Text className="text-base font-medium text-gray-800">Adults</Text>
                                                <Text className="text-sm text-gray-500">Age 18+</Text>
                                            </View>
                                            <View className="flex-row items-center space-x-4">
                                                <TouchableOpacity
                                                    onPress={() => setAdults(Math.max(1, adults - 1))}
                                                    className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center"
                                                >
                                                    <Text className="text-gray-600 font-bold">-</Text>
                                                </TouchableOpacity>
                                                <Text className="text-lg font-semibold text-gray-800 w-8 text-center">{adults}</Text>
                                                <TouchableOpacity
                                                    onPress={() => setAdults(adults + 1)}
                                                    className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center"
                                                >
                                                    <Text className="text-gray-600 font-bold">+</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                        
                                        <View className="flex-row items-center justify-between bg-white rounded-2xl border-2 border-gray-200 px-4 py-4">
                                            <View>
                                                <Text className="text-base font-medium text-gray-800">Children</Text>
                                                <Text className="text-sm text-gray-500">Age 0-17</Text>
                                            </View>
                                            <View className="flex-row items-center space-x-4">
                                                <TouchableOpacity
                                                    onPress={() => setChildren(Math.max(0, children - 1))}
                                                    className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center"
                                                >
                                                    <Text className="text-gray-600 font-bold">-</Text>
                                                </TouchableOpacity>
                                                <Text className="text-lg font-semibold text-gray-800 w-8 text-center">{children}</Text>
                                                <TouchableOpacity
                                                    onPress={() => setChildren(children + 1)}
                                                    className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center"
                                                >
                                                    <Text className="text-gray-600 font-bold">+</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View>
                                </View>

                                {/* Submit Button */}
                                <TouchableOpacity
                                    onPress={handleSubmit}
                                    className="bg-blue-600 rounded-2xl py-4 shadow-lg"
                                >
                                    <Text className="text-white text-center text-lg font-bold">
                                        Search Hotels
                                    </Text>
                                </TouchableOpacity>
                            </ScrollView>
                        </View>
                    </KeyboardAvoidingView>
                </View>
            </Modal>

            {/* Results Screen */}
            {bookingComplete && (
                <View className="flex-1">
                    {/* Header with booking summary */}
                    <View className="bg-white px-6 py-4 border-b border-gray-100">
                        <View className="flex-row items-center justify-between mb-3">
                            <TouchableOpacity 
                                onPress={() => router.back()}
                                className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center"
                            >
                                <Text className="text-gray-600 font-medium">←</Text>
                            </TouchableOpacity>
                            <Text className="text-lg font-bold text-gray-800">Available Hotels</Text>
                            <TouchableOpacity 
                                onPress={() => setModalVisible(true)}
                                className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center"
                            >
                                <Text className="text-blue-600 font-medium">⚙️</Text>
                            </TouchableOpacity>
                        </View>
                        
                        <View className="bg-gray-50 rounded-xl p-3">
                            <Text className="text-sm font-medium text-gray-700 mb-1">
                                📍 {bookingDetails.location}
                            </Text>
                            <Text className="text-sm text-gray-600">
                                📅 {bookingDetails.nights} night{bookingDetails.nights > 1 ? 's' : ''} • 
                                👥 {bookingDetails.adults} adult{bookingDetails.adults > 1 ? 's' : ''}{bookingDetails.children > 0 ? `, ${bookingDetails.children} child${bookingDetails.children > 1 ? 'ren' : ''}` : ''}
                            </Text>
                        </View>
                    </View>

                    {/* Hotel Results */}
                    <ScrollView 
                        className="flex-1 px-6 py-4"
                        showsVerticalScrollIndicator={false}
                    >
                        {hotels.length === 0 ? (
                            <View>
                                <View className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-6">
                                    <View className="items-center">
                                        <Text className="text-red-400 text-2xl mb-2">🔍</Text>
                                        <Text className="text-red-700 font-semibold text-lg mb-1">No Hotels Found</Text>
                                        <Text className="text-red-600 text-center">
                                            No hotels available for your search criteria
                                        </Text>
                                    </View>
                                </View>

                                {hotelsS.length > 0 && (
                                    <View>
                                        <Text className="text-lg font-bold text-gray-800 mb-4">
                                            Suggested Accommodations
                                        </Text>
                                        
                                        {hotelsS.map((hotel) => (
                                            <HotelCard key={hotel._id} hotel={hotel} />
                                        ))}
                                    </View>
                                )}

                                {hotelsS.length === 0 && (
                                    <View className="items-center py-10">
                                        <Text className="text-gray-400 text-lg mb-2">🏨</Text>
                                        <Text className="text-gray-600 text-base text-center mb-4">
                                            No accommodations available at the moment
                                        </Text>
                                        <TouchableOpacity 
                                            onPress={() => setModalVisible(true)}
                                            className="bg-blue-600 px-6 py-3 rounded-xl"
                                        >
                                            <Text className="text-white font-medium">Modify Search</Text>
                                        </TouchableOpacity>
                                    </View>
                                )}
                            </View>
                        ) : (
                            <View>
                                <Text className="text-lg font-bold text-gray-800 mb-4">
                                    {hotels.length} Hotel{hotels.length > 1 ? 's' : ''} Available
                                </Text>
                                
                                {hotels.map((hotel) => (
                                    <HotelCard key={hotel._id} hotel={hotel} />
                                ))}
                            </View>
                        )}
                    </ScrollView>
                </View>
            )}
        </View>
    );
}