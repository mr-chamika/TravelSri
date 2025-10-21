import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, SafeAreaView } from 'react-native';
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
        <View style={styles.authorRow}>
          <Text style={styles.authorName}>{review.author}</Text>
          <View style={styles.ratingBadge}>
            <StarRating rating={review.rating} size={12} />
          </View>
        </View>
        <Text style={styles.timeAgo}>{review.timeAgo}</Text>
      </View>
    </View>
    
    <Text style={styles.reviewText}>{review.text}</Text>
  </View>
);

const MobileRatingReviewApp: React.FC = () => {
  const overallRating = 4.5;
  const totalReviews = 6;
  
  const ratingDistribution: RatingDistribution[] = [
    { stars: 5, count: 3, percentage: 50 },
    { stars: 4, count: 3, percentage: 50 },
    { stars: 3, count: 0, percentage: 0 },
    { stars: 2, count: 0, percentage: 0 },
    { stars: 1, count: 0, percentage: 0 }
  ];

  const reviews: Review[] = [
    {
      id: 1,
      author: "Sarah Johnson",
      timeAgo: "2 weeks ago",
      rating: 5,
      text: "Absolutely fantastic guide! Took us through hidden waterfalls and secret local spots we'd never find alone. Very knowledgeable about Sri Lankan culture and history. The best tour experience we've had!",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b332c2c2?w=100&h=100&fit=crop&crop=face"
    },
    {
      id: 2,
      author: "Michael Rodriguez",
      timeAgo: "1 month ago",
      rating: 5,
      text: "Outstanding hiking experience! Our guide was professional, punctual, and made sure everyone stayed safe. He shared amazing stories about the tea plantations. Would definitely book again!",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
    },
    {
      id: 3,
      author: "Emma Thompson",
      timeAgo: "1 month ago",
      rating: 4,
      text: "Great experience overall! Very friendly and patient guide. Covered all the major attractions in Kandy with historical insights. Minor timing issue but handled professionally. Would recommend!",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face"
    },
    {
      id: 4,
      author: "Raj Patel",
      timeAgo: "6 weeks ago",
      rating: 5,
      text: "Phenomenal guide with deep knowledge of Nuwara Eliya region! The tea plantation tour was unforgettable - learned so much about tea processing. Excellent value and authentic Sri Lankan experience!",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face"
    },
    {
      id: 5,
      author: "Lisa Martinez",
      timeAgo: "2 months ago",
      rating: 4,
      text: "Beautiful beach and coral reef tour! Guide was very knowledgeable about marine life and ensured everyone's safety. Crystal clear waters and amazing snorkeling spots. Would visit again!",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
    },
    {
      id: 6,
      author: "James Cooper",
      timeAgo: "2 months ago",
      rating: 4,
      text: "Best street food tour ever! Guide took us to 15+ authentic local spots in Colombo. Delicious traditional dishes and fascinating stories about food culture. An adventure for all senses!",
      avatar: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=100&h=100&fit=crop&crop=face"
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
    marginHorizontal: 0,
    borderLeftWidth: 4,
    borderLeftColor: '#FCD34D',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 4,
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
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E5E7EB',
    borderWidth: 2,
    borderColor: '#FCD34D',
  },
  reviewAuthorInfo: {
    flex: 1,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  authorName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
  },
  ratingBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
  },
  timeAgo: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  reviewText: {
    fontSize: 13,
    color: '#374151',
    lineHeight: 20,
    marginBottom: 0,
  },
});

export default MobileRatingReviewApp;