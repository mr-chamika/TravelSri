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
import { fetchPendingTrips, fetchSubmittedQuotations, PendingTrip, SubmittedQuotation, submitQuotation } from '../../services/quotationService';
import { useNavigation } from '@react-navigation/native';

const QuotationsScreen = () => {
  const [pendingTrips, setPendingTrips] = useState<PendingTrip[]>([]);
  const [submittedQuotations, setSubmittedQuotations] = useState<SubmittedQuotation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<PendingTrip | null>(null);
  const [showQuotationModal, setShowQuotationModal] = useState(false);
  const [quotationPrice, setQuotationPrice] = useState('');
  const [quotationNotes, setQuotationNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [filterType, setFilterType] = useState<'request' | 'submitted'>('request');

  const navigation = useNavigation();

  // Fetch pending trips on mount
  useEffect(() => {
    loadPendingTrips();
  }, []);

  const loadPendingTrips = async () => {
    try {
      setError(null);
      setLoading(true);
      
      // Load both pending trips and submitted quotations
      const [trips, submitted] = await Promise.all([
        fetchPendingTrips(),
        fetchSubmittedQuotations(),
      ]);
      
      console.log('📍 Pending trips loaded:', trips.length);
      console.log('📋 Submitted quotations loaded:', submitted.length);
      
      console.log('\n📦 RAW SUBMITTED QUOTATIONS RECEIVED:');
      console.log('================================');
      submitted.forEach((sq: any, i: number) => {
        console.log(`Quotation ${i}:`, JSON.stringify(sq, null, 2));
      });
      console.log('================================\n');
      
      console.log('📌 First submitted quotation:', submitted[0]);
      console.log('📌 First pending trip:', {
        ptId: trips[0]?.ptId,
        title: trips[0]?.title,
        numberOfDates: trips[0]?.numberOfDates,
      });
      
      // First, flatten tourDetails from backend response into the quotation object
      const flattenedSubmitted = submitted.map((quotation: any) => {
        if (quotation.tourDetails) {
          // Backend is sending tourDetails as nested object - flatten it
          return {
            ...quotation,
            // Copy all tour details to the root level
            title: quotation.tourDetails.title,
            startLocation: quotation.tourDetails.startLocation,
            endLocation: quotation.tourDetails.endLocation,
            numberOfSeats: quotation.tourDetails.numberOfSeats,
            date: quotation.tourDetails.date,
            numberOfDates: quotation.tourDetails.numberOfDates,
            pickupTime: quotation.tourDetails.pickupTime,
            descriptionAboutStartLocation: quotation.tourDetails.descriptionAboutStartLocation,
            path: quotation.tourDetails.path,
            ptId: quotation.tourDetails.ptId,
          };
        }
        return quotation;
      });
      
      console.log('\n📦 FLATTENED SUBMITTED QUOTATIONS (after extracting tourDetails):');
      console.log('================================');
      flattenedSubmitted.forEach((fq: any, i: number) => {
        console.log(`Quotation ${i}:`, JSON.stringify(fq, null, 2));
      });
      console.log('================================\n');
      
      // Backend already provides tour details in tourDetails field
      // After flattening, the quotation should have all the needed fields
      const enrichedSubmitted = flattenedSubmitted.map((quotation, idx) => {
        console.log(`\n🔄 Processing quotation ${idx}:`, {
          quotationId: quotation.quotationId,
          hasTitle: !!quotation.title,
          title: quotation.title,
          startLocation: quotation.startLocation,
          endLocation: quotation.endLocation,
          numberOfSeats: quotation.numberOfSeats,
          date: quotation.date,
          quotedAmount: quotation.quotedAmount,
        });
        
        // Check if quotation has all required trip details
        if (quotation.title && quotation.startLocation && quotation.endLocation) {
          console.log('✅ Quotation ${idx} has complete trip details from backend');
        } else {
          console.log('⚠️ Quotation ${idx} missing some trip details:', {
            missingTitle: !quotation.title,
            missingLocation: !quotation.startLocation || !quotation.endLocation,
          });
        }
        
        return quotation;
      });
      
      console.log('📝 Enriched submitted quotations:', enrichedSubmitted);
      console.log('📝 First enriched quotation keys:', enrichedSubmitted[0] ? Object.keys(enrichedSubmitted[0]) : 'EMPTY ARRAY');
      console.log('📝 First enriched quotation title:', enrichedSubmitted[0]?.title);
      console.log('📝 First enriched quotation startLocation:', enrichedSubmitted[0]?.startLocation);
      
      console.log('\n📦 ENRICHED SUBMITTED QUOTATIONS:');
      console.log('================================');
      enrichedSubmitted.forEach((eq: any, i: number) => {
        console.log(`Enriched Quotation ${i}:`, JSON.stringify(eq, null, 2));
      });
      console.log('================================\n');
      
      setPendingTrips(trips);
      setSubmittedQuotations(enrichedSubmitted);
      
      // Log state after setting
      console.log('📤 About to set state with:', {
        tripsCount: trips.length,
        enrichedQuotationsCount: enrichedSubmitted.length,
        firstEnrichedQuotation: enrichedSubmitted[0],
      });
    } catch (err) {
      console.error('Error loading trips:', err);
      setError(err instanceof Error ? err.message : 'Failed to load trips');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    loadPendingTrips().finally(() => setRefreshing(false));
  }, []);

  const handleQuotationPress = (trip: PendingTrip) => {
    setSelectedTrip(trip);
    setQuotationPrice('');
    setQuotationNotes('');
    setShowQuotationModal(true);
  };

  const handleSubmitQuotation = async () => {
    if (!selectedTrip || !quotationPrice.trim()) {
      Alert.alert('Required', 'Please enter a quotation price');
      return;
    }

    try {
      setSubmitting(true);

      // Get JWT token and extract guideId
      const token = await AsyncStorage.getItem('token');
      console.log('🔐 Token from storage:', token ? `${token.substring(0, 20)}...` : 'NOT FOUND');

      if (!token) {
        throw new Error('No authentication token found');
      }

      interface MyToken {
        id?: string;
        sub?: string;
        [key: string]: any;
      }

      const decoded = jwtDecode<MyToken>(token);
      console.log('🔐 Decoded token:', decoded);

      const guideId = decoded.id || decoded.sub;
      console.log('🔐 GuideId extracted:', guideId);

      if (!guideId) {
        throw new Error('Could not extract guide ID from token');
      }

      console.log('📝 Submitting quotation:', {
        tourId: selectedTrip.ptId,
        amount: parseFloat(quotationPrice),
        notes: quotationNotes,
        guideId: guideId,
      });

      // Call the API with the correct data structure
      await submitQuotation(selectedTrip.ptId, {
        amount: parseFloat(quotationPrice),
        notes: quotationNotes,
        guideId: guideId,
      });

      // Close modal immediately after successful submission
      setShowQuotationModal(false);

      Alert.alert('Success', 'Quotation submitted successfully!', [
        {
          text: 'OK',
          onPress: () => {
            loadPendingTrips();
          },
        },
      ]);
    } catch (err) {
      console.error('❌ Submit error:', err);
      Alert.alert('Error', err instanceof Error ? err.message : 'Failed to submit quotation');
    } finally {
      setSubmitting(false);
    }
  };

  // Loading state
  if (loading && !refreshing) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color="#FEFA17" />
          <Text style={styles.loadingText}>Loading pending trips...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Error state
  if (error && pendingTrips.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={loadPendingTrips}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Empty state
  if (pendingTrips.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.centerContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <Text style={styles.emptyStateIcon}>📋</Text>
          <Text style={styles.emptyStateTitle}>No Pending Trips</Text>
          <Text style={styles.emptyStateSubtitle}>
            You'll see group tours available for quotation here
          </Text>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Use pending trips as request trips and submitted quotations from API as submitted trips
  const requestTrips = pendingTrips;
  const submittedTripsData = submittedQuotations;

  // Filter based on selected tab
  const displayedTrips = filterType === 'request' ? requestTrips : submittedTripsData;
  const displayedCount = displayedTrips.length;
  const totalRequestCount = requestTrips.length;
  const totalSubmittedCount = submittedTripsData.length;
  const totalCount = totalRequestCount + totalSubmittedCount;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.backButtonText}>❮</Text>
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Pending Quotations</Text>
            <Text style={styles.headerSubtitle}>
              {pendingTrips.length} trip{pendingTrips.length !== 1 ? 's' : ''} available
            </Text>
          </View>
        </View>

        {/* Filter Tabs */}
        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={[
              styles.filterTab,
              filterType === 'request' && styles.filterTabActive,
            ]}
            onPress={() => setFilterType('request')}
          >
            <Text style={[
              styles.filterTabText,
              filterType === 'request' && styles.filterTabTextActive,
            ]}>
              📬 Request {totalRequestCount > 0 && `(${totalRequestCount})`}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterTab,
              filterType === 'submitted' && styles.filterTabActive,
            ]}
            onPress={() => setFilterType('submitted')}
          >
            <Text style={[
              styles.filterTabText,
              filterType === 'submitted' && styles.filterTabTextActive,
            ]}>
              ✅ Submitted {totalSubmittedCount > 0 && `(${totalSubmittedCount})`}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Trip Cards */}
        {displayedCount === 0 ? (
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
            {displayedTrips.map((trip, index) => (
              <TripCard 
                key={trip.ptId || (trip as SubmittedQuotation).sqId || index} 
                trip={trip} 
                index={index}
                onSubmitQuotation={handleQuotationPress}
                status={filterType}
              />
            ))}
          </View>
        )}

        {/* Bottom Spacing */}
        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Quotation Modal */}
      <Modal
        visible={showQuotationModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowQuotationModal(false)}
      >
        <TouchableOpacity 
          activeOpacity={1} 
          style={styles.modalBackdropTouch}
          onPress={() => setShowQuotationModal(false)}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.modalContainer}
          >
            <TouchableOpacity activeOpacity={1} style={styles.modalContent}>
              <QuotationForm
                trip={selectedTrip}
                price={quotationPrice}
                onPriceChange={setQuotationPrice}
                notes={quotationNotes}
                onNotesChange={setQuotationNotes}
                onSubmit={handleSubmitQuotation}
                onCancel={() => setShowQuotationModal(false)}
                submitting={submitting}
              />
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

