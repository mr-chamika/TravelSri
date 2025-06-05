package com.example.student.controller;

import java.util.List;

import com.example.student.repo.Repo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.student.model.Student;


@RestController
@CrossOrigin //to communicate between frontend and backend
@RequestMapping("/student")
public class Controller {
@Autowired
Repo repo;

    @PostMapping("/add")

    public String saveStudent (@RequestBody Student student) {

        repo.save(student);
        return "Success";

    }

    @GetMapping("/getAll")

    public List<Student> getAll() {

        return repo.findAll();

    }

}
