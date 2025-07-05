import { View, Modal, TouchableOpacity, Text, StyleSheet, ScrollView } from 'react-native';
import { useState } from 'react';
import { Bell, CreditCard, Users, Clock } from 'lucide-react-native';

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
      title: 'Booking reminder',
      message: 'Your upcoming session is scheduled for tomorrow at 2:00 PM.',
      timestamp: '5 hours ago',
      isRead: true,
      priority: 'low',
    },
    {
      id: '5',
      type: 'payment',
      title: 'Weekly earnings summary',
      message: 'You earned $450 this week from 3 completed bookings.',
      timestamp: '1 day ago',
      isRead: true,
      priority: 'low',
    },
  ]);

  const getBackgroundColor = (notification: Notification) => {
    if (notification.isRead) {
      return '#F8F9FA';
    }

    switch (notification.priority) {
      case 'high':
        return '#FFF3E0';
      case 'medium':
        return '#F3E5F5';
      default:
        return '#E8F5E8';
    }
  };

  const getBorderColor = (notification: Notification) => {
    switch (notification.type) {
      case 'booking':
        return '#FF6B35';
      case 'payment':
        return '#4CAF50';
      case 'group':
        return '#2196F3';
      default:
        return '#E0E0E0';
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
    <View>
      {isVisible && (
        <View style={{ backgroundColor: '#F2F5FA', height: '100%' }}>
          <Modal
            animationType="fade"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <TouchableOpacity onPress={onClose}>
                  <Text style={{ color: 'black' }}>Cancel</Text>
                </TouchableOpacity>

                <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
                  {notifications.length === 0 ? (
                    <Text style={{ color: '#9E9E9E', textAlign: 'center', marginTop: 20 }}>
                      No notifications yet
                    </Text>
                  ) : (
                    notifications.map((notification) => (
                      <TouchableOpacity
                        key={notification.id}
                        style={[
                          styles.container,
                          {
                            backgroundColor: getBackgroundColor(notification),
                            borderLeftColor: getBorderColor(notification),
                          },
                        ]}
                        activeOpacity={0.7}
                      >
                        <View style={styles.content}>
                          <View style={styles.header}>
                            <View style={styles.iconContainer}>
                              {getIcon(notification)}
                            </View>
                            <View style={styles.timeContainer}>
                              <Clock size={12} color="#9E9E9E" />
                              <Text style={styles.timestamp}>{notification.timestamp}</Text>
                            </View>
                          </View>

                          <View style={styles.textContent}>
                            <Text
                              style={[
                                styles.title,
                                !notification.isRead && styles.unreadTitle,
                              ]}
                            >
                              {notification.title}
                            </Text>
                            <Text style={styles.message}>{notification.message}</Text>
                          </View>

                          {!notification.isRead && (
                            <View style={styles.unreadIndicator} />
                          )}
                        </View>
                      </TouchableOpacity>
                    ))
                  )}
                </ScrollView>
              </View>
            </View>
          </Modal>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '93%',
    height: '97%',
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 20,
  },
  scrollArea: {
    marginTop: 16,
  },
  container: {
    marginHorizontal: 8,
    marginVertical: 6,
    borderRadius: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    padding: 16,
    position: 'relative',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 20,
  },
  timestamp: {
    fontSize: 12,
    color: '#9E9E9E',
    fontWeight: '500',
    marginLeft: 4,
  },
  textContent: {},
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 4,
    lineHeight: 20,
  },
  unreadTitle: {
    fontWeight: '700',
    color: '#000000',
  },
  message: {
    fontSize: 14,
    color: '#616161',
    lineHeight: 20,
  },
  unreadIndicator: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF5722',
  },
});
