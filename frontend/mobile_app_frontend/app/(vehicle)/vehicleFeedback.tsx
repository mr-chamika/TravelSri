import { Text, View, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Star } from 'lucide-react-native';

export default function Feedback() {
  const reviews = [
    {
      id: 1,
      userName: 'Sarah Thompson',
      rating: 5,
      text: 'Amazing experience! The car was spotless and exactly as described. Pick-up was smooth and the staff was incredibly helpful. The vehicle performed perfectly during our 5-day road trip through the mountains. Definitely booking with them again for our next vacation!',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'
    },
    {
      id: 2,
      userName: 'Michael Rodriguez',
      rating: 4,
      text: 'Great rental service overall. The SUV was comfortable for our family of four and had plenty of space for luggage. GPS worked perfectly and fuel efficiency was better than expected. Only minor issue was a small delay during pickup, but the customer service made up for it.',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'
    },
    {
      id: 3,
      userName: 'Emily Davis',
      rating: 5,
      text: 'Exceptional service from start to finish! The compact car was perfect for city exploration and parking was a breeze. Clean interior, smooth ride, and excellent fuel economy. The 24/7 customer support was reassuring during our international trip. Highly recommend!',
      avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'
    }
  ];

  const ratingDistribution = [
    { stars: 5, count: 85, percentage: 0.85 },
    { stars: 4, count: 12, percentage: 0.12 },
    { stars: 3, count: 2, percentage: 0.02 },
    { stars: 2, count: 1, percentage: 0.01 },
    { stars: 1, count: 0, percentage: 0 }
  ];

  const renderStars = (rating: number, size: number = 16) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={size}
        color={index < rating ? '#FFD700' : '#E5E5E5'}
        fill={index < rating ? '#FFD700' : '#E5E5E5'}
      />
    ));
  };

  const renderRatingBar = (item: any) => (
    <View key={item.stars} style={styles.ratingBarContainer}>
      <View style={styles.ratingBarLeft}>
        <Text style={styles.ratingBarText}>{item.stars}</Text>
        <Star size={14} color="#FFD700" fill="#FFD700" />
      </View>
      <View style={styles.ratingBarTrack}>
        <View 
          style={[
            styles.ratingBarFill, 
            { width: `${item.percentage * 100}%` }
          ]} 
        />
      </View>
      <Text style={styles.ratingBarCount}>{item.count}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Header Rating Section */}
      <View style={styles.headerContainer}>
        <View style={styles.ratingHeader}>
          <Text style={styles.ratingNumber}>4.5</Text>
          <View style={styles.starsContainer}>
            {renderStars(5, 20)}
          </View>
          <TouchableOpacity style={styles.starsButton}>
            <Text style={styles.starsButtonText}>4.5 Stars</Text>
          </TouchableOpacity>
        </View>

        {/* Rating Distribution */}
        <View style={styles.distributionContainer}>
          {ratingDistribution.map(renderRatingBar)}
        </View>
      </View>

      {/* Reviews List */}
      <View style={styles.reviewsContainer}>
        {reviews.map((review) => (
          <View key={review.id} style={styles.reviewCard}>
            <View style={styles.reviewHeader}>
              <Image source={{ uri: review.avatar }} style={styles.avatar} />
              <View style={styles.reviewHeaderText}>
                <Text style={styles.userName}>{review.userName}</Text>
                <View style={styles.reviewStars}>
                  {renderStars(review.rating)}
                </View>
              </View>
            </View>
            <Text style={styles.reviewText}>{review.text}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerContainer: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 10,
  },
  ratingHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  ratingNumber: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  starsButton: {
    backgroundColor: '#333',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  starsButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  distributionContainer: {
    gap: 8,
  },
  ratingBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  ratingBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    width: 30,
  },
  ratingBarText: {
    fontSize: 14,
    color: '#666',
  },
  ratingBarTrack: {
    flex: 1,
    height: 8,
    backgroundColor: '#E5E5E5',
    borderRadius: 4,
  },
  ratingBarFill: {
    height: '100%',
    backgroundColor: '#FFD700',
    borderRadius: 4,
  },
  ratingBarCount: {
    fontSize: 14,
    color: '#666',
    width: 30,
    textAlign: 'right',
  },
  reviewsContainer: {
    gap: 12,
  },
  reviewCard: {
    backgroundColor: '#fff',
    padding: 16,
    marginHorizontal: 10,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  reviewHeaderText: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  reviewStars: {
    flexDirection: 'row',
    gap: 2,
  },
  reviewText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});