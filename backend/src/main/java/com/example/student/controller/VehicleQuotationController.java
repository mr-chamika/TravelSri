package com.example.student.controller;

import com.example.student.model.PendingTrip;
import com.example.student.model.User;
import com.example.student.model.VehicleQuotation;
import com.example.student.repo.PendingTripRepo;
import com.example.student.repo.UserRepo;
import com.example.student.repo.VehicleQuotationRepo;
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
    private UserRepo userRepo;

    @Autowired
    private VehicleQuotationRepo quotationRepo;

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
            if (quotationRequest.getQuotedAmount() == null || quotationRequest.getQuotedAmount() <= 0) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Invalid amount provided");
            }

            Optional<PendingTrip> optionalTour = tourRepo.findById(tourId);
            if (optionalTour.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Tour not found with id: " + tourId);
            }

            PendingTrip tour = optionalTour.get();

            // Use userId from request body to set vehicleOwnerId
            String vehicleOwnerId = quotationRequest.getOwnerId();
            System.out.println("Using vehicle owner ID from request: " + vehicleOwnerId);

            // Proceed as before with this vehicleOwnerId
            Optional<VehicleOwnerQuotation> existingQuotation = vehicleOwnerQuotationRepo.findByPendingTripIdAndOwnerId(tourId, vehicleOwnerId);

            VehicleOwnerQuotation quotation;
            if (existingQuotation.isPresent()) {
                quotation = existingQuotation.get();
                quotation.setQuotedAmount(quotationRequest.getQuotedAmount());
                quotation.setQuotationNotes(quotationRequest.getQuotationNotes());
                quotation.setQuotationDate(new java.util.Date());
                quotation.setUpdatedAt(new java.util.Date());
                quotation.setStatus("pending");
                System.out.println("Updating existing vehicle quotation");
            } else {
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

            VehicleOwnerQuotation savedQuotation = vehicleOwnerQuotationRepo.save(quotation);
            System.out.println("Successfully saved vehicle quotation with ID: " + savedQuotation.get_id());

            return ResponseEntity.ok(savedQuotation);

        } catch (Exception e) {
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

    @GetMapping("/trip/{pendingTripId}")
    public ResponseEntity<List<VehicleQuotation>> getQuotationsByPendingTripId(@PathVariable("pendingTripId") String pendingTripId) {
        try {
            List<VehicleQuotation> quotations = quotationRepo.findByPendingTripId(pendingTripId);
            return new ResponseEntity<>(quotations, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/vehiclegroupTours")
    public List<PendingTrip> getUnsubmittedToursForGuide(@RequestParam String userId) {

        System.out.println("Received userId: " + userId);

        // Fetch guide's location using UserRepo
        Optional<User> userOpt = userRepo.findUserLocationById(userId);
        String guideLocation = userOpt.map(User::getLocation).orElse(null);

        System.out.println("Guide location for userId " + userId + ": " + guideLocation);

        if (guideLocation == null) {
            System.out.println("Guide location not found for userId: " + userId);
            return Collections.emptyList();
        }

        // Use PendingTripRepo to fetch trips starting from guide's location
        List<PendingTrip> allToursFromLocation = tourRepo.findByStartLocation(guideLocation);
        System.out.println("Total tours starting from guide location: " + allToursFromLocation.size());
        allToursFromLocation.forEach(t ->
                System.out.println("Tour ID: " + t.getPtId() + ", Start Location: " + t.getStartLocation())
        );

        // Fetch quotations by guideId
        List<VehicleQuotation> guideQuotations = quotationRepo.findByVehicleId(userId);
        System.out.println("Total quotations found for guide: " + guideQuotations.size());
        guideQuotations.forEach(q ->
                System.out.println("Quotation for PendingTrip ID: " + q.getPendingTripId())
        );

        Set<String> quotedTourIds = guideQuotations.stream()
                .map(q -> String.valueOf(q.getPendingTripId()))
                .collect(Collectors.toSet());
        System.out.println("Quoted Tour IDs set: " + quotedTourIds);

        // Filter tours where the guide has not sent any quotation yet
        List<PendingTrip> unsubmittedTours = allToursFromLocation.stream()
                .filter(tour -> !quotedTourIds.contains(String.valueOf(tour.getPtId())))
                .collect(Collectors.toList());

        System.out.println("Unsubmitted Tours count: " + unsubmittedTours.size());
        unsubmittedTours.forEach(t -> System.out.println("Unsubmitted Tour ID: " + t.getPtId()));

        return unsubmittedTours;
    }


}