// Trip Card Component
interface TripCardProps {
  trip: PendingTrip | SubmittedQuotation;
  index: number;
  onSubmitQuotation?: (trip: PendingTrip) => void;
  status?: 'request' | 'submitted';
}

const TripCard = ({ trip, index, onSubmitQuotation, status = 'request' }: TripCardProps) => {
  const [expanded, setExpanded] = useState(false);

  // Type guard: check if it's an original PendingTrip (has path field) vs SubmittedQuotation
  const isPendingTrip = (t: PendingTrip | SubmittedQuotation): t is PendingTrip => {
    return 'path' in t && (t as any).path !== undefined;
  };

  const isSubmittedQuotation = (t: PendingTrip | SubmittedQuotation): boolean => {
    return 'quotedAmount' in t || 'quotationNotes' in t || 'pendingTripId' in t;
  };

  const pendingTrip = isPendingTrip(trip) ? trip : null;
  const submittedQuotation = isSubmittedQuotation(trip) ? (trip as SubmittedQuotation) : null;

  // Debug logging for submitted quotations
  if (submittedQuotation && index === 0) {
    console.log('🎯 TripCard received submitted quotation:', {
      id: submittedQuotation._id,
      title: submittedQuotation.title,
      startLocation: submittedQuotation.startLocation,
      endLocation: submittedQuotation.endLocation,
      quotedAmount: submittedQuotation.quotedAmount,
      allKeys: Object.keys(submittedQuotation),
    });
  }

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
      style={[styles.tripCard, { transform: [{ scale: expanded ? 1.02 : 1 }] }]}
      onPress={() => setExpanded(!expanded)}
      activeOpacity={0.7}
    >
      {/* Card Header */}
      <View style={styles.cardHeader}>
        <View style={styles.tripInfo}>
          <Text style={styles.tripTitle}>
            {(() => {
              const title = trip.title || 'Trip';
              if (!trip.title && submittedQuotation) {
                console.log('⚠️ Missing title on submitted quotation:', { id: submittedQuotation._id, keys: Object.keys(submittedQuotation) });
              }
              return title.toUpperCase();
            })()}
          </Text>
          <Text style={styles.tripRoute}>
            {(() => {
              const start = trip.startLocation || 'N/A';
              const end = trip.endLocation || 'N/A';
              if ((start === 'N/A' || end === 'N/A') && submittedQuotation) {
                console.log('⚠️ Missing location on submitted quotation:', { 
                  id: submittedQuotation._id, 
                  startLocation: trip.startLocation, 
                  endLocation: trip.endLocation 
                });
              }
              return `${start} → ${end}`;
            })()}
          </Text>
        </View>
        <View style={styles.cardBadge}>
          <Text style={styles.badgeText}>#{index + 1}</Text>
        </View>
      </View>

      {/* Quick Info Row */}
      <View style={styles.quickInfoRow}>
        <View style={styles.quickInfoItem}>
          <Text style={styles.quickInfoLabel}>Date</Text>
          <Text style={styles.quickInfoValue}>
            {(() => {
              const date = formatDate(trip.date);
              if (date === 'N/A' && submittedQuotation) {
                console.log('⚠️ Missing date on submitted quotation:', { id: submittedQuotation._id, date: trip.date });
              }
              return date;
            })()}
          </Text>
        </View>
        <View style={styles.quickInfoItem}>
          <Text style={styles.quickInfoLabel}>Seats</Text>
          <Text style={styles.quickInfoValue}>
            {(() => {
              const seats = trip.numberOfSeats || 0;
              if (!trip.numberOfSeats && submittedQuotation) {
                console.log('⚠️ Missing seats on submitted quotation:', { id: submittedQuotation._id, seats: trip.numberOfSeats });
              }
              return seats;
            })()}
          </Text>
        </View>
        <View style={styles.quickInfoItem}>
          <Text style={styles.quickInfoLabel}>{status === 'submitted' ? 'Amount' : 'Duration'}</Text>
          <Text style={styles.quickInfoValue}>
            {status === 'submitted' 
              ? `₨${((submittedQuotation?.quotedAmount ?? submittedQuotation?.amount) || 0).toLocaleString()}` 
              : `${trip.numberOfDates || 0} days`}
          </Text>
        </View>
      </View>

      {/* Expandable Details */}
      {expanded && (
        <View style={styles.expandedDetails}>
          <Divider />

          {/* Details for Pending Trips */}
          {pendingTrip && (
            <>
              <DetailRow
                label="Pickup Time"
                value={pendingTrip.pickupTime || 'N/A'}
              />
              <DetailRow
                label="Pickup Location"
                value={cleanPickupLocation(pendingTrip.descriptionAboutStartLocation)}
              />
              
              {/* Parsed Route Details */}
              {(() => {
                const { route, distance, time } = parseRouteDetails(pendingTrip.path);
                return (
                  <>
                    <DetailRow label="Route" value={route} />
                    {distance && <DetailRow label="Distance" value={distance} />}
                    {time && <DetailRow label="Estimated Time" value={time} />}
                  </>
                );
              })()}

              {/* Status Indicators */}
              <View style={styles.statusRow}>
                <StatusBadge
                  label="Guide"
                  assigned={pendingTrip.guideId !== null}
                />
                <StatusBadge
                  label="Vehicle"
                  assigned={pendingTrip.vehicleId !== null}
                />
              </View>
            </>
          )}

          {/* Details for Submitted Quotations */}
          {submittedQuotation && (
            <>
              <View style={styles.quotationDetailsHeader}>
                <Text style={styles.quotationDetailsTitle}>💰 Quotation Details</Text>
              </View>
              
              {(submittedQuotation.quotedAmount !== undefined || submittedQuotation.amount !== undefined) && (
                <DetailRow
                  label="Submitted Amount"
                  value={`₨${((submittedQuotation.quotedAmount ?? submittedQuotation.amount) || 0).toLocaleString()}`}
                />
              )}
              
              {(submittedQuotation.quotationNotes || submittedQuotation.notes) && (
                <DetailRow
                  label="Notes"
                  value={submittedQuotation.quotationNotes || submittedQuotation.notes || ''}
                />
              )}
              
              {submittedQuotation.status && (
                <DetailRow
                  label="Status"
                  value={submittedQuotation.status}
                />
              )}
              
              {(submittedQuotation.quotationDate || submittedQuotation.createdAt) && (
                <DetailRow
                  label="Submitted On"
                  value={formatDate(submittedQuotation.quotationDate || submittedQuotation.createdAt)}
                />
              )}

              {submittedQuotation.updatedAt && (submittedQuotation.quotationDate || submittedQuotation.createdAt) && submittedQuotation.updatedAt !== (submittedQuotation.quotationDate || submittedQuotation.createdAt) && (
                <DetailRow
                  label="Last Updated"
                  value={formatDate(submittedQuotation.updatedAt)}
                />
              )}
            </>
          )}

          {/* Action Button */}
          {status === 'request' && pendingTrip && onSubmitQuotation && (
            <TouchableOpacity 
              style={styles.submitButton}
              onPress={() => onSubmitQuotation(pendingTrip)}
              activeOpacity={0.85}
            >
              <View style={styles.submitButtonContent}>
                <Text style={styles.submitButtonIcon}>✓</Text>
                <Text style={styles.submitButtonText}>Submit Quotation</Text>
              </View>
            </TouchableOpacity>
          )}

          {status === 'submitted' && (
            <View style={styles.submittedButton}>
              <View style={styles.submitButtonContent}>
                <Text style={styles.submitButtonIcon}>✅</Text>
                <Text style={styles.submittedButtonText}>Quotation Submitted</Text>
              </View>
            </View>
          )}
        </View>
      )}

      {/* Collapse Indicator */}
      <View style={styles.cardFooter}>
        <Text style={styles.expandIcon}>
          {expanded ? '⬆' : '⬇'}
        </Text>
        <Text style={styles.expandText}>
          {expanded ? 'Hide Details' : 'View Details'}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

// Divider Component
const Divider = () => (
  <View style={styles.divider} />
);

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

// Helper function to clean pickup location text
const cleanPickupLocation = (location: string) => {
  // Remove "Pickup from " prefix if it exists
  return location.replace(/^Pickup from /i, '').trim();
};

// Detail Row Component
interface DetailRowProps {
  label: string;
  value: string;
}

const DetailRow = ({ label, value }: DetailRowProps) => (
  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

// Status Badge Component
interface StatusBadgeProps {
  label: string;
  assigned: boolean;
}

const StatusBadge = ({ label, assigned }: StatusBadgeProps) => (
  <View
    style={[
      styles.statusBadge,
      assigned ? styles.statusAssigned : styles.statusUnassigned,
    ]}
  >
    <Text style={styles.statusBadgeText}>
      {assigned ? '✓' : '○'} {label}
    </Text>
  </View>
);

// Quotation Form Component
interface QuotationFormProps {
  trip: PendingTrip | null;
  price: string;
  onPriceChange: (value: string) => void;
  notes: string;
  onNotesChange: (value: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
  submitting: boolean;
}

const QuotationForm = ({
  trip,
  price,
  onPriceChange,
  notes,
  onNotesChange,
  onSubmit,
  onCancel,
  submitting,
}: QuotationFormProps) => {
  if (!trip) return null;

  return (
    <View style={styles.formContainer}>
      {/* Header */}
      <View style={styles.formHeader}>
        <Text style={styles.formTitle}>Submit Quotation</Text>
        <TouchableOpacity onPress={onCancel}>
          <Text style={styles.closeButton}>×</Text>
        </TouchableOpacity>
      </View>

      {/* Scrollable Content */}
      <ScrollView 
        style={styles.formScrollContent}
        scrollEnabled={true}
        showsVerticalScrollIndicator={true}
      >
        {/* Trip Summary */}
        <View style={styles.tripSummary}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Trip:</Text>
            <Text style={styles.summaryValue}>{trip.title}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Route:</Text>
            <Text style={styles.summaryValue}>{trip.startLocation} → {trip.endLocation}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Date:</Text>
            <Text style={styles.summaryValue}>
              {new Date(trip.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Passengers:</Text>
            <Text style={styles.summaryValue}>{trip.numberOfSeats} people</Text>
          </View>
        </View>

        {/* Form Inputs */}
        <View style={styles.formInputs}>
          {/* Price Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Quotation Price (LKR)</Text>
            <View style={styles.inputWrapper}>
              <Text style={styles.currencySymbol}>LKR</Text>
              <TextInput
                style={styles.priceInput}
                placeholder="Enter your quotation price"
                placeholderTextColor="#CCC"
                keyboardType="decimal-pad"
                value={price}
                onChangeText={onPriceChange}
                editable={!submitting}
              />
            </View>
          </View>

          {/* Notes Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Additional Notes (Optional)</Text>
            <TextInput
              style={styles.notesInput}
              placeholder="E.g., Vehicle type, special services included..."
              placeholderTextColor="#CCC"
              multiline
              numberOfLines={4}
              value={notes}
              onChangeText={onNotesChange}
              editable={!submitting}
              textAlignVertical="top"
            />
          </View>
        </View>
      </ScrollView>

      {/* Action Buttons - Outside ScrollView to stay visible */}
      <View style={styles.formActions}>
        <TouchableOpacity
          style={[styles.cancelButton, submitting && styles.buttonDisabled]}
          onPress={onCancel}
          disabled={submitting}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.submitFormButton, submitting && styles.buttonDisabled]}
          onPress={onSubmit}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color="#FFF" size="small" />
          ) : (
            <Text style={styles.submitFormButtonText}>Submit Quotation</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: '#DC3545',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#FEFA17',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#000',
    fontWeight: '600',
    fontSize: 14,
  },
  emptyStateIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },

  // Header
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FEFA1715',
    borderBottomWidth: 2,
    borderBottomColor: '#FEFA17',
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginRight: 12,
  },
  backButtonText: {
    fontSize: 32,
    color: '#000',
    fontWeight: '900',
    letterSpacing: 0,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#000',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#8E8E93',
    fontWeight: '500',
  },

  // Filter Tabs
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    backgroundColor: '#F5F7FA',
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  filterTab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#E8E8E8',
  },
  filterTabActive: {
    backgroundColor: '#FEFA17',
    borderColor: '#FEFA17',
    shadowColor: '#FEFA17',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  filterTabTextActive: {
    color: '#000',
    fontWeight: '700',
  },

  // Empty Filter State
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

  // Quick Info
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

  // Expanded Details
  expandedDetails: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFFBF015',
  },
  divider: {
    height: 1,
    backgroundColor: '#E8E8E8',
    marginBottom: 12,
  },
  detailRow: {
    marginBottom: 14,
  },
  quotationDetailsHeader: {
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: '#FEFA17',
  },
  quotationDetailsTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#000',
  },
  detailLabel: {
    fontSize: 12,
    color: '#8E8E93',
    marginBottom: 3,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: '#000',
    lineHeight: 20,
    fontWeight: '500',
  },

  // Status Row
  statusRow: {
    flexDirection: 'row',
    gap: 10,
    marginVertical: 16,
  },
  statusBadge: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusAssigned: {
    backgroundColor: '#D4EDDA',
  },
  statusUnassigned: {
    backgroundColor: '#F8D7DA',
  },
  statusBadgeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#000',
  },

  // Action Button
  submitButton: {
    backgroundColor: '#FEFA17',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    shadowColor: '#FEFA17',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  submitButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  submitButtonIcon: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    letterSpacing: 0.3,
  },
  submittedButton: {
    backgroundColor: '#D4EDDA',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#28A745',
  },
  submittedButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#28A745',
    letterSpacing: 0.3,
  },

  // Section Headers
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 20,
    marginBottom: 8,
    backgroundColor: '#FFFBF015',
    borderLeftWidth: 4,
    borderLeftColor: '#FEFA17',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },
  sectionCount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FEFA17',
    backgroundColor: '#FFFBF0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },

  // Footer
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

  // Modal Styles
  modalBackdropTouch: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'transparent',
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0)',
  },
  modalContent: {
    zIndex: 10,
    width: '100%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  formScroll: {
    maxHeight: '90%',
  },

  // Form Container
  formContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 24,
    width: '100%',
    maxHeight: '90%',
    flexDirection: 'column',
  },
  formScrollContent: {
    flex: 1,
    flexGrow: 1,
  },
  formHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderBottomWidth: 2,
    borderBottomColor: '#FEFA17',
    backgroundColor: '#FFFBF015',
  },
  formTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000',
  },
  closeButton: {
    fontSize: 36,
    color: '#999',
    fontWeight: '400',
  },

  // Trip Summary
  tripSummary: {
    backgroundColor: '#FFFBF015',
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 14,
    borderLeftWidth: 4,
    borderLeftColor: '#FEFA17',
  },
  summaryRow: {
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 13,
    color: '#8E8E93',
    fontWeight: '600',
  },
  summaryValue: {
    fontSize: 14,
    color: '#000',
    fontWeight: '700',
    flex: 1,
    marginLeft: 10,
    textAlign: 'right',
  },

  // Form Inputs
  formInputs: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#000',
    marginBottom: 10,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBF015',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FEFA1740',
  },
  currencySymbol: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FEFA17',
    paddingLeft: 14,
  },
  priceInput: {
    flex: 1,
    paddingVertical: 13,
    paddingHorizontal: 10,
    fontSize: 16,
    color: '#000',
    fontWeight: '600',
  },
  notesInput: {
    backgroundColor: '#FFFBF015',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FEFA1740',
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: '#000',
    minHeight: 100,
  },

  // Form Actions
  formActions: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#F2F2F7',
    zIndex: 100,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#000',
  },
  submitFormButton: {
    flex: 1.2,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#FEFA17',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FEFA17',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  submitFormButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    letterSpacing: 0.3,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});

export default QuotationsScreen;
