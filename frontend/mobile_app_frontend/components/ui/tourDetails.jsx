import React from 'react';
import { View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export const TourDetails = ({ tour }) => (
  <View className="bg-white rounded-xl p-4 mb-4">
    <Text className="text-lg font-bold text-gray-900 mb-3">Tour Information</Text>
    
    <View className="space-y-3">
      <TourDetailItem
        icon="place"
        text={tour.destination}
      />
      
      <TourDetailItem
        icon="schedule"
        text={`${tour.date} at ${tour.time}`}
      />
      
      <TourDetailItem
        icon="access-time"
        text={`Duration: ${tour.duration}`}
      />
      
      <TourDetailItem
        icon="group"
        text={`Group Size: ${tour.groupSize} people`}
      />
      
      <View className="flex-row">
        <Icon name="attach-money" size={20} color="#6B7280" />
        <Text className="ml-2 text-gray-900 font-bold text-green-600">
          ${tour.price}
        </Text>
      </View>
    </View>
  </View>
);

const TourDetailItem = ({ icon, text }) => (
  <View className="flex-row">
    <Icon name={icon} size={20} color="#6B7280" />
    <Text className="ml-2 text-gray-900 flex-1">{text}</Text>
  </View>
);
