package com.example.student.repo;

import com.example.student.model.AccommodationQuotation;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface AccommodationQuotationRepo extends MongoRepository<AccommodationQuotation, String> {
    AccommodationQuotation findByQuoteNumber(String quoteNumber);
}