package com.example.student.repo;

import com.example.student.model.PaymentTransaction;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentTransactionRepo extends MongoRepository<PaymentTransaction, String> {

    // ===== EXISTING METHODS =====

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

    @Query(value = "{'status': 'SUCCESS', 'type': 'PAYMENT'}", fields = "{'amount': 1}")
    List<PaymentTransaction> findSuccessfulPaymentAmounts();

    @Query("{'createdAt': {$gte: ?0}}")
    List<PaymentTransaction> findRecentTransactions(LocalDateTime since);

    @Query("{'status': 'PENDING', 'createdAt': {$lt: ?0}}")
    List<PaymentTransaction> findExpiredPendingTransactions(LocalDateTime cutoffDate);

    @Query(value = "{'bookingId': ?0, 'status': 'SUCCESS', 'type': 'PAYMENT'}", exists = true)
    boolean existsByBookingIdAndStatusAndType(String bookingId);

    @Query(value = "{'bookingId': ?0}", sort = "{'createdAt': -1}")
    List<PaymentTransaction> findLatestByBookingId(String bookingId);

    @Query("{'amount': {$gte: ?0, $lte: ?1}}")
    List<PaymentTransaction> findByAmountBetween(Double minAmount, Double maxAmount);

    @Query("{'currency': ?0}")
    List<PaymentTransaction> findByCurrency(String currency);

    @Query("{'reason': {$regex: ?0, $options: 'i'}}")
    List<PaymentTransaction> findByReasonContaining(String reason);

    @Query(value = "{'status': ?0}", count = true)
    long countByStatus(String status);

    @Query(value = "{'type': ?0}", count = true)
    long countByType(String type);

    @Query("{'bookingId': ?0, 'type': {$in: ['REFUND', 'PARTIAL_REFUND']}}")
    List<PaymentTransaction> findRefundTransactionsByBookingId(String bookingId);

    @Query("{'type': {$in: ['CONFIRMATION_FEE_PAYOUT', 'FINAL_PAYOUT']}}")
    List<PaymentTransaction> findAllPayoutTransactions();

    // ===== NEW PAYMENT STATUS METHODS =====

    @Query("{'payHereOrderId': ?0}")
    Optional<PaymentTransaction> findByOrderId(String orderId);

    @Query(value = "{'bookingId': ?0}", sort = "{'createdAt': -1}")
    Optional<PaymentTransaction> findFirstByBookingIdOrderByCreatedAtDesc(String bookingId);

    @Query(value = "{'bookingId': ?0}", sort = "{'createdAt': -1}")
    List<PaymentTransaction> findByBookingIdOrderByCreatedAtDesc(String bookingId);

    @Query(value = "{'payHereOrderId': ?0}", exists = true)
    boolean existsByOrderId(String orderId);

    @Query("{'status': ?0, 'createdAt': {$lt: ?1}}")
    List<PaymentTransaction> findByStatusAndCreatedAtBefore(String status, LocalDateTime date);

    @Query(value = "{'status': {$in: ?0}}", sort = "{'createdAt': -1}")
    List<PaymentTransaction> findByStatusInOrderByCreatedAtDesc(List<String> statuses);

    @Query("{'status': 'PENDING', 'createdAt': {$lt: ?0}}")
    List<PaymentTransaction> findPendingPaymentsOlderThan(LocalDateTime cutoffTime);

    @Query("{'status': 'SUCCESS', 'createdAt': {$gte: ?0, $lte: ?1}}")
    List<PaymentTransaction> findSuccessfulPaymentsBetween(LocalDateTime startDate, LocalDateTime endDate);

    @Query(value = "{'status': 'FAILED', 'createdAt': {$gt: ?0}}", sort = "{'createdAt': -1}")
    List<PaymentTransaction> findFailedPaymentsForRetry(LocalDateTime cutoffTime);

    @Query(value = "{'createdAt': {$gte: ?0, $lt: ?1}}", count = true)
    long getPaymentCountForDateRange(LocalDateTime startOfDay, LocalDateTime endOfDay);

    @Query("{'notes': {$regex: ?0, $options: 'i'}}")
    List<PaymentTransaction> findPaymentsWithNotesContaining(String searchText);

    @Query(value = "{'status': ?0}", sort = "{'createdAt': -1}")
    List<PaymentTransaction> findByStatusOrderByCreatedAtDesc(String status);

    @Query("{'transactionId': ?0}")
    Optional<PaymentTransaction> findByTransactionId(String transactionId);

    List<PaymentTransaction> findAllByBookingId(String bookingId);

    // ===== AGGREGATION METHODS =====

    @Aggregation(pipeline = {
            "{ '$group' : { '_id' : '$status', 'count' : { '$sum' : 1 }, 'totalAmount' : { '$sum' : '$amount' } } }",
            "{ '$sort' : { '_id' : 1 } }"
    })
    List<PaymentStatusStats> getPaymentStatisticsByStatus();

    @Aggregation(pipeline = {
            "{ '$match' : { 'createdAt' : { '$gte' : ?0, '$lte' : ?1 } } }",
            "{ '$group' : { " +
                    "    '_id' : { '$dateToString' : { 'format' : '%Y-%m-%d', 'date' : '$createdAt' } }, " +
                    "    'count' : { '$sum' : 1 }, " +
                    "    'totalAmount' : { '$sum' : '$amount' } " +
                    "} }",
            "{ '$sort' : { '_id' : 1 } }"
    })
    List<DailyPaymentSummary> getDailyPaymentSummary(LocalDateTime startDate, LocalDateTime endDate);

    @Aggregation(pipeline = {
            "{ '$match' : { 'createdAt' : { '$gte' : ?0, '$lte' : ?1 } } }",
            "{ '$group' : { " +
                    "    '_id' : { '$hour' : '$createdAt' }, " +
                    "    'count' : { '$sum' : 1 } " +
                    "} }",
            "{ '$sort' : { '_id' : 1 } }"
    })
    List<HourlyPaymentVolume> getHourlyPaymentVolume(LocalDateTime startOfDay, LocalDateTime endOfDay);

    @Aggregation(pipeline = {
            "{ '$match' : { 'status' : 'SUCCESS' } }",
            "{ '$group' : { '_id' : '$bookingId', 'count' : { '$sum' : 1 } } }",
            "{ '$match' : { 'count' : { '$gt' : 1 } } }"
    })
    List<DuplicatePaymentResult> findDuplicateSuccessfulPayments();

    @Aggregation(pipeline = {
            "{ '$match' : { 'createdAt' : { '$gte' : ?0, '$lte' : ?1 } } }",
            "{ '$group' : { " +
                    "    '_id' : null, " +
                    "    'total' : { '$sum' : 1 }, " +
                    "    'successful' : { '$sum' : { '$cond' : [ { '$eq' : [ '$status', 'SUCCESS' ] }, 1, 0 ] } } " +
                    "} }"
    })
    List<SuccessRateResult> getSuccessRateForPeriod(LocalDateTime startDate, LocalDateTime endDate);

    @Aggregation(pipeline = {
            "{ '$sort' : { 'bookingId' : 1, 'createdAt' : -1 } }",
            "{ '$group' : { '_id' : '$bookingId', 'latestPayment' : { '$first' : '$$ROOT' } } }",
            "{ '$replaceRoot' : { 'newRoot' : '$latestPayment' } }",
            "{ '$sort' : { 'createdAt' : -1 } }"
    })
    List<PaymentTransaction> findLatestPaymentForEachBooking();

    @Aggregation(pipeline = {
            "{ '$match' : { 'status' : ?0 } }",
            "{ '$group' : { '_id' : null, 'total' : { '$sum' : '$amount' } } }"
    })
    List<SumResult> sumAmountByStatus(String status);

    // ===== RESULT CLASSES =====

    public static class SumResult {
        private Double total;
        public SumResult() {}
        public Double getTotal() { return total != null ? total : 0.0; }
        public void setTotal(Double total) { this.total = total; }
    }

    public static class PaymentStatusStats {
        private String _id;
        private long count;
        private Double totalAmount;
        public PaymentStatusStats() {}
        public String getStatus() { return _id; }
        public void set_id(String _id) { this._id = _id; }
        public long getCount() { return count; }
        public void setCount(long count) { this.count = count; }
        public Double getTotalAmount() { return totalAmount != null ? totalAmount : 0.0; }
        public void setTotalAmount(Double totalAmount) { this.totalAmount = totalAmount; }
    }

    public static class DailyPaymentSummary {
        private String _id;
        private long count;
        private Double totalAmount;
        public DailyPaymentSummary() {}
        public String getDate() { return _id; }
        public void set_id(String _id) { this._id = _id; }
        public long getCount() { return count; }
        public void setCount(long count) { this.count = count; }
        public Double getTotalAmount() { return totalAmount != null ? totalAmount : 0.0; }
        public void setTotalAmount(Double totalAmount) { this.totalAmount = totalAmount; }
    }

    public static class HourlyPaymentVolume {
        private int _id;
        private long count;
        public HourlyPaymentVolume() {}
        public int getHour() { return _id; }
        public void set_id(int _id) { this._id = _id; }
        public long getCount() { return count; }
        public void setCount(long count) { this.count = count; }
    }

    public static class DuplicatePaymentResult {
        private String _id;
        private long count;
        public DuplicatePaymentResult() {}
        public String getBookingId() { return _id; }
        public void set_id(String _id) { this._id = _id; }
        public long getCount() { return count; }
        public void setCount(long count) { this.count = count; }
    }

    public static class SuccessRateResult {
        private long total;
        private long successful;
        public SuccessRateResult() {}
        public long getTotal() { return total; }
        public void setTotal(long total) { this.total = total; }
        public long getSuccessful() { return successful; }
        public void setSuccessful(long successful) { this.successful = successful; }
        public double getSuccessRate() {
            return total > 0 ? (double) successful / total * 100 : 0.0;
        }
    }
}