package com.example.student.services;

import com.example.student.model.Hotel;
import com.example.student.model.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class JwtUtil {

    @Value("${JWT_SECRET}")
    private String SECRET_KEY;

    @Value("${jwt.expiration.ms:86400000}")
    private long jwtExpirationMs;

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser().setSigningKey(SECRET_KEY).parseClaimsJws(token).getBody();
    }

    private Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    /**
     * Generate token for regular users
     */
    public String generateToken(UserDetails userDetails, User user) {
        Map<String, Object> claims = new HashMap<>();

        // Add roles from UserDetails
        List<String> roles = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());
        claims.put("roles", roles);
        claims.put("email", user.getEmail());
        claims.put("id", user.get_id());
        claims.put("type", "user");

        return buildToken(claims, userDetails.getUsername());
    }

    /**
     * Generate token for hotel users
     */
    public String generateHotelToken(UserDetails userDetails, Hotel hotel) {
        Map<String, Object> claims = new HashMap<>();

        // Add roles from UserDetails
        List<String> roles = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());
        claims.put("roles", roles);
        claims.put("email", hotel.getEmail());
        
        // Store both ID formats for compatibility
        claims.put("id", hotel.get_id()); // Without underscore for frontend
        claims.put("_id", hotel.get_id()); // With underscore for MongoDB format
        
        claims.put("hotelName", hotel.getHotelName());
        claims.put("type", "hotel");

        return buildToken(claims, userDetails.getUsername());
    }

    /**
     * Common method to build the JWT token
     */
    private String buildToken(Map<String, Object> claims, String subject) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpirationMs))
                .signWith(SignatureAlgorithm.HS256, SECRET_KEY)
                .compact();
    }

    /**
     * Validate the token against user details
     */
    public Boolean validateToken(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }
    
    /**
     * Extract user type from token
     */
    public String extractUserType(String token) {
        return extractClaim(token, claims -> claims.get("type", String.class));
    }
}