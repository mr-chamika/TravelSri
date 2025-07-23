package com.example.student.controller;

import com.example.student.model.THotelQuotation;
import com.example.student.services.ITHotelQuotationService;
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
@RequestMapping("api/hotel-quotation")
@CrossOrigin
public class THotelQuotationController {


    @Autowired
    private ITHotelQuotationService quotationService;

    // Create new quotation with PDF upload
    @PostMapping(value = "/create", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<THotelQuotation> createQuotation(
            @RequestParam("pendingTripId") String pendingTripId,
            @RequestParam("hotelId") String hotelId,
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

            THotelQuotation quotation = new THotelQuotation();
            quotation.setPendingTripId(pendingTripId);
            quotation.setHotelId(hotelId);
            quotation.setPrice(price);
            quotation.setQuotationPdf(pdfFile.getBytes());
            quotation.setPdfFilename(pdfFile.getOriginalFilename());
            quotation.setPdfContentType(pdfFile.getContentType());

            THotelQuotation createdQuotation = quotationService.createQuotation(quotation);
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
    public ResponseEntity<THotelQuotation> createQuotationJson(@RequestBody THotelQuotation quotation) {
        try {
            THotelQuotation createdQuotation = quotationService.createQuotation(quotation);
            return new ResponseEntity<>(createdQuotation, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get all quotations
    @GetMapping("/getall")
    public ResponseEntity<List<THotelQuotation>> getAllQuotations() {
        try {
            List<THotelQuotation> quotations = quotationService.getAllQuotations();
            return new ResponseEntity<>(quotations, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get quotation by ID
    @GetMapping("/get/{quotationId}")
    public ResponseEntity<THotelQuotation> getQuotationById(@PathVariable("quotationId") String quotationId) {
        try {
            Optional<THotelQuotation> quotation = quotationService.getQuotationById(quotationId);

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
    public ResponseEntity<List<THotelQuotation>> getQuotationsByPendingTripId(@PathVariable("pendingTripId") String pendingTripId) {
        try {
            List<THotelQuotation> quotations = quotationService.getQuotationsByPendingTripId(pendingTripId);
            return new ResponseEntity<>(quotations, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get quotations by hotel ID
    @GetMapping("/hotel/{hotelId}")
    public ResponseEntity<List<THotelQuotation>> getQuotationsByHotelId(@PathVariable("hotelId") String hotelId) {
        try {
            List<THotelQuotation> quotations = quotationService.getQuotationsByHotelId(hotelId);
            return new ResponseEntity<>(quotations, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get quotations by pending trip ID and hotel ID
    @GetMapping("/trip/{pendingTripId}/hotel/{hotelId}")
    public ResponseEntity<List<THotelQuotation>> getQuotationsByPendingTripIdAndHotelId(
            @PathVariable("pendingTripId") String pendingTripId,
            @PathVariable("hotelId") String hotelId) {
        try {
            List<THotelQuotation> quotations = quotationService.getQuotationsByPendingTripIdAndHotelId(pendingTripId, hotelId);
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
            Optional<THotelQuotation> quotation = quotationService.getQuotationById(quotationId);

            if (quotation.isPresent() && quotation.get().getQuotationPdf() != null) {
                THotelQuotation q = quotation.get();

                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_PDF);
                headers.setContentDispositionFormData("attachment",
                        q.getPdfFilename() != null ? q.getPdfFilename() : "hotel_quotation_" + quotationId + ".pdf");

                return new ResponseEntity<>(q.getQuotationPdf(), headers, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
