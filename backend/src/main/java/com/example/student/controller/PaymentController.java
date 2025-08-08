package com.example.student.controller;

import com.example.student.model.dto.PayHereSessionResponse;
import com.example.student.model.dto.PaymentSessionRequest;
import com.example.student.model.dto.PayHereNotification;
import com.example.student.services.IPaymentService;
import com.example.student.services.IBookingService;
import com.example.student.model.Booking;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;  // Fixed import
import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin
public class PaymentController {

    @Autowired
    private IPaymentService paymentService;

    @Autowired
    private IBookingService bookingService;

    @PostMapping("/payhere/create-checkout")
    public ResponseEntity<?> createPayHereCheckout(@RequestBody PaymentSessionRequest request) {
        try {
            if (request == null || request.getBookingId() == null) {
                return new ResponseEntity<>("Invalid request", HttpStatus.BAD_REQUEST);
            }

            PayHereSessionResponse response = paymentService.createPayHereCheckout(request.getBookingId());
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>("Error creating PayHere checkout: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>("Internal error: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/payhere/notify")
    public ResponseEntity<String> handlePayHereNotification(HttpServletRequest request) {
        try {
            // Extract PayHere notification parameters
            PayHereNotification notification = new PayHereNotification();
            notification.setMerchantId(request.getParameter("merchant_id"));
            notification.setOrderId(request.getParameter("order_id"));
            notification.setPaymentId(request.getParameter("payment_id"));
            notification.setAmount(new BigDecimal(request.getParameter("amount")));
            notification.setCurrency(request.getParameter("currency"));
            notification.setStatusCode(request.getParameter("status_code"));
            notification.setMd5sig(request.getParameter("md5sig"));
            notification.setMethod(request.getParameter("method"));
            notification.setStatusMessage(request.getParameter("status_message"));
            notification.setCardHolderName(request.getParameter("card_holder_name"));
            notification.setCardNo(request.getParameter("card_no"));

            paymentService.handlePaymentNotification(notification);

            return new ResponseEntity<>("OK", HttpStatus.OK);
        } catch (Exception e) {
            System.err.println("Error processing PayHere notification: " + e.getMessage());
            return new ResponseEntity<>("ERROR", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/payhere/status/{orderId}")
    public ResponseEntity<?> getPaymentStatus(@PathVariable("orderId") String orderId) {
        try {
            Booking booking = paymentService.getBookingByOrderId(orderId);
            if (booking != null) {
                return new ResponseEntity<>(booking, HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Payment not found", HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>("Error retrieving payment status: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/payhere/test-payment")
    public ResponseEntity<?> createTestPayment(@RequestBody Map<String, Object> testData) {
        try {
            // For testing purposes - creates a simple PayHere checkout URL
            String bookingId = (String) testData.get("bookingId");
            BigDecimal amount = new BigDecimal(testData.get("amount").toString());

            PayHereSessionResponse response = paymentService.createPayHereCheckout(bookingId);

            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error creating test payment: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}