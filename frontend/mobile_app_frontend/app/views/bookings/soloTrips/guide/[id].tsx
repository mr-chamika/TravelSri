import { useLocalSearchParams, router } from 'expo-router'
import { Text, View, ScrollView, StyleSheet, TouchableOpacity, StatusBar, Alert } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { WebView } from 'react-native-webview'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { jwtDecode } from 'jwt-decode'
import { useEffect, useState } from 'react'

export default function Bookings() {
    const { id } = useLocalSearchParams()
    const [bookingId, setBookingId] = useState<string | undefined>(undefined)

    // Extract booking ID from route params
    useEffect(() => {
        let extractedId: string | undefined = undefined;
        
        // Extract the ID from params
        if (id) {
            extractedId = Array.isArray(id) ? id[0] : id;
        }

        console.log('🔍 Route extraction attempt:');
        console.log('  - useLocalSearchParams id:', id);
        console.log('  - Final bookingId:', extractedId);
        
        setBookingId(extractedId);
    }, [id])

    const handleConfirmTrip = async () => {
        console.log('🔍 Confirm Trip Clicked');
        console.log('📌 Current bookingId state:', bookingId);
        
        if (!bookingId) {
            Alert.alert('Error', 'Booking ID not found');
            console.log('❌ Booking ID is still undefined - Route params not received');
            return;
        }

        try {
            // Get JWT token from AsyncStorage
            const token = await AsyncStorage.getItem('token');
            console.log('🔐 Token retrieved:', token ? '✅ Token found' : '❌ No token found');
            
            if (!token) {
                Alert.alert('Error', 'Authentication token not found. Please login again.');
                console.log('❌ Token is null or undefined');
                return;
            }

            const url = `http://localhost:8080/api/guide/bookings/${bookingId}/accept`;
            console.log('🌐 API URL:', url);
            console.log('📤 Sending request with Authorization header');

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            console.log('📥 Response Status:', response.status);

            if (response.ok) {
                console.log('✅ Tour confirmed successfully');
                Alert.alert('Success', 'Tour confirmed successfully!', [
                    {
                        text: 'OK',
                        onPress: () => router.back(),
                    },
                ]);
            } else {
                const errorData = await response.json().catch(() => ({}));
                console.log('❌ API Error Response:', errorData);
                Alert.alert('Error', errorData.message || `Failed to confirm tour (${response.status})`);
            }
        } catch (error) {
            console.error('❌ Error confirming tour:', error);
            Alert.alert('Error', 'Network error. Please try again.');
        }
    };

    const handleDeclineTrip = async () => {
        console.log('🔍 Decline Trip Clicked');
        console.log('📌 Current bookingId state:', bookingId);

        if (!bookingId) {
            Alert.alert('Error', 'Booking ID not found');
            console.log('❌ Booking ID is still undefined - Route params not received');
            return;
        }

        try {
            const token = await AsyncStorage.getItem('token');
            console.log('🔐 Token retrieved for decline:', token ? '✅ Token found' : '❌ No token found');
            if (!token) {
                Alert.alert('Error', 'Authentication token not found. Please login again.');
                return;
            }

            const url = `http://localhost:8080/api/guide/bookings/${bookingId}/decline`;
            console.log('🌐 API URL (decline):', url);

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            console.log('📥 Decline Response Status:', response.status);

            if (response.ok) {
                console.log('✅ Tour declined successfully');
                Alert.alert('Declined', 'Tour declined successfully', [
                    { text: 'OK', onPress: () => router.back() }
                ]);
            } else {
                const errorData = await response.json().catch(() => ({}));
                console.log('❌ Decline API Error Response:', errorData);
                Alert.alert('Error', errorData.message || `Failed to decline tour (${response.status})`);
            }
        } catch (error) {
            console.error('❌ Error declining tour:', error);
            Alert.alert('Error', 'Network error. Please try again.');
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFEB3B" />
            
            {/* Header with Gradient */}
            <LinearGradient
                colors={['#EAB308', '#FDE047']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.header}
            >
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="chevron-back" size={28} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Booking Details</Text>
            </LinearGradient>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Trip Header */}
                <View style={styles.tripHeader}>
                    <Text style={styles.tripTitle}>Guide Booking Details</Text>
                    <Text style={styles.tripDate}>{bookingId ? `Booking ID: ${bookingId}` : '# —'}</Text>
                </View>

                {/* Customer Information */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Customer Information</Text>
                    <View style={styles.customerInfo}>
                        <View style={styles.customerRow}>
                            <Text style={styles.customerLabel}>Name:</Text>
                            <Text style={styles.customerValue}>John Doe</Text>
                        </View>
                        <View style={styles.customerRow}>
                            <Text style={styles.customerLabel}>Phone No:</Text>
                            <Text style={styles.customerValue}>071 1234567</Text>
                        </View>
                        <View style={styles.customerRow}>
                            <Text style={styles.customerLabel}>No of Passengers</Text>
                            <Text style={styles.customerValue}>12</Text>
                        </View>
                    </View>
                </View>

                {/* Trip Details */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Trip Details</Text>
                    <View style={styles.tripDetailsCard}>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>📍 Location</Text>
                            <Text style={styles.detailValue}>Kandy</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>📅 Date</Text>
                            <Text style={styles.detailValue}>2024-06-17</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>🕐 Time</Text>
                            <Text style={styles.detailValue}>08:00 AM</Text>
                        </View>
                    </View>
                </View>

                {/* Financial Details */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Financial Details</Text>
                    <View style={styles.financialDetails}>
                        <View style={styles.financialRow}>
                            <Text style={styles.financialLabel}>Total Amount:</Text>
                            <Text style={styles.financialValue}>Rs.15,000</Text>
                        </View>
                        <View style={styles.financialRow}>
                            <Text style={styles.financialLabel}>Your Commission:</Text>
                            <Text style={styles.financialValue}>Rs.4,500</Text>
                        </View>
                        <View style={styles.financialRow}>
                            <Text style={styles.financialLabel}>Fuel Allowance:</Text>
                            <Text style={styles.financialValue}>Rs.3,000</Text>
                        </View>
                    </View>
                </View>

                {/* Important Notes */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Important Notes</Text>
                    <View style={styles.notesContainer}>
                        <Text style={styles.notesText}>
                            Please arrive at the hotel at least 30 minutes before your check-in time. 
                            Valid ID is required for check-in. Cancellation policy applies as per 
                            the terms and conditions.
                        </Text>
                    </View>
                </View>

                {/* Location Map (simplified) */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Trip Location</Text>
                    <View style={styles.mapContainer}>
                        <WebView
                            style={styles.webView}
                            source={{
                                html: `
                                    <!DOCTYPE html>
                                    <html>
                                    <head>
                                        <meta charset="utf-8" />
                                        <meta name="viewport" content="width=device-width, initial-scale=1" />
                                        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
                                        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
                                        <style>
                                            * { margin: 0; padding: 0; }
                                            html, body { height: 100%; width: 100%; }
                                            #map { height: 100%; width: 100%; }
                                        </style>
                                    </head>
                                    <body>
                                        <div id="map"></div>
                                        <script>
                                            const map = L.map('map').setView([7.2906, 80.6337], 13);
                                            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                                                attribution: '© OpenStreetMap',
                                                maxZoom: 19
                                            }).addTo(map);
                                            L.marker([7.2906, 80.6337])
                                                .addTo(map)
                                                .bindPopup('Trip Destination')
                                                .openPopup();
                                        </script>
                                    </body>
                                    </html>
                                `,
                            }}
                            scrollEnabled={false}
                            scalesPageToFit={true}
                        />
                    </View>

                    <View style={styles.locationInfoSimple}>
                        <Ionicons name="location" size={18} color="#EAB308" />
                        <Text style={styles.locationName}>Kandy</Text>
                        <Text style={styles.locationDesc}>Trip destination</Text>
                    </View>
                </View>
            </ScrollView>

            {/* Bottom Actions */}
            <View style={styles.bottomActions}>
                <TouchableOpacity style={styles.declineButton} onPress={handleDeclineTrip}>
                    <Text style={styles.declineButtonText}>Decline</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={styles.confirmButton}
                    onPress={handleConfirmTrip}
                >
                    <Text style={styles.confirmButtonText}>Accept Booking</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    backButton: {
        padding: 8,
        position: 'absolute',
        left: 16,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#000',
        textAlign: 'center',
        letterSpacing: 0.3,
    },
    headerRight: {
        flexDirection: 'row',
    },
    notificationButton: {
        padding: 8,
    },
    content: {
        flex: 1,
        paddingHorizontal: 12,
        paddingTop: 8,
        paddingBottom: 8,
    },
    tripHeader: {
        backgroundColor: 'transparent',
        padding: 12,
        marginTop: 8,
        marginBottom: 12,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#EAB308',
        borderStyle: 'dashed',
    },
    tripTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#000',
        marginBottom: 4,
    },
    tripDate: {
        fontSize: 13,
        color: '#666',
        marginBottom: 8,
        fontWeight: '600',
    },
    shareButton: {
        backgroundColor: '#EAB308',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        alignSelf: 'flex-start',
        shadowColor: '#EAB308',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 2,
    },
    shareButtonText: {
        color: '#000',
        fontSize: 11,
        fontWeight: '600',
    },
    section: {
        marginTop: 8,
        marginBottom: 8,
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 12,
        borderLeftWidth: 4,
        borderLeftColor: '#EAB308',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 3,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1a1a1a',
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    customerInfo: {
        gap: 4,
    },
    customerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 4,
        alignItems: 'center',
    },
    customerLabel: {
        fontSize: 12,
        color: '#666',
        fontWeight: '500',
    },
    customerValue: {
        fontSize: 12,
        color: '#1a1a1a',
        fontWeight: '600',
    },
    tripDetails: {
        gap: 4,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 4,
        alignItems: 'center',
    },
    detailLabel: {
        fontSize: 12,
        color: '#666',
        fontWeight: '500',
    },
    detailValue: {
        fontSize: 12,
        color: '#1a1a1a',
        fontWeight: '600',
    },
    servicesContainer: {
        gap: 4,
    },
    serviceItem: {
        padding: 8,
        borderRadius: 8,
        borderWidth: 1,
    },
    serviceActive: {
        backgroundColor: '#E8F5E8',
        borderColor: '#4CAF50',
    },
    serviceInactive: {
        backgroundColor: '#F0F0F0',
        borderColor: '#DDD',
    },
    serviceCancelled: {
        backgroundColor: '#FFE8E8',
        borderColor: '#F44336',
    },
    serviceText: {
        fontSize: 12,
        color: '#1a1a1a',
        fontWeight: '500',
    },
    bookingInfo: {
        gap: 4,
    },
    bookingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 4,
    },
    bookingLabel: {
        fontSize: 12,
        color: '#666',
        fontWeight: '500',
    },
    bookingValue: {
        fontSize: 12,
        color: '#1a1a1a',
        fontWeight: '600',
    },
    financialDetails: {
        gap: 6,
    },
    financialRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 6,
        paddingHorizontal: 8,
        backgroundColor: '#f8fafc',
        borderRadius: 8,
    },
    financialLabel: {
        fontSize: 12,
        color: '#666',
        fontWeight: '500',
    },
    financialValue: {
        fontSize: 13,
        color: '#EAB308',
        fontWeight: '700',
    },
    notesContainer: {
        backgroundColor: '#fffbeb',
        padding: 10,
        borderRadius: 10,
        borderLeftWidth: 4,
        borderLeftColor: '#EAB308',
    },
    notesText: {
        fontSize: 12,
        color: '#333',
        lineHeight: 16,
        fontWeight: '500',
    },
    mapContainer: {
        borderRadius: 10,
        overflow: 'hidden',
        backgroundColor: '#f8fafc',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        height: 250,
    },
    webView: {
        flex: 1,
    },
    locationInfo: {
        marginTop: 10,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 8,
    },
    infoText: {
        fontSize: 12,
        color: '#666',
        fontWeight: '500',
    },
    locationDetails: {
        flex: 1,
    },
    locationName: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1a1a1a',
    },
    locationDesc: {
        fontSize: 11,
        color: '#666',
        fontWeight: '500',
        marginTop: 2,
    },
    routeInfo: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingTop: 10,
        marginTop: 8,
    },
    routeInfoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    routeInfoText: {
        fontSize: 12,
        color: '#666',
        fontWeight: '500',
    },
    mapPlaceholder: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fffbeb',
        borderRadius: 10,
    },
    mapText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1a1a1a',
        marginTop: 8,
    },
    mapSubText: {
        fontSize: 11,
        color: '#666',
        marginTop: 4,
        fontWeight: '500',
    },
    bottomActions: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#FFF',
        gap: 10,
        borderTopWidth: 1,
        borderTopColor: '#e2e8f0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    cancelButton: {
        flex: 1,
        backgroundColor: '#FEE2E2',
        paddingVertical: 11,
        borderRadius: 10,
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: '#F44336',
    },
    cancelButtonText: {
        color: '#DC2626',
        fontSize: 14,
        fontWeight: '700',
        letterSpacing: 0.2,
    },
    confirmButton: {
        flex: 1,
        backgroundColor: '#EAB308',
        paddingVertical: 11,
        borderRadius: 10,
        alignItems: 'center',
        shadowColor: '#EAB308',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 3,
    },
    confirmButtonText: {
        color: '#000',
        fontSize: 14,
        fontWeight: '700',
        letterSpacing: 0.2,
    },
    declineButton: {
        flex: 1,
        backgroundColor: '#FEE2E2',
        paddingVertical: 11,
        borderRadius: 10,
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: '#F44336',
    },
    declineButtonText: {
        color: '#DC2626',
        fontSize: 14,
        fontWeight: '700',
        letterSpacing: 0.2,
    },
    tripDetailsCard: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 12,
        borderWidth: 1,
        borderColor: '#e6e6e6',
    },
    locationInfoSimple: {
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
})