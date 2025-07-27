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
@Document(collection = "vehicle_renter")
public class Vehicle {

    @Id
    private String _id;
    private String additionalComments;
    private String driverDateOfBirth;
    private String driverMobileNumber;//phone
    private String drivingLicenseNumber;
    private String emergencyContact;//remv
    private String firstName;
    private String gender;
    private String age;//driverAge
    private String location;
    private String driverPhoto;//image
    private String insuranceDocument;
    //private String insuranceDocument2;
    private String languagesSpoken;
    private String lastName;
    private String licenseExpiryDate;
    private String licensePhoto;
    //private String licensePhoto2;
    private String licenseYearsOfExperience;
    private String nicNumber;
    private String numberPlate;//vehicleNumber
    private String vehicleImage;// images
    private String vehicleLicenseCopy;
    private String vehicleModel;
    private String ac;
    private String fuelType;
    private String vehicleOwner;//id
    private String vehicleSeatingCapacity;
    private String vehicleType;//catId
    private String vehicleYearOfManufacture;
}//auto or manual
//daily(chek bx,input)
//perkm(chek bx,input)boolean
//private String location;
//private String verified;
//nic1
//nic2
//private int stars;

