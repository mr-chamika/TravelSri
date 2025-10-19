import { useLocalSearchParams, router } from 'expo-router'
import { Text, View, ScrollView, StyleSheet, TouchableOpacity, StatusBar, Dimensions } from 'react-native'
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'

export default function Bookings() {
    const { id } = useLocalSearchParams()
    const { width } = Dimensions.get('window')

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFEB3B" />
            
            {/* Enhanced Header */}
            <LinearGradient
                colors={['#FFEB3B', '#FDD835']}
                style={styles.header}
            >
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Trip Details</Text>
                <TouchableOpacity style={styles.notificationButton}>
                    <Ionicons name="notifications-outline" size={24} color="#000" />
                </TouchableOpacity>
            </LinearGradient>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Enhanced Trip Header */}
                <View style={styles.tripHeader}>
                    <View style={styles.tripHeaderTop}>
                        <View style={styles.tripTitleContainer}>
                            <FontAwesome5 name="route" size={20} color="#F57F17" style={styles.tripIcon} />
                            <Text style={styles.tripTitle}>Trip Assignment</Text>
                        </View>
                        <View style={styles.statusBadge}>
                            <Text style={styles.statusText}>PENDING</Text>
                        </View>
                    </View>
                    <Text style={styles.tripId}>#TSL-2024-001</Text>
                    <TouchableOpacity style={styles.downloadButton}>
                        <MaterialIcons name="file-download" size={16} color="#F57F17" />
                        <Text style={styles.downloadButtonText}>Download PDF</Text>
                    </TouchableOpacity>
                </View>

                {/* Enhanced Customer Information */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <FontAwesome5 name="user" size={18} color="#F57F17" />
                        <Text style={styles.sectionTitle}>Customer Information</Text>
                    </View>
                    <View style={styles.customerCard}>
                        <View style={styles.customerRow}>
                            <View style={styles.infoItem}>
                                <Ionicons name="person-outline" size={16} color="#6B7280" />
                                <Text style={styles.customerLabel}>Name</Text>
                            </View>
                            <Text style={styles.customerValue}>John Doe</Text>
                        </View>
                        <View style={styles.customerRow}>
                            <View style={styles.infoItem}>
                                <Ionicons name="call-outline" size={16} color="#6B7280" />
                                <Text style={styles.customerLabel}>Phone</Text>
                            </View>
                            <Text style={styles.customerValue}>071 1234567</Text>
                        </View>
                        <View style={styles.customerRow}>
                            <View style={styles.infoItem}>
                                <Ionicons name="people-outline" size={16} color="#6B7280" />
                                <Text style={styles.customerLabel}>Passengers</Text>
                            </View>
                            <Text style={styles.customerValue}>12 People</Text>
                        </View>
                    </View>
                </View>

                {/* Enhanced Trip Details */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <FontAwesome5 name="calendar-alt" size={18} color="#F57F17" />
                        <Text style={styles.sectionTitle}>Trip Details</Text>
                    </View>
                    <View style={styles.tripDetailsCard}>
                        <View style={styles.detailItem}>
                            <View style={styles.detailIconContainer}>
                                <Ionicons name="calendar-outline" size={20} color="#FFEB3B" />
                            </View>
                            <View style={styles.detailContent}>
                                <Text style={styles.detailLabel}>Date</Text>
                                <Text style={styles.detailValue}>June 17, 2024</Text>
                            </View>
                        </View>
                        <View style={styles.detailItem}>
                            <View style={styles.detailIconContainer}>
                                <Ionicons name="time-outline" size={20} color="#FFEB3B" />
                            </View>
                            <View style={styles.detailContent}>
                                <Text style={styles.detailLabel}>Time</Text>
                                <Text style={styles.detailValue}>08:00 AM</Text>
                            </View>
                        </View>
                        <View style={styles.detailItem}>
                            <View style={styles.detailIconContainer}>
                                <FontAwesome5 name="route" size={16} color="#FFEB3B" />
                            </View>
                            <View style={styles.detailContent}>
                                <Text style={styles.detailLabel}>Distance</Text>
                                <Text style={styles.detailValue}>280 km</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Enhanced Route Overview */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <FontAwesome5 name="map-marked-alt" size={18} color="#F57F17" />
                        <Text style={styles.sectionTitle}>Route Overview</Text>
                    </View>
                    <View style={styles.routeContainer}>
                        <View style={[styles.routeItem, styles.routeActive]}>
                            <View style={styles.routeNumber}>
                                <Text style={styles.routeNumberText}>1</Text>
                            </View>
                            <View style={styles.routeContent}>
                                <Text style={styles.routeText}>Bandaranayake International Airport</Text>
                                <Text style={styles.routeStatus}>Starting Point</Text>
                            </View>
                            <Ionicons name="checkmark-circle" size={24} color="#10B981" />
                        </View>
                        
                        <View style={[styles.routeItem, styles.routeInactive]}>
                            <View style={styles.routeNumber}>
                                <Text style={styles.routeNumberText}>2</Text>
                            </View>
                            <View style={styles.routeContent}>
                                <Text style={styles.routeText}>Pinnawala Elephant Orphanage</Text>
                                <Text style={styles.routeStatus}>Next Stop</Text>
                            </View>
                            <Ionicons name="time-outline" size={24} color="#6B7280" />
                        </View>
                        
                        <View style={[styles.routeItem, styles.routeInactive]}>
                            <View style={styles.routeNumber}>
                                <Text style={styles.routeNumberText}>3</Text>
                            </View>
                            <View style={styles.routeContent}>
                                <Text style={styles.routeText}>Royal Botanical Gardens, Peradeniya</Text>
                                <Text style={styles.routeStatus}>Upcoming</Text>
                            </View>
                            <Ionicons name="time-outline" size={24} color="#6B7280" />
                        </View>
                        
                        <View style={[styles.routeItem, styles.routeInactive]}>
                            <View style={styles.routeNumber}>
                                <Text style={styles.routeNumberText}>4</Text>
                            </View>
                            <View style={styles.routeContent}>
                                <Text style={styles.routeText}>Temple of Sacred Tooth Relic, Kandy</Text>
                                <Text style={styles.routeStatus}>Upcoming</Text>
                            </View>
                            <Ionicons name="time-outline" size={24} color="#6B7280" />
                        </View>
                        
                        <View style={[styles.routeItem, styles.routeCancelled]}>
                            <View style={styles.routeNumber}>
                                <Text style={styles.routeNumberText}>5</Text>
                            </View>
                            <View style={styles.routeContent}>
                                <Text style={styles.routeText}>Colombo Fort</Text>
                                <Text style={styles.routeStatus}>Cancelled</Text>
                            </View>
                            <Ionicons name="close-circle" size={24} color="#EF4444" />
                        </View>
                    </View>
                </View>

                {/* Enhanced Vehicle Information */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <FontAwesome5 name="car" size={18} color="#F57F17" />
                        <Text style={styles.sectionTitle}>Vehicle Information</Text>
                    </View>
                    <View style={styles.vehicleCard}>
                        <View style={styles.vehicleRow}>
                            <View style={styles.infoItem}>
                                <FontAwesome5 name="car-alt" size={16} color="#6B7280" />
                                <Text style={styles.vehicleLabel}>Vehicle Type</Text>
                            </View>
                            <Text style={styles.vehicleValue}>Toyota Hiace</Text>
                        </View>
                        <View style={styles.vehicleRow}>
                            <View style={styles.infoItem}>
                                <MaterialIcons name="confirmation-number" size={16} color="#6B7280" />
                                <Text style={styles.vehicleLabel}>Vehicle Number</Text>
                            </View>
                            <Text style={styles.vehicleValue}>BBO-2345</Text>
                        </View>
                        <View style={styles.vehicleRow}>
                            <View style={styles.infoItem}>
                                <Ionicons name="person-circle-outline" size={16} color="#6B7280" />
                                <Text style={styles.vehicleLabel}>Driver Name</Text>
                            </View>
                            <Text style={styles.vehicleValue}>Kasun Gamage</Text>
                        </View>
                    </View>
                </View>

                {/* Enhanced Financial Details */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <FontAwesome5 name="money-bill-wave" size={18} color="#F57F17" />
                        <Text style={styles.sectionTitle}>Financial Details</Text>
                    </View>
                    <View style={styles.financialCard}>
                        <View style={styles.financialSummary}>
                            <Text style={styles.totalAmountLabel}>Total Amount</Text>
                            <Text style={styles.totalAmountValue}>Rs. 15,000</Text>
                        </View>
                        <View style={styles.financialBreakdown}>
                            <View style={styles.financialRow}>
                                <View style={styles.infoItem}>
                                    <MaterialIcons name="account-balance-wallet" size={16} color="#10B981" />
                                    <Text style={styles.financialLabel}>Your Commission</Text>
                                </View>
                                <Text style={styles.financialValuePositive}>Rs. 4,500</Text>
                            </View>
                            <View style={styles.financialRow}>
                                <View style={styles.infoItem}>
                                    <MaterialIcons name="local-gas-station" size={16} color="#F59E0B" />
                                    <Text style={styles.financialLabel}>Fuel Allowance</Text>
                                </View>
                                <Text style={styles.financialValue}>Rs. 3,000</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Enhanced Important Notes */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <MaterialIcons name="info" size={18} color="#F57F17" />
                        <Text style={styles.sectionTitle}>Important Notes</Text>
                    </View>
                    <View style={styles.notesContainer}>
                        <Text style={styles.notesText}>
                            Please arrive at the pickup location at least 15 minutes before the scheduled time. 
                            Valid driver's license and vehicle registration are required. Follow all safety 
                            protocols and ensure passenger comfort throughout the journey.
                        </Text>
                    </View>
                </View>
            </ScrollView>

            {/* Enhanced Bottom Actions */}
            <View style={styles.bottomActions}>
                <TouchableOpacity style={styles.cancelButton}>
                    <MaterialIcons name="cancel" size={20} color="#EF4444" />
                    <Text style={styles.cancelButtonText}>Decline Trip</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.confirmButton}>
                    <MaterialIcons name="check-circle" size={20} color="#000" />
                    <Text style={styles.confirmButtonText}>Accept Trip</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        paddingTop: 50,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    backButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.1)',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000',
    },
    notificationButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.1)',
    },
    content: {
        flex: 1,
        paddingHorizontal: 16,
    },
    
    // Trip Header Styles
    tripHeader: {
        backgroundColor: '#FFF',
        padding: 20,
        marginTop: 16,
        borderRadius: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    tripHeaderTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    tripTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    tripIcon: {
        marginRight: 8,
    },
    tripTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    statusBadge: {
        backgroundColor: '#FEF3C7',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#F59E0B',
    },
    statusText: {
        color: '#92400E',
        fontSize: 12,
        fontWeight: '600',
    },
    tripId: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 16,
    },
    downloadButton: {
        backgroundColor: '#FEF3C7',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        borderWidth: 1,
        borderColor: '#F59E0B',
    },
    downloadButtonText: {
        color: '#F57F17',
        fontSize: 14,
        fontWeight: '500',
        marginLeft: 4,
    },
    
    // Section Styles
    section: {
        marginTop: 16,
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1F2937',
        marginLeft: 8,
    },
    
    // Info Item Styles
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    
    // Customer Info Styles
    customerCard: {
        gap: 16,
    },
    customerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    customerLabel: {
        fontSize: 14,
        color: '#6B7280',
        marginLeft: 8,
    },
    customerValue: {
        fontSize: 14,
        color: '#1F2937',
        fontWeight: '600',
    },
    
    // Trip Details Styles
    tripDetailsCard: {
        gap: 16,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    detailIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    detailContent: {
        flex: 1,
    },
    detailLabel: {
        fontSize: 12,
        color: '#6B7280',
        marginBottom: 2,
    },
    detailValue: {
        fontSize: 16,
        color: '#1F2937',
        fontWeight: '600',
    },
    
    // Route Styles
    routeContainer: {
        gap: 12,
    },
    routeItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
    },
    routeActive: {
        backgroundColor: '#ECFDF5',
        borderColor: '#10B981',
    },
    routeInactive: {
        backgroundColor: '#F9FAFB',
        borderColor: '#E5E7EB',
    },
    routeCancelled: {
        backgroundColor: '#FEF2F2',
        borderColor: '#EF4444',
    },
    routeNumber: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#F57F17',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    routeNumberText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: 'bold',
    },
    routeContent: {
        flex: 1,
    },
    routeText: {
        fontSize: 14,
        color: '#1F2937',
        fontWeight: '500',
        marginBottom: 2,
    },
    routeStatus: {
        fontSize: 12,
        color: '#6B7280',
    },
    
    // Vehicle Info Styles
    vehicleCard: {
        gap: 16,
    },
    vehicleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    vehicleLabel: {
        fontSize: 14,
        color: '#6B7280',
        marginLeft: 8,
    },
    vehicleValue: {
        fontSize: 14,
        color: '#1F2937',
        fontWeight: '600',
    },
    
    // Financial Details Styles
    financialCard: {
        gap: 16,
    },
    financialSummary: {
        backgroundColor: '#F57F17',
        padding: 20,
        borderRadius: 12,
        alignItems: 'center',
    },
    totalAmountLabel: {
        fontSize: 14,
        color: '#FEF3C7',
        marginBottom: 4,
    },
    totalAmountValue: {
        fontSize: 28,
        color: '#FFF',
        fontWeight: 'bold',
    },
    financialBreakdown: {
        gap: 12,
    },
    financialRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    financialLabel: {
        fontSize: 14,
        color: '#6B7280',
        marginLeft: 8,
    },
    financialValue: {
        fontSize: 14,
        color: '#1F2937',
        fontWeight: '600',
    },
    financialValuePositive: {
        fontSize: 14,
        color: '#10B981',
        fontWeight: '600',
    },
    
    // Notes Styles
    notesContainer: {
        backgroundColor: '#FEF3C7',
        padding: 16,
        borderRadius: 12,
        borderLeftWidth: 4,
        borderLeftColor: '#F59E0B',
    },
    notesText: {
        fontSize: 14,
        color: '#92400E',
        lineHeight: 20,
    },
    
    // Bottom Actions Styles
    bottomActions: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingVertical: 20,
        backgroundColor: '#FFF',
        gap: 12,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    cancelButton: {
        flex: 1,
        backgroundColor: '#FEF2F2',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: '#FECACA',
    },
    cancelButtonText: {
        color: '#EF4444',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
    confirmButton: {
        flex: 1,
        backgroundColor: '#FFEB3B',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        elevation: 2,
        shadowColor: '#FFEB3B',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    confirmButtonText: {
        color: '#000',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
})