import React, { useState } from 'react';
import Topbar from "../../../components/topbar";
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing, } from "react-native-reanimated";

import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native';

// Simple icon components to replace Lucide icons
const MenuIcon = () => (
  <View className="w-5 h-5 items-center justify-center">
    <View className="w-4 h-0.5 bg-black mb-1" />
    <View className="w-4 h-0.5 bg-black mb-1" />
    <View className="w-4 h-0.5 bg-black" />
  </View>
);

const LocationIcon = () => (
  <View className="w-4 h-4 items-center justify-center">
    <View className="w-3 h-3 bg-black rounded-full" />
  </View>
);

const BellIcon = () => (
  <View className="w-5 h-5 items-center justify-center">
    <View className="w-4 h-4 bg-black rounded-t-full" style={{ borderRadius: 8 }} />
    <View className="w-1 h-1 bg-black rounded-full mt-0.5" />
  </View>
);

const ChevronLeftIcon = () => (
  <View className="w-6 h-6 items-center justify-center">
    <Text className="text-gray-600 text-lg font-bold">‹</Text>
  </View>
);

const ChevronRightIcon = () => (
  <View className="w-6 h-6 items-center justify-center">
    <Text className="text-gray-600 text-lg font-bold">›</Text>
  </View>
);

const CalendarIcon = () => (
  <View className="w-6 h-6 items-center justify-center">
    <View className="w-5 h-4 border-2 border-black rounded-sm">
      <View className="w-full h-1 bg-black" />
    </View>
  </View>
);

const MessageIcon = () => (
  <View className="w-6 h-6 items-center justify-center">
    <View className="w-5 h-4 border-2 border-black rounded-lg" />
  </View>
);

const MapIcon = () => (
  <View className="w-6 h-6 items-center justify-center">
    <View className="w-4 h-4 bg-black rounded-full" />
  </View>
);

interface CalendarDay {
  day: number;
  isCurrentMonth: boolean;
  isSelected?: boolean;
  isHighlighted?: boolean;
}

interface Trip {
  id: number;
  dates: string;
  duration: string;
  destination: string;
}

