import { Text, View, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Star } from 'lucide-react-native';

export default function Feedback() {
  const reviews = [
    {
      id: 1,
      userName: 'Екатерина Луканова',
      rating: 5,
      text: 'Администратор у нашей управляющей компании отвечает. Но могу сказать, я плачу большие деньги за коммунальные услуги, а вода горячая может отсутствовать по 3 дня. Блоки не промывают повидательно, что работает в очень низком Администрация, а управляющая компания не ведает на задачи Администратора до НГК.',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'
    },
    {
      id: 2,
      userName: 'Екатерина Луканова',
      rating: 5,
      text: 'Администратор у нашей управляющей компании отвечает настолько. Но могу сказать, я плачу большие деньги за коммунальные услуги, а вода горячая может отсутствовать по 3 дня. Блоки не промывают повидательно, что работает в очень низком Администрация, а управляющая компания не ведает на задачи Администратора до НГК.',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'
    },
    {
      id: 3,
      userName: 'Екатерина Луканова',
      rating: 5,
      text: 'Администратор у нашей управляющей компании отвечает настолько. Но могу сказать, я плачу большие деньги за коммунальные услуги, а вода горячая может отсутствовать по 3 дня. Блоки не промывают повидательно, что работает в очень низком Администрация, а управляющая компания не ведает на задачи Администратора до НГК.',
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