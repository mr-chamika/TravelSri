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

        // Hotel-specific fields
        if (booking.isHotelBooking()) {
            dto.setCheckInDate(booking.getCheckInDate());
            dto.setCheckOutDate(booking.getCheckOutDate());
            dto.setNumberOfRooms(booking.getNumberOfRooms());
            dto.setNumberOfNights(booking.getNumberOfNights());
            dto.setSelectedRoomTypes(booking.getSelectedRoomTypes());
            dto.setHotelName(booking.getHotelName());
            dto.setHotelLocation(booking.getHotelLocation());
            dto.setAdults(booking.getAdults());
            dto.setChildren(booking.getChildren());
        }

        // Vehicle-specific fields
        if ("vehicle".equals(booking.getProviderType())) {
            dto.setPickupLocation(booking.getPickupLocation());
            dto.setDropoffLocation(booking.getDropoffLocation());
            dto.setPickupTime(booking.getPickupTime());
            dto.setOneWayTrip(booking.getOneWayTrip());
        }

        return dto;
    }

    // Helper method to convert List<Booking> to List<Bookingdto>
    private List<Bookingdto> convertToDtoList(List<Booking> bookings) {
        return bookings.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public Booking createBooking(BookingRequest request) {
        try {
            logger.info("Creating {} booking for traveler: {}", request.getProviderType(), request.getTravelerId());

            // Validate the request
            request.validate();

            Booking booking = new Booking();

            // Map common fields
            booking.setTravelerId(request.getTravelerId());
            booking.setProviderId(request.getProviderId());
            booking.setProviderType(request.getProviderType());
            booking.setServiceName(request.getServiceName());
            booking.setServiceDescription(request.getServiceDescription());
            booking.setServiceStartDate(request.getServiceStartDate());
            booking.setServiceEndDate(request.getServiceEndDate());
            booking.setTotalAmount(request.getTotalAmount());
            booking.setCurrency("LKR"); // Always LKR
            booking.setSpecialRequests(request.getSpecialRequests());
            booking.setNumberOfGuests(request.getNumberOfGuests());
            booking.setLanguagePreference(request.getLanguagePreference());
            booking.setContactInformation(request.getContactInformation());

            // Set initial status
            booking.setStatus("PENDING_PAYMENT");
            booking.setPaymentStatus("PENDING");

            // Provider-specific handling
            if ("hotel".equals(request.getProviderType())) {
                logger.info("Setting up hotel-specific booking details");

                // Hotel-specific fields
                booking.setCheckInDate(request.getCheckInDate());
                booking.setCheckOutDate(request.getCheckOutDate());
                booking.setNumberOfRooms(request.getNumberOfRooms());
                booking.setNumberOfNights(request.getNumberOfNights());
                booking.setSelectedRoomTypes(request.getRoomTypes());
                booking.setAdults(request.getAdults());
                booking.setChildren(request.getChildren());
                booking.setHotelLocation(request.getLocation());
                booking.setHotelName(request.getTitle());
                booking.setHotelThumbnail(request.getThumbnail());
                booking.setHotelStars(request.getStars());
                booking.setHotelRating(request.getRatings());
                booking.setHotelFacilities(request.getFacilities());

                // Create room preferences string
                StringBuilder roomPrefs = new StringBuilder();
                if (request.getRoomTypes() != null && request.getRoomTypes().length > 0) {
                    roomPrefs.append("Rooms: ").append(String.join(", ", request.getRoomTypes()));
                }
                if (request.getMealPlan() != null) {
                    if (roomPrefs.length() > 0) roomPrefs.append("; ");
                    roomPrefs.append("Meal: ").append(request.getMealPlan());
                }
                if (request.getRoomPreferences() != null) {
                    if (roomPrefs.length() > 0) roomPrefs.append("; ");
                    roomPrefs.append(request.getRoomPreferences());
                }
                booking.setRoomPreferences(roomPrefs.toString());

                // Set service description for hotels
                if (request.getServiceDescription() == null) {
                    String description = String.format("Hotel stay at %s for %d nights (%s to %s)",
                            request.getTitle() != null ? request.getTitle() : "hotel",
                            request.getNumberOfNights() != null ? request.getNumberOfNights() : 1,
                            request.getCheckInDate() != null ? request.getCheckInDate() : "check-in",
                            request.getCheckOutDate() != null ? request.getCheckOutDate() : "check-out");
                    booking.setServiceDescription(description);
                }

            } else if ("guide".equals(request.getProviderType())) {
                // Guide-specific fields
                booking.setGuideType(request.getGuideType());

            } else if ("vehicle".equals(request.getProviderType())) {
                // Vehicle-specific fields
                booking.setPickupLocation(request.getPickupLocation());
                booking.setDropoffLocation(request.getDropoffLocation());
                booking.setPickupTime(request.getPickupTime());
                booking.setOneWayTrip(request.getOneWayTrip());
            }

            // Set timestamps and calculate fees
            booking.onCreate();

            Booking savedBooking = bookingRepo.save(booking);
            logger.info("Successfully created {} booking with ID: {}", request.getProviderType(), savedBooking.getId());

            return savedBooking;

        } catch (Exception e) {
            logger.error("Error creating {} booking", request.getProviderType(), e);
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

                if (!"PENDING_PROVIDER_ACCEPTANCE".equals(booking.getStatus())) {
                    throw new RuntimeException("Booking cannot be accepted in current status: " + booking.getStatus());
                }

                booking.setStatus("CONFIRMED");
                booking.setProviderAcceptedAt(LocalDateTime.now());
                booking.onUpdate();

                logger.info("{} booking {} accepted by provider {}",
                        booking.getProviderType(), bookingId, providerId);

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

                logger.info("{} booking {} rejected by provider {}",
                        booking.getProviderType(), bookingId, providerId);

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

                if (!booking.canBeCancelledByTraveler()) {
                    throw new RuntimeException("Booking cannot be cancelled by traveler in current status or time window");
                }

                booking.setStatus("CANCELLED_BY_TRAVELER");
                booking.setCancellationReason("Cancelled by traveler");
                booking.setCancellationType("TRAVELER_CANCELLED");
                booking.onUpdate();

                logger.info("{} booking {} cancelled by traveler {}",
                        booking.getProviderType(), bookingId, travelerId);

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

                if (!"CONFIRMED".equals(booking.getStatus())) {
                    throw new RuntimeException("Only confirmed bookings can be completed");
                }

                booking.setStatus("COMPLETED");
                booking.onUpdate();

                logger.info("{} booking {} marked as completed",
                        booking.getProviderType(), bookingId);

                return bookingRepo.save(booking);
            }

            throw new RuntimeException("Booking not found: " + bookingId);
        } catch (Exception e) {
            logger.error("Error completing booking", e);
            throw new RuntimeException("Failed to complete booking", e);
        }
    }

    // PayHere integration methods
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
            if (booking.getCreatedAt() == null) {
                booking.onCreate();
            } else {
                booking.onUpdate();
            }
            return bookingRepo.save(booking);
        } catch (Exception e) {
            logger.error("Error saving booking", e);
            throw new RuntimeException("Failed to save booking", e);
        }
    }

    // Payment status methods
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

    // Payout methods
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

                // Update booking status based on payment status
                if ("SUCCESS".equals(paymentStatus)) {
                    if ("PENDING_PAYMENT".equals(booking.getStatus())) {
                        booking.setStatus("PENDING_PROVIDER_ACCEPTANCE");
                    }
                } else if ("FAILED".equals(paymentStatus)) {
                    booking.setStatus("PAYMENT_FAILED");
                }

                booking.onUpdate();
                return bookingRepo.save(booking);
            }

            throw new RuntimeException("Booking not found: " + bookingId);
        } catch (Exception e) {
            logger.error("Error updating booking payment status", e);
            throw new RuntimeException("Failed to update booking payment status", e);
        }
    }

    // Statistics methods
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

    // Search and filter methods
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
