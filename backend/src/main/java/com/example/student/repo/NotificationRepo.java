package com.example.student.repo;

import com.example.student.model.Notification;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface NotificationRepo extends MongoRepository<Notification,String> {
    List<Notification> findByRecipientId(String id);
}
