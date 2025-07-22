package com.example.student.services;

import com.example.student.model.TGuideQuotation;

import java.util.List;
import java.util.Optional;

public interface ITGuideQuotationService {

    // Create quotation
    TGuideQuotation createQuotation(TGuideQuotation quotation);

    // Find all quotations
    List<TGuideQuotation> getAllQuotations();

    // Find by quotation id
    Optional<TGuideQuotation> getQuotationById(String quotationId);

    // Find by pending trip id
    List<TGuideQuotation> getQuotationsByPendingTripId(String pendingTripId);

    // Find by guide id
    List<TGuideQuotation> getQuotationsByGuideId(String guideId);

    // Find by pending trip id and guide id
    List<TGuideQuotation> getQuotationsByPendingTripIdAndGuideId(String pendingTripId, String guideId);
}
