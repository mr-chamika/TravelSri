package com.example.student.controller;

import com.example.student.model.Guide;
import com.example.student.services.IGuideService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/guide")
@CrossOrigin(origins = "*")
public class GuideController {
    @Autowired
    public IGuideService guideService;

    // Create new guide
    @PostMapping("/create")
    public ResponseEntity<Guide> createGuide(@RequestBody Guide guide) {
        try {
            if (guide == null) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }
            Guide createdGuide = guideService.createGuide(guide);
            return new ResponseEntity<>(createdGuide, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get all guides
    @GetMapping("/getall")
    public ResponseEntity<List<Guide>> getAllGuides() {
        try {
            List<Guide> guides = guideService.getAllGuides();
            return new ResponseEntity<>(guides, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get guide by ID
    @GetMapping("/get/{id}")
    public ResponseEntity<Guide> getGuideById(@PathVariable("id") String id) {
        try {
            if (id == null || id.trim().isEmpty()) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }

            Optional<Guide> guide = guideService.getGuideById(id);

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
    public ResponseEntity<List<Guide>> getGuidesByBaseCity(@PathVariable("baseCity") String baseCity) {
        try {
            List<Guide> guides = guideService.getGuidesByBaseCity(baseCity);
            return new ResponseEntity<>(guides, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get guides by language
    @GetMapping("/language/{language}")
    public ResponseEntity<List<Guide>> getGuidesByLanguage(@PathVariable("language") String language) {
        try {
            List<Guide> guides = guideService.getGuidesByLanguage(language);
            return new ResponseEntity<>(guides, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get guides by minimum experience
    @GetMapping("/experience/{minExperience}")
    public ResponseEntity<List<Guide>> getGuidesByMinExperience(@PathVariable("minExperience") Integer minExperience) {
        try {
            List<Guide> guides = guideService.getGuidesByMinExperience(minExperience);
            return new ResponseEntity<>(guides, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get guides by daily rate range
    @GetMapping("/rate/range")
    public ResponseEntity<List<Guide>> getGuidesByDailyRateRange(
            @RequestParam("min") Double minRate,
            @RequestParam("max") Double maxRate) {
        try {
            List<Guide> guides = guideService.getGuidesByDailyRateRange(minRate, maxRate);
            return new ResponseEntity<>(guides, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get guides by area of service
    @GetMapping("/area/{area}")
    public ResponseEntity<List<Guide>> getGuidesByAreaOfService(@PathVariable("area") String area) {
        try {
            List<Guide> guides = guideService.getGuidesByAreaOfService(area);
            return new ResponseEntity<>(guides, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
