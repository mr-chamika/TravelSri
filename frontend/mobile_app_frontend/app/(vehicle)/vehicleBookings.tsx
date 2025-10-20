import { router } from 'expo-router'
import { Text, View, TouchableOpacity, ScrollView, RefreshControl } from 'react-native'
import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import { useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface MyToken {
    sub: string;
    roles: string[];
    username: string;
    email: string;
    id: string;
}

interface BookingData {
    _id?: string;
    price: number;
    bookingDates: string[];
    location: string;
    userId: string;
    username: string;
    status?: string;
    vehicleModel?: string;
    vehicleNumber?: string;
    mobileNumber?: string;
    createdAt?: string;
}

// Map backend booking data to frontend BookingData interface
const mapBookingDtoToBookingData = (dto: any): BookingData => {
    const bookingId = dto._id || dto.id || dto.bookingId || '';
    
    return {
        _id: bookingId,
        price: dto.price || 0,
        bookingDates: dto.bookingDates || [],
        location: dto.location || '',
        userId: dto.userId || '',
        mobileNumber: dto.mobileNumber || '',
        username: dto.username || '',
        vehicleModel: dto.vehicleModel || '',
        vehicleNumber: dto.vehicleNumber || '',
        status: dto.status || 'PENDING',
    };
};

export default function App() {
    const [activeFilter, setActiveFilter] = useState('All');
    const [bookings, setBookings] = useState<BookingData[]>([]);
    const [filteredBookings, setFilteredBookings] = useState<BookingData[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [userToken, setUserToken] = useState<MyToken | null>(null);

    // Load user token
    useEffect(() => {
        const loadUserToken = async () => {
            try {
                const token = await AsyncStorage.getItem("token");
                if (token) {
                    const decodedToken: MyToken = jwtDecode(token);
                    setUserToken(decodedToken);
                }
            } catch (error) {
                console.error("Error loading user token:", error);
            }
        };
        loadUserToken();
    }, []);

    // Fetch bookings from API based on active filter
    const fetchBookings = useCallback(async () => {
        if (!userToken) {
            console.warn('⚠️ userToken not available yet');
            return;
        }

        try {
            setLoading(true);
            console.log('🔍 Fetching vehicle bookings for providerId:', userToken.id);
            console.log('🔍 Current filter:', activeFilter);

            const token = await AsyncStorage.getItem("token");
            console.log('🔑 Token retrieved:', token ? '✅ Yes (length: ' + token.length + ')' : '❌ No');
            
            if (!token) {
                console.error('❌ No token found in AsyncStorage');
                setBookings([]);
                return;
            }

            // Choose API endpoint based on filter
            let url = '';
            switch (activeFilter) {
                case 'Pending':
                    url = `http://localhost:8080/vehicle/bookings/provider/${userToken.id}/pending`;
                    console.log('📡 Using PENDING endpoint');
                    break;
                case 'Confirmed':
                    url = `http://localhost:8080/vehicle/bookings/provider/${userToken.id}/confirmed`;
                    console.log('📡 Using CONFIRMED endpoint');
                    break;
                case 'All':
                default:
                    url = `http://localhost:8080/vehicle/bookings/provider/${userToken.id}`;
                    console.log('📡 Using ALL bookings endpoint');
                    break;
            }

            console.log('📡 Calling API URL:', url);
            
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            console.log('📨 Response status:', response.status);
            console.log('📨 Response headers:', response.headers);

            if (response.ok) {
                const data = await response.json();
                console.log('✅ Bookings fetched successfully');
                console.log('📊 Total bookings:', data.length);
                
                if (data.length > 0) {
                    console.log('🔍 First booking object:', JSON.stringify(data[0], null, 2));
                    console.log('📋 All booking statuses:', data.map((b: any) => b.status || 'NO_STATUS').join(', '));
                }
                
                const mappedBookings = data.map((dto: any) => mapBookingDtoToBookingData(dto));
                console.log('✅ Mapped bookings count:', mappedBookings.length);
                
                setBookings(mappedBookings);
                // Don't need to filter further when using status-specific endpoints
                setFilteredBookings(mappedBookings);
            } else {
                const errorText = await response.text();
                console.error("❌ Failed to fetch bookings");
                console.error("❌ Status:", response.status);
                console.error("❌ Error response:", errorText);
                setBookings([]);
                setFilteredBookings([]);
            }
        } catch (error) {
            console.error("❌ Error fetching bookings:", error);
            console.error("❌ Error details:", JSON.stringify(error, null, 2));
            setBookings([]);
            setFilteredBookings([]);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [userToken, activeFilter]);

    // Filter bookings based on status
    const filterBookings = (bookingsList: BookingData[], filter: string) => {
        let filtered = bookingsList;

        switch (filter) {
            case 'Pending':
                filtered = bookingsList.filter(booking => 
                    booking.status === 'active' || 
                    booking.status === 'PENDING_TRAVELER_ACCEPTANCE' ||
                    booking.status === 'PENDING_PAYMENT'
                );
                break;
            case 'Confirmed':
                filtered = bookingsList.filter(booking => 
                    booking.status === 'active' || 
                    booking.status === 'ACCEPTED' ||
                    booking.status === 'ACTIVE' ||
                    booking.status === 'CONFIRMED'
                );
                break;
            case 'Completed':
                filtered = bookingsList.filter(booking => 
                    booking.status === 'pending' || 
                    booking.status === 'COMPLETE' ||
                    booking.status === 'completed' ||
                    booking.status === 'COMPLETED'
                );
                break;
            case 'Canceled':
                filtered = bookingsList.filter(booking => 
                    booking.status === 'canceled' || 
                    booking.status === 'CANCELED' ||
                    booking.status === 'cancelled' || 
                    booking.status === 'CANCELLED'
                );
                break;
            case 'All':
            default:
                filtered = bookingsList;
                break;
        }

        setFilteredBookings(filtered);
    };

    // Handle filter change - reload data with new filter
    const handleFilterChange = (filter: string) => {
        console.log('🔄 Filter changed to:', filter);
        setActiveFilter(filter);
        // The useEffect dependency will trigger fetchBookings
    };

    // Handle refresh
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchBookings();
    }, [fetchBookings]);

    // Fetch bookings when screen focuses
    useFocusEffect(
        useCallback(() => {
            if (userToken) {
                fetchBookings();
            }
        }, [fetchBookings, userToken])
    );

    const FilterTab = ({ title, isActive }: { title: string, isActive: boolean }) => (
        <TouchableOpacity
            className={`px-4 py-2 rounded-full transition-colors ${isActive ? 'bg-[#FEFA17]' : 'bg-gray-100'}`}
            onPress={() => handleFilterChange(title)}
        >
            <Text className={`text-sm font-semibold ${isActive ? 'text-gray-900' : 'text-gray-600'}`}>
                {title}
            </Text>
        </TouchableOpacity>
    );

    const BookingCard = ({ booking }: { booking: BookingData }) => {
        const formatDate = (dateString: string) => {
            try {
                return new Date(dateString).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric', 
                    year: 'numeric' 
                });
            } catch {
                return dateString;
            }
        };

        const isCompleted = booking.status === 'complete' || booking.status === 'COMPLETE' || 
                           booking.status === 'completed' || booking.status === 'COMPLETED';
        const isCanceled = booking.status === 'canceled' || booking.status === 'CANCELED' || 
                          booking.status === 'cancelled' || booking.status === 'CANCELLED';
        const firstDate = booking.bookingDates?.[0] || '';

        return (
            <View className="mb-4">
                <View className="bg-white rounded-2xl overflow-hidden shadow-lg">
                    {/* Header Section with Gradient Background */}
                    <View className={`px-5 pt-5 pb-4 ${isCompleted ? 'bg-green-500' : isCanceled ? 'bg-gray-500' : 'bg-gradient-to-r from-[#FEFA17] to-[#FFD700]'}`}>
                        <View className="flex-row items-center justify-between">
                            <View className="flex-1 pr-3">
                                <Text className={`text-xs font-medium mb-2 uppercase tracking-wider ${isCompleted ? 'text-green-100' : isCanceled ? 'text-gray-100' : 'text-gray-600'}`}>
                                    {isCompleted ? 'Completed' : isCanceled ? 'Canceled' : 'Booking Request'}
                                </Text>
                                <Text className={`text-xl font-bold mb-1 ${isCompleted ? 'text-white' : isCanceled ? 'text-white' : 'text-gray-900'}`}>
                                    {booking.username}
                                </Text>
                            </View>
                            <View className={`rounded-full w-12 h-12 items-center justify-center shadow-md ${isCompleted ? 'bg-green-100' : isCanceled ? 'bg-gray-100' : 'bg-white'}`}>
                                <Ionicons name={isCompleted ? "checkmark-circle" : isCanceled ? "ban" : "person-circle"} size={28} color={isCompleted ? "#16A34A" : isCanceled ? "#6B7280" : "#FEFA17"} />
                            </View>
                        </View>
                    </View>

                    {/* Details Section */}
                    <View className="px-5 py-4">
                        {/* Vehicle Info */}
                        <View className="flex-row items-start mb-4">
                            <View className="w-10 h-10 rounded-xl bg-purple-100 items-center justify-center mr-4 flex-shrink-0">
                                <Ionicons name="car-sharp" size={18} color="#9333EA" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-xs text-gray-500 font-semibold uppercase mb-1 tracking-wide">
                                    Vehicle
                                </Text>
                                <Text className="text-base font-bold text-gray-900">
                                    {booking.vehicleModel}
                                </Text>
                                <Text className="text-xs text-gray-600 mt-1">
                                    {booking.vehicleNumber}
                                </Text>
                            </View>
                        </View>

                        {/* Location */}
                        <View className="flex-row items-start mb-4">
                            <View className="w-10 h-10 rounded-xl bg-blue-100 items-center justify-center mr-4 flex-shrink-0">
                                <Ionicons name="location-sharp" size={18} color="#2563EB" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-xs text-gray-500 font-semibold uppercase mb-1 tracking-wide">
                                    Location
                                </Text>
                                <Text className="text-base font-bold text-gray-900">
                                    {booking.location}
                                </Text>
                            </View>
                        </View>

                        {/* Date */}
                        {firstDate && (
                            <View className="flex-row items-start mb-4">
                                <View className="w-10 h-10 rounded-xl bg-orange-100 items-center justify-center mr-4 flex-shrink-0">
                                    <Ionicons name="calendar-sharp" size={18} color="#EA580C" />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-xs text-gray-500 font-semibold uppercase mb-1 tracking-wide">
                                        Date
                                    </Text>
                                    <Text className="text-base font-bold text-gray-900">
                                        {formatDate(firstDate)}
                                    </Text>
                                    {booking.bookingDates && booking.bookingDates.length > 1 && (
                                        <Text className="text-xs text-gray-400 mt-1 font-medium">
                                            +{booking.bookingDates.length - 1} more dates
                                        </Text>
                                    )}
                                </View>
                            </View>
                        )}

                        {/* Price */}
                        <View className="flex-row items-start">
                            <View className="w-10 h-10 rounded-xl bg-green-100 items-center justify-center mr-4 flex-shrink-0">
                                <Ionicons name="cash-sharp" size={18} color="#16A34A" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-xs text-gray-500 font-semibold uppercase mb-1 tracking-wide">
                                    Offered Price
                                </Text>
                                <Text className="text-xl font-black text-green-600">
                                    Rs. {booking.price.toLocaleString()}
                                </Text>
                            </View>
                        </View>

                        {/* Mobile Number - Only show for confirmed bookings */}
                        {booking.status === 'ACTIVE' && booking.mobileNumber && (
                            <View className="border-t border-gray-100 mt-4 pt-3">
                                <View className="flex-row items-center mb-2">
                                    <Ionicons name="call-sharp" size={16} color="#2563EB" />
                                    <Text className="text-xs text-gray-500 font-semibold uppercase mb-1 ml-2 tracking-wide">
                                        Mobile Number
                                    </Text>
                                </View>
                                <Text className="text-lg font-bold text-blue-600">
                                    {booking.mobileNumber}
                                </Text>
                            </View>
                        )}
                    </View>

                    {/* Action Buttons - Hide for completed and canceled bookings */}
                    {!isCanceled && !isCompleted && (
                        <View className="flex-row gap-3 px-5 pb-5 pt-2">
                            {/* Decline Button */}
                            <TouchableOpacity
                                className="flex-1 py-3.5 rounded-xl bg-gray-100 border-2 border-gray-200 active:opacity-70"
                                onPress={async () => {
                                    try {
                                        const token = await AsyncStorage.getItem("token");
                                        if (!token || !userToken?.id || !booking._id) {
                                            console.error('Missing required data');
                                            return;
                                        }

                                        const response = await fetch(
                                            `http://localhost:8080/api/bookings/${booking._id}/cancel?vehicleOwnerId=${userToken.id}`,
                                            {
                                                method: 'POST',
                                                headers: {
                                                    'Content-Type': 'application/json',
                                                    'Authorization': `Bearer ${token}`,
                                                },
                                            }
                                        );

                                        if (response.ok) {
                                            console.log('✅ Booking declined successfully');
                                            fetchBookings();
                                        } else {
                                            console.error('❌ Failed to decline booking:', response.status);
                                        }
                                    } catch (error) {
                                        console.error('❌ Error declining booking:', error);
                                    }
                                }}
                            >
                                <Text className="text-center text-gray-700 font-bold text-base">
                                    Decline
                                </Text>
                            </TouchableOpacity>
                            
                            {/* Accept Button */}
                            <TouchableOpacity
                                className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-[#FEFA17] to-[#FFD700] shadow-lg active:opacity-90"
                                onPress={async () => {
                                    try {
                                        const token = await AsyncStorage.getItem("token");
                                        if (!token || !userToken?.id || !booking._id) {
                                            console.error('Missing required data');
                                            return;
                                        }

                                        const response = await fetch(
                                            `http://localhost:8080/api/bookings/${booking._id}/accept?vehicleOwnerId=${userToken.id}`,
                                            {
                                                method: 'POST',
                                                headers: {
                                                    'Content-Type': 'application/json',
                                                    'Authorization': `Bearer ${token}`,
                                                },
                                            }
                                        );

                                        if (response.ok) {
                                            console.log('✅ Booking accepted successfully');
                                            fetchBookings();
                                        } else {
                                            console.error('❌ Failed to accept booking:', response.status);
                                        }
                                    } catch (error) {
                                        console.error('❌ Error accepting booking:', error);
                                    }
                                }}
                            >
                                <Text className="text-center font-black text-base text-gray-900">
                                    Accept
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </View>
        );
    };

    if (loading && !refreshing) {
        return (
            <View className="flex-1 bg-gray-50 justify-center items-center">
                <View className="items-center">
                    <Ionicons name="hourglass-outline" size={48} color="#FEFA17" />
                    <Text className="text-gray-600 mt-4 font-semibold">Loading bookings...</Text>
                </View>
            </View>
        );
    }

    return (
        <ScrollView
            className="flex-1 bg-gray-50"
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FEFA17" />
            }
        >
            {/* Header with Back Button */}
            <View className="bg-gradient-to-b from-[#FEFA17] to-[#FFD700] px-5 pt-4 pb-6 shadow-md">
                <View className="flex-row items-center gap-3 mb-6">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="w-10 h-10 rounded-full bg-white/30 items-center justify-center"
                    >
                        <Ionicons name="chevron-back" size={24} color="#000" />
                    </TouchableOpacity>
                    <View>
                        <Text className="text-2xl font-black text-gray-900">
                            Vehicle Bookings
                        </Text>
                    </View>
                </View>

                {/* Filter Tabs */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View className="flex-row gap-2">
                        <FilterTab title="All" isActive={activeFilter === 'All'} />
                        <FilterTab title="Pending" isActive={activeFilter === 'Pending'} />
                        <FilterTab title="Confirmed" isActive={activeFilter === 'Confirmed'} />
                        <FilterTab title="Completed" isActive={activeFilter === 'Completed'} />
                        <FilterTab title="Canceled" isActive={activeFilter === 'Canceled'} />
                    </View>
                </ScrollView>
            </View>

            <View className="px-5 py-6 pb-24">
                {/* Quotation Button - Top */}
                <TouchableOpacity 
                    className="bg-blue-500 py-4 rounded-lg mb-6 shadow-md active:opacity-80"
                    onPress={() => router.push('../views/vehicalQuotation/[id]')}
                >
                    <Text className="text-center text-white font-bold text-base">
                        📊 Group Tour Quotation
                    </Text>
                </TouchableOpacity>

                {/* Booking Cards */}
                {filteredBookings.length === 0 ? (
                    <View className="flex items-center justify-center py-16">
                        <View className="w-20 h-20 rounded-full bg-gray-100 items-center justify-center mb-4">
                            <Ionicons name="document-outline" size={40} color="#9CA3AF" />
                        </View>
                        <Text className="text-gray-600 text-lg font-bold mb-2">No booking requests</Text>
                        <Text className="text-gray-400 text-center text-sm">
                            {activeFilter === 'All'
                                ? "You don't have any booking requests yet"
                                : `No ${activeFilter.toLowerCase()} booking requests`
                            }
                        </Text>
                    </View>
                ) : (
                    filteredBookings.map((booking) => (
                        <BookingCard key={booking._id} booking={booking} />
                    ))
                )}
            </View>
        </ScrollView>
    );
}