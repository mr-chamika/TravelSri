package com.example.student.model;

import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "tour_details")
public class Guide {
    private String id;
    private String tourTitle;
    private String destination;
    private String startDate;
    private String endDate;
    private int durationDays;
    private int groupSize;
    private String createdAt;
    private int quotation;

    // Default constructor
    public Guide() {}

    // Constructor with parameters
    public Guide(String tourTitle, String destination, String startDate, String endDate,
                 int durationDays, int groupSize, String createdAt, int quotation) {
        this.tourTitle = tourTitle;
        this.destination = destination;
        this.startDate = startDate;
        this.endDate = endDate;
        this.durationDays = durationDays;
        this.groupSize = groupSize;
        this.createdAt = createdAt;
        this.quotation = quotation;
    }

    // Getters and Setters only
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTourTitle() { return tourTitle; }
    public void setTourTitle(String tourTitle) { this.tourTitle = tourTitle; }

    public String getDestination() { return destination; }
    public void setDestination(String destination) { this.destination = destination; }

    public String getStartDate() { return startDate; }
    public void setStartDate(String startDate) { this.startDate = startDate; }

    public String getEndDate() { return endDate; }
    public void setEndDate(String endDate) { this.endDate = endDate; }

    public int getDurationDays() { return durationDays; }
    public void setDurationDays(int durationDays) { this.durationDays = durationDays; }

    public int getGroupSize() { return groupSize; }
    public void setGroupSize(int groupSize) { this.groupSize = groupSize; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }

    public int getQuotation() { return quotation; }
    public void setQuotation(int quotation) { this.quotation = quotation; }
}