package com.example.student.controller;

import com.example.student.services.IBookingService;
import com.example.student.model.Booking;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.Map;

@Controller
@RequestMapping("/payment")
public class PaymentReturnController {

    @Autowired
    private IBookingService bookingService;

    @GetMapping("/success/{bookingId}")
    public String paymentSuccess(@PathVariable String bookingId,
                                 @RequestParam Map<String, String> params,
                                 Model model) {
        try {
            Optional<Booking> optBooking = bookingService.getBookingById(bookingId);
            if (optBooking.isPresent()) {
                Booking booking = optBooking.get();
                model.addAttribute("booking", booking);
                model.addAttribute("status", "success");
                return "payment-result"; // Thymeleaf template
            }

            model.addAttribute("error", "Booking not found");
            return "payment-error";
        } catch (Exception e) {
            model.addAttribute("error", "Error processing payment result");
            return "payment-error";
        }
    }

    @GetMapping("/cancel/{bookingId}")
    public String paymentCancel(@PathVariable String bookingId, Model model) {
        try {
            Optional<Booking> optBooking = bookingService.getBookingById(bookingId);
            if (optBooking.isPresent()) {
                Booking booking = optBooking.get();
                model.addAttribute("booking", booking);
                model.addAttribute("status", "cancelled");
                return "payment-result";
            }

            model.addAttribute("error", "Booking not found");
            return "payment-error";
        } catch (Exception e) {
            model.addAttribute("error", "Error processing payment cancellation");
            return "payment-error";
        }
    }
}