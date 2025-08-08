package com.example.student.repo;

import com.example.student.model.Booking;
import com.example.student.model.dto.Bookingdto;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepo extends MongoRepository<Booking, String> {

    @Query("{'travelerId': ?0}")
    List<Bookingdto> findByTravelerId(String travelerId);

    @Query("{'providerId': ?0}")
    List<Bookingdto> findByProviderId(String providerId);

    @Query("{'status': ?0}")
    List<Booking> findByStatus(String status);

    // PayHere specific method
    @Query("{'payHereOrderId': ?0}")
    Optional<Booking> findByPayHereOrderId(String orderId);

    @Query("{'cancellationDeadline': {$lt: ?0}, 'confirmationFeePaid': false, 'status': 'CONFIRMED'}")
    List<Booking> findBookingsNeedingConfirmationFeePayout(LocalDateTime currentTime);

    @Query("{'status': 'COMPLETED', 'finalPayoutPaid': false}")
    List<Booking> findBookingsNeedingFinalPayout();

    @Query("{'serviceStartDate': {$lt: ?0}, 'status': 'CONFIRMED'}")
    List<Booking> findBookingsToMarkInProgress(LocalDateTime currentTime);
}