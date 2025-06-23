import React from 'react';
import { FlatList, View } from 'react-native';
import { BookingRequestItem } from './bookingReqItem';

export const BookingRequestsList = ({ requests, onRequestPress }) => {
  const renderRequestItem = ({ item }) => (
    <BookingRequestItem
      request={item}
      onPress={() => onRequestPress(item)}
    />
  );

  return (
    <FlatList
      data={requests}
      renderItem={renderRequestItem}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={{ padding: 16 }}
      showsVerticalScrollIndicator={false}
    />
  );
};