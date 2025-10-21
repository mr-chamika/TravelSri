package com.example.student.services;

import com.example.student.model.GuideQuotation;
import com.example.student.model.PendingTrip;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public interface IGuideQuotationService {

    // Create guide quotation
    GuideQuotation createGuideQuotation(GuideQuotation guideQuotation);

    // Update guide quotation
    GuideQuotation updateGuideQuotation(String quotationId, GuideQuotation guideQuotation);

    // Get all guide quotations
    List<GuideQuotation> getAllGuideQuotations();

    // Get guide quotation by ID
    Optional<GuideQuotation> getGuideQuotationById(String quotationId);

    // Delete guide quotation
    boolean deleteGuideQuotation(String quotationId);

    // Get quotations by pending trip ID
    List<GuideQuotation> getQuotationsByPendingTripId(String pendingTripId);

    // Get quotations by guide ID
    List<GuideQuotation> getQuotationsByGuideId(String guideId);

    // Get quotation by pending trip ID and guide ID
    Optional<GuideQuotation> getQuotationByPendingTripIdAndGuideId(String pendingTripId, String guideId);

    // Get quotations by status
    List<GuideQuotation> getQuotationsByStatus(String status);

    // Get quotations by guide ID and status
    List<GuideQuotation> getQuotationsByGuideIdAndStatus(String guideId, String status);

    // Submit quotation for a pending trip
    GuideQuotation submitQuotation(String pendingTripId, String guideId, Double amount, String notes);

    // Update quotation status
    GuideQuotation updateQuotationStatus(String quotationId, String status);

    // Get unsubmitted tours for a guide
    List<PendingTrip> getUnsubmittedToursForGuide(String guideId);

    // Get submitted quotations with tour details for a guide
    List<Map<String, Object>> getSubmittedQuotationsWithTourDetails(String guideId);

    // Accept quotation
    GuideQuotation acceptQuotation(String quotationId);

    // Reject quotation
    GuideQuotation rejectQuotation(String quotationId, String reason);

    // Check if guide has already submitted quotation for a trip
    boolean hasGuideSubmittedQuotation(String pendingTripId, String guideId);

    // Get pending quotations for admin review
    List<GuideQuotation> getPendingQuotationsForReview();

    // Get accepted quotations
    List<GuideQuotation> getAcceptedQuotations();

    // Get rejected quotations
    List<GuideQuotation> getRejectedQuotations();

    // Get expired quotations
    List<GuideQuotation> getExpiredQuotations();

    // Mark quotations as expired (for cleanup)
    int markExpiredQuotations(int daysOld);

    // Get quotation statistics for a guide
    Map<String, Object> getGuideQuotationStatistics(String guideId);

    // Get quotation statistics for a trip
    Map<String, Object> getTripQuotationStatistics(String pendingTripId);
}