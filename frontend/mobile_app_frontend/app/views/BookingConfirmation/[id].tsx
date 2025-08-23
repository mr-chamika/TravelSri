// BookingConfirmation.tsx - Enhanced payment status and booking management page
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
  Alert,
  RefreshControl,
  ActivityIndicator,
  Animated,
} from 'react-native';

import { useRouter, useLocalSearchParams } from 'expo-router';
import BookingService from '../../../services/BookingService';

interface BookingStatus {
  id: string;
  travelerId: string;
  providerId: string;
  providerType: string;
  serviceName: string;
  serviceDescription: string;
  serviceStartDate: string;
  serviceEndDate: string;
  totalAmount: number;
  status: 'PENDING_PAYMENT' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  paymentStatus: 'PENDING' | 'SUCCESS' | 'FAILED';
  payHereOrderId?: string;
  payHerePaymentId?: string;
  createdAt: string;
  updatedAt: string;
}

interface PaymentStatus {
  orderId: string;
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
  amount: number;
  currency: string;
  paymentId?: string;
}

const BookingConfirmation: React.FC = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const [booking, setBooking] = useState<BookingStatus | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pulseAnimation] = useState(new Animated.Value(1));

  const bookingId = params.bookingId as string;
  const orderId = params.orderId as string;

  // Enhanced colors with gradients and modern palette
  const colors = {
    primary: '#fde047',
    primaryDark: '#facc15',
    success: '#10b981',
    successLight: '#d1fae5',
    error: '#ef4444',
    errorLight: '#fee2e2',
    warning: '#f59e0b',
    warningLight: '#fef3c7',
    info: '#3b82f6',
    infoLight: '#dbeafe',
    background: '#f8fafc',
    white: '#ffffff',
    textPrimary: '#0f172a',
    textSecondary: '#475569',
    textMuted: '#94a3b8',
    border: '#e2e8f0',
    shadow: 'rgba(0, 0, 0, 0.1)',
  };

  // Pulse animation for pending status
  useEffect(() => {
    const startPulse = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnimation, {
            toValue: 1.1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnimation, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    if (booking?.paymentStatus === 'PENDING' || paymentStatus?.status === 'PENDING') {
      startPulse();
    }

    return () => {
      pulseAnimation.stopAnimation();
    };
  }, [booking?.paymentStatus, paymentStatus?.status]);

  

  const fetchBookingAndPaymentStatus = async () => {
  try {
    setError(null);
    setIsLoading(true);

    // Fetch booking details using the test endpoint
    if (bookingId) {
      const bookingData = await BookingService.getBookingInfo(bookingId);
      setBooking(bookingData); // Now matches BookingResponse type
    }

    // Fetch payment status if we have an order ID
    if (orderId) {
      try {
        const paymentData = await BookingService.getPaymentStatus(orderId);
        setPaymentStatus(paymentData); // Now matches PaymentResponse type
      } catch (paymentError) {
        console.log("Payment status not available yet:", paymentError);
        // This is expected for new bookings
      }
    }
  } catch (error) {
    console.error("Error fetching status:", error);
    setError(
      error instanceof Error ? error.message : "Failed to fetch booking status"
    );
  } finally {
    setIsLoading(false);
    setIsRefreshing(false);
  }
};


  useEffect(() => {
    console.log('BookingConfirmation params:', { bookingId, orderId });
    fetchBookingAndPaymentStatus();
    
    // Set up polling for payment status updates
    const interval = setInterval(() => {
      if (booking?.paymentStatus === 'PENDING' || paymentStatus?.status === 'PENDING') {
        fetchBookingAndPaymentStatus();
      }
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(interval);
  }, [bookingId, orderId]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchBookingAndPaymentStatus();
  };

  const handleRetryPayment = async () => {
    if (!booking) return;

    try {
      const paymentResponse = await BookingService.createPaymentCheckout(booking.id);
      
      if (paymentResponse.success && paymentResponse.paymentData) {
        router.push({
          pathname: '../payhere-checkout',
          params: {
            paymentData: JSON.stringify(paymentResponse.paymentData),
            bookingId: booking.id,
            orderId: paymentResponse.orderId
          }
        });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to retry payment. Please try again.');
    }
  };

  const handleCancelBooking = async () => {
    if (!booking) return;

    Alert.alert(
      'Cancel Booking',
      'Are you sure you want to cancel this booking? This action cannot be undone.',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            try {
              // You'll need to implement this endpoint
              await BookingService.cancelBooking(booking.id);
              Alert.alert('Success', 'Booking cancelled successfully');
              await fetchBookingAndPaymentStatus();
            } catch (error) {
              Alert.alert('Error', 'Failed to cancel booking');
            }
          }
        }
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'SUCCESS':
      case 'CONFIRMED':
      case 'COMPLETED':
        return colors.success;
      case 'FAILED':
      case 'CANCELLED':
        return colors.error;
      case 'PENDING':
      case 'PENDING_PAYMENT':
        return colors.warning;
      default:
        return colors.textMuted;
    }
  };

  const getStatusBackground = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'SUCCESS':
      case 'CONFIRMED':
      case 'COMPLETED':
        return colors.successLight;
      case 'FAILED':
      case 'CANCELLED':
        return colors.errorLight;
      case 'PENDING':
      case 'PENDING_PAYMENT':
        return colors.warningLight;
      default:
        return colors.background;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'SUCCESS':
      case 'CONFIRMED':
      case 'COMPLETED':
        return '✅';
      case 'FAILED':
      case 'CANCELLED':
        return '❌';
      case 'PENDING':
      case 'PENDING_PAYMENT':
        return '⏳';
      default:
        return '❓';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusMessage = () => {
    if (!booking) return '';
    
    const status = booking.paymentStatus || booking.status;
    switch (status?.toUpperCase()) {
      case 'PENDING':
      case 'PENDING_PAYMENT':
        return 'We\'re processing your payment. This usually takes a few minutes.';
      case 'SUCCESS':
      case 'CONFIRMED':
        return 'Great! Your booking is confirmed. Check your email for details.';
      case 'FAILED':
        return 'Payment failed. You can retry payment or contact support.';
      case 'CANCELLED':
        return 'This booking has been cancelled.';
      case 'COMPLETED':
        return 'Your service has been completed. Thank you for choosing us!';
      default:
        return 'We\'re updating your booking status...';
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { marginTop: 16 }]}>Loading booking details...</Text>
      </SafeAreaView>
    );
  }

  const isPending = booking?.paymentStatus === 'PENDING' || paymentStatus?.status === 'PENDING';
  const isSuccess = booking?.paymentStatus === 'SUCCESS' || paymentStatus?.status === 'SUCCESS';
  const isFailed = booking?.paymentStatus === 'FAILED' || paymentStatus?.status === 'FAILED';

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={colors.primary} barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Booking Status</Text>
          <Text style={styles.headerSubtitle}>Track your reservation</Text>
        </View>
        <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
          <Text style={styles.refreshIcon}>🔄</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Main Status Card */}
        {booking && (
          <View style={[styles.mainStatusCard, { backgroundColor: getStatusBackground(booking.paymentStatus || booking.status) }]}>
            <Animated.View style={[
              styles.statusIconContainer,
              isPending && { transform: [{ scale: pulseAnimation }] }
            ]}>
              <Text style={styles.mainStatusIcon}>
                {getStatusIcon(booking.paymentStatus || booking.status)}
              </Text>
            </Animated.View>
            
            <View style={styles.mainStatusInfo}>
              <Text style={styles.mainStatusTitle}>
                {booking.paymentStatus?.toUpperCase() || booking.status?.replace('_', ' ').toUpperCase()}
              </Text>
              <Text style={styles.mainStatusMessage}>
                {getStatusMessage()}
              </Text>
              
              {isPending && (
                <View style={styles.processingIndicator}>
                  <ActivityIndicator size="small" color={colors.warning} style={{ marginRight: 8 }} />
                  <Text style={styles.processingText}>Processing...</Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          {isFailed && (
            <TouchableOpacity style={styles.retryButton} onPress={handleRetryPayment}>
              <Text style={styles.retryIcon}>🔄</Text>
              <Text style={styles.retryButtonText}>Retry Payment</Text>
            </TouchableOpacity>
          )}
          
          {booking?.status === 'PENDING_PAYMENT' && (
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancelBooking}>
              <Text style={styles.cancelIcon}>❌</Text>
              <Text style={styles.cancelButtonText}>Cancel Booking</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Payment Details Card */}
        {(paymentStatus || booking?.payHereOrderId) && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>💳 Payment Details</Text>
            </View>
            
            <View style={styles.cardContent}>
              {booking?.payHereOrderId && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Order ID:</Text>
                  <Text style={styles.detailValue}>{booking.payHereOrderId}</Text>
                </View>
              )}
              {booking?.payHerePaymentId && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Payment ID:</Text>
                  <Text style={styles.detailValue}>{booking.payHerePaymentId}</Text>
                </View>
              )}
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Amount:</Text>
                <Text style={[styles.detailValue, styles.amountText]}>
                  ${booking?.totalAmount?.toFixed(2) || '0.00'}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Payment Status:</Text>
                <Text style={[styles.detailValue, { color: getStatusColor(booking?.paymentStatus || 'pending') }]}>
                  {booking?.paymentStatus || 'PENDING'}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Booking Details Card */}
        {booking && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>📋 Booking Details</Text>
            </View>
            
            <View style={styles.cardContent}>
              <Text style={styles.serviceName}>{booking.serviceName}</Text>
              <Text style={styles.serviceDescription}>{booking.serviceDescription}</Text>
              
              <View style={styles.detailsGrid}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Service Type:</Text>
                  <Text style={styles.detailValue}>{booking.providerType}</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Start Date:</Text>
                  <Text style={styles.detailValue}>{formatDate(booking.serviceStartDate)}</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>End Date:</Text>
                  <Text style={styles.detailValue}>{formatDate(booking.serviceEndDate)}</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Booking ID:</Text>
                  <Text style={styles.detailValue}>{booking.id}</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Created:</Text>
                  <Text style={styles.detailValue}>{formatDate(booking.createdAt)}</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Error Display */}
        {error && (
          <View style={styles.errorCard}>
            <Text style={styles.errorIcon}>⚠️</Text>
            <View style={styles.errorContent}>
              <Text style={styles.errorTitle}>Something went wrong</Text>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          </View>
        )}

        {/* Help Card */}
        <View style={styles.helpCard}>
          <Text style={styles.helpTitle}>Need Help?</Text>
          <Text style={styles.helpText}>
            If you have any questions about your booking or payment, our support team is here to help.
          </Text>
          <TouchableOpacity style={styles.contactButton}>
            <Text style={styles.contactButtonText}>Contact Support</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Navigation */}
        <View style={styles.bottomNavigation}>
          <TouchableOpacity style={styles.homeButton} onPress={() => router.push('/')}>
            <Text style={styles.homeIcon}>🏠</Text>
            <Text style={styles.homeButtonText}>Back to Home</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  loadingText: {
    fontSize: 16,
    color: '#475569',
    textAlign: 'center',
  },
  header: {
    backgroundColor: '#fde047',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingTop: Platform.OS === 'ios' ? 16 : 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  backIcon: {
    fontSize: 24,
    color: '#0f172a',
  },
  headerContent: {
    flex: 1,
    marginLeft: 12,
  },
  headerTitle: {
    color: '#0f172a',
    fontSize: 20,
    fontWeight: '700',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#475569',
    marginTop: 2,
  },
  refreshButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  refreshIcon: {
    fontSize: 20,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  mainStatusCard: {
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  statusIconContainer: {
    marginBottom: 16,
  },
  mainStatusIcon: {
    fontSize: 48,
  },
  mainStatusInfo: {
    alignItems: 'center',
  },
  mainStatusTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 8,
    textAlign: 'center',
  },
  mainStatusMessage: {
    fontSize: 16,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 12,
  },
  processingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  processingText: {
    fontSize: 14,
    color: '#f59e0b',
    fontWeight: '500',
  },
  quickActionsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  retryButton: {
    flex: 1,
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  retryIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#ef4444',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  cancelIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  cancelButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardHeader: {
    padding: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
  },
  cardContent: {
    padding: 20,
    paddingTop: 16,
  },
  serviceName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 8,
  },
  serviceDescription: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
    marginBottom: 20,
  },
  detailsGrid: {
    gap: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    color: '#0f172a',
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
  amountText: {
    fontSize: 18,
    color: '#10b981',
  },
  errorCard: {
    backgroundColor: '#fee2e2',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#fecaca',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  errorIcon: {
    fontSize: 24,
    marginRight: 12,
    marginTop: 2,
  },
  errorContent: {
    flex: 1,
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#dc2626',
    marginBottom: 4,
  },
  errorText: {
    fontSize: 14,
    color: '#dc2626',
    lineHeight: 20,
  },
  helpCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#dbeafe',
    // backgroundColor: '#f0f9ff',
  },
  helpTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 8,
  },
  helpText: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
    marginBottom: 16,
  },
  contactButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  contactButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  bottomNavigation: {
    marginTop: 8,
  },
  homeButton: {
    backgroundColor: '#fde047',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#facc15',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  homeIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  homeButtonText: {
    color: '#0f172a',
    fontSize: 16,
    fontWeight: '700',
  },
  bottomPadding: {
    height: 32,
  },
});

export default BookingConfirmation;