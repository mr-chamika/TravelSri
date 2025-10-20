package com.example.student.services;

import com.example.student.model.VehicleQuotation;
import com.example.student.repo.VehicleQuotationRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class VehicleQuotationService implements IVehicleQuotationService {

    @Autowired
    private VehicleQuotationRepo vehicleQuotationRepo;

    // Basic CRUD operations
    @Override
    public VehicleQuotation saveQuotation(VehicleQuotation quotation) {
        try {
            // Set timestamps
            if (quotation.get_id() == null) {
                quotation.setCreatedAt(new Date());
            }
            quotation.setUpdatedAt(new Date());

            // Set default status if not provided
            if (quotation.getStatus() == null || quotation.getStatus().isEmpty()) {
                quotation.setStatus("pending");
            }

            return vehicleQuotationRepo.save(quotation);
        } catch (Exception e) {
            throw new RuntimeException("Error saving vehicle quotation: " + e.getMessage(), e);
        }
    }

    @Override
    public Optional<VehicleQuotation> getQuotationById(String id) {
        try {
            if (id == null || id.trim().isEmpty()) {
                throw new IllegalArgumentException("Quotation ID cannot be null or empty");
            }
            return vehicleQuotationRepo.findById(id);
        } catch (Exception e) {
            throw new RuntimeException("Error fetching vehicle quotation by ID: " + e.getMessage(), e);
        }
    }

    @Override
    public List<VehicleQuotation> getAllQuotations() {
        try {
            return vehicleQuotationRepo.findAll();
        } catch (Exception e) {
            throw new RuntimeException("Error fetching all vehicle quotations: " + e.getMessage(), e);
        }
    }

    @Override
    public void deleteQuotation(String id) {
        try {
            if (id == null || id.trim().isEmpty()) {
                throw new IllegalArgumentException("Quotation ID cannot be null or empty");
            }

            if (!vehicleQuotationRepo.existsById(id)) {
                throw new IllegalArgumentException("Vehicle quotation not found with ID: " + id);
            }

            vehicleQuotationRepo.deleteById(id);
        } catch (Exception e) {
            throw new RuntimeException("Error deleting vehicle quotation: " + e.getMessage(), e);
        }
    }

    @Override
    public boolean existsById(String id) {
        try {
            if (id == null || id.trim().isEmpty()) {
                return false;
            }
            return vehicleQuotationRepo.existsById(id);
        } catch (Exception e) {
            throw new RuntimeException("Error checking vehicle quotation existence: " + e.getMessage(), e);
        }
    }

    // Custom query methods
    @Override
    public List<VehicleQuotation> getQuotationsByPendingTripId(String pendingTripId) {
        try {
            if (pendingTripId == null || pendingTripId.trim().isEmpty()) {
                throw new IllegalArgumentException("Pending trip ID cannot be null or empty");
            }
            return vehicleQuotationRepo.findByPendingTripId(pendingTripId);
        } catch (Exception e) {
            throw new RuntimeException("Error fetching vehicle quotations by pending trip ID: " + e.getMessage(), e);
        }
    }

    @Override
    public List<VehicleQuotation> getQuotationsByVehicleId(String vehicleId) {
        try {
            if (vehicleId == null || vehicleId.trim().isEmpty()) {
                throw new IllegalArgumentException("Vehicle ID cannot be null or empty");
            }
            return vehicleQuotationRepo.findByVehicleId(vehicleId);
        } catch (Exception e) {
            throw new RuntimeException("Error fetching vehicle quotations by vehicle ID: " + e.getMessage(), e);
        }
    }

    @Override
    public Optional<VehicleQuotation> getQuotationByPendingTripIdAndVehicleId(String pendingTripId, String vehicleId) {
        try {
            if (pendingTripId == null || pendingTripId.trim().isEmpty()) {
                throw new IllegalArgumentException("Pending trip ID cannot be null or empty");
            }
            if (vehicleId == null || vehicleId.trim().isEmpty()) {
                throw new IllegalArgumentException("Vehicle ID cannot be null or empty");
            }
            return vehicleQuotationRepo.findByPendingTripIdAndVehicleId(pendingTripId, vehicleId);
        } catch (Exception e) {
            throw new RuntimeException("Error fetching vehicle quotation by trip and vehicle ID: " + e.getMessage(), e);
        }
    }

    @Override
    public List<VehicleQuotation> getQuotationsByStatus(String status) {
        try {
            if (status == null || status.trim().isEmpty()) {
                throw new IllegalArgumentException("Status cannot be null or empty");
            }
            return vehicleQuotationRepo.findByStatus(status);
        } catch (Exception e) {
            throw new RuntimeException("Error fetching vehicle quotations by status: " + e.getMessage(), e);
        }
    }

    @Override
    public List<VehicleQuotation> getQuotationsByVehicleIdAndStatus(String vehicleId, String status) {
        try {
            if (vehicleId == null || vehicleId.trim().isEmpty()) {
                throw new IllegalArgumentException("Vehicle ID cannot be null or empty");
            }
            if (status == null || status.trim().isEmpty()) {
                throw new IllegalArgumentException("Status cannot be null or empty");
            }
            return vehicleQuotationRepo.findByVehicleIdAndStatus(vehicleId, status);
        } catch (Exception e) {
            throw new RuntimeException("Error fetching vehicle quotations by vehicle ID and status: " + e.getMessage(), e);
        }
    }

    // Business logic methods
    @Override
    public VehicleQuotation updateQuotationStatus(String id, String status) {
        try {
            Optional<VehicleQuotation> optionalQuotation = getQuotationById(id);
            if (optionalQuotation.isEmpty()) {
                throw new IllegalArgumentException("Vehicle quotation not found with ID: " + id);
            }

            VehicleQuotation quotation = optionalQuotation.get();
            quotation.setStatus(status);
            quotation.setUpdatedAt(new Date());

            return saveQuotation(quotation);
        } catch (Exception e) {
            throw new RuntimeException("Error updating vehicle quotation status: " + e.getMessage(), e);
        }
    }

    @Override
    public VehicleQuotation updateQuotationAmount(String id, Double amount) {
        try {
            if (amount == null || amount <= 0) {
                throw new IllegalArgumentException("Quotation amount must be positive");
            }

            Optional<VehicleQuotation> optionalQuotation = getQuotationById(id);
            if (optionalQuotation.isEmpty()) {
                throw new IllegalArgumentException("Vehicle quotation not found with ID: " + id);
            }

            VehicleQuotation quotation = optionalQuotation.get();
            quotation.setQuotedAmount(amount);
            quotation.setUpdatedAt(new Date());

            return saveQuotation(quotation);
        } catch (Exception e) {
            throw new RuntimeException("Error updating vehicle quotation amount: " + e.getMessage(), e);
        }
    }

    @Override
    public List<VehicleQuotation> getPendingQuotations() {
        return getQuotationsByStatus("pending");
    }

    @Override
    public List<VehicleQuotation> getAcceptedQuotations() {
        return getQuotationsByStatus("accepted");
    }

    @Override
    public List<VehicleQuotation> getRejectedQuotations() {
        return getQuotationsByStatus("rejected");
    }

    // Statistics methods
    @Override
    public long countQuotationsByStatus(String status) {
        try {
            List<VehicleQuotation> quotations = getQuotationsByStatus(status);
            return quotations.size();
        } catch (Exception e) {
            throw new RuntimeException("Error counting vehicle quotations by status: " + e.getMessage(), e);
        }
    }

    @Override
    public long countQuotationsByVehicleId(String vehicleId) {
        try {
            List<VehicleQuotation> quotations = getQuotationsByVehicleId(vehicleId);
            return quotations.size();
        } catch (Exception e) {
            throw new RuntimeException("Error counting vehicle quotations by vehicle ID: " + e.getMessage(), e);
        }
    }

    @Override
    public Double getAverageQuotedAmountByPendingTripId(String pendingTripId) {
        try {
            List<VehicleQuotation> quotations = getQuotationsByPendingTripId(pendingTripId);

            if (quotations.isEmpty()) {
                return 0.0;
            }

            List<Double> amounts = quotations.stream()
                    .map(VehicleQuotation::getQuotedAmount)
                    .filter(amount -> amount != null && amount > 0)
                    .collect(Collectors.toList());

            if (amounts.isEmpty()) {
                return 0.0;
            }

            return amounts.stream()
                    .mapToDouble(Double::doubleValue)
                    .average()
                    .orElse(0.0);
        } catch (Exception e) {
            throw new RuntimeException("Error calculating average quoted amount: " + e.getMessage(), e);
        }
    }
}