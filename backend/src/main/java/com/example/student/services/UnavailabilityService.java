package com.example.student.services;

import com.example.student.model.UnavailabilitySchedule;
import com.example.student.repo.UnavailabilityScheduleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class UnavailabilityService {

    @Autowired
    private UnavailabilityScheduleRepository unavailabilityRepository;

    // ✅ Enhanced create method with recurring support
    public UnavailabilitySchedule createUnavailability(String userId, String providerId, String providerType,
                                                       Date fromDate, Date toDate, String reason, String notes,
                                                       String recurrencePattern, Integer recurrenceCount,
                                                       Date recurrenceEndDate) {

        UnavailabilitySchedule unavailability = new UnavailabilitySchedule(
                userId, providerId, providerType, fromDate, toDate
        );

        // Set reason if provided
        if (reason != null && !reason.trim().isEmpty()) {
            unavailability.setUnavailabilityReason(reason);
        }

        // Set notes if provided
        if (notes != null && !notes.trim().isEmpty()) {
            unavailability.setNotes(notes);
        }

        // ✅ Set recurring pattern
        if (recurrencePattern != null && !recurrencePattern.trim().isEmpty()) {
            String pattern = recurrencePattern.toLowerCase();
            if (isValidRecurrencePattern(pattern)) {
                unavailability.setIsRecurring(true);
                unavailability.setRecurrencePattern(pattern);
                unavailability.setRecurrenceCount(recurrenceCount);
                unavailability.setRecurrenceEndDate(recurrenceEndDate);

                // Set day of week or month based on pattern
                setRecurrenceDetails(unavailability, fromDate, pattern);
            }
        }

        return unavailabilityRepository.save(unavailability);
    }

    // Overloaded method for backward compatibility (non-recurring)
    public UnavailabilitySchedule createUnavailability(String userId, String providerId, String providerType,
                                                       Date fromDate, Date toDate, String reason, String notes) {
        return createUnavailability(userId, providerId, providerType, fromDate, toDate,
                reason, notes, null, null, null);
    }

    // ✅ Validate recurrence pattern
    private boolean isValidRecurrencePattern(String pattern) {
        return Arrays.asList("weekly", "monthly", "yearly").contains(pattern);
    }

    // ✅ Set recurrence details based on pattern
    private void setRecurrenceDetails(UnavailabilitySchedule unavailability, Date fromDate, String pattern) {
        Calendar cal = Calendar.getInstance();
        cal.setTime(fromDate);

        switch (pattern) {
            case "weekly":
                // Monday = 1, Sunday = 7
                int dayOfWeek = cal.get(Calendar.DAY_OF_WEEK);
                unavailability.setDayOfWeek(dayOfWeek == 1 ? 7 : dayOfWeek - 1);
                break;
            case "monthly":
                unavailability.setDayOfMonth(cal.get(Calendar.DAY_OF_MONTH));
                break;
            case "yearly":
                // For yearly, we keep the exact date
                break;
        }
    }

    // ✅ Enhanced availability check considering recurring patterns
    public boolean isUserProviderAvailable(String userId, String providerId, Date fromDate, Date toDate) {
        // Check one-time unavailability
        List<UnavailabilitySchedule> oneTimeOverlapping = unavailabilityRepository
                .findUserProviderOverlappingUnavailability(userId, providerId, fromDate, toDate);

        if (!oneTimeOverlapping.isEmpty()) {
            return false;
        }

        // Check recurring unavailability
        List<UnavailabilitySchedule> recurringSchedules = unavailabilityRepository
                .findByUserIdAndProviderIdAndStatusAndIsRecurring(userId, providerId, "active", true);

        for (UnavailabilitySchedule schedule : recurringSchedules) {
            if (hasRecurringConflict(schedule, fromDate, toDate)) {
                return false;
            }
        }

        return true;
    }

    // ✅ Check if requested dates conflict with recurring pattern
    private boolean hasRecurringConflict(UnavailabilitySchedule recurringSchedule, Date requestFromDate, Date requestToDate) {
        String pattern = recurringSchedule.getRecurrencePattern();
        Date scheduleStart = recurringSchedule.getUnavailableFromDate();
        Date scheduleEnd = recurringSchedule.getUnavailableToDate();

        // Check if recurrence has ended
        if (recurringSchedule.getRecurrenceEndDate() != null &&
                requestFromDate.after(recurringSchedule.getRecurrenceEndDate())) {
            return false;
        }

        Calendar requestCal = Calendar.getInstance();
        Calendar scheduleCal = Calendar.getInstance();

        switch (pattern) {
            case "weekly":
                return hasWeeklyConflict(recurringSchedule, requestFromDate, requestToDate);
            case "monthly":
                return hasMonthlyConflict(recurringSchedule, requestFromDate, requestToDate);
            case "yearly":
                return hasYearlyConflict(recurringSchedule, requestFromDate, requestToDate);
            default:
                return false;
        }
    }

    private boolean hasWeeklyConflict(UnavailabilitySchedule schedule, Date requestFrom, Date requestTo) {
        // Implementation for weekly recurring conflicts
        // This is a simplified version - you can enhance based on your needs
        return false; // Placeholder
    }

    private boolean hasMonthlyConflict(UnavailabilitySchedule schedule, Date requestFrom, Date requestTo) {
        // Implementation for monthly recurring conflicts
        return false; // Placeholder
    }

    private boolean hasYearlyConflict(UnavailabilitySchedule schedule, Date requestFrom, Date requestTo) {
        // Implementation for yearly recurring conflicts
        return false; // Placeholder
    }

    // Rest of your existing methods remain the same...

    public List<String> getUserUnavailableProviders(String userId, String providerType, Date fromDate, Date toDate) {
        List<UnavailabilitySchedule> unavailableSchedules = unavailabilityRepository
                .findUserUnavailableProviders(userId, providerType, fromDate, toDate);

        return unavailableSchedules.stream()
                .map(UnavailabilitySchedule::getProviderId)
                .distinct()
                .collect(Collectors.toList());
    }

    public List<UnavailabilitySchedule> getUserUnavailabilitySchedules(String userId) {
        return unavailabilityRepository.findByUserIdAndStatus(userId, "active");
    }

    public List<UnavailabilitySchedule> getUserProviderUnavailability(String userId, String providerId) {
        return unavailabilityRepository.findByUserIdAndProviderIdAndStatus(userId, providerId, "active");
    }

    public List<UnavailabilitySchedule> getUserUnavailabilityByType(String userId, String providerType) {
        return unavailabilityRepository.findByUserIdAndProviderTypeAndStatus(userId, providerType, "active");
    }

    public UnavailabilitySchedule updateUserUnavailabilityStatus(String userId, String unavailabilityId, String status) {
        Optional<UnavailabilitySchedule> unavailability = unavailabilityRepository
                .findByIdAndUserId(unavailabilityId, userId);

        if (!unavailability.isPresent()) {
            throw new RuntimeException("Unavailability record not found or access denied");
        }

        UnavailabilitySchedule schedule = unavailability.get();
        schedule.setStatus(status);
        schedule.setUpdatedAt(new Date());

        return unavailabilityRepository.save(schedule);
    }

    public void deleteUserUnavailability(String userId, String unavailabilityId) {
        Optional<UnavailabilitySchedule> unavailability = unavailabilityRepository
                .findByIdAndUserId(unavailabilityId, userId);

        if (!unavailability.isPresent()) {
            throw new RuntimeException("Unavailability record not found or access denied");
        }

        unavailabilityRepository.deleteByIdAndUserId(unavailabilityId, userId);
    }
}
