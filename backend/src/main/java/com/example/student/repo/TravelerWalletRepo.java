package com.example.student.repo;

import com.example.student.model.TravelerWallet;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TravelerWalletRepo extends MongoRepository<TravelerWallet, String> {

    @Query("{'travelerId': ?0}")
    Optional<TravelerWallet> findByTravelerId(String travelerId);
}