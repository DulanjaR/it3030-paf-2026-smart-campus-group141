package com.smartcampus.api.service;

import com.smartcampus.api.dto.RoleManagementRequest;
import com.smartcampus.api.dto.UserResponse;
import com.smartcampus.api.entity.User;
import com.smartcampus.api.entity.UserRole;
import com.smartcampus.api.repository.UserRepository;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class RoleManagementService {
    
    private final UserRepository userRepository;
    private final NotificationService notificationService;
    
    public RoleManagementService(UserRepository userRepository, NotificationService notificationService) {
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }
    
    /**
     * Member 4 - Change user role (Admin only)
     * This is critical for other modules - determines access to endpoints
     */
    @PreAuthorize("hasRole('ADMIN')")
    public UserResponse changeUserRole(RoleManagementRequest request, Long adminId) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new RuntimeException("Admin not found"));
        
        if (!admin.getRole().equals(UserRole.ADMIN)) {
            throw new RuntimeException("Only admins can change roles");
        }
        
        UserRole oldRole = user.getRole();
        user.setRole(request.getNewRole());
        User updated = userRepository.save(user);
        
        // Notify user of role change
        notificationService.createNotification(
                user,
                "Role Updated",
                "Your role has been changed from " + oldRole + " to " + request.getNewRole(),
                com.smartcampus.api.entity.NotificationType.ROLE_CHANGE
        );
        
        return convertToUserResponse(updated);
    }
    
    /**
     * Get all users (Admin only)
     */
    @PreAuthorize("hasRole('ADMIN')")
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::convertToUserResponse)
                .collect(Collectors.toList());
    }
    
    /**
     * Get users by role (Admin only)
     */
    @PreAuthorize("hasRole('ADMIN')")
    public List<UserResponse> getUsersByRole(UserRole role) {
        return userRepository.findByRole(role).stream()
                .map(this::convertToUserResponse)
                .collect(Collectors.toList());
    }
    
    /**
     * Activate/Deactivate user (Admin only)
     */
    @PreAuthorize("hasRole('ADMIN')")
    public UserResponse toggleUserStatus(Long userId, boolean active) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        user.setActive(active);
        User updated = userRepository.save(user);
        
        String status = active ? "activated" : "deactivated";
        notificationService.createNotification(
                user,
                "Account " + (active ? "Activated" : "Deactivated"),
                "Your account has been " + status,
                com.smartcampus.api.entity.NotificationType.SYSTEM
        );
        
        return convertToUserResponse(updated);
    }
    
    /**
     * Check if user has specific role (used by other services)
     */
    public boolean userHasRole(Long userId, UserRole role) {
        return userRepository.findById(userId)
                .map(user -> user.getRole().equals(role))
                .orElse(false);
    }
    
    /**
     * Check if user has any of the roles (used by other services)
     */
    public boolean userHasAnyRole(Long userId, UserRole... roles) {
        return userRepository.findById(userId)
                .map(user -> {
                    for (UserRole role : roles) {
                        if (user.getRole().equals(role)) {
                            return true;
                        }
                    }
                    return false;
                })
                .orElse(false);
    }
    
    /**
     * Helper: Convert User entity to UserResponse DTO
     */
    private UserResponse convertToUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .profilePictureUrl(user.getProfilePictureUrl())
                .role(user.getRole())
                .active(user.getActive())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }
}
