package com.example.student.services;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Component;
import java.util.List;

@Component
public class AuthChannelInterceptor implements ChannelInterceptor {

    @Value("${JWT_SECRET}")
    private String jwtSecret;

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

        if (accessor != null && StompCommand.CONNECT.equals(accessor.getCommand())) {
            List<String> authorization = accessor.getNativeHeader("Authorization");

            if (authorization != null && !authorization.isEmpty()) {
                String jwt = authorization.get(0).substring(7);

                try {
                    Claims claims = Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(jwt).getBody();
                    String userId = claims.get("id", String.class);

                    if (userId != null) {
                        UsernamePasswordAuthenticationToken user = new UsernamePasswordAuthenticationToken(userId, null, null);
                        accessor.setUser(user);
                        System.out.println("Interceptor successfully authenticated user: " + userId);
                    }
                } catch (Exception e) {
                    System.err.println("Interceptor JWT Error: " + e.getMessage());
                }
            }
        }
        return message;
    }
}
