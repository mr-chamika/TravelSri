package com.example.student.controller;

import com.example.student.model.GuideQuotation;
import com.example.student.model.PendingTrip;
import com.example.student.model.User;
import com.example.student.repo.GuideQuotationRepo;
import com.example.student.repo.PendingTripRepo;
import com.example.student.repo.UserRepo;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@CrossOrigin
@RequestMapping("/api/guide")
public class GuideQuotationController {

    @Autowired
    private PendingTripRepo guideTourRepo;

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private GuideQuotationRepo quotationRepo;

    @Autowired
    private PendingTripRepo pendingTripRepo;

    @GetMapping("/")
    public void redirectToSwagger(HttpServletResponse response) throws IOException {
        response.sendRedirect("/swagger-ui/index.html");
    }

    public List<GuideQuotation> allQuotations() {
        return quotationRepo.findAll();
    }

    private String guideid = "TEMP_GUIDE_ID_001";


    //to fetch pending trips that unsubmitted
    @GetMapping("/groupTours")
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
        List<PendingTrip> allToursFromLocation = pendingTripRepo.findByStartLocation(guideLocation);
        System.out.println("Total tours starting from guide location: " + allToursFromLocation.size());
        allToursFromLocation.forEach(t ->
                System.out.println("Tour ID: " + t.getPtId() + ", Start Location: " + t.getStartLocation())
        );

        // Fetch quotations by guideId
        List<GuideQuotation> guideQuotations = quotationRepo.findByGuideId(userId);
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

    @PutMapping("/submitQuotation/{tourId}")
    public ResponseEntity<?> submitQuotationPrice(@PathVariable String tourId, @RequestBody QuotationRequest quotationRequest) {
        System.out.println("Received quotation request for tour ID: " + tourId);
        System.out.println("Quotation data: " + quotationRequest);

        try {
            // Validate input
            if (quotationRequest.getAmount() == null || quotationRequest.getAmount() <= 0) {
                System.out.println("Invalid amount: " + quotationRequest.getAmount());
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Invalid amount provided");
            }

            // Check if tour exists
            Optional<PendingTrip> optionalTour = guideTourRepo.findById(tourId);
            if (optionalTour.isEmpty()) {
                System.out.println("Tour not found with ID: " + tourId);
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Tour not found with id: " + tourId);
            }

            PendingTrip tour = optionalTour.get();
            System.out.println("Found tour: " + tour.getTitle());

            // Get guide ID from request body or fallback to tour's guideId or default
            String guideId = quotationRequest.getGuideId();
            if (guideId == null || guideId.isEmpty()) {
                guideId = tour.getGuideId();
            }
            if (guideId == null || guideId.isEmpty()) {
                guideId = "TEMP_GUIDE_ID_001";
                System.out.println("Using default temporary guide ID: " + guideId);
            }
            System.out.println("Using guide ID: " + guideId);

            // Check if quotation already exists
            Optional<GuideQuotation> existingQuotation = quotationRepo.findByPendingTripIdAndGuideId(tourId, guideId);

            GuideQuotation quotation;
            if (existingQuotation.isPresent()) {
                // Update existing quotation
                quotation = existingQuotation.get();
                quotation.setQuotedAmount(quotationRequest.getAmount());
                quotation.setQuotationNotes(quotationRequest.getNotes());
                quotation.setQuotationDate(new Date());
                quotation.setUpdatedAt(new Date());
                quotation.setStatus("pending"); // Reset status to pending
                System.out.println("Updating existing quotation");
            } else {
                // Create new quotation
                quotation = new GuideQuotation(tourId, guideId, quotationRequest.getAmount(), quotationRequest.getNotes());
                System.out.println("Creating new quotation");
            }

            // Save to DB
            GuideQuotation savedQuotation = quotationRepo.save(quotation);
            System.out.println("Successfully saved quotation with ID: " + savedQuotation.get_id());

            return ResponseEntity.ok(savedQuotation);

        } catch (Exception e) {
            System.err.println("Error submitting quotation: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error submitting quotation: " + e.getMessage());
        }
    }


