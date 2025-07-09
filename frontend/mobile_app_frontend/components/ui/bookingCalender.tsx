import React, { useMemo } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Calendar, Agenda } from 'react-native-calendars';


export const BookingCalendar = ({ acceptedBookings, pendingRequests }) => {
  const calendarMarkedDates = useMemo(() => {
    const marked = {};
    
    // Mark accepted bookings
    acceptedBookings.forEach(booking => {
      marked[booking.date] = {
        selected: true,
        selectedColor: '#10B981',
        selectedTextColor: 'white',
      };
    });

    // Mark pending requests
    pendingRequests.forEach(request => {
      if (marked[request.date]) {
        marked[request.date] = {
          ...marked[request.date],
          marked: true,
          dotColor: '#F59E0B',
        };
      } else {
        marked[request.date] = {
          marked: true,
          dotColor: '#F59E0B',
        };
      }
    });

    return marked;
  }, [acceptedBookings, pendingRequests]);

  const calendarTheme = {
    backgroundColor: '#ffffff',
    calendarBackground: '#ffffff',
    textSectionTitleColor: '#b6c1cd',
    selectedDayBackgroundColor: '#10B981',
    selectedDayTextColor: '#ffffff',
    todayTextColor: '#3B82F6',
    dayTextColor: '#2d4150',
    textDisabledColor: '#d9e1e8',
    dotColor: '#F59E0B',
    selectedDotColor: '#ffffff',
    arrowColor: '#3B82F6',
    monthTextColor: '#2d4150',
    indicatorColor: '#3B82F6',
    textDayFontWeight: '500',
    textMonthFontWeight: 'bold',
    textDayHeaderFontWeight: '600',
    textDayFontSize: 16,
    textMonthFontSize: 18,
    textDayHeaderFontSize: 14
  };

  return (
    <ScrollView className="flex-1">
      <View className="p-4">
        <Calendar
          markedDates={calendarMarkedDates}
          theme={calendarTheme}
        />
        
        {/* Legend */}
        <CalendarLegend />
      </View>
    </ScrollView>
  );
};

const CalendarLegend = () => (
  <View className="bg-white rounded-xl p-4 mt-4">
    <Text className="text-lg font-bold text-gray-900 mb-3">Legend</Text>
    <View className="space-y-2">
      <View className="flex-row items-center">
        <View className="w-4 h-4 bg-green-500 rounded-full mr-3" />
        <Text className="text-gray-700">Accepted Bookings</Text>
      </View>
      <View className="flex-row items-center">
        <View className="w-4 h-4 bg-yellow-500 rounded-full mr-3" />
        <Text className="text-gray-700">Pending Requests</Text>
      </View>
    </View>
  </View>
);
