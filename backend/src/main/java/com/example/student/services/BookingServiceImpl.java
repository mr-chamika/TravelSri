package com.example.student.services;

import com.example.student.model.Booking;
import com.example.student.model.dto.BookingRequest;
import com.example.student.model.dto.Bookingdto;
import com.example.student.repo.BookingRepo;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class BookingServiceImpl implements IBookingService {

    private static final Logger logger = LoggerFactory.getLogger(BookingServiceImpl.class);

    @Autowired
    private BookingRepo bookingRepo;

    // Helper method to convert Booking to Bookingdto
    private Bookingdto convertToDto(Booking booking) {
        if (booking == null) {
            return null;
        }

        Bookingdto dto = new Bookingdto();
        dto.setId(booking.getId());
        dto.setTravelerId(booking.getTravelerId());
        dto.setProviderId(booking.getProviderId());
        dto.setProviderType(booking.getProviderType());
        dto.setServiceName(booking.getServiceName());
        dto.setServiceDescription(booking.getServiceDescription());
        dto.setServiceStartDate(booking.getServiceStartDate());
        dto.setServiceEndDate(booking.getServiceEndDate());
        dto.setTotalAmount(booking.getTotalAmount());
        dto.setCurrency(booking.getCurrency());
        dto.setPlatformCommission(booking.getPlatformCommission());
        dto.setProviderConfirmationFee(booking.getProviderConfirmationFee());
        dto.setStatus(booking.getStatus());
        dto.setPaymentStatus(booking.getPaymentStatus());
        dto.setBookingTime(booking.getBookingTime());
        dto.setCancellationDeadline(booking.getCancellationDeadline());
        dto.setRefundDeadline(booking.getRefundDeadline());
        dto.setPayHereOrderId(booking.getPayHereOrderId());
        dto.setPayHerePaymentId(booking.getPayHerePaymentId());
        dto.setConfirmationFeePaid(booking.isConfirmationFeePaid());
        dto.setFinalPayoutPaid(booking.isFinalPayoutPaid());
        dto.setProviderAcceptedAt(booking.getProviderAcceptedAt());
        dto.setRejectionReason(booking.getRejectionReason());
        dto.setCancellationReason(booking.getCancellationReason());
        dto.setSpecialRequests(booking.getSpecialRequests());
        dto.setNumberOfGuests(booking.getNumberOfGuests());
        dto.setLanguagePreference(booking.getLanguagePreference());
        dto.setGuideType(booking.getGuideType());
        dto.setCreatedAt(booking.getCreatedAt());
        dto.setUpdatedAt(booking.getUpdatedAt());

        return dto;
    }

    // Helper method to convert List<Booking> to List<Bookingdto>
    private List<Bookingdto> convertToDtoList(List<Booking> bookings) {
        return bookings.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    // EXISTING METHODS - Implement your original booking methods here
    @Override
    public Booking createBooking(BookingRequest request) {
        try {
            // Implement your existing booking creation logic
            Booking booking = new Booking();
            // Map fields from request to booking
            booking.setTravelerId(request.getTravelerId());
            booking.setProviderId(request.getProviderId());
            booking.setProviderType(request.getProviderType());
            booking.setServiceName(request.getServiceName());
            booking.setServiceDescription(request.getServiceDescription());
            booking.setServiceStartDate(request.getServiceStartDate());
            booking.setServiceEndDate(request.getServiceEndDate());
            booking.setTotalAmount(request.getTotalAmount());
            booking.setStatus("PENDING_PAYMENT");
            booking.setPaymentStatus("PENDING");
            booking.onCreate(); // Set timestamps and calculate fees

            return bookingRepo.save(booking);
        } catch (Exception e) {
            logger.error("Error creating booking", e);
            throw new RuntimeException("Failed to create booking", e);
        }
    }

    @Override
    public Optional<Booking> getBookingById(String bookingId) {
        try {
            return bookingRepo.findById(bookingId);
        } catch (Exception e) {
            logger.error("Error finding booking by ID: {}", bookingId, e);
            return Optional.empty();
        }
    }

    @Override
    public List<Bookingdto> getBookingsByTraveler(String travelerId) {
        try {
            if (travelerId == null || travelerId.trim().isEmpty()) {
                throw new IllegalArgumentException("Traveler ID cannot be null or empty");
            }
            List<Booking> bookings = bookingRepo.findByTravelerId(travelerId);
            return convertToDtoList(bookings);
        } catch (Exception e) {
            logger.error("Error finding bookings by traveler ID: {}", travelerId, e);
            throw new RuntimeException("Failed to get bookings for traveler", e);
        }
    }

    @Override
    public List<Bookingdto> getBookingsByProvider(String providerId) {
        try {
            if (providerId == null || providerId.trim().isEmpty()) {
                throw new IllegalArgumentException("Provider ID cannot be null or empty");
            }
            List<Booking> bookings = bookingRepo.findByProviderId(providerId);
            return convertToDtoList(bookings);
        } catch (Exception e) {
            logger.error("Error finding bookings by provider ID: {}", providerId, e);
            throw new RuntimeException("Failed to get bookings for provider", e);
        }
    }

    @Override
    public Booking acceptBooking(String bookingId, String providerId) {
        try {
            Optional<Booking> optBooking = bookingRepo.findById(bookingId);
            if (optBooking.isPresent()) {
                Booking booking = optBooking.get();
                if (!booking.getProviderId().equals(providerId)) {
                    throw new RuntimeException("Provider not authorized for this booking");
                }
                booking.setStatus("CONFIRMED");
                booking.setProviderAcceptedAt(LocalDateTime.now());
                booking.onUpdate();
                return bookingRepo.save(booking);
            }
            throw new RuntimeException("Booking not found: " + bookingId);
        } catch (Exception e) {
            logger.error("Error accepting booking", e);
            throw new RuntimeException("Failed to accept booking", e);
        }
    }

    @Override
    public Booking rejectBooking(String bookingId, String providerId) {
        try {
            Optional<Booking> optBooking = bookingRepo.findById(bookingId);
            if (optBooking.isPresent()) {
                Booking booking = optBooking.get();
                if (!booking.getProviderId().equals(providerId)) {
                    throw new RuntimeException("Provider not authorized for this booking");
                }
                booking.setStatus("CANCELLED_BY_PROVIDER");
                booking.setProviderRejectedAt(LocalDateTime.now());
                booking.setRejectionReason("Rejected by provider");
                booking.onUpdate();
                return bookingRepo.save(booking);
            }
            throw new RuntimeException("Booking not found: " + bookingId);
        } catch (Exception e) {
            logger.error("Error rejecting booking", e);
            throw new RuntimeException("Failed to reject booking", e);
        }
    }

    @Override
    public Booking cancelBooking(String bookingId, String travelerId) {
        try {
            Optional<Booking> optBooking = bookingRepo.findById(bookingId);
            if (optBooking.isPresent()) {
                Booking booking = optBooking.get();
                if (!booking.getTravelerId().equals(travelerId)) {
                    throw new RuntimeException("Traveler not authorized for this booking");
                }
                booking.setStatus("CANCELLED_BY_TRAVELER");
                booking.setCancellationReason("Cancelled by traveler");
                booking.setCancellationType("TRAVELER_CANCELLED");
                booking.onUpdate();
                return bookingRepo.save(booking);
            }
            throw new RuntimeException("Booking not found: " + bookingId);
        } catch (Exception e) {
            logger.error("Error cancelling booking", e);
            throw new RuntimeException("Failed to cancel booking", e);
        }
    }

    @Override
    public Booking completeBooking(String bookingId) {
        try {
            Optional<Booking> optBooking = bookingRepo.findById(bookingId);
            if (optBooking.isPresent()) {
                Booking booking = optBooking.get();
                booking.setStatus("COMPLETED");
                booking.onUpdate();
                return bookingRepo.save(booking);
            }
            throw new RuntimeException("Booking not found: " + bookingId);
        } catch (Exception e) {
            logger.error("Error completing booking", e);
            throw new RuntimeException("Failed to complete booking", e);
        }
    }

    // NEW PAYHERE INTEGRATION METHODS
    @Override
    public Optional<Booking> getBookingByPayHereOrderId(String orderId) {
        try {
            return bookingRepo.findByPayHereOrderId(orderId);
        } catch (Exception e) {
            logger.error("Error finding booking by PayHere order ID: {}", orderId, e);
            return Optional.empty();
        }
    }

    @Override
    public Booking updateBooking(Booking booking) {
        try {
            booking.onUpdate();
            return bookingRepo.save(booking);
        } catch (Exception e) {
            logger.error("Error updating booking: {}", booking.getId(), e);
            throw new RuntimeException("Failed to update booking", e);
        }
    }

    @Override
    public Booking saveBooking(Booking booking) {
        try {
            booking.onCreate();
            return bookingRepo.save(booking);
        } catch (Exception e) {
            logger.error("Error saving booking", e);
            throw new RuntimeException("Failed to save booking", e);
        }
    }

    // PAYMENT STATUS METHODS
    @Override
    public List<Booking> getBookingsByPaymentStatus(String paymentStatus) {
        try {
            return bookingRepo.findByPaymentStatus(paymentStatus);
        } catch (Exception e) {
            logger.error("Error finding bookings by payment status: {}", paymentStatus, e);
            return List.of();
        }
    }

    @Override
    public List<Booking> getPendingPaymentBookings() {
        try {
            return bookingRepo.findByPaymentStatus("PENDING");
        } catch (Exception e) {
            logger.error("Error finding pending payment bookings", e);
            return List.of();
        }
    }

    @Override
    public List<Booking> getConfirmedBookings() {
        try {
            return bookingRepo.findByStatus("CONFIRMED");
        } catch (Exception e) {
            logger.error("Error finding confirmed bookings", e);
            return List.of();
        }
    }

    // PAYOUT METHODS
    @Override
    public List<Booking> getBookingsForConfirmationFeePayout() {
        try {
            LocalDateTime twentyHoursAgo = LocalDateTime.now().minusHours(20);
            return bookingRepo.findBookingsForConfirmationFeePayout(twentyHoursAgo);
        } catch (Exception e) {
            logger.error("Error finding bookings for confirmation fee payout", e);
            return List.of();
        }
    }

    @Override
    public List<Booking> getBookingsForFinalPayout() {
        try {
            return bookingRepo.findBookingsForFinalPayout();
        } catch (Exception e) {
            logger.error("Error finding bookings for final payout", e);
            return List.of();
        }
    }

    @Override
    public Booking updateBookingPaymentStatus(String bookingId, String paymentStatus) {
        try {
            Optional<Booking> optBooking = bookingRepo.findById(bookingId);
            if (optBooking.isPresent()) {
                Booking booking = optBooking.get();
                booking.setPaymentStatus(paymentStatus);
                booking.onUpdate();
                return bookingRepo.save(booking);
            }
            throw new RuntimeException("Booking not found: " + bookingId);
        } catch (Exception e) {
            logger.error("Error updating booking payment status", e);
            throw new RuntimeException("Failed to update booking payment status", e);
        }
    }

    // STATISTICS METHODS
    @Override
    public long countBookingsByStatus(String status) {
        try {
            return bookingRepo.countByStatus(status);
        } catch (Exception e) {
            logger.error("Error counting bookings by status: {}", status, e);
            return 0;
        }
    }

    @Override
    public long countBookingsByPaymentStatus(String paymentStatus) {
        try {
            return bookingRepo.countByPaymentStatus(paymentStatus);
        } catch (Exception e) {
            logger.error("Error counting bookings by payment status: {}", paymentStatus, e);
            return 0;
        }
    }

    @Override
    public List<Booking> getRecentBookings(int limit) {
        try {
            return bookingRepo.findRecentBookings(limit);
        } catch (Exception e) {
            logger.error("Error finding recent bookings", e);
            return List.of();
        }
    }

    // SEARCH AND FILTER METHODS
    @Override
    public List<Booking> getBookingsByStatus(String status) {
        try {
            return bookingRepo.findByStatus(status);
        } catch (Exception e) {
            logger.error("Error finding bookings by status: {}", status, e);
            return List.of();
        }
    }

    @Override
    public List<Booking> getBookingsByDateRange(String startDate, String endDate) {
        try {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
            LocalDateTime start = LocalDate.parse(startDate, formatter).atStartOfDay();
            LocalDateTime end = LocalDate.parse(endDate, formatter).atTime(23, 59, 59);

            return bookingRepo.findByCreatedAtBetween(start, end);
        } catch (Exception e) {
            logger.error("Error finding bookings by date range: {} to {}", startDate, endDate, e);
            return List.of();
        }
    }

    @Override
    public List<Booking> getBookingsByAmountRange(Double minAmount, Double maxAmount) {
        try {
            return bookingRepo.findByTotalAmountBetween(minAmount, maxAmount);
        } catch (Exception e) {
            logger.error("Error finding bookings by amount range: {} to {}", minAmount, maxAmount, e);
            return List.of();
        }
    }
}