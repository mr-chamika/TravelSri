import { View, Modal, TouchableOpacity, Text, ScrollView } from 'react-native';
import { useState } from 'react';
import { Bell, CreditCard, Users, Clock, X } from 'lucide-react-native';

interface NotifyModalProps {
  isVisible: boolean;
  onClose: () => void;
}

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  priority: string;
}

export default function NotifyModal({ isVisible, onClose }: NotifyModalProps) {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'booking',
      title: 'New booking request from Nisal Gamage',
      message: 'You have received a new booking request for your photography service.',
      timestamp: '2 mins ago',
      isRead: false,
      priority: 'high',
    },
    {
      id: '2',
      type: 'payment',
      title: 'Payment confirmed for booking #1234',
      message: 'Your payment of $150 has been successfully processed.',
      timestamp: '1 hour ago',
      isRead: false,
      priority: 'medium',
    },
    {
      id: '3',
      type: 'group',
      title: 'New group tour request for 7 people',
      message: 'A group tour has been requested for next weekend.',
      timestamp: '3 hours ago',
      isRead: true,
      priority: 'medium',
    },
    {
      id: '4',
      type: 'booking',
      title: 'New booking request from Nisal Gamage',
      message: 'You have received a new booking request for your photography service.',
      timestamp: '2 mins ago',
      isRead: false,
      priority: 'high',
    },
    {
      id: '5',
      type: 'payment',
      title: 'Payment confirmed for booking #1234',
      message: 'Your payment of $150 has been successfully processed.',
      timestamp: '1 hour ago',
      isRead: false,
      priority: 'medium',
    },
    {
      id: '6',
      type: 'group',
      title: 'New group tour request for 7 people',
      message: 'A group tour has been requested for next weekend.',
      timestamp: '3 hours ago',
      isRead: true,
      priority: 'medium',
    },
    // ... other notifications
  ]);

  // **Correction**: Helper functions now return NativeWind class names.
  const getBackgroundColorClass = (notification: Notification): string => {
    if (notification.isRead) {
      return 'bg-gray-50';
    }
    switch (notification.priority) {
      case 'high':
        return 'bg-orange-100';
      case 'medium':
        return 'bg-purple-100';
      default:
        return 'bg-green-100';
    }
  };

  const getBorderColorClass = (notification: Notification): string => {
    switch (notification.type) {
      case 'booking':
        return 'border-orange-500';
      case 'payment':
        return 'border-green-500';
      case 'group':
        return 'border-blue-500';
      default:
        return 'border-gray-300';
    }
  };

  const getIcon = (notification: Notification) => {
    switch (notification.type) {
      case 'booking':
        return <Bell size={20} color="#FF6B35" />;
      case 'payment':
        return <CreditCard size={20} color="#4CAF50" />;
      case 'group':
        return <Users size={20} color="#2196F3" />;
      default:
        return <Bell size={20} color="#757575" />;
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="w-[93%] h-[97%] bg-white p-6 rounded-2xl">
          <TouchableOpacity onPress={onClose}>
            <Text className="text-black">Cancel</Text>
          </TouchableOpacity>

          <ScrollView className="mt-4" showsVerticalScrollIndicator={false}>
            {notifications.length === 0 ? (
              <Text className="text-gray-500 text-center mt-5">
                No notifications yet
              </Text>
            ) : (
              notifications.map((notification) => (
                <TouchableOpacity
                  key={notification.id}
                  className={`
                    my-1.5 mx-2 rounded-xl border-l-4 shadow-md
                    ${getBackgroundColorClass(notification)}
                    ${getBorderColorClass(notification)}
                  `}
                  activeOpacity={0.7}
                >
                  <View className="relative p-4">
                    <View className="flex-row justify-between items-center mb-2">
                      <View className="w-8 h-8 rounded-full bg-white justify-center items-center shadow">
                        {getIcon(notification)}
                      </View>
                      <View className="flex-row items-center h-5">
                        <Clock size={12} color="#9E9E9E" />
                        <Text className="text-xs text-gray-500 font-medium ml-1">
                          {notification.timestamp}
                        </Text>
                      </View>
                    </View>

                    <View>
                      <Text className={`
                        text-base font-semibold text-gray-800 mb-1 leading-5
                        ${!notification.isRead && 'font-bold text-black'}
                      `}>
                        {notification.title}
                      </Text>
                      <Text className="text-sm text-gray-600 leading-5">
                        {notification.message}
                      </Text>
                    </View>

                    {!notification.isRead && (
                      <View className="absolute top-3 right-3 w-2 h-2 rounded-full bg-orange-500" />
                    )}
                  </View>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
