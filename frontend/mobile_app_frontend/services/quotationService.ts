import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';

const BASE_URL = 'http://192.168.1.150:8080';

export interface PendingTrip {
  ptId: string;
  title: string;
  startLocation: string;
  endLocation: string;
  numberOfSeats: number;
  date: string;
  numberOfDates: number;
  descriptionAboutStartLocation: string;
  pickupTime: string;
  path: string;
  guideId: string | null;
  vehicleId: string | null;
  category?: string;
  submitted?: boolean;
}

export interface SubmittedQuotation {
  _id?: string;
  sqId?: string;
  quotationId?: string;
  pendingTripId?: string;
  tourId?: string;
  ptId?: string;
  guideId: string;
  quotedAmount: number;
  amount?: number;
  quotationNotes?: string;
  notes?: string;
  quotationDate?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  // Tour/Trip details (sent from backend as nested object OR enriched from pending trips)
  tourDetails?: PendingTrip;
  // Direct trip details (for backward compatibility and enrichment)
  title?: string;
  startLocation?: string;
  endLocation?: string;
  numberOfSeats?: number;
  date?: string;
  numberOfDates?: number;
  pickupTime?: string;
  descriptionAboutStartLocation?: string;
  path?: string;
}

interface MyToken {
  sub: string;
  roles: string[];
  username: string;
  email: string;
  id: string;
}

/**
 * Fetch pending group tours for the current guide
 * Extracts userId from JWT token stored in AsyncStorage
 */
export const fetchPendingTrips = async (): Promise<PendingTrip[]> => {
  try {
    // Get JWT token from AsyncStorage
    const token = await AsyncStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }

    // Decode JWT to get userId
    const decoded = jwtDecode<MyToken>(token);
    const userId = decoded.id || decoded.sub;

    if (!userId) {
      throw new Error('Could not extract user ID from token');
    }

    console.log('🔍 Fetching pending trips for userId:', userId);

    // Make API call with JWT token
    const response = await fetch(
      `${BASE_URL}/api/guide/groupTours?userId=${userId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Include JWT in Authorization header
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch pending trips: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ Pending trips fetched successfully:', data);

    return data;
  } catch (error) {
    console.error('❌ Error fetching pending trips:', error);
    throw error;
  }
};

/**
 * Submit a quotation for a pending trip
 * @param tourId - The tour ID to submit quotation for
 * @param quotationData - Quotation data including amount, notes, and guideId
 */
export const submitQuotation = async (
  tourId: string,
  quotationData: {
    amount: number;
    notes: string;
    guideId: string;
  }
): Promise<any> => {
  try {
    const token = await AsyncStorage.getItem('token');

    if (!token) {
      throw new Error('No authentication token found');
    }

    console.log(`📤 Submitting quotation for tourId: ${tourId}`);
    console.log(`📤 Token exists: ${token ? 'Yes' : 'No'}`);
    console.log(`📤 Token length: ${token?.length}`);
    console.log(`📤 Token preview: ${token?.substring(0, 20)}...`);
    console.log(`📤 Quotation data:`, quotationData);

    const url = `${BASE_URL}/api/guide/submitQuotation/${tourId}`;
    console.log(`📤 API URL: ${url}`);

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };

    console.log(`📤 Headers:`, {
      'Content-Type': headers['Content-Type'],
      'Authorization': `Bearer ${token?.substring(0, 20)}...`,
    });

    const response = await fetch(url, {
      method: 'PUT',
      headers: headers,
      body: JSON.stringify(quotationData),
    });

    console.log(`📥 Response status: ${response.status}`);
    console.log(`📥 Response ok: ${response.ok}`);

    const responseText = await response.text();
    console.log(`📥 Response text: ${responseText}`);

    if (!response.ok) {
      throw new Error(`Failed to submit quotation: ${response.status} ${response.statusText} - ${responseText}`);
    }

    let result;
    try {
      result = JSON.parse(responseText);
    } catch (e) {
      result = responseText;
    }

    console.log('✅ Quotation submitted successfully:', result);
    return result;
  } catch (error) {
    console.error('❌ Error submitting quotation:', error);
    throw error;
  }
};

/**
 * Fetch submitted quotations for the current guide
 * Extracts userId from JWT token stored in AsyncStorage
 */
export const fetchSubmittedQuotations = async (): Promise<SubmittedQuotation[]> => {
  try {
    // Get JWT token from AsyncStorage
    const token = await AsyncStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }

    // Decode JWT to get userId
    const decoded = jwtDecode<MyToken>(token);
    const userId = decoded.id || decoded.sub;

    if (!userId) {
      throw new Error('Could not extract user ID from token');
    }

    console.log('🔍 Fetching submitted quotations for userId:', userId);

    const url = `${BASE_URL}/api/guide/submittedQuotation/${userId}`;
    console.log(`📥 API URL: ${url}`);

    // Make API call with JWT token
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch submitted quotations: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ Submitted quotations fetched successfully. Count:', data.length);
    
    if (data.length > 0) {
      console.log('\n📦 RAW SUBMITTED QUOTATION DATA FROM API:');
      console.log('================================');
      data.forEach((quotation: any, idx: number) => {
        console.log(`\n📋 Quotation ${idx}:`, JSON.stringify(quotation, null, 2));
      });
      console.log('================================\n');
      
      console.log('🔍 First submitted quotation structure:', {
        hasOwnProperty_pendingTripId: data[0].hasOwnProperty('pendingTripId'),
        hasOwnProperty_ptId: data[0].hasOwnProperty('ptId'),
        pendingTripId: data[0].pendingTripId,
        ptId: data[0].ptId,
        quotedAmount: data[0].quotedAmount,
        quotationNotes: data[0].quotationNotes,
        allKeys: Object.keys(data[0]),
      });
    }

    return data;
  } catch (error) {
    console.error('❌ Error fetching submitted quotations:', error);
    throw error;
  }
};

/**
 * Withdraw a submitted quotation
 * @param quotationId - The quotation ID to withdraw
 */
export const withdrawQuotation = async (quotationId: string): Promise<any> => {
  try {
    const token = await AsyncStorage.getItem('token');

    if (!token) {
      throw new Error('No authentication token found');
    }

    console.log(`📤 Withdrawing quotation: ${quotationId}`);

    const url = `${BASE_URL}/guide/withdrawQuotation/${quotationId}`;
    console.log(`📤 API URL: ${url}`);

    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    console.log(`📥 Response status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to withdraw quotation: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const result = await response.json();
    console.log('✅ Quotation withdrawn successfully:', result);
    return result;
  } catch (error) {
    console.error('❌ Error withdrawing quotation:', error);
    throw error;
  }
};
