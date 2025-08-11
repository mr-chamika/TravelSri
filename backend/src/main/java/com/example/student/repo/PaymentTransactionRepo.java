package com.example.student.repo;

import com.example.student.model.PaymentTransaction;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentTransactionRepo extends MongoRepository<PaymentTransaction, String> {

    @Query("{'bookingId': ?0}")
    List<PaymentTransaction> findByBookingId(String bookingId);

    @Query("{'payHereOrderId': ?0}")
    List<PaymentTransaction> findByPayHereOrderId(String orderId);

    @Query("{'payHerePaymentId': ?0}")
    List<PaymentTransaction> findByPayHerePaymentId(String paymentId);

    @Query("{'payHereRefundId': ?0}")
    List<PaymentTransaction> findByPayHereRefundId(String refundId);

    @Query("{'type': ?0}")
    List<PaymentTransaction> findByType(String type);

    @Query("{'status': ?0}")
    List<PaymentTransaction> findByStatus(String status);

    @Query("{'type': ?0, 'status': ?1}")
    List<PaymentTransaction> findByTypeAndStatus(String type, String status);

    @Query("{'bookingId': ?0, 'type': ?1}")
    List<PaymentTransaction> findByBookingIdAndType(String bookingId, String type);

    @Query("{'bookingId': ?0, 'status': ?1}")
    List<PaymentTransaction> findByBookingIdAndStatus(String bookingId, String status);

    @Query("{'createdAt': {$gte: ?0, $lte: ?1}}")
    List<PaymentTransaction> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);

    @Query("{'status': 'SUCCESS', 'type': 'PAYMENT'}")
    List<PaymentTransaction> findSuccessfulPayments();

    @Query("{'status': 'SUCCESS', 'type': ?0}")
    List<PaymentTransaction> findSuccessfulTransactionsByType(String type);

    // Aggregation queries for statistics
    @Query(value = "{'status': 'SUCCESS', 'type': 'PAYMENT'}", fields = "{'amount': 1}")
    List<PaymentTransaction> findSuccessfulPaymentAmounts();

    @Query("{'createdAt': {$gte: ?0}}")
    List<PaymentTransaction> findRecentTransactions(LocalDateTime since);

    @Query("{'status': 'PENDING', 'createdAt': {$lt: ?0}}")
    List<PaymentTransaction> findExpiredPendingTransactions(LocalDateTime cutoffDate);

    // Check if booking has successful payment
    @Query(value = "{'bookingId': ?0, 'status': 'SUCCESS', 'type': 'PAYMENT'}", exists = true)
    boolean existsByBookingIdAndStatusAndType(String bookingId);

    // Get latest transaction for booking
    @Query(value = "{'bookingId': ?0}", sort = "{'createdAt': -1}")
    List<PaymentTransaction> findLatestByBookingId(String bookingId);

    // Find transactions by amount range
    @Query("{'amount': {$gte: ?0, $lte: ?1}}")
    List<PaymentTransaction> findByAmountBetween(Double minAmount, Double maxAmount);

    // Find by currency
    @Query("{'currency': ?0}")
    List<PaymentTransaction> findByCurrency(String currency);

    // Find transactions with reasons containing specific text
    @Query("{'reason': {$regex: ?0, $options: 'i'}}")
    List<PaymentTransaction> findByReasonContaining(String reason);

    // Count transactions by status
    @Query(value = "{'status': ?0}", count = true)
    long countByStatus(String status);

    // Count transactions by type
    @Query(value = "{'type': ?0}", count = true)
    long countByType(String type);

    // Find all refund transactions for a booking
    @Query("{'bookingId': ?0, 'type': {$in: ['REFUND', 'PARTIAL_REFUND']}}")
    List<PaymentTransaction> findRefundTransactionsByBookingId(String bookingId);

    // Find all payout transactions
    @Query("{'type': {$in: ['CONFIRMATION_FEE_PAYOUT', 'FINAL_PAYOUT']}}")
    List<PaymentTransaction> findAllPayoutTransactions();
}