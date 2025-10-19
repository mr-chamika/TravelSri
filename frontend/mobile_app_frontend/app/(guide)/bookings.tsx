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
    travelerId?: string;
    providerId?: string;
    providerType?: string;
    serviceName?: string;
    serviceDescription?: string;
    serviceStartDate?: string;
    serviceEndDate?: string;
    totalAmount?: number;
    currency?: string;
    paymentStatus?: string;
    bookingTime?: string;
    specialRequests?: string;
    numberOfGuests?: number;
    languagePreference?: string;
    createdAt?: string;
    mobileNumber?: string;
}

// Map backend booking data to frontend BookingData interface
const mapBookingDtoToBookingData = (dto: any): BookingData => {
    // Try to find booking ID from various possible field names
    const bookingId = dto._id || dto.id || dto.bookingId || '';
    
    console.log('📌 Mapping booking - available fields:', Object.keys(dto));
    console.log('📌 Resolved booking ID from fields (looking for _id, id, bookingId):', bookingId);
    
    return {
        _id: bookingId,
        price: dto.price || 0,
        bookingDates: dto.bookingDates || [],
        location: dto.location || '',
        userId: dto.userId || '',
        mobileNumber: dto.mobileNumber || '',
        username: dto.username || '',
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

    // Fetch bookings from API
    const fetchBookings = useCallback(async () => {
        if (!userToken) {
            console.log('⚠️ userToken not available yet');
            return;
        }

        try {
            setLoading(true);
            console.log('🔍 Fetching all bookings for user ID:', userToken.id);

            const token = await AsyncStorage.getItem("token");
            console.log('🔑 Token retrieved:', token ? 'Yes (length: ' + token.length + ')' : 'No');
            
            if (!token) {
                console.error('❌ No token found in AsyncStorage');
                setBookings([]);
                return;
            }

            // Use single API endpoint to fetch all bookings
            const url = `http://localhost:8080/api/bookings/provider/${userToken.id}?providerId=${userToken.id}`;
            console.log('📡 Calling API URL:', url);
            
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            console.log('📨 Response status:', response.status);

            if (response.ok) {
                const data = await response.json();
                console.log('✅ All bookings fetched:', data.length, 'bookings');
                
                // Log all booking statuses for debugging
                if (data.length > 0) {
                    console.log('🔍 First booking object:', JSON.stringify(data[0], null, 2));
                    console.log('📊 All booking statuses:', data.map((b: any) => b.status));
                }
                
                // Map backend data to frontend format
                const mappedBookings = data.map((dto: any) => mapBookingDtoToBookingData(dto));
                setBookings(mappedBookings);
                
                // Log mapped bookings for debugging
                console.log('📝 Mapped bookings:', mappedBookings.map((b: BookingData) => ({ username: b.username, status: b.status, id: b._id })));
                
                // Filter will be applied in the handleFilterChange
                filterBookings(mappedBookings, activeFilter);
            } else {
                const errorText = await response.text();
                console.error("❌ Failed to fetch bookings - Status:", response.status);
                console.error("❌ Error response:", errorText);
                setBookings([]);
            }
        } catch (error) {
            console.error("❌ Error fetching bookings:", error);
            setBookings([]);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [userToken, activeFilter]);

    // Filter bookings based on status
    const filterBookings = (bookingsList: BookingData[], filter: string) => {
        let filtered = bookingsList;

        console.log(`🔎 Filtering bookings - Filter: "${filter}", Total bookings: ${bookingsList.length}`);
        
        switch (filter) {
            case 'Pending':
                // Show bookings that are pending (not yet accepted)
                filtered = bookingsList.filter(booking => {
                    const isPending = booking.status === 'pending' || 
                        booking.status === 'PENDING_PROVIDER_ACCEPTANCE' ||
                        booking.status === 'PENDING_PAYMENT';
                    if (isPending) {
                        console.log(`  ✅ Pending: ${booking.username} (${booking.status})`);
                    }
                    return isPending;
                });
                break;
            case 'Confirmed':
                // Show bookings that are confirmed/accepted or active
                filtered = bookingsList.filter(booking => {
                    const isConfirmed = booking.status === 'active' || 
                        booking.status === 'ACCEPTED' ||
                        booking.status === 'ACTIVE' ||
                        booking.status === 'CONFIRMED';
                    if (isConfirmed) {
                        console.log(`  ✅ Confirmed: ${booking.username} (${booking.status})`);
                    }
                    return isConfirmed;
                });
                break;
            case 'Completed':
                // Show completed bookings
                filtered = bookingsList.filter(booking => {
                    const isCompleted = booking.status === 'complete';
                    if (isCompleted) {
                        console.log(`  ✅ Completed: ${booking.username} (${booking.status})`);
                    }
                    return isCompleted;
                });
                break;
            case 'All':
            default:
                // Show all bookings
                filtered = bookingsList;
                console.log(`  📋 Showing all bookings: ${filtered.length} items`);
                break;
        }

        console.log(`📊 Filtered result: ${filtered.length} bookings for filter: ${filter}`);
        setFilteredBookings(filtered);
    };

    // Handle filter change
    const handleFilterChange = (filter: string) => {
        setActiveFilter(filter);
        filterBookings(bookings, filter);
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
    )

    const BookingCard = ({ booking }: { booking: BookingData }) => {
        // Debug: show booking prop when card renders
        console.log('DEBUG BookingCard render - booking:', booking);
        console.log('📌 Booking ID (_id):', booking._id);
        console.log('👤 User ID:', booking.userId);
        
        // Format dates
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

        // Check if booking date is today
        const isBookingToday = (): boolean => {
            if (!booking.bookingDates || booking.bookingDates.length === 0) {
                return false;
            }
            try {
                const bookingDate = new Date(booking.bookingDates[0]);
                const today = new Date();
                return bookingDate.toDateString() === today.toDateString();
            } catch {
                return false;
            }
        };

        const isActive = booking.status === 'ACTIVE' || booking.status === 'active';
        const isToday = isBookingToday();
        const firstDate = booking.bookingDates?.[0] || '';

        console.log(`🎯 BookingCard status check - status: "${booking.status}", isActive: ${isActive}`);

        return (
            <View className="mb-4">
                <View className="bg-white rounded-2xl overflow-hidden shadow-lg">
                    {/* Header Section with Gradient Background */}
                    <View className="bg-gradient-to-r from-[#FEFA17] to-[#FFD700] px-5 pt-5 pb-4">
                        <View className="flex-row items-center justify-between">
                            <View className="flex-1 pr-3">
                                <Text className="text-xs font-medium text-gray-600 mb-2 uppercase tracking-wider">
                                    {isActive ? 'Active Service' : 'New Request'}
                                </Text>
                                <Text className="text-xl font-bold text-gray-900 mb-1">
                                    {booking.username}
                                </Text>
                            </View>
                            <View className="bg-white rounded-full w-12 h-12 items-center justify-center shadow-md">
                                <Ionicons name="person-circle" size={28} color="#FEFA17" />
                            </View>
                        </View>
                    </View>

                    {/* Details Section */}
                    <View className="px-5 py-4">
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
                        <View className="flex-row items-start mb-1">
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

                        {/* Status and IDs - Only show for non-active bookings */}
                        {!isActive && (
                            <View className="border-t border-gray-100 mt-4 pt-3">
                                {booking.status && (
                                    <View className="mb-2 pb-2">
                                        <Text className="text-xs text-gray-500 font-semibold uppercase mb-1 tracking-wide">
                                            Status
                                        </Text>
                                        <Text className="text-xs font-bold text-blue-600 uppercase">
                                            {booking.status}
                                        </Text>
                                    </View>
                                )}
                                <Text className="text-xs text-gray-400 font-medium mb-1">
                                    Booking ID: {booking._id && booking._id !== '' ? booking._id.substring(0, 16) : 'N/A'}
                                </Text>
                                <Text className="text-xs text-gray-400 font-medium">
                                    User ID: {booking.userId?.substring(0, 12)}...
                                </Text>
                            </View>
                        )}

                        {/* Mobile Number - Only show for active bookings */}
                        {isActive && booking.mobileNumber && (
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

                    {/* Action Buttons */}
                    <View className={`flex-row gap-3 px-5 pb-5 pt-2 ${isActive ? 'flex-wrap' : ''}`}>
                        {/* Decline/Cancel Button */}
                        <TouchableOpacity
                            className={`${isActive ? 'w-full' : 'flex-1'} py-3.5 rounded-xl bg-gray-100 border-2 border-gray-200 active:opacity-70`}
                            onPress={async () => {
                                try {
                                    const actionType = isActive ? 'Cancel' : 'Decline';
                                    console.log(`${actionType}ing booking`);
                                    console.log('  - User ID:', booking.userId);
                                    console.log('  - Username:', booking.username);

                                    const token = await AsyncStorage.getItem("token");
                                    if (!token) {
                                        console.error('No token found');
                                        return;
                                    }

                                    // Get providerId from decoded token
                                    if (!userToken?.id) {
                                        console.error('No provider ID found in token');
                                        return;
                                    }
                                    console.log(`booking id ${booking.userId}`);

                                    const response = await fetch(
                                        `http://localhost:8080/api/bookings/${booking.userId}/decline?providerId=${userToken.id}`,
                                        {
                                            method: 'POST',
                                            headers: {
                                                'Content-Type': 'application/json',
                                                'Authorization': `Bearer ${token}`,
                                            },
                                        }
                                    );

                                    if (response.ok) {
                                        console.log(`✅ Booking ${actionType.toLowerCase()}ed successfully`);
                                        // Refresh bookings list
                                        fetchBookings();
                                    } else {
                                        console.error(`❌ Failed to ${actionType.toLowerCase()} booking:`, response.status);
                                    }
                                } catch (error) {
                                    console.error(`❌ Error ${isActive ? 'cancelling' : 'declining'} booking:`, error);
                                }
                            }}
                        >
                            <Text className="text-center text-gray-700 font-bold text-base">
                                {isActive ? 'Cancel' : 'Decline'}
                            </Text>
                        </TouchableOpacity>
                        
                        {/* Accept / Complete Button */}
                        <TouchableOpacity
                            disabled={isActive && !isToday}
                            className={`${isActive ? 'w-full' : 'flex-1'} py-3.5 rounded-xl shadow-lg active:opacity-90 ${
                                isActive && !isToday
                                    ? 'bg-gray-300 opacity-50'
                                    : 'bg-gradient-to-r from-[#FEFA17] to-[#FFD700]'
                            }`}
                            onPress={async () => {
                                try {
                                    const actionType = isActive ? 'Complete' : 'Accept';
                                    console.log(`${actionType}ing booking`);
                                    console.log('  - User ID:', booking.userId);
                                    console.log('  - Username:', booking.username);

                                    const token = await AsyncStorage.getItem("token");
                                    if (!token) {
                                        console.error('No token found');
                                        return;
                                    }

                                    // Get providerId from decoded token
                                    if (!userToken?.id) {
                                        console.error('No provider ID found in token');
                                        return;
                                    }

                                    const endpoint = isActive ? 'complete' : 'accept';
                                    const response = await fetch(
                                        `http://localhost:8080/api/bookings/${booking._id}/${endpoint}?providerId=${userToken.id}`,
                                        {
                                            method: 'POST',
                                            headers: {
                                                'Content-Type': 'application/json',
                                                'Authorization': `Bearer ${token}`,
                                            },
                                        }
                                    );

                                    if (response.ok) {
                                        console.log(`✅ Booking ${actionType.toLowerCase()}ed successfully`);
                                        // Refresh bookings list
                                        fetchBookings();
                                    } else {
                                        console.error(`❌ Failed to ${actionType.toLowerCase()} booking:`, response.status);
                                    }
                                } catch (error) {
                                    console.error(`❌ Error ${isActive ? 'completing' : 'accepting'} booking:`, error);
                                }
                            }}
                        >
                            <Text className={`text-center font-black text-base ${
                                isActive && !isToday ? 'text-gray-600' : 'text-gray-900'
                            }`}>
                                {isActive ? `Complete${!isToday ? ` (${formatDate(firstDate)})` : ''}` : 'Accept'}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Info Message for Active Bookings */}
                    {isActive && !isToday && (
                        <View className="px-5 pb-3">
                            <View className="bg-blue-50 border-l-4 border-blue-500 px-3 py-2 rounded">
                                <Text className="text-xs text-blue-700 font-semibold">
                                    ℹ️ Complete button will be available on {formatDate(firstDate)}
                                </Text>
                            </View>
                        </View>
                    )}
                </View>
            </View>
        );
    };

    // Debug: log filtered bookings when component renders
    console.log('DEBUG filteredBookings (on render):', filteredBookings);

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
                            Booking Requests
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
                    </View>
                </ScrollView>
            </View>

            <View className="px-5 py-6 pb-24">
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
    )
}
