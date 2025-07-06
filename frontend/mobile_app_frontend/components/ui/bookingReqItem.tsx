import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';

// 1. Define the type for a booking request
export type BookingRequest = {
  tourTitle: string;
  fromDate: string;
  toDate: string;
  status: string;
  days: number;
};

// 2. Define props type for the component
type BookingRequestItemProps = {
  request?: BookingRequest;
  onPress?: (request: BookingRequest) => void;
};

// 3. Define your navigation param list (adjust according to your navigator)
type RootStackParamList = {
  TourDetails: { tourData: BookingRequest };
  // ... other routes
};

export const BookingRequestItem: React.FC<BookingRequestItemProps> = ({
  request,
  onPress,
}) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const dummyRequest: BookingRequest = {
    tourTitle: "Temple of Tooth",
    fromDate: "06/25/2025",
    toDate: "06/25/2025",
    status: "No Current Schedule",
    days: 1,
  };

  const data = request || dummyRequest;

  const handleViewDetails = () => {
    if (onPress) {
      onPress(data);
    } else {
      navigation.navigate('TourDetails', { tourData: data });
    }
  };

  return (
    <View style={styles.container}>
      {/* Tour Title */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{data.tourTitle}</Text>
      </View>

      {/* Date Range */}
      <View style={styles.dateContainer}>
        <View style={styles.dateColumn}>
          <Text style={styles.dateLabel}>From</Text>
          <Text style={styles.dateValue}>{data.fromDate}</Text>
        </View>
        <View style={styles.dateColumn}>
          <Text style={styles.dateLabel}>To</Text>
          <Text style={styles.dateValue}>{data.toDate}</Text>
        </View>
      </View>

      {/* Status Badge and Days */}
      <View style={styles.statusContainer}>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{data.status}</Text>
        </View>
        <View style={styles.daysBadge}>
          <Text style={styles.daysText}>
            {data.days} {data.days === 1 ? 'Day' : 'Days'}
          </Text>
        </View>
      </View>

      {/* View Details Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={handleViewDetails}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>View Details</Text>
      </TouchableOpacity>
    </View>
  );
};

export const BookingRequestDemo: React.FC = () => {
  return (
    <View style={styles.demoContainer}>
      <BookingRequestItem />
    </View>
  );
};

export default BookingRequestItem;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  titleContainer: {
    marginBottom: 24,
  },
  title: {
    color: '#111827',
    fontWeight: 'bold',
    fontSize: 20,
    lineHeight: 24,
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  dateColumn: {
    flex: 1,
    alignItems: 'center',
  },
  dateLabel: {
    color: '#9ca3af',
    fontWeight: '500',
    fontSize: 14,
    marginBottom: 8,
  },
  dateValue: {
    color: '#111827',
    fontWeight: '600',
    fontSize: 18,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  statusBadge: {
    backgroundColor: '#fef3c7',
    borderWidth: 1,
    borderColor: '#fde68a',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  statusText: {
    color: '#92400e',
    fontWeight: '500',
    fontSize: 14,
  },
  daysBadge: {
    backgroundColor: '#fef3c7',
    borderWidth: 1,
    borderColor: '#fde68a',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  daysText: {
    color: '#92400e',
    fontWeight: '500',
    fontSize: 14,
  },
  button: {
    backgroundColor: '#fbbf24',
    borderRadius: 25,
    paddingVertical: 16,
    paddingHorizontal: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  buttonText: {
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 18,
  },
  demoContainer: {
    flex: 1,
    backgroundColor: '#f9fafb',
    paddingTop: 40,
  },
});
