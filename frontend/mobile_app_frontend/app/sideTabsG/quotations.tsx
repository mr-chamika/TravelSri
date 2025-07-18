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
  Dimensions
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
  ArrowLeft
} from 'lucide-react-native';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

interface TourDetails {
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
  requestId: string;
  clientName: string;
  tourDetails: TourDetails;
  quotedAmount: number;
  currency: string;
  submittedDate: Date;
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
  validUntil: Date;
  breakdown: {
    guideService: number;
    transportation?: number;
    accommodation?: number;
    meals?: number;
    activities?: number;
    other?: number;
  };
  notes?: string;
}


// Backend data interface
interface BackendTourData {
  _id: string;
  description: string;
  destination: string;
  durationInDays: number;
  endDate: string;
  groupSize: number;
  guideId: string;
  startDate: string;
  status: string;
  tourTitle: string;
  createdAt: string;
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
  const [quotationForm, setQuotationForm] = useState({
    amount: '',
    guideService: '',
    transportation: '',
    accommodation: '',
    meals: '',
    activities: '',
    other: '',
    notes: ''
  });

  const [backendData, setBackendData] = useState<BackendTourData[]>([]);

  // Function to convert backend data to frontend format
const convertBackendDataToRequests = (backendData: BackendTourData[]): QuotationRequest[] => {
  return backendData.map((tour) => ({
    id: tour._id,
    clientName: tour.tourTitle,
    clientPhone: '',
    clientEmail: '',
    tourDetails: {
      destination: tour.destination,
      startDate: new Date(tour.startDate),
      endDate: new Date(tour.endDate),
      duration: `${tour.durationInDays} days`,
      groupSize: tour.groupSize,
      tourType: tour.tourTitle,
      specialRequests: tour.description,
      budget: '',
      accommodation: '',
      transportation: '',
    },
    requestDate: new Date(tour.createdAt),
    status: tour.status === 'active' ? 'pending' : 'expired',
    priority: tour.groupSize > 6 ? 'high' : tour.groupSize > 3 ? 'medium' : 'low'
  }));
};


  useEffect(() => {
    const getting = async () => {
      try {
        setLoading(true);
        const res = await fetch('http://localhost:8080/guide/groupTours');
        const data = await res.json();

        if (data) {
          console.log('Backend data:', data);
          setBackendData(data);
          
          // Convert backend data to frontend format
          const convertedRequests = convertBackendDataToRequests(data);
          setRequests(convertedRequests);
        } else {
          console.log("Error");
        }
      } catch (err) {
        console.log('error in quotation getting : ', err);
        Alert.alert('Error', 'Failed to load quotations');
      } finally {
        setLoading(false);
      }
    };
    getting();
  }, []);

  // Mock data for submitted quotations
  const mockSubmittedQuotations: SubmittedQuotation[] = [
  {
    id: '1',
    requestId: '3',
    clientName: 'Emma Davis',
    tourDetails: {
      destination: 'Ella & Yala National Park',
      startDate: new Date('2024-07-25'),
      endDate: new Date('2024-07-28'),
      duration: '4 days',
      groupSize: 8,
      tourType: 'Adventure & Wildlife'
    },
    quotedAmount: 320000,
    currency: 'LKR',
    submittedDate: new Date('2024-07-10'),
    status: 'pending',
    validUntil: new Date('2024-07-17'),
    breakdown: {
      guideService: 80000,
      transportation: 120000,
      accommodation: 80000,
      meals: 30000,
      activities: 10000
    },
    notes: 'Includes professional wildlife guide, safari vehicle with driver, and park entrance fees.'
  },
  {
    id: '2',
    requestId: '4',
    clientName: 'Michael Brown',
    tourDetails: {
      destination: 'Galle & Mirissa',
      startDate: new Date('2024-06-15'),
      endDate: new Date('2024-06-17'),
      duration: '3 days',
      groupSize: 5,
      tourType: 'Coastal'
    },
    quotedAmount: 185000,
    currency: 'LKR',
    submittedDate: new Date('2024-06-10'),
    status: 'accepted',
    validUntil: new Date('2024-06-17'),
    breakdown: {
      guideService: 60000,
      transportation: 75000,
      accommodation: 40000,
      meals: 10000
    },
    notes: 'Coastal tour with whale watching experience included.'
  },
  {
    id: '3',
    requestId: '5',
    clientName: 'Lisa Wang',
    tourDetails: {
      destination: 'Anuradhapura & Polonnaruwa',
      startDate: new Date('2024-06-01'),
      endDate: new Date('2024-06-04'),
      duration: '4 days',
      groupSize: 3,
      tourType: 'Historical'
    },
    quotedAmount: 210000,
    currency: 'LKR',
    submittedDate: new Date('2024-05-28'),
    status: 'rejected',
    validUntil: new Date('2024-06-04'),
    breakdown: {
      guideService: 70000,
      transportation: 80000,
      accommodation: 50000,
      meals: 10000
    },
    notes: 'Ancient cities tour with archaeological expertise.'
  }
];


