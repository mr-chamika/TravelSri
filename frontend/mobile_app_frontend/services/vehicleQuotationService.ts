import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';

const API_BASE_URL = 'http://localhost:8080/api';

interface MyToken {
  sub: string;
  roles: string[];
  username: string;
  email: string;
  id: string;
}

export interface VehicleQuotation {
  _id?: string;
  pendingTripId: string;
  vehicleOwnerId?: string;
  vehicleId?: string;
  quotedAmount: number;
  quotationNotes: string;
  quotationDate?: string;
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
  createdAt?: string;
  updatedAt?: string;
}

export interface GroupTourRequest {
  ptId: string;
  title: string;
  startLocation: string;
  endLocation: string;
  numberOfSeats: number;
  date: string;
  numberOfDates: number;
  pickupTime: string;
}

/**
 * Get JWT token from AsyncStorage
 */
const getToken = async (): Promise<string | null> => {
  try {
    const token = await AsyncStorage.getItem('token');
    return token;
  } catch (error) {
    console.error('❌ Error retrieving token:', error);
    return null;
  }
};

/**
 * Get user ID from JWT token
 */
export const getUserIdFromToken = async (): Promise<string | null> => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) return null;

    const decoded = jwtDecode<MyToken>(token);
    return decoded.id || decoded.sub || null;
  } catch (error) {
    console.error('❌ Error extracting user ID from token:', error);
    return null;
  }
};

/**
 * Fetch all group tour requests available for vehicle owner quotation
 */
export const fetchVehicleGroupTours = async (): Promise<GroupTourRequest[]> => {
  try {
    const token = await getToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    console.log('📡 Fetching vehicle group tours...');

    const response = await fetch(`${API_BASE_URL}/VehicleOwnerQuotation/vehiclegroupTours`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      console.error('❌ Failed to fetch group tours:', response.status);
      throw new Error(`Failed to fetch group tours: ${response.status}`);
    }

    const tours = await response.json();
    console.log('📍 Group tours fetched:', tours);
    return tours || [];
  } catch (error) {
    console.error('❌ Error fetching vehicle group tours:', error);
    throw error;
  }
};

/**
 * Submit quotation for a group tour
 */
export const submitVehicleQuotation = async (
  tourId: string,
  quotationData: Omit<VehicleQuotation, '_id' | 'createdAt' | 'updatedAt'>
): Promise<VehicleQuotation> => {
  try {
    const token = await getToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const userId = await getUserIdFromToken();
    if (!userId) {
      throw new Error('Could not extract user ID from token');
    }

    // Prepare the data with vehicle owner ID
    const dataToSubmit = {
      ...quotationData,
      vehicleOwnerId: userId,
      pendingTripId: tourId,
    };

    console.log('📤 Submitting Vehicle Quotation:');
    console.log('   - Tour ID:', tourId);
    console.log('   - Amount:', dataToSubmit.quotedAmount);
    console.log('   - Vehicle Owner ID:', userId);
    console.log('   - Notes:', dataToSubmit.quotationNotes);

    const response = await fetch(
      `${API_BASE_URL}/VehicleOwnerQuotation/submitQuotation/${tourId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(dataToSubmit),
      }
    );

    console.log('🔄 API Response Status:', response.status);

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: 'Unknown error' };
      }
      console.error('❌ API Error:', errorData);
      throw new Error(errorData.message || `Server error: ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ Quotation submitted successfully:', result);
    return result;
  } catch (error) {
    console.error('❌ Error submitting vehicle quotation:', error);
    throw error;
  }
};

/**
 * Fetch submitted quotations for the current vehicle owner
 */
export const fetchSubmittedVehicleQuotations = async (): Promise<VehicleQuotation[]> => {
  try {
    const token = await getToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const userId = await getUserIdFromToken();
    if (!userId) {
      throw new Error('Could not extract user ID from token');
    }

    console.log('📡 Fetching submitted quotations for user:', userId);

    const response = await fetch(
      `${API_BASE_URL}/VehicleOwnerQuotation/vehicleOwnerId/${userId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      console.error('❌ Failed to fetch submitted quotations:', response.status);
      throw new Error(`Failed to fetch quotations: ${response.status}`);
    }

    const quotations = await response.json();
    console.log('📋 Submitted quotations fetched:', quotations);
    return quotations || [];
  } catch (error) {
    console.error('❌ Error fetching submitted quotations:', error);
    throw error;
  }
};

/**
 * Get quotation details by ID
 */
export const getVehicleQuotationById = async (quotationId: string): Promise<VehicleQuotation> => {
  try {
    const token = await getToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    console.log('📡 Fetching quotation details for:', quotationId);

    const response = await fetch(`${API_BASE_URL}/VehicleOwnerQuotation/${quotationId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch quotation: ${response.status}`);
    }

    const quotation = await response.json();
    console.log('📋 Quotation details fetched:', quotation);
    return quotation;
  } catch (error) {
    console.error('❌ Error fetching quotation details:', error);
    throw error;
  }
};

/**
 * Update quotation status (accept, reject, etc.)
 */
export const updateQuotationStatus = async (
  quotationId: string,
  status: 'accepted' | 'rejected' | 'expired'
): Promise<VehicleQuotation> => {
  try {
    const token = await getToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    console.log('📤 Updating quotation status:', quotationId, 'to', status);

    const response = await fetch(
      `${API_BASE_URL}/VehicleOwnerQuotation/${quotationId}/status`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to update quotation: ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ Quotation status updated:', result);
    return result;
  } catch (error) {
    console.error('❌ Error updating quotation status:', error);
    throw error;
  }
};

export default {
  fetchVehicleGroupTours,
  submitVehicleQuotation,
  fetchSubmittedVehicleQuotations,
  getVehicleQuotationById,
  updateQuotationStatus,
  getUserIdFromToken,
};
