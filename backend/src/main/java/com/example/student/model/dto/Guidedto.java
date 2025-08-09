package com.example.student.model.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Data
@Document(collection = "users")
public class Guidedto {

    private String _id;
    private String firstName;
    private String lastName;
    private String experience;
    private String pp;
    private String username;
    private int stars;
    private int reviewCount;
    private int dailyRate;
    private String verified;
    private String identified;
    private List<String> specializations;
    private String location;
    private String bio;
    private String mobileNumber;
    private String responseTime;
    private String responseRate;
    private String description;


    public Guidedto(
            String _id,
            String firstName,
            String lastName,
            String experience,
            String pp,
            String username,
            int stars,
            int reviewCount,
            int dailyRate,
            String verified,
            String identified,
            List<String> specializations,
            String location,
            String bio,
            String mobileNumber,
            String responseTime,
            String responseRate,
            String description
    ) {

        this._id = _id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.experience = experience;
        this.pp = pp;
        this.username = username;
        this.stars = stars;
        this.reviewCount = reviewCount;
        this.dailyRate = dailyRate;
        this.verified = verified;
        this.identified = identified;
        this.specializations = specializations;
        this.location = location;
        this.bio = bio;
        this.mobileNumber = mobileNumber;
        this.responseTime = responseTime;
        this.responseRate = responseRate;
        this.description = description;

    }

}
