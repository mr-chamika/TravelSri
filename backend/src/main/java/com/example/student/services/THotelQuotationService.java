package com.example.student.services;

import com.example.student.model.THotelQuotation;
import com.example.student.repo.THotelQuotationRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class THotelQuotationService implements ITHotelQuotationService{

    @Autowired
    private THotelQuotationRepo quotationRepo;

    @Override
    public THotelQuotation createQuotation(THotelQuotation quotation) {
        if (quotation == null) {
            throw new IllegalArgumentException("Quotation cannot be null");
        }

        // Validate required fields
        if (quotation.getPendingTripId() == null || quotation.getPendingTripId().trim().isEmpty()) {
            throw new IllegalArgumentException("Pending trip ID is required");
        }

        if (quotation.getHotelId() == null || quotation.getHotelId().trim().isEmpty()) {
            throw new IllegalArgumentException("Hotel ID is required");
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
    public List<THotelQuotation> getAllQuotations() {
        return quotationRepo.findAll();
    }

    @Override
    public Optional<THotelQuotation> getQuotationById(String quotationId) {
        return quotationRepo.safeFindById(quotationId);
    }

    @Override
    public List<THotelQuotation> getQuotationsByPendingTripId(String pendingTripId) {
        return quotationRepo.safeFindByPendingTripId(pendingTripId);
    }

    @Override
    public List<THotelQuotation> getQuotationsByHotelId(String hotelId) {
        return quotationRepo.safeFindByHotelId(hotelId);
    }

    @Override
    public List<THotelQuotation> getQuotationsByPendingTripIdAndHotelId(String pendingTripId, String hotelId) {
        return quotationRepo.safeFindByPendingTripIdAndHotelId(pendingTripId, hotelId);
    }
}
