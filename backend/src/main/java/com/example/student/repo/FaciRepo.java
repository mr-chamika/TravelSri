package com.example.student.repo;

import com.example.student.model.Faci;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FaciRepo extends MongoRepository<Faci,String> {
List<Faci> findByHotelIdContaining(String id);
}
