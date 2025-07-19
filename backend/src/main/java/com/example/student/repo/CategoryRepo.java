package com.example.student.repo;

import com.example.student.model.Category;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepo extends MongoRepository<Category,String> {

}
