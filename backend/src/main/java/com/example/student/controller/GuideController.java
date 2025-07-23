package com.example.student.controller;

import com.example.student.model.TGuide;
import com.example.student.services.IGuideService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/guide")
@CrossOrigin
public class GuideController {
    @Autowired
    public IGuideService guideService;

    // Create new guide
    @PostMapping("/create")
    public ResponseEntity<TGuide> createGuide(@RequestBody TGuide TGuide) {
        try {
            if (TGuide == null) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }
            TGuide createdTGuide = guideService.createGuide(TGuide);
            return new ResponseEntity<>(createdTGuide, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get all guides
    @GetMapping("/getall")
    public ResponseEntity<List<TGuide>> getAllGuides() {
        try {
            List<TGuide> TGuides = guideService.getAllGuides();
            return new ResponseEntity<>(TGuides, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get guide by ID
    @GetMapping("/get/{id}")
    public ResponseEntity<TGuide> getGuideById(@PathVariable("id") String id) {
        try {
            if (id == null || id.trim().isEmpty()) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }

            Optional<TGuide> guide = guideService.getGuideById(id);

            if (guide.isPresent()) {
                return new ResponseEntity<>(guide.get(), HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Delete guide
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<HttpStatus> deleteGuide(@PathVariable("id") String id) {
        try {
            boolean isDeleted = guideService.deleteGuide(id);
            if (isDeleted) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get guides by base city
    @GetMapping("/city/{baseCity}")
    public ResponseEntity<List<TGuide>> getGuidesByBaseCity(@PathVariable("baseCity") String baseCity) {
        try {
            List<TGuide> TGuides = guideService.getGuidesByBaseCity(baseCity);
            return new ResponseEntity<>(TGuides, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get guides by language
    @GetMapping("/language/{language}")
    public ResponseEntity<List<TGuide>> getGuidesByLanguage(@PathVariable("language") String language) {
        try {
            List<TGuide> TGuides = guideService.getGuidesByLanguage(language);
            return new ResponseEntity<>(TGuides, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get guides by minimum experience
    @GetMapping("/experience/{minExperience}")
    public ResponseEntity<List<TGuide>> getGuidesByMinExperience(@PathVariable("minExperience") Integer minExperience) {
        try {
            List<TGuide> TGuides = guideService.getGuidesByMinExperience(minExperience);
            return new ResponseEntity<>(TGuides, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get guides by daily rate range
    @GetMapping("/rate/range")
    public ResponseEntity<List<TGuide>> getGuidesByDailyRateRange(
            @RequestParam("min") Double minRate,
            @RequestParam("max") Double maxRate) {
        try {
            List<TGuide> TGuides = guideService.getGuidesByDailyRateRange(minRate, maxRate);
            return new ResponseEntity<>(TGuides, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get guides by area of service
    @GetMapping("/area/{area}")
    public ResponseEntity<List<TGuide>> getGuidesByAreaOfService(@PathVariable("area") String area) {
        try {
            List<TGuide> TGuides = guideService.getGuidesByAreaOfService(area);
            return new ResponseEntity<>(TGuides, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
