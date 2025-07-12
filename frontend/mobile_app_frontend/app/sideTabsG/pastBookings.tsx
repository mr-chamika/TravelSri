import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList, 
  Modal,
  SafeAreaView,
  StatusBar 
} from 'react-native';
import { Clock, User, Eye, Edit3, Archive, Plus, X, ArrowLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';

// Define the props interface
interface ViewActivityLogProps {
  visible: boolean; // Determines if the modal is visible
  onClose: () => void; // Function to close the modal
}

const ViewActivityLog: React.FC<ViewActivityLogProps> = ({ visible, onClose }) => {
  const router = useRouter();

  // Sample activity log data with more detailed information
  const activityLogData = [
    { 
      id: '1', 
      timestamp: '2023-10-01 10:00 AM', 
      action: 'Guide created',
      description: 'New guide profile created successfully',
      type: 'create'
    },
    { 
      id: '2', 
      timestamp: '2023-10-01 11:30 AM', 
      action: 'Profile updated',
      description: 'Updated experience and specialization details',
      type: 'update'
    },
    { 
      id: '3', 
      timestamp: '2023-10-02 09:45 AM', 
      action: 'Guide published',
      description: 'Profile made visible to clients',
      type: 'publish'
    },
    { 
      id: '4', 
      timestamp: '2023-10-03 02:15 PM', 
      action: 'Booking received',
      description: 'New booking from John Smith for Sigiriya tour',
      type: 'booking'
    },
    { 
      id: '5', 
      timestamp: '2023-10-04 08:30 AM', 
      action: 'Tour completed',
      description: 'Successfully completed Kandy Temple tour',
      type: 'complete'
    },
    { 
      id: '6', 
      timestamp: '2023-10-05 03:45 PM', 
      action: 'Review received',
      description: 'Received 5-star review from Sarah Johnson',
      type: 'review'
    },
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'create':
        return <Plus size={20} color="#10B981" />;
      case 'update':
        return <Edit3 size={20} color="#3B82F6" />;
      case 'publish':
        return <Eye size={20} color="#8B5CF6" />;
      case 'booking':
        return <User size={20} color="#F59E0B" />;
      case 'complete':
        return <Clock size={20} color="#10B981" />;
      case 'review':
        return <User size={20} color="#EF4444" />;
      default:
        return <Clock size={20} color="#6B7280" />;
    }
  };

  const getActionColor = (type: string) => {
    switch (type) {
      case 'create':
        return '#10B981';
      case 'update':
        return '#3B82F6';
      case 'publish':
        return '#8B5CF6';
      case 'booking':
        return '#F59E0B';
      case 'complete':
        return '#10B981';
      case 'review':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <Modal transparent visible={visible} animationType="slide">
      <View style={styles.modalOverlay}>
        <StatusBar backgroundColor="rgba(0,0,0,0.5)" barStyle="light-content" />
        
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTop}>
              <TouchableOpacity 
                onPress={handleGoBack} // Use router.back() for navigation
                style={styles.backButton}
              >
                <ArrowLeft size={24} color="#111827" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Activity Log</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={onClose} // Close button still closes the modal
              >
                <X size={24} color="#111827" />
              </TouchableOpacity>
            </View>

            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{activityLogData.length}</Text>
                <Text style={styles.statLabel}>Total Activities</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>Today</Text>
                <Text style={styles.statLabel}>Last Activity</Text>
              </View>
            </View>
          </View>

          {/* Activity Log Content */}
          <View style={styles.content}>
            <FlatList
              data={activityLogData}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <View style={styles.activityCard}>
                  {/* Action Icon */}
                  <View style={[styles.iconContainer, { backgroundColor: `${getActionColor(item.type)}20` }]}>
                    {getActionIcon(item.type)}
                  </View>

                  {/* Activity Details */}
                  <View style={styles.activityDetails}>
                    <View style={styles.activityHeader}>
                      <Text style={styles.activityAction}>{item.action}</Text>
                      <Text style={styles.activityTime}>{formatTime(item.timestamp)}</Text>
                    </View>
                    
                    <Text style={styles.activityDescription}>{item.description}</Text>
                    
                    <View style={styles.activityFooter}>
                      <Clock size={14} color="#9CA3AF" />
                      <Text style={styles.activityDate}>{formatDate(item.timestamp)}</Text>
                    </View>
                  </View>
                </View>
              )}
            />

            {activityLogData.length === 0 && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>No activities found</Text>
              </View>
            )}
          </View>

          {/* Modal Actions */}
          <View style={styles.modalActions}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ViewActivityLog;

// Styles
const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#F9FAFB',
    height: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  header: {
    backgroundColor: '#FEFA17',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 20,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  closeButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
    marginRight: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  activityCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityDetails: {
    flex: 1,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  activityAction: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
  },
  activityTime: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  activityDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
    lineHeight: 20,
  },
  activityFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityDate: {
    fontSize: 12,
    color: '#9CA3AF',
    marginLeft: 4,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  cancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    backgroundColor: '#374151',
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
});