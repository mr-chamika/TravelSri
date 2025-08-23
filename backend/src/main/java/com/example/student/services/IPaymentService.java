package com.example.student.services;

import com.example.student.model.Booking;
import com.example.student.model.PaymentTransaction;
import com.example.student.model.dto.PayHereSessionResponse;
import com.example.student.model.dto.PayHereNotification;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface IPaymentService {

    // ===== EXISTING METHODS =====

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
     * Process final payout to provider after service completion
     */
    void processFinalPayout(Booking booking);

    /**
     * Get booking by PayHere order ID
     */
    Booking getBookingByOrderId(String orderId);

    /**
     * Get payment summary for a booking
     */
    Map<String, Object> getPaymentSummary(String bookingId);

    // ===== NEW PAYMENT STATUS METHODS =====

    /**
     * Find payment transaction by order ID
     */
    Optional<PaymentTransaction> findByOrderId(String orderId);

    /**
     * Find payment transaction by booking ID
     */
    Optional<PaymentTransaction> findByBookingId(String bookingId);

    /**
     * Find all payment transactions for a booking ID
     */
    List<PaymentTransaction> findAllByBookingId(String bookingId);

    /**
     * Update payment status
     */
    void updatePaymentStatus(PaymentTransaction payment, String newStatus, String source, String transactionId);

    /**
     * Create or update payment transaction
     */
    PaymentTransaction createOrUpdatePaymentTransaction(
            String orderId,
            String bookingId,
            BigDecimal amount,
            String currency,
            String status,
            String paymentId,
            String transactionId
    );

    /**
     * Get total payment count (for health checks)
     */
    long getTotalPaymentCount();

    /**
     * Get service health information
     */
    Map<String, Object> getServiceHealth();

    /**
     * Find payments by status
     */
    List<PaymentTransaction> findByStatus(String status);

    /**
     * Find payments within date range
     */
    List<PaymentTransaction> findByDateRange(java.time.LocalDateTime startDate, java.time.LocalDateTime endDate);

    /**
     * Get payment statistics
     */
    Map<String, Object> getPaymentStatistics();

    /**
     * Check if payment exists for order ID
     */
    boolean existsByOrderId(String orderId);

    /**
     * Get latest payment for booking
     */
    Optional<PaymentTransaction> getLatestPaymentForBooking(String bookingId);

    /**
     * Mark payment as confirmed
     */
    void markPaymentAsConfirmed(String orderId, String paymentId, String transactionId);

    /**
     * Mark payment as failed
     */
    void markPaymentAsFailed(String orderId, String errorMessage);

    /**
     * Get pending payments older than specified minutes
     */
    List<PaymentTransaction> getPendingPaymentsOlderThan(int minutes);

    /**
     * Cleanup old failed payments
     */
    int cleanupOldFailedPayments(int daysOld);
}