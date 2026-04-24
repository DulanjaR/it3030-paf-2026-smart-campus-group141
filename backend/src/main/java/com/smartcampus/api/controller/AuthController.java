package com.smartcampus.api.controller;

import com.smartcampus.api.dto.LoginRequest;
import com.smartcampus.api.dto.LoginResponse;
import com.smartcampus.api.dto.UserResponse;
import com.smartcampus.api.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Member 4 - Authentication Controller
 * Handles OAuth 2.0 login, user profile management
 * 
 * Endpoints:
 * - POST /api/auth/login (OAuth Google login)
 * - GET /api/auth/profile/{userId}
 * - PUT /api/auth/profile/{userId}
 * - POST /api/auth/logout
 * 
 * Other modules depend on: User creation, role assignment
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    
    private final AuthService authService;
    
    public AuthController(AuthService authService) {
        this.authService = authService;
    }
    
    /**
     * POST /api/auth/login
     * OAuth 2.0 Google login
     * Used by: Frontend login page, required for all other operations
     * 
     * @param request LoginRequest with googleToken
     * @return LoginResponse with JWT token and user info
     */
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        LoginResponse response = authService.loginWithGoogle(request);
        return ResponseEntity.ok(response);
    }
    
    /**
     * GET /api/auth/profile/{userId}
     * Get current user profile
     * HTTP Method: GET (Read-only)
     * 
     * @param userId User ID
     * @return UserResponse
     */
    @GetMapping("/profile/{userId}")
    public ResponseEntity<UserResponse> getUserProfile(@PathVariable Long userId) {
        UserResponse response = authService.getCurrentUser(userId);
        return ResponseEntity.ok(response);
    }
    
    /**
     * PUT /api/auth/profile/{userId}
     * Update user profile
     * HTTP Method: PUT (Update)
     * 
     * @param userId User ID
     * @param firstName First name
     * @param lastName Last name
     * @return Updated UserResponse
     */
    @PutMapping("/profile/{userId}")
    public ResponseEntity<UserResponse> updateProfile(
            @PathVariable Long userId,
            @RequestParam(required = false) String firstName,
            @RequestParam(required = false) String lastName) {
        UserResponse response = authService.updateUserProfile(userId, firstName, lastName);
        return ResponseEntity.ok(response);
    }
    
    /**
     * POST /api/auth/logout
     * Logout user
     * HTTP Method: POST (Action)
     * 
     * @param userId User ID
     * @return Success message
     */
    @PostMapping("/logout")
    public ResponseEntity<String> logout(@RequestParam Long userId) {
        String message = authService.logout(userId);
        return ResponseEntity.ok(message);
    }
    
    /**
     * GET /api/auth/verify/{userId}
     * Verify user is authenticated
     * HTTP Method: GET (Read-only)
     * 
     * @param userId User ID
     * @return User verification status
     */
    @GetMapping("/verify/{userId}")
    public ResponseEntity<Boolean> verifyUser(@PathVariable Long userId) {
        try {
            authService.getCurrentUser(userId);
            return ResponseEntity.ok(true);
        } catch (Exception e) {
            return ResponseEntity.ok(false);
        }
    }
}
