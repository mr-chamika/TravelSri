import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';

interface SimpleTimePickerProps {
  onTimeChange: (time: { hour: number; minute: number }) => void;
}

export default function SimpleTimePicker({ onTimeChange }: SimpleTimePickerProps) {
  const [hour, setHour] = useState('08');
  const [minute, setMinute] = useState('30');
  const [period, setPeriod] = useState<'AM' | 'PM'>('AM');

  // This effect converts 12-hour to 24-hour and sends it to the parent.
  // No changes are needed here.
  useEffect(() => {
    const numericHour = parseInt(hour, 10);
    const numericMinute = parseInt(minute, 10);

    if (isNaN(numericHour) || isNaN(numericMinute)) return;

    let hour24 = numericHour;
    if (period === 'PM' && numericHour < 12) {
      hour24 += 12;
    }
    if (period === 'AM' && numericHour === 12) {
      hour24 = 0;
    }

    onTimeChange({ hour: hour24, minute: numericMinute });
  }, [hour, minute, period]);

  // Input validation handlers remain the same.
  const handleHourChange = (text: string) => {
    const value = parseInt(text.replace(/[^0-9]/g, ''), 10);
    if (isNaN(value)) {
      setHour('');
    } else if (value >= 1 && value <= 12) {
      setHour(value.toString());
    } else if (value > 12) {
      setHour('12');
    } else {
      setHour(text);
    }
  };

  const handleMinuteChange = (text: string) => {
    const value = parseInt(text.replace(/[^0-9]/g, ''), 10);
    if (isNaN(value)) {
      setMinute('');
    } else if (value >= 0 && value <= 59) {
      setMinute(value.toString());
    } else if (value > 59) {
      setMinute('59');
    } else {
      setMinute(text);
    }
  };

  const formatInput = (value: string, setter: React.Dispatch<React.SetStateAction<string>>) => {
    if (value) {
      setter(value.padStart(2, '0'));
    }
  };

  const togglePeriod = () => {
    setPeriod(currentPeriod => (currentPeriod === 'AM' ? 'PM' : 'AM'));
  };

  // --- Simplified JSX with minimal styling ---
  return (
    <View className="items-center justify-center py-4 w-full">
      <View className="flex-row items-center justify-center gap-2">
        <TextInput
          className="text-4xl font-bold text-center w-20 bg-gray-200 rounded p-1"
          keyboardType="number-pad"
          maxLength={2}
          value={hour}
          onChangeText={handleHourChange}
          onBlur={() => formatInput(hour, setHour)}
        />

        <Text className="text-4xl font-bold">:</Text>

        <TextInput
          className="text-4xl font-bold text-center w-20 bg-gray-200 rounded p-1"
          keyboardType="number-pad"
          maxLength={2}
          value={minute}
          onChangeText={handleMinuteChange}
          onBlur={() => formatInput(minute, setMinute)}
        />

        {/* A single, simple toggle button for AM/PM */}
        <TouchableOpacity
          onPress={togglePeriod}
          className="ml-2 px-3 py-1 rounded bg-gray-300"
        >
          <Text className="font-bold text-lg">{period}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
