//package com.example.Student.repo;
package com.example.student.repo;

//import org.springframework.data.jpa.repository.JpaRepository;
import com.example.student.model.Student;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
<<<<<<< HEAD

=======
// import org.springframework.stereotype.Service;
>>>>>>> bfb8a8a1daee4847b7c62729d6eefd50f9058336


@Repository
public interface Repo extends MongoRepository<Student, String> {
}
