package com.example.student.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Getter
@Setter
@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@Document(collection = "vehicle_renter")
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
    private String languagesSpoken;
    private String lastName;
    private String licenseExpiryDate;
    private String licensePhoto;
    private String licensePhoto2;
    private String licenseYearsOfExperience;
    private String nicNumber;
    private String vehicleNumber;
    private List<String> images;
    private String vehicleLicenseCopy;
    private String vehicleModel;
    private String ac;
    private String fuelType;
    private String vehicleOwnerId;
    private String vehicleSeatingCapacity;
    private String catId;
    private String vehicleYearOfManufacture;
    private boolean gearType;//auto or manual
    private boolean perKm;
    private int perKmPrice;
    private boolean dailyRate;
    private int dailyRatePrice;
    private String verified;
    private String driverNicpic1;
    private String driverNicpic2;
}
