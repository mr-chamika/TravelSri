package com.example.student.repo;

import com.example.student.model.Review;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewsRepo extends MongoRepository<Review, String> {

    // Find reviews by star rating range
    List<Review> findByStarsBetween(int minStars, int maxStars);

    // Find reviews by star rating greater than
    List<Review> findByStarsGreaterThan(int minStars);

    // Find reviews by specific star rating
    List<Review> findByStars(int stars);

    @Query(
            value = "{ 'stars': {$gte: ?0} }",
            fields = "{ '_id': 1, 'serviceId': 1, 'text': 1, 'author': 1, 'country': 1, 'dp': 1, 'stars': 1}"
    )
    List<Review> findByStarsIsGreaterThanEqual(int stars);

    // This method is correctly implemented in your code.
    List<Review> findByServiceId(String serviceId);

    // Find reviews by service ordered by stars (highest first)
    List<Review> findByServiceIdOrderByStarsDesc(String serviceId);

    // Find reviews by service and specific star rating
    List<Review> findByServiceIdAndStars(String serviceId, int stars);

    // Search reviews by text content (case insensitive)
    List<Review> findByTextContainingIgnoreCase(String keyword);

    // Global search - search in text, author, or country
    List<Review> findByTextContainingIgnoreCaseOrAuthorContainingIgnoreCaseOrCountryContainingIgnoreCase(
            String text, String author, String country);

    // Search within a specific service - text, author, or country
    @Query("{ 'serviceId': ?0, $or: [ " +
            "{ 'text': { $regex: ?1, $options: 'i' } }, " +
            "{ 'author': { $regex: ?1, $options: 'i' } }, " +
            "{ 'country': { $regex: ?1, $options: 'i' } } " +
            "] }")
    List<Review> findByServiceIdAndSearchTerms(String serviceId, String searchTerm);
}