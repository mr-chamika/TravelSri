package com.example.student.controller;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin
@RequestMapping("/admin")
public class NotificationController {

    private SimpMessagingTemplate messagingTemplate;

    public NotificationController(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @PostMapping("/ban/{userId}")
    public String banUser(@PathVariable String userId) {
        // TODO: update DB user status -> banned = true

        // Send a real-time notification
        String message = "⚠️ Your account has been banned by the admin.";
        messagingTemplate.convertAndSendToUser(userId, "/queue/notifications", message);

        return "User " + userId + " banned and notified!";
    }
}
