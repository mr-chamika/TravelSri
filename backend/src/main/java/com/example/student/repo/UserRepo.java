package com.example.student.repo;

import com.example.student.model.User;
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
    Optional<User> findByEmail(String email);

}
