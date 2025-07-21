package com.example.student.controller;

import com.example.student.model.VehicleOwnerQuotationRequest;
import com.example.student.model.Vehicle;
import com.example.student.repo.VehicleRepo;
import com.example.student.repo.tourRepo;
import com.example.student.repo.VehicleOwnerQuotationRepo;
import com.example.student.model.Tour;
import com.example.student.model.VehicleOwnerQuotation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@CrossOrigin
@RequestMapping("/vehicle")
public class VehicleController {

    @Autowired
    private VehicleRepo vehicleRepo;

    @Autowired
    private tourRepo tourRepo;

    @Autowired
    private VehicleOwnerQuotationRepo vehicleOwnerQuotationRepo;

    // Vehicle owner ID - should come from authentication context
    private String vehicleOwnerId = "TEMP_VEHICLE_OWNER_ID_001";

    @PostMapping("/addVehicle")
    public ResponseEntity<String> AddVehicle(@RequestBody Vehicle vehicle){
        Vehicle x = vehicleRepo.save(vehicle);

        if(x != null){
            return ResponseEntity.ok("Successfully added.");
        }

        return ResponseEntity.badRequest().body("Failed");
    }

    @GetMapping("/all")
    public ResponseEntity<List<Vehicle>> getAllVehicles() {
        List<Vehicle> vehicles = vehicleRepo.findAll();
        return ResponseEntity.ok(vehicles);
    }

    @GetMapping("/edit")
    public ResponseEntity<Vehicle> getVehicleById(@RequestParam String id) {
        Optional<Vehicle> vehicle = vehicleRepo.findById(id);
        return vehicle.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/groupTours")
    public List<Tour> getUnsubmittedToursForVehicleOwner() {
        List<Tour> allTours = tourRepo.findAll();
        // Changed from findByVehicleOwnerId to findByOwnerId (as per your repo interface)
        List<VehicleOwnerQuotation> vehicleOwnerQuotations = vehicleOwnerQuotationRepo.findByOwnerId(vehicleOwnerId);

        System.out.println("All Tours:");
        allTours.forEach(t -> System.out.println("Tour ID: " + t.get_id()));

        System.out.println("Vehicle Owner Quotations:");
        vehicleOwnerQuotations.forEach(q -> System.out.println("Tour ID: " + q.getTourId() + ", Vehicle Owner ID: " + vehicleOwnerId));

        Set<String> quotedTourIds = vehicleOwnerQuotations.stream()
                .map(q -> String.valueOf(q.getTourId()))
                .collect(Collectors.toSet());

        System.out.println("Quoted Tour IDs by Vehicle Owner:");
        quotedTourIds.forEach(System.out::println);

        List<Tour> unsubmittedTours = allTours.stream()
                .filter(tour -> !quotedTourIds.contains(String.valueOf(tour.get_id())))
                .collect(Collectors.toList());

        System.out.println("Unsubmitted Tours:");
        unsubmittedTours.forEach(t -> System.out.println("Tour ID: " + t.get_id()));

        return unsubmittedTours;
    }

    @PutMapping("/submitQuotation/{tourId}")
    public ResponseEntity<?> submitVehicleQuotationPrice(@PathVariable String tourId, @RequestBody VehicleOwnerQuotationRequest quotationRequest) {
        System.out.println("Received vehicle quotation request for tour ID: " + tourId);
        System.out.println("Vehicle quotation data: " + quotationRequest);

        try {
            // Validate input
            if (quotationRequest.getAmount() == null || quotationRequest.getAmount() <= 0) {
                System.out.println("Invalid amount: " + quotationRequest.getAmount());
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Invalid amount provided");
            }

            // Check if tour exists
            Optional<Tour> optionalTour = tourRepo.findById(tourId);
            if (optionalTour.isEmpty()) {
                System.out.println("Tour not found with ID: " + tourId);
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Tour not found with id: " + tourId);
            }

            Tour tour = optionalTour.get();
            System.out.println("Found tour: " + tour.getTourTitle());

            // Get vehicle owner ID from request body (allows temporary owner IDs)
//            String vehicleOwnerId = quotationRequest.getVehicleOwnerId();

            // If vehicle owner ID is not in the request, try to get it from tour
            if (vehicleOwnerId == null || vehicleOwnerId.isEmpty()) {
                vehicleOwnerId = tour.getVehicleOwnerId();
            }

            // If still no vehicle owner ID, use a default temporary one
            if (vehicleOwnerId == null || vehicleOwnerId.isEmpty()) {
                vehicleOwnerId = "TEMP_VEHICLE_OWNER_ID_001";
                System.out.println("Using default temporary vehicle owner ID: " + vehicleOwnerId);
            }

            System.out.println("Using vehicle owner ID: " + vehicleOwnerId);

            // Check if quotation already exists for this tour and vehicle owner
            Optional<VehicleOwnerQuotation> existingQuotation = vehicleOwnerQuotationRepo.findByTourIdAndOwnerId(tourId, vehicleOwnerId);

            VehicleOwnerQuotation quotation;
            if (existingQuotation.isPresent()) {
                // Update existing quotation
                quotation = existingQuotation.get();
                quotation.setQuotedAmount(quotationRequest.getAmount());
                quotation.setQuotationNotes(quotationRequest.getNotes());
                quotation.setQuotationDate(new java.util.Date());
                quotation.setUpdatedAt(new java.util.Date());
                quotation.setStatus("pending"); // Reset status to pending
                System.out.println("Updating existing vehicle quotation");
            } else {
                // Create new quotation
                quotation = new VehicleOwnerQuotation();
                quotation.setTourId(tourId);
                quotation.setOwnerId(vehicleOwnerId);
                quotation.setQuotedAmount(quotationRequest.getAmount());
                quotation.setQuotationNotes(quotationRequest.getNotes());
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
                Optional<Tour> tourOptional = tourRepo.findById(quotation.getTourId());

                if (tourOptional.isPresent()) {
                    Tour tour = tourOptional.get();

                    Map<String, Object> data = new HashMap<>();
                    data.put("quotationId", quotation.get_id());
                    data.put("vehicleOwnerId", quotation.getOwnerId());
                    data.put("tourId", tour.get_id());
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