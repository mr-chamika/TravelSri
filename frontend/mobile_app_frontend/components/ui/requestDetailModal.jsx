import React from 'react';
import { Modal, View, Text, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ClientInfo } from './clientInfo';
import { TourDetails } from './tourDetails';
import { ConflictWarning } from './conflictWarnig';
import { SpecialRequests } from './specialRequset';
import { ActionButtons } from './actionButtons';

export const RequestDetailsModal = ({ visible, request, onClose, onResponse }) => {
  const handleResponse = async (action) => {
    const success = await onResponse(request.id, action);
    if (success) {
      Alert.alert('Success', `Booking request ${action}ed successfully!`);
    } else {
      Alert.alert('Error', 'Failed to process request. Please try again.');
    }
  };

  if (!request) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View className="flex-1 bg-gray-50">
        {/* Header */}
        <View className="bg-white px-4 py-3 border-b border-gray-200">
          <View className="flex-row items-center justify-between">
            <Text className="text-xl font-bold text-gray-900">Booking Details</Text>
            <TouchableOpacity onPress={onClose}>
              <Icon name="close" size={24} color="#374151" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView className="flex-1 p-4">
          <ClientInfo client={request} />
          <TourDetails tour={request} />
          {request.hasConflict && <ConflictWarning conflict={request} />}
          {request.specialRequests && <SpecialRequests requests={request.specialRequests} />}
          
          {request.status === 'pending' && (
            <ActionButtons onResponse={handleResponse} />
          )}
        </ScrollView>
      </View>
    </Modal>
  );
};