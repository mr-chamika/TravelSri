import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';

// Review type matching your Review model
type Review = {
  _id: string;
  serviceId: string;
  text: string;
  author: string;
  country: string;
  dp: string;
  stars: number;
};

// Rating statistics type
type ReviewStats = {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: { [key: number]: number };
};

// JWT payload type
type JWTPayload = {
  id?: string;
};

const FeedbackCard: React.FC<{
  review: Review;
}> = ({ review }) => {
  const [imageError, setImageError] = useState(false);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Ionicons
        key={index}
        name={index < rating ? 'star' : 'star-outline'}
        size={18}
        color={index < rating ? '#FFD700' : '#E0E0E0'}
      />
    ));
  };

  const getCountryFlag = (country: string) => {
    const flagMap: { [key: string]: string } = {
      'USA': '🇺🇸',
      'UK': '🇬🇧',
      'Germany': '🇩🇪',
      'France': '🇫🇷',
      'Russia': '🇷🇺',
      'Sri Lanka': '🇱🇰',
      'India': '🇮🇳',
      'China': '🇨🇳',
      'Japan': '🇯🇵',
      'Australia': '🇦🇺',
      'Canada': '🇨🇦',
      'Netherlands': '🇳🇱',
      'Italy': '🇮🇹',
      'Spain': '🇪🇸',
    };
    return flagMap[country] || '🌍';
  };

  const renderAvatar = () => {
    // Check if dp field exists and has a valid image
    if (review.dp && review.dp.trim() !== '' && !imageError) {
      // If dp contains base64 data, use it directly
      const imageUri = review.dp.startsWith('data:') 
        ? review.dp 
        : `data:image/jpeg;base64,${review.dp}`;
      
      return (
        <Image
          source={{ uri: imageUri }}
          style={styles.avatarImage}
          onError={() => {
            console.log('Failed to load profile image for:', review.author);
            setImageError(true);
          }}
        />
      );
    } else {
      // Fallback to default avatar icon
      return <Text style={styles.avatarText}>👤</Text>;
    }
  };

  return (
    <View style={styles.feedbackCard}>
      <View style={styles.cardHeader}>
        <View style={styles.userSection}>
          <View style={styles.avatar}>
            {renderAvatar()}
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.authorName}>{review.author}</Text>
            <View style={styles.countryRow}>
              <Text style={styles.countryFlag}>{getCountryFlag(review.country)}</Text>
              <Text style={styles.countryText}>{review.country}</Text>
            </View>
          </View>
        </View>
        <View style={styles.ratingSection}>
          <View style={styles.starsRow}>
            {renderStars(review.stars)}
          </View>
          <Text style={styles.ratingText}>{review.stars}/5</Text>
        </View>
      </View>
      
      <View style={styles.feedbackContent}>
        <Text style={styles.feedbackText}>{review.text}</Text>
      </View>
      
      <View style={styles.cardFooter}>
        <Text style={styles.reviewId}>Review #{review._id.slice(-6)}</Text>
      </View>
    </View>
  );
};

const RatingSummaryHeader: React.FC<{ stats: ReviewStats | null }> = ({ stats }) => {
  if (!stats) return null;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Ionicons
        key={index}
        name={index < rating ? 'star' : 'star-outline'}
        size={16}
        color={index < rating ? '#FFD700' : '#E0E0E0'}
      />
    ));
  };

  return (
    <View style={styles.summaryHeader}>
      <View style={styles.ratingOverview}>
        <Text style={styles.averageRating}>{stats.averageRating.toFixed(1)}</Text>
        <View style={styles.summaryStars}>
          {renderStars(Math.round(stats.averageRating))}
        </View>
        <Text style={styles.totalReviews}>({stats.totalReviews} reviews)</Text>
      </View>
    </View>
  );
};

