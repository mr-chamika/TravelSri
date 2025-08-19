package com.example.student.controller;

import com.example.student.model.Notification;
import com.example.student.model.dto.Message;
import com.example.student.repo.NotificationRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.stereotype.Controller;

import java.security.Principal;

@Controller
public class NotificationController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private NotificationRepo notificationRepo;

    public NotificationController(SimpMessagingTemplate simpMessagingTemplate) {
        this.messagingTemplate = simpMessagingTemplate;
    }

    @MessageMapping("/toAll")
    @SendTo("/topic/messages")
    public String sendMessage(final Message message) throws Exception{

        Notification notification = new Notification();

        notification.setMessage(message.getText());
        notification.setRecipientId(message.getTo());
        notification.setType("public");

        notificationRepo.save(notification);

        return message.getText();

    }

    @MessageMapping("/private")
    public void sendToUser(@Payload Message message, Principal principal){

        if(principal == null){

            System.out.println("Authentication error from NotificationController");

        }
        messagingTemplate.convertAndSendToUser(message.getTo(),"/queue/notifications",message.getText());

    }
}
