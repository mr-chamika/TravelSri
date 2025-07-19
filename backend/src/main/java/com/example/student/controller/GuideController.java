package com.example.student.controller;

import com.example.student.repo.GuideRepo;
import com.example.student.repo.GuideQuotationRepo;
import com.example.student.model.Tour;
import com.example.student.model.GuideQuotation;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

@RestController
@CrossOrigin(origins = "http://localhost:8082")
@RequestMapping("/guide")
public class GuideController {

    @Autowired
    private GuideRepo guideRepo;

    @Autowired
    private GuideQuotationRepo quotationRepo;

    @GetMapping("/")
    public void redirectToSwagger(HttpServletResponse response) throws IOException {
        response.sendRedirect("/swagger-ui/index.html");
    }

    public List<GuideQuotation> allQuotations() {
        return quotationRepo.findAll();
    }

    private String guideid = "TEMP_GUIDE_ID_001";

    @GetMapping("/groupTours")
    public List<Tour> getUnsubmittedToursForGuide() {
        List<Tour> allTours = guideRepo.findAll();
        List<GuideQuotation> guideQuotations = quotationRepo.findByGuideId(guideid);

        System.out.println("All Tours:");
        allTours.forEach(t -> System.out.println("Tour ID: " + t.get_id()));

        System.out.println("Guide Quotations:");
        guideQuotations.forEach(q -> System.out.println("Tour ID: " + q.getTourId() + ", Guide ID: " + q.getGuideId()));

        Set<String> quotedTourIds = guideQuotations.stream()
                .map(q -> String.valueOf(q.getTourId()))
                .collect(Collectors.toSet());

        System.out.println("Quoted Tour IDs by Guide:");
        quotedTourIds.forEach(System.out::println);

        List<Tour> unsubmittedTours = allTours.stream()
                .filter(tour -> !quotedTourIds.contains(String.valueOf(tour.get_id())))
                .collect(Collectors.toList());

        System.out.println("Unsubmitted Tours:");
        unsubmittedTours.forEach(t -> System.out.println("Tour ID: " + t.get_id()));

        return unsubmittedTours;
    }

    @PostMapping("/quotation")
    public Tour addQuotation(@RequestBody Tour guide) {
        return guideRepo.save(guide);
    }

    // Fixed endpoint to submit quotation price - now accepts tourId in path and data in body
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
            Optional<Tour> optionalTour = guideRepo.findById(tourId);
            if (optionalTour.isEmpty()) {
                System.out.println("Tour not found with ID: " + tourId);
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Tour not found with id: " + tourId);
            }

            Tour tour = optionalTour.get();
            System.out.println("Found tour: " + tour.getTourTitle());

            // Get guide ID from request body (allows temporary guide IDs)
            String guideId = quotationRequest.getGuideId();

            // If guide ID is not in the request, try to get it from tour
            if (guideId == null || guideId.isEmpty()) {
                guideId = tour.getGuideId();
            }

            // If still no guide ID, use a default temporary one
            if (guideId == null || guideId.isEmpty()) {
                guideId = "TEMP_GUIDE_ID_001";
                System.out.println("Using default temporary guide ID: " + guideId);
            }

            System.out.println("Using guide ID: " + guideId);

            // Check if quotation already exists for this tour and guide
            Optional<GuideQuotation> existingQuotation = quotationRepo.findByTourIdAndGuideId(tourId, guideId);

            GuideQuotation quotation;
            if (existingQuotation.isPresent()) {
                // Update existing quotation
                quotation = existingQuotation.get();
                quotation.setQuotedAmount(quotationRequest.getAmount());
                quotation.setQuotationNotes(quotationRequest.getNotes());
                quotation.setQuotationDate(new java.util.Date());
                quotation.setUpdatedAt(new java.util.Date());
                quotation.setStatus("pending"); // Reset status to pending
                System.out.println("Updating existing quotation");
            } else {
                // Create new quotation
                quotation = new GuideQuotation(tourId, guideId, quotationRequest.getAmount(), quotationRequest.getNotes());
                System.out.println("Creating new quotation");
            }

            // Save the quotation to guide_quotation collection
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

    // Fixed endpoint to get submitted quotations by guide ID
    @GetMapping("/submittedQuotation/{guideId}")
    public ResponseEntity<?> getSubmittedQuotationsByGuide(@PathVariable String guideId) {
        System.out.println("Fetching submitted quotations for guide ID: " + guideId);

        try {
            // Step 1: Fetch all quotations submitted by this guide
            List<GuideQuotation> quotations = quotationRepo.findByGuideId(guideId);

            if (quotations.isEmpty()) {
                System.out.println("No submitted quotations for guide ID: " + guideId);
                return ResponseEntity.ok(Collections.emptyList());
            }

            // Step 2: Join each quotation with its corresponding tour
            List<Map<String, Object>> resultList = new ArrayList<>();

            for (GuideQuotation quotation : quotations) {
                Optional<Tour> tourOptional = guideRepo.findById(quotation.getTourId());

                if (tourOptional.isPresent()) {
                    Tour tour = tourOptional.get();

                    Map<String, Object> data = new HashMap<>();
                    data.put("quotationId", quotation.get_id());
                    data.put("guideId", quotation.getGuideId());
                    data.put("tourId", tour.get_id());
                    data.put("tourDetails", tour);  // Entire Tour model
                    data.put("quotedAmount", quotation.getQuotedAmount());
                    data.put("quotationNotes", quotation.getQuotationNotes());
                    data.put("quotationDate", quotation.getQuotationDate());
                    data.put("status", quotation.getStatus());

                    resultList.add(data);
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
            List<GuideQuotation> quotations = quotationRepo.findByTourId(tourId);
            return ResponseEntity.ok(quotations);
        } catch (Exception e) {
            System.err.println("Error fetching quotations: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Inner class for quotation request with toString method
    public static class QuotationRequest {
        private Double amount;
        private String notes;
        private String guideId; // Added guideId field

        // Constructors
        public QuotationRequest() {}

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