package com.example.student.services;

import com.example.student.model.PendingTrip;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public interface IPendingTripservice {
    PendingTrip createPendingTrip(PendingTrip pendingTrip);

    PendingTrip updatePendingTrip(String ptId, PendingTrip pendingTrip);

    List<PendingTrip> getAllPendingTrips();

    boolean deletePendingTrip(String ptId);

    Optional<PendingTrip> getPendingTripById(String ptId);

}
