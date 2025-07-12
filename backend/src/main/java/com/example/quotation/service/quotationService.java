package com.example.quotation.service;

import com.example.quotation.model.quotation;
import com.example.quotation.repository.quotationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class quotationService {

    @Autowired
    private quotationRepository quotationRepository;

    // Get all quotations
    public List<quotation> getAllQuotations() {
        return quotationRepository.findAllByOrderByCreatedAtDesc();
    }

    // Get quotation by ID
    public Optional<quotation> getQuotationById(String id) {
        return quotationRepository.findById(id);
    }

    // Get quotation by quotation number
    public Optional<quotation> getQuotationByNumber(String quotationNumber) {
        return quotationRepository.findByQuotationNumber(quotationNumber);
    }

    // Create new quotation
    public quotation createQuotation(quotation quotation) {
        quotation.setCreatedAt(LocalDateTime.now());
        quotation.setUpdatedAt(LocalDateTime.now());

        // Generate quotation number if not provided
        if (quotation.getQuotationNumber() == null || quotation.getQuotationNumber().isEmpty()) {
            quotation.setQuotationNumber(generateQuotationNumber());
        }

        return quotationRepository.save(quotation);
    }

    // Update quotation
    public quotation updateQuotation(String id, quotation quotation) {
        Optional<quotation> existingQuotation = quotationRepository.findById(id);
        if (existingQuotation.isPresent()) {
            quotation.setId(id);
            quotation.setUpdatedAt(LocalDateTime.now());
            return quotationRepository.save(quotation);
        }
        return null;
    }

    // Delete quotation
    public boolean deleteQuotation(String id) {
        if (quotationRepository.existsById(id)) {
            quotationRepository.deleteById(id);
            return true;
        }
        return false;
    }

    // Search quotations by customer name
    public List<quotation> searchByCustomerName(String customerName) {
        return quotationRepository.findByCustomerNameContainingIgnoreCase(customerName);
    }

    // Get quotations by status
    public List<quotation> getQuotationsByStatus(String status) {
        return quotationRepository.findByStatus(status);
    }

    // Generate quotation number
    private String generateQuotationNumber() {
        long count = quotationRepository.count();
        return "QUO-" + String.format("%06d", count + 1);
    }
}