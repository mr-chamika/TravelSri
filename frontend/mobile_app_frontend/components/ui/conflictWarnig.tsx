import React from 'react';
import { View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export const ConflictWarning = ({ conflict }) => (
  <View className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-4">
    <View className="flex-row items-center mb-2">
      <Icon name="warning" size={20} color="#F59E0B" />
      <Text className="ml-2 text-yellow-800 font-bold">
        Scheduling Conflict
      </Text>
    </View>
    <Text className="text-yellow-700">
      You have another booking on this date: {conflict.conflictDetails}
    </Text>
  </View>
);