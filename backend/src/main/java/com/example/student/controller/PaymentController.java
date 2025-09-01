package com.example.student.controller;

import com.example.student.services.IPaymentService;
import com.example.student.services.IBookingService;
import com.example.student.services.IMoneyFlowService;
import com.example.student.services.ITravelerWalletService;
import com.example.student.model.Booking;
import com.example.student.model.MoneyFlow;
import com.example.student.model.TravelerWallet;
import com.example.student.model.PaymentTransaction;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.ArrayList;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(
        originPatterns = "*",
        allowCredentials = "false",
        methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS}
)
public class PaymentController {

    private static final Logger logger = LoggerFactory.getLogger(PaymentController.class);

    @Autowired
    private IPaymentService paymentService;

    @Autowired
    private IBookingService bookingService;

    @Autowired
    private IMoneyFlowService moneyFlowService;

    @Autowired
    private ITravelerWalletService travelerWalletService;

    // ===== NEW PAYMENT STATUS CHECKING ENDPOINTS =====

    /**
     * ✅ Check payment status in database
     * POST /api/payments/status/check
     */
    @PostMapping("/status/check")
    public ResponseEntity<?> checkPaymentStatus(@RequestBody PaymentStatusRequest request) {
        try {
            logger.info("🔍 Payment status check requested:");
            logger.info("  - Order ID: {}", request.getOrderId());
            logger.info("  - Booking ID: {}", request.getBookingId());
            logger.info("  - Currency: {}", request.getCurrency());
            logger.info("  - Timestamp: {}", LocalDateTime.now());

            // ✅ Validate request
            if (request.getOrderId() == null || request.getOrderId().trim().isEmpty()) {
                logger.warn("❌ Invalid request: Order ID is missing");
                return ResponseEntity.badRequest().body(
                        PaymentStatusResponse.builder()
                                .success(false)
                                .message("Order ID is required")
                                .status("INVALID_REQUEST")
                                .build()
                );
            }

            // ✅ Enforce LKR currency validation
            if (request.getCurrency() != null && !"LKR".equals(request.getCurrency())) {
                logger.warn("❌ Invalid currency: {}. Only LKR is supported", request.getCurrency());
                return ResponseEntity.badRequest().body(
                        PaymentStatusResponse.builder()
                                .success(false)
                                .message("Only LKR currency is supported")
                                .status("INVALID_CURRENCY")
                                .currency("LKR")
                                .build()
                );
            }

            // ✅ Search for payment by Order ID (primary method)
            Optional<PaymentTransaction> paymentOpt = paymentService.findByOrderId(request.getOrderId());

            if (paymentOpt.isPresent()) {
                PaymentTransaction payment = paymentOpt.get();
                logger.info("✅ Payment found by Order ID:");
                logger.info("  - Payment ID: {}", payment.getPaymentId());
                logger.info("  - Status: {}", payment.getStatus());
                logger.info("  - Amount: {} {}", payment.getAmount(), payment.getCurrency());
                logger.info("  - Created: {}", payment.getCreatedAt());
                logger.info("  - Updated: {}", payment.getUpdatedAt());

                // ✅ Check if payment is successful
                boolean isSuccessful = isPaymentSuccessful(payment.getStatus());

                PaymentStatusResponse response = PaymentStatusResponse.builder()
                        .success(true)
                        .status(payment.getStatus())
                        .paymentStatus(payment.getStatus())
                        .orderId(payment.getOrderId())
                        .paymentId(payment.getPaymentId())
                        .transactionId(payment.getTransactionId())
                        .amount(payment.getAmount().toString())
                        .currency(payment.getCurrency())
                        .bookingId(payment.getBookingId())
                        .createdAt(payment.getCreatedAt())
                        .updatedAt(payment.getUpdatedAt())
                        .message(isSuccessful ? "Payment confirmed successfully" : "Payment is still processing")
                        .confirmed(isSuccessful)
                        .build();

                logger.info("📊 Payment status response: {}", isSuccessful ? "SUCCESS" : "PENDING");
                return ResponseEntity.ok(response);
            }

            // ✅ Fallback: Search by Booking ID if provided
            if (request.getBookingId() != null && !request.getBookingId().trim().isEmpty()) {
                logger.info("🔍 Payment not found by Order ID, checking by Booking ID...");

                Optional<PaymentTransaction> paymentByBookingOpt = paymentService.findByBookingId(request.getBookingId());

                if (paymentByBookingOpt.isPresent()) {
                    PaymentTransaction payment = paymentByBookingOpt.get();
                    logger.info("✅ Payment found by Booking ID:");
                    logger.info("  - Payment ID: {}", payment.getPaymentId());
                    logger.info("  - Order ID: {}", payment.getOrderId());
                    logger.info("  - Status: {}", payment.getStatus());

                    boolean isSuccessful = isPaymentSuccessful(payment.getStatus());

                    PaymentStatusResponse response = PaymentStatusResponse.builder()
                            .success(true)
                            .status(payment.getStatus())
                            .paymentStatus(payment.getStatus())
                            .orderId(payment.getOrderId())
                            .paymentId(payment.getPaymentId())
                            .transactionId(payment.getTransactionId())
                            .amount(payment.getAmount().toString())
                            .currency(payment.getCurrency())
                            .bookingId(payment.getBookingId())
                            .createdAt(payment.getCreatedAt())
                            .updatedAt(payment.getUpdatedAt())
                            .message(isSuccessful ? "Payment confirmed successfully" : "Payment is still processing")
                            .confirmed(isSuccessful)
                            .build();

                    return ResponseEntity.ok(response);
                }
            }

            // ✅ Check if booking exists but no payment record yet
            if (request.getBookingId() != null && !request.getBookingId().trim().isEmpty()) {
                Optional<Booking> bookingOpt = bookingService.getBookingById(request.getBookingId());

                if (bookingOpt.isPresent()) {
                    Booking booking = bookingOpt.get();
                    logger.info("📝 Booking found but no payment record:");
                    logger.info("  - Booking ID: {}", booking.getId());
                    logger.info("  - Booking Status: {}", booking.getStatus());
                    logger.info("  - Amount: {} {}", booking.getTotalAmount(), booking.getCurrency());

                    PaymentStatusResponse response = PaymentStatusResponse.builder()
                            .success(true)
                            .status("PENDING")
                            .paymentStatus("PENDING")
                            .orderId(request.getOrderId())
                            .bookingId(booking.getId())
                            .amount(booking.getTotalAmount().toString())
                            .currency(booking.getCurrency())
                            .message("Payment is being processed. Please wait...")
                            .confirmed(false)
                            .build();

                    return ResponseEntity.ok(response);
                }
            }

            // ✅ No payment or booking found
            logger.warn("❌ No payment or booking found:");
            logger.warn("  - Order ID: {}", request.getOrderId());
            logger.warn("  - Booking ID: {}", request.getBookingId());

            PaymentStatusResponse response = PaymentStatusResponse.builder()
                    .success(false)
                    .status("NOT_FOUND")
                    .paymentStatus("NOT_FOUND")
                    .orderId(request.getOrderId())
                    .bookingId(request.getBookingId())
                    .message("Payment record not found. Please verify your Order ID or contact support.")
                    .confirmed(false)
                    .build();

            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);

        } catch (Exception e) {
            logger.error("❌ Error checking payment status:", e);

            PaymentStatusResponse errorResponse = PaymentStatusResponse.builder()
                    .success(false)
                    .status("ERROR")
                    .paymentStatus("ERROR")
                    .orderId(request.getOrderId())
                    .bookingId(request.getBookingId())
                    .message("Internal server error while checking payment status")
                    .confirmed(false)
                    .error(e.getMessage())
                    .build();

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    /**
     * ✅ Get detailed payment information
     * GET /api/payments/status/{orderId}
     */
    @GetMapping("/status/{orderId}")
    public ResponseEntity<?> getPaymentDetails(@PathVariable String orderId) {
        try {
            logger.info("🔍 Payment details requested for Order ID: {}", orderId);

            Optional<PaymentTransaction> paymentOpt = paymentService.findByOrderId(orderId);

            if (paymentOpt.isPresent()) {
                PaymentTransaction payment = paymentOpt.get();
                boolean isSuccessful = isPaymentSuccessful(payment.getStatus());

                PaymentStatusResponse response = PaymentStatusResponse.builder()
                        .success(true)
                        .status(payment.getStatus())
                        .paymentStatus(payment.getStatus())
                        .orderId(payment.getOrderId())
                        .paymentId(payment.getPaymentId())
                        .transactionId(payment.getTransactionId())
                        .amount(payment.getAmount().toString())
                        .currency(payment.getCurrency())
                        .bookingId(payment.getBookingId())
                        .createdAt(payment.getCreatedAt())
                        .updatedAt(payment.getUpdatedAt())
                        .message(isSuccessful ? "Payment confirmed successfully" : "Payment is still processing")
                        .confirmed(isSuccessful)
                        .build();

                return ResponseEntity.ok(response);
            }

            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    PaymentStatusResponse.builder()
                            .success(false)
                            .status("NOT_FOUND")
                            .orderId(orderId)
                            .message("Payment not found")
                            .confirmed(false)
                            .build()
            );

        } catch (Exception e) {
            logger.error("❌ Error getting payment details:", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    PaymentStatusResponse.builder()
                            .success(false)
                            .status("ERROR")
                            .orderId(orderId)
                            .message("Internal server error")
                            .confirmed(false)
                            .error(e.getMessage())
                            .build()
            );
        }
    }

