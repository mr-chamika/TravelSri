package com.example.student.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HotelAvailability {
    private String date;        // Date in YYYY-MM-DD format
    private String status;      // 'available', 'booked', or 'unavailable'
    private String reason;      // Reason for unavailability or booking
}
