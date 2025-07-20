import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

// Main Screen Component for Availability
export default function AvailabilityScreen() {
  // State for calendar
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [markedDates, setMarkedDates] = useState({
    '2023-04-06': { marked: true },
    '2023-04-07': { marked: true, selected: true, selectedColor: 'yellow' },
    '2023-04-08': { marked: true, selected: true, selectedColor: 'yellow' },
    '2023-04-09': { marked: true, selected: true, selectedColor: 'yellow' },
    '2023-04-11': { marked: true, selected: true, selectedColor: 'yellow' },
    '2023-04-18': { marked: true, selected: true, selectedColor: 'blue' },
    '2023-04-20': { marked: true, selected: true, selectedColor: 'blue' },
    '2023-04-21': { marked: true, selected: true, selectedColor: 'blue' },
  });

  // State for schedule form
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [datePickerMode, setDatePickerMode] = useState('from'); // 'from' or 'to'

  // Handle date selection from the DateTimePicker
  // FIX: Added explicit types for the event and selectedDate parameters
  const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    // Hide the date picker first
    setShowDatePicker(Platform.OS === 'ios'); // On iOS, the picker is a modal

    if (selectedDate) {
        if (datePickerMode === 'from') {
            setFromDate(selectedDate);
        } else {
            setToDate(selectedDate);
        }
    }
    // On Android, we need to manually hide it after selection
    if (Platform.OS === 'android') {
        setShowDatePicker(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Calendar Section */}
      <View style={styles.calendarContainer}>
        <Text style={styles.calendarTitle}>December 2016</Text>
        <Calendar
          current={selectedDate.toISOString().split('T')[0]}
          markingType="period"
          markedDates={markedDates}
          onDayPress={(day) => {
            console.log('Selected day:', day.dateString);
          }}
        />
      </View>

      {/* Add Schedule Section */}
      <View style={styles.scheduleContainer}>
        <Text style={styles.scheduleTitle}>Add Schedule</Text>
        <View style={styles.datePickerContainer}>
          <Text style={styles.label}>From</Text>
          <TouchableOpacity
            style={styles.datePickerButton}
            onPress={() => {
              setDatePickerMode('from');
              setShowDatePicker(true);
            }}
          >
            <Text style={styles.dateText}>
              {fromDate.toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.datePickerContainer}>
          <Text style={styles.label}>To</Text>
          <TouchableOpacity
            style={styles.datePickerButton}
            onPress={() => {
              setDatePickerMode('to');
              setShowDatePicker(true);
            }}
          >
            <Text style={styles.dateText}>
              {toDate.toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>Add Schedule</Text>
        </TouchableOpacity>
      </View>

      {/* Date Picker */}
      {showDatePicker && (
        <DateTimePicker
          value={datePickerMode === 'from' ? fromDate : toDate}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    paddingTop: 50,
  },
  calendarContainer: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
  },
  calendarTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  scheduleContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  scheduleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ff9800',
    marginBottom: 20,
  },
  datePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    width: 50,
  },
  datePickerButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 14,
  },
  addButton: {
    backgroundColor: '#ff9800',
    borderRadius: 4,
    paddingVertical: 12,
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});