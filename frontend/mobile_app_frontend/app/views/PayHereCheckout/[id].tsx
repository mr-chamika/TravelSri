// Updated PayHere Checkout Component - LKR Only Support
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
  ScrollView,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { 
  PayHereSDK, 
  PayHerePaymentObject, 
  PayHerePaymentData,
  PaymentCheckoutResponse,
  PAYHERE_CONSTANTS,
  isValidPaymentData,
  isLKRCurrency,
  createPayHereError
} from '../../../types/payhere';

// Import PayHere SDK only for native platforms
let PayHere: PayHereSDK | null = null;
if (Platform.OS !== 'web') {
  try {
    PayHere = require('@payhere/payhere-mobilesdk-reactnative').default;
    console.log('✅ PayHere SDK loaded successfully for platform:', Platform.OS);
  } catch (error) {
    console.log('⚠️ PayHere SDK not available for platform:', Platform.OS, error);
  }
} else {
  console.log('ℹ️ PayHere SDK not supported on web platform');
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
  const expectedCurrency = params.currency as string || PAYHERE_CONSTANTS.SUPPORTED_CURRENCY;

  useEffect(() => {
    try {
      console.log('=== PAYHERE CHECKOUT INITIALIZATION ===');
      console.log('Platform:', Platform.OS);
      console.log('Received params:', {
        bookingId,
        orderId,
        expectedCurrency,
        hasPaymentData: !!params.paymentData
      });
      
      if (params.paymentData) {
        const data: PayHerePaymentData = JSON.parse(params.paymentData as string);
        console.log('📋 Parsed payment data:', {
          merchant_id: data.merchant_id,
          order_id: data.order_id,
          amount: data.amount,
          currency: data.currency,
          sandbox: data.sandbox,
          custom_1: data.custom_1,
          custom_2: data.custom_2
        });
        
        // ✅ Enhanced validation with LKR currency check
        if (!isValidPaymentData(data)) {
          throw new Error('Invalid payment data structure');
        }

        // ✅ Strict LKR currency validation
        if (!isLKRCurrency(data.currency)) {
          throw new Error(
            `Unsupported currency: ${data.currency}. Only ${PAYHERE_CONSTANTS.SUPPORTED_CURRENCY} is supported.`
          );
        }

        // ✅ Validate controller expectations
        if (!data.merchant_id || !data.amount || !data.hash) {
          throw new Error('Missing required payment fields from controller');
        }
        
        console.log('✅ Payment data validation passed');
        console.log(`💰 Amount: ${data.currency} ${data.amount}`);
        console.log(`🏪 Merchant: ${data.merchant_id}`);
        console.log(`📦 Order: ${data.order_id}`);
        console.log(`🔧 Sandbox: ${data.sandbox}`);
        
        setPaymentData(data);
        setIsLoading(false);
      } else {
        throw new Error('Payment data not provided in navigation params');
      }
    } catch (error) {
      console.error('❌ Error initializing PayHere checkout:', error);
      setError(error instanceof Error ? error.message : 'Invalid payment data format');
      setIsLoading(false);
    }
  }, [params.paymentData, bookingId, orderId, expectedCurrency]);

  // ✅ UPDATED: Convert backend payment data to PayHere SDK format with LKR validation
  const createPayHerePaymentObject = (paymentData: PayHerePaymentData): PayHerePaymentObject => {
    console.log('🔄 Creating PayHere payment object...');
    console.log('Backend custom_1 (booking ID):', paymentData.custom_1);
    console.log('Backend custom_2 (order ID):', paymentData.custom_2);
    
    // ✅ Final LKR validation before creating payment object
    if (!isLKRCurrency(paymentData.currency)) {
      throw new Error(`Cannot create payment object: currency ${paymentData.currency} not supported`);
    }
    
    const paymentObject: PayHerePaymentObject = {
      sandbox: paymentData.sandbox ?? true,
      merchant_id: paymentData.merchant_id,
      notify_url: paymentData.notify_url,
      order_id: paymentData.order_id,
      items: paymentData.items,
      amount: paymentData.amount,
      currency: paymentData.currency, // Validated to be LKR
      first_name: paymentData.first_name,
      last_name: paymentData.last_name,
      email: paymentData.email,
      phone: paymentData.phone,
      address: paymentData.address,
      city: paymentData.city,
      country: paymentData.country,
      delivery_address: paymentData.delivery_address || paymentData.address,
      delivery_city: paymentData.delivery_city || paymentData.city,
      delivery_country: paymentData.delivery_country || paymentData.country,
      // ✅ Use backend values, fallback to params
      custom_1: paymentData.custom_1 || bookingId,
      custom_2: paymentData.custom_2 || orderId
    };

    console.log('✅ PayHere payment object created successfully');
    console.log(`💰 Final amount: ${paymentObject.currency} ${paymentObject.amount}`);
    
    return paymentObject;
  };

  // ✅ UPDATED: Enhanced web payment handling with LKR validation
  const handleWebPayment = () => {
    if (!paymentData) {
      console.error('❌ No payment data available for web payment');
      return;
    }

    console.log('🌐 Handling web payment with form submission...');
    console.log(`💰 Payment currency: ${paymentData.currency}`);
    console.log(`🔧 Sandbox mode: ${paymentData.sandbox}`);
    
    // ✅ Final currency check before web payment
    if (!isLKRCurrency(paymentData.currency)) {
      Alert.alert(
        'Currency Error',
        `Unsupported currency: ${paymentData.currency}. Only ${PAYHERE_CONSTANTS.SUPPORTED_CURRENCY} payments are accepted.`,
        [{ text: 'OK', onPress: () => setIsSubmitting(false) }]
      );
      return;
    }
    
    const checkoutUrl = paymentData.sandbox ? 
      PAYHERE_CONSTANTS.PAYMENT_URLS.SANDBOX : 
      PAYHERE_CONSTANTS.PAYMENT_URLS.LIVE;

    console.log(`🔗 Using checkout URL: ${checkoutUrl}`);

    try {
      // Create form and submit (web only)
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = checkoutUrl;
      form.target = '_blank';

      // ✅ Add all payment data as hidden inputs
      Object.entries(paymentData).forEach(([key, value]) => {
        if (key !== 'sandbox' && value !== undefined && value !== null) {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = String(value);
          form.appendChild(input);
          console.log(`📝 Added form field: ${key} = ${value}`);
        }
      });

      // ✅ Add hash field if not already included
      if (!paymentData.hash) {
        console.warn('⚠️ Hash not found in payment data, this may cause payment failure');
      }

      document.body.appendChild(form);
      form.submit();
      document.body.removeChild(form);

      console.log('✅ Payment form submitted to PayHere');

      // Show user guidance
      Alert.alert(
        'Payment Window Opened',
        `PayHere payment page has opened in a new tab.\n\nAmount: ${paymentData.currency} ${paymentData.amount}\n\nPlease complete your payment and return to this page.`,
        [
          {
            text: 'I completed payment',
            onPress: () => {
              console.log('👤 User confirmed payment completion');
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
            onPress: () => {
              console.log('👤 User cancelled payment');
              setIsSubmitting(false);
            }
          }
        ]
      );

    } catch (error) {
      console.error('❌ Error in web payment submission:', error);
      Alert.alert(
        'Payment Error',
        'Failed to open payment page. Please try again.',
        [{ text: 'OK', onPress: () => setIsSubmitting(false) }]
      );
    }
  };

  // ✅ UPDATED: Enhanced success handler with LKR validation
  const onPaymentCompleted = (paymentId: string) => {
    console.log('=== PAYMENT SUCCESS ===');
    console.log('✅ Payment completed successfully!');
    console.log('Payment ID:', paymentId);
    console.log('Order ID:', paymentData?.order_id);
    console.log('Booking ID:', bookingId);
    console.log('Currency:', paymentData?.currency);
    console.log('Amount:', paymentData?.amount);
    
    setIsSubmitting(false);
    
    Alert.alert(
      'Payment Successful! 🎉',
      `Your ${paymentData?.currency} payment has been processed successfully.\n\nPayment ID: ${paymentId}\nOrder ID: ${paymentData?.order_id}\nAmount: ${paymentData?.currency} ${paymentData?.amount}`,
      [
        {
          text: 'Continue',
          onPress: () => {
            router.replace({
              pathname: '../payment-success',
              params: {
                paymentId: paymentId,
                orderId: paymentData?.order_id || '',
                bookingId: bookingId,
                amount: paymentData?.amount || '',
                currency: paymentData?.currency || PAYHERE_CONSTANTS.SUPPORTED_CURRENCY
              }
            });
          }
        }
      ]
    );
  };

  // ✅ UPDATED: Enhanced error handler
  const onPaymentError = (errorData: string) => {
    console.log('=== PAYMENT ERROR ===');
    console.log('❌ Payment error:', errorData);
    console.log('Order ID:', paymentData?.order_id);
    console.log('Booking ID:', bookingId);
    
    setIsSubmitting(false);
    
    Alert.alert(
      'Payment Error',
      `Payment failed: ${errorData}\n\nOrder ID: ${paymentData?.order_id}\n\nPlease try again or contact support if the problem persists.`,
      [
        { text: 'Try Again', style: 'default' },
        { 
          text: 'Go Back', 
          style: 'cancel', 
          onPress: () => {
            console.log('👤 User chose to go back after error');
            router.back();
          }
        }
      ]
    );
  };

  // ✅ UPDATED: Enhanced dismissal handler
  const onPaymentDismissed = () => {
    console.log('=== PAYMENT DISMISSED ===');
    console.log('💔 Payment dismissed by user');
    console.log('Order ID:', paymentData?.order_id);
    console.log('Booking ID:', bookingId);
    
    setIsSubmitting(false);
    
    Alert.alert(
      'Payment Cancelled',
      `You cancelled the payment process.\n\nOrder ID: ${paymentData?.order_id}\n\nYou can try again or go back to modify your booking.`,
      [
        { text: 'Try Again', style: 'default' },
        { 
          text: 'Go Back', 
          style: 'cancel', 
          onPress: () => {
            console.log('👤 User chose to go back after dismissal');
            router.back();
          }
        }
      ]
    );
  };

  // ✅ UPDATED: Enhanced payment starter with comprehensive validation
  const handleStartPayment = () => {
    if (!paymentData) {
      Alert.alert('Error', 'Payment data is not available. Please try again.');
      return;
    }

    console.log('=== STARTING PAYMENT PROCESS ===');
    console.log('🚀 Starting PayHere payment...');
    console.log('Platform:', Platform.OS);
    console.log('PayHere SDK Available:', !!PayHere);
    console.log('Currency:', paymentData.currency);
    console.log('Amount:', paymentData.amount);
    console.log('Sandbox:', paymentData.sandbox);
    
    // ✅ Final pre-payment validation
    if (!isLKRCurrency(paymentData.currency)) {
      Alert.alert(
        'Currency Error',
        `This payment uses ${paymentData.currency} currency, but only ${PAYHERE_CONSTANTS.SUPPORTED_CURRENCY} is supported.`,
        [{ text: 'OK', onPress: () => setIsSubmitting(false) }]
      );
      return;
    }
    
    setIsSubmitting(true);

    if (Platform.OS === 'web') {
      // Handle web payment
      console.log('🌐 Using web payment flow');
      handleWebPayment();
    } else {
      // Handle native payment
      console.log('📱 Using native payment flow');
      
      if (!PayHere) {
        Alert.alert(
          'SDK Not Available',
          'PayHere SDK is not available on this platform. Please use a physical device or try the web version.',
          [{ text: 'OK', onPress: () => setIsSubmitting(false) }]
        );
        return;
      }

      try {
        const paymentObject = createPayHerePaymentObject(paymentData);
        console.log('✅ PayHere Payment Object created successfully');
        console.log('Final payment object:', {
          order_id: paymentObject.order_id,
          amount: paymentObject.amount,
          currency: paymentObject.currency,
          custom_1: paymentObject.custom_1,
          custom_2: paymentObject.custom_2,
          sandbox: paymentObject.sandbox
        });

        // ✅ Start payment with enhanced logging
        console.log('🚀 Calling PayHere.startPayment...');
        PayHere.startPayment(
          paymentObject,
          onPaymentCompleted,
          onPaymentError,
          onPaymentDismissed
        );
        
        console.log('✅ PayHere.startPayment called successfully');
        
      } catch (error) {
        console.error('❌ Error starting native payment:', error);
        setIsSubmitting(false);
        Alert.alert(
          'Payment Error',
          `Failed to start payment process: ${error instanceof Error ? error.message : 'Unknown error'}`,
          [{ text: 'OK' }]
        );
      }
    }
  };

  const handleGoBack = () => {
    Alert.alert(
      'Cancel Payment',
      `Are you sure you want to cancel this ${paymentData?.currency || 'LKR'} payment? Your booking will not be confirmed.`,
      [
        { text: 'Continue Payment', style: 'cancel' },
        { 
          text: 'Cancel Payment', 
          style: 'destructive',
          onPress: () => {
            console.log('👤 User cancelled payment and went back');
            router.back();
          }
        }
      ]
    );
  };

  // ✅ Enhanced debug function
  const debugPaymentData = () => {
    console.log('=== PAYMENT DATA DEBUG ===');
    console.log('Platform:', Platform.OS);
    console.log('PayHere SDK Available:', !!PayHere);
    console.log('Supported Currency:', PAYHERE_CONSTANTS.SUPPORTED_CURRENCY);
    console.log('All payment data:', paymentData);
    
    if (paymentData) {
      try {
        const paymentObject = createPayHerePaymentObject(paymentData);
        console.log('PayHere Object would be:', paymentObject);
        console.log('Currency validation:', isLKRCurrency(paymentData.currency));
        console.log('Data validation:', isValidPaymentData(paymentData));
      } catch (error) {
        console.log('Error creating payment object:', error);
      }
      
      console.log('Form fields for web:');
      Object.entries(paymentData).forEach(([key, value]) => {
        if (key !== 'sandbox' && value !== undefined && value !== null) {
          console.log(`  ${key}: ${value}`);
        }
      });
    }
    console.log('========================');
    
    Alert.alert(
      'Payment Debug Info',
      `Platform: ${Platform.OS}\nSDK Available: ${!!PayHere}\nMerchant ID: ${paymentData?.merchant_id || 'N/A'}\nOrder ID: ${paymentData?.order_id || 'N/A'}\nAmount: ${paymentData?.amount || 'N/A'}\nCurrency: ${paymentData?.currency || 'N/A'} (${isLKRCurrency(paymentData?.currency || '') ? 'Supported' : 'NOT SUPPORTED'})\nSandbox: ${paymentData?.sandbox}\nBooking ID: ${bookingId}`,
      [{ text: 'OK' }]
    );
  };

  // Error state
  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor="#ef4444" barStyle="light-content" />
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>❌</Text>
          <Text style={styles.errorTitle}>Payment Setup Error</Text>
          <Text style={styles.errorText}>{error}</Text>
          <View style={styles.errorInfoBox}>
            <Text style={styles.errorInfoTitle}>ℹ️ Payment Information</Text>
            <Text style={styles.errorInfoText}>
              • Only {PAYHERE_CONSTANTS.SUPPORTED_CURRENCY} currency is supported{'\n'}
              • Payment data must be properly formatted{'\n'}
              • Check your booking and try again
            </Text>
          </View>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor="#fde047" barStyle="dark-content" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#facc15" />
          <Text style={styles.loadingText}>Loading payment details...</Text>
          <Text style={styles.loadingSubText}>
            Preparing {PAYHERE_CONSTANTS.SUPPORTED_CURRENCY} payment
          </Text>
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

      {/* Platform & Currency Info */}
      <View style={styles.platformInfo}>
        <Text style={styles.platformText}>
          💻 {Platform.OS} | 
          {Platform.OS === 'web' ? ' Form Submission' : (PayHere ? ' SDK Ready' : ' SDK N/A')} | 
          💰 {paymentData?.currency} Only
          {paymentData?.custom_1 && ` | Booking: ${paymentData.custom_1}`}
        </Text>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Payment Summary Card */}
        <View style={styles.paymentCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardIcon}>💳</Text>
            <Text style={styles.cardTitle}>Payment Summary</Text>
            <View style={styles.currencyBadge}>
              <Text style={styles.currencyBadgeText}>{paymentData?.currency}</Text>
            </View>
          </View>

          <View style={styles.amountContainer}>
            <Text style={styles.amountLabel}>Total Amount</Text>
            <Text style={styles.amountValue}>
              {paymentData?.currency} {paymentData?.amount}
            </Text>
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
              <Text style={styles.detailLabel}>Merchant:</Text>
              <Text style={styles.detailValue}>{paymentData?.merchant_id}</Text>
            </View>

            {paymentData?.custom_1 && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Booking ID:</Text>
                <Text style={styles.detailValue}>{paymentData.custom_1}</Text>
              </View>
            )}

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Environment:</Text>
              <Text style={[styles.detailValue, paymentData?.sandbox ? styles.sandboxText : styles.liveText]}>
                {paymentData?.sandbox ? '🧪 Sandbox' : '🔴 Live'}
              </Text>
            </View>
          </View>
        </View>

        {/* Currency Support Notice */}
        <View style={styles.currencyNoticeCard}>
          <Text style={styles.infoIcon}>💱</Text>
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>Currency Support</Text>
            <Text style={styles.infoText}>
              This payment system only accepts {PAYHERE_CONSTANTS.SUPPORTED_CURRENCY} (Sri Lankan Rupees). 
              All transactions are processed in {PAYHERE_CONSTANTS.SUPPORTED_CURRENCY}.
            </Text>
          </View>
        </View>

        {/* Platform-specific Info Card */}
        {isWebPlatform ? (
          <View style={styles.webInfoCard}>
            <Text style={styles.infoIcon}>🌐</Text>
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Web Platform Payment</Text>
              <Text style={styles.infoText}>
                Payment will open in a new tab through PayHere's secure checkout page. 
                Complete the payment and return to this page to continue.
              </Text>
            </View>
          </View>
        ) : (
          <View style={styles.sdkCard}>
            <Text style={styles.sdkCardIcon}>📱</Text>
            <View style={styles.infoContent}>
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
          <Text style={styles.methodsNote}>
            All payments processed securely by PayHere in {PAYHERE_CONSTANTS.SUPPORTED_CURRENCY}
          </Text>
        </View>

        {/* Warning for unsupported platforms */}
        {!canProceedPayment && (
          <View style={styles.warningCard}>
            <Text style={styles.warningIcon}>⚠️</Text>
            <View style={styles.infoContent}>
              <Text style={styles.warningTitle}>Payment Not Available</Text>
              <Text style={styles.warningText}>
                PayHere payment is not available on this platform configuration. 
                Please use a physical device for the best experience.
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

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
              <Text style={styles.proceedAmount}>
                {paymentData?.currency} {paymentData?.amount}
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

// ✅ UPDATED: Enhanced styles with LKR-specific design
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
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
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
    flex: 1,
  },
  // ✅ NEW: Currency badge
  currencyBadge: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#fbbf24',
  },
  currencyBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#92400e',
  },
  amountContainer: {
    alignItems: 'center',
    marginBottom: 24,
    paddingVertical: 20,
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
    fontSize: 36,
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
  sandboxText: {
    color: '#f59e0b',
  },
  liveText: {
    color: '#ef4444',
  },
  // ✅ NEW: Enhanced info cards
  currencyNoticeCard: {
    backgroundColor: '#fef3c7',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: '#fbbf24',
  },
  webInfoCard: {
    backgroundColor: '#eff6ff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: '#dbeafe',
  },
  sdkCard: {
    backgroundColor: '#f0f9ff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: '#bae6fd',
  },
  infoIcon: {
    fontSize: 24,
    marginRight: 12,
    marginTop: 2,
  },
  infoContent: {
    flex: 1,
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
    lineHeight: 20,
  },
  sdkCardIcon: {
    fontSize: 24,
    marginRight: 12,
    marginTop: 2,
  },
  sdkCardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0284c7',
    marginBottom: 8,
  },
  sdkCardText: {
    fontSize: 14,
    color: '#0369a1',
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
    marginBottom: 12,
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
    fontWeight: '500',
  },
  methodsNote: {
    fontSize: 11,
    color: '#9ca3af',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  warningCard: {
    backgroundColor: '#fef2f2',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  warningIcon: {
    fontSize: 24,
    marginRight: 12,
    marginTop: 2,
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
    lineHeight: 18,
  },
  bottomContainer: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 4,
  },
  proceedButton: {
    backgroundColor: '#10b981',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
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
    flex: 1,
    textAlign: 'center',
  },
  proceedAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
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
    padding: 32,
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 16,
    textAlign: 'center',
  },
  loadingSubText: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 8,
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
  errorInfoBox: {
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    width: '100%',
  },
  errorInfoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  errorInfoText: {
    fontSize: 13,
    color: '#6b7280',
    lineHeight: 18,
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