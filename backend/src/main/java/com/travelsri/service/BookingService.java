package com.travelsri.service;

import com.travelsri.dto.BookingStats;
import com.travelsri.dto.EarningStats;
import com.travelsri.dto.EarningsBreakdown;
import com.travelsri.dto.OccupancyStats;

import java.time.LocalDate;
import java.util.List;

/**
 * Service interface for booking related operations
 */
public interface BookingService {
    
    /**
     * Get monthly booking statistics
     * @param hotelId The hotel ID
     * @param startDate Optional start date filter
     * @param endDate Optional end date filter
     * @return List of booking statistics
     */
    List<BookingStats> getMonthlyBookingStats(Long hotelId, LocalDate startDate, LocalDate endDate);
    
    /**
     * Get earnings statistics
     * @param hotelId The hotel ID
     * @param startDate Optional start date filter
     * @param endDate Optional end date filter
     * @return List of earning statistics
     */
    List<EarningStats> getEarningStats(Long hotelId, LocalDate startDate, LocalDate endDate);
    
    /**
     * Get occupancy rate statistics
     * @param hotelId The hotel ID
     * @param startDate Optional start date filter
     * @param endDate Optional end date filter
     * @return List of occupancy statistics
     */
    List<OccupancyStats> getOccupancyStats(Long hotelId, LocalDate startDate, LocalDate endDate);
    
    /**
     * Get earnings breakdown data
     * @param hotelId The hotel ID
     * @param startDate Optional start date filter
     * @param endDate Optional end date filter
     * @return List of earnings breakdown
     */
    List<EarningsBreakdown> getEarningsBreakdown(Long hotelId, LocalDate startDate, LocalDate endDate);
}