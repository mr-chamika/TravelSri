import React, { useState, useEffect } from 'react';
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
  startDate: string;
  endDate: string;
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
  requestDate: string;
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
  submittedDate: string;
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
  validUntil: string;
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

  // Mock data for quotation requests
  const mockRequests: QuotationRequest[] = [
    {
      id: '1',
      clientName: 'Sarah Johnson',
      clientPhone: '+94 76 987 6543',
      clientEmail: 'sarah.johnson@email.com',
      tourDetails: {
        destination: 'Kandy & Nuwara Eliya',
        startDate: '2024-07-15',
        endDate: '2024-07-18',
        duration: '4 days',
        groupSize: 6,
        tourType: 'Cultural & Nature',
        specialRequests: 'Photography focused tour, early morning starts',
        budget: 'LKR 200,000 - 250,000',
        accommodation: '3-star hotels',
        transportation: 'Private van required'
      },
      requestDate: '2024-07-08',
      status: 'pending',
      priority: 'high'
    },
    {
      id: '2',
      clientName: 'David Wilson',
      clientPhone: '+94 77 123 4567',
      clientEmail: 'david.wilson@email.com',
      tourDetails: {
        destination: 'Sigiriya & Dambulla',
        startDate: '2024-07-20',
        endDate: '2024-07-22',
        duration: '3 days',
        groupSize: 4,
        tourType: 'Historical',
        specialRequests: 'Family with elderly parents, need comfortable transport',
        budget: 'LKR 150,000 - 180,000',
        accommodation: 'Comfortable hotels',
        transportation: 'Air-conditioned vehicle'
      },
      requestDate: '2024-07-09',
      status: 'pending',
      priority: 'medium'
    },
    {
      id: '3',
      clientName: 'Emma Davis',
      clientPhone: '+94 75 456 7890',
      clientEmail: 'emma.davis@email.com',
      tourDetails: {
        destination: 'Ella & Yala National Park',
        startDate: '2024-07-25',
        endDate: '2024-07-28',
        duration: '4 days',
        groupSize: 8,
        tourType: 'Adventure & Wildlife',
        specialRequests: 'Wildlife photography, camping experience',
        budget: 'LKR 300,000+',
        accommodation: 'Eco lodges',
        transportation: 'Safari vehicle included'
      },
      requestDate: '2024-07-10',
      status: 'quoted',
      priority: 'high'
    }
  ];

  // Mock data for submitted quotations
  const mockSubmittedQuotations: SubmittedQuotation[] = [
    {
      id: '1',
      requestId: '3',
      clientName: 'Emma Davis',
      tourDetails: {
        destination: 'Ella & Yala National Park',
        startDate: '2024-07-25',
        endDate: '2024-07-28',
        duration: '4 days',
        groupSize: 8,
        tourType: 'Adventure & Wildlife'
      },
      quotedAmount: 320000,
      currency: 'LKR',
      submittedDate: '2024-07-10',
      status: 'pending',
      validUntil: '2024-07-17',
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
        startDate: '2024-06-15',
        endDate: '2024-06-17',
        duration: '3 days',
        groupSize: 5,
        tourType: 'Coastal'
      },
      quotedAmount: 185000,
      currency: 'LKR',
      submittedDate: '2024-06-10',
      status: 'accepted',
      validUntil: '2024-06-17',
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
        startDate: '2024-06-01',
        endDate: '2024-06-04',
        duration: '4 days',
        groupSize: 3,
        tourType: 'Historical'
      },
      quotedAmount: 210000,
      currency: 'LKR',
      submittedDate: '2024-05-28',
      status: 'rejected',
      validUntil: '2024-06-04',
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
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      // Replace with actual API calls
      setTimeout(() => {
        setRequests(mockRequests);
        setSubmittedQuotations(mockSubmittedQuotations);
        setLoading(false);
      }, 1000);
    } catch (error) {
      Alert.alert('Error', 'Failed to load quotations');
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleGoBack = () => {
    router.back();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
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

  const submitQuotation = () => {
    if (!quotationForm.amount || !quotationForm.guideService) {
      Alert.alert('Error', 'Please fill in required fields');
      return;
    }

    // Here you would make an API call to submit the quotation
    Alert.alert('Success', 'Quotation submitted successfully!');
    setModalVisible(false);
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
  };

  const renderRequestCard = (request: QuotationRequest) => (
    <View key={request.id} style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.headerLeft}>
          <Text style={styles.clientName}>{request.clientName}</Text>
          <Text style={styles.requestDate}>Requested: {formatDate(request.requestDate)}</Text>
        </View>
        <View style={styles.headerRight}>
          <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(request.priority) }]}>
            <Text style={styles.priorityText}>{request.priority.toUpperCase()}</Text>
          </View>
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
        <TouchableOpacity style={styles.actionButton} onPress={() => {}}>
          <Eye size={18} color="#6B7280" />
          <Text style={styles.actionText}>View Details</Text>
        </TouchableOpacity>
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

              <Text style={styles.breakdownTitle}>Cost Breakdown:</Text>
              
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Guide Service (LKR) *</Text>
                <TextInput
                  style={styles.formInput}
                  value={quotationForm.guideService}
                  onChangeText={(text) => setQuotationForm({...quotationForm, guideService: text})}
                  placeholder="Guide service cost"
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Transportation (LKR)</Text>
                <TextInput
                  style={styles.formInput}
                  value={quotationForm.transportation}
                  onChangeText={(text) => setQuotationForm({...quotationForm, transportation: text})}
                  placeholder="Transportation cost"
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Accommodation (LKR)</Text>
                <TextInput
                  style={styles.formInput}
                  value={quotationForm.accommodation}
                  onChangeText={(text) => setQuotationForm({...quotationForm, accommodation: text})}
                  placeholder="Accommodation cost"
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Meals (LKR)</Text>
                <TextInput
                  style={styles.formInput}
                  value={quotationForm.meals}
                  onChangeText={(text) => setQuotationForm({...quotationForm, meals: text})}
                  placeholder="Meals cost"
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Activities (LKR)</Text>
                <TextInput
                  style={styles.formInput}
                  value={quotationForm.activities}
                  onChangeText={(text) => setQuotationForm({...quotationForm, activities: text})}
                  placeholder="Activities cost"
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
