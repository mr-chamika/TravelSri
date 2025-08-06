package com.example.student.services;

import com.example.student.model.AccommodationQuotation;
import java.util.List;

public interface AccommodationQuotationService {
    AccommodationQuotation saveQuotation(AccommodationQuotation quotation);
    List<AccommodationQuotation> getAllQuotations();
    AccommodationQuotation getQuotationById(String id);
    void deleteQuotation(String id);
}