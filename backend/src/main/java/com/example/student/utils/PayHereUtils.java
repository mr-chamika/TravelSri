package com.example.student.utils;

import org.apache.commons.codec.digest.DigestUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.text.DecimalFormat;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Component
public class PayHereUtils {

    @Value("${payhere.merchant.id:1228827}")
    private String merchantId;

    @Value("${payhere.merchant.secret:MTU3NDMzMTc4ODM0NDU0MDA4MjAyMDgzNTk2MjA4Mjg4MzM4ODk0Mg==}")
    private String merchantSecretEncoded;

    @Value("${payhere.sandbox:true}")
    private boolean sandboxMode;

    private String getMerchantSecret() {
        try {
            // If the secret is Base64 encoded, decode it first
            if (merchantSecretEncoded.matches("^[A-Za-z0-9+/]*={0,2}$") && merchantSecretEncoded.length() > 20) {
                return new String(Base64.getDecoder().decode(merchantSecretEncoded));
            }
            // Otherwise use as is
            return merchantSecretEncoded;
        } catch (Exception e) {
            System.err.println("Error decoding merchant secret, using as raw string: " + e.getMessage());
            return merchantSecretEncoded;
        }
    }

    /**
     * Generate PayHere payment hash following the exact PayHere guidelines
     * Hash format: MD5(merchant_id + order_id + formatted_amount + currency + MD5(merchant_secret))
     * Both MD5 operations should return UPPERCASE results
     */
    public String generateHash(String orderId, BigDecimal amount, String currency) {
        return generateHash(merchantId, orderId, amount, currency);
    }

    /**
     * Generate PayHere payment hash with custom merchant ID
     * Hash format: MD5(merchant_id + order_id + formatted_amount + currency + MD5(merchant_secret))
     */
    public String generateHash(String merchantId, String orderId, BigDecimal amount, String currency) {
        try {
            String merchantSecret = getMerchantSecret();

            System.out.println("=== PayHere Hash Generation ===");
            System.out.println("Merchant ID: " + merchantId);
            System.out.println("Order ID: " + orderId);
            System.out.println("Amount: " + amount);
            System.out.println("Currency: " + currency);
            System.out.println("Merchant Secret (first 10 chars): " + merchantSecret.substring(0, Math.min(10, merchantSecret.length())) + "...");

            // Step 1: Hash the merchant secret and convert to UPPERCASE
            String secretHash = DigestUtils.md5Hex(merchantSecret).toUpperCase();
            System.out.println("Secret Hash: " + secretHash);

            // Step 2: Format amount exactly as PayHere expects (using number_format equivalent)
            String formattedAmount = formatAmountForHash(amount);
            System.out.println("Formatted Amount: " + formattedAmount);

            // Step 3: Create the concatenated string (NO SPACES, NO DELIMITERS)
            String hashString = merchantId + orderId + formattedAmount + currency + secretHash;
            System.out.println("Hash String: " + hashString);
            System.out.println("Hash String Length: " + hashString.length());

            // Step 4: Generate final hash and convert to UPPERCASE
            String finalHash = DigestUtils.md5Hex(hashString).toUpperCase();
            System.out.println("Final Hash: " + finalHash);
            System.out.println("===============================");

            return finalHash;
        } catch (Exception e) {
            System.err.println("Error generating PayHere hash: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Error generating PayHere hash", e);
        }
    }

