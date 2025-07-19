package com.example.student.repo;

import com.example.student.model.Item;
import com.example.student.model.Store;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StoresRepo extends MongoRepository<Store,String> {

    Optional<Store> findById(String id);
    List<Store> findByNameContainingIgnoreCase(String keyword);

}
