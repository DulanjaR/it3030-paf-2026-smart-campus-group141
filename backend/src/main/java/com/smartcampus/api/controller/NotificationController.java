package com.smartcampus.api.controller;

import com.smartcampus.api.dto.NotificationResponse;
import com.smartcampus.api.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.HashMap;
import java.util.Map;

/**
 * Member 4 - Notification Controller
 * Handles notification retrieval, marking as read, deletion
 * 
 * Endpoints:
 * - GET /api/notifications/{userId} (Get all notifications)
 * - GET /api/notifications/{userId}/unread (Get unread notifications)
 * - GET /api/notifications/{userId}/count (Get unread count)
 * - PUT /api/notifications/{notificationId}/read (Mark as read)
 * - PUT /api/notifications/{userId}/read-all (Mark all as read)
 * - DELETE /api/notifications/{notificationId} (Delete notification)
 * - DELETE /api/notifications/{userId}/all (Delete all notifications)
 * 
 * Called by: Frontend notification panel, booking/ticket services
 */
@RestController
@RequestMapping("/api/notifications")
public class NotificationController {
    
    private final NotificationService notificationService;
    
    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }
    
    /**
     * GET /api/notifications/{userId}
     * Get all notifications for user (limited to latest 50)
     * HTTP Method: GET (Read-only)
     * 
     * @param userId User ID
     * @param limit Number of notifications to retrieve (default 50)
     * @return List of NotificationResponse
     */
    @GetMapping("/{userId}")
    public ResponseEntity<List<NotificationResponse>> getUserNotifications(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "50") int limit) {
        List<NotificationResponse> notifications = notificationService.getUserNotifications(userId, limit);
        return ResponseEntity.ok(notifications);
    }
    
    /**
     * GET /api/notifications/{userId}/unread
     * Get unread notifications for user
     * HTTP Method: GET (Read-only)
     * Required by: Frontend to show unread badge, auto-refresh
     * 
     * @param userId User ID
     * @return List of unread NotificationResponse
     */
    @GetMapping("/{userId}/unread")
    public ResponseEntity<List<NotificationResponse>> getUnreadNotifications(@PathVariable Long userId) {
        List<NotificationResponse> unreadNotifications = notificationService.getUnreadNotifications(userId);
        return ResponseEntity.ok(unreadNotifications);
    }
    
    /**
     * GET /api/notifications/{userId}/count
     * Get count of unread notifications
     * HTTP Method: GET (Read-only)
     * 
     * @param userId User ID
     * @return Map with unread count
     */
    @GetMapping("/{userId}/count")
    public ResponseEntity<Map<String, Long>> getUnreadCount(@PathVariable Long userId) {
        long count = notificationService.getUnreadCount(userId);
        Map<String, Long> response = new HashMap<>();
        response.put("unreadCount", count);
        return ResponseEntity.ok(response);
    }
    
    /**
     * PUT /api/notifications/{notificationId}/read
     * Mark a specific notification as read
     * HTTP Method: PUT (Update)
     * 
     * @param notificationId Notification ID
     * @return Updated NotificationResponse
     */
    @PutMapping("/{notificationId}/read")
    public ResponseEntity<NotificationResponse> markAsRead(@PathVariable Long notificationId) {
        NotificationResponse response = notificationService.markAsRead(notificationId);
        return ResponseEntity.ok(response);
    }
    
    /**
     * PUT /api/notifications/{userId}/read-all
     * Mark all notifications as read for user
     * HTTP Method: PUT (Update)
     * 
     * @param userId User ID
     * @return Success message
     */
    @PutMapping("/{userId}/read-all")
    public ResponseEntity<Map<String, String>> markAllAsRead(@PathVariable Long userId) {
        notificationService.markAllAsRead(userId);
        Map<String, String> response = new HashMap<>();
        response.put("message", "All notifications marked as read");
        return ResponseEntity.ok(response);
    }
    
    /**
     * DELETE /api/notifications/{notificationId}
     * Delete a specific notification
     * HTTP Method: DELETE (Delete)
     * 
     * @param notificationId Notification ID
     * @return Success message
     */
    @DeleteMapping("/{notificationId}")
    public ResponseEntity<Map<String, String>> deleteNotification(@PathVariable Long notificationId) {
        notificationService.deleteNotification(notificationId);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Notification deleted successfully");
        return ResponseEntity.ok(response);
    }
    
    /**
     * DELETE /api/notifications/{userId}/all
     * Delete all notifications for user
     * HTTP Method: DELETE (Delete)
     * 
     * @param userId User ID
     * @return Success message
     */
    @DeleteMapping("/{userId}/all")
    public ResponseEntity<Map<String, String>> deleteAllNotifications(@PathVariable Long userId) {
        notificationService.deleteAllNotifications(userId);
        Map<String, String> response = new HashMap<>();
        response.put("message", "All notifications deleted successfully");
        return ResponseEntity.ok(response);
    }
}
