package com.example.student.repo;

import com.example.student.model.RoomType;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface RoomTypeRepo extends MongoRepository<RoomType, String> {
}
