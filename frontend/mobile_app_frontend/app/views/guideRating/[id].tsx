import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import BackButton from '../../../components/ui/backButton';

interface Review {
  id: number;
  author: string;
  timeAgo: string;
  rating: number;
  text: string;
  avatar?: string;
}

interface RatingDistribution {
  stars: number;
  count: number;
  percentage: number;
}

const StarIcon: React.FC<{ filled: boolean; size?: number }> = ({ filled, size = 16 }) => (
  <View style={[styles.star, { width: size, height: size }]}>
    <Text style={[styles.starText, { fontSize: size * 0.8 }]}>
      {filled ? '★' : '☆'}
    </Text>
  </View>
);

const StarRating: React.FC<{ rating: number; size?: number }> = ({ rating, size = 16 }) => (
  <View style={styles.starContainer}>
    {[1, 2, 3, 4, 5].map((star) => (
      <StarIcon key={star} filled={star <= rating} size={size} />
    ))}
  </View>
);

const RatingBar: React.FC<{ stars: number; percentage: number }> = ({ stars, percentage }) => (
  <View style={styles.ratingBarContainer}>
    <Text style={styles.ratingBarNumber}>{stars}</Text>
    <StarIcon filled={true} size={12} />
    <View style={styles.progressBarContainer}>
      <View style={[styles.progressBar, { width: `${percentage}%` }]} />
    </View>
  </View>
);

const ReviewItem: React.FC<{ review: Review }> = ({ review }) => (
  <View style={styles.reviewCard}>
    <View style={styles.reviewHeader}>
      <View style={styles.avatarContainer}>
        <Image
          source={{ uri: review.avatar || 'https://via.placeholder.com/40' }}
          style={styles.avatar}
        />
      </View>
      <View style={styles.reviewAuthorInfo}>
        <Text style={styles.authorName}>{review.author}</Text>
        <Text style={styles.timeAgo}>{review.timeAgo}</Text>
        <StarRating rating={review.rating} size={14} />
      </View>
    </View>
    
    <Text style={styles.reviewText}>{review.text}</Text>
    
    <TouchableOpacity style={styles.replyButton}>
      <Text style={styles.replyButtonText}>Reply...........</Text>
    </TouchableOpacity>
  </View>
);

const MobileRatingReviewApp: React.FC = () => {
  const overallRating = 4.5;
  const totalReviews = 651;
  
  const ratingDistribution: RatingDistribution[] = [
    { stars: 5, count: 420, percentage: 64 },
    { stars: 4, count: 130, percentage: 20 },
    { stars: 3, count: 65, percentage: 10 },
    { stars: 2, count: 26, percentage: 4 },
    { stars: 1, count: 10, percentage: 2 }
  ];

  const reviews: Review[] = [
    {
      id: 1,
      author: "Екатерина Лукецкая",
      timeAgo: "месяц назад",
      rating: 5,
      text: "Заказывала у ребят разработку интернет-магазина. Что могу сказать, я очень довольная, магазин сделали под ключ сразу с базовыми настройками для SEO (пока не планирую продвигать) но уже будет возможность это делать.Рекомендую, цена, качество и коммуникация на 100%.",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b332c2c2?w=100&h=100&fit=crop&crop=face"
    },
    {
      id: 2,
      author: "Екатерина Лукецкая",
      timeAgo: "месяц назад",
      rating: 5,
      text: "Заказывала у ребят разработку интернет-магазина. Что могу сказать, я очень довольная, магазин сделали под ключ сразу с базовыми настройками для SEO (пока не планирую продвигать) но уже будет возможность это делать.Рекомендую, цена, качество и коммуникация на 100%.",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b332c2c2?w=100&h=100&fit=crop&crop=face"
    },
    {
      id: 3,
      author: "Екатерина Лукецкая",
      timeAgo: "месяц назад",
      rating: 5,
      text: "Заказывала у ребят разработку интернет-магазина. Что могу сказать, я очень довольная, магазин сделали под ключ сразу с базовыми настройками для SEO (пока не планирую продвигать) но уже будет возможность это делать.Рекомендую, цена, качество и коммуникация на 100%.",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b332c2c2?w=100&h=100&fit=crop&crop=face"
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
       <BackButton />
      <ScrollView showsVerticalScrollIndicator={false}>
       
        {/* Overall Rating Card */}
        <View style={styles.ratingCard}>
          <View style={styles.ratingSection}>
            <View style={styles.ratingLeft}>
              <View style={styles.ratingDisplay}>
                <Text style={styles.ratingNumber}>{overallRating}</Text>
                <StarIcon filled={true} size={24} />
              </View>
              <View style={styles.reviewBadge}>
                <Text style={styles.reviewBadgeText}>{totalReviews} reviews</Text>
              </View>
            </View>
            
            <View style={styles.ratingBars}>
              {ratingDistribution.map((item) => (
                <RatingBar key={item.stars} stars={item.stars} percentage={item.percentage} />
              ))}
            </View>
          </View>
        </View>

        {/* Reviews List */}
        <View style={styles.reviewsList}>
          {reviews.map((review) => (
            <ReviewItem key={review.id} review={review} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    marginTop:50
  },
  ratingCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  ratingSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  ratingLeft: {
    alignItems: 'flex-start',
  },
  ratingDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  ratingNumber: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#1F2937',
    marginRight: 8,
  },
  reviewBadge: {
    backgroundColor: '#1F2937',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  reviewBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  ratingBars: {
    flex: 1,
    marginLeft: 20,
    maxWidth: 180,
  },
  ratingBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  ratingBarNumber: {
    fontSize: 12,
    color: '#6B7280',
    width: 10,
    textAlign: 'center',
  },
  progressBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginLeft: 8,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#FCD34D',
    borderRadius: 4,
  },
  star: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  starText: {
    color: '#FCD34D',
    fontWeight: 'bold',
  },
  starContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewsList: {
    paddingHorizontal: 16,
  },
  reviewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.08,
    shadowRadius: 2.22,
    elevation: 3,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E5E7EB',
  },
  reviewAuthorInfo: {
    flex: 1,
  },
  authorName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  timeAgo: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 6,
  },
  reviewText: {
    fontSize: 13,
    color: '#374151',
    lineHeight: 18,
    marginBottom: 16,
  },
  replyButton: {
    backgroundColor: '#FEF3C7',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  replyButtonText: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '500',
  },
});

export default MobileRatingReviewApp;