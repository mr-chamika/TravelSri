package com.example.student.controller;

import com.example.student.model.AccommodationQuotation;
import com.example.student.services.AccommodationQuotationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/quotations")
@CrossOrigin// Enable CORS for development
public class AccommodationQuotationController {

    @Autowired
    private AccommodationQuotationService service;

    @PostMapping
    public AccommodationQuotation createQuotation(@RequestBody AccommodationQuotation quotation) {
        return service.saveQuotation(quotation);
    }

    @GetMapping
    public List<AccommodationQuotation> getAllQuotations() {
        return service.getAllQuotations();
    }

    @GetMapping("/{id}")
    public AccommodationQuotation getQuotation(@PathVariable String id) {
        return service.getQuotationById(id);
    }

    @PutMapping("/{id}")
    public AccommodationQuotation updateQuotation(@PathVariable String id, @RequestBody AccommodationQuotation quotation) {
        quotation.setId(id); // Ensure ID is set correctly
        return service.saveQuotation(quotation);
    }
    
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateQuotationStatus(
            @PathVariable String id, 
            @RequestBody Map<String, Object> statusUpdate) {
        
        try {
            // Get current quotation
            AccommodationQuotation quotation = service.getQuotationById(id);
            if (quotation == null) {
                return ResponseEntity.notFound().build();
            }
            
            // Update status if provided
            if (statusUpdate.containsKey("status")) {
                String newStatus = (String) statusUpdate.get("status");
                // You might need to add a status field to your AccommodationQuotation model
                // quotation.setStatus(newStatus);
            }
            
            // Update notes if provided
            if (statusUpdate.containsKey("notes")) {
                String notes = (String) statusUpdate.get("notes");
                // Add notes field if you need it
                // quotation.setNotes(notes);
            }
            
            // Save updated quotation
            AccommodationQuotation updated = service.saveQuotation(quotation);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Failed to update status",
                "message", e.getMessage()
            ));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteQuotation(@PathVariable String id) {
        try {
            service.deleteQuotation(id);
            return ResponseEntity.ok(Map.of("success", true, "id", id));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "error", "Failed to delete quotation",
                "message", e.getMessage()
            ));
        }
    }
}