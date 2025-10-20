// Updated PayHere Types - LKR Only Support
// File: types/payhere.ts

// ✅ UPDATED: PayHere SDK interfaces to match controller expectations
export interface PayHereSDK {
  startPayment: (
    paymentObject: PayHerePaymentObject,
    onCompleted: (paymentId: string) => void,
    onError: (errorData: string) => void,
    onDismissed: () => void
  ) => void;
}

// ✅ UPDATED: Payment data from backend (matches controller response)
export interface PayHerePaymentData {
  // Required fields from controller
  merchant_id: string;
  return_url: string;
  cancel_url: string;
  notify_url: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  order_id: string;
  items: string;
  currency: string; // Always LKR from controller
  amount: string;
  hash: string;
  sandbox: boolean;
  
  // Optional delivery fields
  delivery_address?: string;
  delivery_city?: string;
  delivery_country?: string;
  
  // Custom tracking fields (controller adds these)
  custom_1?: string; // Usually booking ID
  custom_2?: string; // Usually order ID
  
  // Additional fields that might be present
  [key: string]: any;
}

// ✅ UPDATED: Payment object for native SDK (matches controller structure)
export interface PayHerePaymentObject {
  sandbox: boolean;
  merchant_id: string;
  notify_url: string;
  order_id: string;
  items: string;
  amount: string;
  currency: string; // Always LKR
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  delivery_address?: string;
  delivery_city?: string;
  delivery_country?: string;
  custom_1?: string;
  custom_2?: string;
}

// ✅ UPDATED: Payment checkout response (matches controller response)
export interface PaymentCheckoutResponse {
  success: boolean;
  paymentObject: PayHerePaymentData;
  orderId: string;
  bookingId?: string;
  amount: string;
  currency: string; // Always LKR
  supportedCurrency: string; // Always LKR
  checkoutUrl: string;
  sandbox: boolean;
  hashVerification: boolean;
  message: string;
}

// ✅ NEW: Controller configuration response
export interface PayHereConfigResponse {
  success: boolean;
  config: {
    merchantId: string;
    merchantIdLength: number;
    merchantSecretLength: number;
    sandboxMode: boolean;
    appBaseUrl: string;
    supportedCurrency: string; // LKR
    currencySupport: string; // "LKR Only"
    checkoutUrl: string;
  };
}

// ✅ NEW: Hash generation test response
export interface HashTestResponse {
  success: boolean;
  orderId: string;
  amount: number;
  formattedAmount: string;
  currency: string; // LKR
  supportedCurrency: string; // LKR
  merchantId: string;
  secretHash: string;
  hashString: string;
  generatedHash: string;
  hashLength: number;
  sandboxMode: boolean;
  checkoutUrl: string;
}

// ✅ NEW: Health check response
export interface PayHereHealthResponse {
  success: boolean;
  message: string;
  timestamp: number;
  merchantId: string;
  sandboxMode: boolean;
  supportedCurrency: string; // LKR
  currencySupport: string; // "LKR Only"
  version: string; // "LKR_ONLY_v1.0"
}

// ✅ NEW: Currency conversion utilities
export interface CurrencyConversion {
  fromCurrency: string;
  toCurrency: string; // Always LKR
  originalAmount: number;
  convertedAmount: number;
  conversionRate: number;
}

// ✅ NEW: Booking interfaces matching controller expectations
export interface LKRBookingRequest {
  travelerId: string;
  providerId: string;
  providerType: "guide";
  serviceName: string;
  serviceDescription: string;
  serviceStartDate: string;
  serviceEndDate: string;
  totalAmount: number; // In LKR
  currency: string; // Always LKR
}

export interface LKRBookingResponse {
  id: string;
  status: string;
  currency: string; // Should be LKR
  totalAmount: number; // In LKR
  payHereOrderId?: string;
  paymentStatus?: string;
  createdAt?: string;
  updatedAt?: string;
}

// ✅ NEW: Payment checkout request (matches controller CheckoutRequest)
export interface LKRCheckoutRequest {
  bookingId: string;
  amount?: number | null; // Let backend determine from booking
  // No currency field - controller always uses LKR
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  items?: string;
}

// ✅ NEW: Error types for better error handling
export interface PayHereError {
  type: 'CURRENCY_ERROR' | 'BOOKING_ERROR' | 'PAYMENT_ERROR' | 'NETWORK_ERROR' | 'VALIDATION_ERROR';
  message: string;
  details?: string;
  supportedCurrency?: string;
}

// ✅ NEW: Component prop types
export interface PayHereCheckoutProps {
  paymentData: PayHerePaymentData;
  bookingId: string;
  orderId: string;
  onSuccess?: (paymentId: string) => void;
  onError?: (error: PayHereError) => void;
  onCancel?: () => void;
}

