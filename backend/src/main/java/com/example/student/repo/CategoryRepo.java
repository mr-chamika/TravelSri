package com.example.student.repo;

import com.example.student.model.Category;
import com.example.student.model.dto.Categorydto;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryRepo extends MongoRepository<Category,String> {

    @Query(

            value = "{}",
            fields = "{'_id': 1,'title': 1}"

    )
    List<Categorydto> pfindAll();

}
