package com.example.quotation.repository;

import com.example.quotation.model.quotation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface quotationRepository extends MongoRepository<quotation, String> {

    // Find quotations by customer name
    List<quotation> findByCustomerNameContainingIgnoreCase(String customerName);

    // Find quotations by status
    List<quotation> findByStatus(String status);

    // Find quotation by quotation number
    Optional<quotation> findByQuotationNumber(String quotationNumber);

    // Find quotations by customer email
    List<quotation> findByCustomerEmail(String customerEmail);

    // Custom query to find quotations with total amount greater than specified
    // value
    @Query("{'totalAmount': {$gt: ?0}}")
    List<quotation> findByTotalAmountGreaterThan(Double amount);

    // Find quotations ordered by creation date (newest first)
    List<quotation> findAllByOrderByCreatedAtDesc();
}