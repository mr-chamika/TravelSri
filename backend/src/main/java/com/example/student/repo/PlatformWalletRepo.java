package com.example.student.repo;

import com.example.student.model.PlatformWallet;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PlatformWalletRepo extends MongoRepository<PlatformWallet, String> {
    Optional<PlatformWallet> findFirstByOrderByLastUpdatedDesc();
}


