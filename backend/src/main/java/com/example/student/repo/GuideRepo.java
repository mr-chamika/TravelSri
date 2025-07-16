package com.example.student.repo;

import com.example.student.model.Tour;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface GuideRepo extends MongoRepository<Tour, String> {

}
