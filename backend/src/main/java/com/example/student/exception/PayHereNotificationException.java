package com.example.student.exception;

public class PayHereNotificationException extends RuntimeException {
    public PayHereNotificationException(String message) {
        super(message);
    }

    public PayHereNotificationException(String message, Throwable cause) {
        super(message, cause);
    }
}
