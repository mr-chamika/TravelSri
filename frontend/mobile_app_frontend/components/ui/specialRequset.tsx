import React from 'react';
import { View, Text } from 'react-native';

export const SpecialRequests = ({ requests }) => (
  <View className="bg-white rounded-xl p-4 mb-4">
    <Text className="text-lg font-bold text-gray-900 mb-2">
      Special Requests
    </Text>
    <Text className="text-gray-700">{requests}</Text>
  </View>
);