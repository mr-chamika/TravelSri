package com.example.student.controller;

import com.example.student.model.Booking;
import com.example.student.model.PaymentTransaction;
import com.example.student.services.IBookingService;
import com.example.student.services.PayHerePaymentServiceImpl;
import com.example.student.utils.PayHereUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/payments/payhere")
@CrossOrigin(originPatterns = "*", allowCredentials = "false")
public class PayHereController {

    private static final Logger logger = LoggerFactory.getLogger(PayHereController.class);

    @Value("${payhere.merchant.id:1231576}")
    private String merchantId;

    @Value("${payhere.merchant.secret:MzE5NzAyMDI0NzE1MDI2NDcwODE1NjIyOTU2MzQ1OTk4ODM0MQ==}")
    private String merchantSecret;

    @Value("${app.base.url:http://localhost:8080}")
    private String appBaseUrl;

    @Value("${payhere.sandbox:true}")
    private boolean sandboxMode;

    @Autowired
    private PayHereUtils payHereUtils;

    @Autowired
    private IBookingService bookingService;

    @Autowired
    private PayHerePaymentServiceImpl payHerePaymentService;

    @PostMapping("/create-checkout")
    public ResponseEntity<Map<String, Object>> createPayHereCheckout(@RequestBody Map<String, String> request) {
        try {
            String bookingId = request.get("bookingId");
            logger.info("Creating PayHere checkout for booking: {}", bookingId);

            // Get booking details
            Optional<Booking> optBooking = bookingService.getBookingById(bookingId);
            if (!optBooking.isPresent()) {
                logger.error("Booking not found: {}", bookingId);
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("message", "Booking not found");
                return ResponseEntity.badRequest().body(errorResponse);
            }

            Booking booking = optBooking.get();

            // Generate unique order ID
            String orderId = payHereUtils.generateOrderId();
            logger.info("Generated order ID: {}", orderId);

            // Validate and format amount
            BigDecimal totalAmount = booking.getTotalAmount();
            if (!payHereUtils.isValidAmount(totalAmount)) {
                logger.error("Invalid amount: {}", totalAmount);
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("message", "Invalid payment amount");
                return ResponseEntity.badRequest().body(errorResponse);
            }

            String currency = booking.getCurrency() != null ? booking.getCurrency() : "LKR";

            // Customer details
            String firstName = getFirstName(booking);
            String lastName = getLastName(booking);
            String email = getEmail(booking);
            String phone = getPhone(booking);
            String address = getAddress(booking);
            String city = getCity(booking);
            String country = "Sri Lanka";

            // Service description
            String serviceDescription = buildServiceDescription(booking);

            // Generate URLs for backend notification
            String notifyUrl = appBaseUrl + "/api/payments/payhere/notify";

            // Create payment data for React Native SDK (NO HASH NEEDED)
            Map<String, Object> paymentData = new HashMap<>();
            paymentData.put("sandbox", sandboxMode);
            paymentData.put("merchant_id", merchantId);
            paymentData.put("notify_url", notifyUrl);
            paymentData.put("order_id", orderId);
            paymentData.put("items", serviceDescription);
            paymentData.put("amount", payHereUtils.formatAmountForHash(totalAmount));
            paymentData.put("currency", currency);
            paymentData.put("first_name", firstName);
            paymentData.put("last_name", lastName);
            paymentData.put("email", email);
            paymentData.put("phone", phone);
            paymentData.put("address", address);
            paymentData.put("city", city);
            paymentData.put("country", country);

            // Log payment data for debugging
            logger.info("Created payment data for order: {}", orderId);
            logger.info("Amount: {} {}", totalAmount, currency);
            logger.info("SDK Mode - No hash generation needed");

            // Save payment record
            PaymentTransaction paymentTransaction = new PaymentTransaction();
            paymentTransaction.setBookingId(bookingId);
            paymentTransaction.setPayHereOrderId(orderId);
            paymentTransaction.setAmount(totalAmount);
            paymentTransaction.setCurrency(currency);
            paymentTransaction.setStatus("PENDING");
            paymentTransaction.setType("PAYMENT");
            paymentTransaction.setCreatedAt(LocalDateTime.now());
            paymentTransaction.setUpdatedAt(LocalDateTime.now());

            // Save to database
            payHerePaymentService.savePaymentTransaction(paymentTransaction);
            logger.info("Saved payment transaction to database");

            // Update booking with PayHere order ID
            booking.setPayHereOrderId(orderId);
            booking.setPaymentStatus("PENDING");
            booking.setStatus("PENDING_PAYMENT");
            booking.onUpdate();
            bookingService.updateBooking(booking);
            logger.info("Updated booking with order ID and status");

            // Return response for React Native SDK
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("orderId", orderId);
            response.put("paymentData", paymentData);
            response.put("bookingId", bookingId);
            response.put("amount", payHereUtils.formatAmount(totalAmount));
            response.put("currency", currency);
            response.put("sdkMode", true); // Indicate this is for SDK use

            logger.info("PayHere SDK checkout created successfully for order: {}", orderId);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            logger.error("Error creating PayHere checkout", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to create payment: " + e.getMessage());
            errorResponse.put("error", e.getClass().getSimpleName());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @PostMapping("/sdk/payment-completed")
    public ResponseEntity<Map<String, Object>> handleSDKPaymentCompleted(@RequestBody Map<String, String> request) {
        try {
            String orderId = request.get("orderId");
            String paymentId = request.get("paymentId");
            String bookingId = request.get("bookingId");

            logger.info("SDK Payment completed - Order: {}, Payment: {}, Booking: {}", orderId, paymentId, bookingId);

            // Find and update booking
            Optional<Booking> optBooking = bookingService.getBookingByPayHereOrderId(orderId);
            if (optBooking.isPresent()) {
                Booking booking = optBooking.get();
                booking.setPayHerePaymentId(paymentId);
                booking.setPaymentStatus("SUCCESS");
                booking.setStatus("CONFIRMED");
                booking.onUpdate();
                bookingService.updateBooking(booking);

                // Update payment transaction
                PaymentTransaction payment = payHerePaymentService.getPaymentByOrderId(orderId);
                if (payment != null) {
                    payment.setPayHerePaymentId(paymentId);
                    payment.setStatus("SUCCESS");
                    payment.setUpdatedAt(LocalDateTime.now());
                    payHerePaymentService.savePaymentTransaction(payment);
                }

                logger.info("✅ SDK Payment processed successfully for booking: {}", bookingId);

                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("message", "Payment processed successfully");
                response.put("bookingStatus", booking.getStatus());
                response.put("paymentStatus", booking.getPaymentStatus());

                return ResponseEntity.ok(response);
            } else {
                logger.error("Booking not found for SDK payment completion: {}", orderId);
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("message", "Booking not found");
                return ResponseEntity.badRequest().body(errorResponse);
            }

        } catch (Exception e) {
            logger.error("Error handling SDK payment completion", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to process payment completion: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @PostMapping(value = "/notify", consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    public ResponseEntity<String> handlePayHereNotification(@RequestParam Map<String, String> params) {
        try {
            logger.info("=== PayHere Notification Received ===");
            logger.info("Notification params: {}", params);

            // Extract PayHere notification parameters
            String receivedMerchantId = params.get("merchant_id");
            String orderId = params.get("order_id");
            String paymentId = params.get("payment_id");
            String payhereAmount = params.get("payhere_amount");
            String payhereCurrency = params.get("payhere_currency");
            String statusCode = params.get("status_code");
            String md5sig = params.get("md5sig");
            String method = params.get("method");
            String statusMessage = params.get("status_message");
            String custom1 = params.get("custom_1"); // This should contain booking ID
            String custom2 = params.get("custom_2");

            // Validate required parameters
            if (orderId == null || payhereAmount == null || statusCode == null || md5sig == null) {
                logger.error("Missing required parameters in PayHere notification");
                return ResponseEntity.badRequest().body("Missing required parameters");
            }

            // Verify merchant ID
            if (!merchantId.equals(receivedMerchantId)) {
                logger.error("Merchant ID mismatch. Expected: {}, Received: {}", merchantId, receivedMerchantId);
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Merchant ID mismatch");
            }

            // Verify the notification hash
            boolean isValid = payHereUtils.verifyNotificationHash(
                    receivedMerchantId, orderId, payhereAmount, payhereCurrency, statusCode, md5sig
            );

            logger.info("Hash verification result: {}", isValid);

            if (!isValid) {
                logger.error("PayHere notification verification failed for order: {}", orderId);
                logger.error("Expected merchant: {}, Received: {}", merchantId, receivedMerchantId);
                logger.error("Received hash: {}", md5sig);
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Hash verification failed");
            }

            // Find booking by order ID
            Optional<Booking> optBooking = bookingService.getBookingByPayHereOrderId(orderId);
            if (!optBooking.isPresent()) {
                logger.error("Booking not found for Order ID: {}", orderId);
                // Still return OK to prevent PayHere from retrying
                return ResponseEntity.ok("Booking not found but notification acknowledged");
            }

            Booking booking = optBooking.get();
            logger.info("Found booking: {} for order: {}", booking.getId(), orderId);

            // Update payment transaction
            PaymentTransaction payment = payHerePaymentService.getPaymentByOrderId(orderId);
            if (payment != null) {
                payment.setPayHerePaymentId(paymentId);
                payment.setStatus(convertStatusCode(statusCode));
                payment.setPayHereResponse(params.toString());
                payment.setUpdatedAt(LocalDateTime.now());
                payHerePaymentService.savePaymentTransaction(payment);
                logger.info("Updated payment transaction for order: {}", orderId);
            } else {
                logger.warn("Payment transaction not found for order: {}", orderId);
            }

            // Process based on status code
            switch (statusCode) {
                case "2": // SUCCESS
                    logger.info("Processing successful payment for booking: {}", booking.getId());
                    booking.setPayHerePaymentId(paymentId);
                    booking.setPaymentStatus("SUCCESS");
                    booking.setStatus("CONFIRMED");
                    booking.onUpdate();
                    bookingService.updateBooking(booking);

                    // Log payment success
                    payHereUtils.logPaymentResult(orderId, statusCode, paymentId);
                    logger.info("✅ Payment successful for booking: {}", booking.getId());
                    break;

                case "-1": // CANCELLED
                    logger.info("Processing cancelled payment for booking: {}", booking.getId());
                    booking.setPaymentStatus("CANCELLED");
                    booking.setStatus("CANCELLED_BY_TRAVELER");
                    booking.setCancellationReason("Payment cancelled by user");
                    booking.setCancellationType("TRAVELER_CANCELLED");
                    booking.onUpdate();
                    bookingService.updateBooking(booking);
                    logger.info("💔 Payment cancelled for booking: {}", booking.getId());
                    break;

                case "0": // PENDING
                    logger.info("Processing pending payment for booking: {}", booking.getId());
                    booking.setPaymentStatus("PENDING");
                    booking.setStatus("PENDING_PAYMENT");
                    booking.onUpdate();
                    bookingService.updateBooking(booking);
                    logger.info("⏳ Payment pending for booking: {}", booking.getId());
                    break;

                case "-2": // FAILED
                    logger.info("Processing failed payment for booking: {}", booking.getId());
                    booking.setPaymentStatus("FAILED");
                    booking.setStatus("PAYMENT_FAILED");
                    booking.onUpdate();
                    bookingService.updateBooking(booking);
                    logger.info("❌ Payment failed for booking: {}", booking.getId());
                    break;

                case "-3": // CHARGEDBACK
                    logger.info("Processing chargedback payment for booking: {}", booking.getId());
                    booking.setPaymentStatus("CHARGEDBACK");
                    booking.setStatus("CHARGEDBACK");
                    booking.onUpdate();
                    bookingService.updateBooking(booking);
                    logger.info("🔄 Payment chargedback for booking: {}", booking.getId());
                    break;

                default:
                    logger.warn("Unknown status code received: {}", statusCode);
                    break;
            }

            logger.info("PayHere notification processed successfully for order: {}", orderId);
            logger.info("=== PayHere Notification Processing Complete ===");

            return ResponseEntity.ok("OK");

        } catch (Exception e) {
            logger.error("Error processing PayHere notification", e);
            // Return OK to prevent PayHere from retrying, but log the error
            return ResponseEntity.ok("Error processed");
        }
    }

    // Mobile App Return URL Handler
    @GetMapping("/return/{bookingId}")
    public ResponseEntity<String> handlePaymentReturn(@PathVariable String bookingId, @RequestParam Map<String, String> params) {
        try {
            logger.info("Payment return for booking: {} with params: {}", bookingId, params);

            // Get booking details for the success page
            Optional<Booking> optBooking = bookingService.getBookingById(bookingId);
            String orderDetails = "N/A";
            if (optBooking.isPresent()) {
                Booking booking = optBooking.get();
                orderDetails = String.format("%s - %s %s",
                        booking.getServiceName(),
                        payHereUtils.formatAmount(booking.getTotalAmount()),
                        booking.getCurrency()
                );
            }

            String htmlResponse = generateSuccessPage(bookingId, "Payment Successful!", orderDetails);

            return ResponseEntity.ok()
                    .contentType(MediaType.TEXT_HTML)
                    .body(htmlResponse);

        } catch (Exception e) {
            logger.error("Error handling payment return", e);
            String htmlResponse = generateErrorPage(bookingId, "Payment processing error");
            return ResponseEntity.ok()
                    .contentType(MediaType.TEXT_HTML)
                    .body(htmlResponse);
        }
    }

    // Mobile App Cancel URL Handler
    @GetMapping("/cancel/{bookingId}")
    public ResponseEntity<String> handlePaymentCancel(@PathVariable String bookingId, @RequestParam Map<String, String> params) {
        try {
            logger.info("Payment cancelled for booking: {} with params: {}", bookingId, params);

            // Update booking status if needed
            Optional<Booking> optBooking = bookingService.getBookingById(bookingId);
            if (optBooking.isPresent()) {
                Booking booking = optBooking.get();
                if ("PENDING_PAYMENT".equals(booking.getStatus())) {
                    booking.setPaymentStatus("CANCELLED");
                    booking.setStatus("CANCELLED_BY_TRAVELER");
                    booking.setCancellationReason("Payment cancelled by user via return URL");
                    booking.onUpdate();
                    bookingService.updateBooking(booking);
                }
            }

            String htmlResponse = generateCancelPage(bookingId, "Payment Cancelled");

            return ResponseEntity.ok()
                    .contentType(MediaType.TEXT_HTML)
                    .body(htmlResponse);

        } catch (Exception e) {
            logger.error("Error handling payment cancellation", e);
            String htmlResponse = generateErrorPage(bookingId, "Error processing cancellation");
            return ResponseEntity.ok()
                    .contentType(MediaType.TEXT_HTML)
                    .body(htmlResponse);
        }
    }

    @GetMapping("/status/{orderId}")
    public ResponseEntity<Map<String, Object>> getPaymentStatus(@PathVariable String orderId) {
        try {
            PaymentTransaction payment = payHerePaymentService.getPaymentByOrderId(orderId);
            if (payment == null) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("message", "Payment transaction not found");
                return ResponseEntity.notFound().build();
            }

            // Also get booking details
            Optional<Booking> optBooking = bookingService.getBookingByPayHereOrderId(orderId);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("orderId", payment.getPayHereOrderId());
            response.put("status", payment.getStatus());
            response.put("amount", payment.getAmount());
            response.put("currency", payment.getCurrency());
            response.put("paymentId", payment.getPayHerePaymentId());
            response.put("type", payment.getType());
            response.put("createdAt", payment.getCreatedAt());
            response.put("updatedAt", payment.getUpdatedAt());

            if (optBooking.isPresent()) {
                Booking booking = optBooking.get();
                response.put("bookingId", booking.getId());
                response.put("bookingStatus", booking.getStatus());
                response.put("paymentStatus", booking.getPaymentStatus());
                response.put("serviceName", booking.getServiceName());
            }

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            logger.error("Error getting payment status for order: {}", orderId, e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to get payment status: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    // ===== TEST ENDPOINTS =====

    @PostMapping("/test/generate-hash")
    public ResponseEntity<?> generateTestHash(@RequestBody Map<String, Object> request) {
        try {
            String orderId = (String) request.get("orderId");
            BigDecimal amount = new BigDecimal(request.get("amount").toString());
            String currency = (String) request.get("currency");

            String hash = payHereUtils.generateHash(orderId, amount, currency);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("hash", hash);
            response.put("merchantId", merchantId);
            response.put("orderId", orderId);
            response.put("amount", payHereUtils.formatAmount(amount));
            response.put("currency", currency);
            response.put("sandbox", sandboxMode);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error generating test hash", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("error", "Error generating hash: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @PostMapping("/test/verify-hash")
    public ResponseEntity<?> verifyTestHash(@RequestBody Map<String, Object> request) {
        try {
            String orderId = (String) request.get("orderId");
            String amountStr = request.get("amount").toString();
            String currency = (String) request.get("currency");
            String statusCode = (String) request.get("statusCode");
            String receivedHash = (String) request.get("hash");

            boolean isValid = payHereUtils.verifyNotificationHash(
                    merchantId, orderId, amountStr, currency, statusCode, receivedHash
            );

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("isValid", isValid);
            response.put("merchantId", merchantId);
            response.put("orderId", orderId);
            response.put("amount", amountStr);
            response.put("currency", currency);
            response.put("statusCode", statusCode);
            response.put("receivedHash", receivedHash);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error verifying test hash", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("error", "Error verifying hash: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @PostMapping("/test/debug-payment-data")
    public ResponseEntity<?> debugPaymentData(@RequestBody Map<String, String> request) {
        try {
            String bookingId = request.get("bookingId");

            Optional<Booking> optBooking = bookingService.getBookingById(bookingId);
            if (!optBooking.isPresent()) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("message", "Booking not found");
                return ResponseEntity.badRequest().body(errorResponse);
            }

            Booking booking = optBooking.get();
            String orderId = payHereUtils.generateOrderId();
            BigDecimal amount = booking.getTotalAmount();
            String currency = "LKR";

            // Create payment data using utility
            Map<String, Object> paymentData = payHereUtils.createGuideBookingPayment(
                    orderId,
                    amount,
                    buildServiceDescription(booking),
                    "John Doe",
                    "customer@example.com",
                    "+94771234567",
                    appBaseUrl + "/api/payments/payhere/return/" + bookingId,
                    appBaseUrl + "/api/payments/payhere/cancel/" + bookingId,
                    appBaseUrl + "/api/payments/payhere/notify"
            );

            // Add debug info
            Map<String, Object> debugInfo = payHereUtils.getConfigInfo();
            debugInfo.put("bookingAmount", amount);
            debugInfo.put("formattedAmount", payHereUtils.formatAmount(amount));
            debugInfo.put("orderId", orderId);
            debugInfo.put("appBaseUrl", appBaseUrl);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("paymentData", paymentData);
            response.put("debug", debugInfo);
            response.put("booking", Map.of(
                    "id", booking.getId(),
                    "serviceName", booking.getServiceName(),
                    "totalAmount", booking.getTotalAmount(),
                    "currency", booking.getCurrency()
            ));

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            logger.error("Error debugging payment data", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("error", "Error: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @GetMapping("/test/config")
    public ResponseEntity<?> getTestConfig() {
        Map<String, Object> config = new HashMap<>();
        config.put("merchantId", merchantId != null ? merchantId : "NULL");
        config.put("merchantIdLength", merchantId != null ? merchantId.length() : 0);
        config.put("payHereUtilsAvailable", payHereUtils != null);
        config.put("merchantSecretConfigured", merchantSecret != null && !merchantSecret.trim().isEmpty());
        config.put("merchantSecretLength", merchantSecret != null ? merchantSecret.length() : 0);
        config.put("appBaseUrl", appBaseUrl);
        config.put("sandboxMode", sandboxMode);
        config.put("configInfo", payHereUtils != null ? payHereUtils.getConfigInfo() : null);

        return ResponseEntity.ok(config);
    }

    // ===== HTML PAGE GENERATORS =====

    private String generateSuccessPage(String bookingId, String message, String orderDetails) {
        return "<!DOCTYPE html>\n" +
                "<html>\n" +
                "<head>\n" +
                "    <title>Payment Successful</title>\n" +
                "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n" +
                "    <style>\n" +
                "        body {\n" +
                "            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;\n" +
                "            background: linear-gradient(135deg, #10b981 0%, #059669 100%);\n" +
                "            margin: 0;\n" +
                "            padding: 40px 20px;\n" +
                "            display: flex;\n" +
                "            align-items: center;\n" +
                "            justify-content: center;\n" +
                "            min-height: 100vh;\n" +
                "            color: white;\n" +
                "        }\n" +
                "        .container {\n" +
                "            background: white;\n" +
                "            color: #1f2937;\n" +
                "            border-radius: 16px;\n" +
                "            padding: 40px;\n" +
                "            text-align: center;\n" +
                "            max-width: 400px;\n" +
                "            width: 100%;\n" +
                "            box-shadow: 0 20px 40px rgba(0,0,0,0.1);\n" +
                "        }\n" +
                "        .icon { font-size: 64px; margin-bottom: 20px; }\n" +
                "        h1 { margin: 0 0 16px 0; color: #10b981; }\n" +
                "        p { color: #6b7280; margin: 16px 0; }\n" +
                "        .booking-id { background: #f3f4f6; padding: 12px; border-radius: 8px; font-family: monospace; margin: 16px 0; }\n" +
                "        .order-details { background: #f0fdf4; padding: 12px; border-radius: 8px; color: #059669; margin: 16px 0; }\n" +
                "        .close-btn {\n" +
                "            background: #10b981;\n" +
                "            color: white;\n" +
                "            border: none;\n" +
                "            padding: 12px 24px;\n" +
                "            border-radius: 8px;\n" +
                "            font-size: 16px;\n" +
                "            cursor: pointer;\n" +
                "            margin-top: 20px;\n" +
                "        }\n" +
                "    </style>\n" +
                "</head>\n" +
                "<body>\n" +
                "    <div class=\"container\">\n" +
                "        <div class=\"icon\">✅</div>\n" +
                "        <h1>Payment Successful!</h1>\n" +
                "        <p>Your payment has been processed successfully.</p>\n" +
                "        <div class=\"booking-id\">Booking ID: " + bookingId + "</div>\n" +
                "        <div class=\"order-details\">" + orderDetails + "</div>\n" +
                "        <p>You can now close this window and return to the app.</p>\n" +
                "        <button class=\"close-btn\" onclick=\"window.close()\">Close Window</button>\n" +
                "        \n" +
                "        <script>\n" +
                "            console.log('Payment success page loaded for booking: " + bookingId + "');\n" +
                "            setTimeout(function() { \n" +
                "                console.log('Auto-closing window after 5 seconds');\n" +
                "                window.close(); \n" +
                "            }, 5000);\n" +
                "            \n" +
                "            if (window.opener) {\n" +
                "                console.log('Sending success message to opener');\n" +
                "                window.opener.postMessage({\n" +
                "                    type: 'PAYMENT_SUCCESS',\n" +
                "                    bookingId: '" + bookingId + "'\n" +
                "                }, '*');\n" +
                "            }\n" +
                "            \n" +
                "            // For React Native WebView\n" +
                "            if (window.ReactNativeWebView) {\n" +
                "                console.log('Sending success message to React Native');\n" +
                "                window.ReactNativeWebView.postMessage(JSON.stringify({\n" +
                "                    type: 'PAYMENT_SUCCESS',\n" +
                "                    bookingId: '" + bookingId + "'\n" +
                "                }));\n" +
                "            }\n" +
                "        </script>\n" +
                "    </div>\n" +
                "</body>\n" +
                "</html>";
    }

    private String generateCancelPage(String bookingId, String message) {
        return "<!DOCTYPE html>\n" +
                "<html>\n" +
                "<head>\n" +
                "    <title>Payment Cancelled</title>\n" +
                "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n" +
                "    <style>\n" +
                "        body {\n" +
                "            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;\n" +
                "            background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);\n" +
                "            margin: 0;\n" +
                "            padding: 40px 20px;\n" +
                "            display: flex;\n" +
                "            align-items: center;\n" +
                "            justify-content: center;\n" +
                "            min-height: 100vh;\n" +
                "            color: white;\n" +
                "        }\n" +
                "        .container {\n" +
                "            background: white;\n" +
                "            color: #1f2937;\n" +
                "            border-radius: 16px;\n" +
                "            padding: 40px;\n" +
                "            text-align: center;\n" +
                "            max-width: 400px;\n" +
                "            width: 100%;\n" +
                "            box-shadow: 0 20px 40px rgba(0,0,0,0.1);\n" +
                "        }\n" +
                "        .icon { font-size: 64px; margin-bottom: 20px; }\n" +
                "        h1 { margin: 0 0 16px 0; color: #f59e0b; }\n" +
                "        p { color: #6b7280; margin: 16px 0; }\n" +
                "        .booking-id { background: #fef3c7; padding: 12px; border-radius: 8px; font-family: monospace; }\n" +
                "        .close-btn {\n" +
                "            background: #f59e0b;\n" +
                "            color: white;\n" +
                "            border: none;\n" +
                "            padding: 12px 24px;\n" +
                "            border-radius: 8px;\n" +
                "            font-size: 16px;\n" +
                "            cursor: pointer;\n" +
                "            margin-top: 20px;\n" +
                "        }\n" +
                "    </style>\n" +
                "</head>\n" +
                "<body>\n" +
                "    <div class=\"container\">\n" +
                "        <div class=\"icon\">⚠️</div>\n" +
                "        <h1>Payment Cancelled</h1>\n" +
                "        <p>Your payment was cancelled. You can try again if needed.</p>\n" +
                "        <div class=\"booking-id\">Booking ID: " + bookingId + "</div>\n" +
                "        <p>You can now close this window and return to the app.</p>\n" +
                "        <button class=\"close-btn\" onclick=\"window.close()\">Close Window</button>\n" +
                "        \n" +
                "        <script>\n" +
                "            console.log('Payment cancel page loaded for booking: " + bookingId + "');\n" +
                "            setTimeout(function() { window.close(); }, 5000);\n" +
                "            \n" +
                "            if (window.opener) {\n" +
                "                window.opener.postMessage({\n" +
                "                    type: 'PAYMENT_CANCELLED',\n" +
                "                    bookingId: '" + bookingId + "'\n" +
                "                }, '*');\n" +
                "            }\n" +
                "            \n" +
                "            if (window.ReactNativeWebView) {\n" +
                "                window.ReactNativeWebView.postMessage(JSON.stringify({\n" +
                "                    type: 'PAYMENT_CANCELLED',\n" +
                "                    bookingId: '" + bookingId + "'\n" +
                "                }));\n" +
                "            }\n" +
                "        </script>\n" +
                "    </div>\n" +
                "</body>\n" +
                "</html>";
    }

    private String generateErrorPage(String bookingId, String message) {
        return "<!DOCTYPE html>\n" +
                "<html>\n" +
                "<head>\n" +
                "    <title>Payment Error</title>\n" +
                "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n" +
                "    <style>\n" +
                "        body {\n" +
                "            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;\n" +
                "            background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);\n" +
                "            margin: 0;\n" +
                "            padding: 40px 20px;\n" +
                "            display: flex;\n" +
                "            align-items: center;\n" +
                "            justify-content: center;\n" +
                "            min-height: 100vh;\n" +
                "            color: white;\n" +
                "        }\n" +
                "        .container {\n" +
                "            background: white;\n" +
                "            color: #1f2937;\n" +
                "            border-radius: 16px;\n" +
                "            padding: 40px;\n" +
                "            text-align: center;\n" +
                "            max-width: 400px;\n" +
                "            width: 100%;\n" +
                "            box-shadow: 0 20px 40px rgba(0,0,0,0.1);\n" +
                "        }\n" +
                "        .icon { font-size: 64px; margin-bottom: 20px; }\n" +
                "        h1 { margin: 0 0 16px 0; color: #ef4444; }\n" +
                "        p { color: #6b7280; margin: 16px 0; }\n" +
                "        .booking-id { background: #fee2e2; padding: 12px; border-radius: 8px; font-family: monospace; }\n" +
                "        .close-btn {\n" +
                "            background: #ef4444;\n" +
                "            color: white;\n" +
                "            border: none;\n" +
                "            padding: 12px 24px;\n" +
                "            border-radius: 8px;\n" +
                "            font-size: 16px;\n" +
                "            cursor: pointer;\n" +
                "            margin-top: 20px;\n" +
                "        }\n" +
                "    </style>\n" +
                "</head>\n" +
                "<body>\n" +
                "    <div class=\"container\">\n" +
                "        <div class=\"icon\">❌</div>\n" +
                "        <h1>Payment Error</h1>\n" +
                "        <p>" + message + "</p>\n" +
                "        <div class=\"booking-id\">Booking ID: " + bookingId + "</div>\n" +
                "        <p>Please try again or contact support.</p>\n" +
                "        <button class=\"close-btn\" onclick=\"window.close()\">Close Window</button>\n" +
                "        \n" +
                "        <script>\n" +
                "            if (window.opener) {\n" +
                "                window.opener.postMessage({\n" +
                "                    type: 'PAYMENT_ERROR',\n" +
                "                    bookingId: '" + bookingId + "',\n" +
                "                    message: '" + message + "'\n" +
                "                }, '*');\n" +
                "            }\n" +
                "            \n" +
                "            if (window.ReactNativeWebView) {\n" +
                "                window.ReactNativeWebView.postMessage(JSON.stringify({\n" +
                "                    type: 'PAYMENT_ERROR',\n" +
                "                    bookingId: '" + bookingId + "',\n" +
                "                    message: '" + message + "'\n" +
                "                }));\n" +
                "            }\n" +
                "        </script>\n" +
                "    </div>\n" +
                "</body>\n" +
                "</html>";
    }

    // ===== HELPER METHODS =====

    private String buildServiceDescription(Booking booking) {
        StringBuilder description = new StringBuilder();

        if (booking.getServiceName() != null) {
            description.append(booking.getServiceName());
        } else {
            description.append("Guide Service Booking");
        }

        // Add additional details if available
        if (booking.getServiceDescription() != null) {
            description.append(" - ").append(booking.getServiceDescription());
        }

        return description.toString();
    }

    private String getFirstName(Booking booking) {
        // TODO: Extract from booking.getTravelerId() user details
        // For now return a default value
        if (booking.getTravelerId() != null) {
            // You can implement user service to get user details
            return "John"; // Replace with actual user first name
        }
        return "Customer";
    }

    private String getLastName(Booking booking) {
        // TODO: Extract from booking.getTravelerId() user details
        if (booking.getTravelerId() != null) {
            return "Doe"; // Replace with actual user last name
        }
        return "";
    }

    private String getEmail(Booking booking) {
        // TODO: Extract from booking.getTravelerId() user details
        if (booking.getTravelerId() != null) {
            return "customer@example.com"; // Replace with actual user email
        }
        return "customer@example.com";
    }

    private String getPhone(Booking booking) {
        // TODO: Extract from booking.getTravelerId() user details
        if (booking.getTravelerId() != null) {
            return "+94771234567"; // Replace with actual user phone
        }
        return "+94771234567";
    }

    private String getAddress(Booking booking) {
        // TODO: Extract from booking.getTravelerId() user details or booking location
        return "Colombo, Sri Lanka";
    }

    private String getCity(Booking booking) {
        // TODO: Extract from booking.getTravelerId() user details
        return "Colombo";
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
}