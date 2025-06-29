package com.example.student.dto;

public class AuthResponse {
    private String message;
    private String token;
    private UserInfo userInfo;

    public AuthResponse(String message, String token) {
        this.message = message;
        this.token = token;
    }

    public AuthResponse(String message, String token, UserInfo userInfo) {
        this.message = message;
        this.token = token;
        this.userInfo = userInfo;
    }

    // getters and setters
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    public UserInfo getUserInfo() { return userInfo; }
    public void setUserInfo(UserInfo userInfo) { this.userInfo = userInfo; }

    public static class UserInfo {
        private String id;
        private String name;
        private String email;
        private String role;
        private String phone;

        public UserInfo(String id, String name, String email, String role, String phone) {
            this.id = id;
            this.name = name;
            this.email = email;
            this.role = role;
            this.phone = phone;
        }

        public String getId() { return id; }
        public String getName() { return name; }
        public String getEmail() { return email; }
        public String getRole() { return role; }
        public String getPhone() { return phone; }
    }
}