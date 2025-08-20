package com.example.student.repo;

import com.example.student.model.Notification;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface NotificationRepo extends MongoRepository<Notification,String> {

    @Query("{$and:[{$or:[{'recipientId': ?0},{recipientId: null}]},{'senderId':{$ne: ?0} }]}")
    List<Notification> findNotifications(String id);
}
