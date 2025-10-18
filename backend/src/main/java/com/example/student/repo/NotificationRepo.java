package com.example.student.repo;

import com.example.student.model.Notification;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface NotificationRepo extends MongoRepository<Notification,String> {

    @Query("{$and:[{$or:[{'recipientId': ?0},{'type': 'public'},{'type': ?1}]},{'senderId':{$ne: ?0} }]}")
    List<Notification> findNotifications(String id,String role);
}
