package com.example.student.repo;

import com.example.student.model.PendingTrip;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface PendingTripRepo extends MongoRepository<PendingTrip, String> {
    @Query("{'date': {$gte: ?0}}")
    List<PendingTrip> findPendingTrips(LocalDate currentDate);

    default List<PendingTrip> safeFindPendingTrips(LocalDate currentDate) {
        if (currentDate == null) {
            throw new IllegalArgumentException("Current date cannot be null");
        }
        return findPendingTrips(currentDate);
    }
}