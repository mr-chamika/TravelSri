package com.example.student.services;

import com.example.student.model.TVehicleQuotation;

import java.util.List;
import java.util.Optional;

public interface ITVehicleQuotationService {

    // Create quotation
    TVehicleQuotation createQuotation(TVehicleQuotation quotation);

    // Find all quotations
    List<TVehicleQuotation> getAllQuotations();

    // Find by quotation id
    Optional<TVehicleQuotation> getQuotationById(String quotationId);

    // Find by pending trip id
    List<TVehicleQuotation> getQuotationsByPendingTripId(String pendingTripId);

    // Find by vehicle id
    List<TVehicleQuotation> getQuotationsByVehicleId(String vehicleId);

    // Find by pending trip id and vehicle id
    List<TVehicleQuotation> getQuotationsByPendingTripIdAndVehicleId(String pendingTripId, String vehicleId);
}
