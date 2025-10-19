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
@Document(collection = "unavailability_schedule")
public class UnavailabilitySchedule {
    @Id
    private String id;

    // User who owns this unavailability schedule
    private String userId;

    // Can be guide ID or vehicle provider ID
    private String providerId;

    // Type of provider: "guide" or "vehicle"
    private String providerType;

    private Date unavailableFromDate;
    private Date unavailableToDate;

    // Optional reason for unavailability
    private String unavailabilityReason;

    // Additional notes
    private String notes;

    // Status: "active", "cancelled", "expired"
    private String status;

    // ✅ Improved recurring logic
    // Whether this is a recurring unavailability
    private Boolean isRecurring;

    // For recurring unavailability - pattern details
    // Values: null, "weekly", "monthly", "yearly"
    private String recurrencePattern;

    // How many times to repeat (null = indefinite)
    private Integer recurrenceCount;

    // End date for recurring pattern (optional)
    private Date recurrenceEndDate;

    // Day of week for weekly recurrence (1-7, where 1=Monday)
    private Integer dayOfWeek;

    // Day of month for monthly recurrence (1-31)
    private Integer dayOfMonth;

    private Date createdAt;
    private Date updatedAt;

    // Default constructor
    public UnavailabilitySchedule() {
        this.createdAt = new Date();
        this.updatedAt = new Date();
        this.status = "active";
        this.isRecurring = false;
        this.recurrencePattern = null;
    }

    // Constructor with user ID (5 parameters)
    public UnavailabilitySchedule(String userId, String providerId, String providerType,
                                  Date unavailableFromDate, Date unavailableToDate) {
        this(); // Call default constructor
        this.userId = userId;
        this.providerId = providerId;
        this.providerType = providerType;
        this.unavailableFromDate = unavailableFromDate;
        this.unavailableToDate = unavailableToDate;
    }

    // Constructor with reason (6 parameters)
    public UnavailabilitySchedule(String userId, String providerId, String providerType,
                                  Date unavailableFromDate, Date unavailableToDate,
                                  String unavailabilityReason) {
        this(userId, providerId, providerType, unavailableFromDate, unavailableToDate);
        this.unavailabilityReason = unavailabilityReason;
    }

    // ✅ Constructor with recurring pattern
    public UnavailabilitySchedule(String userId, String providerId, String providerType,
                                  Date unavailableFromDate, Date unavailableToDate,
                                  String unavailabilityReason, String recurrencePattern,
                                  Integer recurrenceCount, Date recurrenceEndDate) {
        this(userId, providerId, providerType, unavailableFromDate, unavailableToDate, unavailabilityReason);

        if (recurrencePattern != null && !recurrencePattern.trim().isEmpty()) {
            this.isRecurring = true;
            this.recurrencePattern = recurrencePattern.toLowerCase();
            this.recurrenceCount = recurrenceCount;
            this.recurrenceEndDate = recurrenceEndDate;
        }
    }
}
