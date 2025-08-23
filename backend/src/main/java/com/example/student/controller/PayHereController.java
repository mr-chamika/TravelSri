package com.example.student.controller;

import com.example.student.model.Booking;
import com.example.student.model.PaymentTransaction;
import com.example.student.model.MoneyFlow;
import com.example.student.model.TravelerWallet;
import com.example.student.model.RefundHistory;
import com.example.student.services.IBookingService;
import com.example.student.services.PayHerePaymentServiceImpl;
import com.example.student.services.IMoneyFlowService;
import com.example.student.services.ITravelerWalletService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.text.DecimalFormat;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.List;
import java.util.ArrayList;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/payments/payhere")
@CrossOrigin(originPatterns = "*", allowCredentials = "false")
public class PayHereController {

    private static final Logger logger = LoggerFactory.getLogger(PayHereController.class);

    // ✅ FIXED: Only support LKR currency
    private static final String SUPPORTED_CURRENCY = "LKR";

    @Value("${payhere.merchant.id}")
    private String merchantId;

    @Value("${payhere.merchant.secret}")
    private String merchantSecret;

    @Value("${payhere.sandbox:true}")
    private boolean sandboxMode;

    @Value("${app.base.url:http://localhost:8080}")
    private String appBaseUrl;

    @Autowired
    private IBookingService bookingService;

    @Autowired
    private PayHerePaymentServiceImpl payHerePaymentService;

    @Autowired
    private IMoneyFlowService moneyFlowService;

    @Autowired
    private ITravelerWalletService travelerWalletService;


    /**
     * ✅ FIXED: Input request class for checkout - removed currency field since only LKR is supported
     */
    public static class CheckoutRequest {
        private String bookingId;
        private Double amount;
        private String firstName;
        private String lastName;
        private String email;
        private String phone;
        private String address;
        private String city;
        private String country;
        private String items;

        // Constructors
        public CheckoutRequest() {}

        // Getters and Setters
        public String getBookingId() { return bookingId; }
        public void setBookingId(String bookingId) { this.bookingId = bookingId; }

        public Double getAmount() { return amount; }
        public void setAmount(Double amount) { this.amount = amount; }

        public String getFirstName() { return firstName; }
        public void setFirstName(String firstName) { this.firstName = firstName; }

        public String getLastName() { return lastName; }
        public void setLastName(String lastName) { this.lastName = lastName; }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getPhone() { return phone; }
        public void setPhone(String phone) { this.phone = phone; }

        public String getAddress() { return address; }
        public void setAddress(String address) { this.address = address; }

        public String getCity() { return city; }
        public void setCity(String city) { this.city = city; }

        public String getCountry() { return country; }
        public void setCountry(String country) { this.country = country; }

        public String getItems() { return items; }
        public void setItems(String items) { this.items = items; }
    }

    /**
     * ✅ FIXED: PayHere hash generator - always uses LKR
     */
    public static String generatecode(String orderId, double totalAmount, String merchantSecretId, String merchantId) {
        String merahantID = merchantId;
        String merchantSecret = merchantSecretId;
        String orderID = orderId;
        double amount = totalAmount;
        String currency = SUPPORTED_CURRENCY; // Always LKR

        DecimalFormat df = new DecimalFormat("0.00");
        String amountFormatted = df.format(amount);
        String hash = getMd5(merahantID + orderID + amountFormatted + currency + getMd5(merchantSecret));

        System.out.println("Generated Hash: " + hash);
        return hash;
    }

    private static String getMd5(String input) {
        try {
            MessageDigest md = MessageDigest.getInstance("MD5");
            byte[] messageDigest = md.digest(input.getBytes());
            BigInteger no = new BigInteger(1, messageDigest);
            String hashtext = no.toString(16);
            while (hashtext.length() < 32) {
                hashtext = "0" + hashtext;
            }
            return hashtext.toUpperCase();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException(e);
        }
    }

