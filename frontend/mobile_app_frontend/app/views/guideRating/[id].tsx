import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  Alert,
} from 'react-native';

interface Review {
  id: number;
  name: string;
  username: string;
  rating: number;
  review: string;
  avatar: string; // Changed from 'any' to 'string' for online URLs
  date: string;
  location: string;
  tripType: string;
}

const TravelReviews = () => {
  const [replyModalVisible, setReplyModalVisible] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [replyText, setReplyText] = useState('');

  // Realistic travel guide reviews data
  const reviews: Review[] = [
    {
      id: 1,
      name: 'Sarah Johnson',
      username: '@sarah_travels',
      rating: 5,
      review: 'Absolutely incredible experience with Priya as our guide! She took us through the cultural triangle and her knowledge of ancient history was outstanding. The sunrise at Sigiriya was magical and she knew all the best spots for photos. Highly recommend for anyone visiting Sri Lanka!',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      date: '2 weeks ago',
      location: 'Cultural Triangle Tour',
      tripType: '7-day Cultural Experience',
    },
    {
      id: 2,
      name: 'Marcus Chen',
      username: '@marcus_adventures',
      rating: 5,
      review: 'Best safari guide in Yala! Kapila spotted leopards, elephants, and countless birds. His patience and expertise made our wildlife photography dreams come true. The jeep was comfortable and he knew exactly when and where to find the animals. Worth every rupee!',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      date: '1 month ago',
      location: 'Yala National Park',
      tripType: '3-day Safari Adventure',
    },
    {
      id: 3,
      name: 'Emma Thompson',
      username: '@emma_wanderlust',
      rating: 4,
      review: 'Senali was wonderful for our hill country tour! Ella, Nuwara Eliya, and the tea plantations were breathtaking. She arranged everything perfectly and the homestays were authentic. Only minor issue was some transportation delays, but overall fantastic experience.',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      date: '3 weeks ago',
      location: 'Hill Country',
      tripType: '5-day Tea Trail Experience',
    },
    {
      id: 4,
      name: 'James Wilson',
      username: '@jameswilson_photo',
      rating: 5,
      review: 'Nimal is a gem! His coastal tour covered Galle Fort, Mirissa whales, and hidden beaches I never would have found. The sunset at Coconut Tree Hill was spectacular. Great English, very professional, and genuinely cares about showing the real Sri Lanka.',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      date: '5 days ago',
      location: 'Southern Coast',
      tripType: '4-day Beach & Culture Tour',
    },
    {
      id: 5,
      name: 'Lisa Rodriguez',
      username: '@lisa_explores',
      rating: 4,
      review: 'Amazing Kandy and Colombo city experience with Ravi! Temple of the Tooth ceremony was unforgettable and the spice garden tour was educational. Food recommendations were spot on - best kottu I had in Sri Lanka! Very knowledgeable about local customs.',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
      date: '1 week ago',
      location: 'Kandy & Colombo',
      tripType: '2-day City Discovery',
    },
    {
      id: 6,
      name: 'David Kim',
      username: '@david_adventures',
      rating: 5,
      review: 'Incredible Adam\'s Peak sunrise hike with Chamara! He prepared us well, provided headlamps, and his encouragement got us to the top. The spiritual experience was beyond words. Post-hike breakfast at a local family home was the perfect end to an amazing journey.',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      date: '2 months ago',
      location: 'Adam\'s Peak',
      tripType: 'Sacred Mountain Pilgrimage',
    },
  ];

  const handleReply = (review: Review) => {
    setSelectedReview(review);
    setReplyModalVisible(true);
  };

  const sendReply = () => {
    if (replyText.trim()) {
      Alert.alert(
        'Reply Sent!',
        `Your reply to ${selectedReview?.name} has been sent successfully.`,
        [{ text: 'OK', onPress: () => {
          setReplyText('');
          setReplyModalVisible(false);
          setSelectedReview(null);
        }}]
      );
    }
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, index) => (
      <Text
        key={index}
        style={[
          styles.star,
          index < rating ? styles.filledStar : styles.emptyStar,
        ]}
      >
        ★
      </Text>
    ));
  };

  const calculateAverageRating = () => {
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (totalRating / reviews.length).toFixed(1);
  };

  return (
    <View style={styles.container}>
      {/* Rating Section */}
      <View style={styles.ratingSection}>
        <View style={styles.ratingHeader}>
          <Text style={styles.ratingText}>{calculateAverageRating()}</Text>
          <View style={styles.ratingStars}>
            {renderStars(Math.round(parseFloat(calculateAverageRating())))}
          </View>
        </View>
        <View style={styles.reviewCount}>
          <Text style={styles.reviewCountText}>{reviews.length} Reviews</Text>
        </View>
      </View>

      {/* Reviews */}
      <ScrollView 
        contentContainerStyle={styles.reviewsContainer}
        showsVerticalScrollIndicator={false}
      >
        {reviews.map((review) => (
          <View key={review.id} style={styles.reviewCard}>
            {/* Avatar */}
            <View style={styles.avatarContainer}>
              <Image
                source={{ uri: review.avatar }}
                style={styles.avatar}
              />
            </View>

            {/* Review Details */}
            <View style={styles.reviewDetails}>
              {/* Header Info */}
              <View style={styles.reviewHeader}>
                <View>
                  <Text style={styles.name}>{review.name}</Text>
                  <Text style={styles.username}>{review.username}</Text>
                </View>
                <Text style={styles.date}>{review.date}</Text>
              </View>

              {/* Trip Info */}
              <View style={styles.tripInfo}>
                <Text style={styles.tripType}>{review.tripType}</Text>
                <Text style={styles.location}>📍 {review.location}</Text>
              </View>

              {/* Rating */}
              <View style={styles.ratingRow}>
                {renderStars(review.rating)}
              </View>

              {/* Review Text */}
              <Text style={styles.reviewText}>{review.review}</Text>

              {/* Action Buttons */}
              <View style={styles.actionButtons}>
                <TouchableOpacity 
                  style={styles.replyButton}
                  onPress={() => handleReply(review)}
                >
                  <Text style={styles.replyButtonText}>Reply</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.helpfulButton}>
                  <Text style={styles.helpfulButtonText}>👍 Helpful</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Reply Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={replyModalVisible}
        onRequestClose={() => setReplyModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Reply to {selectedReview?.name}</Text>
              <TouchableOpacity
                onPress={() => setReplyModalVisible(false)}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.originalReview}>
              <Text style={styles.originalReviewText}>
                "{selectedReview?.review?.substring(0, 100)}..."
              </Text>
            </View>

            <TextInput
              style={styles.replyInput}
              placeholder="Write your reply..."
              multiline
              value={replyText}
              onChangeText={setReplyText}
              textAlignVertical="top"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setReplyModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.sendButton, !replyText.trim() && styles.sendButtonDisabled]}
                onPress={sendReply}
                disabled={!replyText.trim()}
              >
                <Text style={[styles.sendButtonText, !replyText.trim() && styles.sendButtonTextDisabled]}>
                  Send Reply
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  ratingSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  ratingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  ratingText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginRight: 15,
  },
  ratingStars: {
    flexDirection: 'row',
  },
  reviewCount: {
    backgroundColor: '#34495e',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  reviewCountText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  reviewsContainer: {
    gap: 15,
  },
  reviewCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  reviewDetails: {
    flex: 1,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 2,
  },
  username: {
    color: '#7f8c8d',
    fontSize: 12,
  },
  date: {
    color: '#95a5a6',
    fontSize: 12,
  },
  tripInfo: {
    marginBottom: 8,
  },
  tripType: {
    fontSize: 13,
    fontWeight: '600',
    color: '#3498db',
    marginBottom: 2,
  },
  location: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  ratingRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  star: {
    fontSize: 16,
    marginRight: 2,
  },
  filledStar: {
    color: '#f39c12',
  },
  emptyStar: {
    color: '#ecf0f1',
  },
  reviewText: {
    color: '#2c3e50',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  replyButton: {
    backgroundColor: '#ffee00ff',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  replyButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  helpfulButton: {
    backgroundColor: '#f8f9fa',
    borderColor: '#e9ecef',
    borderWidth: 1,
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  helpfulButtonText: {
    color: '#6c757d',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  closeButton: {
    padding: 5,
  },
  closeButtonText: {
    fontSize: 18,
    color: '#95a5a6',
  },
  originalReview: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    borderLeftWidth: 3,
    borderLeftColor: '#ffee00ff',
  },
  originalReviewText: {
    fontSize: 14,
    color: '#6c757d',
    fontStyle: 'italic',
  },
  replyInput: {
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 8,
    padding: 12,
    height: 100,
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  cancelButtonText: {
    color: '#6c757d',
    fontSize: 16,
  },
  sendButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    backgroundColor: '#ffee03ff',
  },
  sendButtonDisabled: {
    backgroundColor: '#000000ff',
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  sendButtonTextDisabled: {
    color: '#000000ff',
  },
});

export default TravelReviews;