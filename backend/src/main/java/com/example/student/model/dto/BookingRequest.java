package com.example.student.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.LocalDateTime;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class BookingRequest {
    // Existing fields
    private String travelerId;
    private String providerId;
    private String providerType; // "guide", "vehicle", "hotel"
    private String serviceName;
    private String serviceDescription;
    private LocalDateTime serviceStartDate;
    private LocalDateTime serviceEndDate;
    private BigDecimal totalAmount;

    // NEW: Additional fields for vehicle booking
    private String currency = "LKR"; // Default currency
    private String specialRequests;
    private Integer numberOfGuests;
    private String languagePreference;
    private String contactInformation;

    // NEW: Additional booking details that might be useful
    private String guideType; // For guide bookings: "visit", "travel"
    private String bookingType; // "solo", "group"
    private String paymentMethod;
    private String notes;

    // NEW: Vehicle-specific fields (optional, can be stored in specialRequests too)
    private String pickupLocation;
    private String dropoffLocation;
    private String pickupTime;
    private Boolean oneWayTrip;

    // NEW: Hotel-specific fields (optional)
    private Integer numberOfRooms;
    private Integer numberOfNights;
    private String roomType;

    // NEW: Guide-specific fields (optional)
    private String tourType;
    private String[] preferredLanguages;
}