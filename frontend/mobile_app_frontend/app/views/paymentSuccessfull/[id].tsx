// app/payment-success.tsx
import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Alert, 
  ScrollView,
  Animated,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

export default function PaymentSuccess() {
  const params = useLocalSearchParams();
  const router = useRouter();
  
  const {
    orderId,
    paymentId,
    amount,
    currency = 'LKR',
    bookingId
  } = params;

  // State
  const [isLoading, setIsLoading] = useState(true);
  const [paymentDetails, setPaymentDetails] = useState<any>(null);
  
  // Animation values
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
  const [scaleAnim] = useState(new Animated.Value(0.8));

  // ✅ Handle direct deep link from PayHere
  useFocusEffect(
    React.useCallback(() => {
      handleDeepLinkPayment();
    }, [orderId, paymentId, amount, bookingId])
  );

  const handleDeepLinkPayment = async () => {
    try {
      setIsLoading(true);
      
      // Log the direct deep link parameters
      console.log('🔗 Direct PayHere Deep Link Received:');
      console.log('Order ID:', orderId);
      console.log('Payment ID:', paymentId);
      console.log('Amount:', amount);
      console.log('Currency:', currency);
      console.log('Booking ID:', bookingId);

      // Create payment details object
      const details = {
        orderId: orderId as string,
        paymentId: paymentId as string || 'Processing...',
        amount: amount as string,
        currency: currency as string,
        bookingId: bookingId as string,
        timestamp: new Date().toISOString(),
        status: 'SUCCESS',
        source: 'PAYHERE_DIRECT'
      };

      setPaymentDetails(details);

      // Save to local storage for reference
      await AsyncStorage.setItem('lastPaymentSuccess', JSON.stringify(details));

      // Start animations
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();

      // Show success alert
      setTimeout(() => {
        Alert.alert(
          "🎉 Payment Successful!",
          `Your booking has been confirmed!\n\nOrder ID: ${orderId}\nAmount: ${amount} ${currency}`,
          [{ text: "Awesome!" }]
        );
      }, 1000);

      setIsLoading(false);

    } catch (error) {
      console.error('❌ Error handling deep link payment:', error);
      setIsLoading(false);
      
      Alert.alert(
        "Payment Received",
        "We received your payment. Please check your booking status.",
        [
          { text: "OK", onPress: () => router.replace('/') }
        ]
      );
    }
  };

  const handleViewBooking = () => {
    router.replace(`../../(tabs)/bookings`);
  };

  const handleGoHome = () => {
    router.replace('/');
  };

  const handleContactSupport = () => {
    Alert.alert(
      "Contact Support",
      "Need help? Contact us at:\n\n📧 support@travelsri.com\n📞 +94 11 123 4567",
      [{ text: "OK" }]
    );
  };

  const sharePaymentDetails = () => {
    const message = `✅ Payment Successful!\n\nBooking ID: ${bookingId}\nOrder ID: ${orderId}\nAmount: ${amount} ${currency}\n\nThank you for choosing TravelSri! 🇱🇰`;
    
    Alert.alert(
      "Share Payment Details",
      message,
      [
        { text: "Copy", onPress: () => {
          // In a real app, you'd use Clipboard API
          Alert.alert("Copied!", "Payment details copied to clipboard");
        }},
        { text: "Close" }
      ]
    );
  };

  if (isLoading) {
    return (
      <LinearGradient
        colors={['#10b981', '#059669', '#047857']}
        style={styles.container}
      >
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="white" />
          <Text style={styles.loadingText}>Processing Payment Success...</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={['#10b981', '#059669', '#047857']}
      style={styles.container}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View 
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [
                { translateY: slideAnim },
                { scale: scaleAnim }
              ]
            }
          ]}
        >
          {/* Success Icon with Animation */}
          <View style={styles.iconContainer}>
            <View style={styles.iconCircle}>
              <MaterialIcons name="check-circle" size={80} color="#10b981" />
            </View>
            <View style={styles.iconGlow} />
          </View>

          {/* Success Message */}
          <Text style={styles.title}>Payment Successful! 🎉</Text>
          <Text style={styles.subtitle}>
            Your payment has been processed successfully through PayHere in LKR. Your booking is now confirmed!
          </Text>

          {/* Direct Link Info Badge */}
          <View style={styles.directLinkBadge}>
            <Ionicons name="link" size={16} color="#10b981" />
            <Text style={styles.directLinkText}>Direct from PayHere</Text>
          </View>

          {/* Payment Details Card */}
          <View style={styles.detailsCard}>
            <View style={styles.cardHeader}>
              <Ionicons name="receipt-outline" size={24} color="#10b981" />
              <Text style={styles.cardTitle}>Payment Details</Text>
            </View>
            
            <View style={styles.detailsList}>
              <DetailRow 
                icon="bookmark-outline" 
                label="Booking ID" 
                value={bookingId as string} 
              />
              
              <DetailRow 
                icon="receipt-outline" 
                label="Order ID" 
                value={orderId as string} 
              />
              
              {paymentId && paymentId !== 'undefined' && (
                <DetailRow 
                  icon="card-outline" 
                  label="Payment ID" 
                  value={paymentId as string} 
                />
              )}
              
              <DetailRow 
                icon="cash-outline" 
                label="Amount Paid" 
                value={`${amount} ${currency}`}
                highlight
              />
              
              <DetailRow 
                icon="location-outline" 
                label="Currency" 
                value="Sri Lankan Rupees (LKR)" 
              />

              <DetailRow 
                icon="time-outline" 
                label="Processed" 
                value={new Date().toLocaleString()} 
              />
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.primaryButton} 
              onPress={handleViewBooking}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#ffffff', '#f8fafc']}
                style={styles.buttonGradient}
              >
                <Ionicons name="eye-outline" size={20} color="#10b981" />
                <Text style={styles.primaryButtonText}>View Booking Details</Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <View style={styles.secondaryButtonsRow}>
              <TouchableOpacity 
                style={[styles.secondaryButton, styles.halfButton]} 
                onPress={sharePaymentDetails}
                activeOpacity={0.8}
              >
                <Ionicons name="share-outline" size={18} color="white" />
                <Text style={styles.secondaryButtonText}>Share</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.secondaryButton, styles.halfButton]} 
                onPress={handleGoHome}
                activeOpacity={0.8}
              >
                <Ionicons name="home-outline" size={18} color="white" />
                <Text style={styles.secondaryButtonText}>Home</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Info Section */}
          <View style={styles.infoContainer}>
            <View style={styles.infoItem}>
              <Ionicons name="shield-checkmark" size={16} color="rgba(255,255,255,0.8)" />
              <Text style={styles.infoText}>
                Payment processed securely through PayHere gateway
              </Text>
            </View>
            
            <View style={styles.infoItem}>
              <Ionicons name="mail-outline" size={16} color="rgba(255,255,255,0.8)" />
              <Text style={styles.infoText}>
                Confirmation email will be sent to your registered email
              </Text>
            </View>
            
            <View style={styles.infoItem}>
              <Ionicons name="phone-portrait-outline" size={16} color="rgba(255,255,255,0.8)" />
              <Text style={styles.infoText}>
                View booking status anytime in "My Bookings"
              </Text>
            </View>
          </View>

          {/* Support Button */}
          <TouchableOpacity 
            style={styles.supportButton} 
            onPress={handleContactSupport}
            activeOpacity={0.7}
          >
            <Ionicons name="help-circle-outline" size={18} color="rgba(255,255,255,0.8)" />
            <Text style={styles.supportButtonText}>Need Help? Contact Support</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </LinearGradient>
  );
}

