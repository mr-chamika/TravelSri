// Updated Guide Detail Page with Fixed PayHere Integration
import React, { useState, useEffect } from 'react';
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

import { useRouter, useLocalSearchParams } from 'expo-router';
import BookingService from '../../../../services/BookingService';

// Your existing interfaces remain the same...
interface BookingDetails {
  dates: string[];
  destination: string;
  type: string;
  language: string;
}

interface ApiGuide {
  _id: string;
  firstName: string;
  lastName: string;
  description: string;
  location: string;
  experience: number;
  stars: number;
  reviewCount: number;
  dailyRate: number;
  currency: string;
  pp: string;
  verified: string;
  identified: string;
  specialization: string;
  responseTime: string;
  ResponseRate: number;
  bio: string;
  mobileNumber: string;
  languages: string[];
  guideType: string;
}

const GuideProfileDetails: React.FC = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // Color theme
  const colors = {
    primary: '#fde047',
    primaryDark: '#facc15',
    primaryLight: '#fefce8',
    primaryText: '#a16207',
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
    lightBlue: '#eff6ff',
  };

  // State management
  const [isFavorite, setIsFavorite] = useState(false);
  const [guide, setGuide] = useState<any>(null);
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [numberOfDays, setNumberOfDays] = useState<number>(0);
  const [totalCost, setTotalCost] = useState<number>(0);
  
  // Booking states
  const [isBooking, setIsBooking] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

// Extract navigation parameters
useEffect(() => {
  try {
    console.log('Received params:', params);

    const bookingDetailsParam = params.bookingDetails as string;
    const selectedDatesParam = params.selectedDates as string;
    const guideDataParam = params.guideData as string;
    const idParam = params.id as string;
    const numberOfDaysParam = params.numberOfDays as string;
    const totalCostParam = params.totalCost as string;

    if (bookingDetailsParam) {
      const bookingData = JSON.parse(bookingDetailsParam);
      setBookingDetails(bookingData);
    }

    if (selectedDatesParam) {
      const dates = JSON.parse(selectedDatesParam);
      setSelectedDates(dates);
    }

    if (guideDataParam) {
      const apiGuide: ApiGuide = JSON.parse(guideDataParam);
      
      const specializationsArray = apiGuide.specialization 
        ? apiGuide.specialization.split(',').map(s => s.trim()).filter(s => s.length > 0)
        : ["General Guiding"];
      
      const convertedGuide = {
        id: parseInt(idParam) || 1,
        _id: apiGuide._id,
        name: `${apiGuide.firstName} ${apiGuide.lastName}`,
        title: apiGuide.specialization || "Professional Guide",
        location: apiGuide.location,
        experience: `${apiGuide.experience} years`,
        rating: apiGuide.stars,
        reviewCount: apiGuide.reviewCount,
        hourlyRate: Math.round(apiGuide.dailyRate / 8),
        dailyRate: apiGuide.dailyRate,
        currency: apiGuide.currency || "USD",
        image: apiGuide.pp || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
        verified: apiGuide.verified === 'done',
        languages: apiGuide.languages || ['English'],
        specializations: specializationsArray,
        expertise: specializationsArray,
        responseTime: apiGuide.responseTime || "Within 1 hour",
        responseRate: `${apiGuide.ResponseRate || 95}%`,
        description: apiGuide.description || apiGuide.bio || "Experienced local guide",
        joinedDate: "Member since 2020",
        education: ["Professional Tourism Training"],
        certifications: ["Licensed Tourist Guide"],
        awards: [],
        gallery: [],
        availability: "Available 7 days a week",
        aboutMe: apiGuide.bio || apiGuide.description || "Passionate local guide ready to show you the best experiences.",
        whyChooseMe: [
          "Extensive local knowledge",
          "Professional and reliable",
          "Great communication skills",
          "Flexible tour options"
        ],
        tourStyles: [apiGuide.guideType === 'visit' ? "Day Tours" : "Multi-day Tours"]
      };

      setGuide(convertedGuide);
    }

    if (numberOfDaysParam) {
      setNumberOfDays(parseInt(numberOfDaysParam));
    }
    if (totalCostParam) {
      setTotalCost(parseFloat(totalCostParam));
    }

  } catch (error) {
    console.error('Error parsing navigation params:', error);
  }
}, [
  params.bookingDetails,
  params.selectedDates, 
  params.guideData,
  params.id,
  params.numberOfDays,
  params.totalCost
]); 

