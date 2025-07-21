import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import BackButton from '../../components/ui/backButton';

import Topbar from '../../components/ui/guideTopbar';

// A placeholder for your Topbar component to make the code runnable.

// Define types for the data structures
interface MarkingProps {
  marked?: boolean;
  selected?: boolean;
  selectedColor?: string;
}

interface UnavailabilityItem {
  dateRange: string;
  duration: string;
  id: string;
}

// Main Screen Component for Availability
export default function AvailabilityScreen() {
  // State to track selected dates with proper typing
  const [selectedDates, setSelectedDates] = useState<{ [key: string]: MarkingProps }>({
    '2024-07-06': { marked: true },
    '2024-07-07': { selected: true, selectedColor: '#ff9800' },
    '2024-07-08': { marked: true },
  });

  // State for the animated menu
  const [show, setShow] = useState(false);
  const translateX = useSharedValue(-1000);
  const opacity = useSharedValue(0);
  const [notify, setNotify] = useState(false);

  // State for add unavailability modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isSelectingStartDate, setIsSelectingStartDate] = useState(true);

  // Function to handle date selection with correct types
  const handleDateSelection = (day: DateData) => {
    const dateString = day.dateString;
    const newSelectedDates = { ...selectedDates };

    // Toggle selection: if date is already selected, unselect it. Otherwise, select it.
    if (newSelectedDates[dateString] && newSelectedDates[dateString].selected) {
      delete newSelectedDates[dateString];
    } else {
      newSelectedDates[dateString] = {
        selected: true,
        selectedColor: '#ff9800', // Use your theme color for selection
      };
    }
    setSelectedDates(newSelectedDates);
  };

  // Handle date selection in the add modal
  const handleModalDateSelection = (day: DateData) => {
    const dateString = day.dateString;

    if (isSelectingStartDate) {
      setStartDate(dateString);
      setIsSelectingStartDate(false);
    } else {
      setEndDate(dateString);
    }
  };

  // Current Unavailability Data with explicit typing
  const [currentUnavailability, setCurrentUnavailability] = useState<UnavailabilityItem[]>([
    {
      id: '1',
      dateRange: '2024 Jul 10 - Jul 13',
      duration: '4 Days',
    },
  ]);

  // Function to calculate duration between two dates
  const calculateDuration = (start: string, end: string): string => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return `${diffDays} Days`;
  };

  // Function to format date range
  const formatDateRange = (start: string, end: string): string => {
    const startDate = new Date(start);
    const endDate = new Date(end);

    const formatDate = (date: Date): string => {
      const year = date.getFullYear();
      const month = date.toLocaleString('default', { month: 'short' });
      const day = date.getDate();
      return `${year} ${month} ${day}`;
    };

    if (start === end) {
      return formatDate(startDate);
    }

    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
  };

  // Function to add new unavailability
  const handleAddUnavailability = () => {
    if (!startDate) {
      Alert.alert('Error', 'Please select a start date');
      return;
    }

    const finalEndDate = endDate || startDate;
    const newUnavailability: UnavailabilityItem = {
      id: Date.now().toString(),
      dateRange: formatDateRange(startDate, finalEndDate),
      duration: calculateDuration(startDate, finalEndDate),
    };

    setCurrentUnavailability([...currentUnavailability, newUnavailability]);
    setShowAddModal(false);
    setStartDate('');
    setEndDate('');
    setIsSelectingStartDate(true);
  };

  // Function to remove unavailability
  const handleRemoveUnavailability = (id: string) => {
    setCurrentUnavailability(currentUnavailability.filter(item => item.id !== id));
  };

  // Create marked dates for the modal calendar
  const getModalMarkedDates = () => {
    const marked: { [key: string]: MarkingProps } = {};

    if (startDate) {
      marked[startDate] = {
        selected: true,
        selectedColor: '#4CAF50',
        marked: true
      };
    }

    if (endDate) {
      marked[endDate] = {
        selected: true,
        selectedColor: '#ff9800',
        marked: true
      };
    }

    return marked;
  };

  // Animation styles and toggle function for the menu
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


  const toggling = () => {
    setNotify(!notify);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Topbar pressing={toggleMenu} notifying={toggling} on={notify} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <BackButton />
        {/* Calendar Section */}
        <View style={styles.calendarSection}>
          <Calendar
            current={'2024-07-01'}
            onDayPress={handleDateSelection}
            markedDates={selectedDates}
            theme={{
              selectedDayBackgroundColor: '#ff9800',
              selectedDayTextColor: '#ffffff',
              todayTextColor: '#ff9800',
              arrowColor: '#ff9800',
              monthTextColor: '#2d4150',
              indicatorColor: 'blue',
            }}
          />
        </View>

        {/* Current Unavailability Section */}
        <View style={styles.unavailabilitySection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.title}>Current Unavailability</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setShowAddModal(true)}
            >
              <Text style={styles.addButtonText}>+ Add</Text>
            </TouchableOpacity>
          </View>

          {currentUnavailability.map((unavailability: UnavailabilityItem, index: number) => (
            <View key={unavailability.id} style={styles.unavailabilityItem}>
              <Text style={styles.unavailabilityDate}>{unavailability.dateRange}</Text>
              <Text style={styles.unavailabilityDuration}>{unavailability.duration}</Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.updateButton}>
                  <Text style={styles.updateButtonText}>Update</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => handleRemoveUnavailability(unavailability.id)}
                >
                  <Text style={styles.removeButtonText}>Remove</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Add Unavailability Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Unavailability</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => {
                  setShowAddModal(false);
                  setStartDate('');
                  setEndDate('');
                  setIsSelectingStartDate(true);
                }}
              >
                <Text style={styles.closeButtonText}>×</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.dateSelectionInfo}>
              <Text style={styles.instructionText}>
                {isSelectingStartDate ? 'Select start date' : 'Select end date (optional)'}
              </Text>
              {startDate && (
                <Text style={styles.selectedDateText}>
                  Start: {new Date(startDate).toLocaleDateString()}
                </Text>
              )}
              {endDate && (
                <Text style={styles.selectedDateText}>
                  End: {new Date(endDate).toLocaleDateString()}
                </Text>
              )}
            </View>

            <Calendar
              current={startDate || '2024-07-01'}
              onDayPress={handleModalDateSelection}
              markedDates={getModalMarkedDates()}
              theme={{
                selectedDayBackgroundColor: isSelectingStartDate ? '#4CAF50' : '#ff9800',
                selectedDayTextColor: '#ffffff',
                todayTextColor: '#ff9800',
                arrowColor: '#ff9800',
                monthTextColor: '#2d4150',
              }}
            />

            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setShowAddModal(false);
                  setStartDate('');
                  setEndDate('');
                  setIsSelectingStartDate(true);
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.saveButton, !startDate && styles.saveButtonDisabled]}
                onPress={handleAddUnavailability}
                disabled={!startDate}
              >
                <Text style={styles.saveButtonText}>Save</Text>
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
    backgroundColor: '#f0f0f0',
  },
  scrollContent: {
    padding: 16,
  },
  topbar: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  calendarSection: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    marginTop:50
  },
  unavailabilitySection: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ff9800',
  },
  addButton: {
    backgroundColor: '#ff9800',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  unavailabilityItem: {
    marginBottom: 16,
    padding: 10,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 6,
  },
  unavailabilityDate: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2d4150',
  },
  unavailabilityDuration: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
  },
  updateButton: {
    backgroundColor: '#ffeb3b',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    marginRight: 8,
  },
  updateButtonText: {
    color: '#2d4150',
    fontSize: 14,
    fontWeight: '500',
  },
  removeButton: {
    backgroundColor: '#e0e0e0',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  removeButtonText: {
    color: '#333',
    fontSize: 14,
    fontWeight: '500',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2d4150',
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    color: '#666',
    fontWeight: 'bold',
  },
  dateSelectionInfo: {
    marginBottom: 20,
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  instructionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d4150',
    marginBottom: 8,
  },
  selectedDateText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: '#e0e0e0',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 6,
    marginRight: 12,
  },
  cancelButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '500',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 6,
  },
  saveButtonDisabled: {
    backgroundColor: '#cccccc',
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});