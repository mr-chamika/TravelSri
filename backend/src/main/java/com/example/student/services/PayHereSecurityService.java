package com.example.student.services;

import com.example.student.utils.PayHereUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

@Service
public class PayHereSecurityService {

    @Autowired
    private PayHereUtils payHereUtils;

    public boolean validateNotification(String merchantId, String orderId, String amount,
                                        String currency, String statusCode, String receivedHash) {
        return payHereUtils.verifyNotificationHash(merchantId, orderId, amount, currency, statusCode, receivedHash);
    }

    public boolean isValidOrderId(String orderId) {
        // Validate order ID format
        return orderId != null && orderId.startsWith("TRV-") && orderId.length() > 10;
    }

    public boolean isRecentTransaction(LocalDateTime transactionTime) {
        // Check if transaction is within last 30 minutes
        return transactionTime.isAfter(LocalDateTime.now().minus(30, ChronoUnit.MINUTES));
    }

    public boolean validateAmount(BigDecimal expectedAmount, BigDecimal receivedAmount) {
        // Allow small differences due to currency conversion
        BigDecimal difference = expectedAmount.subtract(receivedAmount).abs();
        BigDecimal tolerance = expectedAmount.multiply(BigDecimal.valueOf(0.01)); // 1% tolerance

        return difference.compareTo(tolerance) <= 0;
    }
}