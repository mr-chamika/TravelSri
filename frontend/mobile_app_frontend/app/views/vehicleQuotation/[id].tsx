import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  RefreshControl,
  Alert,
  Modal,
  TextInput,
  Dimensions,
  FlatList,
  ActivityIndicator
} from 'react-native';
import { 
  MapPin, 
  Calendar, 
  Users, 
  Clock, 
  DollarSign, 
  FileText, 
  Send, 
  Eye, 
  Edit3, 
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowLeft,
  Tag,
  RefreshCw,
  Navigation
} from 'lucide-react-native';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

interface TourDetails {
  id: string,
  destination: string;
  startDate: Date;
  endDate: Date;
  duration: string;
  groupSize: number;
  tourType: string;
  specialRequests?: string;
  budget?: string;
  accommodation?: string;
  transportation?: string;
  startLocation?: string;
  endLocation?: string;
  path?: string;
  pickupTime?: Date;
}

interface QuotationRequest {
  id: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  tourDetails: TourDetails;
  requestDate: Date;
  status: 'pending' | 'quoted' | 'expired';
  priority: 'high' | 'medium' | 'low';
}

interface SubmittedQuotation {
  id: string;
  guideId: string;
  status: string;
  quotedAmount: number;
  notes: string;
  submittedDate: string;
  validUntil?: string;
  currency: string;
  tourDetails: {
    destination: string;
    startDate: string;
    endDate: string;
    groupSize: number;
    duration: string;
    tourType?: string;
    startLocation?: string;
    endLocation?: string;
    path?: string;
  };
  clientName: string;
}

interface BackendTripData {
  _id: string;
  title: string;
  start_location: string;
  end_location: string;
  number_of_seats: number;
  date: string;
  number_of_dates: number;
  description_about_start_location: string;
  pickup_time: string;
  path: string;
  _class: string;
}

interface EditableQuotation {
  id: string;
  quotedAmount: number;
  notes: string;
  status: string;
}

const QuotationsScreen = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'requests' | 'submitted'>('requests');
  const [requests, setRequests] = useState<QuotationRequest[]>([]);
  const [submittedQuotations, setSubmittedQuotations] = useState<SubmittedQuotation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<QuotationRequest | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [quotationForm, setQuotationForm] = useState({
    amount: '',
    notes: ''
  });

  const [backendData, setBackendData] = useState<BackendTripData[]>([]);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editingQuote, setEditingQuote] = useState<SubmittedQuotation | null>(null);
  const [editFormData, setEditFormData] = useState({
    quotedAmount: '',
    notes: ''
  });

    // Safer conversion function with better error handling
