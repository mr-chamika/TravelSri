package com.example.student.repo;

import com.example.student.model.UpcomingTrip;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface UpcomingTripRepo extends MongoRepository<UpcomingTrip, String> {

    // Find upcoming trip by original pending trip ID
    Optional<UpcomingTrip> findByOriginalPendingTripId(String originalPendingTripId);

    // Find upcoming trips by trip status
    List<UpcomingTrip> findByTripStatus(String tripStatus);

    // Find upcoming trips by payment status
    List<UpcomingTrip> findByPaymentStatus(String paymentStatus);

    // Find upcoming trips by customer ID
    List<UpcomingTrip> findByCustomerId(String customerId);

    // Find upcoming trips by date range
    @Query("{'date': {$gte: ?0, $lte: ?1}}")
    List<UpcomingTrip> findByDateRange(LocalDate startDate, LocalDate endDate);

    // Find active upcoming trips (Confirmed or In Progress)
    @Query("{'tripStatus': {$in: ['Confirmed', 'In Progress']}}")
    List<UpcomingTrip> findActiveUpcomingTrips();

    // Find upcoming trips by selected hotel ID
    List<UpcomingTrip> findBySelectedHotelId(String selectedHotelId);

    // Find upcoming trips by selected guide ID
    List<UpcomingTrip> findBySelectedGuideId(String selectedGuideId);

    // Find upcoming trips by selected vehicle ID
    List<UpcomingTrip> findBySelectedVehicleId(String selectedVehicleId);

    // Check if upcoming trip exists for a pending trip ID
    boolean existsByOriginalPendingTripId(String originalPendingTripId);

    // Find trips by confirmation date range
    @Query("{'confirmationDate': {$gte: ?0, $lte: ?1}}")
    List<UpcomingTrip> findByConfirmationDateRange(LocalDate startDate, LocalDate endDate);

    // Safe method to find by original pending trip ID
    default Optional<UpcomingTrip> safeFindByOriginalPendingTripId(String originalPendingTripId) {
        if (originalPendingTripId == null || originalPendingTripId.trim().isEmpty()) {
            throw new IllegalArgumentException("Original pending trip ID cannot be null or empty");
        }
        return findByOriginalPendingTripId(originalPendingTripId);
    }

    // Safe method to find by date range
    default List<UpcomingTrip> safeFindByDateRange(LocalDate startDate, LocalDate endDate) {
        if (startDate == null || endDate == null) {
            throw new IllegalArgumentException("Start date and end date cannot be null");
        }
        if (startDate.isAfter(endDate)) {
            throw new IllegalArgumentException("Start date cannot be after end date");
        }
        return findByDateRange(startDate, endDate);
    }
}