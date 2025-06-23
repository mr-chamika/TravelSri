import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export const BookingRequestItem = ({ request, onPress }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'accepted': return 'bg-green-100 text-green-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <TouchableOpacity
      className="bg-white rounded-xl p-4 mb-3 shadow-sm border border-gray-100"
      onPress={onPress}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center flex-1">
          <Image
            source={{ uri: request.clientImage }}
            className="w-12 h-12 rounded-full mr-5"
          />
          <View className="ml- flex-1 bg-white">
            <Text className="text-gray-900 font-semibold text-base">
              {request.clientName}
            </Text>
            <Text className="text-gray-600 text-sm">{request.destination}</Text>
            <Text className="text-gray-500 text-xs">
              {request.date} at {request.time}
            </Text>
          </View>
        </View>
        
        <View className="items-end">
          <Text className="text-green-600 font-bold text-lg">${request.price}</Text>
          <View className="flex-row items-center mt-1">
            {request.hasConflict && (
              <Icon name="warning" size={16} color="#F59E0B" className="mr-1" />
            )}
            <View className={`px-2 py-1 rounded-full ${getStatusColor(request.status).split(' ')[0]}`}>
              <Text className={`text-xs font-medium ${getStatusColor(request.status).split(' ').slice(1).join(' ')}`}>
                {request.status.toUpperCase()}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};