  useEffect(() => {
    setSubmittedQuotations(mockSubmittedQuotations);
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const res = await fetch('http://localhost:8080/guide/groupTours');
      const data = await res.json();

      if (data) {
        setBackendData(data);
        const convertedRequests = convertBackendDataToRequests(data);
        setRequests(convertedRequests);
      }
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
  console.log('Quotation form:', quotationForm);
  console.log('Selected request:', selectedRequest);

  try {
    // Step 1: Validate form
    if (!quotationForm.amount) {
      console.log('Amount validation failed');
      Alert.alert('Error', 'Please fill in the total amount');
      return;
    }

    if (!selectedRequest) {
      console.log('Selected request validation failed');
      Alert.alert('Error', 'No request selected');
      return;
    }

    console.log('Form validation passed');

    // Step 2: Get guide ID from AsyncStorage or use a temporary fallback
    console.log('Attempting to get guideId from AsyncStorage...');
    let guideId = await AsyncStorage.getItem('guideId');

    if (!guideId) {
      console.warn('Guide ID not found in AsyncStorage. Using temporary guide ID...');
      guideId = 'TEMP_GUIDE_ID_001'; // Temporary fallback guide ID
    }
    console.log('Guide ID:', guideId);

    // Step 3: Get auth token (optional — keep for future auth or skip it now)
    console.log('Attempting to get authToken from AsyncStorage...');
    const authToken = await AsyncStorage.getItem('authToken');
    console.log('Auth token found:', !!authToken);

    // Step 4: Prepare quotation data
    const quotationData = {
      amount: parseFloat(quotationForm.amount),
      notes: quotationForm.notes || '',
      guideId: guideId,
    };

    console.log('Quotation data prepared:', quotationData);

    // Step 5: Prepare request URL and headers
    const requestUrl = `http://localhost:8080/guide/quotation/${selectedRequest.id}`;
    console.log('Request URL:', requestUrl);

    const requestHeaders = {
      'Content-Type': 'application/json',
      // 'Authorization': `Bearer ${authToken}`, // Optional for dev
    };
    console.log('Request headers:', requestHeaders);

    // Step 6: Make the API call
    console.log('Making API call...');
    const response = await fetch(requestUrl, {
      method: 'PUT',
      headers: requestHeaders,
      body: JSON.stringify(quotationData),
    });

    console.log('Response received - Status:', response.status);
    console.log('Response OK:', response.ok);

    if (!response.ok) {
      console.log('Response not OK - Status:', response.status);
      const errorText = await response.text();
      console.error('Error response text:', errorText);

      if (response.status === 401) {
        console.log('Authentication error detected');
        Alert.alert('Authentication Error', 'Your session has expired. Please log in again.');
        await AsyncStorage.removeItem('authToken');
        await AsyncStorage.removeItem('guideId');
        return;
      }

      Alert.alert('Error', `Failed to submit quotation: ${response.status} - ${errorText}`);
      return;
    }

    // Step 7: Parse response
    console.log('Attempting to parse response...');
    let updatedQuotation;
    try {
      updatedQuotation = await response.json();
      console.log('Response parsed successfully:', updatedQuotation);
    } catch (jsonError) {
      console.error('JSON parsing error:', jsonError);
      Alert.alert('Error', 'Invalid response format from server');
      return;
    }

    // Step 8: Update local state
    console.log('Updating local state...');
    setRequests(prevRequests =>
      prevRequests.map(request =>
        request.id === selectedRequest.id
          ? { ...request, status: 'quoted' }
          : request
      )
    );

    // Step 9: Show success message and cleanup
    console.log('Showing success message...');
    Alert.alert('Success', 'Quotation submitted successfully!');

    console.log('Closing modal...');
    setModalVisible(false);

    console.log('Resetting form...');
    setQuotationForm({
      amount: '',
      guideService: '',
      transportation: '',
      accommodation: '',
      meals: '',
      activities: '',
      other: '',
      notes: ''
    });

    console.log('Refreshing data...');
    await onRefresh();

    console.log('Submit quotation completed successfully');

  } catch (error) {
    console.error('Caught error in submitQuotation:', error);
    console.error('Error type:', typeof error);

    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }

    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    Alert.alert('Error', `Network error: ${errorMessage}`);
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
          {/* <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(request.priority) }]}>
            <Text style={styles.priorityText}>{request.priority.toUpperCase()}</Text>
          </View> */}
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(request.status) }]}>
            <Text style={styles.statusText}>{request.status.toUpperCase()}</Text>
          </View>
        </View>
      </View>

      <View style={styles.tourDetails}>
        <View style={styles.detailRow}>
          <MapPin size={18} color="#6B7280" />
          <Text style={styles.detailText}>{request.tourDetails.destination}</Text>
        </View>
        <View style={styles.detailRow}>
          <Calendar size={18} color="#6B7280" />
          <Text style={styles.detailText}>
            {formatDate(request.tourDetails.startDate)} - {formatDate(request.tourDetails.endDate)}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Users size={18} color="#6B7280" />
          <Text style={styles.detailText}>{request.tourDetails.groupSize} people</Text>
        </View>
        <View style={styles.detailRow}>
          <Clock size={18} color="#6B7280" />
          <Text style={styles.detailText}>{request.tourDetails.duration}</Text>
        </View>
      </View>

      {request.tourDetails.budget && (
        <View style={styles.budgetContainer}>
          <Text style={styles.budgetLabel}>Budget: </Text>
          <Text style={styles.budgetText}>{request.tourDetails.budget}</Text>
        </View>
      )}

      {request.tourDetails.specialRequests && (
        <View style={styles.specialRequests}>
          <Text style={styles.specialRequestsLabel}>Special Requests:</Text>
          <Text style={styles.specialRequestsText}>{request.tourDetails.specialRequests}</Text>
        </View>
      )}

      <View style={styles.cardActions}>
        {/* <TouchableOpacity style={styles.actionButton} onPress={() => {}}>
          <Eye size={18} color="#6B7280" />
          <Text style={styles.actionText}>View Details</Text>
        </TouchableOpacity> */}
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

  const renderSubmittedCard = (quotation: SubmittedQuotation) => (
    <View key={quotation.id} style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.headerLeft}>
          <Text style={styles.clientName}>{quotation.clientName}</Text>
          <Text style={styles.requestDate}>Submitted: {formatDate(quotation.submittedDate)}</Text>
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
          <MapPin size={18} color="#6B7280" />
          <Text style={styles.detailText}>{quotation.tourDetails.destination}</Text>
        </View>
        <View style={styles.detailRow}>
          <Calendar size={18} color="#6B7280" />
          <Text style={styles.detailText}>
            {formatDate(quotation.tourDetails.startDate)} - {formatDate(quotation.tourDetails.endDate)}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Users size={18} color="#6B7280" />
          <Text style={styles.detailText}>{quotation.tourDetails.groupSize} people</Text>
        </View>
      </View>

      <View style={styles.quotationAmount}>
        <DollarSign size={20} color="#10B981" />
        <Text style={styles.amountText}>
          {quotation.currency} {quotation.quotedAmount.toLocaleString()}
        </Text>
      </View>

      <View style={styles.validUntil}>
        <Text style={styles.validUntilText}>Valid until: {formatDate(quotation.validUntil)}</Text>
      </View>

      {quotation.notes && (
        <View style={styles.notes}>
          <Text style={styles.notesLabel}>Notes:</Text>
          <Text style={styles.notesText}>{quotation.notes}</Text>
        </View>
      )}

      <View style={styles.cardActions}>
        <TouchableOpacity style={styles.actionButton} onPress={() => {}}>
          <Eye size={18} color="#6B7280" />
          <Text style={styles.actionText}>View Breakdown</Text>
        </TouchableOpacity>
        {quotation.status === 'pending' && (
          <TouchableOpacity style={styles.actionButton} onPress={() => {}}>
            <Edit3 size={18} color="#6B7280" />
            <Text style={styles.actionText}>Edit Quote</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor="#FEFA17" barStyle="dark-content" />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading quotations...</Text>
        </View>
      </SafeAreaView>
    );
  }

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
            {requests.length === 0 && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>No quotation requests found</Text>
              </View>
            )}
          </>
        ) : (
          <>
            {submittedQuotations.map(renderSubmittedCard)}
            {submittedQuotations.length === 0 && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>No submitted quotations found</Text>
              </View>
            )}
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
                    {selectedRequest.tourDetails.destination} - {selectedRequest.tourDetails.duration}
                  </Text>
                  <Text style={styles.requestSummaryText}>
                    {selectedRequest.tourDetails.groupSize} people
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
    marginBottom: 12,
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
});

export default QuotationsScreen;
