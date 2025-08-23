package com.example.student.services;

import com.example.student.model.Booking;
import com.example.student.model.dto.BookingRequest;
import com.example.student.model.dto.Bookingdto;

import java.util.List;
import java.util.Optional;

public interface IBookingService {

    // Existing booking operations
    Booking createBooking(BookingRequest request);
    Optional<Booking> getBookingById(String bookingId);
    List<Bookingdto> getBookingsByTraveler(String travelerId);
    List<Bookingdto> getBookingsByProvider(String providerId);
    Booking acceptBooking(String bookingId, String providerId);
    Booking rejectBooking(String bookingId, String providerId);
    Booking cancelBooking(String bookingId, String travelerId);
    Booking completeBooking(String bookingId);

    // NEW: PayHere integration methods
    Optional<Booking> getBookingByPayHereOrderId(String orderId);
    Booking updateBooking(Booking booking);
    Booking saveBooking(Booking booking);

    // NEW: Payment status methods
    List<Booking> getBookingsByPaymentStatus(String paymentStatus);
    List<Booking> getPendingPaymentBookings();
    List<Booking> getConfirmedBookings();

    // NEW: Provider payout methods
    List<Booking> getBookingsForConfirmationFeePayout();
    List<Booking> getBookingsForFinalPayout();
    Booking updateBookingPaymentStatus(String bookingId, String paymentStatus);

    // NEW: Booking statistics
    long countBookingsByStatus(String status);
    long countBookingsByPaymentStatus(String paymentStatus);
    List<Booking> getRecentBookings(int limit);

    // NEW: Search and filter methods
    List<Booking> getBookingsByStatus(String status);
    List<Booking> getBookingsByDateRange(String startDate, String endDate);
    List<Booking> getBookingsByAmountRange(Double minAmount, Double maxAmount);

    default List<Bookingdto> getPendingBookingRequestsForGuide(String guideId) {
        return getBookingsByProvider(guideId).stream()
                .filter(booking -> "PENDING_PROVIDER_ACCEPTANCE".equals(booking.getStatus())
                        && "SUCCESS".equals(booking.getPaymentStatus()))
                .collect(java.util.stream.Collectors.toList());
    }

    // Get confirmed bookings for a guide
    default List<Bookingdto> getConfirmedBookingsForGuide(String guideId) {
        return getBookingsByProvider(guideId).stream()
                .filter(booking -> "CONFIRMED".equals(booking.getStatus()))
                .collect(java.util.stream.Collectors.toList());
    }

    // Get completed bookings for a guide
    default List<Bookingdto> getCompletedBookingsForGuide(String guideId) {
        return getBookingsByProvider(guideId).stream()
                .filter(booking -> "COMPLETED".equals(booking.getStatus()))
                .collect(java.util.stream.Collectors.toList());
    }

    // Get booking statistics for a guide
    default java.util.Map<String, Object> getGuideBookingStatistics(String guideId) {
        List<Bookingdto> allBookings = getBookingsByProvider(guideId);

        java.util.Map<String, Object> stats = new java.util.HashMap<>();
        stats.put("totalBookings", allBookings.size());
        stats.put("pendingRequests", allBookings.stream()
                .filter(b -> "PENDING_PROVIDER_ACCEPTANCE".equals(b.getStatus()))
                .count());
        stats.put("confirmedBookings", allBookings.stream()
                .filter(b -> "CONFIRMED".equals(b.getStatus()))
                .count());
        stats.put("completedBookings", allBookings.stream()
                .filter(b -> "COMPLETED".equals(b.getStatus()))
                .count());
        stats.put("cancelledBookings", allBookings.stream()
                .filter(b -> b.getStatus() != null && b.getStatus().contains("CANCELLED"))
                .count());

        // Calculate total earnings from completed bookings
        java.math.BigDecimal totalEarnings = allBookings.stream()
                .filter(b -> "COMPLETED".equals(b.getStatus()))
                .map(Bookingdto::getTotalAmount)
                .filter(java.util.Objects::nonNull)
                .reduce(java.math.BigDecimal.ZERO, java.math.BigDecimal::add);
        stats.put("totalEarnings", totalEarnings);

        return stats;
    }

    // Get bookings by date range for a specific guide
    default List<Bookingdto> getGuideBookingsByDateRange(String guideId, String startDate, String endDate) {
        List<Bookingdto> allBookings = getBookingsByProvider(guideId);

        try {
            java.time.format.DateTimeFormatter formatter = java.time.format.DateTimeFormatter.ofPattern("yyyy-MM-dd");
            java.time.LocalDateTime start = java.time.LocalDate.parse(startDate, formatter).atStartOfDay();
            java.time.LocalDateTime end = java.time.LocalDate.parse(endDate, formatter).atTime(23, 59, 59);

            return allBookings.stream()
                    .filter(booking -> booking.getServiceStartDate() != null &&
                            !booking.getServiceStartDate().isBefore(start) &&
                            !booking.getServiceStartDate().isAfter(end))
                    .collect(java.util.stream.Collectors.toList());
        } catch (Exception e) {
            return new java.util.ArrayList<>();
        }
    }

    // Validate if guide can accept/reject booking
    default boolean canGuideManageBooking(String bookingId, String guideId) {
        Optional<Booking> bookingOpt = getBookingById(bookingId);
        if (bookingOpt.isEmpty()) {
            return false;
        }

        Booking booking = bookingOpt.get();
        return booking.getProviderId().equals(guideId) &&
                "guide".equals(booking.getProviderType());
    }

    // Validate if booking can be accepted
    default boolean canBookingBeAccepted(String bookingId) {
        Optional<Booking> bookingOpt = getBookingById(bookingId);
        if (bookingOpt.isEmpty()) {
            return false;
        }

        Booking booking = bookingOpt.get();
        return "PENDING_PROVIDER_ACCEPTANCE".equals(booking.getStatus()) &&
                "SUCCESS".equals(booking.getPaymentStatus());
    }

    // Validate if booking can be completed
    default boolean canBookingBeCompleted(String bookingId) {
        Optional<Booking> bookingOpt = getBookingById(bookingId);
        if (bookingOpt.isEmpty()) {
            return false;
        }

        Booking booking = bookingOpt.get();
        return "CONFIRMED".equals(booking.getStatus());
    }

    // Get upcoming bookings for a guide (next 7 days)
    default List<Bookingdto> getUpcomingBookingsForGuide(String guideId) {
        List<Bookingdto> confirmedBookings = getConfirmedBookingsForGuide(guideId);
        java.time.LocalDateTime now = java.time.LocalDateTime.now();
        java.time.LocalDateTime nextWeek = now.plusDays(7);

        return confirmedBookings.stream()
                .filter(booking -> booking.getServiceStartDate() != null &&
                        booking.getServiceStartDate().isAfter(now) &&
                        booking.getServiceStartDate().isBefore(nextWeek))
                .sorted((a, b) -> a.getServiceStartDate().compareTo(b.getServiceStartDate()))
                .collect(java.util.stream.Collectors.toList());
    }

    // Get today's bookings for a guide
    default List<Bookingdto> getTodaysBookingsForGuide(String guideId) {
        List<Bookingdto> confirmedBookings = getConfirmedBookingsForGuide(guideId);
        java.time.LocalDate today = java.time.LocalDate.now();

        return confirmedBookings.stream()
                .filter(booking -> booking.getServiceStartDate() != null &&
                        booking.getServiceStartDate().toLocalDate().equals(today))
                .sorted((a, b) -> a.getServiceStartDate().compareTo(b.getServiceStartDate()))
                .collect(java.util.stream.Collectors.toList());
    }
}