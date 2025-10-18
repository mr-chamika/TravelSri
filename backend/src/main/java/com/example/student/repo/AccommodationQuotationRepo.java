package com.example.student.repo;

import com.example.student.model.AccommodationQuotation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface AccommodationQuotationRepo extends MongoRepository<AccommodationQuotation, String> {

    AccommodationQuotation findByQuoteNumber(String quoteNumber);

    //Tharusha Samarawickrama

    @Query("{'pendingTripId': ?0}")
    List<AccommodationQuotation> findByPendingTripId(String pendingTripId);

    default List<AccommodationQuotation> safeFindByPendingTripId(String pendingTripId) {
        if (pendingTripId == null || pendingTripId.trim().isEmpty()) {
            throw new IllegalArgumentException("Pending trip ID cannot be null or empty");
        }
        return findByPendingTripId(pendingTripId);
    }
}