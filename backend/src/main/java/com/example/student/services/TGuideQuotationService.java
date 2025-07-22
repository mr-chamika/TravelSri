package com.example.student.services;


import com.example.student.model.TGuideQuotation;
import com.example.student.repo.TGuideQuotationRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TGuideQuotationService implements ITGuideQuotationService{
    @Autowired
    private TGuideQuotationRepo quotationRepo;

    @Override
    public TGuideQuotation createQuotation(TGuideQuotation quotation) {
        if (quotation == null) {
            throw new IllegalArgumentException("Quotation cannot be null");
        }

        // Validate required fields
        if (quotation.getPendingTripId() == null || quotation.getPendingTripId().trim().isEmpty()) {
            throw new IllegalArgumentException("Pending trip ID is required");
        }

        if (quotation.getGuideId() == null || quotation.getGuideId().trim().isEmpty()) {
            throw new IllegalArgumentException("Guide ID is required");
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
    public List<TGuideQuotation> getAllQuotations() {
        return quotationRepo.findAll();
    }

    @Override
    public Optional<TGuideQuotation> getQuotationById(String quotationId) {
        return quotationRepo.safeFindById(quotationId);
    }

    @Override
    public List<TGuideQuotation> getQuotationsByPendingTripId(String pendingTripId) {
        return quotationRepo.safeFindByPendingTripId(pendingTripId);
    }

    @Override
    public List<TGuideQuotation> getQuotationsByGuideId(String guideId) {
        return quotationRepo.safeFindByGuideId(guideId);
    }

    @Override
    public List<TGuideQuotation> getQuotationsByPendingTripIdAndGuideId(String pendingTripId, String guideId) {
        return quotationRepo.safeFindByPendingTripIdAndGuideId(pendingTripId, guideId);
    }
}
