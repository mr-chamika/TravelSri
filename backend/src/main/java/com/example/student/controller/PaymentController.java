package com.example.student.controller;

import com.example.student.model.dto.PayHereSessionResponse;
import com.example.student.model.dto.PaymentSessionRequest;
import com.example.student.services.IPaymentService;
import com.example.student.services.IBookingService;
import com.example.student.model.Booking;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(
        originPatterns = "*", // Use originPatterns instead of origins
        allowCredentials = "false", // Set to false
        methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.OPTIONS}
)
public class PaymentController {

    @Autowired
    private IPaymentService paymentService;

    @Autowired
    private IBookingService bookingService;

    // REMOVED: Duplicate endpoints that conflict with PayHereController:
    // - /payhere/create-checkout (now only in PayHereController)
    // - /payhere/status/{orderId} (now only in PayHereController)

    // ===== ADMINISTRATIVE AND TESTING ENDPOINTS =====

    @GetMapping("/payhere/health")
    public ResponseEntity<?> getServiceHealth() {
        try {
            Map<String, Object> health = paymentService.getServiceHealth();
            return new ResponseEntity<>(health, HttpStatus.OK);
        } catch (Exception e) {
            Map<String, String> errorResponse = new java.util.HashMap<>();
            errorResponse.put("status", "ERROR");
            errorResponse.put("message", e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/payhere/summary/{bookingId}")
    public ResponseEntity<?> getPaymentSummary(@PathVariable("bookingId") String bookingId) {
        try {
            Map<String, Object> summary = paymentService.getPaymentSummary(bookingId);
            return new ResponseEntity<>(summary, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error getting payment summary: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/payhere/process-confirmation-fee/{bookingId}")
    public ResponseEntity<?> processConfirmationFee(@PathVariable("bookingId") String bookingId) {
        try {
            Optional<Booking> optBooking = bookingService.getBookingById(bookingId);
            if (!optBooking.isPresent()) {  // FIXED: Use !isPresent() instead of isEmpty()
                return new ResponseEntity<>("Booking not found", HttpStatus.NOT_FOUND);
            }

            Booking booking = optBooking.get();

            // Check if booking is in correct status
            if (!"CONFIRMED".equals(booking.getStatus())) {
                return new ResponseEntity<>("Booking must be confirmed before processing confirmation fee", HttpStatus.BAD_REQUEST);
            }

            if (booking.isConfirmationFeePaid()) {
                return new ResponseEntity<>("Confirmation fee already paid", HttpStatus.BAD_REQUEST);
            }

            // Process confirmation fee
            paymentService.processConfirmationFeePayout(booking);

            return new ResponseEntity<>("Confirmation fee processed successfully", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error processing confirmation fee: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/payhere/test-payment")
    public ResponseEntity<?> createTestPayment(@RequestBody Map<String, Object> testData) {
        try {
            // For testing purposes - creates a simple PayHere checkout URL
            String bookingId = (String) testData.get("bookingId");

            if (bookingId == null || bookingId.trim().isEmpty()) {
                return new ResponseEntity<>("Booking ID is required", HttpStatus.BAD_REQUEST);
            }

            PayHereSessionResponse response = paymentService.createPayHereCheckout(bookingId);

            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error creating test payment: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/payhere/test-refund/{bookingId}")
    public ResponseEntity<?> testRefund(@PathVariable("bookingId") String bookingId,
                                        @RequestParam(defaultValue = "1.0") BigDecimal refundPercentage,
                                        @RequestParam(defaultValue = "test-refund") String reason) {
        try {
            Optional<Booking> optBooking = bookingService.getBookingById(bookingId);
            if (!optBooking.isPresent()) {  // FIXED: Use !isPresent() instead of isEmpty()
                return new ResponseEntity<>("Booking not found", HttpStatus.NOT_FOUND);
            }

            Booking booking = optBooking.get();

            if (refundPercentage.compareTo(BigDecimal.ONE) == 0) {
                // Full refund
                paymentService.processFullRefund(booking, reason);
                return new ResponseEntity<>("Full refund processed: $" + booking.getTotalAmount(), HttpStatus.OK);
            } else {
                // Partial refund
                paymentService.processPartialRefund(booking, refundPercentage, reason);
                BigDecimal refundAmount = booking.getTotalAmount().multiply(refundPercentage);
                return new ResponseEntity<>("Partial refund processed: $" + refundAmount + " (" +
                        refundPercentage.multiply(BigDecimal.valueOf(100)) + "%)", HttpStatus.OK);
            }
        } catch (Exception e) {
            return new ResponseEntity<>("Error processing test refund: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/payhere/test/validate-money-flow/{bookingId}")
    public ResponseEntity<?> validateMoneyFlow(@PathVariable("bookingId") String bookingId) {
        try {
            Optional<Booking> optBooking = bookingService.getBookingById(bookingId);
            if (!optBooking.isPresent()) {  // FIXED: Use !isPresent() instead of isEmpty()
                return new ResponseEntity<>("Booking not found", HttpStatus.NOT_FOUND);
            }

            Booking booking = optBooking.get();
            Map<String, Object> validation = new java.util.HashMap<>();

            // Calculate expected amounts
            BigDecimal totalAmount = booking.getTotalAmount();
            BigDecimal platformCommission = booking.getPlatformCommission();
            BigDecimal confirmationFee = booking.getProviderConfirmationFee();
            BigDecimal finalPayout = totalAmount.multiply(BigDecimal.valueOf(0.75));

            // Validation
            validation.put("bookingId", bookingId);
            validation.put("totalAmount", totalAmount);
            // Create expectedBreakdown map (Java 8 compatible)
            Map<String, Object> expectedBreakdown = new java.util.HashMap<>();
            expectedBreakdown.put("platformCommission", platformCommission);
            expectedBreakdown.put("confirmationFee", confirmationFee);
            expectedBreakdown.put("finalPayout", finalPayout);
            expectedBreakdown.put("total", platformCommission.add(confirmationFee).add(finalPayout));
            validation.put("expectedBreakdown", expectedBreakdown);
            validation.put("mathValid", platformCommission.add(confirmationFee).add(finalPayout).equals(totalAmount));
            validation.put("paymentStatus", booking.getPaymentStatus());
            validation.put("bookingStatus", booking.getStatus());
            validation.put("confirmationFeePaid", booking.isConfirmationFeePaid());
            validation.put("finalPayoutPaid", booking.isFinalPayoutPaid());

            return new ResponseEntity<>(validation, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error validating money flow: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // ===== SIMPLE TEST ENDPOINTS (No Wallet Dependencies) =====

    @GetMapping("/payhere/simple-health")
    public ResponseEntity<?> getSimpleHealth() {
        try {
            Map<String, Object> health = new java.util.HashMap<>();
            health.put("status", "HEALTHY");
            health.put("service", "PaymentController");
            health.put("timestamp", java.time.LocalDateTime.now().toString());
            health.put("note", "This controller handles administrative and testing functions");
            health.put("core_payhere_endpoints", "Handled by PayHereController at /api/payments/payhere/");
            health.put("available_endpoints", java.util.Arrays.asList(
                    "GET /api/payments/payhere/health",
                    "GET /api/payments/payhere/summary/{bookingId}",
                    "POST /api/payments/payhere/process-confirmation-fee/{bookingId}",
                    "POST /api/payments/payhere/test-payment",
                    "POST /api/payments/payhere/test-refund/{bookingId}",
                    "GET /api/payments/payhere/test/validate-money-flow/{bookingId}",
                    "GET /api/payments/payhere/simple-health",
                    "GET /api/payments/payhere/test/booking-info/{bookingId}"
            ));

            return new ResponseEntity<>(health, HttpStatus.OK);
        } catch (Exception e) {
            Map<String, String> error = new java.util.HashMap<>();
            error.put("status", "ERROR");
            error.put("message", e.getMessage());
            return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/payhere/test/booking-info/{bookingId}")
    public ResponseEntity<?> getBookingInfo(@PathVariable("bookingId") String bookingId) {
        try {
            Optional<Booking> optBooking = bookingService.getBookingById(bookingId);
            if (!optBooking.isPresent()) {  // FIXED: Use !isPresent() instead of isEmpty()
                return new ResponseEntity<>("Booking not found", HttpStatus.NOT_FOUND);
            }

            Booking booking = optBooking.get();
            Map<String, Object> info = new java.util.HashMap<>();

            info.put("bookingId", booking.getId());
            info.put("totalAmount", booking.getTotalAmount());
            info.put("platformCommission", booking.getPlatformCommission());
            info.put("providerConfirmationFee", booking.getProviderConfirmationFee());
            info.put("paymentStatus", booking.getPaymentStatus());
            info.put("bookingStatus", booking.getStatus());
            info.put("payHereOrderId", booking.getPayHereOrderId());
            info.put("payHerePaymentId", booking.getPayHerePaymentId());
            info.put("confirmationFeePaid", booking.isConfirmationFeePaid());
            info.put("finalPayoutPaid", booking.isFinalPayoutPaid());
            info.put("createdAt", booking.getCreatedAt());
            info.put("updatedAt", booking.getUpdatedAt());

            return new ResponseEntity<>(info, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error getting booking info: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // ===== ADDITIONAL ADMINISTRATIVE ENDPOINTS =====

    @GetMapping("/admin/all-bookings-status")
    public ResponseEntity<?> getAllBookingsStatus() {
        try {
            Map<String, Object> status = new java.util.HashMap<>();

            // Count bookings by status
            status.put("pending_payment", bookingService.countBookingsByPaymentStatus("PENDING"));
            status.put("successful_payment", bookingService.countBookingsByPaymentStatus("SUCCESS"));
            status.put("failed_payment", bookingService.countBookingsByPaymentStatus("FAILED"));
            status.put("confirmed_bookings", bookingService.countBookingsByStatus("CONFIRMED"));
            status.put("completed_bookings", bookingService.countBookingsByStatus("COMPLETED"));
            status.put("cancelled_bookings", bookingService.countBookingsByStatus("CANCELLED_BY_TRAVELER"));

            return new ResponseEntity<>(status, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error getting bookings status: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/admin/recent-bookings")
    public ResponseEntity<?> getRecentBookings(@RequestParam(defaultValue = "10") int limit) {
        try {
            if (limit > 50) limit = 50; // Safety limit

            var recentBookings = bookingService.getRecentBookings(limit);
            return new ResponseEntity<>(recentBookings, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error getting recent bookings: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}