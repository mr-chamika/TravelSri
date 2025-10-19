package com.example.student.services;

import com.example.student.model.UpcomingTrip;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public interface IUpcomingTripService {

    // Create upcoming trip
    UpcomingTrip createUpcomingTrip(UpcomingTrip upcomingTrip);

    // Update upcoming trip
    UpcomingTrip updateUpcomingTrip(String upcomingTripId, UpcomingTrip upcomingTrip);

    // Retrieve upcoming trip by ID
    Optional<UpcomingTrip> getUpcomingTripById(String upcomingTripId);

    // Delete upcoming trip by ID
    boolean deleteUpcomingTrip(String upcomingTripId);

    // Retrieve upcoming trip by original pending trip ID
    Optional<UpcomingTrip> getUpcomingTripByOriginalPendingTripId(String originalPendingTripId);

    // Get all upcoming trips
    List<UpcomingTrip> getAllUpcomingTrips();

    // Get upcoming trips by status
    List<UpcomingTrip> getUpcomingTripsByStatus(String tripStatus);

    // Get upcoming trips by payment status
    List<UpcomingTrip> getUpcomingTripsByPaymentStatus(String paymentStatus);

    // Get upcoming trips by customer ID
    List<UpcomingTrip> getUpcomingTripsByCustomerId(String customerId);

    // Get active upcoming trips
    List<UpcomingTrip> getActiveUpcomingTrips();

    // Get upcoming trips by date range
    List<UpcomingTrip> getUpcomingTripsByDateRange(LocalDate startDate, LocalDate endDate);

    // Check if upcoming trip exists for pending trip
    boolean existsByOriginalPendingTripId(String originalPendingTripId);

    // Update trip status
    UpcomingTrip updateTripStatus(String upcomingTripId, String newStatus);

    // Update payment status
    UpcomingTrip updatePaymentStatus(String upcomingTripId, String newPaymentStatus);

    // Calculate and update total costs
    UpcomingTrip calculateAndUpdateTotalCosts(String upcomingTripId);

    // Mark trip as completed
    UpcomingTrip markTripAsCompleted(String upcomingTripId);

    // Cancel upcoming trip
    UpcomingTrip cancelUpcomingTrip(String upcomingTripId, String reason);
}