package com.example.student.utils;

import org.apache.commons.codec.digest.DigestUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Map;

@Component
public class PayHereUtils {

    @Value("${payhere.merchant.secret}")
    private String merchantSecret;

    public String generateHash(String merchantId, String orderId, BigDecimal amount, String currency) {
        String amountFormatted = String.format("%.2f", amount);
        String hashString = merchantId + orderId + amountFormatted + currency +
                DigestUtils.md5Hex(merchantSecret).toUpperCase();
        return DigestUtils.md5Hex(hashString).toUpperCase();
    }

    public String generateNotificationHash(String merchantId, String orderId, BigDecimal amount,
                                           String currency, String statusCode) {
        String amountFormatted = String.format("%.2f", amount);
        String hashString = merchantId + orderId + amountFormatted + currency + statusCode +
                DigestUtils.md5Hex(merchantSecret).toUpperCase();
        return DigestUtils.md5Hex(hashString).toUpperCase();
    }

    public boolean verifyNotificationHash(String merchantId, String orderId, BigDecimal amount,
                                          String currency, String statusCode, String receivedHash) {
        String generatedHash = generateNotificationHash(merchantId, orderId, amount, currency, statusCode);
        return generatedHash.equals(receivedHash);
    }

    // ===== NEW: MISSING REFUND HASH METHOD =====
    public String generateRefundHash(String merchantId, String paymentId, BigDecimal amount) {
        try {
            String amountFormatted = String.format("%.2f", amount);
            String merchantSecretHash = DigestUtils.md5Hex(merchantSecret).toUpperCase();
            String hashString = merchantId + paymentId + amountFormatted + merchantSecretHash;

            String refundHash = DigestUtils.md5Hex(hashString).toUpperCase();

            System.out.println("🔐 Refund Hash Generated:");
            System.out.println("   Merchant ID: " + merchantId);
            System.out.println("   Payment ID: " + paymentId);
            System.out.println("   Amount: $" + amountFormatted);
            System.out.println("   Hash: " + refundHash);

            return refundHash;
        } catch (Exception e) {
            System.err.println("❌ Error generating refund hash: " + e.getMessage());
            return "HASH_GENERATION_FAILED";
        }
    }

    // ===== ADDITIONAL UTILITY METHODS =====

    public String generateOrderHash(String merchantId, String orderId, BigDecimal amount, String currency, String itemName) {
        try {
            String amountFormatted = String.format("%.2f", amount);
            String merchantSecretHash = DigestUtils.md5Hex(merchantSecret).toUpperCase();
            String hashString = merchantId + orderId + amountFormatted + currency + itemName + merchantSecretHash;

            return DigestUtils.md5Hex(hashString).toUpperCase();
        } catch (Exception e) {
            System.err.println("❌ Error generating order hash: " + e.getMessage());
            return "HASH_GENERATION_FAILED";
        }
    }

    public boolean verifyRefundHash(String merchantId, String paymentId, BigDecimal amount, String receivedHash) {
        String generatedHash = generateRefundHash(merchantId, paymentId, amount);
        boolean isValid = generatedHash.equals(receivedHash);

        System.out.println("🔍 Refund Hash Verification:");
        System.out.println("   Generated: " + generatedHash);
        System.out.println("   Received: " + receivedHash);
        System.out.println("   Valid: " + isValid);

        return isValid;
    }

    public String formatAmount(BigDecimal amount) {
        return String.format("%.2f", amount);
    }

    public String maskAccountNumber(String accountNumber) {
        if (accountNumber == null || accountNumber.length() < 4) {
            return accountNumber;
        }
        return "****" + accountNumber.substring(accountNumber.length() - 4);
    }
}