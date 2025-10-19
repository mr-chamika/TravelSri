package com.example.student.services;

import com.example.student.model.Review;
import com.example.student.repo.ReviewsRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class ReviewService {

    @Autowired
    private ReviewsRepo reviewRepo;

    public List<Review> getAllReviews() {
        return reviewRepo.findAll();
    }

    public Optional<Review> getReviewById(String id) {
        return reviewRepo.findById(id);
    }

    public Review saveReview(Review review) {
        return reviewRepo.save(review);
    }

    public List<Review> searchReviews(String query) {
        return reviewRepo.findByTextContainingIgnoreCaseOrAuthorContainingIgnoreCaseOrCountryContainingIgnoreCase(
                query, query, query);
    }

    public void deleteReview(String id) {
        reviewRepo.deleteById(id);
    }

    // FIXED: Method to get reviews by serviceId with memory limit protection
    public List<Review> getReviewsByServiceId(String serviceId) {
        try {
            System.out.println("🔍 Fetching reviews for service: " + serviceId);

            // Use limited query to avoid memory overflow
            List<Review> reviews = reviewRepo.findTop50ByServiceIdOrderByStarsDesc(serviceId);

            System.out.println("✅ Successfully fetched " + reviews.size() + " reviews (limited to 50)");
            return reviews;

        } catch (Exception e) {
            System.err.println("❌ Error fetching reviews: " + e.getMessage());
            // Fallback: try without sorting if limited sorting still fails
            try {
                List<Review> reviews = reviewRepo.findByServiceId(serviceId);
                // Sort in Java (works for small to medium datasets)
                reviews.sort((r1, r2) -> Integer.compare(r2.getStars(), r1.getStars()));
                // Limit to 50 reviews max
                return reviews.stream().limit(50).collect(Collectors.toList());
            } catch (Exception fallbackError) {
                System.err.println("❌ Fallback also failed: " + fallbackError.getMessage());
                return new ArrayList<>();
            }
        }
    }

    // Get reviews by service ID and star rating
    public List<Review> getReviewsByServiceIdAndStars(String serviceId, int stars) {
        return reviewRepo.findByServiceIdAndStars(serviceId, stars);
    }

    // Search reviews within a specific service
    public List<Review> searchReviewsInService(String serviceId, String query) {
        if (query == null || query.trim().isEmpty()) {
            return getReviewsByServiceId(serviceId);
        }
        return reviewRepo.findByServiceIdAndSearchTerms(serviceId, query.toLowerCase());
    }

    // FIXED: Calculate review statistics with memory protection
    public Map<String, Object> getReviewStats(String serviceId) {
        try {
            System.out.println("🔍 Calculating stats for service: " + serviceId);

            // Use basic query without sorting for stats calculation
            List<Review> reviews = reviewRepo.findByServiceId(serviceId);

            Map<String, Object> stats = new HashMap<>();
            if (reviews.isEmpty()) {
                stats.put("averageRating", 0.0);
                stats.put("totalReviews", 0);
                stats.put("ratingDistribution", createEmptyDistribution());
                return stats;
            }

            // Calculate average rating
            double averageRating = reviews.stream()
                    .mapToInt(Review::getStars)
                    .average()
                    .orElse(0.0);

            // Calculate rating distribution (1-5 stars)
            Map<Integer, Long> distribution = reviews.stream()
                    .collect(Collectors.groupingBy(Review::getStars, Collectors.counting()));

            // Ensure all ratings 1-5 are present
            Map<Integer, Long> completeDistribution = createEmptyDistribution();
            completeDistribution.putAll(distribution);

            stats.put("averageRating", Math.round(averageRating * 10.0) / 10.0);
            stats.put("totalReviews", reviews.size());
            stats.put("ratingDistribution", completeDistribution);

            System.out.println("✅ Stats calculated: " + reviews.size() + " total reviews, avg rating: " +
                    Math.round(averageRating * 10.0) / 10.0);
            return stats;

        } catch (Exception e) {
            System.err.println("❌ Error calculating stats: " + e.getMessage());
            Map<String, Object> emptyStats = new HashMap<>();
            emptyStats.put("averageRating", 0.0);
            emptyStats.put("totalReviews", 0);
            emptyStats.put("ratingDistribution", createEmptyDistribution());
            return emptyStats;
        }
    }

    // Helper method to create empty rating distribution
    private Map<Integer, Long> createEmptyDistribution() {
        Map<Integer, Long> distribution = new HashMap<>();
        for (int i = 1; i <= 5; i++) {
            distribution.put(i, 0L);
        }
        return distribution;
    }
}