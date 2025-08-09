package com.example.student.repo;

import com.example.student.model.ProviderBankAccount;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProviderBankAccountRepo extends MongoRepository<ProviderBankAccount, String> {

    @Query("{'providerId': ?0, 'active': true}")
    Optional<ProviderBankAccount> findActiveByProviderId(String providerId);

    @Query("{'providerId': ?0}")
    List<ProviderBankAccount> findByProviderId(String providerId);

    @Query("{'verified': true, 'active': true}")
    List<ProviderBankAccount> findVerifiedAndActive();
}