    @PostMapping("/quotation")
    public PendingTrip addQuotation(@RequestBody PendingTrip guide) {
        return guideTourRepo.save(guide);
    }



    // Fixed endpoint to get submitted quotations by guide ID
    @GetMapping("/submittedQuotation/{guideId}")
    public ResponseEntity<?> getSubmittedQuotationsByGuide(@PathVariable String guideId) {
        System.out.println("Fetching submitted quotations for guide ID: " + guideId);

        try {
            List<GuideQuotation> quotations = quotationRepo.findByGuideId(guideId);

            if (quotations.isEmpty()) {
                System.out.println("No submitted quotations for guide ID: " + guideId);
                return ResponseEntity.ok(Collections.emptyList());
            }

            List<Map<String, Object>> resultList = new ArrayList<>();

            for (GuideQuotation quotation : quotations) {
                String pendingTripId = quotation.getPendingTripId();
                if (pendingTripId == null || pendingTripId.trim().isEmpty()) {
                    System.out.println("Warning: Quotation " + quotation.get_id() + " has null/empty pendingTripId");
                    continue;
                }

                Optional<PendingTrip> tourOptional = guideTourRepo.findById(pendingTripId);

                if (tourOptional.isPresent()) {
                    PendingTrip tour = tourOptional.get();

                    Map<String, Object> data = new HashMap<>();
                    data.put("quotationId", quotation.get_id());
                    data.put("guideId", quotation.getGuideId());
                    data.put("tourId", tour.getPtId());
                    data.put("tourDetails", tour);
                    data.put("quotedAmount", quotation.getQuotedAmount());
                    data.put("quotationNotes", quotation.getQuotationNotes());
                    data.put("quotationDate", quotation.getQuotationDate());
                    data.put("status", quotation.getStatus());

                    // Log the combined data before adding
                    System.out.println("Prepared Quotation Data to send: " + data);

                    resultList.add(data);
                } else {
                    System.out.println("Warning: No tour found for pendingTripId: " + pendingTripId);
                }
            }

            System.out.println("Returning " + resultList.size() + " quotations for guide ID: " + guideId);
            return ResponseEntity.ok(resultList);

        } catch (Exception e) {
            System.err.println("Error fetching submitted quotations: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching submitted quotations");
        }
    }


    //not link or implement with ui
    @DeleteMapping("/withdrawQuotation/{quotationId}")
    public ResponseEntity<?> withdrawQuotation(@PathVariable String quotationId) {
        System.out.println("Request to withdraw quotation ID: " + quotationId);

        try {
            Optional<GuideQuotation> quotationOpt = quotationRepo.findById(quotationId);

            if (quotationOpt.isEmpty()) {
                System.out.println("Quotation not found with ID: " + quotationId);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Quotation not found");
            }

            GuideQuotation quotation = quotationOpt.get();

            // Option 1: Soft delete by updating status
            quotation.setStatus("withdrawn");
            quotation.setUpdatedAt(new Date());
            quotationRepo.save(quotation);

            // Option 2: Hard delete by uncommenting the next line instead
            // quotationRepo.deleteById(quotationId);

            System.out.println("Quotation withdrawn successfully for ID: " + quotationId);
            return ResponseEntity.ok("Quotation withdrawn successfully");

        } catch (Exception e) {
            System.err.println("Error withdrawing quotation: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error withdrawing quotation");
        }
    }



