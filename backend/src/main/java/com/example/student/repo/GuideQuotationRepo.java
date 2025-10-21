package com.example.student.repo;

import com.example.student.model.GuideQuotation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GuideQuotationRepo extends MongoRepository<GuideQuotation, String> {

    // Find quotations by tour ID
    @Query(
            value = "{ 'pendingTripId': ?0 }",
            fields = "{ '_id': 1, 'pendingTripId': 1, 'guideId': 1, 'quotedAmount': 1, 'quotationNotes': 1, 'quotationDate': 1, 'status': 1, 'createdAt': 1, 'updatedAt': 1 }"
    )
    List<GuideQuotation> findByPendingTripId(String pendingTripId);

    // Find quotations by guide ID
    List<GuideQuotation> findByGuideId(String guideId);


    // Find quotations by tour ID and guide ID
    Optional<GuideQuotation> findByPendingTripIdAndGuideId(String tourId, String guideId);

    // Find quotations by status
    List<GuideQuotation> findByStatus(String status);

    // Find quotations by guide ID and status
    List<GuideQuotation> findByGuideIdAndStatus(String guideId, String status);
}