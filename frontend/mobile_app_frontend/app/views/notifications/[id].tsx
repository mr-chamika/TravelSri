import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

const App = () => {
  // Mock data for notifications
  const notifications = [
    {
      id: 1,
      type: 'guide',
      title: 'Looking for guide to group tour in Kandy',
      action: 'See Details',
      timestamp: 'Today at 9:42 AM',
      avatar: 'https://via.placeholder.com/50?text=User+1', // Placeholder image URL
    },
    {
      id: 2,
      type: 'reaction',
      title: 'Dennis Nedry reacted to your blog post',
      timestamp: 'Last Wednesday at 9:42 AM',
      avatar: ' https://via.placeholder.com/50?text=User+2', // Placeholder image URL
    },
    {
      id: 3,
      type: 'review',
      title: 'Dennis Nedry put a review about you',
      content: '"Wonderful person. She became our family member for all time"',
      timestamp: 'Last Wednesday at 9:42 AM',
      avatar: ' https://via.placeholder.com/50?text=User+3', // Placeholder image URL
    },
    {
      id: 4,
      type: 'request',
      title: 'Dennis Nedry request for hiring',
      details: 'Kandy - 2 Days - 12/05 to 12/06',
      timestamp: '2mb',
      avatar: ' https://via.placeholder.com/50?text=User+4', // Placeholder image URL
    },
    {
      id: 5,
      type: 'comment',
      title: 'Dennis Nedry commented on Isla Nublar SOC2 compliance report',
      content:
        '"Oh, I finished de-bugging the phones, but the system’s compiling for eighteen minutes, or twenty..."',
      action: 'Add to favorites',
      timestamp: 'Last Wednesday at 9:42 AM',
      avatar: ' https://via.placeholder.com/50?text=User+5', // Placeholder image URL
    },
    {
      id: 6,
      type: 'new_account',
      title: 'New Account created',
      timestamp: 'Last Wednesday at 9:42 AM',
      avatar: ' https://via.placeholder.com/50?text=User+6', // Placeholder image URL
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {notifications.map((notification) => (
          <View key={notification.id} style={styles.notificationCard}>
            {/* Profile Icon */}
            <Image
              source={{ uri: notification.avatar }}
              style={styles.profileIcon}
            />

            {/* Notification Content */}
            <View style={styles.notificationDetails}>
              {/* Title and Action */}
              <Text style={styles.title}>{notification.title}</Text>
              {notification.action && (
                <TouchableOpacity style={styles.actionButton}>
                  <Text style={styles.actionButtonText}>{notification.action}</Text>
                </TouchableOpacity>
              )}

              {/* Additional Details */}
              {notification.content && (
                <Text style={styles.content}>{notification.content}</Text>
              )}
              {notification.details && (
                <Text style={styles.details}>{notification.details}</Text>
              )}

              {/* Timestamp */}
              <Text style={styles.timestamp}>{notification.timestamp}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  scrollViewContent: {
    gap: 10,
  },
  notificationCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
  },
  profileIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  notificationDetails: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  content: {
    color: '#333',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 5,
  },
  details: {
    color: '#777',
    fontSize: 12,
    marginBottom: 5,
  },
  timestamp: {
    color: '#777',
    fontSize: 12,
  },
  actionButton: {
    backgroundColor: '#fff',
    borderColor: '#ffcc00',
    borderWidth: 1,
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginTop: 5,
  },
  actionButtonText: {
    color: '#ffcc00',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default App;