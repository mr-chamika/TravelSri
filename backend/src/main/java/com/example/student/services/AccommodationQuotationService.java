package com.example.student.services;

import com.example.student.model.AccommodationQuotation;
import java.util.List;

public interface AccommodationQuotationService {
    AccommodationQuotation saveQuotation(AccommodationQuotation quotation);
    List<AccommodationQuotation> getAllQuotations();
    List<AccommodationQuotation> getQuotationsByHotelUsername(String hotelUsername);
    AccommodationQuotation getQuotationById(String id);
    AccommodationQuotation getQuotationByQuoteNumber(String quoteNumber);
    void deleteQuotation(String id);
    void deleteQuotationByQuoteNumber(String quoteNumber);
}