package com.example.student.services;

import com.example.student.model.THotelQuotation;

import java.util.List;
import java.util.Optional;

public interface ITHotelQuotationService {

    // Create quotation
    THotelQuotation createQuotation(THotelQuotation quotation);

    // Find all quotations
    List<THotelQuotation> getAllQuotations();

    // Find by quotation id
    Optional<THotelQuotation> getQuotationById(String quotationId);

    // Find by pending trip id
    List<THotelQuotation> getQuotationsByPendingTripId(String pendingTripId);

    // Find by hotel id
    List<THotelQuotation> getQuotationsByHotelId(String hotelId);

    // Find by pending trip id and hotel id
    List<THotelQuotation> getQuotationsByPendingTripIdAndHotelId(String pendingTripId, String hotelId);
}
