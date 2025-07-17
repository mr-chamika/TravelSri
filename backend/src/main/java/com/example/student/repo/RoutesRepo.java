package com.example.student.repo;

import com.example.student.model.Route;
import com.example.student.model.dto.Routedto;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RoutesRepo extends MongoRepository<Route,String> {

@Query("SELECT new com.example.student.model.dto.Routedto(r._id, r.from,r.to,r.thumbnail) FROM Route r")
List<Routedto> findAllRoutedtos();

}
