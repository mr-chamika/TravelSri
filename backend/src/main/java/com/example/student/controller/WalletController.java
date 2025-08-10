package com.example.student.controller;

import com.example.student.model.*;
import com.example.student.services.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/wallet")
@CrossOrigin
public class WalletController {

    @Autowired
    private MoneyFlowService moneyFlowService;

    @Autowired
    private BankTransferService bankTransferService;

    @Autowired
    private PayHereRefundService refundService;

    // ===== PLATFORM WALLET =====
    @GetMapping("/platform")
    public ResponseEntity<PlatformWallet> getPlatformWallet() {
        try {
            PlatformWallet wallet = moneyFlowService.getPlatformWallet();
            return ResponseEntity.ok(wallet);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // ===== PROVIDER WALLET =====
    @GetMapping("/provider/{providerId}")
    public ResponseEntity<ProviderWallet> getProviderWallet(@PathVariable String providerId) {
        try {
            ProviderWallet wallet = moneyFlowService.getProviderWallet(providerId);
            return ResponseEntity.ok(wallet);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/provider/{providerId}/withdraw")
    public ResponseEntity<?> withdrawProviderFunds(@PathVariable String providerId,
                                                   @RequestParam BigDecimal amount,
                                                   @RequestParam String transferType) {
        try {
            BankTransfer transfer = bankTransferService.transferToProviderBank(
                    providerId, amount, transferType, "MANUAL_WITHDRAWAL");

            return ResponseEntity.ok(transfer);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Withdrawal failed: " + e.getMessage());
        }
    }

    // ===== TRAVELER WALLET =====
    @GetMapping("/traveler/{travelerId}")
    public ResponseEntity<TravelerWallet> getTravelerWallet(@PathVariable String travelerId) {
        try {
            TravelerWallet wallet = moneyFlowService.getTravelerWallet(travelerId);
            return ResponseEntity.ok(wallet);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // ===== MONEY FLOW TRACKING =====
    @GetMapping("/money-flow/booking/{bookingId}")
    public ResponseEntity<List<MoneyFlow>> getBookingMoneyFlow(@PathVariable String bookingId) {
        try {
            List<MoneyFlow> flows = moneyFlowService.getBookingMoneyFlow(bookingId);
            return ResponseEntity.ok(flows);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/money-flow/summary")
    public ResponseEntity<Map<String, Object>> getMoneyFlowSummary() {
        try {
            PlatformWallet platformWallet = moneyFlowService.getPlatformWallet();

            Map<String, Object> summary = new HashMap<>();
            summary.put("totalPlatformBalance", platformWallet.getTotalBalance());
            summary.put("totalCommissionsEarned", platformWallet.getTotalCommissionsEarned());
            summary.put("totalRefundsProcessed", platformWallet.getTotalRefundsProcessed());
            summary.put("pendingPayouts", platformWallet.getPendingPayouts());
            summary.put("availableBalance", platformWallet.getAvailableBalance());

            return ResponseEntity.ok(summary);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // ===== TESTING ENDPOINTS =====
    @PostMapping("/test/simulate-bank-transfer")
    public ResponseEntity<?> simulateBankTransfer(@RequestParam String providerId,
                                                  @RequestParam BigDecimal amount,
                                                  @RequestParam String transferType) {
        try {
            BankTransfer transfer = bankTransferService.transferToProviderBank(
                    providerId, amount, transferType, "TEST_TRANSFER");

            return ResponseEntity.ok(transfer);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Transfer simulation failed: " + e.getMessage());
        }
    }

    @PostMapping("/test/simulate-refund")
    public ResponseEntity<?> simulateRefund(@RequestParam String bookingId,
                                            @RequestParam BigDecimal amount,
                                            @RequestParam String reason) {
        try {
            // This would be called from your booking service
            Map<String, String> result = new HashMap<>();
            result.put("status", "simulated");
            result.put("message", "Refund simulation: $" + amount + " for reason: " + reason);

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Refund simulation failed: " + e.getMessage());
        }
    }
}