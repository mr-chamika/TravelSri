// components/TimeSelector.js or components/TimeSelector.tsx

import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';

interface SimpleTimePickerProps {
  onTimeChange: (time: { hour: number; minute: number }) => void;
  initialTime?: { hour: number; minute: number };
}

const SimpleTimePicker = ({ onTimeChange, initialTime = { hour: 0, minute: 0 } }: SimpleTimePickerProps) => {
  const [selectedHour, setSelectedHour] = useState(initialTime.hour);
  const [selectedMinute, setSelectedMinute] = useState(initialTime.minute);
  const scrollViewRef = useRef<ScrollView>(null);

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 / 1 }, (_, i) => i * 1);
  // Scroll to the initial selected hour and minute when the component mounts
  useEffect(() => {
    // Adjust these values based on the average height of your items
    const hourScrollOffset = selectedHour * 40; // Assuming each hour item is 40px tall
    const minuteScrollOffset = (selectedMinute / 5) * 40; // Assuming each minute item is 40px tall

    // A small delay ensures layout has completed
    setTimeout(() => {
      if (scrollViewRef.current) {
        // You might need separate refs for hour and minute scroll views if they are distinct
      }
    }, 100);
  }, []); // Run only once on mount

  // Notify parent component whenever hour or minute changes
  useEffect(() => {
    onTimeChange({ hour: selectedHour, minute: selectedMinute });
  }, [selectedHour, selectedMinute, onTimeChange]);

  const formatTime = (value: number) => (value < 10 ? `0${value}` : `${value}`);

  return (
    <View className="flex-row w-full items-center justify-center h-[100px] rounded-lg bg-gray-100 p-2">
      {/* Hour Selector */}
      <View className="flex-1 items-center w-full">
        <Text className="font-bold text-lg mb-2">Hour</Text>
        <ScrollView
          className="w-full"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ alignItems: 'center' }}
          ref={scrollViewRef} // You'd need more granular refs for separate scrolls
        >
          {hours.map((hour) => (
            <TouchableOpacity
              key={hour}
              onPress={() => setSelectedHour(hour)}
              className={`py-3 w-[50%] items-center ${selectedHour === hour ? 'bg-blue-200 rounded-md' : ''}`}
            >
              <Text className={`text-lg ${selectedHour === hour ? 'font-bold text-blue-800' : 'text-gray-700'}`}>
                {formatTime(hour)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Separator */}
      <View className="w-1 px-1 justify-center items-center mt-4">
        <Text className="absolute text-2xl font-bold">:</Text>
      </View>

      {/* Minute Selector */}
      <View className="flex-1 items-center">
        <Text className="font-bold text-lg mb-2">Minute</Text>
        <ScrollView
          className="w-full"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ alignItems: 'center' }}
        >
          {minutes.map((minute) => (
            <TouchableOpacity
              key={minute}
              onPress={() => setSelectedMinute(minute)}
              className={` py-3 w-[50%] items-center ${selectedMinute === minute ? 'bg-blue-200 rounded-md' : ''}`}
            >
              <Text className={`text-lg ${selectedMinute === minute ? 'font-bold text-blue-800' : 'text-gray-700'}`}>
                {formatTime(minute)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

export default SimpleTimePicker;
