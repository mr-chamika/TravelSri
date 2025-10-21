package com.example.student.repo;

import com.example.student.model.TravelerWallet;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface TravelerWalletRepo extends MongoRepository<TravelerWallet, String> {

    // ===== EXISTING METHODS =====
    @Query("{'travelerId': ?0}")
    Optional<TravelerWallet> findByTravelerId(String travelerId);

    // ===== NEW METHODS FOR SERVICE COMPATIBILITY =====

    /**
     * Find wallets with last updated between dates
     */
    @Query("{'lastUpdated': {'$gte': ?0, '$lte': ?1}}")
    List<TravelerWallet> findByLastUpdatedBetween(LocalDateTime startDate, LocalDateTime endDate);

    /**
     * Find wallets with total spent greater than amount
     */
    @Query("{'totalSpent': {'$gt': ?0}}")
    List<TravelerWallet> findByTotalSpentGreaterThan(BigDecimal amount);

    /**
     * Find wallets with current balance greater than amount
     */
    @Query("{'currentBalance': {'$gt': ?0}}")
    List<TravelerWallet> findByCurrentBalanceGreaterThan(BigDecimal amount);

    /**
     * Find wallets with total refunded greater than amount
     */
    @Query("{'totalRefunded': {'$gt': ?0}}")
    List<TravelerWallet> findByTotalRefundedGreaterThan(BigDecimal amount);

    /**
     * Check if wallet exists for traveler
     */
    @Query(value = "{'travelerId': ?0}", exists = true)
    boolean existsByTravelerId(String travelerId);

    /**
     * Count wallets with activity in date range
     */
    @Query(value = "{'lastUpdated': {'$gte': ?0, '$lte': ?1}}", count = true)
    long countWalletsWithActivityInDateRange(LocalDateTime startDate, LocalDateTime endDate);

    /**
     * Find wallets ordered by total spent descending
     */
    @Query(value = "{}", sort = "{'totalSpent': -1}")
    List<TravelerWallet> findTopSpenders(org.springframework.data.domain.Pageable pageable);

    /**
     * Find wallets ordered by last updated descending
     */
    @Query(value = "{}", sort = "{'lastUpdated': -1}")
    List<TravelerWallet> findRecentlyActive(org.springframework.data.domain.Pageable pageable);

    /**
     * Get total spent across all wallets (for aggregation)
     */
    @Query(value = "{}", fields = "{'totalSpent': 1, '_id': 0}")
    List<TravelerWallet> findAllForTotalSpentCalculation();

    /**
     * Get total refunded across all wallets (for aggregation)
     */
    @Query(value = "{}", fields = "{'totalRefunded': 1, '_id': 0}")
    List<TravelerWallet> findAllForTotalRefundedCalculation();

    /**
     * Find wallets with refund history
     */
    @Query("{'refundHistory': {'$exists': true, '$not': {'$size': 0}}}")
    List<TravelerWallet> findWalletsWithRefundHistory();

    /**
     * Delete wallet by traveler ID
     */
    @Query(delete = true, value = "{'travelerId': ?0}")
    void deleteByTravelerId(String travelerId);

    // ===== ADDITIONAL USEFUL QUERIES =====

    /**
     * Find wallets with zero balance
     */
    @Query("{'currentBalance': 0}")
    List<TravelerWallet> findWalletsWithZeroBalance();

    /**
     * Find wallets with positive balance
     */
    @Query("{'currentBalance': {'$gt': 0}}")
    List<TravelerWallet> findWalletsWithPositiveBalance();

    /**
     * Find wallets created between dates
     */
    @Query("{'createdAt': {'$gte': ?0, '$lte': ?1}}")
    List<TravelerWallet> findWalletsCreatedBetween(LocalDateTime startDate, LocalDateTime endDate);

    /**
     * Find wallets with spending above threshold
     */
    @Query("{'totalSpent': {'$gte': ?0}}")
    List<TravelerWallet> findHighSpenders(BigDecimal threshold);

    /**
     * Find wallets with refunds above threshold
     */
    @Query("{'totalRefunded': {'$gte': ?0}}")
    List<TravelerWallet> findHighRefundReceivers(BigDecimal threshold);

    /**
     * Count total active wallets (have spending or balance)
     */
    @Query(value = "{'$or': [{'totalSpent': {'$gt': 0}}, {'currentBalance': {'$gt': 0}}]}", count = true)
    long countActiveWallets();

    /**
     * Find wallets by total spent range
     */
    @Query("{'totalSpent': {'$gte': ?0, '$lte': ?1}}")
    List<TravelerWallet> findByTotalSpentBetween(BigDecimal minSpent, BigDecimal maxSpent);

    /**
     * Find wallets by current balance range
     */
    @Query("{'currentBalance': {'$gte': ?0, '$lte': ?1}}")
    List<TravelerWallet> findByCurrentBalanceBetween(BigDecimal minBalance, BigDecimal maxBalance);

    /**
     * Find wallets that haven't been updated recently
     */
    @Query("{'lastUpdated': {'$lt': ?0}}")
    List<TravelerWallet> findStaleWallets(LocalDateTime cutoffDate);

    /**
     * Find wallets with multiple refunds
     */
    @Query("{'refundHistory.1': {'$exists': true}}")
    List<TravelerWallet> findWalletsWithMultipleRefunds();

    /**
     * Count wallets with spending
     */
    @Query(value = "{'totalSpent': {'$gt': 0}}", count = true)
    long countWalletsWithSpending();

    /**
     * Count wallets with refunds
     */
    @Query(value = "{'totalRefunded': {'$gt': 0}}", count = true)
    long countWalletsWithRefunds();

    /**
     * Find recently updated wallets (last 24 hours)
     */
    @Query("{'lastUpdated': {'$gte': ?0}}")
    List<TravelerWallet> findRecentlyUpdated(LocalDateTime since);
}