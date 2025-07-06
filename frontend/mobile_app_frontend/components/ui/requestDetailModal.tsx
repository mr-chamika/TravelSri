import React from 'react';
import {
  Modal,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ClientInfo } from './clientInfo';
import TourDetails from './tourDetails'; // default import fixed
import { ConflictWarning } from '../ui/conflictWarnig'; // fixed typo
import { SpecialRequests } from '../ui/specialRequset'; // fixed typo
import { ActionButtons } from '../ui/actionButtons';

// Updated Request interface to match BookingRequest from your main screen
interface Request {
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
  hasConflict?: boolean;
  // add other properties your subcomponents expect
}

interface RequestDetailsModalProps {
  visible: boolean;
  request: Request | null;
  onClose: () => void;
  onResponse: (id: string, action: 'accept' | 'decline') => Promise<boolean>;
}

export const RequestDetailsModal: React.FC<RequestDetailsModalProps> = ({
  visible,
  request,
  onClose,
  onResponse,
}) => {
  const handleResponse = async (action: 'accept' | 'decline') => {
    if (!request) return;
    const success = await onResponse(request.id, action);
    if (success) {
      Alert.alert('Success', `Booking request ${action}ed successfully!`);
    } else {
      Alert.alert('Error', 'Failed to process request. Please try again.');
    }
  };

  if (!request) return null;

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Booking Details</Text>
          <TouchableOpacity onPress={onClose}>
            <Icon name="close" size={24} color="#374151" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView}>
          {/* <ClientInfo client={request} /> */}
          <TourDetails tour={request} />
          {request.hasConflict && <ConflictWarning conflict={request} />}
          {request.specialRequests && (
            <SpecialRequests requests={request.specialRequests} />
          )}
          {request.status === 'pending' && (
            <ActionButtons onResponse={handleResponse} />
          )}
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
});