package com.example.student.repo;

import com.example.student.model.Tour;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface tourRepo extends MongoRepository<Tour, String> {

}
