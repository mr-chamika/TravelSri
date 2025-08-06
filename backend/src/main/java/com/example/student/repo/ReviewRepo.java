package com.example.student.repo;

import com.example.student.model.Review;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepo extends MongoRepository<Review,String> {

    List<Review> findByServiceId(String id);

}
