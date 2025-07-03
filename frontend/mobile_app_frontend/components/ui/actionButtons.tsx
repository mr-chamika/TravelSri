import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';

export const ActionButtons = ({ onResponse }) => (
  <View className="flex-row space-x-3 mt-4">
    <TouchableOpacity
      className="flex-1 bg-red-500 py-4 rounded-xl"
      onPress={() => onResponse('reject')}
    >
      <Text className="text-white text-center font-bold text-lg">
        Reject
      </Text>
    </TouchableOpacity>
    
    <TouchableOpacity
      className="flex-1 bg-green-500 py-4 rounded-xl"
      onPress={() => onResponse('accept')}
    >
      <Text className="text-white text-center font-bold text-lg">
        Accept
      </Text>
    </TouchableOpacity>
  </View>
);