package com.example.student.controller;


import com.example.student.model.TVehicleQuotation;
import com.example.student.services.ITVehicleQuotationService;
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
@RequestMapping("api/quotation")
@CrossOrigin(origins = "*")
public class TVehicleQuotationController {

    @Autowired
    private ITVehicleQuotationService quotationService;

    // Create new quotation with PDF upload
    @PostMapping(value = "/create", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<TVehicleQuotation> createQuotation(
            @RequestParam("pendingTripId") String pendingTripId,
            @RequestParam("vehicleId") String vehicleId,
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

            TVehicleQuotation quotation = new TVehicleQuotation();
            quotation.setPendingTripId(pendingTripId);
            quotation.setVehicleId(vehicleId);
            quotation.setPrice(price);
            quotation.setQuotationPdf(pdfFile.getBytes());
            quotation.setPdfFilename(pdfFile.getOriginalFilename());
            quotation.setPdfContentType(pdfFile.getContentType());

            TVehicleQuotation createdQuotation = quotationService.createQuotation(quotation);
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
    public ResponseEntity<TVehicleQuotation> createQuotationJson(@RequestBody TVehicleQuotation quotation) {
        try {
            TVehicleQuotation createdQuotation = quotationService.createQuotation(quotation);
            return new ResponseEntity<>(createdQuotation, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get all quotations
    @GetMapping("/getall")
    public ResponseEntity<List<TVehicleQuotation>> getAllQuotations() {
        try {
            List<TVehicleQuotation> quotations = quotationService.getAllQuotations();
            return new ResponseEntity<>(quotations, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get quotation by ID
    @GetMapping("/get/{quotationId}")
    public ResponseEntity<TVehicleQuotation> getQuotationById(@PathVariable("quotationId") String quotationId) {
        try {
            Optional<TVehicleQuotation> quotation = quotationService.getQuotationById(quotationId);

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
    public ResponseEntity<List<TVehicleQuotation>> getQuotationsByPendingTripId(@PathVariable("pendingTripId") String pendingTripId) {
        try {
            List<TVehicleQuotation> quotations = quotationService.getQuotationsByPendingTripId(pendingTripId);
            return new ResponseEntity<>(quotations, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get quotations by vehicle ID
    @GetMapping("/vehicle/{vehicleId}")
    public ResponseEntity<List<TVehicleQuotation>> getQuotationsByVehicleId(@PathVariable("vehicleId") String vehicleId) {
        try {
            List<TVehicleQuotation> quotations = quotationService.getQuotationsByVehicleId(vehicleId);
            return new ResponseEntity<>(quotations, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get quotations by pending trip ID and vehicle ID
    @GetMapping("/trip/{pendingTripId}/vehicle/{vehicleId}")
    public ResponseEntity<List<TVehicleQuotation>> getQuotationsByPendingTripIdAndVehicleId(
            @PathVariable("pendingTripId") String pendingTripId,
            @PathVariable("vehicleId") String vehicleId) {
        try {
            List<TVehicleQuotation> quotations = quotationService.getQuotationsByPendingTripIdAndVehicleId(pendingTripId, vehicleId);
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
            Optional<TVehicleQuotation> quotation = quotationService.getQuotationById(quotationId);

            if (quotation.isPresent() && quotation.get().getQuotationPdf() != null) {
                TVehicleQuotation q = quotation.get();

                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_PDF);
                headers.setContentDispositionFormData("attachment",
                        q.getPdfFilename() != null ? q.getPdfFilename() : "quotation_" + quotationId + ".pdf");

                return new ResponseEntity<>(q.getQuotationPdf(), headers, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
