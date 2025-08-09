package com.example.student.repo;

import com.example.student.model.BankTransfer;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BankTransferRepo extends MongoRepository<BankTransfer, String> {

    @Query("{'bookingId': ?0}")
    List<BankTransfer> findByBookingId(String bookingId);

    @Query("{'providerId': ?0}")
    List<BankTransfer> findByProviderId(String providerId);

    @Query("{'status': ?0}")
    List<BankTransfer> findByStatus(String status);
}