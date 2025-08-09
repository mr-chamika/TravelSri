package com.example.student.services;

import com.example.student.model.Booking;
import com.example.student.model.dto.PayHereSessionResponse;
import com.example.student.model.dto.PayHereNotification;

import java.math.BigDecimal;
import java.util.Map;

public interface IPaymentService {
    PayHereSessionResponse createPayHereCheckout(String bookingId);
    void handlePaymentNotification(PayHereNotification notification);
    void processFullRefund(Booking booking, String reason);
    void processPartialRefund(Booking booking, BigDecimal refundPercentage, String reason);
    void scheduleFinalPayout(Booking booking);
    Booking getBookingByOrderId(String orderId);

    // ===== NEW METHODS FOR TESTING =====
    void processConfirmationFeePayout(Booking booking);
    Map<String, Object> getPaymentSummary(String bookingId);
    Map<String, Object> getServiceHealth();
}