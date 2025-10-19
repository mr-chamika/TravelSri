package com.example.student.services;

import com.example.student.model.GuideQuotation;
import com.example.student.model.PendingTrip;
import com.example.student.repo.GuideQuotationRepo;
import com.example.student.repo.PendingTripRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class GuideQuotationService implements IGuideQuotationService {

    @Autowired
    private GuideQuotationRepo guideQuotationRepo;

    @Autowired
    private PendingTripRepo pendingTripRepo;

    @Override
    public GuideQuotation createGuideQuotation(GuideQuotation guideQuotation) {
        if (guideQuotation == null) {
            throw new IllegalArgumentException("GuideQuotation cannot be null");
        }

        // Set creation and update timestamps
        Date now = new Date();
        guideQuotation.setCreatedAt(now);
        guideQuotation.setUpdatedAt(now);

        // Set default status if not provided
        if (guideQuotation.getStatus() == null || guideQuotation.getStatus().trim().isEmpty()) {
            guideQuotation.setStatus("pending");
        }

        // Set quotation date if not provided
        if (guideQuotation.getQuotationDate() == null) {
            guideQuotation.setQuotationDate(now);
        }

        return guideQuotationRepo.save(guideQuotation);
    }

    @Override
    public GuideQuotation updateGuideQuotation(String quotationId, GuideQuotation guideQuotation) {
        if (quotationId == null || quotationId.trim().isEmpty()) {
            throw new IllegalArgumentException("Quotation ID cannot be null or empty");
        }

        if (guideQuotation == null) {
            throw new IllegalArgumentException("GuideQuotation cannot be null");
        }

        Optional<GuideQuotation> existingQuotation = guideQuotationRepo.findById(quotationId);
        if (existingQuotation.isPresent()) {
            GuideQuotation quotationToUpdate = existingQuotation.get();

            // Update fields if provided
            if (guideQuotation.getQuotedAmount() != null) {
                quotationToUpdate.setQuotedAmount(guideQuotation.getQuotedAmount());
            }
            if (guideQuotation.getQuotationNotes() != null) {
                quotationToUpdate.setQuotationNotes(guideQuotation.getQuotationNotes());
            }
            if (guideQuotation.getStatus() != null) {
                quotationToUpdate.setStatus(guideQuotation.getStatus());
            }
            if (guideQuotation.getQuotationDate() != null) {
                quotationToUpdate.setQuotationDate(guideQuotation.getQuotationDate());
            }

            // Always update the updatedAt timestamp
            quotationToUpdate.setUpdatedAt(new Date());

            return guideQuotationRepo.save(quotationToUpdate);
        }
        throw new RuntimeException("Guide quotation not found with id: " + quotationId);
    }

    @Override
    public List<GuideQuotation> getAllGuideQuotations() {
        return guideQuotationRepo.findAll();
    }

    @Override
    public Optional<GuideQuotation> getGuideQuotationById(String quotationId) {
        if (quotationId == null || quotationId.trim().isEmpty()) {
            throw new IllegalArgumentException("Quotation ID cannot be null or empty");
        }
        return guideQuotationRepo.findById(quotationId);
    }

    @Override
    public boolean deleteGuideQuotation(String quotationId) {
        if (quotationId == null || quotationId.trim().isEmpty()) {
            throw new IllegalArgumentException("Quotation ID cannot be null or empty");
        }

        if (guideQuotationRepo.existsById(quotationId)) {
            guideQuotationRepo.deleteById(quotationId);
            return true;
        }
        return false;
    }

    @Override
    public List<GuideQuotation> getQuotationsByPendingTripId(String pendingTripId) {

        System.out.println("getQuotationsByPendingTripIdcccccc: " + pendingTripId);

        if (pendingTripId == null || pendingTripId.trim().isEmpty()) {
            throw new IllegalArgumentException("Pending trip ID cannot be null or empty");
        }
        return guideQuotationRepo.findByPendingTripId(pendingTripId);
    }

    @Override
    public List<GuideQuotation> getQuotationsByGuideId(String guideId) {
        if (guideId == null || guideId.trim().isEmpty()) {
            throw new IllegalArgumentException("Guide ID cannot be null or empty");
        }
        return guideQuotationRepo.findByGuideId(guideId);
    }

    @Override
    public Optional<GuideQuotation> getQuotationByPendingTripIdAndGuideId(String pendingTripId, String guideId) {
        if (pendingTripId == null || pendingTripId.trim().isEmpty()) {
            throw new IllegalArgumentException("Pending trip ID cannot be null or empty");
        }
        if (guideId == null || guideId.trim().isEmpty()) {
            throw new IllegalArgumentException("Guide ID cannot be null or empty");
        }
        return guideQuotationRepo.findByPendingTripIdAndGuideId(pendingTripId, guideId);
    }

    @Override
    public List<GuideQuotation> getQuotationsByStatus(String status) {
        if (status == null || status.trim().isEmpty()) {
            throw new IllegalArgumentException("Status cannot be null or empty");
        }
        return guideQuotationRepo.findByStatus(status);
    }

    @Override
    public List<GuideQuotation> getQuotationsByGuideIdAndStatus(String guideId, String status) {
        if (guideId == null || guideId.trim().isEmpty()) {
            throw new IllegalArgumentException("Guide ID cannot be null or empty");
        }
        if (status == null || status.trim().isEmpty()) {
            throw new IllegalArgumentException("Status cannot be null or empty");
        }
        return guideQuotationRepo.findByGuideIdAndStatus(guideId, status);
    }

    @Override
    public GuideQuotation submitQuotation(String pendingTripId, String guideId, Double amount, String notes) {
        if (pendingTripId == null || pendingTripId.trim().isEmpty()) {
            throw new IllegalArgumentException("Pending trip ID cannot be null or empty");
        }
        if (guideId == null || guideId.trim().isEmpty()) {
            throw new IllegalArgumentException("Guide ID cannot be null or empty");
        }
        if (amount == null || amount <= 0) {
            throw new IllegalArgumentException("Amount must be greater than 0");
        }

        // Check if trip exists
        Optional<PendingTrip> trip = pendingTripRepo.findById(pendingTripId);
        if (trip.isEmpty()) {
            throw new RuntimeException("Pending trip not found with id: " + pendingTripId);
        }

        // Check if quotation already exists
        Optional<GuideQuotation> existingQuotation = getQuotationByPendingTripIdAndGuideId(pendingTripId, guideId);

        GuideQuotation quotation;
        if (existingQuotation.isPresent()) {
            // Update existing quotation
            quotation = existingQuotation.get();
            quotation.setQuotedAmount(amount);
            quotation.setQuotationNotes(notes);
            quotation.setQuotationDate(new Date());
            quotation.setStatus("pending");
            quotation.setUpdatedAt(new Date());
        } else {
            // Create new quotation
            quotation = new GuideQuotation(pendingTripId, guideId, amount, notes);
        }

        return guideQuotationRepo.save(quotation);
    }

    @Override
    public GuideQuotation updateQuotationStatus(String quotationId, String status) {
        if (quotationId == null || quotationId.trim().isEmpty()) {
            throw new IllegalArgumentException("Quotation ID cannot be null or empty");
        }
        if (status == null || status.trim().isEmpty()) {
            throw new IllegalArgumentException("Status cannot be null or empty");
        }

        Optional<GuideQuotation> existingQuotation = guideQuotationRepo.findById(quotationId);
        if (existingQuotation.isPresent()) {
            GuideQuotation quotation = existingQuotation.get();
            quotation.setStatus(status);
            quotation.setUpdatedAt(new Date());
            return guideQuotationRepo.save(quotation);
        }
        throw new RuntimeException("Guide quotation not found with id: " + quotationId);
    }

    @Override
    public List<PendingTrip> getUnsubmittedToursForGuide(String guideId) {
        if (guideId == null || guideId.trim().isEmpty()) {
            throw new IllegalArgumentException("Guide ID cannot be null or empty");
        }

        List<PendingTrip> allTrips = pendingTripRepo.findAll();
        List<GuideQuotation> guideQuotations = getQuotationsByGuideId(guideId);

        Set<String> quotedTripIds = guideQuotations.stream()
                .map(GuideQuotation::getPendingTripId)
                .collect(Collectors.toSet());

        return allTrips.stream()
                .filter(trip -> !quotedTripIds.contains(trip.getPtId()))
                .collect(Collectors.toList());
    }

    @Override
    public List<Map<String, Object>> getSubmittedQuotationsWithTourDetails(String guideId) {
        if (guideId == null || guideId.trim().isEmpty()) {
            throw new IllegalArgumentException("Guide ID cannot be null or empty");
        }

        List<GuideQuotation> quotations = getQuotationsByGuideId(guideId);
        List<Map<String, Object>> resultList = new ArrayList<>();

        for (GuideQuotation quotation : quotations) {
            String pendingTripId = quotation.getPendingTripId();
            if (pendingTripId == null || pendingTripId.trim().isEmpty()) {
                continue; // Skip quotations with invalid trip IDs
            }

            Optional<PendingTrip> tripOptional = pendingTripRepo.findById(pendingTripId);
            if (tripOptional.isPresent()) {
                PendingTrip trip = tripOptional.get();

                Map<String, Object> data = new HashMap<>();
                data.put("quotationId", quotation.get_id());
                data.put("guideId", quotation.getGuideId());
                data.put("tourId", trip.getPtId());
                data.put("tourDetails", trip);
                data.put("quotedAmount", quotation.getQuotedAmount());
                data.put("quotationNotes", quotation.getQuotationNotes());
                data.put("quotationDate", quotation.getQuotationDate());
                data.put("status", quotation.getStatus());
                data.put("createdAt", quotation.getCreatedAt());
                data.put("updatedAt", quotation.getUpdatedAt());

                resultList.add(data);
            }
        }

        return resultList;
    }

    @Override
    public GuideQuotation acceptQuotation(String quotationId) {
        return updateQuotationStatus(quotationId, "accepted");
    }

    @Override
    public GuideQuotation rejectQuotation(String quotationId, String reason) {
        if (quotationId == null || quotationId.trim().isEmpty()) {
            throw new IllegalArgumentException("Quotation ID cannot be null or empty");
        }

        Optional<GuideQuotation> existingQuotation = guideQuotationRepo.findById(quotationId);
        if (existingQuotation.isPresent()) {
            GuideQuotation quotation = existingQuotation.get();
            quotation.setStatus("rejected");
            quotation.setUpdatedAt(new Date());

            // Add rejection reason to notes
            String currentNotes = quotation.getQuotationNotes() != null ? quotation.getQuotationNotes() : "";
            quotation.setQuotationNotes(currentNotes + "\n[REJECTED] Reason: " + reason);

            return guideQuotationRepo.save(quotation);
        }
        throw new RuntimeException("Guide quotation not found with id: " + quotationId);
    }

    @Override
    public boolean hasGuideSubmittedQuotation(String pendingTripId, String guideId) {
        if (pendingTripId == null || pendingTripId.trim().isEmpty()) {
            throw new IllegalArgumentException("Pending trip ID cannot be null or empty");
        }
        if (guideId == null || guideId.trim().isEmpty()) {
            throw new IllegalArgumentException("Guide ID cannot be null or empty");
        }

        return getQuotationByPendingTripIdAndGuideId(pendingTripId, guideId).isPresent();
    }

    @Override
    public List<GuideQuotation> getPendingQuotationsForReview() {
        return getQuotationsByStatus("pending");
    }

    @Override
    public List<GuideQuotation> getAcceptedQuotations() {
        return getQuotationsByStatus("accepted");
    }

    @Override
    public List<GuideQuotation> getRejectedQuotations() {
        return getQuotationsByStatus("rejected");
    }

    @Override
    public List<GuideQuotation> getExpiredQuotations() {
        return getQuotationsByStatus("expired");
    }

    @Override
    public int markExpiredQuotations(int daysOld) {
        List<GuideQuotation> pendingQuotations = getPendingQuotationsForReview();
        int expiredCount = 0;

        Date cutoffDate = new Date(System.currentTimeMillis() - (daysOld * 24L * 60L * 60L * 1000L));

        for (GuideQuotation quotation : pendingQuotations) {
            if (quotation.getCreatedAt() != null && quotation.getCreatedAt().before(cutoffDate)) {
                quotation.setStatus("expired");
                quotation.setUpdatedAt(new Date());
                guideQuotationRepo.save(quotation);
                expiredCount++;
            }
        }

        return expiredCount;
    }

    @Override
    public Map<String, Object> getGuideQuotationStatistics(String guideId) {
        if (guideId == null || guideId.trim().isEmpty()) {
            throw new IllegalArgumentException("Guide ID cannot be null or empty");
        }

        List<GuideQuotation> allQuotations = getQuotationsByGuideId(guideId);

        Map<String, Object> statistics = new HashMap<>();
        statistics.put("totalQuotations", allQuotations.size());
        statistics.put("pendingQuotations", allQuotations.stream().filter(q -> "pending".equals(q.getStatus())).count());
        statistics.put("acceptedQuotations", allQuotations.stream().filter(q -> "accepted".equals(q.getStatus())).count());
        statistics.put("rejectedQuotations", allQuotations.stream().filter(q -> "rejected".equals(q.getStatus())).count());
        statistics.put("expiredQuotations", allQuotations.stream().filter(q -> "expired".equals(q.getStatus())).count());

        // Calculate average quoted amount
        OptionalDouble avgAmount = allQuotations.stream()
                .filter(q -> q.getQuotedAmount() != null)
                .mapToDouble(GuideQuotation::getQuotedAmount)
                .average();
        statistics.put("averageQuotedAmount", avgAmount.isPresent() ? avgAmount.getAsDouble() : 0.0);

        // Calculate total potential earnings (accepted quotations)
        double totalEarnings = allQuotations.stream()
                .filter(q -> "accepted".equals(q.getStatus()) && q.getQuotedAmount() != null)
                .mapToDouble(GuideQuotation::getQuotedAmount)
                .sum();
        statistics.put("totalPotentialEarnings", totalEarnings);

        return statistics;
    }

    @Override
    public Map<String, Object> getTripQuotationStatistics(String pendingTripId) {
        if (pendingTripId == null || pendingTripId.trim().isEmpty()) {
            throw new IllegalArgumentException("Pending trip ID cannot be null or empty");
        }

        List<GuideQuotation> tripQuotations = getQuotationsByPendingTripId(pendingTripId);

        Map<String, Object> statistics = new HashMap<>();
        statistics.put("totalQuotations", tripQuotations.size());
        statistics.put("pendingQuotations", tripQuotations.stream().filter(q -> "pending".equals(q.getStatus())).count());
        statistics.put("acceptedQuotations", tripQuotations.stream().filter(q -> "accepted".equals(q.getStatus())).count());
        statistics.put("rejectedQuotations", tripQuotations.stream().filter(q -> "rejected".equals(q.getStatus())).count());

        // Calculate price statistics
        OptionalDouble minAmount = tripQuotations.stream()
                .filter(q -> q.getQuotedAmount() != null)
                .mapToDouble(GuideQuotation::getQuotedAmount)
                .min();
        OptionalDouble maxAmount = tripQuotations.stream()
                .filter(q -> q.getQuotedAmount() != null)
                .mapToDouble(GuideQuotation::getQuotedAmount)
                .max();
        OptionalDouble avgAmount = tripQuotations.stream()
                .filter(q -> q.getQuotedAmount() != null)
                .mapToDouble(GuideQuotation::getQuotedAmount)
                .average();

        statistics.put("minQuotedAmount", minAmount.isPresent() ? minAmount.getAsDouble() : 0.0);
        statistics.put("maxQuotedAmount", maxAmount.isPresent() ? maxAmount.getAsDouble() : 0.0);
        statistics.put("averageQuotedAmount", avgAmount.isPresent() ? avgAmount.getAsDouble() : 0.0);

        return statistics;
    }
}