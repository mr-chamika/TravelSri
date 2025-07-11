package com.example.student.controller;

import com.example.student.model.Traveler;
import com.example.student.repo.TravelerRepo;
import com.example.student.services.Emailtaken;
import com.example.student.services.JwtUtil;
import com.example.student.services.TravelerSignup;
import org.apache.coyote.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@CrossOrigin
@RequestMapping("/user")
public class TravelerController {

    @Autowired
    TravelerRepo repo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

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

    public ResponseEntity<?> login(@RequestBody Traveler traveler) {


       Optional<Traveler> exists = repo.findByEmail(traveler.getEmail());

       if(exists.isPresent()) {//user exists

           Traveler t = exists.get();

           if (passwordEncoder.matches(traveler.getPassword(),t.getPassword())) {

               UserDetails userDetails = new org.springframework.security.core.userdetails.User(
                       t.getUsername(),
                       t.getPassword(),
                       Collections.singletonList(new SimpleGrantedAuthority(t.getRole()))
               );

               String token = jwtUtil.generateToken(userDetails,t);

               Map<String, String> responseBody = new HashMap<>();
               responseBody.put("token", token);
               return ResponseEntity.ok(responseBody);

           }else {

               Map<String, String> errorBody = new HashMap<>();
               errorBody.put("error","wrong password");
               return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorBody);
           }

       }else{//user does not exist

           Map<String, String> errorBody = new HashMap<>();
           errorBody.put("error","invalid email");
           return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorBody);
       }



    }

    @Autowired
    private TravelerSignup travelerSignup;

    @PostMapping("/signup")

    public String signup(@RequestBody Traveler traveler) {



       Traveler x =  travelerSignup.registerNewUser(traveler);

       if(x.getEmail().equals(traveler.getEmail())) {

           return "Success";

       }

       return "Signup failed";
    }

    @Autowired
    private Emailtaken emailtaken;

    @GetMapping("/check-email")
    public ResponseEntity<String> checkEmailAvailability(@RequestParam String email) {
        if (emailtaken.isEmailRegistered(email)) {
            return ResponseEntity.ok("Exists");
        } else {
            return ResponseEntity.ok("Available");
        }
    }

}
