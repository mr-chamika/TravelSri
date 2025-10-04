package com.example.student.repo;

import com.example.student.model.Created;
import com.example.student.model.SoloTrip;
import com.example.student.model.dto.Solotripdto;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CreatedRepo extends MongoRepository<Created,String> {

    @Query(
            value = "{ 'creatorId': ?0}",
            fields = "{ '_id': 1, 'thumbnail': 1,'destination': 1}"
    )
    List<Created> findByCreatorId(String id);

}
