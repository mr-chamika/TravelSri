package com.example.student.services;

import com.example.student.model.*;
import com.example.student.repo.*;
import com.example.student.utils.PayHereUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDateTime;
import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Service
public class PayHereRefundService {

    private static final Logger logger = LoggerFactory.getLogger(PayHereRefundService.class);

    @Autowired
    private PayHereRefundRepo refundRepo;

    @Autowired
    private TravelerWalletRepo travelerWalletRepo;

    @Autowired
    private ITravelerWalletService travelerWalletService; // Use the service instead of direct access

    @Autowired
    private PayHereUtils payHereUtils;

    @Value("${payhere.merchant.id}")
    private String merchantId;

    @Value("${payhere.merchant.secret}")
    private String merchantSecret;

    @Value("${payhere.api.base-url}")
    private String payHereBaseUrl;

    /**
     * Process refund through PayHere (simplified version)
     */
    public PayHereRefund processRefund(Booking booking, BigDecimal refundAmount, String reason) {
        try {
            logger.info("💸 Initiating PayHere Refund for booking: {}, amount: {} {}",
                    booking.getId(), refundAmount, booking.getCurrency());

            // 1. Create refund record
            PayHereRefund refund = new PayHereRefund();
            refund.setBookingId(booking.getId());
            refund.setTravelerId(booking.getTravelerId());
            refund.setOriginalPaymentId(booking.getPayHerePaymentId());
            refund.setRefundAmount(refundAmount);
            refund.setRefundReason(reason);
            refund.setStatus("PENDING");
            refund.setInitiatedAt(LocalDateTime.now());

            // 2. Process refund (simulate for now)
            String payHereRefundId = simulateRefund(booking.getPayHerePaymentId(), refundAmount, reason);

            // 3. Update refund record with PayHere response
            refund.setPayHereRefundId(payHereRefundId);
            refund.setStatus("SUCCESS");
            refund.setCompletedAt(LocalDateTime.now());
            refund.setPayHereResponse("Refund processed successfully");

            // 4. Save refund record
            PayHereRefund savedRefund = refundRepo.save(refund);

            // 5. Update traveler wallet using the service
            updateTravelerWalletWithRefund(booking.getTravelerId(), refundAmount, reason,
                    savedRefund.getId(), payHereRefundId);

            logger.info("✅ PayHere Refund Completed: Amount: {} {}, Refund ID: {}",
                    refundAmount, booking.getCurrency(), payHereRefundId);

            return savedRefund;

        } catch (Exception e) {
            logger.error("❌ PayHere refund processing failed for booking: {}", booking.getId(), e);

            // Handle failed refund
            PayHereRefund failedRefund = new PayHereRefund();
            failedRefund.setBookingId(booking.getId());
            failedRefund.setTravelerId(booking.getTravelerId());
            failedRefund.setOriginalPaymentId(booking.getPayHerePaymentId());
            failedRefund.setRefundAmount(refundAmount);
            failedRefund.setRefundReason(reason);
            failedRefund.setStatus("FAILED");
            failedRefund.setPayHereResponse("Refund failed: " + e.getMessage());
            failedRefund.setInitiatedAt(LocalDateTime.now());
            refundRepo.save(failedRefund);

            throw new RuntimeException("PayHere refund failed: " + e.getMessage());
        }
    }

    /**
     * Simulate PayHere refund for testing/development
     */
    private String simulateRefund(String originalPaymentId, BigDecimal refundAmount, String reason) {
        String simulatedRefundId = "SIM_REFUND_" + System.currentTimeMillis();

        logger.info("🎭 SIMULATED PayHere Refund:");
        logger.info("   Original Payment: {}", originalPaymentId);
        logger.info("   Refund Amount: {}", refundAmount);
        logger.info("   Simulated Refund ID: {}", simulatedRefundId);
        logger.info("   Reason: {}", reason);
        logger.info("   ⚠️ In production, this would be a real refund to the traveler's card");

        return simulatedRefundId;
    }

    /**
     * Update traveler wallet with refund using the service
     * ✅ FIXED: Use correct RefundHistory field names
     */
    private void updateTravelerWalletWithRefund(String travelerId, BigDecimal refundAmount,
                                                String reason, String refundRecordId, String payHereRefundId) {
        try {
            logger.info("💰 Updating traveler wallet for refund: {}", travelerId);

            // Use the traveler wallet service to add refund
            travelerWalletService.addRefund(travelerId, refundAmount, refundRecordId, reason, "FULL");

            logger.info("✅ Traveler wallet updated successfully for: {}", travelerId);

        } catch (Exception e) {
            logger.error("❌ Error updating traveler wallet for traveler: {}", travelerId, e);
            // Don't throw - this shouldn't stop the refund process
        }
    }

    // ===== QUERY METHODS =====

    /**
     * Get refund by ID
     */
    public PayHereRefund getRefundById(String refundId) {
        try {
            return refundRepo.findById(refundId).orElse(null);
        } catch (Exception e) {
            logger.error("Error getting refund by ID: {}", refundId, e);
            return null;
        }
    }

    /**
     * Get all refunds for a booking
     */
    public List<PayHereRefund> getRefundsByBooking(String bookingId) {
        try {
            return refundRepo.findByBookingId(bookingId);
        } catch (Exception e) {
            logger.error("Error getting refunds for booking: {}", bookingId, e);
            return List.of();
        }
    }

