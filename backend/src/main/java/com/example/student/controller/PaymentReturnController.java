package com.example.student.controller;

import com.example.student.model.Booking;
import com.example.student.model.PaymentTransaction;
import com.example.student.services.IBookingService;
import com.example.student.services.PayHerePaymentServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Map;
import java.util.Optional;

@Controller
@RequestMapping("/payment")
public class PaymentReturnController {

    private static final Logger logger = LoggerFactory.getLogger(PaymentReturnController.class);

    @Autowired
    private IBookingService bookingService;

    @Autowired
    private PayHerePaymentServiceImpl payHerePaymentService;

    @GetMapping("/success/{bookingId}")
    public String paymentSuccess(@PathVariable String bookingId,
                                 @RequestParam Map<String, String> params,
                                 Model model) {
        try {
            logger.info("Payment success return for booking: {}", bookingId);

            // Get booking details
            Optional<Booking> optBooking = bookingService.getBookingById(bookingId);
            if (!optBooking.isPresent()) {
                logger.error("Booking not found: {}", bookingId);
                model.addAttribute("error", "Booking not found");
                return "payment-error";
            }

            Booking booking = optBooking.get();
            model.addAttribute("booking", booking);
            model.addAttribute("bookingId", bookingId);

            // Get payment details
            PaymentTransaction payment = payHerePaymentService.getPaymentByBookingId(bookingId);
            if (payment != null) {
                model.addAttribute("payment", payment);
                model.addAttribute("orderId", payment.getPayHereOrderId());
                model.addAttribute("paymentId", payment.getPayHerePaymentId());
                model.addAttribute("amount", payment.getAmount());
                model.addAttribute("currency", payment.getCurrency());
                model.addAttribute("paymentStatus", payment.getStatus());

                // Check payment status
                if ("SUCCESS".equals(payment.getStatus())) {
                    model.addAttribute("status", "success");
                    model.addAttribute("message", "Payment completed successfully! Your booking is confirmed.");
                    return "payment-success";
                } else if ("PENDING".equals(payment.getStatus())) {
                    model.addAttribute("status", "pending");
                    model.addAttribute("message", "Payment is being processed. You will receive confirmation shortly.");
                    return "payment-pending";
                } else {
                    model.addAttribute("error", "Payment was not successful. Status: " + payment.getStatus());
                    return "payment-error";
                }
            } else {
                logger.error("Payment not found for booking: {}", bookingId);
                model.addAttribute("error", "Payment information not found");
                return "payment-error";
            }

        } catch (Exception e) {
            logger.error("Error handling payment success return", e);
            model.addAttribute("error", "An error occurred while processing your payment return");
            return "payment-error";
        }
    }

    @GetMapping("/cancel/{bookingId}")
    public String paymentCancel(@PathVariable String bookingId,
                                @RequestParam Map<String, String> params,
                                Model model) {
        try {
            logger.info("Payment cancel return for booking: {}", bookingId);

            // Get booking details
            Optional<Booking> optBooking = bookingService.getBookingById(bookingId);
            if (optBooking.isPresent()) {
                Booking booking = optBooking.get();
                model.addAttribute("booking", booking);
                model.addAttribute("bookingId", bookingId);
            }

            // Get payment details if available
            PaymentTransaction payment = payHerePaymentService.getPaymentByBookingId(bookingId);
            if (payment != null) {
                model.addAttribute("payment", payment);
                model.addAttribute("orderId", payment.getPayHereOrderId());
            }

            model.addAttribute("status", "cancelled");
            model.addAttribute("message", "Payment was cancelled. You can try again or contact support if you need help.");
            return "payment-cancelled";

        } catch (Exception e) {
            logger.error("Error handling payment cancel return", e);
            model.addAttribute("error", "An error occurred while processing your payment cancellation");
            return "payment-error";
        }
    }

    @GetMapping("/status/{bookingId}")
    @ResponseBody
    public String getPaymentStatus(@PathVariable String bookingId) {
        try {
            PaymentTransaction payment = payHerePaymentService.getPaymentByBookingId(bookingId);
            if (payment != null) {
                return String.format("{\"status\":\"%s\",\"orderId\":\"%s\",\"paymentId\":\"%s\",\"amount\":%s}",
                        payment.getStatus(),
                        payment.getPayHereOrderId() != null ? payment.getPayHereOrderId() : "",
                        payment.getPayHerePaymentId() != null ? payment.getPayHerePaymentId() : "",
                        payment.getAmount());
            } else {
                return "{\"status\":\"not_found\"}";
            }
        } catch (Exception e) {
            logger.error("Error getting payment status for booking: {}", bookingId, e);
            return "{\"status\":\"error\",\"message\":\"" + e.getMessage() + "\"}";
        }
    }

    // Mobile app deep link redirects
    @GetMapping("/mobile/success/{bookingId}")
    public String mobilePaymentSuccess(@PathVariable String bookingId) {
        try {
            logger.info("Mobile payment success redirect for booking: {}", bookingId);

            PaymentTransaction payment = payHerePaymentService.getPaymentByBookingId(bookingId);
            String status = payment != null ? payment.getStatus() : "unknown";
            String orderId = payment != null && payment.getPayHereOrderId() != null ? payment.getPayHereOrderId() : "";

            // Redirect to mobile app with deep link
            return "redirect://travelsri/payment-result?bookingId=" + bookingId +
                    "&status=" + status + "&orderId=" + orderId;

        } catch (Exception e) {
            logger.error("Error handling mobile payment success", e);
            return "redirect://travelsri/payment-result?bookingId=" + bookingId + "&status=error";
        }
    }

    @GetMapping("/mobile/cancel/{bookingId}")
    public String mobilePaymentCancel(@PathVariable String bookingId) {
        try {
            logger.info("Mobile payment cancel redirect for booking: {}", bookingId);

            // Redirect to mobile app with deep link
            return "redirect://travelsri/payment-result?bookingId=" + bookingId + "&status=cancelled";

        } catch (Exception e) {
            logger.error("Error handling mobile payment cancel", e);
            return "redirect://travelsri/payment-result?bookingId=" + bookingId + "&status=error";
        }
    }

    // API endpoint for checking payment status (for mobile apps)
    @GetMapping("/api/status/{bookingId}")
    @ResponseBody
    public Map<String, Object> getPaymentStatusAPI(@PathVariable String bookingId) {
        try {
            PaymentTransaction payment = payHerePaymentService.getPaymentByBookingId(bookingId);
            Optional<Booking> optBooking = bookingService.getBookingById(bookingId);

            Map<String, Object> response = new java.util.HashMap<>();

            if (payment != null) {
                response.put("success", true);
                response.put("paymentStatus", payment.getStatus());
                response.put("orderId", payment.getPayHereOrderId());
                response.put("paymentId", payment.getPayHerePaymentId());
                response.put("amount", payment.getAmount());
                response.put("currency", payment.getCurrency());
                response.put("type", payment.getType());
            } else {
                response.put("success", false);
                response.put("message", "Payment not found");
            }

            if (optBooking.isPresent()) {
                Booking booking = optBooking.get();
                response.put("bookingStatus", booking.getStatus());
                response.put("paymentStatus", booking.getPaymentStatus());
            }

            return response;

        } catch (Exception e) {
            logger.error("Error getting payment status API for booking: {}", bookingId, e);
            return Map.of(
                    "success", false,
                    "message", "Error retrieving payment status: " + e.getMessage()
            );
        }
    }
}