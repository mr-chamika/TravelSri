package com.example.student.controller;

import com.example.student.model.TGuideQuotation;
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
    public ResponseEntity<TGuideQuotation> createQuotation(
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

            TGuideQuotation quotation = new TGuideQuotation();
            quotation.setPendingTripId(pendingTripId);
            quotation.setGuideId(guideId);
            quotation.setPrice(price);
            quotation.setQuotationPdf(pdfFile.getBytes());
            quotation.setPdfFilename(pdfFile.getOriginalFilename());
            quotation.setPdfContentType(pdfFile.getContentType());

            TGuideQuotation createdQuotation = quotationService.createQuotation(quotation);
            return new ResponseEntity<>(createdQuotation, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (IOException e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Alternative create method with JSON (PDF as base64)
    @PostMapping("/create-json")
    public ResponseEntity<TGuideQuotation> createQuotationJson(@RequestBody TGuideQuotation quotation) {
        try {
            TGuideQuotation createdQuotation = quotationService.createQuotation(quotation);
            return new ResponseEntity<>(createdQuotation, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get all quotations
    @GetMapping("/getall")
    public ResponseEntity<List<TGuideQuotation>> getAllQuotations() {
        try {
            List<TGuideQuotation> quotations = quotationService.getAllQuotations();
            return new ResponseEntity<>(quotations, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get quotation by ID
    @GetMapping("/get/{quotationId}")
    public ResponseEntity<TGuideQuotation> getQuotationById(@PathVariable("quotationId") String quotationId) {
        try {
            Optional<TGuideQuotation> quotation = quotationService.getQuotationById(quotationId);

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
    public ResponseEntity<List<TGuideQuotation>> getQuotationsByPendingTripId(@PathVariable("pendingTripId") String pendingTripId) {
        try {
            List<TGuideQuotation> quotations = quotationService.getQuotationsByPendingTripId(pendingTripId);
            return new ResponseEntity<>(quotations, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get quotations by guide ID
    @GetMapping("/guide/{guideId}")
    public ResponseEntity<List<TGuideQuotation>> getQuotationsByGuideId(@PathVariable("guideId") String guideId) {
        try {
            List<TGuideQuotation> quotations = quotationService.getQuotationsByGuideId(guideId);
            return new ResponseEntity<>(quotations, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get quotations by pending trip ID and guide ID
    @GetMapping("/trip/{pendingTripId}/guide/{guideId}")
    public ResponseEntity<List<TGuideQuotation>> getQuotationsByPendingTripIdAndGuideId(
            @PathVariable("pendingTripId") String pendingTripId,
            @PathVariable("guideId") String guideId) {
        try {
            List<TGuideQuotation> quotations = quotationService.getQuotationsByPendingTripIdAndGuideId(pendingTripId, guideId);
            return new ResponseEntity<>(quotations, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Download PDF by quotation ID
    @GetMapping("/download-pdf/{quotationId}")
    public ResponseEntity<byte[]> downloadPdf(@PathVariable("quotationId") String quotationId) {
        try {
            Optional<TGuideQuotation> quotation = quotationService.getQuotationById(quotationId);

            if (quotation.isPresent() && quotation.get().getQuotationPdf() != null) {
                TGuideQuotation q = quotation.get();

                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_PDF);
                headers.setContentDispositionFormData("attachment",
                        q.getPdfFilename() != null ? q.getPdfFilename() : "guide_quotation_" + quotationId + ".pdf");

                return new ResponseEntity<>(q.getQuotationPdf(), headers, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
