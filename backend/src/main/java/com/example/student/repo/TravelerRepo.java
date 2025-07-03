package com.example.student.repo;

import com.example.student.model.Traveler;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TravelerRepo extends MongoRepository<Traveler,String> {
    Optional<Traveler> findByEmail(String email);
}
