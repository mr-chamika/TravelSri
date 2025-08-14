package com.example.student.services;

import com.example.student.model.MoneyFlow;
import java.util.List;
import java.util.Optional;

/**
 * Service interface for managing money flow operations
 */
public interface IMoneyFlowService {

    /**
     * Save a money flow record
     */
    MoneyFlow save(MoneyFlow moneyFlow);

    /**
     * Find money flow by ID
     */
    Optional<MoneyFlow> findById(String id);

    /**
     * Find all money flows for a specific booking
     */
    List<MoneyFlow> findByBookingId(String bookingId);

    /**
     * Find money flows from a specific entity
     */
    List<MoneyFlow> findByFromEntityAndFromEntityId(String fromEntity, String fromEntityId);

    /**
     * Find money flows to a specific entity
     */
    List<MoneyFlow> findByToEntityAndToEntityId(String toEntity, String toEntityId);

    /**
     * Find money flows by type
     */
    List<MoneyFlow> findByFlowType(String flowType);

    /**
     * Find money flows by status
     */
    List<MoneyFlow> findByStatus(String status);

    /**
     * Find money flows by transaction reference
     */
    List<MoneyFlow> findByTransactionReference(String transactionReference);

    /**
     * Get all money flows for a traveler
     */
    List<MoneyFlow> getTravelerMoneyFlows(String travelerId);

    /**
     * Get all money flows for a provider
     */
    List<MoneyFlow> getProviderMoneyFlows(String providerId);

    /**
     * Get platform revenue flows
     */
    List<MoneyFlow> getPlatformRevenueFlows();

    /**
     * Delete money flow by ID
     */
    void deleteById(String id);

    /**
     * Get total amount by flow type and entity
     */
    java.math.BigDecimal getTotalAmountByFlowTypeAndEntity(String flowType, String entityType, String entityId);
}