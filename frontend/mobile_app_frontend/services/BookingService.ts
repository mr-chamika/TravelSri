// Enhanced BookingService with PayHere Debugging - LKR Currency Only

import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://localhost:8080';

class BookingService {

  // ==================== ENHANCED PAYMENT DEBUGGING ====================

  /**
   * 🔍 DEBUG: Test PayHere Configuration
   */
  static async debugPayHereConfig(): Promise<any> {
    try {
      console.log('🔍 DEBUGGING: Testing PayHere configuration...');
      
      const response = await fetch(`${API_BASE_URL}/api/payments/payhere/debug/config-check`);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Config check failed: ${response.status} ${errorText}`);
      }
      
      const result = await response.json();
      console.log('✅ PayHere Config Check Result:', result);
      
      // Log important findings
      if (result.config) {
        console.log('📋 Configuration Summary:');
        console.log(`  - Merchant ID: ${result.config.merchantId}`);
        console.log(`  - Merchant Secret: ${result.config.merchantSecretExists ? 'EXISTS' : 'MISSING'}`);
        console.log(`  - Sandbox Mode: ${result.config.sandboxMode}`);
        console.log(`  - Notify URL: ${result.config.notifyUrl}`);
        console.log(`  - Checkout URL: ${result.config.payhereCheckoutUrl}`);
        console.log(`  - Currency: LKR (Sri Lankan Rupees only)`);
      }
      
      return result;
    } catch (error) {
      console.error('❌ PayHere Config Check Failed:', error);
      throw error;
    }
  }

  /**
   * 🔍 DEBUG: Test Hash Generation
   */
  static async debugHashGeneration(testData?: any): Promise<any> {
    try {
      console.log('🔍 DEBUGGING: Testing hash generation...');
      
      const requestBody = testData || {
        merchantId: undefined, // Will use server default
        orderId: `DEBUG_${Date.now()}`,
        amount: '100.00',
        currency: 'LKR' // ✅ FIXED: Always use LKR currency
      };
      
      console.log('📤 Hash test request:', requestBody);
      
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
      console.log('✅ Hash Generation Test Result:', result);
      
      // Log hash details
      console.log('🔐 Hash Details:');
      console.log(`  - Generated Hash: ${result.generatedHash}`);
      console.log(`  - Hash Length: ${result.hashLength} (expected: 32)`);
      console.log(`  - Format Valid: ${result.hashFormatValid}`);
      console.log(`  - Secret Hash Sample: ${result.secretHashSample}`);
      console.log(`  - Currency: LKR (Sri Lankan Rupees only)`);
      
      return result;
    } catch (error) {
      console.error('❌ Hash Generation Test Failed:', error);
      throw error;
    }
  }

  /**
   * 🔍 DEBUG: Test Minimal Payment Creation
   */
  static async debugMinimalPayment(): Promise<any> {
    try {
      console.log('🔍 DEBUGGING: Testing minimal payment creation...');
      
      const response = await fetch(`${API_BASE_URL}/api/payments/payhere/debug/minimal-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currency: 'LKR' }), // ✅ FIXED: Always specify LKR
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Minimal payment test failed: ${response.status} ${errorText}`);
      }
      
      const result = await response.json();
      console.log('✅ Minimal Payment Test Result:', result);
      
      // Log payment object details
      if (result.paymentData) {
        console.log('💳 Payment Object Summary:');
        console.log(`  - Merchant ID: ${result.paymentData.merchant_id}`);
        console.log(`  - Order ID: ${result.paymentData.order_id}`);
        console.log(`  - Amount: ${result.paymentData.amount}`);
        console.log(`  - Currency: ${result.paymentData.currency} (should be LKR)`);
        console.log(`  - Hash: ${result.paymentData.hash?.substring(0, 8)}...`);
        console.log(`  - Checkout URL: ${result.checkoutUrl}`);
      }
      
      // Check field validation
      if (result.fieldValidation) {
        const missingFields = Object.entries(result.fieldValidation)
          .filter(([key, valid]) => !valid)
          .map(([key]) => key);
        
        if (missingFields.length > 0) {
          console.warn('⚠️  Missing/Invalid Fields:', missingFields);
        } else {
          console.log('✅ All required fields present and valid');
        }
      }
      
      return result;
    } catch (error) {
      console.error('❌ Minimal Payment Test Failed:', error);
      throw error;
    }
  }

  /**
   * 🔍 DEBUG: Test with Real Booking
   */
  static async debugWithBooking(bookingId: string): Promise<any> {
    try {
      console.log('🔍 DEBUGGING: Testing with real booking:', bookingId);
      
      const response = await fetch(`${API_BASE_URL}/api/payments/payhere/debug/test-with-booking/${bookingId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currency: 'LKR' }), // ✅ FIXED: Always specify LKR
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Booking test failed: ${response.status} ${errorText}`);
      }
      
      const result = await response.json();
      console.log('✅ Booking Test Result:', result);
      
      // Log booking details
      if (result.bookingInfo) {
        console.log('📝 Booking Details:');
        console.log(`  - Booking ID: ${result.bookingInfo.id}`);
        console.log(`  - Amount: ${result.bookingInfo.amount}`);
        console.log(`  - Currency: ${result.bookingInfo.currency} (should be LKR)`);
        console.log(`  - Status: ${result.bookingInfo.status}`);
      }
      
      return result;
    } catch (error) {
      console.error('❌ Booking Test Failed:', error);
      throw error;
    }
  }

  /**
   * 🔍 DEBUG: Test Network Connectivity
   */
  static async debugNetworkConnectivity(): Promise<any> {
    try {
      console.log('🔍 DEBUGGING: Testing network connectivity...');
      
      const response = await fetch(`${API_BASE_URL}/api/payments/payhere/debug/network-test`);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Network test failed: ${response.status} ${errorText}`);
      }
      
      const result = await response.json();
      console.log('✅ Network Test Result:', result);
      
      // Log connectivity results
      if (result.networkTests?.urlAccessibility) {
        console.log('🌐 URL Accessibility:');
        Object.entries(result.networkTests.urlAccessibility).forEach(([url, status]: [string, any]) => {
          const accessible = status.accessible ? '✅' : '❌';
          console.log(`  ${accessible} ${url}: ${status.responseCode || status.error}`);
        });
      }
      
      return result;
    } catch (error) {
      console.error('❌ Network Test Failed:', error);
      throw error;
    }
  }

  /**
   * 🔍 DEBUG: Full Payment Flow Test
   */
  static async debugFullPaymentFlow(): Promise<any> {
    try {
      console.log('🔍 DEBUGGING: Running full payment flow test...');
      
      const response = await fetch(`${API_BASE_URL}/api/payments/payhere/debug/full-flow-test`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currency: 'LKR' }), // ✅ FIXED: Always specify LKR
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Full flow test failed: ${response.status} ${errorText}`);
      }
      
      const result = await response.json();
      console.log('✅ Full Flow Test Result:', result);
      
      // Log test results
      if (result.testResults) {
        console.log('🧪 Test Results:');
        Object.entries(result.testResults).forEach(([test, status]) => {
          const icon = status === 'PASSED' ? '✅' : '❌';
          console.log(`  ${icon} ${test}: ${status}`);
        });
      }
      
      return result;
    } catch (error) {
      console.error('❌ Full Flow Test Failed:', error);
      throw error;
    }
  }

  /**
   * 🔍 DEBUG: Comprehensive PayHere Diagnostic
   */
  static async runComprehensiveDiagnostic(bookingId?: string): Promise<any> {
    console.log('🚀 STARTING COMPREHENSIVE PAYHERE DIAGNOSTIC (LKR ONLY)...');
    console.log('=========================================================');
    
    const results: any = {
      timestamp: new Date().toISOString(),
      currency: 'LKR', // ✅ FIXED: Document currency requirement
      tests: {},
      summary: {
        passed: 0,
        failed: 0,
        warnings: []
      }
    };
    
    try {
      // Test 1: Configuration Check
      console.log('\n📋 TEST 1: Configuration Check');
      console.log('------------------------------');
      try {
        results.tests.configCheck = await this.debugPayHereConfig();
        results.summary.passed++;
        console.log('✅ Configuration check passed');
      } catch (error) {
        results.tests.configCheck = { error: (error && typeof error === 'object' && 'message' in error) ? (error as any).message : String(error) };
        results.summary.failed++;
        console.log('❌ Configuration check failed:', (error && typeof error === 'object' && 'message' in error) ? (error as any).message : String(error));
      }

      // Test 2: Hash Generation
      console.log('\n🔐 TEST 2: Hash Generation (LKR Currency)');
      console.log('------------------------------------------');
      try {
        results.tests.hashGeneration = await this.debugHashGeneration();
        results.summary.passed++;
        console.log('✅ Hash generation passed');
      } catch (error) {
        results.tests.hashGeneration = { error: (error && typeof error === 'object' && 'message' in error) ? (error as any).message : String(error) };
        results.summary.failed++;
        console.log('❌ Hash generation failed:', (error && typeof error === 'object' && 'message' in error) ? (error as any).message : String(error));
      }

      // Test 3: Network Connectivity
      console.log('\n🌐 TEST 3: Network Connectivity');
      console.log('--------------------------------');
      try {
        results.tests.networkTest = await this.debugNetworkConnectivity();
        results.summary.passed++;
        console.log('✅ Network connectivity passed');
      } catch (error) {
        results.tests.networkTest = { error: (error && typeof error === 'object' && 'message' in error) ? (error as any).message : String(error) };
        results.summary.failed++;
        console.log('❌ Network connectivity failed:', (error && typeof error === 'object' && 'message' in error) ? (error as any).message : String(error));
      }

      // Test 4: Minimal Payment Creation
      console.log('\n💳 TEST 4: Minimal Payment Creation (LKR Only)');
      console.log('-----------------------------------------------');
      try {
        results.tests.minimalPayment = await this.debugMinimalPayment();
        results.summary.passed++;
        console.log('✅ Minimal payment creation passed');
      } catch (error) {
        results.tests.minimalPayment = { error: (error && typeof error === 'object' && 'message' in error) ? (error as any).message : String(error) };
        results.summary.failed++;
        console.log('❌ Minimal payment creation failed:', (error && typeof error === 'object' && 'message' in error) ? (error as any).message : String(error));
      }

      // Test 5: Real Booking Test (if bookingId provided)
      if (bookingId) {
        console.log('\n📝 TEST 5: Real Booking Test (LKR Currency)');
        console.log('--------------------------------------------');
        try {
          results.tests.bookingTest = await this.debugWithBooking(bookingId);
          results.summary.passed++;
          console.log('✅ Real booking test passed');
        } catch (error) {
          results.tests.bookingTest = { error: (error && typeof error === 'object' && 'message' in error) ? (error as any).message : String(error) };
          results.summary.failed++;
          console.log('❌ Real booking test failed:', (error && typeof error === 'object' && 'message' in error) ? (error as any).message : String(error));
        }
      }

      // Test 6: Full Flow Test
      console.log('\n🧪 TEST 6: Full Flow Test (LKR Currency)');
      console.log('-----------------------------------------');
      try {
        results.tests.fullFlowTest = await this.debugFullPaymentFlow();
        results.summary.passed++;
        console.log('✅ Full flow test passed');
      } catch (error) {
        results.tests.fullFlowTest = { error: (error && typeof error === 'object' && 'message' in error) ? (error as any).message : String(error) };
        results.summary.failed++;
        console.log('❌ Full flow test failed:', (error && typeof error === 'object' && 'message' in error) ? (error as any).message : String(error));
      }

      // Analysis and Recommendations
      console.log('\n📊 DIAGNOSTIC SUMMARY (LKR CURRENCY ONLY)');
      console.log('==========================================');
      console.log(`✅ Tests Passed: ${results.summary.passed}`);
      console.log(`❌ Tests Failed: ${results.summary.failed}`);
      console.log(`📊 Success Rate: ${((results.summary.passed / (results.summary.passed + results.summary.failed)) * 100).toFixed(1)}%`);
      console.log(`💱 Currency: LKR (Sri Lankan Rupees only)`);

      // Generate recommendations
      const recommendations = this.generateRecommendations(results);
      results.recommendations = recommendations;

      console.log('\n💡 RECOMMENDATIONS:');
      recommendations.forEach((rec, index) => {
        console.log(`${index + 1}. ${rec}`);
      });

      console.log('\n🏁 DIAGNOSTIC COMPLETE');
      console.log('======================');

      return results;

    } catch (error) {
      console.error('❌ Diagnostic failed with unexpected error:', error);
      results.criticalError = (error && typeof error === 'object' && 'message' in error) ? (error as any).message : String(error);
      return results;
    }
  }

  /**
   * Generate recommendations based on test results
   */
  static generateRecommendations(results: any): string[] {
    const recommendations: string[] = [];

    // Check configuration issues
    if (results.tests.configCheck?.error) {
      recommendations.push('🔧 Fix PayHere configuration: Check merchant ID and secret in application.properties');
    }

    // Check hash generation issues
    if (results.tests.hashGeneration?.error) {
      recommendations.push('🔐 Fix hash generation: Verify merchant secret and hash algorithm implementation');
    }

    // Check network issues
    if (results.tests.networkTest?.error) {
      recommendations.push('🌐 Fix network connectivity: Ensure server can reach PayHere URLs');
    }

    // Check payment creation issues
    if (results.tests.minimalPayment?.error) {
      recommendations.push('💳 Fix payment creation: Check required fields and data formatting');
    }

    // Check domain approval
    if (results.tests.configCheck?.config && !results.tests.configCheck.config.merchantSecretExists) {
      recommendations.push('🏗️ Domain approval required: Add your domain to PayHere Dashboard > Integrations');
    }

    // Currency-specific recommendation
    recommendations.push('💱 Currency enforcement: All payments are processed in LKR (Sri Lankan Rupees) only');

    // General recommendations
    if (results.summary.failed > 0) {
      recommendations.push('📞 Contact PayHere support if issues persist: support@payhere.lk');
    }

    if (recommendations.length === 1) { // Only currency recommendation
      recommendations.push('✅ All tests passed! Your PayHere integration is configured correctly for LKR payments.');
    }

    return recommendations;
  }

  // ==================== ENHANCED PAYMENT CREATION WITH DEBUGGING ====================

 /**
   * Enhanced createPaymentCheckout with comprehensive debugging and fixes - LKR Currency Only
   */
  static async createPaymentCheckout(bookingId: string): Promise<PaymentCheckoutResponse> {
    try {
      console.log('🚀 ENHANCED PAYMENT CHECKOUT CREATION (LKR ONLY)');
      console.log('=================================================');
      console.log(`📝 Booking ID: ${bookingId}`);
      console.log(`🕐 Timestamp: ${new Date().toISOString()}`);
      console.log(`💱 Currency: LKR (Sri Lankan Rupees only)`);
      console.log(`📡 API URL: ${API_BASE_URL}/api/payments/payhere/create-checkout`);

      // ✅ CRITICAL: Validate booking ID format
      if (!bookingId || bookingId.trim() === '') {
        throw new Error('Booking ID is required and cannot be empty');
      }

      // Pre-flight checks
      console.log('\n🔍 PRE-FLIGHT CHECKS:');
      console.log('1. Testing API connectivity...');
      
      try {
        const healthResponse = await fetch(`${API_BASE_URL}/api/payments/payhere/health`);
        if (healthResponse.ok) {
          const healthData = await healthResponse.json();
          console.log('✅ API server is reachable:', healthData.message);
          console.log('✅ Merchant ID configured:', healthData.merchantId);
          console.log('✅ Sandbox mode:', healthData.sandboxMode);
          console.log('💱 Currency: LKR (enforced)');
        } else {
          console.warn('⚠️ API health check failed:', healthResponse.status);
        }
      } catch (error) {
        console.warn('⚠️ API server connectivity issue:', error && typeof error === 'object' && 'message' in error ? (error as any).message : String(error));
      }

      // ✅ CRITICAL FIX: Enhanced request body with proper structure and LKR currency
      const requestBody = { 
        bookingId: bookingId.trim(),
        // ✅ FIXED: Always enforce LKR currency
        currency: 'LKR',
        amount: null, // Let backend determine from booking
        firstName: 'Customer',
        lastName: 'User',
        email: 'customer@example.com',
        phone: '+94771234567',
        address: 'Colombo',
        city: 'Colombo',
        country: 'Sri Lanka',
        items: 'Guide Service Booking'
      };
      
      console.log('\n📤 ENHANCED REQUEST DETAILS (LKR ONLY):');
      console.log('Body:', JSON.stringify(requestBody, null, 2));
      console.log('Headers: Content-Type: application/json');
      console.log('💱 Currency enforced: LKR');

      // Add timeout with detailed logging
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        console.log('⏰ Request timeout (30s) - aborting...');
        controller.abort();
      }, 30000);

      console.log('\n🌐 SENDING ENHANCED REQUEST...');
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

      console.log('\n📥 RESPONSE RECEIVED:');
      console.log(`⏱️ Response time: ${responseTime}ms`);
      console.log(`📊 Status: ${response.status} ${response.statusText}`);
      console.log('📋 Headers:', JSON.stringify([...response.headers.entries()], null, 2));

      if (!response.ok) {
        const errorText = await response.text();
        console.log('\n❌ ERROR RESPONSE ANALYSIS:');
        console.log('Status:', response.status);
        console.log('Status Text:', response.statusText);
        console.log('Error Body:', errorText);
        
        // ✅ Enhanced error analysis
        if (response.status === 400) {
          console.log('\n🔍 400 BAD REQUEST ANALYSIS:');
          console.log('This typically indicates:');
          console.log('1. ❌ Missing required request fields');
          console.log('2. ❌ Invalid booking ID format');
          console.log('3. ❌ Booking not found in database');
          console.log('4. ❌ Invalid amount or currency (must be LKR)');
        } else if (response.status === 401) {
          console.log('\n🔍 401 UNAUTHORIZED ANALYSIS:');
          console.log('This typically indicates:');
          console.log('1. ❌ Wrong merchant ID or secret');
          console.log('2. ❌ Domain not approved by PayHere');
          console.log('3. ❌ Hash calculation error');
          console.log('4. ❌ Account verification issues');
          console.log('\n💡 Run diagnostic: BookingService.runComprehensiveDiagnostic()');
        } else if (response.status === 500) {
          console.log('\n🔍 500 INTERNAL SERVER ERROR ANALYSIS:');
          console.log('This typically indicates:');
          console.log('1. ❌ Backend configuration issues');
          console.log('2. ❌ Database connection problems');
          console.log('3. ❌ Hash generation failures');
          console.log('4. ❌ PayHere API communication issues');
        }

        throw new Error(`Failed to create payment checkout: ${response.status} ${errorText}`);
      }

      const result = await response.json();
      
      console.log('\n✅ SUCCESS RESPONSE ANALYSIS:');
      console.log('📦 Response keys:', Object.keys(result));
      console.log('✨ Success:', result.success);
      console.log('🆔 Order ID:', result.orderId);
      console.log('💰 Amount:', result.amount, result.currency || 'LKR');
      console.log('💱 Currency:', result.currency || 'LKR', '(should be LKR)');
      console.log('🏪 Merchant ID:', result.paymentObject?.merchant_id);
      console.log('🌐 Checkout URL:', result.checkoutUrl);
      console.log('🧪 Sandbox Mode:', result.sandbox);

      // ✅ CRITICAL: Enhanced payment object validation with currency check
      if (result.paymentObject) {
        console.log('\n🔍 PAYMENT OBJECT VALIDATION (LKR CURRENCY):');
        const requiredFields = ['merchant_id', 'order_id', 'amount', 'currency', 'hash', 'first_name', 'last_name', 'email'];
        const missingFields = requiredFields.filter(field => !result.paymentObject[field]);
        const emptyFields = requiredFields.filter(field => 
          result.paymentObject[field] && result.paymentObject[field].toString().trim() === ''
        );
        
        // ✅ CRITICAL: Check currency is LKR
        if (result.paymentObject.currency !== 'LKR') {
          console.log('❌ CURRENCY ERROR: Expected LKR, got:', result.paymentObject.currency);
          throw new Error(`Invalid currency: Expected LKR, got ${result.paymentObject.currency}`);
        } else {
          console.log('✅ Currency validation passed: LKR');
        }
        
        if (missingFields.length === 0 && emptyFields.length === 0) {
          console.log('✅ All required fields present and non-empty');
        } else {
          if (missingFields.length > 0) {
            console.log('❌ Missing required fields:', missingFields);
          }
          if (emptyFields.length > 0) {
            console.log('❌ Empty required fields:', emptyFields);
          }
          throw new Error(`Invalid payment object: missing fields [${missingFields.join(', ')}], empty fields [${emptyFields.join(', ')}]`);
        }

        // ✅ Validate hash format
        const hash = result.paymentObject.hash;
        if (hash && hash.length === 32 && /^[A-F0-9]+$/.test(hash)) {
          console.log('✅ Hash format valid: 32 chars, uppercase hex');
        } else {
          console.log('❌ Hash format invalid:', hash);
          console.log('Expected: 32 uppercase hexadecimal characters');
        }

        console.log('🔐 Hash:', hash?.substring(0, 8) + '...');
        console.log('💱 Currency:', result.paymentObject.currency, '(LKR enforced)');
        console.log('📋 Custom tracking fields:');
        console.log('  - custom_1:', result.paymentObject.custom_1);
        console.log('  - custom_2:', result.paymentObject.custom_2);
      } else {
        console.log('❌ CRITICAL: No paymentObject in response!');
        throw new Error('Server response missing paymentObject');
      }

      console.log('\n🎉 PAYMENT CHECKOUT CREATED SUCCESSFULLY (LKR)!');
      console.log('===============================================');

      return result;

    } catch (error) {
      console.log('\n💥 PAYMENT CREATION FAILED');
      console.log('===========================');
      
      if (typeof error === 'object' && error !== null && 'name' in error && (error as any).name === 'AbortError') {
        console.error('⏰ Request timeout after 30 seconds');
        console.error('💡 This might indicate:');
        console.error('  1. Network connectivity issues');
        console.error('  2. Server overload');
        console.error('  3. PayHere API unavailability');
        throw new Error('Request timeout - please check your network connection');
      }

      console.error('❌ Error type:', error && typeof error === 'object' && 'constructor' in error ? (error as any).constructor.name : typeof error);
      console.error('❌ Error message:', error && typeof error === 'object' && 'message' in error ? (error as any).message : String(error));
      
      console.log('\n🔍 TROUBLESHOOTING STEPS:');
      console.log('1. Run: BookingService.runComprehensiveDiagnostic()');
      console.log('2. Check: BookingService.debugPayHereConfig()');
      console.log('3. Verify: PayHere Dashboard > Integrations > Domain Status');
      console.log('4. Test: BookingService.debugHashGeneration()');
      console.log('5. Ensure: Currency is set to LKR only');
      
      throw error;
    }
  }

  // ==================== EXISTING METHODS (keeping your original code) ====================
  
  static async createBooking(bookingData: BookingRequest): Promise<BookingResponse> {
    // Your existing implementation with LKR currency enforcement
    try {
      console.log('BookingService: Creating booking with data:', bookingData);
      console.log('API URL:', `${API_BASE_URL}/api/bookings/create`);
      console.log('💱 Currency: LKR (enforced)');
      
      // ✅ Ensure LKR currency in booking data
      const bookingDataWithLKR = {
        ...bookingData,
        currency: 'LKR' // Always enforce LKR currency
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
      console.log('💱 Currency enforced: LKR');
      return result;
    } catch (error) {
      console.error('BookingService: createBooking error:', error);
      throw error;
    }
  }

  // ... (rest of your existing methods remain the same)

  // ==================== QUICK DEBUG HELPERS ====================

  /**
   * Quick debug helper - call this when you get "Unauthorized" error
   */
  static async quickDebugUnauthorized(bookingId?: string): Promise<void> {
    console.log('🚨 QUICK DEBUG: Unauthorized Payment Request (LKR Only)');
    console.log('====================================================');
    
    try {
      // Quick config check
      const config = await this.debugPayHereConfig();
      if (!config.config.merchantSecretExists) {
        console.log('🔴 CRITICAL: Merchant secret is missing!');
        console.log('💡 Solution: Check your application.properties file');
        return;
      }

      // Quick hash test with LKR currency
      const hashTest = await this.debugHashGeneration({ currency: 'LKR' });
      if (!hashTest.hashFormatValid) {
        console.log('🔴 CRITICAL: Hash generation is broken!');
        console.log('💡 Solution: Check your PayHereUtils.generateHash() method');
        return;
      }

      // If we get here, run full diagnostic
      console.log('🔄 Running full diagnostic...');
      await this.runComprehensiveDiagnostic(bookingId);

    } catch (error) {
      console.error('❌ Quick debug failed:', error);
      console.log('💡 Try: Check your server logs and PayHere Dashboard');
      console.log('💱 Ensure: All payments use LKR currency only');
    }
  }

  /**
   * Test connection to your API
   */
  static async testConnection(): Promise<any> {
    try {
      console.log('🔍 Testing API connection...');
      console.log('💱 Currency: LKR (enforced)');
      
      const response = await fetch(`${API_BASE_URL}/api/payments/payhere/simple-health`);
      
      if (!response.ok) {
        throw new Error(`API test failed: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('✅ API connection successful:', result);
      console.log('💱 Currency enforcement: LKR only');
      return result;
    } catch (error) {
      console.error('❌ API connection failed:', error);
      throw error;
    }
  }

  /**
   * Currency validation helper
   */
  static validateCurrency(currency?: string): boolean {
    const validCurrency = currency === 'LKR';
    if (!validCurrency) {
      console.error('❌ Invalid currency:', currency, '- Only LKR is supported');
    } else {
      console.log('✅ Currency validation passed: LKR');
    }
    return validCurrency;
  }

  /**
   * Enhanced createBooking with currency validation
   */
  static async createBookingWithCurrencyValidation(bookingData: BookingRequest): Promise<BookingResponse> {
    console.log('🚀 Creating booking with currency validation...');
    
    // Validate and enforce LKR currency
    const enhancedBookingData = {
      ...bookingData,
      currency: 'LKR', // Always enforce LKR
      totalAmount: Math.round(bookingData.totalAmount * 100) / 100 // Ensure proper decimal formatting for LKR
    };

    console.log('💱 Currency enforced: LKR');
    console.log('💰 Amount formatted for LKR:', enhancedBookingData.totalAmount);

    return this.createBooking(enhancedBookingData);
  }

  /**
   * Get supported currencies (always returns LKR only)
   */
  static getSupportedCurrencies(): string[] {
    return ['LKR'];
  }

  /**
   * Format amount for LKR currency
   */
  static formatAmountForLKR(amount: number): string {
    // Format amount with 2 decimal places for LKR
    return amount.toFixed(2);
  }

  /**
   * Validate amount for LKR transactions
   */
  static validateLKRAmount(amount: number): boolean {
    // PayHere minimum amount is LKR 1.00
    const minAmount = 1.00;
    const maxAmount = 999999.99; // Reasonable max for Sri Lankan context
    
    const isValid = amount >= minAmount && amount <= maxAmount;
    
    if (!isValid) {
      console.error(`❌ Invalid LKR amount: ${amount}`);
      console.error(`   Must be between LKR ${minAmount} and LKR ${maxAmount}`);
    } else {
      console.log(`✅ Valid LKR amount: ${amount}`);
    }
    
    return isValid;
  }
}

// Add missing interfaces for compatibility
interface BookingRequest {
  travelerId: string;
  providerId: string;
  providerType: "guide";
  serviceName: string;
  serviceDescription: string;
  serviceStartDate: string;
  serviceEndDate: string;
  totalAmount: number;
  currency?: string; // Optional, will be enforced to LKR
}

interface BookingResponse {
  id: string;
  status: string;
  currency?: string; // Will always be LKR
}

interface PaymentCheckoutResponse {
  success: boolean;
  orderId: string;
  amount?: string;
  currency?: string; // Will always be LKR
  message?: string;
  bookingId?: string;
  paymentObject: {
    merchant_id: string;
    order_id: string;
    amount: string;
    currency: string; // Will always be LKR
    hash?: string;
    custom_1?: string;
    custom_2?: string;
    [key: string]: any;
  };
}

export default BookingService;