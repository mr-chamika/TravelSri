package com.travelsri.controller;

import com.travelsri.dto.BookingStats;
import com.travelsri.dto.EarningStats;
import com.travelsri.dto.EarningsBreakdown;
import com.travelsri.dto.OccupancyStats;
import com.travelsri.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/**
 * REST Controller for providing chart data to the frontend
 */
@RestController
@RequestMapping("/api/charts")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"}) // Add your frontend URLs
public class ChartDataController {

    private final BookingService bookingService;

    @Autowired
    public ChartDataController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    /**
     * Get monthly booking statistics
     * @param hotelId The hotel ID
     * @param startDate Optional start date filter
     * @param endDate Optional end date filter
     * @return List of booking statistics
     */
    @GetMapping("/monthly-bookings")
    public ResponseEntity<List<BookingStats>> getMonthlyBookingStats(
            @RequestParam Long hotelId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        
        List<BookingStats> stats = bookingService.getMonthlyBookingStats(hotelId, startDate, endDate);
        return ResponseEntity.ok(stats);
    }

    /**
     * Get earnings statistics
     * @param hotelId The hotel ID
     * @param startDate Optional start date filter
     * @param endDate Optional end date filter
     * @return List of earning statistics
     */
    @GetMapping("/earnings")
    public ResponseEntity<List<EarningStats>> getEarningStats(
            @RequestParam Long hotelId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        
        List<EarningStats> stats = bookingService.getEarningStats(hotelId, startDate, endDate);
        return ResponseEntity.ok(stats);
    }

    /**
     * Get occupancy rate statistics
     * @param hotelId The hotel ID
     * @param startDate Optional start date filter
     * @param endDate Optional end date filter
     * @return List of occupancy statistics
     */
    @GetMapping("/occupancy")
    public ResponseEntity<List<OccupancyStats>> getOccupancyStats(
            @RequestParam Long hotelId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        
        List<OccupancyStats> stats = bookingService.getOccupancyStats(hotelId, startDate, endDate);
        return ResponseEntity.ok(stats);
    }

    /**
     * Get earnings breakdown data
     * @param hotelId The hotel ID
     * @param startDate Optional start date filter
     * @param endDate Optional end date filter
     * @return Earnings breakdown data
     */
    @GetMapping("/earnings-breakdown")
    public ResponseEntity<List<EarningsBreakdown>> getEarningsBreakdown(
            @RequestParam Long hotelId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        
        List<EarningsBreakdown> breakdown = bookingService.getEarningsBreakdown(hotelId, startDate, endDate);
        return ResponseEntity.ok(breakdown);
    }
}