const TravelSriApp = () => {
  const [selectedDate, setSelectedDate] = useState(8);
  const [show, setShow] = useState(false);
  
  // Move animation values to component level
  const translateX = useSharedValue(-1000);
  const opacity = useSharedValue(0);

  const menuStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    opacity: opacity.value,
  }));

  // Move toggleMenu function to component level
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

  const currentMonth = new Date().toLocaleString('default', {
    month: 'long',
    year: 'numeric',
  });

  // Calendar data for December 2016
  const calendarDays: CalendarDay[] = [
    // Previous month days
    { day: 27, isCurrentMonth: false },
    { day: 28, isCurrentMonth: false },
    { day: 29, isCurrentMonth: false },
    { day: 30, isCurrentMonth: false },
    // Current month days
    { day: 1, isCurrentMonth: true },
    { day: 2, isCurrentMonth: true },
    { day: 3, isCurrentMonth: true },
    { day: 4, isCurrentMonth: true },
    { day: 5, isCurrentMonth: true },
    { day: 6, isCurrentMonth: true },
    { day: 7, isCurrentMonth: true, isSelected: true },
    { day: 8, isCurrentMonth: true, isHighlighted: true },
    { day: 9, isCurrentMonth: true, isHighlighted: true },
    { day: 10, isCurrentMonth: true },
    { day: 11, isCurrentMonth: true, isHighlighted: true },
    { day: 12, isCurrentMonth: true },
    { day: 13, isCurrentMonth: true },
    { day: 14, isCurrentMonth: true, isHighlighted: true },
    { day: 15, isCurrentMonth: true, isHighlighted: true },
    { day: 16, isCurrentMonth: true },
    { day: 17, isCurrentMonth: true, isHighlighted: true },
    { day: 18, isCurrentMonth: true },
    { day: 19, isCurrentMonth: true },
    { day: 20, isCurrentMonth: true },
    { day: 21, isCurrentMonth: true },
    { day: 22, isCurrentMonth: true },
    { day: 23, isCurrentMonth: true },
    { day: 24, isCurrentMonth: true },
    { day: 25, isCurrentMonth: true },
    { day: 26, isCurrentMonth: true },
    { day: 27, isCurrentMonth: true },
    { day: 28, isCurrentMonth: true },
    { day: 29, isCurrentMonth: true },
    { day: 30, isCurrentMonth: true },
    { day: 31, isCurrentMonth: true },
  ];

  const upcomingTrips: Trip[] = [
    {
      id: 1,
      dates: 'December 6 - 9',
      duration: '4 Days',
      destination: 'Kandy - Anuradhapura',
    },
    {
      id: 2,
      dates: 'December 11',
      duration: '1 Day',
      destination: 'Kandy',
    },
    {
      id: 3,
      dates: 'December 13 - 17',
      duration: '5 Days',
      destination: 'Kandy - Hotten place',
    },
  ];

  const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  const renderCalendarDay = (dayData: CalendarDay, index: number) => {
    const isSelected = dayData.day === selectedDate && dayData.isCurrentMonth;
    const isHighlighted = dayData.isHighlighted;
    
    return (
      <TouchableOpacity
        key={index}
        onPress={() => dayData.isCurrentMonth && setSelectedDate(dayData.day)}
        className={`w-10 h-10 items-center justify-center rounded-full ${
          isSelected 
            ? 'bg-yellow-400' 
            : isHighlighted 
            ? 'bg-yellow-100' 
            : ''
        }`}
      >
        <Text 
          className={`text-base ${
            !dayData.isCurrentMonth 
              ? 'text-gray-300' 
              : isSelected 
              ? 'text-black font-semibold' 
              : 'text-gray-700'
          }`}
        >
          {dayData.day}
        </Text>
      </TouchableOpacity>
    );
  };

  
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />
      <Topbar pressing={toggleMenu} />
      
      <ScrollView className="flex-1">
        {/* Calendar Section */}
        <View className="bg-white mx-4 mt-4 rounded-2xl shadow-sm">
          {/* Calendar Header */}
          <View className="flex-row items-center justify-between px-6 py-4">
            <TouchableOpacity>
              <ChevronLeftIcon />
            </TouchableOpacity>
            <Text className="text-lg font-semibold text-gray-800">{currentMonth}</Text>
            <TouchableOpacity>
              <ChevronRightIcon />
            </TouchableOpacity>
          </View>

          {/* Week Days */}
          <View className="flex-row justify-around px-4 pb-2">
            {weekDays.map((day, index) => (
              <Text key={index} className="text-gray-500 font-medium w-10 text-center">
                {day}
              </Text>
            ))}
          </View>

          {/* Calendar Grid */}
          <View className="px-4 pb-6">
            {Array.from({ length: Math.ceil(calendarDays.length / 7) }, (_, weekIndex) => (
              <View key={weekIndex} className="flex-row justify-around mb-2">
                {calendarDays
                  .slice(weekIndex * 7, (weekIndex + 1) * 7)
                  .map((dayData, dayIndex) => 
                    renderCalendarDay(dayData, weekIndex * 7 + dayIndex)
                  )}
              </View>
            ))}
          </View>
        </View>

        {/* Upcoming Trips */}
        <View className="mx-4 mt-6 mb-6">
          <Text className="text-lg font-semibold text-yellow-600 mb-4">Upcoming Hiring:</Text>
          
          {upcomingTrips.map((trip) => (
            <TouchableOpacity 
              key={trip.id}
              className="bg-white rounded-xl p-4 mb-3 shadow-sm border border-gray-100"
            >
              <View className="flex-row justify-between items-start">
                <View className="flex-1">
                  <Text className="text-gray-500 text-sm mb-1">{trip.dates}</Text>
                  <Text className="text-gray-800 font-medium text-base">{trip.destination}</Text>
                </View>
                <Text className="text-gray-500 text-sm">{trip.duration}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      {/* <View className="bg-yellow-400 mx-4 rounded-t-3xl flex-row justify-around items-center py-4 mb-4">
        <TouchableOpacity className="items-center justify-center w-12 h-12">
          <MapIcon />
        </TouchableOpacity>
        
        <TouchableOpacity className="items-center justify-center w-12 h-12">
          <CalendarIcon />
        </TouchableOpacity>
        
        <TouchableOpacity className="items-center justify-center w-12 h-12">
          <View className="flex-row">
            <View className="w-1 h-4 bg-black mr-1" />
            <View className="w-1 h-4 bg-black mr-1" />
            <View className="w-1 h-4 bg-black" />
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity className="items-center justify-center w-12 h-12">
          <MessageIcon />
        </TouchableOpacity>
      </View> */}
    </SafeAreaView>
  );
};

export default TravelSriApp;