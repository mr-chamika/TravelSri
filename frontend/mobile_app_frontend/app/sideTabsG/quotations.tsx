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
  Route,
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

interface BackendTourData {
  _id: { $oid: string }; // Your exact format: { "$oid": "6877415deb564b0b5336a378" }
  title: string;
  start_location: string;
  end_location: string;
  number_of_seats: number;
  date: { $date: string }; // Your format: { "$date": "2025-08-12T18:30:00.000Z" }
  number_of_dates: number;
  description_about_start_location: string;
  pickup_time: { $date: string }; // Your format: { "$date": "2025-07-16T00:30:00.000Z" }
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

  const [backendData, setBackendData] = useState<BackendTourData[]>([]);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editingQuote, setEditingQuote] = useState<SubmittedQuotation | null>(null);
  const [editFormData, setEditFormData] = useState({
    quotedAmount: '',
    notes: ''
  });

  // Simple function to extract MongoDB ObjectId from any format
  const extractObjectId = (idField: any): string => {
    console.log('🔍 Extracting ID from:', JSON.stringify(idField), 'Type:', typeof idField);

    if (!idField) {
      console.log('❌ ID field is null/undefined');
      return `FALLBACK_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    // Case 1: Already a string (most common in Spring Boot)
    if (typeof idField === 'string' && idField.length === 24 && /^[a-f0-9]{24}$/i.test(idField)) {
      console.log('✅ Valid ObjectId string:', idField);
      return idField;
    }

    // Case 2: Spring Boot returns { $oid: "..." } - THIS IS YOUR CASE!
    if (idField && typeof idField === 'object' && idField.$oid) {
      const objectId = idField.$oid;
      console.log('✅ ObjectId from $oid:', objectId);
      // Validate it's a proper ObjectId
      if (typeof objectId === 'string' && objectId.length === 24 && /^[a-f0-9]{24}$/i.test(objectId)) {
        return objectId;
      } else {
        console.log('❌ Invalid ObjectId format in $oid:', objectId);
      }
    }

    // Case 3: Try converting object to string and look for ObjectId pattern
    if (typeof idField === 'object') {
      const stringified = JSON.stringify(idField);
      console.log('🔍 Searching in stringified object:', stringified);

      // Look for ObjectId pattern in the JSON - matches your format exactly
      const match = stringified.match(/"?\$oid"?\s*:\s*"([a-f0-9]{24})"/i);
      if (match && match[1]) {
        console.log('✅ ObjectId found via regex:', match[1]);
        return match[1];
      }
    }

    // Case 4: Try direct string conversion
    const stringVersion = String(idField);
    if (stringVersion.length === 24 && /^[a-f0-9]{24}$/i.test(stringVersion)) {
      console.log('✅ ObjectId from String():', stringVersion);
      return stringVersion;
    }

    console.log('❌ Could not extract valid ObjectId, creating fallback');
    console.log('❌ Original data was:', idField);
    return `FALLBACK_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  // Function to convert backend data to frontend format
  const convertBackendDataToRequests = (backendData: BackendTourData[]): QuotationRequest[] => {
    console.log('🔄 Converting backend data to requests...');
    console.log('📊 Backend data sample:', JSON.stringify(backendData[0], null, 2));

    const converted = backendData.map((trip, index) => {
      console.log(`\n--- Converting Trip ${index + 1} ---`);
      console.log('Raw trip:', JSON.stringify(trip, null, 2));

      try {
        // Use the robust ID extraction function
        const tourId = extractObjectId(trip._id);
        console.log('✅ Final Tour ID:', tourId);

        // Handle MongoDB date format with error handling
        let tripDate: Date;
        let pickupTime: Date;

        try {
          tripDate = new Date(trip.date.$date);
          console.log('✅ Trip date parsed:', tripDate);
        } catch (dateError) {
          console.error('❌ Error parsing trip date:', dateError);
          tripDate = new Date(); // Fallback to current date
        }

        try {
          pickupTime = new Date(trip.pickup_time.$date);
          console.log('✅ Pickup time parsed:', pickupTime);
        } catch (timeError) {
          console.error('❌ Error parsing pickup time:', timeError);
          pickupTime = new Date(); // Fallback to current time
        }

        // Calculate end date based on number_of_dates
        const endDate = new Date(tripDate);
        endDate.setDate(endDate.getDate() + (trip.number_of_dates - 1));

        const priority: 'high' | 'medium' | 'low' = trip.number_of_seats > 6 ? 'high' : trip.number_of_seats > 3 ? 'medium' : 'low';

        const converted = {
          id: tourId, // Use the extracted string ID
          clientName: trip.title,
          clientPhone: '',
          clientEmail: '',
          tourDetails: {
            id: tourId,
            destination: trip.end_location,
            startDate: tripDate,
            endDate: endDate,
            duration: `${trip.number_of_dates} day${trip.number_of_dates > 1 ? 's' : ''}`,
            groupSize: trip.number_of_seats,
            tourType: trip.title,
            specialRequests: trip.description_about_start_location,
            budget: '',
            accommodation: '',
            transportation: '',
            startLocation: trip.start_location,
            endLocation: trip.end_location,
            path: trip.path,
            pickupTime: pickupTime,
          },
          requestDate: tripDate,
          status: 'pending' as const,
          priority: priority
        };

        console.log(`✅ Trip ${index + 1} converted successfully`);
        return converted;

      } catch (error) {
        console.error(`❌ Error converting trip ${index + 1}:`, error);
        console.error('❌ Failed trip data:', trip);

        // Return a fallback object to prevent the whole conversion from failing
        return {
          id: `ERROR_TRIP_${index}`,
          clientName: trip.title || 'Unknown Trip',
          clientPhone: '',
          clientEmail: '',
          tourDetails: {
            id: `ERROR_TRIP_${index}`,
            destination: trip.end_location || 'Unknown',
            startDate: new Date(),
            endDate: new Date(),
            duration: '1 day',
            groupSize: trip.number_of_seats || 1,
            tourType: trip.title || 'Unknown',
            specialRequests: trip.description_about_start_location || '',
            budget: '',
            accommodation: '',
            transportation: '',
            startLocation: trip.start_location || 'Unknown',
            endLocation: trip.end_location || 'Unknown',
            path: trip.path || '',
            pickupTime: new Date(),
          },
          requestDate: new Date(),
          status: 'pending' as const,
          priority: 'medium' as const
        };
      }
    });

    // Log all extracted IDs for verification
    const extractedIds = converted.map(c => c.id);
    console.log('\n🆔 All extracted Tour IDs:', extractedIds);
    console.log('❗ FALLBACK IDs detected:', extractedIds.filter(id => id.startsWith('FALLBACK')).length);
    console.log('❗ ERROR IDs detected:', extractedIds.filter(id => id.startsWith('ERROR_TRIP')).length);

    console.log('✅ Conversion complete. Total converted:', converted.length);
    return converted;
  };

  // Fetch quotation requests - Updated to match your working endpoint
  const fetchRequests = async () => {
    console.log('🚀 Starting fetchRequests...');
    try {
      // First, let's try the original endpoint you mentioned
      console.log('📡 Fetching from: http://localhost:8080/guide/groupTours');
      const res = await fetch('http://localhost:8080/guide/groupTours', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('📥 Response status:', res.status);
      console.log('📥 Response ok:', res.ok);

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();

      console.log('=== RAW BACKEND RESPONSE ===');
      console.log('Response type:', typeof data);
      console.log('Is array:', Array.isArray(data));
      console.log('Length:', data?.length);
      console.log('First item (raw):', data?.[0]);
      console.log('=============================');

      if (data && Array.isArray(data) && data.length > 0) {
        console.log('✅ Data received, converting...');
        setBackendData(data);

        // Convert backend data to frontend format
        const convertedRequests = convertBackendDataToRequests(data);
        console.log('✅ Conversion complete. Converted count:', convertedRequests.length);
        setRequests(convertedRequests);
      } else if (data && Array.isArray(data) && data.length === 0) {
        console.log("ℹ️ Empty array - No pending trips found");
        setRequests([]);
      } else {
        console.log("⚠️ Invalid data format received. Data:", data);
        setRequests([]);
      }
    } catch (err) {
      console.error('❌ Error in fetchRequests:', err);
      Alert.alert('Error', `Failed to load quotations: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setRequests([]);
    }
  };

  // Fetch submitted quotations
  const fetchSubmittedQuotations = async () => {
    try {
      const guideId = "TEMP_GUIDE_ID_001";
      if (!guideId) {
        console.error('Guide ID not found in AsyncStorage');
        Alert.alert('Error', 'Guide ID not found. Please log in again.');
        return;
      }

      setError(null);

      const res = await fetch(`http://localhost:8080/guide/submittedQuotation/${guideId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(10000),
      });

      if (!res.ok) {
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
        guideId: item.guideId,
        status: item.status?.toLowerCase() || 'pending',
        quotedAmount: parseFloat(item.quotedAmount) || 0,
        notes: item.quotationNotes || item.notes || '',
        submittedDate: item.quotationDate || item.submittedDate || new Date().toISOString(),
        validUntil: item.validUntil || '',
        currency: item.currency || 'LKR',
        clientName: item.tourDetails?.clientName || item.clientName || 'TravelSri Group Tour',
        tourDetails: {
          destination: item.tourDetails?.destination || 'Unknown Destination',
          startDate: item.tourDetails?.startDate || '',
          endDate: item.tourDetails?.endDate || '',
          groupSize: item.tourDetails?.groupSize || 1,
          duration: item.tourDetails?.durationInDays
            ? `${item.tourDetails.durationInDays} days`
            : 'Duration not specified',
          tourType: item.tourDetails?.tourType || 'Standard',
          startLocation: item.tourDetails?.startLocation || '',
          endLocation: item.tourDetails?.endLocation || '',
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

      if (!errorMessage.includes('404')) {
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
      minute: '2-digit',
      hour12: true
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
    console.log('🎯 Opening quotation form for tour ID:', request.id);
    setSelectedRequest(request);
    setModalVisible(true);
  };

  const submitQuotation = async () => {
    console.log('=== SUBMIT QUOTATION START ===');

    try {
      // Validate form
      if (!quotationForm.amount || quotationForm.amount.trim() === '') {
        Alert.alert('Error', 'Please fill in the total amount');
        return;
      }

      const parsedAmount = parseFloat(quotationForm.amount);
      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        Alert.alert('Error', 'Please enter a valid amount greater than 0');
        return;
      }

      if (!selectedRequest || !selectedRequest.id) {
        Alert.alert('Error', 'No tour selected');
        return;
      }

      // Get the Tour ID from the selected request
      const tourId = selectedRequest.id;
      console.log('🆔 Tour ID for submission:', tourId);

      // Prepare the request body (this is what your backend expects)
      const quotationData = {
        amount: parsedAmount,
        notes: quotationForm.notes || '',
        guideId: 'TEMP_GUIDE_ID_001' // This should come from your auth system
      };

      console.log('📦 Quotation data:', JSON.stringify(quotationData, null, 2));

      // Build the API URL with the tour ID
      const apiUrl = `http://localhost:8080/guide/submitQuotation/${tourId}`;
      console.log('🌐 API URL:', apiUrl);

      // Make the API call
      console.log('🚀 Submitting quotation...');
      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(quotationData),
      });

      console.log('📥 Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error response:', errorText);

        if (response.status === 404) {
          Alert.alert('Error', `Tour not found with ID: ${tourId}`);
        } else if (response.status === 400) {
          Alert.alert('Validation Error', errorText);
        } else {
          Alert.alert('Error', `Failed to submit quotation: ${response.status}`);
        }
        return;
      }

      // Success
      const result = await response.json();
      console.log('✅ Quotation submitted successfully:', result);

      // Update the local state to show the tour as "quoted"
      setRequests(prev => prev.map(req =>
        req.id === tourId ? { ...req, status: 'quoted' } : req
      ));

      // Reset form and close modal
      setQuotationForm({ amount: '', notes: '' });
      setModalVisible(false);

      Alert.alert('Success', 'Quotation submitted successfully!');

      // Refresh data
      await onRefresh();

    } catch (error) {
      console.error('❌ Network error:', error);
      Alert.alert('Network Error', 'Failed to connect to server. Please check your connection.');
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
          <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(request.priority) }]}>
            <Text style={styles.priorityText}>{request.priority.toUpperCase()}</Text>
          </View>
        </View>
      </View>

      <View style={styles.tourDetails}>
        {/* Route Information */}
        <View style={styles.detailRow}>
          <Navigation size={18} color="#6B7280" />
          <Text style={styles.detailText}>
            {request.tourDetails.startLocation} → {request.tourDetails.endLocation}
          </Text>
        </View>

        {/* Route Path */}
        {request.tourDetails.path && (
          <View style={styles.detailRow}>
            <Route size={18} color="#6B7280" />
            <Text style={styles.detailText}>{request.tourDetails.path}</Text>
          </View>
        )}

        {/* Date and Time */}
        <View style={styles.detailRow}>
          <Calendar size={18} color="#6B7280" />
          <Text style={styles.detailText}>
            {formatDate(request.tourDetails.startDate)}
            {request.tourDetails.endDate &&
              formatDate(request.tourDetails.startDate) !== formatDate(request.tourDetails.endDate) &&
              ` - ${formatDate(request.tourDetails.endDate)}`}
          </Text>
        </View>

        {/* Pickup Time */}
        {request.tourDetails.pickupTime && (
          <View style={styles.detailRow}>
            <Clock size={18} color="#6B7280" />
            <Text style={styles.detailText}>
              Pickup: {formatTime(request.tourDetails.pickupTime)}
            </Text>
          </View>
        )}

        {/* Group Size and Duration */}
        <View style={styles.detailRow}>
          <Users size={18} color="#6B7280" />
          <Text style={styles.detailText}>
            {request.tourDetails.groupSize} seats • {request.tourDetails.duration}
          </Text>
        </View>
      </View>

      {/* Pickup Instructions */}
      {request.tourDetails.specialRequests && (
        <View style={styles.pickupInstructions}>
          <Text style={styles.pickupInstructionsLabel}>Pickup Instructions:</Text>
          <Text style={styles.pickupInstructionsText}>{request.tourDetails.specialRequests}</Text>
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

      // Simulate successful update for now
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
        {/* Route Information */}
        {quotation.tourDetails.startLocation && quotation.tourDetails.endLocation && (
          <View style={styles.detailRow}>
            <Navigation size={18} color="#6B7280" />
            <Text style={styles.detailText}>
              {quotation.tourDetails.startLocation} → {quotation.tourDetails.endLocation}
            </Text>
          </View>
        )}

        {/* Route Path */}
        {quotation.tourDetails.path && (
          <View style={styles.detailRow}>
            <Route size={18} color="#6B7280" />
            <Text style={styles.detailText}>{quotation.tourDetails.path}</Text>
          </View>
        )}

        <View style={styles.detailRow}>
          <MapPin size={18} color="#6B7280" />
          <Text style={styles.detailText} numberOfLines={2}>
            {quotation.tourDetails.destination}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Calendar size={18} color="#6B7280" />
          <Text style={styles.detailText}>
            {formatDate(quotation.tourDetails.startDate)} - {formatDate(quotation.tourDetails.endDate)}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Users size={18} color="#6B7280" />
          <Text style={styles.detailText}>
            {quotation.tourDetails.groupSize} people • {quotation.tourDetails.duration}
          </Text>
        </View>
        {quotation.tourDetails.tourType && (
          <View style={styles.detailRow}>
            <Tag size={18} color="#6B7280" />
            <Text style={styles.detailText}>{quotation.tourDetails.tourType}</Text>
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
                  {editingQuote.tourDetails.groupSize} people
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
                  // Only allow numeric input
                  const numericText = text.replace(/[^0-9.]/g, '');
                  setEditFormData({ ...editFormData, quotedAmount: numericText });
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
                onChangeText={(text) => setEditFormData({ ...editFormData, notes: text })}
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
          <Text style={styles.headerTitle}>Quotations</Text>
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
                <Text style={styles.emptyStateText}>No quotation requests found</Text>
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
                  <Text style={styles.requestSummaryTitle}>Request Summary:</Text>
                  <Text style={styles.requestSummaryText}>
                    {selectedRequest.tourDetails.startLocation} → {selectedRequest.tourDetails.endLocation}
                  </Text>
                  <Text style={styles.requestSummaryText}>
                    {selectedRequest.tourDetails.groupSize} seats • {selectedRequest.tourDetails.duration}
                  </Text>
                  <Text style={styles.requestSummaryText}>
                    Date: {formatDate(selectedRequest.tourDetails.startDate)}
                  </Text>
                  {selectedRequest.tourDetails.pickupTime && (
                    <Text style={styles.requestSummaryText}>
                      Pickup: {formatTime(selectedRequest.tourDetails.pickupTime)}
                    </Text>
                  )}
                </View>
              )}

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Total Amount (LKR) *</Text>
                <TextInput
                  style={styles.formInput}
                  value={quotationForm.amount}
                  onChangeText={(text) => setQuotationForm({ ...quotationForm, amount: text })}
                  placeholder="Enter total amount"
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Notes</Text>
                <TextInput
                  style={[styles.formInput, styles.textArea]}
                  value={quotationForm.notes}
                  onChangeText={(text) => setQuotationForm({ ...quotationForm, notes: text })}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 8,
  },
  header: {
    backgroundColor: '#FEFA17',
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    elevation: 3,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButton: {
    padding: 8,
    marginRight: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    flex: 1,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#111827',
  },
  tabText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
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
    flexDirection: 'row',
    gap: 8,
  },
  clientName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  requestDate: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  tourDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailText: {
    fontSize: 14,
    color: '#374151',
    marginLeft: 8,
    flex: 1,
  },
  budgetContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    padding: 8,
    backgroundColor: '#F0FDF4',
    borderRadius: 6,
  },
  budgetLabel: {
    fontSize: 14,
    color: '#059669',
    fontWeight: '500',
  },
  budgetText: {
    fontSize: 14,
    color: '#059669',
    fontWeight: '600',
  },
  pickupInstructions: {
    marginBottom: 12,
    padding: 12,
    backgroundColor: '#EBF8FF',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
  },
  pickupInstructionsLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1E40AF',
    marginBottom: 4,
  },
  pickupInstructionsText: {
    fontSize: 14,
    color: '#1E40AF',
  },
  specialRequests: {
    marginBottom: 12,
    padding: 12,
    backgroundColor: '#FEF3C7',
    borderRadius: 8,
  },
  specialRequestsLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#92400E',
    marginBottom: 4,
  },
  specialRequestsText: {
    fontSize: 14,
    color: '#92400E',
  },
  quotationAmount: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    padding: 12,
    backgroundColor: '#ECFDF5',
    borderRadius: 8,
  },
  amountText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#10B981',
    marginLeft: 8,
  },
  validUntil: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  validUntilText: {
    fontSize: 12,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  notes: {
    marginBottom: 12,
    padding: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
  },
  notesLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  notesText: {
    fontSize: 14,
    color: '#6B7280',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
  },
  actionText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 6,
    fontWeight: '500',
  },
  primaryButton: {
    backgroundColor: '#111827',
    borderColor: '#111827',
  },
  primaryButtonText: {
    color: '#FFFFFF',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    width: width * 0.9,
    maxHeight: '80%',
    paddingVertical: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  modalContent: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  requestSummary: {
    backgroundColor: '#F3F4F6',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  requestSummaryTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  requestSummaryText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  formGroup: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  formInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#111827',
    backgroundColor: '#FFFFFF',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  breakdownTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
    marginTop: 8,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
    marginRight: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  submitButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#111827',
    marginLeft: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  errorText: {
    marginTop: 10,
    fontSize: 16,
    color: '#EF4444',
    textAlign: 'center',
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    backgroundColor: '#3B82F6',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginLeft: 8,
    fontWeight: 'bold',
  },
  emptyTitle: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6B7280',
  },
  emptySubtitle: {
    marginTop: 6,
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    paddingHorizontal: 30,
  },
  editInfo: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  editInfoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  editInfoText: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
});

export default QuotationsScreen;