package com.example.student.services;

import com.example.student.model.Booking;
import com.example.student.model.PaymentTransaction;
import com.example.student.model.dto.PayHereSessionResponse;
import com.example.student.model.dto.PayHereNotification;
import com.example.student.repo.BookingRepo;
import com.example.student.repo.PaymentTransactionRepo;
import com.example.student.utils.PayHereUtils;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;

import jakarta.annotation.PostConstruct;  // Fixed import
import java.time.LocalDateTime;
import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class PayHerePaymentServiceImpl implements IPaymentService {

    @Autowired
    private BookingRepo bookingRepo;

    @Autowired
    private PaymentTransactionRepo paymentTransactionRepo;

    @Autowired
    private PayHereUtils payHereUtils;

    @Value("${payhere.merchant.id}")
    private String merchantId;

    @Value("${payhere.api.base-url}")
    private String payHereBaseUrl;

    @Value("${app.base.url}")
    private String appBaseUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    @PostConstruct  // This annotation is now properly imported
    public void init() {
        System.out.println("PayHere Payment Service initialized");
        System.out.println("Merchant ID: " + merchantId);
        System.out.println("Base URL: " + payHereBaseUrl);
    }

    @Override
    public PayHereSessionResponse createPayHereCheckout(String bookingId) {
        try {
            Optional<Booking> optBooking = bookingRepo.findById(bookingId);
            if (!optBooking.isPresent()) {
                throw new RuntimeException("Booking not found");
            }

            Booking booking = optBooking.get();
            String orderId = "TRV-" + bookingId + "-" + System.currentTimeMillis();

            // Generate hash for security
            String hash = payHereUtils.generateHash(merchantId, orderId, booking.getTotalAmount(), "USD");

            // Build checkout URL with parameters
            String checkoutUrl = buildCheckoutUrl(booking, orderId, hash);

            // Update booking with PayHere details
            booking.setPayHereOrderId(orderId);
            booking.setPaymentStatus("PENDING");
            booking.setUpdatedAt(LocalDateTime.now());
            bookingRepo.save(booking);

            PayHereSessionResponse response = new PayHereSessionResponse();
            response.setOrderId(orderId);
            response.setCheckoutUrl(checkoutUrl);
            response.setStatus("created");
            response.setAmount(booking.getTotalAmount());
            response.setCurrency("USD");
            response.setHash(hash);

            return response;
        } catch (Exception e) {
            throw new RuntimeException("Error creating PayHere checkout: " + e.getMessage());
        }
    }

    private String buildCheckoutUrl(Booking booking, String orderId, String hash) {
        StringBuilder url = new StringBuilder(payHereBaseUrl);
        url.append("?merchant_id=").append(merchantId);
        url.append("&return_url=").append(appBaseUrl).append("/payment/success/").append(booking.getId());
        url.append("&cancel_url=").append(appBaseUrl).append("/payment/cancel/").append(booking.getId());
        url.append("&notify_url=").append(appBaseUrl).append("/api/payments/payhere/notify");
        url.append("&order_id=").append(orderId);
        url.append("&items=").append(booking.getServiceName().replaceAll(" ", "%20"));
        url.append("&currency=USD");
        url.append("&amount=").append(String.format("%.2f", booking.getTotalAmount()));
        url.append("&hash=").append(hash);

        return url.toString();
    }

    @Override
    public void handlePaymentNotification(PayHereNotification notification) {
        try {
//            // Verify notification hash for security
//            boolean isValid = payHereUtils.verifyNotificationHash(
//                    notification.getMerchantId(),
//                    notification.getOrderId(),
//                    notification.getAmount(),
//                    notification.getCurrency(),
//                    notification.getStatusCode(),
//                    notification.getMd5sig()
//            );
//
//            if (!isValid) {
//                throw new RuntimeException("Invalid notification hash");
//            }

            // Find booking by order ID
            Optional<Booking> optBooking = bookingRepo.findByPayHereOrderId(notification.getOrderId());
            if (optBooking.isPresent()) {
                Booking booking = optBooking.get();

                if ("2".equals(notification.getStatusCode())) { // Success
                    booking.setPayHerePaymentId(notification.getPaymentId());
                    booking.setPaymentStatus("SUCCESS");
                    booking.setStatus("PENDING_PROVIDER_ACCEPTANCE");
                    booking.setUpdatedAt(LocalDateTime.now());
                    bookingRepo.save(booking);

                    // Record successful transaction
                    recordTransaction(booking.getId(), notification.getOrderId(),
                            notification.getPaymentId(), null, "PAYMENT", booking.getTotalAmount(),
                            "SUCCESS", "initial-payment", notification.toString());

                } else if ("-1".equals(notification.getStatusCode())) { // Cancelled
                    booking.setPaymentStatus("FAILED");
                    booking.setStatus("PAYMENT_CANCELLED");
                    booking.setUpdatedAt(LocalDateTime.now());
                    bookingRepo.save(booking);

                } else if ("0".equals(notification.getStatusCode())) { // Pending
                    booking.setPaymentStatus("PENDING");
                    booking.setUpdatedAt(LocalDateTime.now());
                    bookingRepo.save(booking);
                }
            }
        } catch (Exception e) {
            throw new RuntimeException("Error handling payment notification: " + e.getMessage());
        }
    }

    @Override
    public void processFullRefund(Booking booking, String reason) {
        try {
            // PayHere refunds are typically processed through merchant portal
            // For API refunds, you would need to contact PayHere support or use their business API
            // Here we'll record the refund request and update status

            String refundId = "REFUND-" + booking.getId() + "-" + System.currentTimeMillis();

            booking.setPaymentStatus("FULLY_REFUNDED");
            booking.setStatus("REFUNDED");
            booking.setUpdatedAt(LocalDateTime.now());
            bookingRepo.save(booking);

            recordTransaction(booking.getId(), booking.getPayHereOrderId(),
                    booking.getPayHerePaymentId(), refundId, "REFUND", booking.getTotalAmount(),
                    "PENDING", reason, "Refund request submitted");

            // In production, you would call PayHere refund API or process manually
            // For now, we'll mark it as pending and handle manually

        } catch (Exception e) {
            throw new RuntimeException("Error processing full refund: " + e.getMessage());
        }
    }

    @Override
    public void processPartialRefund(Booking booking, BigDecimal refundPercentage, String reason) {
        try {
            BigDecimal refundAmount = booking.getTotalAmount().multiply(refundPercentage);
            String refundId = "PARTIAL-REFUND-" + booking.getId() + "-" + System.currentTimeMillis();

            booking.setPaymentStatus("PARTIALLY_REFUNDED");
            booking.setStatus("CANCELLED_BY_TRAVELER");
            booking.setUpdatedAt(LocalDateTime.now());
            bookingRepo.save(booking);

            recordTransaction(booking.getId(), booking.getPayHereOrderId(),
                    booking.getPayHerePaymentId(), refundId, "PARTIAL_REFUND", refundAmount,
                    "PENDING", reason, "Partial refund request submitted");

        } catch (Exception e) {
            throw new RuntimeException("Error processing partial refund: " + e.getMessage());
        }
    }

    @Override
    public void scheduleFinalPayout(Booking booking) {
        try {
            // Calculate final payout amount (75% of total - they already got 10%)
            BigDecimal finalPayoutAmount = booking.getTotalAmount().multiply(BigDecimal.valueOf(0.75));

            // In a real implementation, you would integrate with a payout system
            // For now, we'll just record that the payout is needed
            booking.setFinalPayoutPaid(true);
            booking.setFinalPayoutPaidAt(LocalDateTime.now());
            bookingRepo.save(booking);

            recordTransaction(booking.getId(), booking.getPayHereOrderId(),
                    booking.getPayHerePaymentId(), null, "FINAL_PAYOUT", finalPayoutAmount,
                    "PENDING", "final-payout-to-provider", null);
        } catch (Exception e) {
            throw new RuntimeException("Error scheduling final payout: " + e.getMessage());
        }
    }

    @Override
    public Booking getBookingByOrderId(String orderId) {
        Optional<Booking> booking = bookingRepo.findByPayHereOrderId(orderId);
        return booking.orElse(null);
    }

    private void recordTransaction(String bookingId, String orderId, String paymentId,
                                   String refundId, String type, BigDecimal amount, String status,
                                   String reason, String payHereResponse) {
        PaymentTransaction transaction = new PaymentTransaction();
        transaction.setBookingId(bookingId);
        transaction.setPayHereOrderId(orderId);
        transaction.setPayHerePaymentId(paymentId);
        transaction.setPayHereRefundId(refundId);
        transaction.setType(type);
        transaction.setAmount(amount);
        transaction.setCurrency("USD");
        transaction.setStatus(status);
        transaction.setReason(reason);
        transaction.setPayHereResponse(payHereResponse);
        transaction.setCreatedAt(LocalDateTime.now());
        transaction.setUpdatedAt(LocalDateTime.now());

        paymentTransactionRepo.save(transaction);
    }
}