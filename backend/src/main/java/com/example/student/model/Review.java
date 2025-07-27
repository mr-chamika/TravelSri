package com.example.student.model;

import com.example.student.model.dto.ReviewGetdto;
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

    public Review(String serviceId, String text, String author, String country, String dp, int stars) {

this.serviceId = serviceId;
this.text = text;
this.author = author;
this.country = country;
this.dp = dp;
this.stars = stars;


    }

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
