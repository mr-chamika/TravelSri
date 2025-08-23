package com.example.student.services;

import com.example.student.model.TravelerWallet;
import com.example.student.model.RefundHistory;
import com.example.student.repo.TravelerWalletRepo; // Updated to use your repo name
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Service implementation for managing traveler wallet operations
 * Updated to use TravelerWalletRepo instead of TravelerWalletRepository
 */
@Service
public class TravelerWalletServiceImpl implements ITravelerWalletService {

    private static final Logger logger = LoggerFactory.getLogger(TravelerWalletServiceImpl.class);

    @Autowired
    private TravelerWalletRepo travelerWalletRepo; // Updated to use your repo name

    @Override
    public TravelerWallet save(TravelerWallet wallet) {
        try {
            logger.info("Saving traveler wallet for: {}", wallet.getTravelerId());
            wallet.setLastUpdated(LocalDateTime.now());
            return travelerWalletRepo.save(wallet);
        } catch (Exception e) {
            logger.error("Error saving traveler wallet for: {}", wallet.getTravelerId(), e);
            throw e;
        }
    }

    @Override
    public Optional<TravelerWallet> findById(String id) {
        try {
            return travelerWalletRepo.findById(id);
        } catch (Exception e) {
            logger.error("Error finding wallet by ID: {}", id, e);
            throw e;
        }
    }

    @Override
    public Optional<TravelerWallet> findByTravelerId(String travelerId) {
        try {
            return travelerWalletRepo.findByTravelerId(travelerId);
        } catch (Exception e) {
            logger.error("Error finding wallet for traveler: {}", travelerId, e);
            throw e;
        }
    }

    @Override
    public TravelerWallet getOrCreateWallet(String travelerId) {
        try {
            logger.info("Getting or creating wallet for traveler: {}", travelerId);

            Optional<TravelerWallet> existingWallet = findByTravelerId(travelerId);

            if (existingWallet.isPresent()) {
                logger.info("Found existing wallet for traveler: {}", travelerId);
                return existingWallet.get();
            }

            // Create new wallet
            logger.info("Creating new wallet for traveler: {}", travelerId);
            TravelerWallet newWallet = new TravelerWallet();
            newWallet.setTravelerId(travelerId);
            newWallet.setTotalSpent(BigDecimal.ZERO);
            newWallet.setTotalRefunded(BigDecimal.ZERO);
            newWallet.setCurrentBalance(BigDecimal.ZERO);
            newWallet.setRefundHistory(new ArrayList<>());
            newWallet.setLastUpdated(LocalDateTime.now());

            return save(newWallet);
        } catch (Exception e) {
            logger.error("Error getting or creating wallet for traveler: {}", travelerId, e);
            throw e;
        }
    }

    @Override
    public TravelerWallet addSpending(String travelerId, BigDecimal amount, String bookingId) {
        try {
            logger.info("Adding spending of {} for traveler: {} (booking: {})", amount, travelerId, bookingId);

            TravelerWallet wallet = getOrCreateWallet(travelerId);

            if (wallet.getTotalSpent() == null) {
                wallet.setTotalSpent(BigDecimal.ZERO);
            }

            wallet.setTotalSpent(wallet.getTotalSpent().add(amount));
            wallet.setLastUpdated(LocalDateTime.now());

            logger.info("Updated total spent for traveler {}: {}", travelerId, wallet.getTotalSpent());

            return save(wallet);
        } catch (Exception e) {
            logger.error("Error adding spending for traveler: {}", travelerId, e);
            throw e;
        }
    }

    @Override
    public TravelerWallet addRefund(String travelerId, BigDecimal refundAmount, String bookingId,
                                    String refundReason, String refundType) {
        try {
            logger.info("Adding refund of {} for traveler: {} (booking: {})", refundAmount, travelerId, bookingId);

            TravelerWallet wallet = getOrCreateWallet(travelerId);

            // Update total refunded
            if (wallet.getTotalRefunded() == null) {
                wallet.setTotalRefunded(BigDecimal.ZERO);
            }
            wallet.setTotalRefunded(wallet.getTotalRefunded().add(refundAmount));

            // Update current balance if applicable
            if (wallet.getCurrentBalance() == null) {
                wallet.setCurrentBalance(BigDecimal.ZERO);
            }
            wallet.setCurrentBalance(wallet.getCurrentBalance().add(refundAmount));

            // Add to refund history
            RefundHistory refundHistory = new RefundHistory(bookingId, refundAmount, refundReason, refundType);
            refundHistory.setRefundId("REF_" + System.currentTimeMillis());
            refundHistory.setStatus("COMPLETED");
            refundHistory.setProcessedDate(LocalDateTime.now());

            if (wallet.getRefundHistory() == null) {
                wallet.setRefundHistory(new ArrayList<>());
            }
            wallet.getRefundHistory().add(refundHistory);

            wallet.setLastUpdated(LocalDateTime.now());

            logger.info("Updated total refunded for traveler {}: {}", travelerId, wallet.getTotalRefunded());

            return save(wallet);
        } catch (Exception e) {
            logger.error("Error adding refund for traveler: {}", travelerId, e);
            throw e;
        }
    }

