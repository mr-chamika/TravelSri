package com.example.student.services;

import com.example.student.model.TravelerWallet;
import com.example.student.model.RefundHistory;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

/**
 * Service interface for managing traveler wallet operations
 */
public interface ITravelerWalletService {

    /**
     * Save a traveler wallet
     */
    TravelerWallet save(TravelerWallet wallet);

    /**
     * Find wallet by ID
     */
    Optional<TravelerWallet> findById(String id);

    /**
     * Find wallet by traveler ID
     */
    Optional<TravelerWallet> findByTravelerId(String travelerId);

    /**
     * Get or create wallet for a traveler
     */
    TravelerWallet getOrCreateWallet(String travelerId);

    /**
     * Add spending to traveler wallet
     */
    TravelerWallet addSpending(String travelerId, BigDecimal amount, String bookingId);

    /**
     * Add refund to traveler wallet
     */
    TravelerWallet addRefund(String travelerId, BigDecimal refundAmount, String bookingId,
                             String refundReason, String refundType);

    /**
     * Update wallet balance
     */
    TravelerWallet updateBalance(String travelerId, BigDecimal newBalance);

    /**
     * Get traveler's spending history
     */
    BigDecimal getTotalSpentByTraveler(String travelerId);

    /**
     * Get traveler's refund history
     */
    BigDecimal getTotalRefundedToTraveler(String travelerId);

    /**
     * Get refund history for a traveler
     */
    List<RefundHistory> getRefundHistory(String travelerId);

    /**
     * Add refund history entry
     */
    TravelerWallet addRefundHistory(String travelerId, RefundHistory refundHistory);

    /**
     * Check if traveler has sufficient balance for a transaction
     */
    boolean hasSufficientBalance(String travelerId, BigDecimal amount);

    /**
     * Get wallet statistics for a traveler
     */
    java.util.Map<String, Object> getWalletStatistics(String travelerId);

    /**
     * Delete wallet by ID
     */
    void deleteById(String id);

    /**
     * Get all wallets with activity in date range
     */
    List<TravelerWallet> getWalletsWithActivityInDateRange(java.time.LocalDateTime startDate,
                                                           java.time.LocalDateTime endDate);
}