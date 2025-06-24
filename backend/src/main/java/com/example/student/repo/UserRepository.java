package com.example.travelsri.repo;

import com.example.travelsri.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface UserRepository extends MongoRepository<User, String> {

    Optional<User> findByEmail(String email);

    Boolean existsByEmail(String email);

    List<User> findByRole(String role);

    List<User> findByIsActive(boolean isActive);

    Optional<User> findByEmailAndIsActive(String email, boolean isActive);
}