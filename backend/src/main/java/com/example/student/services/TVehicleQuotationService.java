package com.example.student.services;

import com.example.student.model.TVehicleQuotation;
import com.example.student.repo.TVehicleQuotationRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TVehicleQuotationService implements ITVehicleQuotationService{

    @Autowired
    private TVehicleQuotationRepo quotationRepo;

    @Override
    public TVehicleQuotation createQuotation(TVehicleQuotation quotation) {
        if (quotation == null) {
            throw new IllegalArgumentException("Quotation cannot be null");
        }

        // Validate required fields
        if (quotation.getPendingTripId() == null || quotation.getPendingTripId().trim().isEmpty()) {
            throw new IllegalArgumentException("Pending trip ID is required");
        }

        if (quotation.getVehicleId() == null || quotation.getVehicleId().trim().isEmpty()) {
            throw new IllegalArgumentException("Vehicle ID is required");
        }

        if (quotation.getPrice() == null || quotation.getPrice() <= 0) {
            throw new IllegalArgumentException("Price must be a positive value");
        }

        if (quotation.getQuotationPdf() == null || quotation.getQuotationPdf().length == 0) {
            throw new IllegalArgumentException("Quotation PDF is required");
        }

        // Set default content type if not provided
        if (quotation.getPdfContentType() == null || quotation.getPdfContentType().trim().isEmpty()) {
            quotation.setPdfContentType("application/pdf");
        }

        return quotationRepo.save(quotation);
    }

    @Override
    public List<TVehicleQuotation> getAllQuotations() {
        return quotationRepo.findAll();
    }

    @Override
    public Optional<TVehicleQuotation> getQuotationById(String quotationId) {
        return quotationRepo.safeFindById(quotationId);
    }

    @Override
    public List<TVehicleQuotation> getQuotationsByPendingTripId(String pendingTripId) {
        return quotationRepo.safeFindByPendingTripId(pendingTripId);
    }

    @Override
    public List<TVehicleQuotation> getQuotationsByVehicleId(String vehicleId) {
        return quotationRepo.safeFindByVehicleId(vehicleId);
    }

    @Override
    public List<TVehicleQuotation> getQuotationsByPendingTripIdAndVehicleId(String pendingTripId, String vehicleId) {
        return quotationRepo.safeFindByPendingTripIdAndVehicleId(pendingTripId, vehicleId);
    }
}
