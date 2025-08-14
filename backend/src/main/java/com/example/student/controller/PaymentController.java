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
}