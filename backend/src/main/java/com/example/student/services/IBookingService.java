package com.example.student.services;

import com.example.student.model.Booking;
import com.example.student.model.dto.BookingRequest;
import com.example.student.model.dto.Bookingdto;

import java.util.List;
import java.util.Optional;

public interface IBookingService {

    // Existing booking operations
    Booking createBooking(BookingRequest request);
    Optional<Booking> getBookingById(String bookingId);
    List<Bookingdto> getBookingsByTraveler(String travelerId);
    List<Bookingdto> getBookingsByProvider(String providerId);
    Booking acceptBooking(String bookingId, String providerId);
    Booking rejectBooking(String bookingId, String providerId);
    Booking cancelBooking(String bookingId, String travelerId);
    Booking completeBooking(String bookingId);

    // NEW: PayHere integration methods
    Optional<Booking> getBookingByPayHereOrderId(String orderId);
    Booking updateBooking(Booking booking);
    Booking saveBooking(Booking booking);

    // NEW: Payment status methods
    List<Booking> getBookingsByPaymentStatus(String paymentStatus);
    List<Booking> getPendingPaymentBookings();
    List<Booking> getConfirmedBookings();

    // NEW: Provider payout methods
    List<Booking> getBookingsForConfirmationFeePayout();
    List<Booking> getBookingsForFinalPayout();
    Booking updateBookingPaymentStatus(String bookingId, String paymentStatus);

    // NEW: Booking statistics
    long countBookingsByStatus(String status);
    long countBookingsByPaymentStatus(String paymentStatus);
    List<Booking> getRecentBookings(int limit);

    // NEW: Search and filter methods
    List<Booking> getBookingsByStatus(String status);
    List<Booking> getBookingsByDateRange(String startDate, String endDate);
    List<Booking> getBookingsByAmountRange(Double minAmount, Double maxAmount);
}