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

    // NEW: Method to get a list of reviews based on a serviceId
    public List<Review> getReviewsByServiceId(String serviceId) {
        return reviewRepo.findByServiceIdOrderByStarsDesc(serviceId);
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

    // Calculate review statistics for a service
    public Map<String, Object> getReviewStats(String serviceId) {
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

        stats.put("averageRating", Math.round(averageRating * 10.0) / 10.0); // Round to 1 decimal
        stats.put("totalReviews", reviews.size());
        stats.put("ratingDistribution", completeDistribution);

        return stats;
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