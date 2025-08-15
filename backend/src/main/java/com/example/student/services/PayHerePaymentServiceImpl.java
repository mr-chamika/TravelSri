package com.example.student.services;

import com.example.student.model.Booking;
import com.example.student.model.MoneyFlow;
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

    @Autowired
    private IMoneyFlowService moneyFlowService;

    @Autowired
    private ITravelerWalletService travelerWalletService;

    @Value("${payhere.merchant.id:1231576}")
    private String merchantId;

    @Value("${payhere.api.base-url:https://sandbox.payhere.lk/pay/checkout}")
    private String payHereBaseUrl;

    @Value("${app.base.url:http://localhost:8080}")
    private String appBaseUrl;

    @Value("${payhere.sandbox:true}")
    private boolean sandboxMode;

    // ===== EXISTING METHODS =====

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

            return payments.stream()
                    .filter(p -> "PAYMENT".equals(p.getType()) || "SUCCESS".equals(p.getStatus()))
                    .findFirst()
                    .orElse(payments.get(0));

        } catch (Exception e) {
            logger.error("Error finding payment by booking ID: {}", bookingId, e);
            return null;
        }
    }

    @Override
    public PayHereSessionResponse createPayHereCheckout(String bookingId) {
        try {
            logger.info("Creating PayHere checkout for booking: {}", bookingId);

            Optional<Booking> optBooking = bookingRepo.findById(bookingId);
            if (!optBooking.isPresent()) {
                logger.error("Booking not found: {}", bookingId);
                throw new RuntimeException("Booking not found");
            }

            Booking booking = optBooking.get();

            if (!payHereUtils.isValidAmount(booking.getTotalAmount())) {
                logger.error("Invalid booking amount: {}", booking.getTotalAmount());
                throw new RuntimeException("Invalid booking amount");
            }

            String orderId = payHereUtils.generateOrderId();
            logger.info("Generated order ID: {}", orderId);

            String hash = payHereUtils.generateHash(orderId, booking.getTotalAmount(),
                    booking.getCurrency() != null ? booking.getCurrency() : "LKR");

            booking.setPayHereOrderId(orderId);
            booking.setPaymentStatus("PENDING");
            booking.setStatus("PENDING_PAYMENT");
            booking.onUpdate();
            bookingRepo.save(booking);
            logger.info("Updated booking status to PENDING_PAYMENT");

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

            payHereUtils.logPaymentAttempt(orderId, booking.getTotalAmount(), "customer@example.com");

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

    @Override
    public void handlePaymentNotification(PayHereNotification notification) {
        try {
            logger.info("Processing PayHere notification for order: {}", notification.getOrderId());

            Map<String, String> notificationParams = new HashMap<>();
            notificationParams.put("merchant_id", merchantId);
            notificationParams.put("order_id", notification.getOrderId());
            notificationParams.put("payment_id", notification.getPaymentId());
            notificationParams.put("status_code", notification.getStatusCode());
            notificationParams.put("md5sig", notification.getMd5sig());
            notificationParams.put("status_message", notification.getStatusMessage());
            notificationParams.put("method", notification.getMethod());

            PayHereUtils.PaymentNotificationResult result = payHereUtils.processNotification(notificationParams);

            if (!result.isHashValid()) {
                logger.error("Invalid hash in PayHere notification for order: {}", notification.getOrderId());
                throw new RuntimeException("Invalid notification hash");
            }

            Optional<Booking> optBooking = bookingRepo.findByPayHereOrderId(notification.getOrderId());
            if (!optBooking.isPresent()) {
                logger.error("Booking not found for Order ID: {}", notification.getOrderId());
                throw new RuntimeException("Booking not found for order: " + notification.getOrderId());
            }

            Booking booking = optBooking.get();
            logger.info("Found booking: {} for order: {}", booking.getId(), notification.getOrderId());

            PaymentTransaction payment = getPaymentByOrderId(notification.getOrderId());
            if (payment != null) {
                payment.setPayHerePaymentId(notification.getPaymentId());
                payment.setStatus(payHereUtils.getPaymentStatusDescription(Integer.parseInt(notification.getStatusCode())));
                payment.setPayHereResponse(notification.toString());
                payment.setUpdatedAt(LocalDateTime.now());
                savePaymentTransaction(payment);
                logger.info("Updated payment transaction for order: {}", notification.getOrderId());
            }

            if (payHereUtils.isPaymentSuccessful(notification.getStatusCode())) {
                booking.setPayHerePaymentId(notification.getPaymentId());
                booking.setPaymentStatus("SUCCESS");
                booking.setStatus("CONFIRMED");
                booking.onUpdate();
                bookingRepo.save(booking);

                payHereUtils.logPaymentResult(notification.getOrderId(), notification.getStatusCode(),
                        notification.getPaymentId());
                logger.info("Payment successful for booking: {}", booking.getId());

            } else {
                String statusDescription = payHereUtils.getPaymentStatusDescription(Integer.parseInt(notification.getStatusCode()));
                logger.info("Processing {} payment for booking: {}", statusDescription, booking.getId());

                switch (notification.getStatusCode()) {
                    case "-1":
                        booking.setPaymentStatus("CANCELLED");
                        booking.setStatus("CANCELLED_BY_TRAVELER");
                        booking.setCancellationReason("Payment cancelled by user");
                        booking.setCancellationType("TRAVELER_CANCELLED");
                        logger.info("Payment cancelled for booking: {}", booking.getId());
                        break;
                    case "0":
                        booking.setPaymentStatus("PENDING");
                        booking.setStatus("PENDING_PAYMENT");
                        logger.info("Payment pending for booking: {}", booking.getId());
                        break;
                    case "-2":
                        booking.setPaymentStatus("FAILED");
                        booking.setStatus("PAYMENT_FAILED");
                        logger.info("Payment failed for booking: {}", booking.getId());
                        break;
                    case "-3":
                        booking.setPaymentStatus("CHARGEDBACK");
                        booking.setStatus("CHARGEDBACK");
                        logger.info("Payment chargedback for booking: {}", booking.getId());
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

    @Override
    public void processPartialRefund(Booking booking, BigDecimal refundPercentage, String reason) {
        try {
            BigDecimal refundAmount = booking.getTotalAmount().multiply(refundPercentage);

            if (!payHereUtils.isValidAmount(refundAmount)) {
                throw new RuntimeException("Invalid refund amount");
            }

            logger.info("Processing partial refund for booking: {}, Refund: {}{} ({}%)",
                    booking.getId(), booking.getCurrency(), refundAmount,
                    refundPercentage.multiply(BigDecimal.valueOf(100)));

            booking.setPaymentStatus("PARTIALLY_REFUNDED");
            booking.setStatus("CANCELLED_BY_TRAVELER");
            booking.setTotalRefundAmount(refundAmount);
            booking.setRefundedToTraveler(refundAmount);
            booking.setCancellationReason(reason);
            booking.setCancellationType("TRAVELER_CANCELLED");
            booking.onUpdate();
            bookingRepo.save(booking);

            String refundId = "PARTIAL-REFUND-" + booking.getId() + "-" + System.currentTimeMillis();

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

            logger.info("Partial refund completed for booking: {} - Amount: {}{}",
                    booking.getId(), booking.getCurrency(), refundAmount);

        } catch (Exception e) {
            logger.error("Error processing partial refund for booking: {}", booking.getId(), e);
            throw new RuntimeException("Error processing partial refund: " + e.getMessage());
        }
    }

    @Override
    public void scheduleFinalPayout(Booking booking) {
        try {
            BigDecimal finalPayoutAmount;
            try {
                finalPayoutAmount = booking.calculateFinalPayout();
            } catch (Exception e) {
                logger.warn("calculateFinalPayout method not available, using default calculation");
                finalPayoutAmount = booking.getTotalAmount().multiply(BigDecimal.valueOf(0.75));
            }

            if (!payHereUtils.isValidAmount(finalPayoutAmount)) {
                throw new RuntimeException("Invalid payout amount");
            }

            logger.info("Processing final payout for booking: {}, Amount: {}{}",
                    booking.getId(), booking.getCurrency(), finalPayoutAmount);

            booking.setFinalPayoutPaid(true);
            booking.setFinalPayoutPaidAt(LocalDateTime.now());
            booking.onUpdate();
            bookingRepo.save(booking);

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

            logger.info("Final payout completed for booking: {} - Amount: {}{}",
                    booking.getId(), booking.getCurrency(), finalPayoutAmount);

        } catch (Exception e) {
            logger.error("Error scheduling final payout for booking: {}", booking.getId(), e);
            throw new RuntimeException("Error scheduling final payout: " + e.getMessage());
        }
    }

    @Override
    public void processConfirmationFeePayout(Booking booking) {
        try {
            BigDecimal confirmationFee;
            try {
                confirmationFee = booking.calculateConfirmationFee();
            } catch (Exception e) {
                logger.warn("calculateConfirmationFee method not available, using default calculation");
                confirmationFee = booking.getTotalAmount().multiply(BigDecimal.valueOf(0.10));
            }

            if (!payHereUtils.isValidAmount(confirmationFee)) {
                throw new RuntimeException("Invalid confirmation fee amount");
            }

            logger.info("Processing confirmation fee payout for booking: {}, Amount: {}{}",
                    booking.getId(), booking.getCurrency(), confirmationFee);

            booking.setConfirmationFeePaid(true);
            booking.setConfirmationFeePaidAt(LocalDateTime.now());
            booking.onUpdate();
            bookingRepo.save(booking);

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

            logger.info("Confirmation fee payout completed for booking: {} - Amount: {}{}",
                    booking.getId(), booking.getCurrency(), confirmationFee);

        } catch (Exception e) {
            logger.error("Error processing confirmation fee payout for booking: {}", booking.getId(), e);
            throw new RuntimeException("Error processing confirmation fee payout: " + e.getMessage());
        }
    }

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

    @Override
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

            summary.put("bookingId", booking.getId());
            summary.put("orderId", booking.getPayHereOrderId());
            summary.put("paymentId", booking.getPayHerePaymentId());
            summary.put("totalAmount", booking.getTotalAmount());
            summary.put("currency", booking.getCurrency());
            summary.put("paymentStatus", booking.getPaymentStatus());
            summary.put("bookingStatus", booking.getStatus());

            try {
                if (booking.getPlatformCommission() != null) {
                    summary.put("platformCommission", booking.getPlatformCommission());
                }
                if (booking.getProviderConfirmationFee() != null) {
                    summary.put("providerConfirmationFee", booking.getProviderConfirmationFee());
                }

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

            List<PaymentTransaction> transactions = paymentTransactionRepo.findByBookingId(bookingId);
            summary.put("transactions", transactions);
            summary.put("transactionCount", transactions.size());

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

    @Override
    public void processFinalPayout(Booking booking) {
        try {
            logger.info("Processing final payout for booking: {}", booking.getId());

            if (booking.isFinalPayoutPaid()) {
                logger.warn("Final payout already processed for booking: {}", booking.getId());
                return;
            }

            BigDecimal finalPayoutAmount;
            try {
                finalPayoutAmount = booking.calculateFinalPayout();
            } catch (Exception e) {
                logger.warn("calculateFinalPayout method not available, using default calculation");
                finalPayoutAmount = booking.getTotalAmount().multiply(BigDecimal.valueOf(0.75));
            }

            if (!payHereUtils.isValidAmount(finalPayoutAmount)) {
                throw new RuntimeException("Invalid payout amount");
            }

            logger.info("Processing final payout for booking: {}, Amount: {}{}",
                    booking.getId(), booking.getCurrency(), finalPayoutAmount);

            booking.setFinalPayoutPaid(true);
            booking.setFinalPayoutPaidAt(LocalDateTime.now());
            booking.onUpdate();
            bookingRepo.save(booking);

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

            logger.info("Final payout completed for booking: {} - Amount: {}{}",
                    booking.getId(), booking.getCurrency(), finalPayoutAmount);

        } catch (Exception e) {
            logger.error("Error processing final payout for booking: {}", booking.getId(), e);
            throw new RuntimeException("Error processing final payout: " + e.getMessage());
        }
    }

    @Override
    public void processFullRefund(Booking booking, String reason) {
        try {
            logger.info("Processing full refund for booking: {}, Amount: {} {}",
                    booking.getId(), booking.getTotalAmount(), booking.getCurrency());

            if (!payHereUtils.isValidAmount(booking.getTotalAmount())) {
                throw new RuntimeException("Invalid refund amount");
            }

            booking.setPaymentStatus("REFUNDED");
            booking.setStatus("REFUNDED");
            booking.setTotalRefundAmount(booking.getTotalAmount());
            booking.setRefundedToTraveler(booking.getTotalAmount());
            booking.setCancellationReason(reason);
            booking.onUpdate();
            bookingRepo.save(booking);

            String refundId = "REFUND-" + booking.getId() + "-" + System.currentTimeMillis();

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

            MoneyFlow refundFlow = new MoneyFlow();
            refundFlow.setBookingId(booking.getId());
            refundFlow.setFromEntity("PLATFORM");
            refundFlow.setToEntity("TRAVELER");
            refundFlow.setFromEntityId("PLATFORM_ACCOUNT");
            refundFlow.setToEntityId(booking.getTravelerId());
            refundFlow.setAmount(booking.getTotalAmount());
            refundFlow.setFlowType("REFUND");
            refundFlow.setDescription("Full refund for booking " + booking.getId() + ": " + reason);
            refundFlow.setStatus("COMPLETED");
            refundFlow.setTransactionReference(refundId);
            refundFlow.setCreatedAt(LocalDateTime.now());

            moneyFlowService.save(refundFlow);

            travelerWalletService.addRefund(booking.getTravelerId(), booking.getTotalAmount(),
                    booking.getId(), reason, "FULL");

            logger.info("Full refund completed: {} {} for booking {}",
                    booking.getTotalAmount(), booking.getCurrency(), booking.getId());

        } catch (Exception e) {
            logger.error("Error processing full refund for booking: {}", booking.getId(), e);
            throw new RuntimeException("Error processing full refund: " + e.getMessage());
        }
    }

    // ===== NEW PAYMENT STATUS METHODS =====

    @Override
    public Optional<PaymentTransaction> findByOrderId(String orderId) {
        try {
            logger.debug("Finding payment by order ID: {}", orderId);
            return paymentTransactionRepo.findByOrderId(orderId);
        } catch (Exception e) {
            logger.error("Error finding payment by order ID: {}", orderId, e);
            return Optional.empty();
        }
    }

    @Override
    public Optional<PaymentTransaction> findByBookingId(String bookingId) {
        try {
            logger.debug("Finding payment by booking ID: {}", bookingId);
            return paymentTransactionRepo.findFirstByBookingIdOrderByCreatedAtDesc(bookingId);
        } catch (Exception e) {
            logger.error("Error finding payment by booking ID: {}", bookingId, e);
            return Optional.empty();
        }
    }

    @Override
    public List<PaymentTransaction> findAllByBookingId(String bookingId) {
        try {
            logger.debug("Finding all payments by booking ID: {}", bookingId);
            return paymentTransactionRepo.findByBookingIdOrderByCreatedAtDesc(bookingId);
        } catch (Exception e) {
            logger.error("Error finding payments by booking ID: {}", bookingId, e);
            return List.of();
        }
    }

    @Override
    public void updatePaymentStatus(PaymentTransaction payment, String newStatus, String source, String transactionId) {
        try {
            logger.info("Updating payment status:");
            logger.info("  - Order ID: {}", payment.getPayHereOrderId());
            logger.info("  - Old Status: {}", payment.getStatus());
            logger.info("  - New Status: {}", newStatus);
            logger.info("  - Source: {}", source);
            logger.info("  - Transaction ID: {}", transactionId);

            String oldStatus = payment.getStatus();
            payment.setStatus(newStatus);
            payment.setUpdatedAt(LocalDateTime.now());

            if (transactionId != null && !transactionId.trim().isEmpty()) {
                payment.setTransactionId(transactionId);
            }

            String noteUpdate = "Status updated from " + oldStatus + " to " + newStatus + " via " + source;
            if (payment.getReason() == null) {
                payment.setReason(noteUpdate);
            } else {
                payment.setReason(payment.getReason() + "; " + noteUpdate);
            }

            savePaymentTransaction(payment);

            logger.info("Payment status updated successfully");

        } catch (Exception e) {
            logger.error("Error updating payment status:", e);
            throw new RuntimeException("Failed to update payment status", e);
        }
    }

    @Override
    public PaymentTransaction createOrUpdatePaymentTransaction(
            String orderId,
            String bookingId,
            BigDecimal amount,
            String currency,
            String status,
            String paymentId,
            String transactionId) {

        try {
            logger.info("Creating/updating payment transaction:");
            logger.info("  - Order ID: {}", orderId);
            logger.info("  - Booking ID: {}", bookingId);
            logger.info("  - Amount: {} {}", amount, currency);
            logger.info("  - Status: {}", status);

            Optional<PaymentTransaction> existingOpt = findByOrderId(orderId);

            PaymentTransaction payment;
            if (existingOpt.isPresent()) {
                payment = existingOpt.get();
                logger.info("Updating existing payment transaction");

                payment.setStatus(status);
                payment.setUpdatedAt(LocalDateTime.now());

                if (paymentId != null) payment.setPayHerePaymentId(paymentId);
                if (transactionId != null) payment.setTransactionId(transactionId);

            } else {
                payment = new PaymentTransaction();
                logger.info("Creating new payment transaction");

                payment.setPayHereOrderId(orderId);
                payment.setBookingId(bookingId);
                payment.setAmount(amount);
                payment.setCurrency(currency);
                payment.setStatus(status);
                payment.setPayHerePaymentId(paymentId);
                payment.setTransactionId(transactionId);
                payment.setType("PAYMENT");
                payment.setCreatedAt(LocalDateTime.now());
                payment.setUpdatedAt(LocalDateTime.now());
            }

            PaymentTransaction saved = savePaymentTransaction(payment);
            logger.info("Payment transaction saved successfully");

            return saved;

        } catch (Exception e) {
            logger.error("Error creating/updating payment transaction:", e);
            throw new RuntimeException("Failed to create/update payment transaction", e);
        }
    }

    @Override
    public long getTotalPaymentCount() {
        try {
            return paymentTransactionRepo.count();
        } catch (Exception e) {
            logger.error("Error getting total payment count:", e);
            return 0;
        }
    }

    @Override
    public Map<String, Object> getServiceHealth() {
        Map<String, Object> health = new HashMap<>();

        try {
            long totalPayments = getTotalPaymentCount();
            health.put("databaseConnectivity", "UP");
            health.put("totalPayments", totalPayments);

            LocalDateTime oneHourAgo = LocalDateTime.now().minusHours(1);
            List<PaymentTransaction> recentPayments = findByDateRange(oneHourAgo, LocalDateTime.now());
            health.put("recentPayments", recentPayments.size());

            List<PaymentTransactionRepo.PaymentStatusStats> statusStats =
                    paymentTransactionRepo.getPaymentStatisticsByStatus();

            Map<String, Long> statusCounts = new HashMap<>();
            for (PaymentTransactionRepo.PaymentStatusStats stat : statusStats) {
                statusCounts.put(stat.getStatus(), stat.getCount());
            }
            health.put("statusDistribution", statusCounts);

            health.put("status", "HEALTHY");
            health.put("timestamp", LocalDateTime.now());

        } catch (Exception e) {
            logger.error("Error getting service health:", e);
            health.put("status", "UNHEALTHY");
            health.put("error", e.getMessage());
            health.put("databaseConnectivity", "DOWN");
        }

        return health;
    }

    @Override
    public List<PaymentTransaction> findByStatus(String status) {
        try {
            return paymentTransactionRepo.findByStatusOrderByCreatedAtDesc(status);
        } catch (Exception e) {
            logger.error("Error finding payments by status: {}", status, e);
            return List.of();
        }
    }

    @Override
    public List<PaymentTransaction> findByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        try {
            return paymentTransactionRepo.findByCreatedAtBetween(startDate, endDate);
        } catch (Exception e) {
            logger.error("Error finding payments by date range:", e);
            return List.of();
        }
    }

    @Override
    public Map<String, Object> getPaymentStatistics() {
        Map<String, Object> stats = new HashMap<>();

        try {
            stats.put("totalPayments", getTotalPaymentCount());

            List<PaymentTransactionRepo.PaymentStatusStats> statusStats =
                    paymentTransactionRepo.getPaymentStatisticsByStatus();

            for (PaymentTransactionRepo.PaymentStatusStats stat : statusStats) {
                switch (stat.getStatus()) {
                    case "SUCCESS":
                        stats.put("successfulPayments", stat.getCount());
                        stats.put("totalSuccessAmount", stat.getTotalAmount());
                        break;
                    case "PENDING":
                        stats.put("pendingPayments", stat.getCount());
                        break;
                    case "FAILED":
                        stats.put("failedPayments", stat.getCount());
                        break;
                }
            }

            LocalDateTime startOfDay = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0);
            LocalDateTime endOfDay = LocalDateTime.now().withHour(23).withMinute(59).withSecond(59);
            long todayCount = paymentTransactionRepo.getPaymentCountForDateRange(startOfDay, endOfDay);
            stats.put("todayPayments", todayCount);

            stats.put("currency", "LKR");
            stats.put("timestamp", LocalDateTime.now());

        } catch (Exception e) {
            logger.error("Error getting payment statistics:", e);
            stats.put("error", e.getMessage());
        }

        return stats;
    }

    @Override
    public boolean existsByOrderId(String orderId) {
        try {
            return paymentTransactionRepo.existsByOrderId(orderId);
        } catch (Exception e) {
            logger.error("Error checking if payment exists for order ID: {}", orderId, e);
            return false;
        }
    }

    @Override
    public Optional<PaymentTransaction> getLatestPaymentForBooking(String bookingId) {
        try {
            return paymentTransactionRepo.findFirstByBookingIdOrderByCreatedAtDesc(bookingId);
        } catch (Exception e) {
            logger.error("Error getting latest payment for booking: {}", bookingId, e);
            return Optional.empty();
        }
    }

    @Override
    public void markPaymentAsConfirmed(String orderId, String paymentId, String transactionId) {
        try {
            logger.info("Marking payment as confirmed:");
            logger.info("  - Order ID: {}", orderId);
            logger.info("  - Payment ID: {}", paymentId);
            logger.info("  - Transaction ID: {}", transactionId);

            Optional<PaymentTransaction> paymentOpt = findByOrderId(orderId);
            if (paymentOpt.isPresent()) {
                PaymentTransaction payment = paymentOpt.get();
                updatePaymentStatus(payment, "SUCCESS", "PAYHERE_CONFIRMATION", transactionId);

                if (paymentId != null) {
                    payment.setPayHerePaymentId(paymentId);
                    savePaymentTransaction(payment);
                }

                logger.info("Payment marked as confirmed successfully");
            } else {
                logger.warn("Payment not found for order ID: {}", orderId);
            }

        } catch (Exception e) {
            logger.error("Error marking payment as confirmed:", e);
            throw new RuntimeException("Failed to mark payment as confirmed", e);
        }
    }

    @Override
    public void markPaymentAsFailed(String orderId, String errorMessage) {
        try {
            logger.info("Marking payment as failed:");
            logger.info("  - Order ID: {}", orderId);
            logger.info("  - Error: {}", errorMessage);

            Optional<PaymentTransaction> paymentOpt = findByOrderId(orderId);
            if (paymentOpt.isPresent()) {
                PaymentTransaction payment = paymentOpt.get();
                updatePaymentStatus(payment, "FAILED", "PAYHERE_ERROR", null);

                String currentReason = payment.getReason() != null ? payment.getReason() : "";
                payment.setReason(currentReason + "; Error: " + errorMessage);
                savePaymentTransaction(payment);

                logger.info("Payment marked as failed successfully");
            } else {
                logger.warn("Payment not found for order ID: {}", orderId);
            }

        } catch (Exception e) {
            logger.error("Error marking payment as failed:", e);
            throw new RuntimeException("Failed to mark payment as failed", e);
        }
    }

    @Override
    public List<PaymentTransaction> getPendingPaymentsOlderThan(int minutes) {
        try {
            LocalDateTime cutoffTime = LocalDateTime.now().minusMinutes(minutes);
            return paymentTransactionRepo.findPendingPaymentsOlderThan(cutoffTime);
        } catch (Exception e) {
            logger.error("Error getting pending payments older than {} minutes:", minutes, e);
            return List.of();
        }
    }

    @Override
    public int cleanupOldFailedPayments(int daysOld) {
        try {
            logger.info("Cleaning up failed payments older than {} days", daysOld);

            LocalDateTime cutoffDate = LocalDateTime.now().minusDays(daysOld);
            List<PaymentTransaction> oldFailedPayments = paymentTransactionRepo
                    .findByStatusAndCreatedAtBefore("FAILED", cutoffDate);

            int cleanedCount = oldFailedPayments.size();

            if (cleanedCount > 0) {
                paymentTransactionRepo.deleteAll(oldFailedPayments);
                logger.info("Cleaned up {} old failed payment records", cleanedCount);
            } else {
                logger.info("No old failed payments found to cleanup");
            }

            return cleanedCount;

        } catch (Exception e) {
            logger.error("Error cleaning up old failed payments:", e);
            throw new RuntimeException("Failed to cleanup old failed payments", e);
        }
    }
}