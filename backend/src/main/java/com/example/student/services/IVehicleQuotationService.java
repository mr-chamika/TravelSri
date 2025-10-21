package com.example.student.services;

import com.example.student.model.VehicleQuotation;

import java.util.List;
import java.util.Optional;

public interface IVehicleQuotationService {

    // Basic CRUD operations
    VehicleQuotation saveQuotation(VehicleQuotation quotation);

    Optional<VehicleQuotation> getQuotationById(String id);

    List<VehicleQuotation> getAllQuotations();

    void deleteQuotation(String id);

    boolean existsById(String id);

    // Custom query methods
    List<VehicleQuotation> getQuotationsByPendingTripId(String pendingTripId);

    List<VehicleQuotation> getQuotationsByVehicleId(String vehicleId);

    Optional<VehicleQuotation> getQuotationByPendingTripIdAndVehicleId(String pendingTripId, String vehicleId);

    List<VehicleQuotation> getQuotationsByStatus(String status);

    List<VehicleQuotation> getQuotationsByVehicleIdAndStatus(String vehicleId, String status);

    // Business logic methods
    VehicleQuotation updateQuotationStatus(String id, String status);

    VehicleQuotation updateQuotationAmount(String id, Double amount);

    List<VehicleQuotation> getPendingQuotations();

    List<VehicleQuotation> getAcceptedQuotations();

    List<VehicleQuotation> getRejectedQuotations();

    // Statistics methods
    long countQuotationsByStatus(String status);

    long countQuotationsByVehicleId(String vehicleId);

    Double getAverageQuotedAmountByPendingTripId(String pendingTripId);
}