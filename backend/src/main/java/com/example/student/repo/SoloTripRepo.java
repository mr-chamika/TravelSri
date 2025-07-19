package com.example.student.repo;

import com.example.student.model.SoloTrip;
import com.example.student.model.Vehicle;
import com.example.student.model.dto.Driverdto;
import com.example.student.model.dto.SolotripGetdto;
import com.example.student.model.dto.Solotripdto;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SoloTripRepo extends MongoRepository<SoloTrip,String> {

    @Query(
            value = "{ 'creatorId': ?0}",
            fields = "{ '_id': 1, 'thumbnail': 1,'destination': 1}"
    )
    List<Solotripdto> findByCreatorId(String id);
}
