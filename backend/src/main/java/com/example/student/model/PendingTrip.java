package com.example.student.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDate;
import java.time.LocalTime;


@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "pending_trips")
public class PendingTrip {
    @Id
    private String ptId;

    @Field("title")
    private String title;

    @Field("start_location")
    private String startLocation;

    @Field("end_location")
    private String endLocation;

    @Field("number_of_seats")
    private Integer numberOfSeats;

    @Field("date")
    private LocalDate date;

    @Field("number_of_dates")
    private Integer numberOfDates;

    @Field("description_about_start_location")
    private String descriptionAboutStartLocation;

    @Field("pickup_time")
    private LocalTime pickupTime;

    @Field("path")
    private String path;
}