package com.example.student.repo;

import com.example.student.model.Faci;
import com.example.student.model.Hotel;
import com.example.student.model.dto.HotelViewdto;
import com.example.student.model.dto.Hoteldto;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FaciRepo extends MongoRepository<Faci,String> {
List<Faci> findByHotelIdContaining(String id);
}
