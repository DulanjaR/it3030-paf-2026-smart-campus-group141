package com.smartcampus.api.dto;

import com.smartcampus.api.entity.NotificationType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationResponse {
    private Long id;
    private String title;
    private String message;
    private NotificationType type;
    private Boolean read;
    private String relatedResourceId;
    private LocalDateTime createdAt;
    private LocalDateTime readAt;
}
