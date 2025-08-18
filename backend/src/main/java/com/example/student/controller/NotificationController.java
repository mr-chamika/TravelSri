package com.example.student.controller;

import com.example.student.model.dto.Message;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class NotificationController {

    @MessageMapping("/toAll")
    @SendTo("/topic/messages")
    public String sendMessage(final Message message) throws Exception{
System.out.println("hello");
        return message.getText();

    }
}
