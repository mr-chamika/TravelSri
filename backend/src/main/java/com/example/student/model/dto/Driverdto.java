package com.example.student.model.dto;

import lombok.Data;

@Data
public class Driverdto {

    private String _id;
    private String vehicleModel;
    private String catId;
    private int doors;
    private int seats;
    private String gearType;
    private String mileage;
    private String image;
    private String location;
    private int stars;
    private int reviewCount;
    private int dailyRatePrice;
    private int duration;

    public Driverdto(String _id, String vehicleModel, String catId, int doors, int seats, String gearType, String mileage, String image, String location, int stars, int reviewCount, int dailyRatePrice, int duration) {
        this._id = _id;
        this.vehicleModel = vehicleModel;
        this.catId = catId;
        this.doors = doors;
        this.seats = seats;
        this.gearType = gearType;
        this.mileage = mileage;
        this.image = image;
        this.location = location;
        this.stars = stars;
        this.reviewCount = reviewCount;
        this.dailyRatePrice = dailyRatePrice;
        this.duration = duration;
    }

}