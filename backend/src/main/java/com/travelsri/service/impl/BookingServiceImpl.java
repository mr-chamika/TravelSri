package com.travelsri.service.impl;

import com.travelsri.dto.BookingStats;
import com.travelsri.dto.EarningStats;
import com.travelsri.dto.EarningsBreakdown;
import com.travelsri.dto.OccupancyStats;
import com.travelsri.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Implementation of the BookingService interface
 */
@Service
public class BookingServiceImpl implements BookingService {

    private final JdbcTemplate jdbcTemplate;
    
    @Autowired
    public BookingServiceImpl(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public List<BookingStats> getMonthlyBookingStats(Long hotelId, LocalDate startDate, LocalDate endDate) {
        // In a production environment, this would query the database using jdbcTemplate
        // For demonstration purposes, we'll return sample data
        
        List<BookingStats> stats = new ArrayList<>();
        
        // If real implementation:
        // String sql = "SELECT EXTRACT(MONTH FROM check_in_date) as month, " +
        //              "COUNT(*) as bookings, " +
        //              "SUM(total_amount) as revenue, " +
        //              "AVG(occupancy_rate) as occupancy_rate " +
        //              "FROM bookings " +
        //              "WHERE hotel_id = ? " +
        //              "AND check_in_date BETWEEN ? AND ? " +
        //              "GROUP BY EXTRACT(MONTH FROM check_in_date) " +
        //              "ORDER BY month";
        
        // List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql, hotelId, startDate, endDate);
        
        // Sample data for demonstration
        stats.add(new BookingStats("May", 132, 19750, 78));
        stats.add(new BookingStats("Jun", 98, 15200, 62));
        stats.add(new BookingStats("Jul", 121, 18300, 75));
        stats.add(new BookingStats("Aug", 78, 12450, 42));
        stats.add(new BookingStats("Sep", 145, 22800, 88));
        stats.add(new BookingStats("Oct", 135, 19850, 79));
        stats.add(new BookingStats("Nov", 137, 20200, 80));
        stats.add(new BookingStats("Dec", 139, 22450, 82));
        stats.add(new BookingStats("Jan", 148, 24890, 90));
        stats.add(new BookingStats("Feb", 143, 23700, 85));
        
        return stats;
    }

    @Override
    public List<EarningStats> getEarningStats(Long hotelId, LocalDate startDate, LocalDate endDate) {
        // In a production environment, this would query the database
        // For demonstration purposes, we'll return sample data
        
        List<EarningStats> stats = new ArrayList<>();
        
        // Sample data for demonstration
        stats.add(new EarningStats("May", 42500, 14));
        stats.add(new EarningStats("Jun", 35400, 12));
        stats.add(new EarningStats("Jul", 48200, 16));
        stats.add(new EarningStats("Aug", 25350, 8));
        stats.add(new EarningStats("Sep", 45700, 15));
        stats.add(new EarningStats("Oct", 44300, 14));
        stats.add(new EarningStats("Nov", 42800, 14));
        stats.add(new EarningStats("Dec", 46200, 15));
        stats.add(new EarningStats("Jan", 47500, 16));
        stats.add(new EarningStats("Feb", 39800, 13));
        
        return stats;
    }

    @Override
    public List<OccupancyStats> getOccupancyStats(Long hotelId, LocalDate startDate, LocalDate endDate) {
        // In a production environment, this would query the database
        // For demonstration purposes, we'll return sample data
        
        List<OccupancyStats> stats = new ArrayList<>();
        
        // Sample data for demonstration
        stats.add(new OccupancyStats("May", 78, 100, 78));
        stats.add(new OccupancyStats("Jun", 62, 100, 62));
        stats.add(new OccupancyStats("Jul", 75, 100, 75));
        stats.add(new OccupancyStats("Aug", 42, 100, 42));
        stats.add(new OccupancyStats("Sep", 88, 100, 88));
        stats.add(new OccupancyStats("Oct", 79, 100, 79));
        stats.add(new OccupancyStats("Nov", 80, 100, 80));
        stats.add(new OccupancyStats("Dec", 82, 100, 82));
        stats.add(new OccupancyStats("Jan", 90, 100, 90));
        stats.add(new OccupancyStats("Feb", 85, 100, 85));
        
        return stats;
    }

    @Override
    public List<EarningsBreakdown> getEarningsBreakdown(Long hotelId, LocalDate startDate, LocalDate endDate) {
        // In a production environment, this would query the database
        // For demonstration purposes, we'll return sample data
        
        List<EarningsBreakdown> breakdown = new ArrayList<>();
        
        // Sample data for demonstration
        breakdown.add(new EarningsBreakdown("Room Bookings", 45200, 80));
        breakdown.add(new EarningsBreakdown("Additional Services", 8450, 15));
        breakdown.add(new EarningsBreakdown("Special Packages", 2604, 5));
        
        return breakdown;
    }
}