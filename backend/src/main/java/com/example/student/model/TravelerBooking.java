package com.example.student.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "bookings")
public class TravelerBooking {

    @Id
    private String _id;
    private String userId;
    private String type;//hotel or guide or vehicle
    private String thumbnail;
    private String title;
    private String[] subtitle;//Deluxe room or Standard room like that booked rooms detail
    private String location;
    private String[] bookingDates;
    private int stars;
    private double ratings;
    private boolean paymentStatus;//
    private int guests;
    private String[] facilities;
    private int price;
    private String status;//booked,pending,cancelled
    private String mobileNumber;

}
