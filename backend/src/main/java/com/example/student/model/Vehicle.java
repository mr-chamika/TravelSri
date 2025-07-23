package com.example.student.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Getter
@Setter
@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@Document(collection = "vehicles")
public class Vehicle {

    @Id
    private String _id;
    private String additionalComments;
    private String driverDateOfBirth;
    private String driverMobileNumber;
    private String drivingLicenseNumber;
    private String emergencyContact;
    private String firstName;
    private String gender;
    private String age;
    private String location;
    private String driverPhoto;
    private String insuranceDocument;
    private String languagesSpoken;
    private String lastName;
    private String licenseExpiryDate;
    private String licensePhoto;
    private String licenseYearsOfExperience;
    private String memberPlate;
    private String nicNumber;
    private String numberPlate;
    private String vehicleImage;
    private String vehicleLicenseCopy;
    private String vehicleModel;
    private String ac;
    private String fuelType;
    private String vehicleOwner;
    private String vehicleSeatingCapacity;
    private String vehicleType;
    private String vehicleYearOfManufacture;
}
