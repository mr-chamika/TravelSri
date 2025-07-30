package com.example.student.services;


import com.example.student.model.GuideQuotation;
import com.example.student.repo.GuideQuotationRepo;
import com.example.student.repo.TGuideQuotationRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TGuideQuotationService implements ITGuideQuotationService{
    @Autowired
    private GuideQuotationRepo quotationRepo;

    @Override
    public GuideQuotation createQuotation(GuideQuotation quotation) {
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



        // Set default content type if not provided


        return quotationRepo.save(quotation);
    }

    @Override
    public List<GuideQuotation> getAllQuotations() {
        return quotationRepo.findAll();
    }

    @Override
    public Optional<GuideQuotation> getQuotationById(String quotationId) {
        return Optional.empty();
    }

    @Override
    public List<GuideQuotation> getQuotationsByPendingTripId(String pendingTripId) {
        return List.of();
    }

    @Override
    public List<GuideQuotation> getQuotationsByGuideId(String guideId) {
        return List.of();
    }

    @Override
    public List<GuideQuotation> getQuotationsByPendingTripIdAndGuideId(String pendingTripId, String guideId) {
        return List.of();
    }

    //@Override
//    public Optional<GuideQuotation> getQuotationById(String quotationId) {
//        return quotationRepo.safeFindById(quotationId);
//    }
//
//    @Override
//    public List<GuideQuotation> getQuotationsByPendingTripId(String pendingTripId) {
//        return quotationRepo.safeFindByPendingTripId(pendingTripId);
//    }
//
//    @Override
//    public List<GuideQuotation> getQuotationsByGuideId(String guideId) {
//        return quotationRepo.safeFindByGuideId(guideId);
//    }
//
//    @Override
//    public List<GuideQuotation> getQuotationsByPendingTripIdAndGuideId(String pendingTripId, String guideId) {
//        return quotationRepo.safeFindByPendingTripIdAndGuideId(pendingTripId, guideId);
//    }
}
