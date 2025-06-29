// File: repo/UserRepository.java
package com.example.student.repo;

import com.example.student.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByEmail(String email);
    Optional<User> findByEmailAndIsActive(String email, boolean isActive);
    boolean existsByEmail(String email);
}