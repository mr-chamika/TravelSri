package com.example.student.model;

import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Date;
import java.util.List;

@Document(collection = "upcoming_trips")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpcomingTrip {

    @Id
    private String id;

    // ========== TRIP BASIC INFORMATION (From PendingTrip) ==========

    @Field("original_pending_trip_id")
    private String originalPendingTripId; // Reference to original pending trip

    @Field("title")
    private String title;

    @Field("start_location")
    private String startLocation;

    @Field("end_location")
    private String endLocation;

    @Field("number_of_seats")
    private Integer numberOfSeats;

    @Field("date")
    private LocalDate date;

    @Field("number_of_dates")
    private Integer numberOfDates;

    @Field("description_about_start_location")
    private String descriptionAboutStartLocation;

    @Field("intermediate_places")
    private String intermediatePlaces;

    @Field("pickup_time")
    private LocalTime pickupTime;

    @Field("path")
    private String path;

    // ========== SELECTED SERVICE PROVIDERS ==========

    @Field("selected_guide_id")
    private String selectedGuideId;

    @Field("selected_vehicle_id")
    private String selectedVehicleId;

    @Field("selected_hotel_id")
    private String selectedHotelId;

    // ========== ACCOMMODATION DETAILS (From AccommodationQuotation) ==========

    @Field("selected_quotation_id")
    private String selectedQuotationId; // Reference to the selected accommodation quotation

    @Field("quote_number")
    private String quoteNumber; // The quotation number that was selected

    @Field("group_size")
    private Integer groupSize;

    @Field("check_in_date")
    private LocalDate checkInDate;

    @Field("check_out_date")
    private LocalDate checkOutDate;

    // Room allocations
    @Field("standard_rooms")
    private Integer standardRooms;

    @Field("delux_rooms")
    private Integer deluxRooms;

    @Field("family_rooms")
    private Integer familyRooms;

    @Field("suites")
    private Integer suites;

    @Field("meal_plan")
    private String mealPlan;

    @Field("special_requirements")
    private String specialRequirements;

    // ========== PRICING INFORMATION ==========

    // Hotel pricing
    @Field("accommodation_price_per_person")
    private Double accommodationPricePerPerson;

    @Field("meal_price_per_person")
    private Double mealPricePerPerson;

    @Field("hotel_total_amount")
    private Double hotelTotalAmount;

    @Field("hotel_discount_offered")
    private Double hotelDiscountOffered;

    @Field("hotel_final_amount")
    private Double hotelFinalAmount;

    // Vehicle pricing (add when you have vehicle quotations)
    @Field("vehicle_total_amount")
    private Double vehicleTotalAmount;

    @Field("vehicle_final_amount")
    private Double vehicleFinalAmount;

    // Guide pricing (add when you have guide quotations)
    @Field("guide_total_amount")
    private Double guideTotalAmount;

    @Field("guide_final_amount")
    private Double guideFinalAmount;

    // Overall trip pricing
    @Field("total_trip_cost")
    private Double totalTripCost; // Sum of all services

    @Field("total_price_per_person")
    private Double totalPricePerPerson;

    // ========== BOOKING AND STATUS INFORMATION ==========

    @Field("trip_status")
    private String tripStatus = "Confirmed"; // Confirmed, In Progress, Completed, Cancelled

    @Field("booking_status")
    private String bookingStatus = "Booked"; // Booked, Paid, Partially Paid

    @Field("payment_status")
    private String paymentStatus = "Pending"; // Pending, Paid, Partially Paid, Refunded

    @Field("confirmation_date")
    private LocalDateTime confirmationDate; // When the trip was confirmed

    @Field("payment_due_date")
    private LocalDate paymentDueDate;

    // ========== CUSTOMER INFORMATION ==========

    @Field("customer_id")
    private String customerId; // If you have customer management

    @Field("customer_name")
    private String customerName;

    @Field("customer_email")
    private String customerEmail;

    @Field("customer_phone")
    private String customerPhone;

    @Field("emergency_contact")
    private String emergencyContact;

    // ========== SERVICE PROVIDER INFORMATION ==========

    // Hotel information
    @Field("hotel_username")
    private String hotelUsername;

    @Field("hotel_contact_person")
    private String hotelContactPerson;

    @Field("hotel_contact_phone")
    private String hotelContactPhone;

    // Guide information
    @Field("guide_name")
    private String guideName;

    @Field("guide_contact")
    private String guideContact;

    // Vehicle information
    @Field("vehicle_driver_name")
    private String vehicleDriverName;

    @Field("vehicle_driver_contact")
    private String vehicleDriverContact;

    @Field("vehicle_registration_number")
    private String vehicleRegistrationNumber;

    // ========== ADDITIONAL TRIP DETAILS ==========

    @Field("itinerary")
    private List<String> itinerary; // Daily itinerary

    @Field("included_services")
    private List<String> includedServices; // What's included in the package

    @Field("excluded_services")
    private List<String> excludedServices; // What's not included

    @Field("terms_and_conditions")
    private String termsAndConditions;

    @Field("cancellation_policy")
    private String cancellationPolicy;

    // ========== ADMIN AND TRACKING FIELDS ==========

    @Field("created_by")
    private String createdBy; // Admin who confirmed the trip

    @Field("approved_by")
    private String approvedBy; // Admin who approved the final booking

    @Field("admin_notes")
    private String adminNotes;

    @Field("internal_notes")
    private String internalNotes; // Internal company notes

    // ========== AUDIT FIELDS ==========

    @CreatedDate
    @Field("created_at")
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Field("updated_at")
    private LocalDateTime updatedAt;

    @Field("confirmed_at")
    private LocalDateTime confirmedAt;

    @Field("completed_at")
    private LocalDateTime completedAt;

    // ========== HELPER METHODS ==========

    public Double calculateTotalTripCost() {
        double total = 0.0;

        // Hotel cost - try final amount first, then calculate from per-person rates
        if (hotelFinalAmount != null) {
            total += hotelFinalAmount;
            System.out.println("Added hotel final amount: " + hotelFinalAmount);
        } else if (accommodationPricePerPerson != null && mealPricePerPerson != null && groupSize != null) {
            double hotelCost = (accommodationPricePerPerson + mealPricePerPerson) * groupSize;
            total += hotelCost;
            System.out.println("Calculated hotel cost from per-person rates: " + hotelCost + 
                              " (accommodation: " + accommodationPricePerPerson + 
                              " + meal: " + mealPricePerPerson + 
                              " × group size: " + groupSize + ")");
        } else {
            System.out.println("No hotel cost data available");
        }

        // Vehicle cost - try final amount first, then quoted amount
        if (vehicleFinalAmount != null) {
            total += vehicleFinalAmount;
            System.out.println("Added vehicle final amount: " + vehicleFinalAmount);
        } else if (vehicleQuotedAmount != null) {
            total += vehicleQuotedAmount;
            System.out.println("Added vehicle quoted amount: " + vehicleQuotedAmount);
        } else {
            System.out.println("No vehicle cost data available");
        }

        // Guide cost - try final amount first, then quoted amount
        if (guideFinalAmount != null) {
            total += guideFinalAmount;
            System.out.println("Added guide final amount: " + guideFinalAmount);
        } else if (guideQuotedAmount != null) {
            total += guideQuotedAmount;
            System.out.println("Added guide quoted amount: " + guideQuotedAmount);
        } else {
            System.out.println("No guide cost data available");
        }

        System.out.println("Total calculated trip cost: " + total);
        return total;
    }

    public Double calculateTotalPricePerPerson() {
        if (groupSize != null && groupSize > 0) {
            Double totalCost = calculateTotalTripCost();
            Double pricePerPerson = totalCost / groupSize;
            System.out.println("Calculated price per person: " + pricePerPerson + 
                              " (total cost: " + totalCost + " ÷ group size: " + groupSize + ")");
            return pricePerPerson;
        } else {
            System.out.println("Cannot calculate price per person - invalid group size: " + groupSize);
            return 0.0;
        }
    }

    public boolean isPaymentComplete() {
        return "Paid".equals(paymentStatus);
    }

    public boolean isTripActive() {
        return "Confirmed".equals(tripStatus) || "In Progress".equals(tripStatus);
    }

    public boolean isTripCompleted() {
        return "Completed".equals(tripStatus);
    }

    // Calculate trip duration in days
    public long getTripDurationInDays() {
        if (checkInDate != null && checkOutDate != null) {
            return java.time.temporal.ChronoUnit.DAYS.between(checkInDate, checkOutDate);
        }
        return numberOfDates != null ? numberOfDates : 1;
    }

    // Vehicle quotation reference fields
    @Field("vehicle_quotation_id")
    private String vehicleQuotationId;

    @Field("vehicle_quoted_amount")
    private Double vehicleQuotedAmount;

    @Field("vehicle_quotation_notes")
    private String vehicleQuotationNotes;

    @Field("vehicle_quotation_date")
    private Date vehicleQuotationDate;

    @Field("vehicle_owner_id")
    private String vehicleOwnerId;

    // Guide quotation reference fields
    @Field("guide_quotation_id")
    private String guideQuotationId;

    @Field("guide_quoted_amount")
    private Double guideQuotedAmount;

    @Field("guide_quotation_notes")
    private String guideQuotationNotes;

    @Field("guide_quotation_date")
    private Date guideQuotationDate;

    // Hotel quotation reference fields (ensure these exist)
    @Field("hotel_quotation_id")
    private String hotelQuotationId;

    @Field("hotel_quote_number")
    private String hotelQuoteNumber;

    // ========== CANCELLATION DETAILS ==========

    @Field("cancellation_reason")
    private String cancellationReason;

    @Field("cancelled_at")
    private LocalDateTime cancelledAt;
}