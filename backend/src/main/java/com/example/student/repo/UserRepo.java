package com.example.student.repo;

import com.example.student.model.User;
import com.example.student.model.dto.GuideViewdto;
import com.example.student.model.dto.Guidedto;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepo extends MongoRepository<User,String> {
    @Query(
            value = "{ 'email' : ?0 }",
            fields = "{ '_id':1,'email': 1,'mobileNumber': 1,'firstName': 1,'lastName': 1,'username': 1,'enterCredentials': 1,'pp': 1 }"
    )
    Optional<User> pfindByEmail(String email);

    Optional<User> findByEmail(String email);

    @Query(
            value = "{ $and: [ { 'location': { $regex: ?0, $options: 'i' } }, { 'languages': { $regex: ?1, $options: 'i' } }, { 'role': 'guide' },{'status': 'active'} ] }",
            fields = "{ '_id': 1,'firstName': 1,'lastName': 1,'experience': 1,'pp': 1,'username': 1,'stars': 1,'reviewCount': 1,'dailyRate': 1,'verified': 1,'identified': 1,'specializations': 1,'location': 1,'bio': 1,'mobileNumber': 1,'responseTime': 1,'responseRate': 1,'description': 1}"
    )
    List<Guidedto> findAllGuidedtos(String location, String language);

    @Query(
            value = "{ 'role': 'guide','status': 'active' } ",
            fields = "{ '_id': 1,'firstName': 1,'lastName': 1,'experience': 1,'pp': 1,'username': 1,'stars': 1,'reviewCount': 1,'dailyRate': 1,'verified': 1,'identified': 1,'specializations': 1,'location': 1,'bio': 1,'mobileNumber': 1,'responseTime': 1,'responseRate': 1,'description': 1}"
    )
    List<Guidedto> findAllGuidedto();

    @Query(
            value = "{ '_id': ?0, 'role': 'guide','status': 'active' }",
            fields = "{ '_id': 1, 'firstName': 1, 'lastName': 1, 'description': 1, 'location': 1, 'experience': 1, 'stars': 1, 'reviewCount': 1, 'dailyRate': 1, 'pp': 1, 'verified': 1, 'identified': 1, 'specializations': 1, 'responseTime': 1, 'responseRate': 1, 'mobileNumber': 1, 'languages': 1, 'images': 1, 'bio': 1, 'education': 1, 'certifications': 1, 'whyChooseMe': 1, 'tourStyles': 1, 'awards': 1, 'daysPerWeek': 1 }"
    )
    Optional<GuideViewdto> findData(String id);
}

