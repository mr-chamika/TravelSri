package com.example.student.repo;

import com.example.student.model.Guide;
import com.example.student.model.dto.GuideViewdto;
import com.example.student.model.dto.Guidedto;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GuidesRepo extends MongoRepository<Guide,String> {

    @Query(
            value = "{ $and: [  { 'location': ?0 }, { 'languages': { $in: [?1] } }] }",
            fields = "{ '_id': 1, 'pp': 1, 'stars': 1, 'price': 1, 'username': 1, 'verified': 1, 'identified': 1,'languages':1,'location':1,'images': 1 ,'description': 1}"
    )
List<Guidedto> findAllGuidedtos(String location,String language);

    @Query(
            value = "{ '_id': ?0}",
            fields = "{ '_id': 1, 'pp': 1, 'stars': 1, 'price': 1, 'username': 1, 'verified': 1, 'identified': 1 ,'languages': 1,'location': 1,'images':1,'description': 1}"
    )
    Optional<GuideViewdto> findData(String id);


}
