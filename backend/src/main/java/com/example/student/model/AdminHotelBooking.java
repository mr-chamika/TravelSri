package com.example.student.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "AdminHotelBooking")

public class AdminHotelBooking {
    @Id
    private String id;
    private String guestName;
    private String guestEmail;
    private String roomType;
    private int roomNumber;
    private LocalDate checkIn;
    private LocalDate checkOut;
    private String status;
    private double totalCost;
}
