package com.smartcampus.api.controller;

import com.smartcampus.api.entity.Notification;
import com.smartcampus.api.service.NotificationService;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/notifications")
@AllArgsConstructor
public class NotificationController {
    
    private final NotificationService notificationService;
    
    /**
     * GET /api/notifications?userId=1&page=0&size=10
     * Get all notifications for a user
     */
    @GetMapping
    public Page<Notification> getNotifications(
            @RequestParam Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return notificationService.getNotifications(userId, PageRequest.of(page, size));
    }
    
    /**
     * GET /api/notifications/unread?userId=1&page=0&size=10
     * Get unread notifications only
     */
    @GetMapping("/unread")
    public Page<Notification> getUnreadNotifications(
            @RequestParam Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return notificationService.getUnreadNotifications(userId, PageRequest.of(page, size));
    }
    
    /**
     * GET /api/notifications/unread-count?userId=1
     * Get count of unread notifications
     */
    @GetMapping("/unread-count")
    public Long getUnreadCount(@RequestParam Long userId) {
        return notificationService.getUnreadCount(userId);
    }
    
    /**
     * PATCH /api/notifications/{id}/read
     * Mark a notification as read
     */
    @PatchMapping("/{id}/read")
    public Notification markAsRead(@PathVariable Long id) {
        return notificationService.markAsRead(id);
    }
    
    /**
     * POST /api/notifications/mark-all-read?userId=1
     * Mark all notifications as read for a user
     */
    @PostMapping("/mark-all-read")
    public void markAllAsRead(@RequestParam Long userId) {
        notificationService.markAllAsRead(userId);
    }
    
    /**
     * DELETE /api/notifications/{id}
     * Delete a notification
     */
    @DeleteMapping("/{id}")
    public void deleteNotification(@PathVariable Long id) {
        notificationService.deleteNotification(id);
    }
}