// Detail Row Component
const DetailRow = ({ icon, label, value, highlight = false }: {
  icon: any;
  label: string;
  value: string;
  highlight?: boolean;
}) => (
  <View style={styles.detailRow}>
    <View style={styles.detailLeft}>
      <Ionicons name={icon} size={16} color="#6b7280" />
      <Text style={styles.detailLabel}>{label}:</Text>
    </View>
    <Text style={[
      styles.detailValue, 
      highlight && styles.detailValueHighlight
    ]}>
      {value}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: 'white',
    fontSize: 16,
    marginTop: 16,
    fontWeight: '500',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  content: {
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 32,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
  },
  iconGlow: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255,255,255,0.2)',
    zIndex: -1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 12,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  directLinkBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 24,
    gap: 6,
  },
  directLinkText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  detailsCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    width: width - 40,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginLeft: 8,
  },
  detailsList: {
    gap: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  detailLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
    marginLeft: 8,
  },
  detailValue: {
    fontSize: 14,
    color: '#1f2937',
    fontWeight: '600',
    textAlign: 'right',
    flex: 1,
  },
  detailValueHighlight: {
    color: '#10b981',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonContainer: {
    width: width - 40,
    gap: 12,
  },
  primaryButton: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    gap: 8,
  },
  primaryButtonText: {
    color: '#10b981',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButtonsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  secondaryButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  halfButton: {
    flex: 1,
  },
  secondaryButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  infoContainer: {
    marginTop: 32,
    paddingHorizontal: 20,
    gap: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 18,
    flex: 1,
  },
  supportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 24,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  supportButtonText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    fontWeight: '500',
  },
});