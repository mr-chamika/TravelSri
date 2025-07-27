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
@Document(collection = "guide_quotation")
public class GuideQuotation {
    @Id
    private String _id;
    private String tourId;//pendingTripId
    private String guideId;
    private Double quotedAmount;
    private String quotationNotes;
    private Date quotationDate;
    private String status; // "pending", "accepted", "rejected", "expired"
    private Date validUntil;//remv
    private Date createdAt;
    private Date updatedAt;

    // Default constructor
    public GuideQuotation() {
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }

    // Constructor with parameters
    public GuideQuotation(String tourId, String guideId, Double quotedAmount, String quotationNotes) {
        this.tourId = tourId;
        this.guideId = guideId;
        this.quotedAmount = quotedAmount;
        this.quotationNotes = quotationNotes;
        this.quotationDate = new Date();
        this.status = "pending";
        this.createdAt = new Date();
        this.updatedAt = new Date();

        // Set valid until date (e.g., 30 days from now)
        this.validUntil = new Date(System.currentTimeMillis() + (30L * 24 * 60 * 60 * 1000));
    }
}