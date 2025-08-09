package com.example.student.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;



@Data
@Document(collection = "vehicles")
public class Vehicle {

    @Id
    private String _id;
    private String additionalComments;
    private String driverDateOfBirth;
    private String phone;
    private String drivingLicenseNumber;
    private String firstName;
    private String gender;
    private String driverAge;
    private String location;
    private String image;
    private String insuranceDocument;
    private String insuranceDocument2;
    private String lastName;
    private String licenseExpiryDate;
    private String licensePhoto;
    private String licensePhoto2;
    private String nicNumber;
    private String vehicleNumber;
    private String[] images;
    private String vehicleLicenseCopy;
    private String vehicleModel;
    private boolean ac;
    private String fuelType;
    private String vehicleOwnerId;
    private String catId;
    private String vehicleYearOfManufacture;
    private String gearType;//auto or manual or hybrid
    private boolean perKm;
    private int perKmPrice;
    private boolean dailyRate;
    private int dailyRatePrice;
    private String verified;
    private String driverNicpic1;
    private String driverNicpic2;

    private int doors;
    private int seats;
    private String mileage;
    private String[] whatsIncluded;
    private String[] languages;
    private int experience;
    private int stars;
    private int reviewCount;
    private int duration;
    private String pp;

}
