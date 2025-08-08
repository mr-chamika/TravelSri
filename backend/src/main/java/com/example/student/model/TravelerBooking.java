package com.example.student.model;

import lombok.Data;
import org.springframework.data.annotation.Id;

@Data
public class TravelerBooking {

    @Id
    private String _id;
    private String type;//hotel or guide or vehicle
    private String thumbnail;
    private String title;
    private String[] rooms;//Deluxe room or Standard room like that booked rooms detail
    private String location;
    private String[] bookingDates;
    private int stars;
    private double ratings;
    private boolean paymentStatus;//
    private int guests;
    private String[] facilities;
    private int price;
    private String status;//booked,pending,cancelled

}
