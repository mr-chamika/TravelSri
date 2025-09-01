import { router } from 'expo-router'
import { Text, View, TouchableOpacity, ScrollView, RefreshControl } from 'react-native'
import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import { useFocusEffect } from 'expo-router';

interface MyToken {
    sub: string;
    roles: string[];
    username: string;
    email: string;
    id: string;
}

interface BookingData {
    _id: string;
    travelerId: string;
    providerId: string;
    providerType: string;
    serviceName: string;
    serviceDescription: string;
    serviceStartDate: string;
    serviceEndDate: string;
    totalAmount: number;
    currency: string;
    status: string;
    paymentStatus: string;
    bookingTime: string;
    specialRequests?: string;
    numberOfGuests?: number;
    languagePreference?: string;
    createdAt: string;
}

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
        if (!userToken) return;

        try {
            setLoading(true);
            const response = await fetch(`http://localhost:8080/api/bookings/traveler/${userToken.id}`);
            
            if (response.ok) {
                const data = await response.json();
                setBookings(data);
                filterBookings(data, activeFilter);
            } else {
                console.error("Failed to fetch bookings:", response.status);
                setBookings([]);
            }
        } catch (error) {
            console.error("Error fetching bookings:", error);
            setBookings([]);
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
                    booking.status === 'PENDING_PAYMENT' || 
                    booking.status === 'PENDING_PROVIDER_ACCEPTANCE'
                );
                break;
            case 'Confirmed':
                filtered = bookingsList.filter(booking => booking.status === 'CONFIRMED');
                break;
            case 'Completed':
                filtered = bookingsList.filter(booking => booking.status === 'COMPLETED');
                break;
            case 'All':
            default:
                filtered = bookingsList;
                break;
        }
        
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
            className={`px-4 py-2 rounded-full ${isActive ? 'bg-[#FEFA17]' : 'bg-gray-200'}`}
            onPress={() => handleFilterChange(title)}
        >
            <Text className={`text-sm font-medium ${isActive ? 'text-black' : 'text-gray-600'}`}>
                {title}
            </Text>
        </TouchableOpacity>
    )

    const StatusBadge = ({ status }: { status: string }) => {
        let bgColor = 'bg-gray-200'
        let textColor = 'text-gray-600'
        let displayText = status;
        
        switch (status) {
            case 'PENDING_PAYMENT':
                bgColor = 'bg-orange-200'
                textColor = 'text-orange-800'
                displayText = 'Pending Payment'
                break;
            case 'PENDING_PROVIDER_ACCEPTANCE':
                bgColor = 'bg-yellow-200'
                textColor = 'text-yellow-800'
                displayText = 'Awaiting Confirmation'
                break;
            case 'CONFIRMED':
                bgColor = 'bg-green-200'
                textColor = 'text-green-800'
                displayText = 'Confirmed'
                break;
            case 'COMPLETED':
                bgColor = 'bg-blue-200'
                textColor = 'text-blue-800'
                displayText = 'Completed'
                break;
            case 'CANCELLED_BY_TRAVELER':
            case 'CANCELLED_BY_PROVIDER':
                bgColor = 'bg-red-200'
                textColor = 'text-red-800'
                displayText = 'Cancelled'
                break;
            default:
                displayText = status.replace(/_/g, ' ').toLowerCase()
                break;
        }

        return (
            <View className={`px-3 py-1 rounded-full ${bgColor}`}>
                <Text className={`text-xs font-medium ${textColor}`}>
                    {displayText}
                </Text>
            </View>
        )
    }

    const BookingCard = ({ booking }: { booking: BookingData }) => {
        // Format dates
        const formatDate = (dateString: string) => {
            try {
                return new Date(dateString).toLocaleDateString();
            } catch {
                return dateString;
            }
        };

        // Extract location from service description
        const getLocationFromDescription = (description: string) => {
            const match = description.match(/Route: (.+?) to (.+?)(\||\s|$)/);
            return match ? `${match[1]} to ${match[2]}` : 'Location not specified';
        };

        // Get service type icon
        const getServiceIcon = (providerType: string) => {
            switch (providerType) {
                case 'vehicle': return '🚗';
                case 'guide': return '👨‍🏫';
                case 'hotel': return '🏨';
                default: return '📋';
            }
        };

        return (
            <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
                <View className="flex-row items-start justify-between mb-3">
                    <View className="flex-1">
                        <View className="flex-row items-center mb-1">
                            <Text className="text-lg mr-2">{getServiceIcon(booking.providerType)}</Text>
                            <Text className="text-lg font-semibold text-gray-800 flex-1" numberOfLines={1}>
                                {booking.serviceName}
                            </Text>
                        </View>
                        <Text className="text-sm text-gray-600" numberOfLines={2}>
                            {booking.serviceDescription}
                        </Text>
                    </View>
                    <StatusBadge status={booking.status} />
                </View>

                <View className="mb-4">
                    <View className="flex-row items-center mb-2">
                        <Text className="text-gray-500 text-sm">📅</Text>
                        <Text className="text-sm text-gray-600 ml-2">
                            {formatDate(booking.serviceStartDate)} - {formatDate(booking.serviceEndDate)}
                        </Text>
                    </View>
                    <View className="flex-row items-center mb-2">
                        <Text className="text-gray-500 text-sm">📍</Text>
                        <Text className="text-sm text-gray-600 ml-2">
                            {getLocationFromDescription(booking.serviceDescription)}
                        </Text>
                    </View>
                    {booking.languagePreference && (
                        <View className="flex-row items-center mb-2">
                            <Text className="text-gray-500 text-sm">🗣️</Text>
                            <Text className="text-sm text-gray-600 ml-2">
                                {booking.languagePreference}
                            </Text>
                        </View>
                    )}
                    <View className="flex-row items-center">
                        <Text className="text-gray-500 text-sm">💰</Text>
                        <Text className="text-sm font-semibold text-gray-800 ml-2">
                            {booking.totalAmount} {booking.currency}
                        </Text>
                    </View>
                </View>

                <TouchableOpacity 
                    className="py-3 rounded-lg bg-white border border-gray-300"
                    onPress={() => {
                        // Navigate to booking details
                        if (booking.providerType === 'vehicle') {
                            router.push(`/views/bookings/soloTrips/${booking._id}`);
                        } else {
                            router.push(`/views/bookings/groupTrips/${booking._id}`);
                        }
                    }}
                >
                    <Text className="text-center text-black font-medium">
                        View Details
                    </Text>
                </TouchableOpacity>
            </View>
        );
    };

    if (loading && !refreshing) {
        return (
            <View className="flex-1 bg-[#F2F0EF] justify-center items-center">
                <Text className="text-gray-500">Loading bookings...</Text>
            </View>
        );
    }

    return (
        <ScrollView 
            className="flex-1 bg-[#F2F0EF]"
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        >
            <View className="px-4 pt-4 pb-24">
                {/* Filter Tabs */}
                <View className="flex-row space-x-3 mb-6">
                    <FilterTab title="All" isActive={activeFilter === 'All'} />
                    <FilterTab title="Pending" isActive={activeFilter === 'Pending'} />
                    <FilterTab title="Confirmed" isActive={activeFilter === 'Confirmed'} />
                    <FilterTab title="Completed" isActive={activeFilter === 'Completed'} />
                </View>

                {/* Booking Cards */}
                {filteredBookings.length === 0 ? (
                    <View className="flex-1 justify-center items-center py-20">
                        <Text className="text-gray-500 text-lg mb-2">No bookings found</Text>
                        <Text className="text-gray-400 text-center">
                            {activeFilter === 'All' 
                                ? "You haven't made any bookings yet"
                                : `No ${activeFilter.toLowerCase()} bookings`
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