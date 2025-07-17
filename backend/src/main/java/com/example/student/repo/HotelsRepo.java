package com.example.student.repo;

import com.example.student.model.Hotel;
import com.example.student.model.dto.HotelViewdto;
import com.example.student.model.dto.Hoteldto;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HotelsRepo extends MongoRepository<Hotel,String> {

@Query("SELECT new com.example.student.model.dto.Hoteldto(h._id,h.thumbnail,h.stars,h.singlePrice,h.doublePrice,h.name,h.availableSingle,h.availableDouble) FROM Hotel h")
List<Hoteldto> findAllHoteldtos();

    // In HotelsRepo.java
    @Query("{ '_id' : ?0 }")
    Optional<HotelViewdto> findHotelViewdtoById(String id);



}
