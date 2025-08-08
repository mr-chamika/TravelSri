package com.example.student.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class PayHereExceptionHandler {

    @ExceptionHandler(PayHerePaymentException.class)
    public ResponseEntity<Map<String, String>> handlePayHerePaymentException(PayHerePaymentException ex) {
        Map<String, String> error = new HashMap<>();
        error.put("error", "PayHere Payment Error");
        error.put("message", ex.getMessage());
        error.put("code", ex.getErrorCode());
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(PayHereNotificationException.class)
    public ResponseEntity<Map<String, String>> handlePayHereNotificationException(PayHereNotificationException ex) {
        Map<String, String> error = new HashMap<>();
        error.put("error", "PayHere Notification Error");
        error.put("message", ex.getMessage());
        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}