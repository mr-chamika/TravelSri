package com.example.student.services;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.*;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic", "/queue"); // For notifications topic for public notifies and queue for private notifies
        config.setApplicationDestinationPrefixes("/app"); // for frontend notifies
        config.setUserDestinationPrefix("/user"); // Enables /user/{id}/queue  // for backend notifies
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws") // ws://localhost:8080/ws
                .setAllowedOriginPatterns("*")
                .withSockJS();
    }
}
