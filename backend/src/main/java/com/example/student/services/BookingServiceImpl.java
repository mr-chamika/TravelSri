package com.example.student.services;

import com.example.student.model.Booking;
import com.example.student.model.dto.BookingRequest;
import com.example.student.model.dto.Bookingdto;
import com.example.student.repo.BookingRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Optional;

@Service  // ← This annotation is CRITICAL!
public class BookingServiceImpl implements IBookingService {

    @Autowired
    private BookingRepo bookingRepo;

    // Optional: Inject other services if needed
    // @Autowired
    // private IPaymentService paymentService;

    // @Autowired
    // private INotificationService notificationService;

    // Add this constructor for debugging
    public BookingServiceImpl() {
        System.out.println("🔥 BookingServiceImpl CREATED!");
    }

    @Override
    public Booking createBooking(BookingRequest request) {
        try {
            Booking booking = new Booking();
            booking.setTravelerId(request.getTravelerId());
            booking.setProviderId(request.getProviderId());
            booking.setProviderType(request.getProviderType());
            booking.setServiceName(request.getServiceName());
            booking.setServiceDescription(request.getServiceDescription());
            booking.setServiceStartDate(request.getServiceStartDate());
            booking.setServiceEndDate(request.getServiceEndDate());
            booking.setTotalAmount(request.getTotalAmount());

            // Calculate fees
            BigDecimal commission = request.getTotalAmount().multiply(BigDecimal.valueOf(0.05));
            BigDecimal confirmationFee = request.getTotalAmount().multiply(BigDecimal.valueOf(0.10));
            booking.setPlatformCommission(commission.setScale(2, RoundingMode.HALF_UP));
            booking.setProviderConfirmationFee(confirmationFee.setScale(2, RoundingMode.HALF_UP));

            // Set timestamps
            LocalDateTime now = LocalDateTime.now();
            booking.setBookingTime(now);
            booking.setCancellationDeadline(now.plusHours(20));
            booking.setRefundDeadline(request.getServiceStartDate().minusDays(2));

            // Set initial status
            booking.setStatus("PENDING_PAYMENT");
            booking.setPaymentStatus("PENDING");
            booking.setConfirmationFeePaid(false);
            booking.setFinalPayoutPaid(false);
            booking.setCreatedAt(now);
            booking.setUpdatedAt(now);

            return bookingRepo.save(booking);
        } catch (Exception e) {
            throw new RuntimeException("Error creating booking: " + e.getMessage());
        }
    }

    @Override
    public Optional<Booking> getBookingById(String bookingId) {
        if (bookingId == null || bookingId.trim().isEmpty()) {
            throw new IllegalArgumentException("Booking ID cannot be null or empty");
        }
        return bookingRepo.findById(bookingId);
    }

    @Override
    public List<Bookingdto> getBookingsByTraveler(String travelerId) {
        if (travelerId == null || travelerId.trim().isEmpty()) {
            throw new IllegalArgumentException("Traveler ID cannot be null or empty");
        }
        return bookingRepo.findByTravelerId(travelerId);
    }

    @Override
    public List<Bookingdto> getBookingsByProvider(String providerId) {
        if (providerId == null || providerId.trim().isEmpty()) {
            throw new IllegalArgumentException("Provider ID cannot be null or empty");
        }
        return bookingRepo.findByProviderId(providerId);
    }

    @Override
    public Booking acceptBooking(String bookingId, String providerId) {
        Optional<Booking> optBooking = bookingRepo.findById(bookingId);
        if (!optBooking.isPresent()) {
            throw new RuntimeException("Booking not found");
        }

        Booking booking = optBooking.get();
        if (!booking.getProviderId().equals(providerId)) {
            throw new RuntimeException("Unauthorized to accept this booking");
        }

        if (!"PENDING_PROVIDER_ACCEPTANCE".equals(booking.getStatus())) {
            throw new RuntimeException("Booking cannot be accepted in current status");
        }

        booking.setStatus("CONFIRMED");
        booking.setUpdatedAt(LocalDateTime.now());

        // Optional: Send notification
        // notificationService.notifyTravelerBookingConfirmed(booking);

        return bookingRepo.save(booking);
    }

    @Override
    public Booking rejectBooking(String bookingId, String providerId) {
        Optional<Booking> optBooking = bookingRepo.findById(bookingId);
        if (optBooking.isEmpty()) {
            throw new RuntimeException("Booking not found");
        }

        Booking booking = optBooking.get();
        if (!booking.getProviderId().equals(providerId)) {
            throw new RuntimeException("Unauthorized to reject this booking");
        }

        if (!"PENDING_PROVIDER_ACCEPTANCE".equals(booking.getStatus())) {
            throw new RuntimeException("Booking cannot be rejected in current status");
        }

        booking.setStatus("REJECTED_BY_PROVIDER");
        booking.setUpdatedAt(LocalDateTime.now());

        // Process full refund
        // paymentService.processFullRefund(booking, "provider-rejection");

        // Optional: Send notification
        // notificationService.notifyTravelerBookingRejected(booking);

        return bookingRepo.save(booking);
    }

    @Override
    public Booking cancelBooking(String bookingId, String travelerId) {
        Optional<Booking> optBooking = bookingRepo.findById(bookingId);
        if (!optBooking.isPresent()) {
            throw new RuntimeException("Booking not found");
        }

        Booking booking = optBooking.get();
        if (!booking.getTravelerId().equals(travelerId)) {
            throw new RuntimeException("Unauthorized to cancel this booking");
        }

        LocalDateTime now = LocalDateTime.now();

        if (now.isBefore(booking.getCancellationDeadline())) {
            // Full refund - within 20 hours
            // paymentService.processFullRefund(booking, "early-cancellation");
            booking.setStatus("CANCELLED_BY_TRAVELER");
        } else if (now.isBefore(booking.getRefundDeadline())) {
            // 85% refund - between 20h and 2 days before service
            // paymentService.processPartialRefund(booking, BigDecimal.valueOf(0.85), "late-cancellation");
            booking.setStatus("CANCELLED_BY_TRAVELER");
        } else {
            // No refund - less than 2 days before service
            booking.setStatus("CANCELLED_BY_TRAVELER");
            // notificationService.notifyProviderBookingCancelled(booking);
        }

        booking.setUpdatedAt(now);

        return bookingRepo.save(booking);
    }

    @Override
    public Booking completeBooking(String bookingId) {
        Optional<Booking> optBooking = bookingRepo.findById(bookingId);
        if (optBooking.isEmpty()) {
            throw new RuntimeException("Booking not found");
        }

        Booking booking = optBooking.get();
        booking.setStatus("COMPLETED");
        booking.setUpdatedAt(LocalDateTime.now());

        // Schedule final payout to provider
        // paymentService.scheduleFinalPayout(booking);

        return bookingRepo.save(booking);
    }
}