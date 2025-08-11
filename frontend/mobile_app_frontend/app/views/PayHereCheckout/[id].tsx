// PayHere Checkout Component - Web and Native Compatible
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Platform,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { PayHereSDK, PayHerePaymentObject, PayHerePaymentData } from '../../../types/payhere';

// Import PayHere SDK only for native platforms
let PayHere: PayHereSDK | null = null;
if (Platform.OS !== 'web') {
  try {
    PayHere = require('@payhere/payhere-mobilesdk-reactnative').default;
    console.log('PayHere SDK loaded successfully for platform:', Platform.OS);
  } catch (error) {
    console.log('PayHere SDK not available for platform:', Platform.OS, error);
  }
} else {
  console.log('PayHere SDK not supported on web platform');
}

const PayHereCheckout: React.FC = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const [isLoading, setIsLoading] = useState(true);
  const [paymentData, setPaymentData] = useState<PayHerePaymentData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const bookingId = params.bookingId as string;
  const orderId = params.orderId as string;

  useEffect(() => {
    try {
      console.log('PayHere Checkout - Received params:', params);
      console.log('Platform:', Platform.OS);
      
      if (params.paymentData) {
        const data = JSON.parse(params.paymentData as string);
        console.log('Parsed payment data:', data);
        
        // Validate required fields
        if (!data.merchant_id || !data.amount) {
          throw new Error('Missing required payment data');
        }
        
        setPaymentData(data);
        setIsLoading(false);
      } else {
        setError('Payment data not provided');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error parsing payment data:', error);
      setError('Invalid payment data format: ' + (error as Error).message);
      setIsLoading(false);
    }
  }, [params.paymentData]);

  // Convert backend payment data to PayHere SDK format
  const createPayHerePaymentObject = (paymentData: PayHerePaymentData): PayHerePaymentObject => {
    return {
      sandbox: paymentData.sandbox || true,
      merchant_id: paymentData.merchant_id,
      notify_url: paymentData.notify_url,
      order_id: paymentData.order_id,
      items: paymentData.items,
      amount: paymentData.amount,
      currency: paymentData.currency,
      first_name: paymentData.first_name,
      last_name: paymentData.last_name,
      email: paymentData.email,
      phone: paymentData.phone,
      address: paymentData.address,
      city: paymentData.city,
      country: paymentData.country,
      delivery_address: paymentData.address,
      delivery_city: paymentData.city,
      delivery_country: paymentData.country,
      custom_1: bookingId,
      custom_2: ""
    };
  };

  // Web payment handling
  const handleWebPayment = () => {
    if (!paymentData) return;

    console.log('Handling web payment with form submission');
    
    const checkoutUrl = paymentData.sandbox ? 
      'https://sandbox.payhere.lk/pay/checkout' : 
      'https://www.payhere.lk/pay/checkout';

    // Create form and submit
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = checkoutUrl;
    form.target = '_blank';

    // Add all payment data as hidden inputs
    Object.entries(paymentData).forEach(([key, value]) => {
      if (key !== 'sandbox') { // Exclude sandbox flag
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = String(value || '');
        form.appendChild(input);
      }
    });

    // Add custom fields
    const customInput1 = document.createElement('input');
    customInput1.type = 'hidden';
    customInput1.name = 'custom_1';
    customInput1.value = bookingId;
    form.appendChild(customInput1);

    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);

    // Show message to user
    Alert.alert(
      'Payment Window Opened',
      'Payment page has opened in a new tab. Please complete your payment and return to this page.',
      [
        {
          text: 'I completed payment',
          onPress: () => {
            router.replace({
              pathname: '../payment-success',
              params: {
                paymentId: 'WEB_' + Date.now(),
                orderId: paymentData.order_id,
                bookingId: bookingId,
                amount: paymentData.amount,
                currency: paymentData.currency
              }
            });
          }
        },
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => setIsSubmitting(false)
        }
      ]
    );
  };

  // Handle successful payment (native only)
  const onPaymentCompleted = (paymentId: string) => {
    console.log('✅ Payment completed successfully!');
    console.log('Payment ID:', paymentId);
    console.log('Order ID:', paymentData?.order_id);
    console.log('Booking ID:', bookingId);
    
    setIsSubmitting(false);
    
    Alert.alert(
      'Payment Successful! 🎉',
      `Your payment has been processed successfully.\n\nPayment ID: ${paymentId}\nOrder ID: ${paymentData?.order_id}`,
      [
        {
          text: 'Continue',
          onPress: () => {
            router.replace({
              pathname: '../payment-success',
              params: {
                paymentId: paymentId,
                orderId: paymentData?.order_id,
                bookingId: bookingId,
                amount: paymentData?.amount,
                currency: paymentData?.currency
              }
            });
          }
        }
      ]
    );
  };

  // Handle payment error (native only)
  const onPaymentError = (errorData: string) => {
    console.log('❌ Payment error:', errorData);
    setIsSubmitting(false);
    
    Alert.alert(
      'Payment Error',
      `Payment failed: ${errorData}\n\nPlease try again or contact support if the problem persists.`,
      [
        { text: 'Try Again', style: 'default' },
        { text: 'Go Back', style: 'cancel', onPress: () => router.back() }
      ]
    );
  };

  // Handle payment dismissal (native only)
  const onPaymentDismissed = () => {
    console.log('💔 Payment dismissed by user');
    setIsSubmitting(false);
    
    Alert.alert(
      'Payment Cancelled',
      'You cancelled the payment process. You can try again or go back.',
      [
        { text: 'Try Again', style: 'default' },
        { text: 'Go Back', style: 'cancel', onPress: () => router.back() }
      ]
    );
  };

  // Start payment (platform-specific)
  const handleStartPayment = () => {
    if (!paymentData) {
      Alert.alert('Error', 'Payment data is not available. Please try again.');
      return;
    }

    console.log('🚀 Starting PayHere payment...');
    console.log('Platform:', Platform.OS);
    console.log('PayHere SDK Available:', !!PayHere);
    console.log('Payment Data:', paymentData);
    
    setIsSubmitting(true);

    if (Platform.OS === 'web') {
      // Handle web payment
      handleWebPayment();
    } else {
      // Handle native payment
      if (!PayHere) {
        Alert.alert(
          'SDK Not Available',
          'PayHere SDK is not available on this platform. Please use a physical device.',
          [{ text: 'OK', onPress: () => setIsSubmitting(false) }]
        );
        return;
      }

      try {
        const paymentObject = createPayHerePaymentObject(paymentData);
        console.log('PayHere Payment Object:', paymentObject);

        PayHere.startPayment(
          paymentObject,
          onPaymentCompleted,
          onPaymentError,
          onPaymentDismissed
        );
        
      } catch (error) {
        console.error('Error starting payment:', error);
        setIsSubmitting(false);
        Alert.alert(
          'Payment Error',
          'Failed to start payment process. Please try again.',
          [{ text: 'OK' }]
        );
      }
    }
  };

  const handleGoBack = () => {
    Alert.alert(
      'Cancel Payment',
      'Are you sure you want to cancel this payment? Your booking will not be confirmed.',
      [
        { text: 'Continue Payment', style: 'cancel' },
        { 
          text: 'Cancel Payment', 
          style: 'destructive',
          onPress: () => router.back() 
        }
      ]
    );
  };

  // Debug function
  const debugPaymentData = () => {
    console.log('=== PAYMENT DATA DEBUG ===');
    console.log('Platform:', Platform.OS);
    console.log('PayHere SDK Available:', !!PayHere);
    console.log('All payment data:', paymentData);
    console.log('PayHere Object would be:', paymentData ? createPayHerePaymentObject(paymentData) : 'No data');
    console.log('========================');
    
    Alert.alert(
      'Payment Debug Info',
      `Platform: ${Platform.OS}\nSDK Available: ${!!PayHere}\nMerchant ID: ${paymentData?.merchant_id}\nOrder ID: ${paymentData?.order_id}\nAmount: ${paymentData?.amount}`,
      [{ text: 'OK' }]
    );
  };

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor="#ef4444" barStyle="light-content" />
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>❌</Text>
          <Text style={styles.errorTitle}>Payment Error</Text>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor="#fde047" barStyle="dark-content" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#facc15" />
          <Text style={styles.loadingText}>Loading payment details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const isNativeWithSDK = Platform.OS !== 'web' && PayHere;
  const isWebPlatform = Platform.OS === 'web';
  const canProceedPayment = isNativeWithSDK || isWebPlatform;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#fde047" barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.cancelButton} onPress={handleGoBack}>
          <Text style={styles.cancelIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>PayHere Payment</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Platform Info */}
      <View style={styles.platformInfo}>
        <Text style={styles.platformText}>
          💻 Platform: {Platform.OS} | 
          {Platform.OS === 'web' ? ' Form Submission' : (PayHere ? ' SDK Available' : ' SDK Not Available')}
        </Text>
      </View>

      {/* Payment Summary */}
      <View style={styles.content}>
        <View style={styles.paymentCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardIcon}>💳</Text>
            <Text style={styles.cardTitle}>Payment Summary</Text>
          </View>

          <View style={styles.amountContainer}>
            <Text style={styles.amountLabel}>Total Amount</Text>
            <Text style={styles.amountValue}>{paymentData?.currency} {paymentData?.amount}</Text>
            <Text style={styles.currencyText}>
              {paymentData?.currency === 'LKR' ? 'Sri Lankan Rupees' : paymentData?.currency}
            </Text>
          </View>

          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Service:</Text>
              <Text style={styles.detailValue}>{paymentData?.items}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Order ID:</Text>
              <Text style={styles.detailValue}>{paymentData?.order_id}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Customer:</Text>
              <Text style={styles.detailValue}>
                {paymentData?.first_name} {paymentData?.last_name}
              </Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Email:</Text>
              <Text style={styles.detailValue}>{paymentData?.email}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Merchant ID:</Text>
              <Text style={styles.detailValue}>{paymentData?.merchant_id}</Text>
            </View>
          </View>
        </View>

        {/* Platform-specific Info Card */}
        {isWebPlatform ? (
          <View style={styles.webInfoCard}>
            <Text style={styles.infoIcon}>🌐</Text>
            <Text style={styles.infoTitle}>Web Platform Payment</Text>
            <Text style={styles.infoText}>
              Payment will open in a new tab through PayHere's secure checkout page. 
              Please complete the payment and return to this page.
            </Text>
          </View>
        ) : (
          <View style={styles.sdkCard}>
            <Text style={styles.sdkCardIcon}>📱</Text>
            <Text style={styles.sdkCardTitle}>
              {PayHere ? 'PayHere Native SDK' : 'SDK Not Available'}
            </Text>
            <Text style={styles.sdkCardText}>
              {PayHere ? 
                'Your payment will be processed using PayHere\'s official React Native SDK within the app.' :
                'PayHere SDK is not available. Please use a physical device for native payment processing.'
              }
            </Text>
          </View>
        )}

        {/* Payment Methods */}
        <View style={styles.methodsCard}>
          <Text style={styles.methodsTitle}>Accepted Payment Methods</Text>
          <View style={styles.methodsContainer}>
            <View style={styles.methodItem}>
              <Text style={styles.methodIcon}>💳</Text>
              <Text style={styles.methodText}>Credit/Debit Cards</Text>
            </View>
            <View style={styles.methodItem}>
              <Text style={styles.methodIcon}>🏦</Text>
              <Text style={styles.methodText}>Online Banking</Text>
            </View>
            <View style={styles.methodItem}>
              <Text style={styles.methodIcon}>📱</Text>
              <Text style={styles.methodText}>Mobile Wallets</Text>
            </View>
          </View>
        </View>

        {/* Warning for unsupported platforms */}
        {!canProceedPayment && (
          <View style={styles.warningCard}>
            <Text style={styles.warningIcon}>⚠️</Text>
            <Text style={styles.warningTitle}>Payment Not Available</Text>
            <Text style={styles.warningText}>
              PayHere payment is not available on this platform configuration. 
              Please use a physical device for the best experience.
            </Text>
          </View>
        )}
      </View>

      {/* Bottom Action */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity 
          style={[
            styles.proceedButton, 
            (isSubmitting || !canProceedPayment) && styles.proceedButtonDisabled
          ]} 
          onPress={handleStartPayment}
          disabled={isSubmitting || !canProceedPayment}
        >
          {isSubmitting ? (
            <View style={styles.loadingRow}>
              <ActivityIndicator size="small" color="#ffffff" />
              <Text style={styles.loadingPaymentText}>Processing...</Text>
            </View>
          ) : (
            <>
              <Text style={styles.proceedIcon}>🚀</Text>
              <Text style={styles.proceedText}>
                {isWebPlatform ? 'Open PayHere (New Tab)' : 'Pay with PayHere'}
              </Text>
            </>
          )}
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.cancelButtonBottom} onPress={handleGoBack}>
          <Text style={styles.cancelButtonText}>Cancel & Go Back</Text>
        </TouchableOpacity>

        {/* Debug Button - Remove in production */}
        {__DEV__ && (
          <TouchableOpacity 
            style={[styles.proceedButton, { backgroundColor: '#6b7280', marginTop: 12 }]} 
            onPress={debugPaymentData}
          >
            <Text style={styles.proceedText}>🔧 Debug Payment Data</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
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
  platformInfo: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  platformText: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  cancelButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelIcon: {
    fontSize: 20,
    color: '#1f2937',
    fontWeight: 'bold',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  paymentCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  cardIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
  },
  amountContainer: {
    alignItems: 'center',
    marginBottom: 24,
    paddingVertical: 16,
    backgroundColor: '#f0fdf4',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  amountLabel: {
    fontSize: 14,
    color: '#059669',
    fontWeight: '500',
    marginBottom: 4,
  },
  amountValue: {
    fontSize: 32,
    fontWeight: '800',
    color: '#10b981',
  },
  currencyText: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  detailsContainer: {
    gap: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  detailLabel: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: '#1f2937',
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
  webInfoCard: {
    backgroundColor: '#fef3c7',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fbbf24',
  },
  sdkCard: {
    backgroundColor: '#eff6ff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#dbeafe',
  },
  infoIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#92400e',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#a16207',
    textAlign: 'center',
    lineHeight: 20,
  },
  sdkCardIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  sdkCardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e40af',
    marginBottom: 8,
  },
  sdkCardText: {
    fontSize: 14,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 20,
  },
  methodsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  methodsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  methodsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  methodItem: {
    alignItems: 'center',
    flex: 1,
  },
  methodIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  methodText: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  warningCard: {
    backgroundColor: '#fef2f2',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  warningIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  warningTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#dc2626',
    marginBottom: 4,
  },
  warningText: {
    fontSize: 12,
    color: '#991b1b',
    textAlign: 'center',
  },
  bottomContainer: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  proceedButton: {
    backgroundColor: '#10b981',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  proceedButtonDisabled: {
    backgroundColor: '#94a3b8',
    shadowOpacity: 0.1,
  },
  proceedIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  proceedText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingPaymentText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    marginLeft: 8,
  },
  cancelButtonBottom: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 16,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ef4444',
    marginBottom: 12,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: '#fde047',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 32,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
});

export default PayHereCheckout;