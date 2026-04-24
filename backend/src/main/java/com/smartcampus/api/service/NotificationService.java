package com.smartcampus.api.service;

import com.smartcampus.api.dto.NotificationResponse;
import com.smartcampus.api.entity.Notification;
import com.smartcampus.api.entity.NotificationType;
import com.smartcampus.api.entity.User;
import com.smartcampus.api.repository.NotificationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class NotificationService {
    
    private final NotificationRepository notificationRepository;
    
    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }
    
    /**
     * Member 4 - Create notification
     * Called by other services (booking, ticket, comment) for events
     * CRITICAL: Booking/Ticket/Comment services depend on this
     */
    public Notification createNotification(User user, String title, String message, NotificationType type) {
        return createNotification(user, title, message, type, null);
    }
    
    /**
     * Create notification with related resource ID
     * Allows UI to navigate to the relevant resource
     */
    public Notification createNotification(User user, String title, String message, 
                                          NotificationType type, String relatedResourceId) {
        Notification notification = Notification.builder()
                .user(user)
                .title(title)
                .message(message)
                .type(type)
                .relatedResourceId(relatedResourceId)
                .read(false)
                .build();
        
        return notificationRepository.save(notification);
    }
    
    /**
     * Get unread notifications for user
     */
    public List<NotificationResponse> getUnreadNotifications(Long userId) {
        return notificationRepository.findByUserIdAndReadFalseOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::convertToNotificationResponse)
                .collect(Collectors.toList());
    }
    
    /**
     * Get all notifications for user (paginated)
     */
    public List<NotificationResponse> getUserNotifications(Long userId, int limit) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .limit(limit)
                .map(this::convertToNotificationResponse)
                .collect(Collectors.toList());
    }
    
    /**
     * Mark notification as read
     */
    public NotificationResponse markAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        
        notification.setRead(true);
        notification.setReadAt(LocalDateTime.now());
        Notification updated = notificationRepository.save(notification);
        
        return convertToNotificationResponse(updated);
    }
    
    /**
     * Mark all notifications as read for user
     */
    public void markAllAsRead(Long userId) {
        List<Notification> unreadNotifications = 
                notificationRepository.findByUserIdAndReadFalse(userId);
        
        LocalDateTime now = LocalDateTime.now();
        unreadNotifications.forEach(n -> {
            n.setRead(true);
            n.setReadAt(now);
        });
        
        notificationRepository.saveAll(unreadNotifications);
    }
    
    /**
     * Delete notification
     */
    public void deleteNotification(Long notificationId) {
        notificationRepository.deleteById(notificationId);
    }
    
    /**
     * Delete all notifications for user
     */
    public void deleteAllNotifications(Long userId) {
        List<Notification> notifications = notificationRepository.findByUserId(userId);
        notificationRepository.deleteAll(notifications);
    }
    
    /**
     * Get unread count for user
     */
    public long getUnreadCount(Long userId) {
        return notificationRepository.countByUserIdAndReadFalse(userId);
    }
    
    /**
     * Helper: Convert Notification entity to NotificationResponse DTO
     */
    private NotificationResponse convertToNotificationResponse(Notification notification) {
        return NotificationResponse.builder()
                .id(notification.getId())
                .title(notification.getTitle())
                .message(notification.getMessage())
                .type(notification.getType())
                .read(notification.getRead())
                .relatedResourceId(notification.getRelatedResourceId())
                .createdAt(notification.getCreatedAt())
                .readAt(notification.getReadAt())
                .build();
    }
}
