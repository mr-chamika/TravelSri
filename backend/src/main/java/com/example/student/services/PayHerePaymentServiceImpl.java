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

    @Value("${app.base.url:http://localhost:8080}")
    private String appBaseUrl;

    @Value("${payhere.sandbox:true}")
    private boolean sandboxMode;

    /**
     * Save payment transaction with proper error handling
     */
    public PaymentTransaction savePaymentTransaction(PaymentTransaction paymentTransaction) {
        try {
            if (paymentTransaction.getCreatedAt() == null) {
                paymentTransaction.setCreatedAt(LocalDateTime.now());
            }
            paymentTransaction.setUpdatedAt(LocalDateTime.now());

            PaymentTransaction saved = paymentTransactionRepo.save(paymentTransaction);
            logger.info("Payment transaction saved successfully: {}", saved.getPayHereOrderId());
            return saved;

        } catch (Exception e) {
            logger.error("Error saving payment transaction for order: {}",
                    paymentTransaction.getPayHereOrderId(), e);
            throw new RuntimeException("Failed to save payment transaction", e);
        }
    }

    /**
     * Get payment by order ID with improved error handling
     */
    public PaymentTransaction getPaymentByOrderId(String orderId) {
        try {
            if (orderId == null || orderId.trim().isEmpty()) {
                logger.warn("Order ID is null or empty");
                return null;
            }

            List<PaymentTransaction> payments = paymentTransactionRepo.findByPayHereOrderId(orderId);
            if (payments.isEmpty()) {
                logger.info("No payment found for order ID: {}", orderId);
                return null;
            }

            if (payments.size() > 1) {
                logger.warn("Multiple payments found for order ID: {}. Returning the first one.", orderId);
            }

            return payments.get(0);

        } catch (Exception e) {
            logger.error("Error finding payment by order ID: {}", orderId, e);
            return null;
        }
    }

    /**
     * Get payment by booking ID with improved error handling
     */
    public PaymentTransaction getPaymentByBookingId(String bookingId) {
        try {
            if (bookingId == null || bookingId.trim().isEmpty()) {
                logger.warn("Booking ID is null or empty");
                return null;
            }

            List<PaymentTransaction> payments = paymentTransactionRepo.findByBookingId(bookingId);
            if (payments.isEmpty()) {
                logger.info("No payment found for booking ID: {}", bookingId);
                return null;
            }

            // Return the most recent payment transaction
            return payments.stream()
                    .filter(p -> "PAYMENT".equals(p.getType()) || "SUCCESS".equals(p.getStatus()))
                    .findFirst()
                    .orElse(payments.get(0));

        } catch (Exception e) {
            logger.error("Error finding payment by booking ID: {}", bookingId, e);
            return null;
        }
    }

    /**
     * Create PayHere checkout using simplified PayHereUtils
     */
    @Override
    public PayHereSessionResponse createPayHereCheckout(String bookingId) {
        try {
            logger.info("Creating PayHere checkout for booking: {}", bookingId);

            // Get booking details
            Optional<Booking> optBooking = bookingRepo.findById(bookingId);
            if (!optBooking.isPresent()) {
                logger.error("Booking not found: {}", bookingId);
                throw new RuntimeException("Booking not found");
            }

            Booking booking = optBooking.get();

            // Validate booking amount
            if (!payHereUtils.isValidAmount(booking.getTotalAmount())) {
                logger.error("Invalid booking amount: {}", booking.getTotalAmount());
                throw new RuntimeException("Invalid booking amount");
            }

            // Generate unique order ID using PayHereUtils
            String orderId = payHereUtils.generateOrderId();
            logger.info("Generated order ID: {}", orderId);

            // Generate hash using simplified PayHereUtils
            String hash = payHereUtils.generateHash(orderId, booking.getTotalAmount(),
                    booking.getCurrency() != null ? booking.getCurrency() : "LKR");

            // Update booking with PayHere details
            booking.setPayHereOrderId(orderId);
            booking.setPaymentStatus("PENDING");
            booking.setStatus("PENDING_PAYMENT");
            booking.onUpdate();
            bookingRepo.save(booking);
            logger.info("Updated booking status to PENDING_PAYMENT");

            // Save payment transaction record
            PaymentTransaction paymentTransaction = new PaymentTransaction();
            paymentTransaction.setBookingId(bookingId);
            paymentTransaction.setPayHereOrderId(orderId);
            paymentTransaction.setAmount(booking.getTotalAmount());
            paymentTransaction.setCurrency(booking.getCurrency() != null ? booking.getCurrency() : "LKR");
            paymentTransaction.setStatus("PENDING");
            paymentTransaction.setType("PAYMENT");
            paymentTransaction.setCreatedAt(LocalDateTime.now());
            paymentTransaction.setUpdatedAt(LocalDateTime.now());

            savePaymentTransaction(paymentTransaction);
            logger.info("Payment transaction created and saved");

            // Log payment attempt using PayHereUtils
            payHereUtils.logPaymentAttempt(orderId, booking.getTotalAmount(), "customer@example.com");

            // Create response
            PayHereSessionResponse response = new PayHereSessionResponse();
            response.setOrderId(orderId);
            response.setStatus("created");
            response.setAmount(booking.getTotalAmount());
            response.setCurrency(booking.getCurrency() != null ? booking.getCurrency() : "LKR");
            response.setHash(hash);

            logger.info("PayHere checkout session created successfully - Order ID: {}, Amount: {}{}",
                    orderId, response.getCurrency(), response.getAmount());

            return response;

        } catch (Exception e) {
            logger.error("Error creating PayHere checkout for booking: {}", bookingId, e);
            throw new RuntimeException("Error creating PayHere checkout: " + e.getMessage());
        }
    }

    /**
     * Handle payment notification using simplified PayHereUtils
     */
    @Override
    public void handlePaymentNotification(PayHereNotification notification) {
        try {
            logger.info("Processing PayHere notification for order: {}", notification.getOrderId());

            // Convert notification to map format for PayHereUtils
            Map<String, String> notificationParams = new HashMap<>();
            notificationParams.put("merchant_id", merchantId);
            notificationParams.put("order_id", notification.getOrderId());
            notificationParams.put("payment_id", notification.getPaymentId());
//            notificationParams.put("payhere_amount", notification.getPayhereAmount());
//            notificationParams.put("payhere_currency", notification.getPayhereCurrency());
            notificationParams.put("status_code", notification.getStatusCode());
            notificationParams.put("md5sig", notification.getMd5sig());
            notificationParams.put("status_message", notification.getStatusMessage());
            notificationParams.put("method", notification.getMethod());

            // Process notification using PayHereUtils
            PayHereUtils.PaymentNotificationResult result = payHereUtils.processNotification(notificationParams);

            if (!result.isHashValid()) {
                logger.error("Invalid hash in PayHere notification for order: {}", notification.getOrderId());
                throw new RuntimeException("Invalid notification hash");
            }

            // Find booking by order ID
            Optional<Booking> optBooking = bookingRepo.findByPayHereOrderId(notification.getOrderId());
            if (!optBooking.isPresent()) {
                logger.error("Booking not found for Order ID: {}", notification.getOrderId());
                throw new RuntimeException("Booking not found for order: " + notification.getOrderId());
            }

            Booking booking = optBooking.get();
            logger.info("Found booking: {} for order: {}", booking.getId(), notification.getOrderId());

            // Update payment transaction
            PaymentTransaction payment = getPaymentByOrderId(notification.getOrderId());
            if (payment != null) {
                payment.setPayHerePaymentId(notification.getPaymentId());
                payment.setStatus(payHereUtils.getPaymentStatusDescription(Integer.parseInt(notification.getStatusCode())));
                payment.setPayHereResponse(notification.toString());
                payment.setUpdatedAt(LocalDateTime.now());
                savePaymentTransaction(payment);
                logger.info("Updated payment transaction for order: {}", notification.getOrderId());
            }

            // Process payment based on status using PayHereUtils
            if (payHereUtils.isPaymentSuccessful(notification.getStatusCode())) {
                // SUCCESS
                booking.setPayHerePaymentId(notification.getPaymentId());
                booking.setPaymentStatus("SUCCESS");
                booking.setStatus("CONFIRMED"); // Changed from PENDING_PROVIDER_ACCEPTANCE to CONFIRMED
                booking.onUpdate();
                bookingRepo.save(booking);

                // Log payment result using PayHereUtils
                payHereUtils.logPaymentResult(notification.getOrderId(), notification.getStatusCode(),
                        notification.getPaymentId());
                logger.info("✅ Payment successful for booking: {}", booking.getId());

            } else {
                // Handle non-successful payments
                String statusDescription = payHereUtils.getPaymentStatusDescription(Integer.parseInt(notification.getStatusCode()));
                logger.info("Processing {} payment for booking: {}", statusDescription, booking.getId());

                switch (notification.getStatusCode()) {
                    case "-1": // CANCELLED
                        booking.setPaymentStatus("CANCELLED");
                        booking.setStatus("CANCELLED_BY_TRAVELER");
                        booking.setCancellationReason("Payment cancelled by user");
                        booking.setCancellationType("TRAVELER_CANCELLED");
                        logger.info("💔 Payment cancelled for booking: {}", booking.getId());
                        break;

                    case "0": // PENDING
                        booking.setPaymentStatus("PENDING");
                        booking.setStatus("PENDING_PAYMENT");
                        logger.info("⏳ Payment pending for booking: {}", booking.getId());
                        break;

                    case "-2": // FAILED
                        booking.setPaymentStatus("FAILED");
                        booking.setStatus("PAYMENT_FAILED");
                        logger.info("❌ Payment failed for booking: {}", booking.getId());
                        break;

                    case "-3": // CHARGEDBACK
                        booking.setPaymentStatus("CHARGEDBACK");
                        booking.setStatus("CHARGEDBACK");
                        logger.info("🔄 Payment chargedback for booking: {}", booking.getId());
                        break;
                }

                booking.onUpdate();
                bookingRepo.save(booking);
            }

            logger.info("Payment notification processing completed for order: {}", notification.getOrderId());

        } catch (Exception e) {
            logger.error("Error handling payment notification for order: {}",
                    notification.getOrderId(), e);
            throw new RuntimeException("Error handling payment notification: " + e.getMessage());
        }
    }

    /**
     * Process full refund using PayHereUtils
     */
    @Override
    public void processFullRefund(Booking booking, String reason) {
        try {
            logger.info("Processing full refund for booking: {}, Amount: {}{}",
                    booking.getId(), booking.getCurrency(), booking.getTotalAmount());

            // Validate refund amount
            if (!payHereUtils.isValidAmount(booking.getTotalAmount())) {
                throw new RuntimeException("Invalid refund amount");
            }

            // Update booking status
            booking.setPaymentStatus("REFUNDED");
            booking.setStatus("REFUNDED");
            booking.setTotalRefundAmount(booking.getTotalAmount());
            booking.setRefundedToTraveler(booking.getTotalAmount());
            booking.setCancellationReason(reason);
            booking.onUpdate();
            bookingRepo.save(booking);

            // Generate unique refund ID
            String refundId = "REFUND-" + booking.getId() + "-" + System.currentTimeMillis();

            // Record refund transaction
            PaymentTransaction refundTransaction = new PaymentTransaction();
            refundTransaction.setBookingId(booking.getId());
            refundTransaction.setPayHereOrderId(booking.getPayHereOrderId());
            refundTransaction.setPayHerePaymentId(booking.getPayHerePaymentId());
            refundTransaction.setPayHereRefundId(refundId);
            refundTransaction.setType("REFUND");
            refundTransaction.setAmount(booking.getTotalAmount());
            refundTransaction.setCurrency(booking.getCurrency());
            refundTransaction.setStatus("SUCCESS");
            refundTransaction.setReason(reason);
            refundTransaction.setCreatedAt(LocalDateTime.now());
            refundTransaction.setUpdatedAt(LocalDateTime.now());

            savePaymentTransaction(refundTransaction);

            logger.info("✅ Full refund completed for booking: {} - Amount: {}{}",
                    booking.getId(), booking.getCurrency(), booking.getTotalAmount());

        } catch (Exception e) {
            logger.error("Error processing full refund for booking: {}", booking.getId(), e);
            throw new RuntimeException("Error processing full refund: " + e.getMessage());
        }
    }

    /**
     * Process partial refund using PayHereUtils
     */
    @Override
    public void processPartialRefund(Booking booking, BigDecimal refundPercentage, String reason) {
        try {
            // Calculate refund amount
            BigDecimal refundAmount = booking.getTotalAmount().multiply(refundPercentage);

            // Validate refund amount
            if (!payHereUtils.isValidAmount(refundAmount)) {
                throw new RuntimeException("Invalid refund amount");
            }

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

            // Generate unique refund ID
            String refundId = "PARTIAL-REFUND-" + booking.getId() + "-" + System.currentTimeMillis();

            // Record partial refund transaction
            PaymentTransaction refundTransaction = new PaymentTransaction();
            refundTransaction.setBookingId(booking.getId());
            refundTransaction.setPayHereOrderId(booking.getPayHereOrderId());
            refundTransaction.setPayHerePaymentId(booking.getPayHerePaymentId());
            refundTransaction.setPayHereRefundId(refundId);
            refundTransaction.setType("PARTIAL_REFUND");
            refundTransaction.setAmount(refundAmount);
            refundTransaction.setCurrency(booking.getCurrency());
            refundTransaction.setStatus("SUCCESS");
            refundTransaction.setReason(reason);
            refundTransaction.setCreatedAt(LocalDateTime.now());
            refundTransaction.setUpdatedAt(LocalDateTime.now());

            savePaymentTransaction(refundTransaction);

            logger.info("✅ Partial refund completed for booking: {} - Amount: {}{}",
                    booking.getId(), booking.getCurrency(), refundAmount);

        } catch (Exception e) {
            logger.error("Error processing partial refund for booking: {}", booking.getId(), e);
            throw new RuntimeException("Error processing partial refund: " + e.getMessage());
        }
    }

    /**
     * Schedule final payout with improved calculation
     */
    @Override
    public void scheduleFinalPayout(Booking booking) {
        try {
            // Use booking's method to calculate final payout if available, otherwise use default
            BigDecimal finalPayoutAmount;
            try {
                finalPayoutAmount = booking.calculateFinalPayout();
            } catch (Exception e) {
                logger.warn("calculateFinalPayout method not available, using default calculation");
                finalPayoutAmount = booking.getTotalAmount().multiply(BigDecimal.valueOf(0.75)); // 75%
            }

            // Validate payout amount
            if (!payHereUtils.isValidAmount(finalPayoutAmount)) {
                throw new RuntimeException("Invalid payout amount");
            }

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

            logger.info("✅ Final payout completed for booking: {} - Amount: {}{}",
                    booking.getId(), booking.getCurrency(), finalPayoutAmount);

        } catch (Exception e) {
            logger.error("Error scheduling final payout for booking: {}", booking.getId(), e);
            throw new RuntimeException("Error scheduling final payout: " + e.getMessage());
        }
    }

    /**
     * Process confirmation fee payout
     */
    public void processConfirmationFeePayout(Booking booking) {
        try {
            // Use booking's method to calculate confirmation fee if available
            BigDecimal confirmationFee;
            try {
                confirmationFee = booking.calculateConfirmationFee();
            } catch (Exception e) {
                logger.warn("calculateConfirmationFee method not available, using default calculation");
                confirmationFee = booking.getTotalAmount().multiply(BigDecimal.valueOf(0.10)); // 10%
            }

            // Validate fee amount
            if (!payHereUtils.isValidAmount(confirmationFee)) {
                throw new RuntimeException("Invalid confirmation fee amount");
            }

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

            logger.info("✅ Confirmation fee payout completed for booking: {} - Amount: {}{}",
                    booking.getId(), booking.getCurrency(), confirmationFee);

        } catch (Exception e) {
            logger.error("Error processing confirmation fee payout for booking: {}", booking.getId(), e);
            throw new RuntimeException("Error processing confirmation fee payout: " + e.getMessage());
        }
    }

    /**
     * Get booking by order ID
     */
    @Override
    public Booking getBookingByOrderId(String orderId) {
        try {
            if (orderId == null || orderId.trim().isEmpty()) {
                return null;
            }

            Optional<Booking> booking = bookingRepo.findByPayHereOrderId(orderId);
            return booking.orElse(null);

        } catch (Exception e) {
            logger.error("Error finding booking by order ID: {}", orderId, e);
            return null;
        }
    }

    /**
     * Get comprehensive payment summary
     */
    public Map<String, Object> getPaymentSummary(String bookingId) {
        try {
            if (bookingId == null || bookingId.trim().isEmpty()) {
                throw new RuntimeException("Booking ID is required");
            }

            Optional<Booking> optBooking = bookingRepo.findById(bookingId);
            if (!optBooking.isPresent()) {
                throw new RuntimeException("Booking not found");
            }

            Booking booking = optBooking.get();
            Map<String, Object> summary = new HashMap<>();

            // Basic booking details
            summary.put("bookingId", booking.getId());
            summary.put("orderId", booking.getPayHereOrderId());
            summary.put("paymentId", booking.getPayHerePaymentId());
            summary.put("totalAmount", booking.getTotalAmount());
            summary.put("currency", booking.getCurrency());
            summary.put("paymentStatus", booking.getPaymentStatus());
            summary.put("bookingStatus", booking.getStatus());

            // Money flow details
            try {
                if (booking.getPlatformCommission() != null) {
                    summary.put("platformCommission", booking.getPlatformCommission());
                }
                if (booking.getProviderConfirmationFee() != null) {
                    summary.put("providerConfirmationFee", booking.getProviderConfirmationFee());
                }

                // Calculate final payout
                BigDecimal finalPayout;
                try {
                    finalPayout = booking.calculateFinalPayout();
                } catch (Exception e) {
                    finalPayout = booking.getTotalAmount().multiply(BigDecimal.valueOf(0.75));
                }
                summary.put("providerFinalPayout", finalPayout);

            } catch (Exception e) {
                logger.warn("Some money flow calculations not available for booking: {}", bookingId);
            }

            summary.put("confirmationFeePaid", booking.isConfirmationFeePaid());
            summary.put("finalPayoutPaid", booking.isFinalPayoutPaid());

            // Payment transactions
            List<PaymentTransaction> transactions = paymentTransactionRepo.findByBookingId(bookingId);
            summary.put("transactions", transactions);
            summary.put("transactionCount", transactions.size());

            // Summary statistics
            BigDecimal totalPaid = transactions.stream()
                    .filter(t -> "SUCCESS".equals(t.getStatus()) &&
                            ("PAYMENT".equals(t.getType()) || "CONFIRMATION_FEE_PAYOUT".equals(t.getType()) ||
                                    "FINAL_PAYOUT".equals(t.getType())))
                    .map(PaymentTransaction::getAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            BigDecimal totalRefunded = transactions.stream()
                    .filter(t -> "SUCCESS".equals(t.getStatus()) &&
                            ("REFUND".equals(t.getType()) || "PARTIAL_REFUND".equals(t.getType())))
                    .map(PaymentTransaction::getAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            summary.put("totalPaid", totalPaid);
            summary.put("totalRefunded", totalRefunded);
            summary.put("netAmount", totalPaid.subtract(totalRefunded));

            return summary;

        } catch (Exception e) {
            logger.error("Error getting payment summary for booking: {}", bookingId, e);
            throw new RuntimeException("Error getting payment summary: " + e.getMessage());
        }
    }

    /**
     * Check if payment is completed
     */
    public boolean isPaymentCompleted(String bookingId) {
        try {
            if (bookingId == null || bookingId.trim().isEmpty()) {
                return false;
            }

            PaymentTransaction payment = getPaymentByBookingId(bookingId);
            return payment != null && payHereUtils.isPaymentSuccessful(payment.getStatus());

        } catch (Exception e) {
            logger.error("Error checking payment completion for booking: {}", bookingId, e);
            return false;
        }
    }

    /**
     * Get service health status
     */
    public Map<String, Object> getServiceHealth() {
        Map<String, Object> health = new HashMap<>();

        try {
            // Basic service info
            health.put("paymentService", "HEALTHY");
            health.put("timestamp", LocalDateTime.now());

            // PayHere configuration
            Map<String, Object> payhereConfig = payHereUtils.getConfigInfo();
            health.put("payhereConfig", payhereConfig);

            // Database connectivity
            long totalBookings = bookingRepo.count();
            long totalTransactions = paymentTransactionRepo.count();
            health.put("totalBookings", totalBookings);
            health.put("totalTransactions", totalTransactions);

            // Service configuration
            health.put("merchantId", merchantId);
            health.put("baseUrl", payHereBaseUrl);
            health.put("appBaseUrl", appBaseUrl);
            health.put("sandboxMode", sandboxMode);

        } catch (Exception e) {
            logger.error("Error getting service health", e);
            health.put("paymentService", "UNHEALTHY");
            health.put("error", e.getMessage());
        }

        return health;
    }

    /**
     * Convert status code to readable status (using PayHereUtils)
     */
    private String convertStatusCode(String statusCode) {
        try {
            return payHereUtils.getPaymentStatusDescription(Integer.parseInt(statusCode));
        } catch (NumberFormatException e) {
            logger.warn("Invalid status code: {}", statusCode);
            return "UNKNOWN";
        }
    }

    /**
     * Build checkout URL (legacy method - kept for compatibility)
     */
    private String buildCheckoutUrl(Booking booking, String orderId, String hash) {
        StringBuilder url = new StringBuilder(payHereBaseUrl);
        url.append("?merchant_id=").append(merchantId);
        url.append("&return_url=").append(appBaseUrl).append("/payment/success/").append(booking.getId());
        url.append("&cancel_url=").append(appBaseUrl).append("/payment/cancel/").append(booking.getId());
        url.append("&notify_url=").append(appBaseUrl).append("/api/payments/payhere/notify");
        url.append("&order_id=").append(orderId);
        url.append("&items=").append(booking.getServiceName() != null ?
                booking.getServiceName().replaceAll(" ", "%20") : "Guide%20Service");
        url.append("&currency=").append(booking.getCurrency() != null ? booking.getCurrency() : "LKR");
        url.append("&amount=").append(payHereUtils.formatAmountForHash(booking.getTotalAmount()));
        url.append("&hash=").append(hash);

        return url.toString();
    }

    /**
     * Get all transactions for a booking
     */
    public List<PaymentTransaction> getTransactionsByBookingId(String bookingId) {
        try {
            return paymentTransactionRepo.findByBookingId(bookingId);
        } catch (Exception e) {
            logger.error("Error getting transactions for booking: {}", bookingId, e);
            throw new RuntimeException("Error getting transactions: " + e.getMessage());
        }
    }

    /**
     * Get payment statistics
     */
    public Map<String, Object> getPaymentStatistics() {
        try {
            Map<String, Object> stats = new HashMap<>();

            // Count transactions by type
            List<PaymentTransaction> allTransactions = paymentTransactionRepo.findAll();

            Map<String, Long> transactionsByType = allTransactions.stream()
                    .collect(java.util.stream.Collectors.groupingBy(
                            PaymentTransaction::getType,
                            java.util.stream.Collectors.counting()
                    ));

            Map<String, Long> transactionsByStatus = allTransactions.stream()
                    .collect(java.util.stream.Collectors.groupingBy(
                            PaymentTransaction::getStatus,
                            java.util.stream.Collectors.counting()
                    ));

            stats.put("transactionsByType", transactionsByType);
            stats.put("transactionsByStatus", transactionsByStatus);
            stats.put("totalTransactions", allTransactions.size());

            return stats;

        } catch (Exception e) {
            logger.error("Error getting payment statistics", e);
            throw new RuntimeException("Error getting payment statistics: " + e.getMessage());
        }
    }

    @Override
    public void processFinalPayout(Booking booking) {
        try {
            logger.info("Processing final payout for booking: {}", booking.getId());

            if (booking.isFinalPayoutPaid()) {
                logger.warn("Final payout already processed for booking: {}", booking.getId());
                return;
            }

            // Use booking's method to calculate final payout if available, otherwise use default
            BigDecimal finalPayoutAmount;
            try {
                finalPayoutAmount = booking.calculateFinalPayout();
            } catch (Exception e) {
                logger.warn("calculateFinalPayout method not available, using default calculation");
                finalPayoutAmount = booking.getTotalAmount().multiply(BigDecimal.valueOf(0.75)); // 75%
            }

            // Validate payout amount
            if (!payHereUtils.isValidAmount(finalPayoutAmount)) {
                throw new RuntimeException("Invalid payout amount");
            }

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

            logger.info("✅ Final payout completed for booking: {} - Amount: {}{}",
                    booking.getId(), booking.getCurrency(), finalPayoutAmount);

        } catch (Exception e) {
            logger.error("Error processing final payout for booking: {}", booking.getId(), e);
            throw new RuntimeException("Error processing final payout: " + e.getMessage());
        }
    }
}