package com.example.student.controller;

import com.example.student.model.dto.PayHereSessionResponse;
import com.example.student.model.dto.PaymentSessionRequest;
import com.example.student.model.dto.PayHereNotification;
import com.example.student.services.IPaymentService;
import com.example.student.services.IBookingService;
import com.example.student.model.Booking;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;  // Changed from javax.servlet to jakarta.servlet
import java.math.BigDecimal;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin
public class PaymentController {

    @Autowired
    private IPaymentService paymentService;

    @Autowired
    private IBookingService bookingService;

    @PostMapping("/payhere/create-checkout")
    public ResponseEntity<?> createPayHereCheckout(@RequestBody PaymentSessionRequest request) {
        try {
            if (request == null || request.getBookingId() == null) {
                return new ResponseEntity<>("Invalid request", HttpStatus.BAD_REQUEST);
            }

            PayHereSessionResponse response = paymentService.createPayHereCheckout(request.getBookingId());
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>("Error creating PayHere checkout: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>("Internal error: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/payhere/notify")
    public ResponseEntity<String> handlePayHereNotification(HttpServletRequest request) {
        try {
            // Extract PayHere notification parameters
            PayHereNotification notification = new PayHereNotification();
            notification.setMerchantId(request.getParameter("merchant_id"));
            notification.setOrderId(request.getParameter("order_id"));
            notification.setPaymentId(request.getParameter("payment_id"));

            String amountParam = request.getParameter("amount");
            if (amountParam != null && !amountParam.isEmpty()) {
                notification.setAmount(new BigDecimal(amountParam));
            }

            notification.setCurrency(request.getParameter("currency"));
            notification.setStatusCode(request.getParameter("status_code"));
            notification.setMd5sig(request.getParameter("md5sig"));
            notification.setMethod(request.getParameter("method"));
            notification.setStatusMessage(request.getParameter("status_message"));
            notification.setCardHolderName(request.getParameter("card_holder_name"));
            notification.setCardNo(request.getParameter("card_no"));

            paymentService.handlePaymentNotification(notification);

            return new ResponseEntity<>("OK", HttpStatus.OK);
        } catch (Exception e) {
            System.err.println("Error processing PayHere notification: " + e.getMessage());
            return new ResponseEntity<>("ERROR", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/payhere/status/{orderId}")
    public ResponseEntity<?> getPaymentStatus(@PathVariable("orderId") String orderId) {
        try {
            Booking booking = paymentService.getBookingByOrderId(orderId);
            if (booking != null) {
                return new ResponseEntity<>(booking, HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Payment not found", HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>("Error retrieving payment status: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // ===== NEW ENDPOINTS FOR TESTING =====

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
            if (!optBooking.isEmpty()) {
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
            if (optBooking.isEmpty()) {
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
            if (optBooking.isEmpty()) {
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
            validation.put("expectedBreakdown", Map.of(
                    "platformCommission", platformCommission,
                    "confirmationFee", confirmationFee,
                    "finalPayout", finalPayout,
                    "total", platformCommission.add(confirmationFee).add(finalPayout)
            ));
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
            health.put("endpoints", java.util.Arrays.asList(
                    "POST /api/payments/payhere/create-checkout",
                    "POST /api/payments/payhere/notify",
                    "GET /api/payments/payhere/status/{orderId}",
                    "GET /api/payments/payhere/health",
                    "GET /api/payments/payhere/summary/{bookingId}"
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
            if (optBooking.isEmpty()) {
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
}