// Payment Success Page
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

const PaymentSuccess: React.FC = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const [isProcessing, setIsProcessing] = useState(true);

  const paymentId = params.paymentId as string;
  const orderId = params.orderId as string;
  const bookingId = params.bookingId as string;
  const amount = params.amount as string;
  const currency = params.currency as string;

  useEffect(() => {
    // Notify backend about payment completion
    const notifyBackend = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/payments/payhere/sdk/payment-completed', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            orderId: orderId,
            paymentId: paymentId,
            bookingId: bookingId
          })
        });

        const result = await response.json();
        console.log('Backend notification result:', result);
        
        if (result.success) {
          console.log('✅ Backend successfully updated booking status');
        } else {
          console.log('⚠️ Backend update had issues:', result.message);
        }
      } catch (error) {
        console.error('Error notifying backend:', error);
      } finally {
        setIsProcessing(false);
      }
    };

    if (paymentId && orderId && bookingId) {
      notifyBackend();
    } else {
      setIsProcessing(false);
    }
  }, [paymentId, orderId, bookingId]);

  const handleContinue = () => {
    // Navigate to booking confirmation or home
    router.replace('./booking-history'); // Adjust path as needed
  };

  const handleDownloadReceipt = () => {
    // Implement receipt download or viewing
    console.log('Download receipt for payment:', paymentId);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#10b981" barStyle="light-content" />
      
      <ScrollView contentContainerStyle={styles.content}>
        {/* Success Icon */}
        <View style={styles.successIconContainer}>
          <View style={styles.successIcon}>
            <Text style={styles.checkMark}>✓</Text>
          </View>
        </View>

        {/* Success Message */}
        <Text style={styles.successTitle}>Payment Successful!</Text>
        <Text style={styles.successSubtitle}>
          Your booking has been confirmed and payment processed successfully.
        </Text>

        {/* Payment Details Card */}
        <View style={styles.detailsCard}>
          <Text style={styles.cardTitle}>Payment Details</Text>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Payment ID:</Text>
            <Text style={styles.detailValue}>{paymentId}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Order ID:</Text>
            <Text style={styles.detailValue}>{orderId}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Booking ID:</Text>
            <Text style={styles.detailValue}>{bookingId}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Amount Paid:</Text>
            <Text style={styles.detailValueHighlight}>
              {currency} {amount}
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Payment Method:</Text>
            <Text style={styles.detailValue}>PayHere</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Date & Time:</Text>
            <Text style={styles.detailValue}>
              {new Date().toLocaleString()}
            </Text>
          </View>
        </View>

        {/* Status Card */}
        <View style={styles.statusCard}>
          <Text style={styles.statusIcon}>📋</Text>
          <Text style={styles.statusTitle}>Booking Status</Text>
          <Text style={styles.statusText}>
            {isProcessing ? 
              'Processing your booking...' : 
              'Your booking is confirmed and the guide will be notified shortly.'
            }
          </Text>
        </View>

        {/* Next Steps */}
        <View style={styles.nextStepsCard}>
          <Text style={styles.nextStepsTitle}>What's Next?</Text>
          <View style={styles.stepsList}>
            <View style={styles.stepItem}>
              <Text style={styles.stepNumber}>1</Text>
              <Text style={styles.stepText}>You'll receive a confirmation email shortly</Text>
            </View>
            <View style={styles.stepItem}>
              <Text style={styles.stepNumber}>2</Text>
              <Text style={styles.stepText}>The guide will contact you within 24 hours</Text>
            </View>
            <View style={styles.stepItem}>
              <Text style={styles.stepNumber}>3</Text>
              <Text style={styles.stepText}>Check your booking history for updates</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity 
          style={styles.secondaryButton} 
          onPress={handleDownloadReceipt}
        >
          <Text style={styles.secondaryButtonText}>📄 View Receipt</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.primaryButton} 
          onPress={handleContinue}
        >
          <Text style={styles.primaryButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    padding: 20,
    alignItems: 'center',
  },
  successIconContainer: {
    marginVertical: 40,
  },
  successIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#10b981',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  checkMark: {
    fontSize: 48,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  successTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#10b981',
    textAlign: 'center',
    marginBottom: 12,
  },
  successSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  detailsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 20,
    textAlign: 'center',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  detailLabel: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: '#1f2937',
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
  detailValueHighlight: {
    fontSize: 16,
    color: '#10b981',
    fontWeight: '700',
    flex: 1,
    textAlign: 'right',
  },
  statusCard: {
    backgroundColor: '#eff6ff',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    marginBottom: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#dbeafe',
  },
  statusIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e40af',
    marginBottom: 8,
  },
  statusText: {
    fontSize: 14,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 20,
  },
  nextStepsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  nextStepsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  stepsList: {
    gap: 12,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#fde047',
    color: '#1f2937',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 24,
  },
  stepText: {
    fontSize: 14,
    color: '#4b5563',
    flex: 1,
    lineHeight: 20,
  },
  bottomContainer: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  primaryButton: {
    flex: 2,
    backgroundColor: '#10b981',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
});

export default PaymentSuccess;