const Feedback: React.FC = () => {
  const router = useRouter();
  const [searchText, setSearchText] = useState('');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);
  const [serviceId, setServiceId] = useState<string>(''); // Keep this - now represents user ID
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);

  const API_BASE_URL = 'http://localhost:8080';

  // Extract user ID from JWT token (same as your ShopItemController pattern)
  const extractUserIdFromToken = useCallback(async (): Promise<string | null> => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.warn('No authentication token found');
        return null;
      }
      const decodedToken = jwtDecode<JWTPayload>(token);
      console.log('🔍 Full decoded token:', decodedToken);
      const foundUserId = decodedToken.id; // User ID from JWT
      if (foundUserId) {
        console.log('✅ User ID found:', foundUserId);
        return foundUserId;
      } else {
        console.error('❌ No valid user ID found in token');
        return null;
      }
    } catch (error) {
      console.error('❌ Error decoding JWT token:', error);
      return null;
    }
  }, []);

  const fetchReviews = useCallback(async (userId: string, showLoader = true) => {
    if (!userId || userId.trim() === '') {
      console.error('❌ Cannot fetch reviews: Invalid user ID');
      setError('Invalid user ID');
      return;
    }
    if (showLoader) setIsLoading(true);
    setError(null);
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token available.');
      }

      console.log('🔍 User ID:', userId);
      console.log('🔍 Full URL:', `${API_BASE_URL}/reviews/by-service?serviceid=${userId}`);

      const response = await fetch(`${API_BASE_URL}/reviews/by-service?serviceid=${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      console.log('🔍 Fetching reviews response:', response);
      if (!response.ok) {
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
      }
      const data: Review[] = await response.json();
      console.log(`✅ Successfully fetched ${data.length} reviews`);
      setReviews(data);
      setFilteredReviews(data);
    } catch (error) {
      console.error('❌ Error fetching reviews:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setError(errorMessage);
    } finally {
      if (showLoader) setIsLoading(false);
    }
  }, []);

  const fetchReviewStats = useCallback(async (userId: string) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`${API_BASE_URL}/reviews/stats?serviceid=${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const statsData: ReviewStats = await response.json();
        setStats(statsData);
      }
    } catch (error) {
      console.error('❌ Error fetching review stats:', error);
    }
  }, []);

  const initializeApp = useCallback(async () => {
    setIsLoading(true);
    const userId = await extractUserIdFromToken();
    if (userId) {
      setServiceId(userId);
      console.log('🔍 Initializing app with user ID:', userId);
      await Promise.all([
        fetchReviews(userId, false),
        fetchReviewStats(userId)
      ]);
    } else {
      setError('Authentication required');
      Alert.alert(
        'Authentication Required',
        'Please log in to view your feedback.',
        [
          { text: 'OK', onPress: () => console.log('User acknowledged auth error') }
        ]
      );
    }
    setIsLoading(false);
  }, [extractUserIdFromToken, fetchReviews, fetchReviewStats]);

  const onRefresh = useCallback(async () => {
    if (!serviceId) return;
    setRefreshing(true);
    await Promise.all([
      fetchReviews(serviceId, false),
      fetchReviewStats(serviceId)
    ]);
    setRefreshing(false);
  }, [serviceId, fetchReviews, fetchReviewStats]);

  useFocusEffect(
    useCallback(() => {
      initializeApp();
    }, [initializeApp])
  );

  const handleSearch = (text: string) => {
    setSearchText(text);
    applyFilters(text, selectedRating);
  };

  const handleRatingFilter = (rating: number | null) => {
    setSelectedRating(rating);
    applyFilters(searchText, rating);
  };

  const applyFilters = (searchQuery: string, ratingFilter: number | null) => {
    let filtered = reviews;

    // Apply text search
    if (searchQuery.trim()) {
      filtered = filtered.filter((review) =>
        review.text?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.author?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.country?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply rating filter
    if (ratingFilter !== null) {
      filtered = filtered.filter((review) => review.stars === ratingFilter);
    }

    setFilteredReviews(filtered);
  };

  if (isLoading && !refreshing) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor="#fff" barStyle="dark-content" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFD700" />
          <Text style={styles.loadingText}>Loading feedback...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />

      <View style={styles.header}>
        <Text style={styles.title}>Customer Feedback</Text>
        <TouchableOpacity onPress={onRefresh} style={styles.refreshButton}>
          <MaterialIcons name="refresh" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      {/* Rating Summary */}
      <RatingSummaryHeader stats={stats} />

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Feather name="search" size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search feedback..."
            value={searchText}
            onChangeText={handleSearch}
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => handleSearch('')}>
              <MaterialIcons name="clear" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView
        style={styles.feedbackContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#FFD700']}
          />
        }
      >
        {error ? (
          <View style={styles.errorContainer}>
            <MaterialIcons name="error-outline" size={48} color="#ff4444" />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={initializeApp} style={styles.retryButton}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : filteredReviews.length > 0 ? (
          <>
            {(searchText.length > 0 || selectedRating !== null) && (
              <Text style={styles.searchResults}>
                {filteredReviews.length} feedback{filteredReviews.length !== 1 ? 's' : ''} found
              </Text>
            )}
            {filteredReviews.map((review) => (
              <FeedbackCard key={review._id} review={review} />
            ))}
          </>
        ) : (
          <View style={styles.noFeedbackContainer}>
            <MaterialIcons name="rate-review" size={64} color="#ccc" />
            <Text style={styles.noFeedbackTitle}>
              {searchText || selectedRating ? 'No matching feedback found' : 'No feedback yet'}
            </Text>
            <Text style={styles.noFeedbackText}>
              {searchText || selectedRating
                ? 'Try adjusting your search or filter'
                : 'Your customers haven\'t left any feedback yet.'
              }
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Feedback;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000'
  },
  refreshButton: {
    padding: 8,
  },
  summaryHeader: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  ratingOverview: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  averageRating: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginRight: 8,
  },
  summaryStars: {
    flexDirection: 'row',
    marginRight: 8,
  },
  totalReviews: {
    fontSize: 14,
    color: '#666',
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
  },
  searchBar: {
    flexDirection: 'row',
    backgroundColor: '#f1f3f4',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 12,
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#000'
  },
  filterContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: '#f1f3f4',
  },
  activeFilter: {
    backgroundColor: '#FFD700',
  },
  filterText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  activeFilterText: {
    color: '#000',
    fontWeight: '600',
  },
  searchResults: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
    paddingHorizontal: 4,
  },
  feedbackContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 15,
  },
  feedbackCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 15,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    overflow: 'hidden', // Ensures image respects border radius
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 25,
  },
  avatarText: {
    fontSize: 24,
  },
  userInfo: {
    flex: 1,
  },
  authorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  countryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  countryFlag: {
    fontSize: 18,
    marginRight: 6,
  },
  countryText: {
    fontSize: 14,
    color: '#666',
  },
  ratingSection: {
    alignItems: 'flex-end',
  },
  starsRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  ratingText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  feedbackContent: {
    marginBottom: 15,
  },
  feedbackText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  cardFooter: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
  },
  reviewId: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  errorText: {
    fontSize: 16,
    color: '#ff4444',
    textAlign: 'center',
    marginVertical: 16,
  },
  retryButton: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#000',
    fontWeight: '600',
  },
  noFeedbackContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    minHeight: 300,
  },
  noFeedbackTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  noFeedbackText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
});