    /**
     * ✅ Bulk status check for multiple payments
     * POST /api/payments/status/bulk-check
     */
    @PostMapping("/status/bulk-check")
    public ResponseEntity<?> bulkCheckPaymentStatus(@RequestBody BulkPaymentStatusRequest request) {
        try {
            logger.info("🔍 Bulk payment status check for {} payments", request.getOrderIds().size());

            List<PaymentStatusResponse> responses = new ArrayList<>();

            for (String orderId : request.getOrderIds()) {
                Optional<PaymentTransaction> paymentOpt = paymentService.findByOrderId(orderId);

                if (paymentOpt.isPresent()) {
                    PaymentTransaction payment = paymentOpt.get();
                    boolean isSuccessful = isPaymentSuccessful(payment.getStatus());

                    responses.add(PaymentStatusResponse.builder()
                            .success(true)
                            .status(payment.getStatus())
                            .paymentStatus(payment.getStatus())
                            .orderId(payment.getOrderId())
                            .paymentId(payment.getPaymentId())
                            .amount(payment.getAmount().toString())
                            .currency(payment.getCurrency())
                            .confirmed(isSuccessful)
                            .build());
                } else {
                    responses.add(PaymentStatusResponse.builder()
                            .success(false)
                            .status("NOT_FOUND")
                            .orderId(orderId)
                            .confirmed(false)
                            .build());
                }
            }

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "count", responses.size(),
                    "payments", responses
            ));

        } catch (Exception e) {
            logger.error("❌ Error in bulk payment status check:", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    Map.of(
                            "success", false,
                            "error", e.getMessage()
                    )
            );
        }
    }

    /**
     * ✅ Enhanced health check endpoint for payment status service
     * GET /api/payments/status/health
     */
    @GetMapping("/status/health")
    public ResponseEntity<?> paymentStatusHealthCheck() {
        try {
            Map<String, Object> health = new HashMap<>();
            health.put("status", "UP");
            health.put("service", "PaymentStatusService");
            health.put("timestamp", LocalDateTime.now());
            health.put("currency", "LKR");
            health.put("message", "Payment status service is running");

            // Test database connectivity
            try {
                long paymentCount = paymentService.getTotalPaymentCount();
                health.put("totalPayments", paymentCount);
                health.put("databaseConnectivity", "UP");
            } catch (Exception e) {
                health.put("databaseConnectivity", "DOWN");
                health.put("databaseError", e.getMessage());
                health.put("status", "DEGRADED");
            }

            return ResponseEntity.ok(health);
        } catch (Exception e) {
            logger.error("❌ Error in payment status health check:", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    Map.of(
                            "status", "DOWN",
                            "error", e.getMessage(),
                            "timestamp", LocalDateTime.now()
                    )
            );
        }
    }

    /**
     * ✅ Update payment status (for webhook/manual updates)
     * PUT /api/payments/status/update
     */
    @PutMapping("/status/update")
    public ResponseEntity<?> updatePaymentStatus(@RequestBody UpdatePaymentStatusRequest request) {
        try {
            logger.info("🔄 Payment status update requested:");
            logger.info("  - Order ID: {}", request.getOrderId());
            logger.info("  - New Status: {}", request.getNewStatus());
            logger.info("  - Update Source: {}", request.getSource());

            // Validate request
            if (request.getOrderId() == null || request.getNewStatus() == null) {
                return ResponseEntity.badRequest().body(
                        createErrorResponse("Order ID and new status are required")
                );
            }

            // Find payment
            Optional<PaymentTransaction> paymentOpt = paymentService.findByOrderId(request.getOrderId());
            if (!paymentOpt.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                        createErrorResponse("Payment not found")
                );
            }

            PaymentTransaction payment = paymentOpt.get();
            String oldStatus = payment.getStatus();

            // Update payment status
            paymentService.updatePaymentStatus(payment, request.getNewStatus(), request.getSource(), request.getTransactionId());

            logger.info("✅ Payment status updated: {} -> {}", oldStatus, request.getNewStatus());

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Payment status updated successfully");
            response.put("orderId", request.getOrderId());
            response.put("oldStatus", oldStatus);
            response.put("newStatus", request.getNewStatus());
            response.put("updatedAt", LocalDateTime.now());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            logger.error("❌ Error updating payment status:", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    createErrorResponse("Error updating payment status: " + e.getMessage())
            );
        }
    }

    /**
     * ✅ Get payment history for a booking
     * GET /api/payments/history/{bookingId}
     */
    @GetMapping("/history/{bookingId}")
    public ResponseEntity<?> getPaymentHistory(@PathVariable String bookingId) {
        try {
            logger.info("📜 Payment history requested for booking: {}", bookingId);

            List<PaymentTransaction> payments = paymentService.findAllByBookingId(bookingId);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("bookingId", bookingId);
            response.put("paymentCount", payments.size());
            response.put("payments", payments);

            // Add summary
            Map<String, Object> summary = new HashMap<>();
            summary.put("totalAttempts", payments.size());
            summary.put("successfulPayments", payments.stream()
                    .mapToLong(p -> isPaymentSuccessful(p.getStatus()) ? 1 : 0).sum());
            summary.put("latestStatus", payments.isEmpty() ? "NO_PAYMENTS" :
                    payments.get(payments.size() - 1).getStatus());
            response.put("summary", summary);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            logger.error("❌ Error getting payment history:", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    createErrorResponse("Error getting payment history: " + e.getMessage())
            );
        }
    }

    // ===== GENERAL PAYMENT MANAGEMENT ENDPOINTS =====

    /**
     * Get payment summary for a booking
     */
    @GetMapping("/summary/{bookingId}")
    public ResponseEntity<?> getPaymentSummary(@PathVariable("bookingId") String bookingId) {
        try {
            logger.info("Getting payment summary for booking: {}", bookingId);

            Optional<Booking> optBooking = bookingService.getBookingById(bookingId);
            if (!optBooking.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(createErrorResponse("Booking not found"));
            }

            Booking booking = optBooking.get();
            Map<String, Object> summary = createPaymentSummary(booking);

            return ResponseEntity.ok(summary);
        } catch (Exception e) {
            logger.error("Error getting payment summary for booking: {}", bookingId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Error getting payment summary: " + e.getMessage()));
        }
    }

    /**
     * Get money flow records for a booking
     */
    @GetMapping("/money-flow/{bookingId}")
    public ResponseEntity<?> getMoneyFlow(@PathVariable("bookingId") String bookingId) {
        try {
            logger.info("Getting money flow for booking: {}", bookingId);

            List<MoneyFlow> moneyFlows = moneyFlowService.findByBookingId(bookingId);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("bookingId", bookingId);
            response.put("moneyFlows", moneyFlows);
            response.put("totalFlows", moneyFlows.size());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error getting money flow for booking: {}", bookingId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Error getting money flow: " + e.getMessage()));
        }
    }

    /**
     * Get traveler wallet information
     */
    @GetMapping("/wallet/{travelerId}")
    public ResponseEntity<?> getTravelerWallet(@PathVariable("travelerId") String travelerId) {
        try {
            logger.info("Getting wallet for traveler: {}", travelerId);

            Optional<TravelerWallet> optWallet = travelerWalletService.findByTravelerId(travelerId);

            if (!optWallet.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(createErrorResponse("Wallet not found for traveler"));
            }

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("wallet", optWallet.get());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error getting wallet for traveler: {}", travelerId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Error getting wallet: " + e.getMessage()));
        }
    }

    // ===== REFUND MANAGEMENT ENDPOINTS =====

    /**
     * Process full refund for a booking
     */
    @PostMapping("/refund/full/{bookingId}")
    public ResponseEntity<?> processFullRefund(
            @PathVariable("bookingId") String bookingId,
            @RequestParam(defaultValue = "Full refund requested") String reason) {
        try {
            logger.info("Processing full refund for booking: {}", bookingId);

            Optional<Booking> optBooking = bookingService.getBookingById(bookingId);
            if (!optBooking.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(createErrorResponse("Booking not found"));
            }

            Booking booking = optBooking.get();

            // Validate refund eligibility
            if (!isRefundEligible(booking)) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(createErrorResponse("Booking is not eligible for refund"));
            }

            // Process refund
            paymentService.processFullRefund(booking, reason);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Full refund processed successfully");
            response.put("refundAmount", booking.getTotalAmount());
            response.put("currency", booking.getCurrency());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error processing full refund for booking: {}", bookingId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Error processing refund: " + e.getMessage()));
        }
    }

    /**
     * Process partial refund for a booking
     */
    @PostMapping("/refund/partial/{bookingId}")
    public ResponseEntity<?> processPartialRefund(
            @PathVariable("bookingId") String bookingId,
            @RequestParam BigDecimal refundPercentage,
            @RequestParam(defaultValue = "Partial refund requested") String reason) {
        try {
            logger.info("Processing partial refund for booking: {} ({}%)", bookingId, refundPercentage.multiply(BigDecimal.valueOf(100)));

            // Validate refund percentage
            if (refundPercentage.compareTo(BigDecimal.ZERO) <= 0 || refundPercentage.compareTo(BigDecimal.ONE) > 0) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(createErrorResponse("Refund percentage must be between 0.01 and 1.0"));
            }

            Optional<Booking> optBooking = bookingService.getBookingById(bookingId);
            if (!optBooking.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(createErrorResponse("Booking not found"));
            }

            Booking booking = optBooking.get();

            // Validate refund eligibility
            if (!isRefundEligible(booking)) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(createErrorResponse("Booking is not eligible for refund"));
            }

            // Process partial refund
            paymentService.processPartialRefund(booking, refundPercentage, reason);

            BigDecimal refundAmount = booking.getTotalAmount().multiply(refundPercentage);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Partial refund processed successfully");
            response.put("refundAmount", refundAmount);
            response.put("refundPercentage", refundPercentage.multiply(BigDecimal.valueOf(100)) + "%");
            response.put("currency", booking.getCurrency());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error processing partial refund for booking: {}", bookingId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Error processing partial refund: " + e.getMessage()));
        }
    }

    // ===== PAYOUT MANAGEMENT ENDPOINTS =====

    /**
     * Process confirmation fee payout to provider
     */
    @PostMapping("/payout/confirmation-fee/{bookingId}")
    public ResponseEntity<?> processConfirmationFeePayout(@PathVariable("bookingId") String bookingId) {
        try {
            logger.info("Processing confirmation fee payout for booking: {}", bookingId);

            Optional<Booking> optBooking = bookingService.getBookingById(bookingId);
            if (!optBooking.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(createErrorResponse("Booking not found"));
            }

            Booking booking = optBooking.get();

            // Validate booking status
            if (!"CONFIRMED".equals(booking.getStatus())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(createErrorResponse("Booking must be confirmed before processing confirmation fee"));
            }

            if (booking.isConfirmationFeePaid()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(createErrorResponse("Confirmation fee already paid"));
            }

            // Process confirmation fee payout
            paymentService.processConfirmationFeePayout(booking);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Confirmation fee payout processed successfully");
            response.put("payoutAmount", booking.getProviderConfirmationFee());
            response.put("currency", booking.getCurrency());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error processing confirmation fee payout for booking: {}", bookingId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Error processing confirmation fee: " + e.getMessage()));
        }
    }

    /**
     * Process final payout to provider
     */
    @PostMapping("/payout/final/{bookingId}")
    public ResponseEntity<?> processFinalPayout(@PathVariable("bookingId") String bookingId) {
        try {
            logger.info("Processing final payout for booking: {}", bookingId);

            Optional<Booking> optBooking = bookingService.getBookingById(bookingId);
            if (!optBooking.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(createErrorResponse("Booking not found"));
            }

            Booking booking = optBooking.get();

            // Validate booking status
            if (!"COMPLETED".equals(booking.getStatus())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(createErrorResponse("Booking must be completed before processing final payout"));
            }

            if (booking.isFinalPayoutPaid()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(createErrorResponse("Final payout already paid"));
            }

            // Process final payout
            paymentService.processFinalPayout(booking);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Final payout processed successfully");
            response.put("payoutAmount", booking.calculateFinalPayout());
            response.put("currency", booking.getCurrency());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error processing final payout for booking: {}", bookingId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Error processing final payout: " + e.getMessage()));
        }
    }

    // ===== VALIDATION AND REPORTING ENDPOINTS =====

    /**
     * Validate money flow for a booking
     */
    @GetMapping("/validate/{bookingId}")
    public ResponseEntity<?> validateMoneyFlow(@PathVariable("bookingId") String bookingId) {
        try {
            logger.info("Validating money flow for booking: {}", bookingId);

            Optional<Booking> optBooking = bookingService.getBookingById(bookingId);
            if (!optBooking.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(createErrorResponse("Booking not found"));
            }

            Booking booking = optBooking.get();
            Map<String, Object> validation = validateBookingMoneyFlow(booking);

            return ResponseEntity.ok(validation);
        } catch (Exception e) {
            logger.error("Error validating money flow for booking: {}", bookingId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Error validating money flow: " + e.getMessage()));
        }
    }

    /**
     * Get payment service health status
     */
    @GetMapping("/health")
    public ResponseEntity<?> getPaymentServiceHealth() {
        try {
            Map<String, Object> health = new HashMap<>();
            health.put("status", "HEALTHY");
            health.put("service", "PaymentController");
            health.put("timestamp", LocalDateTime.now().toString());
            health.put("supportedCurrency", "LKR");
            health.put("availableEndpoints", getAvailableEndpoints());

            // Add service-specific health checks
            try {
                Map<String, Object> serviceHealth = paymentService.getServiceHealth();
                health.put("serviceHealth", serviceHealth);
            } catch (Exception e) {
                health.put("serviceHealthError", e.getMessage());
                health.put("status", "DEGRADED");
            }

            return ResponseEntity.ok(health);
        } catch (Exception e) {
            logger.error("Error getting payment service health", e);
            Map<String, Object> errorHealth = new HashMap<>();
            errorHealth.put("status", "ERROR");
            errorHealth.put("message", e.getMessage());
            errorHealth.put("timestamp", LocalDateTime.now().toString());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorHealth);
        }
    }

    // ===== HELPER METHODS =====

    /**
     * ✅ Helper method to determine if payment status indicates success
     */
    private boolean isPaymentSuccessful(String status) {
        if (status == null) return false;

        String normalizedStatus = status.toUpperCase().trim();

        return normalizedStatus.equals("SUCCESS") ||
                normalizedStatus.equals("COMPLETED") ||
                normalizedStatus.equals("CONFIRMED") ||
                normalizedStatus.equals("PAID") ||
                normalizedStatus.equals("APPROVED");
    }

    private Map<String, Object> createPaymentSummary(Booking booking) {
        Map<String, Object> summary = new HashMap<>();

        summary.put("bookingId", booking.getId());
        summary.put("totalAmount", booking.getTotalAmount());
        summary.put("currency", booking.getCurrency());
        summary.put("paymentStatus", booking.getPaymentStatus());
        summary.put("bookingStatus", booking.getStatus());

        // Financial breakdown
        Map<String, Object> breakdown = new HashMap<>();
        breakdown.put("platformCommission", booking.getPlatformCommission());
        breakdown.put("confirmationFee", booking.getProviderConfirmationFee());
        breakdown.put("finalPayout", booking.calculateFinalPayout());
        summary.put("financialBreakdown", breakdown);

        // Payment tracking
        Map<String, Object> tracking = new HashMap<>();
        tracking.put("payHereOrderId", booking.getPayHereOrderId());
        tracking.put("payHerePaymentId", booking.getPayHerePaymentId());
        tracking.put("confirmationFeePaid", booking.isConfirmationFeePaid());
        tracking.put("finalPayoutPaid", booking.isFinalPayoutPaid());
        summary.put("paymentTracking", tracking);

        // Timestamps
        Map<String, Object> timestamps = new HashMap<>();
        timestamps.put("createdAt", booking.getCreatedAt());
        timestamps.put("updatedAt", booking.getUpdatedAt());
        timestamps.put("confirmationFeePaidAt", booking.getConfirmationFeePaidAt());
        timestamps.put("finalPayoutPaidAt", booking.getFinalPayoutPaidAt());
        summary.put("timestamps", timestamps);

        return summary;
    }

    private Map<String, Object> validateBookingMoneyFlow(Booking booking) {
        Map<String, Object> validation = new HashMap<>();

        BigDecimal totalAmount = booking.getTotalAmount();
        BigDecimal platformCommission = booking.getPlatformCommission();
        BigDecimal confirmationFee = booking.getProviderConfirmationFee();
        BigDecimal finalPayout = booking.calculateFinalPayout();

        validation.put("bookingId", booking.getId());
        validation.put("totalAmount", totalAmount);

        // Expected breakdown
        Map<String, Object> expectedBreakdown = new HashMap<>();
        expectedBreakdown.put("platformCommission", platformCommission);
        expectedBreakdown.put("confirmationFee", confirmationFee);
        expectedBreakdown.put("finalPayout", finalPayout);
        expectedBreakdown.put("total", platformCommission.add(confirmationFee).add(finalPayout));
        validation.put("expectedBreakdown", expectedBreakdown);

        // Math validation
        BigDecimal calculatedTotal = platformCommission.add(confirmationFee).add(finalPayout);
        validation.put("mathValid", calculatedTotal.equals(totalAmount));
        validation.put("difference", totalAmount.subtract(calculatedTotal));

        // Status validation
        validation.put("paymentStatus", booking.getPaymentStatus());
        validation.put("bookingStatus", booking.getStatus());
        validation.put("confirmationFeePaid", booking.isConfirmationFeePaid());
        validation.put("finalPayoutPaid", booking.isFinalPayoutPaid());

        // Business rule validation
        validation.put("needsConfirmationFeePayout", booking.needsConfirmationFeePayout());
        validation.put("needsFinalPayout", booking.needsFinalPayout());
        validation.put("canBeCancelledByTraveler", booking.canBeCancelledByTraveler());
        validation.put("isWithinRefundWindow", booking.isWithinRefundWindow());

        return validation;
    }

    private boolean isRefundEligible(Booking booking) {
        return "SUCCESS".equals(booking.getPaymentStatus()) &&
                !booking.isCancelled() &&
                booking.isWithinRefundWindow();
    }

    private Map<String, Object> createErrorResponse(String message) {
        Map<String, Object> error = new HashMap<>();
        error.put("success", false);
        error.put("message", message);
        error.put("timestamp", LocalDateTime.now().toString());
        return error;
    }

    private List<String> getAvailableEndpoints() {
        return List.of(
                // New Payment Status Endpoints
                "POST /api/payments/status/check",
                "GET /api/payments/status/{orderId}",
                "POST /api/payments/status/bulk-check",
                "GET /api/payments/status/health",
                "PUT /api/payments/status/update",
                "GET /api/payments/history/{bookingId}",
                // Existing Endpoints
                "GET /api/payments/summary/{bookingId}",
                "GET /api/payments/money-flow/{bookingId}",
                "GET /api/payments/wallet/{travelerId}",
                "POST /api/payments/refund/full/{bookingId}",
                "POST /api/payments/refund/partial/{bookingId}",
                "POST /api/payments/payout/confirmation-fee/{bookingId}",
                "POST /api/payments/payout/final/{bookingId}",
                "GET /api/payments/validate/{bookingId}",
                "GET /api/payments/health"
        );
    }

    // ===== NEW DTO CLASSES FOR PAYMENT STATUS =====

    /**
     * ✅ Request DTO for payment status check
     */
    public static class PaymentStatusRequest {
        private String orderId;
        private String bookingId;
        private String currency;

        // Constructors
        public PaymentStatusRequest() {}

        public PaymentStatusRequest(String orderId, String bookingId, String currency) {
            this.orderId = orderId;
            this.bookingId = bookingId;
            this.currency = currency;
        }

        // Getters and Setters
        public String getOrderId() { return orderId; }
        public void setOrderId(String orderId) { this.orderId = orderId; }

        public String getBookingId() { return bookingId; }
        public void setBookingId(String bookingId) { this.bookingId = bookingId; }

        public String getCurrency() { return currency; }
        public void setCurrency(String currency) { this.currency = currency; }
    }

    /**
     * ✅ Response DTO for payment status
     */
    public static class PaymentStatusResponse {
        private boolean success;
        private String status;
        private String paymentStatus;
        private String orderId;
        private String paymentId;
        private String transactionId;
        private String amount;
        private String currency;
        private String bookingId;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
        private String message;
        private boolean confirmed;
        private String error;

        // Builder pattern
        public static Builder builder() {
            return new Builder();
        }

        public static class Builder {
            private PaymentStatusResponse response = new PaymentStatusResponse();

            public Builder success(boolean success) {
                response.success = success;
                return this;
            }

            public Builder status(String status) {
                response.status = status;
                return this;
            }

            public Builder paymentStatus(String paymentStatus) {
                response.paymentStatus = paymentStatus;
                return this;
            }

            public Builder orderId(String orderId) {
                response.orderId = orderId;
                return this;
            }

            public Builder paymentId(String paymentId) {
                response.paymentId = paymentId;
                return this;
            }

            public Builder transactionId(String transactionId) {
                response.transactionId = transactionId;
                return this;
            }

            public Builder amount(String amount) {
                response.amount = amount;
                return this;
            }

            public Builder currency(String currency) {
                response.currency = currency;
                return this;
            }

            public Builder bookingId(String bookingId) {
                response.bookingId = bookingId;
                return this;
            }

            public Builder createdAt(LocalDateTime createdAt) {
                response.createdAt = createdAt;
                return this;
            }

            public Builder updatedAt(LocalDateTime updatedAt) {
                response.updatedAt = updatedAt;
                return this;
            }

            public Builder message(String message) {
                response.message = message;
                return this;
            }

            public Builder confirmed(boolean confirmed) {
                response.confirmed = confirmed;
                return this;
            }

            public Builder error(String error) {
                response.error = error;
                return this;
            }

            public PaymentStatusResponse build() {
                return response;
            }
        }

        // Getters and Setters
        public boolean isSuccess() { return success; }
        public void setSuccess(boolean success) { this.success = success; }

        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }

        public String getPaymentStatus() { return paymentStatus; }
        public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }

        public String getOrderId() { return orderId; }
        public void setOrderId(String orderId) { this.orderId = orderId; }

        public String getPaymentId() { return paymentId; }
        public void setPaymentId(String paymentId) { this.paymentId = paymentId; }

        public String getTransactionId() { return transactionId; }
        public void setTransactionId(String transactionId) { this.transactionId = transactionId; }

        public String getAmount() { return amount; }
        public void setAmount(String amount) { this.amount = amount; }

        public String getCurrency() { return currency; }
        public void setCurrency(String currency) { this.currency = currency; }

        public String getBookingId() { return bookingId; }
        public void setBookingId(String bookingId) { this.bookingId = bookingId; }

        public LocalDateTime getCreatedAt() { return createdAt; }
        public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

        public LocalDateTime getUpdatedAt() { return updatedAt; }
        public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }

        public boolean isConfirmed() { return confirmed; }
        public void setConfirmed(boolean confirmed) { this.confirmed = confirmed; }

        public String getError() { return error; }
        public void setError(String error) { this.error = error; }
    }

    /**
     * ✅ Request DTO for bulk payment status check
     */
    public static class BulkPaymentStatusRequest {
        private List<String> orderIds;

        public BulkPaymentStatusRequest() {}

        public BulkPaymentStatusRequest(List<String> orderIds) {
            this.orderIds = orderIds;
        }

        public List<String> getOrderIds() { return orderIds; }
        public void setOrderIds(List<String> orderIds) { this.orderIds = orderIds; }
    }

    /**
     * ✅ Request DTO for updating payment status
     */
    public static class UpdatePaymentStatusRequest {
        private String orderId;
        private String newStatus;
        private String source;
        private String transactionId;

        public UpdatePaymentStatusRequest() {}

        public UpdatePaymentStatusRequest(String orderId, String newStatus, String source, String transactionId) {
            this.orderId = orderId;
            this.newStatus = newStatus;
            this.source = source;
            this.transactionId = transactionId;
        }

        // Getters and Setters
        public String getOrderId() { return orderId; }
        public void setOrderId(String orderId) { this.orderId = orderId; }

        public String getNewStatus() { return newStatus; }
        public void setNewStatus(String newStatus) { this.newStatus = newStatus; }

        public String getSource() { return source; }
        public void setSource(String source) { this.source = source; }

        public String getTransactionId() { return transactionId; }
        public void setTransactionId(String transactionId) { this.transactionId = transactionId; }
    }
}