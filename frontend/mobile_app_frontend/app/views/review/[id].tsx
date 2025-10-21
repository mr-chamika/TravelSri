import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

const App = () => {
  // Mock data for reviews
  const reviews = [
    {
      id: 1,
      name: 'Sarah Johnson',
      username: '@sarah_travels',
      rating: 5,
      review:
        'Amazing guide! He took us to hidden waterfalls and local restaurants that weren\'t in any guidebook. Very knowledgeable about Sri Lankan culture and history. Highly recommended!',
      avatar: 'https://via.placeholder.com/50?text=Sarah+J', // Placeholder image URL
    },
    {
      id: 2,
      name: 'Michael Chen',
      username: '@mike_explorer',
      rating: 5,
      review:
        'Best hiking experience ever! The guide was punctual, professional, and made sure everyone was comfortable. Perfect balance of adventure and safety. Will definitely book again!',
      avatar: 'https://via.placeholder.com/50?text=Michael+C', // Placeholder image URL
    },
    {
      id: 3,
      name: 'Emma Wilson',
      username: '@emma_wanderlust',
      rating: 4,
      review:
        'Great experience overall! Very friendly and accommodating. The tour covered all major attractions in Kandy. Minor issue with timing but nothing major. Would recommend!',
      avatar: 'https://via.placeholder.com/50?text=Emma+W', // Placeholder image URL
    },
    {
      id: 4,
      name: 'Raj Patel',
      username: '@raj_backpacker',
      rating: 5,
      review:
        'Fantastic guide who really knows the Nuwara Eliya region! Shared interesting stories and local insights. The tea plantation tour was unforgettable. Great value for money.',
      avatar: 'https://via.placeholder.com/50?text=Raj+P', // Placeholder image URL
    },
    {
      id: 5,
      name: 'Lisa Martinez',
      username: '@lisa_adventure',
      rating: 4,
      review:
        'Good experience with the beach and coral reef tour. Guide was knowledgeable and safety-conscious. Water was calm and beautiful. Would have loved more time at the beach.',
      avatar: 'https://via.placeholder.com/50?text=Lisa+M', // Placeholder image URL
    },
    {
      id: 6,
      name: 'James Cooper',
      username: '@james_explorer',
      rating: 5,
      review:
        'Phenomenal! The guide took us on an authentic Colombo street food tour. We tried 15 different dishes and learned so much about local cuisines. Best experience yet!',
      avatar: 'https://via.placeholder.com/50?text=James+C', // Placeholder image URL
    },
  ];

  return (
    <View style={styles.container}>
      {/* Rating Section */}
      <View style={styles.ratingSection}>
        <Text style={styles.ratingText}>4.5</Text>
        <View style={styles.reviewCount}>
          <Text style={styles.reviewCountText}>685 Reviews</Text>
        </View>
      </View>

      {/* Reviews */}
      <ScrollView contentContainerStyle={styles.reviewsContainer}>
        {reviews.map((review) => (
          <View key={review.id} style={styles.reviewCard}>
            {/* Avatar */}
            <Image
              source={{ uri: review.avatar }}
              style={styles.avatar}
            />

            {/* Review Details */}
            <View style={styles.reviewDetails}>
              {/* Name and Username */}
              <Text style={styles.name}>{review.name}</Text>
              <Text style={styles.username}>{review.username}</Text>

              {/* Rating */}
              <View style={styles.ratingRow}>
                {[...Array(5)].map((_, index) => (
                  <Text
                    key={index}
                    style={[
                      styles.star,
                      index < review.rating ? styles.filledStar : null,
                    ]}
                  >
                    ★
                  </Text>
                ))}
              </View>

              {/* Review Text */}
              <Text style={styles.reviewText}>{review.review}</Text>

              {/* Reply Button */}
              <TouchableOpacity style={styles.replyButton}>
                <Text style={styles.replyButtonText}>Reply</Text>
              </TouchableOpacity>
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
  ratingSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  ratingText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginRight: 10,
  },
  reviewCount: {
    backgroundColor: '#2c2c2c',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  reviewCountText: {
    color: '#fff',
    fontSize: 12,
  },
  reviewsContainer: {
    gap: 10,
  },
  reviewCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  reviewDetails: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  username: {
    color: '#777',
    fontSize: 12,
    marginBottom: 10,
  },
  ratingRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  star: {
    fontSize: 18,
    color: '#ffcc00',
    marginRight: 2,
  },
  filledStar: {
    color: '#ffcc00',
  },
  reviewText: {
    color: '#333',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 10,
  },
  replyButton: {
    backgroundColor: '#fff',
    borderColor: '#ffcc00',
    borderWidth: 1,
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  replyButtonText: {
    color: '#ffcc00',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default App;