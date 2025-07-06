import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, StyleSheet } from 'react-native';
import { BookingRequestsList } from '../../components/ui/bookingReqList';
import { BookingCalendar } from '../../components/ui/bookingCalender';
import { RequestDetailsModal } from '../../components/ui/requestDetailModal';
import { TabNavigation } from '../../components/ui/tabNavigation';
import Topbar from '../../components/ui/guideTopbar';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from "react-native-reanimated";

// Types
interface BookingRequest {
  id: string;
  destination: string;
  date: string;
  time: string;
  duration: string;
  groupSize: number;
  status: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  specialRequests: string;
  price: number;
}

interface AcceptedBooking {
  date: string;
  title: string;
  time: string;
  customerName: string;
}

type TabType = 'requests' | 'calendar';

// Dummy Booking Requests
const dummyBookingRequests: BookingRequest[] = [
  {
    id: '1',
    destination: 'Sigiriya Rock Fortress',
    date: '2024-07-15',
    time: '08:00 AM',
    duration: '6 hours',
    groupSize: 4,
    status: 'pending',
    customerName: 'John Smith',
    customerEmail: 'john.smith@email.com',
    customerPhone: '+1-555-0123',
    specialRequests: 'Please provide water bottles and snacks',
    price: 120,
  },
  {
    id: '2',
    destination: 'Kandy Temple Tour',
    date: '2024-07-18',
    time: '09:30 AM',
    duration: '4 hours',
    groupSize: 2,
    status: 'pending',
    customerName: 'Sarah Johnson',
    customerEmail: 'sarah.j@email.com',
    customerPhone: '+1-555-0456',
    specialRequests: 'Vegetarian lunch preferred',
    price: 80,
  }
];

// Dummy Accepted Bookings
const dummyAcceptedBookings: AcceptedBooking[] = [
  {
    date: '2024-07-20',
    title: 'Galle Fort Walking Tour',
    time: '10:00 AM',
    customerName: 'Mike Wilson',
  }
];

export const GuideBookingScreen = () => {
  const [bookingRequests, setBookingRequests] = useState<BookingRequest[]>([]);
  const [acceptedBookings, setAcceptedBookings] = useState<AcceptedBooking[]>(dummyAcceptedBookings);
  const [selectedRequest, setSelectedRequest] = useState<BookingRequest | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedTab, setSelectedTab] = useState<TabType>('requests');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading then set dummy bookings
    const timer = setTimeout(() => {
      setBookingRequests(dummyBookingRequests);
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleRequestResponse = async (requestId: string, action: 'accept' | 'decline') => {
    try {
      const request = bookingRequests.find(r => r.id === requestId);
      if (!request) return false;

      if (action === 'accept') {
        setAcceptedBookings(prev => [
          ...prev,
          {
            date: request.date,
            title: request.destination,
            time: request.time,
            customerName: request.customerName
          }
        ]);
      }

      setBookingRequests(prev =>
        prev.map(request =>
          request.id === requestId
            ? { ...request, status: action === 'accept' ? 'accepted' : 'declined' }
            : request
        )
      );
      setShowDetails(false);
      return true;
    } catch (error) {
      console.error('Error responding to request:', error);
      return false;
    }
  };

  const handleRequestPress = (request: BookingRequest) => {
    setSelectedRequest(request);
    setShowDetails(true);
  };

  // Animation for sidebar
  const translateX = useSharedValue(-1000);
  const opacity = useSharedValue(0);
  const menuStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    opacity: opacity.value,
  }));

  const [show, setShow] = useState(false);
  const toggleMenu = () => {
    setShow(!show);
    translateX.value = withTiming(show ? -1000 : 0, { duration: 300 });
    opacity.value = withTiming(show ? 0 : 1, { duration: 300 });
  };
  
  const [notify, setNotify] = useState(false);
  const toggling = () => {
    setNotify(!notify);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Topbar pressing={toggleMenu} notifying={toggling} on={notify} />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Booking Requests</Text>
        </View>

        <TabNavigation
          selectedTab={selectedTab}
          onTabChange={setSelectedTab}
          pendingCount={bookingRequests.filter(r => r.status === 'pending').length}
        />

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
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingBottom: 15
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#6B7280',
    fontSize: 16,
  },
});

export default GuideBookingScreen;