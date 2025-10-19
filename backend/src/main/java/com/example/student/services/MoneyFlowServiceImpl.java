package com.example.student.services;

import com.example.student.model.MoneyFlow;
import com.example.student.repo.MoneyFlowRepo; // Updated to use your repo name
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

/**
 * Service implementation for managing money flow operations
 * Updated to use MoneyFlowRepo instead of MoneyFlowRepository
 */
@Service
public class MoneyFlowServiceImpl implements IMoneyFlowService {

    private static final Logger logger = LoggerFactory.getLogger(MoneyFlowServiceImpl.class);

    @Autowired
    private MoneyFlowRepo moneyFlowRepo; // Updated to use your repo name

    @Override
    public MoneyFlow save(MoneyFlow moneyFlow) {
        try {
            logger.info("Saving money flow: {} -> {}, Amount: {}",
                    moneyFlow.getFromEntity(), moneyFlow.getToEntity(), moneyFlow.getAmount());
            return moneyFlowRepo.save(moneyFlow);
        } catch (Exception e) {
            logger.error("Error saving money flow", e);
            throw e;
        }
    }

    @Override
    public Optional<MoneyFlow> findById(String id) {
        try {
            return moneyFlowRepo.findById(id);
        } catch (Exception e) {
            logger.error("Error finding money flow by ID: {}", id, e);
            throw e;
        }
    }

    @Override
    public List<MoneyFlow> findByBookingId(String bookingId) {
        try {
            logger.info("Finding money flows for booking: {}", bookingId);
            return moneyFlowRepo.findByBookingId(bookingId);
        } catch (Exception e) {
            logger.error("Error finding money flows for booking: {}", bookingId, e);
            throw e;
        }
    }

    @Override
    public List<MoneyFlow> findByFromEntityAndFromEntityId(String fromEntity, String fromEntityId) {
        try {
            return moneyFlowRepo.findByFromEntityAndFromEntityId(fromEntity, fromEntityId);
        } catch (Exception e) {
            logger.error("Error finding money flows from entity: {} {}", fromEntity, fromEntityId, e);
            throw e;
        }
    }

    @Override
    public List<MoneyFlow> findByToEntityAndToEntityId(String toEntity, String toEntityId) {
        try {
            return moneyFlowRepo.findByToEntityAndToEntityId(toEntity, toEntityId);
        } catch (Exception e) {
            logger.error("Error finding money flows to entity: {} {}", toEntity, toEntityId, e);
            throw e;
        }
    }

    @Override
    public List<MoneyFlow> findByFlowType(String flowType) {
        try {
            return moneyFlowRepo.findByFlowType(flowType);
        } catch (Exception e) {
            logger.error("Error finding money flows by type: {}", flowType, e);
            throw e;
        }
    }

    @Override
    public List<MoneyFlow> findByStatus(String status) {
        try {
            return moneyFlowRepo.findByStatus(status);
        } catch (Exception e) {
            logger.error("Error finding money flows by status: {}", status, e);
            throw e;
        }
    }

    @Override
    public List<MoneyFlow> findByTransactionReference(String transactionReference) {
        try {
            return moneyFlowRepo.findByTransactionReference(transactionReference);
        } catch (Exception e) {
            logger.error("Error finding money flows by transaction reference: {}", transactionReference, e);
            throw e;
        }
    }

    @Override
    public List<MoneyFlow> getTravelerMoneyFlows(String travelerId) {
        try {
            logger.info("Getting money flows for traveler: {}", travelerId);
            return moneyFlowRepo.findByFromEntityAndFromEntityId("TRAVELER", travelerId);
        } catch (Exception e) {
            logger.error("Error getting traveler money flows: {}", travelerId, e);
            throw e;
        }
    }

    @Override
    public List<MoneyFlow> getProviderMoneyFlows(String providerId) {
        try {
            logger.info("Getting money flows for provider: {}", providerId);
            return moneyFlowRepo.findByToEntityAndToEntityId("PROVIDER", providerId);
        } catch (Exception e) {
            logger.error("Error getting provider money flows: {}", providerId, e);
            throw e;
        }
    }

    @Override
    public List<MoneyFlow> getPlatformRevenueFlows() {
        try {
            logger.info("Getting platform revenue flows");
            return moneyFlowRepo.findByFlowType("COMMISSION");
        } catch (Exception e) {
            logger.error("Error getting platform revenue flows", e);
            throw e;
        }
    }

    @Override
    public void deleteById(String id) {
        try {
            logger.info("Deleting money flow: {}", id);
            moneyFlowRepo.deleteById(id);
        } catch (Exception e) {
            logger.error("Error deleting money flow: {}", id, e);
            throw e;
        }
    }

    @Override
    public BigDecimal getTotalAmountByFlowTypeAndEntity(String flowType, String entityType, String entityId) {
        try {
            List<MoneyFlow> flows;
            if ("FROM".equals(entityType)) {
                flows = moneyFlowRepo.findByFlowTypeAndFromEntityId(flowType, entityId);
            } else {
                flows = moneyFlowRepo.findByFlowTypeAndToEntityId(flowType, entityId);
            }

            return flows.stream()
                    .map(MoneyFlow::getAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
        } catch (Exception e) {
            logger.error("Error calculating total amount for flow type: {} entity: {} {}",
                    flowType, entityType, entityId, e);
            return BigDecimal.ZERO;
        }
    }
}