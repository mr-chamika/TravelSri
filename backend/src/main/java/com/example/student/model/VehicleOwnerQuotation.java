package com.example.student.model;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Setter
@Getter
@Data
@Document(collection = "vehicle_quotation")
public class VehicleOwnerQuotation {
    @Id
    private String _id;
    private String pendingTripId;
    private String ownerId;
   private String vehicleId;
    private Double quotedAmount;
    private String quotationNotes;
    private Date quotationDate;
    private String status; // "pending", "accepted", "rejected", "expired"
    private Date createdAt;
    private Date updatedAt;

    // Default constructor
    public VehicleOwnerQuotation() {
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }

    // Constructor with parameters
    public VehicleOwnerQuotation(String pendingTripId, String ownerId, Double quotedAmount, String quotationNotes) {
        this.pendingTripId = pendingTripId;
        this.ownerId = ownerId;
        this.quotedAmount = quotedAmount;
        this.quotationNotes = quotationNotes;
        this.quotationDate = new Date();
        this.status = "pending";
        this.createdAt = new Date();
        this.updatedAt = new Date();

    }
}