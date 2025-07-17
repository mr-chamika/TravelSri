package com.example.student.services;

import com.example.student.model.Student;
import com.example.student.repo.Repo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class ServiceImplementation implements Services {

    @Autowired
     Repo repo;

    @Override

    public Student saveStudent(Student student){

       return repo.save(student);

    }

    @Override
    public List<Student> getAll(){

        return repo.findAll();

    }

}
