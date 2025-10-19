package com.example.student.model;

import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
@Document(collection = "notifications")
public class Notification {

    @Id
    private String _id;
    private String recipientId;
    private String senderId;
    private String message;
    private boolean isRead = false;
    private String link;//link to navigate when clicked
    private String type;//public or private

    @CreatedDate
    private Instant createdAt = Instant.now();



}
