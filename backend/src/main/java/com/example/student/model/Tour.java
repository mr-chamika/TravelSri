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
@Document(collection = "pending_trips")
public class Tour {
    @Id
    private String _id;

    // Trip basic information
    private String title;
    private String start_location;
    private String end_location;
    private int number_of_seats;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private Date date;
    private int number_of_dates;

    // Trip details
    private String description_about_start_location;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private Date pickup_time;

    private String path;

    // System fields
    private String _class = "com.example.student.model.PendingTrip";

    // Assignment fields
    private String guideId;
    private String vehicleOwnerId;
    private String status;
    private Date createdAt;

    // Quotation fields
    private Double quotedAmount;
    private String quotationNotes;
    private Date quotationDate;

    // Backwards compatibility fields (optional - can be removed if not needed)
    private String tourTitle; // Can map to title
    private String destination; // Can map to start_location + " to " + end_location
    private Date startDate; // Can map to date
    private Date endDate; // Can be calculated from date + number_of_dates
    private int durationInDays; // Can map to number_of_dates
    private int groupSize; // Can map to number_of_seats
    private String description; // Can map to description_about_start_location

    // Default constructor
    public Tour() {
        this._class = "com.example.student.model.PendingTrip";
    }

    // Constructor with new structure parameters
    public Tour(String title, String start_location, String end_location,
                int number_of_seats, Date date, int number_of_dates,
                String description_about_start_location, Date pickup_time, String path) {
        this.title = title;
        this.start_location = start_location;
        this.end_location = end_location;
        this.number_of_seats = number_of_seats;
        this.date = date;
        this.number_of_dates = number_of_dates;
        this.description_about_start_location = description_about_start_location;
        this.pickup_time = pickup_time;
        this.path = path;
        this._class = "com.example.student.model.PendingTrip";
        this.createdAt = new Date();
        this.status = "pending";
    }

    // Legacy constructor for backwards compatibility
    public Tour(String tourTitle, String destination, Date startDate, Date endDate,
                int durationInDays, int groupSize, Date createdAt) {
        this.tourTitle = tourTitle;
        this.title = tourTitle; // Map to new field
        this.destination = destination;
        this.startDate = startDate;
        this.date = startDate; // Map to new field
        this.endDate = endDate;
        this.durationInDays = durationInDays;
        this.number_of_dates = durationInDays; // Map to new field
        this.groupSize = groupSize;
        this.number_of_seats = groupSize; // Map to new field
        this.createdAt = createdAt;
        this._class = "com.example.student.model.PendingTrip";

        // Extract start and end locations from destination if possible
        if (destination != null && destination.contains(" to ")) {
            String[] locations = destination.split(" to ");
            if (locations.length == 2) {
                this.start_location = locations[0].trim();
                this.end_location = locations[1].trim();
            }
        }
    }

    // Convenience methods for data mapping
    public String getDestination() {
        if (destination != null) {
            return destination;
        }
        if (start_location != null && end_location != null) {
            return start_location + " to " + end_location;
        }
        return null;
    }

    public void setDestination(String destination) {
        this.destination = destination;
        // Also try to extract start and end locations
        if (destination != null && destination.contains(" to ")) {
            String[] locations = destination.split(" to ");
            if (locations.length == 2) {
                this.start_location = locations[0].trim();
                this.end_location = locations[1].trim();
            }
        }
    }

    public Date getStartDate() {
        return startDate != null ? startDate : date;
    }

    public void setStartDate(Date startDate) {
        this.startDate = startDate;
        this.date = startDate;
    }

    public Date getEndDate() {
        if (endDate != null) {
            return endDate;
        }
        if (date != null && number_of_dates > 0) {
            Date calculatedEndDate = new Date(date.getTime());
            calculatedEndDate.setDate(calculatedEndDate.getDate() + (number_of_dates - 1));
            return calculatedEndDate;
        }
        return null;
    }

    public void setEndDate(Date endDate) {
        this.endDate = endDate;
        // Calculate number_of_dates if both dates are available
        if (date != null && endDate != null) {
            long diffInMillies = endDate.getTime() - date.getTime();
            long diffInDays = diffInMillies / (1000 * 60 * 60 * 24);
            this.number_of_dates = (int) diffInDays + 1;
            this.durationInDays = this.number_of_dates;
        }
    }

    public int getDurationInDays() {
        return durationInDays > 0 ? durationInDays : number_of_dates;
    }

    public void setDurationInDays(int durationInDays) {
        this.durationInDays = durationInDays;
        this.number_of_dates = durationInDays;
    }

    public int getGroupSize() {
        return groupSize > 0 ? groupSize : number_of_seats;
    }

    public void setGroupSize(int groupSize) {
        this.groupSize = groupSize;
        this.number_of_seats = groupSize;
    }

    public String getTourTitle() {
        return tourTitle != null ? tourTitle : title;
    }

    public void setTourTitle(String tourTitle) {
        this.tourTitle = tourTitle;
        this.title = tourTitle;
    }

    public String getDescription() {
        return description != null ? description : description_about_start_location;
    }

    public void setDescription(String description) {
        this.description = description;
        this.description_about_start_location = description;
    }

    // Helper method to check if this is a quoted tour
    public boolean isQuoted() {
        return quotedAmount != null && quotedAmount > 0;
    }

    // Helper method to get formatted quotation info
    public String getQuotationInfo() {
        if (isQuoted()) {
            return String.format("LKR %.2f - %s", quotedAmount,
                    quotationNotes != null ? quotationNotes : "No notes");
        }
        return "No quotation submitted";
    }

    @Override
    public String toString() {
        return "Tour{" +
                "_id='" + _id + '\'' +
                ", title='" + title + '\'' +
                ", start_location='" + start_location + '\'' +
                ", end_location='" + end_location + '\'' +
                ", number_of_seats=" + number_of_seats +
                ", date=" + date +
                ", number_of_dates=" + number_of_dates +
                ", path='" + path + '\'' +
                ", status='" + status + '\'' +
                ", quotedAmount=" + quotedAmount +
                '}';
    }
}