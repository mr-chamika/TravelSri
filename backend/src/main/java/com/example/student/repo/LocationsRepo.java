package com.example.student.repo;

import com.example.student.model.Location;
import com.example.student.model.Route;
import com.example.student.model.dto.Routedto;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LocationsRepo extends MongoRepository<Location,String> {

    List<Location> findByRouteIdContaining(String id);
}
