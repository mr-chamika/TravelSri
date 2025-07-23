package com.example.student.model;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "tvehicles")
public class TVehicle {
    @Id
    private String id;

    @Field("vehicle_type")
    private String vehicleType;

    @Field("brand")
    private String brand;

    @Field("model")
    private String model;

    @Field("year")
    private Integer year;

    @Field("registration_number")
    private String registrationNumber;

    @Field("seating_capacity")
    private Integer seatingCapacity;

    @Field("fuel_type")
    private String fuelType;

    @Field("rental_price_per_day")
    private Double rentalPricePerDay;

    @Field("phone_number")
    private String phoneNumber;

    @Field("email")
    private String email;

    @Field("base_city")
    private String baseCity;

    @Field("owner_name")
    private String ownerName;

    @Field("owner_phone_number")
    private String ownerPhoneNumber;

    @Field("owner_email")
    private String ownerEmail;

    @Field("owner_address")
    private String ownerAddress;
}
