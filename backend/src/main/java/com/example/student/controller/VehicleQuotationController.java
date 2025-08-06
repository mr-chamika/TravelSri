package com.example.student.controller;

import com.example.student.model.PendingTrip;
import com.example.student.model.Vehicle;
import com.example.student.repo.PendingTripRepo;
import com.example.student.repo.VehicleRepo;
import com.example.student.repo.VehicleOwnerQuotationRepo;
import com.example.student.model.VehicleOwnerQuotation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@CrossOrigin
@RequestMapping("/VehicleOwnerQuotation")
public class VehicleQuotationController {

    @Autowired
    private PendingTripRepo tourRepo;

    @Autowired
    private VehicleOwnerQuotationRepo vehicleOwnerQuotationRepo;

    // Vehicle owner ID - should come from authentication context
    private String vehicleOwnerId = "TEMP_VEHICLE_OWNER_ID_001";


    @GetMapping("/groupTours")
    public ResponseEntity<List<PendingTrip>> getUnsubmittedToursForVehicleOwner() {
        try {
            System.out.println("=== Starting getUnsubmittedToursForVehicleOwner ===");
            System.out.println("Vehicle Owner ID: " + vehicleOwnerId);

            // Get all tours
            List<PendingTrip> allTours = tourRepo.findAll();
            System.out.println("Total tours found: " + allTours.size());

            if (allTours.isEmpty()) {
                System.out.println("No tours found in database");
                return ResponseEntity.ok(Collections.emptyList());
            }

            // Log first few tours for debugging
            for (int i = 0; i < Math.min(3, allTours.size()); i++) {
                PendingTrip tour = allTours.get(i);
                System.out.println("Tour " + i + ": ID=" + tour.getPtId() +
                        ", Title=" + tour.getTitle() +
                        ", Start=" + tour.getStartLocation() +
                        ", End=" + tour.getEndLocation());
            }

            // Get quotations for this vehicle owner
            List<VehicleOwnerQuotation> vehicleOwnerQuotations =
                    vehicleOwnerQuotationRepo.findByOwnerId(vehicleOwnerId);
            System.out.println("Quotations found for vehicle owner: " + vehicleOwnerQuotations.size());

            // Get set of quoted tour IDs
            Set<String> quotedTourIds = vehicleOwnerQuotations.stream()
                    .map(q -> String.valueOf(q.get_id()))
                    .collect(Collectors.toSet());

            System.out.println("Quoted Tour IDs: " + quotedTourIds);

            // Filter unsubmitted tours
            List<PendingTrip> unsubmittedTours = allTours.stream()
                    .filter(tour -> !quotedTourIds.contains(String.valueOf(tour.getPtId())))
                    .collect(Collectors.toList());

            System.out.println("Unsubmitted tours count: " + unsubmittedTours.size());

            // Log the tours being returned
            unsubmittedTours.forEach(tour ->
                    System.out.println("Returning tour: " + tour.getPtId() + " - " + tour.getTitle())
            );

            System.out.println("=== Completed getUnsubmittedToursForVehicleOwner ===");
            return ResponseEntity.ok(unsubmittedTours);

        } catch (Exception e) {
            System.err.println("Error in getUnsubmittedToursForVehicleOwner: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.emptyList());
        }
    }

    @PutMapping("/submitQuotation/{tourId}")
    public ResponseEntity<?> submitVehicleQuotationPrice(@PathVariable String tourId, @RequestBody VehicleOwnerQuotation quotationRequest) {
        System.out.println("Received vehicle quotation request for tour ID: " + tourId);
        System.out.println("Vehicle quotation data: " + quotationRequest);

        try {
            // Validate input
            if (quotationRequest.getQuotedAmount() == null || quotationRequest.getQuotedAmount() <= 0) {
                System.out.println("Invalid amount: " + quotationRequest.getQuotedAmount());
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Invalid amount provided");
            }

            // Check if tour exists
            Optional<PendingTrip> optionalTour = tourRepo.findById(tourId);
            if (optionalTour.isEmpty()) {
                System.out.println("Tour not found with ID: " + tourId);
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Tour not found with id: " + tourId);
            }

            PendingTrip tour = optionalTour.get();
            System.out.println("Found tour: " + tour.getTitle());

            // Get vehicle owner ID from request body (allows temporary owner IDs)
//            String vehicleOwnerId = quotationRequest.getVehicleOwnerId();

            // If vehicle owner ID is not in the request, try to get it from tour
            if (vehicleOwnerId == null || vehicleOwnerId.isEmpty()) {
                vehicleOwnerId = tour.getVehicleId();
            }

            // If still no vehicle owner ID, use a default temporary one
            if (vehicleOwnerId == null || vehicleOwnerId.isEmpty()) {
                vehicleOwnerId = "TEMP_VEHICLE_OWNER_ID_001";
                System.out.println("Using default temporary vehicle owner ID: " + vehicleOwnerId);
            }

            System.out.println("Using vehicle owner ID: " + vehicleOwnerId);

            // Check if quotation already exists for this tour and vehicle owner
            Optional<VehicleOwnerQuotation> existingQuotation = vehicleOwnerQuotationRepo.findByPendingTripIdAndOwnerId(tourId, vehicleOwnerId);

            VehicleOwnerQuotation quotation;
            if (existingQuotation.isPresent()) {
                // Update existing quotation
                quotation = existingQuotation.get();
                quotation.setQuotedAmount(quotationRequest.getQuotedAmount());
                quotation.setQuotationNotes(quotationRequest.getQuotationNotes());
                quotation.setQuotationDate(new java.util.Date());
                quotation.setUpdatedAt(new java.util.Date());
                quotation.setStatus("pending"); // Reset status to pending
                System.out.println("Updating existing vehicle quotation");
            } else {
                // Create new quotation
                quotation = new VehicleOwnerQuotation();
                quotation.setPendingTripId(tourId);
                quotation.setOwnerId(vehicleOwnerId);
                quotation.setQuotedAmount(quotationRequest.getQuotedAmount());
                quotation.setQuotationNotes(quotationRequest.getQuotationNotes());
                quotation.setQuotationDate(new java.util.Date());
                quotation.setCreatedAt(new java.util.Date());
                quotation.setUpdatedAt(new java.util.Date());
                quotation.setStatus("pending");
                System.out.println("Creating new vehicle quotation");
            }

            // Save the quotation to vehicle_owner_quotation collection
            VehicleOwnerQuotation savedQuotation = vehicleOwnerQuotationRepo.save(quotation);
            System.out.println("Successfully saved vehicle quotation with ID: " + savedQuotation.get_id());

            return ResponseEntity.ok(savedQuotation);

        } catch (Exception e) {
            System.err.println("Error submitting vehicle quotation: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error submitting vehicle quotation: " + e.getMessage());
        }
    }

    // Fixed endpoint to get submitted quotations by vehicle owner ID
    @GetMapping("/submittedQuotation/{vehicleOwnerId}")
    public ResponseEntity<?> getSubmittedQuotationsByVehicleOwner(@PathVariable String vehicleOwnerId) {
        System.out.println("Fetching submitted quotations for vehicle owner ID: " + vehicleOwnerId);

        try {
            // Step 1: Fetch all quotations submitted by this vehicle owner
            List<VehicleOwnerQuotation> quotations = vehicleOwnerQuotationRepo.findByOwnerId(vehicleOwnerId);

            if (quotations.isEmpty()) {
                System.out.println("No submitted quotations for vehicle owner ID: " + vehicleOwnerId);
                return ResponseEntity.ok(Collections.emptyList());
            }

            // Step 2: Join each quotation with its corresponding tour
            List<Map<String, Object>> resultList = new ArrayList<>();

            for (VehicleOwnerQuotation quotation : quotations) {
                Optional<PendingTrip> tourOptional = tourRepo.findById(quotation.getPendingTripId());

                if (tourOptional.isPresent()) {
                    PendingTrip tour = tourOptional.get();

                    Map<String, Object> data = new HashMap<>();
                    data.put("quotationId", quotation.get_id());
                    data.put("vehicleOwnerId", quotation.getOwnerId());
                    data.put("tourId", tour.getPtId());
                    data.put("tourDetails", tour);  // Entire Tour model
                    data.put("quotedAmount", quotation.getQuotedAmount());
                    data.put("quotationNotes", quotation.getQuotationNotes());
                    data.put("quotationDate", quotation.getQuotationDate());
                    data.put("status", quotation.getStatus());

                    resultList.add(data);
                }
            }

            System.out.println("Returning " + resultList.size() + " quotations for vehicle owner ID: " + vehicleOwnerId);
            return ResponseEntity.ok(resultList);

        } catch (Exception e) {
            System.err.println("Error fetching submitted quotations: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching submitted quotations");
        }
    }
}