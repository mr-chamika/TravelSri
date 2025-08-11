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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDateTime;
import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class PayHerePaymentServiceImpl implements IPaymentService {

    private static final Logger logger = LoggerFactory.getLogger(PayHerePaymentServiceImpl.class);

    @Autowired
    private BookingRepo bookingRepo;

    @Autowired
    private PaymentTransactionRepo paymentTransactionRepo;

    @Autowired
    private PayHereUtils payHereUtils;

    @Value("${payhere.merchant.id:1231576}")
    private String merchantId;

    @Value("${payhere.api.base-url:https://sandbox.payhere.lk/pay/checkout}")
    private String payHereBaseUrl;

    @Value("${app.base.url:http://localhost:3000}")
    private String appBaseUrl;

    public PaymentTransaction savePaymentTransaction(PaymentTransaction paymentTransaction) {
        try {
            if (paymentTransaction.getCreatedAt() == null) {
                paymentTransaction.setCreatedAt(LocalDateTime.now());
            }
            paymentTransaction.setUpdatedAt(LocalDateTime.now());
            return paymentTransactionRepo.save(paymentTransaction);
        } catch (Exception e) {
            logger.error("Error saving payment transaction", e);
            throw new RuntimeException("Failed to save payment transaction", e);
        }
    }

    public PaymentTransaction getPaymentByOrderId(String orderId) {
        try {
            List<PaymentTransaction> payments = paymentTransactionRepo.findByPayHereOrderId(orderId);
            return payments.isEmpty() ? null : payments.get(0);
        } catch (Exception e) {
            logger.error("Error finding payment by order ID: {}", orderId, e);
            return null;
        }
    }

    public PaymentTransaction getPaymentByBookingId(String bookingId) {
        try {
            List<PaymentTransaction> payments = paymentTransactionRepo.findByBookingId(bookingId);
            return payments.isEmpty() ? null : payments.get(0);
        } catch (Exception e) {
            logger.error("Error finding payment by booking ID: {}", bookingId, e);
            return null;
        }
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
            String hash = payHereUtils.generateHash(merchantId, orderId, booking.getTotalAmount(), booking.getCurrency());

            // Update booking with PayHere details
            booking.setPayHereOrderId(orderId);
            booking.setPaymentStatus("PENDING");
            booking.setStatus("PENDING_PAYMENT");
            booking.onUpdate(); // This will set updatedAt
            bookingRepo.save(booking);

            // Save payment transaction record
            PaymentTransaction paymentTransaction = new PaymentTransaction();
            paymentTransaction.setBookingId(bookingId);
            paymentTransaction.setPayHereOrderId(orderId);
            paymentTransaction.setAmount(booking.getTotalAmount());
            paymentTransaction.setCurrency(booking.getCurrency());
            paymentTransaction.setStatus("PENDING");
            paymentTransaction.setType("PAYMENT");
            paymentTransaction.setCreatedAt(LocalDateTime.now());
            paymentTransaction.setUpdatedAt(LocalDateTime.now());
            savePaymentTransaction(paymentTransaction);

            PayHereSessionResponse response = new PayHereSessionResponse();
            response.setOrderId(orderId);
            response.setStatus("created");
            response.setAmount(booking.getTotalAmount());
            response.setCurrency(booking.getCurrency());
            response.setHash(hash);

            logger.info("Payment Session Created - Order ID: {}, Amount: {}{}",
                    orderId, booking.getCurrency(), booking.getTotalAmount());

            return response;
        } catch (Exception e) {
            logger.error("Error creating PayHere checkout", e);
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
        url.append("&items=").append(booking.getServiceName() != null ? booking.getServiceName().replaceAll(" ", "%20") : "Guide%20Service");
        url.append("&currency=USD");
        url.append("&amount=").append(String.format("%.2f", booking.getTotalAmount()));
        url.append("&hash=").append(hash);

        return url.toString();
    }

    @Override
    public void handlePaymentNotification(PayHereNotification notification) {
        try {
            logger.info("Processing PayHere notification for order: {}", notification.getOrderId());

            // Find booking by order ID
            Optional<Booking> optBooking = bookingRepo.findByPayHereOrderId(notification.getOrderId());
            if (optBooking.isPresent()) {
                Booking booking = optBooking.get();

                // Update payment transaction
                PaymentTransaction payment = getPaymentByOrderId(notification.getOrderId());
                if (payment != null) {
                    payment.setPayHerePaymentId(notification.getPaymentId());
                    payment.setStatus(convertStatusCode(notification.getStatusCode()));
                    payment.setPayHereResponse(notification.toString());
                    payment.setUpdatedAt(LocalDateTime.now());
                    savePaymentTransaction(payment);
                }

                if ("2".equals(notification.getStatusCode())) { // SUCCESS
                    booking.setPayHerePaymentId(notification.getPaymentId());
                    booking.setPaymentStatus("SUCCESS");
                    booking.setStatus("PENDING_PROVIDER_ACCEPTANCE");
                    booking.onUpdate();
                    bookingRepo.save(booking);

                    logger.info("Payment successful for booking: {}", booking.getId());

                } else if ("-1".equals(notification.getStatusCode())) { // CANCELLED
                    booking.setPaymentStatus("FAILED");
                    booking.setStatus("CANCELLED_BY_TRAVELER");
                    booking.setCancellationReason("Payment cancelled by user");
                    booking.setCancellationType("TRAVELER_CANCELLED");
                    booking.onUpdate();
                    bookingRepo.save(booking);

                    logger.info("Payment cancelled for booking: {}", booking.getId());

                } else if ("0".equals(notification.getStatusCode())) { // PENDING
                    booking.setPaymentStatus("PENDING");
                    booking.setStatus("PENDING_PAYMENT");
                    booking.onUpdate();
                    bookingRepo.save(booking);

                    logger.info("Payment pending for booking: {}", booking.getId());
                }
            } else {
                logger.error("Booking not found for Order ID: {}", notification.getOrderId());
            }
        } catch (Exception e) {
            logger.error("Error handling payment notification", e);
            throw new RuntimeException("Error handling payment notification: " + e.getMessage());
        }
    }

    @Override
    public void processFullRefund(Booking booking, String reason) {
        try {
            logger.info("Processing full refund for booking: {}, Amount: {}{}",
                    booking.getId(), booking.getCurrency(), booking.getTotalAmount());

            // Update booking status
            booking.setPaymentStatus("REFUNDED");
            booking.setStatus("REFUNDED");
            booking.setTotalRefundAmount(booking.getTotalAmount());
            booking.setRefundedToTraveler(booking.getTotalAmount());
            booking.setCancellationReason(reason);
            booking.onUpdate();
            bookingRepo.save(booking);

            // Record refund transaction
            PaymentTransaction refundTransaction = new PaymentTransaction();
            refundTransaction.setBookingId(booking.getId());
            refundTransaction.setPayHereOrderId(booking.getPayHereOrderId());
            refundTransaction.setPayHerePaymentId(booking.getPayHerePaymentId());
            refundTransaction.setPayHereRefundId("REFUND-" + booking.getId() + "-" + System.currentTimeMillis());
            refundTransaction.setType("REFUND");
            refundTransaction.setAmount(booking.getTotalAmount());
            refundTransaction.setCurrency(booking.getCurrency());
            refundTransaction.setStatus("SUCCESS");
            refundTransaction.setReason(reason);
            refundTransaction.setCreatedAt(LocalDateTime.now());
            refundTransaction.setUpdatedAt(LocalDateTime.now());
            savePaymentTransaction(refundTransaction);

            logger.info("Full refund completed for booking: {}", booking.getId());

        } catch (Exception e) {
            logger.error("Error processing full refund", e);
            throw new RuntimeException("Error processing full refund: " + e.getMessage());
        }
    }

    @Override
    public void processPartialRefund(Booking booking, BigDecimal refundPercentage, String reason) {
        try {
            BigDecimal refundAmount = booking.getTotalAmount().multiply(refundPercentage);

            logger.info("Processing partial refund for booking: {}, Refund: {}{} ({}%)",
                    booking.getId(), booking.getCurrency(), refundAmount,
                    refundPercentage.multiply(BigDecimal.valueOf(100)));

            // Update booking status
            booking.setPaymentStatus("PARTIALLY_REFUNDED");
            booking.setStatus("CANCELLED_BY_TRAVELER");
            booking.setTotalRefundAmount(refundAmount);
            booking.setRefundedToTraveler(refundAmount);
            booking.setCancellationReason(reason);
            booking.setCancellationType("TRAVELER_CANCELLED");
            booking.onUpdate();
            bookingRepo.save(booking);

            // Record partial refund transaction
            PaymentTransaction refundTransaction = new PaymentTransaction();
            refundTransaction.setBookingId(booking.getId());
            refundTransaction.setPayHereOrderId(booking.getPayHereOrderId());
            refundTransaction.setPayHerePaymentId(booking.getPayHerePaymentId());
            refundTransaction.setPayHereRefundId("PARTIAL-REFUND-" + booking.getId() + "-" + System.currentTimeMillis());
            refundTransaction.setType("PARTIAL_REFUND");
            refundTransaction.setAmount(refundAmount);
            refundTransaction.setCurrency(booking.getCurrency());
            refundTransaction.setStatus("SUCCESS");
            refundTransaction.setReason(reason);
            refundTransaction.setCreatedAt(LocalDateTime.now());
            refundTransaction.setUpdatedAt(LocalDateTime.now());
            savePaymentTransaction(refundTransaction);

            logger.info("Partial refund completed for booking: {}", booking.getId());

        } catch (Exception e) {
            logger.error("Error processing partial refund", e);
            throw new RuntimeException("Error processing partial refund: " + e.getMessage());
        }
    }

    // Update the scheduleFinalPayout method:
    @Override
    public void scheduleFinalPayout(Booking booking) {
        try {
            BigDecimal finalPayoutAmount = booking.calculateFinalPayout(); // Use the new method

            logger.info("Processing final payout for booking: {}, Amount: {}{}",
                    booking.getId(), booking.getCurrency(), finalPayoutAmount);

            // Update booking payout status
            booking.setFinalPayoutPaid(true);
            booking.setFinalPayoutPaidAt(LocalDateTime.now());
            booking.onUpdate();
            bookingRepo.save(booking);

            // Record final payout transaction
            PaymentTransaction payoutTransaction = new PaymentTransaction();
            payoutTransaction.setBookingId(booking.getId());
            payoutTransaction.setPayHereOrderId(booking.getPayHereOrderId());
            payoutTransaction.setPayHerePaymentId(booking.getPayHerePaymentId());
            payoutTransaction.setType("FINAL_PAYOUT");
            payoutTransaction.setAmount(finalPayoutAmount);
            payoutTransaction.setCurrency(booking.getCurrency());
            payoutTransaction.setStatus("SUCCESS");
            payoutTransaction.setReason("final-payout-to-provider");
            payoutTransaction.setCreatedAt(LocalDateTime.now());
            payoutTransaction.setUpdatedAt(LocalDateTime.now());
            savePaymentTransaction(payoutTransaction);

            logger.info("Final payout completed for booking: {}", booking.getId());

        } catch (Exception e) {
            logger.error("Error scheduling final payout", e);
            throw new RuntimeException("Error scheduling final payout: " + e.getMessage());
        }
    }

//    @Override
//    public void scheduleFinalPayout(Booking booking) {
//        try {
//            BigDecimal finalPayoutAmount = booking.getTotalAmount().multiply(BigDecimal.valueOf(0.75)); // 75%
//
//            logger.info("Processing final payout for booking: {}, Amount: ${}", booking.getId(), finalPayoutAmount);
//
//            // Update booking payout status
//            booking.setFinalPayoutPaid(true);
//            booking.setFinalPayoutPaidAt(LocalDateTime.now());
//            bookingRepo.save(booking);
//
//            // Record final payout transaction
//            PaymentTransaction payoutTransaction = new PaymentTransaction();
//            payoutTransaction.setBookingId(booking.getId());
//            payoutTransaction.setPayHereOrderId(booking.getPayHereOrderId());
//            payoutTransaction.setPayHerePaymentId(booking.getPayHerePaymentId());
//            payoutTransaction.setType("FINAL_PAYOUT");
//            payoutTransaction.setAmount(finalPayoutAmount);
//            payoutTransaction.setCurrency("USD");
//            payoutTransaction.setStatus("SUCCESS");
//            payoutTransaction.setReason("final-payout-to-provider");
//            payoutTransaction.setCreatedAt(LocalDateTime.now());
//            payoutTransaction.setUpdatedAt(LocalDateTime.now());
//            savePaymentTransaction(payoutTransaction);
//
//            logger.info("Final payout completed for booking: {}", booking.getId());
//
//        } catch (Exception e) {
//            logger.error("Error scheduling final payout", e);
//            throw new RuntimeException("Error scheduling final payout: " + e.getMessage());
//        }
//    }

    @Override
    public Booking getBookingByOrderId(String orderId) {
        Optional<Booking> booking = bookingRepo.findByPayHereOrderId(orderId);
        return booking.orElse(null);
    }

    public Map<String, Object> getPaymentSummary(String bookingId) {
        try {
            Optional<Booking> optBooking = bookingRepo.findById(bookingId);
            if (!optBooking.isPresent()) {
                throw new RuntimeException("Booking not found");
            }

            Booking booking = optBooking.get();
            Map<String, Object> summary = new HashMap<>();

            // Booking details
            summary.put("bookingId", booking.getId());
            summary.put("totalAmount", booking.getTotalAmount());
            summary.put("paymentStatus", booking.getPaymentStatus());
            summary.put("bookingStatus", booking.getStatus());

            // Money flow details
            if (booking.getPlatformCommission() != null) {
                summary.put("platformCommission", booking.getPlatformCommission());
            }
            if (booking.getProviderConfirmationFee() != null) {
                summary.put("providerConfirmationFee", booking.getProviderConfirmationFee());
            }
            summary.put("providerFinalPayout", booking.getTotalAmount().multiply(BigDecimal.valueOf(0.75)));
            summary.put("confirmationFeePaid", booking.isConfirmationFeePaid());
            summary.put("finalPayoutPaid", booking.isFinalPayoutPaid());

            // Payment transactions
            List<PaymentTransaction> transactions = paymentTransactionRepo.findByBookingId(bookingId);
            summary.put("transactions", transactions);

            return summary;
        } catch (Exception e) {
            logger.error("Error getting payment summary", e);
            throw new RuntimeException("Error getting payment summary: " + e.getMessage());
        }
    }

    public boolean isPaymentCompleted(String bookingId) {
        try {
            PaymentTransaction payment = getPaymentByBookingId(bookingId);
            return payment != null && "SUCCESS".equals(payment.getStatus());
        } catch (Exception e) {
            logger.error("Error checking payment completion for booking: {}", bookingId, e);
            return false;
        }
    }

    public Map<String, Object> getServiceHealth() {
        Map<String, Object> health = new HashMap<>();
        health.put("paymentService", "HEALTHY");
        health.put("merchantId", merchantId);
        health.put("baseUrl", payHereBaseUrl);
        health.put("timestamp", LocalDateTime.now());
        return health;
    }

    private String convertStatusCode(String statusCode) {
        switch (statusCode) {
            case "2":
                return "SUCCESS";
            case "0":
                return "PENDING";
            case "-1":
                return "CANCELLED";
            case "-2":
                return "FAILED";
            case "-3":
                return "CHARGEDBACK";
            default:
                return "UNKNOWN";
        }
    }

    public void processConfirmationFeePayout(Booking booking) {
        try {
            BigDecimal confirmationFee = booking.calculateConfirmationFee(); // Use the new method

            logger.info("Processing confirmation fee payout for booking: {}, Amount: {}{}",
                    booking.getId(), booking.getCurrency(), confirmationFee);

            // Update booking confirmation fee status
            booking.setConfirmationFeePaid(true);
            booking.setConfirmationFeePaidAt(LocalDateTime.now());
            booking.onUpdate();
            bookingRepo.save(booking);

            // Record confirmation fee transaction
            PaymentTransaction payoutTransaction = new PaymentTransaction();
            payoutTransaction.setBookingId(booking.getId());
            payoutTransaction.setPayHereOrderId(booking.getPayHereOrderId());
            payoutTransaction.setPayHerePaymentId(booking.getPayHerePaymentId());
            payoutTransaction.setType("CONFIRMATION_FEE_PAYOUT");
            payoutTransaction.setAmount(confirmationFee);
            payoutTransaction.setCurrency(booking.getCurrency());
            payoutTransaction.setStatus("SUCCESS");
            payoutTransaction.setReason("confirmation-fee-after-20h");
            payoutTransaction.setCreatedAt(LocalDateTime.now());
            payoutTransaction.setUpdatedAt(LocalDateTime.now());
            savePaymentTransaction(payoutTransaction);

            logger.info("Confirmation fee payout completed for booking: {}", booking.getId());

        } catch (Exception e) {
            logger.error("Error processing confirmation fee payout", e);
            throw new RuntimeException("Error processing confirmation fee payout: " + e.getMessage());
        }
    }
}