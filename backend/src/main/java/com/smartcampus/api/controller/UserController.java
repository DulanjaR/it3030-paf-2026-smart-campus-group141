package com.smartcampus.api.controller;

import com.smartcampus.api.entity.User;
import com.smartcampus.api.entity.UserRole;
import com.smartcampus.api.service.UserService;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/users")
@AllArgsConstructor
public class UserController {
    
    private final UserService userService;
    
    /**
     * POST /api/users/register
     * Register a new user with email and password
     */
    @PostMapping("/register")
    public Map<String, Object> register(@RequestBody RegisterRequest request) {
        User user = userService.registerUser(
            request.getEmail(),
            request.getFirstName(),
            request.getLastName(),
            request.getPassword()
        );
        
        return createLoginResponse(user, "User registered successfully");
    }
    
    /**
     * POST /api/users/login
     * Login with email and password
     */
    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody LoginRequest request) {
        User user = userService.loginUser(request.getEmail(), request.getPassword());
        return createLoginResponse(user, "Login successful");
    }
    
    /**
     * GET /api/users/{id}
     * Get user profile
     */
    @GetMapping("/{id}")
    public User getProfile(@PathVariable Long id) {
        return userService.findById(id);
    }
    
    /**
     * PUT /api/users/{id}
     * Update user profile
     */
    @PutMapping("/{id}")
    public User updateProfile(@PathVariable Long id, @RequestBody UpdateProfileRequest request) {
        User user = userService.findById(id);
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setProfilePictureUrl(request.getProfilePictureUrl());
        return userService.findById(id); // Save happens in service
    }
    
    /**
     * PATCH /api/users/{id}/role
     * Update user role (admin only)
     */
    @PatchMapping("/{id}/role")
    public User updateUserRole(
            @PathVariable Long id,
            @RequestBody RoleUpdateRequest request
    ) {
        return userService.updateUserRole(id, request.getRole());
    }
    
    /**
     * POST /api/users/{id}/deactivate
     * Deactivate a user (admin only)
     */
    @PostMapping("/{id}/deactivate")
    public Map<String, String> deactivateUser(@PathVariable Long id) {
        userService.deactivateUser(id);
        return Map.of("message", "User deactivated successfully");
    }
    
    /**
     * POST /api/users/{id}/activate
     * Activate a user (admin only)
     */
    @PostMapping("/{id}/activate")
    public Map<String, String> activateUser(@PathVariable Long id) {
        userService.activateUser(id);
        return Map.of("message", "User activated successfully");
    }
    
    // Helper method to create login response
    private Map<String, Object> createLoginResponse(User user, String message) {
        Map<String, Object> response = new HashMap<>();
        response.put("message", message);
        
        Map<String, Object> userMap = new HashMap<>();
        userMap.put("id", user.getId());
        userMap.put("email", user.getEmail());
        userMap.put("firstName", user.getFirstName());
        userMap.put("lastName", user.getLastName());
        userMap.put("role", user.getRole());
        userMap.put("profilePictureUrl", user.getProfilePictureUrl());
        
        response.put("user", userMap);
        response.put("token", "local-token-" + user.getId());
        return response;
    }
    
    // DTOs
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RegisterRequest {
        private String email;
        private String firstName;
        private String lastName;
        private String password;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LoginRequest {
        private String email;
        private String password;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UpdateProfileRequest {
        private String firstName;
        private String lastName;
        private String profilePictureUrl;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RoleUpdateRequest {
        private UserRole role;
    }
}
