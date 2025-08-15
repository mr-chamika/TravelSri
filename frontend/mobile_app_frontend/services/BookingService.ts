// Enhanced BookingService with PayHere Debugging and Payment Status Checking - LKR Currency Only

import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://localhost:8080';

// Type definitions
interface BookingRequest {
  guideId: string;
  date: string;
  time: string;
  duration: number;
  numberOfPeople: number;
  specialRequests?: string;
  contactInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  currency?: string;
}

interface BookingResponse {
  success: boolean;
  bookingId: string;
  orderId?: string;
  amount: number;
  currency: string;
  status: string;
  message?: string;
}

interface PaymentCheckoutResponse {
  success: boolean;
  orderId: string;
  amount: number;
  currency: string;
  checkoutUrl: string;
  paymentObject: any;
  sandbox: boolean;
  message?: string;
}

interface PaymentStatusResponse {
  success: boolean;
  orderId: string;
  bookingId?: string;
  status: string;
  confirmed: boolean;
  amount?: number;
  currency?: string;
  paymentId?: string;
  transactionId?: string;
  statusCode?: number;
  message?: string;
  timestamp?: string;
}

interface BulkPaymentStatusResponse {
  success: boolean;
  results: Array<{
    orderId: string;
    status: string;
    confirmed: boolean;
    error?: string;
  }>;
  summary: {
    total: number;
    confirmed: number;
    pending: number;
    failed: number;
  };
}

class BookingService {

  // ==================== ENHANCED PAYMENT DEBUGGING ====================

  /**
   * DEBUG: Test PayHere Configuration
   */
  static async debugPayHereConfig(): Promise<any> {
    try {
      console.log('DEBUGGING: Testing PayHere configuration...');
      
      const response = await fetch(`${API_BASE_URL}/api/payments/payhere/debug/config-check`);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Config check failed: ${response.status} ${errorText}`);
      }
      
      const result = await response.json();
      console.log('PayHere Config Check Result:', result);
      
      if (result.config) {
        console.log('Configuration Summary:');
        console.log(`  - Merchant ID: ${result.config.merchantId}`);
        console.log(`  - Merchant Secret: ${result.config.merchantSecretExists ? 'EXISTS' : 'MISSING'}`);
        console.log(`  - Sandbox Mode: ${result.config.sandboxMode}`);
        console.log(`  - Notify URL: ${result.config.notifyUrl}`);
        console.log(`  - Checkout URL: ${result.config.payhereCheckoutUrl}`);
        console.log(`  - Currency: LKR (Sri Lankan Rupees only)`);
      }
      
      return result;
    } catch (error) {
      console.error('PayHere Config Check Failed:', error);
      throw error;
    }
  }

  /**
   * DEBUG: Test Hash Generation
   */
  static async debugHashGeneration(testData?: any): Promise<any> {
    try {
      console.log('DEBUGGING: Testing hash generation...');
      
      const requestBody = testData || {
        merchantId: undefined,
        orderId: `DEBUG_${Date.now()}`,
        amount: '100.00',
        currency: 'LKR'
      };
      
      console.log('Hash test request:', requestBody);
      
      const response = await fetch(`${API_BASE_URL}/api/payments/payhere/debug/test-hash`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Hash test failed: ${response.status} ${errorText}`);
      }
      
      const result = await response.json();
      console.log('Hash Generation Test Result:', result);
      
      console.log('Hash Details:');
      console.log(`  - Generated Hash: ${result.generatedHash}`);
      console.log(`  - Hash Length: ${result.hashLength} (expected: 32)`);
      console.log(`  - Format Valid: ${result.hashFormatValid}`);
      console.log(`  - Secret Hash Sample: ${result.secretHashSample}`);
      console.log(`  - Currency: LKR (Sri Lankan Rupees only)`);
      
