package com.example.student.repo;

import com.example.student.model.GuideQuotation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TGuideQuotationRepo extends MongoRepository<GuideQuotation, String> {

    // Find quotations by pending trip id
    @Query("{'pending_trip_id': ?0}")
    List<GuideQuotation> findByPendingTripId(String pendingTripId);

    // Find quotations by guide id
    @Query("{'guide_id': ?0}")
    List<GuideQuotation> findByGuideId(String guideId);

    // Find quotations by pending trip id and guide id
    @Query("{'pending_trip_id': ?0, 'guide_id': ?1}")
    List<GuideQuotation> findByPendingTripIdAndGuideId(String pendingTripId, String guideId);

    // Safety methods with validation
    default Optional<GuideQuotation> safeFindById(String quotationId) {
        if (quotationId == null || quotationId.trim().isEmpty()) {
            throw new IllegalArgumentException("Quotation ID cannot be null or empty");
        }
        return findById(quotationId);
    }

    default List<GuideQuotation> safeFindByPendingTripId(String pendingTripId) {
        if (pendingTripId == null || pendingTripId.trim().isEmpty()) {
            throw new IllegalArgumentException("Pending trip ID cannot be null or empty");
        }
        return findByPendingTripId(pendingTripId);
    }

    default List<GuideQuotation> safeFindByGuideId(String guideId) {
        if (guideId == null || guideId.trim().isEmpty()) {
            throw new IllegalArgumentException("Guide ID cannot be null or empty");
        }
        return findByGuideId(guideId);
    }

    default List<GuideQuotation> safeFindByPendingTripIdAndGuideId(String pendingTripId, String guideId) {
        if (pendingTripId == null || pendingTripId.trim().isEmpty()) {
            throw new IllegalArgumentException("Pending trip ID cannot be null or empty");
        }
        if (guideId == null || guideId.trim().isEmpty()) {
            throw new IllegalArgumentException("Guide ID cannot be null or empty");
        }
        return findByPendingTripIdAndGuideId(pendingTripId, guideId);
    }
}
