package com.example.student.model;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;


@Setter
@Getter
@Data
@Document(collection = "reviews")
public class Review {

    @Id
    private String _id;
    private String serviceId;
    private String text;
    private String author;
    private String country;
    private String dp;
    private int stars;

    public Review() {
        System.out.println("Review model loaded - MongoDB connection should be active.");
    }
}
