package com.example.student.model;

import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Document(collection = "accommodation_quotations")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AccommodationQuotation {
    @Id
    private String id;
    private String quoteNumber; // Unique quotation number
    private String packageName;
    private String contactPersonName;
    private String contactEmail;
    private String contactPhone;
    private String accommodationType;
    private int groupSize;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private int roomsRequired;
    private String mealPlan;
    private boolean airportTransfer;
    private double discountOffered;
    private String specialRequirements;
    private double totalAmount;
    private double finalAmount;
    
    // Additional fields for status tracking
    private String status = "Pending"; // Default status: Pending, Approved, Rejected, Under Review
    private String adminNotes; // Notes from admin when approving/rejecting
    private String roomAvailability = "Available"; // Available, Limited, Unavailable
    
    // Audit fields
    @CreatedDate
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
}