const convertBackendDataToRequests = (backendData: BackendTripData[]): QuotationRequest[] => {
  console.log('Converting backend data:', backendData);
  
  if (!Array.isArray(backendData)) {
    console.error('Backend data is not an array:', backendData);
    return [];
  }

  return backendData.map((trip, index) => {
    try {
      console.log(`Processing trip ${index}:`, trip);
      
      // Safely parse dates with fallbacks
      let startDate: Date;
      try {
        startDate = trip.date ? new Date(trip.date) : new Date();
        if (isNaN(startDate.getTime())) {
          startDate = new Date();
        }
      } catch (e) {
        console.warn('Invalid start date, using current date:', trip.date);
        startDate = new Date();
      }

      let pickupTime: Date;
      try {
        pickupTime = trip.pickup_time ? new Date(trip.pickup_time) : new Date();
        if (isNaN(pickupTime.getTime())) {
          pickupTime = new Date();
        }
      } catch (e) {
        console.warn('Invalid pickup time, using current time:', trip.pickup_time);
        pickupTime = new Date();
      }

      // Calculate end date safely
      const endDate = new Date(startDate);
      const daysToAdd = (trip.number_of_dates || 1) - 1;
      endDate.setDate(startDate.getDate() + daysToAdd);
      
      // Determine priority based on number of seats with proper typing
      let priority: 'high' | 'medium' | 'low' = 'low';
      const seats = trip.number_of_seats || 0;
      if (seats > 6) {
        priority = 'high';
      } else if (seats > 3) {
        priority = 'medium';
      }

      // Use proper status type
      const status: 'pending' | 'quoted' | 'expired' = 'pending';

      const converted: QuotationRequest = {
        id: trip._id || `temp_${index}`,
        clientName: trip.title || 'Unknown Trip',
        clientPhone: '',
        clientEmail: '',
        tourDetails: {
          id: trip._id || `temp_${index}`,
          destination: `${trip.start_location || 'Unknown'} to ${trip.end_location || 'Unknown'}`,
          startDate: startDate,
          endDate: endDate,
          duration: `${trip.number_of_dates || 1} day${(trip.number_of_dates || 1) > 1 ? 's' : ''}`,
          groupSize: trip.number_of_seats || 0,
          tourType: trip.title || 'Standard Trip',
          specialRequests: trip.description_about_start_location || '',
          budget: '',
          accommodation: '',
          transportation: '',
          startLocation: trip.start_location || '',
          endLocation: trip.end_location || '',
          path: trip.path || '',
          pickupTime: pickupTime,
        },
        requestDate: startDate,
        status: status,
        priority: priority
      };

      console.log(`Converted trip ${index}:`, converted);
      return converted;
      
    } catch (error) {
      console.error(`Error converting trip ${index}:`, error, trip);
      // Return a default object to prevent the entire conversion from failing
      const errorRequest: QuotationRequest = {
        id: `error_${index}`,
        clientName: 'Error Loading Trip',
        clientPhone: '',
        clientEmail: '',
        tourDetails: {
          id: `error_${index}`,
          destination: 'Error Loading',
          startDate: new Date(),
          endDate: new Date(),
          duration: '1 day',
          groupSize: 0,
          tourType: 'Error',
          specialRequests: 'Error loading trip data',
          budget: '',
          accommodation: '',
          transportation: '',
          startLocation: '',
          endLocation: '',
          path: '',
          pickupTime: new Date(),
        },
        requestDate: new Date(),
        status: 'pending' as const,  // Explicitly type as literal
        priority: 'low' as const     // Explicitly type as literal
      };
      return errorRequest;
    }
  });
};

  // Fetch quotation requests with new API endpoint
  // Updated fetchRequests function with better error handling and debugging
