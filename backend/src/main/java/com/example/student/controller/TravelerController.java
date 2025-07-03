package com.example.student.controller;

import com.example.student.model.Traveler;
import com.example.student.repo.TravelerRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@CrossOrigin
@RequestMapping("/traveler")
public class TravelerController {

    @Autowired
    TravelerRepo repo;

    @PostMapping("/login")

//    public boolean login (@RequestBody Traveler traveler) {
//
//        if(traveler.getEmail() != null){
//
//            repo.save(traveler);
//            return true;
//
//        }
//            return false;
//    }

    public String login(@RequestBody Traveler traveler) {


       Optional<Traveler> exists = repo.findByEmail(traveler.getEmail());

       if(exists.isPresent()) {//user exists

           Traveler t = exists.get();

           if (t.getPassword().equals(traveler.getPassword())) {
               return "true";
           }else {
               return "wrong password";//password not match
           }

       }else{//user does not exist

           return "invalid email";
       }



    }

}
