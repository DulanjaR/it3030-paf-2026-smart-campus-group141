package com.smartcampus.api.dto;

import com.smartcampus.api.entity.UserRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponse {
    private Long id;
    private String email;
    private String firstName;
    private String lastName;
    private String profilePictureUrl;
    private UserRole role;
    private Boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
