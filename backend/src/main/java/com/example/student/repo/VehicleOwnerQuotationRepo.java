package com.example.student.repo;

import com.example.student.model.VehicleOwnerQuotation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VehicleOwnerQuotationRepo extends MongoRepository<VehicleOwnerQuotation, String> {

    // Find quotations by tour ID
    List<VehicleOwnerQuotation> findByTourId(String tourId);

    // Find quotations by owner ID
    List<VehicleOwnerQuotation> findByOwnerId(String ownerId);

    @Query("{'ownerId': ?0, 'tourId': ?1}")
    List<VehicleOwnerQuotation> findByOwnerIdAndTourId(String ownerId, String tourId);

    // Remove this method - it doesn't match any field in your entity
    // List<VehicleOwnerQuotation> findByVehicleOwnerId(String ownerId);

    // Find quotations by tour ID and owner ID
    Optional<VehicleOwnerQuotation> findByTourIdAndOwnerId(String tourId, String ownerId);

    // Find quotations by status
    List<VehicleOwnerQuotation> findByStatus(String status);

    // Find quotations by owner ID and status
    List<VehicleOwnerQuotation> findByOwnerIdAndStatus(String ownerId, String status);
}