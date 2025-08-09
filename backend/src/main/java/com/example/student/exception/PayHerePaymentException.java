package com.example.student.exception;

public class PayHerePaymentException extends RuntimeException {
    private String errorCode;

    public PayHerePaymentException(String message, String errorCode) {
        super(message);
        this.errorCode = errorCode;
    }

    public String getErrorCode() {
        return errorCode;
    }
}