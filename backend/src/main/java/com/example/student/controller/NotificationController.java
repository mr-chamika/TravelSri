package com.example.student.controller;

import com.example.student.model.Notification;
import com.example.student.repo.NotificationRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/notification")
public class NotificationController {

    @Autowired
    private NotificationRepo notificationRepo;

    @GetMapping("/get")
    public List<Notification> getNotification(@RequestParam String id,@RequestParam String role) {

       return notificationRepo.findNotifications(id,role);

    }

}