// ✅ NEW: Guide profile types with LKR support
export interface LKRGuideProfile {
  id: string;
  _id: string;
  name: string;
  title: string;
  location: string;
  experience: string;
  rating: number;
  reviewCount: number;
  hourlyRate: number; // In LKR
  dailyRate: number; // In LKR
  originalDailyRate?: number; // Original amount in different currency
  currency: string; // Always LKR for payments
  originalCurrency?: string; // Original currency if different
  image: string;
  verified: boolean;
  languages: string[];
  specializations: string[];
  expertise: string[];
  responseTime: string;
  responseRate: string;
  description: string;
  joinedDate: string;
  education: string[];
  certifications: string[];
  awards: string[];
  gallery: string[];
  availability: string;
  aboutMe: string;
  whyChooseMe: string[];
  tourStyles: string[];
}

// ✅ NEW: Booking summary with LKR
export interface LKRBookingSummary {
  destination: string;
  dates: string[];
  numberOfDays: number;
  language: string;
  type: string;
  totalCost: number; // In LKR
  originalCost?: number; // If converted from different currency
  originalCurrency?: string;
  guide: LKRGuideProfile;
}

// ✅ NEW: Payment notification data (for webhook handling)
export interface PayHereNotificationData {
  merchant_id: string;
  order_id: string;
  payment_id: string;
  payhere_amount: string;
  payhere_currency: string; // Should be LKR
  status_code: string;
  md5sig: string;
  status_message: string;
  custom_1?: string; // Booking ID
  custom_2?: string; // Order ID
}

// ✅ NEW: Service response wrapper
export interface ServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: PayHereError;
  message?: string;
}

// Constants
export const PAYHERE_CONSTANTS = {
  SUPPORTED_CURRENCY: 'LKR',
  CONVERSION_RATES: {
    USD: 320,
    EUR: 350,
    GBP: 400,
  },
  STATUS_CODES: {
    SUCCESS: '2',
    PENDING: '0',
    CANCELLED: '-1',
    FAILED: '-2',
    CHARGEDBACK: '-3',
  },
  PAYMENT_URLS: {
    SANDBOX: 'https://sandbox.payhere.lk/pay/checkout',
    LIVE: 'https://www.payhere.lk/pay/checkout',
  },
} as const;

// ✅ NEW: Type guards for runtime validation
export const isLKRCurrency = (currency: string): boolean => {
  return currency === PAYHERE_CONSTANTS.SUPPORTED_CURRENCY;
};

export const isValidPaymentData = (data: any): data is PayHerePaymentData => {
  return (
    data &&
    typeof data.merchant_id === 'string' &&
    typeof data.amount === 'string' &&
    typeof data.currency === 'string' &&
    isLKRCurrency(data.currency) &&
    typeof data.order_id === 'string' &&
    typeof data.hash === 'string'
  );
};

export const isSuccessfulPayment = (statusCode: string): boolean => {
  return statusCode === PAYHERE_CONSTANTS.STATUS_CODES.SUCCESS;
};

// ✅ NEW: Utility functions
export const convertCurrencyToLKR = (
  amount: number, 
  fromCurrency: string
): CurrencyConversion => {
  if (fromCurrency === PAYHERE_CONSTANTS.SUPPORTED_CURRENCY) {
    return {
      fromCurrency,
      toCurrency: PAYHERE_CONSTANTS.SUPPORTED_CURRENCY,
      originalAmount: amount,
      convertedAmount: amount,
      conversionRate: 1,
    };
  }

  const rate = PAYHERE_CONSTANTS.CONVERSION_RATES[
    fromCurrency as keyof typeof PAYHERE_CONSTANTS.CONVERSION_RATES
  ];

  if (!rate) {
    console.warn(`Unknown currency ${fromCurrency}, using 1:1 conversion`);
    return {
      fromCurrency,
      toCurrency: PAYHERE_CONSTANTS.SUPPORTED_CURRENCY,
      originalAmount: amount,
      convertedAmount: amount,
      conversionRate: 1,
    };
  }

  const convertedAmount = Math.round(amount * rate);

  return {
    fromCurrency,
    toCurrency: PAYHERE_CONSTANTS.SUPPORTED_CURRENCY,
    originalAmount: amount,
    convertedAmount,
    conversionRate: rate,
  };
};

export const formatLKRPrice = (amount: number): string => {
  return `${PAYHERE_CONSTANTS.SUPPORTED_CURRENCY} ${amount.toLocaleString()}`;
};

export const createPayHereError = (
  type: PayHereError['type'],
  message: string,
  details?: string
): PayHereError => {
  return {
    type,
    message,
    details,
    supportedCurrency: PAYHERE_CONSTANTS.SUPPORTED_CURRENCY,
  };
};

export default PAYHERE_CONSTANTS;