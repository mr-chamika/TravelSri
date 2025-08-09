package com.example.student.repo;

import com.example.student.model.MoneyFlow;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MoneyFlowRepo extends MongoRepository<MoneyFlow, String> {

    @Query("{'bookingId': ?0}")
    List<MoneyFlow> findByBookingId(String bookingId);

    @Query("{'fromEntityId': ?0, 'toEntityId': ?1}")
    List<MoneyFlow> findByFromEntityIdAndToEntityId(String fromEntityId, String toEntityId);

    @Query("{'flowType': ?0}")
    List<MoneyFlow> findByFlowType(String flowType);
}