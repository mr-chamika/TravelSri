package com.example.student.services;

import com.example.student.model.Student;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public interface Services {

    public Student saveStudent(Student student);
    public List<Student> getAll();
}
