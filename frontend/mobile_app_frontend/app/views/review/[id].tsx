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
      name: 'Катерина Лущекоя',
      username: '@katya_lush',
      rating: 5,
      review:
        'Можем помочь с SEO-продвижением вашего сайта и увеличить трафик. Доработаем или создадим контент для вашего бизнеса.',
      avatar: 'https://via.placeholder.com/50?text=User+1', // Placeholder image URL
    },
    {
      id: 2,
      name: 'Катерина Лужецкая',
      username: '@katya_luzheckaya',
      rating: 3,
      review:
        'Анализируем запросы и выявляем ключевые слова. Создаем оптимизированный контент для вашего сайта. Работаем с Google Analytics и Яндекс Метрикой.',
      avatar: ' https://via.placeholder.com/50?text=User+2', // Placeholder image URL
    },
    {
      id: 3,
      name: 'Катериня Лужецкая',
      username: '@kateryna_luzheckaya',
      rating: 4,
      review:
        'Нашей команде удалось разработать уникальный контент, который помогает увеличить конверсии, варьируя аудиторию через SEO Рекомендации целей, копирайта на 100%.',
      avatar: ' https://via.placeholder.com/50?text=User+3', // Placeholder image URL
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