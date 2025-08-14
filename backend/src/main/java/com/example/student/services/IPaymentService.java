package com.example.student.services;

import com.example.student.model.Booking;
import com.example.student.model.dto.PayHereSessionResponse;
import com.example.student.model.dto.PayHereNotification;
import java.math.BigDecimal;
import java.util.Map;

/**
 * Complete IPaymentService interface with all required methods
 * Replace your existing IPaymentService with this complete version
 */
public interface IPaymentService {

    // ===== EXISTING METHODS IN YOUR IMPLEMENTATION =====

    /**
     * Create PayHere checkout session
     */
    PayHereSessionResponse createPayHereCheckout(String bookingId);

    /**
     * Handle payment notification from PayHere
     */
    void handlePaymentNotification(PayHereNotification notification);

    /**
     * Process full refund for a booking
     */
    void processFullRefund(Booking booking, String reason);

    /**
     * Process partial refund for a booking
     */
    void processPartialRefund(Booking booking, BigDecimal refundPercentage, String reason);

    /**
     * Schedule final payout to provider
     */
    void scheduleFinalPayout(Booking booking);

    /**
     * Process confirmation fee payout to provider
     */
    void processConfirmationFeePayout(Booking booking);

    /**
     * Get booking by PayHere order ID
     */
    Booking getBookingByOrderId(String orderId);

    /**
     * Get payment summary for a booking
     */
    Map<String, Object> getPaymentSummary(String bookingId);

    /**
     * Get service health status
     */
    Map<String, Object> getServiceHealth();

    // ===== MISSING METHOD THAT NEEDS TO BE ADDED =====

    /**
     * Process final payout to provider after service completion
     * (This method is missing from your implementation)
     */
    void processFinalPayout(Booking booking);
}