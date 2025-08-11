package com.example.student.services;

import com.example.student.model.*;
import com.example.student.repo.*;
import com.example.student.utils.PayHereUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;

import java.time.LocalDateTime;
import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@Service
public class PayHereRefundService {

    @Autowired
    private PayHereRefundRepo refundRepo;

    @Autowired
    private TravelerWalletRepo travelerWalletRepo;

    @Autowired
    private MoneyFlowService moneyFlowService;

    @Autowired
    private PayHereUtils payHereUtils;

    @Value("${payhere.merchant.id}")
    private String merchantId;

    @Value("${payhere.merchant.secret}")
    private String merchantSecret;

    @Value("${payhere.api.base-url}")
    private String payHereBaseUrl;

    private final RestTemplate restTemplate = new RestTemplate();

//    public PayHereRefund processRealRefund(Booking booking, BigDecimal refundAmount, String reason) {
//        try {
//            System.out.println("💸 Initiating PayHere Refund:");
//            System.out.println("   Booking ID: " + booking.getId());
//            System.out.println("   Original Payment ID: " + booking.getPayHerePaymentId());
//            System.out.println("   Refund Amount: $" + refundAmount);
//            System.out.println("   Reason: " + reason);
//
//            // 1. Create refund record
//            PayHereRefund refund = new PayHereRefund();
//            refund.setBookingId(booking.getId());
//            refund.setTravelerId(booking.getTravelerId());
//            refund.setOriginalPaymentId(booking.getPayHerePaymentId());
//            refund.setRefundAmount(refundAmount);
//            refund.setRefundReason(reason);
//            refund.setStatus("PENDING");
//            refund.setInitiatedAt(LocalDateTime.now());
//
//            // 2. Call PayHere Refund API (or simulate)
//            String payHereRefundId = callPayHereRefundAPI(booking.getPayHerePaymentId(), refundAmount, reason);
//
//            // 3. Update refund record with PayHere response
//            refund.setPayHereRefundId(payHereRefundId);
//            refund.setStatus("SUCCESS");
//            refund.setCompletedAt(LocalDateTime.now());
//            refund.setPayHereResponse("Refund processed successfully via API");
//
//            // 4. Save refund record
//            PayHereRefund savedRefund = refundRepo.save(refund);
//
//            // 5. Update traveler wallet
//            updateTravelerWalletWithRefund(booking.getTravelerId(), refundAmount, reason, savedRefund.getId(), payHereRefundId);
//
//            System.out.println("✅ PayHere Refund Completed:");
//            System.out.println("   💳 Refund Amount: $" + refundAmount);
//            System.out.println("   🆔 PayHere Refund ID: " + payHereRefundId);
//            System.out.println("   📝 Database Record ID: " + savedRefund.getId());
//            System.out.println("   ⏱️ Processing Time: 3-5 business days");
//
//            return savedRefund;
//
//        } catch (Exception e) {
//            System.err.println("❌ PayHere refund processing failed: " + e.getMessage());
//
//            // Handle failed refund
//            PayHereRefund failedRefund = new PayHereRefund();
//            failedRefund.setBookingId(booking.getId());
//            failedRefund.setTravelerId(booking.getTravelerId());
//            failedRefund.setOriginalPaymentId(booking.getPayHerePaymentId());
//            failedRefund.setRefundAmount(refundAmount);
//            failedRefund.setRefundReason(reason);
//            failedRefund.setStatus("FAILED");
//            failedRefund.setPayHereResponse("Refund failed: " + e.getMessage());
//            failedRefund.setInitiatedAt(LocalDateTime.now());
//            refundRepo.save(failedRefund);
//
//            throw new RuntimeException("PayHere refund failed: " + e.getMessage());
//        }
//    }

//    private String callPayHereRefundAPI(String originalPaymentId, BigDecimal refundAmount, String reason) {
//        try {
//            System.out.println("🔗 Calling PayHere Refund API:");
//            System.out.println("   Payment ID: " + originalPaymentId);
//            System.out.println("   Amount: $" + refundAmount);
//
//            // Check if we have a valid payment ID
//            if (originalPaymentId == null || originalPaymentId.trim().isEmpty() || "null".equals(originalPaymentId)) {
//                System.out.println("⚠️ No valid payment ID found, using simulation");
//                return simulateRefund(originalPaymentId, refundAmount, reason);
//            }
//
//            // Prepare PayHere refund API request
//            Map<String, Object> refundRequest = new HashMap<>();
//            refundRequest.put("merchant_id", merchantId);
//            refundRequest.put("payment_id", originalPaymentId);
//            refundRequest.put("amount", payHereUtils.formatAmount(refundAmount));
//            refundRequest.put("reason", reason);
//            refundRequest.put("notify_url", "https://your-domain.com/api/payments/payhere/refund-notify");
//
//            // Generate refund hash (NOW THIS METHOD EXISTS!)
//            String refundHash = payHereUtils.generateRefundHash(merchantId, originalPaymentId, refundAmount);
//            refundRequest.put("hash", refundHash);
//
//            HttpHeaders headers = new HttpHeaders();
//            headers.setContentType(MediaType.APPLICATION_JSON);
//            headers.set("User-Agent", "TravelBookingApp/1.0");
//
//            HttpEntity<Map<String, Object>> request = new HttpEntity<>(refundRequest, headers);
//
//            // Call PayHere refund API
//            String refundApiUrl = payHereBaseUrl.replace("/pay/checkout", "/api/v1/refund");
//
//            System.out.println("📡 API Call Details:");
//            System.out.println("   URL: " + refundApiUrl);
//            System.out.println("   Merchant ID: " + merchantId);
//            System.out.println("   Hash: " + refundHash);
//
//            try {
//                ResponseEntity<Map> response = restTemplate.postForEntity(refundApiUrl, request, Map.class);
//
//                if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
//                    Map<String, Object> responseBody = response.getBody();
//                    String status = (String) responseBody.get("status");
//
//                    System.out.println("📬 PayHere API Response:");
//                    System.out.println("   Status: " + status);
//                    System.out.println("   Response: " + responseBody);
//
//                    if ("SUCCESS".equalsIgnoreCase(status) || "APPROVED".equalsIgnoreCase(status)) {
//                        String refundId = (String) responseBody.get("refund_id");
//                        if (refundId != null) {
//                            return refundId;
//                        } else {
//                            return "REFUND_" + System.currentTimeMillis();
//                        }
//                    } else {
//                        String message = (String) responseBody.get("message");
//                        throw new RuntimeException("PayHere refund rejected: " + message);
//                    }
//                } else {
//                    throw new RuntimeException("PayHere API error: HTTP " + response.getStatusCode());
//                }
//
//            } catch (Exception apiException) {
//                System.err.println("⚠️ PayHere API call failed: " + apiException.getMessage());
//                System.out.println("🎭 Falling back to simulation");
//                return simulateRefund(originalPaymentId, refundAmount, reason);
//            }
//
//        } catch (Exception e) {
//            System.err.println("❌ Refund API call failed: " + e.getMessage());
//            return simulateRefund(originalPaymentId, refundAmount, reason);
//        }
//    }

