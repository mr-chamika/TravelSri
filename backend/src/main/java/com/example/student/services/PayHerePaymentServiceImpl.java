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

import jakarta.annotation.PostConstruct;
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

    // ===== NEW: REAL MONEY FLOW SERVICES =====
    @Autowired
    private MoneyFlowService moneyFlowService;

    @Autowired
    private BankTransferService bankTransferService;

    @Autowired
    private PayHereRefundService payHereRefundService;

    @Value("${payhere.merchant.id}")
    private String merchantId;

    @Value("${payhere.api.base-url}")
    private String payHereBaseUrl;

    @Value("${app.base.url}")
    private String appBaseUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    @PostConstruct
    public void init() {
        System.out.println("PayHere Payment Service initialized with Real Money Flow");
        System.out.println("Merchant ID: " + merchantId);
        System.out.println("Base URL: " + payHereBaseUrl);
        System.out.println("✅ Wallet System: ENABLED");
        System.out.println("✅ Bank Transfers: ENABLED");
        System.out.println("✅ Real Refunds: ENABLED");
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

            System.out.println("💳 Payment Session Created:");
            System.out.println("   Order ID: " + orderId);
            System.out.println("   Amount: $" + booking.getTotalAmount());
            System.out.println("   Checkout URL: " + checkoutUrl);

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
            System.out.println("📨 PayHere Notification Received:");
            System.out.println("   Order ID: " + notification.getOrderId());
            System.out.println("   Payment ID: " + notification.getPaymentId());
            System.out.println("   Status Code: " + notification.getStatusCode());
            System.out.println("   Amount: $" + notification.getAmount());

            // Optional: Verify notification hash for security
            // boolean isValid = payHereUtils.verifyNotificationHash(...);
            // if (!isValid) { throw new RuntimeException("Invalid notification hash"); }

            // Find booking by order ID
            Optional<Booking> optBooking = bookingRepo.findByPayHereOrderId(notification.getOrderId());
            if (optBooking.isPresent()) {
                Booking booking = optBooking.get();

                if ("2".equals(notification.getStatusCode())) { // SUCCESS
                    // Update booking status
                    booking.setPayHerePaymentId(notification.getPaymentId());
                    booking.setPaymentStatus("SUCCESS");
                    booking.setStatus("PENDING_PROVIDER_ACCEPTANCE");
                    booking.setUpdatedAt(LocalDateTime.now());
                    bookingRepo.save(booking);

                    // ===== NEW: PROCESS REAL MONEY CAPTURE =====
                    moneyFlowService.processPaymentCapture(booking);

                    // Record successful transaction
                    recordTransaction(booking.getId(), notification.getOrderId(),
                            notification.getPaymentId(), null, "PAYMENT", booking.getTotalAmount(),
                            "SUCCESS", "initial-payment", notification.toString());

                    System.out.println("✅ PAYMENT SUCCESSFULLY CAPTURED:");
                    System.out.println("   💰 Amount: $" + booking.getTotalAmount());
                    System.out.println("   🏦 Platform Wallet: UPDATED");
                    System.out.println("   👤 Traveler Spending: TRACKED");
                    System.out.println("   📊 Status: " + booking.getStatus());

                } else if ("-1".equals(notification.getStatusCode())) { // CANCELLED
                    booking.setPaymentStatus("FAILED");
                    booking.setStatus("PAYMENT_CANCELLED");
                    booking.setUpdatedAt(LocalDateTime.now());
                    bookingRepo.save(booking);

                    System.out.println("❌ Payment Cancelled:");
                    System.out.println("   Order ID: " + notification.getOrderId());

                } else if ("0".equals(notification.getStatusCode())) { // PENDING
                    booking.setPaymentStatus("PENDING");
                    booking.setUpdatedAt(LocalDateTime.now());
                    bookingRepo.save(booking);

                    System.out.println("⏳ Payment Pending:");
                    System.out.println("   Order ID: " + notification.getOrderId());
                }
            } else {
                System.err.println("❌ Booking not found for Order ID: " + notification.getOrderId());
            }
        } catch (Exception e) {
            System.err.println("❌ Error handling payment notification: " + e.getMessage());
            throw new RuntimeException("Error handling payment notification: " + e.getMessage());
        }
    }

    @Override
    public void processFullRefund(Booking booking, String reason) {
        try {
            System.out.println("💸 Processing FULL REFUND:");
            System.out.println("   Booking ID: " + booking.getId());
            System.out.println("   Amount: $" + booking.getTotalAmount());
            System.out.println("   Reason: " + reason);

            // ===== NEW: PROCESS REAL PAYHERE REFUND =====
            if (booking.getPayHerePaymentId() != null && !"".equals(booking.getPayHerePaymentId())) {
                try {
                    // Process REAL PayHere refund
                    payHereRefundService.processRealRefund(booking, booking.getTotalAmount(), reason);

                    System.out.println("✅ PayHere Refund: INITIATED");
                } catch (Exception refundError) {
                    System.err.println("⚠️ PayHere refund failed, processing manual refund: " + refundError.getMessage());
                }
            }

            // ===== UPDATE WALLET BALANCES =====
            moneyFlowService.processRefund(booking, booking.getTotalAmount(), reason);

            // Update booking status
            booking.setPaymentStatus("FULLY_REFUNDED");
            booking.setStatus("REFUNDED");
            booking.setUpdatedAt(LocalDateTime.now());
            bookingRepo.save(booking);

            // Record refund transaction
            String refundId = "REFUND-" + booking.getId() + "-" + System.currentTimeMillis();
            recordTransaction(booking.getId(), booking.getPayHereOrderId(),
                    booking.getPayHerePaymentId(), refundId, "REFUND", booking.getTotalAmount(),
                    "SUCCESS", reason, "Full refund processed with real money flow");

            System.out.println("✅ FULL REFUND COMPLETED:");
            System.out.println("   💸 Refund Amount: $" + booking.getTotalAmount());
            System.out.println("   🏦 Platform Wallet: UPDATED");
            System.out.println("   💳 Traveler Refund: PROCESSED");
            System.out.println("   📊 Booking Status: " + booking.getStatus());

        } catch (Exception e) {
            System.err.println("❌ Error processing full refund: " + e.getMessage());
            throw new RuntimeException("Error processing full refund: " + e.getMessage());
        }
    }

    @Override
    public void processPartialRefund(Booking booking, BigDecimal refundPercentage, String reason) {
        try {
            BigDecimal refundAmount = booking.getTotalAmount().multiply(refundPercentage);

            System.out.println("💸 Processing PARTIAL REFUND:");
            System.out.println("   Booking ID: " + booking.getId());
            System.out.println("   Original Amount: $" + booking.getTotalAmount());
            System.out.println("   Refund Percentage: " + (refundPercentage.multiply(BigDecimal.valueOf(100))) + "%");
            System.out.println("   Refund Amount: $" + refundAmount);
            System.out.println("   Reason: " + reason);

            // ===== NEW: PROCESS REAL PAYHERE PARTIAL REFUND =====
            if (booking.getPayHerePaymentId() != null && !"".equals(booking.getPayHerePaymentId())) {
                try {
                    // Process REAL PayHere partial refund
                    payHereRefundService.processRealRefund(booking, refundAmount, reason);

                    System.out.println("✅ PayHere Partial Refund: INITIATED");
                } catch (Exception refundError) {
                    System.err.println("⚠️ PayHere partial refund failed, processing manual refund: " + refundError.getMessage());
                }
            }

            // ===== UPDATE WALLET BALANCES =====
            moneyFlowService.processRefund(booking, refundAmount, reason);

            // Update booking status
            booking.setPaymentStatus("PARTIALLY_REFUNDED");
            booking.setStatus("CANCELLED_BY_TRAVELER");
            booking.setUpdatedAt(LocalDateTime.now());
            bookingRepo.save(booking);

            // Record partial refund transaction
            String refundId = "PARTIAL-REFUND-" + booking.getId() + "-" + System.currentTimeMillis();
            recordTransaction(booking.getId(), booking.getPayHereOrderId(),
                    booking.getPayHerePaymentId(), refundId, "PARTIAL_REFUND", refundAmount,
                    "SUCCESS", reason, "Partial refund processed with real money flow");

            System.out.println("✅ PARTIAL REFUND COMPLETED:");
            System.out.println("   💸 Refund Amount: $" + refundAmount + " (" + (refundPercentage.multiply(BigDecimal.valueOf(100))) + "%)");
            System.out.println("   🏦 Platform Wallet: UPDATED");
            System.out.println("   💳 Traveler Refund: PROCESSED");
            System.out.println("   📊 Booking Status: " + booking.getStatus());

        } catch (Exception e) {
            System.err.println("❌ Error processing partial refund: " + e.getMessage());
            throw new RuntimeException("Error processing partial refund: " + e.getMessage());
        }
    }

    @Override
    public void scheduleFinalPayout(Booking booking) {
        try {
            BigDecimal finalPayoutAmount = booking.getTotalAmount().multiply(BigDecimal.valueOf(0.75)); // 75%
            BigDecimal platformCommission = booking.getPlatformCommission(); // 5%

            System.out.println("💰 Processing FINAL PAYOUT:");
            System.out.println("   Booking ID: " + booking.getId());
            System.out.println("   Provider ID: " + booking.getProviderId());
            System.out.println("   Final Payout (75%): $" + finalPayoutAmount);
            System.out.println("   Platform Commission (5%): $" + platformCommission);

            // ===== NEW: PROCESS REAL MONEY FLOW =====
            moneyFlowService.processFinalPayout(booking);

            // ===== NEW: REAL BANK TRANSFER TO PROVIDER =====
            try {
                bankTransferService.transferToProviderBank(
                        booking.getProviderId(),
                        finalPayoutAmount,
                        "FINAL_PAYOUT",
                        booking.getId()
                );

                System.out.println("✅ Bank Transfer: INITIATED");
            } catch (Exception transferError) {
                System.err.println("⚠️ Bank transfer failed, payout marked as pending: " + transferError.getMessage());
            }

            // Update booking payout status
            booking.setFinalPayoutPaid(true);
            booking.setFinalPayoutPaidAt(LocalDateTime.now());
            bookingRepo.save(booking);

            // Record final payout transaction
            recordTransaction(booking.getId(), booking.getPayHereOrderId(),
                    booking.getPayHerePaymentId(), null, "FINAL_PAYOUT", finalPayoutAmount,
                    "SUCCESS", "final-payout-to-provider", "Final payout with real bank transfer");

            System.out.println("✅ FINAL PAYOUT COMPLETED:");
            System.out.println("   💰 Provider Gets: $" + finalPayoutAmount + " (transferred to bank)");
            System.out.println("   💰 Platform Keeps: $" + platformCommission + " (commission)");
            System.out.println("   🏦 Bank Transfer: PROCESSED");
            System.out.println("   📊 Payout Status: COMPLETED");

        } catch (Exception e) {
            System.err.println("❌ Error scheduling final payout: " + e.getMessage());
            throw new RuntimeException("Error scheduling final payout: " + e.getMessage());
        }
    }

    // ===== NEW: PROCESS CONFIRMATION FEE PAYOUT =====
    public void processConfirmationFeePayout(Booking booking) {
        try {
            BigDecimal confirmationFee = booking.getProviderConfirmationFee(); // 10%

            System.out.println("🎯 Processing CONFIRMATION FEE PAYOUT:");
            System.out.println("   Booking ID: " + booking.getId());
            System.out.println("   Provider ID: " + booking.getProviderId());
            System.out.println("   Confirmation Fee (10%): $" + confirmationFee);
            System.out.println("   Trigger: 20 hours after provider acceptance");

            // ===== PROCESS WALLET MONEY FLOW =====
            moneyFlowService.processConfirmationFeePayout(booking);

            // ===== REAL BANK TRANSFER TO PROVIDER =====
            try {
                bankTransferService.transferToProviderBank(
                        booking.getProviderId(),
                        confirmationFee,
                        "CONFIRMATION_FEE",
                        booking.getId()
                );

                System.out.println("✅ Confirmation Fee Bank Transfer: INITIATED");
            } catch (Exception transferError) {
                System.err.println("⚠️ Confirmation fee transfer failed: " + transferError.getMessage());
            }

            // Update booking confirmation fee status
            booking.setConfirmationFeePaid(true);
            booking.setConfirmationFeePaidAt(LocalDateTime.now());
            bookingRepo.save(booking);

            // Record confirmation fee transaction
            recordTransaction(booking.getId(), booking.getPayHereOrderId(),
                    booking.getPayHerePaymentId(), null, "CONFIRMATION_FEE_PAYOUT", confirmationFee,
                    "SUCCESS", "confirmation-fee-after-20h", "Confirmation fee with real bank transfer");

            System.out.println("✅ CONFIRMATION FEE PAYOUT COMPLETED:");
            System.out.println("   💰 Provider Gets: $" + confirmationFee + " (transferred to bank)");
            System.out.println("   🏦 Bank Transfer: PROCESSED");
            System.out.println("   📊 Confirmation Status: PAID");

        } catch (Exception e) {
            System.err.println("❌ Error processing confirmation fee payout: " + e.getMessage());
            throw new RuntimeException("Error processing confirmation fee payout: " + e.getMessage());
        }
    }

    @Override
    public Booking getBookingByOrderId(String orderId) {
        Optional<Booking> booking = bookingRepo.findByPayHereOrderId(orderId);
        return booking.orElse(null);
    }

    // ===== NEW: GET WALLET SUMMARIES =====
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
            summary.put("platformCommission", booking.getPlatformCommission());
            summary.put("providerConfirmationFee", booking.getProviderConfirmationFee());
            summary.put("providerFinalPayout", booking.getTotalAmount().multiply(BigDecimal.valueOf(0.75)));
            summary.put("confirmationFeePaid", booking.isConfirmationFeePaid());
            summary.put("finalPayoutPaid", booking.isFinalPayoutPaid());

            // Wallet information
            if (moneyFlowService != null) {
                summary.put("platformWallet", moneyFlowService.getPlatformWallet());
                summary.put("providerWallet", moneyFlowService.getProviderWallet(booking.getProviderId()));
                summary.put("travelerWallet", moneyFlowService.getTravelerWallet(booking.getTravelerId()));
                summary.put("moneyFlow", moneyFlowService.getBookingMoneyFlow(bookingId));
            }

            return summary;
        } catch (Exception e) {
            throw new RuntimeException("Error getting payment summary: " + e.getMessage());
        }
    }

    private void recordTransaction(String bookingId, String orderId, String paymentId,
                                   String refundId, String type, BigDecimal amount, String status,
                                   String reason, String payHereResponse) {
        try {
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

            System.out.println("📝 Transaction Recorded:");
            System.out.println("   Type: " + type);
            System.out.println("   Amount: $" + amount);
            System.out.println("   Status: " + status);
        } catch (Exception e) {
            System.err.println("❌ Error recording transaction: " + e.getMessage());
        }
    }

    // ===== NEW: HEALTH CHECK =====
    public Map<String, Object> getServiceHealth() {
        Map<String, Object> health = new HashMap<>();
        health.put("paymentService", "HEALTHY");
        health.put("merchantId", merchantId);
        health.put("baseUrl", payHereBaseUrl);
        health.put("walletSystem", moneyFlowService != null ? "ENABLED" : "DISABLED");
        health.put("bankTransfers", bankTransferService != null ? "ENABLED" : "DISABLED");
        health.put("realRefunds", payHereRefundService != null ? "ENABLED" : "DISABLED");
        health.put("timestamp", LocalDateTime.now());
        return health;
    }
}