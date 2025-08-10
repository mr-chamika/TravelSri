package com.example.student.repo;

import com.example.student.model.PayHereRefund;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PayHereRefundRepo extends MongoRepository<PayHereRefund, String> {

    @Query("{'bookingId': ?0}")
    List<PayHereRefund> findByBookingId(String bookingId);

    @Query("{'travelerId': ?0}")
    List<PayHereRefund> findByTravelerId(String travelerId);

    @Query("{'originalPaymentId': ?0}")
    Optional<PayHereRefund> findByOriginalPaymentId(String paymentId);
}