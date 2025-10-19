package com.example.student.controller;

import com.example.student.model.Booking;
import com.example.student.model.User;
import com.example.student.model.dto.Bookingdto;
import com.example.student.services.BookingServiceImpl;
import com.example.student.services.IBookingService;
import com.example.student.services.IGuideService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/guide")
@CrossOrigin
public class GuideController {
    @Autowired
    public IGuideService guideService;

    @Autowired
    public IBookingService bookingService;

    // Create new guide
    @PostMapping("/create")
    public ResponseEntity<User> createGuide(@RequestBody User TGuide) {
        try {
            if (TGuide == null) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }
            User createdTGuide = guideService.createGuide(TGuide);
            return new ResponseEntity<>(createdTGuide, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get all guides
    @GetMapping("/getall")
    public ResponseEntity<List<User>> getAllGuides() {
        try {
            List<User> TGuides = guideService.getAllGuides();
            return new ResponseEntity<>(TGuides, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get guide by ID
    @GetMapping("/get/{id}")
    public ResponseEntity<User> getGuideById(@PathVariable("id") String id) {
        try {
            if (id == null || id.trim().isEmpty()) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }

            Optional<User> guide = guideService.getGuideById(id);

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
    public ResponseEntity<List<User>> getGuidesByBaseCity(@PathVariable("baseCity") String baseCity) {
        try {
            List<User> TGuides = guideService.getGuidesByBaseCity(baseCity);
            return new ResponseEntity<>(TGuides, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get guides by language
    @GetMapping("/language/{language}")
    public ResponseEntity<List<User>> getGuidesByLanguage(@PathVariable("language") String language) {
        try {
            List<User> TGuides = guideService.getGuidesByLanguage(language);
            return new ResponseEntity<>(TGuides, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get guides by minimum experience
    @GetMapping("/experience/{minExperience}")
    public ResponseEntity<List<User>> getGuidesByMinExperience(@PathVariable("minExperience") Integer minExperience) {
        try {
            List<User> TGuides = guideService.getGuidesByMinExperience(minExperience);
            return new ResponseEntity<>(TGuides, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get guides by daily rate range
    @GetMapping("/rate/range")
    public ResponseEntity<List<User>> getGuidesByDailyRateRange(
            @RequestParam("min") Double minRate,
            @RequestParam("max") Double maxRate) {
        try {
            List<User> TGuides = guideService.getGuidesByDailyRateRange(minRate, maxRate);
            return new ResponseEntity<>(TGuides, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get guides by area of service
    @GetMapping("/area/{area}")
    public ResponseEntity<List<User>> getGuidesByAreaOfService(@PathVariable("area") String area) {
        try {
            List<User> TGuides = guideService.getGuidesByAreaOfService(area);
            return new ResponseEntity<>(TGuides, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Search guides with multiple filters
     * GET /api/guides/search?location=Kandy&language=English&guideType=visit&verified=done
     */
    @GetMapping("/search")
    public ResponseEntity<List<User>> searchGuides(
            @RequestParam(value = "location", required = false) String location,
            @RequestParam(value = "language", required = false) String language,
            @RequestParam(value = "guideType", required = false) String guideType,
            @RequestParam(value = "verified", required = false) String verified,
            @RequestParam(value = "minExperience", required = false) Integer minExperience,
            @RequestParam(value = "maxDailyRate", required = false) Double maxDailyRate,
            @RequestParam(value = "minRating", required = false) Double minRating
    ) {
        try {
            List<User> guides = guideService.searchGuides(location, language, guideType, verified, minExperience, maxDailyRate, minRating);
            return new ResponseEntity<>(guides, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/bookings/{guideId}")
    public ResponseEntity<List<Bookingdto>> getGuideBookings(@PathVariable("guideId") String guideId) {
        try {
            if (guideId == null || guideId.trim().isEmpty()) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }


            List<Bookingdto> bookings = bookingService.getBookingsByProvider(guideId);
            return new ResponseEntity<>(bookings, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get pending booking requests for a guide (awaiting acceptance)
    @GetMapping("/bookings/{guideId}/pending")
    public ResponseEntity<List<Bookingdto>> getPendingBookingRequests(@PathVariable("guideId") String guideId) {
        try {
            if (guideId == null || guideId.trim().isEmpty()) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }

            List<Bookingdto> allBookings = bookingService.getBookingsByProvider(guideId);
            List<Bookingdto> pendingBookings = allBookings.stream()
                    .filter(booking -> "PENDING_PROVIDER_ACCEPTANCE".equals(booking.getStatus())
                            && "SUCCESS".equals(booking.getPaymentStatus()))
                    .collect(Collectors.toList());

            return new ResponseEntity<>(pendingBookings, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get confirmed bookings for a guide (upcoming services)
    @GetMapping("/bookings/{guideId}/confirmed")
    public ResponseEntity<List<Bookingdto>> getConfirmedBookings(@PathVariable("guideId") String guideId) {
        try {
            if (guideId == null || guideId.trim().isEmpty()) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }

            List<Bookingdto> allBookings = bookingService.getBookingsByProvider(guideId);
            List<Bookingdto> confirmedBookings = allBookings.stream()
                    .filter(booking -> "CONFIRMED".equals(booking.getStatus()))
                    .collect(Collectors.toList());

            return new ResponseEntity<>(confirmedBookings, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Accept a booking request
    @PutMapping("/bookings/{bookingId}/accept")
    public ResponseEntity<Booking> acceptBookingRequest(
            @PathVariable("bookingId") String bookingId,
            @RequestParam("guideId") String guideId) {
        try {
            if (bookingId == null || bookingId.trim().isEmpty() ||
                    guideId == null || guideId.trim().isEmpty()) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }

            Booking acceptedBooking = bookingService.acceptBooking(bookingId, guideId);
            return new ResponseEntity<>(acceptedBooking, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (RuntimeException e) {
            if (e.getMessage().contains("not found")) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            } else if (e.getMessage().contains("not authorized")) {
                return new ResponseEntity<>(HttpStatus.FORBIDDEN);
            }
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Reject a booking request
    @PutMapping("/bookings/{bookingId}/reject")
    public ResponseEntity<Booking> rejectBookingRequest(
            @PathVariable("bookingId") String bookingId,
            @RequestParam("guideId") String guideId,
            @RequestParam(value = "reason", required = false) String reason) {
        try {
            if (bookingId == null || bookingId.trim().isEmpty() ||
                    guideId == null || guideId.trim().isEmpty()) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }

            Booking rejectedBooking = bookingService.rejectBooking(bookingId, guideId);

            // If reason is provided, update it
            if (reason != null && !reason.trim().isEmpty()) {
                rejectedBooking.setRejectionReason(reason);
                bookingService.updateBooking(rejectedBooking);
            }

            return new ResponseEntity<>(rejectedBooking, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (RuntimeException e) {
            if (e.getMessage().contains("not found")) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            } else if (e.getMessage().contains("not authorized")) {
                return new ResponseEntity<>(HttpStatus.FORBIDDEN);
            }
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get booking statistics for a guide
    @GetMapping("/bookings/{guideId}/stats")
    public ResponseEntity<Map<String, Object>> getGuideBookingStats(@PathVariable("guideId") String guideId) {
        try {
            if (guideId == null || guideId.trim().isEmpty()) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }

            List<Bookingdto> allBookings = bookingService.getBookingsByProvider(guideId);

            Map<String, Object> stats = new HashMap<>();
            stats.put("totalBookings", allBookings.size());
            stats.put("pendingRequests", allBookings.stream()
                    .filter(b -> "PENDING_PROVIDER_ACCEPTANCE".equals(b.getStatus()))
                    .count());
            stats.put("confirmedBookings", allBookings.stream()
                    .filter(b -> "CONFIRMED".equals(b.getStatus()))
                    .count());
            stats.put("completedBookings", allBookings.stream()
                    .filter(b -> "COMPLETED".equals(b.getStatus()))
                    .count());
            stats.put("cancelledBookings", allBookings.stream()
                    .filter(b -> b.getStatus() != null && b.getStatus().contains("CANCELLED"))
                    .count());

            // Calculate total earnings from completed bookings
            BigDecimal totalEarnings = allBookings.stream()
                    .filter(b -> "COMPLETED".equals(b.getStatus()))
                    .map(Bookingdto::getTotalAmount)
                    .filter(Objects::nonNull)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            stats.put("totalEarnings", totalEarnings);

            return new ResponseEntity<>(stats, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get bookings by date range for a guide
    @GetMapping("/bookings/{guideId}/daterange")
    public ResponseEntity<List<Bookingdto>> getGuideBookingsByDateRange(
            @PathVariable("guideId") String guideId,
            @RequestParam("startDate") String startDate,
            @RequestParam("endDate") String endDate) {
        try {
            if (guideId == null || guideId.trim().isEmpty()) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }

            List<Bookingdto> allBookings = bookingService.getBookingsByProvider(guideId);

            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
            LocalDateTime start = LocalDate.parse(startDate, formatter).atStartOfDay();
            LocalDateTime end = LocalDate.parse(endDate, formatter).atTime(23, 59, 59);

            List<Bookingdto> filteredBookings = allBookings.stream()
                    .filter(booking -> booking.getServiceStartDate() != null &&
                            !booking.getServiceStartDate().isBefore(start) &&
                            !booking.getServiceStartDate().isAfter(end))
                    .collect(Collectors.toList());

            return new ResponseEntity<>(filteredBookings, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Mark booking as completed (for guides)
    @PutMapping("/bookings/{bookingId}/complete")
    public ResponseEntity<Booking> completeBooking(
            @PathVariable("bookingId") String bookingId,
            @RequestParam("guideId") String guideId) {
        try {
            if (bookingId == null || bookingId.trim().isEmpty() ||
                    guideId == null || guideId.trim().isEmpty()) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }

            // Verify the booking belongs to this guide
            Optional<Booking> bookingOpt = bookingService.getBookingById(bookingId);
            if (bookingOpt.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }

            Booking booking = bookingOpt.get();
            if (!booking.getProviderId().equals(guideId)) {
                return new ResponseEntity<>(HttpStatus.FORBIDDEN);
            }

            if (!"CONFIRMED".equals(booking.getStatus())) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }

            Booking completedBooking = bookingService.completeBooking(bookingId);
            return new ResponseEntity<>(completedBooking, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}


