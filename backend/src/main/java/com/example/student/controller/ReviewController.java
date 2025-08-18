package com.example.student.controller;

import com.example.student.model.Review;
import com.example.student.services.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin
@RequestMapping("/reviews")
public class ReviewController {

    @Autowired
    private ReviewService service;

    // Get reviews by service ID (main endpoint for merchants to view their feedback)
    @GetMapping("/by-service")
    public ResponseEntity<List<Review>> getReviewsByServiceId(@RequestParam String serviceid) {
        System.out.println("🔥 REVIEWS ENDPOINT CALLED - Service ID: " + serviceid);
        System.out.println("🔥 Request reached controller successfully!");

        List<Review> reviews = service.getReviewsByServiceId(serviceid);
        System.out.println("🔥 Found " + reviews.size() + " reviews");

        if (reviews.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(reviews);
    }

    // Get review statistics for a service (rating breakdown)
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getReviewStats(@RequestParam String serviceid) {
        System.out.println("🔥 STATS ENDPOINT CALLED - Service ID: " + serviceid);

        Map<String, Object> stats = service.getReviewStats(serviceid);

        if (stats.get("totalReviews").equals(0)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(stats);
    }

    // Search reviews within your service
    @GetMapping("/service-search")
    public ResponseEntity<List<Review>> searchReviewsInService(@RequestParam String serviceid, @RequestParam String query) {
        System.out.println("🔥 SERVICE SEARCH CALLED - Service ID: " + serviceid + ", Query: " + query);

        List<Review> reviews = service.searchReviewsInService(serviceid, query);
        System.out.println("🔥 Found " + reviews.size() + " matching reviews");

        return ResponseEntity.ok(reviews);
    }

    // Filter reviews by rating (1-5 stars)
    @GetMapping("/by-rating")
    public ResponseEntity<List<Review>> getReviewsByRating(@RequestParam String serviceid, @RequestParam int stars) {
        if (stars < 1 || stars > 5) {
            return ResponseEntity.badRequest().build();
        }

        List<Review> reviews = service.getReviewsByServiceIdAndStars(serviceid, stars);
        return ResponseEntity.ok(reviews);
    }

}