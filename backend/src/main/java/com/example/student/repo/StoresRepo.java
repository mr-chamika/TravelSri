package com.example.student.repo;

import com.example.student.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StoresRepo extends MongoRepository<User,String> {

    @Query("{'_id': ?0, 'role': 'merchant'}")
    Optional<User> findById(String id);
    List<User> findByBusinessNameContainingIgnoreCase(String keyword);

    @Query("{'role': 'merchant'}")
    List<User> findAllShops();

}