    private String simulateRefund(String originalPaymentId, BigDecimal refundAmount, String reason) {
        // Simulate PayHere refund for testing/development
        String simulatedRefundId = "SIM_REFUND_" + System.currentTimeMillis();

        System.out.println("🎭 SIMULATED PayHere Refund:");
        System.out.println("   Original Payment: " + originalPaymentId);
        System.out.println("   Refund Amount: $" + refundAmount);
        System.out.println("   Simulated Refund ID: " + simulatedRefundId);
        System.out.println("   Reason: " + reason);
        System.out.println("   ⚠️ In production, this would be a real refund to the traveler's card");

        return simulatedRefundId;
    }

    private void updateTravelerWalletWithRefund(String travelerId, BigDecimal refundAmount,
                                                String reason, String refundRecordId, String payHereRefundId) {
        try {
            TravelerWallet travelerWallet = moneyFlowService.getTravelerWallet(travelerId);

            // Update wallet totals
            travelerWallet.setTotalRefunded(travelerWallet.getTotalRefunded().add(refundAmount));
            travelerWallet.setCurrentBalance(travelerWallet.getCurrentBalance().add(refundAmount));
            travelerWallet.setLastUpdated(LocalDateTime.now());

            // Add to refund history
            RefundHistory refundHistory = new RefundHistory();
            refundHistory.setRefundId(refundRecordId);
            refundHistory.setAmount(refundAmount);
            refundHistory.setReason(reason);
            refundHistory.setRefundedAt(LocalDateTime.now());
            refundHistory.setPayHereRefundId(payHereRefundId);

            if (travelerWallet.getRefundHistory() != null) {
                travelerWallet.getRefundHistory().add(refundHistory);
            } else {
                travelerWallet.setRefundHistory(java.util.Arrays.asList(refundHistory));
            }

            travelerWalletRepo.save(travelerWallet);

            System.out.println("💰 Traveler Wallet Updated:");
            System.out.println("   Traveler ID: " + travelerId);
            System.out.println("   Total Refunded: $" + travelerWallet.getTotalRefunded());
            System.out.println("   Current Balance: $" + travelerWallet.getCurrentBalance());

        } catch (Exception e) {
            System.err.println("❌ Error updating traveler wallet: " + e.getMessage());
        }
    }

