import { useLocalSearchParams, router, useRouter } from 'expo-router'
import { Text, View, ScrollView, StyleSheet, TouchableOpacity, StatusBar, TextInput, Dimensions } from 'react-native'
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'

export default function Bookings() {
    const { id } = useLocalSearchParams()
    const { width } = Dimensions.get('window')
    const routerHook = useRouter()

    const handleBackPress = () => {
        console.log('Back button pressed')
        router.back()
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFEB3B" />

            {/* Enhanced Header */}
            <LinearGradient
                colors={['#FFEB3B', '#FDD835']}
                style={styles.header}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
            >
                <TouchableOpacity 
                    style={styles.backButton} 
                    onPress={handleBackPress}
                    activeOpacity={0.7}
                    accessibilityLabel="Go back"
                    accessibilityRole="button"
                >
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Group Tour Quotation</Text>
                <TouchableOpacity style={styles.notificationButton}>
                    <Ionicons name="notifications-outline" size={24} color="#000" />
                </TouchableOpacity>
            </LinearGradient>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Enhanced Trip Header */}
                <View style={styles.tripHeader}>
                    <View style={styles.tripHeaderTop}>
                        <View style={styles.tripTitleContainer}>
                            <FontAwesome5 name="users" size={20} color="#FFB300" style={styles.tripIcon} />
                            <Text style={styles.tripTitle}>Group Tour Request</Text>
                        </View>
                        <View style={styles.statusBadge}>
                            <Text style={styles.statusText}>QUOTATION</Text>
                        </View>
                    </View>
                    <Text style={styles.tripId}>#TSL-2024-001</Text>
                    <TouchableOpacity style={styles.downloadButton}>
                        <MaterialIcons name="file-download" size={16} color="#FFB300" />
                        <Text style={styles.downloadButtonText}>Download PDF</Text>
                    </TouchableOpacity>
                </View>

                {/* Customer Information */}
                <View style={styles.section}>
                    <View style={styles.sectionTitle}>
                        <Ionicons name="person" size={20} color="#FFB300" style={{ marginRight: 8 }} />
                        <Text style={styles.sectionTitle}>Customer Information</Text>
                    </View>
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
                    <View style={styles.sectionTitle}>
                        <MaterialIcons name="schedule" size={20} color="#FFB300" style={{ marginRight: 8 }} />
                        <Text style={styles.sectionTitle}>Trip Details</Text>
                    </View>
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

                {/* Route Overview */}
                <View style={styles.section}>
                    <View style={styles.sectionTitle}>
                        <FontAwesome5 name="route" size={18} color="#FFB300" style={{ marginRight: 8 }} />
                        <Text style={styles.sectionTitle}>Route Overview</Text>
                    </View>
                    <View style={styles.servicesContainer}>
                        <View style={[styles.serviceItem, styles.serviceActive]}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                                <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: '#4CAF50', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                                    <Text style={{ color: '#FFF', fontSize: 12, fontWeight: 'bold' }}>1</Text>
                                </View>
                                <Text style={styles.serviceText}>Bandaranayake International Airport</Text>
                            </View>
                            <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                        </View>
                        <View style={[styles.serviceItem, styles.serviceInactive]}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                                <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: '#E0E0E0', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                                    <Text style={{ color: '#666', fontSize: 12, fontWeight: 'bold' }}>2</Text>
                                </View>
                                <Text style={styles.serviceText}>Pinnawala Elephant Orphanage</Text>
                            </View>
                            <Ionicons name="ellipse-outline" size={20} color="#E0E0E0" />
                        </View>
                        <View style={[styles.serviceItem, styles.serviceInactive]}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                                <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: '#E0E0E0', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                                    <Text style={{ color: '#666', fontSize: 12, fontWeight: 'bold' }}>3</Text>
                                </View>
                                <Text style={styles.serviceText}>Royal Botanical Gardens, Peradeniya</Text>
                            </View>
                            <Ionicons name="ellipse-outline" size={20} color="#E0E0E0" />
                        </View>
                        <View style={[styles.serviceItem, styles.serviceInactive]}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                                <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: '#E0E0E0', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                                    <Text style={{ color: '#666', fontSize: 12, fontWeight: 'bold' }}>4</Text>
                                </View>
                                <Text style={styles.serviceText}>Temple of Sacred Tooth relic, Kandy</Text>
                            </View>
                            <Ionicons name="ellipse-outline" size={20} color="#E0E0E0" />
                        </View>
                        <View style={[styles.serviceItem, styles.serviceCancelled]}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                                <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: '#F44336', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                                    <Text style={{ color: '#FFF', fontSize: 12, fontWeight: 'bold' }}>5</Text>
                                </View>
                                <Text style={styles.serviceText}>Colombo Fort</Text>
                            </View>
                            <Ionicons name="close-circle" size={20} color="#F44336" />
                        </View>
                    </View>
                </View>

                {/* Vehicle Information */}
                <View style={styles.section}>
                    <View style={styles.sectionTitle}>
                        <FontAwesome5 name="car" size={18} color="#FFB300" style={{ marginRight: 8 }} />
                        <Text style={styles.sectionTitle}>Vehicle Information</Text>
                    </View>
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

                {/* Important Notes */}
                <View style={styles.section}>
                    <View style={styles.sectionTitle}>
                        <Ionicons name="information-circle" size={20} color="#FFB300" style={{ marginRight: 8 }} />
                        <Text style={styles.sectionTitle}>Important Notes</Text>
                    </View>
                    <View style={styles.notesContainer}>
                        <Text style={styles.notesText}>
                            Please arrive at the hotel at least 30 minutes before your check-in time.
                            Valid ID is required for check-in. Cancellation policy applies as per
                            the terms and conditions.
                        </Text>
                    </View>
                </View>
            </ScrollView>

            {/* Enhanced Bottom Actions */}
            <View style={styles.bottomActions}>
                <View style={styles.priceInputContainer}>
                    <Text style={styles.priceLabel}>Quotation Amount</Text>
                    <View style={styles.priceInputWrapper}>
                        <Text style={styles.currencySymbol}>Rs.</Text>
                        <TextInput
                            style={styles.priceInput}
                            placeholder="Enter your price"
                            placeholderTextColor='#999'
                            keyboardType="numeric"
                            textAlignVertical="center"
                            multiline={false}
                        />
                    </View>
                </View>
                <TouchableOpacity style={styles.confirmButton}>
                    <FontAwesome5 name="paper-plane" size={16} color="#FFFFFF" />
                    <Text style={styles.confirmButtonText}>Send Quotation</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 16,
        paddingTop: 50,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    backButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#000000',
        flex: 1,
        textAlign: 'center',
        marginHorizontal: 16,
    },
    headerRight: {
        flexDirection: 'row',
        gap: 8,
    },
    notificationButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
    },
    content: {
        flex: 1,
        paddingHorizontal: 16,
    },
    tripHeader: {
        backgroundColor: '#FFFFFF',
        padding: 20,
        marginTop: 16,
        borderRadius: 16,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        borderLeftWidth: 5,
        borderLeftColor: '#FFB300',
    },
    tripHeaderTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    tripTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    tripIcon: {
        marginRight: 10,
    },
    tripTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#2E2E2E',
        flex: 1,
    },
    statusBadge: {
        backgroundColor: '#FFF8E1',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#FFB300',
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#FFB300',
        letterSpacing: 0.5,
    },
    tripId: {
        fontSize: 16,
        color: '#666',
        marginBottom: 12,
        fontWeight: '500',
    },
    downloadButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF8E1',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 25,
        alignSelf: 'flex-start',
        gap: 6,
    },
    downloadButtonText: {
        color: '#FFB300',
        fontSize: 14,
        fontWeight: '600',
    },
    section: {
        marginTop: 16,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#2E2E2E',
        marginBottom: 16,
    },
    customerInfo: {
        gap: 12,
    },
    customerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    customerLabel: {
        fontSize: 15,
        color: '#666',
        fontWeight: '500',
        flex: 1,
    },
    customerValue: {
        fontSize: 15,
        color: '#2E2E2E',
        fontWeight: '600',
        textAlign: 'right',
        flex: 1.2,
    },
    tripDetails: {
        gap: 12,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    detailLabel: {
        fontSize: 15,
        color: '#666',
        fontWeight: '500',
        flex: 1,
    },
    detailValue: {
        fontSize: 15,
        color: '#2E2E2E',
        fontWeight: '600',
        textAlign: 'right',
        flex: 1.2,
    },
    servicesContainer: {
        gap: 12,
    },
    serviceItem: {
        padding: 16,
        borderRadius: 12,
        borderWidth: 2,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    serviceActive: {
        backgroundColor: '#E8F8F5',
        borderColor: '#4CAF50',
    },
    serviceInactive: {
        backgroundColor: '#F8F9FA',
        borderColor: '#E0E0E0',
    },
    serviceCancelled: {
        backgroundColor: '#FFF5F5',
        borderColor: '#F44336',
    },
    serviceText: {
        fontSize: 15,
        color: '#2E2E2E',
        fontWeight: '600',
    },
    bookingInfo: {
        gap: 12,
    },
    bookingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    bookingLabel: {
        fontSize: 15,
        color: '#666',
        fontWeight: '500',
        flex: 1,
    },
    bookingValue: {
        fontSize: 15,
        color: '#2E2E2E',
        fontWeight: '600',
        textAlign: 'right',
        flex: 1.2,
    },
    financialDetails: {
        gap: 12,
    },
    financialRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    financialLabel: {
        fontSize: 15,
        color: '#666',
        fontWeight: '500',
        flex: 1,
    },
    financialValue: {
        fontSize: 15,
        color: '#2E2E2E',
        fontWeight: '600',
        textAlign: 'right',
        flex: 1.2,
    },
    notesContainer: {
        backgroundColor: '#FFF8E1',
        padding: 16,
        borderRadius: 12,
        borderLeftWidth: 4,
        borderLeftColor: '#FFB300',
        marginTop: 8,
    },
    notesText: {
        fontSize: 15,
        color: '#2E2E2E',
        lineHeight: 22,
        fontWeight: '500',
    },
    bottomActions: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingVertical: 20,
        backgroundColor: '#FFFFFF',
        alignItems: 'flex-end',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    cancelButton: {
        backgroundColor: '#FFF5F5',
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 25,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#F44336',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
        flex: 0.8,
    },
    cancelButtonText: {
        color: '#F44336',
        fontSize: 16,
        fontWeight: '700',
    },
    confirmButton: {
        backgroundColor: '#FFB300',
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 25,
        alignItems: 'center',
        elevation: 3,
        shadowColor: '#FFB300',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
        height: 50,
        minWidth: 150,
    },
    confirmButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
    },
    priceInputContainer: {
        flex: 1,
        marginRight: 16,
    },
    priceLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
        marginBottom: 8,
    },
    priceInputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#E0E0E0',
        paddingHorizontal: 12,
        height: 50,
    },
    currencySymbol: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFB300',
        marginRight: 8,
    },
    priceInput: {
        flex: 1,
        fontSize: 16,
        fontWeight: '600',
        color: '#2E2E2E',
        paddingVertical: 0,
        paddingHorizontal: 0,
        textAlignVertical: 'center',
        includeFontPadding: false,
        height: '100%',
    },
})