    /**
     * Verify PayHere notification hash following PayHere guidelines
     * Hash format for notifications: MD5(merchant_id + order_id + payhere_amount + payhere_currency + status_code + MD5(merchant_secret))
     */
    public boolean verifyNotificationHash(String merchantId, String orderId, String payhereAmount,
                                          String payhereCurrency, String statusCode, String receivedHash) {
        try {
            String merchantSecret = getMerchantSecret();

            System.out.println("=== PayHere Hash Verification ===");
            System.out.println("Merchant ID: " + merchantId);
            System.out.println("Order ID: " + orderId);
            System.out.println("PayHere Amount: " + payhereAmount);
            System.out.println("PayHere Currency: " + payhereCurrency);
            System.out.println("Status Code: " + statusCode);
            System.out.println("Received Hash: " + receivedHash);

            // Step 1: Hash the merchant secret and convert to UPPERCASE
            String secretHash = DigestUtils.md5Hex(merchantSecret).toUpperCase();
            System.out.println("Secret Hash: " + secretHash);

            // Step 2: Use the amount as received from PayHere (already formatted)
            System.out.println("Using PayHere Amount as-is: " + payhereAmount);

            // Step 3: Create the concatenated string for verification
            String hashString = merchantId + orderId + payhereAmount + payhereCurrency + statusCode + secretHash;
            System.out.println("Hash String: " + hashString);

            // Step 4: Generate expected hash and convert to UPPERCASE
            String expectedHash = DigestUtils.md5Hex(hashString).toUpperCase();
            System.out.println("Expected Hash: " + expectedHash);

            // Step 5: Compare hashes (case-insensitive comparison for safety)
            boolean isValid = expectedHash.equalsIgnoreCase(receivedHash);
            System.out.println("Hash Valid: " + isValid);
            System.out.println("===============================");

            return isValid;
        } catch (Exception e) {
            System.err.println("Error verifying PayHere hash: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }

    /**
     * Verify payment notification with BigDecimal amount
     */
    public boolean verifyNotificationHash(String merchantId, String orderId, BigDecimal amount,
                                          String currency, String statusCode, String receivedHash) {
        String formattedAmount = formatAmountForHash(amount);
        return verifyNotificationHash(merchantId, orderId, formattedAmount, currency, statusCode, receivedHash);
    }

    /**
     * Generate PayHere refund hash
     * Hash format for refunds: MD5(merchant_id + order_id + refund_amount + MD5(merchant_secret))
     *
     * @param orderId Original PayHere order ID
     * @param paymentId PayHere payment ID
     * @param refundAmount Amount to refund
     * @return Generated MD5 hash for refund
     */
    public String generateRefundHash(String orderId, String paymentId, BigDecimal refundAmount) {
        return generateRefundHash(merchantId, orderId, paymentId, refundAmount);
    }

    /**
     * Generate PayHere refund hash with custom merchant ID
     * Hash format for refunds: MD5(merchant_id + order_id + refund_amount + MD5(merchant_secret))
     *
     * @param merchantId Merchant ID
     * @param orderId Original PayHere order ID
     * @param paymentId PayHere payment ID
     * @param refundAmount Amount to refund
     * @return Generated MD5 hash for refund
     */
    public String generateRefundHash(String merchantId, String orderId, String paymentId, BigDecimal refundAmount) {
        try {
            String merchantSecret = getMerchantSecret();

            System.out.println("=== PayHere Refund Hash Generation ===");
            System.out.println("Merchant ID: " + merchantId);
            System.out.println("Order ID: " + orderId);
            System.out.println("Payment ID: " + paymentId);
            System.out.println("Refund Amount: " + refundAmount);

            // Step 1: Hash the merchant secret and convert to UPPERCASE
            String secretHash = DigestUtils.md5Hex(merchantSecret).toUpperCase();
            System.out.println("Secret Hash: " + secretHash);

            // Step 2: Format refund amount exactly as PayHere expects
            String formattedAmount = formatAmountForHash(refundAmount);
            System.out.println("Formatted Refund Amount: " + formattedAmount);

            // Step 3: Create the concatenated string for refund hash
            // Note: PayHere refund hash typically uses merchant_id + order_id + amount + secret_hash
            String hashString = merchantId + orderId + formattedAmount + secretHash;
            System.out.println("Refund Hash String: " + hashString);
            System.out.println("Hash String Length: " + hashString.length());

            // Step 4: Generate final hash and convert to UPPERCASE
            String finalHash = DigestUtils.md5Hex(hashString).toUpperCase();
            System.out.println("Final Refund Hash: " + finalHash);
            System.out.println("======================================");

            return finalHash;
        } catch (Exception e) {
            System.err.println("Error generating PayHere refund hash: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Error generating PayHere refund hash", e);
        }
    }

    /**
     * Format amount exactly like PHP's number_format($amount, 2, '.', '')
     * This is critical for hash generation consistency
     */
    public String formatAmountForHash(BigDecimal amount) {
        if (amount == null) {
            return "0.00";
        }

        // Use DecimalFormat to match PHP's number_format behavior exactly
        DecimalFormat df = new DecimalFormat("0.00");
        df.setRoundingMode(RoundingMode.HALF_UP);
        df.setGroupingUsed(false); // No thousands separator

        return df.format(amount);
    }

    /**
     * Format amount for display purposes
     */
    public String formatAmount(BigDecimal amount) {
        return formatAmountForHash(amount);
    }

    /**
     * Create complete payment data for frontend JavaScript integration
     */
    public Map<String, Object> createPaymentData(String orderId, BigDecimal amount, String currency,
                                                 String items, String firstName, String lastName,
                                                 String email, String phone, String address, String city,
                                                 String country, String returnUrl, String cancelUrl,
                                                 String notifyUrl) {

        Map<String, Object> paymentData = new HashMap<>();

        try {
            // Generate unique order ID if not provided
            if (orderId == null || orderId.trim().isEmpty()) {
                orderId = generateOrderId();
            }

            // Validate required parameters
            if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
                throw new IllegalArgumentException("Amount must be greater than 0");
            }

            // Generate payment hash
            String hash = generateHash(orderId, amount, currency);

            // Basic payment information
            paymentData.put("sandbox", sandboxMode);
            paymentData.put("merchant_id", merchantId);
            paymentData.put("return_url", returnUrl);
            paymentData.put("cancel_url", cancelUrl);
            paymentData.put("notify_url", notifyUrl);

            // Order information
            paymentData.put("order_id", orderId);
            paymentData.put("items", items);
            paymentData.put("currency", currency);
            paymentData.put("amount", formatAmountForHash(amount));

            // Customer information
            paymentData.put("first_name", firstName != null ? firstName : "");
            paymentData.put("last_name", lastName != null ? lastName : "");
            paymentData.put("email", email != null ? email : "");
            paymentData.put("phone", phone != null ? phone : "");
            paymentData.put("address", address != null ? address : "");
            paymentData.put("city", city != null ? city : "");
            paymentData.put("country", country != null ? country : "Sri Lanka");

            // Security hash (CRITICAL)
            paymentData.put("hash", hash);

            System.out.println("Payment data created successfully for order: " + orderId);
            System.out.println("Generated hash: " + hash);

        } catch (Exception e) {
            System.err.println("Error creating payment data: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to create payment data", e);
        }

        return paymentData;
    }

    /**
     * Create simplified payment data for guide booking
     */
    public Map<String, Object> createGuideBookingPayment(String orderId, BigDecimal amount,
                                                         String serviceDescription, String customerName,
                                                         String customerEmail, String customerPhone,
                                                         String returnUrl, String cancelUrl, String notifyUrl) {

        // Split customer name into first and last name
        String[] nameParts = customerName != null ? customerName.trim().split("\\s+", 2) : new String[]{"Customer", ""};
        String firstName = nameParts[0];
        String lastName = nameParts.length > 1 ? nameParts[1] : "";

        return createPaymentData(
                orderId,
                amount,
                "LKR", // Default currency for Sri Lanka
                serviceDescription != null ? serviceDescription : "Guide Service Booking",
                firstName,
                lastName,
                customerEmail,
                customerPhone,
                "Colombo", // Default address
                "Colombo", // Default city
                "Sri Lanka", // Default country
                returnUrl,
                cancelUrl,
                notifyUrl
        );
    }

    /**
     * Create refund request data for PayHere
     *
     * @param orderId Original order ID
     * @param paymentId PayHere payment ID
     * @param refundAmount Amount to refund
     * @param reason Refund reason
     * @return Map containing refund request data
     */
    public Map<String, Object> createRefundData(String orderId, String paymentId, BigDecimal refundAmount, String reason) {
        Map<String, Object> refundData = new HashMap<>();

        try {
            // Validate inputs
            if (orderId == null || orderId.trim().isEmpty()) {
                throw new IllegalArgumentException("Order ID is required for refund");
            }
            if (paymentId == null || paymentId.trim().isEmpty()) {
                throw new IllegalArgumentException("Payment ID is required for refund");
            }
            if (refundAmount == null || refundAmount.compareTo(BigDecimal.ZERO) <= 0) {
                throw new IllegalArgumentException("Refund amount must be greater than 0");
            }

            // Generate refund hash
            String hash = generateRefundHash(orderId, paymentId, refundAmount);

            // Create refund data
            refundData.put("merchant_id", merchantId);
            refundData.put("order_id", orderId);
            refundData.put("payment_id", paymentId);
            refundData.put("amount", formatAmountForHash(refundAmount));
            refundData.put("reason", reason != null ? reason : "Customer request");
            refundData.put("hash", hash);

            System.out.println("Refund data created successfully for order: " + orderId);

        } catch (Exception e) {
            System.err.println("Error creating refund data: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to create refund data", e);
        }

        return refundData;
    }

    /**
     * Verify PayHere refund notification hash
     *
     * @param merchantId Merchant ID from notification
     * @param orderId Order ID from notification
     * @param refundId Refund ID from PayHere
     * @param refundAmount Refund amount
     * @param statusCode Refund status code
     * @param receivedHash Hash received from PayHere
     * @return true if verification successful
     */
    public boolean verifyRefundNotificationHash(String merchantId, String orderId, String refundId,
                                                BigDecimal refundAmount, String statusCode, String receivedHash) {
        try {
            String merchantSecret = getMerchantSecret();

            System.out.println("=== PayHere Refund Hash Verification ===");
            System.out.println("Merchant ID: " + merchantId);
            System.out.println("Order ID: " + orderId);
            System.out.println("Refund ID: " + refundId);
            System.out.println("Refund Amount: " + refundAmount);
            System.out.println("Status Code: " + statusCode);
            System.out.println("Received Hash: " + receivedHash);

            // Step 1: Hash the merchant secret and convert to UPPERCASE
            String secretHash = DigestUtils.md5Hex(merchantSecret).toUpperCase();
            System.out.println("Secret Hash: " + secretHash);

            // Step 2: Format amount
            String formattedAmount = formatAmountForHash(refundAmount);
            System.out.println("Formatted Amount: " + formattedAmount);

            // Step 3: Create the concatenated string for verification
            // Adjust this based on PayHere's actual refund notification hash format
            String hashString = merchantId + orderId + formattedAmount + statusCode + secretHash;
            System.out.println("Verification Hash String: " + hashString);

            // Step 4: Generate expected hash and convert to UPPERCASE
            String expectedHash = DigestUtils.md5Hex(hashString).toUpperCase();
            System.out.println("Expected Hash: " + expectedHash);

            // Step 5: Compare hashes (case-insensitive comparison for safety)
            boolean isValid = expectedHash.equalsIgnoreCase(receivedHash);
            System.out.println("Refund Hash Valid: " + isValid);
            System.out.println("========================================");

            return isValid;
        } catch (Exception e) {
            System.err.println("Error verifying PayHere refund hash: " + e.getMessage());
            e.printStackTrace();
            return false;
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
     * Validate order ID format
     */
    public boolean isValidOrderId(String orderId) {
        return orderId != null &&
                orderId.trim().length() >= 3 &&
                orderId.trim().length() <= 50 &&
                orderId.matches("^[a-zA-Z0-9_-]+$");
    }

    /**
     * Get payment status description based on PayHere status codes
     */
    public String getPaymentStatusDescription(int statusCode) {
        switch (statusCode) {
            case 2:
                return "Success";
            case 0:
                return "Pending";
            case -1:
                return "Canceled";
            case -2:
                return "Failed";
            case -3:
                return "Chargedback";
            default:
                return "Unknown";
        }
    }

    /**
     * Check if payment was successful
     */
    public boolean isPaymentSuccessful(int statusCode) {
        return statusCode == 2;
    }

    /**
     * Check if payment was successful (string version)
     */
    public boolean isPaymentSuccessful(String statusCode) {
        try {
            return isPaymentSuccessful(Integer.parseInt(statusCode));
        } catch (NumberFormatException e) {
            return false;
        }
    }

    /**
     * Get refund status description
     *
     * @param statusCode PayHere refund status code
     * @return Status description
     */
    public String getRefundStatusDescription(int statusCode) {
        switch (statusCode) {
            case 1:
                return "Refund Success";
            case 0:
                return "Refund Pending";
            case -1:
                return "Refund Failed";
            case -2:
                return "Refund Rejected";
            default:
                return "Unknown Refund Status";
        }
    }

    /**
     * Check if refund was successful
     *
     * @param statusCode PayHere refund status code
     * @return true if refund was successful
     */
    public boolean isRefundSuccessful(int statusCode) {
        return statusCode == 1;
    }

    /**
     * Check if refund was successful (string version)
     *
     * @param statusCode PayHere refund status code as string
     * @return true if refund was successful
     */
    public boolean isRefundSuccessful(String statusCode) {
        try {
            return isRefundSuccessful(Integer.parseInt(statusCode));
        } catch (NumberFormatException e) {
            return false;
        }
    }

    /**
     * Process PayHere payment notification data
     */
    public PaymentNotificationResult processNotification(Map<String, String> notificationData) {
        try {
            String merchantId = notificationData.get("merchant_id");
            String orderId = notificationData.get("order_id");
            String paymentId = notificationData.get("payment_id");
            String payhereAmount = notificationData.get("payhere_amount");
            String payhereCurrency = notificationData.get("payhere_currency");
            String statusCode = notificationData.get("status_code");
            String md5sig = notificationData.get("md5sig");
            String statusMessage = notificationData.get("status_message");
            String method = notificationData.get("method");

            // Verify the hash
            boolean isValidHash = verifyNotificationHash(merchantId, orderId, payhereAmount,
                    payhereCurrency, statusCode, md5sig);

            // Check if payment is successful
            boolean isSuccessful = isValidHash && isPaymentSuccessful(statusCode);

            return new PaymentNotificationResult(
                    isValidHash,
                    isSuccessful,
                    orderId,
                    paymentId,
                    payhereAmount,
                    payhereCurrency,
                    statusCode,
                    statusMessage,
                    method
            );

        } catch (Exception e) {
            System.err.println("Error processing payment notification: " + e.getMessage());
            e.printStackTrace();
            return new PaymentNotificationResult(false, false, null, null, null, null, null, null, null);
        }
    }

    /**
     * Process PayHere refund notification data
     *
     * @param notificationData Refund notification data from PayHere
     * @return RefundNotificationResult object
     */
    public RefundNotificationResult processRefundNotification(Map<String, String> notificationData) {
        try {
            String merchantId = notificationData.get("merchant_id");
            String orderId = notificationData.get("order_id");
            String refundId = notificationData.get("refund_id");
            String refundAmount = notificationData.get("refund_amount");
            String statusCode = notificationData.get("status_code");
            String md5sig = notificationData.get("md5sig");
            String statusMessage = notificationData.get("status_message");

            // Convert amount to BigDecimal
            BigDecimal amount = new BigDecimal(refundAmount);

            // Verify the hash
            boolean isValidHash = verifyRefundNotificationHash(merchantId, orderId, refundId,
                    amount, statusCode, md5sig);

            // Check if refund is successful
            boolean isSuccessful = isValidHash && isRefundSuccessful(statusCode);

            return new RefundNotificationResult(
                    isValidHash,
                    isSuccessful,
                    orderId,
                    refundId,
                    refundAmount,
                    statusCode,
                    statusMessage
            );

        } catch (Exception e) {
            System.err.println("Error processing refund notification: " + e.getMessage());
            e.printStackTrace();
            return new RefundNotificationResult(false, false, null, null, null, null, null);
        }
    }

    /**
     * Format amount for display
     *
     * @param amount Amount to format
     * @param currency Currency code
     * @return Formatted amount string
     */
    public String formatAmount(BigDecimal amount, String currency) {
        DecimalFormat df = new DecimalFormat("#,##0.00");
        return currency + " " + df.format(amount);
    }

    /**
     * Format amount for display with default currency
     *
     * @param amount Amount to format
     * @return Formatted amount string
     */
//    public String formatAmount(BigDecimal amount) {
//        return formatAmount(amount, "LKR");
//    }

    /**
     * Log payment attempt for debugging
     */
    public void logPaymentAttempt(String orderId, BigDecimal amount, String customerEmail) {
        System.out.println(String.format("Payment attempt - Order: %s, Amount: %s LKR, Customer: %s",
                orderId, formatAmountForHash(amount), customerEmail));
    }

    /**
     * Log payment result for debugging
     */
    public void logPaymentResult(String orderId, String statusCode, String paymentId) {
        System.out.println(String.format("Payment result - Order: %s, Status: %s (%s), PaymentID: %s",
                orderId, statusCode, getPaymentStatusDescription(Integer.parseInt(statusCode)), paymentId));
    }

    /**
     * Get configuration info for debugging
     */
    public Map<String, Object> getConfigInfo() {
        Map<String, Object> config = new HashMap<>();
        config.put("merchant_id", merchantId);
        config.put("sandbox_mode", sandboxMode);
        config.put("currency", "LKR");
        return config;
    }

    /**
     * Inner class to hold payment notification results
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
    }

    /**
     * Inner class to hold refund notification results
     */
    public static class RefundNotificationResult {
        private final boolean hashValid;
        private final boolean refundSuccessful;
        private final String orderId;
        private final String refundId;
        private final String refundAmount;
        private final String statusCode;
        private final String statusMessage;

        public RefundNotificationResult(boolean hashValid, boolean refundSuccessful,
                                        String orderId, String refundId, String refundAmount,
                                        String statusCode, String statusMessage) {
            this.hashValid = hashValid;
            this.refundSuccessful = refundSuccessful;
            this.orderId = orderId;
            this.refundId = refundId;
            this.refundAmount = refundAmount;
            this.statusCode = statusCode;
            this.statusMessage = statusMessage;
        }

        // Getters
        public boolean isHashValid() { return hashValid; }
        public boolean isRefundSuccessful() { return refundSuccessful; }
        public String getOrderId() { return orderId; }
        public String getRefundId() { return refundId; }
        public String getRefundAmount() { return refundAmount; }
        public String getStatusCode() { return statusCode; }
        public String getStatusMessage() { return statusMessage; }
    }
}