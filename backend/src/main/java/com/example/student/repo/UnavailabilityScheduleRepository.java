package com.example.student.repo;

import com.example.student.model.UnavailabilitySchedule;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Repository
public interface UnavailabilityScheduleRepository extends MongoRepository<UnavailabilitySchedule, String> {

    // Existing methods...
    List<UnavailabilitySchedule> findByUserIdAndProviderIdAndStatus(String userId, String providerId, String status);
    List<UnavailabilitySchedule> findByUserIdAndStatus(String userId, String status);
    List<UnavailabilitySchedule> findByUserIdAndProviderTypeAndStatus(String userId, String providerType, String status);
    Optional<UnavailabilitySchedule> findByIdAndUserId(String id, String userId);

    // ✅ New method for recurring schedules
    List<UnavailabilitySchedule> findByUserIdAndProviderIdAndStatusAndIsRecurring(String userId, String providerId, String status, Boolean isRecurring);

    @Query("{ 'userId': ?0, 'providerId': ?1, 'status': 'active', " +
            "'unavailableFromDate': { $lte: ?3 }, 'unavailableToDate': { $gte: ?2 } }")
    List<UnavailabilitySchedule> findUserProviderOverlappingUnavailability(String userId, String providerId, Date requestedFromDate, Date requestedToDate);

    @Query("{ 'userId': ?0, 'providerType': ?1, 'status': 'active', " +
            "'unavailableFromDate': { $lte: ?3 }, 'unavailableToDate': { $gte: ?2 } }")
    List<UnavailabilitySchedule> findUserUnavailableProviders(String userId, String providerType, Date requestedFromDate, Date requestedToDate);

    @Query(value = "{ 'id': ?0, 'userId': ?1 }", delete = true)
    void deleteByIdAndUserId(String id, String userId);
}
