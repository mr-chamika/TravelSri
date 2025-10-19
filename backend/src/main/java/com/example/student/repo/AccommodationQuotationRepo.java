package com.example.student.repo;

import com.example.student.model.AccommodationQuotation;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface AccommodationQuotationRepo extends MongoRepository<AccommodationQuotation, String> {
    AccommodationQuotation findByQuoteNumber(String quoteNumber);
    List<AccommodationQuotation> findByHotelUsername(String hotelUsername);
}