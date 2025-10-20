// app/payment-cancelled.tsx
import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Alert, 
  ScrollView,
  Animated,
  Dimensions
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function PaymentCancelled() {
  const params = useLocalSearchParams();
  const router = useRouter();
  
  const {
    orderId,
    bookingId,
    reason = 'user_cancelled'
  } = params;

  // Animation values
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));

  useEffect(() => {
    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    console.log('🚫 Payment Cancelled - Deep Link Received:');
    console.log('Order ID:', orderId);
    console.log('Booking ID:', bookingId);
    console.log('Reason:', reason);
  }, []);

  const handleRetryPayment = () => {
    router.replace(`./guide/solo/${bookingId}`);
  };

  const handleGoHome = () => {
    router.replace('/');
  };

  const handleContactSupport = () => {
    Alert.alert(
      "Contact Support",
      "Need help with your payment? Contact us at:\n\n📧 support@travelsri.com\n📞 +94 11 123 4567",
      [{ text: "OK" }]
    );
  };

  return (
    <LinearGradient
      colors={['#f59e0b', '#d97706', '#b45309']}
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
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          {/* Cancel Icon */}
          <View style={styles.iconContainer}>
            <View style={styles.iconCircle}>
              <MaterialIcons name="cancel" size={80} color="#f59e0b" />
            </View>
          </View>

          {/* Cancel Message */}
          <Text style={styles.title}>Payment Cancelled</Text>
          <Text style={styles.subtitle}>
            You cancelled the payment process. Don't worry, your booking is still available and you can complete the payment anytime.
          </Text>

          {/* Details Card */}
          <View style={styles.detailsCard}>
            <View style={styles.cardHeader}>
              <Ionicons name="information-circle-outline" size={24} color="#f59e0b" />
              <Text style={styles.cardTitle}>Booking Information</Text>
            </View>
            
            <View style={styles.detailsList}>
              <DetailRow 
                icon="bookmark-outline" 
                label="Booking ID" 
                value={bookingId as string} 
              />
              
              {orderId && (
                <DetailRow 
                  icon="receipt-outline" 
                  label="Order ID" 
                  value={orderId as string} 
                />
              )}
              
              <DetailRow 
                icon="time-outline" 
                label="Status" 
                value="Payment Pending"
                highlight
              />
              
              <DetailRow 
                icon="location-outline" 
                label="Currency" 
                value="Sri Lankan Rupees (LKR)" 
              />
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.primaryButton} 
              onPress={handleRetryPayment}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#ffffff', '#f8fafc']}
                style={styles.buttonGradient}
              >
                <Ionicons name="card-outline" size={20} color="#f59e0b" />
                <Text style={styles.primaryButtonText}>Complete Payment</Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <View style={styles.secondaryButtonsRow}>
              <TouchableOpacity 
                style={[styles.secondaryButton, styles.halfButton]} 
                onPress={handleContactSupport}
                activeOpacity={0.8}
              >
                <Ionicons name="help-circle-outline" size={18} color="white" />
                <Text style={styles.secondaryButtonText}>Get Help</Text>
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
                Your booking is safe and will be held for 24 hours
              </Text>
            </View>
            
            <View style={styles.infoItem}>
              <Ionicons name="refresh-outline" size={16} color="rgba(255,255,255,0.8)" />
              <Text style={styles.infoText}>
                You can retry payment anytime before expiration
              </Text>
            </View>
            
            <View style={styles.infoItem}>
              <Ionicons name="card-outline" size={16} color="rgba(255,255,255,0.8)" />
              <Text style={styles.infoText}>
                All payments are processed securely through PayHere
              </Text>
            </View>
          </View>
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
    marginBottom: 32,
    lineHeight: 24,
    paddingHorizontal: 20,
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
    color: '#f59e0b',
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
    color: '#f59e0b',
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
});