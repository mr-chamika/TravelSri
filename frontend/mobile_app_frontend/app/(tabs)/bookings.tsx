import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
  Alert,
} from 'react-native';

import { useRouter } from 'expo-router';

// Simple icon component using emojis
const Icon: React.FC<{ name: string; size: number; color: string }> = ({ name, size, color }) => {
  const iconMap: Record<string, string> = {
    'arrow-left': '←',
    'help': '❓',
    'plus': '+',
    'hotel': '🏨',
    'guide': '🧭',
    'vehicle': '🚗',
    'group': '👥',
    'calendar': '📅',
    'clock': '⏰',
    'location': '📍',
    'phone': '📞',
    'message': '💬',
    'star': '★',
    'check': '✓',
    'cancel': '✕',
    'warning': '⚠️',
    'info': 'ℹ️',
    'map': '🗺️',
    'users': '👥',
    'time': '⏰',
    'money': '💰',
    'receipt': '🧾',
    'edit': '✏️',
    'share': '📤',
    'download': '📥',
    'support': '🎧',
  };
  
  return (
    <Text style={{ fontSize: size, color }}>
      {iconMap[name] || '•'}
    </Text>
  );
};

interface Booking {
  id: string;
  type: 'hotel' | 'guide' | 'vehicle' | 'group_tour';
  status: 'active' | 'past' | 'cancelled';
  title: string;
  subtitle: string;
  location: string;
  image: string;
  dates: {
    start: string;
    end: string;
    checkin?: string;
    checkout?: string;
  };
  price: {
    total: number;
    currency: string;
    breakdown?: string;
  };
  bookingReference: string;
  provider: {
    name: string;
    contact: string;
    rating?: number;
    verified: boolean;
  };
  details: {
    guests?: number;
    rooms?: number;
    duration?: string;
    groupSize?: number;
    vehicle?: string;
    guide?: string;
    inclusions?: string[];
  };
  statusInfo: {
    message: string;
    color: string;
    canModify: boolean;
    canCancel: boolean;
  };
  timeline?: {
    booked: string;
    confirmed?: string;
    checkedIn?: string;
    completed?: string;
    cancelled?: string;
  };
}

