package com.smartcampus.api.dto;

import com.smartcampus.api.entity.TicketStatus;
import com.smartcampus.api.entity.TicketPriority;
import com.smartcampus.api.entity.TicketCategory;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TicketResponse {
    
    private Long id;
    private String title;
    private String description;
    private Long creatorId;
    private String creatorName;
    private String creatorEmail;
    private TicketStatus status;
    private TicketPriority priority;
    private TicketCategory category;
    private String assignedTo;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime resolvedAt;
    private int commentCount;
    private int attachmentCount;
}
