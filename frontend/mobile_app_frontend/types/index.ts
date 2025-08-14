// types/index.ts - Central export for all type definitions

// PayHere types
export * from './payhere';

// Booking types (add when you create them)
// export * from './booking';

// User types (add when you create them)
// export * from './user';

// API response types
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

// Common types
export interface NavigationParams {
  [key: string]: string | number | boolean | undefined;
}

// Payment status types
export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'CANCELLED' | 'CHARGEDBACK';
export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED_BY_TRAVELER' | 'CANCELLED_BY_PROVIDER' | 'COMPLETED';

// Guide types (basic structure)
export interface Guide {
  id: string;
  _id: string;
  name: string;
  firstName: string;
  lastName: string;
  location: string;
  experience: number;
  rating: number;
  reviewCount: number;
  dailyRate: number;
  currency: string;
  verified: boolean;
  languages: string[];
  specializations: string[];
  description: string;
  image: string;
}

// Booking types (basic structure)
export interface Booking {
  id: string;
  travelerId: string;
  providerId: string;
  providerType: 'guide' | 'transport' | 'accommodation';
  serviceName: string;
  serviceDescription?: string;
  totalAmount: number;
  currency: string;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  payHereOrderId?: string;
  payHerePaymentId?: string;
  serviceStartDate: string;
  serviceEndDate: string;
  createdAt: string;
  updatedAt: string;
}