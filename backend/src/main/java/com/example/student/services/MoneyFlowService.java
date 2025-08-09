package com.example.student.services;

import com.example.student.model.*;
import com.example.student.repo.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class MoneyFlowService {

    @Autowired
    private PlatformWalletRepo platformWalletRepo;

    @Autowired
    private ProviderWalletRepo providerWalletRepo;

    @Autowired
    private TravelerWalletRepo travelerWalletRepo;

    @Autowired
    private MoneyFlowRepo moneyFlowRepo;

    // ===== PAYMENT CAPTURE =====
    public void processPaymentCapture(Booking booking) {
        try {
            BigDecimal amount = booking.getTotalAmount();

            // 1. Update Platform Wallet (receives money from PayHere)
            PlatformWallet platformWallet = getPlatformWallet();
            platformWallet.setTotalBalance(platformWallet.getTotalBalance().add(amount));
            platformWallet.setPendingPayouts(platformWallet.getPendingPayouts().add(amount));
            platformWallet.setLastUpdated(LocalDateTime.now());
            platformWalletRepo.save(platformWallet);

            // 2. Update Traveler Wallet (track spending)
            TravelerWallet travelerWallet = getTravelerWallet(booking.getTravelerId());
            travelerWallet.setTotalSpent(travelerWallet.getTotalSpent().add(amount));
            travelerWallet.setLastUpdated(LocalDateTime.now());
            travelerWalletRepo.save(travelerWallet);

            // 3. Record money flow
            recordMoneyFlow(booking.getId(), "TRAVELER", "PLATFORM",
                    booking.getTravelerId(), "PLATFORM", amount,
                    "PAYMENT", "Payment captured from traveler", "COMPLETED");

            System.out.println("💰 Payment Captured: $" + amount);
            System.out.println("🏦 Platform Balance: $" + platformWallet.getTotalBalance());

        } catch (Exception e) {
            throw new RuntimeException("Error processing payment capture: " + e.getMessage());
        }
    }

    // ===== CONFIRMATION FEE PAYOUT =====
    public void processConfirmationFeePayout(Booking booking) {
        try {
            BigDecimal confirmationFee = booking.getProviderConfirmationFee();

            // 1. Deduct from Platform Wallet
            PlatformWallet platformWallet = getPlatformWallet();
            platformWallet.setPendingPayouts(platformWallet.getPendingPayouts().subtract(confirmationFee));
            platformWallet.setLastUpdated(LocalDateTime.now());
            platformWalletRepo.save(platformWallet);

            // 2. Add to Provider Wallet
            ProviderWallet providerWallet = getProviderWallet(booking.getProviderId());
            providerWallet.setTotalEarnings(providerWallet.getTotalEarnings().add(confirmationFee));
            providerWallet.setPendingPayouts(providerWallet.getPendingPayouts().add(confirmationFee));
            providerWallet.setLastUpdated(LocalDateTime.now());
            providerWalletRepo.save(providerWallet);

            // 3. Record money flow
            recordMoneyFlow(booking.getId(), "PLATFORM", "PROVIDER",
                    "PLATFORM", booking.getProviderId(), confirmationFee,
                    "CONFIRMATION_FEE", "10% confirmation fee after 20h window", "COMPLETED");

            System.out.println("💼 Confirmation Fee Paid: $" + confirmationFee + " to provider " + booking.getProviderId());

        } catch (Exception e) {
            throw new RuntimeException("Error processing confirmation fee: " + e.getMessage());
        }
    }

    // ===== FINAL PAYOUT =====
    public void processFinalPayout(Booking booking) {
        try {
            BigDecimal finalPayout = booking.getTotalAmount().multiply(BigDecimal.valueOf(0.75)); // 75%
            BigDecimal commission = booking.getPlatformCommission(); // 5%

            // 1. Platform keeps commission, pays out the rest
            PlatformWallet platformWallet = getPlatformWallet();
            platformWallet.setPendingPayouts(platformWallet.getPendingPayouts().subtract(finalPayout.add(commission)));
            platformWallet.setTotalCommissionsEarned(platformWallet.getTotalCommissionsEarned().add(commission));
            platformWallet.setAvailableBalance(platformWallet.getAvailableBalance().add(commission));
            platformWallet.setLastUpdated(LocalDateTime.now());
            platformWalletRepo.save(platformWallet);

            // 2. Provider gets final payout
            ProviderWallet providerWallet = getProviderWallet(booking.getProviderId());
            providerWallet.setTotalEarnings(providerWallet.getTotalEarnings().add(finalPayout));
            providerWallet.setPendingPayouts(providerWallet.getPendingPayouts().add(finalPayout));
            providerWallet.setLastUpdated(LocalDateTime.now());
            providerWalletRepo.save(providerWallet);

            // 3. Record money flows
            recordMoneyFlow(booking.getId(), "PLATFORM", "PROVIDER",
                    "PLATFORM", booking.getProviderId(), finalPayout,
                    "FINAL_PAYOUT", "75% final payout after service completion", "COMPLETED");

            recordMoneyFlow(booking.getId(), "PLATFORM", "PLATFORM",
                    "PLATFORM", "PLATFORM", commission,
                    "COMMISSION", "5% platform commission", "COMPLETED");

            System.out.println("🎉 Final Payout: $" + finalPayout + " to provider");
            System.out.println("💰 Platform Commission: $" + commission);

        } catch (Exception e) {
            throw new RuntimeException("Error processing final payout: " + e.getMessage());
        }
    }

    // ===== REFUND PROCESSING =====
    public void processRefund(Booking booking, BigDecimal refundAmount, String reason) {
        try {
            // 1. Deduct from Platform Wallet
            PlatformWallet platformWallet = getPlatformWallet();
            platformWallet.setTotalBalance(platformWallet.getTotalBalance().subtract(refundAmount));
            platformWallet.setPendingPayouts(platformWallet.getPendingPayouts().subtract(refundAmount));
            platformWallet.setTotalRefundsProcessed(platformWallet.getTotalRefundsProcessed().add(refundAmount));
            platformWallet.setLastUpdated(LocalDateTime.now());
            platformWalletRepo.save(platformWallet);

            // 2. Add to Traveler Wallet (refund tracking)
            TravelerWallet travelerWallet = getTravelerWallet(booking.getTravelerId());
            travelerWallet.setTotalRefunded(travelerWallet.getTotalRefunded().add(refundAmount));
            travelerWallet.setCurrentBalance(travelerWallet.getCurrentBalance().add(refundAmount));
            travelerWallet.setLastUpdated(LocalDateTime.now());
            travelerWalletRepo.save(travelerWallet);

            // 3. Record money flow
            recordMoneyFlow(booking.getId(), "PLATFORM", "TRAVELER",
                    "PLATFORM", booking.getTravelerId(), refundAmount,
                    "REFUND", reason, "COMPLETED");

            System.out.println("💸 Refund Processed: $" + refundAmount + " to traveler " + booking.getTravelerId());
            System.out.println("📊 Reason: " + reason);

        } catch (Exception e) {
            throw new RuntimeException("Error processing refund: " + e.getMessage());
        }
    }

    // ===== WALLET MANAGEMENT =====
    public PlatformWallet getPlatformWallet() {
        Optional<PlatformWallet> wallet = platformWalletRepo.findFirstByOrderByLastUpdatedDesc();
        if (wallet.isPresent()) {
            return wallet.get();
        } else {
            // Create initial platform wallet
            PlatformWallet newWallet = new PlatformWallet();
            newWallet.setTotalBalance(BigDecimal.ZERO);
            newWallet.setAvailableBalance(BigDecimal.ZERO);
            newWallet.setPendingPayouts(BigDecimal.ZERO);
            newWallet.setTotalCommissionsEarned(BigDecimal.ZERO);
            newWallet.setTotalRefundsProcessed(BigDecimal.ZERO);
            newWallet.setRecentTransactions(new ArrayList<>());
            newWallet.setLastUpdated(LocalDateTime.now());
            return platformWalletRepo.save(newWallet);
        }
    }

    public ProviderWallet getProviderWallet(String providerId) {
        Optional<ProviderWallet> wallet = providerWalletRepo.findByProviderId(providerId);
        if (wallet.isPresent()) {
            return wallet.get();
        } else {
            // Create new provider wallet
            ProviderWallet newWallet = new ProviderWallet();
            newWallet.setProviderId(providerId);
            newWallet.setTotalEarnings(BigDecimal.ZERO);
            newWallet.setAvailableBalance(BigDecimal.ZERO);
            newWallet.setPendingPayouts(BigDecimal.ZERO);
            newWallet.setTotalWithdrawn(BigDecimal.ZERO);
            newWallet.setPayoutHistory(new ArrayList<>());
            newWallet.setLastUpdated(LocalDateTime.now());
            return providerWalletRepo.save(newWallet);
        }
    }

    public TravelerWallet getTravelerWallet(String travelerId) {
        Optional<TravelerWallet> wallet = travelerWalletRepo.findByTravelerId(travelerId);
        if (wallet.isPresent()) {
            return wallet.get();
        } else {
            // Create new traveler wallet
            TravelerWallet newWallet = new TravelerWallet();
            newWallet.setTravelerId(travelerId);
            newWallet.setTotalSpent(BigDecimal.ZERO);
            newWallet.setTotalRefunded(BigDecimal.ZERO);
            newWallet.setCurrentBalance(BigDecimal.ZERO);
            newWallet.setRefundHistory(new ArrayList<>());
            newWallet.setLastUpdated(LocalDateTime.now());
            return travelerWalletRepo.save(newWallet);
        }
    }

    // ===== MONEY FLOW TRACKING =====
    private void recordMoneyFlow(String bookingId, String fromEntity, String toEntity,
                                 String fromEntityId, String toEntityId, BigDecimal amount,
                                 String flowType, String description, String status) {
        MoneyFlow flow = new MoneyFlow();
        flow.setBookingId(bookingId);
        flow.setFromEntity(fromEntity);
        flow.setToEntity(toEntity);
        flow.setFromEntityId(fromEntityId);
        flow.setToEntityId(toEntityId);
        flow.setAmount(amount);
        flow.setFlowType(flowType);
        flow.setDescription(description);
        flow.setStatus(status);
        flow.setCreatedAt(LocalDateTime.now());

        moneyFlowRepo.save(flow);
    }

    // ===== QUERY METHODS =====
    public List<MoneyFlow> getBookingMoneyFlow(String bookingId) {
        return moneyFlowRepo.findByBookingId(bookingId);
    }

    public BigDecimal getTotalPlatformRevenue() {
        PlatformWallet wallet = getPlatformWallet();
        return wallet.getTotalCommissionsEarned();
    }

    public BigDecimal getTotalProviderEarnings(String providerId) {
        ProviderWallet wallet = getProviderWallet(providerId);
        return wallet.getTotalEarnings();
    }
}