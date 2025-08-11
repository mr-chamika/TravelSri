package com.example.student.repo;

import com.example.student.model.Booking;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepo extends MongoRepository<Booking, String> {

    // Basic finder methods
    @Query("{'travelerId': ?0}")
    List<Booking> findByTravelerId(String travelerId);

    @Query("{'providerId': ?0}")
    List<Booking> findByProviderId(String providerId);

    @Query("{'providerType': ?0}")
    List<Booking> findByProviderType(String providerType);

    // PayHere integration queries
    @Query("{'payHereOrderId': ?0}")
    Optional<Booking> findByPayHereOrderId(String orderId);

    @Query("{'payHerePaymentId': ?0}")
    Optional<Booking> findByPayHerePaymentId(String paymentId);

    @Query("{'payHereRefundId': ?0}")
    Optional<Booking> findByPayHereRefundId(String refundId);

    // Payment status queries
    @Query("{'paymentStatus': ?0}")
    List<Booking> findByPaymentStatus(String paymentStatus);

    @Query("{'status': ?0}")
    List<Booking> findByStatus(String status);

    @Query("{'status': ?0, 'paymentStatus': ?1}")
    List<Booking> findByStatusAndPaymentStatus(String status, String paymentStatus);

    // Payout related queries
    @Query("{'status': 'CONFIRMED', 'paymentStatus': 'SUCCESS', 'confirmationFeePaid': false, 'providerAcceptedAt': {$lt: ?0}}")
    List<Booking> findBookingsForConfirmationFeePayout(LocalDateTime cutoffTime);

    @Query("{'status': 'COMPLETED', 'paymentStatus': 'SUCCESS', 'finalPayoutPaid': false}")
    List<Booking> findBookingsForFinalPayout();

    @Query("{'confirmationFeePaid': true}")
    List<Booking> findBookingsWithConfirmationFeePaid();

    @Query("{'finalPayoutPaid': true}")
    List<Booking> findBookingsWithFinalPayoutPaid();

    // Count queries
    @Query(value = "{'status': ?0}", count = true)
    long countByStatus(String status);

    @Query(value = "{'paymentStatus': ?0}", count = true)
    long countByPaymentStatus(String paymentStatus);

    @Query(value = "{'travelerId': ?0}", count = true)
    long countByTravelerId(String travelerId);

    @Query(value = "{'providerId': ?0}", count = true)
    long countByProviderId(String providerId);

    // Recent bookings with limit
    @Query(value = "{}", sort = "{'createdAt': -1}")
    List<Booking> findTop10ByOrderByCreatedAtDesc();

    @Query(value = "{}", sort = "{'updatedAt': -1}")
    List<Booking> findTop10ByOrderByUpdatedAtDesc();

    // Date range queries
    @Query("{'createdAt': {$gte: ?0, $lte: ?1}}")
    List<Booking> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);

    @Query("{'updatedAt': {$gte: ?0, $lte: ?1}}")
    List<Booking> findByUpdatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);

    @Query("{'serviceStartDate': {$gte: ?0, $lte: ?1}}")
    List<Booking> findByServiceStartDateBetween(LocalDateTime startDate, LocalDateTime endDate);

    @Query("{'bookingTime': {$gte: ?0, $lte: ?1}}")
    List<Booking> findByBookingTimeBetween(LocalDateTime startDate, LocalDateTime endDate);

    // Amount range queries
    @Query("{'totalAmount': {$gte: ?0, $lte: ?1}}")
    List<Booking> findByTotalAmountBetween(Double minAmount, Double maxAmount);

    // Provider and traveler specific queries
    @Query("{'providerId': ?0, 'status': ?1}")
    List<Booking> findByProviderIdAndStatus(String providerId, String status);

    @Query("{'travelerId': ?0, 'paymentStatus': ?1}")
    List<Booking> findByTravelerIdAndPaymentStatus(String travelerId, String paymentStatus);

    @Query("{'travelerId': ?0, 'status': ?1}")
    List<Booking> findByTravelerIdAndStatus(String travelerId, String status);

    @Query("{'providerId': ?0, 'paymentStatus': ?1}")
    List<Booking> findByProviderIdAndPaymentStatus(String providerId, String paymentStatus);

    // Complex business logic queries
    @Query("{'paymentStatus': 'SUCCESS', 'status': {$in: ['CONFIRMED', 'COMPLETED']}}")
    List<Booking> findSuccessfullyPaidBookings();

    @Query("{'paymentStatus': 'PENDING', 'createdAt': {$lt: ?0}}")
    List<Booking> findExpiredPendingPayments(LocalDateTime cutoffTime);

    @Query("{'status': 'CONFIRMED', 'serviceStartDate': {$gte: ?0, $lte: ?1}}")
    List<Booking> findUpcomingConfirmedBookings(LocalDateTime startDate, LocalDateTime endDate);

    @Query("{'status': 'PENDING_PROVIDER_ACCEPTANCE', 'paymentStatus': 'SUCCESS'}")
    List<Booking> findBookingsAwaitingProviderAcceptance();

    @Query("{'cancellationDeadline': {$gt: ?0}, 'status': {$in: ['CONFIRMED', 'PENDING_PROVIDER_ACCEPTANCE']}}")
    List<Booking> findCancellableBookings(LocalDateTime currentTime);

    @Query("{'refundDeadline': {$gt: ?0}, 'status': 'CONFIRMED'}")
    List<Booking> findRefundableBookings(LocalDateTime currentTime);

    // Specific to guide bookings
    @Query("{'providerType': 'guide', 'guideType': ?0}")
    List<Booking> findGuideBookingsByType(String guideType);

    @Query("{'providerType': 'guide', 'languagePreference': ?0}")
    List<Booking> findGuideBookingsByLanguage(String language);

    // Revenue and analytics queries
    @Query("{'paymentStatus': 'SUCCESS', 'createdAt': {$gte: ?0, $lte: ?1}}")
    List<Booking> findSuccessfulBookingsBetweenDates(LocalDateTime startDate, LocalDateTime endDate);

    @Query("{'status': {$regex: 'CANCELLED'}, 'createdAt': {$gte: ?0, $lte: ?1}}")
    List<Booking> findCancelledBookingsBetweenDates(LocalDateTime startDate, LocalDateTime endDate);

    @Query("{'paymentStatus': {$in: ['REFUNDED', 'PARTIALLY_REFUNDED']}, 'createdAt': {$gte: ?0, $lte: ?1}}")
    List<Booking> findRefundedBookingsBetweenDates(LocalDateTime startDate, LocalDateTime endDate);

    // Review related queries
    @Query("{'reviewCompleted': false, 'status': 'COMPLETED'}")
    List<Booking> findCompletedBookingsWithoutReview();

    @Query("{'reviewCompleted': true}")
    List<Booking> findBookingsWithReview();

    // Search functionality
    @Query("{'serviceName': {$regex: ?0, $options: 'i'}}")
    List<Booking> findByServiceNameContaining(String serviceName);

    @Query("{'serviceDescription': {$regex: ?0, $options: 'i'}}")
    List<Booking> findByServiceDescriptionContaining(String description);

    @Query("{'specialRequests': {$regex: ?0, $options: 'i'}}")
    List<Booking> findBySpecialRequestsContaining(String requests);

    // Custom aggregation method to get recent bookings with limit
    default List<Booking> findRecentBookings(int limit) {
        return findTop10ByOrderByCreatedAtDesc(); // Default to top 10, you can customize this
    }
}