    // ===== QUERY METHODS =====

    public PayHereRefund getRefundById(String refundId) {
        return refundRepo.findById(refundId).orElse(null);
    }

    public java.util.List<PayHereRefund> getRefundsByBooking(String bookingId) {
        return refundRepo.findByBookingId(bookingId);
    }

    public java.util.List<PayHereRefund> getRefundsByTraveler(String travelerId) {
        return refundRepo.findByTravelerId(travelerId);
    }

    public java.util.Optional<PayHereRefund> getRefundByOriginalPayment(String originalPaymentId) {
        return refundRepo.findByOriginalPaymentId(originalPaymentId);
    }

    // ===== REFUND STATUS CHECK =====

    public String checkRefundStatus(String payHereRefundId) {
        try {
            // In a real implementation, you would call PayHere status API
            // For now, simulate status check
            System.out.println("🔍 Checking PayHere Refund Status:");
            System.out.println("   Refund ID: " + payHereRefundId);

            if (payHereRefundId.startsWith("SIM_")) {
                return "SIMULATED_SUCCESS";
            } else {
                return "SUCCESS"; // Assume success for now
            }
        } catch (Exception e) {
            return "UNKNOWN";
        }
    }

    // ===== MANUAL REFUND PROCESSING =====

    public PayHereRefund processManualRefund(String bookingId, BigDecimal amount, String reason, String adminNote) {
        try {
            System.out.println("🔧 Processing Manual Refund:");
            System.out.println("   Booking ID: " + bookingId);
            System.out.println("   Amount: $" + amount);
            System.out.println("   Reason: " + reason);
            System.out.println("   Admin Note: " + adminNote);

            PayHereRefund manualRefund = new PayHereRefund();
            manualRefund.setBookingId(bookingId);
            manualRefund.setRefundAmount(amount);
            manualRefund.setRefundReason(reason);
            manualRefund.setStatus("MANUAL_PROCESSED");
            manualRefund.setPayHereRefundId("MANUAL_" + System.currentTimeMillis());
            manualRefund.setPayHereResponse("Manual refund processed by admin: " + adminNote);
            manualRefund.setInitiatedAt(LocalDateTime.now());
            manualRefund.setCompletedAt(LocalDateTime.now());

            return refundRepo.save(manualRefund);
        } catch (Exception e) {
            throw new RuntimeException("Manual refund processing failed: " + e.getMessage());
        }
    }
}