// Depend on specific param values, not the entire params object
  // Fixed Booking function with proper PayHere integration
  const handleBookNow = async () => {
  console.log('=== BOOKING DEBUG START ===');
  console.log('bookingDetails:', bookingDetails);
  console.log('guide:', guide);
  console.log('selectedDates:', selectedDates);
  console.log('numberOfDays:', numberOfDays);
  console.log('totalCost:', totalCost);

  if (!bookingDetails || !guide || selectedDates.length === 0) {
    console.log('❌ Missing required data');
    Alert.alert('Error', 'Missing booking information. Please go back and select your dates.');
    return;
  }

  console.log('✅ All required data present, starting booking...');
  setIsBooking(true);
  setBookingError(null);

  try {
    // Prepare booking data
    const startDate = new Date(Math.min(...selectedDates.map(date => new Date(date).getTime())));
    const endDate = new Date(Math.max(...selectedDates.map(date => new Date(date).getTime())));
    
    startDate.setHours(9, 0, 0, 0); // 9 AM start
    endDate.setHours(18, 0, 0, 0);  // 6 PM end

    const bookingRequest = {
      travelerId: "user123", // Replace with actual user ID from auth
      providerId: guide._id,
      providerType: "guide" as const,
      serviceName: `${guide.name} - ${bookingDetails.type === 'visit' ? 'Local Guide' : 'Travel Guide'} Service`,
      serviceDescription: `${numberOfDays} day${numberOfDays > 1 ? 's' : ''} guide service in ${bookingDetails.destination}. Language: ${bookingDetails.language}. Specializations: ${guide.specializations.join(', ')}.`,
      serviceStartDate: startDate.toISOString(),
      serviceEndDate: endDate.toISOString(),
      totalAmount: totalCost || (guide.dailyRate * numberOfDays),
    };

    console.log('📋 Booking request prepared:', JSON.stringify(bookingRequest, null, 2));

    // Step 1: Create booking
    console.log('🔄 Step 1: Creating booking...');
    const booking = await BookingService.createBooking(bookingRequest);
    console.log('✅ Step 1: Booking created successfully:', booking);

    // Step 2: Create payment checkout
    console.log('🔄 Step 2: Creating payment checkout...');
    const paymentResponse = await BookingService.createPaymentCheckout(booking.id);
    console.log('✅ Step 2: Payment response received:', paymentResponse);

    // Check if we have proper PayHere payment data
    if (paymentResponse.success && paymentResponse.paymentData) {
      console.log('✅ Step 3: Payment data valid, navigating to checkout...');
      // Navigate to PayHere checkout page with payment data
      router.push({
        pathname: './../../../views/PayHereCheckout/[id]',
        params: {
          paymentData: JSON.stringify(paymentResponse.paymentData),
          bookingId: booking.id,
          orderId: paymentResponse.orderId
        }
      });
    } else {
      console.log('❌ Step 3: Invalid payment response');
      throw new Error('Invalid payment response from server');
    }

  } catch (error) {
    console.error('❌ BOOKING ERROR:', error);
    if (error instanceof Error) {
      console.error('Error stack:', error.stack);
    }
    
    setBookingError(error instanceof Error ? error.message : 'Failed to create booking');
    Alert.alert(
      'Booking Failed', 
      error instanceof Error ? error.message : 'An error occurred while creating your booking. Please try again.',
      [{ text: 'OK' }]
    );
  } finally {
    console.log('🏁 Booking process finished, setting isBooking to false');
    setIsBooking(false);
  }
  console.log('=== BOOKING DEBUG END ===');
};

  // Your existing helper functions
  const formatPrice = (price: number) => {
    return price.toLocaleString();
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating / 2);
    
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Text key={i} style={{ fontSize: 14, color: i < fullStars ? colors.rating : colors.textMuted }}>
          ★
        </Text>
      );
    }
    return stars;
  };

  if (!guide) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading guide details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={colors.blue} barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Guide Profile</Text>
          {bookingDetails && (
            <Text style={styles.headerSubtitle}>
              {numberOfDays} day{numberOfDays > 1 ? 's' : ''} • {bookingDetails.destination}
            </Text>
          )}
        </View>
        <TouchableOpacity style={styles.shareButton}>
          <Text style={styles.shareIcon}>📤</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Compact Booking Summary */}
        {bookingDetails && (
          <View style={styles.compactBookingSummary}>
            <View style={styles.bookingRow}>
              <View style={styles.bookingItem}>
                <Text style={styles.bookingIcon}>📍</Text>
                <Text style={styles.bookingText}>{bookingDetails.destination}</Text>
              </View>
              <View style={styles.bookingItem}>
                <Text style={styles.bookingIcon}>📅</Text>
                <Text style={styles.bookingText}>{selectedDates.length} day{selectedDates.length > 1 ? 's' : ''}</Text>
              </View>
            </View>
            <View style={styles.bookingRow}>
              <View style={styles.bookingItem}>
                <Text style={styles.bookingIcon}>🗣️</Text>
                <Text style={styles.bookingText}>{bookingDetails.language}</Text>
              </View>
              <View style={styles.bookingItem}>
                <Text style={styles.bookingIcon}>🎯</Text>
                <Text style={styles.bookingText}>{bookingDetails.type === 'visit' ? 'Local Guide' : 'Travel Guide'}</Text>
              </View>
            </View>
            {totalCost > 0 && (
              <View style={styles.totalChargeContainer}>
                <Text style={styles.totalChargeLabel}>Total Charge</Text>
                <Text style={styles.totalChargeAmount}>${totalCost}</Text>
              </View>
            )}
          </View>
        )}

        {/* Guide Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.guideImageContainer}>
            <Image source={{ uri: guide.image }} style={styles.guideImage} />
          </View>

          <View style={styles.guideMainInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.guideName}>{guide.name}</Text>
              <TouchableOpacity 
                style={styles.favoriteButton}
                onPress={() => setIsFavorite(!isFavorite)}
              >
                <Text style={styles.heartIcon}>
                  {isFavorite ? '♥️' : '♡'}
                </Text>
              </TouchableOpacity>
            </View>
            
            <Text style={styles.guideTitle}>{guide.title}</Text>
            
            <View style={styles.locationExperience}>
              <View style={styles.infoItem}>
                <Text style={styles.infoIcon}>📍</Text>
                <Text style={styles.infoText}>{guide.location}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoIcon}>🎖️</Text>
                <Text style={styles.infoText}>{guide.experience} experience</Text>
              </View>
            </View>

            <View style={styles.ratingRow}>
              <View style={styles.ratingContainer}>
                <View style={styles.ratingScore}>
                  <Text style={styles.ratingNumber}>{guide.rating}</Text>
                </View>
                <View style={styles.starsContainer}>
                  {renderStars(guide.rating)}
                </View>
                <Text style={styles.reviewCount}>({guide.reviewCount} reviews)</Text>
              </View>
            </View>

            <View style={styles.responseRow}>
              <Text style={styles.responseTime}>{guide.responseTime}</Text>
              <Text style={styles.responseRate}>{guide.responseRate} response rate</Text>
            </View>

            <Text style={styles.joinedDate}>{guide.joinedDate}</Text>
          </View>
        </View>

        {/* Languages */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Languages</Text>
          <View style={styles.tagsContainer}>
            {guide.languages.map((language: string, index: number) => (
              <View key={index} style={styles.languageTag}>
                <Text style={styles.languageText}>{language}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Specializations */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Specializations</Text>
          <View style={styles.tagsContainer}>
            {guide.specializations.map((spec: string, index: number) => (
              <View key={index} style={styles.specializationTag}>
                <Text style={styles.specializationText}>{spec}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* About Me */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>About Me</Text>
          <Text style={styles.aboutText}>{guide.aboutMe}</Text>
        </View>

        {/* Why Choose Me */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Why Choose Me</Text>
          <View style={styles.whyChooseList}>
            {guide.whyChooseMe.map((reason: string, index: number) => (
              <View key={index} style={styles.whyChooseItem}>
                <Text style={styles.checkIcon}>✓</Text>
                <Text style={styles.whyChooseText}>{reason}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Pricing */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Pricing</Text>
          <View style={styles.pricingContainer}>
            <View style={styles.priceItem}>
              <Text style={styles.priceIcon}>📅</Text>
              <View style={styles.priceInfo}>
                <Text style={styles.priceLabel}>Daily Rate</Text>
                <Text style={styles.priceAmount}>
                  {guide.currency} {formatPrice(guide.dailyRate)}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.availabilityInfo}>
            <Text style={styles.availabilityIcon}>ℹ️</Text>
            <Text style={styles.availabilityText}>{guide.availability}</Text>
          </View>
        </View>

        {/* Error Display */}
        {bookingError && (
          <View style={styles.card}>
            <View style={styles.errorContainer}>
              <Text style={styles.errorIcon}>⚠️</Text>
              <Text style={styles.errorText}>{bookingError}</Text>
            </View>
          </View>
        )}
        
        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Fixed Bottom Action Bar */}
      <View style={styles.bottomActionBar}>
        <View style={styles.chargesDisplay}>
          <Text style={styles.chargesLabel}>Total Charges</Text>
          <Text style={styles.chargesAmount}>
            ${totalCost > 0 ? totalCost : guide.dailyRate}
          </Text>
          <Text style={styles.chargesDuration}>
            {numberOfDays > 0 ? `for ${numberOfDays} day${numberOfDays > 1 ? 's' : ''}` : 'per day'}
          </Text>
        </View>
        <View style={styles.bookButtonContainer}>
          <TouchableOpacity 
            style={[styles.bookButton, isBooking && styles.bookButtonDisabled]} 
            onPress={handleBookNow}
            disabled={isBooking}
          >
            <Text style={styles.bookButtonText}>
              {isBooking ? 'Processing...' : 'Book Now'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

// Add all your existing styles here
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
  },
  header: {
    backgroundColor: '#fde047',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: Platform.OS === 'ios' ? 12 : 20,
  },
  backButton: {
    padding: 8,
  },
  backIcon: {
    fontSize: 24,
    color: '#000',
  },
  headerContent: {
    flex: 1,
    marginLeft: 8,
  },
  headerTitle: {
    color: '#000000ff',
    fontSize: 18,
    fontWeight: '600',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  shareButton: {
    padding: 8,
  },
  shareIcon: {
    fontSize: 24,
  },
  content: {
    flex: 1,
  },
  compactBookingSummary: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#fde047',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  bookingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  bookingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  bookingIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  bookingText: {
    fontSize: 14,
    color: '#4b5563',
    fontWeight: '500',
  },
  totalChargeContainer: {
    backgroundColor: '#fef3c7',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalChargeLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400e',
  },
  totalChargeAmount: {
    fontSize: 20,
    fontWeight: '700',
    color: '#92400e',
  },
  heroSection: {
    backgroundColor: '#ffffff',
    padding: 20,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  guideImageContainer: {
    position: 'relative',
    marginRight: 16,
  },
  guideImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    resizeMode: 'cover',
  },
  guideMainInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  guideName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1f2937',
    flex: 1,
  },
  favoriteButton: {
    padding: 4,
  },
  heartIcon: {
    fontSize: 24,
    color: '#dc2626',
  },
  guideTitle: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 12,
  },
  locationExperience: {
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  infoIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  infoText: {
    fontSize: 14,
    color: '#4b5563',
  },
  ratingRow: {
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ratingScore: {
    backgroundColor: '#fde047',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  ratingNumber: {
    color: '#1f2937',
    fontSize: 14,
    fontWeight: '600',
  },
  starsContainer: {
    flexDirection: 'row',
  },
  reviewCount: {
    fontSize: 14,
    color: '#6b7280',
  },
  responseRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 8,
  },
  responseTime: {
    fontSize: 12,
    color: '#10b981',
    fontWeight: '500',
  },
  responseRate: {
    fontSize: 12,
    color: '#6b7280',
  },
  joinedDate: {
    fontSize: 12,
    color: '#9ca3af',
  },
  card: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  languageTag: {
    backgroundColor: '#eff6ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#dbeafe',
  },
  languageText: {
    fontSize: 13,
    color: '#2563eb',
    fontWeight: '500',
  },
  specializationTag: {
    backgroundColor: '#fefce8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#fde047',
  },
  specializationText: {
    fontSize: 13,
    color: '#a16207',
    fontWeight: '500',
  },
  aboutText: {
    fontSize: 15,
    color: '#4b5563',
    lineHeight: 22,
  },
  whyChooseList: {
    gap: 12,
  },
  whyChooseItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  checkIcon: {
    fontSize: 14,
    color: '#10b981',
  },
  whyChooseText: {
    fontSize: 14,
    color: '#4b5563',
    flex: 1,
    lineHeight: 20,
  },
  pricingContainer: {
    marginBottom: 16,
  },
  priceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  priceIcon: {
    fontSize: 20,
    marginRight: 16,
  },
  priceInfo: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  priceAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#dc2626',
  },
  availabilityInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f0fdf4',
    borderRadius: 8,
  },
  availabilityIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  availabilityText: {
    fontSize: 14,
    color: '#059669',
    fontWeight: '500',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fef2f2',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  errorIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  errorText: {
    fontSize: 14,
    color: '#dc2626',
    flex: 1,
  },
  bottomPadding: {
    height: 100,
  },
  bottomActionBar: {
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
  chargesDisplay: {
    flex: 1,
  },
  chargesLabel: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  chargesAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: '#dc2626',
    marginVertical: 2,
  },
  chargesDuration: {
    fontSize: 12,
    color: '#9ca3af',
  },
  bookButtonContainer: {
    alignItems: 'flex-end',
  },
  bookButton: {
    backgroundColor: '#fde047',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  bookButtonDisabled: {
    backgroundColor: '#d1d5db',
    opacity: 0.7,
  },
  bookButtonText: {
    fontSize: 16,
    color: '#1f2937',
    fontWeight: '700',
    textAlign: 'center',
  },
});

export default GuideProfileDetails;