    @Override
    public TravelerWallet updateBalance(String travelerId, BigDecimal newBalance) {
        try {
            logger.info("Updating balance for traveler {}: {}", travelerId, newBalance);

            TravelerWallet wallet = getOrCreateWallet(travelerId);
            wallet.setCurrentBalance(newBalance);
            wallet.setLastUpdated(LocalDateTime.now());

            return save(wallet);
        } catch (Exception e) {
            logger.error("Error updating balance for traveler: {}", travelerId, e);
            throw e;
        }
    }

    @Override
    public BigDecimal getTotalSpentByTraveler(String travelerId) {
        try {
            Optional<TravelerWallet> wallet = findByTravelerId(travelerId);
            if (wallet.isPresent() && wallet.get().getTotalSpent() != null) {
                return wallet.get().getTotalSpent();
            }
            return BigDecimal.ZERO;
        } catch (Exception e) {
            logger.error("Error getting total spent for traveler: {}", travelerId, e);
            return BigDecimal.ZERO;
        }
    }

    @Override
    public BigDecimal getTotalRefundedToTraveler(String travelerId) {
        try {
            Optional<TravelerWallet> wallet = findByTravelerId(travelerId);
            if (wallet.isPresent() && wallet.get().getTotalRefunded() != null) {
                return wallet.get().getTotalRefunded();
            }
            return BigDecimal.ZERO;
        } catch (Exception e) {
            logger.error("Error getting total refunded for traveler: {}", travelerId, e);
            return BigDecimal.ZERO;
        }
    }

    @Override
    public List<RefundHistory> getRefundHistory(String travelerId) {
        try {
            Optional<TravelerWallet> wallet = findByTravelerId(travelerId);
            if (wallet.isPresent() && wallet.get().getRefundHistory() != null) {
                return wallet.get().getRefundHistory();
            }
            return new ArrayList<>();
        } catch (Exception e) {
            logger.error("Error getting refund history for traveler: {}", travelerId, e);
            return new ArrayList<>();
        }
    }

    @Override
    public TravelerWallet addRefundHistory(String travelerId, RefundHistory refundHistory) {
        try {
            logger.info("Adding refund history entry for traveler: {}", travelerId);

            TravelerWallet wallet = getOrCreateWallet(travelerId);

            if (wallet.getRefundHistory() == null) {
                wallet.setRefundHistory(new ArrayList<>());
            }

            wallet.getRefundHistory().add(refundHistory);
            wallet.setLastUpdated(LocalDateTime.now());

            return save(wallet);
        } catch (Exception e) {
            logger.error("Error adding refund history for traveler: {}", travelerId, e);
            throw e;
        }
    }

    @Override
    public boolean hasSufficientBalance(String travelerId, BigDecimal amount) {
        try {
            Optional<TravelerWallet> wallet = findByTravelerId(travelerId);
            if (wallet.isPresent() && wallet.get().getCurrentBalance() != null) {
                return wallet.get().getCurrentBalance().compareTo(amount) >= 0;
            }
            return false;
        } catch (Exception e) {
            logger.error("Error checking balance for traveler: {}", travelerId, e);
            return false;
        }
    }

    @Override
    public Map<String, Object> getWalletStatistics(String travelerId) {
        try {
            logger.info("Getting wallet statistics for traveler: {}", travelerId);

            Map<String, Object> stats = new HashMap<>();
            Optional<TravelerWallet> wallet = findByTravelerId(travelerId);

            if (wallet.isPresent()) {
                TravelerWallet w = wallet.get();
                stats.put("travelerId", travelerId);
                stats.put("totalSpent", w.getTotalSpent() != null ? w.getTotalSpent() : BigDecimal.ZERO);
                stats.put("totalRefunded", w.getTotalRefunded() != null ? w.getTotalRefunded() : BigDecimal.ZERO);
                stats.put("currentBalance", w.getCurrentBalance() != null ? w.getCurrentBalance() : BigDecimal.ZERO);
                stats.put("refundCount", w.getRefundHistory() != null ? w.getRefundHistory().size() : 0);
                stats.put("lastUpdated", w.getLastUpdated());

                // Calculate net spending (total spent - total refunded)
                BigDecimal netSpending = (w.getTotalSpent() != null ? w.getTotalSpent() : BigDecimal.ZERO)
                        .subtract(w.getTotalRefunded() != null ? w.getTotalRefunded() : BigDecimal.ZERO);
                stats.put("netSpending", netSpending);

                stats.put("hasWallet", true);
            } else {
                stats.put("travelerId", travelerId);
                stats.put("totalSpent", BigDecimal.ZERO);
                stats.put("totalRefunded", BigDecimal.ZERO);
                stats.put("currentBalance", BigDecimal.ZERO);
                stats.put("refundCount", 0);
                stats.put("netSpending", BigDecimal.ZERO);
                stats.put("hasWallet", false);
            }

            return stats;
        } catch (Exception e) {
            logger.error("Error getting wallet statistics for traveler: {}", travelerId, e);
            throw e;
        }
    }

    @Override
    public void deleteById(String id) {
        try {
            logger.info("Deleting wallet: {}", id);
            travelerWalletRepo.deleteById(id);
        } catch (Exception e) {
            logger.error("Error deleting wallet: {}", id, e);
            throw e;
        }
    }

    @Override
    public List<TravelerWallet> getWalletsWithActivityInDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        try {
            logger.info("Getting wallets with activity between {} and {}", startDate, endDate);
            return travelerWalletRepo.findByLastUpdatedBetween(startDate, endDate);
        } catch (Exception e) {
            logger.error("Error getting wallets with activity in date range", e);
            throw e;
        }
    }
}