import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Modal } from 'react-native';

// Define the props interface
interface ViewActivityLogProps {
  visible: boolean; // Determines if the modal is visible
  onClose: () => void; // Function to close the modal
}

const ViewActivityLog: React.FC<ViewActivityLogProps> = ({ visible, onClose }) => {
  // Sample activity log data
  const activityLogData = [
    { id: '1', timestamp: '2023-10-01 10:00 AM', action: 'Guide created' },
    { id: '2', timestamp: '2023-10-01 11:30 AM', action: 'Guide updated' },
    { id: '3', timestamp: '2023-10-02 09:45 AM', action: 'Guide published' },
    { id: '4', timestamp: '2023-10-03 02:15 PM', action: 'Guide archived' },
  ];

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Activity Log</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>

          {/* Activity Log Content */}
          <View style={styles.modalContent}>
            <FlatList
              data={activityLogData}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.activityItem}>
                  <Text style={styles.activityTimestamp}>{item.timestamp}</Text>
                  <Text style={styles.activityAction}>{item.action}</Text>
                </View>
              )}
            />
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

// Styles
const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    width: '90%',
    maxHeight: '90%',
    borderRadius: 16,
    padding: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  closeButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  modalContent: {
    maxHeight: 400,
  },
  activityItem: {
    marginBottom: 12,
  },
  activityTimestamp: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  activityAction: {
    fontSize: 14,
    color: '#6B7280',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#E5E7EB',
    borderRadius: 8,
  },
  cancelButtonText: {
    color: '#374151',
    fontWeight: '500',
    fontSize: 14,
  },
});

export default ViewActivityLog;