    // Get quotations by guide ID
    @GetMapping("/quotations/{guideId}")
    public ResponseEntity<List<GuideQuotation>> getQuotationsByGuideId(@PathVariable String guideId) {
        try {
            List<GuideQuotation> quotations = quotationRepo.findByGuideId(guideId);
            return ResponseEntity.ok(quotations);
        } catch (Exception e) {
            System.err.println("Error fetching quotations: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Get quotations by tour ID
    @GetMapping("/quotations/tour/{tourId}")
    public ResponseEntity<List<GuideQuotation>> getQuotationsByTourId(@PathVariable String tourId) {
        try {
            List<GuideQuotation> quotations = quotationRepo.findByPendingTripId(tourId);
            return ResponseEntity.ok(quotations);
        } catch (Exception e) {
            System.err.println("Error fetching quotations: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

//    /**
//     * NEW ENDPOINT: Get all guide quotations for a specific pending trip
//     * @param pendingTripId The ID of the pending trip
//     * @return List of guide quotations for the specified trip
//     */
//    @GetMapping("/quotations/pendingTrip/{pendingTripId}")
//    public ResponseEntity<?> getQuotationsByPendingTripId(@PathVariable String pendingTripId) {
//        System.out.println("Fetching guide quotations for pending trip ID: " + pendingTripId);
//
//        try {
//            // Validate input
//            if (pendingTripId == null || pendingTripId.trim().isEmpty()) {
//                System.out.println("Invalid pending trip ID provided");
//                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
//                        .body("Pending trip ID cannot be null or empty");
//            }
//
//            // Check if the pending trip exists
//            Optional<PendingTrip> tripOptional = guideTourRepo.findById(pendingTripId);
//            if (tripOptional.isEmpty()) {
//                System.out.println("Pending trip not found with ID: " + pendingTripId);
//                return ResponseEntity.status(HttpStatus.NOT_FOUND)
//                        .body("Pending trip not found with id: " + pendingTripId);
//            }
//
//            // Fetch quotations for the pending trip
//            List<GuideQuotation> quotations = quotationRepo.findByPendingTripId(pendingTripId);
//
//            if (quotations.isEmpty()) {
//                System.out.println("No quotations found for pending trip ID: " + pendingTripId);
//                return ResponseEntity.ok(Collections.emptyList());
//            }
//
//            // Optionally, you can enhance the response with additional trip details
//            PendingTrip trip = tripOptional.get();
//            Map<String, Object> response = new HashMap<>();
//            response.put("pendingTripId", pendingTripId);
//            response.put("tripTitle", trip.getTitle());
//            response.put("tripDetails", trip);
//            response.put("quotationsCount", quotations.size());
//            response.put("quotations", quotations);
//
//            System.out.println("Found " + quotations.size() + " quotations for pending trip ID: " + pendingTripId);
//            return ResponseEntity.ok(response);
//
//        } catch (Exception e) {
//            System.err.println("Error fetching quotations for pending trip: " + e.getMessage());
//            e.printStackTrace();
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                    .body("Error fetching quotations: " + e.getMessage());
//        }
//    }
    
    @GetMapping("/trip/{pendingTripId}")
public ResponseEntity<List<GuideQuotation>> getQuotationsByPendingTripId(@PathVariable("pendingTripId") String pendingTripId) {


        try {
            System.out.println("heeeeee"+pendingTripId);

        List<GuideQuotation> quotations = quotationRepo.findByPendingTripId(pendingTripId);
        System.out.println(quotations);
        return new ResponseEntity<>(quotations, HttpStatus.OK);
    } catch (IllegalArgumentException e) {
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    } catch (Exception e) {
        return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

    /**
     * NEW ENDPOINT: Get guide quotations by pending trip ID with detailed information
     * This version includes enhanced details and statistics
     * @param pendingTripId The ID of the pending trip
     * @return Enhanced list of guide quotations with additional details
     */
    @GetMapping("/quotations/pendingTrip/{pendingTripId}/detailed")
    public ResponseEntity<?> getDetailedQuotationsByPendingTripId(@PathVariable String pendingTripId) {
        System.out.println("Fetching detailed guide quotations for pending trip ID: " + pendingTripId);
        
        try {
            // Validate input
            if (pendingTripId == null || pendingTripId.trim().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Pending trip ID cannot be null or empty");
            }

            // Check if the pending trip exists
            Optional<PendingTrip> tripOptional = guideTourRepo.findById(pendingTripId);
            if (tripOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Pending trip not found with id: " + pendingTripId);
            }

            // Fetch quotations for the pending trip
            List<GuideQuotation> quotations = quotationRepo.findByPendingTripId(pendingTripId);
            
            if (quotations.isEmpty()) {
                System.out.println("No quotations found for pending trip ID: " + pendingTripId);
                return ResponseEntity.ok(Collections.emptyMap());
            }

            // Create detailed response with statistics
            PendingTrip trip = tripOptional.get();
            List<Map<String, Object>> detailedQuotations = new ArrayList<>();
            
            for (GuideQuotation quotation : quotations) {
                Map<String, Object> quotationDetails = new HashMap<>();
                quotationDetails.put("quotationId", quotation.get_id());
                quotationDetails.put("guideId", quotation.getGuideId());
                quotationDetails.put("quotedAmount", quotation.getQuotedAmount());
                quotationDetails.put("quotationNotes", quotation.getQuotationNotes());
                quotationDetails.put("quotationDate", quotation.getQuotationDate());
                quotationDetails.put("status", quotation.getStatus());
                quotationDetails.put("createdAt", quotation.getCreatedAt());
                quotationDetails.put("updatedAt", quotation.getUpdatedAt());
                
                detailedQuotations.add(quotationDetails);
            }

            // Calculate statistics
            Map<String, Object> statistics = new HashMap<>();
            statistics.put("totalQuotations", quotations.size());
            statistics.put("pendingQuotations", quotations.stream().filter(q -> "pending".equals(q.getStatus())).count());
            statistics.put("acceptedQuotations", quotations.stream().filter(q -> "accepted".equals(q.getStatus())).count());
            statistics.put("rejectedQuotations", quotations.stream().filter(q -> "rejected".equals(q.getStatus())).count());
            
            // Price statistics
            OptionalDouble minAmount = quotations.stream()
                    .filter(q -> q.getQuotedAmount() != null)
                    .mapToDouble(GuideQuotation::getQuotedAmount)
                    .min();
            OptionalDouble maxAmount = quotations.stream()
                    .filter(q -> q.getQuotedAmount() != null)
                    .mapToDouble(GuideQuotation::getQuotedAmount)
                    .max();
            OptionalDouble avgAmount = quotations.stream()
                    .filter(q -> q.getQuotedAmount() != null)
                    .mapToDouble(GuideQuotation::getQuotedAmount)
                    .average();
            
            statistics.put("minQuotedAmount", minAmount.isPresent() ? minAmount.getAsDouble() : 0.0);
            statistics.put("maxQuotedAmount", maxAmount.isPresent() ? maxAmount.getAsDouble() : 0.0);
            statistics.put("averageQuotedAmount", avgAmount.isPresent() ? avgAmount.getAsDouble() : 0.0);

            // Build final response
            Map<String, Object> response = new HashMap<>();
            response.put("pendingTripId", pendingTripId);
            response.put("tripDetails", trip);
            response.put("statistics", statistics);
            response.put("quotations", detailedQuotations);

            System.out.println("Found " + quotations.size() + " detailed quotations for pending trip ID: " + pendingTripId);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.err.println("Error fetching detailed quotations for pending trip: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching detailed quotations: " + e.getMessage());
        }
    }

    /**
     * NEW ENDPOINT: Get guide quotations by pending trip ID and status
     * @param pendingTripId The ID of the pending trip
     * @param status The status to filter by (pending, accepted, rejected, expired)
     * @return List of guide quotations matching the criteria
     */
    @GetMapping("/quotations/pendingTrip/{pendingTripId}/status/{status}")
    public ResponseEntity<?> getQuotationsByPendingTripIdAndStatus(
            @PathVariable String pendingTripId,
            @PathVariable String status) {

        System.out.println("Fetching guide quotations for pending trip ID: " + pendingTripId + " with status: " + status);

        try {
            // Validate input
            if (pendingTripId == null || pendingTripId.trim().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Pending trip ID cannot be null or empty");
            }
            
            if (status == null || status.trim().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Status cannot be null or empty");
            }

            // Check if the pending trip exists
            Optional<PendingTrip> tripOptional = guideTourRepo.findById(pendingTripId);
            if (tripOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Pending trip not found with id: " + pendingTripId);
            }

            // Fetch all quotations for the trip
            List<GuideQuotation> allQuotations = quotationRepo.findByPendingTripId(pendingTripId);
            
            // Filter by status
            List<GuideQuotation> filteredQuotations = allQuotations.stream()
                    .filter(q -> status.equalsIgnoreCase(q.getStatus()))
                    .collect(Collectors.toList());

            System.out.println("Found " + filteredQuotations.size() + " quotations with status '" + status + "' for pending trip ID: " + pendingTripId);
            return ResponseEntity.ok(filteredQuotations);

        } catch (Exception e) {
            System.err.println("Error fetching quotations by status: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching quotations: " + e.getMessage());
        }
    }

    /**
     * NEW ENDPOINT: Update quotation status (accept/reject)
     * @param quotationId The ID of the quotation
     * @return Updated quotation
     */
    @PutMapping("/quotations/{quotationId}/status")
    public ResponseEntity<?> updateQuotationStatus(
            @PathVariable String quotationId, 
            @RequestBody Map<String, String> statusUpdate) {
        
        System.out.println("Updating quotation status for ID: " + quotationId);
        
        try {
            String newStatus = statusUpdate.get("status");
            String reason = statusUpdate.get("reason"); // Optional reason for rejection
            
            // Validate input
            if (quotationId == null || quotationId.trim().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Quotation ID cannot be null or empty");
            }
            
            if (newStatus == null || newStatus.trim().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Status cannot be null or empty");
            }

            // Check if quotation exists
            Optional<GuideQuotation> quotationOptional = quotationRepo.findById(quotationId);
            if (quotationOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Quotation not found with id: " + quotationId);
            }

            GuideQuotation quotation = quotationOptional.get();
            quotation.setStatus(newStatus);
            quotation.setUpdatedAt(new Date());
            
            // Add reason to notes if rejecting
            if ("rejected".equalsIgnoreCase(newStatus) && reason != null && !reason.trim().isEmpty()) {
                String currentNotes = quotation.getQuotationNotes() != null ? quotation.getQuotationNotes() : "";
                quotation.setQuotationNotes(currentNotes + "\n[REJECTED] Reason: " + reason);
            }

            GuideQuotation updatedQuotation = quotationRepo.save(quotation);
            System.out.println("Successfully updated quotation status to: " + newStatus);
            
            return ResponseEntity.ok(updatedQuotation);

        } catch (Exception e) {
            System.err.println("Error updating quotation status: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating quotation status: " + e.getMessage());
        }
    }

    // Inner class for quotation request with toString method
    public static class QuotationRequest {
        private Double amount;
        private String notes;
        private String guideId; // Added guideId field

        // Constructors
        public QuotationRequest() {
        }

        public QuotationRequest(Double amount, String notes) {
            this.amount = amount;
            this.notes = notes;
        }

        public QuotationRequest(Double amount, String notes, String guideId) {
            this.amount = amount;
            this.notes = notes;
            this.guideId = guideId;
        }

        // Getters and setters
        public Double getAmount() {
            return amount;
        }

        public void setAmount(Double amount) {
            this.amount = amount;
        }

        public String getNotes() {
            return notes;
        }

        public void setNotes(String notes) {
            this.notes = notes;
        }

        public String getGuideId() {
            return guideId;
        }

        public void setGuideId(String guideId) {
            this.guideId = guideId;
        }

        @Override
        public String toString() {
            return "QuotationRequest{" +
                    "amount=" + amount +
                    ", notes='" + notes + '\'' +
                    ", guideId='" + guideId + '\'' +
                    '}';
        }
    }
}