package com.example.student.repo;

import com.example.student.model.Review;
import com.example.student.model.RoomType;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

public interface RoomTypeRepo extends MongoRepository<RoomType, String> {
    @Repository
    interface ReviewRepository extends MongoRepository<Review, String> {

        // Find all reviews for a specific service
        List<Review> findByServiceId(String serviceId);

        // Find reviews by service ordered by stars (highest first)
        List<Review> findByServiceIdOrderByStarsDesc(String serviceId);

        // Find reviews by service and specific star rating
        List<Review> findByServiceIdAndStars(String serviceId, int stars);

        // Search within a specific service - text, author, or country
        @Query("{ 'serviceId': ?0, $or: [ " +
                "{ 'text': { $regex: ?1, $options: 'i' } }, " +
                "{ 'author': { $regex: ?1, $options: 'i' } }, " +
                "{ 'country': { $regex: ?1, $options: 'i' } } " +
                "] }")
        List<Review> findByServiceIdAndSearchTerms(String serviceId, String searchTerm);
    }
}
