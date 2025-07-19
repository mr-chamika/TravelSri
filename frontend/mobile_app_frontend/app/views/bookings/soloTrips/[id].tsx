import { useLocalSearchParams, router } from 'expo-router'
import { Text, View, ScrollView, StyleSheet, TouchableOpacity, StatusBar } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

export default function Bookings() {
    const { id } = useLocalSearchParams()

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFEB3B" />
            
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                {/* </TouchableOpacity>
                <Text style={styles.headerTitle}>TravelSri</Text>
                <View style={styles.headerRight}>
                    <TouchableOpacity style={styles.notificationButton}>
                        <Ionicons name="notifications-outline" size={24} color="#000" />
                        </View> */}
                        </TouchableOpacity>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Trip Header */}
                <View style={styles.tripHeader}>
                    <Text style={styles.tripTitle}>Trip Assignment</Text>
                    <Text style={styles.tripDate}>#TSL-2024-001</Text>
                    <TouchableOpacity style={styles.shareButton}>
                        <Text style={styles.shareButtonText}>Download PDF</Text>
                    </TouchableOpacity>
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
                    <View style={styles.tripDetails}>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Date:</Text>
                            <Text style={styles.detailValue}>2024-06-17</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Time:</Text>
                            <Text style={styles.detailValue}>08:00 AM</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Distance:</Text>
                            <Text style={styles.detailValue}>280 km</Text>
                        </View>
                    </View>
                </View>

                {/* Booking Services */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Route Overview</Text>
                    <View style={styles.servicesContainer}>
                        <TouchableOpacity style={[styles.serviceItem, styles.serviceActive]}>
                            <Text style={styles.serviceText}>#1  Bandaranayake International Airport</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.serviceItem, styles.serviceInactive]}>
                            <Text style={styles.serviceText}>#2  Pinnawala Elephant Orphanage</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.serviceItem, styles.serviceInactive]}>
                            <Text style={styles.serviceText}>#3  Royal Botanical Gardens,Peradeniya</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.serviceItem, styles.serviceInactive]}>
                            <Text style={styles.serviceText}>#4  Temple of Sacred Tooth relic,Kandy</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.serviceItem, styles.serviceCancelled]}>
                            <Text style={styles.serviceText}>#5  Colombo Fort</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Booking Information */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Vehicle Information</Text>
                    <View style={styles.bookingInfo}>
                        <View style={styles.bookingRow}>
                            <Text style={styles.bookingLabel}>Vehicle Type:</Text>
                            <Text style={styles.bookingValue}>Toyota Hiace</Text>
                        </View>
                        <View style={styles.bookingRow}>
                            <Text style={styles.bookingLabel}>Vehicle Number:</Text>
                            <Text style={styles.bookingValue}>BBO-2345</Text>
                        </View>
                        <View style={styles.bookingRow}>
                            <Text style={styles.bookingLabel}>Driver Name:</Text>
                            <Text style={styles.bookingValue}>Kasun Gamage</Text>
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
            </ScrollView>

            {/* Bottom Actions */}
            <View style={styles.bottomActions}>
                <TouchableOpacity style={styles.cancelButton}>
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.confirmButton}>
                    <Text style={styles.confirmButtonText}>Confirm Trip</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        // backgroundColor: '#FFEB3B',
        // paddingTop: 50,
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
    },
    headerRight: {
        flexDirection: 'row',
    },
    notificationButton: {
        padding: 8,
    },
    content: {
        flex: 1,
        paddingHorizontal: 16,
    },
    tripHeader: {
        backgroundColor: '#FFEB3B',
        padding: 16,
        marginTop: 16,
        borderRadius: 8,
    },
    tripTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 4,
    },
    tripDate: {
        fontSize: 14,
        color: '#666',
        marginBottom: 12,
    },
    shareButton: {
        backgroundColor: '#FFF',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        alignSelf: 'flex-start',
    },
    shareButtonText: {
        color: '#000',
        fontSize: 12,
        fontWeight: '500',
    },
    section: {
        marginTop: 16,
        backgroundColor: '#FFF',
        borderRadius: 8,
        padding: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 12,
    },
    customerInfo: {
        gap: 8,
    },
    customerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    customerLabel: {
        fontSize: 14,
        color: '#666',
    },
    customerValue: {
        fontSize: 14,
        color: '#000',
        fontWeight: '500',
    },
    tripDetails: {
        gap: 8,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    detailLabel: {
        fontSize: 14,
        color: '#666',
    },
    detailValue: {
        fontSize: 14,
        color: '#000',
        fontWeight: '500',
    },
    servicesContainer: {
        gap: 8,
    },
    serviceItem: {
        padding: 12,
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
        fontSize: 14,
        color: '#000',
    },
    bookingInfo: {
        gap: 8,
    },
    bookingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    bookingLabel: {
        fontSize: 14,
        color: '#666',
    },
    bookingValue: {
        fontSize: 14,
        color: '#000',
        fontWeight: '500',
    },
    financialDetails: {
        gap: 8,
    },
    financialRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    financialLabel: {
        fontSize: 14,
        color: '#666',
    },
    financialValue: {
        fontSize: 14,
        color: '#000',
        fontWeight: '500',
    },
    notesContainer: {
        backgroundColor: '#FFF8E1',
        padding: 12,
        borderRadius: 8,
        borderLeftWidth: 4,
        borderLeftColor: '#FFC107',
    },
    notesText: {
        fontSize: 14,
        color: '#333',
        lineHeight: 20,
    },
    bottomActions: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingVertical: 16,
        backgroundColor: '#FFF',
        gap: 12,
    },
    cancelButton: {
        flex: 1,
        backgroundColor: '#FFE8E8',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#F44336',
    },
    cancelButtonText: {
        color: '#F44336',
        fontSize: 16,
        fontWeight: '600',
    },
    confirmButton: {
        flex: 1,
        backgroundColor: '#4CAF50',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    confirmButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
    },
})