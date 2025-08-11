package com.example.student.controller;

import com.example.student.model.User;
import com.example.student.model.dto.Resetpwdto;
import com.example.student.repo.UserRepo;
import com.example.student.services.Emailtaken;
import com.example.student.services.JwtUtil;
import com.example.student.services.UserSignup;
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
public class UserController {

    @Autowired
    UserRepo repo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private UserRepo userRepo;

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

    public ResponseEntity<?> login(@RequestBody User user) {


       Optional<User> exists = repo.findByEmail(user.getEmail());

       if(exists.isPresent()) {//user exists

           User t = exists.get();

           if (passwordEncoder.matches(user.getPassword(),t.getPassword())) {

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
    private UserSignup userSignup;

    @PostMapping("/signup")

    public String signup(@RequestBody User user) {

    Optional<User> exists = repo.findByEmail(user.getEmail());

    if(!exists.isPresent()) {

        User x =  userSignup.registerNewUser(user);

        if(x.getEmail().equals(user.getEmail())) {

            return "Success";

        }

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

    @Autowired
    private UserRepo userReporepo;

    @GetMapping("/profile")

    public ResponseEntity<Map<String, User>> proPic(@RequestParam String email) {

        Optional<User> x = userRepo.pfindByEmail(email);

        Map<String, User> j = new HashMap<>();
        j.put("user", x.get());

        return ResponseEntity.ok(j);

    }

    @Autowired
    private UserRepo repo1;

    @PostMapping("/reset-password")

    public String resetPassword(@RequestBody Resetpwdto user) {

        Optional<User> y = repo1.findByEmail(user.getEmail());

        String newPassword = passwordEncoder.encode(user.getPassword());

        if(y.isPresent()) {

            y.get().setPassword(newPassword);
            repo1.save(y.get());

            return "Success";
        }

        return "Password change failed";
    }

}
