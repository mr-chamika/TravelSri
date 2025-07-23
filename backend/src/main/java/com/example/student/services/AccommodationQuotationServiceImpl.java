package com.example.student.services;

import com.example.student.model.AccommodationQuotation;
import com.example.student.repo.AccommodationQuotationRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class AccommodationQuotationServiceImpl implements AccommodationQuotationService {

    @Autowired
    private AccommodationQuotationRepo repo;

    @Override
    public AccommodationQuotation saveQuotation(AccommodationQuotation quotation) {
        return repo.save(quotation);
    }

    @Override
    public List<AccommodationQuotation> getAllQuotations() {
        return repo.findAll();
    }

    @Override
    public AccommodationQuotation getQuotationById(String id) {
        return repo.findById(id).orElse(null);
    }

    @Override
    public void deleteQuotation(String id) {
        repo.deleteById(id);
    }
}