      return result;
    } catch (error) {
      console.error('Hash Generation Test Failed:', error);
      throw error;
    }
  }

  /**
   * DEBUG: Test Minimal Payment Creation
   */
  static async debugMinimalPayment(): Promise<any> {
    try {
      console.log('DEBUGGING: Testing minimal payment creation...');
      
      const response = await fetch(`${API_BASE_URL}/api/payments/payhere/debug/minimal-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currency: 'LKR' }),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Minimal payment test failed: ${response.status} ${errorText}`);
      }
      
      const result = await response.json();
      console.log('Minimal Payment Test Result:', result);
      
      if (result.paymentData) {
        console.log('Payment Object Summary:');
        console.log(`  - Merchant ID: ${result.paymentData.merchant_id}`);
        console.log(`  - Order ID: ${result.paymentData.order_id}`);
        console.log(`  - Amount: ${result.paymentData.amount}`);
        console.log(`  - Currency: ${result.paymentData.currency} (should be LKR)`);
        console.log(`  - Hash: ${result.paymentData.hash?.substring(0, 8)}...`);
        console.log(`  - Checkout URL: ${result.checkoutUrl}`);
      }
      
      if (result.fieldValidation) {
        const missingFields = Object.entries(result.fieldValidation)
          .filter(([key, valid]) => !valid)
          .map(([key]) => key);
        
        if (missingFields.length > 0) {
          console.warn('Missing/Invalid Fields:', missingFields);
        } else {
          console.log('All required fields present and valid');
        }
      }
      
      return result;
    } catch (error) {
      console.error('Minimal Payment Test Failed:', error);
      throw error;
    }
  }

  /**
   * DEBUG: Test with Real Booking
   */
  static async debugWithBooking(bookingId: string): Promise<any> {
    try {
      console.log('DEBUGGING: Testing with real booking:', bookingId);
      
      const response = await fetch(`${API_BASE_URL}/api/payments/payhere/debug/test-with-booking/${bookingId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currency: 'LKR' }),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Booking test failed: ${response.status} ${errorText}`);
      }
      
      const result = await response.json();
      console.log('Booking Test Result:', result);
      
      if (result.bookingInfo) {
        console.log('Booking Details:');
        console.log(`  - Booking ID: ${result.bookingInfo.id}`);
        console.log(`  - Amount: ${result.bookingInfo.amount}`);
        console.log(`  - Currency: ${result.bookingInfo.currency} (should be LKR)`);
        console.log(`  - Status: ${result.bookingInfo.status}`);
      }
      
      return result;
    } catch (error) {
      console.error('Booking Test Failed:', error);
      throw error;
    }
  }

  /**
   * DEBUG: Test Network Connectivity
   */
  static async debugNetworkConnectivity(): Promise<any> {
    try {
      console.log('DEBUGGING: Testing network connectivity...');
      
      const response = await fetch(`${API_BASE_URL}/api/payments/payhere/debug/network-test`);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Network test failed: ${response.status} ${errorText}`);
      }
      
      const result = await response.json();
      console.log('Network Test Result:', result);
      
      if (result.networkTests?.urlAccessibility) {
        console.log('URL Accessibility:');
        Object.entries(result.networkTests.urlAccessibility).forEach(([url, status]: [string, any]) => {
          const accessible = status.accessible ? 'OK' : 'FAIL';
          console.log(`  ${accessible} ${url}: ${status.responseCode || status.error}`);
        });
      }
      
      return result;
    } catch (error) {
      console.error('Network Test Failed:', error);
      throw error;
    }
  }

  /**
   * DEBUG: Full Payment Flow Test
   */
  static async debugFullPaymentFlow(): Promise<any> {
    try {
      console.log('DEBUGGING: Running full payment flow test...');
      
      const response = await fetch(`${API_BASE_URL}/api/payments/payhere/debug/full-flow-test`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currency: 'LKR' }),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Full flow test failed: ${response.status} ${errorText}`);
      }
      
      const result = await response.json();
      console.log('Full Flow Test Result:', result);
      
      if (result.testResults) {
        console.log('Test Results:');
        Object.entries(result.testResults).forEach(([test, status]) => {
          const icon = status === 'PASSED' ? 'PASS' : 'FAIL';
          console.log(`  ${icon} ${test}: ${status}`);
        });
      }
      
      return result;
    } catch (error) {
      console.error('Full Flow Test Failed:', error);
      throw error;
    }
  }

  /**
   * DEBUG: Comprehensive PayHere Diagnostic
   */
  static async runComprehensiveDiagnostic(bookingId?: string): Promise<any> {
    console.log('STARTING COMPREHENSIVE PAYHERE DIAGNOSTIC (LKR ONLY)...');
    console.log('=========================================================');
    
    const results: any = {
      timestamp: new Date().toISOString(),
      currency: 'LKR',
      tests: {},
      summary: {
        passed: 0,
        failed: 0,
        warnings: []
      }
    };
    
    try {
      // Test 1: Configuration Check
      console.log('\nTEST 1: Configuration Check');
      console.log('------------------------------');
      try {
        results.tests.configCheck = await this.debugPayHereConfig();
        results.summary.passed++;
        console.log('Configuration check passed');
      } catch (error) {
        results.tests.configCheck = { error: (error && typeof error === 'object' && 'message' in error) ? (error as any).message : String(error) };
        results.summary.failed++;
        console.log('Configuration check failed:', (error && typeof error === 'object' && 'message' in error) ? (error as any).message : String(error));
      }

      // Test 2: Hash Generation
      console.log('\nTEST 2: Hash Generation (LKR Currency)');
      console.log('------------------------------------------');
      try {
        results.tests.hashGeneration = await this.debugHashGeneration();
        results.summary.passed++;
        console.log('Hash generation passed');
      } catch (error) {
        results.tests.hashGeneration = { error: (error && typeof error === 'object' && 'message' in error) ? (error as any).message : String(error) };
        results.summary.failed++;
        console.log('Hash generation failed:', (error && typeof error === 'object' && 'message' in error) ? (error as any).message : String(error));
      }

      // Test 3: Network Connectivity
      console.log('\nTEST 3: Network Connectivity');
      console.log('--------------------------------');
      try {
        results.tests.networkTest = await this.debugNetworkConnectivity();
        results.summary.passed++;
        console.log('Network connectivity passed');
      } catch (error) {
        results.tests.networkTest = { error: (error && typeof error === 'object' && 'message' in error) ? (error as any).message : String(error) };
        results.summary.failed++;
        console.log('Network connectivity failed:', (error && typeof error === 'object' && 'message' in error) ? (error as any).message : String(error));
      }

      // Test 4: Minimal Payment Creation
      console.log('\nTEST 4: Minimal Payment Creation (LKR Only)');
      console.log('-----------------------------------------------');
      try {
        results.tests.minimalPayment = await this.debugMinimalPayment();
        results.summary.passed++;
        console.log('Minimal payment creation passed');
      } catch (error) {
        results.tests.minimalPayment = { error: (error && typeof error === 'object' && 'message' in error) ? (error as any).message : String(error) };
        results.summary.failed++;
        console.log('Minimal payment creation failed:', (error && typeof error === 'object' && 'message' in error) ? (error as any).message : String(error));
      }

      // Test 5: Real Booking Test
      if (bookingId) {
        console.log('\nTEST 5: Real Booking Test (LKR Currency)');
        console.log('--------------------------------------------');
        try {
          results.tests.bookingTest = await this.debugWithBooking(bookingId);
          results.summary.passed++;
          console.log('Real booking test passed');
        } catch (error) {
          results.tests.bookingTest = { error: (error && typeof error === 'object' && 'message' in error) ? (error as any).message : String(error) };
          results.summary.failed++;
          console.log('Real booking test failed:', (error && typeof error === 'object' && 'message' in error) ? (error as any).message : String(error));
        }
      }

      // Test 6: Full Flow Test
      console.log('\nTEST 6: Full Flow Test (LKR Currency)');
      console.log('-----------------------------------------');
      try {
        results.tests.fullFlowTest = await this.debugFullPaymentFlow();
        results.summary.passed++;
        console.log('Full flow test passed');
      } catch (error) {
        results.tests.fullFlowTest = { error: (error && typeof error === 'object' && 'message' in error) ? (error as any).message : String(error) };
        results.summary.failed++;
        console.log('Full flow test failed:', (error && typeof error === 'object' && 'message' in error) ? (error as any).message : String(error));
      }

      // Analysis and Recommendations
      console.log('\nDIAGNOSTIC SUMMARY (LKR CURRENCY ONLY)');
      console.log('==========================================');
      console.log(`Tests Passed: ${results.summary.passed}`);
      console.log(`Tests Failed: ${results.summary.failed}`);
      console.log(`Success Rate: ${((results.summary.passed / (results.summary.passed + results.summary.failed)) * 100).toFixed(1)}%`);
      console.log(`Currency: LKR (Sri Lankan Rupees only)`);

      const recommendations = this.generateRecommendations(results);
      results.recommendations = recommendations;

      console.log('\nRECOMMENDATIONS:');
      recommendations.forEach((rec, index) => {
        console.log(`${index + 1}. ${rec}`);
      });

      console.log('\nDIAGNOSTIC COMPLETE');
      console.log('======================');

      return results;

    } catch (error) {
      console.error('Diagnostic failed with unexpected error:', error);
      results.criticalError = (error && typeof error === 'object' && 'message' in error) ? (error as any).message : String(error);
      return results;
    }
  }

  /**
   * Generate recommendations based on test results
   */
  static generateRecommendations(results: any): string[] {
    const recommendations: string[] = [];

    if (results.tests.configCheck?.error) {
      recommendations.push('Fix PayHere configuration: Check merchant ID and secret in application.properties');
    }

    if (results.tests.hashGeneration?.error) {
      recommendations.push('Fix hash generation: Verify merchant secret and hash algorithm implementation');
    }

    if (results.tests.networkTest?.error) {
      recommendations.push('Fix network connectivity: Ensure server can reach PayHere URLs');
    }

    if (results.tests.minimalPayment?.error) {
      recommendations.push('Fix payment creation: Check required fields and data formatting');
    }

    if (results.tests.configCheck?.config && !results.tests.configCheck.config.merchantSecretExists) {
      recommendations.push('Domain approval required: Add your domain to PayHere Dashboard > Integrations');
    }

    recommendations.push('Currency enforcement: All payments are processed in LKR (Sri Lankan Rupees) only');

    if (results.summary.failed > 0) {
      recommendations.push('Contact PayHere support if issues persist: support@payhere.lk');
    }

    if (recommendations.length === 1) {
      recommendations.push('All tests passed! Your PayHere integration is configured correctly for LKR payments.');
    }

    return recommendations;
  }

  // ==================== ENHANCED PAYMENT CREATION ====================

  /**
   * Enhanced createPaymentCheckout with comprehensive debugging - LKR Currency Only
   */
  static async createPaymentCheckout(bookingId: string): Promise<PaymentCheckoutResponse> {
    try {
      console.log('ENHANCED PAYMENT CHECKOUT CREATION (LKR ONLY)');
      console.log('=================================================');
      console.log(`Booking ID: ${bookingId}`);
      console.log(`Timestamp: ${new Date().toISOString()}`);
      console.log(`Currency: LKR (Sri Lankan Rupees only)`);
      console.log(`API URL: ${API_BASE_URL}/api/payments/payhere/create-checkout`);

      if (!bookingId || bookingId.trim() === '') {
        throw new Error('Booking ID is required and cannot be empty');
      }

      console.log('\nPRE-FLIGHT CHECKS:');
      console.log('1. Testing API connectivity...');
      
      try {
        const healthResponse = await fetch(`${API_BASE_URL}/api/payments/payhere/health`);
        if (healthResponse.ok) {
          const healthData = await healthResponse.json();
          console.log('API server is reachable:', healthData.message);
          console.log('Merchant ID configured:', healthData.merchantId);
          console.log('Sandbox mode:', healthData.sandboxMode);
          console.log('Currency: LKR (enforced)');
        } else {
          console.warn('API health check failed:', healthResponse.status);
        }
      } catch (error) {
        console.warn('API server connectivity issue:', error && typeof error === 'object' && 'message' in error ? (error as any).message : String(error));
      }

      const requestBody = { 
        bookingId: bookingId.trim(),
        currency: 'LKR',
        amount: null,
        firstName: 'Customer',
        lastName: 'User',
        email: 'customer@example.com',
        phone: '+94771234567',
        address: 'Colombo',
        city: 'Colombo',
        country: 'Sri Lanka',
        items: 'Guide Service Booking'
      };
      
      console.log('\nENHANCED REQUEST DETAILS (LKR ONLY):');
      console.log('Body:', JSON.stringify(requestBody, null, 2));
      console.log('Headers: Content-Type: application/json');
      console.log('Currency enforced: LKR');

      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        console.log('Request timeout (30s) - aborting...');
        controller.abort();
      }, 30000);

      console.log('\nSENDING ENHANCED REQUEST...');
      const startTime = Date.now();

      const response = await fetch(`${API_BASE_URL}/api/payments/payhere/create-checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      const responseTime = Date.now() - startTime;

      console.log('\nRESPONSE RECEIVED:');
      console.log(`Response time: ${responseTime}ms`);
      console.log(`Status: ${response.status} ${response.statusText}`);
      console.log('Headers:', JSON.stringify([...response.headers.entries()], null, 2));

      if (!response.ok) {
        const errorText = await response.text();
        console.log('\nERROR RESPONSE ANALYSIS:');
        console.log('Status:', response.status);
        console.log('Status Text:', response.statusText);
        console.log('Error Body:', errorText);
        
        if (response.status === 400) {
          console.log('\n400 BAD REQUEST ANALYSIS:');
          console.log('This typically indicates:');
          console.log('1. Missing required request fields');
          console.log('2. Invalid booking ID format');
          console.log('3. Booking not found in database');
          console.log('4. Invalid amount or currency (must be LKR)');
        } else if (response.status === 401) {
          console.log('\n401 UNAUTHORIZED ANALYSIS:');
          console.log('This typically indicates:');
          console.log('1. Wrong merchant ID or secret');
          console.log('2. Domain not approved by PayHere');
          console.log('3. Hash calculation error');
          console.log('4. Account verification issues');
          console.log('\nRun diagnostic: BookingService.runComprehensiveDiagnostic()');
        } else if (response.status === 500) {
          console.log('\n500 INTERNAL SERVER ERROR ANALYSIS:');
          console.log('This typically indicates:');
          console.log('1. Backend configuration issues');
          console.log('2. Database connection problems');
          console.log('3. Hash generation failures');
          console.log('4. PayHere API communication issues');
        }

        throw new Error(`Failed to create payment checkout: ${response.status} ${errorText}`);
      }

      const result = await response.json();
      
      console.log('\nSUCCESS RESPONSE ANALYSIS:');
      console.log('Response keys:', Object.keys(result));
      console.log('Success:', result.success);
      console.log('Order ID:', result.orderId);
      console.log('Amount:', result.amount, result.currency || 'LKR');
      console.log('Currency:', result.currency || 'LKR', '(should be LKR)');
      console.log('Merchant ID:', result.paymentObject?.merchant_id);
      console.log('Checkout URL:', result.checkoutUrl);
      console.log('Sandbox Mode:', result.sandbox);

      if (result.paymentObject) {
        console.log('\nPAYMENT OBJECT VALIDATION (LKR CURRENCY):');
        const requiredFields = ['merchant_id', 'order_id', 'amount', 'currency', 'hash', 'first_name', 'last_name', 'email'];
        const missingFields = requiredFields.filter(field => !result.paymentObject[field]);
        const emptyFields = requiredFields.filter(field => 
          result.paymentObject[field] && result.paymentObject[field].toString().trim() === ''
        );
        
        if (result.paymentObject.currency !== 'LKR') {
          console.log('CURRENCY ERROR: Expected LKR, got:', result.paymentObject.currency);
          throw new Error(`Invalid currency: Expected LKR, got ${result.paymentObject.currency}`);
        } else {
          console.log('Currency validation passed: LKR');
        }
        
        if (missingFields.length === 0 && emptyFields.length === 0) {
          console.log('All required fields present and non-empty');
        } else {
          if (missingFields.length > 0) {
            console.log('Missing required fields:', missingFields);
          }
          if (emptyFields.length > 0) {
            console.log('Empty required fields:', emptyFields);
          }
          throw new Error(`Invalid payment object: missing fields [${missingFields.join(', ')}], empty fields [${emptyFields.join(', ')}]`);
        }

        const hash = result.paymentObject.hash;
        if (hash && hash.length === 32 && /^[A-F0-9]+$/.test(hash)) {
          console.log('Hash format valid: 32 chars, uppercase hex');
        } else {
          console.log('Hash format invalid:', hash);
          console.log('Expected: 32 uppercase hexadecimal characters');
        }

        console.log('Hash:', hash?.substring(0, 8) + '...');
        console.log('Currency:', result.paymentObject.currency, '(LKR enforced)');
        console.log('Custom tracking fields:');
        console.log('  - custom_1:', result.paymentObject.custom_1);
        console.log('  - custom_2:', result.paymentObject.custom_2);
      } else {
        console.log('CRITICAL: No paymentObject in response!');
        throw new Error('Server response missing paymentObject');
      }

      console.log('\nPAYMENT CHECKOUT CREATED SUCCESSFULLY (LKR)!');
      console.log('===============================================');

      return result;

    } catch (error) {
      console.log('\nPAYMENT CREATION FAILED');
      console.log('===========================');
      
      if (typeof error === 'object' && error !== null && 'name' in error && (error as any).name === 'AbortError') {
        console.error('Request timeout after 30 seconds');
        console.error('This might indicate:');
        console.error('  1. Network connectivity issues');
        console.error('  2. Server overload');
        console.error('  3. PayHere API unavailability');
        throw new Error('Request timeout - please check your network connection');
      }

      console.error('Error type:', error && typeof error === 'object' && 'constructor' in error ? (error as any).constructor.name : typeof error);
      console.error('Error message:', error && typeof error === 'object' && 'message' in error ? (error as any).message : String(error));
      
      console.log('\nTROUBLESHOOTING STEPS:');
      console.log('1. Run: BookingService.runComprehensiveDiagnostic()');
      console.log('2. Check: BookingService.debugPayHereConfig()');
      console.log('3. Verify: PayHere Dashboard > Integrations > Domain Status');
      console.log('4. Test: BookingService.debugHashGeneration()');
      console.log('5. Ensure: Currency is set to LKR only');
      
      throw error;
    }
  }

  // ==================== EXISTING METHODS ====================
  
  static async createBooking(bookingData: BookingRequest): Promise<BookingResponse> {
    try {
      console.log('BookingService: Creating booking with data:', bookingData);
      console.log('API URL:', `${API_BASE_URL}/api/bookings/create`);
      console.log('Currency: LKR (enforced)');
      
      const bookingDataWithLKR = {
        ...bookingData,
        currency: 'LKR'
      };
      
      const response = await fetch(`${API_BASE_URL}/api/bookings/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingDataWithLKR),
      });

      console.log('BookingService: Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('BookingService: Error response:', errorText);
        throw new Error(`Failed to create booking: ${response.status} ${errorText}`);
      }

      const result = await response.json();
      console.log('BookingService: Booking created successfully:', result);
      console.log('Currency enforced: LKR');
      return result;
    } catch (error) {
      console.error('BookingService: createBooking error:', error);
      throw error;
    }
  }

  // ==================== PAYMENT STATUS CHECKING METHODS ====================

  /**
   * Check payment status for a specific order
   */
  static async checkPaymentStatus(orderId: string, bookingId?: string): Promise<PaymentStatusResponse> {
  try {
    console.log('Checking payment status...');
    console.log('Order ID:', orderId);
    console.log('Booking ID:', bookingId);
    console.log('Currency: LKR (enforced)');

    if (!orderId || orderId.trim() === '') {
      throw new Error('Order ID is required');
    }

    const requestBody = {
      orderId: orderId.trim(),
      bookingId: bookingId?.trim(),
      currency: 'LKR'
    };

    console.log('Status check request:', requestBody);

    const response = await fetch(`${API_BASE_URL}/api/payments/payhere/status/check`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    console.log('Status check response:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Payment status check failed:', response.status, errorText);
      
      // Handle specific error cases
      if (response.status === 404) {
        throw new Error(`Payment not found for Order ID: ${orderId}`);
      } else if (response.status === 400) {
        throw new Error(`Invalid request parameters: ${errorText}`);
      } else if (response.status === 500) {
        throw new Error(`Server error while checking payment status: ${errorText}`);
      }
      
      throw new Error(`Payment status check failed: ${response.status} ${errorText}`);
    }

    const result = await response.json();
    console.log('Payment status result:', result);
    console.log('Status:', result.status);
    console.log('Confirmed:', result.confirmed);
    console.log('Amount:', result.amount, result.currency);

    // Validate response structure
    if (!result.hasOwnProperty('confirmed') || !result.hasOwnProperty('status')) {
      throw new Error('Invalid response format from payment status API');
    }

    return result;

  } catch (error) {
    console.error('Error checking payment status:', error);
    throw error;
  }
}

  /**
   * Check payment status with retry mechanism
   */
  static async checkPaymentStatusWithRetry(
  orderId: string, 
  bookingId?: string, 
  maxRetries: number = 3,
  retryDelayMs: number = 2000
): Promise<PaymentStatusResponse> {
  let lastError: Error | null = null;
  let retryCount = 0;

  while (retryCount < maxRetries) {
    try {
      retryCount++;
      console.log(`Payment status check attempt ${retryCount}/${maxRetries}`);
      
      const result = await this.checkPaymentStatus(orderId, bookingId);
      
      // Success case - payment confirmed
      if (result.confirmed) {
        console.log(`Payment confirmed on attempt ${retryCount}!`);
        return result;
      }
      
      // Payment not confirmed but API call successful
      if (retryCount < maxRetries) {
        console.log(`Payment not confirmed yet, retrying in ${retryDelayMs}ms...`);
        await new Promise(resolve => setTimeout(resolve, retryDelayMs));
        
        // Exponential backoff for subsequent retries
        retryDelayMs = Math.min(retryDelayMs * 1.5, 10000);
      } else {
        console.log('Max retries reached, returning last result');
        return result;
      }

    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.warn(`Attempt ${retryCount} failed:`, lastError.message);
      
      // Don't retry on certain errors
      if (lastError.message.includes('not found') || 
          lastError.message.includes('Invalid request')) {
        console.log('Non-retryable error encountered, stopping retries');
        throw lastError;
      }
      
      if (retryCount < maxRetries) {
        console.log(`Retrying in ${retryDelayMs}ms...`);
        await new Promise(resolve => setTimeout(resolve, retryDelayMs));
        retryDelayMs = Math.min(retryDelayMs * 1.5, 10000);
      }
    }
  }

  throw lastError || new Error('Payment status check failed after all retries');
}

  /**
   * Get detailed payment information
   */
  static async getPaymentDetails(orderId: string): Promise<PaymentStatusResponse> {
  try {
    console.log('Getting payment details for Order ID:', orderId);

    if (!orderId || orderId.trim() === '') {
      throw new Error('Order ID is required');
    }

    const response = await fetch(`${API_BASE_URL}/api/payments/payhere/status/${orderId.trim()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      
      if (response.status === 404) {
        throw new Error(`Payment details not found for Order ID: ${orderId}`);
      }
      
      throw new Error(`Failed to get payment details: ${response.status} ${errorText}`);
    }

    const result = await response.json();
    console.log('Payment details retrieved:', result);
    
    return result;

  } catch (error) {
    console.error('Error getting payment details:', error);
    throw error;
  }
}

  /**
   * Monitor payment status with polling
   */
  static monitorPaymentStatus(
  orderId: string,
  bookingId: string,
  onStatusUpdate: (status: PaymentStatusResponse) => void,
  onSuccess: (status: PaymentStatusResponse) => void,
  onError: (error: Error) => void,
  pollIntervalMs: number = 30000,
  timeoutMs: number = 300000
): { stop: () => void } {
  console.log('Starting payment status monitoring...');
  console.log('Poll interval:', pollIntervalMs + 'ms');
  console.log('Timeout:', timeoutMs + 'ms');

  const startTime = Date.now();
  let pollCount = 0;
  let isActive = true;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  const cleanup = () => {
    isActive = false;
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  const poll = async () => {
    if (!isActive) return;

    try {
      pollCount++;
      console.log(`Payment status poll #${pollCount}`);

      const status = await this.checkPaymentStatus(orderId, bookingId);
      
      if (!isActive) return; // Check if monitoring was stopped during API call
      
      onStatusUpdate(status);

      if (status.confirmed) {
        console.log('Payment confirmed! Stopping monitoring.');
        cleanup();
        onSuccess(status);
        return;
      }

      // Check timeout
      if (Date.now() - startTime >= timeoutMs) {
        console.log('Monitoring timeout reached');
        cleanup();
        onError(new Error('Payment monitoring timeout'));
        return;
      }

      // Schedule next poll
      if (isActive) {
        timeoutId = setTimeout(poll, pollIntervalMs);
      }

    } catch (error) {
      console.error('Error during payment monitoring:', error);
      cleanup();
      onError(error instanceof Error ? error : new Error(String(error)));
    }
  };

  // Start polling
  poll();

  // Return cleanup function
  return {
    stop: cleanup
  };
}

  /**
   * Bulk check multiple payment statuses
   */
  static async bulkCheckPaymentStatus(orderIds: string[]): Promise<BulkPaymentStatusResponse> {
  try {
    console.log('Bulk checking payment status for', orderIds.length, 'payments');

    if (!orderIds || orderIds.length === 0) {
      throw new Error('Order IDs array cannot be empty');
    }

    // Validate and clean order IDs
    const cleanOrderIds = orderIds
      .filter(id => id && id.trim() !== '')
      .map(id => id.trim());

    if (cleanOrderIds.length === 0) {
      throw new Error('No valid Order IDs provided');
    }

    if (cleanOrderIds.length !== orderIds.length) {
      console.warn(`Filtered out ${orderIds.length - cleanOrderIds.length} invalid Order IDs`);
    }

    const response = await fetch(`${API_BASE_URL}/api/payments/payhere/status/bulk-check`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ orderIds: cleanOrderIds }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Bulk payment status check failed: ${response.status} ${errorText}`);
    }

    const result = await response.json();
    console.log('Bulk payment status results:', result);

    // Validate response structure
    if (!result.results || !Array.isArray(result.results)) {
      throw new Error('Invalid bulk status response format');
    }

    return result;

  } catch (error) {
    console.error('Error in bulk payment status check:', error);
    throw error;
  }
}
  /**
   * Check if payment service is healthy
   */
 static async checkPaymentServiceHealth(): Promise<any> {
  try {
    console.log('Checking payment service health...');

    const response = await fetch(`${API_BASE_URL}/api/payments/payhere/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Payment service health check failed: ${response.status} ${errorText}`);
    }

    const result = await response.json();
    console.log('Payment service health:', result);

    return result;

  } catch (error) {
    console.error('Error checking payment service health:', error);
    throw error;
  }
}


  // ==================== BOOKING MANAGEMENT METHODS ====================

  /**
   * Get booking details by ID
   */
  static async getBookingById(bookingId: string): Promise<any> {
    try {
      console.log('Getting booking details for ID:', bookingId);

      const response = await fetch(`${API_BASE_URL}/api/bookings/${bookingId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to get booking: ${response.status} ${errorText}`);
      }

      const result = await response.json();
      console.log('Booking details retrieved:', result);

      return result;

    } catch (error) {
      console.error('Error getting booking details:', error);
      throw error;
    }
  }

  /**
   * Update booking status
   */
  static async updateBookingStatus(bookingId: string, status: string): Promise<any> {
    try {
      console.log('Updating booking status:', bookingId, status);

      const response = await fetch(`${API_BASE_URL}/api/bookings/${bookingId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update booking status: ${response.status} ${errorText}`);
      }

      const result = await response.json();
      console.log('Booking status updated:', result);

      return result;

    } catch (error) {
      console.error('Error updating booking status:', error);
      throw error;
    }
  }

  /**
   * Cancel booking
   */
  static async cancelBooking(bookingId: string, reason?: string): Promise<any> {
    try {
      console.log('Cancelling booking:', bookingId, reason);

      const response = await fetch(`${API_BASE_URL}/api/bookings/${bookingId}/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to cancel booking: ${response.status} ${errorText}`);
      }

      const result = await response.json();
      console.log('Booking cancelled:', result);

      return result;

    } catch (error) {
      console.error('Error cancelling booking:', error);
      throw error;
    }
  }

  /**
   * Get user bookings
   */
  static async getUserBookings(userId: string): Promise<any[]> {
    try {
      console.log('Getting bookings for user:', userId);

      const response = await fetch(`${API_BASE_URL}/api/bookings/user/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to get user bookings: ${response.status} ${errorText}`);
      }

      const result = await response.json();
      console.log('User bookings retrieved:', result.length);

      return result;

    } catch (error) {
      console.error('Error getting user bookings:', error);
      throw error;
    }
  }

  // ==================== LOCAL STORAGE METHODS ====================

  /**
   * Save booking data to local storage
   */
  static async saveBookingToStorage(booking: any): Promise<void> {
    try {
      const bookings = await this.getBookingsFromStorage();
      bookings.push(booking);
      await AsyncStorage.setItem('bookings', JSON.stringify(bookings));
      console.log('Booking saved to local storage');
    } catch (error) {
      console.error('Error saving booking to storage:', error);
    }
  }

  /**
   * Get bookings from local storage
   */
  static async getBookingsFromStorage(): Promise<any[]> {
    try {
      const bookingsJson = await AsyncStorage.getItem('bookings');
      return bookingsJson ? JSON.parse(bookingsJson) : [];
    } catch (error) {
      console.error('Error getting bookings from storage:', error);
      return [];
    }
  }

  /**
   * Update booking in local storage
   */
  static async updateBookingInStorage(bookingId: string, updatedData: any): Promise<void> {
    try {
      const bookings = await this.getBookingsFromStorage();
      const index = bookings.findIndex(b => b.id === bookingId);
      if (index !== -1) {
        bookings[index] = { ...bookings[index], ...updatedData };
        await AsyncStorage.setItem('bookings', JSON.stringify(bookings));
        console.log('Booking updated in local storage');
      }
    } catch (error) {
      console.error('Error updating booking in storage:', error);
    }
  }

  /**
   * Remove booking from local storage
   */
  static async removeBookingFromStorage(bookingId: string): Promise<void> {
    try {
      const bookings = await this.getBookingsFromStorage();
      const filteredBookings = bookings.filter(b => b.id !== bookingId);
      await AsyncStorage.setItem('bookings', JSON.stringify(filteredBookings));
      console.log('Booking removed from local storage');
    } catch (error) {
      console.error('Error removing booking from storage:', error);
    }
  }

  /**
   * Clear all bookings from local storage
   */
  static async clearBookingsFromStorage(): Promise<void> {
    try {
      await AsyncStorage.removeItem('bookings');
      console.log('All bookings cleared from local storage');
    } catch (error) {
      console.error('Error clearing bookings from storage:', error);
    }
  }

  // ==================== UTILITY METHODS ====================

  /**
   * Format currency amount
   */
  static formatCurrency(amount: number, currency: string = 'LKR'): string {
    return new Intl.NumberFormat('si-LK', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  }

  /**
   * Validate booking data
   */
  static validateBookingData(bookingData: BookingRequest): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!bookingData.guideId) {
      errors.push('Guide ID is required');
    }

    if (!bookingData.date) {
      errors.push('Date is required');
    }

    if (!bookingData.time) {
      errors.push('Time is required');
    }

    if (!bookingData.duration || bookingData.duration <= 0) {
      errors.push('Duration must be greater than 0');
    }

    if (!bookingData.numberOfPeople || bookingData.numberOfPeople <= 0) {
      errors.push('Number of people must be greater than 0');
    }

    if (!bookingData.contactInfo) {
      errors.push('Contact information is required');
    } else {
      if (!bookingData.contactInfo.firstName) {
        errors.push('First name is required');
      }
      if (!bookingData.contactInfo.lastName) {
        errors.push('Last name is required');
      }
      if (!bookingData.contactInfo.email) {
        errors.push('Email is required');
      }
      if (!bookingData.contactInfo.phone) {
        errors.push('Phone number is required');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Generate unique booking reference
   */
  static generateBookingReference(): string {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `BK${timestamp.slice(-6)}${random}`;
  }

  /**
   * Calculate booking amount
   */
  static calculateBookingAmount(
    basePrice: number, 
    duration: number, 
    numberOfPeople: number, 
    extras?: { name: string; price: number }[]
  ): number {
    let total = basePrice * duration * numberOfPeople;
    
    if (extras && extras.length > 0) {
      const extrasTotal = extras.reduce((sum, extra) => sum + extra.price, 0);
      total += extrasTotal;
    }

    return total;
  }

  /**
   * Check if booking date is valid (future date)
   */
  static isValidBookingDate(date: string): boolean {
    const bookingDate = new Date(date);
    const now = new Date();
    return bookingDate > now;
  }

  /**
   * Get available time slots for a date
   */
  static getAvailableTimeSlots(): string[] {
    return [
      '09:00', '10:00', '11:00', '12:00',
      '13:00', '14:00', '15:00', '16:00', '17:00'
    ];
  }

  /**
   * Log booking activity
   */
  static logActivity(activity: string, data?: any): void {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] BOOKING ACTIVITY: ${activity}`, data ? JSON.stringify(data, null, 2) : '');
  }

  // ==================== ERROR HANDLING UTILITIES ====================

  /**
   * Handle API errors with user-friendly messages
   */
  static handleApiError(error: any): string {
    if (typeof error === 'string') {
      return error;
    }

    if (error && typeof error === 'object' && 'message' in error) {
      const message = error.message;
      
      if (message.includes('Network')) {
        return 'Network connection error. Please check your internet connection.';
      }
      
      if (message.includes('400')) {
        return 'Invalid request. Please check your booking details.';
      }
      
      if (message.includes('401')) {
        return 'Authentication failed. Please try again.';
      }
      
      if (message.includes('404')) {
        return 'Booking not found. Please verify the booking ID.';
      }
      
      if (message.includes('500')) {
        return 'Server error. Please try again later.';
      }
      
      return message;
    }

    return 'An unexpected error occurred. Please try again.';
  }

  static async verifyPaymentComplete(
  orderId: string, 
  bookingId: string,
  expectedAmount?: number
): Promise<{ verified: boolean; status: PaymentStatusResponse; warnings: string[] }> {
  try {
    console.log('Verifying payment completion:', orderId);
    
    const warnings: string[] = [];
    
    // Get detailed payment information
    const status = await this.checkPaymentStatus(orderId, bookingId);
    
    let verified = status.confirmed;
    
    // Additional verification checks
    if (verified) {
      // Check amount if provided
      if (expectedAmount && status.amount && Math.abs(status.amount - expectedAmount) > 0.01) {
        verified = false;
        warnings.push(`Amount mismatch: expected ${expectedAmount}, got ${status.amount}`);
      }
      
      // Check currency
      if (status.currency && status.currency !== 'LKR') {
        warnings.push(`Currency mismatch: expected LKR, got ${status.currency}`);
      }
      
      // Check status field
      if (status.status && !['SUCCESS', 'COMPLETED', 'CONFIRMED'].includes(status.status.toUpperCase())) {
        warnings.push(`Unexpected payment status: ${status.status}`);
      }
    }
    
    console.log('Payment verification result:', { verified, warnings });
    
    return { verified, status, warnings };
    
  } catch (error) {
    console.error('Error verifying payment:', error);
    throw error;
  }
}

  /**
   * Retry function with exponential backoff
   */
  static async retryWithBackoff<T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 1000
  ): Promise<T> {
    let lastError: Error;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        
        if (attempt === maxRetries) {
          throw lastError;
        }

        const delay = baseDelay * Math.pow(2, attempt - 1);
        console.log(`Attempt ${attempt} failed, retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw lastError!;
  }
}

export default BookingService;