    /**
     * Get all refunds for a traveler
     */
    public List<PayHereRefund> getRefundsByTraveler(String travelerId) {
        try {
            return refundRepo.findByTravelerId(travelerId);
        } catch (Exception e) {
            logger.error("Error getting refunds for traveler: {}", travelerId, e);
            return List.of();
        }
    }

    /**
     * Get refund by original payment ID
     */
    public Optional<PayHereRefund> getRefundByOriginalPayment(String originalPaymentId) {
        try {
            return refundRepo.findByOriginalPaymentId(originalPaymentId);
        } catch (Exception e) {
            logger.error("Error getting refund by original payment ID: {}", originalPaymentId, e);
            return Optional.empty();
        }
    }

    /**
     * Check refund status from PayHere
     */
    public String checkRefundStatus(String payHereRefundId) {
        try {
            logger.info("🔍 Checking PayHere Refund Status for: {}", payHereRefundId);

            if (payHereRefundId == null || payHereRefundId.trim().isEmpty()) {
                return "UNKNOWN";
            }

            if (payHereRefundId.startsWith("SIM_")) {
                return "SIMULATED_SUCCESS";
            } else if (payHereRefundId.startsWith("MANUAL_")) {
                return "MANUAL_PROCESSED";
            } else {
                // In a real implementation, you would call PayHere status API
                return "SUCCESS"; // Assume success for now
            }
        } catch (Exception e) {
            logger.error("Error checking refund status: {}", payHereRefundId, e);
            return "UNKNOWN";
        }
    }

    /**
     * Process manual refund (admin initiated)
     */
    public PayHereRefund processManualRefund(String bookingId, String travelerId, BigDecimal amount,
                                             String reason, String adminNote) {
        try {
            logger.info("🔧 Processing Manual Refund for booking: {}, amount: {}", bookingId, amount);

            PayHereRefund manualRefund = new PayHereRefund();
            manualRefund.setBookingId(bookingId);
            manualRefund.setTravelerId(travelerId);
            manualRefund.setRefundAmount(amount);
            manualRefund.setRefundReason(reason);
            manualRefund.setStatus("MANUAL_PROCESSED");
            manualRefund.setPayHereRefundId("MANUAL_" + System.currentTimeMillis());
            manualRefund.setPayHereResponse("Manual refund processed by admin: " + adminNote);
            manualRefund.setInitiatedAt(LocalDateTime.now());
            manualRefund.setCompletedAt(LocalDateTime.now());

            PayHereRefund savedRefund = refundRepo.save(manualRefund);

            // Update traveler wallet
            updateTravelerWalletWithRefund(travelerId, amount, reason,
                    savedRefund.getId(), savedRefund.getPayHereRefundId());

            logger.info("✅ Manual refund processed successfully: {}", savedRefund.getId());
            return savedRefund;

        } catch (Exception e) {
            logger.error("❌ Manual refund processing failed for booking: {}", bookingId, e);
            throw new RuntimeException("Manual refund processing failed: " + e.getMessage());
        }
    }

    /**
     * Get refund statistics
     */
    public java.util.Map<String, Object> getRefundStatistics() {
        try {
            java.util.Map<String, Object> stats = new java.util.HashMap<>();

            List<PayHereRefund> allRefunds = refundRepo.findAll();

            // Count by status
            java.util.Map<String, Long> statusCounts = allRefunds.stream()
                    .collect(java.util.stream.Collectors.groupingBy(
                            PayHereRefund::getStatus,
                            java.util.stream.Collectors.counting()
                    ));

            // Calculate total amounts
            BigDecimal totalRefunded = allRefunds.stream()
                    .filter(r -> "SUCCESS".equals(r.getStatus()) || "MANUAL_PROCESSED".equals(r.getStatus()))
                    .map(PayHereRefund::getRefundAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            stats.put("totalRefunds", allRefunds.size());
            stats.put("statusCounts", statusCounts);
            stats.put("totalRefundedAmount", totalRefunded);
            stats.put("currency", "LKR");

            return stats;

        } catch (Exception e) {
            logger.error("Error getting refund statistics", e);
            throw new RuntimeException("Error getting refund statistics: " + e.getMessage());
        }
    }

    /**
     * Get recent refunds
     */
    public List<PayHereRefund> getRecentRefunds(int limit) {
        try {
            if (limit <= 0 || limit > 100) {
                limit = 10; // Default limit
            }

            // Get all refunds and sort by initiated date descending
            return refundRepo.findAll().stream()
                    .sorted((r1, r2) -> r2.getInitiatedAt().compareTo(r1.getInitiatedAt()))
                    .limit(limit)
                    .collect(java.util.stream.Collectors.toList());

        } catch (Exception e) {
            logger.error("Error getting recent refunds", e);
            return List.of();
        }
    }

    /**
     * Check if booking has any refunds
     */
    public boolean hasRefunds(String bookingId) {
        try {
            return !refundRepo.findByBookingId(bookingId).isEmpty();
        } catch (Exception e) {
            logger.error("Error checking refunds for booking: {}", bookingId, e);
            return false;
        }
    }

    /**
     * Get total refunded amount for a booking
     */
    public BigDecimal getTotalRefundedAmount(String bookingId) {
        try {
            return refundRepo.findByBookingId(bookingId).stream()
                    .filter(r -> "SUCCESS".equals(r.getStatus()) || "MANUAL_PROCESSED".equals(r.getStatus()))
                    .map(PayHereRefund::getRefundAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
        } catch (Exception e) {
            logger.error("Error calculating total refunded amount for booking: {}", bookingId, e);
            return BigDecimal.ZERO;
        }
    }
}