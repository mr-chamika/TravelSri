package com.example.student.model;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Data
public class VehicleOwnerQuotationRequest {
    private Double amount;
    private String notes;
    private String vehicleOwnerId;
    private String vehicleType;
    private String vehicleModel;
    private Integer seatingCapacity;
    private Boolean hasAirConditioning;
    private String driverIncluded; // "yes", "no", "optional"
    private String additionalServices; // GPS, WiFi, etc.

    // Default constructor
    public VehicleOwnerQuotationRequest() {}

    // Constructor with basic parameters
    public VehicleOwnerQuotationRequest(Double amount, String notes, String vehicleOwnerId) {
        this.amount = amount;
        this.notes = notes;
        this.vehicleOwnerId = vehicleOwnerId;
    }

    // Constructor with all parameters
    public VehicleOwnerQuotationRequest(Double amount, String notes, String vehicleOwnerId,
                                        String vehicleType, String vehicleModel, Integer seatingCapacity,
                                        Boolean hasAirConditioning, String driverIncluded, String additionalServices) {
        this.amount = amount;
        this.notes = notes;
        this.vehicleOwnerId = vehicleOwnerId;
        this.vehicleType = vehicleType;
        this.vehicleModel = vehicleModel;
        this.seatingCapacity = seatingCapacity;
        this.hasAirConditioning = hasAirConditioning;
        this.driverIncluded = driverIncluded;
        this.additionalServices = additionalServices;
    }

    @Override
    public String toString() {
        return "VehicleOwnerQuotationRequest{" +
                "amount=" + amount +
                ", notes='" + notes + '\'' +
                ", vehicleOwnerId='" + vehicleOwnerId + '\'' +
                ", vehicleType='" + vehicleType + '\'' +
                ", vehicleModel='" + vehicleModel + '\'' +
                ", seatingCapacity=" + seatingCapacity +
                ", hasAirConditioning=" + hasAirConditioning +
                ", driverIncluded='" + driverIncluded + '\'' +
                ", additionalServices='" + additionalServices + '\'' +
                '}';
    }
}