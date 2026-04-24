package com.smartcampus.api.service;

import com.smartcampus.api.entity.Notification;
import com.smartcampus.api.entity.NotificationType;
import com.smartcampus.api.entity.User;
import com.smartcampus.api.repository.NotificationRepository;
import com.smartcampus.api.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@AllArgsConstructor
@Transactional
public class NotificationService {
    
    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    
    /**
     * Get all notifications for a user (paginated)
     */
    public Page<Notification> getNotifications(Long userId, Pageable pageable) {
        return notificationRepository.findByUserId(userId, pageable);
    }
    
    /**
     * Get unread notifications only
     */
    public Page<Notification> getUnreadNotifications(Long userId, Pageable pageable) {
        return notificationRepository.findByUserIdAndReadFalse(userId, pageable);
    }
    
    /**
     * Create and send a notification to a user
     */
    public Notification createNotification(Long userId, String title, String message, 
                                          NotificationType type, String relatedResourceId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
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
     * Mark a notification as read
     */
    public Notification markAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
            .orElseThrow(() -> new RuntimeException("Notification not found"));
        
        notification.setRead(true);
        notification.setReadAt(LocalDateTime.now());
        return notificationRepository.save(notification);
    }
    
    /**
     * Mark all notifications as read for a user
     */
    public void markAllAsRead(Long userId) {
        Page<Notification> unreadNotifications = notificationRepository
            .findByUserIdAndReadFalse(userId, org.springframework.data.domain.Pageable.unpaged());
        
        unreadNotifications.forEach(notification -> {
            notification.setRead(true);
            notification.setReadAt(LocalDateTime.now());
        });
        
        notificationRepository.saveAll(unreadNotifications);
    }
    
    /**
     * Delete a notification
     */
    public void deleteNotification(Long notificationId) {
        notificationRepository.deleteById(notificationId);
    }
    
    /**
     * Get count of unread notifications
     */
    public Long getUnreadCount(Long userId) {
        Page<Notification> unreadNotifications = notificationRepository
            .findByUserIdAndReadFalse(userId, org.springframework.data.domain.Pageable.unpaged());
        return (long) unreadNotifications.getNumberOfElements();
    }
    
    /**
     * Send booking-related notification
     */
    public Notification sendBookingNotification(Long userId, String bookingStatus, String resourceName) {
        String title = "Booking " + bookingStatus;
        String message = "Your booking for " + resourceName + " has been " + bookingStatus.toLowerCase();
        NotificationType type = bookingStatus.equalsIgnoreCase("APPROVED") 
            ? NotificationType.BOOKING_APPROVED 
            : NotificationType.BOOKING_REJECTED;
        
        return createNotification(userId, title, message, type, null);
    }
    
    /**
     * Send ticket-related notification
     */
    public Notification sendTicketNotification(Long userId, String action, String ticketId) {
        String title = "Ticket " + action;
        String message = "Ticket #" + ticketId + " has been " + action.toLowerCase();
        NotificationType type = action.equalsIgnoreCase("CREATED") 
            ? NotificationType.TICKET_CREATED 
            : NotificationType.TICKET_RESOLVED;
        
        return createNotification(userId, title, message, type, ticketId);
    }
}