const fetchRequests = async () => {
  try {
    setError(null);
    console.log('Starting to fetch requests...');
    
    // Use your actual IP address instead of localhost
    const apiUrl = 'http://localhost:8080/vehicle/groupTours'; // Replace XXX with your IP
    console.log('Fetching from URL:', apiUrl);
    
    const res = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Add timeout
      signal: AbortSignal.timeout(10000)
    });

    console.log('Response status:', res.status);
    console.log('Response ok:', res.ok);

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    console.log('Raw backend data:', JSON.stringify(data, null, 2));
    console.log('Data type:', typeof data);
    console.log('Is array:', Array.isArray(data));
    console.log('Data length:', data?.length);

    if (data && Array.isArray(data)) {
      console.log('First item structure:', JSON.stringify(data[0], null, 2));
      setBackendData(data);
      
      // Convert backend data to frontend format
      const convertedRequests = convertBackendDataToRequests(data);
      console.log('Converted requests:', JSON.stringify(convertedRequests, null, 2));
      setRequests(convertedRequests);
    } else {
      console.log("Data is not an array or is empty");
      setRequests([]);
    }
  } catch (err) {
  const error = err instanceof Error ? err : new Error(String(err));
  console.log('error in refresh: ', error.message);
  console.error('Error stack:', error.stack);
}
};

  // Fetch submitted quotations (keeping the same as it might not change)
  const fetchSubmittedQuotations = async () => {
    try {
      const ownerId = "TEMP_VEHICLE_OWNER_ID_001";
      
      if (!ownerId) {
        console.error('Owner ID not found');
        Alert.alert('Error', 'Owner ID not found. Please log in again.');
        return;
      }

      setError(null);

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      const authToken = await AsyncStorage.getItem('authToken');
      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }

      const res = await fetch(`http://localhost:8080/vehicle/submittedQuotation/${ownerId}`, {
        method: 'GET',
        headers: headers,
        signal: AbortSignal.timeout(10000),
      });
      
      if (!res.ok) {
        if (res.status === 401) {
          console.error('Unauthorized access - clearing stored credentials');
          await AsyncStorage.multiRemove(['authToken', 'guideId']);
          throw new Error('Authentication failed. Please log in again.');
        }
        
        const errorMessage = res.status === 404 
          ? 'No quotations found' 
          : `Failed to fetch quotations (${res.status})`;
        throw new Error(errorMessage);
      }

      const data = await res.json();
      console.log('Fetched submitted quotations:', data);

      if (!Array.isArray(data)) {
        throw new Error('Invalid response format');
      }

      const formatted: SubmittedQuotation[] = data.map((item: any) => ({
        id: item.quotationId || item._id || item.id,
        guideId: item.guideId || item.ownerId,
        status: item.status?.toLowerCase() || 'pending',
        quotedAmount: parseFloat(item.quotedAmount) || 0,
        notes: item.quotationNotes || item.notes || '',
        submittedDate: item.quotationDate || item.submittedDate || new Date().toISOString(),
        validUntil: item.validUntil || '',
        currency: item.currency || 'LKR',
        clientName: item.tourDetails?.title || item.clientName || 'Unknown Client',
        tourDetails: {
          destination: item.tourDetails?.destination || 
                      `${item.tourDetails?.start_location || 'Unknown'} to ${item.tourDetails?.end_location || 'Unknown'}`,
          startDate: item.tourDetails?.startDate || item.tourDetails?.date || '',
          endDate: item.tourDetails?.endDate || item.tourDetails?.date || '',
          groupSize: item.tourDetails?.groupSize || item.tourDetails?.number_of_seats || 1,
          duration: item.tourDetails?.duration || 
                   `${item.tourDetails?.number_of_dates || 1} day${(item.tourDetails?.number_of_dates || 1) > 1 ? 's' : ''}`,
          tourType: item.tourDetails?.tourType || item.tourDetails?.title || 'Standard',
          startLocation: item.tourDetails?.start_location || '',
          endLocation: item.tourDetails?.end_location || '',
          path: item.tourDetails?.path || '',
        }
      }));

      setSubmittedQuotations(formatted);
    } catch (error) {
      console.error('Error fetching submitted quotations:', error);
      let errorMessage = 'Failed to fetch quotations';
      if (error instanceof Error) {
        errorMessage = error.message;
      }

      setError(errorMessage);

      if (!errorMessage.includes('404') && !errorMessage.includes('No quotations found')) {
        Alert.alert('Error', errorMessage);
      }
    }
  };

  // Initial data fetch
  useEffect(() => {
    const initData = async () => {
      setLoading(true);
      await Promise.all([
        fetchRequests(),
        fetchSubmittedQuotations()
      ]);
      setLoading(false);
    };

    initData();
  }, []);

  // Refresh function
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        fetchRequests(),
        fetchSubmittedQuotations()
      ]);
    } catch (err) {
      console.log('error in refresh: ', err);
    } finally {
      setRefreshing(false);
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  const formatDate = (date: Date | string): string => {
    const d = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(d.getTime())) return 'Invalid Date';
    return d.toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (date: Date | string): string => {
    const d = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(d.getTime())) return 'Invalid Time';
    return d.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return '#EF4444';
      case 'medium':
        return '#F59E0B';
      case 'low':
        return '#10B981';
      default:
        return '#6B7280';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return '#F59E0B';
      case 'accepted':
      case 'quoted':
        return '#10B981';
      case 'rejected':
      case 'expired':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle size={16} color="#10B981" />;
      case 'rejected':
        return <XCircle size={16} color="#EF4444" />;
      case 'pending':
        return <AlertCircle size={16} color="#F59E0B" />;
      default:
        return <FileText size={16} color="#6B7280" />;
    }
  };

  const handleSubmitQuotation = (request: QuotationRequest) => {
    setSelectedRequest(request);
    setModalVisible(true);
  };

  const submitQuotation = async () => {
    console.log('Submit quotation called');
    
    try {
      if (!quotationForm.amount || quotationForm.amount.trim() === '') {
        Alert.alert('Error', 'Please fill in the total amount');
        return;
      }

      const parsedAmount = parseFloat(quotationForm.amount);
      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        Alert.alert('Error', 'Please enter a valid amount greater than 0');
        return;
      }

      if (!selectedRequest) {
        Alert.alert('Error', 'No request selected');
        return;
      }

      let guideId = await AsyncStorage.getItem('guideId');
      if (!guideId) {
        console.warn('Guide ID not found in AsyncStorage. Using temporary guide ID...');
        guideId = 'TEMP_VEHICLE_OWNER_ID_001';
      }

      const quotationData = {
        amount: parseFloat(quotationForm.amount),
        notes: quotationForm.notes || '',
        guideId: guideId,
      };

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      const authToken = await AsyncStorage.getItem('authToken');
      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }

      // Updated endpoint to match new structure
      const response = await fetch(`http://localhost:8080/vehicle/submitQuotation/${selectedRequest.id}`, {
        method: 'PUT',
        headers: headers,
        body: JSON.stringify(quotationData),
      });

      if (!response.ok) {
        if (response.status === 401) {
          Alert.alert('Authentication Error', 'Your session has expired. Please log in again.');
          await AsyncStorage.multiRemove(['authToken', 'guideId']);
          return;
        } else if (response.status === 400) {
          const errorText = await response.text();
          Alert.alert('Validation Error', errorText || 'Invalid data provided');
          return;
        } else if (response.status === 404) {
          Alert.alert('Error', 'Trip request not found');
          return;
        } else {
          const errorText = await response.text();
          Alert.alert('Error', `Failed to submit quotation: ${response.status} - ${errorText}`);
          return;
        }
      }

      const updatedQuotation = await response.json();
      
      setRequests(prevRequests =>
        prevRequests.map(request =>
          request.id === selectedRequest.id
            ? { ...request, status: 'quoted' }
            : request
        )
      );

      setQuotationForm({
        amount: '',
        notes: ''
      });

      Alert.alert('Success', 'Quotation submitted successfully!');
      setModalVisible(false);
      await onRefresh();

    } catch (error) {
      console.error('Error in submitQuotation:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      Alert.alert('Network Error', `Failed to connect to server: ${errorMessage}`);
    }
  };

  const formatTimeAgo = (date: Date | string): string => {
    const now = new Date();
    const requestDate = new Date(date);
    const diffInMs = now.getTime() - requestDate.getTime();
    
    const minutes = Math.floor(diffInMs / (1000 * 60));
    const hours = Math.floor(diffInMs / (1000 * 60 * 60));
    const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(days / 7);
    
    if (minutes < 60) {
      return minutes <= 1 ? 'Just now' : `${minutes} minutes ago`;
    } else if (hours < 24) {
      return hours === 1 ? '1 hour ago' : `${hours} hours ago`;
    } else if (days < 7) {
      return days === 1 ? '1 day ago' : `${days} days ago`;
    } else {
      return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`;
    }
  };

  const renderRequestCard = (request: QuotationRequest) => (
    <View key={request.id} style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.headerLeft}>
          <Text style={styles.clientName}>{request.clientName}</Text>
          <Text style={styles.requestDate}>Requested: {formatTimeAgo(request.requestDate)}</Text>
        </View>
        <View style={styles.headerRight}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(request.status) }]}>
            <Text style={styles.statusText}>{request.status.toUpperCase()}</Text>
          </View>
        </View>
      </View>

      <View style={styles.tourDetails}>
        <View style={styles.detailRow}>
          <Navigation size={18} color="#6B7280" />
          <Text style={styles.detailText}>{request.tourDetails.destination}</Text>
        </View>
        <View style={styles.detailRow}>
          <MapPin size={18} color="#6B7280" />
          <Text style={styles.detailText}>
            From: {request.tourDetails.startLocation} → To: {request.tourDetails.endLocation}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Calendar size={18} color="#6B7280" />
          <Text style={styles.detailText}>
            {formatDate(request.tourDetails.startDate)}
            {request.tourDetails.endDate !== request.tourDetails.startDate && 
              ` - ${formatDate(request.tourDetails.endDate)}`}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Users size={18} color="#6B7280" />
          <Text style={styles.detailText}>{request.tourDetails.groupSize} seats</Text>
        </View>
        <View style={styles.detailRow}>
          <Clock size={18} color="#6B7280" />
          <Text style={styles.detailText}>
            {request.tourDetails.duration} • Pickup: {formatTime(request.tourDetails.pickupTime || new Date())}
          </Text>
        </View>
        {request.tourDetails.path && (
          <View style={styles.detailRow}>
            <Tag size={18} color="#6B7280" />
            <Text style={styles.detailText}>Route: {request.tourDetails.path}</Text>
          </View>
        )}
      </View>

      {request.tourDetails.specialRequests && (
        <View style={styles.specialRequests}>
          <Text style={styles.specialRequestsLabel}>Pickup Details:</Text>
          <Text style={styles.specialRequestsText}>{request.tourDetails.specialRequests}</Text>
        </View>
      )}

      <View style={styles.cardActions}>
        {request.status === 'pending' && (
          <TouchableOpacity 
            style={[styles.actionButton, styles.primaryButton]} 
            onPress={() => handleSubmitQuotation(request)}
          >
            <Send size={18} color="#FFFFFF" />
            <Text style={[styles.actionText, styles.primaryButtonText]}>Submit Quote</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  // Helper functions for the actions
  const handleViewBreakdown = (quotationId: string) => {
    Alert.alert('View Breakdown', `Viewing breakdown for quotation ${quotationId}`);
  };

  const handleEditQuote = (quotationId: string) => {
    console.log('handleEditQuote called with ID:', quotationId);
    console.log('Available quotations:', submittedQuotations);
    
    const quotationToEdit = submittedQuotations.find((q: SubmittedQuotation) => q.id === quotationId);
    console.log('Found quotation to edit:', quotationToEdit);
    
    if (quotationToEdit) {
      setEditingQuote(quotationToEdit);
      setEditFormData({
        quotedAmount: quotationToEdit.quotedAmount.toString(),
        notes: quotationToEdit.notes
      });
      console.log('Setting modal visible to true');
      setShowEditModal(true);
    } else {
      console.log('Quotation not found with ID:', quotationId);
      Alert.alert('Error', 'Quotation not found');
    }
  };

  const handleSaveEdit = async (quotationId: string) => {
    try {
      if (!editFormData.quotedAmount) {
        Alert.alert('Error', 'Please enter a valid amount');
        return;
      }

      const updateData = {
        quotedAmount: parseFloat(editFormData.quotedAmount),
        notes: editFormData.notes
      };

      // Update local state for demo purposes
      setSubmittedQuotations(prev => prev.map(q => 
        q.id === quotationId ? { ...q, ...updateData } : q
      ));
      setShowEditModal(false);
      setEditingQuote(null);
      setEditFormData({ quotedAmount: '', notes: '' });
      Alert.alert('Success', 'Quotation updated successfully!');

    } catch (error) {
      console.error('Error updating quotation:', error);
      Alert.alert('Error', 'Failed to update quotation');
    }
  };

  const handleCancelEdit = () => {
    setShowEditModal(false);
    setEditingQuote(null);
    setEditFormData({ quotedAmount: '', notes: '' });
  };

  const handleGenerateInvoice = (quotationId: string) => {
    Alert.alert(
      'Generate Invoice',
      'Are you sure you want to generate an invoice for this quotation?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Generate', onPress: () => console.log('Generate invoice for', quotationId) }
      ]
    );
  };

  const renderSubmittedCard = (quotation: SubmittedQuotation) => (
    <View key={quotation.id} style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.headerLeft}>
          <Text style={styles.clientName} numberOfLines={1}>
            {quotation.clientName}
          </Text>
          <Text style={styles.requestDate}>
            Submitted: {formatDate(quotation.submittedDate)}
          </Text>
          {quotation.validUntil && (
            <Text style={styles.validUntil}>
              Valid until: {formatDate(quotation.validUntil)}
            </Text>
          )}
        </View>
        <View style={styles.headerRight}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(quotation.status) }]}>
            {getStatusIcon(quotation.status)}
            <Text style={styles.statusText}>{quotation.status.toUpperCase()}</Text>
          </View>
        </View>
      </View>

      <View style={styles.tourDetails}>
        <View style={styles.detailRow}>
          <Navigation size={18} color="#6B7280" />
          <Text style={styles.detailText} numberOfLines={2}>
            {quotation.tourDetails.destination}
          </Text>
        </View>
        {quotation.tourDetails.startLocation && quotation.tourDetails.endLocation && (
          <View style={styles.detailRow}>
            <MapPin size={18} color="#6B7280" />
            <Text style={styles.detailText}>
              {quotation.tourDetails.startLocation} → {quotation.tourDetails.endLocation}
            </Text>
          </View>
        )}
        <View style={styles.detailRow}>
          <Calendar size={18} color="#6B7280" />
          <Text style={styles.detailText}>
            {formatDate(quotation.tourDetails.startDate)} - {formatDate(quotation.tourDetails.endDate)}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Users size={18} color="#6B7280" />
          <Text style={styles.detailText}>
            {quotation.tourDetails.groupSize} seats • {quotation.tourDetails.duration}
          </Text>
        </View>
        {quotation.tourDetails.tourType && (
          <View style={styles.detailRow}>
            <Tag size={18} color="#6B7280" />
            <Text style={styles.detailText}>{quotation.tourDetails.tourType}</Text>
          </View>
        )}
        {quotation.tourDetails.path && (
          <View style={styles.detailRow}>
            <Tag size={18} color="#6B7280" />
            <Text style={styles.detailText}>Route: {quotation.tourDetails.path}</Text>
          </View>
        )}
      </View>

      <View style={styles.quotationAmount}>
        <DollarSign size={20} color="#10B981" />
        <Text style={styles.amountText}>
          {quotation.currency} {quotation.quotedAmount.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })}
        </Text>
      </View>

      {quotation.notes && (
        <View style={styles.notes}>
          <Text style={styles.notesLabel}>Notes:</Text>
          <Text style={styles.notesText} numberOfLines={3}>
            {quotation.notes}
          </Text>
        </View>
      )}

      <View style={styles.cardActions}>
        {(quotation.status === 'pending' || quotation.status === 'quoted') && (
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={() => {
              console.log('Edit button pressed - ID:', quotation.id);
              console.log('Status:', quotation.status);
              handleEditQuote(quotation.id);
            }}
          >
            <Edit3 size={18} color="#6B7280" />
            <Text style={styles.actionText}>Edit Quote</Text>
          </TouchableOpacity>
        )}
        
        {quotation.status === 'accepted' && (
          <TouchableOpacity 
            style={[styles.actionButton, styles.primaryButton]} 
            onPress={() => handleGenerateInvoice(quotation.id)}
            accessible={true}
            accessibilityLabel="Generate invoice"
          >
            <FileText size={18} color="#FFFFFF" />
            <Text style={[styles.actionText, styles.primaryButtonText]}>Generate Invoice</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const renderEditModal = () => (
    <Modal
      visible={showEditModal}
      animationType="slide"
      transparent={true}
      onRequestClose={handleCancelEdit}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Edit Quotation</Text>
            <TouchableOpacity onPress={handleCancelEdit}>
              <XCircle size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            {editingQuote && (
              <View style={styles.requestSummary}>
                <Text style={styles.requestSummaryTitle}>Quotation Details:</Text>
                <Text style={styles.requestSummaryText}>
                  {editingQuote.tourDetails.destination} - {editingQuote.tourDetails.duration}
                </Text>
                <Text style={styles.requestSummaryText}>
                  {editingQuote.tourDetails.groupSize} seats
                </Text>
                <Text style={styles.requestSummaryText}>
                  Client: {editingQuote.clientName}
                </Text>
                <Text style={styles.requestSummaryText}>
                  Status: {editingQuote.status.toUpperCase()}
                </Text>
              </View>
            )}
            
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Total Amount ({editingQuote?.currency || 'LKR'}) *</Text>
              <TextInput
                style={styles.formInput}
                value={editFormData.quotedAmount}
                onChangeText={(text) => {
                  const numericText = text.replace(/[^0-9.]/g, '');
                  setEditFormData({...editFormData, quotedAmount: numericText});
                }}
                placeholder="Enter total amount"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Notes</Text>
              <TextInput
                style={[styles.formInput, styles.textArea]}
                value={editFormData.notes}
                onChangeText={(text) => setEditFormData({...editFormData, notes: text})}
                placeholder="Additional notes or terms"
                multiline
                numberOfLines={4}
              />
            </View>

            {editingQuote && (
              <View style={styles.editInfo}>
                <Text style={styles.editInfoTitle}>Original Submission:</Text>
                <Text style={styles.editInfoText}>
                  Amount: {editingQuote.currency} {editingQuote.quotedAmount.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </Text>
                <Text style={styles.editInfoText}>
                  Submitted: {formatDate(editingQuote.submittedDate)}
                </Text>
                {editingQuote.validUntil && (
                  <Text style={styles.editInfoText}>
                    Valid until: {formatDate(editingQuote.validUntil)}
                  </Text>
                )}
              </View>
            )}
          </ScrollView>

          <View style={styles.modalActions}>
            <TouchableOpacity 
              style={styles.cancelButton} 
              onPress={handleCancelEdit}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.submitButton} 
              onPress={() => {
                if (editingQuote) {
                  handleSaveEdit(editingQuote.id);
                }
              }}
            >
              <Text style={styles.submitButtonText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  // Main render for submitted quotations list
  const renderSubmittedQuotationsList = () => {
    if (loading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.loadingText}>Loading quotations...</Text>
        </View>
      );
    }

    if (error && submittedQuotations.length === 0) {
      return (
        <View style={styles.centerContainer}>
          <AlertCircle size={48} color="#EF4444" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton} 
            onPress={fetchSubmittedQuotations}
          >
            <RefreshCw size={18} color="#FFFFFF" />
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (submittedQuotations.length === 0) {
      return (
        <View style={styles.centerContainer}>
          <FileText size={48} color="#9CA3AF" />
          <Text style={styles.emptyTitle}>No Quotations Yet</Text>
          <Text style={styles.emptySubtitle}>
            Your submitted quotations will appear here once you start creating them.
          </Text>
        </View>
      );
    }

    return submittedQuotations.map(renderSubmittedCard);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FEFA17" barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={handleGoBack}
          >
            <ArrowLeft size={24} color="#111827" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Trip Quotations</Text>
        </View>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'requests' && styles.activeTab]}
            onPress={() => setActiveTab('requests')}
          >
            <Text style={[styles.tabText, activeTab === 'requests' && styles.activeTabText]}>
              New Requests ({requests.filter(r => r.status === 'pending').length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'submitted' && styles.activeTab]}
            onPress={() => setActiveTab('submitted')}
          >
            <Text style={[styles.tabText, activeTab === 'submitted' && styles.activeTabText]}>
              Submitted ({submittedQuotations.length})
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {activeTab === 'requests' ? (
          <>
            {requests.map(renderRequestCard)}
            {requests.length === 0 && !loading && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>No trip requests found</Text>
              </View>
            )}
          </>
        ) : (
          <>
            {renderSubmittedQuotationsList()}
          </>
        )}
      </ScrollView>

      {/* Quotation Form Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Submit Quotation</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <XCircle size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalContent}>
              {selectedRequest && (
                <View style={styles.requestSummary}>
                  <Text style={styles.requestSummaryTitle}>Trip Request Summary:</Text>
                  <Text style={styles.requestSummaryText}>
                    {selectedRequest.tourDetails.destination} - {selectedRequest.tourDetails.duration}
                  </Text>
                  <Text style={styles.requestSummaryText}>
                    {selectedRequest.tourDetails.groupSize} seats available
                  </Text>
                  <Text style={styles.requestSummaryText}>
                    Route: {selectedRequest.tourDetails.path}
                  </Text>
                  <Text style={styles.requestSummaryText}>
                    Pickup: {formatTime(selectedRequest.tourDetails.pickupTime || new Date())}
                  </Text>
                </View>
              )}
              
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Total Amount (LKR) *</Text>
                <TextInput
                  style={styles.formInput}
                  value={quotationForm.amount}
                  onChangeText={(text) => setQuotationForm({...quotationForm, amount: text})}
                  placeholder="Enter total amount"
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Notes</Text>
                <TextInput
                  style={[styles.formInput, styles.textArea]}
                  value={quotationForm.notes}
                  onChangeText={(text) => setQuotationForm({...quotationForm, notes: text})}
                  placeholder="Additional notes or terms"
                  multiline
                  numberOfLines={4}
                />
              </View>
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.cancelButton} 
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.submitButton} 
                onPress={submitQuotation}
              >
                <Text style={styles.submitButtonText}>Submit Quotation</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Modal */}
      {renderEditModal()}
    </SafeAreaView>
  );
};

// Styles remain the same as the original code
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#FEFA17',
    paddingBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
  },
  backButton: {
    marginRight: 16,
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    flex: 1,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderRadius: 8,
    marginHorizontal: 4,
  },
  activeTab: {
    backgroundColor: '#111827',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    marginLeft: 12,
  },
  clientName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  requestDate: {
    fontSize: 12,
    color: '#6B7280',
  },
  validUntil: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  tourDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
  },
  specialRequests: {
    backgroundColor: '#F3F4F6',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  specialRequestsLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 4,
  },
  specialRequestsText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  quotationAmount: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    gap: 8,
  },
  amountText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#059669',
  },
  notes: {
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  notesLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 4,
  },
  notesText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  cardActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
    gap: 6,
  },
  primaryButton: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  primaryButtonText: {
    color: '#FFFFFF',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 12,
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 16,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EF4444',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#374151',
    marginTop: 12,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    minHeight: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  requestSummary: {
    backgroundColor: '#F3F4F6',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  requestSummaryTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  requestSummaryText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  formGroup: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  formInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  editInfo: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  editInfoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  editInfoText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  modalActions: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6B7280',
  },
  submitButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
  },
});

export default QuotationsScreen;