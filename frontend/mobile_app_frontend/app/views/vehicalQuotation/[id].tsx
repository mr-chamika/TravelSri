import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import { useNavigation } from '@react-navigation/native';

const API_BASE_URL = 'http://localhost:8080';

interface MyToken {
  sub: string;
  id: string;
}

interface GroupTourRequest {
  ptId: string;
  title: string;
  startLocation: string;
  endLocation: string;
  numberOfSeats: number;
  date: string;
  numberOfDates: number;
  pickupTime: string;
  descriptionAboutStartLocation?: string;
}

interface VehicleQuotation {
  _id?: string;
  quotationId?: string;
  pendingTripId?: string;
  tourId?: string;
  vehicleOwnerId?: string;
  quotedAmount: number;
  quotationNotes: string;
  status: string;
  createdAt?: string;
  quotationDate?: string;
  tourDetails?: {
    ptId: string;
    title: string;
    startLocation: string;
    endLocation: string;
    numberOfSeats: number;
    date: string;
    numberOfDates: number;
    pickupTime: string;
    descriptionAboutStartLocation?: string;
    path?: string;
    guideId?: string | null;
    vehicleId?: string | null;
  };
}

// Helper function to parse route details
const parseRouteDetails = (pathString: string) => {
  // Example: "Route from Colombo to Kandy - Distance: 146 km, Estimated time: 3 hours 20 mins"
  const routeMatch = pathString.match(/Route from (.+ to .+?) -/);
  const distanceMatch = pathString.match(/Distance: ([\d\s\w]+),/);
  const timeMatch = pathString.match(/Estimated time: (.+?)(?:$|,)/);

  return {
    route: routeMatch ? routeMatch[1] : pathString,
    distance: distanceMatch ? distanceMatch[1] : '',
    time: timeMatch ? timeMatch[1] : '',
  };
};

