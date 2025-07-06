import React from 'react';
import { View, Text, Image } from 'react-native';

export const ClientInfo = ({ client }) => (
  <View className="bg-white rounded-xl p-4 mb-4">
    <View className="flex-row items-center mb-4">
      <Image
        source={{ uri: client.clientImage }}
        className="w-16 h-16 rounded-full"
      />
      <View className="ml-4">
        <Text className="text-xl font-bold text-gray-900">
          {client.clientName}
        </Text>
        <Text className="text-gray-600">{client.contactNumber}</Text>
      </View>
    </View>
  </View>
);