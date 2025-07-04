//package com.example.Student.repo;
package com.example.student.repo;

//import org.springframework.data.jpa.repository.JpaRepository;
import com.example.student.model.Student;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
// import org.springframework.stereotype.Service;

//import com.example.Student.model.Student;
//import com.example.mongodbdemo.domain.Student;
@Repository
public interface Repo extends MongoRepository<Student, String> {
}
