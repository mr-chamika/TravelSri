import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Feedback {
  id: number;
  name: string;
  time: string;
  rating: number;
  text: string;
  avatar: string;
}

interface RatingBar {
  stars: number;
  percentage: number;
}

const Feedback: React.FC = () => {
  const [searchText, setSearchText] = useState<string>('');

  // Sample feedback data
  const feedbacks: Feedback[] = [
    {
      id: 1,
      name: 'Гусейнова Гульшана',
      time: 'Дней назад',
      rating: 5,
      text: 'Здравствуй у нас работе приложения изначайно чекается. Но есть сложно, я везде распознаю мелкое правило под числу, а вызов к бананам господстной для ЮЗО. Спал на готовом продукеняни по дней будет жестковатых Мы делаю.Экономьлам, что знаете его колледж на 60%.',
      avatar: '👤'
    },
    {
      id: 2,
      name: 'Гусейнова Гульшана',
      time: 'Дней назад',
      rating: 5,
      text: 'Здравствуй у нас работе приложения изначайно чекается. Но есть сложно, я везде распознаю мелкое правило под числу, а вызов к бананам господстной для ЮЗО. Спал на готовом продукеняни по дней будет жестковатых Мы делаю.Экономьлам, что знаете его колледж на 60%.',
      avatar: '👤'
    },
    {
      id: 3,
      name: 'Гусейнова Гульшана',
      time: 'Дней назад',
      rating: 5,
      text: 'Здравствуй у нас работе приложения изначайно чекается. Но есть сложно, я везде распознаю мелкое правило под числу, а вызов к бананам господстной для ЮЗО. Спал на готовом продукеняни по дней будет жестковатых Мы делаю.Экономьлам, что знаете его колледж на 60%.',
      avatar: '👤'
    },
  ];

  const renderStars = (rating: number): JSX.Element[] => {
    return Array.from({ length: 5 }, (_, index) => (
      <Ionicons
        key={index}
        name={index < rating ? 'star' : 'star-outline'}
        size={14}
        color={index < rating ? '#FFD700' : '#E0E0E0'}
      />
    ));
  };

  const renderRatingBars = (): JSX.Element[] => {
    const ratings: RatingBar[] = [
      { stars: 5, percentage: 85 },
      { stars: 4, percentage: 60 },
      { stars: 3, percentage: 40 },
      { stars: 2, percentage: 20 },
      { stars: 1, percentage: 10 },
    ];

    return ratings.map((rating) => (
      <View key={rating.stars} style={styles.ratingRow}>
        <Text style={styles.ratingNumber}>{rating.stars}</Text>
        <Ionicons name="star" size={12} color="#FFD700" />
        <View style={styles.ratingBarContainer}>
          <View style={[styles.ratingBar, { width: `${rating.percentage}%` }]} />
        </View>
      </View>
    ));
  };

  const handleMenuPress = (): void => {
    // Handle menu button press
    console.log('Menu pressed');
  };

  const handleNotificationPress = (): void => {
    // Handle notification button press
    console.log('Notification pressed');
  };

  const handleReplyPress = (feedbackId: number): void => {
    // Handle reply button press
    console.log('Reply pressed for feedback:', feedbackId);
  };

  const handleNavPress = (navItem: string): void => {
    // Handle navigation press
    console.log('Navigation pressed:', navItem);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Page Title */}
      <View style={styles.pageHeader}>
        <Text style={styles.pageTitle}>Feedbacks</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Ba"
          value={searchText}
          onChangeText={setSearchText}
          placeholderTextColor="#999"
        />
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="options" size={20} color="#999" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Rating Summary */}
        <View style={styles.ratingSummary}>
          <View style={styles.ratingLeft}>
            <Text style={styles.ratingScore}>4.5</Text>
            <View style={styles.ratingStars}>
              {renderStars(5)}
            </View>
            <Text style={styles.reviewsCount}>2890 reviews</Text>
          </View>
          <View style={styles.ratingRight}>
            {renderRatingBars()}
          </View>
        </View>

        {/* Feedback List */}
        <View style={styles.feedbackList}>
          {feedbacks.map((feedback) => (
            <View key={feedback.id} style={styles.feedbackItem}>
              <View style={styles.feedbackHeader}>
                <View style={styles.userInfo}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{feedback.avatar}</Text>
                  </View>
                  <View>
                    <Text style={styles.userName}>{feedback.name}</Text>
                    <Text style={styles.timeText}>{feedback.time}</Text>
                  </View>
                </View>
                <View style={styles.feedbackRating}>
                  {renderStars(feedback.rating)}
                </View>
              </View>
              <Text style={styles.feedbackText}>{feedback.text}</Text>
              <TouchableOpacity
                style={styles.replyButton}
                onPress={() => handleReplyPress(feedback.id)}
              >
                <Text style={styles.replyButtonText}>Reply</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  menuButton: {
    padding: 5,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
    color: '#000',
  },
  notificationButton: {
    padding: 5,
  },
  pageHeader: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginVertical: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 25,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  filterButton: {
    padding: 5,
  },
  content: {
    flex: 1,
  },
  ratingSummary: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  ratingLeft: {
    alignItems: 'center',
    marginRight: 30,
  },
  ratingScore: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#000',
  },
  ratingStars: {
    flexDirection: 'row',
    marginVertical: 5,
  },
  reviewsCount: {
    fontSize: 12,
    color: '#666',
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  ratingRight: {
    flex: 1,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingNumber: {
    fontSize: 12,
    color: '#666',
    width: 15,
    marginRight: 5,
  },
  ratingBarContainer: {
    flex: 1,
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    marginLeft: 10,
  },
  ratingBar: {
    height: '100%',
    backgroundColor: '#FFD700',
    borderRadius: 3,
  },
  feedbackList: {
    paddingHorizontal: 20,
  },
  feedbackItem: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  feedbackHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  avatarText: {
    fontSize: 20,
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  timeText: {
    fontSize: 12,
    color: '#666',
  },
  feedbackRating: {
    flexDirection: 'row',
  },
  feedbackText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 15,
  },
  replyButton: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  replyButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingVertical: 15,
    paddingHorizontal: 20,
    justifyContent: 'space-around',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  navItem: {
    padding: 10,
  },
  activeNavItem: {
    backgroundColor: '#FFF8E1',
    borderRadius: 10,
  },
});

export default Feedback;