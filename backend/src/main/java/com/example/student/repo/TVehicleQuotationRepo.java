package com.example.student.repo;

import com.example.student.model.TVehicleQuotation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TVehicleQuotationRepo extends MongoRepository<TVehicleQuotation, String> {

    // Find quotations by pending trip id
    @Query("{'pending_trip_id': ?0}")
    List<TVehicleQuotation> findByPendingTripId(String pendingTripId);

    // Find quotations by vehicle id
    @Query("{'vehicle_id': ?0}")
    List<TVehicleQuotation> findByVehicleId(String vehicleId);

    // Find quotations by pending trip id and vehicle id
    @Query("{'pending_trip_id': ?0, 'vehicle_id': ?1}")
    List<TVehicleQuotation> findByPendingTripIdAndVehicleId(String pendingTripId, String vehicleId);

    // Safety methods with validation
    default Optional<TVehicleQuotation> safeFindById(String quotationId) {
        if (quotationId == null || quotationId.trim().isEmpty()) {
            throw new IllegalArgumentException("Quotation ID cannot be null or empty");
        }
        return findById(quotationId);
    }

    default List<TVehicleQuotation> safeFindByPendingTripId(String pendingTripId) {
        if (pendingTripId == null || pendingTripId.trim().isEmpty()) {
            throw new IllegalArgumentException("Pending trip ID cannot be null or empty");
        }
        return findByPendingTripId(pendingTripId);
    }

    default List<TVehicleQuotation> safeFindByVehicleId(String vehicleId) {
        if (vehicleId == null || vehicleId.trim().isEmpty()) {
            throw new IllegalArgumentException("Vehicle ID cannot be null or empty");
        }
        return findByVehicleId(vehicleId);
    }

    default List<TVehicleQuotation> safeFindByPendingTripIdAndVehicleId(String pendingTripId, String vehicleId) {
        if (pendingTripId == null || pendingTripId.trim().isEmpty()) {
            throw new IllegalArgumentException("Pending trip ID cannot be null or empty");
        }
        if (vehicleId == null || vehicleId.trim().isEmpty()) {
            throw new IllegalArgumentException("Vehicle ID cannot be null or empty");
        }
        return findByPendingTripIdAndVehicleId(pendingTripId, vehicleId);
    }
}
