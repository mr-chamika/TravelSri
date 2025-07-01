package com.example.student.services;

import com.example.student.model.PendingTrip;
import com.example.student.repo.PendingTripRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PendingTripservice implements IPendingTripservice {
    @Autowired
    private PendingTripRepo pendingTripRepo;

    @Override
    public PendingTrip createPendingTrip(PendingTrip pendingTrip) {
        if (pendingTrip == null) {
            throw new IllegalArgumentException("PendingTrip cannot be null");
        }
        return pendingTripRepo.save(pendingTrip);
    }

    @Override
    public PendingTrip updatePendingTrip(String ptId, PendingTrip pendingTrip) {
        if (pendingTrip == null) {
            throw new IllegalArgumentException("PendingTrip cannot be null");
        }
        Optional<PendingTrip> existingTrip = pendingTripRepo.findById(ptId);
        if (existingTrip.isPresent()) {
            PendingTrip tripToUpdate = existingTrip.get();
            tripToUpdate.setTitle(pendingTrip.getTitle());
            tripToUpdate.setStartLocation(pendingTrip.getStartLocation());
            tripToUpdate.setEndLocation(pendingTrip.getEndLocation());
            tripToUpdate.setNumberOfSeats(pendingTrip.getNumberOfSeats());
            tripToUpdate.setDate(pendingTrip.getDate());
            tripToUpdate.setNumberOfDates(pendingTrip.getNumberOfDates());
            tripToUpdate.setDescriptionAboutStartLocation(pendingTrip.getDescriptionAboutStartLocation());
            tripToUpdate.setPickupTime(pendingTrip.getPickupTime());
            tripToUpdate.setPath(pendingTrip.getPath());
            return pendingTripRepo.save(tripToUpdate);
        }
        throw new RuntimeException("Pending trip not found with id: " + ptId);
    }

    @Override
    public List<PendingTrip> getAllPendingTrips() {
        return pendingTripRepo.findAll();
    }

    @Override
    public boolean deletePendingTrip(String ptId) {
        if (pendingTripRepo.existsById(ptId)) {
            pendingTripRepo.deleteById(ptId);
            return true;
        }
        return false;
    }

    @Override
    public Optional<PendingTrip> getPendingTripById(String ptId) {
        if (ptId == null || ptId.trim().isEmpty()) {
            throw new IllegalArgumentException("Trip ID cannot be null or empty");
        }
        return pendingTripRepo.findById(ptId);
    }


}