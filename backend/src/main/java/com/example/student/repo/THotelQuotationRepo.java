package com.example.student.repo;

import com.example.student.model.THotelQuotation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface THotelQuotationRepo extends MongoRepository<THotelQuotation, String> {

    // Find quotations by pending trip id
    @Query("{'pending_trip_id': ?0}")
    List<THotelQuotation> findByPendingTripId(String pendingTripId);

    // Find quotations by hotel id
    @Query("{'hotel_id': ?0}")
    List<THotelQuotation> findByHotelId(String hotelId);

    // Find quotations by pending trip id and hotel id
    @Query("{'pending_trip_id': ?0, 'hotel_id': ?1}")
    List<THotelQuotation> findByPendingTripIdAndHotelId(String pendingTripId, String hotelId);

    // Safety methods with validation
    default Optional<THotelQuotation> safeFindById(String quotationId) {
        if (quotationId == null || quotationId.trim().isEmpty()) {
            throw new IllegalArgumentException("Quotation ID cannot be null or empty");
        }
        return findById(quotationId);
    }

    default List<THotelQuotation> safeFindByPendingTripId(String pendingTripId) {
        if (pendingTripId == null || pendingTripId.trim().isEmpty()) {
            throw new IllegalArgumentException("Pending trip ID cannot be null or empty");
        }
        return findByPendingTripId(pendingTripId);
    }

    default List<THotelQuotation> safeFindByHotelId(String hotelId) {
        if (hotelId == null || hotelId.trim().isEmpty()) {
            throw new IllegalArgumentException("Hotel ID cannot be null or empty");
        }
        return findByHotelId(hotelId);
    }

    default List<THotelQuotation> safeFindByPendingTripIdAndHotelId(String pendingTripId, String hotelId) {
        if (pendingTripId == null || pendingTripId.trim().isEmpty()) {
            throw new IllegalArgumentException("Pending trip ID cannot be null or empty");
        }
        if (hotelId == null || hotelId.trim().isEmpty()) {
            throw new IllegalArgumentException("Hotel ID cannot be null or empty");
        }
        return findByPendingTripIdAndHotelId(pendingTripId, hotelId);
    }
}
