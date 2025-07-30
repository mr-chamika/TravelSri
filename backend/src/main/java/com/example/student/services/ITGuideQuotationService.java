package com.example.student.services;

import com.example.student.model.GuideQuotation;

import java.util.List;
import java.util.Optional;

public interface ITGuideQuotationService {

    // Create quotation
    GuideQuotation createQuotation(GuideQuotation quotation);

    // Find all quotations
    List<GuideQuotation> getAllQuotations();

    // Find by quotation id
    Optional<GuideQuotation> getQuotationById(String quotationId);

    // Find by pending trip id
    List<GuideQuotation> getQuotationsByPendingTripId(String pendingTripId);

    // Find by guide id
    List<GuideQuotation> getQuotationsByGuideId(String guideId);

    // Find by pending trip id and guide id
    List<GuideQuotation> getQuotationsByPendingTripIdAndGuideId(String pendingTripId, String guideId);
}
