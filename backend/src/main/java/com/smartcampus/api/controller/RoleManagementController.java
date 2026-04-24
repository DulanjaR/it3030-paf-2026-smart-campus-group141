package com.smartcampus.api.controller;

import com.smartcampus.api.dto.RoleManagementRequest;
import com.smartcampus.api.dto.UserResponse;
import com.smartcampus.api.entity.UserRole;
import com.smartcampus.api.service.RoleManagementService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/**
 * Member 4 - Role Management Controller
 * Handles role assignment, user management for admins
 * 
 * Endpoints:
 * - POST /api/roles/change (Change user role)
 * - GET /api/roles/users (Get all users)
 * - GET /api/roles/users/by-role/{role}
 * - PUT /api/roles/users/{userId}/status (Toggle user status)
 * 
 * Admin only endpoints
 */
@RestController
@RequestMapping("/api/roles")
public class RoleManagementController {
    
    private final RoleManagementService roleManagementService;
    
    public RoleManagementController(RoleManagementService roleManagementService) {
        this.roleManagementService = roleManagementService;
    }
    
    /**
     * POST /api/roles/change
     * Change user role (Admin only)
     * HTTP Method: POST (Action)
     * Required by: Admin dashboard for role management
     * 
     * @param request RoleManagementRequest
     * @param adminId Admin user ID
     * @return Updated UserResponse
     */
    @PostMapping("/change")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponse> changeUserRole(
            @Valid @RequestBody RoleManagementRequest request,
            @RequestParam Long adminId) {
        UserResponse response = roleManagementService.changeUserRole(request, adminId);
        return ResponseEntity.ok(response);
    }
    
    /**
     * GET /api/roles/users
     * Get all users (Admin only)
     * HTTP Method: GET (Read-only)
     * 
     * @return List of UserResponse
     */
    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        List<UserResponse> users = roleManagementService.getAllUsers();
        return ResponseEntity.ok(users);
    }
    
    /**
     * GET /api/roles/users/by-role/{role}
     * Get users by specific role (Admin only)
     * HTTP Method: GET (Read-only)
     * 
     * @param role UserRole
     * @return List of UserResponse with that role
     */
    @GetMapping("/users/by-role/{role}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserResponse>> getUsersByRole(@PathVariable UserRole role) {
        List<UserResponse> users = roleManagementService.getUsersByRole(role);
        return ResponseEntity.ok(users);
    }
    
    /**
     * PUT /api/roles/users/{userId}/status
     * Toggle user active/inactive status (Admin only)
     * HTTP Method: PUT (Update)
     * 
     * @param userId User ID
     * @param active Boolean - true to activate, false to deactivate
     * @return Updated UserResponse
     */
    @PutMapping("/users/{userId}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponse> toggleUserStatus(
            @PathVariable Long userId,
            @RequestParam boolean active) {
        UserResponse response = roleManagementService.toggleUserStatus(userId, active);
        return ResponseEntity.ok(response);
    }
}
