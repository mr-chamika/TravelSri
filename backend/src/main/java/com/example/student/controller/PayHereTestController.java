package com.example.student.controller;

import com.example.student.services.IPaymentService;
import com.example.student.utils.PayHereUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/payhere/test")
@CrossOrigin
public class PayHereTestController {

    @Autowired
    private PayHereUtils payHereUtils;

    @Value("${payhere.merchant.id}")
    private String merchantId;

    @PostMapping("/generate-hash")
    public ResponseEntity<?> generateTestHash(@RequestBody Map<String, Object> request) {
        try {
            String orderId = (String) request.get("orderId");
            BigDecimal amount = new BigDecimal(request.get("amount").toString());
            String currency = (String) request.get("currency");

            String hash = payHereUtils.generateHash(merchantId, orderId, amount, currency);

            Map<String, String> response = new HashMap<>();
            response.put("hash", hash);
            response.put("merchantId", merchantId);
            response.put("orderId", orderId);
            response.put("amount", amount.toString());
            response.put("currency", currency);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error generating hash: " + e.getMessage());
        }
    }

    @PostMapping("/verify-hash")
    public ResponseEntity<?> verifyTestHash(@RequestBody Map<String, Object> request) {
        try {
            String orderId = (String) request.get("orderId");
            BigDecimal amount = new BigDecimal(request.get("amount").toString());
            String currency = (String) request.get("currency");
            String statusCode = (String) request.get("statusCode");
            String receivedHash = (String) request.get("hash");

            boolean isValid = payHereUtils.verifyNotificationHash(merchantId, orderId, amount, currency, statusCode, receivedHash);

            Map<String, Object> response = new HashMap<>();
            response.put("isValid", isValid);
            response.put("merchantId", merchantId);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error verifying hash: " + e.getMessage());
        }
    }
}
