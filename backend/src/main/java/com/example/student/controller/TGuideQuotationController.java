package com.example.student.controller;

import com.example.student.model.GuideQuotation;
import com.example.student.services.ITGuideQuotationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("api/guide-quotation")
@CrossOrigin
public class TGuideQuotationController {

    @Autowired
    private ITGuideQuotationService quotationService;

    // Create new quotation with PDF upload
    @PostMapping(value = "/create", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<GuideQuotation> createQuotation(
            @RequestParam("pendingTripId") String pendingTripId,
            @RequestParam("guideId") String guideId,
            @RequestParam("price") Double price,
            @RequestParam("quotationPdf") MultipartFile pdfFile) {
        try {
            if (pdfFile.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }

            // Validate file type
            if (!pdfFile.getContentType().equals("application/pdf")) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }

            GuideQuotation quotation = new GuideQuotation();
            quotation.setPendingTripId(pendingTripId);
            quotation.setGuideId(guideId);


            GuideQuotation createdQuotation = quotationService.createQuotation(quotation);
            return new ResponseEntity<>(createdQuotation, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Alternative create method with JSON (PDF as base64)
    @PostMapping("/create-json")
    public ResponseEntity<GuideQuotation> createQuotationJson(@RequestBody GuideQuotation quotation) {
        try {
            GuideQuotation createdQuotation = quotationService.createQuotation(quotation);
            return new ResponseEntity<>(createdQuotation, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get all quotations
    @GetMapping("/getall")
    public ResponseEntity<List<GuideQuotation>> getAllQuotations() {
        try {
            List<GuideQuotation> quotations = quotationService.getAllQuotations();
            return new ResponseEntity<>(quotations, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get quotation by ID
    @GetMapping("/get/{quotationId}")
    public ResponseEntity<GuideQuotation> getQuotationById(@PathVariable("quotationId") String quotationId) {
        try {
            Optional<GuideQuotation> quotation = quotationService.getQuotationById(quotationId);

            if (quotation.isPresent()) {
                return new ResponseEntity<>(quotation.get(), HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get quotations by pending trip ID
    @GetMapping("/trip/{pendingTripId}")
    public ResponseEntity<List<GuideQuotation>> getQuotationsByPendingTripId(@PathVariable("pendingTripId") String pendingTripId) {
        try {
            List<GuideQuotation> quotations = quotationService.getQuotationsByPendingTripId(pendingTripId);
            return new ResponseEntity<>(quotations, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get quotations by guide ID
    @GetMapping("/guide/{guideId}")
    public ResponseEntity<List<GuideQuotation>> getQuotationsByGuideId(@PathVariable("guideId") String guideId) {
        try {
            List<GuideQuotation> quotations = quotationService.getQuotationsByGuideId(guideId);
            return new ResponseEntity<>(quotations, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get quotations by pending trip ID and guide ID
    @GetMapping("/trip/{pendingTripId}/guide/{guideId}")
    public ResponseEntity<List<GuideQuotation>> getQuotationsByPendingTripIdAndGuideId(
            @PathVariable("pendingTripId") String pendingTripId,
            @PathVariable("guideId") String guideId) {
        try {
            List<GuideQuotation> quotations = quotationService.getQuotationsByPendingTripIdAndGuideId(pendingTripId, guideId);
            return new ResponseEntity<>(quotations, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Download PDF by quotation ID

}
