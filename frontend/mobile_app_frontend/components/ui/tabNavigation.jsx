import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export const TabNavigation = ({ selectedTab, onTabChange, pendingCount }) => {
  return (
    <View className="bg-#FEFA17 border-b border-gray-200">
      <View className="flex-row">
        <TouchableOpacity
          className={`flex-1 py-3 ${selectedTab === 'requests' ? 'border-b-2 border-blue-500' : ''}`}
          onPress={() => onTabChange('requests')}
        >
          <Text className={`text-center font-medium bg-rgba(254, 250, 23, 1) ${
            selectedTab === 'requests' ? 'text-blue-600' : 'text-gray-600'
          }`}>
            Booking Requests ({pendingCount})
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          className={`flex-1 py-3 ${selectedTab === 'calendar' ? 'border-b-2 border-blue-500' : ''}`}
          onPress={() => onTabChange('calendar')}
        >
          <Text className={`text-center font-medium ${
            selectedTab === 'calendar' ? 'text-blue-600' : 'text-gray-600'
          }`}>
            Calendar
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
