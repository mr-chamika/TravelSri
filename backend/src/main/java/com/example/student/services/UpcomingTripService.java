package com.example.student.services;

import com.example.student.model.UpcomingTrip;
import com.example.student.repo.UpcomingTripRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class UpcomingTripService implements IUpcomingTripService {
    
    @Autowired
    private UpcomingTripRepo upcomingTripRepo;

    @Override
    public UpcomingTrip createUpcomingTrip(UpcomingTrip upcomingTrip) {
        try {
            if (upcomingTrip == null) {
                throw new IllegalArgumentException("UpcomingTrip cannot be null");
            }
            
            // Set audit fields
            upcomingTrip.setCreatedAt(LocalDateTime.now());
            upcomingTrip.setUpdatedAt(LocalDateTime.now());
            upcomingTrip.setConfirmationDate(LocalDateTime.now());
            
            // Set default statuses if not provided
            if (upcomingTrip.getTripStatus() == null) {
                upcomingTrip.setTripStatus("Confirmed");
            }
            if (upcomingTrip.getBookingStatus() == null) {
                upcomingTrip.setBookingStatus("Booked");
            }
            if (upcomingTrip.getPaymentStatus() == null) {
                upcomingTrip.setPaymentStatus("Pending");
            }
            
            // Calculate costs if not provided
            if (upcomingTrip.getTotalTripCost() == null) {
                Double calculatedCost = upcomingTrip.calculateTotalTripCost();
                upcomingTrip.setTotalTripCost(calculatedCost);
                System.out.println("Calculated total trip cost: " + calculatedCost);
            }
            
            if (upcomingTrip.getTotalPricePerPerson() == null) {
                Double calculatedPricePerPerson = upcomingTrip.calculateTotalPricePerPerson();
                upcomingTrip.setTotalPricePerPerson(calculatedPricePerPerson);
                System.out.println("Calculated price per person: " + calculatedPricePerPerson);
            }
            
            // Log the trip being created
            System.out.println("=== CREATING UPCOMING TRIP ===");
            System.out.println("Trip ID: " + upcomingTrip.getId());
            System.out.println("Original Pending Trip ID: " + upcomingTrip.getOriginalPendingTripId());
            System.out.println("Title: " + upcomingTrip.getTitle());
            System.out.println("Selected Hotel ID: " + upcomingTrip.getSelectedHotelId());
            System.out.println("Selected Vehicle ID: " + upcomingTrip.getSelectedVehicleId());
            System.out.println("Selected Guide ID: " + upcomingTrip.getSelectedGuideId());
            System.out.println("Hotel Final Amount: " + upcomingTrip.getHotelFinalAmount());
            System.out.println("Vehicle Quoted Amount: " + upcomingTrip.getVehicleQuotedAmount());
            System.out.println("Guide Quoted Amount: " + upcomingTrip.getGuideQuotedAmount());
            System.out.println("Total Trip Cost: " + upcomingTrip.getTotalTripCost());
            System.out.println("Total Price Per Person: " + upcomingTrip.getTotalPricePerPerson());
            System.out.println("Group Size: " + upcomingTrip.getGroupSize());
            System.out.println("===============================");
            
            UpcomingTrip savedTrip = upcomingTripRepo.save(upcomingTrip);
            System.out.println("Successfully saved upcoming trip with ID: " + savedTrip.getId());
            
            return savedTrip;
            
        } catch (Exception e) {
            System.err.println("Error creating upcoming trip: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to create upcoming trip: " + e.getMessage());
        }
    }

    @Override
    public UpcomingTrip updateUpcomingTrip(String upcomingTripId, UpcomingTrip upcomingTrip) {
        if (upcomingTrip == null) {
            throw new IllegalArgumentException("UpcomingTrip cannot be null");
        }
        
        Optional<UpcomingTrip> existingTrip = upcomingTripRepo.findById(upcomingTripId);
        if (existingTrip.isPresent()) {
            UpcomingTrip tripToUpdate = existingTrip.get();
            
            // Update basic trip information
            if (upcomingTrip.getTitle() != null) {
                tripToUpdate.setTitle(upcomingTrip.getTitle());
            }
            if (upcomingTrip.getStartLocation() != null) {
                tripToUpdate.setStartLocation(upcomingTrip.getStartLocation());
            }
            if (upcomingTrip.getEndLocation() != null) {
                tripToUpdate.setEndLocation(upcomingTrip.getEndLocation());
            }
            if (upcomingTrip.getNumberOfSeats() != null) {
                tripToUpdate.setNumberOfSeats(upcomingTrip.getNumberOfSeats());
            }
            if (upcomingTrip.getDate() != null) {
                tripToUpdate.setDate(upcomingTrip.getDate());
            }
            if (upcomingTrip.getNumberOfDates() != null) {
                tripToUpdate.setNumberOfDates(upcomingTrip.getNumberOfDates());
            }
            if (upcomingTrip.getDescriptionAboutStartLocation() != null) {
                tripToUpdate.setDescriptionAboutStartLocation(upcomingTrip.getDescriptionAboutStartLocation());
            }
            if (upcomingTrip.getIntermediatePlaces() != null) {
                tripToUpdate.setIntermediatePlaces(upcomingTrip.getIntermediatePlaces());
            }
            if (upcomingTrip.getPickupTime() != null) {
                tripToUpdate.setPickupTime(upcomingTrip.getPickupTime());
            }
            if (upcomingTrip.getPath() != null) {
                tripToUpdate.setPath(upcomingTrip.getPath());
            }
            
            // Update service provider information
            if (upcomingTrip.getSelectedGuideId() != null) {
                tripToUpdate.setSelectedGuideId(upcomingTrip.getSelectedGuideId());
            }
            if (upcomingTrip.getSelectedVehicleId() != null) {
                tripToUpdate.setSelectedVehicleId(upcomingTrip.getSelectedVehicleId());
            }
            if (upcomingTrip.getSelectedHotelId() != null) {
                tripToUpdate.setSelectedHotelId(upcomingTrip.getSelectedHotelId());
            }
            
            // Update accommodation details
            if (upcomingTrip.getGroupSize() != null) {
                tripToUpdate.setGroupSize(upcomingTrip.getGroupSize());
            }
            if (upcomingTrip.getCheckInDate() != null) {
                tripToUpdate.setCheckInDate(upcomingTrip.getCheckInDate());
            }
            if (upcomingTrip.getCheckOutDate() != null) {
                tripToUpdate.setCheckOutDate(upcomingTrip.getCheckOutDate());
            }
            if (upcomingTrip.getStandardRooms() != null) {
                tripToUpdate.setStandardRooms(upcomingTrip.getStandardRooms());
            }
            if (upcomingTrip.getDeluxRooms() != null) {
                tripToUpdate.setDeluxRooms(upcomingTrip.getDeluxRooms());
            }
            if (upcomingTrip.getFamilyRooms() != null) {
                tripToUpdate.setFamilyRooms(upcomingTrip.getFamilyRooms());
            }
            if (upcomingTrip.getSuites() != null) {
                tripToUpdate.setSuites(upcomingTrip.getSuites());
            }
            if (upcomingTrip.getMealPlan() != null) {
                tripToUpdate.setMealPlan(upcomingTrip.getMealPlan());
            }
            if (upcomingTrip.getSpecialRequirements() != null) {
                tripToUpdate.setSpecialRequirements(upcomingTrip.getSpecialRequirements());
            }
            
            // Update pricing information
            if (upcomingTrip.getAccommodationPricePerPerson() != null) {
                tripToUpdate.setAccommodationPricePerPerson(upcomingTrip.getAccommodationPricePerPerson());
            }
            if (upcomingTrip.getMealPricePerPerson() != null) {
                tripToUpdate.setMealPricePerPerson(upcomingTrip.getMealPricePerPerson());
            }
            if (upcomingTrip.getHotelTotalAmount() != null) {
                tripToUpdate.setHotelTotalAmount(upcomingTrip.getHotelTotalAmount());
            }
            if (upcomingTrip.getHotelDiscountOffered() != null) {
                tripToUpdate.setHotelDiscountOffered(upcomingTrip.getHotelDiscountOffered());
            }
            if (upcomingTrip.getHotelFinalAmount() != null) {
                tripToUpdate.setHotelFinalAmount(upcomingTrip.getHotelFinalAmount());
            }
            if (upcomingTrip.getVehicleTotalAmount() != null) {
                tripToUpdate.setVehicleTotalAmount(upcomingTrip.getVehicleTotalAmount());
            }
            if (upcomingTrip.getVehicleFinalAmount() != null) {
                tripToUpdate.setVehicleFinalAmount(upcomingTrip.getVehicleFinalAmount());
            }
            if (upcomingTrip.getGuideTotalAmount() != null) {
                tripToUpdate.setGuideTotalAmount(upcomingTrip.getGuideTotalAmount());
            }
            if (upcomingTrip.getGuideFinalAmount() != null) {
                tripToUpdate.setGuideFinalAmount(upcomingTrip.getGuideFinalAmount());
            }
            
            // Update status information
            if (upcomingTrip.getTripStatus() != null) {
                tripToUpdate.setTripStatus(upcomingTrip.getTripStatus());
            }
            if (upcomingTrip.getBookingStatus() != null) {
                tripToUpdate.setBookingStatus(upcomingTrip.getBookingStatus());
            }
            if (upcomingTrip.getPaymentStatus() != null) {
                tripToUpdate.setPaymentStatus(upcomingTrip.getPaymentStatus());
            }
            
            // Update customer information
            if (upcomingTrip.getCustomerId() != null) {
                tripToUpdate.setCustomerId(upcomingTrip.getCustomerId());
            }
            if (upcomingTrip.getCustomerName() != null) {
                tripToUpdate.setCustomerName(upcomingTrip.getCustomerName());
            }
            if (upcomingTrip.getCustomerEmail() != null) {
                tripToUpdate.setCustomerEmail(upcomingTrip.getCustomerEmail());
            }
            if (upcomingTrip.getCustomerPhone() != null) {
                tripToUpdate.setCustomerPhone(upcomingTrip.getCustomerPhone());
            }
            if (upcomingTrip.getEmergencyContact() != null) {
                tripToUpdate.setEmergencyContact(upcomingTrip.getEmergencyContact());
            }
            
            // Update admin notes
            if (upcomingTrip.getAdminNotes() != null) {
                tripToUpdate.setAdminNotes(upcomingTrip.getAdminNotes());
            }
            if (upcomingTrip.getInternalNotes() != null) {
                tripToUpdate.setInternalNotes(upcomingTrip.getInternalNotes());
            }
            
            // Recalculate total costs
            tripToUpdate.setTotalTripCost(tripToUpdate.calculateTotalTripCost());
            tripToUpdate.setTotalPricePerPerson(tripToUpdate.calculateTotalPricePerPerson());
            
            // Update timestamp
            tripToUpdate.setUpdatedAt(LocalDateTime.now());
            
            return upcomingTripRepo.save(tripToUpdate);
        }
        throw new RuntimeException("Upcoming trip not found with id: " + upcomingTripId);
    }

    @Override
    public Optional<UpcomingTrip> getUpcomingTripById(String upcomingTripId) {
        if (upcomingTripId == null || upcomingTripId.trim().isEmpty()) {
            throw new IllegalArgumentException("Upcoming trip ID cannot be null or empty");
        }
        return upcomingTripRepo.findById(upcomingTripId);
    }

    @Override
    public boolean deleteUpcomingTrip(String upcomingTripId) {
        if (upcomingTripRepo.existsById(upcomingTripId)) {
            upcomingTripRepo.deleteById(upcomingTripId);
            return true;
        }
        return false;
    }

    @Override
    public Optional<UpcomingTrip> getUpcomingTripByOriginalPendingTripId(String originalPendingTripId) {
        if (originalPendingTripId == null || originalPendingTripId.trim().isEmpty()) {
            throw new IllegalArgumentException("Original pending trip ID cannot be null or empty");
        }
        return upcomingTripRepo.safeFindByOriginalPendingTripId(originalPendingTripId);
    }

    @Override
    public List<UpcomingTrip> getAllUpcomingTrips() {
        return upcomingTripRepo.findAll();
    }

    @Override
    public List<UpcomingTrip> getUpcomingTripsByStatus(String tripStatus) {
        if (tripStatus == null || tripStatus.trim().isEmpty()) {
            throw new IllegalArgumentException("Trip status cannot be null or empty");
        }
        return upcomingTripRepo.findByTripStatus(tripStatus);
    }

    @Override
    public List<UpcomingTrip> getUpcomingTripsByPaymentStatus(String paymentStatus) {
        if (paymentStatus == null || paymentStatus.trim().isEmpty()) {
            throw new IllegalArgumentException("Payment status cannot be null or empty");
        }
        return upcomingTripRepo.findByPaymentStatus(paymentStatus);
    }

    @Override
    public List<UpcomingTrip> getUpcomingTripsByCustomerId(String customerId) {
        if (customerId == null || customerId.trim().isEmpty()) {
            throw new IllegalArgumentException("Customer ID cannot be null or empty");
        }
        return upcomingTripRepo.findByCustomerId(customerId);
    }

    @Override
    public List<UpcomingTrip> getActiveUpcomingTrips() {
        return upcomingTripRepo.findActiveUpcomingTrips();
    }

    @Override
    public List<UpcomingTrip> getUpcomingTripsByDateRange(LocalDate startDate, LocalDate endDate) {
        return upcomingTripRepo.safeFindByDateRange(startDate, endDate);
    }

    @Override
    public boolean existsByOriginalPendingTripId(String originalPendingTripId) {
        if (originalPendingTripId == null || originalPendingTripId.trim().isEmpty()) {
            throw new IllegalArgumentException("Original pending trip ID cannot be null or empty");
        }
        return upcomingTripRepo.existsByOriginalPendingTripId(originalPendingTripId);
    }

    @Override
    public UpcomingTrip updateTripStatus(String upcomingTripId, String newStatus) {
        if (newStatus == null || newStatus.trim().isEmpty()) {
            throw new IllegalArgumentException("New status cannot be null or empty");
        }
        
        Optional<UpcomingTrip> existingTrip = upcomingTripRepo.findById(upcomingTripId);
        if (existingTrip.isPresent()) {
            UpcomingTrip trip = existingTrip.get();
            trip.setTripStatus(newStatus);
            trip.setUpdatedAt(LocalDateTime.now());
            
            if ("Completed".equals(newStatus)) {
                trip.setCompletedAt(LocalDateTime.now());
            }
            
            return upcomingTripRepo.save(trip);
        }
        throw new RuntimeException("Upcoming trip not found with id: " + upcomingTripId);
    }

    @Override
    public UpcomingTrip updatePaymentStatus(String upcomingTripId, String newPaymentStatus) {
        if (newPaymentStatus == null || newPaymentStatus.trim().isEmpty()) {
            throw new IllegalArgumentException("New payment status cannot be null or empty");
        }
        
        Optional<UpcomingTrip> existingTrip = upcomingTripRepo.findById(upcomingTripId);
        if (existingTrip.isPresent()) {
            UpcomingTrip trip = existingTrip.get();
            trip.setPaymentStatus(newPaymentStatus);
            trip.setUpdatedAt(LocalDateTime.now());
            
            // Update booking status based on payment status
            if ("Paid".equals(newPaymentStatus)) {
                trip.setBookingStatus("Paid");
            } else if ("Partially Paid".equals(newPaymentStatus)) {
                trip.setBookingStatus("Partially Paid");
            }
            
            return upcomingTripRepo.save(trip);
        }
        throw new RuntimeException("Upcoming trip not found with id: " + upcomingTripId);
    }

    @Override
    public UpcomingTrip calculateAndUpdateTotalCosts(String upcomingTripId) {
        Optional<UpcomingTrip> existingTrip = upcomingTripRepo.findById(upcomingTripId);
        if (existingTrip.isPresent()) {
            UpcomingTrip trip = existingTrip.get();
            trip.setTotalTripCost(trip.calculateTotalTripCost());
            trip.setTotalPricePerPerson(trip.calculateTotalPricePerPerson());
            trip.setUpdatedAt(LocalDateTime.now());
            return upcomingTripRepo.save(trip);
        }
        throw new RuntimeException("Upcoming trip not found with id: " + upcomingTripId);
    }

    @Override
    public UpcomingTrip markTripAsCompleted(String upcomingTripId) {
        Optional<UpcomingTrip> existingTrip = upcomingTripRepo.findById(upcomingTripId);
        if (existingTrip.isPresent()) {
            UpcomingTrip trip = existingTrip.get();
            trip.setTripStatus("Completed");
            trip.setCompletedAt(LocalDateTime.now());
            trip.setUpdatedAt(LocalDateTime.now());
            return upcomingTripRepo.save(trip);
        }
        throw new RuntimeException("Upcoming trip not found with id: " + upcomingTripId);
    }

    @Override
    public UpcomingTrip cancelUpcomingTrip(String upcomingTripId, String reason) {
        Optional<UpcomingTrip> existingTrip = upcomingTripRepo.findById(upcomingTripId);
        if (existingTrip.isPresent()) {
            UpcomingTrip trip = existingTrip.get();
            trip.setTripStatus("Cancelled");
            trip.setUpdatedAt(LocalDateTime.now());
            
            // Add cancellation reason to admin notes
            String currentNotes = trip.getAdminNotes() != null ? trip.getAdminNotes() : "";
            trip.setAdminNotes(currentNotes + "\nCancellation Reason: " + reason + " (Cancelled on: " + LocalDateTime.now() + ")");
            
            return upcomingTripRepo.save(trip);
        }
        throw new RuntimeException("Upcoming trip not found with id: " + upcomingTripId);
    }

    @Override
    public UpcomingTrip updateWhatsappLink(String upcomingTripId, String whatsappLink) {
        Optional<UpcomingTrip> existingTrip = upcomingTripRepo.findById(upcomingTripId);
        if (existingTrip.isPresent()) {
            UpcomingTrip trip = existingTrip.get();
            trip.setWhatsappLink(whatsappLink);
            trip.setUpdatedAt(LocalDateTime.now());
            
            System.out.println("=== UPDATING WHATSAPP LINK ===");
            System.out.println("Trip ID: " + upcomingTripId);
            System.out.println("WhatsApp Link: " + whatsappLink);
            System.out.println("==============================");
            
            return upcomingTripRepo.save(trip);
        }
        throw new RuntimeException("Upcoming trip not found with id: " + upcomingTripId);
    }
}