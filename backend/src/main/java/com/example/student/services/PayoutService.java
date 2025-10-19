package com.example.student.services;

import com.example.student.model.Booking;
import com.example.student.model.PaymentTransaction;
import com.example.student.model.ProviderWallet;
import com.example.student.repo.PaymentTransactionRepo;
import com.example.student.repo.ProviderWalletRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;

@Service
public class PayoutService {

    @Autowired
    private ProviderWalletRepo providerWalletRepo;

    @Autowired
    private MoneyFlowService moneyFlowService;

    @Autowired
    private PaymentTransactionRepo paymentTransactionRepo;

    public void recordProviderPayout(Booking booking) {
        try {
            BigDecimal totalAmount = booking.getTotalAmount();
            BigDecimal systemCommission = totalAmount.multiply(BigDecimal.valueOf(0.10)); // 10% commission
            BigDecimal providerAmount = totalAmount.subtract(systemCommission);

            // Update Provider Wallet
            ProviderWallet providerWallet = getProviderWallet(booking.getProviderId());
            providerWallet.setPendingPayouts(providerWallet.getPendingPayouts().add(providerAmount));
            providerWallet.setTotalEarnings(providerWallet.getTotalEarnings().add(providerAmount));
            providerWallet.setLastUpdated(LocalDateTime.now());
            providerWalletRepo.save(providerWallet);

            // Record money flow PLATFORM -> PROVIDER
            moneyFlowService.recordMoneyFlow(
                    booking.getId(),
                    "PLATFORM",
                    "PROVIDER",
                    "PLATFORM",
                    booking.getProviderId(),
                    providerAmount,
                    "FINAL_PAYOUT",
                    "Payout to provider after booking confirmation",
                    "PENDING"
            );

            // Create payment transaction record for payout
            PaymentTransaction payoutTransaction = new PaymentTransaction();
            payoutTransaction.setBookingId(booking.getId());
            payoutTransaction.setType("FINAL_PAYOUT");
            payoutTransaction.setAmount(providerAmount);
            payoutTransaction.setCurrency("LKR");
            payoutTransaction.setStatus("PENDING");
            payoutTransaction.setCreatedAt(LocalDateTime.now());
            paymentTransactionRepo.save(payoutTransaction);

            System.out.println("Provider payout recorded: " + providerAmount);

        } catch (Exception e) {
            throw new RuntimeException("Error recording provider payout: " + e.getMessage());
        }
    }

    private ProviderWallet getProviderWallet(String providerId) {
        return providerWalletRepo.findByProviderId(providerId).orElseGet(() -> {
            ProviderWallet newWallet = new ProviderWallet();
            newWallet.setProviderId(providerId);
            newWallet.setTotalEarnings(BigDecimal.ZERO);
            newWallet.setPendingPayouts(BigDecimal.ZERO);
            newWallet.setAvailableBalance(BigDecimal.ZERO);
            newWallet.setTotalWithdrawn(BigDecimal.ZERO);
            newWallet.setPayoutHistory(new ArrayList<>());
            newWallet.setLastUpdated(LocalDateTime.now());
            return providerWalletRepo.save(newWallet);
        });
    }
}
