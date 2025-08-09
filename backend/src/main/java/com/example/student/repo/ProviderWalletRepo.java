package com.example.student.repo;

import com.example.student.model.ProviderWallet;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProviderWalletRepo extends MongoRepository<ProviderWallet, String> {

    @Query("{'providerId': ?0}")
    Optional<ProviderWallet> findByProviderId(String providerId);

    @Query("{'availableBalance': {$gt: ?0}}")
    List<ProviderWallet> findByAvailableBalanceGreaterThan(BigDecimal minBalance);
}