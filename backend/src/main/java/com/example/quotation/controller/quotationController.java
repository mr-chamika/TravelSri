package com.example.quotation.controller;

import com.example.quotation.model.quotation;
import com.example.quotation.service.quotationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/quotations")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class quotationController {

    @Autowired
    private quotationService quotationService;

    // GET /api/quotations - Get all quotations
    @GetMapping
    public ResponseEntity<List<quotation>> getAllQuotations() {
        try {
            List<quotation> quotations = quotationService.getAllQuotations();
            return new ResponseEntity<>(quotations, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // GET /api/quotations/{id} - Get quotation by ID
    @GetMapping("/{id}")
    public ResponseEntity<quotation> getQuotationById(@PathVariable String id) {
        try {
            Optional<quotation> quotation = quotationService.getQuotationById(id);
            return quotation.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                    .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // GET /api/quotations/number/{quotationNumber} - Get quotation by number
    @GetMapping("/number/{quotationNumber}")
    public ResponseEntity<quotation> getQuotationByNumber(@PathVariable String quotationNumber) {
        try {
            Optional<quotation> quotation = quotationService.getQuotationByNumber(quotationNumber);
            return quotation.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                    .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // POST /api/quotations - Create new quotation
    @PostMapping
    public ResponseEntity<quotation> createQuotation(@RequestBody quotation quotation) {
        try {
            quotation createdQuotation = quotationService.createQuotation(quotation);
            return new ResponseEntity<>(createdQuotation, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // PUT /api/quotations/{id} - Update quotation
    @PutMapping("/{id}")
    public ResponseEntity<quotation> updateQuotation(@PathVariable String id, @RequestBody quotation quotation) {
        try {
            quotation updatedQuotation = quotationService.updateQuotation(id, quotation);
            if (updatedQuotation != null) {
                return new ResponseEntity<>(updatedQuotation, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // DELETE /api/quotations/{id} - Delete quotation
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteQuotation(@PathVariable String id) {
        try {
            boolean deleted = quotationService.deleteQuotation(id);
            if (deleted) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // GET /api/quotations/search?customerName={name} - Search by customer name
    @GetMapping("/search")
    public ResponseEntity<List<quotation>> searchQuotations(@RequestParam String customerName) {
        try {
            List<quotation> quotations = quotationService.searchByCustomerName(customerName);
            return new ResponseEntity<>(quotations, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // GET /api/quotations/status/{status} - Get quotations by status
    @GetMapping("/status/{status}")
    public ResponseEntity<List<quotation>> getQuotationsByStatus(@PathVariable String status) {
        try {
            List<quotation> quotations = quotationService.getQuotationsByStatus(status);
            return new ResponseEntity<>(quotations, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}