export default function VehicleQuotationsScreen() {
  const [groupTours, setGroupTours] = useState<GroupTourRequest[]>([]);
  const [submittedQuotations, setSubmittedQuotations] = useState<VehicleQuotation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTour, setSelectedTour] = useState<GroupTourRequest | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [price, setPrice] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [filterType, setFilterType] = useState<'request' | 'submitted'>('request');
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const navigation = useNavigation();

  useEffect(() => {
    console.log('🚀 === useEffect START ===');
    loadData();
    console.log('🚀 === useEffect END ===');
  }, []);

  const testFetchGroupTours = async () => {
    console.log('=== DEBUG: testFetchGroupTours START ===');
    try {
      // Extract userId from JWT token
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.error('No token found in AsyncStorage');
        return;
      }
      
      const decoded = jwtDecode<MyToken>(token);
      const userId = decoded.id || decoded.sub;
      console.log('Extracted userId from JWT:', userId);
      console.log('Token:', token ? `${token.substring(0, 20)}...` : 'NO TOKEN');
      
      // Correct endpoint: /groupTours (not /vehiclegroupTours)
      console.log('\n--- TEST: Fetching from /groupTours ---');
      const url = `http://localhost:8080/api/vehicle/vehiclegroupTours`;
      console.log('URL:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Response Status:', response.status);
      const text = await response.text();
      console.log('Response Text:', text || '(empty response)');
      
      // Try parsing response
      if (text) {
        try {
          const jsonData = JSON.parse(text);
          console.log('✅ Parsed JSON:', jsonData);
          console.log('Is Array:', Array.isArray(jsonData));
          console.log('Array Length:', Array.isArray(jsonData) ? jsonData.length : 'N/A');
          
          if (Array.isArray(jsonData) && jsonData.length > 0) {
            console.log('\n📋 FIRST ITEM DETAILS:');
            console.log('Item:', JSON.stringify(jsonData[0], null, 2));
            console.log('Item Keys:', Object.keys(jsonData[0]));
          }
        } catch (parseErr) {
          console.error('❌ JSON Parse Error:', parseErr);
        }
      }
    } catch (err) {
      console.error('❌ Fetch Error:', err);
      console.error('Error Message:', err instanceof Error ? err.message : String(err));
      console.error('Error Stack:', err instanceof Error ? err.stack : 'N/A');
    }
    console.log('=== DEBUG: testFetchGroupTours END ===');
  };

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('📥 === loadData START ===');

      const token = await AsyncStorage.getItem('token');
      console.log('📥 Token found:', !!token);
      if (!token) {
        throw new Error('No token found');
      }

      console.log('📥 Calling fetchTours...');
      const tours = await fetchTours(token);
      console.log('📥 fetchTours returned:', tours?.length || 0, 'items');
      
      console.log('📥 Calling fetchQuotations...');
      const quotations = await fetchQuotations(token);
      console.log('📥 fetchQuotations returned:', quotations?.length || 0, 'items');

      console.log('📥 Setting state...');
      console.log('📥 Setting groupTours to:', tours || []);
      setGroupTours(tours || []);
      
      console.log('📥 Setting submittedQuotations to:', quotations || []);
      setSubmittedQuotations(quotations || []);
      
      console.log('📥 === loadData END (SUCCESS) ===');
    } catch (err) {
      console.error('❌ loadData Error:', err);
      const errorMsg = err instanceof Error ? err.message : 'Failed to load data';
      setError(errorMsg);
      console.error('📥 === loadData END (ERROR) ===');
    } finally {
      setLoading(false);
    }
  };

  const fetchTours = async (token: string): Promise<GroupTourRequest[]> => {
    console.log('=== DEBUG: fetchTours START (with JWT) ===');
    try {
      // Extract userId from token
      const decoded = jwtDecode<MyToken>(token);
      const userId = decoded.id || decoded.sub;
      console.log('📋 Extracted userId from token:', userId);

      const url = `${API_BASE_URL}/api/vehicle/vehiclegroupTours?userId=${userId}`;
      console.log('🌐 Fetching Group Tours URL:', url);
      console.log('API_BASE_URL:', API_BASE_URL);
      console.log('Full URL being called:', url);
      console.log('Token:', token ? `${token.substring(0, 20)}...` : 'NO TOKEN');
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Response Status:', response.status);
      console.log('Response OK:', response.ok);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error Response:', errorText);
        console.warn('Non-OK response, returning empty array');
        return [];
      }
      
      const data = await response.json();
      console.log('✅ Tours Data:', data);
      console.log('✅ Tours Count:', Array.isArray(data) ? data.length : 'Not array');
      if (Array.isArray(data) && data.length > 0) {
        console.log('✅ First Tour:', JSON.stringify(data[0], null, 2));
      }
      console.log('=== DEBUG: fetchTours END ===');
      return data || [];
    } catch (err) {
      console.error('❌ fetchTours Error:', err);
      console.error('Error Details:', err instanceof Error ? err.message : String(err));
      return [];
    }
  };

  const fetchQuotations = async (token: string): Promise<VehicleQuotation[]> => {
    console.log('=== DEBUG: fetchQuotations START ===');
    try {
      const decoded = jwtDecode<MyToken>(token);
      const userId = decoded.id || decoded.sub;
      console.log('📋 Decoded Token UserID:', userId);
      
      const url = `${API_BASE_URL}/api/vehicle/submittedQuotation/${userId}`;
      console.log('🌐 Fetching Submitted Quotations URL:', url);
      console.log('Full URL being called:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Response Status:', response.status);
      console.log('Response OK:', response.ok);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error Response:', errorText);
        console.warn('Non-OK response, returning empty array');
        return [];
      }
      
      const data = await response.json();
      console.log('✅ Quotations Data:', data);
      console.log('✅ Quotations Count:', Array.isArray(data) ? data.length : 'Not array');
      
      if (Array.isArray(data) && data.length > 0) {
        console.log('\n📦 === SUBMITTED QUOTATIONS DATA ===');
        console.log('Total Quotations:', data.length);
        
        // Show detailed info for each quotation
        data.forEach((quotation, index) => {
          console.log(`\n📋 Quotation ${index + 1}:`);
          console.log('  ID (_id):', quotation._id);
          console.log('  quotationId:', quotation.quotationId);
          console.log('  Tour ID (tourId):', quotation.tourId);
          console.log('  Pending Trip ID (pendingTripId):', quotation.pendingTripId);
          console.log('  Quoted Amount:', quotation.quotedAmount);
          console.log('  Notes:', quotation.quotationNotes);
          console.log('  Status:', quotation.status);
          
          // Check tourDetails
          console.log('\n  📍 Tour Details Analysis:');
          console.log('    Has tourDetails:', !!quotation.tourDetails);
          if (quotation.tourDetails) {
            console.log('    tourDetails type:', typeof quotation.tourDetails);
            console.log('    tourDetails keys:', Object.keys(quotation.tourDetails || {}));
            console.log('    tourDetails.ptId:', quotation.tourDetails.ptId);
            console.log('    tourDetails.title:', quotation.tourDetails.title);
            console.log('    tourDetails.startLocation:', quotation.tourDetails.startLocation);
            console.log('    tourDetails.endLocation:', quotation.tourDetails.endLocation);
            console.log('    tourDetails.numberOfSeats:', quotation.tourDetails.numberOfSeats);
            console.log('    tourDetails.date:', quotation.tourDetails.date);
            console.log('    tourDetails.pickupTime:', quotation.tourDetails.pickupTime);
            console.log('    tourDetails full:', JSON.stringify(quotation.tourDetails, null, 2));
          } else {
            console.warn('    ⚠️ NO tourDetails field in quotation!');
          }
          
          console.log('\n  Full Quotation Data:', JSON.stringify(quotation, null, 2));
        });
        
        console.log('\n📦 === END SUBMITTED QUOTATIONS DATA ===\n');
      } else {
        console.log('⚠️ No submitted quotations found');
      }
      
      console.log('=== DEBUG: fetchQuotations END ===');
      return data || [];
    } catch (err) {
      console.error('❌ fetchQuotations Error:', err);
      console.error('Error Details:', err instanceof Error ? err.message : String(err));
      return [];
    }
  };

  const handleSubmit = async () => {
    if (!selectedTour || !price.trim()) {
      Alert.alert('Required', 'Please enter a price');
      return;
    }

    try {
      setSubmitting(true);
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('No token');

      // Extract userId from token
      const decoded = jwtDecode<MyToken>(token);
      const userId = decoded.id || decoded.sub;

      console.log('📝 Submitting quotation:', {
        tourId: selectedTour?.ptId,
        userId: userId,
        amount: parseFloat(price),
        notes: notes,
      });

      const response = await fetch(
        `${API_BASE_URL}/api/vehicle/submitQuotation/${selectedTour?.ptId}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ownerId: userId,
            quotedAmount: parseFloat(price),
            quotationNotes: notes,
          }),
        }
      );

      console.log('Response Status:', response.status);
      console.log('Response OK:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error Response:', errorText);
        throw new Error('Failed to submit quotation');
      }

      const responseData = await response.json();
      console.log('✅ Quotation submitted successfully:', responseData);

      setShowModal(false);
      setPrice('');
      setNotes('');
      await loadData();
      Alert.alert('Success', 'Quotation submitted!');
    } catch (err) {
      Alert.alert('Error', err instanceof Error ? err.message : 'Failed to submit');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#FEFA17" />
          <Text style={styles.loadText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Filter out tours that already have submitted quotations
  const submittedTourIds = new Set(
    submittedQuotations.map(q => {
      const id = q.tourId || q.pendingTripId || q.tourDetails?.ptId;
      console.log('🔍 Submitted quotation tour ID:', id, '(tourId:', q.tourId, ', pendingTripId:', q.pendingTripId, ', tourDetails.ptId:', q.tourDetails?.ptId, ')');
      return id;
    })
  );
  
  console.log('📊 All submitted tour IDs:', Array.from(submittedTourIds));
  
  const filteredGroupTours = groupTours.filter(tour => {
    const hasSubmission = submittedTourIds.has(tour.ptId);
    if (hasSubmission) {
      console.log('🚫 Filtering out tour:', tour.ptId, '-', tour.title, '(already has submission)');
    }
    return !hasSubmission;
  });
  
  console.log('✅ Filtered tours (removed submitted):', filteredGroupTours.map(t => `${t.ptId}: ${t.title}`));
  
  const displayed = filterType === 'request' 
    ? filteredGroupTours  // Only show pending trips WITHOUT submitted quotations
    : submittedQuotations;  // Show all submitted quotations
  
  console.log('🎨 === RENDER ===');
  console.log('🎨 filterType:', filterType);
  console.log('🎨 groupTours:', groupTours.length);
  console.log('🎨 filteredGroupTours:', filteredGroupTours.length);
  console.log('🎨 submittedQuotations:', submittedQuotations.length);
  console.log('🎨 submittedTourIds:', Array.from(submittedTourIds));
  console.log('🎨 displayed:', displayed.length);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              loadData().finally(() => setRefreshing(false));
            }}
          />
        }
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.backText}>❮</Text>
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>Group Tour Quotations</Text>
            <Text style={styles.subtitle}>{filteredGroupTours.length} available</Text>
          </View>
        </View>

        <View style={styles.filterRow}>
          <TouchableOpacity
            style={[styles.filterBtn, filterType === 'request' && styles.filterActive]}
            onPress={() => setFilterType('request')}
          >
            <Text
              style={[
                styles.filterText,
                filterType === 'request' && { color: '#000', fontWeight: '700' },
              ]}
            >
              📬 Requests ({filteredGroupTours.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterBtn, filterType === 'submitted' && styles.filterActive]}
            onPress={() => setFilterType('submitted')}
          >
            <Text
              style={[
                styles.filterText,
                filterType === 'submitted' && { color: '#000', fontWeight: '700' },
              ]}
            >
              ✅ Submitted ({submittedQuotations.length})
            </Text>
          </TouchableOpacity>
        </View>

        {displayed.length === 0 ? (
          <View style={styles.emptyFilterState}>
            <Text style={styles.emptyFilterIcon}>
              {filterType === 'request' ? '📬' : '✅'}
            </Text>
            <Text style={styles.emptyFilterTitle}>
              {filterType === 'request' ? 'No Request Quotations' : 'No Submitted Quotations'}
            </Text>
            <Text style={styles.emptyFilterSubtitle}>
              {filterType === 'request' 
                ? 'All quotations have been submitted' 
                : 'No quotations submitted yet'}
            </Text>
          </View>
        ) : (
          <View style={styles.tripsList}>
            {displayed.map((item, idx) => {
              const isRequest = 'ptId' in item;
              const tour = isRequest ? (item as GroupTourRequest) : null;
              const quota = !isRequest ? (item as VehicleQuotation) : null;
              
              // Log rendering data
              console.log(`\n🎨 === RENDERING ITEM ${idx + 1} ===`);
              console.log('  isRequest:', isRequest);
              console.log('  Has quota:', !!quota);
              console.log('  Has tour:', !!tour);
              
              if (quota) {
                console.log('  quota.tourDetails:', !!quota.tourDetails);
                console.log('  quota.tourDetails keys:', quota.tourDetails ? Object.keys(quota.tourDetails) : 'N/A');
              }
              
              // For submitted quotations, get tour details from tourDetails field
              const quotaTourDetails = quota?.tourDetails;
              
              console.log('  quotaTourDetails:', !!quotaTourDetails);
              if (quotaTourDetails) {
                console.log('    title:', quotaTourDetails.title);
                console.log('    startLocation:', quotaTourDetails.startLocation);
                console.log('    endLocation:', quotaTourDetails.endLocation);
              }
              
              const tourTitle = tour?.title || quotaTourDetails?.title || 'Tour';
              const tourStart = tour?.startLocation || quotaTourDetails?.startLocation || 'N/A';
              const tourEnd = tour?.endLocation || quotaTourDetails?.endLocation || 'N/A';
              const tourDate = tour?.date || quotaTourDetails?.date || 'N/A';
              const tourSeats = tour?.numberOfSeats || quotaTourDetails?.numberOfSeats || 0;
              const tourDays = tour?.numberOfDates || quotaTourDetails?.numberOfDates || 0;

              const formatDate = (dateString: string | undefined) => {
                if (!dateString) return 'N/A';
                const date = new Date(dateString);
                return date.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                });
              };

              return (
                <TouchableOpacity
                  key={('ptId' in item ? item.ptId : item._id) || idx}
                  style={[styles.tripCard, { transform: [{ scale: false ? 1.02 : 1 }] }]}
                  onPress={() => {
                    if (isRequest) {
                      setSelectedTour(tour);
                      setShowModal(true);
                    } else {
                      // Toggle expand for submitted quotations
                      const cardKey = quota?._id || quota?.quotationId || idx.toString();
                      setExpandedCard(expandedCard === cardKey ? null : cardKey);
                    }
                  }}
                  activeOpacity={0.7}
                >
                  {/* Card Header */}
                  <View style={styles.cardHeader}>
                    <View style={styles.tripInfo}>
                      <Text style={styles.tripTitle}>
                        {tourTitle.toUpperCase()}
                      </Text>
                      <Text style={styles.tripRoute}>
                        {`${tourStart} → ${tourEnd}`}
                      </Text>
                    </View>
                    <View style={styles.cardBadge}>
                      <Text style={styles.badgeText}>#{idx + 1}</Text>
                    </View>
                  </View>

                  {/* Quick Info Row */}
                  <View style={styles.quickInfoRow}>
                    <View style={styles.quickInfoItem}>
                      <Text style={styles.quickInfoLabel}>Date</Text>
                      <Text style={styles.quickInfoValue}>
                        {formatDate(tourDate)}
                      </Text>
                    </View>
                    <View style={styles.quickInfoItem}>
                      <Text style={styles.quickInfoLabel}>Seats</Text>
                      <Text style={styles.quickInfoValue}>
                        {tourSeats}
                      </Text>
                    </View>
                    <View style={styles.quickInfoItem}>
                      <Text style={styles.quickInfoLabel}>{filterType === 'submitted' ? 'Amount' : 'Duration'}</Text>
                      <Text style={styles.quickInfoValue}>
                        {filterType === 'submitted' 
                          ? `₨${(quota?.quotedAmount || 0).toLocaleString()}` 
                          : `${tourDays} days`}
                      </Text>
                    </View>
                  </View>

                  {/* Expanded Details for Submitted Quotations */}
                  {!isRequest && expandedCard === (quota?._id || quota?.quotationId || idx.toString()) && quota && (
                    <View style={styles.expandedDetails}>
                      {/* Quotation Details Section */}
                      <Text style={styles.sectionTitle}>Quotation Details</Text>
                      
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Quoted Amount</Text>
                        <Text style={[styles.detailValue, { color: '#FEFA17', fontWeight: '700' }]}>
                          ₨{(quota.quotedAmount || 0).toLocaleString()}
                        </Text>
                      </View>
                      
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Status</Text>
                        <Text style={[
                          styles.detailValue, 
                          { 
                            color: quota.status === 'pending' ? '#FF9500' : '#34C759',
                            fontWeight: '700'
                          }
                        ]}>
                          {quota.status?.charAt(0).toUpperCase() + quota.status?.slice(1).toLowerCase()}
                        </Text>
                      </View>
                      
                      <View style={[styles.detailRow, { borderBottomWidth: 0 }]}>
                        <Text style={styles.detailLabel}>Notes</Text>
                        <Text style={[styles.detailValue, { maxWidth: '60%', flexWrap: 'wrap' }]}>
                          {quota.quotationNotes || 'No notes provided'}
                        </Text>
                      </View>

                      {/* Tour Details Section */}
                      {quotaTourDetails && (
                        <>
                          <Text style={styles.sectionTitle}>Tour Information</Text>
                          
                          <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Tour Title</Text>
                            <Text style={styles.detailValue}>{quotaTourDetails.title}</Text>
                          </View>
                          
                          <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Pickup Time</Text>
                            <Text style={styles.detailValue}>{quotaTourDetails.pickupTime || 'N/A'}</Text>
                          </View>
                          
                          <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Pickup Location</Text>
                            <Text style={[styles.detailValue, { maxWidth: '60%', flexWrap: 'wrap' }]}>
                              {quotaTourDetails.descriptionAboutStartLocation || 'N/A'}
                            </Text>
                          </View>

                          {/* Parsed Route Details */}
                          {quotaTourDetails.path && (() => {
                            const { route, distance, time } = parseRouteDetails(quotaTourDetails.path);
                            return (
                              <>
                                <View style={styles.detailRow}>
                                  <Text style={styles.detailLabel}>Route</Text>
                                  <Text style={[styles.detailValue, { maxWidth: '60%', flexWrap: 'wrap' }]}>{route}</Text>
                                </View>
                                
                                {distance && (
                                  <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Distance</Text>
                                    <Text style={styles.detailValue}>{distance}</Text>
                                  </View>
                                )}
                                
                                {time && (
                                  <View style={[styles.detailRow, { borderBottomWidth: 0 }]}>
                                    <Text style={styles.detailLabel}>Estimated Time</Text>
                                    <Text style={styles.detailValue}>{time}</Text>
                                  </View>
                                )}
                              </>
                            );
                          })()}
                        </>
                      )}
                    </View>
                  )}

                  {/* Card Footer */}
                  <View style={styles.cardFooter}>
                    <Text style={styles.expandIcon}>{isRequest ? '⬇' : (expandedCard === (quota?._id || quota?.quotationId || idx.toString()) ? '⬆' : '⬇')}</Text>
                    <Text style={styles.expandText}>
                      {isRequest ? 'Tap to submit quotation' : 'Tap to view details'}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </ScrollView>

      <Modal
        visible={showModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowModal(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={styles.backdrop}
          onPress={() => setShowModal(false)}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.modalContainer}
          >
            <TouchableOpacity activeOpacity={1} style={styles.modalContent}>
              {selectedTour && (
                <View style={styles.form}>
                  <View style={styles.formHeader}>
                    <Text style={styles.formTitle}>Submit Quotation</Text>
                    <TouchableOpacity onPress={() => setShowModal(false)}>
                      <Text style={styles.closeBtn}>×</Text>
                    </TouchableOpacity>
                  </View>

                  <ScrollView style={styles.formScroll}>
                    {/* Enhanced Tour Details Section */}
                    <View style={styles.tourDetailsSection}>
                      <Text style={styles.sectionTitle}>Tour Details</Text>
                      
                      {/* Tour Title */}
                      <View style={styles.detailCard}>
                        <View style={styles.detailRow}>
                          <Text style={styles.detailLabel}>🎫 Tour</Text>
                          <Text style={[styles.detailValue, { fontWeight: '700' }]}>
                            {selectedTour.title}
                          </Text>
                        </View>
                        
                        {/* Route */}
                        <View style={styles.detailRow}>
                          <Text style={styles.detailLabel}>📍 Route</Text>
                          <Text style={styles.detailValue}>
                            {selectedTour.startLocation} → {selectedTour.endLocation}
                          </Text>
                        </View>
                        
                        {/* Date */}
                        {selectedTour.date && (
                          <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>📅 Date</Text>
                            <Text style={styles.detailValue}>
                              {new Date(selectedTour.date).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </Text>
                          </View>
                        )}
                        
                        {/* Number of Days */}
                        {selectedTour.numberOfDates && (
                          <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>⏱️ Duration</Text>
                            <Text style={styles.detailValue}>
                              {selectedTour.numberOfDates} day{selectedTour.numberOfDates > 1 ? 's' : ''}
                            </Text>
                          </View>
                        )}
                        
                        {/* Pickup Time */}
                        {selectedTour.pickupTime && (
                          <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>🕐 Pickup Time</Text>
                            <Text style={styles.detailValue}>
                              {selectedTour.pickupTime}
                            </Text>
                          </View>
                        )}
                        
                        {/* Start Location Description */}
                        {selectedTour.descriptionAboutStartLocation && (
                          <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>📌 Pickup Location</Text>
                            <Text style={styles.detailValue}>
                              {selectedTour.descriptionAboutStartLocation}
                            </Text>
                          </View>
                        )}
                        
                        {/* Passengers */}
                        <View style={[styles.detailRow, { borderBottomWidth: 0 }]}>
                          <Text style={styles.detailLabel}>👥 Passengers</Text>
                          <Text style={styles.detailValue}>
                            {selectedTour.numberOfSeats} seat{selectedTour.numberOfSeats > 1 ? 's' : ''}
                          </Text>
                        </View>
                      </View>
                    </View>

                    <View style={styles.inputSection}>
                      <Text style={styles.label}>Price (LKR)*</Text>
                      <View style={styles.priceInput}>
                        <Text style={{ fontWeight: '700', color: '#FEFA17' }}>LKR</Text>
                        <TextInput
                          style={styles.input}
                          placeholder="Enter price"
                          keyboardType="decimal-pad"
                          value={price}
                          onChangeText={setPrice}
                          editable={!submitting}
                        />
                      </View>

                      <Text style={styles.label}>Notes (Optional)</Text>
                      <TextInput
                        style={[styles.input, { minHeight: 80 }]}
                        placeholder="Add notes..."
                        multiline
                        value={notes}
                        onChangeText={setNotes}
                        editable={!submitting}
                      />
                    </View>
                  </ScrollView>

                  <View style={styles.actions}>
                    <TouchableOpacity
                      style={[styles.btn, { backgroundColor: '#F0F0F0' }]}
                      onPress={() => setShowModal(false)}
                      disabled={submitting}
                    >
                      <Text style={{ color: '#000', fontWeight: '700' }}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.btn,
                        { backgroundColor: '#FEFA17', flex: 1.2 },
                        submitting && { opacity: 0.6 },
                      ]}
                      onPress={handleSubmit}
                      disabled={submitting || !price.trim()}
                    >
                      {submitting ? (
                        <ActivityIndicator color="#000" />
                      ) : (
                        <Text style={{ color: '#000', fontWeight: '700' }}>Submit</Text>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadText: { marginTop: 12, fontSize: 16, color: '#666' },
  
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FEFA1715',
    borderBottomWidth: 2,
    borderBottomColor: '#FEFA17',
  },
  backText: { fontSize: 32, fontWeight: '900', color: '#000', marginRight: 12 },
  title: { fontSize: 26, fontWeight: '700', color: '#000', marginBottom: 4 },
  subtitle: { fontSize: 14, color: '#8E8E93' },
  
  // Filter Tabs
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    backgroundColor: '#F5F7FA',
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  filterBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E8E8E8',
  },
  filterActive: { backgroundColor: '#FEFA17', borderColor: '#FEFA17' },
  filterText: { fontSize: 14, fontWeight: '600', color: '#666' },

  // Empty State
  emptyFilterState: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyFilterIcon: {
    fontSize: 60,
    marginBottom: 16,
  },
  emptyFilterTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  emptyFilterSubtitle: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },

  // Trip List
  tripsList: {
    padding: 16,
  },

  // Trip Card
  tripCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderLeftWidth: 4,
    borderLeftColor: '#FEFA17',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: '#FFFBF015',
  },
  tripInfo: {
    flex: 1,
  },
  tripTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#eba000ff',
    marginBottom: 4,
  },
  tripRoute: {
    fontSize: 14,
    color: '#8E8E93',
    fontWeight: '500',
  },
  cardBadge: {
    backgroundColor: '#FEFA17',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    shadowColor: '#FEFA17',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#000',
  },

  // Quick Info Row
  quickInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: '#F2F2F7',
    paddingTop: 12,
  },
  quickInfoItem: {
    alignItems: 'center',
    flex: 1,
  },
  quickInfoLabel: {
    fontSize: 12,
    color: '#8E8E93',
    marginBottom: 4,
    fontWeight: '600',
  },
  quickInfoValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#000',
  },

  // Card Footer
  cardFooter: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#F2F2F7',
    flexDirection: 'row',
    gap: 6,
  },
  expandIcon: {
    fontSize: 18,
    color: '#FEFA17',
    fontWeight: '700',
  },
  expandText: {
    fontSize: 14,
    color: '#000',
    fontWeight: '600',
  },

  // Expanded Details
  expandedDetails: {
    backgroundColor: '#FEFEF0',
    borderTopWidth: 1,
    borderTopColor: '#F2F2F7',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 12,
    borderBottomWidth: 2,
    borderBottomColor: '#FEFA17',
    paddingBottom: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  detailLabel: {
    fontSize: 14,
    color: '#8E8E93',
    fontWeight: '600',
    flex: 0.4,
  },
  detailValue: {
    fontSize: 15,
    color: '#000',
    fontWeight: '700',
    flex: 0.6,
    textAlign: 'right',
    flexWrap: 'wrap',
  },

  // Modal Styles
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'flex-end',
  },
  modalContainer: { flex: 1, justifyContent: 'flex-end' },
  modalContent: {
    width: '100%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
  },
  form: { flexDirection: 'column', maxHeight: '90%' },
  formHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderBottomWidth: 2,
    borderBottomColor: '#FEFA17',
    backgroundColor: '#FFFBF015',
  },
  formTitle: { fontSize: 22, fontWeight: '700', color: '#000' },
  closeBtn: { fontSize: 36, color: '#999' },
  formScroll: { flex: 1 },
  summary: {
    backgroundColor: '#FFFBF015',
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 14,
    borderLeftWidth: 4,
    borderLeftColor: '#FEFA17',
  },
  summaryText: { marginBottom: 8, fontSize: 14, color: '#000', fontWeight: '500' },
  inputSection: { paddingHorizontal: 20, paddingVertical: 16 },
  label: { fontSize: 15, fontWeight: '700', color: '#000', marginBottom: 10 },
  priceInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBF015',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FEFA1740',
    marginBottom: 20,
    paddingLeft: 14,
  },
  input: { flex: 1, paddingVertical: 13, paddingHorizontal: 10, fontSize: 16, color: '#000', fontWeight: '600' },
  
  // Tour Details Section in Modal
  tourDetailsSection: {
    backgroundColor: '#FFFBF015',
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 14,
    borderLeftWidth: 4,
    borderLeftColor: '#FEFA17',
    overflow: 'hidden',
  },
  detailCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  
  actions: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#F2F2F7',
  },
  btn: { flex: 1, paddingVertical: 14, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
});
