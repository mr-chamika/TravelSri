package com.example.student.utils;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.text.DecimalFormat;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.Base64;

@Component
public class PayHereUtils {

    @Value("${payhere.merchant.id}")
    private String merchantId;

    @Value("${payhere.merchant.secret}")
    private String merchantSecret;

    @Value("${payhere.sandbox:true}")
    private boolean sandboxMode;

    /**
     * Get merchant secret exactly as configured - NO MODIFICATIONS
     * Uses the exact secret key from properties without any encoding/decoding
     */
    private String getActualMerchantSecret() {
        if (merchantSecret == null || merchantSecret.trim().isEmpty()) {
            throw new IllegalArgumentException("Merchant secret is null or empty");
        }
        System.out.println("✅ Using EXACT merchant secret from properties (length: " + merchantSecret.length() + ")");
        return merchantSecret;
    }

    /**
     * Generate MD5 hash exactly like PayHere documentation
     * This matches the Java code sample from PayHere docs exactly
     */
    public static String getMd5(String input) {
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
            throw new RuntimeException("MD5 algorithm not found", e);
        }
    }

    /**
     * Format amount exactly like PayHere sample code
     * Uses DecimalFormat("0.00") - exactly like the sample
     */
    public String formatAmountForHash(BigDecimal amount) {
        if (amount == null) {
            return "0.00";
        }
        DecimalFormat df = new DecimalFormat("0.00");
        return df.format(amount);
    }

    /**
     * Format amount for double values (for testing compatibility)
     */
    public String formatAmountForHash(double amount) {
        DecimalFormat df = new DecimalFormat("0.00");
        return df.format(amount);
    }

    /**
     * Generate PayHere payment hash - EXACT COMPLIANCE with PayHere sample
     * Hash format: MD5(merchant_id + order_id + formatted_amount + currency + MD5(merchant_secret))
     */
    public String generateHash(String orderId, BigDecimal amount, String currency) {
        return generateHash(merchantId, orderId, amount, "LKR");
    }

    /**
     * Generate PayHere payment hash with custom merchant ID
     * CRITICAL: This follows the exact PayHere sample code pattern
     */
    public String generateHash(String customMerchantId, String orderId, BigDecimal amount, String currency) {
        try {
            String actualMerchantId = this.merchantId;
            String actualMerchantSecret = this.merchantSecret;

            System.out.println("=== PayHere Hash Generation (EXACT SAMPLE COMPLIANCE) ===");
            System.out.println("Merchant ID: [" + actualMerchantId + "]");
            System.out.println("Order ID: [" + orderId + "]");
            System.out.println("Amount: [" + amount + "]");
            System.out.println("Currency: [" + currency + "]");
            System.out.println("Merchant Secret Length: " + (actualMerchantSecret != null ? actualMerchantSecret.length() : 0));
            System.out.println("Merchant Secret First 10 chars: [" +
                    (actualMerchantSecret != null && actualMerchantSecret.length() > 10 ?
                            actualMerchantSecret.substring(0, 10) + "..." : "TOO_SHORT"));

            // Strict validation
            if (actualMerchantId == null || actualMerchantId.trim().isEmpty()) {
                throw new IllegalArgumentException("Merchant ID cannot be null or empty");
            }
            if (orderId == null || orderId.trim().isEmpty()) {
                throw new IllegalArgumentException("Order ID cannot be null or empty");
            }
            if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
                throw new IllegalArgumentException("Amount must be greater than zero");
            }
            if (currency == null || currency.trim().isEmpty()) {
                throw new IllegalArgumentException("Currency cannot be null or empty");
            }
            if (actualMerchantSecret == null || actualMerchantSecret.trim().isEmpty()) {
                throw new IllegalArgumentException("Merchant Secret cannot be null or empty");
            }

            // Step 1: Format amount exactly like PayHere sample (DecimalFormat "0.00")
            String formattedAmount = formatAmountForHash(amount);
            System.out.println("Formatted Amount: [" + formattedAmount + "]");

            // Step 2: Hash merchant secret exactly like sample (getMd5(merchantSecret))
            String secretHash = getMd5(actualMerchantSecret);
            System.out.println("Secret Hash: [" + secretHash + "]");

            // Step 3: Create concatenated string exactly like PayHere sample
            // CRITICAL ORDER: merchant_id + order_id + amount + currency + secret_hash
            String hashString = actualMerchantId + orderId + formattedAmount + "LKR" + secretHash;
            System.out.println("Hash String: [" + hashString + "]");
            System.out.println("Hash String Length: " + hashString.length());

            // Step 4: Generate final hash exactly like sample (getMd5(hashString))
            String finalHash = getMd5(hashString);
            System.out.println("Final Hash: [" + finalHash + "]");

            // Validation
            if (finalHash.length() != 32) {
                System.err.println("⚠️ WARNING: Hash length is not 32 characters: " + finalHash.length());
            }
            if (!finalHash.matches("[A-F0-9]{32}")) {
                System.err.println("⚠️ WARNING: Hash contains invalid characters or is not uppercase");
            }

            System.out.println("✅ Hash generated successfully");
            System.out.println("=========================================================");

            return finalHash;

        } catch (Exception e) {
            System.err.println("❌ Error generating PayHere hash: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Error generating PayHere hash", e);
        }
    }

    /**
     * Alternative method using double (for testing compatibility with sample)
     */
    public String generateHashWithDouble(String orderId, double amount, String currency) {
        try {
            String actualMerchantSecret = getActualMerchantSecret();

            System.out.println("=== Hash Generation (Double Method - Sample Compatible) ===");
            System.out.println("Merchant ID: [" + merchantId + "]");
            System.out.println("Order ID: [" + orderId + "]");
            System.out.println("Amount: [" + amount + "]");
            System.out.println("Currency: [" + currency + "]");

            // Format amount exactly like PayHere sample
            DecimalFormat df = new DecimalFormat("0.00");
            String amountFormatted = df.format(amount);
            System.out.println("Formatted Amount: [" + amountFormatted + "]");

            // Generate hash exactly like PayHere sample
            String hash = getMd5(merchantId + orderId + amountFormatted + currency + getMd5(actualMerchantSecret));

            System.out.println("Generated Hash: [" + hash + "]");
            System.out.println("========================================================");

            return hash;
        } catch (Exception e) {
            System.err.println("❌ Error generating hash with double: " + e.getMessage());
            throw new RuntimeException("Error generating hash", e);
        }
    }

    /**
     * Verify PayHere notification hash
     * Hash format: MD5(merchant_id + order_id + payhere_amount + payhere_currency + status_code + MD5(merchant_secret))
     */
    public boolean verifyNotificationHash(String merchantId, String orderId, String payhereAmount,
                                          String payhereCurrency, String statusCode, String receivedHash) {
        try {
            System.out.println("=== PayHere Hash Verification ===");
            System.out.println("Merchant ID: [" + merchantId + "]");
            System.out.println("Order ID: [" + orderId + "]");
            System.out.println("PayHere Amount: [" + payhereAmount + "]");
            System.out.println("PayHere Currency: [" + payhereCurrency + "]");
            System.out.println("Status Code: [" + statusCode + "]");
            System.out.println("Received Hash: [" + receivedHash + "]");

            String actualMerchantSecret = getActualMerchantSecret();

            // Step 1: Hash merchant secret and convert to UPPERCASE
            String secretHash = getMd5(actualMerchantSecret);
            System.out.println("Secret Hash: [" + secretHash + "]");

            // Step 2: Create concatenated string for verification
            String hashString = merchantId + orderId + payhereAmount + payhereCurrency + statusCode + secretHash;
            System.out.println("Hash String: [" + hashString + "]");

            // Step 3: Generate expected hash
            String expectedHash = getMd5(hashString);
            System.out.println("Expected Hash: [" + expectedHash + "]");

            // Step 4: Compare hashes (case insensitive)
            boolean isValid = expectedHash.equalsIgnoreCase(receivedHash);
            System.out.println("Hash Valid: " + isValid);

            if (!isValid) {
                System.err.println("❌ HASH MISMATCH!");
                System.err.println("Expected: " + expectedHash);
                System.err.println("Received: " + receivedHash);
            } else {
                System.out.println("✅ Hash verification successful");
            }

            System.out.println("=====================================");
            return isValid;

        } catch (Exception e) {
            System.err.println("❌ Error verifying PayHere hash: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }

    /**
     * Create complete payment data for PayHere checkout - EXACT API COMPLIANCE
     */
    public Map<String, Object> createPaymentData(String orderId, BigDecimal amount, String currency,
                                                 String items, String firstName, String lastName,
                                                 String email, String phone, String address, String city,
                                                 String country, String returnUrl, String cancelUrl,
                                                 String notifyUrl) {

        Map<String, Object> paymentData = new HashMap<>();

        try {
            System.out.println("=== PayHere Payment Data Creation (API COMPLIANT) ===");

            // Generate order ID if not provided
            if (orderId == null || orderId.trim().isEmpty()) {
                orderId = generateOrderId();
            }
            System.out.println("Order ID: [" + orderId + "]");

            // Validate amount
            if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
                throw new IllegalArgumentException("Amount must be greater than 0");
            }
            System.out.println("Amount: [" + amount + "]");
            System.out.println("Currency: [" + currency + "]");

            // Generate hash using exact PayHere specification
            String hash = generateHash(orderId, amount, currency);
            System.out.println("Generated Hash: [" + hash.substring(0, 8) + "...]");

            // Required POST Parameters - EXACT field names from PayHere docs
            paymentData.put("merchant_id", merchantId);
            paymentData.put("return_url", returnUrl);
            paymentData.put("cancel_url", cancelUrl);
            paymentData.put("notify_url", notifyUrl);
            paymentData.put("first_name", firstName != null ? firstName : "Customer");
            paymentData.put("last_name", lastName != null ? lastName : "");
            paymentData.put("email", email != null ? email : "customer@example.com");
            paymentData.put("phone", phone != null ? phone : "+94771234567");
            paymentData.put("address", address != null ? address : "Colombo");
            paymentData.put("city", city != null ? city : "Colombo");
            paymentData.put("country", country != null ? country : "Sri Lanka");
            paymentData.put("order_id", orderId);
            paymentData.put("items", items != null ? items : "Guide Service");
            paymentData.put("currency", currency != null ? currency : "LKR");
            paymentData.put("amount", formatAmountForHash(amount)); // CRITICAL: Exact formatting
            paymentData.put("hash", hash); // CRITICAL: Generated hash

            // Optional POST Parameters (from PayHere docs)
            paymentData.put("delivery_address", address != null ? address : "Colombo");
            paymentData.put("delivery_city", city != null ? city : "Colombo");
            paymentData.put("delivery_country", country != null ? country : "Sri Lanka");

            System.out.println("=== Payment Data Field Validation ===");
            System.out.println("Total fields: " + paymentData.size());

            // Validate ALL required fields according to PayHere documentation
            String[] requiredFields = {
                    "merchant_id", "return_url", "cancel_url", "notify_url",
                    "first_name", "last_name", "email", "phone", "address", "city", "country",
                    "order_id", "items", "currency", "amount", "hash"
            };

            boolean allValid = true;
            for (String field : requiredFields) {
                Object value = paymentData.get(field);
                boolean isValid = value != null && !value.toString().trim().isEmpty();

                if (isValid) {
                    System.out.println("✅ " + field + ": [" +
                            ("hash".equals(field) ? value.toString().substring(0, 8) + "..." : value) + "]");
                } else {
                    System.err.println("❌ MISSING/EMPTY FIELD: " + field);
                    allValid = false;
                }
            }

            if (!allValid) {
                throw new IllegalArgumentException("Missing required fields for PayHere payment");
            }

            System.out.println("✅ All required fields validated successfully");
            System.out.println("=== Payment Data Created Successfully ===");

        } catch (Exception e) {
            System.err.println("❌ Error creating payment data: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to create payment data", e);
        }

        return paymentData;
    }

    /**
     * Test method to compare hash generation methods
     */
    public void testHashGeneration() {
        try {
            System.out.println("=== Testing Hash Generation Compatibility ===");

            // Test parameters
            String testOrderId = "TEST12345";
            BigDecimal testAmountBD = new BigDecimal("1000.00");
            double testAmountDouble = 1000.0;
            String testCurrency = "LKR";

            System.out.println("Test Parameters:");
            System.out.println("Order ID: " + testOrderId);
            System.out.println("Amount (BigDecimal): " + testAmountBD);
            System.out.println("Amount (double): " + testAmountDouble);
            System.out.println("Currency: " + testCurrency);
            System.out.println();

            // Method 1: BigDecimal
            String hash1 = generateHash(testOrderId, testAmountBD, testCurrency);

            // Method 2: Double (like PayHere sample)
            String hash2 = generateHashWithDouble(testOrderId, testAmountDouble, testCurrency);

            System.out.println("=== Hash Comparison ===");
            System.out.println("BigDecimal method: " + hash1);
            System.out.println("Double method:     " + hash2);
            System.out.println("Hashes match: " + (hash1.equals(hash2) ? "✅ YES" : "❌ NO"));

            if (!hash1.equals(hash2)) {
                System.err.println("⚠️ WARNING: Hash methods produce different results!");
                System.err.println("This indicates a formatting or calculation difference.");
            } else {
                System.out.println("✅ Hash generation is consistent across methods");
            }

            System.out.println("===============================================");

        } catch (Exception e) {
            System.err.println("❌ Error testing hash generation: " + e.getMessage());
            e.printStackTrace();
        }
    }

    /**
     * Generate unique order ID
     */
    public String generateOrderId() {
        return "ORD_" + System.currentTimeMillis() + "_" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

    /**
     * Validate payment amount
     */
    public boolean isValidAmount(BigDecimal amount) {
        return amount != null && amount.compareTo(BigDecimal.ZERO) > 0 && amount.compareTo(new BigDecimal("1000000")) <= 0;
    }

    /**
     * Get payment status description
     */
    public String getPaymentStatusDescription(int statusCode) {
        switch (statusCode) {
            case 2: return "Success";
            case 0: return "Pending";
            case -1: return "Canceled";
            case -2: return "Failed";
            case -3: return "Chargedback";
            default: return "Unknown";
        }
    }

    /**
     * Check if payment was successful
     */
    public boolean isPaymentSuccessful(int statusCode) {
        return statusCode == 2;
    }

    public boolean isPaymentSuccessful(String statusCode) {
        try {
            return isPaymentSuccessful(Integer.parseInt(statusCode));
        } catch (NumberFormatException e) {
            return false;
        }
    }

    /**
     * Format amount for display
     */
    public String formatAmount(BigDecimal amount) {
        return formatAmountForHash(amount);
    }

    /**
     * Log payment attempt
     */
    public void logPaymentAttempt(String orderId, BigDecimal amount, String customerEmail) {
        System.out.println(String.format("Payment attempt - Order: %s, Amount: %s LKR, Customer: %s",
                orderId, formatAmountForHash(amount), customerEmail));
    }

    /**
     * Log payment result
     */
    public void logPaymentResult(String orderId, String statusCode, String paymentId) {
        try {
            int code = Integer.parseInt(statusCode);
            System.out.println(String.format("Payment result - Order: %s, Status: %s (%s), PaymentID: %s",
                    orderId, statusCode, getPaymentStatusDescription(code), paymentId));
        } catch (NumberFormatException e) {
            System.out.println(String.format("Payment result - Order: %s, Status: %s (Unknown), PaymentID: %s",
                    orderId, statusCode, paymentId));
        }
    }

    /**
     * Get configuration info
     */
    public Map<String, Object> getConfigInfo() {
        Map<String, Object> config = new HashMap<>();
        config.put("merchant_id", merchantId);
        config.put("merchant_id_length", merchantId != null ? merchantId.length() : 0);
        config.put("sandbox_mode", sandboxMode);
        config.put("currency", "LKR");
        config.put("merchant_secret_length", merchantSecret != null ? merchantSecret.length() : 0);
        config.put("merchant_secret_first_10", merchantSecret != null && merchantSecret.length() > 10 ?
                merchantSecret.substring(0, 10) + "..." : "TOO_SHORT");
        return config;
    }

    /**
     * Process PayHere notification data
     */
    public PaymentNotificationResult processNotification(Map<String, String> notificationData) {
        try {
            System.out.println("=== Processing PayHere Notification ===");

            String merchantId = notificationData.get("merchant_id");
            String orderId = notificationData.get("order_id");
            String paymentId = notificationData.get("payment_id");
            String payhereAmount = notificationData.get("payhere_amount");
            String payhereCurrency = notificationData.get("payhere_currency");
            String statusCode = notificationData.get("status_code");
            String md5sig = notificationData.get("md5sig");
            String statusMessage = notificationData.get("status_message");
            String method = notificationData.get("method");

            System.out.println("Notification Data:");
            notificationData.forEach((key, value) ->
                    System.out.println("  " + key + ": [" + value + "]"));

            // Verify hash
            boolean isValidHash = verifyNotificationHash(merchantId, orderId, payhereAmount,
                    payhereCurrency, statusCode, md5sig);

            // Check if successful
            boolean isSuccessful = isValidHash && isPaymentSuccessful(statusCode);

            PaymentNotificationResult result = new PaymentNotificationResult(
                    isValidHash, isSuccessful, orderId, paymentId, payhereAmount,
                    payhereCurrency, statusCode, statusMessage, method
            );

            System.out.println("=== Notification Processing Result ===");
            System.out.println("Hash Valid: " + isValidHash);
            System.out.println("Payment Successful: " + isSuccessful);
            System.out.println("=====================================");

            return result;

        } catch (Exception e) {
            System.err.println("❌ Error processing payment notification: " + e.getMessage());
            e.printStackTrace();
            return new PaymentNotificationResult(false, false, null, null, null, null, null, null, null);
        }
    }

    /**
     * Payment notification result holder
     */
    public static class PaymentNotificationResult {
        private final boolean hashValid;
        private final boolean paymentSuccessful;
        private final String orderId;
        private final String paymentId;
        private final String amount;
        private final String currency;
        private final String statusCode;
        private final String statusMessage;
        private final String paymentMethod;

        public PaymentNotificationResult(boolean hashValid, boolean paymentSuccessful,
                                         String orderId, String paymentId, String amount,
                                         String currency, String statusCode, String statusMessage,
                                         String paymentMethod) {
            this.hashValid = hashValid;
            this.paymentSuccessful = paymentSuccessful;
            this.orderId = orderId;
            this.paymentId = paymentId;
            this.amount = amount;
            this.currency = currency;
            this.statusCode = statusCode;
            this.statusMessage = statusMessage;
            this.paymentMethod = paymentMethod;
        }

        // Getters
        public boolean isHashValid() { return hashValid; }
        public boolean isPaymentSuccessful() { return paymentSuccessful; }
        public String getOrderId() { return orderId; }
        public String getPaymentId() { return paymentId; }
        public String getAmount() { return amount; }
        public String getCurrency() { return currency; }
        public String getStatusCode() { return statusCode; }
        public String getStatusMessage() { return statusMessage; }
        public String getPaymentMethod() { return paymentMethod; }

        @Override
        public String toString() {
            return String.format("PaymentNotificationResult{hashValid=%s, paymentSuccessful=%s, orderId='%s', paymentId='%s', statusCode='%s'}",
                    hashValid, paymentSuccessful, orderId, paymentId, statusCode);
        }
    }
}