package com.example.student.repo;

import com.example.student.model.PaymentTransaction;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentTransactionRepo extends MongoRepository<PaymentTransaction, String> {

    @Query("{'bookingId': ?0}")
    List<PaymentTransaction> findByBookingId(String bookingId);

    @Query("{'mpgsOrderId': ?0}")
    List<PaymentTransaction> findByMpgsOrderId(String mpgsOrderId);

    @Query("{'type': ?0}")
    List<PaymentTransaction> findByType(String type);
}
