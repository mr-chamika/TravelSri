package com.example.student.services;

import com.example.student.model.Vehicle;
import com.example.student.model.Booking;
import com.example.student.repo.VehicleRepo;
import com.example.student.repo.BookingRepo;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class VehicleService {

    private static final Logger logger = LoggerFactory.getLogger(VehicleService.class);

    @Autowired
    private VehicleRepo vehicleRepo;

    @Autowired
    private BookingRepo bookingRepo;

    // Basic CRUD operations
    public Vehicle saveVehicle(Vehicle vehicle) {
        try {
            return vehicleRepo.save(vehicle);
        } catch (Exception e) {
            logger.error("Error saving vehicle", e);
            throw new RuntimeException("Failed to save vehicle", e);
        }
    }

    public Optional<Vehicle> getVehicleById(String id) {
        try {
            return vehicleRepo.findById(id);
        } catch (Exception e) {
            logger.error("Error finding vehicle by ID: {}", id, e);
            return Optional.empty();
        }
    }

    public List<Vehicle> getAllVehicles() {
        try {
            return vehicleRepo.findAll();
        } catch (Exception e) {
            logger.error("Error retrieving all vehicles", e);
            return List.of();
        }
    }

    public List<Vehicle> getVerifiedVehicles() {
        try {
            return vehicleRepo.findVerifiedVehicles();
        } catch (Exception e) {
            logger.error("Error retrieving verified vehicles", e);
            return List.of();
        }
    }

    // Search and filter methods
    public List<Vehicle> searchVehicles(String location, String language, Integer minSeats) {
        try {
            if (location == null) location = "";
            if (language == null) language = "";
            if (minSeats == null) minSeats = 1;

            return vehicleRepo.searchAvailableVehicles(location, language, minSeats);
        } catch (Exception e) {
            logger.error("Error searching vehicles with location: {}, language: {}, minSeats: {}",
                    location, language, minSeats, e);
            return List.of();
        }
    }

    public List<Vehicle> getVehiclesByCategory(String categoryId) {
        try {
            return vehicleRepo.findVehiclesByCategoryId(categoryId);
        } catch (Exception e) {
            logger.error("Error retrieving vehicles by category: {}", categoryId, e);
            return List.of();
        }
    }

    public List<Vehicle> getVehiclesByLocation(String location) {
        try {
            return vehicleRepo.findByLocationContainingIgnoreCase(location);
        } catch (Exception e) {
            logger.error("Error retrieving vehicles by location: {}", location, e);
            return List.of();
        }
    }

    public List<Vehicle> getVehiclesByLanguage(String language) {
        try {
            return vehicleRepo.findByLanguage(language);
        } catch (Exception e) {
            logger.error("Error retrieving vehicles by language: {}", language, e);
            return List.of();
        }
    }

    public List<Vehicle> getVehiclesByPriceRange(String priceType, int minPrice, int maxPrice) {
        try {
            if ("daily".equals(priceType)) {
                return vehicleRepo.findByDailyRatePriceBetween(minPrice, maxPrice);
            } else if ("km".equals(priceType)) {
                return vehicleRepo.findByPerKmPriceBetween(minPrice, maxPrice);
            }
            return List.of();
        } catch (Exception e) {
            logger.error("Error retrieving vehicles by price range: {} - {}", minPrice, maxPrice, e);
            return List.of();
        }
    }

    // Advanced filtering
    public List<Vehicle> getVehiclesWithFilters(String location, String language, String categoryId,
                                                Boolean hasAC, Integer minSeats) {
        try {
            return vehicleRepo.findVehiclesWithFilters(location, language, categoryId, hasAC, minSeats);
        } catch (Exception e) {
            logger.error("Error retrieving vehicles with filters", e);
            return List.of();
        }
    }

    // Availability checking
    public List<Vehicle> getAvailableVehicles(String location, String language, String startDate, String endDate) {
        try {
            // Get all vehicles matching location and language
            List<Vehicle> vehicles = vehicleRepo.findByLocationAndLanguage(location, language);

            // Filter out vehicles that are already booked for the requested dates
            return vehicles.stream()
                    .filter(vehicle -> isVehicleAvailable(vehicle.get_id(), startDate, endDate))
                    .collect(Collectors.toList());
        } catch (Exception e) {
            logger.error("Error checking vehicle availability", e);
            return List.of();
        }
    }

    // Check if a vehicle is available for given dates
    public boolean isVehicleAvailable(String vehicleId, String startDate, String endDate) {
        try {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
            LocalDateTime start = LocalDateTime.parse(startDate + "T00:00:00");
            LocalDateTime end = LocalDateTime.parse(endDate + "T23:59:59");

            // Find all confirmed bookings for this vehicle that overlap with requested dates
            List<Booking> conflictingBookings = bookingRepo.findByProviderId(vehicleId).stream()
                    .filter(booking -> "vehicle".equals(booking.getProviderType()))
                    .filter(booking -> "CONFIRMED".equals(booking.getStatus()) ||
                            "PENDING_PROVIDER_ACCEPTANCE".equals(booking.getStatus()))
                    .filter(booking -> booking.getServiceStartDate() != null && booking.getServiceEndDate() != null)
                    .filter(booking -> !(booking.getServiceEndDate().isBefore(start) ||
                            booking.getServiceStartDate().isAfter(end)))
                    .collect(Collectors.toList());

            return conflictingBookings.isEmpty();
        } catch (Exception e) {
            logger.error("Error checking vehicle availability for vehicle: {}", vehicleId, e);
            return false;
        }
    }

    // Owner-specific methods
    public List<Vehicle> getVehiclesByOwner(String ownerId) {
        try {
            return vehicleRepo.findByVehicleOwnerId(ownerId);
        } catch (Exception e) {
            logger.error("Error retrieving vehicles by owner: {}", ownerId, e);
            return List.of();
        }
    }

    // Statistics methods
    public long getTotalVehicleCount() {
        try {
            return vehicleRepo.count();
        } catch (Exception e) {
            logger.error("Error counting total vehicles", e);
            return 0;
        }
    }

    public long getVerifiedVehicleCount() {
        try {
            return vehicleRepo.countVerifiedVehicles();
        } catch (Exception e) {
            logger.error("Error counting verified vehicles", e);
            return 0;
        }
    }

    public long getPendingVehicleCount() {
        try {
            return vehicleRepo.countPendingVehicles();
        } catch (Exception e) {
            logger.error("Error counting pending vehicles", e);
            return 0;
        }
    }

    public long getVehicleCountByCategory(String categoryId) {
        try {
            return vehicleRepo.countVehiclesByCategory(categoryId);
        } catch (Exception e) {
            logger.error("Error counting vehicles by category: {}", categoryId, e);
            return 0;
        }
    }

    public long getVehicleCountByLocation(String location) {
        try {
            return vehicleRepo.countVehiclesByLocation(location);
        } catch (Exception e) {
            logger.error("Error counting vehicles by location: {}", location, e);
            return 0;
        }
    }

    // Utility methods
    public List<Vehicle> getTopRatedVehicles(int limit) {
        try {
            List<Vehicle> topRated = vehicleRepo.findTopRatedVehicles();
            return topRated.stream().limit(limit).collect(Collectors.toList());
        } catch (Exception e) {
            logger.error("Error retrieving top rated vehicles", e);
            return List.of();
        }
    }

    public List<Vehicle> getRecentlyAddedVehicles(int limit) {
        try {
            List<Vehicle> recent = vehicleRepo.findRecentlyAddedVehicles();
            return recent.stream().limit(limit).collect(Collectors.toList());
        } catch (Exception e) {
            logger.error("Error retrieving recently added vehicles", e);
            return List.of();
        }
    }

    public Vehicle updateVehicle(Vehicle vehicle) {
        try {
            return vehicleRepo.save(vehicle);
        } catch (Exception e) {
            logger.error("Error updating vehicle: {}", vehicle.get_id(), e);
            throw new RuntimeException("Failed to update vehicle", e);
        }
    }

    public void deleteVehicle(String vehicleId) {
        try {
            vehicleRepo.deleteById(vehicleId);
        } catch (Exception e) {
            logger.error("Error deleting vehicle: {}", vehicleId, e);
            throw new RuntimeException("Failed to delete vehicle", e);
        }
    }

    // Validation methods
    public boolean isVehicleOwner(String vehicleId, String ownerId) {
        try {
            Optional<Vehicle> vehicle = vehicleRepo.findById(vehicleId);
            return vehicle.isPresent() && ownerId.equals(vehicle.get().getVehicleOwnerId());
        } catch (Exception e) {
            logger.error("Error checking vehicle ownership", e);
            return false;
        }
    }

    public boolean isVehicleVerified(String vehicleId) {
        try {
            Optional<Vehicle> vehicle = vehicleRepo.findById(vehicleId);
            return vehicle.isPresent() && "verified".equals(vehicle.get().getVerified());
        } catch (Exception e) {
            logger.error("Error checking vehicle verification status", e);
            return false;
        }
    }

    // Business logic for pricing calculations
    public double calculateBookingPrice(Vehicle vehicle, String startDate, String endDate, boolean isOneWay) {
        try {
            if (vehicle.isDailyRate()) {
                long days = calculateDaysBetween(startDate, endDate);
                if (days == 0) days = 1; // Minimum 1 day
                return vehicle.getDailyRatePrice() * days;
            } else if (vehicle.isPerKm()) {
                // For per km, you would need distance calculation
                // This is a simplified version - in reality you'd integrate with a maps API
                return vehicle.getPerKmPrice() * 100; // Assuming 100km average
            }
            return 0.0;
        } catch (Exception e) {
            logger.error("Error calculating booking price", e);
            return 0.0;
        }
    }

    private long calculateDaysBetween(String startDate, String endDate) {
        try {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
            java.time.LocalDate start = java.time.LocalDate.parse(startDate, formatter);
            java.time.LocalDate end = java.time.LocalDate.parse(endDate, formatter);
            return java.time.temporal.ChronoUnit.DAYS.between(start, end);
        } catch (Exception e) {
            logger.error("Error calculating days between dates", e);
            return 1; // Default to 1 day
        }
    }

    // Get booking history for a vehicle
    public List<Booking> getVehicleBookingHistory(String vehicleId) {
        try {
            return bookingRepo.findByProviderId(vehicleId).stream()
                    .filter(booking -> "vehicle".equals(booking.getProviderType()))
                    .collect(Collectors.toList());
        } catch (Exception e) {
            logger.error("Error retrieving booking history for vehicle: {}", vehicleId, e);
            return List.of();
        }
    }

    // Get upcoming bookings for a vehicle
    public List<Booking> getVehicleUpcomingBookings(String vehicleId) {
        try {
            LocalDateTime now = LocalDateTime.now();
            return bookingRepo.findByProviderId(vehicleId).stream()
                    .filter(booking -> "vehicle".equals(booking.getProviderType()))
                    .filter(booking -> "CONFIRMED".equals(booking.getStatus()))
                    .filter(booking -> booking.getServiceStartDate() != null &&
                            booking.getServiceStartDate().isAfter(now))
                    .collect(Collectors.toList());
        } catch (Exception e) {
            logger.error("Error retrieving upcoming bookings for vehicle: {}", vehicleId, e);
            return List.of();
        }
    }

    // Vehicle performance metrics
    public java.util.Map<String, Object> getVehicleStatistics(String vehicleId) {
        try {
            List<Booking> allBookings = getVehicleBookingHistory(vehicleId);

            java.util.Map<String, Object> stats = new java.util.HashMap<>();
            stats.put("totalBookings", allBookings.size());
            stats.put("completedBookings", allBookings.stream()
                    .filter(b -> "COMPLETED".equals(b.getStatus()))
                    .count());
            stats.put("cancelledBookings", allBookings.stream()
                    .filter(b -> b.getStatus() != null && b.getStatus().contains("CANCELLED"))
                    .count());
            stats.put("pendingBookings", allBookings.stream()
                    .filter(b -> "PENDING_PROVIDER_ACCEPTANCE".equals(b.getStatus()))
                    .count());

            // Calculate total earnings
            java.math.BigDecimal totalEarnings = allBookings.stream()
                    .filter(b -> "COMPLETED".equals(b.getStatus()))
                    .map(Booking::getTotalAmount)
                    .filter(java.util.Objects::nonNull)
                    .reduce(java.math.BigDecimal.ZERO, java.math.BigDecimal::add);
            stats.put("totalEarnings", totalEarnings);

            // Calculate average rating (if you have rating data)
            Optional<Vehicle> vehicle = getVehicleById(vehicleId);
            if (vehicle.isPresent()) {
                double avgRating = vehicle.get().getReviewCount() > 0 ?
                        (double) vehicle.get().getStars() / vehicle.get().getReviewCount() : 0.0;
                stats.put("averageRating", avgRating);
                stats.put("totalReviews", vehicle.get().getReviewCount());
            }

            return stats;
        } catch (Exception e) {
            logger.error("Error calculating vehicle statistics", e);
            return new java.util.HashMap<>();
        }
    }
}