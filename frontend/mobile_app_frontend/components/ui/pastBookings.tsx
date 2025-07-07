import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  RefreshControl,
  Alert
} from 'react-native';
import { MapPin, Calendar, DollarSign, User, Clock, Star } from 'lucide-react-native';

interface BookingData {
  id: string;
  location: string;
  date: string;
  duration: string;
  charges: number;
  currency: string;
  clientName: string;
  clientPhone: string;
  status: 'completed' | 'cancelled' | 'no-show';
  rating?: number;
  review?: string;
  paymentMethod: string;
  groupSize: number;
  specialRequests?: string;
}

const PastBookings = () => {
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Mock data - replace with actual API call
  const mockBookings: BookingData[] = [
    {
      id: '1',
      location: 'Sigiriya Rock Fortress',
      date: '2024-12-15',
      duration: '6 hours',
      charges: 12000,
      currency: 'LKR',
      clientName: 'John Smith',
      clientPhone: '+94 77 123 4567',
      status: 'completed',
      rating: 5,
      review: 'Excellent guide! Very knowledgeable about the history.',
      paymentMethod: 'Cash',
      groupSize: 4,
      specialRequests: 'Early morning start requested'
    },
    {
      id: '2',
      location: 'Kandy Temple Tour',
      date: '2024-12-10',
      duration: '4 hours',
      charges: 8000,
      currency: 'LKR',
      clientName: 'Sarah Johnson',
      clientPhone: '+94 76 987 6543',
      status: 'completed',
      rating: 4,
      paymentMethod: 'Card',
      groupSize: 2
    },
    {
      id: '3',
      location: 'Ella Nine Arch Bridge',
      date: '2024-12-05',
      duration: '3 hours',
      charges: 6000,
      currency: 'LKR',
      clientName: 'Michael Brown',
      clientPhone: '+94 75 456 7890',
      status: 'cancelled',
      paymentMethod: 'Online',
      groupSize: 3,
      specialRequests: 'Photography focus'
    },
    {
      id: '4',
      location: 'Galle Fort Walking Tour',
      date: '2024-11-28',
      duration: '5 hours',
      charges: 10000,
      currency: 'LKR',
      clientName: 'Emma Davis',
      clientPhone: '+94 77 234 5678',
      status: 'completed',
      rating: 5,
      review: 'Amazing experience! Highly recommend this guide.',
      paymentMethod: 'Cash',
      groupSize: 6
    },
    {
      id: '5',
      location: 'Dambulla Cave Temple',
      date: '2024-11-20',
      duration: '4 hours',
      charges: 9000,
      currency: 'LKR',
      clientName: 'David Wilson',
      clientPhone: '+94 78 345 6789',
      status: 'no-show',
      paymentMethod: 'Online',
      groupSize: 2
    }
  ];

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      // Replace with actual API call
      setTimeout(() => {
        setBookings(mockBookings);
        setLoading(false);
      }, 1000);
    } catch (error) {
      Alert.alert('Error', 'Failed to load bookings');
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadBookings();
    setRefreshing(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#10B981';
      case 'cancelled':
        return '#EF4444';
      case 'no-show':
        return '#F59E0B';
      default:
        return '#6B7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      case 'no-show':
        return 'No Show';
      default:
        return status;
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={16}
        color={index < rating ? '#FFD700' : '#E5E7EB'}
        fill={index < rating ? '#FFD700' : 'none'}
      />
    ));
  };

  const totalEarnings = bookings
    .filter(booking => booking.status === 'completed')
    .reduce((total, booking) => total + booking.charges, 0);

  const completedBookings = bookings.filter(booking => booking.status === 'completed').length;

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor="#FEFA17" barStyle="dark-content" />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading bookings...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FEFA17" barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Past Bookings</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{completedBookings}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>LKR {totalEarnings.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Total Earnings</Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {bookings.map((booking) => (
          <View key={booking.id} style={styles.bookingCard}>
            {/* Status Badge */}
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(booking.status) }]}>
              <Text style={styles.statusText}>{getStatusText(booking.status)}</Text>
            </View>

            {/* Location */}
            <View style={styles.bookingHeader}>
              <MapPin size={24} color="#374151" />
              <Text style={styles.locationText}>{booking.location}</Text>
            </View>

            {/* Date and Duration */}
            <View style={styles.infoRow}>
              <Calendar size={20} color="#6B7280" />
              <Text style={styles.infoText}>{formatDate(booking.date)}</Text>
              <Clock size={20} color="#6B7280" style={styles.clockIcon} />
              <Text style={styles.infoText}>{booking.duration}</Text>
            </View>

            {/* Client Info */}
            <View style={styles.infoRow}>
              <User size={20} color="#6B7280" />
              <View style={styles.clientInfo}>
                <Text style={styles.clientName}>{booking.clientName}</Text>
                <Text style={styles.clientPhone}>{booking.clientPhone}</Text>
                <Text style={styles.groupSize}>Group size: {booking.groupSize} people</Text>
              </View>
            </View>

            {/* Charges */}
            <View style={styles.infoRow}>
              <DollarSign size={20} color="#6B7280" />
              <Text style={styles.chargesText}>
                {booking.currency} {booking.charges.toLocaleString()}
              </Text>
              <Text style={styles.paymentMethod}>({booking.paymentMethod})</Text>
            </View>

            {/* Special Requests */}
            {booking.specialRequests && (
              <View style={styles.specialRequests}>
                <Text style={styles.specialRequestsLabel}>Special Requests:</Text>
                <Text style={styles.specialRequestsText}>{booking.specialRequests}</Text>
              </View>
            )}

            {/* Rating and Review */}
            {booking.rating && booking.status === 'completed' && (
              <View style={styles.ratingContainer}>
                <View style={styles.ratingRow}>
                  <View style={styles.stars}>
                    {renderStars(booking.rating)}
                  </View>
                  <Text style={styles.ratingText}>({booking.rating}/5)</Text>
                </View>
                {booking.review && (
                  <Text style={styles.reviewText}>"{booking.review}"</Text>
                )}
              </View>
            )}
          </View>
        ))}

        {bookings.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No past bookings found</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
  },
  header: {
    backgroundColor: '#FEFA17',
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  bookingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    position: 'relative',
  },
  statusBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  bookingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    marginRight: 80,
  },
  locationText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginLeft: 8,
    flex: 1,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
  },
  clockIcon: {
    marginLeft: 16,
  },
  clientInfo: {
    marginLeft: 8,
    flex: 1,
  },
  clientName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  clientPhone: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  groupSize: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
  chargesText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#10B981',
    marginLeft: 8,
  },
  paymentMethod: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 8,
  },
  specialRequests: {
    marginTop: 8,
    padding: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
  },
  specialRequestsLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  specialRequestsText: {
    fontSize: 14,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  ratingContainer: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  stars: {
    flexDirection: 'row',
  },
  ratingText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
  },
  reviewText: {
    fontSize: 14,
    color: '#374151',
    fontStyle: 'italic',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
});

export default PastBookings;