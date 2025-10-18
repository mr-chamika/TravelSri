package com.example.student.repo;

import com.example.student.model.MoneyFlow;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface MoneyFlowRepo extends MongoRepository<MoneyFlow, String> {

    // ===== EXISTING METHODS =====
    @Query("{'bookingId': ?0}")
    List<MoneyFlow> findByBookingId(String bookingId);

    @Query("{'fromEntityId': ?0, 'toEntityId': ?1}")
    List<MoneyFlow> findByFromEntityIdAndToEntityId(String fromEntityId, String toEntityId);

    @Query("{'flowType': ?0}")
    List<MoneyFlow> findByFlowType(String flowType);

    // ===== NEW METHODS FOR SERVICE COMPATIBILITY =====

    /**
     * Find money flows from specific entity
     */
    @Query("{'fromEntity': ?0, 'fromEntityId': ?1}")
    List<MoneyFlow> findByFromEntityAndFromEntityId(String fromEntity, String fromEntityId);

    /**
     * Find money flows to specific entity
     */
    @Query("{'toEntity': ?0, 'toEntityId': ?1}")
    List<MoneyFlow> findByToEntityAndToEntityId(String toEntity, String toEntityId);

    /**
     * Find money flows by status
     */
    @Query("{'status': ?0}")
    List<MoneyFlow> findByStatus(String status);

    /**
     * Find money flows by transaction reference
     */
    @Query("{'transactionReference': ?0}")
    List<MoneyFlow> findByTransactionReference(String transactionReference);

    /**
     * Find money flows by flow type and from entity ID
     */
    @Query("{'flowType': ?0, 'fromEntityId': ?1}")
    List<MoneyFlow> findByFlowTypeAndFromEntityId(String flowType, String fromEntityId);

    /**
     * Find money flows by flow type and to entity ID
     */
    @Query("{'flowType': ?0, 'toEntityId': ?1}")
    List<MoneyFlow> findByFlowTypeAndToEntityId(String flowType, String toEntityId);

    /**
     * Find money flows created between dates
     */
    @Query("{'createdAt': {'$gte': ?0, '$lte': ?1}}")
    List<MoneyFlow> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);

    /**
     * Find money flows by from entity
     */
    @Query("{'fromEntity': ?0}")
    List<MoneyFlow> findByFromEntity(String fromEntity);

    /**
     * Find money flows by to entity
     */
    @Query("{'toEntity': ?0}")
    List<MoneyFlow> findByToEntity(String toEntity);

    /**
     * Find money flows by booking ID and flow type
     */
    @Query("{'bookingId': ?0, 'flowType': ?1}")
    List<MoneyFlow> findByBookingIdAndFlowType(String bookingId, String flowType);

    /**
     * Find money flows by booking ID and status
     */
    @Query("{'bookingId': ?0, 'status': ?1}")
    List<MoneyFlow> findByBookingIdAndStatus(String bookingId, String status);

    /**
     * Count money flows by status
     */
    @Query(value = "{'status': ?0}", count = true)
    long countByStatus(String status);

    /**
     * Count money flows by flow type
     */
    @Query(value = "{'flowType': ?0}", count = true)
    long countByFlowType(String flowType);

    /**
     * Find latest money flows (ordered by creation date descending)
     */
    @Query(value = "{}", sort = "{'createdAt': -1}")
    List<MoneyFlow> findLatestMoneyFlows(org.springframework.data.domain.Pageable pageable);

    // ===== ADDITIONAL USEFUL QUERIES =====

    /**
     * Find money flows for traveler payments
     */
    @Query("{'fromEntity': 'TRAVELER', 'flowType': 'PAYMENT'}")
    List<MoneyFlow> findTravelerPayments();

    /**
     * Find platform commission flows
     */
    @Query("{'toEntity': 'PLATFORM', 'flowType': 'COMMISSION'}")
    List<MoneyFlow> findPlatformCommissions();

    /**
     * Find provider payouts
     */
    @Query("{'toEntity': 'PROVIDER', '$or': [{'flowType': 'CONFIRMATION_FEE'}, {'flowType': 'FINAL_PAYOUT'}]}")
    List<MoneyFlow> findProviderPayouts();

    /**
     * Find refund flows
     */
    @Query("{'flowType': 'REFUND'}")
    List<MoneyFlow> findRefunds();

    /**
     * Find money flows by amount range
     */
    @Query("{'amount': {'$gte': ?0, '$lte': ?1}}")
    List<MoneyFlow> findByAmountBetween(java.math.BigDecimal minAmount, java.math.BigDecimal maxAmount);

    /**
     * Find completed money flows
     */
    @Query("{'status': 'COMPLETED'}")
    List<MoneyFlow> findCompletedFlows();

    /**
     * Find pending money flows
     */
    @Query("{'status': 'PENDING'}")
    List<MoneyFlow> findPendingFlows();

    /**
     * Find money flows by description containing text
     */
    @Query("{'description': {'$regex': ?0, '$options': 'i'}}")
    List<MoneyFlow> findByDescriptionContaining(String searchText);
}