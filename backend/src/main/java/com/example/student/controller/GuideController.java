package com.example.student.controller;

import com.example.student.repo.GuideRepo;
import com.example.student.model.Tour;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.io.IOException;
import java.util.List;

@RestController
@CrossOrigin(origins = "https://localhost:8081")
@Tag(name = "Guide Management", description = "Guide and trip management operations")
public class GuideController {

    @Autowired
    private GuideRepo guideRepo;

    @GetMapping("/")
    public void redirectToSwagger(HttpServletResponse response) throws IOException {
        response.sendRedirect("/swagger-ui/index.html");
    }

    @GetMapping("/groupTours")
    @Operation(summary = "Get All Trips", description = "Retrieves a list of all available trips/guides")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved list of trips")
    public List<Tour> getAllTrips() {
        return guideRepo.findAll();
    }

    @PostMapping("/quotation")
    public Tour addQuotation(@RequestBody Tour guide) {
        return guideRepo.save(guide);
    }
}