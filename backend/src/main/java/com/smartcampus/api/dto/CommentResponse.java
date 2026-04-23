package com.smartcampus.api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommentResponse {
    
    private Long id;
    private Long ticketId;
    private String content;
    private Long authorId;
    private String authorName;
    private String authorEmail;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
