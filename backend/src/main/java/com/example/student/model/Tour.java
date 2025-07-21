package com.example.student.model;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;

@Setter
@Getter
@Data
@Document(collection = "tour_details")
public class Tour {
    @Id
    private String _id;
    private String tourTitle;
    private String destination;
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private Date startDate;
    private Date endDate;
    private int durationInDays;
    private int groupSize;
    private String description;
    private String guideId;
    private String vehicleOwnerId;
    private String status;
    private Date createdAt;

    // Quotation fields
    private Double quotedAmount;
    private String quotationNotes;
    private Date quotationDate;

    // Default constructor
    public Tour() {}

    // Constructor with parameters
    public Tour(String tourTitle, String destination, Date startDate, Date endDate,
                int durationInDays, int groupSize, Date createdAt) {
        this.tourTitle = tourTitle;
        this.destination = destination;
        this.startDate = startDate;
        this.endDate = endDate;
        this.durationInDays = durationInDays;
        this.groupSize = groupSize;
        this.createdAt = createdAt;
    }
}