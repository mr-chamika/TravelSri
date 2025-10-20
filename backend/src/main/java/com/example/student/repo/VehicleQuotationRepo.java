package com.example.student.repo;

import com.example.student.model.VehicleQuotation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VehicleQuotationRepo extends MongoRepository<VehicleQuotation, String> {

    // Find quotations by pending trip ID
    @Query(
            value = "{ 'pendingTripId': ?0 }",
            fields = "{ '_id': 1, 'pendingTripId': 1, 'vehicleId': 1, 'quotedAmount': 1, 'quotationNotes': 1, 'quotationDate': 1, 'status': 1, 'createdAt': 1, 'updatedAt': 1 }"
    )
    List<VehicleQuotation> findByPendingTripId(String pendingTripId);

    // Find quotations by vehicle ID
    List<VehicleQuotation> findByVehicleId(String vehicleId);

    // Find quotations by pending trip ID and vehicle ID
    Optional<VehicleQuotation> findByPendingTripIdAndVehicleId(String pendingTripId, String vehicleId);

    // Find quotations by status
    List<VehicleQuotation> findByStatus(String status);

    // Find quotations by vehicle ID and status
    List<VehicleQuotation> findByVehicleIdAndStatus(String vehicleId, String status);

    // Remove or do NOT use this incorrect method:
    // List<VehicleQuotation> findByVehicleOwnerId(String userId);
}
