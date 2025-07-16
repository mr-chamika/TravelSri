package com.example.student.repo;

import com.example.student.model.Guide;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface GuideRepo extends MongoRepository<Guide, String> {

}
