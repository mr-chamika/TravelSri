package com.example.student.repo;

import com.example.student.model.Notification;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface NotificationRepo extends MongoRepository<Notification,String> {
}