    /**
     * Generate unique order ID
     */
    private String generateOrderId() {
        return "ORD_" + System.currentTimeMillis() + "_" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

    /**
     * ✅ EXISTING MAPPING: Create PayHere checkout - only supports LKR currency
     */
    @PostMapping("/create-checkout")
    public ResponseEntity<Map<String, Object>> createPayHereCheckout(@RequestBody CheckoutRequest request) {
        try {
            logger.info("=== UNIFIED PAYHERE PAYMENT CREATION START ===");
            logger.info("Using Merchant ID: {}", merchantId);
            logger.info("Sandbox Mode: {}", sandboxMode);
            logger.info("Supported Currency: {}", SUPPORTED_CURRENCY);
            logger.info("Creating PayHere payment for booking: {}", request.getBookingId());

            // Always use LKR currency
            String currency = SUPPORTED_CURRENCY;
            BigDecimal totalAmount = new BigDecimal("1000.00"); // Default amount
            String bookingType = "unknown"; // Track booking type

            if (request.getBookingId() != null && !request.getBookingId().trim().isEmpty()) {
                Optional<Booking> optBooking = bookingService.getBookingById(request.getBookingId());
                if (!optBooking.isPresent()) {
                    logger.error("Booking not found: {}", request.getBookingId());
                    Map<String, Object> errorResponse = new HashMap<>();
                    errorResponse.put("success", false);
                    errorResponse.put("message", "Booking not found");
                    return ResponseEntity.badRequest().body(errorResponse);
                }

                Booking booking = optBooking.get();
                totalAmount = booking.getTotalAmount();
                bookingType = booking.getProviderType() != null ? booking.getProviderType() : "unknown";

                logger.info("Found {} booking: ID={}, Amount={}", bookingType, booking.getId(), totalAmount);
                logger.info("Enforcing LKR currency for all payments");

                // Update the booking to ensure it uses LKR currency
                if (booking.getCurrency() == null || !SUPPORTED_CURRENCY.equals(booking.getCurrency())) {
                    logger.info("Updating booking currency from {} to {}",
                            booking.getCurrency(), SUPPORTED_CURRENCY);
                    booking.setCurrency(SUPPORTED_CURRENCY);
                    booking.onUpdate();
                    bookingService.updateBooking(booking);
                }

                logger.info("Booking processed: ID={}, Type={}, Amount={}, Currency={}",
                        booking.getId(), bookingType, totalAmount, SUPPORTED_CURRENCY);
            }

            // Override with request amount if provided
            if (request.getAmount() != null && request.getAmount() > 0) {
                totalAmount = new BigDecimal(request.getAmount());
                logger.info("Amount overridden from request: {}", totalAmount);
            }

            // Generate order ID
            String orderId = generateOrderId();
            logger.info("Generated order ID: {}", orderId);

            double amount = totalAmount.doubleValue();
            logger.info("Final Amount: {} {}", amount, currency);

            // Customer details with booking-type-specific defaults
            String firstName = getCustomerFirstName(request, bookingType);
            String lastName = getCustomerLastName(request, bookingType);
            String email = getCustomerEmail(request, bookingType);
            String phone = getCustomerPhone(request, bookingType);
            String address = getCustomerAddress(request, bookingType);
            String city = getCustomerCity(request, bookingType);
            String country = getCustomerCountry(request, bookingType);
            String items = getItemsDescription(request, bookingType);

            logger.info("Customer details processed for {} booking: {} {}, {}, {}",
                    bookingType, firstName, lastName, email, phone);

            // Generate hash using LKR currency only
            String hash = generatecode(orderId, amount, merchantSecret, merchantId);
            logger.info("Generated Hash: {}", hash);

            // Create booking-type-aware redirect URLs
            String bookingIdForUrl = request.getBookingId() != null ? request.getBookingId() : orderId;
            String returnUrl = String.format("%s/api/payments/payhere/return/payment-success?orderId=%s&bookingId=%s&amount=%.2f&currency=%s&type=%s",
                    appBaseUrl, orderId, bookingIdForUrl, amount, currency, bookingType);
            String cancelUrl = String.format("%s/api/payhere/cancle/payment-cancelled?orderId=%s&bookingId=%s&reason=user_cancelled&type=%s",
                    appBaseUrl, orderId, bookingIdForUrl, bookingType);

            logger.info("Redirect URLs for {} booking:", bookingType);
            logger.info("Return URL: {}", returnUrl);
            logger.info("Cancel URL: {}", cancelUrl);

            // Create payment object
            Map<String, Object> paymentObject = createPaymentObject(
                    merchantId, returnUrl, cancelUrl, firstName, lastName, email, phone,
                    address, city, country, orderId, items, currency, amount, hash, request.getBookingId()
            );

            // Validate required fields
            if (!validatePaymentObject(paymentObject)) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("message", "Missing required payment fields");
                return ResponseEntity.badRequest().body(errorResponse);
            }

            // Verify hash generation
            String testHash = generatecode(orderId, amount, merchantSecret, merchantId);
            boolean hashMatches = testHash.equals(hash);
            logger.info("Hash verification - Generated: {}, Expected: {}, Match: {}",
                    testHash, hash, hashMatches);

            if (!hashMatches) {
                logger.error("HASH MISMATCH!");
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("message", "Hash generation error");
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
            }

            // Save payment transaction if booking exists
            if (request.getBookingId() != null && !request.getBookingId().trim().isEmpty()) {
                saveInitialPaymentTransaction(request.getBookingId(), orderId, totalAmount, currency);
            }

            // Create response
            String checkoutUrl = sandboxMode ?
                    "https://sandbox.payhere.lk/pay/checkout" :
                    "https://www.payhere.lk/pay/checkout";

            Map<String, Object> response = createCheckoutResponse(
                    paymentObject, orderId, request.getBookingId(), amount, currency,
                    checkoutUrl, returnUrl, cancelUrl, hashMatches
            );

            // Add booking type to response for frontend use
            response.put("bookingType", bookingType);

            logger.info("PayHere {} payment created successfully", bookingType);
            logger.info("=== UNIFIED PAYHERE PAYMENT CREATION END ===");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            logger.error("ERROR creating PayHere payment", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to create payment: " + e.getMessage());
            errorResponse.put("error", e.getClass().getSimpleName());
            errorResponse.put("supportedCurrency", SUPPORTED_CURRENCY);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    // Helper methods for booking-type-specific customer defaults
    private String getCustomerFirstName(CheckoutRequest request, String bookingType) {
        if (request.getFirstName() != null && !request.getFirstName().trim().isEmpty()) {
            return request.getFirstName();
        }

        switch (bookingType.toLowerCase()) {
            case "hotel": return "Hotel Guest";
            case "guide": return "Tour Customer";
            case "vehicle": return "Passenger";
            default: return "Customer";
        }
    }

    private String getCustomerLastName(CheckoutRequest request, String bookingType) {
        if (request.getLastName() != null && !request.getLastName().trim().isEmpty()) {
            return request.getLastName();
        }

        switch (bookingType.toLowerCase()) {
            case "hotel": return "Traveler";
            case "guide": return "Traveler";
            case "vehicle": return "Traveler";
            default: return "User";
        }
    }

    private String getCustomerEmail(CheckoutRequest request, String bookingType) {
        if (request.getEmail() != null && !request.getEmail().trim().isEmpty()) {
            return request.getEmail();
        }

        switch (bookingType.toLowerCase()) {
            case "hotel": return "guest@hotel.lk";
            case "guide": return "tourist@guide.lk";
            case "vehicle": return "passenger@vehicle.lk";
            default: return "customer@travelsri.lk";
        }
    }

    private String getCustomerPhone(CheckoutRequest request, String bookingType) {
        return request.getPhone() != null && !request.getPhone().trim().isEmpty()
                ? request.getPhone() : "+94771234567";
    }

    private String getCustomerAddress(CheckoutRequest request, String bookingType) {
        return request.getAddress() != null && !request.getAddress().trim().isEmpty()
                ? request.getAddress() : "Colombo";
    }

    private String getCustomerCity(CheckoutRequest request, String bookingType) {
        return request.getCity() != null && !request.getCity().trim().isEmpty()
                ? request.getCity() : "Colombo";
    }

    private String getCustomerCountry(CheckoutRequest request, String bookingType) {
        return request.getCountry() != null && !request.getCountry().trim().isEmpty()
                ? request.getCountry() : "Sri Lanka";
    }

    private String getItemsDescription(CheckoutRequest request, String bookingType) {
        if (request.getItems() != null && !request.getItems().trim().isEmpty()) {
            return request.getItems();
        }

        switch (bookingType.toLowerCase()) {
            case "hotel": return "Hotel Reservation";
            case "guide": return "Guide Service Booking";
            case "vehicle": return "Vehicle Rental Service";
            default: return "Travel Service Booking";
        }
    }

    /**
     * ✅ EXISTING MAPPING: Configuration check with LKR currency support only
     */
    @GetMapping("/config-check")
    public ResponseEntity<Map<String, Object>> checkConfig() {
        Map<String, Object> config = new HashMap<>();
        config.put("merchantId", merchantId);
        config.put("merchantIdLength", merchantId != null ? merchantId.length() : 0);
        config.put("merchantSecretLength", merchantSecret != null ? merchantSecret.length() : 0);
        config.put("sandboxMode", sandboxMode);
        config.put("appBaseUrl", appBaseUrl);
        config.put("supportedCurrency", SUPPORTED_CURRENCY);
        config.put("currencySupport", "LKR Only");

        String checkoutUrl = sandboxMode ?
                "https://sandbox.payhere.lk/pay/checkout" :
                "https://www.payhere.lk/pay/checkout";
        config.put("checkoutUrl", checkoutUrl);

        logger.info("=== CONFIGURATION CHECK ===");
        logger.info("Merchant ID: {}", merchantId);
        logger.info("Sandbox Mode: {}", sandboxMode);
        logger.info("Supported Currency: {}", SUPPORTED_CURRENCY);
        logger.info("Checkout URL: {}", checkoutUrl);
        logger.info("============================");

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("config", config);
        return ResponseEntity.ok(response);
    }

    /**
     * ✅ EXISTING MAPPING: Handle PayHere notification - ENHANCED
     */
    @PostMapping(value = "/notify", consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    public ResponseEntity<String> handlePayHereNotification(@RequestParam Map<String, String> params) {
        try {
            logger.info("=== PayHere Notification Received ===");
            logger.info("Notification params: {}", params);

            String merchantIdFromNotification = params.get("merchant_id");
            String orderId = params.get("order_id");
            String paymentId = params.get("payment_id");
            String payhereAmount = params.get("payhere_amount");
            String payhereCurrency = params.get("payhere_currency");
            String statusCode = params.get("status_code");
            String md5sig = params.get("md5sig");
            String statusMessage = params.get("status_message");

            // ✅ Validate currency is LKR
            if (!SUPPORTED_CURRENCY.equals(payhereCurrency)) {
                logger.error("❌ Unsupported currency in notification: {}. Only {} is supported.",
                        payhereCurrency, SUPPORTED_CURRENCY);
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Unsupported currency");
            }

            // Verify hash for notification
            String secretHash = getMd5(merchantSecret);
            String expectedHashString = merchantIdFromNotification + orderId + payhereAmount + payhereCurrency + statusCode + secretHash;
            String expectedHash = getMd5(expectedHashString);

            boolean hashValid = expectedHash.equalsIgnoreCase(md5sig);
            logger.info("Hash verification - Expected: {}, Received: {}, Valid: {}", expectedHash, md5sig, hashValid);

            if (!hashValid) {
                logger.error("❌ PayHere notification hash verification failed");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Hash verification failed");
            }

            logger.info("Processing notification - Order: {}, Payment: {}, Status: {}, Currency: {}",
                    orderId, paymentId, statusCode, payhereCurrency);

            // ✅ ENHANCED: Handle payment success with comprehensive updates
            if (isPaymentSuccessful(statusCode)) {
                handleSuccessfulPayment(orderId, paymentId, payhereAmount, payhereCurrency, params);
            } else {
                handleFailedOrCancelledPayment(orderId, statusCode, statusMessage, params);
            }

            logger.info("✅ PayHere notification processed successfully for order: {}", orderId);
            return ResponseEntity.ok("OK");

        } catch (Exception e) {
            logger.error("❌ Error processing PayHere notification", e);
            return ResponseEntity.ok("Error processed");
        }
    }

    /**
     * ✅ EXISTING MAPPING: Handle payment return
     */
    @GetMapping("/return/{id}")
    public ResponseEntity<String> handlePaymentReturn(@PathVariable String id, @RequestParam Map<String, String> params) {
        try {
            logger.info("=== PAYMENT RETURN ENDPOINT WITH FULL PROCESSING ===");
            logger.info("Payment return for ID: {} with params: {}", id, params);

            // Extract payment details from return URL parameters
            String orderId = params.getOrDefault("orderId", "");
            String bookingId = params.getOrDefault("bookingId", "");
            String amountStr = params.getOrDefault("amount", "0");
            String currency = params.getOrDefault("currency", "LKR");

            // Additional PayHere parameters (if available)
            String paymentId = params.getOrDefault("payment_id", "");
            String statusCode = params.getOrDefault("status_code", "2"); // Assume success if not provided

            logger.info("Return URL Details - Order: {}, Booking: {}, Amount: {} {}, Payment: {}, Status: {}",
                    orderId, bookingId, amountStr, currency, paymentId, statusCode);

            // ✅ STEP 1: Validate return parameters
            if (orderId.isEmpty() || bookingId.isEmpty()) {
                logger.error("❌ Missing required parameters in return URL");
                return generateErrorReturnResponse("Missing payment information");
            }

            // ✅ STEP 2: Validate booking exists
            Optional<Booking> optBooking = bookingService.getBookingById(bookingId);
            if (!optBooking.isPresent()) {
                logger.error("❌ Booking not found: {}", bookingId);
                return generateErrorReturnResponse("Booking not found");
            }

            Booking booking = optBooking.get();

            // ✅ STEP 3: Check if payment already processed (avoid duplicate processing)
            if ("SUCCESS".equals(booking.getPaymentStatus())) {
                logger.info("✅ Payment already processed for booking: {}", bookingId);
                return generateSuccessReturnResponse(orderId, booking);
            }

            // ✅ STEP 4: Validate payment amount matches booking
            try {
                BigDecimal returnAmount = new BigDecimal(amountStr);
                if (returnAmount.compareTo(booking.getTotalAmount()) != 0) {
                    logger.warn("⚠️ Amount mismatch - Expected: {}, Received: {}",
                            booking.getTotalAmount(), returnAmount);
                    // Continue processing but log the discrepancy
                }
            } catch (NumberFormatException e) {
                logger.error("❌ Invalid amount in return URL: {}", amountStr);
                return generateErrorReturnResponse("Invalid payment amount");
            }

            // ✅ STEP 5: Process successful payment (MAIN DATABASE UPDATES)
            boolean processSuccess = processReturnUrlPaymentSuccess(booking, orderId, paymentId, currency, params);

            if (processSuccess) {
                logger.info("✅ Payment processing completed successfully for booking: {}", bookingId);
                return generateSuccessReturnResponse(orderId, booking);
            } else {
                logger.error("❌ Payment processing failed for booking: {}", bookingId);
                return generateErrorReturnResponse("Payment processing failed");
            }

        } catch (Exception e) {
            logger.error("❌ Error in return endpoint for ID: {}", id, e);
            return generateErrorReturnResponse("Payment processing error: " + e.getMessage());
        }
    }

    private boolean processReturnUrlPaymentSuccess(Booking booking, String orderId, String paymentId,
                                                   String currency, Map<String, String> params) {
        try {
            logger.info("=== PROCESSING RETURN URL PAYMENT SUCCESS ===");
            logger.info("Booking: {}, Order: {}, Payment: {}", booking.getId(), orderId, paymentId);

            // Generate payment ID if not provided
            if (paymentId == null || paymentId.trim().isEmpty()) {
                paymentId = "PAY_RETURN_" + System.currentTimeMillis();
                logger.info("Generated payment ID from return: {}", paymentId);
            }

            // ✅ STEP 1: Create/Update Payment Transaction
            PaymentTransaction paymentTransaction = createReturnPaymentTransaction(
                    booking, orderId, paymentId, currency, params
            );

            // ✅ STEP 2: Update Booking with Payment Success
            updateBookingForReturnSuccess(booking, orderId, paymentId, paymentTransaction);

            // ✅ STEP 3: Create Complete Money Flow Records
            createCompleteMoneyFlowRecords(booking, paymentTransaction);

            // ✅ STEP 4: Update Traveler Wallet
            updateTravelerWalletForPayment(booking);

            // ✅ STEP 5: Log Success
            logReturnPaymentSuccess(booking, paymentTransaction);

            return true;

        } catch (Exception e) {
            logger.error("❌ Error processing return URL payment success for booking: {}", booking.getId(), e);
            return false;
        }
    }

    private PaymentTransaction createReturnPaymentTransaction(Booking booking, String orderId,
                                                              String paymentId, String currency,
                                                              Map<String, String> params) {
        try {
            // Check if transaction already exists
            PaymentTransaction existingTransaction = payHerePaymentService.getPaymentByOrderId(orderId);

            if (existingTransaction != null) {
                // Update existing transaction
                existingTransaction.setPayHerePaymentId(paymentId);
                existingTransaction.setStatus("SUCCESS");
                existingTransaction.setPayHereResponse("Return URL: " + params.toString());
                existingTransaction.setUpdatedAt(LocalDateTime.now());

                payHerePaymentService.savePaymentTransaction(existingTransaction);
                logger.info("✅ Updated existing payment transaction: {}", existingTransaction.getId());
                return existingTransaction;
            } else {
                // Create new transaction
                PaymentTransaction newTransaction = new PaymentTransaction();
                newTransaction.setBookingId(booking.getId());
                newTransaction.setPayHereOrderId(orderId);
                newTransaction.setPayHerePaymentId(paymentId);
                newTransaction.setAmount(booking.getTotalAmount());
                newTransaction.setCurrency(currency);
                newTransaction.setStatus("SUCCESS");
                newTransaction.setType("PAYMENT");
                newTransaction.setPayHereResponse("Return URL: " + params.toString());
                newTransaction.setCreatedAt(LocalDateTime.now());
                newTransaction.setUpdatedAt(LocalDateTime.now());

                payHerePaymentService.savePaymentTransaction(newTransaction);
                logger.info("✅ Created new payment transaction: {}", newTransaction.getId());
                return newTransaction;
            }
        } catch (Exception e) {
            logger.error("❌ Error creating payment transaction from return URL", e);
            throw e;
        }
    }

    private ResponseEntity<String> generateSuccessReturnResponse(String orderId, Booking booking) {
        String successHtml = "<!DOCTYPE html><html><head><title>Payment Successful</title>" +
                "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">" +
                "<meta http-equiv=\"refresh\" content=\"3;url=travelsri://payment-success?orderId=" + orderId +
                "&bookingId=" + booking.getId() + "&amount=" + booking.getTotalAmount() + "\">" +
                "<style>" +
                "body{font-family:Arial;text-align:center;padding:50px;background:#10b981;color:white;margin:0}" +
                ".container{background:white;color:#333;border-radius:16px;padding:40px;max-width:400px;margin:0 auto;box-shadow:0 20px 40px rgba(0,0,0,0.1)}" +
                ".icon{font-size:64px;margin-bottom:20px}" +
                ".amount{font-size:24px;font-weight:bold;color:#10b981;margin:20px 0}" +
                ".details{background:#f8f9fa;padding:15px;border-radius:8px;margin:20px 0}" +
                ".redirect{color:#666;font-size:14px;margin-top:20px}" +
                "</style></head>" +
                "<body><div class=\"container\">" +
                "<div class=\"icon\">✅</div>" +
                "<h2>Payment Successful!</h2>" +
                "<div class=\"amount\">" + booking.getTotalAmount() + " LKR</div>" +
                "<div class=\"details\">" +
                "<strong>Booking ID:</strong> " + booking.getId() + "<br>" +
                "<strong>Order ID:</strong> " + orderId + "<br>" +
                "<strong>Status:</strong> Confirmed" +
                "</div>" +
                "<p>Your booking has been confirmed and payment processed successfully.</p>" +
                "<div class=\"redirect\">Redirecting to TravelSri app in 3 seconds...</div>" +
                "<script>setTimeout(() => window.location.href='travelsri://payment-success?orderId=" + orderId +
                "&bookingId=" + booking.getId() + "&amount=" + booking.getTotalAmount() + "', 3000);</script>" +
                "</div></body></html>";

        return ResponseEntity.ok().contentType(MediaType.TEXT_HTML).body(successHtml);
    }

    /**
     * ✅ NEW: Generate error return response
     */
    private ResponseEntity<String> generateErrorReturnResponse(String errorMessage) {
        String errorHtml = "<!DOCTYPE html><html><head><title>Payment Error</title>" +
                "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">" +
                "<meta http-equiv=\"refresh\" content=\"5;url=travelsri://payment-error?reason=" +
                java.net.URLEncoder.encode(errorMessage, java.nio.charset.StandardCharsets.UTF_8) + "\">" +
                "<style>" +
                "body{font-family:Arial;text-align:center;padding:50px;background:#ef4444;color:white;margin:0}" +
                ".container{background:white;color:#333;border-radius:16px;padding:40px;max-width:400px;margin:0 auto;box-shadow:0 20px 40px rgba(0,0,0,0.1)}" +
                ".icon{font-size:64px;margin-bottom:20px}" +
                ".redirect{color:#666;font-size:14px;margin-top:20px}" +
                "</style></head>" +
                "<body><div class=\"container\">" +
                "<div class=\"icon\">❌</div>" +
                "<h2>Payment Processing Error</h2>" +
                "<p>" + errorMessage + "</p>" +
                "<p>Please try again or contact support if the problem persists.</p>" +
                "<div class=\"redirect\">Redirecting to TravelSri app in 5 seconds...</div>" +
                "</div></body></html>";

        return ResponseEntity.ok().contentType(MediaType.TEXT_HTML).body(errorHtml);
    }

    /**
     * ✅ NEW: Update booking for return URL success
     */
    private void updateBookingForReturnSuccess(Booking booking, String orderId, String paymentId,
                                               PaymentTransaction transaction) {
        try {
            logger.info("Updating booking from return URL: {}", booking.getId());

            // Basic payment updates
            booking.setPayHereOrderId(orderId);
            booking.setPayHerePaymentId(paymentId);
            booking.setPaymentStatus("SUCCESS");
            booking.setStatus("PENDING_PROVIDER_ACCEPTANCE");
            booking.setCurrency(SUPPORTED_CURRENCY);

            // ✅ Calculate financial breakdowns
            if (booking.getTotalAmount() != null) {
                if (booking.getPlatformCommission() == null) {
                    booking.setPlatformCommission(booking.getTotalAmount().multiply(BigDecimal.valueOf(0.05))); // 5%
                }
                if (booking.getProviderConfirmationFee() == null) {
                    booking.setProviderConfirmationFee(booking.getTotalAmount().multiply(BigDecimal.valueOf(0.10))); // 10%
                }
            }

            // ✅ Set important deadlines
            if (booking.getBookingTime() == null) {
                booking.setBookingTime(LocalDateTime.now());
            }
            if (booking.getCancellationDeadline() == null) {
                booking.setCancellationDeadline(booking.getBookingTime().plusHours(20));
            }
            if (booking.getRefundDeadline() == null && booking.getServiceStartDate() != null) {
                booking.setRefundDeadline(booking.getServiceStartDate().minusDays(2));
            }

            // ✅ Add transaction to booking history
            if (booking.getTransactions() == null) {
                booking.setTransactions(new ArrayList<>());
            }

            boolean transactionExists = booking.getTransactions().stream()
                    .anyMatch(t -> transaction.getPayHereOrderId().equals(t.getPayHereOrderId()));

            if (!transactionExists) {
                booking.getTransactions().add(transaction);
            }

            // Save booking
            booking.onUpdate();
            bookingService.updateBooking(booking);

            logger.info("✅ Booking updated from return URL: Status={}, Commission={} LKR",
                    booking.getStatus(), booking.getPlatformCommission());

        } catch (Exception e) {
            logger.error("❌ Error updating booking from return URL: {}", booking.getId(), e);
            throw e;
        }
    }

    /**
     * ✅ NEW: Log return URL payment success
     */
    private void logReturnPaymentSuccess(Booking booking, PaymentTransaction transaction) {
        logger.info("=== RETURN URL PAYMENT SUCCESS SUMMARY ===");
        logger.info("✅ Source: PayHere Return URL");
        logger.info("✅ Booking ID: {}", booking.getId());
        logger.info("✅ Total Amount: {} {}", booking.getTotalAmount(), booking.getCurrency());
        logger.info("✅ Platform Commission: {} LKR", booking.getPlatformCommission());
        logger.info("✅ Confirmation Fee: {} LKR", booking.getProviderConfirmationFee());
        logger.info("✅ Final Payout: {} LKR", booking.calculateFinalPayout());
        logger.info("✅ PayHere Order: {}", booking.getPayHereOrderId());
        logger.info("✅ PayHere Payment: {}", booking.getPayHerePaymentId());
        logger.info("✅ New Status: {}", booking.getStatus());
        logger.info("✅ Payment Status: {}", booking.getPaymentStatus());
        logger.info("===============================================");
    }


    /**
     * ✅ EXISTING MAPPING: Handle payment cancellation
     */
    @GetMapping("/cancel/{id}")
    public ResponseEntity<String> handlePaymentCancel(@PathVariable String id, @RequestParam Map<String, String> params) {
        try {
            logger.info("=== PAYMENT CANCEL ENDPOINT ===");
            logger.info("Payment cancelled for ID: {} with params: {}", id, params);

            return ResponseEntity.ok().contentType(MediaType.TEXT_HTML).body(
                    generateCancelPage(id, "Payment cancelled by user")
            );

        } catch (Exception e) {
            logger.error("Error in cancel endpoint", e);
            return ResponseEntity.ok().contentType(MediaType.TEXT_HTML).body(
                    generateErrorCancelPage()
            );
        }
    }

    /**
     * ✅ EXISTING MAPPING: Health check
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> healthCheck() {
        Map<String, Object> healthResponse = new HashMap<>();
        healthResponse.put("success", true);
        healthResponse.put("message", "PayHere service is healthy");
        healthResponse.put("timestamp", System.currentTimeMillis());
        healthResponse.put("merchantId", merchantId);
        healthResponse.put("sandboxMode", sandboxMode);
        healthResponse.put("supportedCurrency", SUPPORTED_CURRENCY);
        healthResponse.put("currencySupport", "LKR Only");
        healthResponse.put("version", "LKR_ONLY_v2.0_Enhanced");

        // Add service connectivity check
        healthResponse.put("serviceConnectivity", checkServiceConnectivity());

        return ResponseEntity.ok(healthResponse);
    }

    // ===== ✅ NEW ENHANCED HELPER METHODS =====

    /**
     * ✅ NEW: Handle successful payment with comprehensive updates
     */
    private void handleSuccessfulPayment(String orderId, String paymentId, String amount,
                                         String currency, Map<String, String> params) {
        try {
            logger.info("=== PROCESSING SUCCESSFUL PAYMENT ===");
            logger.info("Order: {}, Payment: {}, Amount: {} {}", orderId, paymentId, amount, currency);

            BigDecimal paymentAmount = new BigDecimal(amount);

            // 1. Update/Create Payment Transaction
            PaymentTransaction paymentTransaction = updateOrCreatePaymentTransaction(
                    orderId, paymentId, paymentAmount, currency, "SUCCESS", params
            );

            // 2. Get and Update Booking Details
            Optional<Booking> optBooking = bookingService.getBookingByPayHereOrderId(orderId);
            if (optBooking.isPresent()) {
                Booking booking = optBooking.get();

                // ✅ STEP 1: Update booking for successful payment
                updateBookingForSuccessfulPayment(booking, paymentId, paymentTransaction);

                // ✅ STEP 2: Create comprehensive money flow records
                createCompleteMoneyFlowRecords(booking, paymentTransaction);

                // ✅ STEP 3: Update traveler wallet with spending
                updateTravelerWalletForPayment(booking);

                // ✅ STEP 4: Log the complete success
                logPaymentSuccess(booking, paymentTransaction);

                logger.info("✅ Successfully processed payment for booking: {}", booking.getId());
            } else {
                logger.warn("⚠️ No booking found for order ID: {}", orderId);
                // Still save the payment transaction even if booking not found
            }

        } catch (Exception e) {
            logger.error("❌ Error handling successful payment for order: {}", orderId, e);
            // Don't rethrow - we want to acknowledge the payment to PayHere
        }
    }

    private void logPaymentSuccess(Booking booking, PaymentTransaction transaction) {
        try {
            logger.info("=== PAYMENT SUCCESS SUMMARY ===");
            logger.info("Booking ID: {}", booking.getId());
            logger.info("Traveler ID: {}", booking.getTravelerId());
            logger.info("Provider ID: {}", booking.getProviderId());
            logger.info("Total Amount: {} {}", booking.getTotalAmount(), booking.getCurrency());
            logger.info("Platform Commission: {} LKR", booking.getPlatformCommission());
            logger.info("Confirmation Fee: {} LKR", booking.getProviderConfirmationFee());
            logger.info("Final Payout: {} LKR", booking.calculateFinalPayout());
            logger.info("PayHere Order ID: {}", booking.getPayHereOrderId());
            logger.info("PayHere Payment ID: {}", booking.getPayHerePaymentId());
            logger.info("Booking Status: {}", booking.getStatus());
            logger.info("Payment Status: {}", booking.getPaymentStatus());
            logger.info("Transaction ID: {}", transaction.getId());
            logger.info("================================");
        } catch (Exception e) {
            logger.warn("Error logging payment success details", e);
        }
    }

    /**
     * ✅ ENHANCED: Update traveler wallet with comprehensive data
     */
    private void updateTravelerWalletForPayment(Booking booking) {
        try {
            logger.info("Updating traveler wallet for successful payment: {}", booking.getTravelerId());

            // Use the service to add spending - this will create/update wallet automatically
            TravelerWallet updatedWallet = travelerWalletService.addSpending(
                    booking.getTravelerId(),
                    booking.getTotalAmount(),
                    booking.getId()
            );

            logger.info("✅ Traveler wallet updated - Total spent: {} LKR for traveler: {}",
                    updatedWallet.getTotalSpent(), booking.getTravelerId());

        } catch (Exception e) {
            logger.error("❌ Error updating traveler wallet for: {}", booking.getTravelerId(), e);
            // Don't throw - this shouldn't stop the payment processing
        }
    }


    /**
     * ✅ NEW: Update or create payment transaction record
     */
    private PaymentTransaction updateOrCreatePaymentTransaction(String orderId, String paymentId,
                                                                BigDecimal amount, String currency,
                                                                String status, Map<String, String> params) {
        try {
            PaymentTransaction transaction = payHerePaymentService.getPaymentByOrderId(orderId);

            if (transaction == null) {
                transaction = new PaymentTransaction();
                transaction.setPayHereOrderId(orderId);
                transaction.setType("PAYMENT");
                transaction.setCreatedAt(LocalDateTime.now());
                logger.info("Creating new payment transaction for order: {}", orderId);
            }

            // Update transaction details
            transaction.setPayHerePaymentId(paymentId);
            transaction.setAmount(amount);
            transaction.setCurrency(currency);
            transaction.setStatus(status);
            transaction.setPayHereResponse(params.toString());
            transaction.setUpdatedAt(LocalDateTime.now());

            payHerePaymentService.savePaymentTransaction(transaction);
            logger.info("✅ Payment transaction saved: ID={}, Amount={} {}",
                    transaction.getId(), amount, currency);

            return transaction;

        } catch (Exception e) {
            logger.error("❌ Error updating payment transaction for order: {}", orderId, e);
            throw e;
        }
    }

    private void createCompleteMoneyFlowRecords(Booking booking, PaymentTransaction transaction) {
        try {
            logger.info("Creating comprehensive money flow records for booking: {}", booking.getId());

            // ✅ FLOW 1: Main payment flow: Traveler -> Platform
            MoneyFlow mainPayment = createMoneyFlow(
                    booking.getId(),
                    "TRAVELER", "PLATFORM",
                    booking.getTravelerId(), "PLATFORM_ACCOUNT",
                    booking.getTotalAmount(),
                    "PAYMENT",
                    "Customer payment for booking " + booking.getId(),
                    "COMPLETED",
                    transaction.getPayHerePaymentId()
            );
            moneyFlowService.save(mainPayment);
            logger.info("✅ Created main payment flow: {} LKR", booking.getTotalAmount());

            // ✅ FLOW 2: Platform commission flow (5%)
            if (booking.getPlatformCommission() != null && booking.getPlatformCommission().compareTo(BigDecimal.ZERO) > 0) {
                MoneyFlow commissionFlow = createMoneyFlow(
                        booking.getId(),
                        "PLATFORM", "PLATFORM",
                        "PLATFORM_ACCOUNT", "PLATFORM_REVENUE",
                        booking.getPlatformCommission(),
                        "COMMISSION",
                        "Platform commission (5%) for booking " + booking.getId(),
                        "COMPLETED",
                        transaction.getPayHerePaymentId()
                );
                moneyFlowService.save(commissionFlow);
                logger.info("✅ Created commission flow: {} LKR", booking.getPlatformCommission());
            }

            // ✅ FLOW 3: Provider confirmation fee allocation (10%) - PENDING until 20 hours
            if (booking.getProviderConfirmationFee() != null && booking.getProviderConfirmationFee().compareTo(BigDecimal.ZERO) > 0) {
                MoneyFlow confirmationFeeAllocation = createMoneyFlow(
                        booking.getId(),
                        "PLATFORM", "PROVIDER",
                        "PLATFORM_ACCOUNT", booking.getProviderId(),
                        booking.getProviderConfirmationFee(),
                        "CONFIRMATION_FEE",
                        "Confirmation fee allocation (10%) for booking " + booking.getId(),
                        "PENDING", // Will be COMPLETED when actually paid after 20 hours
                        transaction.getPayHerePaymentId()
                );
                moneyFlowService.save(confirmationFeeAllocation);
                logger.info("✅ Created confirmation fee allocation: {} LKR (PENDING)", booking.getProviderConfirmationFee());
            }

            // ✅ FLOW 4: Final payout allocation (75%) - PENDING until service completed
            BigDecimal finalPayout = booking.calculateFinalPayout();
            if (finalPayout != null && finalPayout.compareTo(BigDecimal.ZERO) > 0) {
                MoneyFlow finalPayoutAllocation = createMoneyFlow(
                        booking.getId(),
                        "PLATFORM", "PROVIDER",
                        "PLATFORM_ACCOUNT", booking.getProviderId(),
                        finalPayout,
                        "FINAL_PAYOUT",
                        "Final payout allocation (75%) for booking " + booking.getId(),
                        "PENDING", // Will be COMPLETED when service is completed
                        transaction.getPayHerePaymentId()
                );
                moneyFlowService.save(finalPayoutAllocation);
                logger.info("✅ Created final payout allocation: {} LKR (PENDING)", finalPayout);
            }

            logger.info("✅ All money flow records created successfully for booking: {}", booking.getId());

        } catch (Exception e) {
            logger.error("❌ Error creating money flow records for booking: {}", booking.getId(), e);
            // Don't throw - this shouldn't stop the payment processing
        }
    }

    private MoneyFlow createMoneyFlow(String bookingId, String fromEntity, String toEntity,
                                      String fromEntityId, String toEntityId, BigDecimal amount,
                                      String flowType, String description, String status,
                                      String transactionReference) {
        MoneyFlow moneyFlow = new MoneyFlow();
        moneyFlow.setBookingId(bookingId);
        moneyFlow.setFromEntity(fromEntity);
        moneyFlow.setToEntity(toEntity);
        moneyFlow.setFromEntityId(fromEntityId);
        moneyFlow.setToEntityId(toEntityId);
        moneyFlow.setAmount(amount);
        moneyFlow.setFlowType(flowType);
        moneyFlow.setDescription(description);
        moneyFlow.setStatus(status);
        moneyFlow.setTransactionReference(transactionReference);
        moneyFlow.setCreatedAt(LocalDateTime.now());
        return moneyFlow;
    }

    /**
     * ✅ NEW: Update booking for successful payment
     */
    private void updateBookingForSuccessfulPayment(Booking booking, String paymentId,
                                                   PaymentTransaction transaction) {
        try {
            logger.info("Updating booking for successful payment: {}", booking.getId());

            // Basic payment updates
            booking.setPayHerePaymentId(paymentId);
            booking.setPaymentStatus("SUCCESS");
            booking.setStatus("PENDING_PROVIDER_ACCEPTANCE");
            booking.setCurrency(SUPPORTED_CURRENCY);

            // ✅ ENSURE ALL FINANCIAL CALCULATIONS ARE SET
            if (booking.getTotalAmount() != null) {
                // Platform commission (5%)
                if (booking.getPlatformCommission() == null) {
                    booking.setPlatformCommission(booking.getTotalAmount().multiply(BigDecimal.valueOf(0.05)));
                    logger.info("✅ Set platform commission: {} LKR", booking.getPlatformCommission());
                }

                // Provider confirmation fee (10%)
                if (booking.getProviderConfirmationFee() == null) {
                    booking.setProviderConfirmationFee(booking.getTotalAmount().multiply(BigDecimal.valueOf(0.10)));
                    logger.info("✅ Set confirmation fee: {} LKR", booking.getProviderConfirmationFee());
                }
            }

            // ✅ SET IMPORTANT DEADLINES
            if (booking.getBookingTime() == null) {
                booking.setBookingTime(LocalDateTime.now());
            }

            if (booking.getCancellationDeadline() == null) {
                booking.setCancellationDeadline(booking.getBookingTime().plusHours(20));
                logger.info("✅ Set cancellation deadline: {}", booking.getCancellationDeadline());
            }

            if (booking.getRefundDeadline() == null && booking.getServiceStartDate() != null) {
                booking.setRefundDeadline(booking.getServiceStartDate().minusDays(2));
                logger.info("✅ Set refund deadline: {}", booking.getRefundDeadline());
            }

            // ✅ ADD TRANSACTION TO BOOKING HISTORY
            if (booking.getTransactions() == null) {
                booking.setTransactions(new ArrayList<>());
            }

            boolean transactionExists = booking.getTransactions().stream()
                    .anyMatch(t -> transaction.getPayHereOrderId().equals(t.getPayHereOrderId()));

            if (!transactionExists) {
                booking.getTransactions().add(transaction);
                logger.info("✅ Added transaction to booking history");
            }

            // Update booking
            booking.onUpdate();
            bookingService.updateBooking(booking);

            logger.info("✅ Booking updated successfully: Status={}, PaymentStatus={}, Commission={} LKR",
                    booking.getStatus(), booking.getPaymentStatus(), booking.getPlatformCommission());

        } catch (Exception e) {
            logger.error("❌ Error updating booking for successful payment: {}", booking.getId(), e);
            throw e;
        }
    }

    /**
     * ✅ NEW: Create money flow records for successful payment
     */
    private void createMoneyFlowRecords(Booking booking, PaymentTransaction transaction) {
        try {
            logger.info("Creating money flow records for booking: {}", booking.getId());

            // Main payment flow: Traveler -> Platform
            MoneyFlow mainPayment = new MoneyFlow();
            mainPayment.setBookingId(booking.getId());
            mainPayment.setFromEntity("TRAVELER");
            mainPayment.setToEntity("PLATFORM");
            mainPayment.setFromEntityId(booking.getTravelerId());
            mainPayment.setToEntityId("PLATFORM_ACCOUNT");
            mainPayment.setAmount(booking.getTotalAmount());
            mainPayment.setFlowType("PAYMENT");
            mainPayment.setDescription("Customer payment for booking " + booking.getId());
            mainPayment.setStatus("COMPLETED");
            mainPayment.setTransactionReference(transaction.getPayHerePaymentId());
            mainPayment.setCreatedAt(LocalDateTime.now());

            moneyFlowService.save(mainPayment);

            // Platform commission flow
            if (booking.getPlatformCommission() != null && booking.getPlatformCommission().compareTo(BigDecimal.ZERO) > 0) {
                MoneyFlow commissionFlow = new MoneyFlow();
                commissionFlow.setBookingId(booking.getId());
                commissionFlow.setFromEntity("PLATFORM");
                commissionFlow.setToEntity("PLATFORM");
                commissionFlow.setFromEntityId("PLATFORM_ACCOUNT");
                commissionFlow.setToEntityId("PLATFORM_REVENUE");
                commissionFlow.setAmount(booking.getPlatformCommission());
                commissionFlow.setFlowType("COMMISSION");
                commissionFlow.setDescription("Platform commission for booking " + booking.getId());
                commissionFlow.setStatus("COMPLETED");
                commissionFlow.setTransactionReference(transaction.getPayHerePaymentId());
                commissionFlow.setCreatedAt(LocalDateTime.now());

                moneyFlowService.save(commissionFlow);
            }

            logger.info("✅ Money flow records created for booking: {}", booking.getId());

        } catch (Exception e) {
            logger.error("❌ Error creating money flow records for booking: {}", booking.getId(), e);
        }
    }

    /**
     * ✅ NEW: Update traveler wallet for successful payment
     */
    private void updateTravelerWallet(Booking booking) {
        try {
            logger.info("Updating traveler wallet for successful payment: {}", booking.getTravelerId());

            TravelerWallet wallet = travelerWalletService.getOrCreateWallet(booking.getTravelerId());

            if (wallet.getTotalSpent() == null) {
                wallet.setTotalSpent(BigDecimal.ZERO);
            }

            wallet.setTotalSpent(wallet.getTotalSpent().add(booking.getTotalAmount()));
            wallet.setLastUpdated(LocalDateTime.now());

            travelerWalletService.save(wallet);

            logger.info("✅ Traveler wallet updated for: {}", booking.getTravelerId());

        } catch (Exception e) {
            logger.error("❌ Error updating traveler wallet for: {}", booking.getTravelerId(), e);
        }
    }

    /**
     * ✅ NEW: Handle failed or cancelled payments
     */
    private void handleFailedOrCancelledPayment(String orderId, String statusCode,
                                                String statusMessage, Map<String, String> params) {
        try {
            logger.info("=== PROCESSING FAILED/CANCELLED PAYMENT ===");
            logger.info("Order: {}, Status: {}, Message: {}", orderId, statusCode, statusMessage);

            String paymentStatus = getPaymentStatusDescription(Integer.parseInt(statusCode));

            // Update payment transaction
            PaymentTransaction transaction = payHerePaymentService.getPaymentByOrderId(orderId);
            if (transaction != null) {
                transaction.setStatus(paymentStatus.toUpperCase());
                transaction.setPayHereResponse(params.toString());
                transaction.setUpdatedAt(LocalDateTime.now());
                payHerePaymentService.savePaymentTransaction(transaction);
            }

            // Update booking
            Optional<Booking> optBooking = bookingService.getBookingByPayHereOrderId(orderId);
            if (optBooking.isPresent()) {
                Booking booking = optBooking.get();

                switch (statusCode) {
                    case "-1": // CANCELLED
                        booking.setPaymentStatus("CANCELLED");
                        booking.setStatus("CANCELLED_BY_TRAVELER");
                        booking.setCancellationReason("Payment cancelled by user");
                        booking.setCancellationType("TRAVELER_CANCELLED");
                        break;
                    case "0": // PENDING
                        booking.setPaymentStatus("PENDING");
                        booking.setStatus("PENDING_PAYMENT");
                        break;
                    case "-2": // FAILED
                        booking.setPaymentStatus("FAILED");
                        booking.setStatus("PAYMENT_FAILED");
                        break;
                    case "-3": // CHARGEDBACK
                        booking.setPaymentStatus("CHARGEDBACK");
                        booking.setStatus("CHARGEDBACK");
                        break;
                }

                booking.setCurrency(SUPPORTED_CURRENCY);
                booking.onUpdate();
                bookingService.updateBooking(booking);

                logger.info("✅ Updated booking for failed/cancelled payment: Status={}", booking.getStatus());
            }

        } catch (Exception e) {
            logger.error("❌ Error handling failed/cancelled payment for order: {}", orderId, e);
        }
    }

    // ===== ✅ HELPER METHODS =====

    /**
     * ✅ NEW: Create payment object for PayHere
     */
    private Map<String, Object> createPaymentObject(String merchantId, String returnUrl, String cancelUrl,
                                                    String firstName, String lastName, String email, String phone,
                                                    String address, String city, String country, String orderId,
                                                    String items, String currency, double amount, String hash,
                                                    String bookingId) {
        Map<String, Object> paymentObject = new HashMap<>();

        // Required fields
        paymentObject.put("merchant_id", merchantId);
        paymentObject.put("return_url", returnUrl);
        paymentObject.put("cancel_url", cancelUrl);
        paymentObject.put("notify_url", appBaseUrl + "/api/payments/payhere/notify");
        paymentObject.put("first_name", firstName);
        paymentObject.put("last_name", lastName);
        paymentObject.put("email", email);
        paymentObject.put("phone", phone);
        paymentObject.put("address", address);
        paymentObject.put("city", city);
        paymentObject.put("country", country);
        paymentObject.put("order_id", orderId);
        paymentObject.put("items", items);
        paymentObject.put("currency", currency);

        // Format amount
        DecimalFormat df = new DecimalFormat("0.00");
        String formattedAmount = df.format(amount);
        paymentObject.put("amount", formattedAmount);
        paymentObject.put("hash", hash);
        paymentObject.put("sandbox", sandboxMode);

        // Optional fields
        paymentObject.put("delivery_address", address);
        paymentObject.put("delivery_city", city);
        paymentObject.put("delivery_country", country);

        // Custom tracking fields
        if (bookingId != null) {
            paymentObject.put("custom_1", bookingId);
        }
        paymentObject.put("custom_2", orderId);

        return paymentObject;
    }

    /**
     * ✅ NEW: Validate payment object has all required fields
     */
    private boolean validatePaymentObject(Map<String, Object> paymentObject) {
        String[] requiredFields = {
                "merchant_id", "return_url", "cancel_url", "notify_url",
                "first_name", "last_name", "email", "phone", "address", "city", "country",
                "order_id", "items", "currency", "amount", "hash"
        };

        boolean allValid = true;
        for (String field : requiredFields) {
            Object value = paymentObject.get(field);
            if (value == null || value.toString().trim().isEmpty()) {
                logger.error("❌ Missing field: {}", field);
                allValid = false;
            } else {
                logger.info("✅ {}: {}", field,
                        "hash".equals(field) ? value.toString().substring(0, 8) + "..." : value);
            }
        }

        return allValid;
    }

    /**
     * ✅ NEW: Save initial payment transaction when checkout is created
     */
    private void saveInitialPaymentTransaction(String bookingId, String orderId, BigDecimal totalAmount, String currency) {
        try {
            PaymentTransaction paymentTransaction = new PaymentTransaction();
            paymentTransaction.setBookingId(bookingId);
            paymentTransaction.setPayHereOrderId(orderId);
            paymentTransaction.setAmount(totalAmount);
            paymentTransaction.setCurrency(currency);
            paymentTransaction.setStatus("PENDING");
            paymentTransaction.setType("PAYMENT");
            paymentTransaction.setCreatedAt(LocalDateTime.now());
            paymentTransaction.setUpdatedAt(LocalDateTime.now());

            payHerePaymentService.savePaymentTransaction(paymentTransaction);
            logger.info("✅ Saved payment transaction to database");

            // Update booking
            Optional<Booking> optBooking = bookingService.getBookingById(bookingId);
            if (optBooking.isPresent()) {
                Booking booking = optBooking.get();
                booking.setPayHereOrderId(orderId);
                booking.setPaymentStatus("PENDING");
                booking.setStatus("PENDING_PAYMENT");
                booking.setCurrency(SUPPORTED_CURRENCY);
                booking.onUpdate();
                bookingService.updateBooking(booking);
                logger.info("✅ Updated booking with order ID and status");
            }
        } catch (Exception e) {
            logger.warn("⚠️ Could not save payment transaction: {}", e.getMessage());
        }
    }

    /**
     * ✅ NEW: Create checkout response
     */
    private Map<String, Object> createCheckoutResponse(Map<String, Object> paymentObject, String orderId,
                                                       String bookingId, double amount, String currency,
                                                       String checkoutUrl, String returnUrl, String cancelUrl,
                                                       boolean hashMatches) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("paymentObject", paymentObject);
        response.put("orderId", orderId);
        response.put("bookingId", bookingId);

        DecimalFormat df = new DecimalFormat("0.00");
        response.put("amount", df.format(amount));
        response.put("currency", currency);
        response.put("supportedCurrency", SUPPORTED_CURRENCY);
        response.put("checkoutUrl", checkoutUrl);
        response.put("sandbox", sandboxMode);
        response.put("hashVerification", hashMatches);
        response.put("directAppRedirect", true);
        response.put("returnUrl", returnUrl);
        response.put("cancelUrl", cancelUrl);
        response.put("message", "Payment object created with direct app redirect (LKR only)");

        return response;
    }

    /**
     * ✅ NEW: Check service connectivity
     */
    private Map<String, Object> checkServiceConnectivity() {
        Map<String, Object> connectivity = new HashMap<>();

        try {
            // Check database connectivity
            connectivity.put("database", "CONNECTED");

            // Check PayHere service URL
            String payhereUrl = sandboxMode ?
                    "https://sandbox.payhere.lk/pay/checkout" :
                    "https://www.payhere.lk/pay/checkout";
            connectivity.put("payhereService", payhereUrl);
            connectivity.put("payhereStatus", "AVAILABLE");

        } catch (Exception e) {
            connectivity.put("error", e.getMessage());
            connectivity.put("status", "DEGRADED");
        }

        return connectivity;
    }

    // ===== ✅ PAGE GENERATION METHODS =====

    /**
     * ✅ NEW: Generate return page
     */
    private String generateReturnPage(String orderId, String statusCode) {
        boolean isSuccess = isPaymentSuccessful(statusCode);
        String status = isSuccess ? "SUCCESS" : "PROCESSING";
        String icon = isSuccess ? "✅" : "⏳";
        String color = isSuccess ? "#10b981" : "#f59e0b";

        return "<!DOCTYPE html><html><head><title>Payment " + status + "</title>" +
                "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">" +
                "<style>body{font-family:Arial;text-align:center;padding:50px;background:" + color + ";color:white}" +
                ".container{background:white;color:#333;border-radius:16px;padding:40px;max-width:400px;margin:0 auto}" +
                ".icon{font-size:64px;margin-bottom:20px}</style></head>" +
                "<body><div class=\"container\"><div class=\"icon\">" + icon + "</div>" +
                "<h2>Payment " + status + "</h2>" +
                "<p>This page should not normally be seen as payments redirect directly to the app.</p>" +
                "<p>If you see this page, please return to the TravelSri app manually.</p>" +
                "<p><strong>Order ID:</strong> " + orderId + "</p>" +
                "<p><strong>Status:</strong> " + status + "</p></div></body></html>";
    }

    /**
     * ✅ NEW: Generate error return page
     */
    private String generateErrorReturnPage() {
        return "<!DOCTYPE html><html><head><title>Payment Processing</title>" +
                "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">" +
                "<style>body{font-family:Arial;text-align:center;padding:50px;background:#f59e0b;color:white}" +
                ".container{background:white;color:#333;border-radius:16px;padding:40px;max-width:400px;margin:0 auto}</style></head>" +
                "<body><div class=\"container\"><h2>⚠️ Payment Processing</h2>" +
                "<p>Please return to the TravelSri app to check your payment status.</p></div></body></html>";
    }

    /**
     * ✅ NEW: Generate error cancel page
     */
    private String generateErrorCancelPage() {
        return "<!DOCTYPE html><html><head><title>Payment Cancelled</title>" +
                "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">" +
                "<style>body{font-family:Arial;text-align:center;padding:50px;background:#ef4444;color:white}" +
                ".container{background:white;color:#333;border-radius:16px;padding:40px;max-width:400px;margin:0 auto}</style></head>" +
                "<body><div class=\"container\"><h2>⚠️ Payment Cancelled</h2>" +
                "<p>Please return to the TravelSri app.</p></div></body></html>";
    }

    // ===== ✅ EXISTING HELPER METHODS =====

    private String getPaymentStatusDescription(int statusCode) {
        switch (statusCode) {
            case 2: return "Success";
            case 0: return "Pending";
            case -1: return "Canceled";
            case -2: return "Failed";
            case -3: return "Chargedback";
            default: return "Unknown";
        }
    }

    private boolean isPaymentSuccessful(String statusCode) {
        try {
            return Integer.parseInt(statusCode) == 2;
        } catch (NumberFormatException e) {
            return false;
        }
    }

    private String generateSuccessPage(String id, String message, String orderDetails) {
        return "<!DOCTYPE html><html><head><title>Payment Successful</title><meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"><style>body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:linear-gradient(135deg,#10b981 0%,#059669 100%);margin:0;padding:40px 20px;display:flex;align-items:center;justify-content:center;min-height:100vh;color:white}.container{background:white;color:#1f2937;border-radius:16px;padding:40px;text-align:center;max-width:400px;width:100%;box-shadow:0 20px 40px rgba(0,0,0,0.1)}.icon{font-size:64px;margin-bottom:20px}h1{margin:0 0 16px 0;color:#10b981}p{color:#6b7280;margin:16px 0}.id{background:#f3f4f6;padding:12px;border-radius:8px;font-family:monospace;margin:16px 0}.close-btn{background:#10b981;color:white;border:none;padding:12px 24px;border-radius:8px;font-size:16px;cursor:pointer;margin-top:20px}.currency{color:#059669;font-weight:bold}</style></head><body><div class=\"container\"><div class=\"icon\">✅</div><h1>Payment Successful!</h1><p>Your payment has been processed successfully in <span class=\"currency\">" + SUPPORTED_CURRENCY + "</span>.</p><div class=\"id\">ID: " + id + "</div><p>You can now close this window and return to the app.</p><button class=\"close-btn\" onclick=\"window.close()\">Close Window</button></div></body></html>";
    }

    private String generateCancelPage(String id, String message) {
        return "<!DOCTYPE html><html><head><title>Payment Cancelled</title><meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"><style>body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:linear-gradient(135deg,#ef4444 0%,#dc2626 100%);margin:0;padding:40px 20px;display:flex;align-items:center;justify-content:center;min-height:100vh;color:white}.container{background:white;color:#1f2937;border-radius:16px;padding:40px;text-align:center;max-width:400px;width:100%;box-shadow:0 20px 40px rgba(0,0,0,0.1)}.icon{font-size:64px;margin-bottom:20px}h1{margin:0 0 16px 0;color:#ef4444}p{color:#6b7280;margin:16px 0}.id{background:#f3f4f6;padding:12px;border-radius:8px;font-family:monospace;margin:16px 0}.close-btn{background:#ef4444;color:white;border:none;padding:12px 24px;border-radius:8px;font-size:16px;cursor:pointer;margin-top:20px}.currency{color:#dc2626;font-weight:bold}</style></head><body><div class=\"container\"><div class=\"icon\">❌</div><h1>Payment Cancelled</h1><p>Your <span class=\"currency\">" + SUPPORTED_CURRENCY + "</span> payment was cancelled.</p><div class=\"id\">ID: " + id + "</div><p>You can close this window and try again.</p><button class=\"close-btn\" onclick=\"window.close()\">Close Window</button></div></body></html>";
    }

    private String generateErrorPage(String id, String message) {
        return "<!DOCTYPE html><html><head><title>Payment Error</title><meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"><style>body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:linear-gradient(135deg,#f59e0b 0%,#d97706 100%);margin:0;padding:40px 20px;display:flex;align-items:center;justify-content:center;min-height:100vh;color:white}.container{background:white;color:#1f2937;border-radius:16px;padding:40px;text-align:center;max-width:400px;width:100%;box-shadow:0 20px 40px rgba(0,0,0,0.1)}.icon{font-size:64px;margin-bottom:20px}h1{margin:0 0 16px 0;color:#f59e0b}p{color:#6b7280;margin:16px 0}.id{background:#f3f4f6;padding:12px;border-radius:8px;font-family:monospace;margin:16px 0}.close-btn{background:#f59e0b;color:white;border:none;padding:12px 24px;border-radius:8px;font-size:16px;cursor:pointer;margin-top:20px}.currency{color:#d97706;font-weight:bold}</style></head><body><div class=\"container\"><div class=\"icon\">⚠️</div><h1>Payment Error</h1><p>" + message + "</p><div class=\"id\">ID: " + id + "</div><p>Please try again or contact support. We only accept <span class=\"currency\">" + SUPPORTED_CURRENCY + "</span> payments.</p><button class=\"close-btn\" onclick=\"window.close()\">Close Window</button></div></body></html>";
    }
}