const BookingsScreen: React.FC = () => {
  const router = useRouter();
  
  // Color theme - Yellow
  const colors = {
    primary: '#fde047',        // yellow-300
    primaryDark: '#facc15',    // yellow-400
    primaryLight: '#fefce8',   // yellow-50
    primaryText: '#a16207',    // yellow-700
    background: '#f5f5f5',
    cardBg: '#ffffff',
    textPrimary: '#1f2937',
    textSecondary: '#4b5563',
    textMuted: '#9ca3af',
    border: '#e5e7eb',
    success: '#10b981',
    rating: '#fbbf24',
    price: '#dc2626',
    blue: '#2563eb',
    green: '#059669',
    orange: '#f97316',
    red: '#ef4444',
  };

  const [activeFilter, setActiveFilter] = useState<'active' | 'past' | 'cancelled'>('active');

  const filterOptions = [
    { id: 'active', label: 'Active', count: 5 },
    { id: 'past', label: 'Past', count: 12 },
    { id: 'cancelled', label: 'Cancelled', count: 2 },
  ];

  const bookings: Booking[] = [
    {
      id: 'booking1',
      type: 'hotel',
      status: 'active',
      title: 'Heritage Hotel Kandy',
      subtitle: 'Deluxe Room with Garden View',
      location: 'Kandy, Central Province',
      image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=250&fit=crop',
      dates: {
        start: '2025-08-15',
        end: '2025-08-18',
        checkin: '15:00',
        checkout: '11:00'
      },
      price: {
        total: 45000,
        currency: 'LKR',
        breakdown: 'LKR 15,000 × 3 nights'
      },
      bookingReference: 'HTL-KDY-001',
      provider: {
        name: 'Heritage Hotel Kandy',
        contact: '+94 81 234 5678',
        rating: 4.8,
        verified: true
      },
      details: {
        guests: 2,
        rooms: 1,
        inclusions: ['Breakfast', 'WiFi', 'Pool Access', 'Parking']
      },
      statusInfo: {
        message: 'Confirmed - Check-in in 3 days',
        color: colors.success,
        canModify: true,
        canCancel: true
      },
      timeline: {
        booked: '2025-07-20',
        confirmed: '2025-07-21'
      }
    },
    {
      id: 'booking2',
      type: 'group_tour',
      status: 'active',
      title: 'Sri Lanka Cultural Heritage Tour',
      subtitle: '7-Day Group Adventure',
      location: 'Kandy, Sigiriya, Anuradhapura',
      image: 'https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=400&h=250&fit=crop',
      dates: {
        start: '2025-08-15',
        end: '2025-08-22'
      },
      price: {
        total: 84000,
        currency: 'LKR',
        breakdown: 'LKR 21,000 × 4 people'
      },
      bookingReference: 'GRP-CHT-007',
      provider: {
        name: 'Lanka Adventures',
        contact: '+94 77 987 6543',
        rating: 4.9,
        verified: true
      },
      details: {
        groupSize: 12,
        duration: '7 days, 6 nights',
        guide: 'Ranjan Silva - Cultural Expert',
        inclusions: ['Accommodation', 'Transport', 'Guide', 'Entrance Fees', 'Some Meals']
      },
      statusInfo: {
        message: 'Confirmed - Tour starts in 3 days',
        color: colors.success,
        canModify: false,
        canCancel: true
      },
      timeline: {
        booked: '2025-06-15',
        confirmed: '2025-06-16'
      }
    },
    {
      id: 'booking3',
      type: 'vehicle',
      status: 'active',
      title: 'Toyota Hiace Van Rental',
      subtitle: 'Air-conditioned with Driver',
      location: 'Colombo Airport Pickup',
      image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&h=250&fit=crop',
      dates: {
        start: '2025-08-15',
        end: '2025-08-18'
      },
      price: {
        total: 36000,
        currency: 'LKR',
        breakdown: 'LKR 12,000 × 3 days'
      },
      bookingReference: 'VHC-HIC-023',
      provider: {
        name: 'Colombo Car Rentals',
        contact: '+94 11 234 5678',
        rating: 4.6,
        verified: true
      },
      details: {
        vehicle: 'Toyota Hiace (8 seats)',
        duration: '3 days',
        inclusions: ['Driver', 'Fuel', 'Insurance', 'Highway Tolls']
      },
      statusInfo: {
        message: 'Confirmed - Pickup in 3 days',
        color: colors.success,
        canModify: true,
        canCancel: true
      },
      timeline: {
        booked: '2025-07-25',
        confirmed: '2025-07-25'
      }
    },
    {
      id: 'booking4',
      type: 'guide',
      status: 'active',
      title: 'Ranjan Silva - Cultural Guide',
      subtitle: 'Private Cultural Sites Tour',
      location: 'Kandy & Central Province',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop',
      dates: {
        start: '2025-08-16',
        end: '2025-08-16'
      },
      price: {
        total: 8000,
        currency: 'LKR',
        breakdown: 'Full day tour'
      },
      bookingReference: 'GDE-RS-045',
      provider: {
        name: 'Ranjan Silva',
        contact: '+94 77 345 6789',
        rating: 4.9,
        verified: true
      },
      details: {
        duration: 'Full day (8 hours)',
        inclusions: ['English Speaking Guide', 'Cultural Site Expertise', 'Local Recommendations']
      },
      statusInfo: {
        message: 'Confirmed - Tour in 4 days',
        color: colors.success,
        canModify: true,
        canCancel: true
      },
      timeline: {
        booked: '2025-07-22',
        confirmed: '2025-07-22'
      }
    },
    {
      id: 'booking5',
      type: 'hotel',
      status: 'past',
      title: 'Beach Resort Mirissa',
      subtitle: 'Ocean View Suite',
      location: 'Mirissa, Southern Province',
      image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=250&fit=crop',
      dates: {
        start: '2025-07-01',
        end: '2025-07-05',
        checkin: '15:00',
        checkout: '11:00'
      },
      price: {
        total: 80000,
        currency: 'LKR',
        breakdown: 'LKR 20,000 × 4 nights'
      },
      bookingReference: 'HTL-MRS-089',
      provider: {
        name: 'Mirissa Beach Resort',
        contact: '+94 41 234 5678',
        rating: 4.7,
        verified: true
      },
      details: {
        guests: 2,
        rooms: 1,
        inclusions: ['All Meals', 'Beach Access', 'Water Sports', 'Spa Credits']
      },
      statusInfo: {
        message: 'Completed - Thanks for staying with us!',
        color: colors.textMuted,
        canModify: false,
        canCancel: false
      },
      timeline: {
        booked: '2025-06-01',
        confirmed: '2025-06-02',
        checkedIn: '2025-07-01',
        completed: '2025-07-05'
      }
    },
    {
      id: 'booking6',
      type: 'vehicle',
      status: 'cancelled',
      title: 'Suzuki Alto Car Rental',
      subtitle: 'Economy Car',
      location: 'Galle',
      image: 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=400&h=250&fit=crop',
      dates: {
        start: '2025-07-10',
        end: '2025-07-15'
      },
      price: {
        total: 25000,
        currency: 'LKR',
        breakdown: 'LKR 5,000 × 5 days'
      },
      bookingReference: 'VHC-ALT-156',
      provider: {
        name: 'Galle Car Rentals',
        contact: '+94 91 234 5678',
        rating: 4.3,
        verified: true
      },
      details: {
        vehicle: 'Suzuki Alto (4 seats)',
        duration: '5 days',
        inclusions: ['Insurance', 'Basic Maintenance']
      },
      statusInfo: {
        message: 'Cancelled - Full refund processed',
        color: colors.red,
        canModify: false,
        canCancel: false
      },
      timeline: {
        booked: '2025-06-20',
        confirmed: '2025-06-21',
        cancelled: '2025-07-05'
      }
    }
  ];

  const getFilteredBookings = () => {
    return bookings.filter(booking => booking.status === activeFilter);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'hotel': return 'hotel';
      case 'guide': return 'guide';
      case 'vehicle': return 'vehicle';
      case 'group_tour': return 'group';
      default: return 'info';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'hotel': return 'Hotel';
      case 'guide': return 'Guide';
      case 'vehicle': return 'Vehicle';
      case 'group_tour': return 'Group Tour';
      default: return 'Booking';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleContactProvider = (booking: Booking) => {
    Alert.alert(
      "Contact Provider",
      `Contact ${booking.provider.name}?`,
      [
        { text: "Call", onPress: () => console.log(`Calling ${booking.provider.contact}`) },
        { text: "Message", onPress: () => console.log(`Messaging ${booking.provider.contact}`) },
        { text: "Cancel", style: "cancel" }
      ]
    );
  };

  const handleModifyBooking = (booking: Booking) => {
    Alert.alert("Modify Booking", `Modify your ${getTypeLabel(booking.type).toLowerCase()} booking?`);
  };

  const handleCancelBooking = (booking: Booking) => {
    Alert.alert(
      "Cancel Booking",
      "Are you sure you want to cancel this booking?",
      [
        { text: "No", style: "cancel" },
        { text: "Yes, Cancel", style: "destructive", onPress: () => console.log("Booking cancelled") }
      ]
    );
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Icon 
          key={i} 
          name="star" 
          size={12} 
          color={i < fullStars ? colors.rating : colors.textMuted} 
        />
      );
    }
    return stars;
  };

  const BookingCard: React.FC<{ booking: Booking }> = ({ booking }) => (
    <TouchableOpacity style={styles.bookingCard} activeOpacity={0.7}>
      <View style={styles.cardHeader}>
        <View style={styles.typeSection}>
          <View style={styles.typeIcon}>
            <Icon name={getTypeIcon(booking.type)} size={16} color={colors.blue} />
          </View>
          <Text style={styles.typeLabel}>{getTypeLabel(booking.type)}</Text>
        </View>
        <View style={styles.referenceSection}>
          <Text style={styles.referenceText}>{booking.bookingReference}</Text>
        </View>
      </View>

      <View style={styles.cardContent}>
        <Image source={{ uri: booking.image }} style={styles.bookingImage} />
        
        <View style={styles.bookingInfo}>
          <Text style={styles.bookingTitle}>{booking.title}</Text>
          <Text style={styles.bookingSubtitle}>{booking.subtitle}</Text>
          
          <View style={styles.locationRow}>
            <Icon name="location" size={12} color={colors.textMuted} />
            <Text style={styles.locationText}>{booking.location}</Text>
          </View>

          <View style={styles.dateRow}>
            <Icon name="calendar" size={12} color={colors.textMuted} />
            <Text style={styles.dateText}>
              {formatDate(booking.dates.start)}
              {booking.dates.end !== booking.dates.start && ` - ${formatDate(booking.dates.end)}`}
            </Text>
          </View>

          {booking.provider.rating && (
            <View style={styles.ratingRow}>
              <View style={styles.starsContainer}>
                {renderStars(booking.provider.rating)}
              </View>
              <Text style={styles.ratingText}>{booking.provider.rating}</Text>
              {booking.provider.verified && (
                <View style={styles.verifiedBadge}>
                  <Icon name="check" size={10} color={colors.success} />
                  <Text style={styles.verifiedText}>Verified</Text>
                </View>
              )}
            </View>
          )}
        </View>
      </View>

      <View style={styles.statusSection}>
        <View style={[styles.statusIndicator, { backgroundColor: booking.statusInfo.color }]} />
        <Text style={[styles.statusMessage, { color: booking.statusInfo.color }]}>
          {booking.statusInfo.message}
        </Text>
      </View>

      <View style={styles.detailsSection}>
        {booking.details.guests && (
          <View style={styles.detailItem}>
            <Icon name="users" size={12} color={colors.textMuted} />
            <Text style={styles.detailText}>{booking.details.guests} guests</Text>
          </View>
        )}
        {booking.details.groupSize && (
          <View style={styles.detailItem}>
            <Icon name="group" size={12} color={colors.textMuted} />
            <Text style={styles.detailText}>{booking.details.groupSize} people</Text>
          </View>
        )}
        {booking.details.duration && (
          <View style={styles.detailItem}>
            <Icon name="time" size={12} color={colors.textMuted} />
            <Text style={styles.detailText}>{booking.details.duration}</Text>
          </View>
        )}
      </View>

      {booking.details.inclusions && (
        <View style={styles.inclusionsSection}>
          <Text style={styles.inclusionsTitle}>Includes:</Text>
          <View style={styles.inclusionsList}>
            {booking.details.inclusions.slice(0, 3).map((inclusion, index) => (
              <View key={index} style={styles.inclusionItem}>
                <Icon name="check" size={10} color={colors.success} />
                <Text style={styles.inclusionText}>{inclusion}</Text>
              </View>
            ))}
            {booking.details.inclusions.length > 3 && (
              <Text style={styles.moreInclusions}>
                +{booking.details.inclusions.length - 3} more
              </Text>
            )}
          </View>
        </View>
      )}

      <View style={styles.priceSection}>
        <View style={styles.priceInfo}>
          <Text style={styles.priceAmount}>
            {booking.price.currency} {booking.price.total.toLocaleString()}
          </Text>
          {booking.price.breakdown && (
            <Text style={styles.priceBreakdown}>{booking.price.breakdown}</Text>
          )}
        </View>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={styles.contactButton}
          onPress={() => handleContactProvider(booking)}
        >
          <Icon name="phone" size={16} color={colors.primaryText} />
          <Text style={styles.contactButtonText}>Contact</Text>
        </TouchableOpacity>
        
        {booking.statusInfo.canModify && (
          <TouchableOpacity 
            style={styles.modifyButton}
            onPress={() => handleModifyBooking(booking)}
          >
            <Icon name="edit" size={16} color={colors.orange} />
            <Text style={styles.modifyButtonText}>Modify</Text>
          </TouchableOpacity>
        )}
        
        {booking.statusInfo.canCancel && (
          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={() => handleCancelBooking(booking)}
          >
            <Icon name="cancel" size={16} color={colors.red} />
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.viewButton}>
          <Text style={styles.viewButtonText}>View Details</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const EmptyState: React.FC = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIcon}>
        <Text style={styles.emptyIconText}>🌍</Text>
      </View>
      <Text style={styles.emptyTitle}>
        {activeFilter === 'active' ? 'No Active Bookings' : 
         activeFilter === 'past' ? 'No Past Bookings' : 'No Cancelled Bookings'}
      </Text>
      <Text style={styles.emptyMessage}>
        {activeFilter === 'active' 
          ? "You haven't made any bookings yet. When you book hotels, guides, vehicles or join group tours, they will appear here."
          : activeFilter === 'past'
          ? "Your completed bookings will appear here after your trips."
          : "Your cancelled bookings will appear here."}
      </Text>
      {activeFilter === 'active' && (
        <TouchableOpacity style={styles.exploreButton}>
          <Text style={styles.exploreButtonText}>Start Exploring</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={colors.primary} barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Icon name="arrow-left" size={24} color={colors.primaryText} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Trips</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.helpButton}>
            <Icon name="help" size={20} color={colors.primaryText} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.addButton}>
            <Icon name="plus" size={20} color={colors.primaryText} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterTabs}>
        {filterOptions.map((filter) => (
          <TouchableOpacity
            key={filter.id}
            style={[
              styles.filterTab,
              activeFilter === filter.id && styles.activeFilterTab
            ]}
            onPress={() => setActiveFilter(filter.id as 'active' | 'past' | 'cancelled')}
          >
            <Text style={[
              styles.filterTabText,
              activeFilter === filter.id && styles.activeFilterTabText
            ]}>
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {getFilteredBookings().length === 0 ? (
          <EmptyState />
        ) : (
          <View style={styles.bookingsList}>
            {getFilteredBookings().map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </View>
        )}
        
        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fde047',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingTop: Platform.OS === 'ios' ? 16 : 24,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    color: '#1f2937',
    fontSize: 20,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
    marginRight: 8,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  helpButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(161, 98, 7, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(161, 98, 7, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Filter Tabs
  filterTabs: {
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  filterTab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 20,
    marginHorizontal: 4,
  },
  activeFilterTab: {
    backgroundColor: '#a16207',
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  activeFilterTabText: {
    color: 'white',
  },
  
  // Content
  content: {
    flex: 1,
  },
  bookingsList: {
    padding: 16,
  },
  
  // Booking Card
  bookingCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f9fafb',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  typeSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  typeIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#fefce8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  typeLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  referenceSection: {},
  referenceText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6b7280',
  },
  cardContent: {
    flexDirection: 'row',
    padding: 16,
  },
  bookingImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  bookingInfo: {
    flex: 1,
  },
  bookingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  bookingSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  locationText: {
    fontSize: 12,
    color: '#6b7280',
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  dateText: {
    fontSize: 12,
    color: '#6b7280',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 1,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1f2937',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#dcfce7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    gap: 2,
  },
  verifiedText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#16a34a',
  },
  statusSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f9fafb',
    gap: 8,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusMessage: {
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
  },
  detailsSection: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 12,
    color: '#6b7280',
  },
  inclusionsSection: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  inclusionsTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 6,
  },
  inclusionsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  inclusionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fefce8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  inclusionText: {
    fontSize: 11,
    color: '#a16207',
    fontWeight: '500',
  },
  moreInclusions: {
    fontSize: 11,
    color: '#6b7280',
    fontStyle: 'italic',
    alignSelf: 'center',
  },
  priceSection: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  priceInfo: {
    alignItems: 'flex-end',
  },
  priceAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#dc2626',
  },
  priceBreakdown: {
    fontSize: 12,
    color: '#6b7280',
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#fefce8',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#a16207',
    gap: 4,
  },
  contactButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#a16207',
  },
  modifyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#fff7ed',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#f97316',
    gap: 4,
  },
  modifyButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#f97316',
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#fef2f2',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ef4444',
    gap: 4,
  },
  cancelButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ef4444',
  },
  viewButton: {
    flex: 1,
    backgroundColor: '#fde047',
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#a16207',
  },
  
  // Empty State
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 64,
  },
  emptyIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#fef3c7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  emptyIconText: {
    fontSize: 48,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyMessage: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  exploreButton: {
    backgroundColor: '#fde047',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  exploreButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#a16207',
  },
  
  // Utility Styles
  bottomPadding: {
    height: 20,
  },
});

export default BookingsScreen;