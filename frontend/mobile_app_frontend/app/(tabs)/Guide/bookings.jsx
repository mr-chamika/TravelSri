import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, StyleSheet } from 'react-native';
import { BookingRequestsList } from '../../../components/ui/bookingReqList';
import { BookingCalendar } from '../../../components/ui/bookingCalender';
import { RequestDetailsModal } from '../../../components/ui/requestDetailModal';
import { TabNavigation } from '../../../components/ui/tabNavigation';
import { bookingService } from '../../../services/bookingServices';
import Topbar from '../../../components/topbar';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from "react-native-reanimated";

export const GuideBookingScreen = () => {
  const [bookingRequests, setBookingRequests] = useState([]);
  const [acceptedBookings, setAcceptedBookings] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedTab, setSelectedTab] = useState('requests');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookingData();
  }, []);

  const loadBookingData = async () => {
    try {
      setLoading(true);
      const [requests, accepted] = await Promise.all([
        bookingService.getBookingRequests(),
        bookingService.getAcceptedBookings()
      ]);
      setBookingRequests(requests);
      setAcceptedBookings(accepted);
    } catch (error) {
      console.error('Error loading booking data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestResponse = async (requestId, action) => {
    try {
      await bookingService.respondToRequest(requestId, action);
      
      if (action === 'accept') {
        const request = bookingRequests.find(r => r.id === requestId);
        setAcceptedBookings(prev => [...prev, {
          date: request.date,
          title: request.destination,
        }]);
      }

      setBookingRequests(prev => prev.map(request => 
        request.id === requestId 
          ? { ...request, status: action === 'accept' ? 'accepted' : 'rejected' }
          : request
      ));

      setShowDetails(false);
      return true;
    } catch (error) {
      console.error('Error responding to request:', error);
      return false;
    }
  };

  const handleRequestPress = (request) => {
    setSelectedRequest(request);
    setShowDetails(true);
  };

  // Animation states
  const [selectedDate, setSelectedDate] = useState(8);
  const [show, setShow] = useState(false);
  
  const translateX = useSharedValue(-1000);
  const opacity = useSharedValue(0);

  const menuStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    opacity: opacity.value,
  }));

  const toggleMenu = () => {
    setShow(!show);
    if (!show) {
      translateX.value = withTiming(0, {
        duration: 300,
        easing: Easing.inOut(Easing.ease),
      });
      opacity.value = withTiming(1, { duration: 400 });
    } else {
      translateX.value = withTiming(-1000, {
        duration: 300,
        easing: Easing.inOut(Easing.ease),
      });
      opacity.value = withTiming(0, { duration: 300 });
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Topbar pressing={toggleMenu} />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Topbar pressing={toggleMenu} />
      
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Booking Requests</Text>
        </View>

        {/* Tab Navigation */}
        <TabNavigation
          selectedTab={selectedTab}
          onTabChange={setSelectedTab}
          pendingCount={bookingRequests.filter(r => r.status === 'pending').length}
        />

        {/* Content */}
        {selectedTab === 'requests' ? (
          <BookingRequestsList
            requests={bookingRequests}
            onRequestPress={handleRequestPress}
          />
        ) : (
          <BookingCalendar
            acceptedBookings={acceptedBookings}
            pendingRequests={bookingRequests.filter(r => r.status === 'pending')}
          />
        )}

        {/* Details Modal */}
        <RequestDetailsModal
          visible={showDetails}
          request={selectedRequest}
          onClose={() => setShowDetails(false)}
          onResponse={handleRequestResponse}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  loadingText: {
    color: '#6B7280',
    fontSize: 16,
  },
  header: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
});

export default GuideBookingScreen;