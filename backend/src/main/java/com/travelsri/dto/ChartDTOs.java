package com.travelsri.dto;

import java.time.YearMonth;

/**
 * Data Transfer Object for booking statistics
 */
public class BookingStats {
    private String month;
    private int bookings;
    private double revenue;
    private int occupancyRate;

    public BookingStats() {
    }

    public BookingStats(String month, int bookings, double revenue, int occupancyRate) {
        this.month = month;
        this.bookings = bookings;
        this.revenue = revenue;
        this.occupancyRate = occupancyRate;
    }

    // Getters and setters
    public String getMonth() {
        return month;
    }

    public void setMonth(String month) {
        this.month = month;
    }

    public int getBookings() {
        return bookings;
    }

    public void setBookings(int bookings) {
        this.bookings = bookings;
    }

    public double getRevenue() {
        return revenue;
    }

    public void setRevenue(double revenue) {
        this.revenue = revenue;
    }

    public int getOccupancyRate() {
        return occupancyRate;
    }

    public void setOccupancyRate(int occupancyRate) {
        this.occupancyRate = occupancyRate;
    }
}

/**
 * Data Transfer Object for earning statistics
 */
public class EarningStats {
    private String month;
    private double amount;
    private int bookingCount;

    public EarningStats() {
    }

    public EarningStats(String month, double amount, int bookingCount) {
        this.month = month;
        this.amount = amount;
        this.bookingCount = bookingCount;
    }

    // Getters and setters
    public String getMonth() {
        return month;
    }

    public void setMonth(String month) {
        this.month = month;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public int getBookingCount() {
        return bookingCount;
    }

    public void setBookingCount(int bookingCount) {
        this.bookingCount = bookingCount;
    }
}

/**
 * Data Transfer Object for occupancy statistics
 */
public class OccupancyStats {
    private String month;
    private int occupancyRate;
    private int totalRooms;
    private int occupiedRooms;

    public OccupancyStats() {
    }

    public OccupancyStats(String month, int occupancyRate, int totalRooms, int occupiedRooms) {
        this.month = month;
        this.occupancyRate = occupancyRate;
        this.totalRooms = totalRooms;
        this.occupiedRooms = occupiedRooms;
    }

    // Getters and setters
    public String getMonth() {
        return month;
    }

    public void setMonth(String month) {
        this.month = month;
    }

    public int getOccupancyRate() {
        return occupancyRate;
    }

    public void setOccupancyRate(int occupancyRate) {
        this.occupancyRate = occupancyRate;
    }

    public int getTotalRooms() {
        return totalRooms;
    }

    public void setTotalRooms(int totalRooms) {
        this.totalRooms = totalRooms;
    }

    public int getOccupiedRooms() {
        return occupiedRooms;
    }

    public void setOccupiedRooms(int occupiedRooms) {
        this.occupiedRooms = occupiedRooms;
    }
}

/**
 * Data Transfer Object for earnings breakdown
 */
public class EarningsBreakdown {
    private String category;
    private double amount;
    private int percentage;

    public EarningsBreakdown() {
    }

    public EarningsBreakdown(String category, double amount, int percentage) {
        this.category = category;
        this.amount = amount;
        this.percentage = percentage;
    }

    // Getters and setters
    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public int getPercentage() {
        return percentage;
    }

    public void setPercentage(int percentage) {
        this.percentage = percentage;
    }
}