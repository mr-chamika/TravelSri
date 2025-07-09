import React from 'react';
import {
  FlatList,
  View,
  Alert,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { BookingRequestItem } from './bookingReqItem';

// Real request interface
interface BookingRequest {
  id: string;
  destination: string;
  date: string; // Assuming ISO string or similar
  time: string;
  duration: string; // e.g. "3" (days) or "72h"
  groupSize: number;
  status: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  specialRequests: string;
  price: number;
}

// Dummy request interface (UI expects these properties)
interface UIRequest {
  id: string;
  tourTitle: string;
  fromDate: string;
  toDate: string;
  status: string;
  days: number;
}

// Props interface
interface BookingRequestsListProps {
  requests?: BookingRequest[]; // optional to allow fallback
  onRequestPress: (request: BookingRequest) => void;
}

// Dummy data fallback (UIRequest shape)
const dummyRequests: UIRequest[] = [
  {
    id: '1',
    tourTitle: 'Temple of Tooth',
    fromDate: '06/25/2025',
    toDate: '06/25/2025',
    status: 'No Current Schedule',
    days: 1,
  },
  {
    id: '2',
    tourTitle: 'Sigiriya Rock Fortress',
    fromDate: '07/01/2025',
    toDate: '07/03/2025',
    status: 'Confirmed',
    days: 3,
  },
  {
    id: '3',
    tourTitle: 'Galle Fort Heritage',
    fromDate: '07/15/2025',
    toDate: '07/16/2025',
    status: 'Pending',
    days: 2,
  },
  {
    id: '4',
    tourTitle: 'Kandy Cultural Tour',
    fromDate: '08/05/2025',
    toDate: '08/07/2025',
    status: 'Confirmed',
    days: 3,
  },
  {
    id: '5',
    tourTitle: 'Ella Tea Country',
    fromDate: '08/20/2025',
    toDate: '08/22/2025',
    status: 'No Current Schedule',
    days: 3,
  },
  {
    id: '6',
    tourTitle: 'Yala Safari Adventure',
    fromDate: '09/10/2025',
    toDate: '09/11/2025',
    status: 'Pending',
    days: 2,
  },
];

// Helper function to parse duration string to number of days
const parseDurationToDays = (duration: string): number => {
  // Try to parse duration as number of days
  // If duration is like "3", "3 days", "72h", etc., you can customize this
  const days = parseInt(duration, 10);
  return isNaN(days) ? 1 : days;
};

// Helper function to add days to a date string (YYYY-MM-DD or MM/DD/YYYY)
const addDaysToDate = (dateStr: string, days: number): string => {
  const date = new Date(dateStr);
  date.setDate(date.getDate() + days);
  // Format as MM/DD/YYYY
  return (
    (date.getMonth() + 1).toString().padStart(2, '0') +
    '/' +
    date.getDate().toString().padStart(2, '0') +
    '/' +
    date.getFullYear()
  );
};

export const BookingRequestsList: React.FC<BookingRequestsListProps> = ({
  requests = [],
  onRequestPress,
}) => {
  // Map real requests to UIRequest shape
  const mappedRequests: UIRequest[] = requests.length
    ? requests.map((r) => {
        const days = parseDurationToDays(r.duration);
        const fromDate = r.date;
        const toDate = addDaysToDate(fromDate, days - 1);

        return {
          id: r.id,
          tourTitle: r.destination,
          fromDate,
          toDate,
          status: r.status,
          days,
        };
      })
    : [];

  // Data to render: mapped real requests or dummy fallback
  const dataToRender = mappedRequests.length > 0 ? mappedRequests : dummyRequests;

  // Handler for item press
  const handleRequestPress = (item: UIRequest) => {
    if (requests.length > 0) {
      // Find original request by id to pass full BookingRequest to handler
      const originalRequest = requests.find((r) => r.id === item.id);
      if (originalRequest) {
        onRequestPress(originalRequest);
        return;
      }
    }
    // Fallback alert for dummy data
    Alert.alert(
      'Booking Request Details',
      `Tour: ${item.tourTitle}\nDuration: ${item.days} ${
        item.days === 1 ? 'Day' : 'Days'
      }\nStatus: ${item.status}\nFrom: ${item.fromDate}\nTo: ${item.toDate}`
    );
  };

  const renderRequestItem = ({ item }: { item: UIRequest }) => {
    return (
      <TouchableOpacity
        style={styles.dummyItem}
        onPress={() => handleRequestPress(item)}
      >
        <Text style={styles.title}>{item.tourTitle}</Text>
        <Text style={styles.subtitle}>Status: {item.status}</Text>
        <Text style={styles.subtitle}>
          {item.fromDate} → {item.toDate}
        </Text>
        <Text style={styles.subtitle}>Days: {item.days}</Text>
      </TouchableOpacity>
    );
  };

  if (dataToRender.length === 0) {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyText}>No booking requests found</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={dataToRender}
      renderItem={renderRequestItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flexGrow: 1,
  },
  dummyItem: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 8,
    fontSize: 16,
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

// Optional demo screen
export const BookingRequestsListDemo: React.FC = () => {
  const handleCustomPress = (item: BookingRequest) => {
    Alert.alert(
      'Custom Handler',
      `You selected: ${item.destination}\nBooking ID: ${item.id}`
    );
  };

  // Empty list = fallback to dummy
  return (
    <View style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      <BookingRequestsList requests={[]} onRequestPress={handleCustomPress} />
    </View>
  );
};

export default BookingRequestsList;
