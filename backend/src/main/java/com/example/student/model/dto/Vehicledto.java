package com.example.student.model.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Data
@Getter
@Setter
@Document(collection = "vehicles")
public class Vehicledto {

    @Id
    private String _id;
    private String image;
    private String firstName;
    private String lastName;
    private int stars;
    private String location;
    private double dailyRatePrice;
    private int driverAge;
    private String vehicleNumber;
    private String phone;
    private int reviewCount;
    private String vehicleModel;
    private String catId;
    private int doors;
    private int seats;
    private String gearType;
    private String mileage;
    private List<String> images;
    private List<String> whatsIncluded;
    private boolean ac;
    private List<String> languages;
    private String verified;
    private String experience;
    private String pp; // Profile Picture

    public Vehicledto(String _id, String image, String firstName, String lastName, int stars, String location, double dailyRatePrice, int driverAge, String vehicleNumber, String phone, int reviewCount, String vehicleModel, String catId, int doors, int seats, String gearType, String mileage, List<String> images, List<String> whatsIncluded, boolean ac, List<String> languages, String verified, String experience, String pp) {

        this._id = _id;
        this.image = image;
        this.firstName = firstName;
        this.lastName = lastName;
        this.stars = stars;
        this.location = location;
        this.dailyRatePrice = dailyRatePrice;
        this.driverAge = driverAge;
        this.vehicleNumber = vehicleNumber;
        this.phone = phone;
        this.reviewCount = reviewCount;
        this.vehicleModel = vehicleModel;
        this.catId = catId;
        this.doors = doors;
        this.seats = seats;
        this.gearType = gearType;
        this.mileage = mileage;
        this.images = images;
        this.whatsIncluded = whatsIncluded;
        this.ac = ac;
        this.languages = languages;
        this.verified = verified;
        this.experience = experience;
        this.pp = pp;






    }

}
