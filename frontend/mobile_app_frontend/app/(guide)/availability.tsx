import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';

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

  // Current Unavailability Data with explicit typing
  const currentUnavailability: UnavailabilityItem[] = [
    {
      dateRange: '2024 Jul 10 - Jul 13',
      duration: '4 Days',
    },
  ];

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

  const [notify, setNotify] = useState(false);
  
    const toggling = () => {
          setNotify(!notify);
      };

  return (
    <SafeAreaView style={styles.container}>
                            <Topbar pressing={toggleMenu} notifying={toggling} on={notify} />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
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
          <Text style={styles.title}>Current Unavailability</Text>
          {currentUnavailability.map((unavailability: UnavailabilityItem, index: number) => (
            <View key={index} style={styles.unavailabilityItem}>
              <Text style={styles.unavailabilityDate}>{unavailability.dateRange}</Text>
              <Text style={styles.unavailabilityDuration}>{unavailability.duration}</Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.updateButton}>
                  <Text style={styles.updateButtonText}>Update</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.removeButton}>
                  <Text style={styles.removeButtonText}>Remove</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
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
  },
  unavailabilitySection: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ff9800',
    marginBottom: 16,
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
});
