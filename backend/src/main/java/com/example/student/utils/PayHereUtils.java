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
}